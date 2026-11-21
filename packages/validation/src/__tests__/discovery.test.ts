import { describe, it, expect } from "vitest";
import {
  countryFilterSchema,
  universityFilterSchema,
  programFilterSchema,
  savedFavoriteSchema,
  adminUniversityUpsertSchema,
  adminProgramUpsertSchema,
} from "../discovery.schema";

describe("Country, University & Program Discovery Engine", () => {
  describe("1. Country Filter & Search Validation", () => {
    it("validates empty or search query filters", () => {
      const valid1 = countryFilterSchema.safeParse({});
      expect(valid1.success).toBe(true);

      const valid2 = countryFilterSchema.safeParse({
        search: "Germany",
        currency: "EUR",
        blockedAccount: "true",
      });
      expect(valid2.success).toBe(true);
      if (valid2.success) {
        expect(valid2.data.blockedAccount).toBe(true);
      }
    });

    it("parses blockedAccount false properly", () => {
      const result = countryFilterSchema.safeParse({
        blockedAccount: "false",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.blockedAccount).toBe(false);
      }
    });
  });

  describe("2. University Search & Discovery Filters", () => {
    it("validates legitimate university filters and pagination", () => {
      const valid = {
        search: "Manchester",
        countryCode: "GB" as const,
        city: "Manchester",
        minRank: 1,
        maxRank: 100,
        page: 1,
        limit: 12,
        sortBy: "worldRank" as const,
        sortOrder: "asc" as const,
      };

      const result = universityFilterSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when country code is not in initial 5 destination countries", () => {
      const invalid = {
        countryCode: "FR", // France is not in the initial 5
      };

      const result = universityFilterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("enforces pagination page and limit boundaries", () => {
      const invalid = {
        page: 0, // min is 1
        limit: 200, // max is 100
      };

      const result = universityFilterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("3. Program Search & Discovery Filters", () => {
    it("validates multi-facet program query with BDT budget and IELTS limit", () => {
      const valid = {
        search: "Data Science",
        countryCode: "CA" as const,
        degreeLevel: "MASTER" as const,
        subjectCategory: "DATA_SCIENCE_AI" as const,
        minTuitionBdt: 1500000,
        maxTuitionBdt: 3500000,
        maxIelts: 6.5,
        intakeSeason: "FALL" as const,
        intakeYear: 2026,
      };

      const result = programFilterSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when IELTS filter is outside 4.0 - 9.0 scale", () => {
      const invalid = {
        maxIelts: 10.0,
      };

      const result = programFilterSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("4. Saved Favorites (Shortlist) Validation", () => {
    it("validates saving university to shortlist with category", () => {
      const valid = {
        itemType: "UNIVERSITY" as const,
        targetId: "b832309e-1234-4567-89ab-cdef01234567",
        category: "TARGET" as const,
        notes: "IELTS 7.0 score প্রয়োজন, স্কলারশিপ অপশন আছে।",
      };

      const result = savedFavoriteSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when targetId is not a valid UUID", () => {
      const invalid = {
        itemType: "PROGRAM" as const,
        targetId: "not-a-uuid",
        category: "AMBITIOUS" as const,
      };

      const result = savedFavoriteSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("fails when notes exceed 500 characters", () => {
      const invalid = {
        itemType: "UNIVERSITY" as const,
        targetId: "b832309e-1234-4567-89ab-cdef01234567",
        category: "SAFE" as const,
        notes: "A".repeat(501),
      };

      const result = savedFavoriteSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("5. Admin University Upsert Validation", () => {
    it("validates adding recognized university with official URLs and registry codes", () => {
      const valid = {
        countryCode: "GB" as const,
        nameEn: "University of Oxford",
        nameBn: "অক্সফোর্ড বিশ্ববিদ্যালয়",
        city: "Oxford",
        worldRank: 3,
        websiteUrl: "https://www.ox.ac.uk",
        admissionsUrl: "https://www.ox.ac.uk/admissions",
        institutionType: "PUBLIC_RESEARCH",
        accreditationDetailsBn: "যুক্তরাজ্যের রয়্যাল চার্টার প্রাপ্ত সরকারি গবেষণা বিশ্ববিদ্যালয়। HESA স্বীকৃত।",
        recognizingAuthority: "UK Office for Students / HESA",
        institutionRegistryCode: "UKPRN 10007774",
        officialSourceUrl: "https://www.ox.ac.uk/about",
        verificationStatus: "VERIFIED" as const,
        isRecognized: true,
        isPublic: true,
      };

      const result = adminUniversityUpsertSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when official website URL is invalid", () => {
      const invalid = {
        countryCode: "DE" as const,
        nameEn: "TUM",
        nameBn: "টিইউএম",
        city: "Munich",
        websiteUrl: "invalid-url",
        accreditationDetailsBn: "Anabin H+ স্বীকৃত",
        recognizingAuthority: "KMK",
        officialSourceUrl: "https://tum.de",
      };

      const result = adminUniversityUpsertSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.websiteUrl).toBeDefined();
      }
    });
  });

  describe("6. Admin Program Upsert Validation", () => {
    it("validates adding official academic degree program with requirements", () => {
      const valid = {
        universityId: "e18b99db-1234-4567-89ab-cdef01234567",
        titleEn: "MSc in Artificial Intelligence",
        titleBn: "মাস্টার্স ইন আর্টিফিশিয়াল ইন্টেলিজেন্স",
        degreeLevel: "MASTER" as const,
        subjectCategory: "DATA_SCIENCE_AI" as const,
        department: "Department of Computer Science",
        durationMonths: 12,
        studyMode: "FULL_TIME" as const,
        annualTuitionAmount: 32000,
        tuitionCurrencyCode: "GBP",
        officialProgramUrl: "https://www.ox.ac.uk/courses/msc-ai",
        officialSourceUrl: "https://www.ox.ac.uk/courses/msc-ai",
        minIeltsOverall: 7.5,
        minIeltsEachBand: 7.0,
        minGpaOrCgpa: 3.5,
        gpaScale: 4.0,
        greRequired: false,
        workExperienceMonths: 0,
      };

      const result = adminProgramUpsertSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when annual tuition fee is negative", () => {
      const invalid = {
        universityId: "e18b99db-1234-4567-89ab-cdef01234567",
        titleEn: "MSc",
        titleBn: "মাস্টার্স",
        department: "CS",
        durationMonths: 12,
        annualTuitionAmount: -500, // Invalid
        tuitionCurrencyCode: "GBP",
        officialProgramUrl: "https://ox.ac.uk",
        officialSourceUrl: "https://ox.ac.uk",
      };

      const result = adminProgramUpsertSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.annualTuitionAmount).toBeDefined();
      }
    });
  });
});
