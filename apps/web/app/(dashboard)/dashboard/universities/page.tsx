"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { formatBdt } from "@abroadmate/shared";
import {
  School,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Coins,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Globe2,
  ShieldCheck,
  BookOpen,
  Award,
  Layers,
  Trash2,
  Share2,
} from "lucide-react";

export interface UniversityItem {
  id: string;
  nameEn: string;
  nameBn: string;
  countryCode: string;
  countryName: string;
  flag: string;
  city: string;
  worldRank: number;
  degreeLevel: "master" | "bachelor";
  programTitle: string;
  programTitleBn: string;
  annualTuitionLocal: string;
  annualTuitionBdt: number;
  minIelts: number;
  minIeltsBand: number;
  minCgpa: number;
  category: "ambitious" | "target" | "safe";
  officialUrl: string;
  admissionPortalUrl: string;
  highlightsBn: string;
}

const UNIVERSITIES_DATA: UniversityItem[] = [
  {
    id: "edinburgh",
    nameEn: "University of Edinburgh",
    nameBn: "ইউনিভার্সিটি অব এডিনবরা",
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    city: "Edinburgh, Scotland",
    worldRank: 27,
    degreeLevel: "master",
    programTitle: "MSc in Computer Science",
    programTitleBn: "মাস্টার্স ইন কম্পিউটার সায়েন্স",
    annualTuitionLocal: "£38,500",
    annualTuitionBdt: 5910000,
    minIelts: 7.0,
    minIeltsBand: 6.5,
    minCgpa: 3.75,
    category: "ambitious",
    officialUrl: "https://www.ed.ac.uk",
    admissionPortalUrl: "https://www.ed.ac.uk/studying/postgraduate/degrees",
    highlightsBn: "বিশ্বখ্যাত রাসেল গ্রুপ বিশ্ববিদ্যালয়। চমৎকার এআই ও রোবটিক্স ল্যাব। শেভেনিং স্কলারশিপ পার্টনার।",
  },
  {
    id: "manchester",
    nameEn: "University of Manchester",
    nameBn: "ইউনিভার্সিটি অব ম্যানচেস্টার",
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    city: "Manchester, England",
    worldRank: 34,
    degreeLevel: "master",
    programTitle: "MSc Advanced Computer Science",
    programTitleBn: "মাস্টার্স ইন অ্যাডভান্সড কম্পিউটার সায়েন্স",
    annualTuitionLocal: "£36,000",
    annualTuitionBdt: 5526000,
    minIelts: 7.0,
    minIeltsBand: 6.5,
    minCgpa: 3.7,
    category: "ambitious",
    officialUrl: "https://www.manchester.ac.uk",
    admissionPortalUrl: "https://www.manchester.ac.uk/study/masters/courses/",
    highlightsBn: "রাসেল গ্রুপ প্রতিষ্ঠান। কম্পিউটার আর্কিটেকচার ও ডেটা সায়েন্সে বিশ্বের শীর্ষস্থানীয়।",
  },
  {
    id: "sheffield",
    nameEn: "University of Sheffield",
    nameBn: "ইউনিভার্সিটি অব শেফিল্ড",
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    city: "Sheffield, England",
    worldRank: 105,
    degreeLevel: "master",
    programTitle: "MSc in Data Analytics & AI",
    programTitleBn: "মাস্টার্স ইন ডেটা অ্যানালিটিক্স ও এআই",
    annualTuitionLocal: "£29,950",
    annualTuitionBdt: 4597000,
    minIelts: 6.5,
    minIeltsBand: 6.0,
    minCgpa: 3.5,
    category: "target",
    officialUrl: "https://www.sheffield.ac.uk",
    admissionPortalUrl: "https://www.sheffield.ac.uk/postgraduate/taught",
    highlightsBn: "সাশ্রয়ী জীবনযাত্রার শহর। আন্তর্জাতিক শিক্ষার্থীদের জন্য মেধাভিত্তিক £2,500 স্কলারশিপ ওয়েভার সহজলভ্য।",
  },
  {
    id: "coventry",
    nameEn: "Coventry University",
    nameBn: "কভেন্ট্রি ইউনিভার্সিটি",
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    city: "Coventry, England",
    worldRank: 550,
    degreeLevel: "master",
    programTitle: "MSc Software Development",
    programTitleBn: "মাস্টার্স ইন সফটওয়্যার ডেভেলপমেন্ট",
    annualTuitionLocal: "£19,850",
    annualTuitionBdt: 3046000,
    minIelts: 6.5,
    minIeltsBand: 5.5,
    minCgpa: 2.8,
    category: "safe",
    officialUrl: "https://www.coventry.ac.uk",
    admissionPortalUrl: "https://www.coventry.ac.uk/international-students-hub/",
    highlightsBn: "উচ্চ ভিসা সাকসেস রেট। সাশ্রয়ী টিউশন ফি ও £২,০০০ আর্লি পেমেন্ট ডিসকাউন্ট।",
  },
  {
    id: "ubc",
    nameEn: "University of British Columbia",
    nameBn: "ইউনিভার্সিটি অব ব্রিটিশ কলাম্বিয়া (UBC)",
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    city: "Vancouver, BC",
    worldRank: 38,
    degreeLevel: "master",
    programTitle: "Master of Data Science (MDS)",
    programTitleBn: "মাস্টার অব ডেটা সায়েন্স",
    annualTuitionLocal: "CAD $53,000",
    annualTuitionBdt: 4505000,
    minIelts: 7.0,
    minIeltsBand: 6.5,
    minCgpa: 3.7,
    category: "ambitious",
    officialUrl: "https://www.ubc.ca",
    admissionPortalUrl: "https://www.grad.ubc.ca/prospective-students",
    highlightsBn: "কানাডার শীর্ষ ৩ বিশ্ববিদ্যালয়ের একটি। ভ্যানকুভার টেক হাবের সন্নিকটে অবস্থিত।",
  },
  {
    id: "ottawa",
    nameEn: "University of Ottawa",
    nameBn: "ইউনিভার্সিটি অব অটোয়া",
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    city: "Ottawa, Ontario",
    worldRank: 203,
    degreeLevel: "master",
    programTitle: "MSc Computer Science (Applied AI)",
    programTitleBn: "মাস্টার্স ইন কম্পিউটার সায়েন্স (অ্যাপ্লাইড এআই)",
    annualTuitionLocal: "CAD $33,500",
    annualTuitionBdt: 2847000,
    minIelts: 6.5,
    minIeltsBand: 6.0,
    minCgpa: 3.4,
    category: "target",
    officialUrl: "https://www.uottawa.ca",
    admissionPortalUrl: "https://www.uottawa.ca/study/graduate-studies",
    highlightsBn: "রাজধানী অটোয়ায় অবস্থিত। কো-অপ (Co-op) পেইড ইন্টার্নশিপের সুযোগ। OGS স্কলারশিপ যোগ্য।",
  },
  {
    id: "alberta",
    nameEn: "University of Alberta",
    nameBn: "ইউনিভার্সিটি অব আলবার্টা",
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    city: "Edmonton, Alberta",
    worldRank: 111,
    degreeLevel: "master",
    programTitle: "MSc in Computing Science",
    programTitleBn: "মাস্টার্স ইন কম্পিউটিং সায়েন্স",
    annualTuitionLocal: "CAD $12,500",
    annualTuitionBdt: 1062000,
    minIelts: 7.0,
    minIeltsBand: 6.0,
    minCgpa: 3.5,
    category: "target",
    officialUrl: "https://www.ualberta.ca",
    admissionPortalUrl: "https://www.ualberta.ca/graduate-studies",
    highlightsBn: "কানাডার অন্যতম সাশ্রয়ী ও গবেষণাধর্মী বিশ্ববিদ্যালয়। আলবার্টা রিইনফোর্সমেন্ট লার্নিংয়ে বিশ্বসেরা।",
  },
  {
    id: "windsor",
    nameEn: "University of Windsor",
    nameBn: "ইউনিভার্সিটি অব উইন্ডসর",
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    city: "Windsor, Ontario",
    worldRank: 550,
    degreeLevel: "master",
    programTitle: "Master of Applied Computing (MAC)",
    programTitleBn: "মাস্টার অব অ্যাপ্লাইড কম্পিউটিং",
    annualTuitionLocal: "CAD $26,000",
    annualTuitionBdt: 2210000,
    minIelts: 6.5,
    minIeltsBand: 6.0,
    minCgpa: 3.0,
    category: "safe",
    officialUrl: "https://www.uwindsor.ca",
    admissionPortalUrl: "https://www.uwindsor.ca/graduate-studies/",
    highlightsBn: "প্র্যাক্টিক্যাল ৮ মাসের পেইড ইন্টার্নশিপ কারিকুলাম। বাংলাদেশি শিক্ষার্থীদের মধ্যে ব্যাপক জনপ্রিয়।",
  },
  {
    id: "tum",
    nameEn: "Technical University of Munich (TUM)",
    nameBn: "টেকনিক্যাল ইউনিভার্সিটি অব মিউনিখ (TUM)",
    countryCode: "DE",
    countryName: "Germany",
    flag: "🇩🇪",
    city: "Munich, Bavaria",
    worldRank: 28,
    degreeLevel: "master",
    programTitle: "MSc Informatics / Data Engineering",
    programTitleBn: "মাস্টার্স ইন ইনফরম্যাটিক্স / ডেটা ইঞ্জিনিয়ারিং",
    annualTuitionLocal: "€4,000 / year",
    annualTuitionBdt: 512000,
    minIelts: 6.5,
    minIeltsBand: 6.0,
    minCgpa: 3.6,
    category: "ambitious",
    officialUrl: "https://www.tum.de",
    admissionPortalUrl: "https://www.tum.de/en/studies/degree-programs",
    highlightsBn: "ইউরোপের সেরা প্রযুক্তি বিশ্ববিদ্যালয়। অতি স্বল্প টিউশন ফি। ইংরেজি মাধ্যমে পাঠদান।",
  },
  {
    id: "rwth",
    nameEn: "RWTH Aachen University",
    nameBn: "আরডব্লিউটিএইচ আখেন ইউনিভার্সিটি",
    countryCode: "DE",
    countryName: "Germany",
    flag: "🇩🇪",
    city: "Aachen, North Rhine-Westphalia",
    worldRank: 99,
    degreeLevel: "master",
    programTitle: "MSc Software Systems Engineering",
    programTitleBn: "মাস্টার্স ইন সফটওয়্যার সিস্টেমস",
    annualTuitionLocal: "€0 (Semester fee €320)",
    annualTuitionBdt: 82000,
    minIelts: 6.5,
    minIeltsBand: 6.0,
    minCgpa: 3.4,
    category: "target",
    officialUrl: "https://www.rwth-aachen.de",
    admissionPortalUrl: "https://www.rwth-aachen.de/cms/root/studium/vor-dem-studium/~bvw/studiengaenge/",
    highlightsBn: "সম্পূর্ণ টিউশন ফ্রি পাবলিক বিশ্ববিদ্যালয়! শুধু সেমিস্টার কন্ট্রিবিউশন প্রযোজ্য।",
  },
  {
    id: "melbourne",
    nameEn: "University of Melbourne",
    nameBn: "ইউনিভার্সিটি অব মেলবোর্ন",
    countryCode: "AU",
    countryName: "Australia",
    flag: "🇦🇺",
    city: "Melbourne, Victoria",
    worldRank: 13,
    degreeLevel: "master",
    programTitle: "Master of Information Technology",
    programTitleBn: "মাস্টার অব ইনফরমেশন টেকনোলজি",
    annualTuitionLocal: "AUD $54,000",
    annualTuitionBdt: 4320000,
    minIelts: 6.5,
    minIeltsBand: 6.0,
    minCgpa: 3.65,
    category: "ambitious",
    officialUrl: "https://www.unimelb.edu.au",
    admissionPortalUrl: "https://study.unimelb.edu.au",
    highlightsBn: "অস্ট্রেলিয়ার ১ নম্বর বিশ্ববিদ্যালয় (Group of Eight)। অস্ট্রেলিয়া অ্যাওয়ার্ডস স্কলারশিপ পার্টনার।",
  },
  {
    id: "uta",
    nameEn: "University of Texas at Arlington",
    nameBn: "ইউনিভার্সিটি অব টেক্সাস অ্যাট আরলিংটন (UTA)",
    countryCode: "US",
    countryName: "United States",
    flag: "🇺🇸",
    city: "Arlington, Texas",
    worldRank: 600,
    degreeLevel: "master",
    programTitle: "MS in Computer Science (STEM)",
    programTitleBn: "এমএস ইন কম্পিউটার সায়েন্স (STEM)",
    annualTuitionLocal: "$24,500",
    annualTuitionBdt: 2940000,
    minIelts: 6.5,
    minIeltsBand: 6.0,
    minCgpa: 3.0,
    category: "safe",
    officialUrl: "https://www.uta.edu",
    admissionPortalUrl: "https://www.uta.edu/admissions/apply",
    highlightsBn: "৩ বছরের STEM OPT এক্সটেনশন। টেক্সাস ইন-স্টেট টিউশন ওয়েভার স্কলারশিপ পাওয়া সহজ।",
  },
];

export default function UniversitiesPage() {
  const { locale } = useI18n();

  // Active Tab: "catalog" or "shortlist"
  const [activeTab, setActiveTab] = useState<"catalog" | "shortlist">("catalog");

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [maxBudgetBdt, setMaxBudgetBdt] = useState<number>(6000000);

  // Shortlisted items ID set
  const [shortlistIds, setShortlistIds] = useState<string[]>(["sheffield", "ottawa", "windsor"]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("abroadmate_shortlisted_unis");
      if (saved) {
        setShortlistIds(JSON.parse(saved));
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const toggleShortlist = (id: string) => {
    setShortlistIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem("abroadmate_shortlisted_unis", JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  // Filtered catalog
  const filteredUniversities = UNIVERSITIES_DATA.filter((uni) => {
    const matchesSearch =
      uni.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.nameBn.includes(searchQuery) ||
      uni.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = selectedCountry === "ALL" || uni.countryCode === selectedCountry;
    const matchesCategory = selectedCategory === "ALL" || uni.category === selectedCategory;
    const matchesBudget = uni.annualTuitionBdt <= maxBudgetBdt;

    return matchesSearch && matchesCountry && matchesCategory && matchesBudget;
  });

  const shortlistedList = UNIVERSITIES_DATA.filter((u) => shortlistIds.includes(u.id));

  // Category counts in shortlist
  const ambitiousCount = shortlistedList.filter((u) => u.category === "ambitious").length;
  const targetCount = shortlistedList.filter((u) => u.category === "target").length;
  const safeCount = shortlistedList.filter((u) => u.category === "safe").length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-2">
            <School className="w-3.5 h-3.5 text-brand-700" />
            <span>ভেরিফাইড উচ্চশিক্ষা ক্যাটালগ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            বিশ্ববিদ্যালয় ও প্রোগ্রাম অনুসন্ধান এবং আমার শর্টলিস্ট
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            যুক্তরাজ্য, কানাডা, জার্মানি, অস্ট্রেলিয়া ও আমেরিকার শীর্ষ বিশ্ববিদ্যালয়গুলোর টিউশন ফি, ভর্তির যোগ্যতা ও অফার পাওয়ার সম্ভাবনা যাচাই করে নিজস্ব শর্টলিস্ট সাজান।
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl shrink-0 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "catalog"
                ? "bg-white text-brand-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            সকল বিশ্ববিদ্যালয় ({UNIVERSITIES_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab("shortlist")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "shortlist"
                ? "bg-brand-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>আমার শর্টলিস্ট</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === "shortlist" ? "bg-white/20 text-white" : "bg-brand-100 text-brand-800"
              }`}
            >
              {shortlistIds.length}
            </span>
          </button>
        </div>
      </div>

      {/* Shortlist Summary Banner if Shortlist Tab is active */}
      {activeTab === "shortlist" && (
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white p-6 rounded-3xl shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-700/60">
            <div>
              <span className="text-xs text-brand-200 font-semibold block">আবেদন ব্যালান্স রিপোর্ট</span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                আপনার শর্টলিস্টে {shortlistIds.length}টি বিশ্ববিদ্যালয় সংরক্ষিত রয়েছে
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/eligibility"
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-colors"
              >
                যোগ্যতা পুনঃযাচাই
              </Link>
              <Link
                href="/dashboard/sop-builder"
                className="px-3.5 py-2 bg-white text-brand-950 rounded-xl text-xs font-bold hover:bg-brand-50 transition-colors"
              >
                SOP তৈরি শুরু করুন
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-[11px] text-rose-300 font-bold block">Ambitious (স্বপ্নদর্শী)</span>
              <span className="text-2xl font-black text-white mt-0.5 block">{ambitiousCount}টি</span>
              <span className="text-[10px] text-slate-300">হাই র্যাংকিং ও কঠোর প্রতিযোগিতা</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-[11px] text-amber-300 font-bold block">Target (কাঙ্ক্ষিত)</span>
              <span className="text-2xl font-black text-white mt-0.5 block">{targetCount}টি</span>
              <span className="text-[10px] text-slate-300">প্রোফাইলের সাথে সামঞ্জস্যপূর্ণ</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              <span className="text-[11px] text-emerald-300 font-bold block">Safe (নিরাপদ)</span>
              <span className="text-2xl font-black text-white mt-0.5 block">{safeCount}টি</span>
              <span className="text-[10px] text-slate-300">অফার পাওয়ার নিশ্চয়তা ৯৫%+</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বিশ্ববিদ্যালয়ের নাম, শহর বা প্রোগ্রাম দিয়ে খুঁজুন (যেমন: Sheffield, Data Science)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              মুছে ফেলুন
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Country Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">দেশ:</span>
            {[
              { code: "ALL", label: "সব দেশ" },
              { code: "GB", label: "🇬🇧 যুক্তরাজ্য" },
              { code: "CA", label: "🇨🇦 কানাডা" },
              { code: "DE", label: "🇩🇪 জার্মানি" },
              { code: "AU", label: "🇦🇺 অস্ট্রেলিয়া" },
              { code: "US", label: "🇺🇸 যুক্তরাষ্ট্র" },
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedCountry === c.code
                    ? "bg-brand-700 text-white font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Admission Probability Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">সম্ভাবনা:</span>
            {[
              { code: "ALL", label: "সব" },
              { code: "ambitious", label: "🔴 স্বপ্নদর্শী" },
              { code: "target", label: "🟡 কাঙ্ক্ষিত" },
              { code: "safe", label: "🟢 নিরাপদ" },
            ].map((cat) => (
              <button
                key={cat.code}
                onClick={() => setSelectedCategory(cat.code)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.code
                    ? "bg-slate-800 text-white font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* University Grid */}
      {activeTab === "shortlist" && shortlistedList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">আপনার শর্টলিস্টে এখনও কোনো বিশ্ববিদ্যালয় যুক্ত করা হয়নি</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            ক্যাটালগ থেকে আপনার পছন্দের বিশ্ববিদ্যালয়গুলোর বুকমার্ক আইকনে ক্লিক করে শর্টলিস্টে যোগ করুন।
          </p>
          <button
            onClick={() => setActiveTab("catalog")}
            className="px-5 py-2.5 bg-brand-700 text-white rounded-xl font-bold text-xs hover:bg-brand-800 transition-colors"
          >
            ক্যাটালগ ব্রাউজ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === "shortlist" ? shortlistedList : filteredUniversities).map((uni) => {
            const isSaved = shortlistIds.includes(uni.id);

            const categoryBadge = {
              ambitious: {
                label: "Ambitious (স্বপ্নদর্শী)",
                bg: "bg-rose-50 text-rose-800 border-rose-200",
                dot: "bg-rose-500",
              },
              target: {
                label: "Target (কাঙ্ক্ষিত)",
                bg: "bg-amber-50 text-amber-800 border-amber-200",
                dot: "bg-amber-500",
              },
              safe: {
                label: "Safe (নিরাপদ)",
                bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
                dot: "bg-emerald-500",
              },
            }[uni.category];

            return (
              <div
                key={uni.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Flag, World Rank & Shortlist Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{uni.flag}</span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {uni.nameBn}
                        </h3>
                        <span className="text-xs text-slate-500 block leading-tight mt-0.5">
                          {uni.nameEn}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleShortlist(uni.id)}
                      title={isSaved ? "শর্টলিস্ট থেকে বাদ দিন" : "শর্টলিস্টে রাখুন"}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? "bg-brand-50 border-brand-300 text-brand-700 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:text-brand-700 hover:bg-slate-100"
                      }`}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-5 h-5 fill-brand-700" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Meta badges: Location & Rank */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{uni.city}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      <Award className="w-3 h-3 text-amber-600" />
                      <span>QS র‍্যাংক: #{uni.worldRank}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md border text-[10px] ${categoryBadge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${categoryBadge.dot}`} />
                      <span>{categoryBadge.label}</span>
                    </span>
                  </div>

                  {/* Program & Academic Specs */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">প্রোগ্রাম:</span>
                      <span className="font-bold text-slate-900 text-right">{uni.programTitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">বার্ষিক টিউশন ফি:</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">{uni.annualTuitionLocal}</span>
                        <span className="text-[10px] text-slate-500 block">
                          (~ {formatBdt(uni.annualTuitionBdt, "bn")})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 font-medium">ন্যূনতম আইইএলটিএস:</span>
                      <span className="font-bold text-slate-800">
                        {uni.minIelts} (প্রতিটি ব্যান্ড {uni.minIeltsBand})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">ন্যূনতম সিজিপিএ:</span>
                      <span className="font-bold text-slate-800">{uni.minCgpa.toFixed(2)} / ৪.০০</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    💡 {uni.highlightsBn}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={uni.admissionPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
                  >
                    <span>ভর্তি পোর্টাল</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleShortlist(uni.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSaved
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-brand-700 text-white hover:bg-brand-800 shadow-2xs"
                      }`}
                    >
                      {isSaved ? "শর্টলিস্ট করা আছে" : "+ শর্টলিস্টে যোগ করুন"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
