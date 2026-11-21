"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  Plane,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  Check,
  Briefcase,
  Layers,
  Clock,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from "lucide-react";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import {
  ScholarshipEvaluationResult,
  FundingImpactSummary,
} from "@abroadmate/scholarship-engine";

interface Scholarship {
  id: string;
  countryCode: string;
  titleEn: string;
  titleBn: string;
  providerName: string;
  providerType: string;
  fundingType: string;
  tuitionCoveragePercent: number;
  livingStipendMonthly?: number | null;
  livingStipendCurrency?: string | null;
  travelSupport: boolean;
  accommodationSupport: boolean;
  healthInsuranceCovered: boolean;
  visaFeeCovered: boolean;
  coverageDescriptionBn: string;
  eligibilityCriteriaBn: string;
  officialPortalUrl: string;
  applicationDeadline?: string | null;
  deadlineNotice?: string | null;
  country: {
    nameBn: string;
    flagEmoji: string;
  };
  eligibilityRules?: Array<{
    minCgpaRequired?: number | null;
    minIeltsRequired?: number | null;
    workExperienceMonths?: number;
    eligibleDegreeLevels: string[];
  }>;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedFundingType, setSelectedFundingType] = useState<string>("ALL");
  const [selectedDegree, setSelectedDegree] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Evaluated Match results
  const [evaluatedMatches, setEvaluatedMatches] = useState<
    Record<string, ScholarshipEvaluationResult>
  >({});
  const [isMatching, setIsMatching] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // Active Funding Decision state
  const [activeDecision, setActiveDecision] = useState<any>(null);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Detail Modal state
  const [activeModalScholarship, setActiveModalScholarship] = useState<Scholarship | null>(null);
  const [decisionImpact, setDecisionImpact] = useState<FundingImpactSummary | null>(null);

  // 1. Load Initial Scholarships and Active Funding Decision
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [schRes, decisionRes] = await Promise.all([
          fetch("/api/scholarships?limit=50"),
          fetch("/api/funding-decision"),
        ]);

        const schJson = await schRes.json();
        if (schJson.success && schJson.data?.scholarships) {
          setScholarships(schJson.data.scholarships);
        }

        const decJson = await decisionRes.json();
        if (decJson.success && decJson.data?.activeDecision) {
          setActiveDecision(decJson.data.activeDecision);
        }
      } catch (e) {
        console.error("Failed to load scholarships:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // 2. Perform Deterministic Match for Student Profile
  const handleRunMatch = async () => {
    try {
      setIsMatching(true);
      const res = await fetch("/api/scholarships/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const json = await res.json();
      if (json.success && json.data?.evaluations) {
        const map: Record<string, ScholarshipEvaluationResult> = {};
        json.data.evaluations.forEach((evalResult: ScholarshipEvaluationResult) => {
          map[evalResult.scholarshipId] = evalResult;
        });
        setEvaluatedMatches(map);
        setHasEvaluated(true);
      }
    } catch (e) {
      console.error("Failed to run scholarship match:", e);
    } finally {
      setIsMatching(false);
    }
  };

  // 3. Handle Funding Choice Decision
  const handleFundingChoice = async (
    choiceType: "SCHOLARSHIP_FUNDED" | "SELF_FUNDED",
    scholarshipId?: string
  ) => {
    try {
      setIsSubmittingDecision(true);
      setDecisionFeedback(null);

      const res = await fetch("/api/funding-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          choiceType,
          scholarshipId,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setActiveDecision(json.data.decision);
        setDecisionImpact(json.data.impact);
        setDecisionFeedback(json.message);
      } else {
        alert(json.error || "ফান্ডিং সিদ্ধান্ত সংরক্ষণে সমস্যা হয়েছে।");
      }
    } catch (e) {
      console.error("Failed to submit funding decision:", e);
      alert("সার্ভারে ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  // 4. Filtering and Sorting
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      if (selectedCountry !== "ALL" && s.countryCode !== selectedCountry) return false;
      if (selectedFundingType !== "ALL" && s.fundingType !== selectedFundingType) return false;
      if (selectedDegree !== "ALL") {
        const levels = s.eligibilityRules?.[0]?.eligibleDegreeLevels || [];
        if (!levels.includes(selectedDegree)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          s.titleEn.toLowerCase().includes(q) ||
          s.titleBn.toLowerCase().includes(q) ||
          s.providerName.toLowerCase().includes(q);
        if (!matchTitle) return false;
      }
      return true;
    });
  }, [scholarships, selectedCountry, selectedFundingType, selectedDegree, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>১০০% ফ্রি ও ভেরিফায়েড সরকারি স্কলারশিপ ডিরেক্টরি</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            সরকারি ও বিশ্ববিদ্যালয় স্কলারশিপ ফাইন্ডার
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            ইউকে শেভেনিং, কমনওয়েলথ, জার্মান ডিএএডি, অস্ট্রেলিয়া অ্যাওয়ার্ডস ও আমেরিকান ফুলব্রাইট সহ
            শীর্ষ সম্মানজনক ফুল-রাইড স্কলারশিপের ভেরিফায়েড শর্তাবলি জানুন এবং আপনার প্রোফাইলের জন্য উপযুক্ত অর্থায়ন বেছে নিন।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunMatch}
              disabled={isMatching}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>যোগ্যতা যাচাই হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>আমার প্রোফাইল দিয়ে স্বয়ংক্রিয় যোগ্যতা যাচাই করুন</span>
                </>
              )}
            </button>

            {activeDecision && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-medium border border-white/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  বর্তমান ফান্ডিং রুট:{" "}
                  <strong>
                    {activeDecision.choiceType === "SCHOLARSHIP_FUNDED"
                      ? "স্কলারশিপ অর্থায়ন"
                      : "স্ব-অর্থায়ন (Self-funded)"}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Country Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> দেশ:
          </span>
          <button
            onClick={() => setSelectedCountry("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCountry === "ALL"
                ? "bg-brand-700 text-white shadow-2xs"
                : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            সকল দেশ ({scholarships.length})
          </button>
          {COUNTRY_LIST.map((c) => {
            const count = scholarships.filter((s) => s.countryCode === c.code).length;
            return (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCountry === c.code
                    ? "bg-brand-700 text-white shadow-2xs"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.nameBn}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Degree & Funding Type Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">কভারেজ:</span>
            {[
              { id: "ALL", label: "সব ধরনের" },
              { id: "FULL_FUNDED", label: "১০০% সম্পূর্ণ অর্থায়িত (Full Ride)" },
              { id: "TUITION_ONLY", label: "টিউশন ফি মওকুফ" },
              { id: "PARTIAL_WAIVER", label: "আংশিক বৃত্তি" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFundingType(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedFundingType === f.id
                    ? "bg-emerald-100 text-emerald-900 font-bold border border-emerald-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="স্কলারশিপ খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-600"
            />
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredScholarships.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">কোনো স্কলারশিপ খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500">
            ফিল্টারের শর্ত শিথিল করুন অথবা অন্য দেশ নির্বাচন করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((sch) => {
            const rule = sch.eligibilityRules?.[0];
            const evalResult = evaluatedMatches[sch.id];

            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group border-t-4 border-t-brand-700"
              >
                <div className="p-5 space-y-4">
                  {/* Top Header: Country & Provider */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sch.country?.flagEmoji}</span>
                      <div>
                        <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider block">
                          {sch.providerName}
                        </span>
                        <span className="text-xs text-slate-500">{sch.country?.nameBn}</span>
                      </div>
                    </div>

                    {evalResult && (
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                          evalResult.status === "ELIGIBLE"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : evalResult.status === "CONDITIONALLY_ELIGIBLE"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        {evalResult.matchScore}% ম্যাচ
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
                      {sch.titleBn}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">{sch.titleEn}</span>
                  </div>

                  {/* Badges: Benefits */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {sch.fundingType === "FULL_FUNDED" && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        ১০০% ফুল-রাইড
                      </span>
                    )}
                    {sch.livingStipendMonthly && sch.livingStipendMonthly > 0 && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                        মাসিক ভাতা: {sch.livingStipendMonthly} {sch.livingStipendCurrency}
                      </span>
                    )}
                    {sch.travelSupport && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                        <Plane className="w-3 h-3" /> বিমান টিকিট
                      </span>
                    )}
                  </div>

                  {/* Eligibility summary */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">ন্যূনতম সিজিপিএ:</span>
                      <span className="font-bold text-slate-900">
                        {rule?.minCgpaRequired ? `${rule.minCgpaRequired.toFixed(2)} / ৪.০` : "শিথিলযোগ্য"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">আইইএলটিএস ব্যান্ড:</span>
                      <span className="font-bold text-slate-900">
                        {rule?.minIeltsRequired ? `ওভারঅল ${rule.minIeltsRequired.toFixed(1)}` : "আইইএলটিএস ছাড়াও প্রযোজ্য"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">কাজের অভিজ্ঞতা:</span>
                      <span className="font-bold text-slate-900">
                        {rule?.workExperienceMonths
                          ? `${rule.workExperienceMonths} মাস (${Math.round(rule.workExperienceMonths / 12)} বছর)`
                          : "ফ্রেশ গ্র্যাজুয়েটরা প্রযোজ্য"}
                      </span>
                    </div>
                  </div>

                  {/* Deadline notice */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sch.deadlineNotice || "প্রতি বছর নির্ধারিত ইনটেকে"}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveModalScholarship(sch);
                      setDecisionFeedback(null);
                    }}
                    className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
                  >
                    <span>বিস্তারিত ও ফান্ডিং নির্বাচন</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <a
                    href={sch.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-brand-700 transition-colors"
                    title="অফিসিয়াল পোর্টাল"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Scholarship Detail & Funding Decision Modal */}
      {activeModalScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{activeModalScholarship.country?.flagEmoji}</span>
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                    {activeModalScholarship.providerName}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeModalScholarship.titleBn}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {activeModalScholarship.titleEn}
                </span>
              </div>

              <button
                onClick={() => setActiveModalScholarship(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Coverage Description */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block">সুবিধাসমূহ (Benefits Covered):</span>
              <p className="leading-relaxed">{activeModalScholarship.coverageDescriptionBn}</p>
            </div>

            {/* Expenses Comparison: Covered vs Uncovered (BDT) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-brand-700" />
                <span>ব্যয় বিশ্লেষণ (Covered vs Uncovered in BDT)</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-emerald-700 font-bold block">স্কলারশিপ যা বহন করবে:</span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    <li>✓ ১০০% পূর্ণ টিউশন ফি</li>
                    {activeModalScholarship.livingStipendMonthly && (
                      <li>
                        ✓ মাসিক লিভিং ভাতা ({activeModalScholarship.livingStipendMonthly}{" "}
                        {activeModalScholarship.livingStipendCurrency})
                      </li>
                    )}
                    {activeModalScholarship.travelSupport && <li>✓ রিটার্ন আন্তর্জাতিক বিমান টিকিট</li>}
                    {activeModalScholarship.healthInsuranceCovered && <li>✓ পূর্ণাঙ্গ স্বাস্থ্য বীমা</li>}
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5">
                  <span className="text-amber-800 font-bold block">আপনার ব্যক্তিগত বাফার (BDT):</span>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    <li>• আইইএলটিএস পরীক্ষা ফি: ~৳২৫,০০০</li>
                    <li>• পাসপোর্ট ও ভেরিফিকেশন: ~৳৬,০০০</li>
                    <li>• প্রাথমিক লাগেজ ও পকেটমানি: ~৳৫০,০০০</li>
                    <li className="font-bold text-amber-900 pt-1 border-t border-amber-200">
                      মোট প্রাক-প্রস্তুতি ব্যয়: ~৳৯৩,০০০
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Integrated Funding Decision Box (Prompt 07 Core Deliverable) */}
            <div className="p-5 bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl border-2 border-brand-600/60 space-y-4">
              <div>
                <span className="text-xs font-bold text-brand-900 uppercase tracking-wider block">
                  আপনার উচ্চশিক্ষার ফান্ডিং সিদ্ধান্ত (Funding Choice)
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  নিচের অপশনগুলোর মাধ্যমে আপনার অর্থায়ন কৌশল নির্ধারণ করুন। আপনার পূর্ববর্তী সকল সম্পন্ন কাজ নিরাপদ থাকবে।
                </p>
              </div>

              {decisionFeedback && (
                <div className="p-3 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{decisionFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Scholarship Funded */}
                <button
                  type="button"
                  disabled={isSubmittingDecision}
                  onClick={() => handleFundingChoice("SCHOLARSHIP_FUNDED", activeModalScholarship.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    activeDecision?.choiceType === "SCHOLARSHIP_FUNDED" &&
                    activeDecision?.scholarshipId === activeModalScholarship.id
                      ? "border-emerald-600 bg-emerald-100/70 shadow-sm"
                      : "border-slate-300 bg-white hover:border-emerald-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                      <span>🌟 ১. Scholarship নিয়ে যেতে চাই</span>
                    </span>
                    {activeDecision?.choiceType === "SCHOLARSHIP_FUNDED" &&
                      activeDecision?.scholarshipId === activeModalScholarship.id && (
                        <Check className="w-4 h-4 text-emerald-700" />
                      )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    এই বৃত্তি সিলেক্ট করুন। ব্যাংক সলভেন্সি শিথিল হবে এবং এসওপি ও রেফারেন্স টাস্ক রোডম্যাপে সক্রিয় হবে।
                  </p>
                </button>

                {/* Option 2: Self-Funded */}
                <button
                  type="button"
                  disabled={isSubmittingDecision}
                  onClick={() => handleFundingChoice("SELF_FUNDED")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    activeDecision?.choiceType === "SELF_FUNDED"
                      ? "border-slate-800 bg-slate-100 shadow-sm"
                      : "border-slate-300 bg-white hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>💼 ২. নিজের খরচে যেতে চাই</span>
                    </span>
                    {activeDecision?.choiceType === "SELF_FUNDED" && (
                      <Check className="w-4 h-4 text-slate-800" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    স্কলারশিপ ছাড়া আবেদন। পূর্ণ টিউশন ও ২৮-দিন ব্যাংক সলভেন্সি ট্র্যাকিং টাস্ক রোডম্যাপে যুক্ত হবে।
                  </p>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-brand-700" />
                <span>আপনি পরবর্তীতে যেকোনো সময় আপনার সিদ্ধান্ত পরিবর্তন (Switch) করতে পারবেন।</span>
              </div>
            </div>

            {/* Official Link */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={activeModalScholarship.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 underline"
              >
                <span>অফিসিয়াল পোর্টালে সার্কুলার দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setActiveModalScholarship(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
