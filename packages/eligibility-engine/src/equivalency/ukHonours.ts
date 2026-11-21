/**
 * UK Honours Degree Classification Equivalency Engine
 * Based on UK NARIC / Ecctis and official UK university published entry requirements
 * for Bangladesh 4-year Bachelor degrees (UGC accredited universities).
 */

export type UkHonoursClassification =
  | "FIRST_CLASS"
  | "UPPER_SECOND_2_1"
  | "LOWER_SECOND_2_2"
  | "THIRD_CLASS"
  | "BELOW_PASS";

export interface UkEquivalencyResult {
  classification: UkHonoursClassification;
  titleBn: string;
  titleEn: string;
  equivalentPercentage: string;
  explanationBn: string;
  explanationEn: string;
}

const HIERARCHY: Record<UkHonoursClassification, number> = {
  FIRST_CLASS: 4,
  UPPER_SECOND_2_1: 3,
  LOWER_SECOND_2_2: 2,
  THIRD_CLASS: 1,
  BELOW_PASS: 0,
};

export function convertToUkHonours(
  gpa: number,
  scale: number = 4.0,
  percentage?: number
): UkEquivalencyResult {
  // If percentage is provided explicitly, use official UK percentage thresholds
  if (percentage !== undefined && percentage > 0) {
    if (percentage >= 70) {
      return {
        classification: "FIRST_CLASS",
        titleBn: "ফার্স্ট ক্লাস (First Class Honours - 1st)",
        titleEn: "First Class Honours (1st)",
        equivalentPercentage: "৭০% বা তদূর্ধ্ব",
        explanationBn: `আপনার প্রাপ্ত ${percentage}% ফলাফল যুক্তরাজ্যের ফার্স্ট ক্লাস (1st Honours) সমমানের।`,
        explanationEn: `Your score of ${percentage}% equates to UK First Class Honours (1st).`,
      };
    } else if (percentage >= 60) {
      return {
        classification: "UPPER_SECOND_2_1",
        titleBn: "আপার সেকেন্ড ক্লাস (Upper Second 2:1)",
        titleEn: "Upper Second Class Honours (2:1)",
        equivalentPercentage: "৬০% - ৬৯%",
        explanationBn: `আপনার প্রাপ্ত ${percentage}% ফলাফল যুক্তরাজ্যের ২:১ (Upper Second Class) সমমানের।`,
        explanationEn: `Your score of ${percentage}% equates to UK Upper Second Class Honours (2:1).`,
      };
    } else if (percentage >= 50) {
      return {
        classification: "LOWER_SECOND_2_2",
        titleBn: "লোয়ার সেকেন্ড ক্লাস (Lower Second 2:2)",
        titleEn: "Lower Second Class Honours (2:2)",
        equivalentPercentage: "৫০% - ৫৯%",
        explanationBn: `আপনার প্রাপ্ত ${percentage}% ফলাফল যুক্তরাজ্যের ২:২ (Lower Second Class) সমমানের।`,
        explanationEn: `Your score of ${percentage}% equates to UK Lower Second Class Honours (2:2).`,
      };
    } else if (percentage >= 40) {
      return {
        classification: "THIRD_CLASS",
        titleBn: "থার্ড ক্লাস (Third Class Honours - 3rd)",
        titleEn: "Third Class Honours (3rd)",
        equivalentPercentage: "৪০% - ৪৯%",
        explanationBn: `আপনার প্রাপ্ত ${percentage}% ফলাফল যুক্তরাজ্যের থার্ড ক্লাস সমমানের।`,
        explanationEn: `Your score of ${percentage}% equates to UK Third Class Honours (3rd).`,
      };
    } else {
      return {
        classification: "BELOW_PASS",
        titleBn: "ন্যূনতম পাসের নিচে (Below Pass)",
        titleEn: "Below Passing Standard",
        equivalentPercentage: "৪০% এর নিচে",
        explanationBn: "আপনার প্রাপ্ত নম্বর যুক্তরাজ্যের ন্যূনতম ডিগ্রি মানের নিচে।",
        explanationEn: "Your score is below the minimum passing standard for UK degrees.",
      };
    }
  }

  // UGC standard 4.0 scale conversion for Bangladesh Bachelor
  const normalizedGpa = scale === 4.0 ? gpa : (gpa / scale) * 4.0;

  if (normalizedGpa >= 3.5) {
    return {
      classification: "FIRST_CLASS",
      titleBn: "ফার্স্ট ক্লাস (First Class Honours - 1st)",
      titleEn: "First Class Honours (1st)",
      equivalentPercentage: "৭০%+ সমমান (CGPA ৩.৫০ - ৪.০০)",
      explanationBn: `আপনার সিজিপিএ ${gpa.toFixed(2)} (${scale}-এর স্কেলে) যুক্তরাজ্যের ফার্স্ট ক্লাস (1st) সমমানের।`,
      explanationEn: `Your CGPA of ${gpa.toFixed(2)} (scale ${scale}) meets UK First Class Honours (1st) standards.`,
    };
  } else if (normalizedGpa >= 3.0) {
    return {
      classification: "UPPER_SECOND_2_1",
      titleBn: "আপার সেকেন্ড ক্লাস (Upper Second 2:1)",
      titleEn: "Upper Second Class Honours (2:1)",
      equivalentPercentage: "৬০%-৬৯% সমমান (CGPA ৩.০০ - ৩.৪৯)",
      explanationBn: `আপনার সিজিপিএ ${gpa.toFixed(2)} (${scale}-এর স্কেলে) যুক্তরাজ্যের ২:১ (Upper Second 2:1) সমমানের।`,
      explanationEn: `Your CGPA of ${gpa.toFixed(2)} (scale ${scale}) meets UK Upper Second Class (2:1) standards.`,
    };
  } else if (normalizedGpa >= 2.5) {
    return {
      classification: "LOWER_SECOND_2_2",
      titleBn: "লোয়ার সেকেন্ড ক্লাস (Lower Second 2:2)",
      titleEn: "Lower Second Class Honours (2:2)",
      equivalentPercentage: "৫০%-৫৯% সমমান (CGPA ২.৫০ - ২.৯৯)",
      explanationBn: `আপনার সিজিপিএ ${gpa.toFixed(2)} (${scale}-এর স্কেলে) যুক্তরাজ্যের ২:২ (Lower Second 2:2) সমমানের।`,
      explanationEn: `Your CGPA of ${gpa.toFixed(2)} (scale ${scale}) meets UK Lower Second Class (2:2) standards.`,
    };
  } else if (normalizedGpa >= 2.0) {
    return {
      classification: "THIRD_CLASS",
      titleBn: "থার্ড ক্লাস (Third Class Honours - 3rd)",
      titleEn: "Third Class Honours (3rd)",
      equivalentPercentage: "৪০%-৪৯% সমমান (CGPA ২.০০ - ২.৪৯)",
      explanationBn: `আপনার সিজিপিএ ${gpa.toFixed(2)} (${scale}-এর স্কেলে) যুক্তরাজ্যের থার্ড ক্লাস সমমানের।`,
      explanationEn: `Your CGPA of ${gpa.toFixed(2)} (scale ${scale}) meets UK Third Class Honours standards.`,
    };
  } else {
    return {
      classification: "BELOW_PASS",
      titleBn: "পাস মানের নিচে",
      titleEn: "Below Passing Standard",
      equivalentPercentage: "CGPA ২.০০ এর নিচে",
      explanationBn: "আপনার সিজিপিএ যুক্তরাজ্যের ন্যূনতম ডিগ্রি পাস মানের নিচে।",
      explanationEn: "Your CGPA is below the minimum passing threshold for UK universities.",
    };
  }
}

/**
 * Returns true if student's UK classification meets or exceeds the program's required classification
 */
export function isUkClassificationSufficient(
  studentClass: UkHonoursClassification,
  requiredClass: string
): boolean {
  const reqNormalized = requiredClass.toUpperCase().replace(/[\s:-]+/g, "_") as UkHonoursClassification;
  const studentRank = HIERARCHY[studentClass] ?? 0;
  const requiredRank = HIERARCHY[reqNormalized] ?? 3; // Default to 2:1 if unclear

  return studentRank >= requiredRank;
}
