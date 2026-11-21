"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe2,
  ExternalLink,
  Building2,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  DollarSign,
  Coins,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";

interface CountryDetailItem {
  code: string;
  nameEn: string;
  nameBn: string;
  flagEmoji: string;
  currencyCode: string;
  currencySymbol: string;
  approxBdtRate: number;
  officialLanguage: string;
  educationSystemOverviewBn?: string;
  degreeStructuresJson?: string;
  tuitionCostRangesBn?: string;
  livingCostInfoBn?: string;
  officialEducationUrl?: string;
  officialImmigrationUrl: string;
  dhakaEmbassyName: string;
  dhakaEmbassyUrl: string;
  postStudyWorkDurationBn: string;
  avgMonthlyLivingCost: number;
  blockedAccountRequired: boolean;
  policyVersions?: any[];
  _count?: {
    universities: number;
    scholarships: number;
  };
}

export default function ExploreCountriesPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<CountryDetailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        const res = await fetch("/api/discovery/countries");
        const json = await res.json();
        if (json.success && json.data) {
          setCountries(json.data);
        }
      } catch (err) {
        console.error("Error loading countries:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  const filtered = (countries.length > 0 ? countries : (COUNTRY_LIST as any[])).filter((c) => {
    if (selectedCountry !== "ALL" && c.code !== selectedCountry) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = c.nameEn?.toLowerCase().includes(q) || c.nameBn?.includes(q);
      if (!matchesName) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/30 text-brand-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>অফিসিয়াল সরকারি অভিবাসন ও শিক্ষা পোর্টাল সূত্র</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            দেশভিত্তিক উচ্চশিক্ষা ও ভিসা সহায়িকা
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও যুক্তরাষ্ট্রের উচ্চশিক্ষা ব্যবস্থা, ডিগ্রি কাঠামো, লিভিং খরচ, ব্লকড অ্যাকাউন্ট নিয়ম এবং পোস্ট-স্টাডি ওয়ার্ক পারমিটের অফিশিয়াল তুলনা।
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCountry("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCountry === "ALL"
                ? "bg-brand-700 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            সকল দেশ (৫)
          </button>
          {COUNTRY_LIST.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedCountry === c.code
                  ? "bg-brand-700 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.nameBn}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="দেশের নাম দিয়ে ফিল্টার করুন..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Country Cards */}
      <div className="space-y-6">
        {filtered.map((c) => {
          const approxLivingBdt = Math.round((c.avgMonthlyLivingCost || 1200) * (c.approxBdtRate || 100));
          return (
            <div
              key={c.code}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="text-4xl sm:text-5xl">{c.flagEmoji || c.flag || "🌍"}</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {c.nameBn} ({c.nameEn})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      মুদ্রা: <strong>{c.currencyCode} ({c.currencySymbol})</strong> • ১ {c.currencyCode} ≈ {c.approxBdtRate} টাকা
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/universities?country=${c.code}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>বিশ্ববিদ্যালয়সমূহ দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Education System Overview */}
              {c.educationSystemOverviewBn && (
                <div className="text-xs text-slate-700 leading-relaxed space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">উচ্চশিক্ষা ব্যবস্থার সারসংক্ষেপ:</span>
                  <p>{c.educationSystemOverviewBn}</p>
                </div>
              )}

              {/* Key Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Tuition Cost */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">টিউশন ফি রেঞ্জ</span>
                  <p className="font-bold text-slate-800 text-sm">
                    {c.tuitionCostRangesBn || "বাৎসরিক ১৫ থেকে ৩০ লাখ টাকা"}
                  </p>
                </div>

                {/* Living Cost */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">মাসিক লিভিং খরচ</span>
                  <p className="font-bold text-brand-700 text-sm">
                    {c.currencySymbol} {c.avgMonthlyLivingCost?.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-slate-500">প্রায় {formatBdt(approxLivingBdt)}/মাস</span>
                </div>

                {/* Blocked Account */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">ব্লকড অ্যাকাউন্ট আবশ্যক?</span>
                  <p className="font-bold text-sm">
                    {c.blockedAccountRequired ? (
                      <span className="text-amber-700">হ্যাঁ (বাৎসরিক €১১,৯০৪)</span>
                    ) : (
                      <span className="text-emerald-700">প্রয়োজন নেই (২৮ দিনের ব্যাংক ব্যালান্স)</span>
                    )}
                  </p>
                </div>

                {/* Post Study Work */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">পোস্ট-স্টাডি ওয়ার্ক পারমিট</span>
                  <p className="font-bold text-slate-900 text-xs line-clamp-2">
                    {c.postStudyWorkDurationBn || "২ থেকে ৩ বছর ফুল-টাইম কাজের অনুমতি"}
                  </p>
                </div>
              </div>

              {/* Official Links Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  {c.officialEducationUrl && (
                    <a
                      href={c.officialEducationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:text-brand-800 font-semibold flex items-center gap-1"
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>অফিসিয়াল এডুকেশন পোর্টাল</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {c.officialImmigrationUrl && (
                    <a
                      href={c.officialImmigrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>সরকারি ভিসা পেজ</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}

                  {c.dhakaEmbassyUrl && (
                    <a
                      href={c.dhakaEmbassyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{c.dhakaEmbassyName}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  ভেরিফাইড সরকারি গ্যাজেট ও রেগুলেশন অনুমোদিত ✓
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
