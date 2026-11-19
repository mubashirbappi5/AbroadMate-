import { convertToBdt, INITIAL_COUNTRIES } from "@abroadmate/shared";

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
  const country = INITIAL_COUNTRIES[countryCode];
  const currencyCode = country?.currency.code ?? "BDT";

  let livingFunds = 0;
  let visaFee = 0;
  let healthInsurance = 0;
  let holdingNotice = "";
  let sponsorGuideline = "";

  switch (countryCode) {
    case "DE":
      // Germany: Blocked Account is €11,904/year. Visa fee is €75. Health insurance ~€120/mo = €1,440/yr.
      livingFunds = 11904;
      visaFee = 75;
      healthInsurance = 1440;
      holdingNotice = "ভিসা আবেদনের পূর্বে অনুমোদিত জার্মান ব্যাংকে (যেমন Expatrio, Coracle বা Fintiba) পুরো ১১,৯০৪ ইউরো ব্লকড অ্যাকাউন্টে ট্রান্সফার করতে হয়।";
      sponsorGuideline = "জার্মানিতে বৈধ বসবাসকারী কোনো ব্যক্তির Verpflichtungserklärung (অফিসিয়াল স্পনসরশিপ লেটার) থাকলে ব্লকড অ্যাকাউন্ট থেকে অব্যাহতি পাওয়া যেতে পারে।";
      break;

    case "GB":
      // UK: 9 months of living cost (£1,334/mo London, £1,023/mo Outside London). Visa fee £490. IHS £776/year.
      livingFunds = isInsideLondonOrMetro ? 1334 * 9 : 1023 * 9;
      visaFee = 490;
      healthInsurance = 776; // IHS
      holdingNotice = "টিউশনের অবশিষ্ট অর্থ এবং লিভিং খরচের মোট টাকা ভিসা আবেদনের পূর্বে টানা ২৮ দিন ব্যাংক একাউন্টে অবিচ্ছিন্নভাবে থাকতে হবে (UK 28-day rule)।";
      sponsorGuideline = "শুধুমাত্র শিক্ষার্থী নিজে অথবা তার বাবা-মা স্পনসর হতে পারেন (জন্ম সনদ ও প্রত্যয়নপত্র সংযুক্ত করতে হবে)। দূরবর্তী আত্মীয়ের স্পনসরশিপ গ্রহণযোগ্য নয়।";
      break;

    case "CA":
      // Canada: Cost of living benchmark CAD 20,635/yr. Visa fee CAD 150 + Biometrics CAD 85 = 235. Health insurance ~CAD 800.
      livingFunds = 20635;
      visaFee = 235;
      healthInsurance = 800;
      holdingNotice = "কানাডার ক্ষেত্রে প্রথম বছরের পূর্ণ টিউশন ফি পরিশোধের প্রমাণ এবং লিভিং খরচের জন্য অন্তত ৪-৬ মাসের নিয়মিত ব্যাংক হিস্ট্রি বা GIC থাকা আবশ্যক।";
      sponsorGuideline = "পিতা-মাতার আয়ের উৎস, ট্যাক্স রিটার্ন (TIN) এবং ব্যাংক সলভেন্সি অত্যন্ত স্বচ্ছ হতে হবে।";
      break;

    case "AU":
      // Australia: Cost of living AUD 29,710/yr. Visa fee AUD 1,600. OSHC health insurance ~AUD 700. Travel return ~AUD 2,000.
      livingFunds = 29710 + 2000;
      visaFee = 1600;
      healthInsurance = 700;
      holdingNotice = "অস্ট্রেলিয়ায় ফান্ড প্রুফের ক্ষেত্রে ন্যূনতম ৩ মাসের পুরাতন জেনুইন ফান্ড অথবা অনুমোদিত ব্যাংক থেকে স্টুডেন্ট লোনের অনুমোদন প্রদর্শন করতে হয়।";
      sponsorGuideline = "বাবা-মা বা নিকটাত্মীয় স্পনসর হতে পারেন। স্পনসরের বার্ষিক আয় ও আয়ের প্রমাণপত্র প্রদর্শন করা বাধ্যতামূলক।";
      break;

    case "US":
      // USA: 1 full academic year living cost + SEVIS I-901 ($350) + MRV Visa fee ($185) + Insurance ($1,500)
      livingFunds = 15000;
      visaFee = 535; // SEVIS + MRV
      healthInsurance = 1500;
      holdingNotice = "ফর্ম I-20 তে উল্লেখিত খরচের সমপরিমাণ টাকা ব্যাংক অ্যাকাউন্টে লিকুইড ফান্ড হিসেবে থাকতে হবে এবং উৎস পরিষ্কার হতে হবে।";
      sponsorGuideline = "পিতা-মাতার স্পনসরশিপ সবচেয়ে নিরাপদ। স্পনসরের Affidavit of Support (Form I-134) এবং ট্যাক্স রিটার্ন ফাইল প্রয়োজন।";
      break;
  }

  const totalLocal = tuitionFeeLocal + livingFunds + visaFee + healthInsurance;
  const totalBdtApprox = convertToBdt(totalLocal, currencyCode);

  return {
    countryCode,
    currencyCode,
    tuitionFeeLocal,
    livingFundsRequiredLocal: livingFunds,
    visaApplicationFeeLocal: visaFee,
    healthInsuranceLocal: healthInsurance,
    totalLocal,
    totalBdtApprox,
    holdingRuleNoticeBn: holdingNotice,
    sponsorGuidelineBn: sponsorGuideline,
  };
}
