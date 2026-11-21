import {
  ScholarshipConditionBreakdownItem,
  ScholarshipRuleRecord,
  StudentScholarshipProfileInput,
} from "../types";

export function evaluateScholarshipLanguage(
  student: StudentScholarshipProfileInput,
  rule: ScholarshipRuleRecord
): {
  items: ScholarshipConditionBreakdownItem[];
  isHardFail: boolean;
  canQualifyConditionally: boolean;
  scoreDeduction: number;
} {
  const items: ScholarshipConditionBreakdownItem[] = [];
  let isHardFail = false;
  let canQualifyConditionally = false;
  let scoreDeduction = 0;

  const minIelts = rule.minIeltsRequired || 6.5;
  const minEachBand = rule.minIeltsEachBand || 6.0;

  // Case 1: Student has not taken any test yet or planned only
  if (
    !student.ieltsOverall ||
    student.ieltsOverall === 0 ||
    student.isLanguagePlannedOnly ||
    student.languageTestType === "NONE"
  ) {
    canQualifyConditionally = true;
    scoreDeduction += 20;

    items.push({
      key: "language_proficiency",
      nameBn: "ইংরেজি ভাষা দক্ষতা (IELTS / PTE)",
      nameEn: "English Language Proficiency",
      requiredValue: `আইইএলটিএস ওভারঅল ${minIelts.toFixed(1)} (প্রতিটি ব্যান্ডে ${minEachBand.toFixed(1)})`,
      studentValue: student.isLanguagePlannedOnly ? "পরিকল্পনাধীন (Planned)" : "পরীক্ষা দেওয়া হয়নি",
      status: "PARTIALLY_MET",
      explanationBn: `আপনি এখনও পরীক্ষা দেননি। তবে বৃত্তির চূড়ান্ত ডেডলাইনের পূর্বে ন্যূনতম ${minIelts.toFixed(1)} স্কোর অর্জন করতে পারলে আবেদন গ্রহণযোগ্য হবে।`,
      explanationEn: `Language test not taken yet. You must achieve overall ${minIelts.toFixed(1)} before the deadline.`,
    });

    return { items, isHardFail, canQualifyConditionally, scoreDeduction };
  }

  // Case 2: Overall Score Check
  const studentOverall = student.ieltsOverall;
  const isOverallMet = studentOverall >= minIelts;
  const diff = minIelts - studentOverall;

  if (isOverallMet) {
    items.push({
      key: "language_overall",
      nameBn: "আইইএলটিএস ওভারঅল স্কোর",
      nameEn: "IELTS Overall Score",
      requiredValue: `ন্যূনতম ${minIelts.toFixed(1)}`,
      studentValue: `${studentOverall.toFixed(1)}`,
      status: "MET",
      explanationBn: `আপনার আইইএলটিএস ব্যান্ড (${studentOverall.toFixed(1)}) বৃত্তির ন্যূনতম আবশ্যক শর্ত পূরণ করেছে।`,
      explanationEn: `Your IELTS overall band (${studentOverall.toFixed(1)}) meets the cutoff (${minIelts.toFixed(1)}).`,
    });
  } else if (diff <= 0.5) {
    canQualifyConditionally = true;
    scoreDeduction += 15;
    items.push({
      key: "language_overall",
      nameBn: "আইইএলটিএস ওভারঅল স্কোর",
      nameEn: "IELTS Overall Score",
      requiredValue: `ন্যূনতম ${minIelts.toFixed(1)}`,
      studentValue: `${studentOverall.toFixed(1)}`,
      status: "PARTIALLY_MET",
      explanationBn: `আপনার স্কোর (${studentOverall.toFixed(1)}) শর্ত (${minIelts.toFixed(1)}) থেকে মাত্র ০.৫ কম। পুনরায় পরীক্ষা দিয়ে সহজেই শর্ত পূরণ সম্ভব।`,
      explanationEn: `Your score (${studentOverall.toFixed(1)}) is 0.5 below requirement (${minIelts.toFixed(1)}). Retake recommended.`,
    });
  } else {
    isHardFail = true;
    scoreDeduction += 35;
    items.push({
      key: "language_overall",
      nameBn: "আইইএলটিএস ওভারঅল স্কোর",
      nameEn: "IELTS Overall Score",
      requiredValue: `ন্যূনতম ${minIelts.toFixed(1)}`,
      studentValue: `${studentOverall.toFixed(1)}`,
      status: "NOT_MET",
      explanationBn: `আপনার স্কোর (${studentOverall.toFixed(1)}) বৃত্তির আবশ্যক শর্ত (${minIelts.toFixed(1)}) থেকে কম।`,
      explanationEn: `Your score (${studentOverall.toFixed(1)}) fails the requirement (${minIelts.toFixed(1)}).`,
    });
  }

  // Sub-band check (Writing / Speaking / Reading / Listening)
  if (student.ieltsWriting !== undefined) {
    const isWritingMet = student.ieltsWriting >= minEachBand;
    if (!isWritingMet) {
      if (minEachBand - student.ieltsWriting <= 0.5) {
        canQualifyConditionally = true;
        scoreDeduction += 10;
      } else {
        isHardFail = true;
        scoreDeduction += 20;
      }
      items.push({
        key: "language_writing",
        nameBn: "আইইএলটিএস রাইটিং ব্যান্ড",
        nameEn: "IELTS Writing Band",
        requiredValue: `ন্যূনতম ${minEachBand.toFixed(1)}`,
        studentValue: `${student.ieltsWriting.toFixed(1)}`,
        status: isWritingMet ? "MET" : "PARTIALLY_MET",
        explanationBn: `রাইটিং ব্যান্ড (${student.ieltsWriting.toFixed(1)}) ন্যূনতম শর্ত পূরণ করেনি।`,
        explanationEn: `Writing band (${student.ieltsWriting.toFixed(1)}) below minimum (${minEachBand.toFixed(1)}).`,
      });
    }
  }

  return { items, isHardFail, canQualifyConditionally, scoreDeduction };
}
