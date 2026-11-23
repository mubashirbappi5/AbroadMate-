import { convertToBdt, INITIAL_COUNTRIES } from "@abroadmate/shared";
import { DetailedFinancialBreakdown } from "./types";
import { CountryCodeType, SponsorType } from "@abroadmate/validation";

export interface CalculateFinancialsParams {
  countryCode: CountryCodeType;
  tuitionFeeLocal: number;
  tuitionPaidLocal?: number;
  isInsideLondon?: boolean;
  availableLiquidFundsLocal?: number;
  fundsHoldingDays?: number;
  sponsorType?: SponsorType;
  scholarshipFundingBdt?: number;
  dependentSpouseCount?: number;
  dependentChildCount?: number;
}

export function calculateDetailedFinancialProof(
  params: CalculateFinancialsParams
): DetailedFinancialBreakdown {
  const {
    countryCode,
    tuitionFeeLocal,
    tuitionPaidLocal = 0,
    isInsideLondon = false,
    availableLiquidFundsLocal = 0,
    fundsHoldingDays = 0,
    sponsorType = "PARENTS",
    scholarshipFundingBdt = 0,
    dependentSpouseCount = 0,
    dependentChildCount = 0,
  } = params;

  const country = INITIAL_COUNTRIES[countryCode];
  const currencyCode = country?.currency.code ?? "BDT";

  let livingFundsRequired = 0;
  let visaApplicationFee = 0;
  let healthInsurance = 0;
  let travelExpense = 0;
  let dependentExpenses = 0;
  let maintenancePeriodDays = 28;
  let holdingRuleNotice = "";
  let isSponsorAccepted = false;
  let sponsorEvaluation = "";

  const tuitionRemaining = Math.max(0, tuitionFeeLocal - tuitionPaidLocal);

  switch (countryCode) {
    case "GB": {
      // UKVI Student Route: London: £1,334/mo for 9 mos (£12,006). Outside London: £1,023/mo for 9 mos (£9,207).
      livingFundsRequired = isInsideLondon ? 1334 * 9 : 1023 * 9;
      visaApplicationFee = 490;
      healthInsurance = 776; // IHS per year
      travelExpense = 0;
      maintenancePeriodDays = 28;
      holdingRuleNotice =
        "UK 28-Day Rule: ভিসার আবেদন করার তারিখের পূর্বে টানা ২৮ দিন ব্যাংক একাউন্টে পুরো ব্যালেন্স এক পয়সাও না কমে অক্ষুণ্ণ থাকতে হবে (End date of statement must be within 31 days of application)।";

      // UKVI rules for sponsors: Only Self or biological/legal Parents
      if (sponsorType === "SELF" || sponsorType === "PARENTS") {
        isSponsorAccepted = true;
        sponsorEvaluation =
          sponsorType === "PARENTS"
            ? "পিতা-মাতার স্পনসরশিপ UKVI দ্বারা অনুমোদিত। আবেদনের সাথে শিক্ষার্থীর জন্ম সনদ (Birth Certificate) এবং পিতা-মাতার স্পনসরশিপ কনসেন্ট লেটার দেওয়া বাধ্যতামূলক।"
            : "শিক্ষার্থীর নিজস্ব ব্যাংক একাউন্টের ফান্ড UKVI কর্তৃক সরাসরি গ্রহণযোগ্য।";
      } else if (sponsorType === "GOVERNMENT_SCHOLARSHIP" || sponsorType === "UNIVERSITY_SCHOLARSHIP") {
        isSponsorAccepted = true;
        sponsorEvaluation = "অফিসিয়াল স্কলারশিপ লেটার UKVI ফাইনান্সিয়াল প্রমাণ হিসেবে শতভাগ গ্রহণযোগ্য।";
      } else {
        isSponsorAccepted = false;
        sponsorEvaluation =
          "সতর্কতা: ইউকে ভিসা ও ইমিগ্রেশন (UKVI) নিয়ম অনুযায়ী চাচা, মামা, খালা বা দূরবর্তী আত্মীয়ের ব্যাংক একাউন্ট স্পনসর হিসেবে সরাসরি গ্রহণযোগ্য নয়। শুধুমাত্র শিক্ষার্থী নিজে বা তার পিতা-মাতা স্পনসর হতে পারেন।";
      }
      break;
    }

    case "DE": {
      // Germany: Sperrkonto statutory benchmark is €11,904/year (€992/month). Visa fee €75. Health insurance ~€1,440/yr.
      livingFundsRequired = 11904;
      visaApplicationFee = 75;
      healthInsurance = 1440;
      travelExpense = 0;
      maintenancePeriodDays = 0; // Transferred to blocked account
      holdingRuleNotice =
        "জার্মান ভিসার ক্ষেত্রে ঢাকাস্থ জার্মান দূতাবাসে ইন্টারভিউ দেওয়ার পূর্বেই অনুমোদিত জার্মান প্রোভাইডারে (Expatrio, Coracle বা Fintiba) পুরো ১১,৯০৪ ইউরো ব্লকড একাউন্টে ট্রান্সফার করে ব্লকড ব্যালেন্স কনফার্মেশন সংগ্রহ করতে হবে।";

      if (
        sponsorType === "SELF" ||
        sponsorType === "PARENTS" ||
        sponsorType === "GOVERNMENT_SCHOLARSHIP" ||
        sponsorType === "UNIVERSITY_SCHOLARSHIP"
      ) {
        isSponsorAccepted = true;
        sponsorEvaluation =
          "ব্লকড অ্যাকাউন্টে সম্পূর্ণ টাকা জমা দেওয়ার মাধ্যমে নিজস্ব বা পিতা-মাতার ফান্ড গ্রহণযোগ্য।";
      } else {
        isSponsorAccepted = true;
        sponsorEvaluation =
          "জার্মানিতে বসবাসকারী কোনো স্পনসরের মাধ্যমে Verpflichtungserklärung (অফিসিয়াল স্পনসরশিপ লেটার) থাকলে ব্লকড একাউন্ট ছাড় পাওয়া সম্ভব, অন্যথায় ব্লকড একাউন্ট ডিপোজিট বাধ্যতামূলক।";
      }
      break;
    }

    case "US": {
      // USA F-1: Full 1st year living cost stated on I-20 (~$15,000 baseline). SEVIS I-901 ($350) + MRV Visa fee ($185) = $535. Insurance $1,500.
      livingFundsRequired = 15000;
      visaApplicationFee = 535; // $350 SEVIS + $185 MRV
      healthInsurance = 1500;
      travelExpense = 0;
      maintenancePeriodDays = 0; // Liquid at time of application/interview
      holdingRuleNotice =
        "মার্কিন ফর্ম I-20 তে উল্লেখিত প্রথম বছরের সম্পূর্ণ খরচের সমপরিমাণ অর্থ লিকুইড ফান্ড (সেভিংস বা মেয়াদী আমানত) হিসেবে ব্যাংকে থাকতে হবে। ব্যাংক স্টেটমেন্টের সাথে আয়ের উৎস ও পিতা-মাতার ট্যাক্স রিটার্ন (TIN) থাকা অত্যন্ত গুরুত্বপূর্ণ।";

      if (sponsorType === "SELF" || sponsorType === "PARENTS") {
        isSponsorAccepted = true;
        sponsorEvaluation =
          "পিতা-মাতার স্পনসরশিপ মার্কিন কনস্যুলার ইন্টারভিউতে সবচেয়ে নির্ভরযোগ্য হিসেবে বিবেচিত। তাদের আয়ের উৎস, বাৎসরিক আয় ও ট্যাক্স ফাইল স্বচ্ছ হতে হবে।";
      } else if (sponsorType === "GOVERNMENT_SCHOLARSHIP" || sponsorType === "UNIVERSITY_SCHOLARSHIP") {
        isSponsorAccepted = true;
        sponsorEvaluation = "আমেরিকান বিশ্ববিদ্যালয় কর্তৃক প্রদত্ত টিএ/আরএ অ্যাসিস্ট্যান্টশিপ বা স্কলারশিপ I-20 তে প্রদর্শিত থাকলে তা শতভাগ গ্রহণযোগ্য।";
      } else if (sponsorType === "BANK_LOAN") {
        isSponsorAccepted = true;
        sponsorEvaluation = "বাংলাদেশ ব্যাংক কর্তৃক অনুমোদিত তফসিলি ব্যাংকের এডুকেশন লোন সেংশন লেটার গ্রহণযোগ্য।";
      } else {
        isSponsorAccepted = true;
        sponsorEvaluation =
          "নিকটাত্মীয় স্পনসর হলে তার Affidavit of Support (Form I-134), ব্যাংক সলভেন্সি ও ট্যাক্স রেকর্ড প্রদান করতে হবে। কনস্যুলার অফিসার স্পনসরের সাথে সম্পর্কের গভীরতা যাচাই করতে পারেন।";
      }
      break;
    }

    case "CA": {
      // Canada: Cost of living benchmark CAD 20,635/yr. Visa fee CAD 150 + Biometrics CAD 85 = 235. Health insurance ~CAD 800.
      livingFundsRequired = 20635;
      visaApplicationFee = 235;
      healthInsurance = 800;
      travelExpense = 0;
      maintenancePeriodDays = 120; // 4 months historical statement recommended by IRCC
      holdingRuleNotice =
        "কানাডার স্টাডি পারমিটের জন্য প্রথম বছরের পূর্ণ টিউশন ফি এবং ২০,৬৩৫ কানাডিয়ান ডলারের লিভিং কস্টের বিপরীতে কমপক্ষে ৪ থেকে ৬ মাসের ধারাবাহিক ও স্বাভাবিক ব্যাংক হিস্ট্রি দেখাতে হবে। হঠাৎ জমা করা বড় অঙ্কের টাকা (Unexplained Lump-sum deposit) কঠোরভাবে অগ্রহণযোগ্য।";

      if (sponsorType === "SELF" || sponsorType === "PARENTS") {
        isSponsorAccepted = true;
        sponsorEvaluation =
          "পিতা-মাতার স্পনসরশিপের ক্ষেত্রে তাদের গত ২-৩ বছরের আয়কর প্রত্যয়নপত্র (TIN), ট্রেড লাইসেন্স বা বেতন সনদ এবং সম্পত্তির বিবরণী সাথে যুক্ত করতে হবে।";
      } else if (sponsorType === "GOVERNMENT_SCHOLARSHIP" || sponsorType === "UNIVERSITY_SCHOLARSHIP") {
        isSponsorAccepted = true;
        sponsorEvaluation = "স্কলারশিপ লেটার গ্রহণযোগ্য।";
      } else {
        isSponsorAccepted = false;
        sponsorEvaluation =
          "কানাডার ক্ষেত্রে পিতা-মাতা ব্যতীত দূরবর্তী আত্মীয়ের স্পনসরশিপে ভিসা রিফিউজালের উচ্চ ঝুঁকি থাকে (IRCC Financial Inadequacy / Lack of established ties)।";
      }
      break;
    }

    case "AU": {
      // Australia Subclass 500: Cost of living AUD 29,710/yr. Travel AUD 2,000. Visa fee AUD 1,600. OSHC health insurance AUD 700.
      livingFundsRequired = 29710;
      visaApplicationFee = 1600;
      healthInsurance = 700;
      travelExpense = 2000;
      maintenancePeriodDays = 90; // 3 months seasoned funds
      holdingRuleNotice =
        "অস্ট্রেলিয়ার নিয়ম অনুযায়ী ব্যাংক একাউন্টে প্রদর্শিত অর্থ অন্তত ৩ মাস বা ৯ সেসন পুরাতন হতে হবে অথবা অনুমোদিত ব্যাংক থেকে স্টুডেন্ট লোন অনুমোদনপত্র দেখাতে হবে।";

      if (sponsorType === "SELF" || sponsorType === "PARENTS") {
        isSponsorAccepted = true;
        sponsorEvaluation =
          "পিতা-মাতার স্পনসরশিপ অস্ট্রেলিয়ার ডিপার্টমেন্ট অব হোম অ্যাফেয়ার্স দ্বারা সরাসরি স্বীকৃত। স্পনসরের বাৎসরিক ট্যাক্স রিটার্ন ও বাৎসরিক আয় পর্যাপ্ত হতে হবে।";
      } else if (sponsorType === "BANK_LOAN") {
        isSponsorAccepted = true;
        sponsorEvaluation = "অনুমোদিত ব্যাংক থেকে স্টুডেন্ট লোনের স্যাংশন লেটার ও বিতরণ প্রমাণ গ্রহণযোগ্য।";
      } else if (sponsorType === "GOVERNMENT_SCHOLARSHIP" || sponsorType === "UNIVERSITY_SCHOLARSHIP") {
        isSponsorAccepted = true;
        sponsorEvaluation = "অস্ট্রেলিয়া অ্যাওয়ার্ডস বা বিশ্ববিদ্যালয়ের ফুল স্কলারশিপ আর্থিক প্রমাণের শর্ত পূরণ করে।";
      } else {
        isSponsorAccepted = false;
        sponsorEvaluation =
          "অস্ট্রেলিয়ায় নিকটাত্মীয় ছাড়া কোনো তৃতীয় পক্ষের স্পনসরশিপ গ্রহণযোগ্য নয়। পিতা-মাতা, স্ত্রী বা সরাসরি রক্তসম্পর্কিত অভিভাবক স্পনসর হওয়া আবশ্যক।";
      }
      break;
    }
  }

  // Dependents calculation if any
  if (dependentSpouseCount > 0) {
    dependentExpenses += livingFundsRequired * 0.35 * dependentSpouseCount;
  }
  if (dependentChildCount > 0) {
    dependentExpenses += livingFundsRequired * 0.2 * dependentChildCount;
  }

  const totalFundsRequiredLocal =
    tuitionRemaining +
    livingFundsRequired +
    visaApplicationFee +
    healthInsurance +
    travelExpense +
    dependentExpenses;

  const totalFundsRequiredBdt = convertToBdt(totalFundsRequiredLocal, currencyCode);

  // Convert available liquid funds
  const availableLiquidFundsBdt = convertToBdt(availableLiquidFundsLocal, currencyCode);

  // Offset scholarship if provided
  const effectiveAvailableLocal =
    availableLiquidFundsLocal +
    (scholarshipFundingBdt > 0 ? scholarshipFundingBdt / (totalFundsRequiredBdt / totalFundsRequiredLocal) : 0);

  const financialGapLocal = Math.max(0, totalFundsRequiredLocal - effectiveAvailableLocal);
  const financialGapBdt = convertToBdt(financialGapLocal, currencyCode);

  const isHoldingPeriodSatisfied = fundsHoldingDays >= maintenancePeriodDays;

  return {
    countryCode,
    currencyCode,
    tuitionFeeLocal,
    tuitionPaidLocal,
    tuitionRemainingLocal: tuitionRemaining,
    livingFundsRequiredLocal: livingFundsRequired,
    travelExpenseLocal: travelExpense,
    healthInsuranceLocal: healthInsurance,
    visaApplicationFeeLocal: visaApplicationFee,
    dependentExpensesLocal: dependentExpenses,
    totalFundsRequiredLocal,
    totalFundsRequiredBdt,
    availableLiquidFundsLocal,
    availableLiquidFundsBdt,
    financialGapLocal,
    financialGapBdt,
    maintenancePeriodDaysRequired: maintenancePeriodDays,
    maintenancePeriodDaysActual: fundsHoldingDays,
    isHoldingPeriodSatisfied,
    sponsorType,
    isSponsorAccepted,
    sponsorEvaluationBn: sponsorEvaluation,
    holdingRuleNoticeBn: holdingRuleNotice,
  };
}

export interface VisaExpenseBreakdown {
  countryCode: string;
  currencyCode: string;
  tuitionFeeLocal: number;
  livingFundsRequiredLocal: number;
  visaApplicationFeeLocal: number;
  healthInsuranceLocal: number;
  totalLocal: number;
  totalBdtApprox: number;
  holdingRuleNoticeBn: string;
  sponsorGuidelineBn: string;
}

export function calculateVisaFinancialProof(
  countryCode: "GB" | "CA" | "AU" | "DE" | "US",
  tuitionFeeLocal: number,
  isInsideLondonOrMetro = false
): VisaExpenseBreakdown {
  const detailed = calculateDetailedFinancialProof({
    countryCode,
    tuitionFeeLocal,
    isInsideLondon: isInsideLondonOrMetro,
  });
  return {
    countryCode: detailed.countryCode,
    currencyCode: detailed.currencyCode,
    tuitionFeeLocal: detailed.tuitionFeeLocal,
    livingFundsRequiredLocal: detailed.livingFundsRequiredLocal,
    visaApplicationFeeLocal: detailed.visaApplicationFeeLocal,
    healthInsuranceLocal: detailed.healthInsuranceLocal,
    totalLocal: detailed.totalFundsRequiredLocal,
    totalBdtApprox: detailed.totalFundsRequiredBdt,
    holdingRuleNoticeBn: detailed.holdingRuleNoticeBn,
    sponsorGuidelineBn: detailed.sponsorEvaluationBn,
  };
}

