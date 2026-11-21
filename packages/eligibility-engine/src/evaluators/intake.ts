import { EvaluatedRequirementItem, RequirementItemStatus } from "@abroadmate/validation";

export interface ProgramIntakeData {
  id?: string;
  season: string; // "FALL", "SPRING", "SUMMER", "WINTER"
  year: number;
  applicationDeadline: Date | string;
  sessionStartDate?: Date | string | null;
  officialSourceUrl: string;
}

export function evaluateIntakeAndDeadline(
  intake: ProgramIntakeData | undefined,
  currentDate: Date = new Date()
): {
  items: EvaluatedRequirementItem[];
  deadlinePassed: boolean;
  deadlineString?: string;
} {
  const items: EvaluatedRequirementItem[] = [];

  if (!intake) {
    return { items, deadlinePassed: false };
  }

  const deadline = new Date(intake.applicationDeadline);
  const isPassed = deadline.getTime() < currentDate.getTime();
  const deadlineFormatted = deadline.toISOString().split("T")[0];

  const diffDays = Math.ceil((deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  const status: RequirementItemStatus = isPassed ? "NOT_MET" : "MET";

  items.push({
    key: "intake_application_deadline",
    nameEn: `Application Deadline (${intake.season} ${intake.year})`,
    nameBn: `আবেদনের শেষ সময়সীমা (${intake.season} ${intake.year})`,
    requiredValue: `শেষ তারিখ: ${deadlineFormatted}`,
    studentValue: isPassed ? "ডেডলাইন অতিক্রান্ত (Expired)" : `আবেদনের সুযোগ রয়েছে (${diffDays} দিন বাকি)`,
    status,
    explanationBn: isPassed
      ? `এই সেশনের (${intake.season} ${intake.year}) আবেদনের শেষ তারিখ (${deadlineFormatted}) পার হয়ে গেছে। অনুগ্রহ করে পরবর্তী সেশনের জন্য আবেদন করুন।`
      : `এই ইনটেকে আবেদনের জন্য এখনও ${diffDays} দিন সময় রয়েছে। নির্ধারিত সময়ের পূর্বেই আবেদন সম্পন্ন করুন।`,
    explanationEn: isPassed
      ? `The application deadline (${deadlineFormatted}) for this intake has passed. Please check the next intake.`
      : `Application is open. ${diffDays} days remaining before the deadline (${deadlineFormatted}).`,
    officialSourceUrl: intake.officialSourceUrl,
    requirementVersion: 1,
  });

  return { items, deadlinePassed: isPassed, deadlineString: deadlineFormatted };
}
