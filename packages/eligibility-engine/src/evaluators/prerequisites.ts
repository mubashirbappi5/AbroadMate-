import { EvaluatedRequirementItem, RequirementItemStatus } from "@abroadmate/validation";

export interface ProgramPrerequisiteRequirementData {
  workExperienceMonths: number;
  workExperienceRequired: boolean;
  workExperienceField?: string | null;
  greRequired: boolean;
  minGreOverall?: number | null;
  minGreQuant?: number | null;
  minGreVerbal?: number | null;
  gmatRequired: boolean;
  minGmatScore?: number | null;
  portfolioRequired: boolean;
  officialSourceUrl: string;
  requirementVersion: number;
}

export interface StudentPrerequisiteInputData {
  workExperienceMonths?: number;
  workExperienceField?: string;
  greScore?: {
    overall?: number;
    quant?: number;
    verbal?: number;
  };
  gmatScore?: number;
  hasPortfolio?: boolean;
}

export function evaluatePrerequisites(
  student: StudentPrerequisiteInputData | undefined,
  requirement: ProgramPrerequisiteRequirementData
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

  // 1. Work Experience Check
  if (requirement.workExperienceRequired && requirement.workExperienceMonths > 0) {
    const studentMonths = student?.workExperienceMonths ?? 0;
    const isWorkMet = studentMonths >= requirement.workExperienceMonths;
    const status: RequirementItemStatus = isWorkMet ? "MET" : "NOT_MET";

    if (!isWorkMet) {
      isHardFail = true;
      missingInfoList.push(`কাজের অভিজ্ঞতার ঘাটতি: ন্যূনতম ${requirement.workExperienceMonths} মাস আবশ্যক`);
    }

    items.push({
      key: "work_experience",
      nameEn: "Relevant Work Experience",
      nameBn: "সংশ্লিষ্ট কাজের অভিজ্ঞতা",
      requiredValue: `ন্যূনতম ${requirement.workExperienceMonths} মাস (${requirement.workExperienceField || "সংশ্লিষ্ট ক্ষেত্র"})`,
      studentValue: `${studentMonths} মাস`,
      status,
      explanationBn: isWorkMet
        ? `আপনার ${studentMonths} মাসের কাজের অভিজ্ঞতা আবশ্যক শর্ত (${requirement.workExperienceMonths} মাস) পূরণ করে।`
        : `এই প্রোগ্রামে আবেদনের জন্য ন্যূনতম ${requirement.workExperienceMonths} মাসের পেশাদার অভিজ্ঞতা আবশ্যক; আপনার বর্তমান অভিজ্ঞতা ${studentMonths} মাস।`,
      explanationEn: isWorkMet
        ? `Your experience of ${studentMonths} months meets the requirement (${requirement.workExperienceMonths} months).`
        : `Program requires ${requirement.workExperienceMonths} months of experience. You currently have ${studentMonths} months.`,
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
  }

  // 2. GRE Check
  if (requirement.greRequired) {
    const minGre = requirement.minGreOverall ?? 310;
    const studentGre = student?.greScore?.overall;

    if (!studentGre || studentGre === 0) {
      isHardFail = true;
      missingInfoList.push("জিআরই (GRE) স্কোর জমা দেওয়া আবশ্যক");
      items.push({
        key: "standardized_test_gre",
        nameEn: "GRE General Test",
        nameBn: "জিআরই জেনারেল টেস্ট স্কোর",
        requiredValue: `ন্যূনতম ${minGre} (Quant: ${requirement.minGreQuant ?? 160})`,
        studentValue: "জমা দেওয়া হয়নি (Missing)",
        status: "INFORMATION_MISSING",
        explanationBn: "এই প্রোগ্রামে ভর্তির আবেদনের জন্য জিআরই স্কোর থাকা আবশ্যক।",
        explanationEn: "Official GRE test score is required for admission consideration.",
        missingInfoBn: `ন্যূনতম ${minGre} স্কোর নিয়ে জিআরই সম্পন্ন করুন।`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
    } else {
      const isGreMet = studentGre >= minGre;
      if (!isGreMet) isHardFail = true;

      items.push({
        key: "standardized_test_gre",
        nameEn: "GRE General Test Score",
        nameBn: "জিআরই জেনারেল টেস্ট স্কোর",
        requiredValue: `ন্যূনতম ${minGre}`,
        studentValue: `${studentGre}`,
        status: isGreMet ? "MET" : "NOT_MET",
        explanationBn: isGreMet
          ? `আপনার জিআরই স্কোর (${studentGre}) আবশ্যক কাট-অফ (${minGre}) পূরণ করেছে।`
          : `আপনার জিআরই স্কোর (${studentGre}) আবশ্যক কাট-অফ (${minGre}) থেকে কম।`,
        explanationEn: isGreMet
          ? `Your GRE score (${studentGre}) meets the cutoff (${minGre}).`
          : `Your GRE score (${studentGre}) is below the required cutoff (${minGre}).`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
    }
  }

  // 3. GMAT Check
  if (requirement.gmatRequired) {
    const minGmat = requirement.minGmatScore ?? 600;
    const studentGmat = student?.gmatScore;

    if (!studentGmat || studentGmat === 0) {
      isHardFail = true;
      missingInfoList.push("জিম্যাট (GMAT) স্কোর জমা দেওয়া আবশ্যক");
      items.push({
        key: "standardized_test_gmat",
        nameEn: "GMAT Exam Score",
        nameBn: "জিম্যাট (GMAT) পরীক্ষার স্কোর",
        requiredValue: `ন্যূনতম ${minGmat}`,
        studentValue: "জমা দেওয়া হয়নি",
        status: "INFORMATION_MISSING",
        explanationBn: "বিজনেস স্কুলের এই প্রোগ্রামে জিম্যাট স্কোর জমা দেওয়া বাধ্যতামূলক।",
        explanationEn: "GMAT score is mandatory for admission to this business program.",
        missingInfoBn: `ন্যূনতম ${minGmat} স্কোর সহ জিম্যাট সম্পন্ন করুন।`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
    } else {
      const isGmatMet = studentGmat >= minGmat;
      if (!isGmatMet) isHardFail = true;

      items.push({
        key: "standardized_test_gmat",
        nameEn: "GMAT Exam Score",
        nameBn: "জিম্যাট (GMAT) পরীক্ষার স্কোর",
        requiredValue: `ন্যূনতম ${minGmat}`,
        studentValue: `${studentGmat}`,
        status: isGmatMet ? "MET" : "NOT_MET",
        explanationBn: isGmatMet
          ? `আপনার জিম্যাট স্কোর (${studentGmat}) আবশ্যক শর্ত পূরণ করেছে।`
          : `আপনার জিম্যাট স্কোর (${studentGmat}) আবশ্যক কাট-অফ (${minGmat}) থেকে কম।`,
        explanationEn: isGmatMet
          ? `Your GMAT score (${studentGmat}) meets the cutoff (${minGmat}).`
          : `Your GMAT score (${studentGmat}) is below cutoff (${minGmat}).`,
        officialSourceUrl: sourceUrl,
        requirementVersion: version,
      });
    }
  }

  // 4. Portfolio Check
  if (requirement.portfolioRequired) {
    const hasPortfolio = Boolean(student?.hasPortfolio);
    items.push({
      key: "academic_portfolio",
      nameEn: "Creative / Project Portfolio",
      nameBn: "প্রজেক্ট / ক্রিয়েটিভ পোর্টফোলিও",
      requiredValue: "প্রজেক্ট পোর্টফোলিও বাধ্যতামূলক",
      studentValue: hasPortfolio ? "প্রস্তুত রয়েছে" : "সংযুক্ত নেই",
      status: hasPortfolio ? "MET" : "PARTIALLY_MET",
      explanationBn: hasPortfolio
        ? "আপনার পোর্টফোলিও প্রস্তুত রয়েছে যা অ্যাডমিশন কমিটি মূল্যায়ন করবে।"
        : "এই কোর্সের জন্য প্রজেক্ট পোর্টফোলিও বা কাজের নমুনা জমা দিতে হবে। এখনই প্রস্তুত করুন।",
      explanationEn: hasPortfolio
        ? "Portfolio is prepared for admissions committee review."
        : "Creative or project portfolio is required for this program.",
      officialSourceUrl: sourceUrl,
      requirementVersion: version,
    });
  }

  return { items, missingInfoList, isHardFail };
}
