export const BANGLADESH_EDUCATION_BOARDS = [
  { id: "dhaka", nameEn: "Dhaka", nameBn: "ঢাকা" },
  { id: "chittagong", nameEn: "Chattogram", nameBn: "চট্টগ্রাম" },
  { id: "rajshahi", nameEn: "Rajshahi", nameBn: "রাজশাহী" },
  { id: "comilla", nameEn: "Cumilla", nameBn: "কুমিল্লা" },
  { id: "sylhet", nameEn: "Sylhet", nameBn: "সিলেট" },
  { id: "barisal", nameEn: "Barishal", nameBn: "বরিশাল" },
  { id: "jessore", nameEn: "Jashore", nameBn: "যশোর" },
  { id: "dinajpur", nameEn: "Dinajpur", nameBn: "দিনাজপুর" },
  { id: "mymensingh", nameEn: "Mymensingh", nameBn: "ময়মনসিংহ" },
  { id: "madrasah", nameEn: "Madrasah Board", nameBn: "মাদ্রাসা বোর্ড" },
  { id: "technical", nameEn: "Technical Board (BTEB)", nameBn: "কারিগরি শিক্ষা বোর্ড (বিটিইবি)" },
  { id: "cambridge", nameEn: "Cambridge Assessment International Education (CAIE)", nameBn: "ক্যামব্রিজ (O/A Level)" },
  { id: "edexcel", nameEn: "Pearson Edexcel", nameBn: "পিয়ারসন এডেক্সেল (O/A Level)" },
] as const;

export const ACADEMIC_GROUPS = [
  { id: "science", nameEn: "Science", nameBn: "বিজ্ঞান" },
  { id: "business", nameEn: "Business Studies (Commerce)", nameBn: "ব্যবসায় শিক্ষা" },
  { id: "humanities", nameEn: "Humanities (Arts)", nameBn: "মানবিক" },
  { id: "engineering_tech", nameEn: "Diploma in Engineering", nameBn: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং" },
  { id: "general", nameEn: "General / Other", nameBn: "অন্যান্য" },
] as const;

export const STUDY_LEVELS = [
  { id: "bachelor", nameEn: "Bachelor's / Undergraduate", nameBn: "স্নাতক (অনার্স / ব্যাচেলর)" },
  { id: "master", nameEn: "Master's / Postgraduate", nameBn: "স্নাতকোত্তর (মাস্টার্স)" },
  { id: "phd", nameEn: "Doctorate / PhD", nameBn: "ডক্টরেট (পিএইচডি)" },
] as const;

export const INTAKE_SEASONS = [
  { id: "fall", nameEn: "Fall (September / October)", nameBn: "ফল ইনটেক (সেপ্টেম্বর / অক্টোবর)" },
  { id: "spring", nameEn: "Spring (January / February)", nameBn: "স্প্রিং ইনটেক (জানুয়ারি / ফেব্রুয়ারি)" },
  { id: "summer", nameEn: "Summer (May / June)", nameBn: "সামার ইনটেক (মে / জুন)" },
] as const;

export const ENGLISH_TEST_TYPES = [
  { id: "IELTS", nameEn: "IELTS Academic", nameBn: "আইইএলটিএস একাডেমিক", minScore: 4.0, maxScore: 9.0, step: 0.5 },
  { id: "TOEFL", nameEn: "TOEFL iBT", nameBn: "টোফেল আইবিটি", minScore: 0, maxScore: 120, step: 1 },
  { id: "PTE", nameEn: "PTE Academic", nameBn: "পিটিই একাডেমিক", minScore: 10, maxScore: 90, step: 1 },
  { id: "DUOLINGO", nameEn: "Duolingo English Test (DET)", nameBn: "ডুওলিঙ্গো টেস্ট", minScore: 10, maxScore: 160, step: 5 },
  { id: "MOI", nameEn: "Medium of Instruction (MOI)", nameBn: "মিডিয়াম অব ইন্সট্রাকশন সার্টিফিকেট", minScore: 0, maxScore: 0, step: 0 },
  { id: "NOT_TAKEN", nameEn: "Planning to take soon", nameBn: "পরীক্ষা এখনও দিইনি / প্রস্তুতি নিচ্ছি", minScore: 0, maxScore: 0, step: 0 },
] as const;
