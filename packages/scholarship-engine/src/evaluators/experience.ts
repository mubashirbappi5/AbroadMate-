import {
  ScholarshipConditionBreakdownItem,
  ScholarshipRuleRecord,
  StudentScholarshipProfileInput,
} from "../types";

export function evaluateScholarshipExperience(
  student: StudentScholarshipProfileInput,
  rule: ScholarshipRuleRecord
): {
  items: ScholarshipConditionBreakdownItem[];
  isHardFail: boolean;
  scoreDeduction: number;
} {
  const items: ScholarshipConditionBreakdownItem[] = [];
  let isHardFail = false;
  let scoreDeduction = 0;

  const reqMonths = rule.workExperienceMonths || 0;

  if (reqMonths > 0) {
    const studentMonths = student.workExperienceMonths || 0;
    const isMet = studentMonths >= reqMonths;

    if (isMet) {
      items.push({
        key: "work_experience",
        nameBn: "পেশাগত কাজের অভিজ্ঞতা",
        nameEn: "Professional Work Experience",
        requiredValue: `ন্যূনতম ${reqMonths} মাস (${Math.round(reqMonths / 12)} বছর)`,
        studentValue: `${studentMonths} মাস`,
        status: "MET",
        explanationBn: `আপনার ${studentMonths} মাসের কাজের অভিজ্ঞতা বৃত্তির শর্ত (${reqMonths} মাস) পূরণ করেছে।`,
        explanationEn: `Your ${studentMonths} months of experience meets requirement (${reqMonths} months).`,
      });
    } else {
      isHardFail = true;
      scoreDeduction += 40;
      items.push({
        key: "work_experience",
        nameBn: "পেশাগত কাজের অভিজ্ঞতা",
        nameEn: "Professional Work Experience",
        requiredValue: `ন্যূনতম ${reqMonths} মাস (${Math.round(reqMonths / 12)} বছর)`,
        studentValue: `${studentMonths} মাস`,
        status: "NOT_MET",
        explanationBn: `এই মর্যাদাপূর্ণ বৃত্তির জন্য ন্যূনতম ${reqMonths} মাসের চাকরির অভিজ্ঞতা আবশ্যক; আপনার অভিজ্ঞতা ${studentMonths} মাস। ফ্রেশ গ্র্যাজুয়েটরা সরাসরি আবেদন করতে পারবেন না।`,
        explanationEn: `Program requires ${reqMonths} months of experience. You currently have ${studentMonths} months.`,
      });
    }
  }

  // Age restriction check
  if (rule.maxAge) {
    const studentAge = student.age;
    if (studentAge) {
      const isAgeValid = studentAge <= rule.maxAge;
      if (!isAgeValid) {
        isHardFail = true;
        scoreDeduction += 50;
      }
      items.push({
        key: "eligibility_age",
        nameBn: "বয়স সীমা",
        nameEn: "Age Limit",
        requiredValue: `অনূর্ধ্ব ${rule.maxAge} বছর`,
        studentValue: `${studentAge} বছর`,
        status: isAgeValid ? "MET" : "NOT_MET",
        explanationBn: isAgeValid
          ? `আপনার বয়স (${studentAge} বছর) নির্ধারিত সীমার মধ্যে রয়েছে।`
          : `আপনার বয়স (${studentAge} বছর) বৃত্তির সর্বোচ্চ বয়স সীমা (${rule.maxAge} বছর) অতিক্রম করেছে।`,
        explanationEn: isAgeValid
          ? `Your age (${studentAge}) satisfies the age criteria.`
          : `Your age (${studentAge}) exceeds the maximum age limit (${rule.maxAge}).`,
      });
    }
  }

  return { items, isHardFail, scoreDeduction };
}
