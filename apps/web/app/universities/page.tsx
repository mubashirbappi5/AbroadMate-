"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  Clock,
  Layers,
  Heart,
  Calendar,
} from "lucide-react";
import { formatBdt, COUNTRY_LIST } from "@abroadmate/shared";

interface UniversityItem {
  id: string;
  nameEn: string;
  nameBn: string;
  countryCode: string;
  city: string;
  stateOrProvince?: string;
  worldRank?: number;
  websiteUrl: string;
  admissionsUrl?: string;
  applicationUrl?: string;
  institutionType: string;
  accreditationDetailsBn?: string;
  recognizingAuthority?: string;
  institutionRegistryCode?: string;
  internationalStudentUrl?: string;
  verificationStatus: string;
  isRecognized: boolean;
  isPublic: boolean;
  officialSourceUrl: string;
  country?: {
    code: string;
    nameEn: string;
    nameBn: string;
    flagEmoji: string;
    currencyCode: string;
    currencySymbol: string;
    approxBdtRate: number;
  };
  _count?: {
    programs: number;
  };
}

interface ProgramItem {
  id: string;
  titleEn: string;
  titleBn: string;
  degreeLevel: string;
  subjectCategory: string;
  department: string;
  durationMonths: number;
  studyMode: string;
  annualTuitionAmount: number;
  tuitionCurrencyCode: string;
  approxTuitionBdt?: number;
  prerequisitesBn?: string;
  officialProgramUrl?: string;
  officialSourceUrl: string;
  university: {
    id: string;
    nameEn: string;
    nameBn: string;
    city: string;
    countryCode: string;
    country?: {
      flagEmoji: string;
      nameBn: string;
      approxBdtRate: number;
    };
  };
  admissionRequirements?: {
    minGpaOrCgpa: number;
    gpaScale: number;
    minIeltsOverall: number;
    minIeltsEachBand: number;
    notesBn?: string;
  };
}

interface FavoriteItem {
  id: string;
  itemType: "UNIVERSITY" | "PROGRAM";
  universityId?: string;
  programId?: string;
  category: "AMBITIOUS" | "TARGET" | "SAFE";
  notes?: string;
  university?: any;
  program?: any;
}

const FALLBACK_UNIVERSITIES: UniversityItem[] = [
  {
    id: "tum-de",
    nameEn: "Technical University of Munich (TUM)",
    nameBn: "মিউনিখ টেকনিক্যাল ইউনিভার্সিটি",
    countryCode: "DE",
    city: "Munich",
    stateOrProvince: "Bavaria",
    worldRank: 28,
    websiteUrl: "https://www.tum.de",
    admissionsUrl: "https://www.tum.de/en/studies/application",
    institutionType: "PUBLIC_RESEARCH",
    accreditationDetailsBn: "জার্মানির শীর্ষ এক্সিলেন্স ইনিশিয়েটিভপ্রাপ্ত টেকনিক্যাল বিশ্ববিদ্যালয়। Anabin স্ট্যাটাস H+।",
    recognizingAuthority: "Kultusministerkonferenz (KMK) Anabin",
    institutionRegistryCode: "Anabin ID H+",
    verificationStatus: "VERIFIED",
    isRecognized: true,
    isPublic: true,
    officialSourceUrl: "https://www.tum.de/en/studies/international-students",
    country: {
      code: "DE",
      nameEn: "Germany",
      nameBn: "জার্মানি",
      flagEmoji: "🇩🇪",
      currencyCode: "EUR",
      currencySymbol: "€",
      approxBdtRate: 130.0,
    },
    _count: { programs: 1 },
  },
  {
    id: "manchester-gb",
    nameEn: "University of Manchester",
    nameBn: "ম্যানচেস্টার বিশ্ববিদ্যালয়",
    countryCode: "GB",
    city: "Manchester",
    worldRank: 34,
    websiteUrl: "https://www.manchester.ac.uk",
    admissionsUrl: "https://www.manchester.ac.uk/study/international/admissions/",
    institutionType: "PUBLIC_RESEARCH",
    accreditationDetailsBn: "যুক্তরাজ্যের রয়্যাল চার্টার প্রাপ্ত ও রাসেল গ্রুপভুক্ত সরকারি গবেষণা বিশ্ববিদ্যালয়। HESA স্বীকৃত।",
    recognizingAuthority: "UK Office for Students / HESA",
    institutionRegistryCode: "UKPRN 10007798",
    verificationStatus: "VERIFIED",
    isRecognized: true,
    isPublic: true,
    officialSourceUrl: "https://www.manchester.ac.uk/study/international/country-specific-information/bangladesh/",
    country: {
      code: "GB",
      nameEn: "United Kingdom",
      nameBn: "যুক্তরাজ্য",
      flagEmoji: "🇬🇧",
      currencyCode: "GBP",
      currencySymbol: "£",
      approxBdtRate: 153.5,
    },
    _count: { programs: 2 },
  },
  {
    id: "toronto-ca",
    nameEn: "University of Toronto",
    nameBn: "টরন্টো বিশ্ববিদ্যালয়",
    countryCode: "CA",
    city: "Toronto",
    stateOrProvince: "Ontario",
    worldRank: 21,
    websiteUrl: "https://www.utoronto.ca",
    admissionsUrl: "https://future.utoronto.ca/apply/",
    institutionType: "PUBLIC_RESEARCH",
    accreditationDetailsBn: "কানাডার শীর্ষস্থানীয় সরকারি প্রতিষ্ঠান। IRCC ভেরিফাইড DLI প্রতিষ্ঠান।",
    recognizingAuthority: "IRCC Canada",
    institutionRegistryCode: "DLI # O19332718824",
    verificationStatus: "VERIFIED",
    isRecognized: true,
    isPublic: true,
    officialSourceUrl: "https://future.utoronto.ca/international-students/",
    country: {
      code: "CA",
      nameEn: "Canada",
      nameBn: "কানাডা",
      flagEmoji: "🇨🇦",
      currencyCode: "CAD",
      currencySymbol: "C$",
      approxBdtRate: 87.0,
    },
    _count: { programs: 1 },
  },
  {
    id: "melbourne-au",
    nameEn: "University of Melbourne",
    nameBn: "মেলবোর্ন বিশ্ববিদ্যালয়",
    countryCode: "AU",
    city: "Melbourne",
    stateOrProvince: "Victoria",
    worldRank: 13,
    websiteUrl: "https://www.unimelb.edu.au",
    admissionsUrl: "https://study.unimelb.edu.au/how-to-apply",
    institutionType: "PUBLIC_RESEARCH",
    accreditationDetailsBn: "অস্ট্রেলিয়ার শীর্ষ পাবলিক গবেষণা বিশ্ববিদ্যালয়। TEQSA ও CRICOS অনুমোদিত।",
    recognizingAuthority: "TEQSA Australia",
    institutionRegistryCode: "CRICOS Provider 00116K",
    verificationStatus: "VERIFIED",
    isRecognized: true,
    isPublic: true,
    officialSourceUrl: "https://study.unimelb.edu.au/how-to-apply/international-applications",
    country: {
      code: "AU",
      nameEn: "Australia",
      nameBn: "অস্ট্রেলিয়া",
      flagEmoji: "🇦🇺",
      currencyCode: "AUD",
      currencySymbol: "A$",
      approxBdtRate: 78.5,
    },
    _count: { programs: 1 },
  },
  {
    id: "umich-us",
    nameEn: "University of Michigan",
    nameBn: "মিশিগান বিশ্ববিদ্যালয়",
    countryCode: "US",
    city: "Ann Arbor",
    stateOrProvince: "Michigan",
    worldRank: 33,
    websiteUrl: "https://umich.edu",
    admissionsUrl: "https://rackham.umich.edu/admissions/",
    institutionType: "PUBLIC_RESEARCH",
    accreditationDetailsBn: "যুক্তরাষ্ট্রের শীর্ষ পাবলিক আইভি বিশ্ববিদ্যালয়। HLC এবং SEVP অনুমোদিত।",
    recognizingAuthority: "Higher Learning Commission / SEVP",
    institutionRegistryCode: "SEVP DET214F00388000",
    verificationStatus: "VERIFIED",
    isRecognized: true,
    isPublic: true,
    officialSourceUrl: "https://internationalcenter.umich.edu/",
    country: {
      code: "US",
      nameEn: "United States",
      nameBn: "যুক্তরাষ্ট্র",
      flagEmoji: "🇺🇸",
      currencyCode: "USD",
      currencySymbol: "$",
      approxBdtRate: 122.5,
    },
    _count: { programs: 1 },
  },
];

export default function UniversitiesDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<"universities" | "programs" | "shortlist">("universities");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedDegree, setSelectedDegree] = useState<string>("ALL");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<string>("ALL");
  const [onlyPublic, setOnlyPublic] = useState(false);

  const [universities, setUniversities] = useState<UniversityItem[]>(FALLBACK_UNIVERSITIES);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    async function loadDiscoveryData() {
      try {
        setLoading(true);
        // Load Universities
        const uniRes = await fetch("/api/discovery/universities?limit=50");
        const uniJson = await uniRes.json();
        if (uniJson.success && uniJson.data?.length > 0) {
          setUniversities(uniJson.data);
        }

        // Load Programs
        const progRes = await fetch("/api/discovery/programs?limit=50");
        const progJson = await progRes.json();
        if (progJson.success && progJson.data?.length > 0) {
          setPrograms(progJson.data);
        }

        // Load Favorites
        const favRes = await fetch("/api/favorites");
        const favJson = await favRes.json();
        if (favJson.success && favJson.data) {
          setFavorites(favJson.data);
        }
      } catch (err) {
        console.error("Discovery fetch error, using fallbacks:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDiscoveryData();
  }, []);

  // Filter Universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      if (selectedCountry !== "ALL" && u.countryCode !== selectedCountry) return false;
      if (onlyPublic && !u.isPublic) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.nameEn.toLowerCase().includes(q) || u.nameBn.includes(q);
        const matchesCity = u.city.toLowerCase().includes(q);
        if (!matchesName && !matchesCity) return false;
      }
      return true;
    });
  }, [universities, selectedCountry, onlyPublic, searchQuery]);

  // Filter Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (selectedCountry !== "ALL" && p.university?.countryCode !== selectedCountry) return false;
      if (selectedDegree !== "ALL" && p.degreeLevel !== selectedDegree) return false;
      if (selectedSubject !== "ALL" && p.subjectCategory !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.titleEn.toLowerCase().includes(q) || p.titleBn.includes(q);
        const matchesUni = p.university.nameEn.toLowerCase().includes(q);
        if (!matchesTitle && !matchesUni) return false;
      }
      if (selectedBudgetTier === "free") {
        if (p.annualTuitionAmount > 0) return false;
      } else if (selectedBudgetTier === "under_20l") {
        if ((p.approxTuitionBdt || 0) > 2000000 || p.annualTuitionAmount === 0) return false;
      } else if (selectedBudgetTier === "under_35l") {
        if ((p.approxTuitionBdt || 0) > 3500000 || (p.approxTuitionBdt || 0) < 2000000) return false;
      } else if (selectedBudgetTier === "above_35l") {
        if ((p.approxTuitionBdt || 0) <= 3500000) return false;
      }
      return true;
    });
  }, [programs, selectedCountry, selectedDegree, selectedSubject, selectedBudgetTier, searchQuery]);

  // Handle Save to Shortlist
  const handleToggleFavorite = async (itemType: "UNIVERSITY" | "PROGRAM", targetId: string, category: "AMBITIOUS" | "TARGET" | "SAFE" = "TARGET") => {
    const existing = favorites.find((f) =>
      itemType === "UNIVERSITY" ? f.universityId === targetId : f.programId === targetId
    );

    if (existing) {
      // Remove
      try {
        const res = await fetch(`/api/favorites/${existing.id}`, { method: "DELETE" });
        if (res.ok) {
          setFavorites(favorites.filter((f) => f.id !== existing.id));
          setActionSuccess("শর্টলিস্ট থেকে সরানো হয়েছে।");
          setTimeout(() => setActionSuccess(null), 3000);
        }
      } catch (err) {
        console.error("Remove favorite error:", err);
      }
    } else {
      // Add
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemType, targetId, category }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setFavorites([json.data, ...favorites]);
          setActionSuccess("শর্টলিস্টে সফলভাবে যুক্ত হয়েছে!");
          setTimeout(() => setActionSuccess(null), 3000);
        } else {
          alert(json.error || "শর্টলিস্টে যোগ করতে লগইন করুন।");
        }
      } catch (err) {
        console.error("Add favorite error:", err);
      }
    }
  };

  const isFavorited = (itemType: "UNIVERSITY" | "PROGRAM", targetId: string) => {
    return favorites.some((f) =>
      itemType === "UNIVERSITY" ? f.universityId === targetId : f.programId === targetId
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/30 text-brand-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>শতভাগ সরকারি রেজিস্ট্রেশন ও অফিসিয়াল অ্যাক্রিডিটেশন ভেরিফাইড</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            বিশ্ববিদ্যালয় ও প্রোগ্রাম ডিসকভারি ডিরেক্টরি
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            কোনো এজেন্ট বা দালালের মিথ্যা আশ্বাস ছাড়া ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও যুক্তরাষ্ট্রের শীর্ষ বিশ্ববিদ্যালয়সমূহের অফিসিয়াল তথ্য, বাস্তব টিউশন ফি (টাকায় কনভার্টকৃত), এবং আইইএলটিএস যোগ্যতা যাচাই করুন।
          </p>
        </div>
      </div>

      {/* Global Action Toast */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("universities")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "universities"
                ? "bg-brand-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>বিশ্ববিদ্যালয় ক্যাটালগ ({filteredUniversities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("programs")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "programs"
                ? "bg-brand-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>প্রোগ্রাম ডিরেক্টরি ({filteredPrograms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shortlist")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "shortlist"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>আমার শর্টলিস্ট ({favorites.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>HESA • DLI • CRICOS • Anabin ভেরিফাইড</span>
        </div>
      </div>

      {/* 3. Search & Multi-Faceted Filters (Rendered when in catalog or programs tab) */}
      {activeTab !== "shortlist" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিশ্ববিদ্যালয়, শহর বা বিষয়ের নাম দিয়ে খুঁজুন (যেমন: Manchester, Toronto, AI)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* Public/Private Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPublic}
                  onChange={(e) => setOnlyPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <span>শুধু সরকারি / পাবলিক প্রতিষ্ঠান</span>
              </label>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {/* Country Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">দেশ:</span>
              <button
                onClick={() => setSelectedCountry("ALL")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedCountry === "ALL"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                সকল দেশ (৫)
              </button>
              {COUNTRY_LIST.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    selectedCountry === c.code
                      ? "bg-brand-700 text-white border-brand-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.nameBn}</span>
                </button>
              ))}
            </div>

            {/* Degree Level Selector (Shown for programs) */}
            {activeTab === "programs" && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">ডিগ্রি:</span>
                {[
                  { id: "ALL", label: "সকল ডিগ্রি" },
                  { id: "BACHELOR", label: "ব্যাচেলর (Bachelor)" },
                  { id: "MASTER", label: "মাস্টার্স (Master's)" },
                  { id: "PHD", label: "পিএইচডি (PhD)" },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDegree(d.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      selectedDegree === d.id
                        ? "bg-brand-700 text-white border-brand-700 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}

            {/* Budget Selector in BDT */}
            {activeTab === "programs" && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">টিউশন বাজেট (টাকায়):</span>
                {[
                  { id: "ALL", label: "সকল বাজেট" },
                  { id: "free", label: "টিউশন ফ্রি (€০ জার্মানি)" },
                  { id: "under_20l", label: "২০ লাখের নিচে" },
                  { id: "under_35l", label: "২০ থেকে ৩৫ লাখ" },
                  { id: "above_35l", label: "৩৫ লাখের বেশি" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBudgetTier(b.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      selectedBudgetTier === b.id
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Tab: Universities View */}
      {activeTab === "universities" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => {
              const favorited = isFavorited("UNIVERSITY", uni.id);
              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{uni.country?.flagEmoji || "🌍"}</span>
                        <span className="text-xs font-bold text-slate-600">
                          {uni.country?.nameBn || uni.countryCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {uni.worldRank && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-bold">
                            QS #{uni.worldRank}
                          </span>
                        )}
                        <button
                          onClick={() => handleToggleFavorite("UNIVERSITY", uni.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            favorited
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-600"
                          }`}
                          title="শর্টলিস্টে যুক্ত করুন"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* University Name */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                        {uni.nameBn}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{uni.nameEn}</p>
                    </div>

                    {/* City & State */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{uni.city}{uni.stateOrProvince ? `, ${uni.stateOrProvince}` : ""}</span>
                    </div>

                    {/* Official Accreditation Notice */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{uni.recognizingAuthority || "অফিসিয়াল সরকারি স্বীকৃতিপ্রাপ্ত"}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {uni.accreditationDetailsBn || "অফিসিয়াল সরকারি উচ্চশিক্ষা ডাটাবেজে অন্তর্ভুক্ত।"}
                      </p>
                      {uni.institutionRegistryCode && (
                        <p className="text-[10px] font-mono text-slate-500 pt-1">
                          রেজিস্ট্রি কোড: {uni.institutionRegistryCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <Link
                      href={`/universities/${uni.id}`}
                      className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={uni.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
                    >
                      <span>অফিসিয়াল সাইট</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Tab: Programs View */}
      {activeTab === "programs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => {
              const favorited = isFavorited("PROGRAM", prog.id);
              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-bold">
                        {prog.degreeLevel} • {prog.durationMonths} মাস
                      </span>

                      <button
                        onClick={() => handleToggleFavorite("PROGRAM", prog.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          favorited
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-600"
                        }`}
                        title="শর্টলিস্টে যুক্ত করুন"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Program Title */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                        {prog.titleBn}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{prog.titleEn}</p>
                    </div>

                    {/* University & Country */}
                    <div className="text-xs text-slate-700 space-y-0.5">
                      <p className="font-semibold">{prog.university.nameBn}</p>
                      <p className="text-slate-500 flex items-center gap-1">
                        <span>{prog.university.country?.flagEmoji}</span>
                        <span>{prog.university.city}, {prog.university.country?.nameBn}</span>
                      </p>
                    </div>

                    {/* Tuition Fee Breakdown */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">বার্ষিক টিউশন ফি</span>
                        <span className="text-sm font-bold text-brand-700">
                          {prog.annualTuitionAmount === 0 ? "টিউশন ফ্রি (€০)" : `${prog.tuitionCurrencyCode} ${prog.annualTuitionAmount.toLocaleString()}`}
                        </span>
                      </div>
                      {prog.approxTuitionBdt && prog.approxTuitionBdt > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">বাংলাদেশি টাকায় আনুমানিক</span>
                          <span className="text-xs font-bold text-slate-900">
                            {formatBdt(prog.approxTuitionBdt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Admission Requirements Snippet */}
                    {prog.admissionRequirements && (
                      <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400">মিনিমাম IELTS: </span>
                          <span className="font-bold text-slate-800">{prog.admissionRequirements.minIeltsOverall}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">CGPA: </span>
                          <span className="font-bold text-slate-800">
                            {prog.admissionRequirements.minGpaOrCgpa.toFixed(2)}/{prog.admissionRequirements.gpaScale.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <Link
                      href={`/programs/${prog.id}`}
                      className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                    >
                      <span>রিকোয়ারমেন্টস ও আবেদন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {prog.officialProgramUrl && (
                      <a
                        href={prog.officialProgramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
                      >
                        <span>কোর্স লিংক</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Tab: My Saved Shortlist */}
      {activeTab === "shortlist" && (
        <div className="space-y-6">
          <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-amber-600" />
                <span>আমার সংরক্ষিত শর্টলিস্ট (My University Shortlist)</span>
              </h2>
              <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
                আপনার পছন্দের বিশ্ববিদ্যালয় ও প্রোগ্রামগুলোকে ৩টি ক্যাটাগরিতে (অ্যাম্বিশিয়াস, টার্গেট, সেফ) ভাগ করে প্রস্তুতি নিন।
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white border border-amber-200 text-amber-900 font-bold text-xs">
              মোট সংরক্ষিত: {favorites.length}টি
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">এখনও কোনো শর্টলিস্ট তৈরি করেননি</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ক্যাটালগ ব্রাউজ করে আপনার পছন্দের বিশ্ববিদ্যালয় বা প্রোগ্রামের কার্ডে থাকা বুকমার্ক আইকনে ক্লিক করে যুক্ত করুন।
              </p>
              <button
                onClick={() => setActiveTab("universities")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold shadow-xs hover:bg-brand-800"
              >
                <span>ক্যাটালগ ব্রাউজ করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ambitious Column */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-purple-700">
                    <span>🚀</span> অ্যাম্বিশিয়াস (Ambitious)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {favorites.filter((f) => f.category === "AMBITIOUS").length}
                  </span>
                </div>
                {favorites.filter((f) => f.category === "AMBITIOUS").map((fav) => (
                  <div key={fav.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <p className="font-bold text-slate-900 text-xs">
                      {fav.university?.nameBn || fav.program?.titleBn || "রেকর্ড"}
                    </p>
                    <p className="text-[11px] text-slate-500">{fav.university?.city || fav.program?.department}</p>
                    <button
                      onClick={() => handleToggleFavorite(fav.itemType, fav.universityId || fav.programId || "")}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold pt-1"
                    >
                      শর্টলিস্ট থেকে সরান
                    </button>
                  </div>
                ))}
              </div>

              {/* Target Column */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-brand-700">
                    <span>🎯</span> টার্গেট (Target)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {favorites.filter((f) => f.category === "TARGET").length}
                  </span>
                </div>
                {favorites.filter((f) => f.category === "TARGET").map((fav) => (
                  <div key={fav.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <p className="font-bold text-slate-900 text-xs">
                      {fav.university?.nameBn || fav.program?.titleBn || "রেকর্ড"}
                    </p>
                    <p className="text-[11px] text-slate-500">{fav.university?.city || fav.program?.department}</p>
                    <button
                      onClick={() => handleToggleFavorite(fav.itemType, fav.universityId || fav.programId || "")}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold pt-1"
                    >
                      শর্টলিস্ট থেকে সরান
                    </button>
                  </div>
                ))}
              </div>

              {/* Safe Column */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-emerald-700">
                    <span>🛡️</span> সেফ (Safe)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {favorites.filter((f) => f.category === "SAFE").length}
                  </span>
                </div>
                {favorites.filter((f) => f.category === "SAFE").map((fav) => (
                  <div key={fav.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <p className="font-bold text-slate-900 text-xs">
                      {fav.university?.nameBn || fav.program?.titleBn || "রেকর্ড"}
                    </p>
                    <p className="text-[11px] text-slate-500">{fav.university?.city || fav.program?.department}</p>
                    <button
                      onClick={() => handleToggleFavorite(fav.itemType, fav.universityId || fav.programId || "")}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold pt-1"
                    >
                      শর্টলিস্ট থেকে সরান
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
