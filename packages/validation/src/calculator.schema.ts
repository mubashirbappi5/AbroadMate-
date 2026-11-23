import { z } from "zod";

export const financialCountryCodeEnum = z.enum(["GB", "CA", "AU", "DE", "US"]);
export type FinancialCountryCode = z.infer<typeof financialCountryCodeEnum>;

export const savingsFeasibilityEnum = z.enum([
  "SURPLUS",
  "FEASIBLE",
  "CHALLENGING",
  "HIGH_GAP",
]);
export type SavingsFeasibility = z.infer<typeof savingsFeasibilityEnum>;

export const ExpenseCalculationInputSchema = z.object({
  countryCode: financialCountryCodeEnum,
  degreeLevel: z.enum(["bachelor", "master", "phd"]).default("master"),
  tuitionFeeLocal: z.number().min(0),
  cityType: z.enum(["METRO", "REGIONAL", "AFFORDABLE"]).default("REGIONAL"),
  includeHealthInsurance: z.boolean().default(true),
  includeVisaFee: z.boolean().default(true),
  includeAirfare: z.boolean().default(true),
});
export type ExpenseCalculationInput = z.infer<typeof ExpenseCalculationInputSchema>;

export const calculateFinancialBudgetSchema = z.object({
  countryCode: financialCountryCodeEnum,
  degreeLevel: z.string().default("MASTERS"),
  studyDurationYears: z.number().min(0.5).max(6).default(1.0),
  programId: z.string().optional(),
  grossTuitionAnnualLocal: z.number().min(0, "টিউশন ফি ঋণাত্মক হতে পারে না").default(15000),
  tuitionDepositPaidLocal: z.number().min(0).default(0),
  scholarshipDeductionLocal: z.number().min(0).default(0),
  studentSavingsLocal: z.number().min(0).default(0),
  sponsorContributionLocal: z.number().min(0).default(0),
  educationLoanLocal: z.number().min(0).default(0),
  monthlySavingsCapacityBdt: z.number().min(0).default(0),
  monthsUntilDeparture: z.number().int().min(1).max(36).default(6),
  isInsideLondonOrMetro: z.boolean().default(false),
});
export type CalculateFinancialBudgetInput = z.infer<typeof calculateFinancialBudgetSchema>;

export const saveBudgetPlanSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2).default("আমার স্টাডি বাজেট"),
  countryCode: financialCountryCodeEnum,
  programId: z.string().optional(),
  degreeLevel: z.string().default("MASTERS"),
  studyDurationYears: z.number().min(0.5).max(6).default(1.0),
  currencyCode: z.string().min(3).max(4),
  exchangeRateToBdt: z.number().min(1),
  exchangeRateSource: z.string().default("বাংলাদেশ ব্যাংক / ওপেন মার্কেট রেফারেন্স"),

  // Pre-departure
  appFeeTotalLocal: z.number().min(0).default(0),
  languageTestFeeBdt: z.number().min(0).default(23500),
  documentPrepFeeBdt: z.number().min(0).default(8000),
  medicalExamFeeBdt: z.number().min(0).default(13500),
  flightTicketBdt: z.number().min(0).default(90000),
  initialSettlementLocal: z.number().min(0).default(0),

  // Statutory Fees
  visaApplicationFeeLocal: z.number().min(0).default(0),
  biometricsFeeLocal: z.number().min(0).default(0),
  healthInsuranceLocal: z.number().min(0).default(0),
  countrySpecificCostsLocal: z.number().min(0).default(0),

  // Academic & Living
  grossTuitionAnnualLocal: z.number().min(0),
  tuitionDepositPaidLocal: z.number().min(0).default(0),
  livingCostAnnualLocal: z.number().min(0),
  accommodationAnnualLocal: z.number().min(0).default(0),
  foodAnnualLocal: z.number().min(0).default(0),
  transportAnnualLocal: z.number().min(0).default(0),
  emergencyFundLocal: z.number().min(0).default(0),

  // Inflows & Resources
  studentSavingsLocal: z.number().min(0).default(0),
  sponsorContributionLocal: z.number().min(0).default(0),
  educationLoanLocal: z.number().min(0).default(0),
  scholarshipDeductionLocal: z.number().min(0).default(0),
  monthlySavingsCapacityBdt: z.number().min(0).default(0),
  monthsUntilDeparture: z.number().int().min(1).max(36).default(6),

  revisionNotes: z.string().optional(),
});
export type SaveBudgetPlanInput = z.infer<typeof saveBudgetPlanSchema>;
