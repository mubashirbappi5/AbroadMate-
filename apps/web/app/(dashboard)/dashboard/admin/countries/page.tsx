"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Save,
  RefreshCw,
  Building2,
  AlertCircle,
} from "lucide-react";

interface CountryItem {
  code: string;
  iso2: string;
  nameEn: string;
  nameBn: string;
  flagEmoji: string;
  currencyCode: string;
  currencySymbol: string;
  approxBdtRate: number;
  officialLanguage: string;
  postStudyWorkDurationBn: string;
  avgMonthlyLivingCost: number;
  blockedAccountRequired: boolean;
  officialImmigrationUrl: string;
  dhakaEmbassyName: string;
  dhakaEmbassyUrl: string;
  visaTypes: Array<{
    id: string;
    nameEn: string;
    subclassCode?: string;
  }>;
  visaRequirements: Array<{
    id: string;
    versions: Array<{
      versionNumber: number;
      financialRules: any[];
    }>;
  }>;
  _count?: {
    universities: number;
    scholarships: number;
  };
}

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    code: "",
    iso2: "",
    nameEn: "",
    nameBn: "",
    flagEmoji: "",
    currencyCode: "",
    currencySymbol: "",
    approxBdtRate: 150,
    officialLanguage: "English",
    postStudyWorkDurationBn: "",
    avgMonthlyLivingCost: 1000,
    blockedAccountRequired: false,
    officialImmigrationUrl: "",
    dhakaEmbassyName: "",
    dhakaEmbassyUrl: "",
    workRightsInTermHours: 20,
    workRightsVacationHours: 40,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/countries");
      const json = await res.json();
      if (json.success) {
        setCountries(json.data);
      }
    } catch (err) {
      console.error("Failed to load countries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const openEditModal = (country: CountryItem) => {
    setSelectedCountry(country);
    setEditForm({
      code: country.code,
      iso2: country.iso2,
      nameEn: country.nameEn,
      nameBn: country.nameBn,
      flagEmoji: country.flagEmoji,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      approxBdtRate: country.approxBdtRate,
      officialLanguage: country.officialLanguage,
      postStudyWorkDurationBn: country.postStudyWorkDurationBn,
      avgMonthlyLivingCost: country.avgMonthlyLivingCost,
      blockedAccountRequired: country.blockedAccountRequired,
      officialImmigrationUrl: country.officialImmigrationUrl,
      dhakaEmbassyName: country.dhakaEmbassyName,
      dhakaEmbassyUrl: country.dhakaEmbassyUrl,
      workRightsInTermHours: 20,
      workRightsVacationHours: 40,
    });
    setEditModalOpen(true);
  };

  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);
      const res = await fetch("/api/admin/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({ type: "success", message: json.message || "দেশের তথ্য সফলভাবে হালনাগাদ হয়েছে।" });
        setEditModalOpen(false);
        fetchCountries();
      } else {
        setFeedback({ type: "error", message: json.error || "সংরক্ষণ করতে সমস্যা হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            দেশ, ভিসা নিয়ম ও কাজের অধিকার ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500">
            দেশভিত্তিক মুদ্রা রূপান্তর হার, ব্যাংক সলভেন্সি নিয়ম, কাজের ঘণ্টা এবং পোস্ট-স্টাডি ওয়ার্ক (PSW) অধিকার পরিচালনা করুন।
          </p>
        </div>
        <button
          onClick={fetchCountries}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
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

      {/* Country Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {countries.map((c) => (
          <div
            key={c.code}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.flagEmoji}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {c.nameBn} ({c.nameEn})
                    </h3>
                    <p className="text-xs text-slate-500">
                      কোড: <span className="font-mono font-semibold">{c.code}</span> • কারেন্সি:{" "}
                      <span className="font-mono font-semibold">
                        {c.currencyCode} ({c.currencySymbol})
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(c)}
                  className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
                  title="এডিট করুন"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Benchmark Currency & Living Cost */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">BDT রূপান্তর হার</span>
                  <span className="font-black text-slate-800">
                    ৳ {c.approxBdtRate.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">গড় মাসিক জীবনযাত্রার ব্যয়</span>
                  <span className="font-black text-slate-800">
                    {c.currencySymbol} {c.avgMonthlyLivingCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Work Rights & PSW */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">শিক্ষাকালীন কাজের অধিকার:</span>
                    <span className="font-semibold text-slate-800">
                      টার্ম চলাকালীন সপ্তাহে ২০ ঘণ্টা, ছুটিতে ফুল-টাইম
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">পোস্ট-স্টাডি ওয়ার্ক (PSW):</span>
                    <span className="font-semibold text-slate-800 leading-tight block">
                      {c.postStudyWorkDurationBn}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">ব্যাংক সলভেন্সি নিয়ম:</span>
                    <span className="font-semibold text-slate-800">
                      {c.blockedAccountRequired ? "ব্লকড একাউন্ট (Sperrkonto) বাধ্যতামূলক" : "অনুমোদিত সিডিউল ব্যাংকে ২৮ দিন বা সমমানের হোল্ডিং"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Counts & Official Embassy Link */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>
                {c._count?.universities || 0}টি প্রতিষ্ঠান • {c._count?.scholarships || 0}টি স্কলারশিপ
              </span>
              <a
                href={c.officialImmigrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
              >
                ইমিগ্রেশন সাইট <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Country Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                দেশের তথ্য ও পলিসি এডিট ({editForm.nameBn})
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCountry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">দেশের বাংলা নাম</label>
                  <input
                    required
                    type="text"
                    value={editForm.nameBn}
                    onChange={(e) => setEditForm({ ...editForm, nameBn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ইংরেজি নাম</label>
                  <input
                    required
                    type="text"
                    value={editForm.nameEn}
                    onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">পতাকা ইমোজি</label>
                  <input
                    required
                    type="text"
                    value={editForm.flagEmoji}
                    onChange={(e) => setEditForm({ ...editForm, flagEmoji: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-center text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">মুদ্রা কোড</label>
                  <input
                    required
                    type="text"
                    value={editForm.currencyCode}
                    onChange={(e) => setEditForm({ ...editForm, currencyCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">BDT এক্সচেঞ্জ রেট (৳)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={editForm.approxBdtRate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, approxBdtRate: parseFloat(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-indigo-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">গড় মাসিক লিভিং কস্ট (লোকাল কারেন্সি)</label>
                  <input
                    required
                    type="number"
                    value={editForm.avgMonthlyLivingCost}
                    onChange={(e) =>
                      setEditForm({ ...editForm, avgMonthlyLivingCost: parseFloat(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={editForm.blockedAccountRequired}
                      onChange={(e) =>
                        setEditForm({ ...editForm, blockedAccountRequired: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>ব্লকড একাউন্ট আবশ্যক (যেমন জার্মানি)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">পোস্ট-স্টাডি ওয়ার্ক (PSW) অধিকার বিবরণ</label>
                <textarea
                  required
                  rows={2}
                  value={editForm.postStudyWorkDurationBn}
                  onChange={(e) =>
                    setEditForm({ ...editForm, postStudyWorkDurationBn: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">অফিসিয়াল ইমিগ্রেশন পোর্টাল লিঙ্ক</label>
                <input
                  required
                  type="url"
                  value={editForm.officialImmigrationUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, officialImmigrationUrl: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ঢাকাস্থ দূতাবাস/হাইকমিশনের নাম</label>
                  <input
                    required
                    type="text"
                    value={editForm.dhakaEmbassyName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dhakaEmbassyName: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">দূতাবাস ওয়েবসাইট লিঙ্ক</label>
                  <input
                    required
                    type="url"
                    value={editForm.dhakaEmbassyUrl}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dhakaEmbassyUrl: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
