import { convertToBdt, formatBdt } from "./currency";

export interface ExpenseCategoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  phase: "PRE_DEPARTURE" | "STATUTORY_IMMIGRATION" | "TRAVEL_SETTLEMENT" | "LIVING_STUDY";
  amountLocal: number;
  amountBdt: number;
  isVerifiedStatutory: boolean;
  citationSource?: string;
  effectiveDate?: string;
}

export interface FinancialBudgetPlanResult {
  countryCode: "GB" | "CA" | "AU" | "DE" | "US";
  currencyCode: string;
  exchangeRateToBdt: number;
  exchangeRateSource: string;
  exchangeRateTimestamp: string;
  studyDurationYears: number;

  // Granular Expenses
  expenses: ExpenseCategoryItem[];

  // Aggregated Cost Totals
  preDepartureTotalBdt: number;
  statutoryFeesTotalLocal: number;
  statutoryFeesTotalBdt: number;
  travelAndSettlementTotalLocal: number;
  travelAndSettlementTotalBdt: number;
  academicAndLivingFirstYearLocal: number;
  academicAndLivingFirstYearBdt: number;

  firstYearTotalCostLocal: number;
  firstYearTotalCostBdt: number;
  totalDegreeCostLocal: number;
  totalDegreeCostBdt: number;

  // Funding & Gap
  totalAvailableFundsLocal: number;
  totalAvailableFundsBdt: number;
  fundingGapLocal: number;
  fundingGapBdt: number;

  // Monthly Savings Roadmap
  monthsUntilDeparture: number;
  targetMonthlySavingsBdt: number;
  monthlySavingsCapacityBdt: number;
  savingsFeasibility: "SURPLUS" | "FEASIBLE" | "CHALLENGING" | "HIGH_GAP";
  feasibilityRecommendationBn: string;

  // Chart Percentages
  chartDistribution: {
    tuitionPercent: number;
    livingPercent: number;
    statutoryFeesPercent: number;
    travelSettlementPercent: number;
    preDeparturePercent: number;
  };
}

export interface CalculateBudgetParams {
  countryCode: "GB" | "CA" | "AU" | "DE" | "US";
  degreeLevel?: string;
  studyDurationYears?: number;
  grossTuitionAnnualLocal: number;
  tuitionDepositPaidLocal?: number;
  scholarshipDeductionLocal?: number;
  studentSavingsLocal?: number;
  sponsorContributionLocal?: number;
  educationLoanLocal?: number;
  monthlySavingsCapacityBdt?: number;
  monthsUntilDeparture?: number;
  isInsideLondonOrMetro?: boolean;
}

export const VERIFIED_EXCHANGE_RATES: Record<
  string,
  { rate: number; source: string; effectiveDate: string }
> = {
  GBP: {
    rate: 153.5,
    source: "বাংলাদেশ ব্যাংক অফিশিয়াল বৈদেশিক মুদ্রা বিনিময় রেফারেন্স",
    effectiveDate: "নভেম্বর ২০২৬",
  },
  CAD: {
    rate: 87.0,
    source: "বাংলাদেশ ব্যাংক অফিশিয়াল বৈদেশিক মুদ্রা বিনিময় রেফারেন্স",
    effectiveDate: "নভেম্বর ২০২৬",
  },
  AUD: {
    rate: 78.5,
    source: "বাংলাদেশ ব্যাংক অফিশিয়াল বৈদেশিক মুদ্রা বিনিময় রেফারেন্স",
    effectiveDate: "নভেম্বর ২০২৬",
  },
  EUR: {
    rate: 130.0,
    source: "বাংলাদেশ ব্যাংক অফিশিয়াল বৈদেশিক মুদ্রা বিনিময় রেফারেন্স",
    effectiveDate: "নভেম্বর ২০২৬",
  },
  USD: {
    rate: 122.5,
    source: "বাংলাদেশ ব্যাংক অফিশিয়াল বৈদেশিক মুদ্রা বিনিময় রেফারেন্স",
    effectiveDate: "নভেম্বর ২০২৬",
  },
};

export function calculateFullBudgetPlan(
  params: CalculateBudgetParams
): FinancialBudgetPlanResult {
  const {
    countryCode,
    studyDurationYears = 1.0,
    grossTuitionAnnualLocal,
    tuitionDepositPaidLocal = 0,
    scholarshipDeductionLocal = 0,
    studentSavingsLocal = 0,
    sponsorContributionLocal = 0,
    educationLoanLocal = 0,
    monthlySavingsCapacityBdt = 0,
    monthsUntilDeparture = 6,
    isInsideLondonOrMetro = false,
  } = params;

  const rateInfo = VERIFIED_EXCHANGE_RATES[
    countryCode === "GB"
      ? "GBP"
      : countryCode === "CA"
      ? "CAD"
      : countryCode === "AU"
      ? "AUD"
      : countryCode === "DE"
      ? "EUR"
      : "USD"
  ] || {
    rate: 120.0,
    source: "বাংলাদেশ ব্যাংক রেফারেন্স",
    effectiveDate: "নভেম্বর ২০২৬",
  };

  const currencyCode =
    countryCode === "GB"
      ? "GBP"
      : countryCode === "CA"
      ? "CAD"
      : countryCode === "AU"
      ? "AUD"
      : countryCode === "DE"
      ? "EUR"
      : "USD";

  const rate = rateInfo.rate;

  const expenses: ExpenseCategoryItem[] = [];

  // ==========================================
  // PHASE 1: PRE-DEPARTURE COSTS (Bangladesh)
  // ==========================================
  let appFeeLocal = 50;
  if (countryCode === "DE") appFeeLocal = 75; // uni-assist
  else if (countryCode === "CA") appFeeLocal = 125;
  else if (countryCode === "AU") appFeeLocal = 100;
  else if (countryCode === "US") appFeeLocal = 85;

  expenses.push({
    id: "uni-app-fee",
    nameBn: "বিশ্ববিদ্যালয় আবেদন ফি (Application Fee)",
    nameEn: "University Application Fee",
    phase: "PRE_DEPARTURE",
    amountLocal: appFeeLocal,
    amountBdt: Math.round(appFeeLocal * rate),
    isVerifiedStatutory: false,
    citationSource: "গড় প্রাতিষ্ঠানিক প্রসেসিং ফি",
  });

  expenses.push({
    id: "language-test",
    nameBn: "ইংরেজি/জার্মান ভাষা পরীক্ষা ফি (IELTS / PTE / Goethe)",
    nameEn: "Language Test Fee",
    phase: "PRE_DEPARTURE",
    amountLocal: Math.round(23500 / rate),
    amountBdt: 23500,
    isVerifiedStatutory: true,
    citationSource: "British Council / IDP Bangladesh অফিসিয়াল ফি ২০২৬",
  });

  expenses.push({
    id: "doc-prep",
    nameBn: "সনদ অনুবাদ ও পররাষ্ট্র মন্ত্রণালয় সত্যায়ন (Notary & MOFA)",
    nameEn: "Document Preparation & Attestation",
    phase: "PRE_DEPARTURE",
    amountLocal: Math.round(8000 / rate),
    amountBdt: 8000,
    isVerifiedStatutory: false,
    citationSource: "শিক্ষা বোর্ড, শিক্ষা মন্ত্রণালয় ও নোটারি এস্টিমেট",
  });

  const isTbMandatory = countryCode === "GB" || countryCode === "AU" || countryCode === "CA";
  expenses.push({
    id: "medical-exam",
    nameBn: isTbMandatory
      ? "আইওএম যক্ষ্মা/টিবি পরীক্ষা ফি (IOM TB Screening, Dhaka/Sylhet)"
      : "সাধারণ মেডিকেল চেকআপ ফি",
    nameEn: "Medical Examination",
    phase: "PRE_DEPARTURE",
    amountLocal: Math.round(13500 / rate),
    amountBdt: 13500,
    isVerifiedStatutory: isTbMandatory,
    citationSource: isTbMandatory
      ? "IOM Migration Health Assessment Center Dhaka/Sylhet নির্ধারিত ফি"
      : "প্যানেল ক্লিনিক সাধারণ ফি",
    effectiveDate: "২০২৬",
  });

  if (countryCode === "CA" || countryCode === "AU") {
    expenses.push({
      id: "police-clearance",
      nameBn: "অনলাইন পুলিশ ক্লিয়ারেন্স সনদ ফি (Bangladesh Police)",
      nameEn: "Police Clearance Certificate",
      phase: "PRE_DEPARTURE",
      amountLocal: Math.round(1000 / rate),
      amountBdt: 1000,
      isVerifiedStatutory: true,
      citationSource: "বাংলাদেশ পুলিশ অফিসিয়াল চালান কোড",
    });
  }

  // ==========================================
  // PHASE 2: STATUTORY IMMIGRATION & HEALTH FEES
  // ==========================================
  let visaFeeLocal = 0;
  let biometricsFeeLocal = 0;
  let healthInsuranceLocal = 0;
  let countrySpecificLocal = 0;

  switch (countryCode) {
    case "GB":
      visaFeeLocal = 490;
      healthInsuranceLocal = 776; // IHS per year
      break;
    case "DE":
      visaFeeLocal = 75;
      healthInsuranceLocal = 1440; // ~€120/mo TK
      countrySpecificLocal = 89; // Expatrio/Coracle setup
      break;
    case "US":
      visaFeeLocal = 185; // MRV
      countrySpecificLocal = 350; // SEVIS I-901
      healthInsuranceLocal = 1800; // University insurance
      break;
    case "CA":
      visaFeeLocal = 150;
      biometricsFeeLocal = 85;
      healthInsuranceLocal = 800;
      break;
    case "AU":
      visaFeeLocal = 1600;
      healthInsuranceLocal = 700; // OSHC
      break;
  }

  expenses.push({
    id: "visa-fee",
    nameBn: "সরকারি স্টুডেন্ট ভিসা আবেদন ফি",
    nameEn: "Visa Application Fee",
    phase: "STATUTORY_IMMIGRATION",
    amountLocal: visaFeeLocal,
    amountBdt: Math.round(visaFeeLocal * rate),
    isVerifiedStatutory: true,
    citationSource: "সংশ্লিষ্ট দেশের অফিশিয়াল অভিবাসন অধিদপ্তর",
    effectiveDate: "২০২৬",
  });

  if (biometricsFeeLocal > 0) {
    expenses.push({
      id: "biometrics-fee",
      nameBn: "ভিএফএস গ্লোবাল বায়োমেট্রিক ফি (Biometrics Fee)",
      nameEn: "Biometrics Fee",
      phase: "STATUTORY_IMMIGRATION",
      amountLocal: biometricsFeeLocal,
      amountBdt: Math.round(biometricsFeeLocal * rate),
      isVerifiedStatutory: true,
      citationSource: "ইমিগ্রেশন, রিফিউজিস অ্যান্ড সিটিজেনশিপ কানাডা (IRCC)",
    });
  }

  expenses.push({
    id: "health-insurance",
    nameBn:
      countryCode === "GB"
        ? "ইউকে ইমিগ্রেশন হেলথ সারচার্জ (IHS Health Surcharge)"
        : countryCode === "DE"
        ? "জার্মান সরকারি স্বাস্থ্য বীমা (TK / Barmer Statutory Health)"
        : countryCode === "AU"
        ? "অস্ট্রেলিয়ান ওভারসিজ স্টুডেন্ট হেলথ কভার (OSHC)"
        : "আন্তর্জাতিক স্টুডেন্ট স্বাস্থ্য বীমা",
    nameEn: "Health Insurance / Surcharge",
    phase: "STATUTORY_IMMIGRATION",
    amountLocal: healthInsuranceLocal,
    amountBdt: Math.round(healthInsuranceLocal * rate),
    isVerifiedStatutory: true,
    citationSource: "সরকারি সংবিধিবদ্ধ স্বাস্থ্য সুরক্ষা নীতিমালা",
    effectiveDate: "২০২৬",
  });

  if (countrySpecificLocal > 0) {
    expenses.push({
      id: "country-specific",
      nameBn:
        countryCode === "DE"
          ? "ব্লকড একাউন্ট সেটআপ ও সার্ভিস ফি (Sperrkonto Setup Fee)"
          : "সেভিস আই-৯০১ ফি (SEVIS I-901 Fee)",
      nameEn: countryCode === "DE" ? "Blocked Account Setup Fee" : "SEVIS I-901 Fee",
      phase: "STATUTORY_IMMIGRATION",
      amountLocal: countrySpecificLocal,
      amountBdt: Math.round(countrySpecificLocal * rate),
      isVerifiedStatutory: true,
      citationSource:
        countryCode === "DE"
          ? "Expatrio / Coracle অফিসিয়াল সার্ভিস চার্জ"
          : "U.S. Department of Homeland Security / SEVP",
    });
  }

  // ==========================================
  // PHASE 3: TRAVEL & INITIAL SETTLEMENT
  // ==========================================
  let flightTicketBdt = 90000;
  if (countryCode === "US" || countryCode === "CA") flightTicketBdt = 115000;
  else if (countryCode === "DE") flightTicketBdt = 85000;
  else if (countryCode === "GB") flightTicketBdt = 95000;

  expenses.push({
    id: "flight-ticket",
    nameBn: "ঢাকা থেকে গন্তব্য দেশের একমুখী/রিটার্ন বিমান টিকিট",
    nameEn: "Flight Ticket (DAC)",
    phase: "TRAVEL_SETTLEMENT",
    amountLocal: Math.round(flightTicketBdt / rate),
    amountBdt: flightTicketBdt,
    isVerifiedStatutory: false,
    citationSource: "এয়ারলাইনস গড় ইকোনমি সিজনাল ফেয়ার",
  });

  let initialSettlementLocal = 800;
  if (countryCode === "DE") initialSettlementLocal = 600;
  else if (countryCode === "US") initialSettlementLocal = 1000;
  else if (countryCode === "CA") initialSettlementLocal = 1200;
  else if (countryCode === "AU") initialSettlementLocal = 1500;

  expenses.push({
    id: "initial-settlement",
    nameBn: "প্রারম্ভিক বসতি স্থাপন বাফার (প্রথম ২ সপ্তাহের খাবার, সিম, শীতের পোশাক)",
    nameEn: "Initial Settlement Buffer",
    phase: "TRAVEL_SETTLEMENT",
    amountLocal: initialSettlementLocal,
    amountBdt: Math.round(initialSettlementLocal * rate),
    isVerifiedStatutory: false,
    citationSource: "বাস্তব আন্তর্জাতিক শিক্ষার্থী অভিজ্ঞতা ও ব্যয়ের গড়",
  });

  // ==========================================
  // PHASE 4: ACADEMIC & LIVING COSTS (1st Year)
  // ==========================================
  const netTuitionFirstYear = Math.max(0, grossTuitionAnnualLocal - scholarshipDeductionLocal);

  expenses.push({
    id: "tuition-fee-net",
    nameBn: `১ম শিক্ষাবর্ষের নিট টিউশন ফি (স্কলারশিপ বাদ দিয়ে)`,
    nameEn: "Net Annual Tuition Fee",
    phase: "LIVING_STUDY",
    amountLocal: netTuitionFirstYear,
    amountBdt: Math.round(netTuitionFirstYear * rate),
    isVerifiedStatutory: true,
    citationSource: "বিশ্ববিদ্যালয়ের প্রাতিষ্ঠানিক প্রসপেক্টাস ও স্কলারশিপ অনুমোদন",
  });

  let statutoryLivingAnnual = 0;
  let isLivingStatutory = false;
  let livingCitation = "";

  switch (countryCode) {
    case "GB":
      statutoryLivingAnnual = isInsideLondonOrMetro ? 1334 * 9 : 1023 * 9;
      isLivingStatutory = true;
      livingCitation = "UKVI সংবিধিবদ্ধ ৯ মাসের মেইনটেন্যান্স রুল (£১,০২৩/মাস বাইরে, £১,৩৩৪/মাস ভেতরে)";
      break;
    case "DE":
      statutoryLivingAnnual = 11904;
      isLivingStatutory = true;
      livingCitation = "জার্মান ফেডারেল সরকার নির্ধারিত বার্ষিক ব্লকড একাউন্ট সংবিধিবদ্ধ অঙ্ক (€৯৯২/মাস)";
      break;
    case "US":
      statutoryLivingAnnual = 15000;
      isLivingStatutory = true;
      livingCitation = "মার্কিন বিশ্ববিদ্যালয় Form I-20 জীবনযাত্রার গড় আবশ্যক বেঞ্চমার্ক";
      break;
    case "CA":
      statutoryLivingAnnual = 20635;
      isLivingStatutory = true;
      livingCitation = "IRCC কানাডা সরকারের সংবিধিবদ্ধ বার্ষিক লিভিং কস্ট বেঞ্চমার্ক";
      break;
    case "AU":
      statutoryLivingAnnual = 29710 + 2000; // 29,710 + 2,000 statutory travel
      isLivingStatutory = true;
      livingCitation = "ডিপার্টমেন্ট অব হোম অ্যাফেয়ার্স অস্ট্রেলিয়া নির্ধারিত সাবক্লাস ৫০০ ফান্ড বেঞ্চমার্ক";
      break;
  }

  expenses.push({
    id: "living-cost-annual",
    nameBn: "১ম বছরের জীবনযাত্রার সংবিধিবদ্ধ খরচ (বাসা ভাড়া, খাবার ও যাতায়াত)",
    nameEn: "Annual Living & Accommodation Cost",
    phase: "LIVING_STUDY",
    amountLocal: statutoryLivingAnnual,
    amountBdt: Math.round(statutoryLivingAnnual * rate),
    isVerifiedStatutory: isLivingStatutory,
    citationSource: livingCitation,
    effectiveDate: "২০২৬",
  });

  const emergencyFundLocal = Math.round((netTuitionFirstYear + statutoryLivingAnnual) * 0.05);
  expenses.push({
    id: "emergency-contingency",
    nameBn: "জরুরি অপ্রত্যাশিত ব্যয় তহবিল (৫% Emergency Buffer)",
    nameEn: "Emergency Contingency Fund",
    phase: "LIVING_STUDY",
    amountLocal: emergencyFundLocal,
    amountBdt: Math.round(emergencyFundLocal * rate),
    isVerifiedStatutory: false,
    citationSource: "আর্থিক ঝুঁকি হ্রাসকরণের স্ট্যান্ডার্ড ফাইন্যান্সিয়াল বাফার",
  });

  // ==========================================
  // AGGREGATION & MULTI-YEAR PROJECTIONS
  // ==========================================
  const preDepartureTotalBdt = expenses
    .filter((e) => e.phase === "PRE_DEPARTURE")
    .reduce((sum, e) => sum + e.amountBdt, 0);

  const statutoryFeesTotalLocal = expenses
    .filter((e) => e.phase === "STATUTORY_IMMIGRATION")
    .reduce((sum, e) => sum + e.amountLocal, 0);
  const statutoryFeesTotalBdt = Math.round(statutoryFeesTotalLocal * rate);

  const travelAndSettlementTotalLocal = expenses
    .filter((e) => e.phase === "TRAVEL_SETTLEMENT")
    .reduce((sum, e) => sum + e.amountLocal, 0);
  const travelAndSettlementTotalBdt = expenses
    .filter((e) => e.phase === "TRAVEL_SETTLEMENT")
    .reduce((sum, e) => sum + e.amountBdt, 0);

  const academicAndLivingFirstYearLocal = expenses
    .filter((e) => e.phase === "LIVING_STUDY")
    .reduce((sum, e) => sum + e.amountLocal, 0);
  const academicAndLivingFirstYearBdt = Math.round(academicAndLivingFirstYearLocal * rate);

  // Total 1st Year Costs
  const firstYearTotalCostLocal =
    Math.round(preDepartureTotalBdt / rate) +
    statutoryFeesTotalLocal +
    travelAndSettlementTotalLocal +
    academicAndLivingFirstYearLocal;

  const firstYearTotalCostBdt =
    preDepartureTotalBdt +
    statutoryFeesTotalBdt +
    travelAndSettlementTotalBdt +
    academicAndLivingFirstYearBdt;

  // Full Degree Cost Projection
  const oneTimeCostsLocal =
    Math.round(preDepartureTotalBdt / rate) + visaFeeLocal + biometricsFeeLocal + travelAndSettlementTotalLocal;

  const totalDegreeCostLocal = Math.round(
    oneTimeCostsLocal +
      (netTuitionFirstYear + statutoryLivingAnnual + healthInsuranceLocal) * studyDurationYears
  );
  const totalDegreeCostBdt = Math.round(totalDegreeCostLocal * rate);

  // Available Funds & Funding Gap
  const totalAvailableFundsLocal =
    studentSavingsLocal + sponsorContributionLocal + educationLoanLocal + tuitionDepositPaidLocal;
  const totalAvailableFundsBdt = Math.round(totalAvailableFundsLocal * rate);

  const fundingGapLocal = Math.max(0, firstYearTotalCostLocal - totalAvailableFundsLocal);
  const fundingGapBdt = Math.max(0, firstYearTotalCostBdt - totalAvailableFundsBdt);

  // Monthly Savings Target & Feasibility
  const validMonths = Math.max(1, monthsUntilDeparture);
  const targetMonthlySavingsBdt = Math.round(fundingGapBdt / validMonths);

  let savingsFeasibility: "SURPLUS" | "FEASIBLE" | "CHALLENGING" | "HIGH_GAP" = "FEASIBLE";
  let feasibilityRecommendationBn = "";

  if (fundingGapBdt <= 0) {
    savingsFeasibility = "SURPLUS";
    feasibilityRecommendationBn =
      "অভিনন্দন! আপনার প্রস্তুতকৃত ফান্ড ১ম বছরের মোট খরচের চেয়ে বেশি রয়েছে। আপনি সম্পূর্ণ নিরাপদ আর্থিক অবস্থানে আছেন।";
  } else if (monthlySavingsCapacityBdt > 0 && targetMonthlySavingsBdt <= monthlySavingsCapacityBdt) {
    savingsFeasibility = "FEASIBLE";
    feasibilityRecommendationBn = `আপনার ঘোষিত মাসিক সঞ্চয় সক্ষমতার (৳${monthlySavingsCapacityBdt.toLocaleString()}) মধ্যে প্রতি মাসে ৳${targetMonthlySavingsBdt.toLocaleString()} সঞ্চয় করে দেশত্যাগের পূর্বেই ঘাটতি পূরণ সম্ভব।`;
  } else if (
    monthlySavingsCapacityBdt > 0 &&
    targetMonthlySavingsBdt <= monthlySavingsCapacityBdt * 1.5
  ) {
    savingsFeasibility = "CHALLENGING";
    feasibilityRecommendationBn = `টার্গেট পূরণ কিছুটা চ্যালেঞ্জিং। প্রতি মাসে ৳${targetMonthlySavingsBdt.toLocaleString()} সঞ্চয় প্রয়োজন, যা আপনার বর্তমান ক্ষমতার চেয়ে কিছুটা বেশি। পরিবার থেকে অতিরিক্ত সহায়তা বা আংশিক শিক্ষা ঋণের আবেদন বিবেচনা করতে পারেন।`;
  } else {
    savingsFeasibility = "HIGH_GAP";
    feasibilityRecommendationBn = `ফান্ডের ঘাটতি বড় (প্রতি মাসে ৳${targetMonthlySavingsBdt.toLocaleString()} সঞ্চয় প্রয়োজন)। জরুরি ভিত্তিতে অতিরিক্ত স্কলারশিপ, ব্যাংক স্টুডেন্ট লোন অথবা কম টিউশন ফির বিকল্প প্রতিষ্ঠান অনুসন্ধান করার পরামর্শ দেওয়া হচ্ছে।`;
  }

  // Chart Distribution
  const tuitionPercent = Math.round((netTuitionFirstYear / firstYearTotalCostLocal) * 100);
  const livingPercent = Math.round((statutoryLivingAnnual / firstYearTotalCostLocal) * 100);
  const statutoryFeesPercent = Math.round((statutoryFeesTotalLocal / firstYearTotalCostLocal) * 100);
  const travelSettlementPercent = Math.round((travelAndSettlementTotalLocal / firstYearTotalCostLocal) * 100);
  const preDeparturePercent = Math.max(
    1,
    100 - (tuitionPercent + livingPercent + statutoryFeesPercent + travelSettlementPercent)
  );

  return {
    countryCode,
    currencyCode,
    exchangeRateToBdt: rate,
    exchangeRateSource: rateInfo.source,
    exchangeRateTimestamp: `${rateInfo.effectiveDate} (বাংলাদেশ ব্যাংক রেফারেন্স)`,
    studyDurationYears,
    expenses,
    preDepartureTotalBdt,
    statutoryFeesTotalLocal,
    statutoryFeesTotalBdt,
    travelAndSettlementTotalLocal,
    travelAndSettlementTotalBdt,
    academicAndLivingFirstYearLocal,
    academicAndLivingFirstYearBdt,
    firstYearTotalCostLocal,
    firstYearTotalCostBdt,
    totalDegreeCostLocal,
    totalDegreeCostBdt,
    totalAvailableFundsLocal,
    totalAvailableFundsBdt,
    fundingGapLocal,
    fundingGapBdt,
    monthsUntilDeparture: validMonths,
    targetMonthlySavingsBdt,
    monthlySavingsCapacityBdt,
    savingsFeasibility,
    feasibilityRecommendationBn,
    chartDistribution: {
      tuitionPercent,
      livingPercent,
      statutoryFeesPercent,
      travelSettlementPercent,
      preDeparturePercent,
    },
  };
}
