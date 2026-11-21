import { FundingImpactSummary, ScholarshipRecord } from "./types";

interface ProgramFundingInfo {
  annualTuitionAmount: number;
  tuitionCurrencyCode: string;
  countryCode: string;
}

export interface RoadmapTaskTemplate {
  phaseNumber: number; // 1 to 5
  titleBn: string;
  titleEn: string;
  description: string;
  actionUrl?: string;
  isCompleted?: boolean;
  completedAt?: Date | null;
}

// BDT currency rates
const RATES: Record<string, number> = {
  GBP: 155.0,
  EUR: 130.0,
  CAD: 87.0,
  AUD: 78.0,
  USD: 122.0,
  BDT: 1.0,
};

export function calculateFundingImpact(
  choiceType: "SCHOLARSHIP_FUNDED" | "SELF_FUNDED",
  scholarship?: ScholarshipRecord | null,
  program?: ProgramFundingInfo | null
): FundingImpactSummary {
  if (choiceType === "SCHOLARSHIP_FUNDED" && scholarship) {
    const cur = scholarship.livingStipendCurrency || "GBP";
    const rate = RATES[cur] || 120;
    const monthlyLivingBdt = Math.round((scholarship.livingStipendMonthly || 1000) * rate);
    const annualLivingBdt = monthlyLivingBdt * 12;

    const progTuitionCur = program?.tuitionCurrencyCode || "GBP";
    const progRate = RATES[progTuitionCur] || 120;
    const totalProgTuitionBdt = Math.round((program?.annualTuitionAmount || 25000) * progRate);

    const coveredTuitionBdt = Math.round(
      totalProgTuitionBdt * (scholarship.tuitionCoveragePercent / 100)
    );
    const coveredLivingBdt = annualLivingBdt;
    const totalCoveredBdt = coveredTuitionBdt + coveredLivingBdt;

    // Uncovered expenses (initial test fees, passport, personal buffer)
    const uncoveredPersonalBufferBdt =
      scholarship.fundingType === "FULL_FUNDED" ? 93000 : 1500000;

    // With a full scholarship, embassy bank solvency is essentially 0 or minimal buffer
    const requiredBankSolvencyBdt =
      scholarship.fundingType === "FULL_FUNDED" ? 150000 : 2000000;

    return {
      choiceType: "SCHOLARSHIP_FUNDED",
      scholarshipTitleBn: scholarship.titleBn,
      coveredTuitionBdt,
      coveredLivingBdt,
      totalCoveredBdt,
      uncoveredPersonalBufferBdt,
      requiredBankSolvencyBdt,
      monthlyLivingStipendBdt: monthlyLivingBdt,
      tuitionCoveragePercent: scholarship.tuitionCoveragePercent,
      summaryBn: `আপনি '${scholarship.titleBn}' নির্বাচনের মাধ্যমে প্রায় ৳${(
        totalCoveredBdt / 100000
      ).toFixed(1)} লাখ টাকার সম্পূর্ণ বা আংশিক আর্থিক নিশ্চয়তা পেয়েছেন। ফলে আপনার সাধারণ ব্যাংক সলভেন্সি প্রদর্শন শিথিল হবে।`,
      recommendationsBn: [
        "অফিসিয়াল স্কলারশিপ পোর্টালে যথাসময়ে আবেদন সাবমিট করুন।",
        "এসওপি ও লিডারশিপ প্রবন্ধগুলো অভিজ্ঞ মেন্টর দ্বারা প্রুফরিড করান।",
        "প্রাথমিক পাসপোর্ট ও আইইএলটিএস পরীক্ষার জন্য ব্যক্তিগত জরুরি বাফার (প্রায় ৳৯৩,০০০) প্রস্তুত রাখুন।",
      ],
    };
  }

  // Self-Funded Route
  const cur = program?.tuitionCurrencyCode || "GBP";
  const rate = RATES[cur] || 155;
  const annualTuitionBdt = Math.round((program?.annualTuitionAmount || 22000) * rate);

  // Standard living cost estimate: ~1,000 units/month * 12
  const annualLivingBdt = Math.round(12 * 1000 * rate);
  const totalCostBdt = annualTuitionBdt + annualLivingBdt;

  // Embassy Bank Solvency requirement:
  // For UK: 1 year tuition + 9 months living (e.g. £1,023/month)
  // For Germany: Blocked account €11,904 (~15.5 Lakhs BDT)
  let requiredBankSolvencyBdt = totalCostBdt;
  if (program?.countryCode === "DE") {
    requiredBankSolvencyBdt = Math.round(11904 * (RATES["EUR"] || 130));
  } else if (program?.countryCode === "GB") {
    requiredBankSolvencyBdt = Math.round((annualTuitionBdt + 9 * 1023 * 155));
  }

  return {
    choiceType: "SELF_FUNDED",
    coveredTuitionBdt: 0,
    coveredLivingBdt: 0,
    totalCoveredBdt: 0,
    uncoveredPersonalBufferBdt: totalCostBdt,
    requiredBankSolvencyBdt,
    monthlyLivingStipendBdt: 0,
    tuitionCoveragePercent: 0,
    summaryBn: `আপনি সম্পূর্ণ স্ব-অর্থায়নে (Self-funded) পড়াশোনার সিদ্ধান্ত নিয়েছেন। আপনার আনুমানিক মোট বাৎসরিক খরচ ৳${(
      totalCostBdt / 100000
    ).toFixed(1)} লাখ টাকা এবং দূতাবাস ব্যাংক সলভেন্সি আবশ্যক হবে।`,
    recommendationsBn: [
      "স্পন্সরের (বাবা/মা/অভিভাবক) সাথে বসে দ্রুত ব্যাংক সলভেন্সির ফান্ড নিশ্চিত করুন।",
      "২৮ দিন / ৩ মাসের ব্যাংক ব্যালেন্স ট্র্যাকিং শুরু করুন যাতে কোনো একক বড় ডিপোজিট নিয়ে ভিসা রিফিউজাল না আসে।",
      "আয়ের বৈধ উৎসের জন্য ৩ বছরের ট্যাক্স রিটার্ন ও জমিজমা/ব্যবসার নথিপত্র প্রস্তুত রাখুন।",
    ],
  };
}

export function getRoadmapTaskTemplatesForFunding(
  choiceType: "SCHOLARSHIP_FUNDED" | "SELF_FUNDED",
  scholarshipTitleBn?: string
): RoadmapTaskTemplate[] {
  if (choiceType === "SCHOLARSHIP_FUNDED") {
    return [
      {
        phaseNumber: 2,
        titleBn: `${scholarshipTitleBn || "স্কলারশিপ"}-এর আবেদন প্রবন্ধ (SOP / Essay) ড্রাফট করুন`,
        titleEn: "Draft Scholarship Personal Statement & Essays",
        description:
          "লিডারশিপ, দীর্ঘমেয়াদি ক্যারিয়ার গোল এবং বাংলাদেশে প্রত্যাবর্তনের সুনির্দিষ্ট পরিকল্পনা নিয়ে এসওপি তৈরি করুন।",
        actionUrl: "/dashboard/sop-builder",
      },
      {
        phaseNumber: 2,
        titleBn: "২টি অ্যাকাডেমিক ও প্রফেশনাল রেফারেন্স লেটার সংগ্রহ",
        titleEn: "Collect 2 Academic / Professional Reference Letters",
        description:
          "বিশ্ববিদ্যালয়ের শিক্ষক অথবা কর্মক্ষেত্রের সুপারভাইজারের অফিশিয়াল প্যাডে সিলযুক্ত রিকমেন্ডেশন লেটার নিন।",
        actionUrl: "/dashboard/documents",
      },
      {
        phaseNumber: 2,
        titleBn: `${scholarshipTitleBn || "স্কলারশিপ"}-এর অফিসিয়াল পোর্টালে সাবমিশন সম্পন্ন করুন`,
        titleEn: "Complete Official Scholarship Portal Application",
        description:
          "ডেডলাইনের কমপক্ষে ১ সপ্তাহ পূর্বে সকল ডকুমেন্টস স্ক্যান করে সরকারি/বিশ্ববিদ্যালয় পোর্টালে সাবমিট করুন।",
        actionUrl: "/dashboard/scholarships",
      },
      {
        phaseNumber: 3,
        titleBn: "স্কলারশিপ ইন্টারভিউ ও মক সেশনের প্রস্তুতি",
        titleEn: "Prepare for Scholarship Panel Interview",
        description:
          "শর্টলিস্টেড হলে প্যানেল ইন্টারভিউয়ের জন্য প্রস্তুতি নিন এবং মক সেশন দিন।",
      },
    ];
  }

  // Self-Funded Tasks
  return [
    {
      phaseNumber: 2,
      titleBn: "আর্থিক স্পন্সর নির্বাচন ও স্পনসরশিপ হলফনামা (Affidavit of Support) তৈরি",
      titleEn: "Select Financial Sponsor and Prepare Affidavit of Support",
      description:
        "নোটারি পাবলিকের মাধ্যমে স্পন্সরের স্পনসরশিপ হলফনামা ও সম্পর্ক প্রমাণের নথিপত্র প্রস্তুত করুন।",
      actionUrl: "/dashboard/calculator",
    },
    {
      phaseNumber: 3,
      titleBn: "২৮ দিন / ৩ মাসের ব্যাংক ব্যালেন্স সলভেন্সি ট্র্যাকার চালু করুন",
      titleEn: "Maintain 28-day / 3-month Bank Solvency Account Balance",
      description:
        "অ্যাকাউন্টে নিরবচ্ছিন্নভাবে নির্ধারিত ফান্ড বজায় রাখুন। হঠাৎ বড় অঙ্কের অজানা লেনদেন পরিহার করুন।",
      actionUrl: "/dashboard/calculator",
    },
    {
      phaseNumber: 3,
      titleBn: "স্পন্সরের ৩ বছরের আয়কর রিটার্ন ও ট্যাক্স সার্টিফিকেট সংগ্রহ",
      titleEn: "Collect 3 Years Income Tax Returns & Tax Clearance",
      description:
        "এনবিআর (NBR) অনুমোদিত আয়কর রিটার্ন প্রাপ্তি স্বীকার ও ই-টিআইএন সার্টিফিকেট সংগ্রহ করুন।",
      actionUrl: "/dashboard/documents",
    },
    {
      phaseNumber: 3,
      titleBn: "আয়ের উৎসের প্রমাণাদি (Source of Funds Documentation) প্রস্তুত রাখুন",
      titleEn: "Compile Source of Funds Documentation (Business/Land/Salary)",
      description:
        "ট্রেড লাইসেন্স, ব্যাংক স্টেটমেন্ট, পে-স্লিপ বা জমির খতিয়ান/দলিলের সার্টিফায়েড অনুবাদ কপি করুন।",
      actionUrl: "/dashboard/documents",
    },
  ];
}

/**
 * Preserves previously completed tasks when switching funding choices
 */
export function mergeTasksWithPreservation<
  T extends { titleBn: string; isCompleted: boolean; completedAt?: any }
>(existingTasks: T[], newTemplates: RoadmapTaskTemplate[]): RoadmapTaskTemplate[] {
  // If an existing task has the same title and was completed, we retain its completed status
  return newTemplates.map((template) => {
    const existing = existingTasks.find(
      (t) => t.titleBn.trim().toLowerCase() === template.titleBn.trim().toLowerCase()
    );
    return {
      ...template,
      isCompleted: existing ? existing.isCompleted : false,
      completedAt: existing ? existing.completedAt : null,
    };
  });
}
