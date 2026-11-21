/**
 * German Bavarian Formula (Modifizierte Bayerische Formel)
 * Standard formula prescribed by KMK (Kultusministerkonferenz) for foreign grade conversion:
 * 
 * Grade = 1 + 3 * (Nmax - Nd) / (Nmax - Nmin)
 * 
 * In Germany:
 * - 1.0 is the best possible grade (sehr gut)
 * - 4.0 is the lowest passing grade (ausreichend)
 * - 5.0 is fail (nicht bestanden)
 * - Lower numerical values denote superior performance.
 */

export interface BavarianCalculationResult {
  germanGrade: number;
  formattedGrade: string;
  isPassing: boolean;
  explanationBn: string;
  explanationEn: string;
}

export function calculateBavarianGrade(
  studentGrade: number,
  maxGrade: number = 4.0,
  minPassGrade: number = 2.0
): BavarianCalculationResult | null {
  if (
    isNaN(studentGrade) ||
    isNaN(maxGrade) ||
    isNaN(minPassGrade) ||
    maxGrade <= minPassGrade
  ) {
    return null;
  }

  // Handle out-of-range cases
  if (studentGrade > maxGrade) {
    // If student grade exceeds reported scale maximum, clamp to top grade
    studentGrade = maxGrade;
  }

  if (studentGrade < minPassGrade) {
    return {
      germanGrade: 5.0,
      formattedGrade: "5.00",
      isPassing: false,
      explanationBn: `আপনার প্রাপ্ত ফলাফল (${studentGrade}) এই গ্রেডিং স্কেলের ন্যূনতম পাস নম্বরের (${minPassGrade}) নিচে। জার্মান গ্রেডিং অনুযায়ী এটি ফেইল (৫.০)।`,
      explanationEn: `Your score (${studentGrade}) is below the minimum passing threshold (${minPassGrade}). Converted German grade is 5.0 (Fail).`,
    };
  }

  // German Grade = 1 + 3 * (Nmax - Nd) / (Nmax - Nmin)
  const rawGrade = 1 + 3 * ((maxGrade - studentGrade) / (maxGrade - minPassGrade));
  // Round to two decimal places
  const roundedGrade = Math.round(rawGrade * 100) / 100;

  return {
    germanGrade: roundedGrade,
    formattedGrade: roundedGrade.toFixed(2),
    isPassing: roundedGrade <= 4.0,
    explanationBn: `বাভারিয়ান ফর্মুলা অনুযায়ী আপনার সিজিপিএ ${studentGrade} (${maxGrade}-এর স্কেলে) জার্মান সমমান গ্রেড ${roundedGrade.toFixed(2)}-এ রূপান্তরিত হয়েছে।`,
    explanationEn: `Under the Modified Bavarian Formula, your CGPA of ${studentGrade} (scale of ${maxGrade}) converts to German grade ${roundedGrade.toFixed(2)}.`,
  };
}
