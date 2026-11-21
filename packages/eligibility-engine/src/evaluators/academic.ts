import {
  EvaluatedRequirementItem,
  RequirementItemStatus,
  StudentAcademicRecordInput,
} from "@abroadmate/validation";
import { calculateBavarianGrade } from "../equivalency/bavarian";
import { convertToUkHonours, isUkClassificationSufficient } from "../equivalency/ukHonours";

export interface ProgramAcademicRequirementData {
  requiredDegreeLevel: string; // "BACHELOR", "MASTER", "HSC", etc.
  acceptedQualifications?: string[];
  requiredDisciplines: string[];
  minGpaOrCgpa: number;
  gpaScale: number;
  minPercentage?: number | null;
  minUkDegreeClassification?: string | null;
  maxGermanGrade?: number | null;
  countryCode: string;
  officialSourceUrl: string;
  requirementVersion: number;
}

const LEVEL_HIERARCHY: Record<string, number> = {
  SSC: 1,
  HSC: 2,
  DIPLOMA: 2,
  BACHELOR: 3,
  MASTER: 4,
  PHD: 5,
};

export function evaluateAcademicRequirements(
  student: StudentAcademicRecordInput | undefined,
  requirement: ProgramAcademicRequirementData
): {
  items: EvaluatedRequirementItem[];
  missingInfoList: string[];
  isHardFail: boolean;
} {
  const items: EvaluatedRequirementItem[] = [];
  const missingInfoList: string[] = [];
  let isHardFail = false;

  const version = requirement.requirementVersion || 1;
  const sourceUrl = requirement.officialSourceUrl;

  // 1. Missing Academic Record Check
  if (!student) {
    missingInfoList.push("শিক্ষাগত যোগ্যতার তথ্য অনুপস্থিত (Academic Records Missing)");
    items.push({
      key: "academic_degree_level",
      nameEn: "Completed Degree Level",
      nameBn: "শিক্ষাগত যোগ্যতার ডিগ্রি লেভেল",
      requiredValue: requirement.requiredDegreeLevel,
      studentValue: "N/A",
      status: "INFORMATION_MISSING",
      explanationBn: "আপনার প্রোফাইলে কোনো পূর্ববর্তী ডিগ্রির তথ্য পাওয়া যায়নি। প্রোফাইল আপডেট করুন।",
      explanationEn: "No previous academic record found in profile. Please update your profile.",
      missingInfoBn: "শিক্ষাগত যোগ্যতা ও ফলাফলের তথ্য যোগ করুন।",
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
    return { items, missingInfoList, isHardFail: true };
  }

  // 2. Degree Level Evaluation
  const studentLevelRank = LEVEL_HIERARCHY[student.degreeLevel] ?? 0;
  const requiredLevelRank = LEVEL_HIERARCHY[requirement.requiredDegreeLevel] ?? 3;

  let degreeLevelStatus: RequirementItemStatus = "MET";
  let degreeLevelExplanationBn = `আপনার ডিগ্রি লেভেল (${student.degreeLevel}) বিশ্ববিদ্যালয়ের আবশ্যক শর্ত (${requirement.requiredDegreeLevel}) সন্তোষজনকভাবে পূরণ করে।`;
  let degreeLevelExplanationEn = `Your degree level (${student.degreeLevel}) meets the program's required entry qualification (${requirement.requiredDegreeLevel}).`;

  if (studentLevelRank < requiredLevelRank) {
    degreeLevelStatus = "NOT_MET";
    isHardFail = true;
    degreeLevelExplanationBn = `এই প্রোগ্রামে আবেদনের জন্য ন্যূনতম ${requirement.requiredDegreeLevel} ডিগ্রি প্রয়োজন; কিন্তু আপনার বর্তমান ডিগ্রি ${student.degreeLevel}। সরাসরি ভর্তি সম্ভব নয়।`;
    degreeLevelExplanationEn = `The program requires a minimum ${requirement.requiredDegreeLevel} degree. Your current degree is ${student.degreeLevel}. Direct admission is not possible.`;
  } else if (student.degreeLevel === "HSC" && requirement.countryCode === "DE") {
    // Germany specific rule for HSC students
    degreeLevelStatus = "PARTIALLY_MET";
    degreeLevelExplanationBn = "জার্মানিতে সরাসরি ব্যাচেলরে ভর্তি হতে বাংলাদেশ থেকে ১ বছর বিশ্ববিদ্যালয়ে অধ্যয়ন অথবা ১ বছরের স্টুডিয়ানকলেগ (Studienkolleg/FSP) সম্পন্ন করা আবশ্যক।";
    degreeLevelExplanationEn = "In Germany, direct Bachelor admission with Bangladesh HSC requires 1 year of university studies in Bangladesh or 1-year Studienkolleg/FSP.";
  }

  items.push({
    key: "academic_degree_level",
    nameEn: "Required Entry Qualification",
    nameBn: "ন্যূনতম শিক্ষাগত ডিগ্রি",
    requiredValue: requirement.requiredDegreeLevel,
    studentValue: student.degreeLevel,
    status: degreeLevelStatus,
    explanationBn: degreeLevelExplanationBn,
    explanationEn: degreeLevelExplanationEn,
    officialSourceUrl: sourceUrl,
    requirementVersion: version,
  });

  // 3. Subject / Discipline Background Check
  if (requirement.requiredDisciplines && requirement.requiredDisciplines.length > 0) {
    const studentDiscipline = (student.discipline || "").toLowerCase().trim();
    const isDisciplineMatched = requirement.requiredDisciplines.some((disc) => {
      const lowerReq = disc.toLowerCase().trim();
      return (
        studentDiscipline.includes(lowerReq) ||
        lowerReq.includes(studentDiscipline) ||
        isRelatedDiscipline(studentDiscipline, lowerReq)
      );
    });

    let disciplineStatus: RequirementItemStatus = "MET";
    let disciplineExplanationBn = `আপনার বিষয় (${student.discipline}) প্রোগ্রামের আবশ্যক বিভাগীয় তালিকার অন্তর্ভুক্ত।`;
    let disciplineExplanationEn = `Your field of study (${student.discipline}) satisfies the discipline requirement.`;

    if (!isDisciplineMatched) {
      disciplineStatus = "NOT_MET";
      isHardFail = true;
      disciplineExplanationBn = `এই কোর্সের জন্য [${requirement.requiredDisciplines.join(", ")}] ব্যাকগ্রাউন্ড আবশ্যক; কিন্তু আপনার বিষয় (${student.discipline})।`;
      disciplineExplanationEn = `Program requires one of: [${requirement.requiredDisciplines.join(", ")}]. Your field is ${student.discipline}.`;
    }

    items.push({
      key: "academic_discipline",
      nameEn: "Required Subject / Discipline",
      nameBn: "আবশ্যক বিভাগ / বিষয় ব্যাকগ্রাউন্ড",
      requiredValue: requirement.requiredDisciplines.join(", "),
      studentValue: student.discipline,
      status: disciplineStatus,
      explanationBn: disciplineExplanationBn,
      explanationEn: disciplineExplanationEn,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
  }

  // 4. GPA / Equivalency Evaluation
  evaluateGpaAndEquivalency(student, requirement, items, missingInfoList, (fail) => {
    if (fail) isHardFail = true;
  });

  return { items, missingInfoList, isHardFail };
}

function evaluateGpaAndEquivalency(
  student: StudentAcademicRecordInput,
  requirement: ProgramAcademicRequirementData,
  items: EvaluatedRequirementItem[],
  missingInfoList: string[],
  onFail: (fail: boolean) => void
) {
  const version = requirement.requirementVersion || 1;
  const sourceUrl = requirement.officialSourceUrl;

  // A. German Bavarian Grade Check
  if (requirement.countryCode === "DE" && requirement.maxGermanGrade) {
    const bavarianResult = calculateBavarianGrade(student.gpa, student.scale || 4.0, 2.0);

    if (!bavarianResult) {
      items.push({
        key: "academic_german_grade",
        nameEn: "German Bavarian Formula Grade",
        nameBn: "জার্মান বাভারিয়ান ফর্মুলা সমমান গ্রেড",
        requiredValue: `সর্বোচ্চ ${requirement.maxGermanGrade.toFixed(2)} (১.০ সর্বোচ্চ)`,
        studentValue: "অনির্ধারিত",
        status: "UNABLE_TO_DETERMINE",
        explanationBn: "আপনার প্রদত্ত গ্রেডিং স্কেল বা সিজিপিএ বাভারিয়ান ফর্মুলায় রূপান্তর করা সম্ভব হয়নি।",
        explanationEn: "Unable to reliably convert your grade using the Modified Bavarian Formula.",
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
      return;
    }

    const isGermanGradeMet = bavarianResult.germanGrade <= requirement.maxGermanGrade;
    const status: RequirementItemStatus = isGermanGradeMet ? "MET" : "NOT_MET";

    if (!isGermanGradeMet) onFail(true);

    items.push({
      key: "academic_german_grade",
      nameEn: "German Grade Equivalent (Bavarian Formula)",
      nameBn: "জার্মান সমমান গ্রেড (বাভারিয়ান ফর্মুলা)",
      requiredValue: `ন্যূনতম ${requirement.maxGermanGrade.toFixed(2)} (বা এর চেয়ে ভালো)`,
      studentValue: `${bavarianResult.formattedGrade}`,
      status,
      explanationBn: isGermanGradeMet
        ? `${bavarianResult.explanationBn} এটি প্রোগ্রামের কাট-অফ (${requirement.maxGermanGrade.toFixed(2)}) পূরণ করেছে।`
        : `${bavarianResult.explanationBn} কিন্তু প্রোগ্রামের কাট-অফ (${requirement.maxGermanGrade.toFixed(2)}) পূরণ করতে পারেনি (জার্মানিতে কম গ্রেড ভালো)।`,
      explanationEn: isGermanGradeMet
        ? `${bavarianResult.explanationEn} Meets university requirement (<= ${requirement.maxGermanGrade.toFixed(2)}).`
        : `${bavarianResult.explanationEn} Does not meet university threshold (<= ${requirement.maxGermanGrade.toFixed(2)}).`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
    return;
  }

  // B. UK Degree Classification Check (1st, 2:1, 2:2)
  if (requirement.countryCode === "GB" && requirement.minUkDegreeClassification) {
    const ukResult = convertToUkHonours(student.gpa, student.scale || 4.0, student.percentage);
    const isUkMet = isUkClassificationSufficient(ukResult.classification, requirement.minUkDegreeClassification);
    const status: RequirementItemStatus = isUkMet ? "MET" : "NOT_MET";

    if (!isUkMet) onFail(true);

    items.push({
      key: "academic_uk_honours",
      nameEn: "UK Honours Degree Classification",
      nameBn: "যুক্তরাজ্য অনার্স সমমান গ্রেড",
      requiredValue: requirement.minUkDegreeClassification.replace(/_/g, " "),
      studentValue: `${ukResult.titleBn} (${student.gpa.toFixed(2)}/${student.scale})`,
      status,
      explanationBn: isUkMet
        ? `${ukResult.explanationBn} এটি কোর্সের আবশ্যক ডিগ্রি ক্লাসিফিকেশন পূরণ করেছে।`
        : `${ukResult.explanationBn} কিন্তু এই কোর্সের জন্য আবশ্যক ${requirement.minUkDegreeClassification.replace(/_/g, " ")} ক্লাসিফিকেশন।`,
      explanationEn: isUkMet
        ? `${ukResult.explanationEn} Meets UK entry requirement.`
        : `${ukResult.explanationEn} Below required UK classification (${requirement.minUkDegreeClassification}).`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
    return;
  }

  // C. Percentage Check (if specified)
  if (requirement.minPercentage && requirement.minPercentage > 0) {
    if (student.percentage === undefined || student.percentage === null) {
      // Calculate estimated percentage from CGPA if scale is 4.0
      const estimatedPercentage = student.scale === 4.0 ? (student.gpa / 4.0) * 100 : (student.gpa / 5.0) * 100;
      const isPercentMet = estimatedPercentage >= requirement.minPercentage;
      const status: RequirementItemStatus = isPercentMet ? "MET" : "NOT_MET";

      if (!isPercentMet) onFail(true);

      items.push({
        key: "academic_percentage",
        nameEn: "Minimum Academic Percentage",
        nameBn: "ন্যূনতম শতাংশ নম্বর (Percentage)",
        requiredValue: `${requirement.minPercentage}%`,
        studentValue: `আনুমানিক ${estimatedPercentage.toFixed(1)}% (সিজিপিএ থেকে গণনাকৃত)`,
        status,
        explanationBn: isPercentMet
          ? `আপনার সিজিপিএ থেকে রূপান্তরিত শতাংশ (${estimatedPercentage.toFixed(1)}%) ন্যূনতম শর্ত (${requirement.minPercentage}%) পূরণ করে।`
          : `আপনার শতাংশ (${estimatedPercentage.toFixed(1)}%) বিশ্ববিদ্যালয়ের আবশ্যক শর্ত (${requirement.minPercentage}%) থেকে কম।`,
        explanationEn: isPercentMet
          ? `Your percentage (${estimatedPercentage.toFixed(1)}%) meets the minimum requirement (${requirement.minPercentage}%).`
          : `Your percentage (${estimatedPercentage.toFixed(1)}%) is below the requirement (${requirement.minPercentage}%).`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
      return;
    }

    const isPercentMet = student.percentage >= requirement.minPercentage;
    const status: RequirementItemStatus = isPercentMet ? "MET" : "NOT_MET";
    if (!isPercentMet) onFail(true);

    items.push({
      key: "academic_percentage",
      nameEn: "Minimum Academic Percentage",
      nameBn: "ন্যূনতম শতাংশ নম্বর (Percentage)",
      requiredValue: `${requirement.minPercentage}%`,
      studentValue: `${student.percentage}%`,
      status,
      explanationBn: isPercentMet
        ? `আপনার প্রাপ্ত নম্বর (${student.percentage}%) আবশ্যক শর্ত (${requirement.minPercentage}%) পূরণ করে।`
        : `আপনার প্রাপ্ত নম্বর (${student.percentage}%) আবশ্যক শর্ত (${requirement.minPercentage}%) পূরণ করে না।`,
      explanationEn: isPercentMet
        ? `Your score of ${student.percentage}% meets the requirement (${requirement.minPercentage}%).`
        : `Your score of ${student.percentage}% is below the requirement (${requirement.minPercentage}%).`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
    return;
  }

  // D. Standard Minimum GPA Check
  let normalizedStudentGpa = student.gpa;
  if (student.scale !== requirement.gpaScale) {
    if (student.scale === 5.0 && requirement.gpaScale === 4.0) {
      // Bangladesh HSC 5.0 scale to 4.0 scale
      normalizedStudentGpa = (student.gpa / 5.0) * 4.0;
    } else if (student.scale === 4.0 && requirement.gpaScale === 5.0) {
      normalizedStudentGpa = (student.gpa / 4.0) * 5.0;
    } else {
      // Incompatible scale
      items.push({
        key: "academic_gpa_score",
        nameEn: "Minimum GPA / CGPA",
        nameBn: "ন্যূনতম জিপিএ / সিজিপিএ",
        requiredValue: `${requirement.minGpaOrCgpa.toFixed(2)} (${requirement.gpaScale.toFixed(1)} স্কেলে)`,
        studentValue: `${student.gpa.toFixed(2)} (${student.scale.toFixed(1)} স্কেলে)`,
        status: "UNABLE_TO_DETERMINE",
        explanationBn: "আপনার গ্রেডিং স্কেল এবং বিশ্ববিদ্যালয়ের স্কেলের মধ্যে সরাসরি সমমান যাচাই করা সম্ভব হয়নি।",
        explanationEn: "Unable to reliably determine equivalency between different grading scales.",
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
      return;
    }
  }

  const isGpaMet = normalizedStudentGpa >= requirement.minGpaOrCgpa;
  const status: RequirementItemStatus = isGpaMet ? "MET" : "NOT_MET";
  if (!isGpaMet) onFail(true);

  items.push({
    key: "academic_gpa_score",
    nameEn: "Minimum GPA / CGPA",
    nameBn: "ন্যূনতম জিপিএ / সিজিপিএ",
    requiredValue: `${requirement.minGpaOrCgpa.toFixed(2)} (${requirement.gpaScale.toFixed(1)} স্কেল)`,
    studentValue: `${student.gpa.toFixed(2)} (${student.scale.toFixed(1)} স্কেল)`,
    status,
    explanationBn: isGpaMet
      ? `আপনার ফলাফল (${student.gpa.toFixed(2)}) বিশ্ববিদ্যালয়ের ন্যূনতম কাট-অফ (${requirement.minGpaOrCgpa.toFixed(2)}) পূরণ করেছে।`
      : `আপনার ফলাফল (${student.gpa.toFixed(2)}) বিশ্ববিদ্যালয়ের কাট-অফ (${requirement.minGpaOrCgpa.toFixed(2)}) থেকে কম।`,
    explanationEn: isGpaMet
      ? `Your GPA (${student.gpa.toFixed(2)}) meets the minimum requirement (${requirement.minGpaOrCgpa.toFixed(2)}).`
      : `Your GPA (${student.gpa.toFixed(2)}) is below the required cutoff (${requirement.minGpaOrCgpa.toFixed(2)}).`,
    officialSourceUrl: sourceUrl,
    requirementVersion: version,
  });
}

function isRelatedDiscipline(studentField: string, requiredField: string): boolean {
  const csGroup = ["computer science", "cse", "software engineering", "information technology", "it", "data science", "ai", "artificial intelligence"];
  const isStudentCs = csGroup.some((f) => studentField.includes(f));
  const isReqCs = csGroup.some((f) => requiredField.includes(f));
  if (isStudentCs && isReqCs) return true;

  const bizGroup = ["business", "bba", "management", "finance", "accounting", "marketing", "economics"];
  const isStudentBiz = bizGroup.some((f) => studentField.includes(f));
  const isReqBiz = bizGroup.some((f) => requiredField.includes(f));
  if (isStudentBiz && isReqBiz) return true;

  const engGroup = ["electrical", "eee", "mechanical", "civil", "mechatronics", "engineering"];
  const isStudentEng = engGroup.some((f) => studentField.includes(f));
  const isReqEng = engGroup.some((f) => requiredField.includes(f));
  if (isStudentEng && isReqEng) return true;

  return false;
}
