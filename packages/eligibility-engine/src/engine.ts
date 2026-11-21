import {
  EligibilityEvaluationOutput,
  EligibilityStatus,
  EvaluatedRequirementItem,
  StudentAcademicRecordInput,
  StudentLanguageTestInput,
} from "@abroadmate/validation";
import { evaluateAcademicRequirements, ProgramAcademicRequirementData } from "./evaluators/academic";
import { evaluateLanguageRequirements, ProgramLanguageRequirementData } from "./evaluators/language";
import {
  evaluatePrerequisites,
  ProgramPrerequisiteRequirementData,
  StudentPrerequisiteInputData,
} from "./evaluators/prerequisites";
import { evaluateIntakeAndDeadline, ProgramIntakeData } from "./evaluators/intake";

export interface DeterministicEvaluationInput {
  program: {
    id: string;
    titleEn: string;
    titleBn: string;
    universityId: string;
    universityNameEn: string;
    universityNameBn: string;
    countryCode: string;
    officialAdmissionsUrl: string;
  };
  requirement: ProgramAcademicRequirementData &
    ProgramLanguageRequirementData &
    ProgramPrerequisiteRequirementData;
  intake?: ProgramIntakeData;
  student: {
    academicRecord?: StudentAcademicRecordInput;
    languageTest?: StudentLanguageTestInput;
    prerequisites?: StudentPrerequisiteInputData;
  };
}

export function evaluateProgramEligibility(
  input: DeterministicEvaluationInput
): EligibilityEvaluationOutput {
  const { program, requirement, intake, student } = input;

  const allItems: EvaluatedRequirementItem[] = [];
  const missingInfoList: string[] = [];
  const recommendations: string[] = [];

  // 1. Evaluate Academic Requirements
  const academicRes = evaluateAcademicRequirements(student.academicRecord, requirement);
  allItems.push(...academicRes.items);
  missingInfoList.push(...academicRes.missingInfoList);

  // 2. Evaluate Language Requirements
  const languageRes = evaluateLanguageRequirements(student.languageTest, requirement);
  allItems.push(...languageRes.items);
  missingInfoList.push(...languageRes.missingInfoList);

  // 3. Evaluate Prerequisites & Standardized Tests
  const prereqRes = evaluatePrerequisites(student.prerequisites, requirement);
  allItems.push(...prereqRes.items);
  missingInfoList.push(...prereqRes.missingInfoList);

  // 4. Evaluate Intake & Deadline
  const intakeRes = evaluateIntakeAndDeadline(intake);
  allItems.push(...intakeRes.items);

  // 5. Aggregate Verdict Deterministically
  const hasUnableToDetermine = allItems.some((item) => item.status === "UNABLE_TO_DETERMINE");
  const hasInformationMissing = allItems.some((item) => item.status === "INFORMATION_MISSING");
  const hasNotMet = allItems.some((item) => item.status === "NOT_MET");
  const hasPartiallyMet = allItems.some((item) => item.status === "PARTIALLY_MET");

  let verdict: EligibilityStatus = "NOT_ELIGIBLE";
  let verdictTitleBn = "ভর্তির শর্ত পূরণ হয়নি (Not Eligible)";
  let verdictTitleEn = "Not Eligible for Direct Admission";
  let summaryBn = "আপনার বর্তমান প্রোফাইল এই প্রোগ্রামের ন্যূনতম আবশ্যকীয় মানদণ্ড পূরণ করতে পারেনি।";
  let summaryEn = "Your current profile does not meet the minimum mandatory requirements for this program.";

  if (hasUnableToDetermine || (hasInformationMissing && !student.academicRecord)) {
    verdict = "UNABLE_TO_DETERMINE";
    verdictTitleBn = "তথ্য অপর্যাপ্ত বা অনির্ধারিত (Unable to Determine)";
    verdictTitleEn = "Unable to Determine Eligibility";
    summaryBn = "আপনার প্রোফাইলের প্রয়োজনীয় তথ্য অসম্পূর্ণ থাকায় বা গ্রেডিং স্কেল অপ্রকাশিত থাকায় নিশ্চিত ফলাফল নির্ধারণ করা যায়নি।";
    summaryEn = "Crucial academic information is missing or the grading scale cannot be reliably converted.";
    recommendations.push("আপনার অ্যাকাডেমিক প্রোফাইলে সঠিক জিপিএ, স্কেল ও পাশের বছর পূরণ করুন।");
  } else if (academicRes.isHardFail || intakeRes.deadlinePassed || prereqRes.isHardFail) {
    verdict = "NOT_ELIGIBLE";
    verdictTitleBn = "ভর্তির শর্ত পূরণ হয়নি (Not Eligible)";
    verdictTitleEn = "Not Eligible for Direct Admission";
    summaryBn = "আপনার ডিগ্রি লেভেল, বিষয় ব্যাকগ্রাউন্ড অথবা জিপিএ এই প্রোগ্রামের নির্ধারিত কাট-অফ থেকে কম।";
    summaryEn = "Degree level, subject background, or minimum GPA fails the program's mandatory criteria.";
    
    if (intakeRes.deadlinePassed) {
      recommendations.push("এই সেশনের ডেডলাইন শেষ হয়ে গেছে; পরবর্তী ইনটেকে আবেদনের প্রস্তুতি নিন।");
    }
    if (academicRes.isHardFail) {
      recommendations.push("সরাসরি ভর্তির পরিবর্তে 'Pre-Master's' বা 'International Foundation' পাথওয়ে প্রোগ্রাম দেখতে পারেন।");
    }
  } else if (hasPartiallyMet || languageRes.canQualifyConditionally || hasNotMet === false && hasPartiallyMet) {
    verdict = "CONDITIONALLY_ELIGIBLE";
    verdictTitleBn = "শর্তযুক্ত ভর্তির সুযোগ রয়েছে (Conditionally Eligible)";
    verdictTitleEn = "Conditionally Eligible";
    summaryBn = "আপনার অ্যাকাডেমিক ফলাফল সন্তোষজনক! তবে ইংরেজি পরীক্ষা অথবা নির্দিষ্ট ডকুমেন্টের শর্ত পূরণ সাপেক্ষে কন্ডিশনাল অফার লেটার পাওয়া সম্ভব।";
    summaryEn = "Your academic background qualifies! You are eligible for a Conditional Offer subject to meeting language or documentation conditions.";
    
    if (languageRes.canQualifyConditionally) {
      recommendations.push("আইইএলটিএস/পিটিই স্কোর সম্পন্ন করে অফিসিয়াল আনকন্ডিশনাল অফারের জন্য আবেদন করুন।");
      if (requirement.preSessionalEnglishAvailable) {
        recommendations.push("বিশ্ববিদ্যালয়ের প্রি-সেশনাল ইংলিশ (Pre-sessional English) প্রোগ্রামে ভর্তির সুযোগ রয়েছে।");
      }
    }
  } else if (!hasNotMet && !hasPartiallyMet && !hasInformationMissing) {
    verdict = "ELIGIBLE";
    verdictTitleBn = "সরাসরি ভর্তির যোগ্য (Eligible)";
    verdictTitleEn = "Eligible for Direct Admission";
    summaryBn = "অভিনন্দন! আপনার অ্যাকাডেমিক ফলাফল, বিষয় ব্যাকগ্রাউন্ড ও ভাষা দক্ষতার স্কোর এই প্রোগ্রামের সকল আবশ্যকীয় শর্ত পূরণ করেছে।";
    summaryEn = "Congratulations! Your academic background and language scores meet all published entry requirements.";
    recommendations.push("বিশ্ববিদ্যালয়ের অফিসিয়াল পোর্টাল থেকে সরাসরি অনলাইন আবেদন প্রক্রিয়া শুরু করুন।");
    recommendations.push("স্টেটমেন্ট অব পারপাস (SOP) ও প্রয়োজনীয় একাডেমিক কাগজপত্র প্রস্তুত রাখুন।");
  }

  return {
    verdict,
    verdictTitleBn,
    verdictTitleEn,
    summaryBn,
    summaryEn,
    programId: program.id,
    programTitleEn: program.titleEn,
    programTitleBn: program.titleBn,
    universityId: program.universityId,
    universityNameEn: program.universityNameEn,
    universityNameBn: program.universityNameBn,
    countryCode: program.countryCode,
    intakeSeason: intake?.season || "FALL",
    intakeYear: intake?.year || 2026,
    applicationDeadline: intakeRes.deadlineString,
    deadlinePassed: intakeRes.deadlinePassed,
    items: allItems,
    missingInformationListBn: Array.from(new Set(missingInfoList)),
    recommendationsBn: recommendations,
    conditionalAdmissionAvailable: requirement.allowsConditionalAdmission,
    preSessionalEnglishAvailable: requirement.preSessionalEnglishAvailable,
    officialAdmissionsUrl: program.officialAdmissionsUrl,
    requirementVersion: requirement.requirementVersion || 1,
    evaluatedAt: new Date().toISOString(),
    visaDistinctionNoticeBn:
      "সতর্কতা: বিশ্ববিদ্যালয়ে একাডেমিক অ্যাডমিশন অফার পাওয়া এবং দূতাবাস থেকে স্টুডেন্ট ভিসা লাভ সম্পূর্ণ দুটি আলাদা প্রক্রিয়া। অ্যাকাডেমিক শর্ত পূরণ করলেও পর্যাপ্ত আর্থিক সচ্ছলতা (Solvency), নো-এজেন্সি ভেরিফিকেশন ও ভিসা ইন্টারভিউয়ের ওপর ভিসা অনুমোদন নির্ভর করে।",
    admissionGuaranteeDisclaimerBn:
      "অস্বীকৃতি: AbroadMate কোনো ভিসা বা অ্যাডমিশন এজেন্সি নয় এবং ভর্তির কোনো নিশ্চয়তা প্রদান করে না। এটি বিশ্ববিদ্যালয়ের প্রকাশিত অফিশিয়াল অ্যাডমিশন পলিসির ভিত্তিতে একটি অবজেক্টিভ যোগ্যতা যাচাই টুল মাত্র। চূড়ান্ত সিদ্ধান্ত বিশ্ববিদ্যালয় অ্যাডমিশন কমিটির ওপর নির্ভরশীল।",
  };
}
