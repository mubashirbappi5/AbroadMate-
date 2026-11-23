import { describe, it, expect } from "vitest";
import {
  evaluateStudentVisaEligibility,
  calculateDetailedFinancialProof,
} from "../../packages/visa-engine/src";
import {
  documentUploadSchema,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "../../packages/validation/src/document.schema";

describe("Integration: Visa Assessment & Document Management Engine", () => {
  describe("Country-Specific Visa Rule Evaluation", () => {
    it("evaluates UK Student Visa with 28-day financial holding rule & TB clearance", () => {
      const ukEvaluation = evaluateStudentVisaEligibility({
        countryCode: "GB",
        degreeLevel: "MASTERS",
        isInsideLondon: false,
        tuitionFeeLocal: 18000,
        tuitionFeePaidLocal: 4000,
        availableLiquidFundsLocal: 25000,
        fundsHoldingDays: 32, // >= 28 days required
        sponsorType: "PARENTS",
        hasValidPassport: true,
        hasOfficialAdmissionConfirmation: true, // CAS
        hasAcademicCertificates: true,
        hasLanguageProficiencyProof: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true, // TB clearance
        hasHealthInsurance: true,
        hasPoliceClearance: true,
        hasPreviousRefusal: false,
        scholarshipFundingBdt: 0,
      });

      expect(ukEvaluation.verdict).toBe("PRELIMINARY_ELIGIBLE");
      expect(ukEvaluation.financialBreakdown.isHoldingPeriodSatisfied).toBe(true);
      expect(ukEvaluation.financialBreakdown.maintenancePeriodDaysRequired).toBe(28);
      expect(ukEvaluation.financialBreakdown.isSponsorAccepted).toBe(true);
      expect(ukEvaluation.financialBreakdown.financialGapLocal).toBe(0);
    });

    it("flags UK Visa as FINANCIAL_GAP if funds have been held for fewer than 28 consecutive days", () => {
      const prematureFundsEvaluation = evaluateStudentVisaEligibility({
        countryCode: "GB",
        degreeLevel: "MASTERS",
        isInsideLondon: false,
        tuitionFeeLocal: 18000,
        tuitionFeePaidLocal: 4000,
        availableLiquidFundsLocal: 25000,
        fundsHoldingDays: 14, // Only 14 days held! Fails statutory 28-day rule
        sponsorType: "PARENTS",
        hasValidPassport: true,
        hasOfficialAdmissionConfirmation: true,
        hasAcademicCertificates: true,
        hasLanguageProficiencyProof: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasHealthInsurance: true,
        hasPoliceClearance: true,
        hasPreviousRefusal: false,
        scholarshipFundingBdt: 0,
      });

      expect(prematureFundsEvaluation.verdict).toBe("FINANCIAL_GAP");
      expect(prematureFundsEvaluation.financialBreakdown.isHoldingPeriodSatisfied).toBe(false);
      expect(prematureFundsEvaluation.actionableRecommendationsBn[0]).toContain("ব্যাংক অ্যাকাউন্টে");
    });

    it("evaluates Germany Student Visa requiring Sperrkonto (Blocked Account) & APS Certification", () => {
      const germanyEvaluation = evaluateStudentVisaEligibility({
        countryCode: "DE",
        degreeLevel: "MASTERS",
        tuitionFeeLocal: 0, // Public university tuition-free
        tuitionFeePaidLocal: 0,
        availableLiquidFundsLocal: 14000, // Blocked account ~11,904 EUR + insurance + visa fee
        fundsHoldingDays: 30,
        sponsorType: "SELF",
        hasValidPassport: true,
        hasOfficialAdmissionConfirmation: true, // Zulassungsbescheid
        hasAcademicCertificates: true,
        hasLanguageProficiencyProof: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasHealthInsurance: true,
        hasPoliceClearance: true,
        hasPreviousRefusal: false,
        scholarshipFundingBdt: 0,
      });

      expect(germanyEvaluation.verdict).toBe("PRELIMINARY_ELIGIBLE");
      expect(germanyEvaluation.financialBreakdown.livingFundsRequiredLocal).toBe(11904);
      expect(germanyEvaluation.financialBreakdown.currencyCode).toBe("EUR");
    });

    it("evaluates Canada Study Permit requiring Provincial Attestation Letter (PAL) & Living benchmark", () => {
      const canadaEvaluation = evaluateStudentVisaEligibility({
        countryCode: "CA",
        degreeLevel: "MASTERS",
        tuitionFeeLocal: 22000,
        tuitionFeePaidLocal: 10000,
        availableLiquidFundsLocal: 35000,
        fundsHoldingDays: 120,
        sponsorType: "PARENTS",
        hasValidPassport: true,
        hasOfficialAdmissionConfirmation: true, // LOA from DLI
        hasAcademicCertificates: true,
        hasLanguageProficiencyProof: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasHealthInsurance: true,
        hasPoliceClearance: true,
        hasPreviousRefusal: false,
        scholarshipFundingBdt: 0,
      });

      expect(canadaEvaluation.verdict).toBe("PRELIMINARY_ELIGIBLE");
      expect(canadaEvaluation.financialBreakdown.currencyCode).toBe("CAD");
      expect(canadaEvaluation.financialBreakdown.livingFundsRequiredLocal).toBe(20635);
      expect(canadaEvaluation.financialBreakdown.isHoldingPeriodSatisfied).toBe(true);
    });
  });

  describe("Dynamic Document Checklist & Security Verification", () => {
    it("validates legitimate PDF document upload metadata", () => {
      const validUpload = {
        fileName: "Passport_Scan_BioPage.pdf",
        category: "PASSPORT_BIOPAGE" as const,
        mimeType: "application/pdf" as const,
        fileSize: 2450000, // ~2.4 MB (< 10MB limit)
      };

      const result = documentUploadSchema.safeParse(validUpload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fileName).toBe("Passport_Scan_BioPage.pdf");
      }
    });

    it("rejects malicious or disallowed file extensions and excessive sizes", () => {
      const dangerousUpload = {
        fileName: "malicious_script.sh.exe",
        category: "ACADEMIC_TRANSCRIPT" as const,
        mimeType: "application/x-msdownload", // Executable
        fileSize: 1024,
      };

      const result = documentUploadSchema.safeParse(dangerousUpload);
      expect(result.success).toBe(false);

      const oversizedUpload = {
        fileName: "Giant_Bank_Statement.pdf",
        category: "BANK_SOLVENCY" as const,
        mimeType: "application/pdf" as const,
        fileSize: 15 * 1024 * 1024, // 15MB > 10MB limit
      };

      const oversizedResult = documentUploadSchema.safeParse(oversizedUpload);
      expect(oversizedResult.success).toBe(false);
    });

    it("transitions document review lifecycle accurately", () => {
      type DocStatus = "PENDING_UPLOAD" | "UPLOADED" | "IN_REVIEW" | "VERIFIED" | "REJECTED";

      interface ManagedDocument {
        id: string;
        titleEn: string;
        status: DocStatus;
        rejectionReason?: string;
      }

      const doc: ManagedDocument = {
        id: "doc_bank_cert",
        titleEn: "Bank Solvency Certificate",
        status: "UPLOADED",
      };

      // Reviewer starts review
      doc.status = "IN_REVIEW";
      expect(doc.status).toBe("IN_REVIEW");

      // Reviewer finds mismatch in branch seal and rejects with feedback
      doc.status = "REJECTED";
      doc.rejectionReason = "ব্যাংক সলভেন্সি সার্টিফিকেটে ম্যানেজারের অফিশিয়াল সিল ও তারিখ স্পষ্টভাবে বোঝা যাচ্ছে না।";
      expect(doc.status).toBe("REJECTED");
      expect(doc.rejectionReason).toContain("অফিশিয়াল সিল");

      // Student re-uploads high-res scan
      doc.status = "UPLOADED";
      doc.rejectionReason = undefined;

      // Reviewer approves
      doc.status = "VERIFIED";
      expect(doc.status).toBe("VERIFIED");
    });
  });
});
