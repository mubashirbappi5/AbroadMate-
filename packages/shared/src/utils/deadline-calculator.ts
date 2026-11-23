/**
 * Study Abroad Deadline & Reminder Calculation Engine
 * Pure deterministic calculation logic for application deadlines, intake timelines,
 * statutory visa windows, and multi-channel notification threshold alerts.
 */

export type DeadlineCategory =
  | "APPLICATION"
  | "SCHOLARSHIP"
  | "LANGUAGE_TEST"
  | "TUITION_DEPOSIT"
  | "VISA_SUBMISSION"
  | "BIOMETRICS"
  | "MEDICAL"
  | "PASSPORT_EXPIRY"
  | "UNIVERSITY_ENROLLMENT"
  | "CUSTOM";

export type DeadlineUrgency = "EXPIRED" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface DeadlineItem {
  id: string;
  titleBn: string;
  titleEn: string;
  deadlineDate: Date | string;
  category: DeadlineCategory;
  isCompleted?: boolean;
  customReminderDays?: number[];
}

export interface DeadlineEvaluationResult {
  deadlineId: string;
  daysRemaining: number;
  urgency: DeadlineUrgency;
  isOverdue: boolean;
  shouldTriggerReminder: boolean;
  matchedReminderDay: number | null;
  messageBn: string;
  messageEn: string;
  idempotencyKey: string | null;
}

export interface IntakeMilestone {
  key: string;
  category: DeadlineCategory;
  titleBn: string;
  titleEn: string;
  daysBeforeIntake: number;
  suggestedDate: string; // ISO date string YYYY-MM-DD
  mandatory: boolean;
  descriptionBn: string;
}

export const DEFAULT_REMINDER_DAYS = [30, 14, 7, 3, 1] as const;

/**
 * Converts Western digits to Bengali numerals
 */
export function toBengaliNumerals(n: number): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return n.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)] ?? d);
}

/**
 * Normalizes any Date or ISO string to UTC Midnight Date for deterministic day comparisons
 */
export function normalizeToUtcMidnight(d: Date | string): Date {
  const date = typeof d === "string" ? new Date(d) : new Date(d.getTime());
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Calculates calendar days remaining until target date from a reference date (UTC normalized)
 * Positive: Days in the future
 * 0: Due today
 * Negative: Days past due (overdue)
 */
export function calculateDaysRemaining(
  targetDate: Date | string,
  referenceDate: Date | string = new Date()
): number {
  const targetUtc = normalizeToUtcMidnight(targetDate);
  const refUtc = normalizeToUtcMidnight(referenceDate);

  const diffMs = targetUtc.getTime() - refUtc.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Categorizes the urgency tier of a deadline based on calendar days remaining
 */
export function classifyDeadlineUrgency(daysRemaining: number): DeadlineUrgency {
  if (daysRemaining < 0) return "EXPIRED";
  if (daysRemaining <= 3) return "CRITICAL";
  if (daysRemaining <= 14) return "HIGH";
  if (daysRemaining <= 30) return "MEDIUM";
  return "LOW";
}

/**
 * Generates an idempotent deduplication key for scheduled alerts
 */
export function generateDeadlineIdempotencyKey(
  deadlineId: string,
  reminderDay: number,
  dateStr: string
): string {
  return `deadline-alert-${deadlineId}-${reminderDay}d-${dateStr}`;
}

/**
 * Evaluates whether a deadline should trigger a notification alert today
 */
export function evaluateDeadlineNotification(
  item: DeadlineItem,
  referenceDate: Date | string = new Date(),
  userReminderDays?: number[]
): DeadlineEvaluationResult {
  const daysRemaining = calculateDaysRemaining(item.deadlineDate, referenceDate);
  const isOverdue = daysRemaining < 0;
  const urgency = classifyDeadlineUrgency(daysRemaining);

  // If completed, no alerts should ever be triggered
  if (item.isCompleted) {
    return {
      deadlineId: item.id,
      daysRemaining,
      urgency,
      isOverdue,
      shouldTriggerReminder: false,
      matchedReminderDay: null,
      messageBn: `সম্পন্ন: '${item.titleBn}'`,
      messageEn: `Completed: '${item.titleEn}'`,
      idempotencyKey: null,
    };
  }

  // Determine active notification thresholds (custom user preferences or defaults: 30, 14, 7, 3, 1)
  const thresholds =
    item.customReminderDays && item.customReminderDays.length > 0
      ? item.customReminderDays
      : userReminderDays && userReminderDays.length > 0
      ? userReminderDays
      : [...DEFAULT_REMINDER_DAYS];

  const matched = thresholds.includes(daysRemaining) ? daysRemaining : null;
  const shouldTrigger = matched !== null && daysRemaining >= 0;

  const refUtcStr = normalizeToUtcMidnight(referenceDate).toISOString().split("T")[0] || "";
  const idempotencyKey = shouldTrigger ? generateDeadlineIdempotencyKey(item.id, matched!, refUtcStr) : null;

  let messageBn: string;
  let messageEn: string;

  if (isOverdue) {
    const overdueDays = Math.abs(daysRemaining);
    const bnOverdue = toBengaliNumerals(overdueDays);
    messageBn = `⚠️ সময়সীমা অতিক্রান্ত: '${item.titleBn}' এর ডেডলাইন ${bnOverdue} দিন আগে শেষ হয়েছে।`;
    messageEn = `⚠️ Overdue: Deadline for '${item.titleEn}' expired ${overdueDays} day(s) ago.`;
  } else if (daysRemaining === 0) {
    messageBn = `🚨 চূড়ান্ত সতর্কতা: আজ '${item.titleBn}' এর শেষ দিন!`;
    messageEn = `🚨 Final Alert: Today is the deadline for '${item.titleEn}'!`;
  } else if (daysRemaining === 1) {
    messageBn = `⚠️ জরুরি সতর্কবার্তা: আগামীকাল '${item.titleBn}' এর চূড়ান্ত সময়সীমা!`;
    messageEn = `⚠️ Urgent: Tomorrow is the deadline for '${item.titleEn}'!`;
  } else if (daysRemaining <= 3) {
    const bnDays = toBengaliNumerals(daysRemaining);
    messageBn = `🚨 জরুরি রিমাইন্ডার: আর মাত্র ${bnDays} দিন বাকি আছে '${item.titleBn}' এর জন্য।`;
    messageEn = `🚨 Urgent reminder: Only ${daysRemaining} days left for '${item.titleEn}'.`;
  } else {
    const bnDays = toBengaliNumerals(daysRemaining);
    messageBn = `🔔 রিমাইন্ডার: '${item.titleBn}' এর সময়সীমা শেষ হতে আর ${bnDays} দিন বাকি।`;
    messageEn = `🔔 Reminder: ${daysRemaining} days remaining for '${item.titleEn}'.`;
  }

  return {
    deadlineId: item.id,
    daysRemaining,
    urgency,
    isOverdue,
    shouldTriggerReminder: shouldTrigger,
    matchedReminderDay: matched,
    messageBn,
    messageEn,
    idempotencyKey,
  };
}

/**
 * Batch evaluates a list of deadlines, returning only pending notifications or full summaries
 */
export function batchEvaluateDeadlines(
  items: DeadlineItem[],
  referenceDate: Date | string = new Date(),
  userReminderDays?: number[]
): DeadlineEvaluationResult[] {
  return items.map((item) => evaluateDeadlineNotification(item, referenceDate, userReminderDays));
}

/**
 * Calculates recommended milestone deadlines going backward from a target university intake start date.
 * Useful for automated roadmap scheduling and personalized timeline planning.
 */
export function calculateIntakeMilestones(targetIntakeDate: Date | string): IntakeMilestone[] {
  const intakeDate = normalizeToUtcMidnight(targetIntakeDate);

  const offsetToDate = (daysBefore: number): string => {
    const d = new Date(intakeDate.getTime() - daysBefore * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0] || "";
  };

  return [
    {
      key: "PASSPORT_CHECK",
      category: "PASSPORT_EXPIRY",
      titleBn: "পাসপোর্টের মেয়াদ যাচাই (কমপক্ষে ১৮ মাস)",
      titleEn: "Passport Validity Check (Min 18 Months)",
      daysBeforeIntake: 450, // ~15 months before
      suggestedDate: offsetToDate(450),
      mandatory: true,
      descriptionBn: "ভিসা আবেদনের সময়ে পাসপোর্টে পর্যাপ্ত মেয়াদ থাকা বাধ্যতামূলক।",
    },
    {
      key: "LANGUAGE_EXAM",
      category: "LANGUAGE_TEST",
      titleBn: "আইইএলটিএস / পিটিই পরীক্ষা সম্পন্নকরণ",
      titleEn: "IELTS / PTE Academic Exam Completion",
      daysBeforeIntake: 270, // ~9 months before
      suggestedDate: offsetToDate(270),
      mandatory: true,
      descriptionBn: "বিশ্ববিদ্যালয়ে অফার লেটার ও বৃত্তির আবেদনের পূর্বশর্ত।",
    },
    {
      key: "SCHOLARSHIP_DEADLINE",
      category: "SCHOLARSHIP",
      titleBn: "জাতীয় ও প্রাতিষ্ঠানিক স্কলারশিপ আবেদন",
      titleEn: "National & Institutional Scholarship Application",
      daysBeforeIntake: 240, // ~8 months before
      suggestedDate: offsetToDate(240),
      mandatory: false,
      descriptionBn: "শেভেনিং, কমনওয়েলথ বা বিশ্ববিদ্যালয়ের মেধা বৃত্তির ডেডলাইন।",
    },
    {
      key: "UNIVERSITY_APPLICATION",
      category: "APPLICATION",
      titleBn: "বিশ্ববিদ্যালয় আবেদনপত্র জমাদান",
      titleEn: "University Application Submission",
      daysBeforeIntake: 180, // ~6 months before
      suggestedDate: offsetToDate(180),
      mandatory: true,
      descriptionBn: "অফার লেটার প্রাপ্তির জন্য নির্দিষ্ট সময়ের মধ্যে ফরম ও নথিপত্র জমা।",
    },
    {
      key: "TUITION_DEPOSIT",
      category: "TUITION_DEPOSIT",
      titleBn: "টিউশন ফি ডিপোজিট ও CAS / LOA প্রাপ্তি",
      titleEn: "Tuition Deposit Payment & CAS / LOA Issuance",
      daysBeforeIntake: 90, // ~3 months before
      suggestedDate: offsetToDate(90),
      mandatory: true,
      descriptionBn: "ভিসা ফাইল জমা দেওয়ার জন্য অফিশিয়াল কনফার্মেশন লেটার সংগ্রহ।",
    },
    {
      key: "VISA_SUBMISSION",
      category: "VISA_SUBMISSION",
      titleBn: "স্টুডেন্ট ভিসা আবেদন জমাদান",
      titleEn: "Student Visa Application Submission",
      daysBeforeIntake: 75, // ~2.5 months before
      suggestedDate: offsetToDate(75),
      mandatory: true,
      descriptionBn: "ব্যাংক সলভেন্সি ও সকল প্রয়োজনীয় কাগজপত্রসহ অনলাইন ভিসা আবেদন।",
    },
    {
      key: "BIOMETRICS_MEDICAL",
      category: "BIOMETRICS",
      titleBn: "বায়োমেট্রিক্স ও মেডিকেল টেস্ট",
      titleEn: "Biometrics & Medical Examination",
      daysBeforeIntake: 60, // ~2 months before
      suggestedDate: offsetToDate(60),
      mandatory: true,
      descriptionBn: "ভিএফএস গ্লোবাল বা অনুমোদিত ক্লিনিকে স্বাস্থ্য পরীক্ষা ও ফিঙ্গারপ্রিন্ট।",
    },
    {
      key: "ENROLLMENT_ARRIVAL",
      category: "UNIVERSITY_ENROLLMENT",
      titleBn: "বিশ্ববিদ্যালয় রিপোর্টিং ও ইন-পার্সন এনরোলমেন্ট",
      titleEn: "University Reporting & On-campus Enrollment",
      daysBeforeIntake: 7, // 1 week before
      suggestedDate: offsetToDate(7),
      mandatory: true,
      descriptionBn: "ক্যাম্পাসে উপস্থিতি, ছাত্র আইডি কার্ড গ্রহণ ও ওরিয়েন্টেশন।",
    },
  ];
}
