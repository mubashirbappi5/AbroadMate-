"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit,
  Clock,
  Layers,
  Award,
} from "lucide-react";

interface UniversityItem {
  id: string;
  countryCode: string;
  nameEn: string;
  nameBn: string;
  city: string;
  worldRank?: number | null;
  institutionRegistryCode?: string | null;
  websiteUrl: string;
  internationalStudentUrl?: string | null;
  verificationStatus: string;
  country: {
    code: string;
    nameEn: string;
    nameBn: string;
    flagEmoji: string;
  };
  _count?: {
    programs: number;
    scholarships: number;
  };
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Add University Modal
  const [addUniModalOpen, setAddUniModalOpen] = useState(false);
  const [uniCountry, setUniCountry] = useState("GB");
  const [uniNameEn, setUniNameEn] = useState("");
  const [uniNameBn, setUniNameBn] = useState("");
  const [uniCity, setUniCity] = useState("");
  const [uniRank, setUniRank] = useState<number | "">("");
  const [uniRegistryCode, setUniRegistryCode] = useState("");
  const [uniWebsite, setUniWebsite] = useState("");
  const [uniAdmissionsUrl, setUniAdmissionsUrl] = useState("");
  const [submittingUni, setSubmittingUni] = useState(false);

  // Add Program Modal
  const [addProgModalOpen, setAddProgModalOpen] = useState(false);
  const [selectedUniId, setSelectedUniId] = useState("");
  const [progNameEn, setProgNameEn] = useState("");
  const [progNameBn, setProgNameBn] = useState("");
  const [progDegree, setProgDegree] = useState("MASTER");
  const [progDuration, setProgDuration] = useState(1.0);
  const [progTuition, setProgTuition] = useState(25000);
  const [progCurrency, setProgCurrency] = useState("GBP");
  const [progIntakes, setProgIntakes] = useState("September, January");
  const [progUrl, setProgUrl] = useState("");
  const [submittingProg, setSubmittingProg] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCountry) params.set("countryCode", selectedCountry);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/universities?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUniversities(json.data);
      }
    } catch (err) {
      console.error("Failed to load universities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [selectedCountry]);

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingUni(true);
      setFeedback(null);
      const res = await fetch("/api/admin/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: uniCountry,
          nameEn: uniNameEn,
          nameBn: uniNameBn,
          city: uniCity,
          worldRank: uniRank ? Number(uniRank) : null,
          institutionRegistryCode: uniRegistryCode || null,
          websiteUrl: uniWebsite,
          internationalStudentUrl: uniAdmissionsUrl || null,
          verificationStatus: "VERIFIED",
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({ type: "success", message: json.message || "বিশ্ববিদ্যালয় সফলভাবে যুক্ত হয়েছে।" });
        setAddUniModalOpen(false);
        setUniNameEn("");
        setUniNameBn("");
        setUniCity("");
        setUniRank("");
        setUniWebsite("");
        fetchUniversities();
      } else {
        setFeedback({ type: "error", message: json.error || "সংরক্ষণ করতে সমস্যা হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSubmittingUni(false);
    }
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniId) return;

    try {
      setSubmittingProg(true);
      setFeedback(null);
      const intakesArray = progIntakes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityId: selectedUniId,
          nameEn: progNameEn,
          nameBn: progNameBn,
          degreeLevel: progDegree,
          durationYears: Number(progDuration),
          annualTuitionFee: Number(progTuition),
          tuitionFeeCurrency: progCurrency,
          intakeMonths: intakesArray.length > 0 ? intakesArray : ["September"],
          officialProgramUrl: progUrl,
          verificationStatus: "VERIFIED",
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({ type: "success", message: json.message || "প্রোগ্রাম সফলভাবে যুক্ত হয়েছে।" });
        setAddProgModalOpen(false);
        setProgNameEn("");
        setProgNameBn("");
        setProgUrl("");
        fetchUniversities();
      } else {
        setFeedback({ type: "error", message: json.error || "সংরক্ষণ করতে সমস্যা হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSubmittingProg(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            বিশ্ববিদ্যালয় ও ডিগ্রি কোর্স ব্যবস্থাপনা (University Management)
          </h2>
          <p className="text-xs text-slate-500">
            অফিসিয়াল ডিএলআই/রেজিস্ট্রি কোড, বিশ্ব র্যাংকিং, ডিগ্রি প্রোগ্রাম, টিউশন ফি ও আবেদনের ডেডলাইন পরিচালনা করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddUniModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            নতুন বিশ্ববিদ্যালয় যোগ করুন
          </button>
        </div>
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
              placeholder="বিশ্ববিদ্যালয় বা শহরের নাম দিয়ে খুঁজুন..."
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
          onClick={fetchUniversities}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 inline-flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </button>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">বিশ্ববিদ্যালয়</th>
                <th className="p-4">দেশ ও শহর</th>
                <th className="p-4">র্যাংকিং ও রেজিস্ট্রি কোড</th>
                <th className="p-4">কোর্স সংখ্যা</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {universities.map((uni) => (
                <tr key={uni.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 block text-sm">
                        {uni.nameBn}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {uni.nameEn}
                      </span>
                      <a
                        href={uni.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        {uni.websiteUrl.replace(/^https?:\/\//, "").substring(0, 32)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{uni.country.flagEmoji}</span>
                      <div>
                        <span className="font-bold text-slate-800 block">{uni.country.nameBn}</span>
                        <span className="text-[11px] text-slate-500">{uni.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {uni.worldRank && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                          QS #{uni.worldRank}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-600 block font-mono">
                        DLI/CRICOS: {uni.institutionRegistryCode || "যাচাইকৃত"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-slate-800 text-sm">
                      {uni._count?.programs || 0}টি প্রোগ্রাম
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        uni.verificationStatus === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {uni.verificationStatus === "VERIFIED" ? "ভেরিফাইড" : "পর্যালোচনায়"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedUniId(uni.id);
                        setProgCurrency(
                          uni.countryCode === "GB"
                            ? "GBP"
                            : uni.countryCode === "CA"
                            ? "CAD"
                            : uni.countryCode === "AU"
                            ? "AUD"
                            : uni.countryCode === "DE"
                            ? "EUR"
                            : "USD"
                        );
                        setAddProgModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      কোর্স যুক্ত করুন
                    </button>
                  </td>
                </tr>
              ))}

              {universities.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    কোনো বিশ্ববিদ্যালয় পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add University Modal */}
      {addUniModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                নতুন বিশ্ববিদ্যালয় যোগ করুন
              </h3>
              <button
                onClick={() => setAddUniModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUniversity} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">দেশ নির্বাচন করুন</label>
                  <select
                    value={uniCountry}
                    onChange={(e) => setUniCountry(e.target.value)}
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
                  <label className="font-bold text-slate-700">শহর (City)</label>
                  <input
                    required
                    type="text"
                    value={uniCity}
                    onChange={(e) => setUniCity(e.target.value)}
                    placeholder="Oxford / Toronto"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ইংরেজি নাম</label>
                  <input
                    required
                    type="text"
                    value={uniNameEn}
                    onChange={(e) => setUniNameEn(e.target.value)}
                    placeholder="University of Oxford"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">বাংলা নাম</label>
                  <input
                    required
                    type="text"
                    value={uniNameBn}
                    onChange={(e) => setUniNameBn(e.target.value)}
                    placeholder="অক্সফোর্ড বিশ্ববিদ্যালয়"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">QS বিশ্ব র্যাংকিং (ঐচ্ছিক)</label>
                  <input
                    type="number"
                    value={uniRank}
                    onChange={(e) => setUniRank(e.target.value ? Number(e.target.value) : "")}
                    placeholder="3"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">রেজিস্ট্রি কোড (DLI/CRICOS)</label>
                  <input
                    type="text"
                    value={uniRegistryCode}
                    onChange={(e) => setUniRegistryCode(e.target.value)}
                    placeholder="O19395899999"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">অফিসিয়াল ওয়েবসাইট লিঙ্ক</label>
                <input
                  required
                  type="url"
                  value={uniWebsite}
                  onChange={(e) => setUniWebsite(e.target.value)}
                  placeholder="https://www.ox.ac.uk"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddUniModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingUni}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm"
                >
                  {submittingUni ? "সংরক্ষণ হচ্ছে..." : "বিশ্ববিদ্যালয় সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {addProgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                নতুন ডিগ্রি কোর্স/প্রোগ্রাম যুক্ত করুন
              </h3>
              <button
                onClick={() => setAddProgModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProgram} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">প্রোগ্রামের ইংরেজি নাম</label>
                  <input
                    required
                    type="text"
                    value={progNameEn}
                    onChange={(e) => setProgNameEn(e.target.value)}
                    placeholder="MSc in Data Science and AI"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">বাংলা নাম</label>
                  <input
                    required
                    type="text"
                    value={progNameBn}
                    onChange={(e) => setProgNameBn(e.target.value)}
                    placeholder="এমএসসি ইন ডেটা সায়েন্স অ্যান্ড এআই"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ডিগ্রি লেভেল</label>
                  <select
                    value={progDegree}
                    onChange={(e) => setProgDegree(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="BACHELOR">Bachelor (স্নাতক)</option>
                    <option value="MASTER">Master (স্নাতকোত্তর)</option>
                    <option value="DOCTORAL">PhD / Doctoral</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">মেয়াদ (বছর)</label>
                  <input
                    required
                    type="number"
                    step="0.5"
                    value={progDuration}
                    onChange={(e) => setProgDuration(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">বার্ষিক টিউশন ফি</label>
                  <input
                    required
                    type="number"
                    value={progTuition}
                    onChange={(e) => setProgTuition(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ইনটেক মাসসমূহ (কমা দিয়ে লিখুন)</label>
                <input
                  required
                  type="text"
                  value={progIntakes}
                  onChange={(e) => setProgIntakes(e.target.value)}
                  placeholder="September, January"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">অফিসিয়াল প্রোগ্রাম ইউআরএল</label>
                <input
                  required
                  type="url"
                  value={progUrl}
                  onChange={(e) => setProgUrl(e.target.value)}
                  placeholder="https://www.ox.ac.uk/courses/graduate/msc-data-science"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddProgModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingProg}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm"
                >
                  {submittingProg ? "সংরক্ষণ হচ্ছে..." : "কোর্স সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
