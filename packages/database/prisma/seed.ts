import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AbroadMate initial country & verified knowledge data...");

  // 1. Seed Countries
  const countries = [
    {
      code: "GB",
      nameEn: "United Kingdom",
      nameBn: "যুক্তরাজ্য (ইউকে)",
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
      nameEn: "Canada",
      nameBn: "কানাডা",
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
      nameEn: "Australia",
      nameBn: "অস্ট্রেলিয়া",
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
      nameEn: "Germany",
      nameBn: "জার্মানি",
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
      nameEn: "United States",
      nameBn: "যুক্তরাষ্ট্র (ইউএসএ)",
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

  // 2. Seed Sample Flagship Universities
  const universities = [
    {
      countryCode: "GB",
      nameEn: "University of Manchester",
      nameBn: "ম্যানচেস্টার বিশ্ববিদ্যালয়",
      city: "Manchester",
      worldRank: 32,
      websiteUrl: "https://www.manchester.ac.uk",
      officialSourceUrl: "https://www.manchester.ac.uk/study/international/country-specific-information/bangladesh/",
      isPublic: true,
    },
    {
      countryCode: "CA",
      nameEn: "University of Toronto",
      nameBn: "টরোন্টো বিশ্ববিদ্যালয়",
      city: "Toronto",
      stateOrProvince: "Ontario",
      worldRank: 21,
      websiteUrl: "https://www.utoronto.ca",
      officialSourceUrl: "https://future.utoronto.ca/apply/international/",
      isPublic: true,
    },
    {
      countryCode: "AU",
      nameEn: "University of Melbourne",
      nameBn: "মেলবোর্ন বিশ্ববিদ্যালয়",
      city: "Melbourne",
      stateOrProvince: "Victoria",
      worldRank: 13,
      websiteUrl: "https://www.unimelb.edu.au",
      officialSourceUrl: "https://study.unimelb.edu.au/how-to-apply/international-applications",
      isPublic: true,
    },
    {
      countryCode: "DE",
      nameEn: "Technical University of Munich (TUM)",
      nameBn: "মিউনিখ টেকনিক্যাল ইউনিভার্সিটি (টিইউএম)",
      city: "Munich",
      stateOrProvince: "Bavaria",
      worldRank: 28,
      websiteUrl: "https://www.tum.de",
      officialSourceUrl: "https://www.tum.de/en/studies/international-students",
      isPublic: true,
    },
    {
      countryCode: "US",
      nameEn: "Arizona State University",
      nameBn: "অ্যারিজোনা স্টেট ইউনিভার্সিটি",
      city: "Tempe",
      stateOrProvince: "Arizona",
      worldRank: 150,
      websiteUrl: "https://www.asu.edu",
      officialSourceUrl: "https://admission.asu.edu/international",
      isPublic: true,
    },
  ];

  for (const u of universities) {
    const existing = await prisma.university.findFirst({
      where: { nameEn: u.nameEn, countryCode: u.countryCode },
    });
    if (!existing) {
      await prisma.university.create({ data: u });
    }
  }

  console.log(`✅ Upserted ${universities.length} flagship universities.`);

  // 3. Seed Major Scholarships
  const scholarships = [
    {
      countryCode: "GB",
      titleEn: "Chevening Scholarship",
      titleBn: "শেভেনিং স্কলারশিপ",
      providerType: "GOVERNMENT",
      coverageType: "FULL_FUNDED",
      coverageDescriptionBn: "সম্পূর্ণ টিউশন ফি, মাসিক থাকা-খাওয়ার ভাতা, রিটার্ন বিমান টিকিট ও ভিসা ফি অন্তর্ভুক্ত।",
      eligibilityCriteriaBn: "অনূর্ধ্ব ব্যাচেলর ডিগ্রি (ন্যূনতম ২:১ সমমান), অন্তত ২ বছরের কাজের অভিজ্ঞতা, এবং পড়াশোনা শেষে বাংলাদেশে ফিরে আসার প্রতিশ্রুতি।",
      officialPortalUrl: "https://www.chevening.org/scholarship/bangladesh/",
      deadlineNotice: "সাধারণত প্রতি বছর নভেম্বর মাসের শুরুতে আবেদন শেষ হয়।",
    },
    {
      countryCode: "DE",
      titleEn: "DAAD EPOS Scholarship",
      titleBn: "ডিএএডি ইপোস স্কলারশিপ",
      providerType: "GOVERNMENT",
      coverageType: "FULL_FUNDED",
      coverageDescriptionBn: "সম্পূর্ণ ফ্রি টিউশন, মাসিক €৯৩৪ ইউরো স্টাইপেন্ড, স্বাস্থ্য বীমা ও বিমান ভাড়া।",
      eligibilityCriteriaBn: "স্নাতক ডিগ্রি (ন্যূনতম ৪ এর মধ্যে ৩.০০+ সিজিপিএ), কমপক্ষে ২ বছরের সংশ্লিষ্ট পেশাগত অভিজ্ঞতা, আইইএলটিএস ৬.০ বা ৬.৫।",
      officialPortalUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
      deadlineNotice: "কোর্স অনুযায়ী আগস্ট থেকে নভেম্বর মাসের মধ্যে আবেদন করতে হয়।",
    },
    {
      countryCode: "AU",
      titleEn: "Australia Awards Scholarship",
      titleBn: "অস্ট্রেলিয়া অ্যাওয়ার্ডস স্কলারশিপ",
      providerType: "GOVERNMENT",
      coverageType: "FULL_FUNDED",
      coverageDescriptionBn: "১০০% টিউশন ফি, বিমান খরচ, আগমন ভাতা, লিভিং অ্যালাউন্স ও ওএসএইচসি হেলথ কভার।",
      eligibilityCriteriaBn: "ন্যূনতম ১৬ বছরের শিক্ষা সম্পন্ন, আইইএলটিএস ৬.৫ (কোনো ব্যান্ডে ৬.০ এর কম নয়), ২ বছরের কাজের অভিজ্ঞতা।",
      officialPortalUrl: "https://www.dfat.gov.au/people-to-people/australia-awards",
      deadlineNotice: "প্রতি বছর এপ্রিল বা মে মাসে আবেদন বন্ধ হয়।",
    },
    {
      countryCode: "US",
      titleEn: "Fulbright Foreign Student Program",
      titleBn: "ফুলব্রাইট স্কলারশিপ",
      providerType: "GOVERNMENT",
      coverageType: "FULL_FUNDED",
      coverageDescriptionBn: "আমেরিকার মাস্টার্স কোর্সের সম্পূর্ণ টিউশন, মাসিক ব্যয়, স্বাস্থ্য সুরক্ষা ও যাতায়াত খরচ।",
      eligibilityCriteriaBn: "উচ্চ সিজিপিএ সহ ৪ বছরের ব্যাচেলর ডিগ্রি, আইইএলটিএস ৭.০ বা টোফেল ৮৮+, অন্তত ২ বছরের কাজের অভিজ্ঞতা।",
      officialPortalUrl: "https://bd.usembassy.gov/education-culture/fulbright-program/",
      deadlineNotice: "সাধারণত মে মাসের শেষদিকে ডেডলাইন থাকে।",
    },
  ];

  for (const s of scholarships) {
    const existing = await prisma.scholarship.findFirst({
      where: { titleEn: s.titleEn, countryCode: s.countryCode },
    });
    if (!existing) {
      await prisma.scholarship.create({ data: s });
    }
  }

  console.log(`✅ Upserted ${scholarships.length} verified government scholarships.`);

  console.log("🌟 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
