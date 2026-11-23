import {
  CountryCodeType,
  SponsorType,
  VisaAssessmentVerdict,
  EvaluateVisaAssessmentInput,
  CalculateVisaFinancialsInput,
} from "@abroadmate/validation";

export type ConditionEvaluationStatus =
  | "MET"
  | "PARTIALLY_MET"
  | "MISSING"
  | "CONDITIONAL"
  | "NOT_APPLICABLE"
  | "UNABLE_TO_DETERMINE";

export interface VisaRequirementItemResult {
  requirementName: string;
  category: "ADMISSION" | "FINANCIAL" | "DOCUMENT" | "HEALTH_BIOMETRIC" | "LANGUAGE" | "IMMIGRATION_HISTORY";
  isMandatory: boolean;
  status: ConditionEvaluationStatus;
  studentValue: string;
  officialRule: string;
  explanationBn: string;
  officialSourceUrl?: string;
}

export interface DetailedFinancialBreakdown {
  countryCode: CountryCodeType;
  currencyCode: string;
  tuitionFeeLocal: number;
  tuitionPaidLocal: number;
  tuitionRemainingLocal: number;
  livingFundsRequiredLocal: number;
  travelExpenseLocal: number;
  healthInsuranceLocal: number;
  visaApplicationFeeLocal: number;
  dependentExpensesLocal: number;
  totalFundsRequiredLocal: number;
  totalFundsRequiredBdt: number;
  availableLiquidFundsLocal: number;
  availableLiquidFundsBdt: number;
  financialGapLocal: number;
  financialGapBdt: number;
  maintenancePeriodDaysRequired: number;
  maintenancePeriodDaysActual: number;
  isHoldingPeriodSatisfied: boolean;
  sponsorType: SponsorType;
  isSponsorAccepted: boolean;
  sponsorEvaluationBn: string;
  holdingRuleNoticeBn: string;
}

export interface DocumentChecklistItem {
  documentType: string;
  titleEn: string;
  titleBn: string;
  isMandatory: boolean;
  isProvided: boolean;
  status: ConditionEvaluationStatus;
  attestationRuleBn?: string;
  issuingAuthorityBn?: string;
  instructionsBn: string;
  officialSourceUrl?: string;
}

export interface ApplicationWorkflowStage {
  stepOrder: number;
  stageCode: string;
  titleEn: string;
  titleBn: string;
  descriptionBn: string;
  localCenterName?: string;
  localAuthorityOrCenter?: string;
  estimatedDurationDays: number;
  officialPortalUrl?: string;
}

export interface Country15SectionGuide {
  countryCode: CountryCodeType;
  countryNameEn: string;
  countryNameBn: string;
  flag: string;
  visaSubclassName: string;
  applicationAuthority: string;
  sections: {
    1: { titleBn: string; contentBn: string }; // Visa Overview
    2: { titleBn: string; contentBn: string }; // Eligibility
    3: { titleBn: string; contentBn: string }; // Financial Requirements
    4: { titleBn: string; contentBn: string }; // Sponsor Rules
    5: { titleBn: string; contentBn: string }; // Required Documents
    6: { titleBn: string; contentBn: string }; // Application Process
    7: { titleBn: string; contentBn: string }; // Biometrics
    8: { titleBn: string; contentBn: string }; // Medical Requirements
    9: { titleBn: string; contentBn: string }; // Fees
    10: { titleBn: string; contentBn: string }; // Processing Time
    11: { titleBn: string; contentBn: string }; // Interview Guide
    12: { titleBn: string; contentBn: string }; // Work Rights
    13: { titleBn: string; contentBn: string }; // Post-study Options
    14: { titleBn: string; contentBn: string }; // Refusal and Reapplication
    15: { titleBn: string; contentBn: string }; // Official Sources
  };
}

export interface VisaAssessmentOutput {
  verdict: VisaAssessmentVerdict;
  countryCode: CountryCodeType;
  visaCode: string;
  visaNameBn: string;
  summaryBn: string;
  distinctionNoticeBn: string;
  financialBreakdown: DetailedFinancialBreakdown;
  requirementResults: VisaRequirementItemResult[];
  documentChecklist: DocumentChecklistItem[];
  workflowSteps: ApplicationWorkflowStage[];
  actionableRecommendationsBn: string[];
  refusalAdvisoryBn?: string;
  evaluatedAt: string;
  officialGazetteUrl: string;
}
