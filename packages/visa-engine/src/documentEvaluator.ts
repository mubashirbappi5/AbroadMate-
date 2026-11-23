import { CountryCodeType, EvaluateVisaAssessmentInput } from "@abroadmate/validation";
import { DocumentChecklistItem } from "./types";

export function evaluateDocumentChecklist(
  countryCode: CountryCodeType,
  input: EvaluateVisaAssessmentInput
): DocumentChecklistItem[] {
  const checklist: DocumentChecklistItem[] = [];

  // 1. Passport
  checklist.push({
    documentType: "PASSPORT",
    titleEn: "Valid International Passport",
    titleBn: "বৈধ মূল আন্তর্জাতিক পাসপোর্ট",
    isMandatory: true,
    isProvided: input.hasValidPassport,
    status: input.hasValidPassport ? "MET" : "MISSING",
    issuingAuthorityBn: "ইমিগ্রেশন ও পাসপোর্ট অধিদপ্তর, বাংলাদেশ",
    instructionsBn:
      "ভিসা আবেদনের সময় পাসপোর্টের মেয়াদ কমপক্ষে ৬ মাস বা তার বেশি অবশিষ্ট থাকতে হবে এবং অন্তত ২টি ফাঁকা পৃষ্ঠা থাকতে হবে।",
    officialSourceUrl: "https://epassport.gov.bd",
  });

  // 2. Admission Confirmation
  let admissionTitleEn = "Official Admission Confirmation Letter";
  let admissionTitleBn = "অফিসিয়াল ভর্তি নিশ্চিতকরণ পত্র";
  let admissionAuthority = "স্বীকৃত বিশ্ববিদ্যালয়";
  let admissionSource = "";

  if (countryCode === "GB") {
    admissionTitleEn = "CAS (Confirmation of Acceptance for Studies)";
    admissionTitleBn = "ক্যাস (CAS) লেটার ও রেফারেন্স নম্বর";
    admissionAuthority = "যুক্তরাজ্যের স্পনসর বিশ্ববিদ্যালয় (UKVI Licensed Sponsor)";
    admissionSource = "https://www.gov.uk/student-visa";
  } else if (countryCode === "US") {
    admissionTitleEn = "Form I-20 (Certificate of Eligibility for Nonimmigrant Student Status)";
    admissionTitleBn = "ফর্ম আই-২০ (Form I-20)";
    admissionAuthority = "যুক্তরাষ্ট্রের SEVP-স্বীকৃত বিশ্ববিদ্যালয় ও DSO";
    admissionSource = "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html";
  } else if (countryCode === "AU") {
    admissionTitleEn = "CoE (Confirmation of Enrolment)";
    admissionTitleBn = "কনফার্মেশন অব এনরোলমেন্ট (CoE)";
    admissionAuthority = "অস্ট্রেলিয়ান বিশ্ববিদ্যালয় (PRISMS সিস্টেমে নিবন্ধিত)";
    admissionSource = "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500";
  } else if (countryCode === "CA") {
    admissionTitleEn = "Letter of Acceptance (LOA) & Provincial Attestation Letter (PAL)";
    admissionTitleBn = "অফিসিয়াল অফার লেটার (LOA) এবং প্রভিন্সিয়াল লেটার (PAL/TAL)";
    admissionAuthority = "কানাডার DLI (Designated Learning Institution) ও সংশ্লিষ্ট প্রভিন্স";
    admissionSource = "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html";
  } else if (countryCode === "DE") {
    admissionTitleEn = "Zulassungsbescheid (University Admission Letter)";
    admissionTitleBn = "জুলাসুংসবেশাইড (বিশ্ববিদ্যালয় চূড়ান্ত অফার লেটার)";
    admissionAuthority = "জার্মান বিশ্ববিদ্যালয় বা uni-assist";
    admissionSource = "https://dhaka.diplo.de/bd-en/service/visa-einreise";
  }

  checklist.push({
    documentType: "ADMISSION_CONFIRMATION",
    titleEn: admissionTitleEn,
    titleBn: admissionTitleBn,
    isMandatory: true,
    isProvided: input.hasOfficialAdmissionConfirmation,
    status: input.hasOfficialAdmissionConfirmation ? "MET" : "MISSING",
    issuingAuthorityBn: admissionAuthority,
    instructionsBn:
      "অফার লেটারে শিক্ষার্থীর নাম, জন্মতারিখ, কোর্স শুরুর তারিখ, কোর্সের মেয়াদ এবং টিউশন ফির স্পষ্ট উল্লেখ থাকতে হবে।",
    officialSourceUrl: admissionSource,
  });

  // 3. Academic Documents
  checklist.push({
    documentType: "ACADEMIC",
    titleEn: "Academic Certificates, Transcripts & Testimonials",
    titleBn: "সকল শিক্ষাগত যোগ্যতার মূল সনদ ও ট্রান্সক্রিপ্ট",
    isMandatory: true,
    isProvided: input.hasAcademicCertificates,
    status: input.hasAcademicCertificates ? "MET" : "MISSING",
    attestationRuleBn:
      "মাধ্যমিক ও উচ্চ মাধ্যমিক সনদ শিক্ষা বোর্ড এবং শিক্ষা মন্ত্রণালয় ও পররাষ্ট্র মন্ত্রণালয় (সেগুনবাগিচা) কর্তৃক সত্যায়িত হতে হবে।",
    issuingAuthorityBn: "সংশ্লিষ্ট শিক্ষা বোর্ড এবং বিশ্ববিদ্যালয়",
    instructionsBn:
      "এসএসসি, এইচএসসি এবং ব্যাচেলর ডিগ্রির মূল সার্টিফিকেট ও মার্কশিট সঙ্গে রাখতে হবে।",
  });

  // 4. Language Test
  checklist.push({
    documentType: "LANGUAGE_TEST",
    titleEn: "English/German Language Test Certificate",
    titleBn: "ভাষা দক্ষতার সনদ (IELTS / PTE / TOEFL / Goethe)",
    isMandatory: countryCode !== "DE",
    isProvided: input.hasLanguageProficiencyProof,
    status: input.hasLanguageProficiencyProof
      ? "MET"
      : countryCode === "DE"
      ? "CONDITIONAL"
      : "MISSING",
    issuingAuthorityBn: "British Council, IDP, Pearson, ETS, অথবা Goethe-Institut",
    instructionsBn:
      "সার্টিফিকেটের মেয়াদ ভিসা আবেদনের তারিখে ২ বছরের মধ্যে থাকতে হবে। জার্মানিতে ইংরেজি মাধ্যমের কোর্সের ক্ষেত্রে IELTS এবং জার্মান মাধ্যমের কোর্সের ক্ষেত্রে TestDaF/Goethe B2 প্রয়োজন।",
  });

  // 5. Financial Documents (Bank Statement & Solvency)
  checklist.push({
    documentType: "FINANCIAL",
    titleEn:
      countryCode === "DE"
        ? "Blocked Account Balance Confirmation (Sperrkonto)"
        : "Bank Statement & Bank Solvency Certificate",
    titleBn:
      countryCode === "DE"
        ? "ব্লকড একাউন্ট ব্যালেন্স কনফার্মেশন (Expatrio / Coracle)"
        : "ব্যাংক অ্যাকাউন্ট স্টেটমেন্ট ও ব্যাংক সলভেন্সি সার্টিফিকেট",
    isMandatory: true,
    isProvided: input.hasBankSolvencyCertificate,
    status: input.hasBankSolvencyCertificate ? "MET" : "MISSING",
    issuingAuthorityBn:
      countryCode === "DE"
        ? "জার্মান সরকার কর্তৃক অনুমোদিত ব্যাংক (Expatrio, Fintiba, Coracle)"
        : "বাংলাদেশ ব্যাংক অনুমোদিত যেকোনো তফসিলি বাণিজ্যিক ব্যাংক",
    instructionsBn:
      countryCode === "DE"
        ? "পুরো ১১,৯০৪ ইউরো ব্লকড একাউন্টে ট্রান্সফার করে অফিসিয়াল ০৬ ব্যালেন্স কনফার্মেশন প্রিন্ট করতে হবে।"
        : "ব্যাংকের সিল, দায়িত্বশীল অফিসারের নাম, পদবী ও যোগাযোগের নম্বর সহ সলভেন্সি সার্টিফিকেট ও স্টেটমেন্ট নিতে হবে।",
  });

  // 6. Sponsor Documents
  checklist.push({
    documentType: "SPONSOR",
    titleEn: "Sponsor Affidavit, TIN & Source of Income",
    titleBn: "স্পনসরের হলফনামা, আয়কর রিটার্ন (TIN) ও আয়ের প্রামাণ্য দলিল",
    isMandatory: true,
    isProvided: input.hasSponsorTaxReturns,
    status: input.hasSponsorTaxReturns ? "MET" : "MISSING",
    attestationRuleBn:
      "স্পনসরশিপ হলফনামা নোটারি পাবলিক অথবা ১ম শ্রেণির ম্যাজিস্ট্রেট কর্তৃক সত্যায়িত হতে হবে।",
    issuingAuthorityBn: "জাতীয় রাজস্ব বোর্ড (NBR), সিটি কর্পোরেশন / ইউনিয়ন পরিষদ, সাব-রেজিস্ট্রার অফিস",
    instructionsBn:
      "স্পনসরের সাথে সম্পর্কের প্রমাণ (জন্ম সনদ), গত ২-৩ বছরের ট্যাক্স রিটার্ন সার্টিফিকেট, ট্রেড লাইসেন্স বা স্যালারি সার্টিফিকেট সংযুক্ত করতে হবে।",
  });

  // 7. Medical Examination & TB Clearance
  const isTbMandatory = countryCode === "GB" || countryCode === "AU" || countryCode === "CA";
  checklist.push({
    documentType: "MEDICAL",
    titleEn:
      countryCode === "GB"
        ? "IOM Tuberculosis (TB) Screening Certificate"
        : "Medical Examination Report",
    titleBn:
      countryCode === "GB"
        ? "আইওএম (IOM) যক্ষ্মা বা টিবি মুক্ত সনদপত্র"
        : "অফিসিয়াল মেডিকেল পরীক্ষার রিপোর্ট",
    isMandatory: isTbMandatory,
    isProvided: input.hasMedicalTbClearance,
    status: input.hasMedicalTbClearance
      ? "MET"
      : isTbMandatory
      ? "MISSING"
      : "CONDITIONAL",
    issuingAuthorityBn:
      "IOM Migration Health Assessment Center (ডেল্টা লাইফ টাওয়ার, গুলশান-২, ঢাকা অথবা সিলেট)",
    instructionsBn:
      "যুক্তরাজ্য ও অস্ট্রেলিয়ার ক্ষেত্রে আইওএম ঢাকা/সিলেট থেকে এক্স-রে ও শারীরিক পরীক্ষার মাধ্যমে যক্ষ্মামুক্ত সার্টিফিকেট সংগ্রহ বাধ্যতামূলক।",
    officialSourceUrl: "https://bangladesh.iom.int",
  });

  // 8. Health Insurance
  let insuranceTitleEn = "International Student Health Insurance";
  let insuranceTitleBn = "আন্তর্জাতিক স্বাস্থ্য বীমা কভারেজ";
  let insuranceMandatory = true;

  if (countryCode === "GB") {
    insuranceTitleEn = "Immigration Health Surcharge (IHS) Payment Confirmation";
    insuranceTitleBn = "ইউকে ইমিগ্রেশন হেলথ সারচার্জ (IHS) পেমেন্ট রসিদ";
  } else if (countryCode === "AU") {
    insuranceTitleEn = "Overseas Student Health Cover (OSHC)";
    insuranceTitleBn = "ওভারসিজ স্টুডেন্ট হেলথ কভার (OSHC) পলিসি";
  } else if (countryCode === "DE") {
    insuranceTitleEn = "Statutory Health Insurance (TK / Barmer / Incoming)";
    insuranceTitleBn = "জার্মান সরকারি স্বাস্থ্য বীমা বা ইনকামিং ইনস্যুরেন্স সনদ";
  }

  checklist.push({
    documentType: "HEALTH_INSURANCE",
    titleEn: insuranceTitleEn,
    titleBn: insuranceTitleBn,
    isMandatory: insuranceMandatory,
    isProvided: input.hasHealthInsurance,
    status: input.hasHealthInsurance ? "MET" : "MISSING",
    issuingAuthorityBn: "সংশ্লিষ্ট দেশের স্বাস্থ্য বীমা কর্তৃপক্ষ",
    instructionsBn:
      "ভিসা আবেদন প্রক্রিয়ার মধ্যেই বীমা প্রিমিয়াম বা সারচার্জ পরিশোধ করতে হয়।",
  });

  // 9. Police Clearance Certificate
  const isPoliceMandatory = countryCode === "CA" || countryCode === "AU";
  checklist.push({
    documentType: "POLICE_CLEARANCE",
    titleEn: "Police Clearance Certificate (PCC)",
    titleBn: "বাংলাদেশ পুলিশ ক্লিয়ারেন্স সার্টিফিকেট",
    isMandatory: isPoliceMandatory,
    isProvided: input.hasPoliceClearance,
    status: input.hasPoliceClearance
      ? "MET"
      : isPoliceMandatory
      ? "MISSING"
      : "CONDITIONAL",
    issuingAuthorityBn: "বাংলাদেশ পুলিশ (Online Police Clearance Portal)",
    instructionsBn:
      "কানাডা এবং অস্ট্রেলিয়ার ক্ষেত্রে ১৮ বছর ঊর্ধ্ব আবেদনকারীদের জন্য পুলিশ ক্লিয়ারেন্স সনদ বাধ্যতামূলক। এটি পররাষ্ট্র মন্ত্রণালয় কর্তৃক সত্যায়িত হওয়া আবশ্যক।",
    officialSourceUrl: "https://pcc.police.gov.bd",
  });

  return checklist;
}
