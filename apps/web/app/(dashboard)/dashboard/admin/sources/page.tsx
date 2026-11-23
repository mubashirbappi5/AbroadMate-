"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Calendar,
  Building,
  Globe2,
} from "lucide-react";

interface SourceItem {
  id: string;
  title: string;
  authorityName: string;
  officialUrl: string;
  countryCode?: string | null;
  sourceCategory?: string | null;
  status: "VERIFIED" | "PENDING_REVIEW" | "REJECTED" | "DEPRECATED" | "NEEDS_UPDATE";
  lastVerifiedAt: string;
  nextReviewDate?: string | null;
  isExpired: boolean;
  daysUntilReview?: number | null;
  country?: {
    code: string;
    nameEn: string;
    nameBn: string;
    flagEmoji: string;
  } | null;
  verifications?: any[];
  _count?: {
    records: number;
    changeLogs: number;
  };
}

export default function SourcesMonitoringPage() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [expiredOnly, setExpiredOnly] = useState(false);

  // New Source Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthority, setNewAuthority] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCountry, setNewCountry] = useState("GB");
  const [newCategory, setNewCategory] = useState("GOVERNMENT_IMMIGRATION");
  const [newReviewDays, setNewReviewDays] = useState(90);
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Verify Modal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedSourceToVerify, setSelectedSourceToVerify] = useState<SourceItem | null>(null);
  const [verifyMethod, setVerifyMethod] = useState("OFFICIAL_PORTAL_CROSSCHECK");
  const [verifyNotes, setVerifyNotes] = useState("");
  const [submittingVerify, setSubmittingVerify] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCountry) params.set("countryCode", selectedCountry);
      if (expiredOnly) params.set("expiredOnly", "true");

      const res = await fetch(`/api/admin/sources?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSources(json.data);
      }
    } catch (err) {
      console.error("Failed to load sources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [selectedCountry, expiredOnly]);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingAdd(true);
      setFeedback(null);
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          authorityName: newAuthority,
          officialUrl: newUrl,
          countryCode: newCountry || null,
          sourceCategory: newCategory,
          nextReviewDays: Number(newReviewDays),
          status: "VERIFIED",
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({ type: "success", message: json.message || "নতুন তথ্যসূত্র যুক্ত হয়েছে।" });
        setAddModalOpen(false);
        setNewTitle("");
        setNewAuthority("");
        setNewUrl("");
        fetchSources();
      } else {
        setFeedback({ type: "error", message: json.error || "তথ্যসূত্র যোগ করতে সমস্যা হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSubmittingAdd(false);
    }
  };

  const handleVerifySource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSourceToVerify) return;

    try {
      setSubmittingVerify(true);
      setFeedback(null);
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY",
          sourceId: selectedSourceToVerify.id,
          verificationMethod: verifyMethod,
          verificationNotes: verifyNotes,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({ type: "success", message: json.message || "তথ্যসূত্র সফলভাবে ভেরিফাই করা হয়েছে।" });
        setVerifyModalOpen(false);
        setVerifyNotes("");
        fetchSources();
      } else {
        setFeedback({ type: "error", message: json.error || "ভেরিফিকেশন সম্পন্ন করতে সমস্যা হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSubmittingVerify(false);
    }
  };

  const filteredSources = sources.filter((s) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      s.authorityName.toLowerCase().includes(term) ||
      s.officialUrl.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-600" />
            অফিসিয়াল তথ্যসূত্র ও রিভিউ শিডিউলার (Source Monitoring)
          </h2>
          <p className="text-xs text-slate-500">
            AbroadMate-এর প্রতিটি তথ্য একটি অনুমোদিত অফিশিয়াল সরকারি বা প্রাতিষ্ঠানিক সোর্সের সাথে লিংক করা থাকে।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            নতুন তথ্যসূত্র যোগ করুন
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
              placeholder="সোর্সের নাম, কতৃপক্ষ বা ইউআরএল দিয়ে খুঁজুন..."
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

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={expiredOnly}
              onChange={(e) => setExpiredOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>শুধুমাত্র মেয়াদোত্তীর্ণ রিভিউ</span>
          </label>
          <button
            onClick={fetchSources}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">তথ্যসূত্র ও নাম</th>
                <th className="p-4">সংস্থা ও দেশ</th>
                <th className="p-4">ক্যাটাগরি</th>
                <th className="p-4">সর্বশেষ যাচাই</th>
                <th className="p-4">পরবর্তী রিভিউ</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSources.map((source) => {
                const isOverdue = source.isExpired;
                const days = source.daysUntilReview;

                return (
                  <tr key={source.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">{source.title}</span>
                        <a
                          href={source.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-mono"
                        >
                          {source.officialUrl.replace(/^https?:\/\//, "").substring(0, 36)}...
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800">{source.authorityName}</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          {source.country ? (
                            <>
                              <span>{source.country.flagEmoji}</span>
                              <span>{source.country.nameBn}</span>
                            </>
                          ) : (
                            <span>আন্তর্জাতিক</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {source.sourceCategory?.replace(/_/g, " ") || "IMMIGRATION"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600">
                        {new Date(source.lastVerifiedAt).toLocaleDateString("bn-BD")}
                      </span>
                    </td>
                    <td className="p-4">
                      {source.nextReviewDate ? (
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800">
                            {new Date(source.nextReviewDate).toLocaleDateString("bn-BD")}
                          </span>
                          <span
                            className={`block text-[10px] font-bold ${
                              isOverdue
                                ? "text-rose-600"
                                : days && days <= 14
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {isOverdue
                              ? `মেয়াদোত্তীর্ণ (${Math.abs(days || 0)} দিন পূর্বে)`
                              : `${days} দিন বাকি`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">নির্ধারিত নয়</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          source.status === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-800"
                            : source.status === "PENDING_REVIEW"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {source.status === "VERIFIED" && <CheckCircle2 className="w-3 h-3" />}
                        {source.status === "VERIFIED"
                          ? "ভেরিফাইড"
                          : source.status === "PENDING_REVIEW"
                          ? "রিভিউ প্রয়োজন"
                          : "বাতিল"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSourceToVerify(source);
                          setVerifyModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        এখনই যাচাই করুন
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredSources.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    কোনো তথ্যসূত্র পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Source Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                নতুন অফিসিয়াল তথ্যসূত্র রেজিস্টার করুন
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">তথ্যসূত্রের শিরোনাম (Title)</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="UKVI Student Visa Financial Guidelines 2026"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">কর্তৃপক্ষ / সংস্থা (Organization)</label>
                  <input
                    required
                    type="text"
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value)}
                    placeholder="UK Visas and Immigration (UKVI)"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">দেশ নির্বাচন</label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="GB">যুক্তরাজ্য (GB)</option>
                    <option value="CA">কানাডা (CA)</option>
                    <option value="AU">অস্ট্রেলিয়া (AU)</option>
                    <option value="DE">জার্মানি (DE)</option>
                    <option value="US">যুক্তরাষ্ট্র (US)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">অফিসিয়াল ইউআরএল (Canonical URL)</label>
                <input
                  required
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.gov.uk/student-visa/money"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">সোর্স ক্যাটাগরি</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="GOVERNMENT_IMMIGRATION">সরকারি ইমিগ্রেশন পোর্টাল</option>
                    <option value="EMBASSY_CIRCULAR">দূতাবাস সার্কুলার</option>
                    <option value="UNIVERSITY_PORTAL">বিশ্ববিদ্যালয় অফিসিয়াল সাইট</option>
                    <option value="MINISTRY_GAZETTE">শিক্ষা মন্ত্রণালয় গেজেট</option>
                    <option value="CENTRAL_BANK">কেন্দ্রীয় ব্যাংক / মুদ্রা বিনিময়</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">পরবর্তী রিভিউ সাইকেল (দিন)</label>
                  <input
                    required
                    type="number"
                    min={7}
                    max={365}
                    value={newReviewDays}
                    onChange={(e) => setNewReviewDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
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
                  disabled={submittingAdd}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm"
                >
                  {submittingAdd ? "সংরক্ষণ হচ্ছে..." : "সোর্স সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Source Modal */}
      {verifyModalOpen && selectedSourceToVerify && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                তথ্যসূত্র ভেরিফিকেশন ও রিভিউ নবায়ন
              </h3>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">{selectedSourceToVerify.title}</p>
              <p className="text-slate-500 font-mono text-[11px] truncate">
                {selectedSourceToVerify.officialUrl}
              </p>
            </div>

            <form onSubmit={handleVerifySource} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ভেরিফিকেশন পদ্ধতি (Method)</label>
                <select
                  value={verifyMethod}
                  onChange={(e) => setVerifyMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="OFFICIAL_PORTAL_CROSSCHECK">অফিসিয়াল সরকারি পোর্টাল সরাসরি ক্রস-চেক</option>
                  <option value="EMBASSY_CIRCULAR">ঢাকাস্থ দূতাবাস সার্কুলার যাচাই</option>
                  <option value="MINISTRY_GAZETTE">শিক্ষা মন্ত্রণালয় ও পররাষ্ট্র মন্ত্রণালয় গেজেট</option>
                  <option value="UNIVERSITY_DIRECT_COMMUNICATION">বিশ্ববিদ্যালয় আন্তর্জাতিক ডেস্কের সরাসরি নিশ্চিতকরণ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">যাচাইকরণ নোট বা মন্তব্য</label>
                <textarea
                  rows={2}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="সরকারি পোর্টাল ভিজিট করে নিয়মগুলো অক্ষত পাওয়া গেছে। পরবর্তী ৯০ দিনের জন্য নবায়নকৃত।"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-[11px]">
                যাচাই সম্পন্ন করলে তথ্যসূত্রের স্ট্যাটাস <span className="font-bold">&ldquo;VERIFIED&rdquo;</span> হবে এবং পরবর্তী রিভিউ তারিখ স্বয়ংক্রিয়ভাবে <span className="font-bold">৯০ দিন</span> পিছিয়ে দেওয়া হবে।
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingVerify}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-sm"
                >
                  {submittingVerify ? "যাচাই হচ্ছে..." : "যাচাইকরণ নিশ্চিত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
