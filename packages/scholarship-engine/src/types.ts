export type ScholarshipStatus =
  | "ELIGIBLE"
  | "CONDITIONALLY_ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "UNABLE_TO_DETERMINE";

export type ConditionItemStatus =
  | "MET"
  | "PARTIALLY_MET"
  | "NOT_MET"
  | "INFORMATION_MISSING";

export interface ScholarshipConditionBreakdownItem {
  key: string;
  nameBn: string;
  nameEn: string;
  requiredValue: string;
  studentValue: string;
  status: ConditionItemStatus;
  explanationBn: string;
  explanationEn: string;
}

export interface ScholarshipEvaluationResult {
  scholarshipId: string;
  titleEn: string;
  titleBn: string;
  countryCode: string;
  universityName?: string;
  providerName: string;
  providerType: string;
  fundingType: string;
  status: ScholarshipStatus;
  statusTitleBn: string;
  matchScore: number; // 0 to 100
  breakdown: ScholarshipConditionBreakdownItem[];
  missingConditionsBn: string[];
  coveredBenefitsBn: string[];
  uncoveredEstimatedBdt: number;
  officialPortalUrl: string;
  deadlineNoticeBn?: string;
  applicationDeadline?: string;
  isDeadlineOpen: boolean;
  notesBn?: string;
}

export interface StudentScholarshipProfileInput {
  nationality?: string;
  age?: number;
  degreeLevel?: string; // "BACHELOR", "MASTER", "HSC"
  discipline?: string;
  cgpa?: number;
  scale?: number;
  percentage?: number;
  passingYear?: number;
  resultStatus?: string;
  ieltsOverall?: number;
  ieltsListening?: number;
  ieltsReading?: number;
  ieltsWriting?: number;
  ieltsSpeaking?: number;
  pteOverall?: number;
  toeflOverall?: number;
  duolingoScore?: number;
  languageTestType?: string;
  isLanguagePlannedOnly?: boolean;
  workExperienceMonths?: number;
  workExperienceField?: string;
}

export interface ScholarshipRecord {
  id: string;
  countryCode: string;
  universityId?: string | null;
  university?: {
    nameEn: string;
    nameBn: string;
  } | null;
  titleEn: string;
  titleBn: string;
  providerName: string;
  providerType: string;
  fundingType: string;
  tuitionCoveragePercent: number;
  tuitionCoverageMaxAmount?: number | null;
  tuitionCoverageCurrency?: string | null;
  livingStipendMonthly?: number | null;
  livingStipendAnnual?: number | null;
  livingStipendCurrency?: string | null;
  travelSupport: boolean;
  travelSupportDetailsBn?: string | null;
  accommodationSupport: boolean;
  accommodationDetailsBn?: string | null;
  healthInsuranceCovered: boolean;
  visaFeeCovered: boolean;
  otherBenefitsBn?: string | null;
  coverageDescriptionBn: string;
  eligibilityCriteriaBn: string;
  applicationDeadline?: Date | string | null;
  deadlineNotice?: string | null;
  requiredDocumentsJson?: string | null;
  officialPortalUrl: string;
  notesBn?: string | null;
  eligibilityRules?: ScholarshipRuleRecord[];
}

export interface ScholarshipRuleRecord {
  id?: string;
  eligibleDegreeLevels: string[];
  eligibleDisciplines?: string[];
  targetNationalities?: string[];
  minCgpaRequired?: number | null;
  gpaScale?: number;
  minPercentage?: number | null;
  minUkDegreeClassification?: string | null;
  minIeltsRequired?: number | null;
  minIeltsEachBand?: number | null;
  minPteRequired?: number | null;
  minToeflRequired?: number | null;
  duolingoAccepted?: boolean;
  workExperienceMonths?: number;
  workExperienceRequired?: boolean;
  minAge?: number | null;
  maxAge?: number | null;
  ruleDescriptionBn?: string | null;
}

export interface FundingImpactSummary {
  choiceType: "SCHOLARSHIP_FUNDED" | "SELF_FUNDED";
  scholarshipTitleBn?: string;
  coveredTuitionBdt: number;
  coveredLivingBdt: number;
  totalCoveredBdt: number;
  uncoveredPersonalBufferBdt: number;
  requiredBankSolvencyBdt: number;
  monthlyLivingStipendBdt: number;
  tuitionCoveragePercent: number;
  summaryBn: string;
  recommendationsBn: string[];
}
