export type Locale = "bn" | "en";

export type DegreeLevel = "bachelor" | "master" | "phd";

export interface StudentAcademicProfile {
  id?: string;
  userId: string;
  currentLevel: "hsc_passed" | "a_level" | "diploma" | "bachelor_running" | "bachelor_passed" | "master_passed";
  sscGpa?: number; // 0.0 - 5.0
  sscPassingYear?: number;
  sscBoard?: string;
  hscGpa?: number; // 0.0 - 5.0
  hscPassingYear?: number;
  hscBoard?: string;
  hscGroup?: "science" | "business" | "humanities" | "engineering_tech" | "general";
  oLevelSubjects?: Array<{ subject: string; grade: string }>;
  aLevelSubjects?: Array<{ subject: string; grade: string }>;
  bachelorCgpa?: number; // 0.0 - 4.0
  bachelorPassingYear?: number;
  bachelorUniversity?: string;
  bachelorMajor?: string;
  hasBacklogs?: boolean;
  backlogsCount?: number;
  englishTest: {
    testType: "IELTS" | "TOEFL" | "PTE" | "DUOLINGO" | "MOI" | "NOT_TAKEN";
    overallBand?: number;
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
    testDate?: string;
  };
  standardizedTest?: {
    testType?: "GRE" | "GMAT" | "SAT" | "NONE";
    score?: number;
    quant?: number;
    verbal?: number;
    awa?: number;
  };
  budgetBdtAnnual?: number; // in BDT, e.g. 15,00,000 BDT
  targetCountries: string[]; // e.g. ['GB', 'DE', 'CA', 'AU', 'US']
  targetIntakeSeason: "fall" | "spring" | "summer";
  targetIntakeYear: number;
}

export interface UniversitySummary {
  id: string;
  countryCode: string;
  nameEn: string;
  nameBn: string;
  city: string;
  stateOrProvince?: string;
  worldRank?: number;
  websiteUrl: string;
  logoUrl?: string;
  isPublic: boolean;
  officialSourceUrl: string;
}

export interface ProgramSummary {
  id: string;
  universityId: string;
  countryCode: string;
  titleEn: string;
  titleBn: string;
  degreeLevel: DegreeLevel;
  department: string;
  durationMonths: number;
  annualTuitionLocal: number;
  currencyCode: string;
  annualTuitionBdtApprox: number;
  minIeltsOverall: number;
  minIeltsEachBand: number;
  minGpaOrCgpa: number;
  applicationDeadlineNotice?: string;
  officialSourceUrl: string;
}

export interface ScholarshipSummary {
  id: string;
  countryCode: string;
  titleEn: string;
  titleBn: string;
  providerType: "GOVERNMENT" | "UNIVERSITY" | "TRUST" | "EXTERNAL";
  coverageType: "FULL_FUNDED" | "TUITION_WAIVER" | "STIPEND_ONLY";
  coverageDescriptionBn: string;
  eligibilitySummaryBn: string;
  applicationDeadlineNotice: string;
  officialPortalUrl: string;
}

export interface VisaRequirementSummary {
  countryCode: string;
  visaNameEn: string;
  visaNameBn: string;
  financialFundsRequiredLocal: number;
  currencyCode: string;
  financialFundsRequiredBdtApprox: number;
  financialSponsorRulesBn: string;
  blockedAccountRequired: boolean;
  embassyInterviewRequired: boolean;
  officialImmigrationUrl: string;
  dhakaEmbassyUrl: string;
}

export interface EligibilityResult {
  programId: string;
  status: "ELIGIBLE" | "BORDERLINE" | "INELIGIBLE";
  matchPercentage: number;
  reasonsBn: string[];
  reasonsEn: string[];
  recommendedActionsBn: string[];
}
