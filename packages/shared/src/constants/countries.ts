export interface CountryMetadata {
  code: string;
  iso2: string;
  nameEn: string;
  nameBn: string;
  flag: string;
  currency: {
    code: string;
    symbol: string;
    nameBn: string;
    rateToBdtApprox: number; // 1 Foreign Currency to BDT benchmark
  };
  visaSubclass: {
    name: string;
    categoryBn: string;
  };
  officialImmigrationPortal: string;
  dhakaEmbassyName: string;
  dhakaEmbassyUrl: string;
  postStudyWorkMonths: {
    bachelor: number;
    masters: number;
    stemBonusAvailable: boolean;
    descriptionBn: string;
  };
  avgMonthlyLivingCostLocal: number;
  blockedAccountRequired: boolean;
  minIeltsUndergrad: number;
  minIeltsPostgrad: number;
}

export const INITIAL_COUNTRIES: Record<string, CountryMetadata> = {
  GB: {
    code: "GB",
    iso2: "GB",
    nameEn: "United Kingdom",
    nameBn: "যুক্তরাজ্য (ইউকে)",
    flag: "🇬🇧",
    currency: {
      code: "GBP",
      symbol: "£",
      nameBn: "ব্রিটিশ পাউন্ড",
      rateToBdtApprox: 153.5,
    },
    visaSubclass: {
      name: "Student Visa (Student Route)",
      categoryBn: "স্টুডেন্ট রুট ভিসা",
    },
    officialImmigrationPortal: "https://www.gov.uk/student-visa",
    dhakaEmbassyName: "British High Commission, Dhaka",
    dhakaEmbassyUrl: "https://www.gov.uk/world/organisations/british-high-commission-dhaka",
    postStudyWorkMonths: {
      bachelor: 24,
      masters: 24,
      stemBonusAvailable: false,
      descriptionBn: "গ্র্যাজুয়েট রুট ভিসায় ব্যাচেলর ও মাস্টার্স সম্পন্নকারীরা ২ বছর এবং পিএইচডি সম্পন্নকারীরা ৩ বছর ফুল-টাইম কাজের অনুমতি পান।",
    },
    avgMonthlyLivingCostLocal: 1023, // Outside London base; London is ~1334
    blockedAccountRequired: false,
    minIeltsUndergrad: 6.0,
    minIeltsPostgrad: 6.5,
  },
  CA: {
    code: "CA",
    iso2: "CA",
    nameEn: "Canada",
    nameBn: "কানাডা",
    flag: "🇨🇦",
    currency: {
      code: "CAD",
      symbol: "C$",
      nameBn: "কানাডিয়ান ডলার",
      rateToBdtApprox: 87.0,
    },
    visaSubclass: {
      name: "Study Permit",
      categoryBn: "স্টাডি পারমিট",
    },
    officialImmigrationPortal: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
    dhakaEmbassyName: "High Commission of Canada in Bangladesh",
    dhakaEmbassyUrl: "https://www.international.gc.ca/country-pays/bangladesh/dhaka.aspx",
    postStudyWorkMonths: {
      bachelor: 36,
      masters: 36,
      stemBonusAvailable: false,
      descriptionBn: "ডিএলআই (DLI) অনুমোদিত শিক্ষা প্রতিষ্ঠানে পড়াশোনা শেষ করে ১ থেকে ৩ বছর পর্যন্ত PGWP (Post-Graduation Work Permit) পাওয়া যায়।",
    },
    avgMonthlyLivingCostLocal: 1720,
    blockedAccountRequired: false, // SDS GIC was common; cost of living requirement updated to CAD 20,635/yr
    minIeltsUndergrad: 6.0,
    minIeltsPostgrad: 6.5,
  },
  AU: {
    code: "AU",
    iso2: "AU",
    nameEn: "Australia",
    nameBn: "অস্ট্রেলিয়া",
    flag: "🇦🇺",
    currency: {
      code: "AUD",
      symbol: "A$",
      nameBn: "অস্ট্রেলিয়ান ডলার",
      rateToBdtApprox: 78.5,
    },
    visaSubclass: {
      name: "Student visa (Subclass 500)",
      categoryBn: "স্টুডেন্ট ভিসা (সাবক্লাস ৫০০)",
    },
    officialImmigrationPortal: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    dhakaEmbassyName: "Australian High Commission, Dhaka",
    dhakaEmbassyUrl: "https://bangladesh.embassy.gov.au/",
    postStudyWorkMonths: {
      bachelor: 24,
      masters: 24,
      stemBonusAvailable: true,
      descriptionBn: "সাবক্লাস ৪৮৫ (Temporary Graduate Visa)-র মাধ্যমে ব্যাচেলর এবং মাস্টার্স কোর্স শেষে ২ বছর কাজের সুযোগ পাওয়া যায়। রিজিওনাল এরিয়ায় অতিরিক্ত ১-২ বছর বৃদ্ধি পায়।",
    },
    avgMonthlyLivingCostLocal: 2475,
    blockedAccountRequired: false,
    minIeltsUndergrad: 6.0,
    minIeltsPostgrad: 6.5,
  },
  DE: {
    code: "DE",
    iso2: "DE",
    nameEn: "Germany",
    nameBn: "জার্মানি",
    flag: "🇩🇪",
    currency: {
      code: "EUR",
      symbol: "€",
      nameBn: "ইউরো",
      rateToBdtApprox: 130.0,
    },
    visaSubclass: {
      name: "National Visa for Study (Type D)",
      categoryBn: "জার্মান ন্যাশনাল স্টুডেন্ট ভিসা (ক্যাটাগরি ডি)",
    },
    officialImmigrationPortal: "https://www.make-it-in-germany.com/en/study-vocational-training/study-in-germany",
    dhakaEmbassyName: "Embassy of the Federal Republic of Germany, Dhaka",
    dhakaEmbassyUrl: "https://dhaka.diplo.de/bd-en/service/visa-einreise/studium-und-ausbildung",
    postStudyWorkMonths: {
      bachelor: 18,
      masters: 18,
      stemBonusAvailable: false,
      descriptionBn: "জার্মানিতে পাবলিক বিশ্ববিদ্যালয়ে স্নাতক বা মাস্টার্স শেষ করার পর ১৮ মাসের জব সিকার (Job-seeking) রেসিডেন্স পারমিট প্রদান করা হয়।",
    },
    avgMonthlyLivingCostLocal: 992, // Current Blocked Account is €11,904/year (~€992/month)
    blockedAccountRequired: true,
    minIeltsUndergrad: 6.0,
    minIeltsPostgrad: 6.5,
  },
  US: {
    code: "US",
    iso2: "US",
    nameEn: "United States",
    nameBn: "যুক্তরাষ্ট্র (ইউএসএ)",
    flag: "🇺🇸",
    currency: {
      code: "USD",
      symbol: "$",
      nameBn: "ইউএস ডলার",
      rateToBdtApprox: 122.5,
    },
    visaSubclass: {
      name: "F-1 Student Visa",
      categoryBn: "এফ-১ স্টুডেন্ট ভিসা",
    },
    officialImmigrationPortal: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
    dhakaEmbassyName: "Embassy of the United States, Dhaka",
    dhakaEmbassyUrl: "https://bd.usembassy.gov/",
    postStudyWorkMonths: {
      bachelor: 12,
      masters: 12,
      stemBonusAvailable: true,
      descriptionBn: "১২ মাসের পোস্ট-কম্প্লিশন অপশনাল প্র্যাকটিক্যাল ট্রেনিং (OPT)। অনুমোদিত STEM ডিগ্রিধারীদের জন্য অতিরিক্ত ২৪ মাসের এক্সটেনশন (মোট ৩৬ মাস)।",
    },
    avgMonthlyLivingCostLocal: 1500,
    blockedAccountRequired: false,
    minIeltsUndergrad: 6.0,
    minIeltsPostgrad: 6.5,
  },
};

export const COUNTRY_LIST = Object.values(INITIAL_COUNTRIES);
