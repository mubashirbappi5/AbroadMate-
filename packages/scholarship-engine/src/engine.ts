import {
  ScholarshipConditionBreakdownItem,
  ScholarshipEvaluationResult,
  ScholarshipRecord,
  ScholarshipStatus,
  StudentScholarshipProfileInput,
} from "./types";
import { evaluateScholarshipAcademic } from "./evaluators/academic";
import { evaluateScholarshipLanguage } from "./evaluators/language";
import { evaluateScholarshipExperience } from "./evaluators/experience";
import { evaluateScholarshipNationality } from "./evaluators/nationality";
import { calculateScholarshipExpenses } from "./evaluators/benefits";

export function evaluateScholarship(
  student: StudentScholarshipProfileInput,
  scholarship: ScholarshipRecord
): ScholarshipEvaluationResult {
  const breakdown: ScholarshipConditionBreakdownItem[] = [];
  const missingConditionsBn: string[] = [];
  let totalDeduction = 0;
  let hasHardFail = false;
  let canQualifyConditionally = false;

  const rule = scholarship.eligibilityRules?.[0] || {
    eligibleDegreeLevels: ["MASTER"],
    targetNationalities: ["BD"],
  };

  // 1. Nationality Check
  const natRes = evaluateScholarshipNationality(student, rule);
  breakdown.push(...natRes.items);
  if (natRes.isHardFail) hasHardFail = true;

  // 2. Academic Check (Degree level, discipline, CGPA)
  const acadRes = evaluateScholarshipAcademic(student, rule);
  breakdown.push(...acadRes.items);
  totalDeduction += acadRes.scoreDeduction;
  if (acadRes.isHardFail) hasHardFail = true;

  // 3. Language Check (IELTS/PTE sub-bands & status)
  const langRes = evaluateScholarshipLanguage(student, rule);
  breakdown.push(...langRes.items);
  totalDeduction += langRes.scoreDeduction;
  if (langRes.isHardFail) hasHardFail = true;
  if (langRes.canQualifyConditionally) canQualifyConditionally = true;

  // 4. Experience & Age Check
  const expRes = evaluateScholarshipExperience(student, rule);
  breakdown.push(...expRes.items);
  totalDeduction += expRes.scoreDeduction;
  if (expRes.isHardFail) hasHardFail = true;

  // 5. Calculate Benefits & Remaining Costs
  const { coveredBenefitsBn, uncoveredEstimatedBdt } = calculateScholarshipExpenses(scholarship);

  // 6. Aggregate Missing Conditions
  breakdown.forEach((item) => {
    if (item.status === "NOT_MET" || item.status === "INFORMATION_MISSING") {
      missingConditionsBn.push(`${item.nameBn}: ${item.requiredValue}`);
    }
  });

  // 7. Determine Final Status Deterministically (Zero LLM)
  let status: ScholarshipStatus = "NOT_ELIGIBLE";
  let statusTitleBn = "শর্ত অপূরিত (Not Eligible)";

  const hasMissingProfileInfo = breakdown.some(
    (item) => item.status === "INFORMATION_MISSING" && item.key.includes("cgpa")
  );

  if (hasMissingProfileInfo && !student.cgpa) {
    status = "UNABLE_TO_DETERMINE";
    statusTitleBn = "তথ্য অপর্যাপ্ত (Unable to Determine)";
  } else if (hasHardFail) {
    status = "NOT_ELIGIBLE";
    statusTitleBn = "শর্ত অপূরিত (Not Eligible)";
  } else if (canQualifyConditionally) {
    status = "CONDITIONALLY_ELIGIBLE";
    statusTitleBn = "শর্তযুক্ত আবেদনযোগ্য (Conditionally Eligible)";
  } else {
    status = "ELIGIBLE";
    statusTitleBn = "আবেদনের সম্পূর্ণ যোগ্য (Eligible)";
  }

  const rawScore = 100 - totalDeduction;
  const matchScore = hasHardFail ? Math.min(45, Math.max(10, rawScore)) : Math.max(50, Math.min(100, rawScore));

  // 8. Deadline status
  let isDeadlineOpen = true;
  let deadlineStr: string | undefined = undefined;
  if (scholarship.applicationDeadline) {
    const d = new Date(scholarship.applicationDeadline);
    isDeadlineOpen = d.getTime() > Date.now();
    deadlineStr = d.toISOString().split("T")[0];
  }

  return {
    scholarshipId: scholarship.id,
    titleEn: scholarship.titleEn,
    titleBn: scholarship.titleBn,
    countryCode: scholarship.countryCode,
    universityName: scholarship.university?.nameEn,
    providerName: scholarship.providerName,
    providerType: scholarship.providerType,
    fundingType: scholarship.fundingType,
    status,
    statusTitleBn,
    matchScore,
    breakdown,
    missingConditionsBn,
    coveredBenefitsBn,
    uncoveredEstimatedBdt,
    officialPortalUrl: scholarship.officialPortalUrl,
    deadlineNoticeBn: scholarship.deadlineNotice || undefined,
    applicationDeadline: deadlineStr,
    isDeadlineOpen,
    notesBn: scholarship.notesBn || undefined,
  };
}

export function evaluateScholarshipBatch(
  student: StudentScholarshipProfileInput,
  scholarships: ScholarshipRecord[]
): ScholarshipEvaluationResult[] {
  return scholarships
    .map((sch) => evaluateScholarship(student, sch))
    .sort((a, b) => b.matchScore - a.matchScore);
}
