import { StudentAcademicProfile } from "@abroadmate/shared";

export interface ScholarshipCandidate {
  id: string;
  countryCode: string;
  titleEn: string;
  titleBn: string;
  coverageType: string;
  minCgpaRequired: number;
  minIeltsRequired: number;
  requiresWorkExperienceMonths: number;
}

export interface MatchedScholarshipResult {
  scholarshipId: string;
  matchScore: number;
  isEligible: boolean;
  missingRequirementsBn: string[];
}

export function matchScholarshipsForProfile(
  profile: Partial<StudentAcademicProfile>,
  scholarships: ScholarshipCandidate[]
): MatchedScholarshipResult[] {
  const currentCgpa = profile.bachelorCgpa ?? (profile.hscGpa ? (profile.hscGpa / 5.0) * 4.0 : 0);
  const currentIelts = profile.englishTest?.overallBand ?? 0;

  return scholarships.map((s) => {
    const missing: string[] = [];
    let score = 100;

    if (currentCgpa < s.minCgpaRequired) {
      score -= 40;
      missing.push(`ন্যূনতম সিজিপিএ ${s.minCgpaRequired.toFixed(2)} প্রয়োজন (আপনার বর্তমান: ${currentCgpa.toFixed(2)})`);
    }

    if (currentIelts < s.minIeltsRequired) {
      score -= 30;
      missing.push(`আইইএলটিএস ন্যূনতম ${s.minIeltsRequired.toFixed(1)} প্রয়োজন (আপনার বর্তমান: ${currentIelts.toFixed(1)})`);
    }

    return {
      scholarshipId: s.id,
      matchScore: Math.max(0, score),
      isEligible: missing.length === 0,
      missingRequirementsBn: missing,
    };
  });
}
