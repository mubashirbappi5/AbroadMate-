import { EvaluateVisaAssessmentInput, VisaAssessmentVerdict } from "@abroadmate/validation";
import {
  VisaAssessmentOutput,
  VisaRequirementItemResult,
  ConditionEvaluationStatus,
} from "./types";
import { calculateDetailedFinancialProof } from "./financialCalculator";
import { evaluateDocumentChecklist } from "./documentEvaluator";
import { generateCountryWorkflow } from "./workflowGenerator";
import { COUNTRY_VISA_GUIDES } from "./countryGuides";

export function evaluateStudentVisaEligibility(
  input: EvaluateVisaAssessmentInput
): VisaAssessmentOutput {
  const guide = COUNTRY_VISA_GUIDES[input.countryCode] || COUNTRY_VISA_GUIDES["GB"];
  const workflowSteps = generateCountryWorkflow(input.countryCode);

  // 1. Financial Breakdown
  const financial = calculateDetailedFinancialProof({
    countryCode: input.countryCode,
    tuitionFeeLocal: input.tuitionFeeLocal,
    tuitionPaidLocal: input.tuitionFeePaidLocal,
    isInsideLondon: input.isInsideLondon,
    availableLiquidFundsLocal: input.availableLiquidFundsLocal,
    fundsHoldingDays: input.fundsHoldingDays,
    sponsorType: input.sponsorType,
    scholarshipFundingBdt: input.scholarshipFundingBdt,
  });

  // 2. Documents Checklist
  const documentChecklist = evaluateDocumentChecklist(input.countryCode, input);

  // 3. Line-by-Line Requirement Evaluation
  const requirementResults: VisaRequirementItemResult[] = [];

  // A. Admission Confirmation
  const admissionItem = documentChecklist.find((d) => d.documentType === "ADMISSION_CONFIRMATION");
  requirementResults.push({
    requirementName: admissionItem?.titleBn || "বিশ্ববিদ্যালয় ভর্তি নিশ্চয়তা",
    category: "ADMISSION",
    isMandatory: true,
    status: input.hasOfficialAdmissionConfirmation ? "MET" : "MISSING",
    studentValue: input.hasOfficialAdmissionConfirmation ? "প্রাপ্ত হয়েছে" : "এখনও পাওয়া যায়নি",
    officialRule: "ভিসা আবেদনের জন্য অফিশিয়াল ভর্তি নিশ্চয়তাপত্র থাকা বাধ্যতামূলক।",
    explanationBn: input.hasOfficialAdmissionConfirmation
      ? "আপনার কাছে বিশ্ববিদ্যালয়ের বৈধ ভর্তি নিশ্চয়তা রয়েছে।"
      : "ভিসা ফাইল জমা দেওয়ার পূর্বে সংশ্লিষ্ট বিশ্ববিদ্যালয় থেকে অফিশিয়াল ভর্তি পত্র গ্রহণ করতে হবে।",
    officialSourceUrl: admissionItem?.officialSourceUrl,
  });

  // B. Financial Funds Sufficiency
  const isFundsSufficient = financial.financialGapLocal === 0;
  requirementResults.push({
    requirementName: "আর্থিক সামর্থ্য ও সংবিধিবদ্ধ ফান্ড (Financial Funds)",
    category: "FINANCIAL",
    isMandatory: true,
    status: isFundsSufficient ? "MET" : "MISSING",
    studentValue: `${financial.availableLiquidFundsLocal.toLocaleString()} ${financial.currencyCode} (প্রয়োজন: ${financial.totalFundsRequiredLocal.toLocaleString()} ${financial.currencyCode})`,
    officialRule: `টিউশন ও জীবনযাত্রার সংবিধিবদ্ধ খরচ বাবদ মোট ${financial.totalFundsRequiredLocal.toLocaleString()} ${financial.currencyCode} প্রদর্শন আবশ্যক।`,
    explanationBn: isFundsSufficient
      ? "আপনার প্রদর্শিত ফান্ডের পরিমাণ সংবিধিবদ্ধ আর্থিক প্রয়োজনের সমান বা তার চেয়ে বেশি।"
      : `আপনার আরও প্রায় ${financial.financialGapLocal.toLocaleString()} ${financial.currencyCode} (আনুমানিক ৳${financial.financialGapBdt.toLocaleString()}) ফান্ডের ঘাটতি রয়েছে।`,
  });

  // C. Fund Holding Maintenance Period
  const isHoldingMet = financial.isHoldingPeriodSatisfied;
  requirementResults.push({
    requirementName: "ব্যাংক ফান্ড মেইনটেন্যান্স ও হোল্ডিং পিরিয়ড",
    category: "FINANCIAL",
    isMandatory: financial.maintenancePeriodDaysRequired > 0,
    status: isHoldingMet ? "MET" : "MISSING",
    studentValue: `${input.fundsHoldingDays} দিন (প্রয়োজন: ${financial.maintenancePeriodDaysRequired} দিন)`,
    officialRule: financial.holdingRuleNoticeBn,
    explanationBn: isHoldingMet
      ? "ব্যাংক ব্যালেন্সের হোল্ডিং মেয়াদ পূর্ণ হয়েছে।"
      : `ভিসা আবেদনের পূর্বে আরও অন্তত ${financial.maintenancePeriodDaysRequired - input.fundsHoldingDays} দিন অবিচ্ছিন্নভাবে টাকা অ্যাকাউন্টে ধরে রাখতে হবে।`,
  });

  // D. Sponsor Eligibility
  requirementResults.push({
    requirementName: "স্পনসরশিপ অনুমোদন নীতি (Sponsor Eligibility)",
    category: "FINANCIAL",
    isMandatory: true,
    status: financial.isSponsorAccepted ? "MET" : "MISSING",
    studentValue: input.sponsorType,
    officialRule: "সংশ্লিষ্ট দেশের ইমিগ্রেশন নীতিমালা দ্বারা অনুমোদিত স্পনসর হতে হবে।",
    explanationBn: financial.sponsorEvaluationBn,
  });

  // E. Language Proficiency
  requirementResults.push({
    requirementName: "ভাষা দক্ষতা সনদ (Language Proficiency)",
    category: "LANGUAGE",
    isMandatory: input.countryCode !== "DE",
    status: input.hasLanguageProficiencyProof
      ? "MET"
      : input.countryCode === "DE"
      ? "CONDITIONAL"
      : "MISSING",
    studentValue: input.hasLanguageProficiencyProof ? "সনদ প্রস্তুত আছে" : "প্রস্তুত নেই",
    officialRule: "বৈধ ও অনুমোদিত ভাষা পরীক্ষার স্কোরকার্ড থাকতে হবে।",
    explanationBn: input.hasLanguageProficiencyProof
      ? "ভাষা দক্ষতার সনদপত্র সক্রিয় রয়েছে।"
      : "ভিসা আবেদনের জন্য মেয়াদোত্তীর্ণ না হওয়া ইংরেজি বা জার্মান পরীক্ষার স্কোর প্রয়োজন।",
  });

  // F. Medical & Health Clearance
  const isMedicalReq = input.countryCode === "GB" || input.countryCode === "AU" || input.countryCode === "CA";
  requirementResults.push({
    requirementName: "স্বাস্থ্য পরীক্ষা ও মেডিকেল ক্লিয়ারেন্স",
    category: "HEALTH_BIOMETRIC",
    isMandatory: isMedicalReq,
    status: input.hasMedicalTbClearance
      ? "MET"
      : isMedicalReq
      ? "MISSING"
      : "CONDITIONAL",
    studentValue: input.hasMedicalTbClearance ? "সম্পন্ন হয়েছে" : "এখনও সম্পন্ন হয়নি",
    officialRule: isMedicalReq
      ? "আইওএম বা প্যানেল ফিজিশিয়ানের মেডিকেল সনদ বাধ্যতামূলক।"
      : "সাধারণ নিয়মে স্বাস্থ্য বীমা প্রয়োজন।",
    explanationBn: input.hasMedicalTbClearance
      ? "মেডিকেল পরীক্ষা সম্পন্ন হয়েছে।"
      : "নির্ধারিত ক্লিনিকে স্বাস্থ্য পরীক্ষা সম্পন্ন করে রিপোর্ট সংগ্রহ করুন।",
  });

  // G. Immigration History & Refusal Disclosure
  let refusalAdvisory: string | undefined = undefined;
  if (input.hasPreviousRefusal) {
    refusalAdvisory =
      "অতীব গুরুত্বপূর্ণ সতর্কতা: আপনার অতীতের কোনো দেশের ভিসা রিফিউজাল থাকলে তা ভিসা আবেদন ফর্মে ১০০% সততার সাথে প্রকাশ করতে হবে। রিফিউজাল গোপন করাকে যুক্তরাজ্যের Paragraph 9.7.1 বা কানাডার Section 40 অনুযায়ী প্রতারণা (Deception / Misrepresentation) হিসেবে গণ্য করা হয়, যার শাস্তি ৩ থেকে ১০ বছরের আন্তর্জাতিক ভ্রমণ নিষেধাজ্ঞা। রিফিউজালের কারণ ও বর্তমান ফাইলে তার সমাধান স্পষ্টভাবে ব্যাখ্যা করুন।";

    requirementResults.push({
      requirementName: "অতীতের ভিসা রিফিউজাল প্রকাশ ও স্বচ্ছতা",
      category: "IMMIGRATION_HISTORY",
      isMandatory: true,
      status: "CONDITIONAL",
      studentValue: `পূর্ববর্তী রিফিউজাল রয়েছে (${input.refusalCountryCode || "অনির্দিষ্ট দেশ"})`,
      officialRule: "অতীতের যেকোনো ভিসা রিফিউজাল সত্যভাবে প্রকাশ করা আইনগতভাবে বাধ্যতামূলক।",
      explanationBn: refusalAdvisory,
    });
  }

  // 4. Determine Overall Verdict
  let verdict: VisaAssessmentVerdict = "PRELIMINARY_ELIGIBLE";
  const actionableRecommendations: string[] = [];

  const missingMandatoryDocs = documentChecklist.filter(
    (d) => d.isMandatory && d.status === "MISSING"
  );

  if (
    input.tuitionFeeLocal === 0 &&
    input.availableLiquidFundsLocal === 0 &&
    !input.hasOfficialAdmissionConfirmation &&
    !input.hasValidPassport
  ) {
    verdict = "UNABLE_TO_DETERMINE";
    actionableRecommendations.push(
      "ভিসা যোগ্যতা নির্ধারণের জন্য অন্তত প্রাথমিক টিউশন ফি ও ফান্ডের তথ্য প্রদান করুন।"
    );
  } else if (!input.hasOfficialAdmissionConfirmation || !input.hasValidPassport || !input.hasAcademicCertificates) {
    verdict = "REQUIREMENTS_MISSING";
    actionableRecommendations.push(
      "সর্বপ্রথম বিশ্ববিদ্যালয়ের চূড়ান্ত ভর্তি নিশ্চয়তাপত্র (CAS / I-20 / CoE / LOA) এবং মূল পাসপোর্ট প্রস্তুত করুন।"
    );
  } else if (!isFundsSufficient || !isHoldingMet || !financial.isSponsorAccepted) {
    verdict = "FINANCIAL_GAP";
    if (!isFundsSufficient) {
      actionableRecommendations.push(
        `প্রয়োজনীয় ফান্ডের জন্য আরও আনুমানিক ৳${financial.financialGapBdt.toLocaleString()} ব্যাংক অ্যাকাউন্টে যুক্ত করতে হবে।`
      );
    }
    if (!isHoldingMet) {
      actionableRecommendations.push(
        `ব্যাংক অ্যাকাউন্টে টাকা আরও ${financial.maintenancePeriodDaysRequired - input.fundsHoldingDays} দিন অক্ষুণ্ণ রাখুন যাতে সরকারি হোল্ডিং রুল পূরণ হয়।`
      );
    }
    if (!financial.isSponsorAccepted) {
      actionableRecommendations.push(
        "অনুমোদিত স্পনসর নীতি অনুযায়ী পিতা-মাতা বা শিক্ষার্থীর নিজস্ব ব্যাংক অ্যাকাউন্ট ব্যবহার করুন।"
      );
    }
  } else if (missingMandatoryDocs.length > 0) {
    verdict = "DOCUMENTS_MISSING";
    actionableRecommendations.push(
      `নিম্নোক্ত আবশ্যিক ডকুমেন্টসগুলো দ্রুত সংগ্রহ করুন: ${missingMandatoryDocs.map((d) => d.titleBn).join(", ")}।`
    );
  } else if (input.countryCode === "CA" && !input.hasPoliceClearance) {
    verdict = "CONDITIONAL_REQUIREMENTS";
    actionableRecommendations.push(
      "কানাডার ক্ষেত্রে অনলাইন পুলিশ ক্লিয়ারেন্স সার্টিফিকেট সংগ্রহ করে পররাষ্ট্র মন্ত্রণালয় থেকে সত্যায়ন করে নিন।"
    );
  } else if (input.countryCode === "DE" && !input.hasBankSolvencyCertificate) {
    verdict = "CONDITIONAL_REQUIREMENTS";
    actionableRecommendations.push(
      "জার্মান দূতাবাসে যাওয়ার আগে এক্সপ্যাট্রিও বা কোরাকলে সম্পূর্ণ ১১,৯০৪ ইউরো জমা দিয়ে ০৬ ব্যালেন্স কনফার্মেশন সংগ্রহ করুন।"
    );
  } else {
    verdict = "PRELIMINARY_ELIGIBLE";
    actionableRecommendations.push(
      "আপনার প্রাথমিক প্রোফাইল ও ডকুমেন্টস সংশ্লিষ্ট দেশের সরকারি নীতিমালার সাথে সামঞ্জস্যপূর্ণ। পরবর্তী ধাপে অনলাইন আবেদন ও বায়োমেট্রিক স্লট বুকিং করতে পারেন।"
    );
  }

  // Summary generation in Bengali
  let summaryBn = "";
  const currentVerdict: VisaAssessmentVerdict = verdict;
  switch (currentVerdict) {
    case "PRELIMINARY_ELIGIBLE":
      summaryBn = `${guide.countryNameBn} স্টুডেন্ট ভিসার প্রাথমিক আবশ্যকীয় শর্তসমূহ আপনার প্রোফাইল দ্বারা পূরণ হয়েছে।`;
      break;
    case "FINANCIAL_GAP":
      summaryBn = `${guide.countryNameBn} স্টুডেন্ট ভিসার জন্য আর্থিক ফান্ড বা ব্যাংক স্টেটমেন্টের হোল্ডিং সময়ে ঘাটতি রয়েছে।`;
      break;
    case "DOCUMENTS_MISSING":
      summaryBn = `${guide.countryNameBn} ভিসার প্রয়োজনীয় কিছু আবশ্যিক নথিপত্র এখনো প্রস্তুত করা হয়নি।`;
      break;
    case "REQUIREMENTS_MISSING":
      summaryBn = "ভিসা আবেদনের মূল ভিত্তি (ভর্তি নিশ্চিতকরণ বা মূল পাসপোর্ট) এখনও সম্পূর্ণ হয়নি।";
      break;
    case "CONDITIONAL_REQUIREMENTS":
      summaryBn = "আপনার ফাইলটি শর্তসাপেক্ষে প্রস্তুত; কিছু দেশীয় বিশেষ শর্ত পূরণ সাপেক্ষে আবেদন জমা দেওয়া যাবে।";
      break;
    case "UNABLE_TO_DETERMINE":
    default:
      summaryBn = "প্রদত্ত তথ্যের অপ্রতুলতার কারণে ভিসার যোগ্যতা নিশ্চিত করা সম্ভব হয়নি।";
      break;
  }

  const distinctionNoticeBn =
    "অত্যন্ত গুরুত্বপূর্ণ আইনি নোটিশ: এই মূল্যায়নটি বিশ্ববিদ্যালয় ভর্তি যোগ্যতা কিংবা স্কলারশিপ পাওয়ার নিশ্চয়তা নয়। এমনকি ভিসা পাওয়ার কোনো চূড়ান্ত নিশ্চয়তাও এটি প্রদান করে না। ভিসা মঞ্জুর বা প্রত্যাখ্যানের শতভাগ আইনি কর্তৃত্ব সংশ্লিষ্ট দেশের দূতাবাস ও কনস্যুলার কর্মকর্তার নিজস্ব এখতিয়ারাধীন।";

  return {
    verdict,
    countryCode: input.countryCode,
    visaCode: guide.visaSubclassName,
    visaNameBn: `${guide.countryNameBn} স্টুডেন্ট ভিসা মূল্যায়ন`,
    summaryBn,
    distinctionNoticeBn,
    financialBreakdown: financial,
    requirementResults,
    documentChecklist,
    workflowSteps,
    actionableRecommendationsBn: actionableRecommendations,
    refusalAdvisoryBn: refusalAdvisory,
    evaluatedAt: new Date().toISOString(),
    officialGazetteUrl: guide.sections[15].contentBn.split("\n")[0] || "",
  };
}
