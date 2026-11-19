import { z } from "zod";

export const assignRoleSchema = z.object({
  targetUserId: z.string().uuid("সঠিক ইউজার আইডি প্রদান করুন"),
  role: z.enum([
    "STUDENT",
    "SUPER_ADMIN",
    "DATA_MANAGER",
    "VERIFICATION_MANAGER",
    "SUPPORT_ADMIN",
    "CONTENT_MANAGER",
  ]),
  permissions: z.array(z.string()).default([]),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

export const policyApprovalSchema = z.object({
  versionId: z.string().uuid("সঠিক পলিসি ভার্সন আইডি আবশ্যক"),
  approvalStatus: z.enum(["APPROVED", "REJECTED"]),
  decisionComment: z.string().min(5, "সিদ্ধান্তের কারণ বা কমেন্ট লিখুন (কমপক্ষে ৫ অক্ষর)"),
});

export type PolicyApprovalInput = z.infer<typeof policyApprovalSchema>;

export const verifySourceSchema = z.object({
  sourceId: z.string().uuid("সঠিক তথ্যসূত্র আইডি দিন"),
  verificationMethod: z.enum([
    "OFFICIAL_PORTAL_CROSSCHECK",
    "EMBASSY_CIRCULAR",
    "MINISTRY_GAZETTE",
    "UNIVERSITY_DIRECT_COMMUNICATION",
  ]),
  verificationNotes: z.string().optional(),
});

export type VerifySourceInput = z.infer<typeof verifySourceSchema>;
