import { ScholarshipRecord } from "../types";

// Standard BDT Conversion Multipliers
const RATES_TO_BDT: Record<string, number> = {
  GBP: 155.0,
  CAD: 87.0,
  AUD: 78.0,
  EUR: 130.0,
  USD: 122.0,
  BDT: 1.0,
};

export function calculateScholarshipExpenses(scholarship: ScholarshipRecord): {
  coveredBenefitsBn: string[];
  uncoveredEstimatedBdt: number;
} {
  const coveredBenefitsBn: string[] = [];
  let uncoveredEstimatedBdt = 0;

  // 1. Tuition
  if (scholarship.tuitionCoveragePercent >= 100) {
    coveredBenefitsBn.push("১০০% পূর্ণ টিউশন ফি মওকুফ (Full Tuition Covered)");
  } else if (scholarship.tuitionCoveragePercent > 0) {
    coveredBenefitsBn.push(
      `${scholarship.tuitionCoveragePercent}% টিউশন ফি মওকুফ (বাকি ${
        100 - scholarship.tuitionCoveragePercent
      }% শিক্ষার্থী বহন করবে)`
    );
  }

  // 2. Living Stipend
  if (scholarship.livingStipendMonthly && scholarship.livingStipendMonthly > 0) {
    const cur = scholarship.livingStipendCurrency || "GBP";
    const monthlyBdt = Math.round(scholarship.livingStipendMonthly * (RATES_TO_BDT[cur] || 120));
    coveredBenefitsBn.push(
      `মাসিক জীবনযাত্রা ভাতা (Stipend): ${scholarship.livingStipendMonthly} ${cur} (প্রায় ৳${monthlyBdt.toLocaleString()} টাকা/মাস)`
    );
  }

  // 3. Travel & Flights
  if (scholarship.travelSupport) {
    coveredBenefitsBn.push("বাংলাদেশ থেকে আন্তর্জাতিক রিটার্ন বিমান টিকিট (Economy Airfare)");
  }

  // 4. Accommodation
  if (scholarship.accommodationSupport) {
    coveredBenefitsBn.push("বিনামূল্যে ডরমেটরি / আবাসন ভাতা");
  }

  // 5. Health Insurance & Visa
  if (scholarship.healthInsuranceCovered) {
    coveredBenefitsBn.push("আন্তর্জাতিক শিক্ষার্থী স্বাস্থ্য বীমা (Health Insurance)");
  }
  if (scholarship.visaFeeCovered) {
    coveredBenefitsBn.push("স্টুডেন্ট ভিসা আবেদন ফি রিইমবার্সমেন্ট");
  }

  // Uncovered expenses estimation for student
  // Even in full-ride scholarships, students need an initial pre-departure buffer in BDT:
  if (scholarship.fundingType === "FULL_FUNDED") {
    // Standard pre-departure buffer:
    // IELTS exam fee: ~25,000 BDT
    // Passport fee: ~6,000 BDT
    // Medical/TB clearance: ~12,000 BDT
    // Initial arrival pocket money: ~50,000 BDT
    uncoveredEstimatedBdt = 93000;
  } else if (scholarship.fundingType === "TUITION_ONLY") {
    // Student covers living costs (estimated 12 months at ~1,000 units):
    const cur = scholarship.countryCode === "GB" ? "GBP" : scholarship.countryCode === "DE" ? "EUR" : "USD";
    const annualLivingBdt = 12 * 1000 * (RATES_TO_BDT[cur] || 120);
    uncoveredEstimatedBdt = annualLivingBdt + 93000;
  } else {
    // Partial waiver: assume student needs ~15-20 Lakhs BDT
    uncoveredEstimatedBdt = 1800000;
  }

  return { coveredBenefitsBn, uncoveredEstimatedBdt };
}
