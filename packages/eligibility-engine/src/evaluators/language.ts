import {
  EvaluatedRequirementItem,
  RequirementItemStatus,
  StudentLanguageTestInput,
} from "@abroadmate/validation";

export interface ProgramLanguageRequirementData {
  minIeltsOverall?: number | null;
  minIeltsEachBand?: number | null;
  minIeltsListening?: number | null;
  minIeltsReading?: number | null;
  minIeltsWriting?: number | null;
  minIeltsSpeaking?: number | null;
  
  minPteOverall?: number | null;
  minPteEachBand?: number | null;
  
  minToeflIbtOverall?: number | null;
  minToeflEachBand?: number | null;
  
  duolingoAccepted?: boolean;
  minDuolingoScore?: number | null;
  
  allowsConditionalAdmission: boolean;
  preSessionalEnglishAvailable: boolean;
  officialSourceUrl: string;
  requirementVersion: number;
}

export function evaluateLanguageRequirements(
  student: StudentLanguageTestInput | undefined,
  requirement: ProgramLanguageRequirementData
): {
  items: EvaluatedRequirementItem[];
  missingInfoList: string[];
  isHardFail: boolean;
  canQualifyConditionally: boolean;
} {
  const items: EvaluatedRequirementItem[] = [];
  const missingInfoList: string[] = [];
  let isHardFail = false;
  let canQualifyConditionally = false;

  const version = requirement.requirementVersion || 1;
  const sourceUrl = requirement.officialSourceUrl;

  const reqIeltsOverall = requirement.minIeltsOverall ?? 6.5;
  const reqIeltsEachBand = requirement.minIeltsEachBand ?? 6.0;

  // Case 1: Student has not taken any language test yet or only planned
  if (!student || student.testType === "NONE" || student.isPlannedOnly || student.overallScore === 0) {
    missingInfoList.push("ইংরেজি ভাষা দক্ষতার স্কোর অনুপস্থিত (IELTS / PTE Test Not Taken)");
    canQualifyConditionally = requirement.allowsConditionalAdmission;

    items.push({
      key: "language_overall_score",
      nameEn: "English Language Proficiency (IELTS / PTE / TOEFL)",
      nameBn: "ইংরেজি ভাষা দক্ষতার স্কোর",
      requiredValue: `আইইএলটিএস ওভারঅল ${reqIeltsOverall} (প্রতিটি ব্যান্ডে ${reqIeltsEachBand})`,
      studentValue: student?.isPlannedOnly ? "পরীক্ষা পরিকল্পনাধীন (Planned)" : "পরীক্ষা দেওয়া হয়নি (Not Taken)",
      status: requirement.allowsConditionalAdmission ? "PARTIALLY_MET" : "INFORMATION_MISSING",
      explanationBn: requirement.allowsConditionalAdmission
        ? "আপনি এখনও কোনো ভাষা পরীক্ষা দেননি। তবে আপনার পূর্ববর্তী একাডেমিক ফলাফল ভালো হলে আপনি শর্তযুক্ত অফার লেটার (Conditional Offer) পেতে পারেন।"
        : "এই বিশ্ববিদ্যালয়ের জন্য আবেদনকালে ইংরেজি পরীক্ষার স্কোর জমা দেওয়া বাধ্যতামূলক।",
      explanationEn: requirement.allowsConditionalAdmission
        ? "Language test not taken yet. You may qualify for a Conditional Offer based on your academic profile."
        : "Official English test results are required for application.",
      missingInfoBn: `ন্যূনতম ওভারঅল ${reqIeltsOverall} স্কোর অর্জনের লক্ষ্য নির্ধারণ করুন।`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });

    return { items, missingInfoList, isHardFail: !requirement.allowsConditionalAdmission, canQualifyConditionally };
  }

  // Case 2: Expiry Check (Language tests expire after 2 years)
  if (student.testDate) {
    const testDate = new Date(student.testDate);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    if (testDate < twoYearsAgo) {
      isHardFail = true;
      items.push({
        key: "language_validity",
        nameEn: "Language Test Validity (2 Years)",
        nameBn: "ভাষা পরীক্ষার মেয়াদ (২ বছর)",
        requiredValue: "২ বছরের মধ্যে সম্পন্ন হতে হবে",
        studentValue: `পরীক্ষার তারিখ: ${testDate.toISOString().split("T")[0]} (মেয়াদোত্তীর্ণ)`,
        status: "NOT_MET",
        explanationBn: "আপনার আইইএলটিএস/ভাষা পরীক্ষার ফলাফল ২ বছরের বেশি পুরনো হয়ে গেছে। বিশ্ববিদ্যালয় ও ভিসার জন্য পুনরায় পরীক্ষা দেওয়া আবশ্যক।",
        explanationEn: "Your English test result is older than 2 years and has expired. A retake is mandatory.",
        missingInfoBn: "মেয়াদোত্তীর্ণ পরীক্ষার স্কোর বাতিল; নতুন পরীক্ষার স্কোর প্রয়োজন।",
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
      return { items, missingInfoList, isHardFail, canQualifyConditionally: false };
    }
  }

  // Case 3: Test Type Handling
  if (student.testType === "IELTS") {
    evaluateIelts(student, requirement, items, (hardFail, cond) => {
      if (hardFail) isHardFail = true;
      if (cond) canQualifyConditionally = true;
    });
  } else if (student.testType === "PTE") {
    evaluatePte(student, requirement, items, (hardFail, cond) => {
      if (hardFail) isHardFail = true;
      if (cond) canQualifyConditionally = true;
    });
  } else if (student.testType === "TOEFL_IBT") {
    evaluateToefl(student, requirement, items, (hardFail, cond) => {
      if (hardFail) isHardFail = true;
      if (cond) canQualifyConditionally = true;
    });
  } else if (student.testType === "DUOLINGO") {
    evaluateDuolingo(student, requirement, items, (hardFail, cond) => {
      if (hardFail) isHardFail = true;
      if (cond) canQualifyConditionally = true;
    });
  }

  return { items, missingInfoList, isHardFail, canQualifyConditionally };
}

function evaluateIelts(
  student: StudentLanguageTestInput,
  req: ProgramLanguageRequirementData,
  items: EvaluatedRequirementItem[],
  onResult: (hardFail: boolean, cond: boolean) => void
) {
  const version = req.requirementVersion || 1;
  const sourceUrl = req.officialSourceUrl;
  const minOverall = req.minIeltsOverall ?? 6.5;

  // 1. Overall Score Check
  const isOverallMet = student.overallScore >= minOverall;
  const overallDiff = minOverall - student.overallScore;

  if (isOverallMet) {
    items.push({
      key: "ielts_overall",
      nameEn: "IELTS Overall Band Score",
      nameBn: "আইইএলটিএস ওভারঅল ব্যান্ড",
      requiredValue: `ন্যূনতম ${minOverall.toFixed(1)}`,
      studentValue: `${student.overallScore.toFixed(1)}`,
      status: "MET",
      explanationBn: `আপনার আইইএলটিএস ওভারঅল ব্যান্ড (${student.overallScore.toFixed(1)}) বিশ্ববিদ্যালয়ের কাট-অফ (${minOverall.toFixed(1)}) সন্তোষজনকভাবে পূরণ করে।`,
      explanationEn: `Your IELTS overall band (${student.overallScore.toFixed(1)}) meets the cutoff (${minOverall.toFixed(1)}).`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
  } else if (overallDiff <= 0.5 && req.preSessionalEnglishAvailable) {
    onResult(false, true);
    items.push({
      key: "ielts_overall",
      nameEn: "IELTS Overall Band Score",
      nameBn: "আইইএলটিএস ওভারঅল ব্যান্ড",
      requiredValue: `ন্যূনতম ${minOverall.toFixed(1)}`,
      studentValue: `${student.overallScore.toFixed(1)}`,
      status: "PARTIALLY_MET",
      explanationBn: `আপনার স্কোর (${student.overallScore.toFixed(1)}) আবশ্যক শর্ত (${minOverall.toFixed(1)}) থেকে ০.৫ কম। আপনি প্রি-সেশনাল ইংলিশ কোর্স অথবা কন্ডিশনাল অ্যাডমিশন পাওয়ার যোগ্য।`,
      explanationEn: `Your score (${student.overallScore.toFixed(1)}) is 0.5 below requirement (${minOverall.toFixed(1)}). You qualify for Pre-sessional English pathway.`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
  } else {
    onResult(true, false);
    items.push({
      key: "ielts_overall",
      nameEn: "IELTS Overall Band Score",
      nameBn: "আইইএলটিএস ওভারঅল ব্যান্ড",
      requiredValue: `ন্যূনতম ${minOverall.toFixed(1)}`,
      studentValue: `${student.overallScore.toFixed(1)}`,
      status: "NOT_MET",
      explanationBn: `আপনার স্কোর (${student.overallScore.toFixed(1)}) আবশ্যক কাট-অফ (${minOverall.toFixed(1)}) থেকে উল্লেখযোগ্যভাবে কম। ভর্তি ও ভিসার জন্য স্কোর বৃদ্ধি প্রয়োজন।`,
      explanationEn: `Your score (${student.overallScore.toFixed(1)}) is significantly below requirement (${minOverall.toFixed(1)}). Retake required.`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
  }

  // 2. Individual Sub-Bands Check (Listening, Reading, Writing, Speaking)
  const defaultSubCutoff = req.minIeltsEachBand ?? 6.0;
  const bands = [
    { key: "ielts_listening", nameBn: "লিসেনিং (Listening)", nameEn: "Listening", val: student.listening, reqVal: req.minIeltsListening ?? defaultSubCutoff },
    { key: "ielts_reading", nameBn: "রিডিং (Reading)", nameEn: "Reading", val: student.reading, reqVal: req.minIeltsReading ?? defaultSubCutoff },
    { key: "ielts_writing", nameBn: "রাইটিং (Writing)", nameEn: "Writing", val: student.writing, reqVal: req.minIeltsWriting ?? defaultSubCutoff },
    { key: "ielts_speaking", nameBn: "স্পিকিং (Speaking)", nameEn: "Speaking", val: student.speaking, reqVal: req.minIeltsSpeaking ?? defaultSubCutoff },
  ];

  for (const b of bands) {
    if (b.val === undefined || b.val === null) {
      items.push({
        key: b.key,
        nameEn: `IELTS ${b.nameEn} Band`,
        nameBn: `আইইএলটিএস ${b.nameBn} ব্যান্ড`,
        requiredValue: `ন্যূনতম ${b.reqVal.toFixed(1)}`,
        studentValue: "N/A",
        status: "INFORMATION_MISSING",
        explanationBn: `আপনার ${b.nameBn} ব্যান্ডের তথ্য দেওয়া হয়নি।`,
        explanationEn: `IELTS ${b.nameEn} band score is missing.`,
        missingInfoBn: `${b.nameBn} স্কোর পূরণ করুন।`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
      continue;
    }

    const isBandMet = b.val >= b.reqVal;
    if (isBandMet) {
      items.push({
        key: b.key,
        nameEn: `IELTS ${b.nameEn} Band`,
        nameBn: `আইইএলটিএস ${b.nameBn} ব্যান্ড`,
        requiredValue: `ন্যূনতম ${b.reqVal.toFixed(1)}`,
        studentValue: `${b.val.toFixed(1)}`,
        status: "MET",
        explanationBn: `আপনার ${b.nameBn} ব্যান্ড (${b.val.toFixed(1)}) ন্যূনতম শর্ত পূরণ করে।`,
        explanationEn: `Your ${b.nameEn} band (${b.val.toFixed(1)}) meets minimum threshold.`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
    } else if (b.reqVal - b.val <= 0.5 && req.preSessionalEnglishAvailable) {
      onResult(false, true);
      items.push({
        key: b.key,
        nameEn: `IELTS ${b.nameEn} Band`,
        nameBn: `আইইএলটিএস ${b.nameBn} ব্যান্ড`,
        requiredValue: `ন্যূনতম ${b.reqVal.toFixed(1)}`,
        studentValue: `${b.val.toFixed(1)}`,
        status: "PARTIALLY_MET",
        explanationBn: `আপনার ${b.nameBn} স্কোর (${b.val.toFixed(1)}) শর্ত (${b.reqVal.toFixed(1)}) থেকে ০.৫ কম। প্রি-সেশনাল ইংলিশের মাধ্যমে এটি পূরণযোগ্য।`,
        explanationEn: `Your ${b.nameEn} band (${b.val.toFixed(1)}) is 0.5 below requirement (${b.reqVal.toFixed(1)}). Eligible for Pre-sessional English.`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
    } else {
      onResult(true, false);
      items.push({
        key: b.key,
        nameEn: `IELTS ${b.nameEn} Band`,
        nameBn: `আইইএলটিএস ${b.nameBn} ব্যান্ড`,
        requiredValue: `ন্যূনতম ${b.reqVal.toFixed(1)}`,
        studentValue: `${b.val.toFixed(1)}`,
        status: "NOT_MET",
        explanationBn: `আপনার ${b.nameBn} স্কোর (${b.val.toFixed(1)}) ন্যূনতম শর্ত (${b.reqVal.toFixed(1)}) থেকে কম।`,
        explanationEn: `Your ${b.nameEn} band (${b.val.toFixed(1)}) fails the cutoff (${b.reqVal.toFixed(1)}).`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
    }
  }
}

function evaluatePte(
  student: StudentLanguageTestInput,
  req: ProgramLanguageRequirementData,
  items: EvaluatedRequirementItem[],
  onResult: (hardFail: boolean, cond: boolean) => void
) {
  const version = req.requirementVersion || 1;
  const sourceUrl = req.officialSourceUrl;
  const minOverall = req.minPteOverall ?? 59; // roughly IELTS 6.5
  const minEach = req.minPteEachBand ?? 54;

  const isMet = student.overallScore >= minOverall;
  if (!isMet) onResult(true, false);

  items.push({
    key: "pte_overall",
    nameEn: "PTE Academic Overall Score",
    nameBn: "পিটিই একাডেমিক ওভারঅল স্কোর",
    requiredValue: `ন্যূনতম ${minOverall} (প্রতিটি ব্যান্ডে ${minEach})`,
    studentValue: `${student.overallScore}`,
    status: isMet ? "MET" : "NOT_MET",
    explanationBn: isMet
      ? `আপনার পিটিই স্কোর (${student.overallScore}) আবশ্যক শর্ত (${minOverall}) পূরণ করেছে।`
      : `আপনার পিটিই স্কোর (${student.overallScore}) আবশ্যক কাট-অফ (${minOverall}) থেকে কম।`,
    explanationEn: isMet
      ? `Your PTE Academic score (${student.overallScore}) meets the cutoff (${minOverall}).`
      : `Your PTE Academic score (${student.overallScore}) is below cutoff (${minOverall}).`,
    officialSourceUrl: sourceUrl,
    requirementVersion: version,
  });
}

function evaluateToefl(
  student: StudentLanguageTestInput,
  req: ProgramLanguageRequirementData,
  items: EvaluatedRequirementItem[],
  onResult: (hardFail: boolean, cond: boolean) => void
) {
  const version = req.requirementVersion || 1;
  const sourceUrl = req.officialSourceUrl;
  const minOverall = req.minToeflIbtOverall ?? 88;

  const isMet = student.overallScore >= minOverall;
  if (!isMet) onResult(true, false);

  items.push({
    key: "toefl_overall",
    nameEn: "TOEFL iBT Overall Score",
    nameBn: "টোয়েফল আইবিটি ওভারঅল স্কোর",
    requiredValue: `ন্যূনতম ${minOverall}`,
    studentValue: `${student.overallScore}`,
    status: isMet ? "MET" : "NOT_MET",
    explanationBn: isMet
      ? `আপনার টোয়েফল স্কোর (${student.overallScore}) আবশ্যক শর্ত (${minOverall}) পূরণ করেছে।`
      : `আপনার টোয়েফল স্কোর (${student.overallScore}) আবশ্যক কাট-অফ (${minOverall}) থেকে কম।`,
    explanationEn: isMet
      ? `Your TOEFL iBT score (${student.overallScore}) meets the cutoff (${minOverall}).`
      : `Your TOEFL iBT score (${student.overallScore}) is below cutoff (${minOverall}).`,
    officialSourceUrl: sourceUrl,
    requirementVersion: version,
  });
}

function evaluateDuolingo(
  student: StudentLanguageTestInput,
  req: ProgramLanguageRequirementData,
  items: EvaluatedRequirementItem[],
  onResult: (hardFail: boolean, cond: boolean) => void
) {
  const version = req.requirementVersion || 1;
  const sourceUrl = req.officialSourceUrl;

  if (!req.duolingoAccepted) {
    onResult(true, false);
    items.push({
      key: "duolingo_overall",
      nameEn: "Duolingo English Test (DET)",
      nameBn: "ডুওলিঙ্গো ইংলিশ টেস্ট",
      requiredValue: "এই প্রোগ্রামে ডুওলিঙ্গো গ্রহণযোগ্য নয় (IELTS/PTE আবশ্যক)",
      studentValue: `${student.overallScore}`,
      status: "NOT_MET",
      explanationBn: "এই নির্দিষ্ট বিশ্ববিদ্যালয় বা প্রোগ্রামে ডুওলিঙ্গো স্কোর গ্রহণ করা হয় না। অনুগ্রহ করে আইইএলটিএস অথবা পিটিই দিন।",
      explanationEn: "Duolingo is not accepted for this program. Please provide IELTS or PTE.",
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
    return;
  }

  const minOverall = req.minDuolingoScore ?? 115;
  const isMet = student.overallScore >= minOverall;
  if (!isMet) onResult(true, false);

  items.push({
    key: "duolingo_overall",
    nameEn: "Duolingo English Test Score",
    nameBn: "ডুওলিঙ্গো ইংলিশ টেস্ট স্কোর",
    requiredValue: `ন্যূনতম ${minOverall}`,
    studentValue: `${student.overallScore}`,
    status: isMet ? "MET" : "NOT_MET",
    explanationBn: isMet
      ? `আপনার ডুওলিঙ্গো স্কোর (${student.overallScore}) আবশ্যক শর্ত (${minOverall}) পূরণ করেছে।`
      : `আপনার ডুওলিঙ্গো স্কোর (${student.overallScore}) আবশ্যক কাট-অফ (${minOverall}) থেকে কম।`,
    explanationEn: isMet
      ? `Your Duolingo score (${student.overallScore}) meets the requirement (${minOverall}).`
      : `Your Duolingo score (${student.overallScore}) is below requirement (${minOverall}).`,
    officialSourceUrl: sourceUrl,
    requirementVersion: version,
  });
}
