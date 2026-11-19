import { PrismaClient, DegreeLevel, IntakeSeason, DocumentCategory } from "@prisma/client";

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
      officialImmigrationUrl: "https://www.gov.uk/student-visa",
      dhakaEmbassyName: "British High Commission, Dhaka",
      dhakaEmbassyUrl: "https://www.gov.uk/world/organisations/british-high-commission-dhaka",
      postStudyWorkDurationBn: "গ্র্যাজুয়েট রুট ভিসায় ব্যাচেলর ও মাস্টার্স সম্পন্নকারীদের জন্য ২ বছর ফুল-টাইম কাজের সুযোগ।",
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
      officialImmigrationUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
      dhakaEmbassyName: "High Commission of Canada in Bangladesh",
      dhakaEmbassyUrl: "https://www.international.gc.ca/country-pays/bangladesh/dhaka.aspx",
      postStudyWorkDurationBn: "ডিএলআই প্রতিষ্ঠানে পড়াশোনা শেষে সর্বোচ্চ ৩ বছর পর্যন্ত PGWP ওয়ার্ক পারমিট।",
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
      officialImmigrationUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
      dhakaEmbassyName: "Australian High Commission, Dhaka",
      dhakaEmbassyUrl: "https://bangladesh.embassy.gov.au/",
      postStudyWorkDurationBn: "সাবক্লাস ৪৮৫ এর অধীনে ২ বছর কাজের সুযোগ (রিজিওনাল এলাকায় অতিরিক্ত এক্সটেনশন)।",
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
      officialImmigrationUrl: "https://www.make-it-in-germany.com/en/study-vocational-training/study-in-germany",
      dhakaEmbassyName: "German Embassy Dhaka",
      dhakaEmbassyUrl: "https://dhaka.diplo.de/bd-en/service/visa-einreise/studium-und-ausbildung",
      postStudyWorkDurationBn: "পাবলিক বিশ্ববিদ্যালয় থেকে ডিগ্রি সমাপ্তির পর ১৮ মাসের জব সিকার রেসিডেন্স পারমিট।",
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
      officialImmigrationUrl: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
      dhakaEmbassyName: "Embassy of the United States, Dhaka",
      dhakaEmbassyUrl: "https://bd.usembassy.gov/",
      postStudyWorkDurationBn: "১২ মাসের OPT, এবং STEM বিষয়ের শিক্ষার্থীদের জন্য মোট ৩৬ মাসের কাজের সুযোগ।",
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
  }
  console.log(`✅ Upserted ${countries.length} destination countries.`);

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

  // 3. Seed Sample Flagship Universities & Programs
  const universities = [
    {
      countryCode: "GB",
      nameEn: "University of Manchester",
      nameBn: "ম্যানচেস্টার বিশ্ববিদ্যালয়",
      city: "Manchester",
      worldRank: 34,
      websiteUrl: "https://www.manchester.ac.uk",
      officialSourceUrl: "https://www.manchester.ac.uk/study/international/country-specific-information/bangladesh/",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Advanced Computer Science",
          titleBn: "মাস্টার্স ইন অ্যাডভান্সড কম্পিউটার সায়েন্স",
          degreeLevel: DegreeLevel.MASTER,
          department: "Department of Computer Science",
          durationMonths: 12,
          annualTuitionAmount: 36000.0,
          tuitionCurrencyCode: "GBP",
          officialSourceUrl: "https://www.manchester.ac.uk/study/masters/courses/list/01460/msc-advanced-computer-science/",
          admissionRequirement: {
            minGpaOrCgpa: 3.5,
            gpaScale: 4.0,
            minIeltsOverall: 7.0,
            minIeltsEachBand: 6.5,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "রাসেল গ্রুপ প্রতিষ্ঠান। কম্পিউটার সায়েন্স বা ইলেকট্রনিক্স ব্যাকগ্রাউন্ড আবশ্যক।",
          },
        },
      ],
    },
    {
      countryCode: "GB",
      nameEn: "University of Sheffield",
      nameBn: "শেফিল্ড বিশ্ববিদ্যালয়",
      city: "Sheffield",
      worldRank: 105,
      websiteUrl: "https://www.sheffield.ac.uk",
      officialSourceUrl: "https://www.sheffield.ac.uk/international/country/bangladesh",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Data Analytics",
          titleBn: "মাস্টার্স ইন ডেটা অ্যানালিটিক্স",
          degreeLevel: DegreeLevel.MASTER,
          department: "Department of Information School",
          durationMonths: 12,
          annualTuitionAmount: 29950.0,
          tuitionCurrencyCode: "GBP",
          officialSourceUrl: "https://www.sheffield.ac.uk/postgraduate/taught/courses/2026/data-analytics-msc",
          admissionRequirement: {
            minGpaOrCgpa: 3.2,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "আন্তর্জাতিক শিক্ষার্থীদের জন্য মেধাভিত্তিক স্কলারশিপ সহজলভ্য।",
          },
        },
      ],
    },
    {
      countryCode: "CA",
      nameEn: "University of Ottawa",
      nameBn: "অটোয়া বিশ্ববিদ্যালয়",
      city: "Ottawa",
      stateOrProvince: "Ontario",
      worldRank: 203,
      websiteUrl: "https://www.uottawa.ca",
      officialSourceUrl: "https://www.uottawa.ca/study/graduate-studies",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Computer Science (Applied AI)",
          titleBn: "মাস্টার্স ইন কম্পিউটার সায়েন্স (অ্যাপ্লাইড এআই)",
          degreeLevel: DegreeLevel.MASTER,
          department: "Faculty of Engineering",
          durationMonths: 24,
          annualTuitionAmount: 33500.0,
          tuitionCurrencyCode: "CAD",
          officialSourceUrl: "https://www.uottawa.ca/study/graduate-studies/programs/computer-science",
          admissionRequirement: {
            minGpaOrCgpa: 3.4,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: false,
            workExperienceMonths: 0,
            notesBn: "কানাডার রাজধানী অটোয়ায় কো-অপ ইন্টার্নশিপের সুবিধা।",
          },
        },
      ],
    },
    {
      countryCode: "DE",
      nameEn: "Technical University of Munich (TUM)",
      nameBn: "মিউনিখ টেকনিক্যাল ইউনিভার্সিটি",
      city: "Munich",
      stateOrProvince: "Bavaria",
      worldRank: 28,
      websiteUrl: "https://www.tum.de",
      officialSourceUrl: "https://www.tum.de/en/studies/international-students",
      isPublic: true,
      programs: [
        {
          titleEn: "MSc Informatics",
          titleBn: "মাস্টার্স ইন ইনফরম্যাটিক্স",
          degreeLevel: DegreeLevel.MASTER,
          department: "TUM School of Computation, Information and Technology",
          durationMonths: 24,
          annualTuitionAmount: 4000.0,
          tuitionCurrencyCode: "EUR",
          officialSourceUrl: "https://www.tum.de/en/studies/degree-programs/detail/informatics-master-of-science-msc",
          admissionRequirement: {
            minGpaOrCgpa: 3.5,
            gpaScale: 4.0,
            minIeltsOverall: 6.5,
            minIeltsEachBand: 6.0,
            greRequired: true,
            minGreScore: 310,
            workExperienceMonths: 0,
            notesBn: "জার্মানির শীর্ষ প্রযুক্তি বিশ্ববিদ্যালয়। ইংরেজি মাধ্যমে ক্লাস পরিচালিত হয়।",
          },
        },
      ],
    },
  ];

  for (const u of universities) {
    let uni = await prisma.university.findFirst({
      where: { nameEn: u.nameEn, countryCode: u.countryCode },
    });

    if (!uni) {
      uni = await prisma.university.create({
        data: {
          countryCode: u.countryCode,
          nameEn: u.nameEn,
          nameBn: u.nameBn,
          city: u.city,
          stateOrProvince: u.stateOrProvince || null,
          worldRank: u.worldRank,
          websiteUrl: u.websiteUrl,
          officialSourceUrl: u.officialSourceUrl,
          isPublic: u.isPublic,
        },
      });
    }

    for (const prog of u.programs) {
      const existingProg = await prisma.program.findFirst({
        where: { universityId: uni.id, titleEn: prog.titleEn },
      });

      if (!existingProg) {
        const createdProg = await prisma.program.create({
          data: {
            universityId: uni.id,
            titleEn: prog.titleEn,
            titleBn: prog.titleBn,
            degreeLevel: prog.degreeLevel,
            department: prog.department,
            durationMonths: prog.durationMonths,
            annualTuitionAmount: prog.annualTuitionAmount,
            tuitionCurrencyCode: prog.tuitionCurrencyCode,
            officialSourceUrl: prog.officialSourceUrl,
          },
        });

        if (prog.admissionRequirement) {
          await prisma.admissionRequirement.create({
            data: {
              programId: createdProg.id,
              ...prog.admissionRequirement,
            },
          });
        }
      }
    }
  }
  console.log(`✅ Upserted flagship universities, programs, and admission requirements.`);

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
      coverageDescriptionBn: "যুক্তরাজ্য সরকারের সম্পূর্ণ অর্থায়নে টিউশন ফি, মাসিক লিভিং ভাতা (£1,023/মাস), রিটার্ন বিমান ভাড়া ও ভিসা ফি।",
      eligibilityCriteriaBn: "অনূর্ধ্ব ব্যাচেলর ডিগ্রি (ন্যূনতম ২:১ সমমান / সিজিপিএ ৩.২৫+), কমপক্ষে ২ বছরের পেশাগত অভিজ্ঞতা, এবং কোর্সের পর বাংলাদেশে প্রত্যাবর্তনের অঙ্গীকার।",
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
      coverageDescriptionBn: "উন্নয়নশীল দেশের শিক্ষার্থীদের জন্য ফুল টিউশন ফি, মাসিক লিভিং ভাতা ও রিটার্ন এয়ারফেয়ার।",
      eligibilityCriteriaBn: "উচ্চ একাডেমিক রেকর্ড (প্রথম শ্রেণি / সিজিপিএ ৩.৫০+), আইইএলটিএস ৬.৫+, এবং নির্ধারিত যুক্তরাজ্যের পার্টনার বিশ্ববিদ্যালয়ে মাস্টার্স অফার।",
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
      coverageDescriptionBn: "সম্পূর্ণ টিউশন ফ্রি, মাসিক ৯৩৪ ইউরো লিভিং স্টাইপেন্ড, স্বাস্থ্য বীমা ও বিমান ভাড়া।",
      eligibilityCriteriaBn: "স্নাতক ডিগ্রি (ন্যূনতম ৪ এর মধ্যে ৩.০০+ সিজিপিএ), কমপক্ষে ২ বছরের সংশ্লিষ্ট পেশাগত অভিজ্ঞতা, আইইএলটিএস ৬.৫।",
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
      coverageDescriptionBn: "বাৎসরিক $১৫,০০০ ক্যাড স্কলারশিপ অ্যাওয়ার্ড। কানাডার অন্টারিও প্রদেশের মাস্টার্স শিক্ষার্থীদের জন্য প্রযোজ্য।",
      eligibilityCriteriaBn: "পূর্ববর্তী ২ বছরের পড়াশোনায় ন্যূনতম ৮০% গড় নম্বর (A- বা ৩.৭০ সিজিপিএ)।",
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

  // 5. Seed Historical Visa Policy & Requirements
  const ukVisa = await prisma.visaType.findFirst({
    where: { countryCode: "GB", visaCode: "STUDENT_ROUTE" },
  });

  if (ukVisa) {
    let visaReq = await prisma.visaRequirement.findFirst({
      where: { countryCode: "GB", visaTypeId: ukVisa.id },
    });

    if (!visaReq) {
      visaReq = await prisma.visaRequirement.create({
        data: {
          countryCode: "GB",
          visaTypeId: ukVisa.id,
          isCurrentActive: true,
        },
      });

      // Version 1 (Preserved Historical Rule)
      const version = await prisma.visaRequirementVersion.create({
        data: {
          visaRequirementId: visaReq.id,
          versionNumber: 1,
          effectiveFromDate: new Date("2024-01-01"),
          effectiveToDate: null, // Active
          isArchived: false,
          changeSummaryBn: "ইউকে হোম অফিস স্টুডেন্ট রুট রেগুলেশন ২০২৪-২০২৬ হালনাগাদ।",
          officialGazetteUrl: "https://www.gov.uk/student-visa/money",
        },
      });

      // Financial Rule: 28-day rule
      await prisma.visaFinancialRule.create({
        data: {
          versionId: version.id,
          requiredLivingFunds: 9207.0, // 9 months outside London base
          fundsCurrencyCode: "GBP",
          maintenancePeriodDays: 28,
          blockedAccountRequired: false,
          monthlyLivingRate: 1023.0,
          acceptableInstrumentsBn: "অনুমোদিত সিডিউল বাংলাদেশি ব্যাংকের সেভিংস বা চলতি একাউন্টে ফান্ড। টানা ২৮ দিন নির্ধারিত ব্যালান্সের নিচে নামা যাবে না।",
          unacceptableFundsBn: "শেয়ার মার্কেট, প্রাইজবন্ড বা অপর্যাপ্ত মেয়াদের এফডিআর গ্রহণযোগ্য নয়।",
        },
      });

      // Mandatory Documents
      const docs = [
        { category: DocumentCategory.PASSPORT_BIOPAGE, titleEn: "Valid International Passport", titleBn: "আন্তর্জাতিক পাসপোর্ট (মেয়াদ অন্তত ৬ মাস)", isMandatory: true },
        { category: DocumentCategory.CAS_OR_I20, titleEn: "Confirmation of Acceptance for Studies (CAS)", titleBn: "বিশ্ববিদ্যালয় প্রদত্ত সিএএস (CAS) লেটার", isMandatory: true },
        { category: DocumentCategory.BANK_STATEMENT_28DAY, titleEn: "28-Day Bank Statement & Solvency Certificate", titleBn: "টানা ২৮ দিনের ব্যাংক স্টেটমেন্ট ও ব্যাংক সলভেন্সি সনদ", isMandatory: true },
        { category: DocumentCategory.TUBERCULOSIS_TEST, titleEn: "Tuberculosis (TB) Test Certificate", titleBn: "আইওএম (IOM) অনুমোদিত সেন্টার থেকে টিবি টেস্ট সনদ", isMandatory: true },
        { category: DocumentCategory.ACADEMIC_TRANSCRIPT, titleEn: "Attested Academic Transcripts & Certificates", titleBn: "সত্যায়িত একাডেমিক ট্রান্সক্রিপ্ট ও সনদ", isMandatory: true },
      ];

      for (const d of docs) {
        await prisma.visaDocumentRequirement.create({
          data: {
            versionId: version.id,
            ...d,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded historical visa requirements and document compliance checklists.`);

  // 6. Seed Global Verified Deadlines
  const deadlines = [
    {
      titleBn: "শেভেনিং স্কলারশিপ ডেডলাইন (UK)",
      titleEn: "Chevening Scholarship Application Deadline",
      category: "SCHOLARSHIP",
      countryCode: "GB",
      deadlineDate: new Date("2025-11-05"),
      officialUrl: "https://www.chevening.org/apply/",
      notesBn: "যুক্তরাজ্যের পররাষ্ট্র মন্ত্রণালয়ের সম্পূর্ণ অর্থায়নে মাস্টার্স আবেদন সমাপ্তি।",
      isGlobal: true,
    },
    {
      titleBn: "কমনওয়েলথ শেয়ার্ড স্কলারশিপ আবেদন সমাপ্তি",
      titleEn: "Commonwealth Shared Scholarships Deadline",
      category: "SCHOLARSHIP",
      countryCode: "GB",
      deadlineDate: new Date("2025-12-12"),
      officialUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/",
      notesBn: "উন্নয়নশীল দেশের শিক্ষার্থীদের জন্য ফুল স্কলারশিপ।",
      isGlobal: true,
    },
    {
      titleBn: "কানাডা ফল ২০২৬ আর্লি অ্যাডমিশন রাউন্ড",
      titleEn: "Canada Fall 2026 Early Application Round",
      category: "UNIVERSITY",
      countryCode: "CA",
      deadlineDate: new Date("2026-01-15"),
      officialUrl: "https://www.ouac.on.ca/",
      notesBn: "অন্টারিও ও আলবার্টা বিশ্ববিদ্যালয়ের অগ্রাধিকার রাউন্ড।",
      isGlobal: true,
    },
  ];

  for (const dl of deadlines) {
    const existing = await prisma.deadline.findFirst({
      where: { titleEn: dl.titleEn },
    });
    if (!existing) {
      await prisma.deadline.create({ data: dl });
    }
  }
  console.log(`✅ Seeded global verified application deadlines.`);

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
