import { CountryCodeType } from "@abroadmate/validation";
import { ApplicationWorkflowStage } from "./types";

export function generateCountryWorkflow(countryCode: CountryCodeType): ApplicationWorkflowStage[] {
  switch (countryCode) {
    case "GB":
      return [
        {
          stepOrder: 1,
          stageCode: "ADMISSION_CONFIRMATION",
          titleEn: "Unconditional Offer & Deposit",
          titleBn: "অফার লেটার ও প্রাথমিক ডিপোজিট পরিশোধ",
          descriptionBn:
            "বিশ্ববিদ্যালয়ের অফার লেটারের সকল শর্ত পূরণ করে টিউশন ফির প্রাথমিক ডিপোজিট পরিশোধ করুন।",
          estimatedDurationDays: 14,
        },
        {
          stepOrder: 2,
          stageCode: "CAS",
          titleEn: "Receive CAS (Confirmation of Acceptance for Studies)",
          titleBn: "ক্যাস (CAS) লেটার গ্রহণ",
          descriptionBn:
            "বিশ্ববিদ্যালয়ের প্রি-ক্যাস ইন্টারভিউ বা ফাইনান্সিয়াল ডকুমেন্টস যাচাই শেষে অফিসিয়াল ক্যাস স্টেটমেন্ট ও রেফারেন্স নম্বর সংগ্রহ করুন।",
          estimatedDurationDays: 7,
          localAuthorityOrCenter: "UK University Sponsor Portal",
        },
        {
          stepOrder: 3,
          stageCode: "FUNDS_HOLDING",
          titleEn: "28-Day Bank Funds Holding Maintenance",
          titleBn: "টানা ২৮ দিন ব্যাংক ব্যালেন্স ধরে রাখা (28-day rule)",
          descriptionBn:
            "টিউশনের বাকি টাকা ও ৯ মাসের লিভিং খরচের মোট অর্থ টানা ২৮ দিন কোনো উত্তোলন ছাড়া ব্যাংক অ্যাকাউন্টে বজায় রাখুন।",
          estimatedDurationDays: 28,
          localAuthorityOrCenter: "তফসিলি বাণিজ্যিক ব্যাংক (বাংলাদেশ)",
        },
        {
          stepOrder: 4,
          stageCode: "MEDICAL",
          titleEn: "IOM Tuberculosis (TB) Screening",
          titleBn: "আইওএম (IOM) টিবি মেডিকেল পরীক্ষা",
          descriptionBn:
            "ঢাকার গুলশান-২ অথবা সিলেটের আইওএম সেন্টারে অনলাইনে অ্যাপয়েন্টমেন্ট বুকিং দিয়ে বুকের এক্স-রে করিয়ে টিবি সার্টিফিকেট নিন।",
          estimatedDurationDays: 3,
          localAuthorityOrCenter: "IOM Migration Health Assessment Center, Dhaka/Sylhet",
          officialPortalUrl: "https://bangladesh.iom.int",
        },
        {
          stepOrder: 5,
          stageCode: "ONLINE_APPLICATION",
          titleEn: "UKVI Online Visa Application & IHS Payment",
          titleBn: "Gov.uk অনলাইন ভিসা আবেদন ও IHS হেলথ সারচার্জ ফি",
          descriptionBn:
            "অফিসিয়াল পোর্টালে ফর্ম পূরণ করুন, £৪৯০ ভিসা ফি এবং বার্ষিক £৭৭৬ IHS স্বাস্থ্য সারচার্জ অনলাইনে আন্তর্জাতিক কার্ডের মাধ্যমে পরিশোধ করুন।",
          estimatedDurationDays: 2,
          officialPortalUrl: "https://www.gov.uk/student-visa/apply",
        },
        {
          stepOrder: 6,
          stageCode: "BIOMETRICS",
          titleEn: "VFS Global Biometrics Appointment",
          titleBn: "ভিএফএস গ্লোবালে ফিঙ্গারপ্রিন্ট ও ছবি প্রদান",
          descriptionBn:
            "ঢাকার ডেল্টা লাইফ টাওয়ার (গুলশান-২) অথবা সিলেট ভিএফএস সেন্টারে নির্ধারিত দিনে মূল পাসপোর্ট ও ডকুমেন্টস সহ বায়োমেট্রিক প্রদান করুন।",
          estimatedDurationDays: 1,
          localAuthorityOrCenter: "VFS Global Dhaka / Sylhet",
        },
        {
          stepOrder: 7,
          stageCode: "DECISION",
          titleEn: "Visa Decision & Passport Collection",
          titleBn: "ভিসা সিদ্ধান্ত ও পাসপোর্ট সংগ্রহ",
          descriptionBn:
            "স্ট্যান্ডার্ড প্রক্রিয়ায় ৩-৪ সপ্তাহের মধ্যে ইমেইলে ডিসিশন লেটার পাঠানো হয় এবং পাসপোর্ট সংগ্রহ করা যায়।",
          estimatedDurationDays: 21,
        },
        {
          stepOrder: 8,
          stageCode: "ARRIVAL",
          titleEn: "Travel to UK & eVisa Activation",
          titleBn: "যুক্তরাজ্যে আগমন ও ডিজিটাল ই-ভিসা চালু",
          descriptionBn:
            "যুক্তরাজ্যে পৌঁছে বিশ্ববিদ্যালয়ের এনরোলমেন্ট সম্পন্ন করুন এবং UKVI একাউন্টের মাধ্যমে ডিজিটাল স্ট্যাটাস নিশ্চিত করুন।",
          estimatedDurationDays: 7,
        },
      ];

    case "DE":
      return [
        {
          stepOrder: 1,
          stageCode: "ADMISSION_CONFIRMATION",
          titleEn: "Receive University Admission (Zulassungsbescheid)",
          titleBn: "বিশ্ববিদ্যালয়ের চূড়ান্ত ভর্তি নিশ্চিতকরণ লেটার গ্রহণ",
          descriptionBn:
            "পাবলিক বা প্রাইভেট জার্মান বিশ্ববিদ্যালয় থেকে অফিশিয়াল জুলাসুংসবেশাইড সংগ্রহ করুন।",
          estimatedDurationDays: 30,
        },
        {
          stepOrder: 2,
          stageCode: "BLOCKED_ACCOUNT",
          titleEn: "Open & Fund Blocked Account (Sperrkonto)",
          titleBn: "ব্লকড একাউন্ট খোলা ও ১১,৯০৪ ইউরো ডিপোজিট",
          descriptionBn:
            "Expatrio, Coracle বা Fintiba-তে অনলাইন ব্লকড একাউন্ট খুলে সম্পূর্ণ ১১,৯০৪ ইউরো ব্যাংক ট্রান্সফারের মাধ্যমে জমা দিন এবং 06 Confirmation নিন।",
          estimatedDurationDays: 10,
          localAuthorityOrCenter: "Expatrio / Coracle / Fintiba Portal",
        },
        {
          stepOrder: 3,
          stageCode: "MEDICAL",
          titleEn: "Arrange German Statutory Health Insurance",
          titleBn: "জার্মান স্বাস্থ্য বীমা (TK / Barmer) প্রস্তুতকরণ",
          descriptionBn:
            "জার্মান পাবলিক হেলথ ইনস্যুরেন্স বা ইনকামিং ট্রাভেল হেলথ ইনস্যুরেন্স কনফার্মেশন সংগ্রহ করুন।",
          estimatedDurationDays: 3,
        },
        {
          stepOrder: 4,
          stageCode: "ONLINE_APPLICATION",
          titleEn: "German Embassy Dhaka Visa Waitlist Registration",
          titleBn: "জার্মান দূতাবাস ঢাকা অ্যাপয়েন্টমেন্ট ওয়েটলিস্টে নিবন্ধন",
          descriptionBn:
            "ঢাকার জার্মান দূতাবাসের অফিসিয়াল অ্যাপয়েন্টমেন্ট সিস্টেমে স্টুডেন্ট ক্যাটাগরিতে নাম নিবন্ধন করে অ্যাপয়েন্টমেন্ট তারিখের জন্য অপেক্ষা করুন।",
          estimatedDurationDays: 60,
          localAuthorityOrCenter: "German Embassy Dhaka Waitlist Portal",
          officialPortalUrl: "https://dhaka.diplo.de/bd-en/service/visa-einreise",
        },
        {
          stepOrder: 5,
          stageCode: "INTERVIEW",
          titleEn: "Consular Interview & Document Submission at German Embassy",
          titleBn: "জার্মান দূতাবাসে সরাসরি সাক্ষাৎকার ও ফাইল জমাদান",
          descriptionBn:
            "গুলশানে অবস্থিত জার্মান দূতাবাসে উপস্থিত হয়ে মোটিভেশন, পূর্ববর্তী পড়াশোনা ও জার্মান ভাষার সাধারণ ইন্টারভিউ দিন এবং €৭৫ ভিসা ফি প্রদান করুন।",
          estimatedDurationDays: 1,
          localAuthorityOrCenter: "Embassy of the Federal Republic of Germany, Madani Ave/Gulshan, Dhaka",
        },
        {
          stepOrder: 6,
          stageCode: "DECISION",
          titleEn: "National Visa Category D Approval & Stamping",
          titleBn: "জাতীয় ভিসা (ক্যাটাগরি ডি) অনুমোদন ও পাসপোর্ট স্ট্যাম্পিং",
          descriptionBn:
            "জার্মান স্থানীয় Ausländerbehörde এর ক্লিয়ারেন্স সাপেক্ষে ভিসা স্ট্যাম্প করে পাসপোর্ট ফেরত দেওয়া হয়।",
          estimatedDurationDays: 45,
        },
        {
          stepOrder: 7,
          stageCode: "ARRIVAL",
          titleEn: "Arrival in Germany & Residence Permit (Aufenthaltstitel)",
          titleBn: "জার্মানিতে পৌঁছানো, সিটি রেজিস্ট্রেশন ও রেসিডেন্স পারমিট",
          descriptionBn:
            "জার্মানিতে পৌঁছে Bürgeramt-এ সিটি রেজিস্ট্রেশন (Anmeldung) করুন এবং স্থানীয় ইমিগ্রেশন অফিসে স্টুডেন্ট রেসিডেন্স পারমিটের জন্য আবেদন করুন।",
          estimatedDurationDays: 30,
        },
      ];

    case "US":
      return [
        {
          stepOrder: 1,
          stageCode: "I20",
          titleEn: "Receive Form I-20 & SEVIS ID",
          titleBn: "ফর্ম আই-২০ (Form I-20) ও সেভিস আইডি প্রাপ্তি",
          descriptionBn:
            "বিশ্ববিদ্যালয়ে ফাইনান্সিয়াল অ্যাফিডেভিট পাঠিয়ে অফিসিয়াল Form I-20 সংগ্রহ করুন।",
          estimatedDurationDays: 14,
          localAuthorityOrCenter: "University Designated School Official (DSO)",
        },
        {
          stepOrder: 2,
          stageCode: "SEVIS",
          titleEn: "Pay SEVIS I-901 Fee ($350)",
          titleBn: "সেভিস ফি ($৩৫০) অনলাইন পরিশোধ",
          descriptionBn:
            "fmjfee.com-এ গিয়ে আপনার SEVIS আইডি দিয়ে $৩৫০ ফি পরিশোধ করে অফিশিয়াল পেমেন্ট রসিদ প্রিন্ট করুন।",
          estimatedDurationDays: 1,
          officialPortalUrl: "https://www.fmjfee.com",
        },
        {
          stepOrder: 3,
          stageCode: "ONLINE_APPLICATION",
          titleEn: "Complete DS-160 Nonimmigrant Visa Application",
          titleBn: "ডিএস-১৬০ (DS-160) অনলাইন ফর্ম পূরণ",
          descriptionBn:
            "ceac.state.gov-এ বিস্তারিত একাডেমিক, পারিবারিক ও ট্রাভেল হিস্ট্রি দিয়ে নির্ভুলভাবে DS-160 ফর্ম সাবমিট করে কনফার্মেশন বারকোড প্রিন্ট করুন।",
          estimatedDurationDays: 2,
          officialPortalUrl: "https://ceac.state.gov/genniv/",
        },
        {
          stepOrder: 4,
          stageCode: "VISA_FEE",
          titleEn: "Pay MRV Visa Fee ($185) & Schedule Embassy Appointment",
          titleBn: "ভিসা ফি ($১৮৫) পরিশোধ ও ইন্টারভিউ শিডিউল বুকিং",
          descriptionBn:
            "ইবিএল (EBL) ব্যাংকে ভিসা ফি জমা দিয়ে মার্কিন দূতাবাস ঢাকার অনলাইন পোর্টালে গিয়ে বায়োমেট্রিক ও কনস্যুলার ইন্টারভিউয়ের তারিখ বুক করুন।",
          estimatedDurationDays: 5,
          officialPortalUrl: "https://www.ustraveldocs.com/bd/",
        },
        {
          stepOrder: 5,
          stageCode: "BIOMETRICS",
          titleEn: "OFC Biometrics Appointment (Madani Avenue)",
          titleBn: "ওএফসি (OFC) ফিঙ্গারপ্রিন্ট ও ছবি গ্রহণ",
          descriptionBn:
            "ইন্টারভিউয়ের পূর্বে অথবা একই দিনে মাদানী এভিনিউর কনস্যুলার সেন্টারে দশ আঙুলের ছাপ ও ছবি প্রদান করুন।",
          estimatedDurationDays: 1,
          localAuthorityOrCenter: "U.S. Embassy Consular Section, Madani Avenue, Dhaka",
        },
        {
          stepOrder: 6,
          stageCode: "INTERVIEW",
          titleEn: "Mandatory In-Person Visa Interview with Consular Officer",
          titleBn: "মার্কিন কনস্যুলার অফিসারের সাথে সরাসরি ভিসা ইন্টারভিউ",
          descriptionBn:
            "কনস্যুলার অফিসারের সামনে আত্মবিশ্বাসের সাথে আপনার একাডেমিক উদ্দেশ্য, বিশ্ববিদ্যালয় পছন্দের কারণ, আয়ের উৎস এবং কোর্স শেষে দেশে ফিরে আসার সুনির্দিষ্ট পরিকল্পনা উপস্থাপন করুন।",
          estimatedDurationDays: 1,
          localAuthorityOrCenter: "Embassy of the United States of America, Dhaka",
        },
        {
          stepOrder: 7,
          stageCode: "DECISION",
          titleEn: "Visa Approval & Passport Collection (221g / 214b Context)",
          titleBn: "ভিসা অনুমোদন ও পাসপোর্ট সংগ্রহ",
          descriptionBn:
            "ইন্টারভিউতেই ভিসা অনুমোদন জানানো হয়। ৩-৫ কার্যদিবসের মধ্যে মনোনীত কুরিয়ার থেকে স্ট্যাম্পড পাসপোর্ট সংগ্রহ করা যায়।",
          estimatedDurationDays: 5,
        },
        {
          stepOrder: 8,
          stageCode: "ARRIVAL",
          titleEn: "Travel to USA & Port of Entry (CBP) Clearance",
          titleBn: "যুক্তরাষ্ট্রে যাত্রা ও পোর্ট অব এন্ট্রি ক্লিয়ারেন্স",
          descriptionBn:
            "কোর্স শুরুর ৩০ দিন পূর্বে যুক্তরাষ্ট্রে পৌঁছাতে পারবেন। পোর্ট অব এন্ট্রিতে CBP অফিসারকে পাসপোর্ট, ভিসা ও I-20 প্রদর্শন করতে হবে।",
          estimatedDurationDays: 1,
        },
      ];

    case "CA":
      return [
        {
          stepOrder: 1,
          stageCode: "STUDY_PERMIT_PAL",
          titleEn: "Receive Acceptance Letter (LOA) & Provincial Attestation Letter (PAL)",
          titleBn: "অফার লেটার (LOA) ও প্রভিন্সিয়াল লেটার (PAL) গ্রহণ",
          descriptionBn:
            "কানাডার DLI বিশ্ববিদ্যালয় থেকে অফার গ্রহণ করে প্রভিন্সিয়াল গভর্মেন্ট কর্তৃক বরাদ্দকৃত অফিশিয়াল PAL নিশ্চিত করুন।",
          estimatedDurationDays: 30,
        },
        {
          stepOrder: 2,
          stageCode: "FUNDS_HOLDING",
          titleEn: "Prepare 4-6 Months Bank Statements & GIC / Tuition Proof",
          titleBn: "৪-৬ মাসের ব্যাংক হিস্ট্রি ও প্রথম বর্ষের টিউশন ফি প্রমাণ",
          descriptionBn:
            "প্রথম বছরের টিউশন ফি পরিশোধের প্রমাণপত্র এবং ২০,৬৩৫ ক্যাড লিভিং খরচের বিপরীতে স্বাভাবিক ব্যাংক স্টেটমেন্ট ও ট্যাক্স ফাইল প্রস্তুত করুন।",
          estimatedDurationDays: 30,
        },
        {
          stepOrder: 3,
          stageCode: "MEDICAL",
          titleEn: "Upfront Medical Examination by Panel Physician",
          titleBn: "আইআরসিসি প্যানেল চিকিৎসকের মাধ্যমে মেডিকেল পরীক্ষা",
          descriptionBn:
            "ঢাকায় অবস্থিত অনুমোদিত প্যানেল ক্লিনিকে (যেমন IOM বা গ্রীন ক্রিসেন্ট) গিয়ে আপফ্রন্ট মেডিকেল পরীক্ষা সম্পন্ন করুন এবং eMedical শিট নিন।",
          estimatedDurationDays: 5,
          localAuthorityOrCenter: "IRCC Approved Panel Physicians, Dhaka",
        },
        {
          stepOrder: 4,
          stageCode: "ONLINE_APPLICATION",
          titleEn: "Submit IRCC Online Study Permit Application",
          titleBn: "আইআরসিসি (IRCC) অনলাইন পোর্টালে স্টাডি পারমিট আবেদন",
          descriptionBn:
            "কানাডা সরকারের পোর্টালে ফর্ম পূরণ করুন, SOP ও সমস্ত ডকুমেন্টস আপলোড করুন এবং CAD $১৫০ ভিসা ফি ও CAD $৮৫ বায়োমেট্রিক ফি জমা দিন।",
          estimatedDurationDays: 3,
          officialPortalUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
        },
        {
          stepOrder: 5,
          stageCode: "BIOMETRICS",
          titleEn: "Biometrics Instruction Letter (BIL) & VFS Dhaka Appointment",
          titleBn: "ভিএফএস ঢাকা/সিলেটে বায়োমেট্রিক প্রদান",
          descriptionBn:
            "BIL লেটার আসার পর ৩০ দিনের মধ্যে ঢাকার ডেল্টা লাইফ টাওয়ার ভিএফএসে ফিঙ্গারপ্রিন্ট ও ছবি জমা দিন।",
          estimatedDurationDays: 1,
          localAuthorityOrCenter: "VFS Global Canada VAC, Dhaka / Sylhet",
        },
        {
          stepOrder: 6,
          stageCode: "DECISION",
          titleEn: "Passport Submission Request (PPR) & Visa Stamping",
          titleBn: "পাসপোর্ট জমা রিকোয়েস্ট (PPR) ও ভিসা স্ট্যাম্পিং",
          descriptionBn:
            "আবেদন মঞ্জুর হলে পিপিআর নোটিশ পাওয়া যায়। এরপর ভিএফএসের মাধ্যমে পাসপোর্ট জমা দিয়ে ভিসা স্টিকার ও পোর্ট অব এন্ট্রি লেটার সংগ্রহ করুন।",
          estimatedDurationDays: 60,
        },
        {
          stepOrder: 7,
          stageCode: "ARRIVAL",
          titleEn: "Arrival in Canada & Study Permit Issuance at Airport",
          titleBn: "কানাডা আগমন ও বিমানবন্দরে স্টাডি পারমিট সংগ্রহ",
          descriptionBn:
            "কানাডার আন্তর্জাতিক বিমানবন্দরে CBSA অফিসার আপনার LOA, পোর্ট অব এন্ট্রি লেটার যাচাই করে মূল কাগজের স্টাডি পারমিট ইস্যু করবেন।",
          estimatedDurationDays: 1,
        },
      ];

    case "AU":
      return [
        {
          stepOrder: 1,
          stageCode: "COE",
          titleEn: "Meet GTE/GST & Receive Confirmation of Enrolment (CoE)",
          titleBn: "জেনুইন স্টুডেন্ট টেস্ট (GST) মূল্যায়ন ও CoE সংগ্রহ",
          descriptionBn:
            "বিশ্ববিদ্যালয়ের অফার গ্রহণ করে প্রথম সেমিস্টারের ফি পরিশোধ করুন এবং বিশ্ববিদ্যালয়ের পিআরআইএসএমএস (PRISMS) সিস্টেম থেকে CoE লেটার সংগ্রহ করুন।",
          estimatedDurationDays: 14,
        },
        {
          stepOrder: 2,
          stageCode: "FUNDS_HOLDING",
          titleEn: "3-Month Bank Funds Seasoning & OSHC Health Cover",
          titleBn: "৩ মাসের পুরানো ব্যাংক ফান্ড ও ওএসএইচসি (OSHC) হেলথ ইন্স্যুরেন্স",
          descriptionBn:
            "অস্ট্রেলিয়ার জন্য প্রয়োজনীয় ২৯,৭১০ এইউডি লিভিং কস্ট + টিউশন ফি ৩ মাস ধরে ব্যাংকে রাখুন এবং পুরো স্টাডি মেয়াদের OSHC পলিসি কিনুন।",
          estimatedDurationDays: 90,
        },
        {
          stepOrder: 3,
          stageCode: "ONLINE_APPLICATION",
          titleEn: "Lodge Subclass 500 Visa on ImmiAccount Portal",
          titleBn: "ইমিঅ্যাকাউন্ট (ImmiAccount) পোর্টালে অনলাইন ভিসা আবেদন",
          descriptionBn:
            "হোম অ্যাফেয়ার্স পোর্টালে আবেদন ফর্ম পূরণ করুন, জিএসটি স্টেটমেন্ট আপলোড করুন এবং AUD $১,৬০০ ভিসা ফি পরিশোধ করুন।",
          estimatedDurationDays: 2,
          officialPortalUrl: "https://online.immi.gov.au/lusc/login",
        },
        {
          stepOrder: 4,
          stageCode: "BIOMETRICS",
          titleEn: "Biometrics Collection at VFS Global Dhaka/Sylhet",
          titleBn: "ভিএফএস সেন্টারে বায়োমেট্রিক প্রদান",
          descriptionBn:
            "ইমিগ্রেশন রিকোয়ারমেন্ট লেটার পাওয়ার ১৪ দিনের মধ্যে ভিএফএসে গিয়ে বায়োমেট্রিক সম্পন্ন করুন।",
          estimatedDurationDays: 1,
          localAuthorityOrCenter: "VFS Global Australia, Dhaka / Sylhet",
        },
        {
          stepOrder: 5,
          stageCode: "MEDICAL",
          titleEn: "HAP ID Medical Exam at IOM Migration Health Center",
          titleBn: "HAP আইডি সহ আইওএম ঢাকা/সিলেটে মেডিকেল টেস্ট",
          descriptionBn:
            "ই-মেডিকেল রেফারাল লেটার প্রিন্ট করে ঢাকার আইওএমে রক্ত, প্রস্রাব ও বুকের এক্স-রে পরীক্ষা দিন।",
          estimatedDurationDays: 3,
          localAuthorityOrCenter: "IOM Migration Health Assessment Center, Dhaka",
        },
        {
          stepOrder: 6,
          stageCode: "DECISION",
          titleEn: "Student Visa (Subclass 500) Electronic Grant Notice",
          titleBn: "ভিসা গ্রান্ট নোটিশ (ইলেকট্রনিক ভিসা) প্রাপ্তি",
          descriptionBn:
            "অস্ট্রেলিয়ার ভিসা সম্পূর্ণ ডিজিটাল। কোনো পাসপোর্ট স্টিকারের প্রয়োজন হয় না; ইমেইলে ভিসা গ্রান্ট নোটিশ পাঠানো হয়।",
          estimatedDurationDays: 30,
        },
        {
          stepOrder: 7,
          stageCode: "ARRIVAL",
          titleEn: "Fly to Australia & Commence Orientation",
          titleBn: "অস্ট্রেলিয়ায় আগমন ও ওরিয়েন্টেশনে অংশগ্রহণ",
          descriptionBn:
            "ভিসা শর্তাবলী (যেমন প্রতি পক্ষকালে সর্বোচ্চ ৪৮ ঘণ্টা কাজের নিয়ম এবং সন্তোষজনক উপস্থিতি) মেনে বিশ্ববিদ্যালয়ে ক্লাসে যোগ দিন।",
          estimatedDurationDays: 7,
        },
      ];
    default:
      return [];
  }
}
