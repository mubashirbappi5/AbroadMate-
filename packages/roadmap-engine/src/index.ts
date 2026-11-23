/**
 * @abroadmate/roadmap-engine
 * Free, deterministic, circumstance-aware roadmap generator and deadline engine for Bangladeshi students.
 */

export type RoadmapPhaseKey =
  | "PREPARATION"
  | "ACADEMIC_PREPARATION"
  | "LANGUAGE_PREPARATION"
  | "UNIVERSITY_APPLICATION"
  | "SCHOLARSHIP_APPLICATION"
  | "ADMISSION_CONFIRMATION"
  | "FINANCIAL_PREPARATION"
  | "STUDENT_VISA_APPLICATION"
  | "BIOMETRICS_AND_MEDICAL"
  | "VISA_DECISION"
  | "PRE_DEPARTURE"
  | "ARRIVAL_AND_ENROLLMENT";

export type TaskStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "WAITING"
  | "COMPLETED"
  | "BLOCKED"
  | "SKIPPED";

export type TaskPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface RoadmapTaskDefinition {
  id?: string;
  taskCode: string;
  phaseKey: RoadmapPhaseKey;
  titleBn: string;
  titleEn: string;
  bengaliExplanation: string;
  whyItMattersBn: string;
  requiredDocuments: string[];
  estimatedCostBdt: number;
  costCurrency: string;
  estimatedDurationDays: number;
  monthsBeforeIntake: number;
  startDate?: string | null;
  dueDate?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dependencies: string[];
  officialSourceUrl: string;
  officialSourceOrg: string;
  completionCriteriaBn: string;
  needsReview: boolean;
  actionUrl?: string | null;
  isCompleted: boolean;
  completedAt?: string | null;
}

export interface RoadmapPhaseDefinition {
  id?: string;
  phaseNumber: number;
  phaseKey: RoadmapPhaseKey;
  titleBn: string;
  titleEn: string;
  timeframeNoticeBn: string;
  tasks: RoadmapTaskDefinition[];
  isCompleted: boolean;
}

export interface StudentRoadmapProfileInput {
  targetCountryCode: string; // "GB", "CA", "AU", "DE", "US"
  targetIntakeSeason: "fall" | "spring" | "summer";
  targetIntakeYear: number;
  targetUniversityId?: string;
  targetUniversityName?: string;
  targetProgramId?: string;
  targetProgramName?: string;
  degreeLevel?: "BACHELOR" | "MASTER" | "DOCTORATE";
  fundingChoice?: "SCHOLARSHIP_FUNDED" | "SELF_FUNDED";
  scholarshipId?: string;
  scholarshipName?: string;
  englishProficiencyScore?: number;
  hasValidPassport?: boolean;
}

/**
 * Calculates calendar intake anchor date.
 * Fall -> Sept 15, Spring -> Jan 15, Summer -> May 15
 */
export function calculateIntakeDate(season: "fall" | "spring" | "summer", year: number): Date {
  const month = season === "fall" ? 8 : season === "spring" ? 0 : 4; // 0-indexed (Aug, Jan, May)
  const day = 15;
  return new Date(Date.UTC(year, month, day, 0, 0, 0));
}

/**
 * Calculates start and due dates based on months offset from intake.
 */
export function calculateTaskDates(
  intakeDate: Date,
  monthsBeforeIntake: number,
  durationDays: number
): { startDate: string; dueDate: string } {
  const due = new Date(intakeDate);
  due.setMonth(due.getMonth() - monthsBeforeIntake);

  const start = new Date(due);
  start.setDate(start.getDate() - durationDays);

  return {
    startDate: start.toISOString().split("T")[0] ?? "",
    dueDate: due.toISOString().split("T")[0] ?? "",
  };
}

/**
 * Phase 1: Preparation (প্রাথমিক প্রস্তুতি ও পাসপোর্ট)
 */
function buildPhase1Preparation(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const t1Dates = calculateTaskDates(intakeDate, 14, 21);
  const t2Dates = calculateTaskDates(intakeDate, 13, 30);
  const t3Dates = calculateTaskDates(intakeDate, 12, 14);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_PASSPORT_CHECK",
      phaseKey: "PREPARATION",
      titleBn: "পাসপোর্টের মেয়াদ যাচাই ও ই-পাসপোর্ট আবেদন",
      titleEn: "Passport Validity Check & e-Passport Application",
      bengaliExplanation:
        "ভিসা আবেদনের জন্য পাসপোর্টে কমপক্ষে ৬ মাস এবং আদর্শভাবে কাঙ্ক্ষিত কোর্স সমাপ্তির চেয়ে অতিরিক্ত ৬ মাসের মেয়াদ থাকতে হয়। মেয়াদ কম থাকলে অবিলম্বে রি-ইস্যু বা নতুন ১০ বছর মেয়াদি ই-পাসপোর্টের আবেদন করুন।",
      whyItMattersBn:
        "ভিসা স্ট্যাম্পিং এবং বিশ্ববিদ্যালয় অফার লেটার জারির ক্ষেত্রে পাসপোর্টের নাম ও জন্মতারিখের হুবহু মিল ও পর্যাপ্ত মেয়াদ থাকা আবশ্যক।",
      requiredDocuments: ["জাতীয় পরিচয়পত্র (NID) / জন্মনিবন্ধন", "পূর্ববর্তী পাসপোর্ট (যদি থাকে)", "পাসপোর্ট সাইজ ছবি"],
      estimatedCostBdt: input.hasValidPassport ? 0 : 5750,
      costCurrency: "BDT",
      estimatedDurationDays: 21,
      monthsBeforeIntake: 14,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: input.hasValidPassport ? "COMPLETED" : "NOT_STARTED",
      dependencies: [],
      officialSourceUrl: "https://www.epassport.gov.bd",
      officialSourceOrg: "Department of Immigration and Passports, Bangladesh",
      completionCriteriaBn: "কমপক্ষে ২-৩ বছর মেয়াদি বৈধ ই-পাসপোর্ট হাতে পাওয়া।",
      needsReview: false,
      isCompleted: !!input.hasValidPassport,
      completedAt: input.hasValidPassport ? new Date().toISOString() : null,
    },
    {
      taskCode: "TASK_SHORTLIST_PROGRAMS",
      phaseKey: "PREPARATION",
      titleBn: "পছন্দের দেশ ও বিশ্ববিদ্যালয়ের সাবজেক্ট শর্টলিস্ট",
      titleEn: "Shortlist Target Countries & Academic Programs",
      bengaliExplanation:
        "আপনার একাডেমিক সিজিপিএ, বাজেট ও ক্যারিয়ার লক্ষ্যের সাথে মানানসই অন্তত ৩ থেকে ৫টি বিশ্ববিদ্যালয় ও সাবজেক্ট শর্টলিস্ট করুন। টিউশন ফি, লিভিং কস্ট ও পিএসডব্লিউ পোস্ট-স্টাডি ওয়ার্ক পারমিটের শর্ত যাচাই করুন।",
      whyItMattersBn:
        "সঠিক বিশ্ববিদ্যালয় নির্বাচন না করলে অ্যাপ্লিকেশন ফি অপচয় এবং রিফিউজালের ঝুঁকি তৈরি হয়।",
      requiredDocuments: ["অনার্স/এইচএসসি মার্কশিট", "সিভি/জীবনবৃত্তান্ত"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 30,
      monthsBeforeIntake: 13,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "HIGH",
      status: "NOT_STARTED",
      dependencies: ["TASK_PASSPORT_CHECK"],
      officialSourceUrl: "https://abroadmate.com/universities",
      officialSourceOrg: "AbroadMate University Directory",
      completionCriteriaBn: "কমপক্ষে ৩টি প্রোগ্রাম ও তাদের অ্যাডমিশন ডেডলাইন লিপিবদ্ধ করা।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_PROFILE_AUDIT",
      phaseKey: "PREPARATION",
      titleBn: "স্টুডেন্ট প্রোফাইল ও বাজেট পরিকল্পনা সম্পন্নকরণ",
      titleEn: "Student Profile & Budget Feasibility Audit",
      bengaliExplanation:
        "AbroadMate ফাইন্যান্সিয়াল ক্যালকুলেটরে গিয়ে টিউশন ফি, লিভিং ফান্ড এবং ইমিগ্রেশন খরচের মোট বাজেট যাচাই করে পরিবারের আর্থিক প্রস্তুতি নিশ্চিত করুন।",
      whyItMattersBn:
        "ভিসা প্রসেসিংয়ের মাঝপথে আকস্মিক ফান্ড সংকট পড়া রোধ করার একমাত্র উপায় হলো আগাম বাজেট অডিট।",
      requiredDocuments: ["ব্যাংক স্টেটমেন্ট খসড়া", "পারিবারিক আয়ের প্রমাণপত্র"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: 12,
      startDate: t3Dates.startDate,
      dueDate: t3Dates.dueDate,
      priority: "HIGH",
      status: "NOT_STARTED",
      dependencies: ["TASK_SHORTLIST_PROGRAMS"],
      officialSourceUrl: "https://abroadmate.com/calculator",
      officialSourceOrg: "AbroadMate Financial Planner",
      completionCriteriaBn: "AbroadMate বাজেট প্ল্যানার সেভ করা এবং সম্ভাব্য ফান্ডের উৎস নির্ধারণ করা।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 1,
    phaseKey: "PREPARATION",
    titleBn: "প্রাথমিক প্রস্তুতি ও পাসপোর্ট",
    titleEn: "Early Preparation & Passport",
    timeframeNoticeBn: "ইনটেকের ১২-১৪ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 2: Academic Preparation (একাডেমিক প্রস্তুতি ও ট্রান্সক্রিপ্ট)
 */
function buildPhase2Academic(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const isGermany = input.targetCountryCode === "DE";
  const isNorthAmerica = input.targetCountryCode === "US" || input.targetCountryCode === "CA";

  const t1Dates = calculateTaskDates(intakeDate, 11, 21);
  const t2Dates = calculateTaskDates(intakeDate, 10, 30);
  const t3Dates = calculateTaskDates(intakeDate, 9, 21);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_ACADEMIC_TRANSCRIPTS",
      phaseKey: "ACADEMIC_PREPARATION",
      titleBn: "অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট ও সার্টিফিকেট সংগ্রহ",
      titleEn: "Collect Official Academic Transcripts & Certificates",
      bengaliExplanation:
        "শিক্ষা বোর্ড বা বিশ্ববিদ্যালয় পরীক্ষা নিয়ন্ত্রক দপ্তর থেকে সিলগালা খামে (sealed envelope) অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট এবং প্রভিশনাল বা মূল সনদ সংগ্রহ করুন।",
      whyItMattersBn:
        "অ্যাডমিশন কমিটি ও ইমিগ্রেশন কোনো অবস্থাতেই আনঅফিসিয়াল বা ইন্টারনেটের রেজাল্ট শিট গ্রহণ করে না।",
      requiredDocuments: ["রেজিস্ট্রেশন কার্ড", "অ্যাডমিট কার্ড", "সকল সেমিস্টার মার্কশিট"],
      estimatedCostBdt: 3500,
      costCurrency: "BDT",
      estimatedDurationDays: 21,
      monthsBeforeIntake: 11,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_SHORTLIST_PROGRAMS"],
      officialSourceUrl: "https://www.educationboard.gov.bd",
      officialSourceOrg: "Board of Intermediate and Secondary Education, Bangladesh",
      completionCriteriaBn: "বিশ্ববিদ্যালয় বা বোর্ডের অফিসিয়াল সিল ও স্বাক্ষরিত ট্রান্সক্রিপ্ট হাতে থাকা।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_LOR_ACADEMIC",
      phaseKey: "ACADEMIC_PREPARATION",
      titleBn: "প্রফেসরদের কাছ থেকে ২টি একাডেমিক রিকমেন্ডেশন লেটার (LOR)",
      titleEn: "Secure 2-3 Academic Letters of Recommendation (LOR)",
      bengaliExplanation:
        "আপনার পূর্ববর্তী অনুষদের শিক্ষক, বিভাগীয় প্রধান বা থিসিস সুপারভাইজারের সাথে যোগাযোগ করে তাদের অফিসিয়াল প্রাতিষ্ঠানিক ইমেইল ও প্যাডে রিকমেন্ডেশন লেটার সংগ্রহ করুন।",
      whyItMattersBn:
        "শীর্ষ বিশ্ববিদ্যালয় এবং স্কলারশিপ কমিটি প্রার্থীর গবেষণা ও একাডেমিক সততা যাচাইয়ে LOR-কে সর্বোচ্চ গুরুত্ব দেয়।",
      requiredDocuments: ["আপডেটেড সিভি", "ট্রান্সক্রিপ্ট কপি", "থিসিস/প্রজেক্ট সারসংক্ষেপ"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 30,
      monthsBeforeIntake: 10,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "HIGH",
      status: "NOT_STARTED",
      dependencies: ["TASK_ACADEMIC_TRANSCRIPTS"],
      officialSourceUrl: "https://abroadmate.com/sop-builder",
      officialSourceOrg: "AbroadMate Academic Guide",
      completionCriteriaBn: "অন্তত ২ জন শিক্ষকের লিখিত সম্মতি ও অফিসিয়াল লেটারহেডে প্রত্যায়নপত্র পাওয়া।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  // Country specific evaluations
  if (isGermany) {
    const apsDates = calculateTaskDates(intakeDate, 10, 45);
    tasks.push({
      taskCode: "TASK_GER_APS_CERTIFICATE",
      phaseKey: "ACADEMIC_PREPARATION",
      titleBn: "এপিএস (APS) সার্টিফিকেট আবেদন ও ভেরিফিকেশন (জার্মানি)",
      titleEn: "APS Certificate Application & Verification for Germany",
      bengaliExplanation:
        "জার্মানিতে উচ্চশিক্ষার আবেদনের জন্য বাংলাদেশি শিক্ষার্থীদের নতুন ইমিগ্রেশন নীতি অনুযায়ী এপিএস ইন্ডিয়া/জার্মান দূতাবাস দ্বারা একাডেমিক সার্টিফিকেট যাচাইপূর্বক APS সার্টিফিকেট বাধ্যতামূলক।",
      whyItMattersBn:
        "বৈধ APS সার্টিফিকেট ছাড়া জার্মান বিশ্ববিদ্যালয় আবেদন কিংবা ভিসা অ্যাপয়েন্টমেন্ট কোনোটিই কার্যকর হয় না।",
      requiredDocuments: ["নোটারাইজড সার্টিফিকেট ও ট্রান্সক্রিপ্ট", "পাসপোর্ট কপি", "APS আবেদন ফর্ম"],
      estimatedCostBdt: 24000,
      costCurrency: "BDT",
      estimatedDurationDays: 45,
      monthsBeforeIntake: 10,
      startDate: apsDates.startDate,
      dueDate: apsDates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_ACADEMIC_TRANSCRIPTS"],
      officialSourceUrl: "https://aps-india.de",
      officialSourceOrg: "Academic Evaluation Centre (APS)",
      completionCriteriaBn: "অনলাইনে ভেরিফাইড APS সার্টিফিকেট ইস্যু হওয়া।",
      needsReview: false,
      isCompleted: false,
    });
  } else if (isNorthAmerica) {
    const wesDates = calculateTaskDates(intakeDate, 9, 30);
    tasks.push({
      taskCode: "TASK_WES_EVALUATION",
      phaseKey: "ACADEMIC_PREPARATION",
      titleBn: "WES বা সমমানের কোর্স-বাই-কোর্স ক্রেডেনশিয়াল মূল্যায়ন",
      titleEn: "WES Credential Evaluation (Course-by-Course)",
      bengaliExplanation:
        "উত্তর আমেরিকার (USA/Canada) অনেক বিশ্ববিদ্যালয়ের মাস্টার্স প্রোগ্রামের জন্য ৩ বা ৪ বছর মেয়াদি ডিগ্রিকে মার্কিন ৪.০ জিপিএ স্কেলে কনভার্ট করতে WES ইভ্যালুয়েশন প্রয়োজন হতে পারে।",
      whyItMattersBn:
        "আপনার বাংলাদেশি বিশ্ববিদ্যালয় গ্র্যাজুয়েট ক্রেডিট সমমান নিশ্চিত করার জন্য এই মূল্যায়ন আবশ্যক।",
      requiredDocuments: ["বিশ্ববিদ্যালয় থেকে সরাসরি ডেসপ্যাচ করা ট্রান্সক্রিপ্ট", "ডিগ্রি সনদ"],
      estimatedCostBdt: 28000,
      costCurrency: "BDT",
      estimatedDurationDays: 30,
      monthsBeforeIntake: 9,
      startDate: wesDates.startDate,
      dueDate: wesDates.dueDate,
      priority: "MEDIUM",
      status: "NOT_STARTED",
      dependencies: ["TASK_ACADEMIC_TRANSCRIPTS"],
      officialSourceUrl: "https://www.wes.org",
      officialSourceOrg: "World Education Services",
      completionCriteriaBn: "অফিসিয়াল WES ডিজিটাল ব্যাজ ও রিপোর্ট বিশ্ববিদ্যালয়ের পোর্টালে পাঠানো।",
      needsReview: false,
      isCompleted: false,
    });
  }

  // MOFA Attestation
  tasks.push({
    taskCode: "TASK_MOFA_ATTESTATION",
    phaseKey: "ACADEMIC_PREPARATION",
    titleBn: "শিক্ষা মন্ত্রণালয় ও পররাষ্ট্র মন্ত্রণালয় (MOFA) সত্যায়ন",
    titleEn: "Ministry of Education & MOFA Document Attestation",
    bengaliExplanation:
      "সকল একাডেমিক মূল সনদ ও মার্কশিট প্রথমে নিজ শিক্ষাবোর্ড/বিশ্ববিদ্যালয়, অতঃপর শিক্ষা মন্ত্রণালয় এবং সবশেষে পররাষ্ট্র মন্ত্রণালয় ঢাকা থেকে সত্যায়ন করিয়ে নিন।",
    whyItMattersBn:
      "বিদেশের দূতাবাস ও ভিসা অফিসার বাংলাদেশি ডকুমেন্টের সত্যতা নিরূপণে পররাষ্ট্র মন্ত্রণালয়ের অ্যাপোস্টিল বা সত্যায়ন সিল চেক করেন।",
    requiredDocuments: ["মূল সার্টিফিকেট", "মূল ট্রান্সক্রিপ্ট", "পাসপোর্টের ফটোকপি"],
    estimatedCostBdt: 1200,
    costCurrency: "BDT",
    estimatedDurationDays: 14,
    monthsBeforeIntake: 9,
    startDate: t3Dates.startDate,
    dueDate: t3Dates.dueDate,
    priority: "HIGH",
    status: "NOT_STARTED",
    dependencies: ["TASK_ACADEMIC_TRANSCRIPTS"],
    officialSourceUrl: "https://mofa.gov.bd",
    officialSourceOrg: "Ministry of Foreign Affairs, Bangladesh",
    completionCriteriaBn: "ডকুমেন্টের পেছনের পৃষ্ঠায় শিক্ষা মন্ত্রণালয় ও পররাষ্ট্র মন্ত্রণালয়ের গোল সিল ও স্বাক্ষর থাকা।",
    needsReview: false,
    isCompleted: false,
  });

  return {
    phaseNumber: 2,
    phaseKey: "ACADEMIC_PREPARATION",
    titleBn: "একাডেমিক প্রস্তুতি ও ট্রান্সক্রিপ্ট",
    titleEn: "Academic Documentation & Attestations",
    timeframeNoticeBn: "ইনটেকের ৯-১১ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 3: Language Preparation (ভাষাগত দক্ষতা ও টেস্ট)
 */
function buildPhase3Language(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const hasValidScore = typeof input.englishProficiencyScore === "number" && input.englishProficiencyScore >= 6.5;
  const t1Dates = calculateTaskDates(intakeDate, 9, 30);
  const t2Dates = calculateTaskDates(intakeDate, 8, 14);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_IELTS_PREPARATION",
      phaseKey: "LANGUAGE_PREPARATION",
      titleBn: "আইইএলটিএস / টোফেল নিয়মিত অনুশীলন ও মক টেস্ট",
      titleEn: "Structured IELTS / TOEFL Preparation & Mock Tests",
      bengaliExplanation:
        "লিসেনিং, রিডিং, রাইটিং এবং স্পিকিং মডিউলে প্রতিদিন নিয়মমাফিক অনুশীলন করুন এবং ব্রিটিশ কাউন্সিল বা বিশ্বস্ত সেন্টারে অন্তত ৩টি পূর্ণাঙ্গ মক টেস্ট দিন।",
      whyItMattersBn:
        "কাঙ্ক্ষিত ব্যান্ড স্কোর (যেমন ন্যূনতম ৬.৫, প্রতিটি ব্যান্ডে ৬.০+) অর্জন না করলে বিশ্ববিদ্যালয় সরাসরি আবেদন বাতিল করতে পারে।",
      requiredDocuments: ["মক টেস্ট রেজাল্ট শিট"],
      estimatedCostBdt: hasValidScore ? 0 : 5000,
      costCurrency: "BDT",
      estimatedDurationDays: 30,
      monthsBeforeIntake: 9,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "HIGH",
      status: hasValidScore ? "COMPLETED" : "NOT_STARTED",
      dependencies: [],
      officialSourceUrl: "https://www.ielts.org",
      officialSourceOrg: "IELTS Official",
      completionCriteriaBn: "মক পরীক্ষায় কাঙ্ক্ষিত ব্যান্ড স্কোরে পৌঁছানো।",
      needsReview: false,
      isCompleted: hasValidScore,
      completedAt: hasValidScore ? new Date().toISOString() : null,
    },
    {
      taskCode: "TASK_IELTS_EXAM",
      phaseKey: "LANGUAGE_PREPARATION",
      titleBn: "আইইএলটিএস অফিশিয়াল টেস্ট ও টিআরএফ (TRF) গ্রহণ",
      titleEn: "Sit Official IELTS Academic Exam & Receive TRF",
      bengaliExplanation:
        "ব্রিটিশ কাউন্সিল বা আইডিপি বাংলাদেশ সেন্টারে পরীক্ষার স্লট বুক করে পরীক্ষায় অংশ নিন। পরীক্ষার ১৩ দিন পর (কম্পিউটার-বেজড হলে ৩-৫ দিনে) অফিসিয়াল টেস্ট রিপোর্ট ফর্ম (TRF) সংগ্রহ করুন।",
      whyItMattersBn:
        "বিশ্ববিদ্যালয় অফার লেটার ও ভিসা ফাইলে ভেরিফায়েবল টেস্ট রিপোর্ট নম্বর (TRF Number) সাবমিট করা বাধ্যতামূলক।",
      requiredDocuments: ["বৈধ মূল পাসপোর্ট"],
      estimatedCostBdt: hasValidScore ? 0 : 25500,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: 8,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: hasValidScore ? "COMPLETED" : "NOT_STARTED",
      dependencies: ["TASK_IELTS_PREPARATION"],
      officialSourceUrl: "https://www.britishcouncil.org.bd/en/exam/ielts",
      officialSourceOrg: "British Council Bangladesh",
      completionCriteriaBn: "অফিসিয়াল টেস্ট রিপোর্ট ফর্মে ন্যূনতম প্রয়োজনীয় স্কোর অর্জন।",
      needsReview: false,
      isCompleted: hasValidScore,
      completedAt: hasValidScore ? new Date().toISOString() : null,
    },
  ];

  return {
    phaseNumber: 3,
    phaseKey: "LANGUAGE_PREPARATION",
    titleBn: "ভাষাগত দক্ষতা ও টেস্ট (IELTS/PTE)",
    titleEn: "Language Exam & Certification",
    timeframeNoticeBn: "ইনটেকের ৮-৯ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 4: University Application (বিশ্ববিদ্যালয় আবেদন ও এসওপি)
 */
function buildPhase4University(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const t1Dates = calculateTaskDates(intakeDate, 8, 21);
  const t2Dates = calculateTaskDates(intakeDate, 7, 14);
  const t3Dates = calculateTaskDates(intakeDate, 7, 10);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_SOP_DRAFT",
      phaseKey: "UNIVERSITY_APPLICATION",
      titleBn: "স্টেটমেন্ট অব পারপাস (SOP) বা মোটিভেশন লেটার রচনা",
      titleEn: "Draft Tailored Statement of Purpose (SOP)",
      bengaliExplanation:
        "কেন আপনি এই নির্দিষ্ট সাবজেক্ট ও বিশ্ববিদ্যালয় বেছে নিয়েছেন, আপনার পূর্ববর্তী একাডেমিক ব্যাকগ্রাউন্ড এবং ভবিষ্যৎ ক্যারিয়ার পরিকল্পনা সুস্পষ্টভাবে তুলে ধরে ৮০০-১০০০ শব্দের এসওপি প্রস্তুত করুন।",
      whyItMattersBn:
        "অ্যাডমিশন কমিটি ও ভিসা অফিসার প্রার্থীর উদ্দেশ্য ও প্রকৃত ছাত্রত্ব (Genuine Student) মূল্যায়নে এসওপি গভীরভাবে পড়ে।",
      requiredDocuments: ["একাডেমিক সিভি", "কোর্সের সিলেবাস কাঠামো"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 21,
      monthsBeforeIntake: 8,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_SHORTLIST_PROGRAMS", "TASK_ACADEMIC_TRANSCRIPTS"],
      officialSourceUrl: "https://abroadmate.com/sop-builder",
      officialSourceOrg: "AbroadMate SOP Builder",
      completionCriteriaBn: "প্লেজিয়ারিজম মুক্ত পূর্ণাঙ্গ খসড়া প্রস্তুত ও মেন্টর দ্বারা রিভিউর সমাপ্তি।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_APPLICATION_SUBMISSION",
      phaseKey: "UNIVERSITY_APPLICATION",
      titleBn: "বিশ্ববিদ্যালয় অনলাইন পোর্টালে সরাসরি আবেদন সাবমিট",
      titleEn: "Submit Direct Online Admission Applications",
      bengaliExplanation:
        "বিশ্ববিদ্যালয়ের অফিসিয়াল অনলাইন পোর্টালে (অথবা UK এর ক্ষেত্রে UCAS / জার্মানির ক্ষেত্রে Uni-Assist) সকল ট্রান্সক্রিপ্ট, পাসপোর্ট, সিভি, এসওপি এবং এলওআর নির্ভুলভাবে আপলোড করে আবেদন সাবমিট করুন।",
      whyItMattersBn:
        "ডেডলাইন মিস করলে ওই শিক্ষাবর্ষের জন্য আর কোনো আবেদন গ্রহণ করা হয় না।",
      requiredDocuments: ["পাসপোর্ট", "ট্রান্সক্রিপ্ট", "এসওপি", "এলওআর", "আইইএলটিএস টিআরএফ"],
      estimatedCostBdt: 12000,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: 7,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_SOP_DRAFT", "TASK_IELTS_EXAM"],
      officialSourceUrl: input.targetCountryCode === "GB" ? "https://www.ucas.com" : "https://www.uni-assist.de",
      officialSourceOrg: "Official University Admissions Portal",
      completionCriteriaBn: "অ্যাপ্লিকেশন সাবমিশন একনলেজমেন্ট স্লিপ ও রেফারেন্স আইডি প্রাপ্তি।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_APP_FEE_PAYMENT",
      phaseKey: "UNIVERSITY_APPLICATION",
      titleBn: "বিশ্ববিদ্যালয় অ্যাপ্লিকেশন ফি পরিশোধ (আন্তর্জাতিক কার্ড)",
      titleEn: "Pay University Application Fees via International Card",
      bengaliExplanation:
        "পাসপোর্টের বিপরীতে এন্ডোর্সমেন্টকৃত বাংলাদেশি ডুয়েল-কারেন্সি ক্রেডিট/ডেবিট কার্ড দিয়ে বিশ্ববিদ্যালয়ের নির্দিষ্ট আবেদন ফি পরিশোধ করুন।",
      whyItMattersBn:
        "ফি পরিশোধ নিশ্চিত না হওয়া পর্যন্ত বিশ্ববিদ্যালয় কর্তৃপক্ষ প্রোফাইল প্রসেসিং শুরু করে না।",
      requiredDocuments: ["পাসপোর্ট এন্ডোর্সড ডুয়েল কারেন্সি কার্ড", "পেমেন্ট রিসিপ্ট"],
      estimatedCostBdt: 8500,
      costCurrency: "BDT",
      estimatedDurationDays: 10,
      monthsBeforeIntake: 7,
      startDate: t3Dates.startDate,
      dueDate: t3Dates.dueDate,
      priority: "HIGH",
      status: "NOT_STARTED",
      dependencies: ["TASK_APPLICATION_SUBMISSION"],
      officialSourceUrl: "https://abroadmate.com",
      officialSourceOrg: "University Portal Payment Gateway",
      completionCriteriaBn: "পেমেন্ট কনফার্মেশন ট্রানজেকশন রিসিট ডাউনলোড করা।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 4,
    phaseKey: "UNIVERSITY_APPLICATION",
    titleBn: "বিশ্ববিদ্যালয় আবেদন ও এসওপি",
    titleEn: "University Application & Statement of Purpose",
    timeframeNoticeBn: "ইনটেকের ৭-৮ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 5: Scholarship Application (স্কলারশিপ আবেদন)
 * Conditionally included if fundingChoice !== "SELF_FUNDED"
 */
function buildPhase5Scholarship(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition | null {
  if (input.fundingChoice === "SELF_FUNDED") {
    return null; // Omitted for self-funded students
  }

  const t1Dates = calculateTaskDates(intakeDate, 8, 30);
  const t2Dates = calculateTaskDates(intakeDate, 7, 21);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_SCHOLARSHIP_ESSAYS",
      phaseKey: "SCHOLARSHIP_APPLICATION",
      titleBn: "স্কলারশিপ স্পেসিফিক এসে ও লিডারশিপ স্টেটমেন্ট রচনা",
      titleEn: "Draft Scholarship Specific Essays & Leadership Statements",
      bengaliExplanation:
        "শেভেনিং, কমনওয়েলথ, ডিএএডি বা বিশ্ববিদ্যালয়ের ভাইস-চ্যান্সেলর স্কলারশিপের ক্রাইটেরিয়া অনুযায়ী লিডারশিপ, নেটওয়ার্কিং এবং দেশের উন্নয়নে আপনার অবদান নিয়ে ৪টি স্বতন্ত্র এসে প্রস্তুত করুন।",
      whyItMattersBn:
        "সম্পূর্ণ অর্থায়ন নিশ্চিত করার প্রধান হাতিয়ার হলো ব্যতিক্রমী ও প্রমাণনির্ভর স্কলারশিপ এসে।",
      requiredDocuments: ["স্কলারশিপ এসে ড্রাফট", "কর্মঅভিজ্ঞতার প্রমাণপত্র (যদি থাকে)"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 30,
      monthsBeforeIntake: 8,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_SOP_DRAFT", "TASK_ACADEMIC_TRANSCRIPTS"],
      officialSourceUrl: "https://www.chevening.org/scholarships",
      officialSourceOrg: "Government / University Scholarship Board",
      completionCriteriaBn: "সকল স্কলারশিপ প্রম্পটের উত্তর চূড়ান্ত ও শব্দসীমার মধ্যে সম্পন্ন করা।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_SCHOLARSHIP_PORTAL_SUBMIT",
      phaseKey: "SCHOLARSHIP_APPLICATION",
      titleBn: "স্কলারশিপ পোর্টালে অনলাইন আবেদন ও রেফারেন্স আপলোড",
      titleEn: "Submit Official Online Scholarship Application",
      bengaliExplanation:
        "স্কলারশিপের অফিসিয়াল অনলাইন আবেদন পোর্টালে গিয়ে ব্যক্তিগত বিবরণ, এসে এবং দুজন রেফারির তথ্য প্রদান করে ডেডলাইনের অন্তত ৪৮ ঘণ্টা পূর্বে সাবমিট করুন।",
      whyItMattersBn:
        "স্কলারশিপ পোর্টালে শেষ দিনে অতিরিক্ত ট্রাফিকের কারণে সার্ভার ডাউন হতে পারে, তাই সময় থাকতে আবেদন আবশ্যক।",
      requiredDocuments: ["একাডেমিক ট্রান্সক্রিপ্ট", "২টি স্কলারশিপ রেফারেন্স লেটার", "স্কলারশিপ এসে"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 21,
      monthsBeforeIntake: 7,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_SCHOLARSHIP_ESSAYS"],
      officialSourceUrl: "https://abroadmate.com/scholarships",
      officialSourceOrg: "AbroadMate Scholarship Portal",
      completionCriteriaBn: "আবেদন সাবমিশনের কনফার্মেশন মেইল ও অ্যাপ্লিকেশন রেফারেন্স নম্বর পাওয়া।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 5,
    phaseKey: "SCHOLARSHIP_APPLICATION",
    titleBn: "স্কলারশিপ আবেদন ও এসে",
    titleEn: "Scholarship Applications & Funding Awards",
    timeframeNoticeBn: "ইনটেকের ৭-৮ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 6: Admission Confirmation (অফার লেটার ও অফার গ্রহণযোগ্যতা)
 */
function buildPhase6Admission(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const t1Dates = calculateTaskDates(intakeDate, 6, 21);
  const t2Dates = calculateTaskDates(intakeDate, 5, 14);
  const t3Dates = calculateTaskDates(intakeDate, 4, 14);

  // Country specific visa voucher
  const voucherName =
    input.targetCountryCode === "GB"
      ? "কনফার্মেশন অব অ্যাকসেপ্টেন্স ফর স্টাডিজ (CAS)"
      : input.targetCountryCode === "US"
      ? "ফর্ম আই-২০ (Form I-20 / SEVIS)"
      : input.targetCountryCode === "CA"
      ? "প্রভিন্সিয়াল অ্যাটেস্টেশন লেটার (PAL) ও LOA"
      : input.targetCountryCode === "AU"
      ? "কনফার্মেশন অব এনরোলমেন্ট (CoE)"
      : "অফিসিয়াল জুলাসুংসবেশাইড (Zulassungsbescheid)";

  const voucherCode =
    input.targetCountryCode === "GB"
      ? "TASK_UK_CAS_RECEIVE"
      : input.targetCountryCode === "US"
      ? "TASK_US_I20_RECEIVE"
      : input.targetCountryCode === "CA"
      ? "TASK_CA_PAL_LOA"
      : input.targetCountryCode === "AU"
      ? "TASK_AU_COE_RECEIVE"
      : "TASK_GER_ZULASSUNG";

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_CONDITIONAL_OFFER_REVIEW",
      phaseKey: "ADMISSION_CONFIRMATION",
      titleBn: "কন্ডিশনাল অফার লেটার পর্যালোচনা ও শর্ত পূরণ",
      titleEn: "Review Conditional Offer Letter & Fulfill Conditions",
      bengaliExplanation:
        "বিশ্ববিদ্যালয় থেকে প্রাপ্ত কন্ডিশনাল অফার লেটারের প্রতিটি শর্ত (যেমন: ফাইনাল সেমিস্টার রেজাল্ট, আইইএলটিএস রি-টেক বা আর্থিক ডকুমেন্টস) একে একে পূরণ করে অ্যাডমিশন টিমের কাছে পাঠান।",
      whyItMattersBn:
        "শর্তগুলো পূরণ না করা পর্যন্ত বিশ্ববিদ্যালয় আনকন্ডিশনাল অফার লেটার ইস্যু করবে না।",
      requiredDocuments: ["কন্ডিশনাল অফার লেটার", "পূরণকৃত শর্তসমূহের ডকুমেন্টস"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 21,
      monthsBeforeIntake: 6,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "HIGH",
      status: "NOT_STARTED",
      dependencies: ["TASK_APPLICATION_SUBMISSION"],
      officialSourceUrl: "https://abroadmate.com",
      officialSourceOrg: "University Admissions Office",
      completionCriteriaBn: "বিশ্ববিদ্যালয় কর্তৃক সকল শর্ত অনুমোদনের ইমেইল পাওয়া।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_TUITION_DEPOSIT",
      phaseKey: "ADMISSION_CONFIRMATION",
      titleBn: "টিউশন ফি ডিপোজিট পরিশোধ ও সিট কনফার্মেশন",
      titleEn: "Pay Tuition Deposit & Confirm Admission Seat",
      bengaliExplanation:
        "অফার লেটার গ্রহণ করে বিশ্ববিদ্যালয় নির্দিষ্ট টিউশন ডিপোজিট (যেমন: যুক্তরাজ্যের জন্য £২,০০০ - £৫,০০০ অথবা কানাডার জন্য ১ বছরের ফি) অনুমোদিত স্টুডেন্ট ফাইল বা ব্যাঙ্কের মাধ্যমে ট্রান্সফার করুন।",
      whyItMattersBn:
        "টিউশন ফি ডিপোজিট ক্লিয়ারেন্স ছাড়া বিশ্ববিদ্যালয় ভিসা লেটার (CAS/I-20/CoE) ইস্যু করে না।",
      requiredDocuments: ["আনকন্ডিশনাল অফার লেটার", "ব্যাংক সুইফট ট্রান্সফার কপি"],
      estimatedCostBdt: input.fundingChoice === "SCHOLARSHIP_FUNDED" ? 0 : 350000,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: 5,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_CONDITIONAL_OFFER_REVIEW"],
      officialSourceUrl: "https://abroadmate.com/calculator",
      officialSourceOrg: "Authorized Foreign Exchange Dealer Bank",
      completionCriteriaBn: "বিশ্ববিদ্যালয়ের অ্যাকাউন্টস থেকে ডিপোজিট পেমেন্ট রিসিট পাওয়া।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: voucherCode,
      phaseKey: "ADMISSION_CONFIRMATION",
      titleBn: `অফিসিয়াল ভিসা সাপোর্টিং লেটার সংগ্রহ: ${voucherName}`,
      titleEn: `Receive Official Visa Voucher (${voucherName})`,
      bengaliExplanation:
        `টিউশন ডিপোজিট ও আনকন্ডিশনাল অফারের প্রেক্ষিতে বিশ্ববিদ্যালয় কর্তৃক প্রেরিত ${voucherName} সংগ্রহ করুন এবং এর সকল ব্যক্তিগত তথ্য পাসপোর্টের সাথে মেলান।`,
      whyItMattersBn:
        "এটি স্টুডেন্ট ভিসা আবেদনের প্রধান আইনি ভিত্তি, যার মধ্যে স্পনসরশিপ ও কোর্স সংক্রান্ত সরকারি রেফারেন্স নম্বর থাকে।",
      requiredDocuments: [voucherName, "পাসপোর্ট কপি"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: 4,
      startDate: t3Dates.startDate,
      dueDate: t3Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_TUITION_DEPOSIT"],
      officialSourceUrl: "https://abroadmate.com/visa-guides",
      officialSourceOrg: "Destination Country Immigration Authority",
      completionCriteriaBn: `সঠিক ডেটাযুক্ত ${voucherName} হাতে পাওয়া।`,
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 6,
    phaseKey: "ADMISSION_CONFIRMATION",
    titleBn: "অফার লেটার ও অফার গ্রহণযোগ্যতা",
    titleEn: "Admission Confirmation & Visa Document Issuance",
    timeframeNoticeBn: "ইনটেকের ৪-৬ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 7: Financial Preparation (আর্থিক তহবিল ও ব্যাংক সলভেন্সি প্রস্তুতি)
 */
function buildPhase7Financial(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const isUK = input.targetCountryCode === "GB";
  const isGermany = input.targetCountryCode === "DE";
  const isAustralia = input.targetCountryCode === "AU";
  const isCanada = input.targetCountryCode === "CA";

  const t1Dates = calculateTaskDates(intakeDate, 4, 30);
  const t2Dates = calculateTaskDates(intakeDate, 3, 14);

  let fundRuleTitleBn = "ভিসা ফান্ডের ব্যাংক ব্যালেন্স ও হিস্ট্রি সংরক্ষণ";
  let fundRuleTitleEn = "Maintain Required Bank Solvency & Funds Seasoning";
  let fundRuleExplanation =
    "ভিসা গাইডলাইন অনুযায়ী প্রয়োজনীয় টিউশন ও ১ বছরের লিভিং কস্ট অনুমোদিত ব্যাংক অ্যাকাউন্টে জমা রাখুন।";
  let fundRuleDuration = 30;

  if (isUK) {
    fundRuleTitleBn = "ইউকেভিআই (UKVI) ২৮-দিনের অবিচ্ছিন্ন ব্যাংক ফান্ড সংরক্ষণ";
    fundRuleTitleEn = "UKVI 28-Day Continuous Funds Holding Rule";
    fundRuleExplanation =
      "যুক্তরাজ্যের ভিসা আবেদনের পূর্বে টিউশন ব্যালেন্স ও ৯ মাসের লিভিং ফান্ড অনুমোদিত বাংলাদেশি ব্যাংকে টানা ২৮ দিন এক পয়সাও নিচে না নামিয়ে রাখতে হবে। ২৮তম দিনের পর ৩১ দিনের মধ্যে ভিসা আবেদন করতে হবে।";
    fundRuleDuration = 28;
  } else if (isGermany) {
    fundRuleTitleBn = "জার্মান ব্লকড অ্যাকাউন্টে €১১,৯০৪ ইউরো ট্রান্সফার ও ব্যালেন্স কনফার্মেশন";
    fundRuleTitleEn = "Transfer €11,904 to German Blocked Account (Expatrio / Fintiba)";
    fundRuleExplanation =
      "জার্মানিতে ভিসার আবেদনের জন্য সরকারি নির্ধারিত ব্লকড অ্যাকাউন্টে (Expatrio বা Fintiba) ১ বছরের লিভিং ফান্ড €১১,৯০৪ ইউরো বাংলাদেশি ব্যাংক থেকে ব্যাংক ফাইলের মাধ্যমে ট্রান্সফার করুন এবং 'Sperrbestätigung' সনদ গ্রহণ করুন।";
    fundRuleDuration = 14;
  } else if (isAustralia) {
    fundRuleTitleBn = "অস্ট্রেলিয়ান ইমিগ্রেশন ৩ মাসের ব্যাংক ফান্ড সিজনিং";
    fundRuleTitleEn = "Australian Immigration 3-Month Bank Funds Seasoning";
    fundRuleExplanation =
      "অস্ট্রেলিয়ান সাবক্লাস ৫০০ স্টুডেন্ট ভিসার জন্য অভিভাবক বা গ্রহণযোগ্য স্পনসরের অ্যাকাউন্টে অন্তত ৩ মাস ফান্ডের জেনুইন ধারাবাহিকতা বজায় রাখুন।";
    fundRuleDuration = 90;
  } else if (isCanada) {
    fundRuleTitleBn = "কানাডা ৪ মাসের ব্যাংক হিস্ট্রি ও অডিটেড ট্যাক্স রিটার্ন";
    fundRuleTitleEn = "Canada 4-Month Bank History & Audited Tax Filings";
    fundRuleExplanation =
      "কানাডিয়ান স্টাডি পারমিটের জন্য ৪ মাসের ব্যাংক বিবরণীর সাথে সাথে তহবিলের সুস্পষ্ট লিগ্যাল সোর্স এবং অভিভাবকদের আয়কর রিটার্ন (ট্যাক্স আইটি ১০বি) প্রস্তুত রাখুন।";
    fundRuleDuration = 45;
  }

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_BANK_FUNDS_MAINTENANCE",
      phaseKey: "FINANCIAL_PREPARATION",
      titleBn: fundRuleTitleBn,
      titleEn: fundRuleTitleEn,
      bengaliExplanation: fundRuleExplanation,
      whyItMattersBn:
        "ফাইন্যান্সিয়াল রুল সঠিকভাবে অনুসরণ না করলে ভিসা আবেদন কোনো কারণ দর্শানো ছাড়াই সরাসরি প্রত্যাখ্যান (Refuse) হয়।",
      requiredDocuments: ["ব্যাংক স্টেটমেন্ট", "ব্যাংক সলভেন্সি সার্টিফিকেট", "ট্যাক্স সার্টিফিকেট"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: fundRuleDuration,
      monthsBeforeIntake: 4,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_TUITION_DEPOSIT"],
      officialSourceUrl: "https://abroadmate.com/calculator",
      officialSourceOrg: "Government Immigration Financial Guidance",
      completionCriteriaBn: "ব্যাংক থেকে অফিসিয়াল সিল ও স্বাক্ষরিত সলভেন্সি সার্টিফিকেট ও স্টেটমেন্ট উত্তোলন।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_SPONSOR_AFFIDAVIT",
      phaseKey: "FINANCIAL_PREPARATION",
      titleBn: "স্পনসরশিপ এফিডেভিট ও নোটারাইজড আয়ের উৎস ডকুমেন্টস",
      titleEn: "Sponsor Affidavit of Support & Notarized Income Proofs",
      bengaliExplanation:
        "অভিভাবক বা স্পনসর কর্তৃক ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে স্পনসরশিপ হলফনামা (Affidavit of Support) ফার্স্ট ক্লাস ম্যাজিস্ট্রেট বা নোটারি পাবলিক দ্বারা সত্যায়ন করুন। ট্রেড লাইসেন্স বা স্যালারি সার্টিফিকেট সংযুক্ত করুন।",
      whyItMattersBn:
        "ইমিগ্রেশন অফিসার যাচাই করেন যে ফান্ডটি বৈধ পথে উপার্জিত এবং পড়াশোনার সময় সম্পূর্ণ ছাত্রের জন্য লভ্য।",
      requiredDocuments: ["৩০০ টাকার স্ট্যাম্পে এফিডেভিট", "স্পনসরের ট্যাক্স রিটার্ন স্লিপ", "জমি/সম্পদের মূল্যায়ন"],
      estimatedCostBdt: 4500,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: 3,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "HIGH",
      status: "NOT_STARTED",
      dependencies: ["TASK_BANK_FUNDS_MAINTENANCE"],
      officialSourceUrl: "https://abroadmate.com/visa-guides",
      officialSourceOrg: "Notary Public / Immigration Legal Requirements",
      completionCriteriaBn: "নোটারাইজড এফিডেভিট ও ট্যাক্স পেপারের মূল কপি রেডি থাকা।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 7,
    phaseKey: "FINANCIAL_PREPARATION",
    titleBn: "আর্থিক তহবিল ও ব্যাংক সলভেন্সি প্রস্তুতি",
    titleEn: "Statutory Financial Verification & Proof of Funds",
    timeframeNoticeBn: "ইনটেকের ৩-৪ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 8: Student Visa Application (স্টুডেন্ট ভিসা অনলাইন আবেদন)
 */
function buildPhase8Visa(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const isUK = input.targetCountryCode === "GB";
  const t1Dates = calculateTaskDates(intakeDate, 3, 10);
  const t2Dates = calculateTaskDates(intakeDate, 3, 5);

  const visaPortalUrl =
    isUK
      ? "https://www.gov.uk/student-visa/apply"
      : input.targetCountryCode === "CA"
      ? "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html"
      : input.targetCountryCode === "AU"
      ? "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500"
      : input.targetCountryCode === "DE"
      ? "https://service2.diplo.de/rkvisum"
      : "https://ceac.state.gov/genniv/";

  const voucherCode =
    input.targetCountryCode === "GB"
      ? "TASK_UK_CAS_RECEIVE"
      : input.targetCountryCode === "US"
      ? "TASK_US_I20_RECEIVE"
      : input.targetCountryCode === "CA"
      ? "TASK_CA_PAL_LOA"
      : input.targetCountryCode === "AU"
      ? "TASK_AU_COE_RECEIVE"
      : "TASK_GER_ZULASSUNG";

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_VISA_ONLINE_LODGEMENT",
      phaseKey: "STUDENT_VISA_APPLICATION",
      titleBn: "অফিসিয়াল ইমিগ্রেশন পোর্টালে অনলাইন ভিসা ফর্ম পূরণ",
      titleEn: "Complete Online Student Visa Application Form",
      bengaliExplanation:
        "গন্তব্য দেশের অফিসিয়াল অভিবাসন পোর্টালে অ্যাকাউন্ট খুলে সতর্কতার সাথে ভিসা আবেদন ফর্ম পূরণ করুন। পাসপোর্ট নম্বর, পূর্ববর্তী ভ্রমণের ইতিহাস ও অ্যাডমিশন রেফারেন্স নির্ভুলভাবে টাইপ করুন।",
      whyItMattersBn:
        "অনলাইন ফর্মে কোনো অসত্য বা ভুল তথ্য দিলে মিথ্যা তথ্য প্রদানের দায়ে (Deception) ১০ বছরের ভ্রমণ নিষেধাজ্ঞা হতে পারে।",
      requiredDocuments: ["ভিসা ভাউচার (CAS/I-20/CoE)", "পাসপোর্ট", "ব্যাংক স্টেটমেন্ট", "একাডেমিক সার্টিফিকেট"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 10,
      monthsBeforeIntake: 3,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: [voucherCode, "TASK_BANK_FUNDS_MAINTENANCE"],
      officialSourceUrl: visaPortalUrl,
      officialSourceOrg: "Government Immigration Department",
      completionCriteriaBn: "ভিসা আবেদন ফর্ম প্রিভিউ যাচাই এবং সাবমিশনের জন্য প্রস্তুত করা।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_VISA_FEE_PAYMENT",
      phaseKey: "STUDENT_VISA_APPLICATION",
      titleBn: "ভিসা ফি ও স্বাস্থ্য সারচার্জ (IHS/OSHC/SEVIS) অনলাইন পেমেন্ট",
      titleEn: "Pay Visa Application Fee & Health Surcharges Online",
      bengaliExplanation:
        "আন্তর্জাতিক ক্রেডিট কার্ড দ্বারা সরকারি ভিসা আবেদন ফি এবং প্রযোজ্য স্বাস্থ্য সারচার্জ (যেমন: যুক্তরাজ্যের জন্য বার্ষিক £৭৭৬ IHS ফি, অথবা আমেরিকার জন্য $৩৫০ SEVIS ফি) পরিশোধ করুন।",
      whyItMattersBn:
        "ফি পরিশোধ ব্যতিরেকে ভিসা আবেদন আইনত সম্পূর্ণ হয় না এবং বায়োমেট্রিক অ্যাপয়েন্টমেন্ট বুক করা যায় না।",
      requiredDocuments: ["আন্তর্জাতিক ডুয়েল কারেন্সি কার্ড", "পেমেন্ট অথরাইজেশন"],
      estimatedCostBdt: isUK ? 230000 : 75000,
      costCurrency: "BDT",
      estimatedDurationDays: 5,
      monthsBeforeIntake: 3,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_VISA_ONLINE_LODGEMENT"],
      officialSourceUrl: visaPortalUrl,
      officialSourceOrg: "Official Immigration Payment Gateway",
      completionCriteriaBn: "পেমেন্ট রিসিপ্ট ও ভিসা আবেদনের নিশ্চিতকরণ রেফারেন্স (GWF / Transaction ID) ডাউনলোড করা।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 8,
    phaseKey: "STUDENT_VISA_APPLICATION",
    titleBn: "স্টুডেন্ট ভিসা অনলাইন আবেদন",
    titleEn: "Student Visa Lodgement & Statutory Fees",
    timeframeNoticeBn: "ইনটেকের ২-৩ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 9: Biometrics and Medical (বায়োমেট্রিক ও মেডিকেল টেস্ট)
 */
function buildPhase9Biometrics(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const isUK = input.targetCountryCode === "GB";
  const t1Dates = calculateTaskDates(intakeDate, 2.5, 7);
  const t2Dates = calculateTaskDates(intakeDate, 2, 7);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_IOM_TB_TEST",
      phaseKey: "BIOMETRICS_AND_MEDICAL",
      titleBn: isUK ? "আইওএম (IOM) প্যানেল চিকিৎসকের মাধ্যমে টিবি (TB) স্ক্রিনিং" : "ইমিগ্রেশন মেডিকেল পরীক্ষা সম্পন্নকরণ",
      titleEn: isUK ? "IOM Bangladesh Panel Physician Tuberculosis (TB) Screening" : "Immigration Medical Examination",
      bengaliExplanation:
        "আইওএম (IOM) বাংলাদেশ ঢাকা বা সিলেট সেন্টারে অ্যাপয়েন্টমেন্ট নিয়ে বুকের এক্স-রে এবং যক্ষ্মা (TB) টেস্ট করান এবং মূল সার্টিফিকেট সংগ্রহ করুন।",
      whyItMattersBn:
        "যুক্তরাজ্য এবং অন্যান্য দেশে বাংলাদেশ থেকে আগত শিক্ষার্থীদের জন্য বৈধ টিবি টেস্ট সার্টিফিকেট ভিসা ডকুমেন্টের বাধ্যতামূলক অংশ।",
      requiredDocuments: ["মূল পাসপোর্ট", "পাসপোর্টের ফটোকপি", "২ কপি পাসপোর্ট ছবি", "অফার লেটার"],
      estimatedCostBdt: 12500,
      costCurrency: "BDT",
      estimatedDurationDays: 7,
      monthsBeforeIntake: 2.5,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_VISA_ONLINE_LODGEMENT"],
      officialSourceUrl: "https://bangladesh.iom.int",
      officialSourceOrg: "International Organization for Migration (IOM) Bangladesh",
      completionCriteriaBn: "আইওএম কর্তৃক ক্লিয়ারেন্স সার্টিফিকেট প্রাপ্তি।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_BIOMETRICS_APPOINTMENT",
      phaseKey: "BIOMETRICS_AND_MEDICAL",
      titleBn: "ভিএফএস গ্লোবাল (VFS Global) বা দূতাবাসে বায়োমেট্রিক প্রদান",
      titleEn: "Attend VFS Global / Embassy Biometrics Appointment",
      bengaliExplanation:
        "ঢাকা বা সিলেটের ভিএফএস গ্লোবাল সেন্টারে নির্দিষ্ট সময়ে উপস্থিত হয়ে ডিজিটাল ফিঙ্গারপ্রিন্ট, ফেস স্ক্যান এবং মূল পাসপোর্ট জমা দিন।",
      whyItMattersBn:
        "বায়োমেট্রিক ডাটা গ্রহণ না করা পর্যন্ত অভিবাসন কর্তৃপক্ষ ভিসা ডিসিশন প্রক্রিয়া শুরু করতে পারে না।",
      requiredDocuments: ["অ্যাপয়েন্টমেন্ট লেটার", "ডকুমেন্ট চেকলিস্ট", "মূল পাসপোর্ট", "টিবি টেস্ট সার্টিফিকেট"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 7,
      monthsBeforeIntake: 2,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_VISA_FEE_PAYMENT", "TASK_IOM_TB_TEST"],
      officialSourceUrl: "https://visa.vfsglobal.com/bgd/en",
      officialSourceOrg: "VFS Global Bangladesh",
      completionCriteriaBn: "ভিএফএস সেন্টারে পাসপোর্ট জমা ও বায়োমেট্রিক রিসিট স্ট্যাম্প সংগ্রহ।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 9,
    phaseKey: "BIOMETRICS_AND_MEDICAL",
    titleBn: "বায়োমেট্রিক ও মেডিকেল টেস্ট",
    titleEn: "Biometrics Appointment & Medical Examination",
    timeframeNoticeBn: "ইনটেকের ২ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 10: Visa Decision (ভিসা সিদ্ধান্ত ও পাসপোর্ট কালেকশন)
 */
function buildPhase10VisaDecision(intakeDate: Date): RoadmapPhaseDefinition {
  const t1Dates = calculateTaskDates(intakeDate, 1.5, 21);
  const t2Dates = calculateTaskDates(intakeDate, 1, 7);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_INTERVIEW_PREP",
      phaseKey: "VISA_DECISION",
      titleBn: "ক্রেডিবিলিটি ইন্টারভিউ প্রস্তুতি (যদি দূতাবাস কর্তৃক তলব করা হয়)",
      titleEn: "Credibility Interview Preparation (If Summoned by Embassy)",
      bengaliExplanation:
        "ইউকেভিআই বা দূতাবাসের ভিসা অফিসার যদি ক্রেডিবিলিটি ইন্টারভিউয়ের জন্য কল করে, তবে কোর্স কনটেন্ট, ক্যারিয়ার গোল এবং ফান্ডের উৎস স্পষ্টভাবে ব্যাখ্যা করার প্রস্তুতি নিন।",
      whyItMattersBn:
        "ইন্টারভিউতে সন্তোষজনক উত্তর দিতে না পারলে জেনুইন স্টুডেন্ট টেস্টে ফেল করিয়ে ভিসা বাতিল করা হতে পারে।",
      requiredDocuments: ["কোর্সের মডিউল তালিকা", "বিশ্ববিদ্যালয় অফার কপি", "এসওপি খসড়া"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 21,
      monthsBeforeIntake: 1.5,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "MEDIUM",
      status: "NOT_STARTED",
      dependencies: ["TASK_BIOMETRICS_APPOINTMENT"],
      officialSourceUrl: "https://abroadmate.com/visa-guides",
      officialSourceOrg: "AbroadMate Visa Intelligence",
      completionCriteriaBn: "কোর্স ও ফিন্যান্স সংক্রান্ত সম্ভাব্য প্রশ্নের সাবলীল উত্তর অনুশীলন সম্পন্ন।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_PASSPORT_COLLECTION",
      phaseKey: "VISA_DECISION",
      titleBn: "ভিসা স্ট্যাম্পসহ মূল পাসপোর্ট ও ডিসিশন লেটার সংগ্রহ",
      titleEn: "Collect Passport with Visa Vignette & Decision Letter",
      bengaliExplanation:
        "ভিএফএস বা কুরিয়ার থেকে ভিসা স্ট্যাম্পযুক্ত মূল পাসপোর্ট সংগ্রহ করুন এবং পাসপোর্টের এন্ট্রি ক্লিয়ারেন্স ভিনিয়েট ও ডিসিশন লেটারের তারিখগুলো নিখুঁতভাবে চেক করুন।",
      whyItMattersBn:
        "ভিসার অনুমোদন পত্র ও ভিনিয়েট ছাড়া বিমান টিকিট কাটা ও আন্তর্জাতিক ভ্রমণ অসম্ভব।",
      requiredDocuments: ["ভিএফএস রিসিট স্লিপ", "জাতীয় পরিচয়পত্র"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 7,
      monthsBeforeIntake: 1,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: "NOT_STARTED",
      dependencies: ["TASK_BIOMETRICS_APPOINTMENT"],
      officialSourceUrl: "https://visa.vfsglobal.com/bgd/en",
      officialSourceOrg: "Destination Country Embassy / High Commission",
      completionCriteriaBn: "পাসপোর্টে বৈধ ভিসা ভিনিয়েট স্ট্যাম্প এবং অফিসিয়াল ভিসা ডিসিশন লেটার হাতে পাওয়া।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 10,
    phaseKey: "VISA_DECISION",
    titleBn: "ভিসা সিদ্ধান্ত ও পাসপোর্ট কালেকশন",
    titleEn: "Visa Decision & Passport Collection",
    timeframeNoticeBn: "ইনটেকের ১-১.৫ মাস পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 11: Pre-departure (যাত্রাপূর্ব প্রস্তুতি ও এয়ার টিকিট)
 */
function buildPhase11PreDeparture(intakeDate: Date): RoadmapPhaseDefinition {
  const t1Dates = calculateTaskDates(intakeDate, 1, 10);
  const t2Dates = calculateTaskDates(intakeDate, 0.7, 14);
  const t3Dates = calculateTaskDates(intakeDate, 0.3, 7);

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_FLIGHT_BOOKING",
      phaseKey: "PRE_DEPARTURE",
      titleBn: "ঢাকা/সিলেট থেকে আন্তর্জাতিক এয়ার টিকিট বুকিং",
      titleEn: "Book International Flight from Dhaka/Sylhet",
      bengaliExplanation:
        "ভিসা নিশ্চিত হওয়ার পর বিশ্ববিদ্যালয়ে ক্লাস শুরু হওয়ার অন্তত ১-২ সপ্তাহ পূর্বের তারিখে ঢাকা (DAC) বা ওসমানী (ZYL) আন্তর্জাতিক বিমানবন্দর থেকে ওয়ান-ওয়ে বা রিটার্ন স্টুডেন্ট টিকিট বুক করুন। অতিরিক্ত ব্যাগেজ সুবিধা যাচাই করুন।",
      whyItMattersBn:
        "শেষ মুহূর্তে টিকিট বুক করলে বিমানের ভাড়া অত্যধিক বেড়ে যায় এবং পছন্দের রুটের টিকিট পাওয়া দুষ্কর হয়।",
      requiredDocuments: ["ভিসা কপি", "পাসপোর্ট", "স্টুডেন্ট আইডি / অফার লেটার"],
      estimatedCostBdt: 75000,
      costCurrency: "BDT",
      estimatedDurationDays: 10,
      monthsBeforeIntake: 1,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "BLOCKED",
      dependencies: ["TASK_PASSPORT_COLLECTION"],
      officialSourceUrl: "https://www.biman-airlines.com",
      officialSourceOrg: "Airlines & Travel Agencies",
      completionCriteriaBn: "কনফার্মড এয়ার টিকিট ও বুকিং রেফারেন্স (PNR) প্রিন্ট করা।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_ACCOMMODATION_BOOKING",
      phaseKey: "PRE_DEPARTURE",
      titleBn: "বিশ্ববিদ্যালয় হল বা প্রাইভেট স্টুডেন্ট অ্যাকোমোডেশন চূড়ান্তকরণ",
      titleEn: "Finalize University Halls or Private Student Housing",
      bengaliExplanation:
        "বিশ্ববিদ্যালয়ের নিজস্ব ডরমিটরি বা বিশ্বস্ত প্ল্যাটফর্ম (যেমন Student.com, AmberStudent) থেকে স্বল্প বা দীর্ঘমেয়াদি আবাসন বুক করে টেন্যান্সি অ্যাগ্রিমেন্ট সাইন করুন।",
      whyItMattersBn:
        "বিমানবন্দরে ইমিগ্রেশন চেকপয়েন্টে এবং স্টাডি রুট এনরোলমেন্টে আপনার থাকার ঠিকানার প্রমাণপত্র প্রদর্শন করতে হয়।",
      requiredDocuments: ["টেন্যান্সি কনট্রাক্ট", "ডিপোজিট রিসিপ্ট"],
      estimatedCostBdt: 85000,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: 0.7,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "HIGH",
      status: "BLOCKED",
      dependencies: ["TASK_PASSPORT_COLLECTION"],
      officialSourceUrl: "https://abroadmate.com",
      officialSourceOrg: "Student Housing Portals",
      completionCriteriaBn: "স্বাক্ষরিত অ্যাকোমোডেশন কন্ট্রাক্ট ও ঠিকানা সংরক্ষণ।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_PACKING_TRAVEL_PREP",
      phaseKey: "PRE_DEPARTURE",
      titleBn: "লাগেজ প্যাকিং, শীতের পোশাক ও ফরেক্স কারেন্সি প্রস্তুতি",
      titleEn: "Luggage Packing, Winter Clothing & Forex Card Endorsement",
      bengaliExplanation:
        "গন্তব্য দেশের আবহাওয়ার সাথে মানানসই উইন্ডপ্রুফ জ্যাকেট, থার্মাল ইনার, প্রয়োজনীয় ওষুধ (প্রেসক্রিপশনসহ), ড্রাই ফুড এবং নগদ অন্তত £১,০০০ - £১,৫০০ পাউন্ড/ডলার ক্যাশ ও কার্ডে রূপান্তর করুন।",
      whyItMattersBn:
        "বিদেশে পৌঁছানোর পর প্রাথমিক দুই সপ্তাহের জন্য নিত্যপ্রয়োজনীয় জিনিস ও নগদ অর্থ অত্যন্ত জরুরি।",
      requiredDocuments: ["ডক্টরস প্রেসক্রিপশন", "ক্যাশ ফরেন কারেন্সি", "সকল মূল ডকুমেন্টের ফাইল"],
      estimatedCostBdt: 120000,
      costCurrency: "BDT",
      estimatedDurationDays: 7,
      monthsBeforeIntake: 0.3,
      startDate: t3Dates.startDate,
      dueDate: t3Dates.dueDate,
      priority: "HIGH",
      status: "BLOCKED",
      dependencies: ["TASK_FLIGHT_BOOKING"],
      officialSourceUrl: "https://abroadmate.com",
      officialSourceOrg: "AbroadMate Pre-departure Checklist",
      completionCriteriaBn: "এয়ারলাইন্সের ওজন সীমার মধ্যে ব্যাগেজ গোছানো ও ট্রাভেল কিট প্রস্তুত।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 11,
    phaseKey: "PRE_DEPARTURE",
    titleBn: "যাত্রাপূর্ব প্রস্তুতি ও এয়ার টিকিট",
    titleEn: "Pre-departure Logistics & Travel Arrangements",
    timeframeNoticeBn: "ইনটেকের ২-৪ সপ্তাহ পূর্বে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Phase 12: Arrival and Enrollment (গন্তব্যে পৌঁছানো ও চূড়ান্ত রেজিস্ট্রেশন)
 */
function buildPhase12Arrival(intakeDate: Date, input: StudentRoadmapProfileInput): RoadmapPhaseDefinition {
  const isUK = input.targetCountryCode === "GB";
  const isGermany = input.targetCountryCode === "DE";

  const t1Dates = calculateTaskDates(intakeDate, 0, 3);
  const t2Dates = calculateTaskDates(intakeDate, -0.3, 10);
  const t3Dates = calculateTaskDates(intakeDate, -0.5, 14);

  const localRegistrationTitle = isUK
    ? "বিআরপি (BRP) কার্ড সংগ্রহ ও এনএইচএস (NHS) জিপি রেজিস্ট্রেশন"
    : isGermany
    ? "সিটি রেজিস্ট্রেশন (Anmeldung) ও ব্লকড অ্যাকাউন্ট সক্রিয়করণ"
    : "লোকাল হেলথ ইন্স্যুরেন্স ও রেসিডেন্ট পারমিট অ্যাক্টিভেশন";

  const tasks: RoadmapTaskDefinition[] = [
    {
      taskCode: "TASK_BORDER_CONTROL",
      phaseKey: "ARRIVAL_AND_ENROLLMENT",
      titleBn: "বিমানবন্দরে ইমিগ্রেশন ও বর্ডার কন্ট্রোল ক্লিয়ারেন্স",
      titleEn: "Airport Border Control & Entry Immigration Clearance",
      bengaliExplanation:
        "গন্তব্যের বিমানবন্দরে ল্যান্ড করে বর্ডার অফিসারকে পাসপোর্ট, ভিসা লেটার, অফার লেটার এবং অ্যাকোমোডেশনের কাগজপত্র প্রদর্শন করে এন্ট্রি স্ট্যাম্প নিন।",
      whyItMattersBn:
        "আইনিভাবে দেশে প্রবেশের ছাড়পত্র পাওয়ার জন্য বর্ডার ক্লিয়ারেন্স সম্পন্ন হওয়া বাধ্যতামূলক।",
      requiredDocuments: ["পাসপোর্ট", "ভিসা ডিসিশন লেটার", "অফার লেটার", "অ্যাকোমোডেশন প্রুফ"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 3,
      monthsBeforeIntake: 0,
      startDate: t1Dates.startDate,
      dueDate: t1Dates.dueDate,
      priority: "CRITICAL",
      status: "BLOCKED",
      dependencies: ["TASK_FLIGHT_BOOKING"],
      officialSourceUrl: "https://www.gov.uk/uk-border-control",
      officialSourceOrg: "Border Force / Immigration Checkpoint",
      completionCriteriaBn: "পাসপোর্টে অ্যারাইভাল স্ট্যাম্প বা ডিজিটাল আই-৯৪ এন্ট্রি রেকর্ড পাওয়া।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_UNI_INPERSON_ENROLLMENT",
      phaseKey: "ARRIVAL_AND_ENROLLMENT",
      titleBn: "বিশ্ববিদ্যালয় ক্যাম্পাসে সশরীরে রেজিস্ট্রেশন ও স্টুডেন্ট আইডি",
      titleEn: "University In-Person Enrollment & Student ID Collection",
      bengaliExplanation:
        "ক্যাম্পাসে গিয়ে নির্ধারিত ওরিয়েন্টেশন উইকে মূল পাসপোর্ট, ট্রান্সক্রিপ্ট ও ভিসা প্রদর্শন করে সশরীরে ক্লাসে নাম নথিভুক্ত করুন এবং স্টুডেন্ট কার্ড সংগ্রহ করুন।",
      whyItMattersBn:
        "নির্দিষ্ট শেষ তারিখের (Latest Enrollment Date) মধ্যে রেজিস্ট্রেশন না করলে বিশ্ববিদ্যালয় অভিবাসন কর্তৃপক্ষকে রিপোর্ট করে এবং ছাত্রত্ব বাতিল হয়ে যায়।",
      requiredDocuments: ["পাসপোর্ট", "মূল ট্রান্সক্রিপ্ট", "ভিসা ডকুমেন্ট", "ফি পেমেন্ট রিসিপ্ট"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 10,
      monthsBeforeIntake: -0.3,
      startDate: t2Dates.startDate,
      dueDate: t2Dates.dueDate,
      priority: "CRITICAL",
      status: "BLOCKED",
      dependencies: ["TASK_BORDER_CONTROL"],
      officialSourceUrl: "https://abroadmate.com",
      officialSourceOrg: "University Student Administration Registry",
      completionCriteriaBn: "অফিসিয়াল স্টুডেন্ট স্মার্টকার্ড ও অ্যাক্টিভ ক্যাম্পাস পোর্টাল অ্যাক্সেস পাওয়া।",
      needsReview: false,
      isCompleted: false,
    },
    {
      taskCode: "TASK_LOCAL_SETTLEMENT",
      phaseKey: "ARRIVAL_AND_ENROLLMENT",
      titleBn: localRegistrationTitle,
      titleEn: "Local City Registration, Local Bank Account & Healthcare Setup",
      bengaliExplanation:
        "স্থানীয় পোস্ট অফিস বা ব্যাঙ্ক থেকে স্থানীয় স্টুডেন্ট কারেন্ট অ্যাকাউন্ট খুলুন, স্থানীয় সিটি হলে নাম নিবন্ধন করুন এবং নিকটস্থ হেলথ কেয়ার ক্লিনিকে জিপি রেজিস্ট্রেশন সম্পন্ন করুন।",
      whyItMattersBn:
        "বিদেশে সুস্থ ও নিরাপদ জীবনযাপন এবং পার্ট-টাইম কাজের আইনি বেতন পাওয়ার জন্য স্থানীয় ব্যাংক অ্যাকাউন্ট ও স্বাস্থ্য নিবন্ধন আবশ্যক।",
      requiredDocuments: ["বিশ্ববিদ্যালয়ের ব্যাংক লেটার", "টেন্যান্সি কনট্রাক্ট", "পাসপোর্ট ও ভিসা"],
      estimatedCostBdt: 0,
      costCurrency: "BDT",
      estimatedDurationDays: 14,
      monthsBeforeIntake: -0.5,
      startDate: t3Dates.startDate,
      dueDate: t3Dates.dueDate,
      priority: "HIGH",
      status: "BLOCKED",
      dependencies: ["TASK_UNI_INPERSON_ENROLLMENT"],
      officialSourceUrl: "https://abroadmate.com/visa-guides",
      officialSourceOrg: "Local City Council / National Health Authority",
      completionCriteriaBn: "লোকাল ব্যাংক ডেবিট কার্ড এবং ন্যাশনাল হেলথ কেয়ার নম্বর হাতে থাকা।",
      needsReview: false,
      isCompleted: false,
    },
  ];

  return {
    phaseNumber: 12,
    phaseKey: "ARRIVAL_AND_ENROLLMENT",
    titleBn: "গন্তব্যে পৌঁছানো ও চূড়ান্ত এনরোলমেন্ট",
    titleEn: "Arrival Formalities, Enrollment & Settlement",
    timeframeNoticeBn: "ক্লাস শুরুর ১-২ সপ্তাহের মধ্যে",
    tasks,
    isCompleted: tasks.every((t) => t.isCompleted),
  };
}

/**
 * Master Intelligent Roadmap Generator
 * Builds all 12 phases conditionally based on student inputs.
 */
export function generateIntelligentRoadmap(input: StudentRoadmapProfileInput): RoadmapPhaseDefinition[] {
  const intakeDate = calculateIntakeDate(input.targetIntakeSeason, input.targetIntakeYear);

  const phaseBuilders: Array<() => RoadmapPhaseDefinition | null> = [
    () => buildPhase1Preparation(intakeDate, input),
    () => buildPhase2Academic(intakeDate, input),
    () => buildPhase3Language(intakeDate, input),
    () => buildPhase4University(intakeDate, input),
    () => buildPhase5Scholarship(intakeDate, input),
    () => buildPhase6Admission(intakeDate, input),
    () => buildPhase7Financial(intakeDate, input),
    () => buildPhase8Visa(intakeDate, input),
    () => buildPhase9Biometrics(intakeDate, input),
    () => buildPhase10VisaDecision(intakeDate),
    () => buildPhase11PreDeparture(intakeDate),
    () => buildPhase12Arrival(intakeDate, input),
  ];

  const rawPhases: RoadmapPhaseDefinition[] = [];
  let phaseNum = 1;

  for (const builder of phaseBuilders) {
    const res = builder();
    if (res) {
      res.phaseNumber = phaseNum++;
      rawPhases.push(res);
    }
  }

  // Run DAG dependency evaluation to set proper BLOCKED/NOT_STARTED statuses
  return evaluateTaskDependencies(rawPhases);
}

/**
 * Evaluates DAG dependencies across all tasks in all phases.
 * Tasks whose dependencies are not fully completed are set to "BLOCKED".
 */
export function evaluateTaskDependencies(phases: RoadmapPhaseDefinition[]): RoadmapPhaseDefinition[] {
  // Collect all completed task codes
  const completedTaskCodes = new Set<string>();

  for (const phase of phases) {
    for (const task of phase.tasks) {
      if (task.status === "COMPLETED" || task.isCompleted) {
        completedTaskCodes.add(task.taskCode);
      }
    }
  }

  // Second pass: check dependencies
  const updatedPhases = phases.map((phase) => {
    const updatedTasks = phase.tasks.map((task) => {
      // If task is completed or skipped, leave it
      if (task.status === "COMPLETED" || task.status === "SKIPPED" || task.isCompleted) {
        return task;
      }

      // Check dependencies
      if (task.dependencies && task.dependencies.length > 0) {
        const allMet = task.dependencies.every((dep) => completedTaskCodes.has(dep));
        if (!allMet) {
          return {
            ...task,
            status: "BLOCKED" as TaskStatus,
          };
        } else if (task.status === "BLOCKED") {
          return {
            ...task,
            status: "NOT_STARTED" as TaskStatus,
          };
        }
      } else if (task.status === "BLOCKED") {
        return {
          ...task,
          status: "NOT_STARTED" as TaskStatus,
        };
      }

      return task;
    });

    const isPhaseDone = updatedTasks.every((t) => t.status === "COMPLETED" || t.status === "SKIPPED");

    return {
      ...phase,
      tasks: updatedTasks,
      isCompleted: isPhaseDone,
    };
  });

  return updatedPhases;
}

/**
 * Merges an updated roadmap blueprint with an existing roadmap,
 * PRESERVING all completed tasks and historical progress.
 */
export function mergeRoadmapTasksWithPreservation(
  oldPhases: RoadmapPhaseDefinition[],
  newBlueprintPhases: RoadmapPhaseDefinition[],
  changeReasonBn: string
): {
  mergedPhases: RoadmapPhaseDefinition[];
  preservedCount: number;
  changeReasonBn: string;
} {
  // Map of completed old tasks by taskCode
  const oldCompletedMap = new Map<string, RoadmapTaskDefinition>();

  for (const phase of oldPhases) {
    for (const task of phase.tasks) {
      if (task.status === "COMPLETED" || task.status === "SKIPPED" || task.isCompleted) {
        oldCompletedMap.set(task.taskCode, task);
      }
    }
  }

  let preservedCount = 0;

  const mergedPhases = newBlueprintPhases.map((newPhase) => {
    const mergedTasks = newPhase.tasks.map((newTask) => {
      const existing = oldCompletedMap.get(newTask.taskCode);
      if (existing) {
        preservedCount++;
        return {
          ...newTask,
          status: existing.status,
          isCompleted: existing.isCompleted,
          completedAt: existing.completedAt,
        };
      }
      return newTask;
    });

    return {
      ...newPhase,
      tasks: mergedTasks,
    };
  });

  // Re-evaluate DAG dependencies on the newly merged graph
  const finalizedPhases = evaluateTaskDependencies(mergedPhases);

  return {
    mergedPhases: finalizedPhases,
    preservedCount,
    changeReasonBn,
  };
}

/**
 * Flags tasks as needing review when an immigration or university policy update occurs.
 */
export function flagTasksForPolicyReview(
  phases: RoadmapPhaseDefinition[],
  affectedTaskCodes: string[]
): RoadmapPhaseDefinition[] {
  const codeSet = new Set(affectedTaskCodes);

  return phases.map((phase) => ({
    ...phase,
    tasks: phase.tasks.map((task) => {
      if (codeSet.has(task.taskCode)) {
        return {
          ...task,
          needsReview: true,
        };
      }
      return task;
    }),
  }));
}

/**
 * Calculates deadline alert notifications for 30, 14, 7, 3, and 1 day remaining.
 */
export interface DeadlineAlertResult {
  deadlineId: string;
  titleBn: string;
  deadlineDate: string;
  daysRemaining: number;
  alertIntervalDay: 30 | 14 | 7 | 3 | 1;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM";
  messageBn: string;
}

export function calculateDeadlineAlerts(
  deadlines: Array<{ id: string; titleBn: string; deadlineDate: Date | string; isCompleted?: boolean }>,
  currentDate: Date = new Date()
): DeadlineAlertResult[] {
  const alertThresholds = [30, 14, 7, 3, 1] as const;
  const results: DeadlineAlertResult[] = [];

  for (const dl of deadlines) {
    if (dl.isCompleted) continue;

    const target = new Date(dl.deadlineDate);
    const diffMs = target.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    for (const interval of alertThresholds) {
      if (daysRemaining === interval) {
        const urgency: "CRITICAL" | "HIGH" | "MEDIUM" =
          interval <= 3 ? "CRITICAL" : interval <= 14 ? "HIGH" : "MEDIUM";

        const messageBn =
          interval === 1
            ? `⚠️ জরুরি সতর্কবার্তা: আগামীকাল '${dl.titleBn}' এর চূড়ান্ত সময়সীমা!`
            : interval <= 3
            ? `🚨 সতর্কবার্তা: আর মাত্র ${interval} দিন বাকি আছে '${dl.titleBn}' এর জন্য।`
            : `🔔 রিমাইন্ডার: '${dl.titleBn}' এর সময়সীমা শেষ হতে আর ${interval} দিন বাকি।`;

        results.push({
          deadlineId: dl.id,
          titleBn: dl.titleBn,
          deadlineDate: target.toISOString().split("T")[0] ?? "",
          daysRemaining,
          alertIntervalDay: interval,
          urgency,
          messageBn,
        });
      }
    }
  }

  return results;
}

/**
 * Backward compatibility: original RoadmapStep interface
 */
export interface RoadmapStep {
  stageNumber: number;
  monthsBeforeIntake: string;
  titleBn: string;
  titleEn: string;
  tasksBn: string[];
  tasksEn: string[];
}

export function generatePersonalizedRoadmap(
  targetCountryCode: string,
  targetIntakeSeason: "fall" | "spring" | "summer",
  targetIntakeYear: number
): RoadmapStep[] {
  const intelligent = generateIntelligentRoadmap({
    targetCountryCode,
    targetIntakeSeason,
    targetIntakeYear,
    fundingChoice: "SELF_FUNDED",
  });

  return intelligent.map((phase) => ({
    stageNumber: phase.phaseNumber,
    monthsBeforeIntake: phase.timeframeNoticeBn,
    titleBn: phase.titleBn,
    titleEn: phase.titleEn,
    tasksBn: phase.tasks.map((t) => t.titleBn),
    tasksEn: phase.tasks.map((t) => t.titleEn),
  }));
}
