"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  ExternalLink,
  MapPin,
  GraduationCap,
  Globe2,
  Filter,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  Info,
} from "lucide-react";

interface UniversityItem {
  id: string;
  nameEn: string;
  nameBn: string;
  countryCode: "GB" | "CA" | "AU" | "DE" | "US";
  countryNameBn: string;
  flag: string;
  city: string;
  stateOrRegion: string;
  worldRank: number;
  isPublic: boolean;
  minIelts: number;
  annualTuitionLocal: string;
  annualTuitionBdtApprox: string;
  tuitionTier: "free" | "moderate" | "standard";
  topPrograms: string[];
  intakes: string[];
  bangladeshRequirementNote: string;
  websiteUrl: string;
  officialAdmissionUrl: string;
  highlightTag: string;
}

const UNIVERSITIES_DATA: UniversityItem[] = [
  // Germany
  {
    id: "tum",
    nameEn: "Technical University of Munich (TUM)",
    nameBn: "মিউনিখ টেকনিক্যাল ইউনিভার্সিটি (টিইউএম)",
    countryCode: "DE",
    countryNameBn: "জার্মানি",
    flag: "🇩🇪",
    city: "Munich",
    stateOrRegion: "Bavaria",
    worldRank: 28,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "€০ - €৪,০০০ / সেমিস্টার (কোর্সভেদে)",
    annualTuitionBdtApprox: "০ - ৫,২০,০০০ টাকা",
    tuitionTier: "free",
    topPrograms: ["কম্পিউটার সায়েন্স", "মেকানিক্যাল ইঞ্জিনিয়ারিং", "ডাটা ইঞ্জিনিয়ারিং", "বায়োটেকনোলজি"],
    intakes: ["উইন্টার (Winter - অক্টোবর)", "সামার (Summer - এপ্রিল)"],
    bangladeshRequirementNote: "স্নাতক (অনার্স) ৪ বছরের ডিগ্রি অথবা এইচএসসির পর ১ বছরের স্টুডিয়েনকলেগ (Studienkolleg)। সিজিপিএ ৩.৩০+ অগ্রাধিকার পায়।",
    websiteUrl: "https://www.tum.de",
    officialAdmissionUrl: "https://www.tum.de/en/studies/international-students",
    highlightTag: "শীর্ষ টেকনিক্যাল • নামমাত্র টিউশন ফি",
  },
  {
    id: "lmu",
    nameEn: "Ludwig Maximilian University of Munich (LMU)",
    nameBn: "এলএমইউ মিউনিখ বিশ্ববিদ্যালয়",
    countryCode: "DE",
    countryNameBn: "জার্মানি",
    flag: "🇩🇪",
    city: "Munich",
    stateOrRegion: "Bavaria",
    worldRank: 54,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "€০ (শুধুমাত্র সেমিস্টার ফি ~€১৫০)",
    annualTuitionBdtApprox: "২০,০০০ টাকা (সেমিস্টার ফি)",
    tuitionTier: "free",
    topPrograms: ["পদার্থবিজ্ঞান", "অর্থনীতি ও বিজনেস", "বায়োমেডিসিন", "সোশ্যাল সায়েন্স"],
    intakes: ["উইন্টার (Winter - অক্টোবর)"],
    bangladeshRequirementNote: "স্নাতক স্তরে উচ্চ একাডেমিক ফলাফল (সিজিপিএ ৩.২০+) এবং সুনির্দিষ্ট বিষয়ভিত্তিক কোর্স ক্রেডিট থাকা আবশ্যক।",
    websiteUrl: "https://www.lmu.de",
    officialAdmissionUrl: "https://www.lmu.de/en/study/international-students/index.html",
    highlightTag: "১০০% টিউশন ফ্রি • নোবেল বিজয়ী ঐতিহ্য",
  },
  {
    id: "rwth",
    nameEn: "RWTH Aachen University",
    nameBn: "আরডব্লিউটিএইচ আখেন ইউনিভার্সিটি",
    countryCode: "DE",
    countryNameBn: "জার্মানি",
    flag: "🇩🇪",
    city: "Aachen",
    stateOrRegion: "North Rhine-Westphalia",
    worldRank: 106,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "€০ (সেমিস্টার টিকেট ফি ~€৩১৫)",
    annualTuitionBdtApprox: "৪০,০০০ টাকা / সেমিস্টার",
    tuitionTier: "free",
    topPrograms: ["অটোমোটিভ ইঞ্জিনিয়ারিং", "রোবোটিক্স", "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং", "ম্যাটেরিয়াল সায়েন্স"],
    intakes: ["উইন্টার (Winter)", "সামার (Summer)"],
    bangladeshRequirementNote: "ইঞ্জিনিয়ারিং শিক্ষার্থীদের জন্য বিশ্বসেরা গন্তব্য। জিআরই (GRE) স্কোর বাধ্যতামূলক নয় তবে সিজিপিএ ৩.০০+ থাকা জরুরি।",
    websiteUrl: "https://www.rwth-aachen.de",
    officialAdmissionUrl: "https://www.rwth-aachen.de/cms/root/studium/im-studium/internationales/~bms/internationale-studierende/?lidx=1",
    highlightTag: "ইউরোপের সেরা ইঞ্জিনিয়ারিং হাব",
  },
  {
    id: "heidelberg",
    nameEn: "Heidelberg University",
    nameBn: "হাইডেলবার্গ বিশ্ববিদ্যালয়",
    countryCode: "DE",
    countryNameBn: "জার্মানি",
    flag: "🇩🇪",
    city: "Heidelberg",
    stateOrRegion: "Baden-Württemberg",
    worldRank: 87,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "€৩,০০০ / বছর",
    annualTuitionBdtApprox: "৩,৯০,০০০ টাকা",
    tuitionTier: "moderate",
    topPrograms: ["মেডিসিন ও লাইফ সায়েন্স", "মলিকুলার বায়োলজি", "কম্পিউটেশনাল লিঙ্গুইস্টিকস"],
    intakes: ["উইন্টার (Winter)"],
    bangladeshRequirementNote: "জার্মানির প্রাচীনতম বিশ্ববিদ্যালয় (১৩৮৬)। নন-ইইউ শিক্ষার্থীদের জন্য সেমিস্টারে €১,৫০০ টিউশন ফি প্রযোজ্য।",
    websiteUrl: "https://www.uni-heidelberg.de",
    officialAdmissionUrl: "https://www.uni-heidelberg.de/en/study/international-students",
    highlightTag: "প্রাচীনতম ঐতিহ্য • বিশ্বমানের গবেষণা",
  },

  // United Kingdom
  {
    id: "manchester",
    nameEn: "University of Manchester",
    nameBn: "ম্যানচেস্টার বিশ্ববিদ্যালয়",
    countryCode: "GB",
    countryNameBn: "যুক্তরাজ্য (ইউকে)",
    flag: "🇬🇧",
    city: "Manchester",
    stateOrRegion: "Greater Manchester",
    worldRank: 32,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "£২৪,০০০ - £৩১,০০০ / বছর",
    annualTuitionBdtApprox: "৩৬,৮০,০০০ - ৪৭,৫০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["কম্পিউটার সায়েন্স", "অ্যারোস্পেস ইঞ্জিনিয়ারিং", "একাউন্টিং ও ফিন্যান্স", "পাবলিক হেলথ"],
    intakes: ["সেপ্টেম্বর (Fall / Autumn)"],
    bangladeshRequirementNote: "বাংলাদেশের ৪ বছরের স্বীকৃত স্নাতক ডিগ্রিধারীদের জন্য ন্যূনতম সিজিপিএ ৩.০০/৪.০০ (বা ফার্স্ট ক্লাস সমমান)।",
    websiteUrl: "https://www.manchester.ac.uk",
    officialAdmissionUrl: "https://www.manchester.ac.uk/study/international/country-specific-information/bangladesh/",
    highlightTag: "রাসেল গ্রুপ সদস্য • ২ বছরের PSW ভিসা",
  },
  {
    id: "edinburgh",
    nameEn: "University of Edinburgh",
    nameBn: "এডিনবরা বিশ্ববিদ্যালয়",
    countryCode: "GB",
    countryNameBn: "যুক্তরাজ্য (ইউকে)",
    flag: "🇬🇧",
    city: "Edinburgh",
    stateOrRegion: "Scotland",
    worldRank: 22,
    isPublic: true,
    minIelts: 7.0,
    annualTuitionLocal: "£২৫,০০০ - £৩৫,০০০ / বছর",
    annualTuitionBdtApprox: "৩৮,০০,০০০ - ৫৩,৫০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["আর্টিফিশিয়াল ইন্টেলিজেন্স", "ডাটা সায়েন্স", "ইনফরমেটিক্স", "বায়োমেডিক্যাল সায়েন্স"],
    intakes: ["সেপ্টেম্বর"],
    bangladeshRequirementNote: "সিজিপিএ ৩.২৫+ এবং স্ট্রং স্টেটমেন্ট অব পারপাস (SOP) আবশ্যক। শেভেনিং স্কলারশিপের অন্যতম প্রধান পার্টনার।",
    websiteUrl: "https://www.ed.ac.uk",
    officialAdmissionUrl: "https://www.ed.ac.uk/studying/international",
    highlightTag: "গ্লোবাল টপ ২৫ • স্কটল্যান্ডের ঐতিহ্য",
  },
  {
    id: "bristol",
    nameEn: "University of Bristol",
    nameBn: "ব্রিস্টল বিশ্ববিদ্যালয়",
    countryCode: "GB",
    countryNameBn: "যুক্তরাজ্য (ইউকে)",
    flag: "🇬🇧",
    city: "Bristol",
    stateOrRegion: "South West England",
    worldRank: 55,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "£২২,০০০ - £২৮,৫০০ / বছর",
    annualTuitionBdtApprox: "৩৩,৭০,০০০ - ৪৩,৭০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["সিভিল ইঞ্জিনিয়ারিং", "অর্থনীতি", "ল (Law)", "এনভায়রনমেন্টাল সায়েন্স"],
    intakes: ["সেপ্টেম্বর"],
    bangladeshRequirementNote: "বাংলাদেশি শিক্ষার্থীদের জন্য 'Think Big' স্কলারশিপের মাধ্যমে সর্বোচ্চ £১৩,০০০ পর্যন্ত টিউশন ওয়েভার পাওয়া সম্ভব।",
    websiteUrl: "https://www.bristol.ac.uk",
    officialAdmissionUrl: "https://www.bristol.ac.uk/international/countries/bangladesh.html",
    highlightTag: "থিংক বিগ স্কলারশিপ সুবিধা",
  },
  {
    id: "oxford",
    nameEn: "University of Oxford",
    nameBn: "অক্সফোর্ড বিশ্ববিদ্যালয়",
    countryCode: "GB",
    countryNameBn: "যুক্তরাজ্য (ইউকে)",
    flag: "🇬🇧",
    city: "Oxford",
    stateOrRegion: "Oxfordshire",
    worldRank: 3,
    isPublic: true,
    minIelts: 7.5,
    annualTuitionLocal: "£৩১,০০০ - £৪৪,০০০ / বছর",
    annualTuitionBdtApprox: "৪৭,৬০,০০০ - ৬৭,৫০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["পলিটিক্স ও দর্শন (PPE)", "কম্পিউটার সায়েন্স", "বায়োমেডিকেল সায়েন্স", "পাবলিক পলিসি"],
    intakes: ["অক্টোবর"],
    bangladeshRequirementNote: "স্নাতকে অসাধারণ সিজিপিএ (৩.৭৫+), আন্তর্জাতিক পাবলিকেশন অথবা অসাধারণ নেতৃত্বগুণ থাকা আবশ্যক।",
    websiteUrl: "https://www.ox.ac.uk",
    officialAdmissionUrl: "https://www.ox.ac.uk/admissions/graduate/international-students",
    highlightTag: "বিশ্বের শীর্ষ ৩ • ক্ল্যারেনডন স্কলারশিপ",
  },

  // Canada
  {
    id: "toronto",
    nameEn: "University of Toronto",
    nameBn: "টরোন্টো বিশ্ববিদ্যালয়",
    countryCode: "CA",
    countryNameBn: "কানাডা",
    flag: "🇨🇦",
    city: "Toronto",
    stateOrRegion: "Ontario",
    worldRank: 21,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "CAD $৪০,০০০ - $৬০,০০০ / বছর",
    annualTuitionBdtApprox: "৩৪,৮০,০০০ - ৫২,২০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["মেশিন লার্নিং ও সিএস", "রোটম্যান ফিন্যান্স", "মেডিসিন", "রোবোটিক্স"],
    intakes: ["সেপ্টেম্বর (Fall)", "জানুয়ারি (Spring)"],
    bangladeshRequirementNote: "স্নাতকে ন্যূনতম প্রথম শ্রেণি / সিজিপিএ ৩.২০+। আইইএলটিএসে প্রতি ব্যান্ডে ন্যূনতম ৬.০ আবশ্যক। ৩ বছর PGWP ওয়ার্ক পারমিট।",
    websiteUrl: "https://www.utoronto.ca",
    officialAdmissionUrl: "https://future.utoronto.ca/apply/international/",
    highlightTag: "কানাডার এক নম্বর • ৩ বছর ওয়ার্ক পারমিট",
  },
  {
    id: "ubc",
    nameEn: "University of British Columbia (UBC)",
    nameBn: "ব্রিটিশ কলাম্বিয়া বিশ্ববিদ্যালয় (ইউবিসি)",
    countryCode: "CA",
    countryNameBn: "কানাডা",
    flag: "🇨🇦",
    city: "Vancouver",
    stateOrRegion: "British Columbia",
    worldRank: 34,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "CAD $৩৮,০০০ - $৫০,০০০ / বছর",
    annualTuitionBdtApprox: "৩৩,০০,০০০ - ৪৩,৫০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["সফটওয়্যার ইঞ্জিনিয়ারিং", "ফরেস্ট্রি", "আন্তর্জাতিক সম্পর্ক", "ডাটা সায়েন্স"],
    intakes: ["সেপ্টেম্বর", "জানুয়ারি"],
    bangladeshRequirementNote: "স্নাতক ও স্নাতকোত্তর উভয়ের জন্য ফুল-ফান্ডেড ও আংশিক স্কলারশিপ (International Major Entrance Scholarship) রয়েছে।",
    websiteUrl: "https://www.ubc.ca",
    officialAdmissionUrl: "https://you.ubc.ca/applying-ubc/international-high-schools-requirements/",
    highlightTag: "ভ্যাঙ্কুভার উপকূল • সমৃদ্ধ রিসার্চ হাব",
  },
  {
    id: "waterloo",
    nameEn: "University of Waterloo",
    nameBn: "ওয়াটারলু বিশ্ববিদ্যালয়",
    countryCode: "CA",
    countryNameBn: "কানাডা",
    flag: "🇨🇦",
    city: "Waterloo",
    stateOrRegion: "Ontario",
    worldRank: 112,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "CAD $৩৬,০০০ - $৪৮,০০০ / বছর",
    annualTuitionBdtApprox: "৩১,৩০,০০০ - ৪১,৭৫,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["কম্পিউটার সায়েন্স (কো-অপ)", "সফটওয়্যার ইঞ্জিনিয়ারিং", "অ্যাকচুয়ারি সায়েন্স", "কোয়ান্টাম কম্পিউটিং"],
    intakes: ["সেপ্টেম্বর", "জানুয়ারি"],
    bangladeshRequirementNote: "বিশ্বখ্যাত Co-op প্রোগ্রামের মাধ্যমে পড়াশোনাকালীন সময়েই উত্তর আমেরিকার শীর্ষ টেক কোম্পানিতে ইন্টার্নশিপ ও উপার্জনের সুযোগ।",
    websiteUrl: "https://uwaterloo.ca",
    officialAdmissionUrl: "https://uwaterloo.ca/future-students/international-students",
    highlightTag: "বিশ্বের বৃহত্তম Co-op ইন্টার্নশিপ প্রোগ্রাম",
  },
  {
    id: "alberta",
    nameEn: "University of Alberta",
    nameBn: "অ্যালবার্টা বিশ্ববিদ্যালয়",
    countryCode: "CA",
    countryNameBn: "কানাডা",
    flag: "🇨🇦",
    city: "Edmonton",
    stateOrRegion: "Alberta",
    worldRank: 111,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "CAD $২৯,০০০ - $৩৭,০০০ / বছর",
    annualTuitionBdtApprox: "২৫,২০,০০০ - ৩২,১৯,০০০ টাকা",
    tuitionTier: "moderate",
    topPrograms: ["পেট্রোলিয়াম ও মাইন ইঞ্জিনিয়ারিং", "এগ্রিকালচারাল সায়েন্স", "এআই ও রিইনফোর্সমেন্ট লার্নিং"],
    intakes: ["সেপ্টেম্বর"],
    bangladeshRequirementNote: "অ্যালবার্টা প্রদেশে তুলনামূলক কম ট্যাক্স ও সস্তা জীবনযাত্রার ব্যয়। আন্তর্জাতিক শিক্ষার্থীদের জন্য মেধা স্কলারশিপ সহজলভ্য।",
    websiteUrl: "https://www.ualberta.ca",
    officialAdmissionUrl: "https://www.ualberta.ca/admissions/international/index.html",
    highlightTag: "কম লিভিং কস্ট • মেধা স্কলারশিপ",
  },

  // Australia
  {
    id: "melbourne",
    nameEn: "University of Melbourne",
    nameBn: "মেলবোর্ন বিশ্ববিদ্যালয়",
    countryCode: "AU",
    countryNameBn: "অস্ট্রেলিয়া",
    flag: "🇦🇺",
    city: "Melbourne",
    stateOrRegion: "Victoria",
    worldRank: 13,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "AUD $৪২,০০০ - $৫০,০০০ / বছর",
    annualTuitionBdtApprox: "৩২,৯০,০০০ - ৩৯,২০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["ইনফরমেশন টেকনোলজি", "বায়োমেডিক্যাল ইঞ্জিনিয়ারিং", "বিজনেস ম্যানেজমেন্ট", "আর্কিটেকচার"],
    intakes: ["ফেব্রুয়ারি (Semester 1)", "জুলাই (Semester 2)"],
    bangladeshRequirementNote: "গ্রুপ অব এইট (Go8) সদস্য। ডিগ্রি শেষে মেলবোর্নে ২ বছরের সাবক্লাস ৪৮৫ পোস্ট-স্টাডি ওয়ার্ক ভিসা।",
    websiteUrl: "https://www.unimelb.edu.au",
    officialAdmissionUrl: "https://study.unimelb.edu.au/how-to-apply/international-applications",
    highlightTag: "অস্ট্রেলিয়ার এক নম্বর • গ্রুপ অব এইট",
  },
  {
    id: "sydney",
    nameEn: "University of Sydney",
    nameBn: "সিডনি বিশ্ববিদ্যালয়",
    countryCode: "AU",
    countryNameBn: "অস্ট্রেলিয়া",
    flag: "🇦🇺",
    city: "Sydney",
    stateOrRegion: "New South Wales",
    worldRank: 19,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "AUD $৪৫,০০০ - $৫২,০০০ / বছর",
    annualTuitionBdtApprox: "৩৫,৩০,০০০ - ৪০,৮০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["প্রজেক্ট ম্যানেজমেন্ট", "ডাটা সায়েন্স", "ফার্মাসি", "ফিন্যান্স"],
    intakes: ["ফেব্রুয়ারি", "জুলাই"],
    bangladeshRequirementNote: "স্নাতক সিজিপিএ ৩.০০+ এবং ২০% পর্যন্ত আন্তর্জাতিক স্কলারশিপের সুযোগ রয়েছে।",
    websiteUrl: "https://www.sydney.edu.au",
    officialAdmissionUrl: "https://www.sydney.edu.au/study/applying/how-to-apply/international-students.html",
    highlightTag: "বিশ্বের শীর্ষ ২০ • অসাধারণ ক্যারিয়ার আউটকাম",
  },
  {
    id: "unsw",
    nameEn: "UNSW Sydney",
    nameBn: "নিউ সাউথ ওয়েলস বিশ্ববিদ্যালয় (ইউএনএসডব্লিউ)",
    countryCode: "AU",
    countryNameBn: "অস্ট্রেলিয়া",
    flag: "🇦🇺",
    city: "Sydney",
    stateOrRegion: "New South Wales",
    worldRank: 19,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "AUD $৪৪,০০০ - $৫৩,০০০ / বছর",
    annualTuitionBdtApprox: "৩৪,৫০,০০০ - ৪১,৬০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["রিনিউয়েবল এনার্জি", "সিভিল ও স্ট্রাকচারাল", "সফটওয়্যার সিস্টেমস"],
    intakes: ["ফেব্রুয়ারি (Term 1)", "জুন (Term 2)", "সেপ্টেম্বর (Term 3)"],
    bangladeshRequirementNote: "ইউএনএসডব্লিউ-এর ৩-টার্ম সিস্টেম থাকায় বছরে ৩ বার শুরু করার সুযোগ পাওয়া যায়।",
    websiteUrl: "https://www.unsw.edu.au",
    officialAdmissionUrl: "https://www.unsw.edu.au/study/how-to-apply/international",
    highlightTag: "ইঞ্জিনিয়ারিং ও এন্টারপ্রেনারশিপ লিডার",
  },

  // United States
  {
    id: "asu",
    nameEn: "Arizona State University",
    nameBn: "অ্যারিজোনা স্টেট ইউনিভার্সিটি",
    countryCode: "US",
    countryNameBn: "যুক্তরাষ্ট্র (ইউএসএ)",
    flag: "🇺🇸",
    city: "Tempe / Phoenix",
    stateOrRegion: "Arizona",
    worldRank: 150,
    isPublic: true,
    minIelts: 6.0,
    annualTuitionLocal: "USD $৩১,০০০ - $৩৬,০০০ / বছর",
    annualTuitionBdtApprox: "৩৭,৯৭,০০০ - ৪৪,১০,০০০ টাকা",
    tuitionTier: "moderate",
    topPrograms: ["ইনোভেশন ও এন্টারপ্রেনারশিপ", "কম্পিউটার সায়েন্স", "সাপ্লাই চেইন", "আইটি সিকিউরিটি"],
    intakes: ["আগস্ট (Fall)", "জানুয়ারি (Spring)"],
    bangladeshRequirementNote: "আইইএলটিএস ৬.০ গ্রহণযোগ্য। বাংলাদেশি স্নাতক শিক্ষার্থীদের জন্য সর্বোচ্চ $১৫,০০০/বছর পর্যন্ত New American University স্কলারশিপ প্রদান করে।",
    websiteUrl: "https://www.asu.edu",
    officialAdmissionUrl: "https://admission.asu.edu/international",
    highlightTag: "আইইএলটিএস ৬.০ গ্রহণ • আকর্ষণীয় স্কলারশিপ",
  },
  {
    id: "purdue",
    nameEn: "Purdue University",
    nameBn: "পারডু বিশ্ববিদ্যালয়",
    countryCode: "US",
    countryNameBn: "যুক্তরাষ্ট্র (ইউএসএ)",
    flag: "🇺🇸",
    city: "West Lafayette",
    stateOrRegion: "Indiana",
    worldRank: 99,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "USD $৩১,১০০ / বছর",
    annualTuitionBdtApprox: "৩৮,১০,০০০ টাকা",
    tuitionTier: "moderate",
    topPrograms: ["মেকানিক্যাল", "অ্যারোস্পেস ইঞ্জিনিয়ারিং", "কম্পিউটার সায়েন্স", "এগ্রিকালচারাল বায়োটেক"],
    intakes: ["আগস্ট (Fall)"],
    bangladeshRequirementNote: "গত ১২ বছর ধরে কোনো টিউশন ফি বাড়ায়নি (ফ্রিজড রেট)। STEM ডিগ্রির জন্য ৩৬ মাসের দীর্ঘ OPT কাজের সুযোগ।",
    websiteUrl: "https://www.purdue.edu",
    officialAdmissionUrl: "https://www.purdue.edu/admissions/international/apply/",
    highlightTag: "১২ বছর ধরে ফ্রোজেন টিউশন ফি • শীর্ষ STEM",
  },
  {
    id: "utaustin",
    nameEn: "University of Texas at Austin",
    nameBn: "ইউনিভার্সিটি অব টেক্সাস অ্যাট অস্টিন",
    countryCode: "US",
    countryNameBn: "যুক্তরাষ্ট্র (ইউএসএ)",
    flag: "🇺🇸",
    city: "Austin",
    stateOrRegion: "Texas",
    worldRank: 58,
    isPublic: true,
    minIelts: 6.5,
    annualTuitionLocal: "USD $৩৮,০০০ - $৪৬,০০০ / বছর",
    annualTuitionBdtApprox: "৪৬,৫৫,০০০ - ৫৬,৩৫,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["কম্পিউটার সিস্টেমস", "পেট্রোলিয়াম ইঞ্জিনিয়ারিং", "ম্যাককম্বস বিজনেস স্কুল"],
    intakes: ["আগস্ট (Fall)"],
    bangladeshRequirementNote: "অস্টিনকে বলা হয় সিলিকন হিলস—টেসলা, অ্যাপল, গুগল হাব থাকায় বিপুল ইন্টার্নশিপ ও চাকরির সুযোগ।",
    websiteUrl: "https://www.utexas.edu",
    officialAdmissionUrl: "https://admissions.utexas.edu/apply/international-students",
    highlightTag: "সিলিকন হিলসের কেন্দ্রবিন্দু",
  },
  {
    id: "harvard",
    nameEn: "Harvard University",
    nameBn: "হার্ভার্ড বিশ্ববিদ্যালয়",
    countryCode: "US",
    countryNameBn: "যুক্তরাষ্ট্র (ইউএসএ)",
    flag: "🇺🇸",
    city: "Cambridge",
    stateOrRegion: "Massachusetts",
    worldRank: 4,
    isPublic: false,
    minIelts: 7.5,
    annualTuitionLocal: "USD $৫৪,০০০ - $৬০,০০০ / বছর",
    annualTuitionBdtApprox: "৬৬,১৫,০০০ - ৭৩,৫০,০০০ টাকা",
    tuitionTier: "standard",
    topPrograms: ["পাবলিক পলিসি (কেনেডি স্কুল)", "ল (Law)", "বায়োমেডিক্যাল সায়েন্স", "এমবিএ"],
    intakes: ["আগস্ট (Fall)"],
    bangladeshRequirementNote: "Need-Blind ফাইনান্সিয়াল এইড: যোগ্য প্রার্থী নির্বাচিত হলে পরিবারের আয় অনুযায়ী টিউশন ও থাকা-খাওয়ার শতভাগ খরচ মওকুফ হতে পারে।",
    websiteUrl: "https://www.harvard.edu",
    officialAdmissionUrl: "https://www.harvard.edu/admissions-aid/",
    highlightTag: "আইভি লিগ • Need-Blind ১০০% আর্থিক অনুদান",
  },
];

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [showBdtOnly, setShowBdtOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const countryFilterOptions = [
    { code: "ALL", label: "সকল দেশ", flag: "🌍" },
    { code: "DE", label: "জার্মানি", flag: "🇩🇪" },
    { code: "GB", label: "যুক্তরাজ্য", flag: "🇬🇧" },
    { code: "CA", label: "কানাডা", flag: "🇨🇦" },
    { code: "AU", label: "অস্ট্রেলিয়া", flag: "🇦🇺" },
    { code: "US", label: "যুক্তরাষ্ট্র", flag: "🇺🇸" },
  ];

  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES_DATA.filter((uni) => {
      // Country filter
      if (selectedCountry !== "ALL" && uni.countryCode !== selectedCountry) {
        return false;
      }
      // Tuition tier filter
      if (selectedTier === "free" && uni.tuitionTier !== "free") {
        return false;
      }
      if (selectedTier === "moderate" && uni.tuitionTier === "standard") {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          uni.nameEn.toLowerCase().includes(q) ||
          uni.nameBn.toLowerCase().includes(q) ||
          uni.city.toLowerCase().includes(q) ||
          uni.countryNameBn.toLowerCase().includes(q) ||
          uni.topPrograms.some((p) => p.toLowerCase().includes(q));
        if (!matchesName) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCountry, selectedTier]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-white to-slate-50 pt-12 pb-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-semibold mb-4 border border-brand-200">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>১০০% অফিসিয়াল সরকারি ও বিশ্ববিদ্যালয় পোর্টাল লিঙ্কিং</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              শীর্ষ আন্তর্জাতিক <span className="text-brand-700">বিশ্ববিদ্যালয় ক্যাটালগ</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও যুক্তরাষ্ট্রের শীর্ষ পাবলিক প্রতিষ্ঠানসমূহের এন্ট্রি রিকোয়ারমেন্টস, আইইএলটিএস কাট-অফ এবং বাংলাদেশি কারিকুলামের প্রযোজ্য শর্তাবলী খুঁজুন।
            </p>
          </div>

          {/* Search Bar & Primary Filters */}
          <div className="mt-8 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search text field */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="বিশ্ববিদ্যালয়ের নাম, শহর, বা বিষয় (যেমন: কম্পিউটার সায়েন্স, মেকানিক্যাল)..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Tuition mode filter */}
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="py-3 px-4 rounded-xl border border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">সকল টিউশন ফি ক্যাটাগরি</option>
                <option value="free">টিউশন ফ্রি (জার্মানি পাবলিক)</option>
                <option value="moderate">লো-কস্ট / সাশ্রয়ী বাজেট</option>
              </select>

              {/* Currency View Switcher */}
              <button
                type="button"
                onClick={() => setShowBdtOnly(!showBdtOnly)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  showBdtOnly
                    ? "bg-brand-50 border-brand-500 text-brand-800"
                    : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <DollarSign className="w-4 h-4 text-brand-700" />
                <span>{showBdtOnly ? "টাকায় হিসাব চালু" : "টাকায় আনুমানিক হিসাব"}</span>
              </button>
            </div>

            {/* Country Pill Selector */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>দেশ ফিল্টার:</span>
              </span>
              {countryFilterOptions.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCountry === c.code
                      ? "bg-brand-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Results status counter */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-medium text-slate-600">
            মোট <span className="font-bold text-brand-700">{filteredUniversities.length}</span> টি সরকারি ও ভেরিফাইড প্রতিষ্ঠান পাওয়া গেছে
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            * টিউশন ফি ও এন্ট্রি রিকোয়ারমেন্ট অফিসিয়াল পোর্টাল অনুযায়ী প্রতি সেশনে পরিবর্তিত হতে পারে
          </div>
        </div>

        {/* Universities Grid */}
        {filteredUniversities.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">কোনো বিশ্ববিদ্যালয় খুঁজে পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 mt-1">
              অনুগ্রহ করে অন্য কোনো নাম বা ফিল্টার ব্যবহার করে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCountry("ALL");
                setSelectedTier("ALL");
              }}
              className="mt-4 px-4 py-2 bg-brand-700 text-white text-xs font-bold rounded-lg"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUniversities.map((uni) => {
              const isExpanded = expandedId === uni.id;
              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-lg">{uni.flag}</span>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                            {uni.countryNameBn}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {uni.city}, {uni.stateOrRegion}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-700">
                          {uni.nameBn}
                        </h2>
                        <h3 className="text-xs text-slate-500 font-medium">{uni.nameEn}</h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>QS #{uni.worldRank}</span>
                        </span>
                      </div>
                    </div>

                    {/* Tag badge */}
                    <div className="mt-3">
                      <span className="inline-block text-[11px] font-semibold text-brand-800 bg-brand-50 px-2.5 py-1 rounded border border-brand-200">
                        {uni.highlightTag}
                      </span>
                    </div>

                    {/* Key Stats Row */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">বার্ষিক টিউশন ফি:</span>
                        <span className="font-bold text-slate-900 block truncate">
                          {showBdtOnly ? uni.annualTuitionBdtApprox : uni.annualTuitionLocal}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">ন্যূনতম IELTS:</span>
                        <span className="font-bold text-slate-900 block">{uni.minIelts} সামগ্রিক</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block text-[11px]">ইনটেকসমূহ:</span>
                        <span className="font-bold text-slate-900 block truncate">{uni.intakes[0]}</span>
                      </div>
                    </div>

                    {/* Popular Subjects */}
                    <div className="mt-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        জনপ্রিয় প্রোগ্রামসমূহ:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {uni.topPrograms.map((p, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Bangladesh Criteria note */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
                        <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-brand-700" />
                          <span>বাংলাদেশি শিক্ষার্থীদের জন্য বিশেষ শর্তাবলী:</span>
                        </div>
                        <p className="leading-relaxed">{uni.bangladeshRequirementNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : uni.id)}
                      className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 py-1"
                    >
                      <span>{isExpanded ? "সংক্ষেপ করুন" : "শর্তাবলী দেখুন"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={uni.officialAdmissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 transition-colors shadow-2xs"
                        title="বিশ্ববিদ্যালয়ের আন্তর্জাতিক অফিশিয়াল অ্যাডমিশন ওয়েবসাইট"
                      >
                        <span>অফিশিয়াল পোর্টাল</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>

                      <Link
                        href="/eligibility"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-lg transition-colors shadow-2xs"
                      >
                        <span>যোগ্যতা পরীক্ষা</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Info Callout Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-brand-900 text-brand-50 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">আপনার প্রোফাইলের সাথে এই বিশ্ববিদ্যালয়গুলো মানানসই?</h3>
            <p className="text-sm text-brand-200 max-w-xl">
              আমাদের ফ্রি অ্যালগরিদম আপনার জিপিএ, আইইএলটিএস ব্যান্ড এবং বাজেট বিশ্লেষণ করে তাৎক্ষণিক জানিয়ে দেবে আপনি কোন বিশ্ববিদ্যালয়ে অফার পাওয়ার যোগ্য।
            </p>
          </div>
          <Link
            href="/eligibility"
            className="inline-flex items-center gap-2 bg-white text-brand-900 hover:bg-brand-50 font-bold px-6 py-3 rounded-xl transition-colors shrink-0 text-sm"
          >
            <span>ফ্রি ম্যাচিং টেস্ট দিন</span>
            <ArrowRight className="w-4 h-4 text-brand-700" />
          </Link>
        </div>
      </section>
    </div>
  );
}
