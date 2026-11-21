import {
  ScholarshipConditionBreakdownItem,
  ScholarshipRuleRecord,
  StudentScholarshipProfileInput,
} from "../types";

export function evaluateScholarshipAcademic(
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

  // 1. Degree Level Match
  if (rule.eligibleDegreeLevels && rule.eligibleDegreeLevels.length > 0) {
    const studentLevel = student.degreeLevel || "BACHELOR";
    const isLevelEligible = rule.eligibleDegreeLevels.includes(studentLevel);

    if (isLevelEligible) {
      items.push({
        key: "academic_degree_level",
        nameBn: "যোগ্য ডিগ্রি পর্যায়",
        nameEn: "Eligible Degree Level",
        requiredValue: rule.eligibleDegreeLevels.join(", "),
        studentValue: studentLevel,
        status: "MET",
        explanationBn: `আপনার বর্তমান/টার্গেট ডিগ্রি লেভেল (${studentLevel}) এই বৃত্তির যোগ্য তালিকার অন্তর্ভুক্ত।`,
        explanationEn: `Your degree level (${studentLevel}) is eligible for this scholarship.`,
      });
    } else {
      isHardFail = true;
      scoreDeduction += 50;
      items.push({
        key: "academic_degree_level",
        nameBn: "যোগ্য ডিগ্রি পর্যায়",
        nameEn: "Eligible Degree Level",
        requiredValue: rule.eligibleDegreeLevels.join(", "),
        studentValue: studentLevel,
        status: "NOT_MET",
        explanationBn: `এই বৃত্তির জন্য [${rule.eligibleDegreeLevels.join(", ")}] ডিগ্রির শিক্ষার্থী হতে হবে; আপনার ডিগ্রি লেভেল ${studentLevel}।`,
        explanationEn: `Scholarship requires one of [${rule.eligibleDegreeLevels.join(", ")}]. Your level is ${studentLevel}.`,
      });
    }
  }

  // 2. Discipline / Subject Match
  if (rule.eligibleDisciplines && rule.eligibleDisciplines.length > 0) {
    const isAllDisciplines = rule.eligibleDisciplines.some((d) => d.toLowerCase() === "all" || d.toLowerCase() === "সকল বিষয়");
    const studentDisc = (student.discipline || "").toLowerCase();

    const isMatched = isAllDisciplines || rule.eligibleDisciplines.some((d) => {
      const lowerReq = d.toLowerCase();
      return studentDisc.includes(lowerReq) || lowerReq.includes(studentDisc);
    });

    if (isMatched) {
      items.push({
        key: "academic_discipline",
        nameBn: "যোগ্য পাঠ্য বিষয় / বিভাগ",
        nameEn: "Eligible Field of Study",
        requiredValue: isAllDisciplines ? "সকল বিষয় উন্মুক্ত" : rule.eligibleDisciplines.join(", "),
        studentValue: student.discipline || "General",
        status: "MET",
        explanationBn: "আপনার পড়ার বিষয় এই বৃত্তির আওতাভুক্ত।",
        explanationEn: "Your field of study is eligible.",
      });
    } else {
      isHardFail = true;
      scoreDeduction += 40;
      items.push({
        key: "academic_discipline",
        nameBn: "যোগ্য পাঠ্য বিষয় / বিভাগ",
        nameEn: "Eligible Field of Study",
        requiredValue: rule.eligibleDisciplines.join(", "),
        studentValue: student.discipline || "অন্যান্য",
        status: "NOT_MET",
        explanationBn: `এই বৃত্তিটি শুধুমাত্র [${rule.eligibleDisciplines.join(", ")}] বিষয়ের শিক্ষার্থীদের জন্য নির্ধারিত।`,
        explanationEn: `This scholarship is restricted to: [${rule.eligibleDisciplines.join(", ")}].`,
      });
    }
  }

  // 3. Minimum CGPA / Percentage
  if (rule.minCgpaRequired && rule.minCgpaRequired > 0) {
    if (student.cgpa === undefined || student.cgpa === null || student.cgpa === 0) {
      items.push({
        key: "academic_cgpa",
        nameBn: "ন্যূনতম সিজিপিএ / একাডেমিক ফলাফল",
        nameEn: "Minimum CGPA / Academic Result",
        requiredValue: `ন্যূনতম ${rule.minCgpaRequired.toFixed(2)} (${(rule.gpaScale || 4.0).toFixed(1)} স্কেলে)`,
        studentValue: "তথ্য পাওয়া যায়নি",
        status: "INFORMATION_MISSING",
        explanationBn: "আপনার প্রোফাইলে সিজিপিএ-র তথ্য উল্লেখ নেই। প্রোফাইল আপডেট করুন।",
        explanationEn: "CGPA information is missing in your profile.",
      });
      scoreDeduction += 30;
    } else {
      const studentScale = student.scale || 4.0;
      const targetScale = rule.gpaScale || 4.0;
      const normalizedGpa = studentScale === targetScale ? student.cgpa : (student.cgpa / studentScale) * targetScale;

      const isCgpaMet = normalizedGpa >= rule.minCgpaRequired;
      if (isCgpaMet) {
        items.push({
          key: "academic_cgpa",
          nameBn: "ন্যূনতম সিজিপিএ / একাডেমিক ফলাফল",
          nameEn: "Minimum CGPA / Academic Result",
          requiredValue: `ন্যূনতম ${rule.minCgpaRequired.toFixed(2)} (${targetScale.toFixed(1)} স্কেল)`,
          studentValue: `${student.cgpa.toFixed(2)} (${studentScale.toFixed(1)} স্কেল)`,
          status: "MET",
          explanationBn: `আপনার সিজিপিএ (${student.cgpa.toFixed(2)}) বৃত্তির ন্যূনতম শর্ত (${rule.minCgpaRequired.toFixed(2)}) পূরণ করেছে।`,
          explanationEn: `Your CGPA (${student.cgpa.toFixed(2)}) satisfies the minimum requirement (${rule.minCgpaRequired.toFixed(2)}).`,
        });
      } else {
        isHardFail = true;
        scoreDeduction += 45;
        items.push({
          key: "academic_cgpa",
          nameBn: "ন্যূনতম সিজিপিএ / একাডেমিক ফলাফল",
          nameEn: "Minimum CGPA / Academic Result",
          requiredValue: `ন্যূনতম ${rule.minCgpaRequired.toFixed(2)} (${targetScale.toFixed(1)} স্কেল)`,
          studentValue: `${student.cgpa.toFixed(2)} (${studentScale.toFixed(1)} স্কেল)`,
          status: "NOT_MET",
          explanationBn: `আপনার সিজিপিএ (${student.cgpa.toFixed(2)}) বৃত্তির কাট-অফ (${rule.minCgpaRequired.toFixed(2)}) থেকে কম। মেধাভিত্তিক সরকারি বৃত্তিতে সিজিপিএ শিথিলযোগ্য নয়।`,
          explanationEn: `Your CGPA (${student.cgpa.toFixed(2)}) is below the cutoff (${rule.minCgpaRequired.toFixed(2)}).`,
        });
      }
    }
  }

  return { items, isHardFail, scoreDeduction };
}
