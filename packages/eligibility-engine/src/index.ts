export * from "./equivalency/bavarian";
export * from "./equivalency/ukHonours";
export * from "./evaluators/academic";
export * from "./evaluators/language";
export * from "./evaluators/prerequisites";
export * from "./evaluators/intake";
export * from "./engine";

// -------------------------------------------------------------
// Legacy Quick Eligibility (Preserved for backward compatibility)
// -------------------------------------------------------------
import { QuickEligibilityCheckInput } from "@abroadmate/validation";
import { INITIAL_COUNTRIES } from "@abroadmate/shared";

export type { QuickEligibilityCheckInput };

export interface EligibilityEvaluationResult {
  status: "ELIGIBLE" | "BORDERLINE" | "INELIGIBLE";
  scorePercentage: number;
  reasonsBn: string[];
  reasonsEn?: string[];
  recommendationsBn: string[];
  recommendationsEn?: string[];
}

export function evaluateQuickEligibility(input: QuickEligibilityCheckInput): EligibilityEvaluationResult {
  const country = INITIAL_COUNTRIES[input.targetCountry];
  const reasonsBn: string[] = [];
  const reasonsEn: string[] = [];
  const recommendationsBn: string[] = [];
  const recommendationsEn: string[] = [];

  let academicPassed = false;
  let englishPassed = false;
  let score = 0;

  // 1. Evaluate GPA / CGPA
  if (input.degreeLevel === "bachelor") {
    if (input.currentGpa >= 4.5) {
      academicPassed = true;
      score += 50;
      reasonsBn.push("আপনার এইচএসসি জিপিএ শীর্ষ বিশ্ববিদ্যালয়ে সরাসরি ভর্তির জন্য খুবই আকর্ষণীয়।");
      reasonsEn.push("Your HSC GPA is competitive for direct admission to top-ranked universities.");
    } else if (input.currentGpa >= 3.5) {
      academicPassed = true;
      score += 40;
      reasonsBn.push("আপনার এইচএসসি জিপিএ অধিকাংশ সাধারণ বিশ্ববিদ্যালয় বা আন্তর্জাতিক ফাউন্ডেশন প্রোগ্রামের জন্য উপযুক্ত।");
      reasonsEn.push("Your HSC GPA meets the standard requirements for most universities or foundation programs.");
    } else if (input.currentGpa >= 3.0) {
      score += 25;
      reasonsBn.push("আপনার জিপিএ কিছুটা কম; তবে ইন্টারন্যাশনাল ফাউন্ডেশন বা ডিপ্লোমা পাথওয়ের মাধ্যমে ভর্তির সুযোগ রয়েছে।");
      reasonsEn.push("Your GPA is slightly below direct cutoff, but pathway or International Foundation programs are available.");
      recommendationsBn.push("সরাসরি ১ম বর্ষের বদলে 'International Year One' বা ফাউন্ডেশন পাথওয়ে প্রোগ্রাম বিবেচনা করুন।");
      recommendationsEn.push("Consider applying for an International Foundation or Year One pathway program.");
    } else {
      reasonsBn.push("এইচএসসি জিপিএ ৩.০০ এর নিচে থাকলে সরাসরি বিদেশে ভর্তির আবেদন বেশ ঝুঁকিপূর্ণ।");
      reasonsEn.push("HSC GPA below 3.00 is generally below the standard international threshold.");
      recommendationsBn.push("উন্নত ব্যাকগ্রাউন্ড প্রদর্শন করতে অতিরিক্ত কোনো আন্তর্জাতিক ডিপ্লোমা বা দেশে ভালো ফলাফলের চেষ্টা করুন।");
      recommendationsEn.push("Consider additional recognized credentials or diplomas before applying abroad.");
    }
  } else {
    const normalizedCgpa = input.currentGpa > 4.0 ? (input.currentGpa / 5.0) * 4.0 : input.currentGpa;
    
    if (normalizedCgpa >= 3.3) {
      academicPassed = true;
      score += 50;
      reasonsBn.push("আপনার সিজিপিএ (UK 2:1 বা সমমান) শীর্ষ পাবলিক বিশ্ববিদ্যালয়ে সরাসরি মাস্টার্স ভর্তির উপযোগী।");
      reasonsEn.push("Your CGPA (UK 2:1 equivalent) is well-suited for direct postgraduate entry at public universities.");
    } else if (normalizedCgpa >= 2.8) {
      academicPassed = true;
      score += 40;
      reasonsBn.push("আপনার সিজিপিএ (UK 2:2 বা সমমান) মাঝারি সারির আন্তর্জাতিক বিশ্ববিদ্যালয়গুলোর শর্ত পূরণ করে।");
      reasonsEn.push("Your CGPA meets the standard 2:2 equivalent cutoff for many international universities.");
    } else if (normalizedCgpa >= 2.5) {
      score += 25;
      reasonsBn.push("সিজিপিএ ২.৮ এর নিচে হলে কিছু নির্দিষ্ট ইউনিভার্সিটি বা প্রি-মাস্টার্স কোর্স প্রয়োজন হতে পারে।");
      reasonsEn.push("CGPA below 2.8 may require pre-master's preparation or specific university pathway entry.");
      recommendationsBn.push("প্রি-মাস্টার্স (Pre-Master's) প্রোগ্রাম অথবা উপযুক্ত চাকরির অভিজ্ঞতা প্রদর্শন করুন।");
      recommendationsEn.push("Include relevant professional work experience or consider a pre-master's course.");
    } else {
      reasonsBn.push("সিজিপিএ ২.৫০ এর নিচে থাকলে সরাসরি মাস্টার্স ভর্তির সুযোগ অত্যন্ত সীমিত।");
      reasonsEn.push("CGPA below 2.50 severely limits direct master's entry options.");
    }
  }

  // 2. Evaluate English Language Score (IELTS)
  const minRequiredIelts = input.degreeLevel === "bachelor" 
    ? (country?.minIeltsUndergrad ?? 6.0)
    : (country?.minIeltsPostgrad ?? 6.5);

  if (input.ieltsBand >= minRequiredIelts + 0.5) {
    englishPassed = true;
    score += 50;
    reasonsBn.push(`আইইএলটিএস ব্যান্ড ${input.ieltsBand} এই দেশের ন্যূনতম শর্ত (${minRequiredIelts}) থেকে এগিয়ে আছে।`);
    reasonsEn.push(`IELTS Band ${input.ieltsBand} comfortably exceeds the country's minimum requirement of ${minRequiredIelts}.`);
  } else if (input.ieltsBand >= minRequiredIelts) {
    englishPassed = true;
    score += 45;
    reasonsBn.push(`আইইএলটিএস ব্যান্ড ${input.ieltsBand} এই দেশের ন্যূনতম শর্ত (${minRequiredIelts}) সন্তোষজনকভাবে পূরণ করে।`);
    reasonsEn.push(`IELTS Band ${input.ieltsBand} successfully meets the target country's entry requirement (${minRequiredIelts}).`);
  } else if (input.ieltsBand >= minRequiredIelts - 0.5 && input.ieltsBand > 0) {
    score += 25;
    reasonsBn.push(`আইইএলটিএস স্কোর (${input.ieltsBand}) ন্যূনতম শর্ত (${minRequiredIelts}) থেকে সামান্য কম।`);
    reasonsEn.push(`IELTS Band (${input.ieltsBand}) is slightly below the minimum recommended cutoff (${minRequiredIelts}).`);
    recommendationsBn.push(`ন্যূনতম ০.৫ ব্যান্ড বাড়ানোর জন্য পুনরায় পরীক্ষা দিতে পারেন অথবা প্রি-সেশনাল ইংলিশ কোর্স দেখতে পারেন।`);
    recommendationsEn.push(`Aim to retake IELTS for +0.5 band or check pre-sessional English course options.`);
  } else if (input.ieltsBand === 0) {
    score += 15;
    reasonsBn.push("আপনি এখনও আইইএলটিএস দেননি। ভর্তি ও ভিসা নিশ্চিত করতে পরীক্ষা সম্পন্ন করা জরুরি।");
    reasonsEn.push("IELTS not taken yet. A verified English language test is required for admission and visa processing.");
    recommendationsBn.push(`লক্ষ্য রাখুন যেন ন্যূনতম ${minRequiredIelts} স্কোর অর্জন করা যায়।`);
    recommendationsEn.push(`Target an overall score of at least ${minRequiredIelts} with no band below 5.5-6.0.`);
  } else {
    reasonsBn.push(`আইইএলটিএস ব্যান্ড (${input.ieltsBand}) অত্যন্ত কম; ভিসার মানদণ্ড পূরণে ঘাটতি রয়েছে।`);
    reasonsEn.push(`IELTS score (${input.ieltsBand}) is significantly below student visa standards.`);
    recommendationsBn.push("অনতিবিলম্বে ইংরেজি ভাষা দক্ষতার প্রস্তুতি নিয়ে স্কোর উন্নত করুন।");
    recommendationsEn.push("Focus on structured language preparation before proceeding with university applications.");
  }

  // 3. Status Determination
  let status: "ELIGIBLE" | "BORDERLINE" | "INELIGIBLE" = "INELIGIBLE";
  if (academicPassed && englishPassed) {
    status = "ELIGIBLE";
  } else if (score >= 50) {
    status = "BORDERLINE";
  }

  return {
    status,
    scorePercentage: Math.min(100, score),
    reasonsBn,
    reasonsEn,
    recommendationsBn,
    recommendationsEn,
  };
}
