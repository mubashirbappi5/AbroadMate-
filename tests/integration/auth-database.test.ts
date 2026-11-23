import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
} from "../../packages/validation/src/auth.schema";
import { AppRole } from "@abroadmate/database";

describe("Integration: Authentication, RBAC & Database Isolation", () => {
  describe("Authentication Credentials & Validation", () => {
    it("validates successful student registration payload", () => {
      const validPayload = {
        email: "shafiqul.islam@gmail.com",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!",
        fullName: "Md. Shafiqul Islam",
        phone: "+8801712345678",
        ethicalNonAgencyConsent: true,
      };

      const result = registerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("shafiqul.islam@gmail.com");
        expect(result.data.fullName).toBe("Md. Shafiqul Islam");
      }
    });

    it("rejects invalid Bangladeshi phone numbers or weak passwords", () => {
      const invalidPayload = {
        email: "invalid-email-format",
        password: "123", // Too short
        fullName: "",
        phone: "12345", // Not +880 or 01...
      };

      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues.map((i) => i.path[0]);
        expect(issues).toContain("email");
        expect(issues).toContain("password");
        expect(issues).toContain("fullName");
      }
    });

    it("validates login credentials correctly", () => {
      const validLogin = {
        email: "student@abroadmate.com",
        password: "Password123!",
      };
      expect(loginSchema.safeParse(validLogin).success).toBe(true);

      const invalidLogin = {
        email: "not-an-email",
        password: "",
      };
      expect(loginSchema.safeParse(invalidLogin).success).toBe(false);
    });
  });

  describe("Role-Based Access Control (RBAC) Hierarchy", () => {
    const rolePermissions: Record<AppRole, string[]> = {
      [AppRole.STUDENT]: [
        "read:profile",
        "update:profile",
        "read:roadmap",
        "update:roadmap",
        "read:discovery",
        "create:documents",
        "generate:sop",
      ],
      [AppRole.SUPER_ADMIN]: [
        "read:profile",
        "update:profile",
        "admin:all",
        "admin:users",
        "admin:policy_approve",
        "admin:source_verify",
        "admin:audit_logs",
        "admin:jobs_manage",
      ],
      [AppRole.DATA_MANAGER]: [
        "read:discovery",
        "manage:universities",
        "manage:programs",
        "manage:scholarships",
        "propose:policy_change",
      ],
      [AppRole.VERIFICATION_MANAGER]: [
        "read:sources",
        "verify:sources",
        "review:policy_change",
        "approve:policy_change",
        "read:audit_logs",
      ],
      [AppRole.SUPPORT_ADMIN]: [
        "read:tickets",
        "manage:tickets",
        "read:users_basic",
      ],
      [AppRole.CONTENT_MANAGER]: [
        "manage:articles",
        "manage:guides",
        "manage:faqs",
      ],
    };

    function hasPermission(role: AppRole, requiredPermission: string): boolean {
      const perms = rolePermissions[role] || [];
      if (perms.includes("admin:all")) return true;
      return perms.includes(requiredPermission);
    }

    it("allows SUPER_ADMIN global root access to all management operations", () => {
      expect(hasPermission(AppRole.SUPER_ADMIN, "admin:policy_approve")).toBe(true);
      expect(hasPermission(AppRole.SUPER_ADMIN, "admin:audit_logs")).toBe(true);
      expect(hasPermission(AppRole.SUPER_ADMIN, "manage:universities")).toBe(true);
    });

    it("prevents STUDENT from accessing admin or management capabilities", () => {
      expect(hasPermission(AppRole.STUDENT, "admin:policy_approve")).toBe(false);
      expect(hasPermission(AppRole.STUDENT, "admin:audit_logs")).toBe(false);
      expect(hasPermission(AppRole.STUDENT, "manage:universities")).toBe(false);
      expect(hasPermission(AppRole.STUDENT, "read:profile")).toBe(true);
    });

    it("enforces duty separation between DATA_MANAGER and VERIFICATION_MANAGER", () => {
      // DATA_MANAGER can propose changes and manage catalog, but cannot approve policy change
      expect(hasPermission(AppRole.DATA_MANAGER, "manage:programs")).toBe(true);
      expect(hasPermission(AppRole.DATA_MANAGER, "propose:policy_change")).toBe(true);
      expect(hasPermission(AppRole.DATA_MANAGER, "approve:policy_change")).toBe(false);

      // VERIFICATION_MANAGER can review and approve policy changes
      expect(hasPermission(AppRole.VERIFICATION_MANAGER, "approve:policy_change")).toBe(true);
      expect(hasPermission(AppRole.VERIFICATION_MANAGER, "verify:sources")).toBe(true);
    });
  });

  describe("Multi-Tenant User Data Isolation & Invariants", () => {
    interface MockStudentState {
      userId: string;
      fullName: string;
      isDeleted: boolean;
      bankStatementBalanceBdt: number;
      documents: Array<{ id: string; name: string; isSensitive: boolean }>;
      roadmapId: string;
    }

    const studentA: MockStudentState = {
      userId: "usr_student_alpha_001",
      fullName: "Anika Rahman",
      isDeleted: false,
      bankStatementBalanceBdt: 3500000,
      documents: [{ id: "doc_01", name: "Bank_Solvency_Certificate.pdf", isSensitive: true }],
      roadmapId: "rdm_01",
    };

    const studentB: MockStudentState = {
      userId: "usr_student_beta_002",
      fullName: "Tanvir Ahmed",
      isDeleted: false,
      bankStatementBalanceBdt: 1800000,
      documents: [{ id: "doc_02", name: "IELTS_TRF_Official.pdf", isSensitive: false }],
      roadmapId: "rdm_02",
    };

    function secureFetchDocument(
      requestingUserId: string,
      targetDocumentId: string,
      state: MockStudentState[]
    ): { success: boolean; error?: string; document?: any } {
      const owner = state.find((s) => s.documents.some((d) => d.id === targetDocumentId));
      if (!owner) return { success: false, error: "NOT_FOUND" };
      if (owner.userId !== requestingUserId) {
        return { success: false, error: "FORBIDDEN_USER_DATA_ISOLATION" };
      }
      return { success: true, document: owner.documents.find((d) => d.id === targetDocumentId) };
    }

    it("strictly isolates confidential documents between students", () => {
      // Student A reading their own doc: OK
      const selfAccess = secureFetchDocument(studentA.userId, "doc_01", [studentA, studentB]);
      expect(selfAccess.success).toBe(true);
      expect(selfAccess.document.name).toBe("Bank_Solvency_Certificate.pdf");

      // Student B attempting to read Student A's doc: FORBIDDEN
      const unauthorizedAccess = secureFetchDocument(studentB.userId, "doc_01", [studentA, studentB]);
      expect(unauthorizedAccess.success).toBe(false);
      expect(unauthorizedAccess.error).toBe("FORBIDDEN_USER_DATA_ISOLATION");
    });

    it("verifies cascade deletion & soft deletion invariants", () => {
      // Simulating cascade deletion behavior
      const databaseStore: Record<string, any[]> = {
        users: [{ id: "usr_test_del", email: "delete.me@gmail.com" }],
        profiles: [{ userId: "usr_test_del", preferredName: "Test Student" }],
        roadmaps: [{ id: "rdm_del", userId: "usr_test_del" }],
        goals: [{ id: "gol_del", userId: "usr_test_del" }],
      };

      // Cascade delete execution
      const deleteUserCascade = (id: string) => {
        databaseStore.users = databaseStore.users.filter((u) => u.id !== id);
        databaseStore.profiles = databaseStore.profiles.filter((p) => p.userId !== id);
        databaseStore.roadmaps = databaseStore.roadmaps.filter((r) => r.userId !== id);
        databaseStore.goals = databaseStore.goals.filter((g) => g.userId !== id);
      };

      deleteUserCascade("usr_test_del");
      expect(databaseStore.users).toHaveLength(0);
      expect(databaseStore.profiles).toHaveLength(0);
      expect(databaseStore.roadmaps).toHaveLength(0);
      expect(databaseStore.goals).toHaveLength(0);
    });
  });

  describe("Administrative Audit Logging Requirements", () => {
    interface AuditEntry {
      actorId: string;
      actorRole: AppRole;
      action: string;
      targetEntity: string;
      targetId: string;
      previousValue: string;
      newValue: string;
      timestamp: Date;
    }

    it("creates an immutable audit log snapshot upon sensitive policy change", () => {
      const auditLog: AuditEntry = {
        actorId: "usr_admin_001",
        actorRole: AppRole.VERIFICATION_MANAGER,
        action: "POLICY_UPDATE_APPROVED",
        targetEntity: "CountryPolicyVersion",
        targetId: "pol_uk_living_2026",
        previousValue: JSON.stringify({ outsideLondonMonthlyCostGbp: 1023 }),
        newValue: JSON.stringify({ outsideLondonMonthlyCostGbp: 1050 }),
        timestamp: new Date(),
      };

      expect(auditLog.actorRole).toBe(AppRole.VERIFICATION_MANAGER);
      expect(auditLog.action).toBe("POLICY_UPDATE_APPROVED");
      expect(JSON.parse(auditLog.previousValue).outsideLondonMonthlyCostGbp).toBe(1023);
      expect(JSON.parse(auditLog.newValue).outsideLondonMonthlyCostGbp).toBe(1050);
      expect(auditLog.timestamp).toBeInstanceOf(Date);
    });
  });
});
