"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  GraduationCap,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";

interface ScholarshipItem {
  id: string;
  countryCode: string;
  titleEn: string;
  titleBn: string;
  providerName: string;
  providerType: string;
  fundingType: string;
  tuitionCoveragePercent: number;
  livingStipendMonthly?: number | null;
  applicationDeadline?: string | null;
  officialSourceUrl: string;
  verificationStatus: string;
  country: {
    code: string;
    nameEn: string;
    nameBn: string;
    flagEmoji: string;
  };
  eligibilityRules?: Array<{
    minCgpa?: number | null;
    minIeltsScore?: number | null;
    eligibleDegreeLevels: string[];
  }>;
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Add Scholarship Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [schCountry, setSchCountry] = useState("GB");
  const [schTitleEn, setSchTitleEn] = useState("");
  const [schTitleBn, setSchTitleBn] = useState("");
  const [schProvider, setSchProvider] = useState("");
  const [schProviderType, setSchProviderType] = useState("GOVERNMENT");
  const [schFundingType, setSchFundingType] = useState("FULL_FUNDED");
  const [schCoverage, setSchCoverage] = useState(100);
  const [schStipend, setSchStipend] = useState<number | "">("");
  const [schDeadline, setSchDeadline] = useState("2026-11-05");
  const [schUrl, setSchUrl] = useState("");
  const [schMinCgpa, setSchMinCgpa] = useState(3.0);
  const [schMinIelts, setSchMinIelts] = useState(6.5);
  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCountry) params.set("countryCode", selectedCountry);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/scholarships?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setScholarships(json.data);
      }
    } catch (err) {
      console.error("Failed to load scholarships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [selectedCountry]);

  const handleAddScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await fetch("/api/admin/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: schCountry,
          titleEn: schTitleEn,
          titleBn: schTitleBn,
          providerName: schProvider,
          providerType: schProviderType,
          fundingType: schFundingType,
          tuitionCoveragePercent: Number(schCoverage),
          livingStipendMonthly: schStipend ? Number(schStipend) : null,
          applicationDeadline: schDeadline ? new Date(schDeadline).toISOString() : null,
          officialSourceUrl: schUrl,
          rule: {
            minCgpa: Number(schMinCgpa),
            minIeltsScore: Number(schMinIelts),
            eligibleDegreeLevels: ["MASTER", "DOCTORAL"],
          },
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({ type: "success", message: json.message || "স্কলারশিপ সফলভাবে সংরক্ষিত ও প্রকাশিত হয়েছে।" });
        setAddModalOpen(false);
        setSchTitleEn("");
        setSchTitleBn("");
        setSchProvider("");
        setSchUrl("");
        fetchScholarships();
      } else {
        setFeedback({ type: "error", message: json.error || "সংরক্ষণ করতে সমস্যা হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            স্কলারশিপ ও অর্থায়ন ব্যবস্থাপনা (Scholarship Management)
          </h2>
          <p className="text-xs text-slate-500">
            ফুল-ফান্ডেড ও পারশিয়াল স্কলারশিপ, আবেদনের ডেডলাইন, যোগ্যতা নিয়ম (CGPA/IELTS) এবং অফিশিয়াল সোর্স লিংক পরিচালনা করুন।
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          নতুন স্কলারশিপ যোগ করুন
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="স্কলারশিপের নাম বা প্রোভাইডার দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="">সব দেশ</option>
            <option value="GB">যুক্তরাজ্য (GB)</option>
            <option value="CA">কানাডা (CA)</option>
            <option value="AU">অস্ট্রেলিয়া (AU)</option>
            <option value="DE">জার্মানি (DE)</option>
            <option value="US">যুক্তরাষ্ট্র (US)</option>
          </select>
        </div>

        <button
          onClick={fetchScholarships}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 inline-flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </button>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scholarships.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{sch.country.flagEmoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {sch.titleBn}
                    </h4>
                    <p className="text-[11px] text-slate-500">{sch.titleEn}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  {sch.fundingType === "FULL_FUNDED" ? "ফুল-ফান্ডেড" : "টিউশন ওয়েভার"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>প্রোভাইডার:</span>
                  <span className="font-semibold text-slate-800">{sch.providerName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>টিউশন কভারেজ:</span>
                  <span className="font-bold text-indigo-700">{sch.tuitionCoveragePercent}%</span>
                </div>
                {sch.livingStipendMonthly && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>মাসিক উপবৃত্তি:</span>
                    <span className="font-semibold text-slate-800">
                      {sch.livingStipendMonthly.toLocaleString()} (লোকাল)
                    </span>
                  </div>
                )}
              </div>

              {sch.eligibilityRules?.[0] && (
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="font-medium">যোগ্যতা:</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    CGPA {sch.eligibilityRules[0].minCgpa || 3.0}+
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    IELTS {sch.eligibilityRules[0].minIeltsScore || 6.5}+
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {sch.applicationDeadline
                  ? new Date(sch.applicationDeadline).toLocaleDateString("bn-BD")
                  : "নির্দিষ্ট ডেডলাইন নেই"}
              </span>
              <a
                href={sch.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
              >
                অফিসিয়াল পোর্টাল <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Scholarship Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                নতুন স্কলারশিপ যোগ করুন
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddScholarship} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">দেশ নির্বাচন করুন</label>
                  <select
                    value={schCountry}
                    onChange={(e) => setSchCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="GB">যুক্তরাজ্য (GB)</option>
                    <option value="CA">কানাডা (CA)</option>
                    <option value="AU">অস্ট্রেলিয়া (AU)</option>
                    <option value="DE">জার্মানি (DE)</option>
                    <option value="US">যুক্তরাষ্ট্র (US)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">অর্থায়ন টাইপ</label>
                  <select
                    value={schFundingType}
                    onChange={(e) => setSchFundingType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="FULL_FUNDED">ফুল ফান্ডেড (টিউশন + মাসিক উপবৃত্তি)</option>
                    <option value="TUITION_ONLY">সম্পূর্ণ টিউশন ফি ওয়েভার</option>
                    <option value="PARTIAL_STIPEND">আংশিক বৃত্তি / পারশিয়াল ওয়েভার</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ইংরেজি নাম</label>
                  <input
                    required
                    type="text"
                    value={schTitleEn}
                    onChange={(e) => setSchTitleEn(e.target.value)}
                    placeholder="Chevening Scholarships"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">বাংলা নাম</label>
                  <input
                    required
                    type="text"
                    value={schTitleBn}
                    onChange={(e) => setSchTitleBn(e.target.value)}
                    placeholder="শেভেনিং স্কলারশিপ"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">প্রোভাইডার সংস্থা</label>
                  <input
                    required
                    type="text"
                    value={schProvider}
                    onChange={(e) => setSchProvider(e.target.value)}
                    placeholder="UK FCDO (ব্রিটিশ সরকার)"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">আবেদনের ডেডলাইন</label>
                  <input
                    required
                    type="date"
                    value={schDeadline}
                    onChange={(e) => setSchDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">টিউশন কভারেজ (%)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    max={100}
                    value={schCoverage}
                    onChange={(e) => setSchCoverage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">মাসিক উপবৃত্তি (ঐচ্ছিক)</label>
                  <input
                    type="number"
                    value={schStipend}
                    onChange={(e) => setSchStipend(e.target.value ? Number(e.target.value) : "")}
                    placeholder="1334"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ন্যূনতম CGPA</label>
                  <input
                    required
                    type="number"
                    step="0.05"
                    min={2.0}
                    max={4.0}
                    value={schMinCgpa}
                    onChange={(e) => setSchMinCgpa(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ন্যূনতম IELTS ব্যান্ড</label>
                  <input
                    required
                    type="number"
                    step="0.5"
                    min={5.0}
                    max={9.0}
                    value={schMinIelts}
                    onChange={(e) => setSchMinIelts(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">অফিসিয়াল স্কলারশিপ পোর্টাল লিঙ্ক</label>
                <input
                  required
                  type="url"
                  value={schUrl}
                  onChange={(e) => setSchUrl(e.target.value)}
                  placeholder="https://www.chevening.org/scholarship/bangladesh/"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm"
                >
                  {submitting ? "সংরক্ষণ হচ্ছে..." : "স্কলারশিপ প্রকাশ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
