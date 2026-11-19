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
  return [
    {
      stageNumber: 1,
      monthsBeforeIntake: "১২-১৪ মাস পূর্বে",
      titleBn: "প্রাথমিক প্রস্তুতি ও পাসপোর্ট",
      titleEn: "Early Preparation & Passport",
      tasksBn: [
        "পাসপোর্টের মেয়াদ অন্তত ২-৩ বছর আছে কিনা নিশ্চিত করুন অথবা ই-পাসপোর্টের জন্য আবেদন করুন।",
        "পছন্দের দেশ ও বিশ্ববিদ্যালয়ের তালিকা প্রস্তুত করুন।",
        "আইইএলটিএস / টোফেল প্রস্তুতির জন্য নিয়মিত অনুশীলন শুরু করুন।",
      ],
      tasksEn: [
        "Ensure passport validity of at least 2-3 years or apply for e-Passport.",
        "Shortlist target countries and prospective universities.",
        "Begin structured IELTS/TOEFL preparation.",
      ],
    },
    {
      stageNumber: 2,
      monthsBeforeIntake: "৯-১১ মাস পূর্বে",
      titleBn: "ভাষাগত পরীক্ষা ও ডকুমেন্টেশন",
      titleEn: "Language Exam & Academic Documents",
      tasksBn: [
        "আইইএলটিএস বা সমমানের পরীক্ষায় অংশগ্রহণ করে কাঙ্ক্ষিত স্কোর অর্জন করুন।",
        "শিক্ষা বোর্ড / বিশ্ববিদ্যালয় থেকে অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট ও সার্টিফিকেট সংগ্রহ করুন।",
        "প্রফেসর বা সুপারভাইজারের কাছ থেকে ২টি একাডেমিক রিকমেন্ডেশন লেটার (LOR) সংগ্রহ করুন।",
        "স্টেটমেন্ট অব পারপাস (SOP) বা মোটিভেশন লেটারের খসড়া তৈরি করুন।",
      ],
      tasksEn: [
        "Take IELTS/TOEFL and achieve target band scores.",
        "Attest and collect official academic transcripts and certificates.",
        "Request 2 academic letters of recommendation (LOR).",
        "Draft tailored Statement of Purpose (SOP).",
      ],
    },
    {
      stageNumber: 3,
      monthsBeforeIntake: "৬-৮ মাস পূর্বে",
      titleBn: "বিশ্ববিদ্যালয় ও স্কলারশিপ আবেদন",
      titleEn: "University Applications & Scholarships",
      tasksBn: [
        "বিশ্ববিদ্যালয়ের অফিসিয়াল ওয়েবসাইটে সরাসরি অনলাইন অ্যাডমিশন আবেদন সাবমিট করুন।",
        "সরকারি ও বিশ্ববিদ্যালয় প্রদত্ত স্কলারশিপের ডেডলাইনের আগে আবেদন সম্পন্ন করুন।",
        "অফার লেটার (কন্ডিশনাল বা আনকন্ডিশনাল) প্রাপ্তির জন্য অপেক্ষা করুন এবং আপডেট ট্র্যাক করুন।",
      ],
      tasksEn: [
        "Submit direct online applications to chosen universities.",
        "Apply for eligible government and university scholarships before deadlines.",
        "Track application portals and receive Conditional/Unconditional Offer Letters.",
      ],
    },
    {
      stageNumber: 4,
      monthsBeforeIntake: "৩-৫ মাস পূর্বে",
      titleBn: "অফার গ্রহণ ও ব্যাংক ফান্ড প্রস্তুতি",
      titleEn: "Offer Acceptance & Financial Proof",
      tasksBn: [
        "টিউশন ফি ডিপোজিট পরিশোধ করে CAS (UK), I-20 (USA), CoE (Australia), বা LOA (Canada) সংগ্রহ করুন।",
        "ভিসা নীতি অনুযায়ী ব্যাংক ব্যালেন্স জমা রাখুন (যেমন UK-এর জন্য ২৮ দিন অবিচ্ছিন্ন তহবিল, অথবা জার্মানির জন্য ব্লকড অ্যাকাউন্ট ট্রান্সফার)।",
        "স্পনসরশিপ এফিডেভিট এবং ট্যাক্স রিটার্ন সংক্রান্ত প্রয়োজনীয় কাগজপত্র প্রস্তুত করুন।",
      ],
      tasksEn: [
        "Pay tuition deposit and obtain CAS / Form I-20 / CoE / PAL.",
        "Maintain required financial funds in bank (e.g. UK 28-day rule or German Blocked Account transfer).",
        "Prepare Sponsor Affidavit of Support and financial income proofs.",
      ],
    },
    {
      stageNumber: 5,
      monthsBeforeIntake: "১-২ মাস পূর্বে",
      titleBn: "ভিসা আবেদন ও উড়ালের প্রস্তুতি",
      titleEn: "Visa Lodgement & Pre-Departure",
      tasksBn: [
        "অফিসিয়াল ইমিগ্রেশন পোর্টালে অনলাইন ভিসা ফর্ম পূরণ করুন ও ফি পরিশোধ করুন।",
        "ভিএফএস / দূতাবাসে বায়োমেট্রিক ও মেডিকেল পরীক্ষার অ্যাপয়েন্টমেন্ট নিন।",
        "ভিসা স্ট্যাম্প বা ই-ভিসা গ্রহণের পর বিমান টিকিট ও বাসস্থান (Accommodation) বুক করুন।",
      ],
      tasksEn: [
        "Complete online student visa application and submit required fees.",
        "Attend VFS / Embassy biometric appointment and medical checkup.",
        "Receive student visa, book flight tickets, and finalize student accommodation.",
      ],
    },
  ];
}
