"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Bell,
  Users,
  Layers,
  ArrowRight,
  Plus,
  RefreshCw,
  FileCheck2,
} from "lucide-react";

interface PolicyChangeItem {
  id: string;
  versionId: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  decisionComment?: string | null;
  evidenceComparisonJson?: string | null;
  affectedStudentsCount?: number | null;
  notifiedStudentsCount?: number | null;
  createdAt: string;
  decidedAt?: string | null;
  version: {
    id: string;
    versionNumber: number;
    changeSummaryBn: string;
    officialGazetteUrl: string;
    sourceOrganization: string;
    effectiveFromDate: string;
    verificationStatus: string;
    visaRequirement: {
      id: string;
      countryCode: string;
      country: {
        nameEn: string;
        nameBn: string;
        flagEmoji: string;
      };
      visaType: {
        nameEn: string;
        subclassCode?: string;
      };
    };
  };
  proposedByUser: {
    fullName: string;
    email: string;
  };
  approvedByUser?: {
    fullName: string;
    email: string;
  } | null;
}

export default function PolicyChangesWorkflowPage() {
  const [changes, setChanges] = useState<PolicyChangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChange, setSelectedChange] = useState<PolicyChangeItem | null>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [decisionComment, setDecisionComment] = useState("");
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Proposal modal state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [propVisaReqId, setPropVisaReqId] = useState("");
  const [propTitle, setPropTitle] = useState("");
  const [propCategory, setPropCategory] = useState("FINANCIAL_MAINTENANCE");
  const [propOldVal, setPropOldVal] = useState("");
  const [propNewVal, setPropNewVal] = useState("");
  const [propSourceOrg, setPropSourceOrg] = useState("UK Visas and Immigration");
  const [propGazetteUrl, setPropGazetteUrl] = useState("");
  const [propSummaryBn, setPropSummaryBn] = useState("");
  const [propEffectiveDate, setPropEffectiveDate] = useState("2026-01-01");
  const [submittingProposal, setSubmittingProposal] = useState(false);

  // Countries & Visa reqs for selector
  const [countriesList, setCountriesList] = useState<any[]>([]);

  const fetchChanges = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/policy/changes");
      const json = await res.json();
      if (json.success) {
        setChanges(json.data);
        if (json.data.length > 0 && !selectedChange) {
          setSelectedChange(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load policy changes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/admin/countries");
      const json = await res.json();
      if (json.success && json.data) {
        setCountriesList(json.data);
        if (json.data.length > 0 && json.data[0].visaRequirements?.[0]) {
          setPropVisaReqId(json.data[0].visaRequirements[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load countries:", err);
    }
  };

  useEffect(() => {
    fetchChanges();
    fetchCountries();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChange) return;

    if (decisionComment.trim().length < 5) {
      setFeedback({ type: "error", message: "সিদ্ধান্তের কারণ কমপক্ষে ৫ অক্ষর হতে হবে।" });
      return;
    }

    try {
      setSubmittingReview(true);
      setFeedback(null);
      const res = await fetch("/api/admin/policy/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versionId: selectedChange.versionId,
          decision,
          decisionComment,
          notifyAffectedStudents: notifyStudents,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({
          type: "success",
          message: json.message || "পলিসি সিদ্ধান্ত সফলভাবে বাস্তবায়িত হয়েছে।",
        });
        setReviewModalOpen(false);
        setDecisionComment("");
        fetchChanges();
      } else {
        setFeedback({ type: "error", message: json.error || "রিভিউ সাবমিট করতে ব্যর্থ হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingProposal(true);
      setFeedback(null);
      const res = await fetch("/api/admin/policy/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visaRequirementId: propVisaReqId,
          title: propTitle,
          category: propCategory,
          oldValue: propOldVal,
          newValue: propNewVal,
          sourceOrganization: propSourceOrg,
          officialGazetteUrl: propGazetteUrl,
          changeSummaryBn: propSummaryBn,
          effectiveDate: propEffectiveDate,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({
          type: "success",
          message: "নতুন পলিসি পরিবর্তনের প্রস্তাবনা সফলভাবে রেকর্ড করা হয়েছে।",
        });
        setProposalModalOpen(false);
        // Reset form
        setPropTitle("");
        setPropOldVal("");
        setPropNewVal("");
        setPropGazetteUrl("");
        setPropSummaryBn("");
        fetchChanges();
      } else {
        setFeedback({ type: "error", message: json.error || "প্রস্তাবনা জমা দিতে ব্যর্থ হয়েছে।" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setSubmittingProposal(false);
    }
  };

  const parsedEvidence = selectedChange?.evidenceComparisonJson
    ? JSON.parse(selectedChange.evidenceComparisonJson)
    : null;

  return (
    <div className="space-y-6">
      {/* 9-Step Lifecycle Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-indigo-600" />
              ৯-ধাপের পলিসি পরিবর্তন ও অ্যাকুরেসি লাইফসাইকেল
            </h3>
            <p className="text-xs text-slate-500">
              মানবিক ভেরিফিকেশন ছাড়া কোনো ইমিগ্রেশন নিয়ম পরিবর্তন AbroadMate-এ প্রকাশিত হয় না।
            </p>
          </div>
          <button
            onClick={() => setProposalModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            নতুন পলিসি পরিবর্তন প্রস্তাব করুন
          </button>
        </div>

        {/* 9 Steps Visual Timeline */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 pt-2 border-t border-slate-100 text-center">
          {[
            { step: "১", label: "সোর্স মনিটরিং", en: "Source Mon" },
            { step: "২", label: "চেঞ্জ ডিটেকশন", en: "Detection" },
            { step: "৩", label: "রেকর্ড তৈরি", en: "Record" },
            { step: "৪", label: "অ্যাডমিন রিভিউ", en: "Review" },
            { step: "৫", label: "এভিডেন্স ডিটেইল", en: "Evidence Diff" },
            { step: "৬", label: "অনুমোদন/বাতিল", en: "Approval" },
            { step: "৭", label: "নতুন ভার্সন প্রকাশ", en: "Publishing" },
            { step: "৮", label: "শিক্ষার্থী সনাক্ত", en: "Impact Check" },
            { step: "৯", label: "স্বয়ংক্রিয় নোটিশ", en: "Notifications" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center space-y-1"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                {item.step}
              </span>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">
                {item.label}
              </span>
            </div>
          ))}
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

      {/* Two Column Workspace: Proposals List & Side-by-Side Evidence Diff */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proposals List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              পলিসি চেঞ্জ তালিকা ({changes.length})
            </h4>
            <button
              onClick={fetchChanges}
              className="text-slate-500 hover:text-slate-700 text-xs inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              রিফ্রেশ
            </button>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {changes.map((item) => {
              const isSelected = selectedChange?.id === item.id;
              const country = item.version.visaRequirement.country;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedChange(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-50/50 border-indigo-500 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{country.flagEmoji}</span>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">
                          {country.nameBn} - {item.version.visaRequirement.visaType.nameEn}
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          ভার্সন #{item.version.versionNumber} • প্রস্তাবক: {item.proposedByUser.fullName}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.approvalStatus === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.approvalStatus === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.approvalStatus === "APPROVED"
                        ? "অনুমোদিত"
                        : item.approvalStatus === "REJECTED"
                        ? "বাতিল"
                        : "পর্যালোচনায়"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                    {item.version.changeSummaryBn}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                    <span>সংস্থা: {item.version.sourceOrganization}</span>
                    {item.affectedStudentsCount ? (
                      <span className="text-indigo-600 font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {item.affectedStudentsCount} শিক্ষার্থী প্রভাবিত
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {changes.length === 0 && !loading && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                কোনো পলিসি চেঞ্জ প্রস্তাবনা নেই। নতুন প্রস্তাব করতে উপরের বাটনে ক্লিক করুন।
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Step 5 Side-by-Side Evidence Diff & Review Actions */}
        <div className="lg:col-span-7 space-y-4">
          {selectedChange ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {selectedChange.version.visaRequirement.country.flagEmoji}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      {selectedChange.version.visaRequirement.country.nameBn} - ইমিগ্রেশন পলিসি প্রমাণপত্র
                    </h3>
                    <p className="text-xs text-slate-500">
                      অফিসিয়াল সার্কুলার যাচাই ও সাইড-বাই-সাইড এভিডেন্স তুলনা (Step 5)
                    </p>
                  </div>
                </div>

                {selectedChange.approvalStatus === "PENDING" && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    রিভিউ ও সিদ্ধান্ত গ্রহণ (Step 6)
                  </button>
                )}
              </div>

              {/* Side-by-Side Evidence Comparison Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  সাইড-বাই-সাইড এভিডেন্স কম্প্যারিজন (Evidence Diff)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Previous State */}
                  <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                      পূর্ববর্তী অফিসিয়াল মান (Old Value)
                    </span>
                    <p className="text-sm font-bold text-rose-950 font-mono">
                      {parsedEvidence?.oldValue || "পূর্ববর্তী রেকর্ড পাওয়া যায়নি"}
                    </p>
                    <p className="text-xs text-slate-500">
                      পূর্বে প্রযোজ্য ও শিক্ষার্থীদের প্রদর্শিত পরিসংখ্যান
                    </p>
                  </div>

                  {/* Proposed New State */}
                  <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                      নতুন প্রস্তাবিত মান (Proposed Value)
                    </span>
                    <p className="text-sm font-bold text-emerald-950 font-mono">
                      {parsedEvidence?.newValue || "নতুন মান স্পেসিফাইড নয়"}
                    </p>
                    <p className="text-xs text-slate-500">
                      সরকারি সার্কুলার অনুযায়ী অবিলম্বে কার্যকরযোগ্য
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Source & Gazette Citation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    অফিসিয়াল সার্কুলার ও গেজেট প্রমাণপত্র:
                  </span>
                  <a
                    href={selectedChange.version.officialGazetteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    গেজেট বা সার্কুলার লিঙ্ক খুলুন
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-600">
                  উৎস সংস্থা: <span className="font-semibold text-slate-800">{selectedChange.version.sourceOrganization}</span>
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 font-sans">
                  <span className="font-bold text-slate-800 block mb-1">বাংলা ব্যাখ্যা ও প্রভাব:</span>
                  {selectedChange.version.changeSummaryBn}
                </div>
              </div>

              {/* Status and Impact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[11px] text-slate-500">অনুমোদন স্ট্যাটাস</p>
                  <p
                    className={`text-xs font-bold ${
                      selectedChange.approvalStatus === "APPROVED"
                        ? "text-emerald-600"
                        : selectedChange.approvalStatus === "REJECTED"
                        ? "text-rose-600"
                        : "text-amber-600"
                    }`}
                  >
                    {selectedChange.approvalStatus}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[11px] text-slate-500">প্রভাবিত শিক্ষার্থী (Step 8)</p>
                  <p className="text-xs font-bold text-slate-800">
                    {selectedChange.affectedStudentsCount || 0} জন শিক্ষার্থী
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-[11px] text-slate-500">সতর্কবার্তা প্রেরিত (Step 9)</p>
                  <p className="text-xs font-bold text-slate-800">
                    {selectedChange.notifiedStudentsCount || 0}টি নোটিফিকেশন
                  </p>
                </div>
              </div>

              {selectedChange.decisionComment && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                  <span className="font-bold block">অ্যাডমিন রিভিউ মন্তব্য:</span>
                  <p>{selectedChange.decisionComment}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              বাম পাশের তালিকা থেকে একটি পলিসি চেঞ্জ নির্বাচন করুন।
            </div>
          )}
        </div>
      </div>

      {/* Review Modal (Steps 4, 5, 6, 7, 8, 9) */}
      {reviewModalOpen && selectedChange && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                পলিসি পরিবর্তন পর্যালোচনা ও সিদ্ধান্ত
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  সিদ্ধান্ত গ্রহণ করুন (Decision)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision("APPROVED")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      decision === "APPROVED"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    অনুমোদন ও প্রকাশ
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("REJECTED")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      decision === "REJECTED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    প্রস্তাব বাতিল করুন
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  সিদ্ধান্তের কারণ বা কমেন্ট (বাধ্যতামূলক, কমপক্ষে ৫ অক্ষর)
                </label>
                <textarea
                  required
                  rows={3}
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  placeholder="হোম অফিসের অফিসিয়াল গেজেট ও স্টেটমেন্ট অব চেঞ্জেস পুঙ্খানুপুঙ্খ যাচাই করে অনুমোদন দেওয়া হলো..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {decision === "APPROVED" && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="notifyCheck"
                    checked={notifyStudents}
                    onChange={(e) => setNotifyStudents(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="notifyCheck" className="text-xs text-slate-700 cursor-pointer">
                    <span className="font-bold block">প্রভাবিত শিক্ষার্থীদের সতর্কবার্তা প্রেরণ (Step 8 & 9)</span>
                    {selectedChange.version.visaRequirement.country.nameBn} সংক্রান্ত রোডম্যাপ বা গোলে থাকা শিক্ষার্থীদের তাৎক্ষণিক সতর্কবার্তা যাবে এবং রোডম্যাপ টাস্কগুলো &ldquo;needsReview&rdquo; হিসেবে চিহ্নিত হবে।
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition ${
                    decision === "APPROVED"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {submittingReview ? "প্রসেসিং হচ্ছে..." : "সিদ্ধান্ত নিশ্চিত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Propose Change Modal (Step 3) */}
      {proposalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                নতুন পলিসি পরিবর্তন প্রস্তাবনা তৈরি (Step 3)
              </h3>
              <button
                onClick={() => setProposalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">দেশ ও ভিসা পলিসি নির্বাচন করুন</label>
                <select
                  required
                  value={propVisaReqId}
                  onChange={(e) => setPropVisaReqId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {countriesList.map((c) =>
                    c.visaRequirements?.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {c.nameBn} - {c.visaTypes?.[0]?.nameEn || "Student Visa"} ({v.id.substring(0, 8)})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">পলিসি শিরোনাম</label>
                  <input
                    required
                    type="text"
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="UK Visa Maintenance 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ক্যাটাগরি</label>
                  <select
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="FINANCIAL_MAINTENANCE">ফাইন্যান্সিয়াল মেইনটেন্যান্স / ব্যাংক ব্যালান্স</option>
                    <option value="TUITION_DEPOSIT">টিউশন ডিপোজিট নিয়ম</option>
                    <option value="WORK_RIGHTS">কাজের অধিকার ও সময়সীমা</option>
                    <option value="DOCUMENT_REQUIREMENTS">কাগজপত্র ও সত্যায়ন নিয়ম</option>
                    <option value="GENERAL_IMMIGRATION">সাধারণ ইমিগ্রেশন ধারা</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">পূর্ববর্তী মান (Old Value)</label>
                  <input
                    required
                    type="text"
                    value={propOldVal}
                    onChange={(e) => setPropOldVal(e.target.value)}
                    placeholder="£1,023 per month"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">নতুন প্রস্তাবিত মান (New Value)</label>
                  <input
                    required
                    type="text"
                    value={propNewVal}
                    onChange={(e) => setPropNewVal(e.target.value)}
                    placeholder="£1,483 per month"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">উৎস সংস্থা (Authority)</label>
                  <input
                    required
                    type="text"
                    value={propSourceOrg}
                    onChange={(e) => setPropSourceOrg(e.target.value)}
                    placeholder="UK Visas and Immigration"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">কার্যকর হওয়ার তারিখ</label>
                  <input
                    required
                    type="date"
                    value={propEffectiveDate}
                    onChange={(e) => setPropEffectiveDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">অফিসিয়াল গেজেট / সার্কুলার লিংক</label>
                <input
                  required
                  type="url"
                  value={propGazetteUrl}
                  onChange={(e) => setPropGazetteUrl(e.target.value)}
                  placeholder="https://www.gov.uk/government/publications/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">বিস্তারিত বাংলা সারাংশ ও ব্যাখ্যা</label>
                <textarea
                  required
                  rows={3}
                  value={propSummaryBn}
                  onChange={(e) => setPropSummaryBn(e.target.value)}
                  placeholder="হোম অফিসের নতুন সার্কুলার অনুযায়ী লন্ডনের বাইরে মাসিক লিভিং কস্ট ১,০২৩ থেকে বেড়ে ১,৪৮৩ পাউন্ড নির্ধারিত হয়েছে..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProposalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm"
                >
                  {submittingProposal ? "সাবমিট হচ্ছে..." : "প্রস্তাবনা জমা দিন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
