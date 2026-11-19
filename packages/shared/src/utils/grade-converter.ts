/**
 * Evaluates Bangladeshi SSC/HSC (5.00 Scale) or Bachelor CGPA (4.00 Scale)
 * into an international percentage/quality tier
 */
export function evaluateAcademicTier(gpa: number, scale: 5.0 | 4.0): {
  tier: "FIRST_CLASS" | "UPPER_SECOND" | "LOWER_SECOND" | "PASS" | "BELOW_REQUIREMENT";
  equivalentPercentage: number;
  labelBn: string;
} {
  if (scale === 5.0) {
    // Bangladeshi SSC / HSC (Scale of 5.00)
    // 5.00 = GPA-5 / Golden GPA (A+)
    if (gpa >= 4.8) {
      return { tier: "FIRST_CLASS", equivalentPercentage: 85, labelBn: "চমৎকার (A+ / গোল্ডেন জিপিএ)" };
    }
    if (gpa >= 4.0) {
      return { tier: "FIRST_CLASS", equivalentPercentage: 75, labelBn: "প্রথম বিভাগ (A)" };
    }
    if (gpa >= 3.5) {
      return { tier: "UPPER_SECOND", equivalentPercentage: 65, labelBn: "দ্বিতীয় বিভাগ (A-)" };
    }
    if (gpa >= 3.0) {
      return { tier: "LOWER_SECOND", equivalentPercentage: 55, labelBn: "তৃতীয় বিভাগ (B)" };
    }
    return { tier: "BELOW_REQUIREMENT", equivalentPercentage: 45, labelBn: "শর্তের নিচে" };
  } else {
    // Bangladeshi Bachelor's CGPA (Scale of 4.00)
    // 3.50+ = First Class with Distinction (approx UK 1st Class)
    if (gpa >= 3.6) {
      return { tier: "FIRST_CLASS", equivalentPercentage: 85, labelBn: "ফার্স্ট ক্লাস উইথ ডিস্টিংশন (3.60+)" };
    }
    if (gpa >= 3.25) {
      return { tier: "FIRST_CLASS", equivalentPercentage: 75, labelBn: "ফার্স্ট ক্লাস (UK 2:1 সমমানের)" };
    }
    if (gpa >= 2.8) {
      return { tier: "UPPER_SECOND", equivalentPercentage: 65, labelBn: "আপার সেকেন্ড ক্লাস (UK 2:2 সমমানের)" };
    }
    if (gpa >= 2.5) {
      return { tier: "LOWER_SECOND", equivalentPercentage: 55, labelBn: "পাস ক্লাস" };
    }
    return { tier: "BELOW_REQUIREMENT", equivalentPercentage: 45, labelBn: "ন্যূনতম জিপিএ শর্ত পূরণ করেনি" };
  }
}
