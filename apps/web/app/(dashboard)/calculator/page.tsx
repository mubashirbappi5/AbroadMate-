"use client";

import React, { useState, useMemo } from "react";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import {
  calculateFullBudgetPlan,
  VERIFIED_EXCHANGE_RATES,
  FinancialBudgetPlanResult,
} from "@abroadmate/shared";
import {
  Calculator,
  Banknote,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Plane,
  Building,
  GraduationCap,
  Calendar,
  Save,
  History,
  FileCheck,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export default function FinancialCalculatorPage() {
  const [selectedCountry, setSelectedCountry] = useState<"GB" | "CA" | "AU" | "DE" | "US">("GB");
  const [degreeLevel, setDegreeLevel] = useState<string>("MASTERS");
  const [durationYears, setDurationYears] = useState<number>(1.0);
  const [isInsideLondon, setIsInsideLondon] = useState<boolean>(false);

  // Inflow / Expenses Form State
  const [tuitionFee, setTuitionFee] = useState<number>(16000);
  const [tuitionDepositPaid, setTuitionDepositPaid] = useState<number>(3000);
  const [scholarshipOffset, setScholarshipOffset] = useState<number>(2000);
  const [studentSavings, setStudentSavings] = useState<number>(10000);
  const [sponsorFunds, setSponsorFunds] = useState<number>(5000);
  const [loanFunds, setLoanFunds] = useState<number>(0);
  const [monthlyCapacityBdt, setMonthlyCapacityBdt] = useState<number>(35000);
  const [monthsLeft, setMonthsLeft] = useState<number>(6);

  // UI State
  const [planTitle, setPlanTitle] = useState<string>("আমার স্টাডি অ্যাব্রড বাজেট");
  const [revisionNotes, setRevisionNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<"ALL" | "PRE_DEPARTURE" | "STATUTORY_IMMIGRATION" | "TRAVEL_SETTLEMENT" | "LIVING_STUDY">("ALL");

  // Country Defaults Handler
  const handleCountryChange = (code: "GB" | "CA" | "AU" | "DE" | "US") => {
    setSelectedCountry(code);
    if (code === "DE") {
      setTuitionFee(0);
      setTuitionDepositPaid(0);
      setScholarshipOffset(0);
      setStudentSavings(8000);
      setSponsorFunds(5000);
      setDurationYears(2.0);
    } else if (code === "GB") {
      setTuitionFee(16000);
      setTuitionDepositPaid(3000);
      setScholarshipOffset(2000);
      setStudentSavings(10000);
      setSponsorFunds(6000);
      setDurationYears(1.0);
    } else if (code === "CA") {
      setTuitionFee(20000);
      setTuitionDepositPaid(5000);
      setScholarshipOffset(2000);
      setStudentSavings(15000);
      setSponsorFunds(15000);
      setDurationYears(2.0);
    } else if (code === "AU") {
      setTuitionFee(32000);
      setTuitionDepositPaid(8000);
      setScholarshipOffset(3000);
      setStudentSavings(20000);
      setSponsorFunds(25000);
      setDurationYears(2.0);
    } else if (code === "US") {
      setTuitionFee(26000);
      setTuitionDepositPaid(2000);
      setScholarshipOffset(4000);
      setStudentSavings(20000);
      setSponsorFunds(20000);
      setDurationYears(2.0);
    }
  };

  // Live Deterministic Calculation
  const plan: FinancialBudgetPlanResult = useMemo(() => {
    return calculateFullBudgetPlan({
      countryCode: selectedCountry,
      degreeLevel,
      studyDurationYears: durationYears,
      grossTuitionAnnualLocal: tuitionFee,
      tuitionDepositPaidLocal: tuitionDepositPaid,
      scholarshipDeductionLocal: scholarshipOffset,
      studentSavingsLocal: studentSavings,
      sponsorContributionLocal: sponsorFunds,
      educationLoanLocal: loanFunds,
      monthlySavingsCapacityBdt: monthlyCapacityBdt,
      monthsUntilDeparture: monthsLeft,
      isInsideLondonOrMetro: isInsideLondon,
    });
  }, [
    selectedCountry,
    degreeLevel,
    durationYears,
    tuitionFee,
    tuitionDepositPaid,
    scholarshipOffset,
    studentSavings,
    sponsorFunds,
    loanFunds,
    monthlyCapacityBdt,
    monthsLeft,
    isInsideLondon,
  ]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    if (activeCategoryTab === "ALL") return plan.expenses;
    return plan.expenses.filter((e) => e.phase === activeCategoryTab);
  }, [plan.expenses, activeCategoryTab]);

  // Save Plan API Call
  const handleSavePlan = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const payload = {
        title: planTitle,
        countryCode: selectedCountry,
        degreeLevel,
        studyDurationYears: durationYears,
        currencyCode: plan.currencyCode,
        exchangeRateToBdt: plan.exchangeRateToBdt,
        exchangeRateSource: plan.exchangeRateSource,
        grossTuitionAnnualLocal: tuitionFee,
        tuitionDepositPaidLocal: tuitionDepositPaid,
        scholarshipDeductionLocal: scholarshipOffset,
        studentSavingsLocal: studentSavings,
        sponsorContributionLocal: sponsorFunds,
        educationLoanLocal: loanFunds,
        monthlySavingsCapacityBdt: monthlyCapacityBdt,
        monthsUntilDeparture: monthsLeft,
        revisionNotes: revisionNotes || "বাজেট আপডেট",
      };

      const res = await fetch("/api/financial/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage("✅ বাজেট সফলভাবে ডাটাবেজে সংরক্ষিত ও সংস্করণ স্ন্যাপশট রেকর্ড করা হয়েছে!");
        setRevisionNotes("");
      } else {
        setSaveMessage(data.error || "সংরক্ষণে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      setSaveMessage("সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।");
    } finally {
      setIsSaving(false);
    }
  };

  // Feasibility Badge Component
  const renderFeasibilityBadge = (status: string) => {
    switch (status) {
      case "SURPLUS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            সারপ্লাস / উদ্বৃত্ত ফান্ড (Surplus)
          </span>
        );
      case "FEASIBLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            মাসিক সঞ্চয় সম্ভব (Feasible)
          </span>
        );
      case "CHALLENGING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            চ্যালেঞ্জিং সঞ্চয় লক্ষ্য (Challenging)
          </span>
        );
      case "HIGH_GAP":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            উচ্চ আর্থিক ঘাটতি (High Gap)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <PiggyBank className="w-4 h-4" />
              <span>১৮টি ব্যয়ের খাত • ভেরিফায়েড সংবিধিবদ্ধ রুলস • বাংলাদেশ ব্যাংক রেট</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              স্টাডি অ্যাব্রড ফাইন্যান্সিয়াল প্ল্যানার ও বাজেট ট্র্যাকার
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              টিউশন ফি, সরকারি ভিসা ফি, স্বাস্থ্য বীমা (IHS/OSHC), ঢাকা থেকে ফ্লাইট এবং জীবনযাত্রার
              বাস্তব খরচ বাংলাদেশি টাকায় (BDT) নিখুঁতভাবে প্ল্যান করুন।
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-brand-800/80 border border-brand-700 rounded-xl text-xs font-bold text-brand-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>জিরো-এজেন্সি স্বচ্ছতা</span>
            </span>
          </div>
        </div>
      </div>

      {/* Country Selection Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {COUNTRY_LIST.map((c) => (
          <button
            key={c.code}
            onClick={() => handleCountryChange(c.code as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
              selectedCountry === c.code
                ? "bg-brand-700 text-white shadow-md ring-2 ring-brand-700/30 scale-102"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <span className="text-xl">{c.flag}</span>
            <span>{c.nameBn}</span>
          </button>
        ))}
      </div>

      {/* Core Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 1st Year Arrival Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand-700" />
            ১ম বছরের প্রারম্ভিক মোট খরচ
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {plan.firstYearTotalCostLocal.toLocaleString()} {plan.currencyCode}
          </div>
          <div className="text-xs font-bold text-brand-800">
            ~ ৳{plan.firstYearTotalCostBdt.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            প্রি-ডিপারচার, ভিসা, ফ্লাইট, ১ম বর্ষের টিউশন ও লিভিং সহ
          </span>
        </div>

        {/* Card 2: Full Degree Projection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-brand-700" />
            সম্পূর্ণ ডিগ্রির মোট খরচ ({durationYears} বছর)
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {plan.totalDegreeCostLocal.toLocaleString()} {plan.currencyCode}
          </div>
          <div className="text-xs font-bold text-slate-700">
            ~ ৳{plan.totalDegreeCostBdt.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            সম্পূর্ণ কোর্সের সম্ভাব্য মোট আর্থিক দায়বদ্ধতা
          </span>
        </div>

        {/* Card 3: Total Available Inflows */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            মোট প্রস্তুতকৃত ফান্ড
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">
            {plan.totalAvailableFundsLocal.toLocaleString()} {plan.currencyCode}
          </div>
          <div className="text-xs font-bold text-emerald-800">
            ~ ৳{plan.totalAvailableFundsBdt.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            সঞ্চয় + স্পনসর + লোন + পরিশোধিত ডিপোজিট
          </span>
        </div>

        {/* Card 4: Funding Gap / Surplus */}
        <div
          className={`p-5 rounded-2xl border shadow-xs space-y-1 ${
            plan.fundingGapLocal > 0
              ? "bg-rose-50 border-rose-200 text-rose-950"
              : "bg-emerald-50 border-emerald-200 text-emerald-950"
          }`}
        >
          <span className="text-xs font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {plan.fundingGapLocal > 0 ? "অবশিষ্ট ফান্ডের ঘাটতি (Gap)" : "নিরাপদ উদ্বৃত্ত (Surplus)"}
          </span>
          <div className="text-xl sm:text-2xl font-extrabold">
            {plan.fundingGapLocal > 0
              ? `${plan.fundingGapLocal.toLocaleString()} ${plan.currencyCode}`
              : "কোনো ঘাটতি নেই"}
          </div>
          <div className="text-xs font-bold">
            {plan.fundingGapLocal > 0
              ? `~ ৳${plan.fundingGapBdt.toLocaleString()}`
              : "সম্পূর্ণ ফান্ড প্রস্তুত"}
          </div>
          <span className="text-[10px] block opacity-80 pt-1">
            {plan.fundingGapLocal > 0
              ? `দেশত্যাগের পূর্বে এই টাকা প্রস্তুত করতে হবে`
              : `১ম বর্ষের পূর্ণ খরচ কভার্ড`}
          </span>
        </div>
      </div>

      {/* Main Controls & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs Column (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-brand-700" />
              <span>আপনার আর্থিক ইনপুট</span>
            </h2>
            <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-slate-700">
              ১ {plan.currencyCode} = {plan.exchangeRateToBdt} ৳
            </span>
          </div>

          {/* Degree Duration & Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ডিগ্রির স্তর
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="MASTERS">মাস্টার্স (Masters)</option>
                <option value="BACHELORS">ব্যাচেলর (Bachelors)</option>
                <option value="PHD">পিএইচডি (PhD / Research)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কোর্সের মেয়াদ (বছর)
              </label>
              <select
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value={1.0}>১ বছর (1 Year)</option>
                <option value={1.5}>১.৫ বছর (1.5 Years)</option>
                <option value={2.0}>২ বছর (2 Years)</option>
                <option value={3.0}>৩ বছর (3 Years)</option>
                <option value={4.0}>৪ বছর (4 Years)</option>
              </select>
            </div>
          </div>

          {/* UK Specific Metro Checkbox */}
          {selectedCountry === "GB" && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isInsideLondon}
                onChange={(e) => setIsInsideLondon(e.target.checked)}
                className="rounded text-brand-700"
              />
              <span>বিশ্ববিদ্যালয় লন্ডন শহরের ভেতরে (Inner London)?</span>
            </label>
          )}

          {/* Academic Tuition & Deductions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 block">টিউশন ও স্কলারশিপ:</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বার্ষিক টিউশন ({plan.currencyCode})
                </label>
                <input
                  type="number"
                  value={tuitionFee}
                  onChange={(e) => setTuitionFee(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  স্কলারশিপ ছাড় ({plan.currencyCode})
                </label>
                <input
                  type="number"
                  value={scholarshipOffset}
                  onChange={(e) => setScholarshipOffset(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium text-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                অগ্রিম পরিশোধিত টিউশন ডিপোজিট ({plan.currencyCode})
              </label>
              <input
                type="number"
                value={tuitionDepositPaid}
                onChange={(e) => setTuitionDepositPaid(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Funding Sources Inflows */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 block">বর্তমান আর্থিক সংস্থান (Inflows):</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  শিক্ষার্থীর সঞ্চয় ({plan.currencyCode})
                </label>
                <input
                  type="number"
                  value={studentSavings}
                  onChange={(e) => setStudentSavings(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পিতা-মাতার ফান্ড ({plan.currencyCode})
                </label>
                <input
                  type="number"
                  value={sponsorFunds}
                  onChange={(e) => setSponsorFunds(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                অনুমোদিত শিক্ষা ঋণ / ব্যাংক লোন ({plan.currencyCode})
              </label>
              <input
                type="number"
                value={loanFunds}
                onChange={(e) => setLoanFunds(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Monthly Savings Capacity & Countdown */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 block">সঞ্চয় পরিকল্পনা ও সময়সীমা:</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মাসিক সঞ্চয় ক্ষমতা (BDT ৳)
                </label>
                <input
                  type="number"
                  value={monthlyCapacityBdt}
                  onChange={(e) => setMonthlyCapacityBdt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  দেশত্যাগের বাকি (মাস)
                </label>
                <input
                  type="number"
                  value={monthsLeft}
                  min={1}
                  max={36}
                  onChange={(e) => setMonthsLeft(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Save Plan Inputs */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">বাজেট প্ল্যানের শিরোনাম</label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none font-medium"
            />

            <input
              type="text"
              placeholder="এই সংস্করণের পরিবর্তন নোট (ঐচ্ছিক)"
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none"
            />

            <button
              onClick={handleSavePlan}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "বাজেট প্ল্যান ও রিভিশন সেভ করুন"}</span>
            </button>

            {saveMessage && (
              <p className="text-xs text-center font-semibold text-brand-900 pt-1">
                {saveMessage}
              </p>
            )}
          </div>
        </div>

        {/* Right Output & Breakdown Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Savings Target & Feasibility Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                মাসিক সঞ্চয় রোডম্যাপ ও ফিজিবিলিটি
              </span>
              {renderFeasibilityBadge(plan.savingsFeasibility)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-slate-500 block">প্রয়োজনীয় মাসিক সঞ্চয় লক্ষ্য (Target)</span>
                <span className="text-2xl font-black text-brand-900">
                  ৳{plan.targetMonthlySavingsBdt.toLocaleString()}
                  <span className="text-xs font-semibold text-slate-500"> / মাস</span>
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 block">আপনার ঘোষিত মাসিক সক্ষমতা</span>
                <span className="text-sm font-bold text-slate-700">
                  ৳{plan.monthlySavingsCapacityBdt.toLocaleString()} / মাস
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              <Sparkles className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-0.5">অ্যানালাইটিক্স পরামর্শ:</strong>
                {plan.feasibilityRecommendationBn}
              </div>
            </div>
          </div>

          {/* Visual Expense Breakdown Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>ব্যয়ের আনুপাতিক বিভাজন (Expense Breakdown Chart)</span>
              <span className="text-xs text-slate-500 font-normal">১ম বছরের মোট খরচের শতকরা হার</span>
            </h3>

            {/* Segmented Progress Bar */}
            <div className="h-5 w-full rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5">
              <div
                style={{ width: `${plan.chartDistribution.tuitionPercent}%` }}
                className="bg-brand-700 rounded-l-full transition-all"
                title={`টিউশন ফি: ${plan.chartDistribution.tuitionPercent}%`}
              />
              <div
                style={{ width: `${plan.chartDistribution.livingPercent}%` }}
                className="bg-emerald-500 transition-all"
                title={`জীবনযাত্রা ও আবাসন: ${plan.chartDistribution.livingPercent}%`}
              />
              <div
                style={{ width: `${plan.chartDistribution.statutoryFeesPercent}%` }}
                className="bg-blue-600 transition-all"
                title={`সরকারি ভিসা ও স্বাস্থ্য সারচার্জ: ${plan.chartDistribution.statutoryFeesPercent}%`}
              />
              <div
                style={{ width: `${plan.chartDistribution.travelSettlementPercent}%` }}
                className="bg-amber-500 transition-all"
                title={`ফ্লাইট ও সেটেলমেন্ট: ${plan.chartDistribution.travelSettlementPercent}%`}
              />
              <div
                style={{ width: `${plan.chartDistribution.preDeparturePercent}%` }}
                className="bg-indigo-500 rounded-r-full transition-all"
                title={`প্রি-ডিপারচার প্রস্তুতি: ${plan.chartDistribution.preDeparturePercent}%`}
              />
            </div>

            {/* Chart Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-700 shrink-0" />
                <span className="text-slate-700">টিউশন ফি ({plan.chartDistribution.tuitionPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-700">লিভিং ও বাসা ({plan.chartDistribution.livingPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                <span className="text-slate-700">ভিসা ও IHS ({plan.chartDistribution.statutoryFeesPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700">ফ্লাইট ও সেটেলমেন্ট ({plan.chartDistribution.travelSettlementPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
                <span className="text-slate-700">প্রি-ডিপারচার ({plan.chartDistribution.preDeparturePercent}%)</span>
              </div>
            </div>
          </div>

          {/* Granular 18 Expense Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  ১৮টি ব্যয়ের বিস্তারিত হিসাব ও সরকারি সোর্স রেফারেন্স
                </h3>
                <span className="text-xs text-slate-500 block mt-0.5">
                  সবগুলো খরচের পাশে সরকারি সংবিধিবদ্ধ রুলস ও এস্টিমেটেড ব্যাজ প্রদর্শিত
                </span>
              </div>

              {/* Phase Filter Tabs */}
              <div className="flex flex-wrap gap-1 text-[11px]">
                <button
                  onClick={() => setActiveCategoryTab("ALL")}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    activeCategoryTab === "ALL" ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  সবগুলো
                </button>
                <button
                  onClick={() => setActiveCategoryTab("LIVING_STUDY")}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    activeCategoryTab === "LIVING_STUDY" ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  টিউশন ও লিভিং
                </button>
                <button
                  onClick={() => setActiveCategoryTab("STATUTORY_IMMIGRATION")}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    activeCategoryTab === "STATUTORY_IMMIGRATION" ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  ভিসা ও স্বাস্থ্য
                </button>
                <button
                  onClick={() => setActiveCategoryTab("PRE_DEPARTURE")}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    activeCategoryTab === "PRE_DEPARTURE" ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  প্রি-ডিপারচার
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {filteredExpenses.map((exp) => (
                <div key={exp.id} className="p-4 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-slate-900">{exp.nameBn}</strong>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          exp.isVerifiedStatutory
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {exp.isVerifiedStatutory ? "সরকারি নির্ধারিত" : "আনুমানিক (Estimated)"}
                      </span>
                    </div>

                    {exp.citationSource && (
                      <p className="text-[11px] text-slate-500">
                        উৎস: {exp.citationSource} {exp.effectiveDate ? `(${exp.effectiveDate})` : ""}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <strong className="text-xs sm:text-sm text-slate-900 block font-bold">
                      {exp.amountLocal.toLocaleString()} {plan.currencyCode}
                    </strong>
                    <span className="text-[11px] text-brand-800 font-semibold block">
                      ~ ৳{exp.amountBdt.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Exchange Rate Citation Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong>মুদ্রা বিনিময় হার সূত্র:</strong> {plan.exchangeRateSource} (১ {plan.currencyCode} = {plan.exchangeRateToBdt} BDT, {plan.exchangeRateTimestamp})।
              সরকারি নীতিমালার সংবিধিবদ্ধ ফি ব্যতীত জীবনযাত্রার খরচ শিক্ষার্থীভেদে কিছুটা পরিবর্তনশীল হতে পারে।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
