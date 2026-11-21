import {
  ScholarshipConditionBreakdownItem,
  ScholarshipRuleRecord,
  StudentScholarshipProfileInput,
} from "../types";

export function evaluateScholarshipNationality(
  student: StudentScholarshipProfileInput,
  rule: ScholarshipRuleRecord
): {
  items: ScholarshipConditionBreakdownItem[];
  isHardFail: boolean;
} {
  const items: ScholarshipConditionBreakdownItem[] = [];
  let isHardFail = false;

  const targetNationalities = rule.targetNationalities || ["BD"];
  const studentNationality = (student.nationality || "BD").toUpperCase();

  const isMatched =
    targetNationalities.includes("ALL") ||
    targetNationalities.includes(studentNationality) ||
    (studentNationality === "BANGLADESHI" && targetNationalities.includes("BD"));

  if (isMatched) {
    items.push({
      key: "nationality_eligibility",
      nameBn: "নাগরিকত্ব ও জাতীয়তা",
      nameEn: "Nationality Eligibility",
      requiredValue: targetNationalities.includes("ALL") ? "সকল দেশের নাগরিক" : "বাংলাদেশি নাগরিক (BD)",
      studentValue: "বাংলাদেশি (Bangladeshi)",
      status: "MET",
      explanationBn: "বাংলাদেশি নাগরিক হিসেবে আপনি এই বৃত্তির আবেদন করতে যোগ্য।",
      explanationEn: "As a Bangladeshi citizen, you are eligible for this award.",
    });
  } else {
    isHardFail = true;
    items.push({
      key: "nationality_eligibility",
      nameBn: "নাগরিকত্ব ও জাতীয়তা",
      nameEn: "Nationality Eligibility",
      requiredValue: targetNationalities.join(", "),
      studentValue: studentNationality,
      status: "NOT_MET",
      explanationBn: `এই স্কলারশিপটি শুধুমাত্র [${targetNationalities.join(", ")}] দেশের নাগরিকদের জন্য উন্মুক্ত।`,
      explanationEn: `This scholarship is restricted to citizens of: [${targetNationalities.join(", ")}].`,
    });
  }

  return { items, isHardFail };
}
