import { describe, it, expect } from "vitest";
import {
  assignRoleSchema,
  policyApprovalSchema,
  verifySourceSchema,
} from "../admin.schema";

describe("Administrative RBAC & Policy Verification Tests", () => {
  it("should validate assigning all 6 system roles", () => {
    const roles = [
      "STUDENT",
      "SUPER_ADMIN",
      "DATA_MANAGER",
      "VERIFICATION_MANAGER",
      "SUPPORT_ADMIN",
      "CONTENT_MANAGER",
    ] as const;

    roles.forEach((role) => {
      const result = assignRoleSchema.safeParse({
        targetUserId: "123e4567-e89b-12d3-a456-426614174000",
        role,
        permissions: ["MANAGE_VISAS", "REVIEW_DOCUMENTS"],
      });
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid non-existent roles", () => {
    const result = assignRoleSchema.safeParse({
      targetUserId: "123e4567-e89b-12d3-a456-426614174000",
      role: "UNKNOWN_ROLE" as any,
    });
    expect(result.success).toBe(false);
  });

  it("should validate policy approval with mandatory decision comment", () => {
    const validApproval = {
      versionId: "123e4567-e89b-12d3-a456-426614174000",
      approvalStatus: "APPROVED" as const,
      decisionComment: "হোম অফিসের অফিসিয়াল সার্কুলার অনুযায়ী ব্যাংক ব্যালান্স রেট যাচাই করে অনুমোদন করা হলো।",
    };

    const result = policyApprovalSchema.safeParse(validApproval);
    expect(result.success).toBe(true);
  });

  it("should reject policy approval with too short decision comment", () => {
    const invalidApproval = {
      versionId: "123e4567-e89b-12d3-a456-426614174000",
      approvalStatus: "APPROVED" as const,
      decisionComment: "ok", // Less than 5 characters
    };

    const result = policyApprovalSchema.safeParse(invalidApproval);
    expect(result.success).toBe(false);
  });

  it("should validate official source verification methods", () => {
    const validVerification = {
      sourceId: "123e4567-e89b-12d3-a456-426614174000",
      verificationMethod: "OFFICIAL_PORTAL_CROSSCHECK" as const,
      verificationNotes: "UKVI official web page checked on 19 Nov 2026.",
    };

    const result = verifySourceSchema.safeParse(validVerification);
    expect(result.success).toBe(true);
  });
});
