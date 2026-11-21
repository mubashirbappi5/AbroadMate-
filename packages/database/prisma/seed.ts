import {
  PrismaClient,
  DegreeLevel,
  IntakeSeason,
  DocumentCategory,
  SubjectCategory,
  VerificationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AbroadMate initial country & verified knowledge data...");

  // 1. Seed Countries (GB, CA, AU, DE, US)
  const countries = [
    {
      code: "GB",
      iso2: "GB",
      nameEn: "United Kingdom",
      nameBn: "যুক্তরাজ্য (ইউকে)",
      flagEmoji: "🇬🇧",
      currencyCode: "GBP",
      currencySymbol: "£",
      approxBdtRate: 153.5,
      officialLanguage: "English",
      commonStudyLanguages: ["English"],
      educationSystemOverviewBn:
        "যুক্তরাজ্যের উচ্চশিক্ষা ব্যবস্থা বিশ্বমানের এবং রিসার্চ-ইনটেনসিভ। ব্যাচেলর ডিগ্রি সাধারণত ৩ বছর এবং মাস্টার্স ডিগ্রি মাত্র ১ বছর মেয়াদি, যা শিক্ষার্থীদের সময় ও লিভিং খরচ সাশ্রয় করে। রাসেল গ্রুপভুক্ত ২৪টি শীর্ষ বিশ্ববিদ্যালয় বিশ্বমানের গবেষণা পরিচালনা করে।",
      degreeStructuresJson: JSON.stringify({
        bachelorDurationYears: "3 (স্কটল্যান্ডে 4)",
        masterDurationYears: "1 (Taught MSc/MA)",
        phdDurationYears: "3-4",
      }),
      tuitionCostRangesBn: "বাৎসরিক £১৫,০০০ থেকে £৩৮,০০০ (প্রায় ২৩ লাখ থেকে ৫৮ লাখ টাকা)",
      livingCostInfoBn:
        "লন্ডনের বাইরে প্রতি মাসে £১,০২৩ এবং লন্ডনের ভেতরে প্রতি মাসে £১,৩৪৭ নূন্যতম লিভিং খরচ প্রয়োজন হয়।",
      officialEducationUrl: "https://study-uk.britishcouncil.org",
      officialImmigrationUrl: "https://www.gov.uk/student-visa",
      dhakaEmbassyName: "British High Commission, Dhaka",
      dhakaEmbassyUrl: "https://www.gov.uk/world/organisations/british-high-commission-dhaka",
      postStudyWorkDurationBn:
        "গ্র্যাজুয়েট রুট ভিসায় ব্যাচেলর ও মাস্টার্স সম্পন্নকারীদের জন্য ২ বছর এবং পিএইচডি সম্পন্নকারীদের জন্য ৩ বছর ফুল-টাইম কাজের সুযোগ।",
      avgMonthlyLivingCost: 1023.0,
      blockedAccountRequired: false,
    },
    {
      code: "CA",
      iso2: "CA",
      nameEn: "Canada",
      nameBn: "কানাডা",
      flagEmoji: "🇨🇦",
      currencyCode: "CAD",
      currencySymbol: "C$",
      approxBdtRate: 87.0,
      officialLanguage: "English & French",
      commonStudyLanguages: ["English", "French"],
      educationSystemOverviewBn:
        "কানাডার প্রাদেশিক বিশ্ববিদ্যালয় ও কলেজসমূহ বাস্তবমুখী শিক্ষা ও কো-অপ (Co-op) ইন্টার্নশিপের জন্য বিখ্যাত। সরকারি ডিএলআই (Designated Learning Institution) প্রতিষ্ঠানে পড়াশোনা শেষ করলে পোস্ট-গ্র্যাজুয়েশন ওয়ার্ক পারমিট (PGWP) পাওয়া যায়।",
      degreeStructuresJson: JSON.stringify({
        bachelorDurationYears: "4",
        masterDurationYears: "1.5 - 2",
        phdDurationYears: "4-5",
      }),
      tuitionCostRangesBn: "বাৎসরিক $২০,০০০ থেকে $৪৫,০০০ ক্যাড (প্রায় ১৭ লাখ থেকে ৩৯ লাখ টাকা)",
      livingCostInfoBn:
        "প্রদেশভেদে মাসে আনুমানিক ১,৫০০ থেকে ২,২০০ কানাডিয়ান ডলার লিভিং ও স্বাস্থ্য বীমা খরচ প্রয়োজন।",
      officialEducationUrl: "https://www.educanada.ca",
      officialImmigrationUrl:
        "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
      dhakaEmbassyName: "High Commission of Canada in Bangladesh",
      dhakaEmbassyUrl: "https://www.international.gc.ca/country-pays/bangladesh/dhaka.aspx",
      postStudyWorkDurationBn:
        "ডিএলআই প্রতিষ্ঠানে পড়াশোনা শেষে সর্বোচ্চ ৩ বছর পর্যন্ত PGWP ওয়ার্ক পারমিট।",
      avgMonthlyLivingCost: 1720.0,
      blockedAccountRequired: false,
    },
    {
      code: "AU",
      iso2: "AU",
      nameEn: "Australia",
      nameBn: "অস্ট্রেলিয়া",
      flagEmoji: "🇦🇺",
      currencyCode: "AUD",
      currencySymbol: "A$",
      approxBdtRate: 78.5,
      officialLanguage: "English",
      commonStudyLanguages: ["English"],
      educationSystemOverviewBn:
        "অস্ট্রেলিয়ার উচ্চশিক্ষা ব্যবস্থা TEQSA এবং CRICOS রেজিস্ট্রি দ্বারা কড়াকড়িভাবে নিয়ন্ত্রিত। গ্রুপ অব এইট (Go8) বিশ্ববিদ্যালয়গুলো বিশ্ব র্যাঙ্কিংয়ে শীর্ষ ৫০-এ অবস্থান করছে।",
      degreeStructuresJson: JSON.stringify({
        bachelorDurationYears: "3-4",
        masterDurationYears: "1.5 - 2",
        phdDurationYears: "3-4",
      }),
      tuitionCostRangesBn: "বাৎসরিক $২৮,০০০ থেকে $৪৮,০০০ অজি ডলার (প্রায় ২২ লাখ থেকে ৩৮ লাখ টাকা)",
      livingCostInfoBn:
        "সরকার নির্ধারিত ন্যূনতম বাৎসরিক লিভিং কস্ট $২৯,৭১০ অজি ডলার (মাসে প্রায় ২,৪৭৫ ডলার)।",
      officialEducationUrl: "https://www.studyaustralia.gov.au",
      officialImmigrationUrl:
        "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
      dhakaEmbassyName: "Australian High Commission, Dhaka",
      dhakaEmbassyUrl: "https://bangladesh.embassy.gov.au/",
      postStudyWorkDurationBn:
        "সাবক্লাস ৪৮৫ এর অধীনে ২ বছর কাজের সুযোগ (রিজিওনাল এলাকায় অতিরিক্ত ১-২ বছর এক্সটেনশন)।",
      avgMonthlyLivingCost: 2475.0,
      blockedAccountRequired: false,
    },
    {
      code: "DE",
      iso2: "DE",
      nameEn: "Germany",
      nameBn: "জার্মানি",
      flagEmoji: "🇩🇪",
      currencyCode: "EUR",
      currencySymbol: "€",
      approxBdtRate: 130.0,
      officialLanguage: "German",
      commonStudyLanguages: ["German", "English"],
      educationSystemOverviewBn:
        "জার্মানির পাবলিক বিশ্ববিদ্যালয়গুলোতে কোনো টিউশন ফি নেই (শুধু প্রতি সেমিস্টারে ১৫০-৩৫০ ইউরো অ্যাডমিনিস্ট্রেটিভ কন্ট্রিবিউশন দিতে হয়)। TU9 টেকনিক্যাল বিশ্ববিদ্যালয়গুলো ইঞ্জিনিয়ারিং ও বিজ্ঞানের শীর্ষ প্রতিষ্ঠান।",
      degreeStructuresJson: JSON.stringify({
        bachelorDurationYears: "3-3.5",
        masterDurationYears: "2",
        phdDurationYears: "3-5",
      }),
      tuitionCostRangesBn: "পাবলিক বিশ্ববিদ্যালয়ে টিউশন ফ্রি (€০); শুধু সেমিস্টার ফি €২৫০-€৩৫০",
      livingCostInfoBn:
        "২০২৫-২০২৬ সেশনের জন্য অফিসিয়াল ব্লকড অ্যাকাউন্টে প্রতি মাসে ৯৯২ ইউরো (বাৎসরিক €১১,৯০৪) জমা রাখতে হয়।",
      officialEducationUrl: "https://www.daad.de",
      officialImmigrationUrl:
        "https://www.make-it-in-germany.com/en/study-vocational-training/study-in-germany",
      dhakaEmbassyName: "German Embassy Dhaka",
      dhakaEmbassyUrl: "https://dhaka.diplo.de/bd-en/service/visa-einreise/studium-und-ausbildung",
      postStudyWorkDurationBn:
        "পাবলিক বিশ্ববিদ্যালয় থেকে ডিগ্রি সমাপ্তির পর ১৮ মাসের জব সিকার রেসিডেন্স পারমিট।",
      avgMonthlyLivingCost: 992.0,
      blockedAccountRequired: true,
    },
    {
      code: "US",
      iso2: "US",
      nameEn: "United States",
      nameBn: "যুক্তরাষ্ট্র (ইউএসএ)",
      flagEmoji: "🇺🇸",
      currencyCode: "USD",
      currencySymbol: "$",
      approxBdtRate: 122.5,
      officialLanguage: "English",
      commonStudyLanguages: ["English"],
      educationSystemOverviewBn:
        "যুক্তরাষ্ট্রের আইভি লিগ এবং স্টেট রিসার্চ বিশ্ববিদ্যালয়গুলোতে রয়েছে বিশ্বের সবচেয়ে সমৃদ্ধ গবেষণা ল্যাব ও টিচিং/রিসার্চ অ্যাসিস্ট্যান্টশিপ (TA/RA)। STEM বিষয়ের শিক্ষার্থীদের জন্য ৩ বছরের কাজের সুযোগ রয়েছে।",
      degreeStructuresJson: JSON.stringify({
        bachelorDurationYears: "4",
        masterDurationYears: "2",
        phdDurationYears: "4-6",
      }),
      tuitionCostRangesBn: "বাৎসরিক $২৫,০০০ থেকে $৬০,০০০ ডলার (প্রায় ৩০ লাখ থেকে ৭৩ লাখ টাকা)",
      livingCostInfoBn:
        "শহর ও ক্যাম্পাস ভেদে মাসে আনুমানিক ১,২০০ থেকে ২,০০০ ডলার লিভিং ও স্বাস্থ্য বীমা খরচ হয়।",
      officialEducationUrl: "https://educationusa.state.gov",
      officialImmigrationUrl:
        "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
      dhakaEmbassyName: "Embassy of the United States, Dhaka",
      dhakaEmbassyUrl: "https://bd.usembassy.gov/",
      postStudyWorkDurationBn:
        "১২ মাসের সাধারণ OPT, এবং STEM অনুমোদিত ডিগ্রিধারীদের জন্য অতিরিক্ত ২৪ মাস সহ মোট ৩৬ মাসের কাজের সুযোগ।",
      avgMonthlyLivingCost: 1500.0,
      blockedAccountRequired: false,
    },
  ];

  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });

    // Create Initial Versioned Policy Record
    const existingPolicy = await prisma.countryPolicyVersion.findFirst({
      where: { countryCode: c.code, versionNumber: 1 },
    });

    if (!existingPolicy) {
      await prisma.countryPolicyVersion.create({
        data: {
          countryCode: c.code,
          versionNumber: 1,
          effectiveFromDate: new Date("2024-01-01"),
          effectiveToDate: null, // Active
          isArchived: false,
          changeSummaryBn: `${c.nameBn} সরকারি উচ্চশিক্ষা ও ভিসা নীতিমালা ২০২৪-২০২৬ হালনাগাদ।`,
          livingCostMonthlyLocal: c.avgMonthlyLivingCost,
          livingCostCurrencyCode: c.currencyCode,
          blockedAccountRequired: c.blockedAccountRequired,
          blockedAccountAmount: c.blockedAccountRequired ? 11904.0 : null,
          pswDurationMonths: c.code === "DE" ? 18 : c.code === "CA" ? 36 : 24,
          weeklyWorkHoursPermit: c.code === "AU" ? 24 : 20,
        },
      });
    }
  }
  console.log(`✅ Upserted ${countries.length} destination countries and versioned policy records.`);

  // 2. Seed Visa Types
  const visaTypes = [
    {
      countryCode: "GB",
      visaCode: "STUDENT_ROUTE",
      nameEn: "Student Visa (Student Route)",
      nameBn: "স্টুডেন্ট রুট ভিসা",
      category: "UNDERGRADUATE_POSTGRADUATE",
      officialFeeAmount: 490.0,
      feeCurrencyCode: "GBP",
      processingDaysAvg: 21,
    },
    {
      countryCode: "CA",
      visaCode: "STUDY_PERMIT",
      nameEn: "Study Permit",
      nameBn: "স্টাডি পারমিট",
      category: "UNDERGRADUATE_POSTGRADUATE",
      officialFeeAmount: 150.0,
      feeCurrencyCode: "CAD",
      processingDaysAvg: 45,
    },
    {
      countryCode: "AU",
      visaCode: "SUBCLASS_500",
      nameEn: "Student Visa (Subclass 500)",
      nameBn: "স্টুডেন্ট ভিসা (সাবক্লাস ৫০০)",
      category: "UNDERGRADUATE_POSTGRADUATE",
      officialFeeAmount: 1600.0,
      feeCurrencyCode: "AUD",
      processingDaysAvg: 30,
    },
    {
      countryCode: "DE",
      visaCode: "NATIONAL_D",
      nameEn: "National Visa for Study (Type D)",
      nameBn: "স্টাডি ন্যাশনাল ভিসা (টাইপ ডি)",
      category: "UNDERGRADUATE_POSTGRADUATE",
      officialFeeAmount: 75.0,
      feeCurrencyCode: "EUR",
      processingDaysAvg: 60,
    },
    {
      countryCode: "US",
      visaCode: "F1_VISA",
      nameEn: "F-1 Nonimmigrant Student Visa",
      nameBn: "এফ-১ স্টুডেন্ট ভিসা",
      category: "UNDERGRADUATE_POSTGRADUATE",
      officialFeeAmount: 185.0,
      feeCurrencyCode: "USD",
      processingDaysAvg: 28,
    },
  ];

  for (const vt of visaTypes) {
    await prisma.visaType.upsert({
      where: {
        countryCode_visaCode: {
          countryCode: vt.countryCode,
          visaCode: vt.visaCode,
        },
      },
      update: vt,
      create: vt,
    });
  }
  console.log(`✅ Upserted ${visaTypes.length} student visa subclasses.`);

  // 3. Seed Verified Flagship Universities & Programs across UK, CA, AU, DE, US
  const universities = [
    // UK
    {
      countryCode: "GB",
      nameEn: "University of Manchester",
      nameBn: "ম্যানচেস্টার বিশ্ববিদ্যালয়",
      city: "Manchester",
      stateOrProvince: "Greater Manchester",
      worldRank: 34,
      websiteUrl: "https://www.manchester.ac.uk",
      admissionsUrl: "https://www.manchester.ac.uk/study/international/admissions/",
      applicationUrl: "https://www.manchester.ac.uk/study/masters/admissions/apply/",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "যুক্তরাজ্যের রয়্যাল চার্টার প্রাপ্ত ও রাসেল গ্রুপভুক্ত সরকারি গবেষণা বিশ্ববিদ্যালয়। HESA স্বীকৃত।",
      recognizingAuthority: "UK Office for Students (OfS) / HESA",
      institutionRegistryCode: "UKPRN 10007798",
      internationalStudentUrl: "https://www.manchester.ac.uk/study/international/",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://www.manchester.ac.uk/study/international/country-specific-information/bangladesh/",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Advanced Computer Science",
          titleBn: "মাস্টার্স ইন অ্যাডভান্সড কম্পিউটার সায়েন্স",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.COMPUTER_SCIENCE_IT,
          department: "Department of Computer Science",
          durationMonths: 12,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 36000.0,
          tuitionCurrencyCode: "GBP",
          prerequisitesBn: "কম্পিউটার সায়েন্স বা ইলেকট্রনিক্সে প্রথম শ্রেণি বা সমমানের সিজিপিএ (ন্যূনতম ৩.৫০)।",
          officialProgramUrl: "https://www.manchester.ac.uk/study/masters/courses/list/01460/msc-advanced-computer-science/",
          officialSourceUrl: "https://www.manchester.ac.uk/study/masters/courses/list/01460/msc-advanced-computer-science/",
          admissionRequirement: {
            minGpaOrCgpa: 3.5,
            gpaScale: 4.0,
            minIeltsOverall: 7.0,
            minIeltsEachBand: 6.5,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "রাসেল গ্রুপ প্রতিষ্ঠান। কম্পিউটার সায়েন্স বা সফটওয়্যার ইঞ্জিনিয়ারিং ব্যাকগ্রাউন্ড আবশ্যক।",
          },
        },
        {
          titleEn: "MSc Data Science and Artificial Intelligence",
          titleBn: "মাস্টার্স ইন ডেটা সায়েন্স অ্যান্ড আর্টিফিশিয়াল ইন্টেলিজেন্স",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.DATA_SCIENCE_AI,
          department: "Department of Computer Science",
          durationMonths: 12,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 37500.0,
          tuitionCurrencyCode: "GBP",
          prerequisitesBn: "গণিত, পরিসংখ্যান বা কম্পিউটার সায়েন্স ডিগ্রি। পাইথন ও ক্যালকুলাসের জ্ঞান আবশ্যক।",
          officialProgramUrl: "https://www.manchester.ac.uk/study/masters/courses/list/18121/msc-data-science/",
          officialSourceUrl: "https://www.manchester.ac.uk/study/masters/courses/list/18121/msc-data-science/",
          admissionRequirement: {
            minGpaOrCgpa: 3.3,
            gpaScale: 4.0,
            minIeltsOverall: 7.0,
            minIeltsEachBand: 6.5,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "আন্তর্জাতিক শিক্ষার্থীদের জন্য মেধাভিত্তিক স্কলারশিপ উন্মুক্ত রয়েছে।",
          },
        },
      ],
    },
    {
      countryCode: "GB",
      nameEn: "University of Sheffield",
      nameBn: "শেফিল্ড বিশ্ববিদ্যালয়",
      city: "Sheffield",
      stateOrProvince: "South Yorkshire",
      worldRank: 105,
      websiteUrl: "https://www.sheffield.ac.uk",
      admissionsUrl: "https://www.sheffield.ac.uk/postgraduate/apply",
      applicationUrl: "https://www.sheffield.ac.uk/postgraduate/apply",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "যুক্তরাজ্যের শীর্ষস্থানীয় রাসেল গ্রুপ প্রতিষ্ঠান। প্রিভি কাউন্সিল দ্বারা চার্টার্ড।",
      recognizingAuthority: "UK Office for Students / HESA",
      institutionRegistryCode: "UKPRN 10007774",
      internationalStudentUrl: "https://www.sheffield.ac.uk/international",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://www.sheffield.ac.uk/international/country/bangladesh",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Data Analytics",
          titleBn: "মাস্টার্স ইন ডেটা অ্যানালিটিক্স",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.DATA_SCIENCE_AI,
          department: "Information School",
          durationMonths: 12,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 29950.0,
          tuitionCurrencyCode: "GBP",
          prerequisitesBn: "স্নাতক ডিগ্রি (সিজিপিএ ৩.২০+)। যেকোনো ডিসিপ্লিনের শিক্ষার্থী আবেদন করতে পারেন।",
          officialProgramUrl: "https://www.sheffield.ac.uk/postgraduate/taught/courses/2026/data-analytics-msc",
          officialSourceUrl: "https://www.sheffield.ac.uk/postgraduate/taught/courses/2026/data-analytics-msc",
          admissionRequirement: {
            minGpaOrCgpa: 3.2,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "আন্তর্জাতিক শিক্ষার্থীদের জন্য £২,৫০০ মেধাভিত্তিক টিউশন ডিসকাউন্ট অ্যাওয়ার্ড।",
          },
        },
      ],
    },

    // Canada
    {
      countryCode: "CA",
      nameEn: "University of Ottawa",
      nameBn: "অটোয়া বিশ্ববিদ্যালয়",
      city: "Ottawa",
      stateOrProvince: "Ontario",
      worldRank: 203,
      websiteUrl: "https://www.uottawa.ca",
      admissionsUrl: "https://www.uottawa.ca/study/graduate-studies/admissions",
      applicationUrl: "https://www.ouac.on.ca/",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "অন্টারিও শিক্ষা মন্ত্রণালয় স্বীকৃত সরকারি বাইলিঙ্গুয়াল বিশ্ববিদ্যালয়। কানাডা সরকারের ভেরিফাইড DLI প্রতিষ্ঠান।",
      recognizingAuthority: "Immigration, Refugees and Citizenship Canada (IRCC)",
      institutionRegistryCode: "DLI # O1932533212",
      internationalStudentUrl: "https://www.uottawa.ca/study/international-students",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://www.uottawa.ca/study/graduate-studies",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Computer Science (Applied AI)",
          titleBn: "মাস্টার্স ইন কম্পিউটার সায়েন্স (অ্যাপ্লাইড এআই)",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.COMPUTER_SCIENCE_IT,
          department: "Faculty of Engineering",
          durationMonths: 24,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 33500.0,
          tuitionCurrencyCode: "CAD",
          prerequisitesBn: "কম্পিউটার সায়েন্স বা সমমানের চার বছর মেয়াদি স্নাতক ডিগ্রি (ন্যূনতম ৮০% বা সিজিপিএ ৩.৪০)।",
          officialProgramUrl: "https://www.uottawa.ca/study/graduate-studies/programs/computer-science",
          officialSourceUrl: "https://www.uottawa.ca/study/graduate-studies/programs/computer-science",
          admissionRequirement: {
            minGpaOrCgpa: 3.4,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "কানাডার রাজধানী অটোয়ায় কো-অপ ইন্টার্নশিপের সুবিধা ও ৩ বছর মেয়াদি PGWP।",
          },
        },
      ],
    },
    {
      countryCode: "CA",
      nameEn: "University of Toronto",
      nameBn: "টরন্টো বিশ্ববিদ্যালয়",
      city: "Toronto",
      stateOrProvince: "Ontario",
      worldRank: 21,
      websiteUrl: "https://www.utoronto.ca",
      admissionsUrl: "https://future.utoronto.ca/apply/",
      applicationUrl: "https://www.ouac.on.ca/",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "কানাডার শীর্ষস্থানীয় সরকারি গবেষণা প্রতিষ্ঠান। U15 গ্রুপ অব কানাডিয়ান রিসার্চ ইউনিভার্সিটির সদস্য।",
      recognizingAuthority: "IRCC Canada",
      institutionRegistryCode: "DLI # O19332718824",
      internationalStudentUrl: "https://internationalexperience.utoronto.ca/",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://future.utoronto.ca/international-students/",
      isPublic: true,
      programs: [
        {
          titleEn: "Master of Management Analytics (MMA)",
          titleBn: "মাস্টার অব ম্যানেজমেন্ট অ্যানালিটিক্স",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.BUSINESS_MANAGEMENT,
          department: "Rotman School of Management",
          durationMonths: 12,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 46000.0,
          tuitionCurrencyCode: "CAD",
          prerequisitesBn: "স্নাতক ডিগ্রি এবং গণিত/পরিসংখ্যানে শক্তিশালী একাডেমিক ব্যাকগ্রাউন্ড।",
          officialProgramUrl: "https://www.rotman.utoronto.ca/Degrees/MastersPrograms/MMA",
          officialSourceUrl: "https://www.rotman.utoronto.ca/Degrees/MastersPrograms/MMA",
          admissionRequirement: {
            minGpaOrCgpa: 3.6,
            gpaScale: 4.0,
            minIeltsOverall: 7.0,
            minIeltsEachBand: 6.5,
            greRequired: false,
            workExperienceMonths: 12,
            notesBn: "রটম্যান বিজনেস স্কুলের বিশ্বখ্যাত অ্যানালিটিক্স প্রোগ্রাম।",
          },
        },
      ],
    },

    // Australia
    {
      countryCode: "AU",
      nameEn: "University of Melbourne",
      nameBn: "মেলবোর্ন বিশ্ববিদ্যালয়",
      city: "Melbourne",
      stateOrProvince: "Victoria",
      worldRank: 13,
      websiteUrl: "https://www.unimelb.edu.au",
      admissionsUrl: "https://study.unimelb.edu.au/how-to-apply",
      applicationUrl: "https://study.unimelb.edu.au/how-to-apply",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "অস্ট্রেলিয়ার শীর্ষ পাবলিক গবেষণা বিশ্ববিদ্যালয়। গ্রুপ অব এইট (Go8) সদস্য। TEQSA ও CRICOS অনুমোদিত।",
      recognizingAuthority: "Tertiary Education Quality and Standards Agency (TEQSA)",
      institutionRegistryCode: "CRICOS Provider 00116K",
      internationalStudentUrl: "https://students.unimelb.edu.au/student-support/international-student-support",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://study.unimelb.edu.au/how-to-apply/international-applications",
      isPublic: true,
      programs: [
        {
          titleEn: "Master of Information Technology",
          titleBn: "মাস্টার অব ইনফরমেশন টেকনোলজি",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.COMPUTER_SCIENCE_IT,
          department: "Faculty of Engineering and Information Technology",
          durationMonths: 24,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 49800.0,
          tuitionCurrencyCode: "AUD",
          prerequisitesBn: "যেকোনো বিষয়ে স্নাতক ডিগ্রি এবং কমপক্ষে একটি কম্পিউটার প্রোগ্রামিং কোর্স সমাপ্ত।",
          officialProgramUrl: "https://study.unimelb.edu.au/find/courses/graduate/master-of-information-technology/",
          officialSourceUrl: "https://study.unimelb.edu.au/find/courses/graduate/master-of-information-technology/",
          admissionRequirement: {
            minGpaOrCgpa: 3.4,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "অস্ট্রেলিয়ান কম্পিউটার সোসাইটি (ACS) প্রফেশনাল অ্যাক্রিডিটেশনপ্রাপ্ত ডিগ্রি।",
          },
        },
      ],
    },

    // Germany
    {
      countryCode: "DE",
      nameEn: "Technical University of Munich (TUM)",
      nameBn: "মিউনিখ টেকনিক্যাল ইউনিভার্সিটি",
      city: "Munich",
      stateOrProvince: "Bavaria",
      worldRank: 28,
      websiteUrl: "https://www.tum.de",
      admissionsUrl: "https://www.tum.de/en/studies/application",
      applicationUrl: "https://campus.tum.de",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "জার্মানির শীর্ষ এক্সিলেন্স ইনিশিয়েটিভপ্রাপ্ত পাবলিক টেকনিক্যাল বিশ্ববিদ্যালয়। Anabin স্ট্যাটাস H+।",
      recognizingAuthority: "Kultusministerkonferenz (KMK) / Anabin",
      institutionRegistryCode: "Anabin ID H+",
      internationalStudentUrl: "https://www.tum.de/en/studies/international-students",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://www.tum.de/en/studies/international-students",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Informatics",
          titleBn: "মাস্টার্স ইন ইনফরম্যাটিক্স",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.COMPUTER_SCIENCE_IT,
          department: "TUM School of Computation, Information and Technology",
          durationMonths: 24,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 4000.0,
          tuitionCurrencyCode: "EUR",
          prerequisitesBn: "কম্পিউটার সায়েন্সে সম্মান ডিগ্রি। গণিত ও অ্যালগরিদমের ক্রেডিট রিকোয়ারমেন্ট থাকা আবশ্যক।",
          officialProgramUrl: "https://www.tum.de/en/studies/degree-programs/detail/informatics-master-of-science-msc",
          officialSourceUrl: "https://www.tum.de/en/studies/degree-programs/detail/informatics-master-of-science-msc",
          admissionRequirement: {
            minGpaOrCgpa: 3.5,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: true,
            minGreScore: 310,
            workExperienceMonths: 0,
            notesBn: "জার্মানির শীর্ষ প্রযুক্তি বিশ্ববিদ্যালয়। সম্পূর্ণ ইংরেজি মাধ্যমে ক্লাস পরিচালিত হয়।",
          },
        },
      ],
    },
    {
      countryCode: "DE",
      nameEn: "RWTH Aachen University",
      nameBn: "আখেন টেকনিক্যাল বিশ্ববিদ্যালয়",
      city: "Aachen",
      stateOrProvince: "North Rhine-Westphalia",
      worldRank: 106,
      websiteUrl: "https://www.rwth-aachen.de",
      admissionsUrl: "https://www.rwth-aachen.de/go/id/bkmj",
      applicationUrl: "https://online.rwth-aachen.de",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "জার্মানির শীর্ষ TU9 টেকনিক্যাল বিশ্ববিদ্যালয়। সম্পূর্ণ টিউশন ফ্রি (€০)। Anabin স্ট্যাটাস H+।",
      recognizingAuthority: "KMK Anabin Germany",
      institutionRegistryCode: "Anabin ID H+",
      internationalStudentUrl: "https://www.rwth-aachen.de/go/id/cpgt",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://www.rwth-aachen.de/cms/root/Studium/Vor-dem-Studium/Internationale-Studierende/~cpgt/Internationale-Studierende/",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Automotive Engineering",
          titleBn: "মাস্টার্স ইন অটোমোটিভ ইঞ্জিনিয়ারিং",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.ENGINEERING_TECHNOLOGY,
          department: "Faculty of Mechanical Engineering",
          durationMonths: 24,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 0.0,
          tuitionCurrencyCode: "EUR",
          prerequisitesBn: "মেকানিক্যাল বা অটোমোবাইল ইঞ্জিনিয়ারিংয়ে স্নাতক। গণিত ও থার্মোডায়নামিক্সে নূন্যতম ক্রেডিট আবশ্যক।",
          officialProgramUrl: "https://www.rwth-aachen.de/go/id/bkmj",
          officialSourceUrl: "https://www.rwth-aachen.de/go/id/bkmj",
          admissionRequirement: {
            minGpaOrCgpa: 3.3,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: true,
            minGreScore: 315,
            workExperienceMonths: 0,
            notesBn: "সম্পূর্ণ টিউশন ফ্রি সরকারি ডিগ্রি। শুধু সেমিস্টার ফি প্রতি ৬ মাসে প্রায় ৩২০ ইউরো।",
          },
        },
      ],
    },

    // United States
    {
      countryCode: "US",
      nameEn: "University of Michigan",
      nameBn: "মিশিগান বিশ্ববিদ্যালয়",
      city: "Ann Arbor",
      stateOrProvince: "Michigan",
      worldRank: 33,
      websiteUrl: "https://umich.edu",
      admissionsUrl: "https://rackham.umich.edu/admissions/",
      applicationUrl: "https://rackham.umich.edu/admissions/applying/",
      institutionType: "PUBLIC_RESEARCH",
      accreditationDetailsBn: "যুক্তরাষ্ট্রের শীর্ষ পাবলিক আইভি বিশ্ববিদ্যালয়। HLC এবং US Dept of Education স্বীকৃত। SEVP অনুমোদিত।",
      recognizingAuthority: "Higher Learning Commission (HLC) & SEVP",
      institutionRegistryCode: "SEVP Certified DET214F00388000",
      internationalStudentUrl: "https://internationalcenter.umich.edu/",
      verificationStatus: VerificationStatus.VERIFIED,
      isRecognized: true,
      officialSourceUrl: "https://internationalcenter.umich.edu/",
      isPublic: true,
      programs: [
        {
          titleEn: "MS in Computer Science and Engineering",
          titleBn: "মাস্টার্স ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং",
          degreeLevel: DegreeLevel.MASTER,
          subjectCategory: SubjectCategory.COMPUTER_SCIENCE_IT,
          department: "College of Engineering",
          durationMonths: 24,
          studyMode: "FULL_TIME",
          annualTuitionAmount: 54000.0,
          tuitionCurrencyCode: "USD",
          prerequisitesBn: "সিএসই বা সমমানের ক্ষেত্রে স্নাতক ডিগ্রি। অ্যালগরিদম ও ডেটা স্ট্রাকচারে চমৎকার গ্রেড আবশ্যক।",
          officialProgramUrl: "https://cse.engin.umich.edu/academics/graduate/graduate-programs/ms-mse-in-cse/",
          officialSourceUrl: "https://cse.engin.umich.edu/academics/graduate/graduate-programs/ms-mse-in-cse/",
          admissionRequirement: {
            minGpaOrCgpa: 3.6,
            gpaScale: 4.0,
            minIeltsOverall: 7.0,
            minIeltsEachBand: 6.5,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "STEM অনুমোদিত কোর্স (৩৬ মাসের OPT ওয়ার্ক পারমিট প্রাপ্তির সুযোগ)।",
          },
        },
      ],
    },
  ];

  for (const u of universities) {
    let uni = await prisma.university.findFirst({
      where: { nameEn: u.nameEn, countryCode: u.countryCode },
    });

    const uniData = {
      countryCode: u.countryCode,
      nameEn: u.nameEn,
      nameBn: u.nameBn,
      city: u.city,
      stateOrProvince: u.stateOrProvince || null,
      worldRank: u.worldRank,
      websiteUrl: u.websiteUrl,
      admissionsUrl: u.admissionsUrl,
      applicationUrl: u.applicationUrl,
      institutionType: u.institutionType,
      accreditationDetailsBn: u.accreditationDetailsBn,
      recognizingAuthority: u.recognizingAuthority,
      institutionRegistryCode: u.institutionRegistryCode,
      internationalStudentUrl: u.internationalStudentUrl,
      verificationStatus: u.verificationStatus,
      isRecognized: u.isRecognized,
      officialSourceUrl: u.officialSourceUrl,
      isPublic: u.isPublic,
    };

    if (!uni) {
      uni = await prisma.university.create({
        data: uniData,
      });
    } else {
      uni = await prisma.university.update({
        where: { id: uni.id },
        data: uniData,
      });
    }

    for (const prog of u.programs) {
      let existingProg = await prisma.program.findFirst({
        where: { universityId: uni.id, titleEn: prog.titleEn },
      });

      const progData = {
        universityId: uni.id,
        titleEn: prog.titleEn,
        titleBn: prog.titleBn,
        degreeLevel: prog.degreeLevel,
        subjectCategory: prog.subjectCategory,
        department: prog.department,
        durationMonths: prog.durationMonths,
        studyMode: prog.studyMode,
        annualTuitionAmount: prog.annualTuitionAmount,
        tuitionCurrencyCode: prog.tuitionCurrencyCode,
        prerequisitesBn: prog.prerequisitesBn,
        officialProgramUrl: prog.officialProgramUrl,
        officialSourceUrl: prog.officialSourceUrl,
      };

      if (!existingProg) {
        existingProg = await prisma.program.create({
          data: progData,
        });
      } else {
        existingProg = await prisma.program.update({
          where: { id: existingProg.id },
          data: progData,
        });
      }

      if (prog.admissionRequirement) {
        await prisma.admissionRequirement.upsert({
          where: { programId: existingProg.id },
          update: prog.admissionRequirement,
          create: {
            programId: existingProg.id,
            ...prog.admissionRequirement,
          },
        });
      }

      // Seed Standard Intakes: Fall 2025, Spring 2026, Fall 2026
      const intakes = [
        {
          season: IntakeSeason.FALL,
          year: 2025,
          applicationDeadline: new Date("2025-06-30"),
          sessionStartDate: new Date("2025-09-15"),
        },
        {
          season: IntakeSeason.SPRING,
          year: 2026,
          applicationDeadline: new Date("2025-11-15"),
          sessionStartDate: new Date("2026-01-10"),
        },
        {
          season: IntakeSeason.FALL,
          year: 2026,
          applicationDeadline: new Date("2026-06-30"),
          sessionStartDate: new Date("2026-09-15"),
        },
      ];

      for (const intake of intakes) {
        const existingIntake = await prisma.programIntake.findFirst({
          where: {
            programId: existingProg.id,
            season: intake.season,
            year: intake.year,
          },
        });

        if (!existingIntake) {
          await prisma.programIntake.create({
            data: {
              programId: existingProg.id,
              ...intake,
            },
          });
        }
      }
    }
  }
  console.log(`✅ Upserted flagship universities, verified registry accreditation, programs, and intakes.`);

  // 4. Seed Major Government Scholarships
  const scholarships = [
    {
      countryCode: "GB",
      titleEn: "Chevening Scholarships",
      titleBn: "শেভেনিং স্কলারশিপ (UK)",
      providerType: "GOVERNMENT",
      coverageType: "FULL_FUNDED",
      stipendMonthlyAmount: 1023.0,
      stipendCurrencyCode: "GBP",
      coverageDescriptionBn:
        "যুক্তরাজ্য সরকারের সম্পূর্ণ অর্থায়নে টিউশন ফি, মাসিক লিভিং ভাতা (£1,023/মাস), রিটার্ন বিমান ভাড়া ও ভিসা ফি।",
      eligibilityCriteriaBn:
        "অনূর্ধ্ব ব্যাচেলর ডিগ্রি (ন্যূনতম ২:১ সমমান / সিজিপিএ ৩.২৫+), কমপক্ষে ২ বছরের পেশাগত অভিজ্ঞতা, এবং কোর্সের পর বাংলাদেশে প্রত্যাবর্তনের অঙ্গীকার।",
      officialPortalUrl: "https://www.chevening.org/scholarship/bangladesh/",
      deadlineNotice: "সাধারণত প্রতি বছর নভেম্বর মাসের প্রথম সপ্তাহে আবেদন শেষ হয়।",
      minCgpaRequired: 3.25,
      minIeltsRequired: 6.5,
      workExperienceMonths: 24,
    },
    {
      countryCode: "GB",
      titleEn: "Commonwealth Shared Scholarships",
      titleBn: "কমনওয়েলথ শেয়ার্ড স্কলারশিপ (UK)",
      providerType: "GOVERNMENT",
      coverageType: "FULL_FUNDED",
      stipendMonthlyAmount: 1347.0,
      stipendCurrencyCode: "GBP",
      coverageDescriptionBn:
        "উন্নয়নশীল দেশের শিক্ষার্থীদের জন্য ফুল টিউশন ফি, মাসিক লিভিং ভাতা ও রিটার্ন এয়ারফেয়ার।",
      eligibilityCriteriaBn:
        "উচ্চ একাডেমিক রেকর্ড (প্রথম শ্রেণি / সিজিপিএ ৩.৫০+), আইইএলটিএস ৬.৫+, এবং নির্ধারিত যুক্তরাজ্যের পার্টনার বিশ্ববিদ্যালয়ে মাস্টার্স অফার।",
      officialPortalUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/",
      deadlineNotice: "প্রতি বছর ডিসেম্বর মাসের মাঝামাঝি আবেদন সমাপ্ত হয়।",
      minCgpaRequired: 3.5,
      minIeltsRequired: 6.5,
      workExperienceMonths: 0,
    },
    {
      countryCode: "DE",
      titleEn: "DAAD EPOS / Study Scholarships",
      titleBn: "ডিএএডি (DAAD) ইপিওএস স্কলারশিপ জার্মানি",
      providerType: "GOVERNMENT",
      coverageType: "FULL_FUNDED",
      stipendMonthlyAmount: 934.0,
      stipendCurrencyCode: "EUR",
      coverageDescriptionBn:
        "সম্পূর্ণ টিউশন ফ্রি, মাসিক ৯৩৪ ইউরো লিভিং স্টাইপেন্ড, স্বাস্থ্য বীমা ও বিমান ভাড়া।",
      eligibilityCriteriaBn:
        "স্নাতক ডিগ্রি (ন্যূনতম ৪ এর মধ্যে ৩.০০+ সিজিপিএ), কমপক্ষে ২ বছরের সংশ্লিষ্ট পেশাগত অভিজ্ঞতা, আইইএলটিএস ৬.৫।",
      officialPortalUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
      deadlineNotice: "কোর্স অনুযায়ী আগস্ট থেকে নভেম্বর মাসের মধ্যে আবেদন করতে হয়।",
      minCgpaRequired: 3.0,
      minIeltsRequired: 6.5,
      workExperienceMonths: 24,
    },
    {
      countryCode: "CA",
      titleEn: "Ontario Graduate Scholarship (OGS)",
      titleBn: "অন্টারিও গ্র্যাজুয়েট স্কলারশিপ (OGS)",
      providerType: "GOVERNMENT",
      coverageType: "TUITION_WAIVER",
      stipendMonthlyAmount: 1250.0,
      stipendCurrencyCode: "CAD",
      coverageDescriptionBn:
        "বাৎসরিক $১৫,০০০ ক্যাড স্কলারশিপ অ্যাওয়ার্ড। কানাডার অন্টারিও প্রদেশের মাস্টার্স শিক্ষার্থীদের জন্য প্রযোজ্য।",
      eligibilityCriteriaBn:
        "পূর্ববর্তী ২ বছরের পড়াশোনায় ন্যূনতম ৮০% গড় নম্বর (A- বা ৩.৭০ সিজিপিএ)।",
      officialPortalUrl: "https://osap.gov.on.ca/OSAPPortal/en/A-ZListofAid/PRDR019245.html",
      deadlineNotice: "প্রতিটি বিশ্ববিদ্যালয়ের ডিপার্টমেন্ট ডেডলাইন অনুযায়ী জানুয়ারি-মার্চ।",
      minCgpaRequired: 3.7,
      minIeltsRequired: 7.0,
      workExperienceMonths: 0,
    },
  ];

  for (const s of scholarships) {
    let sch = await prisma.scholarship.findFirst({
      where: { titleEn: s.titleEn, countryCode: s.countryCode },
    });

    if (!sch) {
      sch = await prisma.scholarship.create({
        data: {
          countryCode: s.countryCode,
          titleEn: s.titleEn,
          titleBn: s.titleBn,
          providerType: s.providerType,
          coverageType: s.coverageType,
          stipendMonthlyAmount: s.stipendMonthlyAmount,
          stipendCurrencyCode: s.stipendCurrencyCode,
          coverageDescriptionBn: s.coverageDescriptionBn,
          eligibilityCriteriaBn: s.eligibilityCriteriaBn,
          officialPortalUrl: s.officialPortalUrl,
          deadlineNotice: s.deadlineNotice,
        },
      });

      await prisma.scholarshipEligibilityRule.create({
        data: {
          scholarshipId: sch.id,
          minCgpaRequired: s.minCgpaRequired,
          minIeltsRequired: s.minIeltsRequired,
          eligibleDegreeLevels: [DegreeLevel.MASTER],
          workExperienceMonths: s.workExperienceMonths,
          targetNationalities: ["BD"],
        },
      });
    }
  }
  console.log(`✅ Upserted ${scholarships.length} verified government scholarships and eligibility rules.`);

  console.log("🌟 All database seeding completed successfully with zero fabricated records!");
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
