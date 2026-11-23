import { describe, it, expect } from "vitest";
import {
  assignRoleSchema,
  policyApprovalSchema,
  verifySourceSchema,
  sourceUpsertSchema,
  policyChangeProposalSchema,
  policyChangeReviewSchema,
  adminCountryUpsertSchema,
  auditLogQuerySchema,
} from "../admin.schema";
import {
  adminUniversityUpsertSchema,
  adminProgramUpsertSchema,
} from "../discovery.schema";

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
      decisionComment:
        "হোম অফিসের অফিসিয়াল সার্কুলার অনুযায়ী ব্যাংক ব্যালান্স রেট যাচাই করে অনুমোদন করা হলো।",
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

  // -------------------------------------------------------------
  // Source Monitoring Schema Tests
  // -------------------------------------------------------------
  describe("Source Monitoring Schema Tests", () => {
    it("should validate complete official information source", () => {
      const validSource = {
        title: "UKVI Student Visa Financial Requirement Policy",
        authorityName: "UK Visas and Immigration",
        officialUrl: "https://www.gov.uk/student-visa/money",
        countryCode: "GB",
        sourceCategory: "GOVERNMENT_IMMIGRATION" as const,
        nextReviewDays: 90,
        status: "VERIFIED" as const,
      };

      const result = sourceUpsertSchema.safeParse(validSource);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.authorityName).toBe("UK Visas and Immigration");
        expect(result.data.nextReviewDays).toBe(90);
      }
    });

    it("should reject invalid URL format in information source", () => {
      const invalidSource = {
        title: "Invalid Source",
        authorityName: "Authority",
        officialUrl: "not-a-valid-url",
        sourceCategory: "GOVERNMENT_IMMIGRATION" as const,
      };

      const result = sourceUpsertSchema.safeParse(invalidSource);
      expect(result.success).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 9-Step Policy Change Workflow Schema Tests
  // -------------------------------------------------------------
  describe("Policy Change Workflow Schema Tests", () => {
    it("should validate step 3 proposal with side-by-side evidence diff", () => {
      const validProposal = {
        visaRequirementId: "123e4567-e89b-12d3-a456-426614174000",
        title: "UK Student Visa Monthly Maintenance Increase 2026",
        sourceOrganization: "UK Visas and Immigration",
        officialGazetteUrl: "https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules",
        changeSummaryBn: "লন্ডনের বাইরে মাসিক লিভিং কস্ট ১,০২৩ পাউন্ড থেকে বেড়ে ১,৪৮৩ পাউন্ড নির্ধারণ করা হয়েছে।",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        category: "FINANCIAL_MAINTENANCE" as const,
        oldValue: "£1,023 per month",
        newValue: "£1,483 per month",
        evidenceComparisonJson: JSON.stringify({
          section: "Financial requirement",
          paragraph: "FIN 2.1",
          previousLivingCost: 1023,
          newLivingCost: 1483,
        }),
      };

      const result = policyChangeProposalSchema.safeParse(validProposal);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.oldValue).toBe("£1,023 per month");
        expect(result.data.newValue).toBe("£1,483 per month");
      }
    });

    it("should reject proposal with missing required summary or short title", () => {
      const invalidProposal = {
        visaRequirementId: "123e4567-e89b-12d3-a456-426614174000",
        title: "UK", // Too short
        sourceOrganization: "UKVI",
        officialGazetteUrl: "https://www.gov.uk/statement",
        changeSummaryBn: "short", // Less than 10 chars
        effectiveDate: "2026-01-01",
        oldValue: "100",
        newValue: "200",
      };

      const result = policyChangeProposalSchema.safeParse(invalidProposal);
      expect(result.success).toBe(false);
    });

    it("should validate step 6 review decision with notification dispatch option", () => {
      const validReview = {
        versionId: "123e4567-e89b-12d3-a456-426614174000",
        decision: "APPROVED" as const,
        decisionComment: "হোম অফিসের অফিসিয়াল গেজেট ও স্টেটমেন্ট অব চেঞ্জেস পুঙ্খানুপুঙ্খ যাচাই করে অনুমোদন দেওয়া হলো।",
        notifyAffectedStudents: true,
      };

      const result = policyChangeReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notifyAffectedStudents).toBe(true);
      }
    });
  });

  // -------------------------------------------------------------
  // Country, University & Program Management Tests
  // -------------------------------------------------------------
  describe("Country & Institution Management Schema Tests", () => {
    it("should validate country with work rights and post study work rules", () => {
      const validCountry = {
        code: "GB",
        iso2: "GB",
        nameEn: "United Kingdom",
        nameBn: "যুক্তরাজ্য",
        flagEmoji: "🇬🇧",
        currencyCode: "GBP",
        currencySymbol: "£",
        approxBdtRate: 154.5,
        officialLanguage: "English",
        postStudyWorkDurationBn: "স্নাতক ও স্নাতকোত্তর সম্পন্নকারীদের জন্য ২ বছর, পিএইচডির জন্য ৩ বছর গ্র্যাজুয়েট রুট ভিসা।",
        avgMonthlyLivingCost: 1483,
        blockedAccountRequired: false,
        officialImmigrationUrl: "https://www.gov.uk/student-visa",
        dhakaEmbassyName: "ব্রিটিশ হাইকমিশন, ঢাকা",
        dhakaEmbassyUrl: "https://www.gov.uk/world/organisations/british-high-commission-dhaka",
        workRightsInTermHours: 20,
        workRightsVacationHours: 40,
      };

      const result = adminCountryUpsertSchema.safeParse(validCountry);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.workRightsInTermHours).toBe(20);
        expect(result.data.approxBdtRate).toBe(154.5);
      }
    });

    it("should validate university upsert with official registry code", () => {
      const validUni = {
        countryCode: "GB" as const,
        nameEn: "University of Oxford",
        nameBn: "অক্সফোর্ড বিশ্ববিদ্যালয়",
        city: "Oxford",
        worldRank: 1,
        institutionRegistryCode: "UKVI-SPONSOR-OX123",
        websiteUrl: "https://www.ox.ac.uk",
        admissionsUrl: "https://www.ox.ac.uk/admissions/international",
        accreditationDetailsBn: "UK HESA এবং অফিস ফর স্টুডেন্টস দ্বারা সম্পূর্ণ অনুমোদিত",
        recognizingAuthority: "UK Office for Students (OfS)",
        officialSourceUrl: "https://www.ox.ac.uk",
      };

      const result = adminUniversityUpsertSchema.safeParse(validUni);
      expect(result.success).toBe(true);
    });

    it("should validate program upsert with tuition fee and intake months", () => {
      const validProgram = {
        universityId: "123e4567-e89b-12d3-a456-426614174000",
        titleEn: "MSc in Advanced Computer Science",
        titleBn: "এমএসসি ইন অ্যাডভান্সড কম্পিউটার সায়েন্স",
        degreeLevel: "MASTER" as const,
        department: "Department of Computer Science",
        annualTuitionAmount: 32500,
        tuitionCurrencyCode: "GBP",
        durationMonths: 12,
        officialProgramUrl: "https://www.ox.ac.uk/programs/advanced-cs",
        officialSourceUrl: "https://www.ox.ac.uk/programs/advanced-cs",
      };

      const result = adminProgramUpsertSchema.safeParse(validProgram);
      expect(result.success).toBe(true);
    });

    it("should validate audit log pagination query", () => {
      const query = {
        resourceType: "VISA_POLICY_UPDATE",
        limit: "25",
        offset: "50",
      };

      const result = auditLogQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(25);
        expect(result.data.offset).toBe(50);
      }
    });
  });
});
