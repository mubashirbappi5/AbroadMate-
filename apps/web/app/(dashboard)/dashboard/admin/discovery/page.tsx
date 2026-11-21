"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Clock,
  Layers,
  FileCheck2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { COUNTRY_LIST } from "@abroadmate/shared";

export default function AdminDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "add_uni" | "add_program">("queue");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalCountries: 5,
    totalUniversities: 6,
    verifiedUniversities: 6,
    pendingUniversities: 0,
    totalPrograms: 7,
  });
  const [recentUniversities, setRecentUniversities] = useState<any[]>([]);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // University Form State
  const [uniCountry, setUniCountry] = useState("GB");
  const [uniNameEn, setUniNameEn] = useState("");
  const [uniNameBn, setUniNameBn] = useState("");
  const [uniCity, setUniCity] = useState("");
  const [uniState, setUniState] = useState("");
  const [uniRank, setUniRank] = useState<number | "">("");
  const [uniWebsite, setUniWebsite] = useState("");
  const [uniAdmissions, setUniAdmissions] = useState("");
  const [uniApplication, setUniApplication] = useState("");
  const [uniType, setUniType] = useState("PUBLIC_RESEARCH");
  const [uniAuthority, setUniAuthority] = useState("UK Office for Students / HESA");
  const [uniAccreditation, setUniAccreditation] = useState("");
  const [uniRegistryCode, setUniRegistryCode] = useState("");
  const [uniSourceUrl, setUniSourceUrl] = useState("");
  const [uniStatus, setUniStatus] = useState("VERIFIED");

  // Program Form State
  const [progUniId, setProgUniId] = useState("");
  const [progTitleEn, setProgTitleEn] = useState("");
  const [progTitleBn, setProgTitleBn] = useState("");
  const [progDegree, setProgDegree] = useState("MASTER");
  const [progCategory, setProgCategory] = useState("COMPUTER_SCIENCE_IT");
  const [progDept, setProgDept] = useState("");
  const [progDuration, setProgDuration] = useState(12);
  const [progStudyMode, setProgStudyMode] = useState("FULL_TIME");
  const [progTuition, setProgTuition] = useState<number | "">(25000);
  const [progCurrency, setProgCurrency] = useState("GBP");
  const [progPrereq, setProgPrereq] = useState("");
  const [progUrl, setProgUrl] = useState("");
  const [progSourceUrl, setProgSourceUrl] = useState("");
  const [progIelts, setProgIelts] = useState(6.5);
  const [progCgpa, setProgCgpa] = useState(3.0);

  // Load Admin Discovery Data
  useEffect(() => {
    async function fetchAdminData() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/discovery");
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data.stats);
          setRecentUniversities(json.data.recentUniversities || []);
          if (json.data.recentUniversities?.length > 0) {
            setProgUniId(json.data.recentUniversities[0].id);
          }
        }
      } catch (err) {
        console.error("Admin data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const handleSaveUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    try {
      const res = await fetch("/api/admin/discovery/university", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: uniCountry,
          nameEn: uniNameEn,
          nameBn: uniNameBn,
          city: uniCity,
          stateOrProvince: uniState,
          worldRank: uniRank ? Number(uniRank) : undefined,
          websiteUrl: uniWebsite,
          admissionsUrl: uniAdmissions,
          applicationUrl: uniApplication,
          institutionType: uniType,
          recognizingAuthority: uniAuthority,
          accreditationDetailsBn: uniAccreditation,
          institutionRegistryCode: uniRegistryCode,
          officialSourceUrl: uniSourceUrl,
          verificationStatus: uniStatus,
          isRecognized: true,
          isPublic: true,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "বিশ্ববিদ্যালয় সংরক্ষণ ব্যর্থ হয়েছে।");
      }

      setFeedbackSuccess("বিশ্ববিদ্যালয় সফলভাবে ডাটাবেজে যুক্ত হয়েছে!");
      setActiveTab("queue");
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: any) {
      setFeedbackError(err.message || "সংরক্ষণ ব্যর্থ হয়েছে।");
    }
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    try {
      const res = await fetch("/api/admin/discovery/program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityId: progUniId,
          titleEn: progTitleEn,
          titleBn: progTitleBn,
          degreeLevel: progDegree,
          subjectCategory: progCategory,
          department: progDept,
          durationMonths: progDuration,
          studyMode: progStudyMode,
          annualTuitionAmount: Number(progTuition) || 0,
          tuitionCurrencyCode: progCurrency,
          prerequisitesBn: progPrereq,
          officialProgramUrl: progUrl,
          officialSourceUrl: progSourceUrl,
          minIeltsOverall: Number(progIelts),
          minIeltsEachBand: Number(progIelts) - 0.5,
          minGpaOrCgpa: Number(progCgpa),
          gpaScale: 4.0,
          greRequired: false,
          workExperienceMonths: 0,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "প্রোগ্রাম সংরক্ষণ ব্যর্থ হয়েছে।");
      }

      setFeedbackSuccess("প্রোগ্রাম সফলভাবে ডাটাবেজে যুক্ত হয়েছে!");
      setActiveTab("queue");
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: any) {
      setFeedbackError(err.message || "সংরক্ষণ ব্যর্থ হয়েছে।");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-brand-700" />
            <span>প্রশাসনিক ম্যানেজমেন্ট ও রিভিউ প্যানেল (RBAC Restricted)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            উচ্চশিক্ষা ডাটাবেজ অ্যাডমিন পোর্টাল
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            সরকারি রেজিস্ট্রি (HESA, IRCC DLI, CRICOS, Anabin) ক্রসচেক করে বিশ্ববিদ্যালয় ও ডিগ্রি প্রোগ্রাম রিভিউ এবং হালনাগাদ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/universities"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            পাবলিক ক্যাটালগ
          </Link>
        </div>
      </div>

      {/* Feedback Alerts */}
      {feedbackSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{feedbackSuccess}</span>
        </div>
      )}

      {feedbackError && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{feedbackError}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">মোট দেশ</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalCountries}</p>
          <span className="text-[10px] text-slate-500">UK, CA, AU, DE, US</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">মোট বিশ্ববিদ্যালয়</span>
          <p className="text-2xl font-black text-brand-700 mt-1">{stats.totalUniversities}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">{stats.verifiedUniversities}টি ভেরিফাইড</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">মোট প্রোগ্রাম</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalPrograms}</p>
          <span className="text-[10px] text-slate-500">স্নাতক ও স্নাতকোত্তর</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">পর্যালোচনায় বাকি</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.pendingUniversities}</p>
          <span className="text-[10px] text-amber-700">ভেরিফিকেশন কিউ</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "queue"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>রেকর্ড রিভিউ তালিকা</span>
        </button>

        <button
          onClick={() => setActiveTab("add_uni")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "add_uni"
              ? "bg-brand-700 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিশ্ববিদ্যালয় যুক্ত করুন</span>
        </button>

        <button
          onClick={() => setActiveTab("add_program")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "add_program"
              ? "bg-brand-700 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>নতুন প্রোগ্রাম যুক্ত করুন</span>
        </button>
      </div>

      {/* Tab 1: Queue / Recent Universities */}
      {activeTab === "queue" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">সাম্প্রতিক বিশ্ববিদ্যালয় ও অ্যাক্রিডিটেশন স্ট্যাটাস</h2>
            <span className="text-xs text-slate-500">মোট {recentUniversities.length}টি এন্ট্রি</span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentUniversities.map((uni) => (
              <div key={uni.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{uni.nameBn}</span>
                    <span className="text-slate-500">({uni.nameEn})</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold">
                      {uni.countryCode}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {uni.city} • QS #{uni.worldRank || "N/A"} • {uni._count?.programs || 0}টি প্রোগ্রাম
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{uni.recognizingAuthority || "স্বীকৃতিপ্রাপ্ত"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/universities/${uni.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    বিস্তারিত
                  </Link>
                  <a
                    href={uni.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700"
                    title="সোর্স প্রুফ দেখুন"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Add University Form */}
      {activeTab === "add_uni" && (
        <form onSubmit={handleSaveUniversity} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">নতুন বিশ্ববিদ্যালয় নিবন্ধন ফর্ম</h2>
            <p className="text-xs text-slate-500 mt-0.5">সকল তথ্য সরাসরি অফিসিয়াল সরকারি রেজিস্ট্রি থেকে যাচাই করে ইনপুট দিন।</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">দেশ নির্বাচন করুন *</label>
              <select
                value={uniCountry}
                onChange={(e) => setUniCountry(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                {COUNTRY_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.nameBn} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">প্রতিষ্ঠান টাইপ</label>
              <select
                value={uniType}
                onChange={(e) => setUniType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="PUBLIC_RESEARCH">পাবলিক রিসার্চ বিশ্ববিদ্যালয়</option>
                <option value="FEDERAL_UNIVERSITY">ফেডারেল সরকারি বিশ্ববিদ্যালয়</option>
                <option value="STATE_COLLEGE">স্টেট কলেজ</option>
                <option value="PRIVATE_NON_PROFIT">প্রাইভেট নন-প্রফিট</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ইংরেজি নাম *</label>
              <input
                type="text"
                value={uniNameEn}
                onChange={(e) => setUniNameEn(e.target.value)}
                placeholder="যেমন: University of Oxford"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বাংলা নাম *</label>
              <input
                type="text"
                value={uniNameBn}
                onChange={(e) => setUniNameBn(e.target.value)}
                placeholder="যেমন: অক্সফোর্ড বিশ্ববিদ্যালয়"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">শহর (City) *</label>
              <input
                type="text"
                value={uniCity}
                onChange={(e) => setUniCity(e.target.value)}
                placeholder="যেমন: Oxford"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিশ্ব র্যাঙ্কিং (QS World Rank)</label>
              <input
                type="number"
                value={uniRank}
                onChange={(e) => setUniRank(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="যেমন: 3"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">অফিসিয়াল ওয়েবসাইট URL *</label>
              <input
                type="url"
                value={uniWebsite}
                onChange={(e) => setUniWebsite(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">এডমিশন পেজ URL</label>
              <input
                type="url"
                value={uniAdmissions}
                onChange={(e) => setUniAdmissions(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">স্বীকৃতি প্রদানকারী কর্তৃপক্ষ *</label>
              <input
                type="text"
                value={uniAuthority}
                onChange={(e) => setUniAuthority(e.target.value)}
                placeholder="যেমন: HESA UK, IRCC DLI, TEQSA CRICOS, Anabin"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">রেজিস্ট্রি কোড (DLI/CRICOS/HESA)</label>
              <input
                type="text"
                value={uniRegistryCode}
                onChange={(e) => setUniRegistryCode(e.target.value)}
                placeholder="যেমন: DLI # O19332718824"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">অ্যাক্রিডিটেশন ও সরকারি স্বীকৃতির বিবরণ *</label>
              <textarea
                rows={2}
                value={uniAccreditation}
                onChange={(e) => setUniAccreditation(e.target.value)}
                placeholder="যেমন: যুক্তরাজ্যের প্রিভি কাউন্সিল চার্টার্ড ও রাসেল গ্রুপভুক্ত সরকারি গবেষণা বিশ্ববিদ্যালয়।"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">তথ্য যাচাইকরণের সোর্স লিংক (Source Proof URL) *</label>
              <input
                type="url"
                value={uniSourceUrl}
                onChange={(e) => setUniSourceUrl(e.target.value)}
                placeholder="https://gov.uk... বা অফিশিয়াল পোর্টাল প্রমাণ"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>বিশ্ববিদ্যালয় সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Add Program Form */}
      {activeTab === "add_program" && (
        <form onSubmit={handleSaveProgram} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">নতুন প্রোগ্রাম সংযোজন ফর্ম</h2>
            <p className="text-xs text-slate-500 mt-0.5">ভেরিফাইড বিশ্ববিদ্যালয়ের আওতায় ডিগ্রি প্রোগ্রাম ও রিকোয়ারমেন্টস যুক্ত করুন।</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">বিশ্ববিদ্যালয় নির্বাচন করুন *</label>
              <select
                value={progUniId}
                onChange={(e) => setProgUniId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                {recentUniversities.map((u) => (
                  <option key={u.id} value={u.id}>
                    [{u.countryCode}] {u.nameBn} ({u.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">প্রোগ্রামের ইংরেজি নাম *</label>
              <input
                type="text"
                value={progTitleEn}
                onChange={(e) => setProgTitleEn(e.target.value)}
                placeholder="যেমন: MSc Advanced Computer Science"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">প্রোগ্রামের বাংলা নাম *</label>
              <input
                type="text"
                value={progTitleBn}
                onChange={(e) => setProgTitleBn(e.target.value)}
                placeholder="যেমন: মাস্টার্স ইন অ্যাডভান্সড কম্পিউটার সায়েন্স"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ডিগ্রির স্তর *</label>
              <select
                value={progDegree}
                onChange={(e) => setProgDegree(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="BACHELOR">ব্যাচেলর (Bachelor)</option>
                <option value="MASTER">মাস্টার্স (Master's)</option>
                <option value="PHD">পিএইচডি (PhD)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বিষয় ক্যাটাগরি *</label>
              <select
                value={progCategory}
                onChange={(e) => setProgCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="COMPUTER_SCIENCE_IT">কম্পিউটার সায়েন্স ও আইটি</option>
                <option value="DATA_SCIENCE_AI">ডেটা সায়েন্স ও এআই</option>
                <option value="ENGINEERING_TECHNOLOGY">ইঞ্জিনিয়ারিং ও প্রযুক্তি</option>
                <option value="BUSINESS_MANAGEMENT">ব্যবসা ও ব্যবস্থাপনা</option>
                <option value="HEALTH_MEDICAL_SCIENCES">স্বাস্থ্য ও চিকিৎসা বিজ্ঞান</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ডিপার্টমেন্টের নাম *</label>
              <input
                type="text"
                value={progDept}
                onChange={(e) => setProgDept(e.target.value)}
                placeholder="যেমন: Department of Computer Science"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">কোর্সের মেয়াদ (মাস)</label>
              <input
                type="number"
                value={progDuration}
                onChange={(e) => setProgDuration(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">বাৎসরিক টিউশন ফি *</label>
              <input
                type="number"
                value={progTuition}
                onChange={(e) => setProgTuition(e.target.value === "" ? "" : Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">কারেন্সি কোড *</label>
              <input
                type="text"
                value={progCurrency}
                onChange={(e) => setProgCurrency(e.target.value.toUpperCase())}
                placeholder="GBP / CAD / EUR / AUD / USD"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">মিনিমাম IELTS ওভারঅল *</label>
              <input
                type="number"
                step="0.5"
                value={progIelts}
                onChange={(e) => setProgIelts(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">মিনিমাম CGPA *</label>
              <input
                type="number"
                step="0.05"
                value={progCgpa}
                onChange={(e) => setProgCgpa(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">অফিসিয়াল কোর্স পেজ URL *</label>
              <input
                type="url"
                value={progUrl}
                onChange={(e) => setProgUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">ভেরিফিকেশন সোর্স URL *</label>
              <input
                type="url"
                value={progSourceUrl}
                onChange={(e) => setProgSourceUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>প্রোগ্রাম সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
