"use client";

import React, { useState, useMemo } from "react";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import {
  COUNTRY_VISA_GUIDES,
  calculateDetailedFinancialProof,
  evaluateStudentVisaEligibility,
  generateCountryWorkflow,
  evaluateDocumentChecklist,
  VisaAssessmentOutput,
} from "@abroadmate/visa-engine";
import {
  CountryCodeType,
  SponsorType,
  EvaluateVisaAssessmentInput,
} from "@abroadmate/validation";
import {
  ShieldCheck,
  Banknote,
  FileCheck,
  ExternalLink,
  AlertTriangle,
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Calculator,
  UserCheck,
} from "lucide-react";

export default function VisaGuidesPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeType>("GB");
  const [activeTab, setActiveTab] = useState<"guide" | "assessment" | "workflow">("guide");
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(1);

  // Assessment Form State
  const [tuitionFee, setTuitionFee] = useState<number>(15000);
  const [tuitionPaid, setTuitionPaid] = useState<number>(3000);
  const [liquidFunds, setLiquidFunds] = useState<number>(20000);
  const [holdingDays, setHoldingDays] = useState<number>(30);
  const [sponsorType, setSponsorType] = useState<SponsorType>("PARENTS");
  const [isInsideLondon, setIsInsideLondon] = useState<boolean>(false);
  const [hasAdmission, setHasAdmission] = useState<boolean>(true);
  const [hasPassport, setHasPassport] = useState<boolean>(true);
  const [hasAcademic, setHasAcademic] = useState<boolean>(true);
  const [hasLanguage, setHasLanguage] = useState<boolean>(true);
  const [hasBankCert, setHasBankCert] = useState<boolean>(true);
  const [hasTaxReturns, setHasTaxReturns] = useState<boolean>(true);
  const [hasMedical, setHasMedical] = useState<boolean>(true);
  const [hasPolice, setHasPolice] = useState<boolean>(false);
  const [hasInsurance, setHasInsurance] = useState<boolean>(true);
  const [hasRefusal, setHasRefusal] = useState<boolean>(false);
  const [refusalCountry, setRefusalCountry] = useState<string>("");

  const countryShared = COUNTRY_LIST.find((c) => c.code === selectedCountry)!;
  const guide = COUNTRY_VISA_GUIDES[selectedCountry] || COUNTRY_VISA_GUIDES.GB;
  const workflowSteps = useMemo(() => generateCountryWorkflow(selectedCountry), [selectedCountry]);

  // Live Assessment Evaluation
  const assessmentInput: EvaluateVisaAssessmentInput = useMemo(
    () => ({
      countryCode: selectedCountry,
      degreeLevel: "MASTERS",
      isInsideLondon,
      tuitionFeeLocal: tuitionFee,
      tuitionFeePaidLocal: tuitionPaid,
      availableLiquidFundsLocal: liquidFunds,
      fundsHoldingDays: holdingDays,
      sponsorType,
      hasOfficialAdmissionConfirmation: hasAdmission,
      hasLanguageProficiencyProof: hasLanguage,
      hasValidPassport: hasPassport,
      hasAcademicCertificates: hasAcademic,
      hasBankSolvencyCertificate: hasBankCert,
      hasSponsorTaxReturns: hasTaxReturns,
      hasMedicalTbClearance: hasMedical,
      hasPoliceClearance: hasPolice,
      hasHealthInsurance: hasInsurance,
      hasPreviousRefusal: hasRefusal,
      refusalCountryCode: refusalCountry || undefined,
      scholarshipFundingBdt: 0,
    }),
    [
      selectedCountry,
      isInsideLondon,
      tuitionFee,
      tuitionPaid,
      liquidFunds,
      holdingDays,
      sponsorType,
      hasAdmission,
      hasLanguage,
      hasPassport,
      hasAcademic,
      hasBankCert,
      hasTaxReturns,
      hasMedical,
      hasPolice,
      hasInsurance,
      hasRefusal,
      refusalCountry,
    ]
  );

  const assessment: VisaAssessmentOutput = useMemo(
    () => evaluateStudentVisaEligibility(assessmentInput),
    [assessmentInput]
  );

  const documentChecklist = useMemo(
    () => evaluateDocumentChecklist(selectedCountry, assessmentInput),
    [selectedCountry, assessmentInput]
  );

  // Status Badge styling helper
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "PRELIMINARY_ELIGIBLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            প্রাথমিক শর্তাবলী পূরণ হয়েছে (Preliminary Eligible)
          </span>
        );
      case "FINANCIAL_GAP":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            আর্থিক বা হোল্ডিং সময়ের ঘাটতি (Financial Gap)
          </span>
        );
      case "DOCUMENTS_MISSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
            <FileCheck className="w-4 h-4 text-orange-600" />
            আবশ্যক ডকুমেন্ট অসম্পূর্ণ (Documents Missing)
          </span>
        );
      case "REQUIREMENTS_MISSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-600" />
            ভর্তিপত্র বা পাসপোর্ট অনুপস্থিত (Requirements Missing)
          </span>
        );
      case "CONDITIONAL_REQUIREMENTS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            শর্তসাপেক্ষে প্রযোজ্য (Conditional Requirements)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            অনির্দিষ্ট (Unable to Determine)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-brand-300">
              ১০০% ভেরিফায়েড সরকারি ইমিগ্রেশন ইন্টেলিজেন্স
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            স্টুডেন্ট ভিসা ও ব্যাংক সলভেন্সি সেন্টার
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            কোন দেশে কত টাকা ব্যাংকে কতদিন রাখতে হয়, কে স্পনসর হতে পারেন এবং ঢাকার ভিএফএস ও
            দূতাবাসের ভিসা প্রক্রিয়ার শতভাগ সত্য নির্দেশিকা। কোনো মধ্যস্বত্বভোগী এজেন্সি ছাড়াই নিজে প্রস্তুত হোন।
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-brand-800/80 border border-brand-700 rounded-xl text-xs font-bold text-brand-100">
            ঢাকা ও সিলেট প্রটোকল
          </span>
        </div>
      </div>

      {/* Country Selection Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {COUNTRY_LIST.map((c) => (
          <button
            key={c.code}
            onClick={() => {
              setSelectedCountry(c.code as CountryCodeType);
              if (c.code === "DE") {
                setTuitionFee(0);
                setTuitionPaid(0);
                setLiquidFunds(12000);
                setHoldingDays(0);
              } else if (c.code === "GB") {
                setTuitionFee(16000);
                setTuitionPaid(4000);
                setLiquidFunds(22000);
                setHoldingDays(28);
              } else if (c.code === "US") {
                setTuitionFee(22000);
                setTuitionPaid(0);
                setLiquidFunds(38000);
                setHoldingDays(10);
              } else if (c.code === "CA") {
                setTuitionFee(18000);
                setTuitionPaid(9000);
                setLiquidFunds(32000);
                setHoldingDays(120);
              } else if (c.code === "AU") {
                setTuitionFee(32000);
                setTuitionPaid(16000);
                setLiquidFunds(48000);
                setHoldingDays(90);
              }
            }}
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

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "guide"
              ? "border-brand-700 text-brand-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>১৫টি পূর্ণাঙ্গ কান্ট্রি সেকশন গাইড</span>
        </button>

        <button
          onClick={() => setActiveTab("assessment")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "assessment"
              ? "border-brand-700 text-brand-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>আমার প্রোফাইল দিয়ে ভিসা অ্যাসেসমেন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab("workflow")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "workflow"
              ? "border-brand-700 text-brand-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>আবেদন ধাপসমূহ ও চেকলিস্ট</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 15-Section Comprehensive Country Knowledge Guide */}
      {/* ======================================================== */}
      {activeTab === "guide" && (
        <div className="space-y-6">
          {/* Header Card for Country */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{countryShared.flag}</span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {countryShared.nameBn} স্টুডেন্ট ভিসা সরকারি নির্দেশিকা
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs bg-brand-50 text-brand-800 font-semibold px-2.5 py-0.5 rounded-md border border-brand-200">
                    {guide.visaSubclassName}
                  </span>
                  <span className="text-xs text-slate-500">
                    কর্তৃপক্ষ: {guide.applicationAuthority}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={countryShared.officialImmigrationPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 px-4 py-2.5 rounded-xl border border-brand-200 transition-colors shrink-0"
            >
              <span>সরকারি ইমিগ্রেশন পোর্টাল</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 15 Sections Accordion / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const).map((secNum) => {
              const sec = guide.sections[secNum];
              const isOpen = openSectionIndex === secNum;
              return (
                <div
                  key={secNum}
                  className={`bg-white rounded-2xl border transition-all ${
                    isOpen ? "border-brand-500 shadow-sm md:col-span-2" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenSectionIndex(isOpen ? null : secNum)}
                    className="w-full text-left p-5 flex items-center justify-between gap-3"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900">
                      {sec.titleBn}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                      {isOpen ? "বন্ধ করুন" : "বিস্তারিত দেখুন"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 whitespace-pre-line">
                      {sec.contentBn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Interactive Student Visa Assessment Tool */}
      {/* ======================================================== */}
      {activeTab === "assessment" && (
        <div className="space-y-6">
          {/* Form and Live Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Column (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-brand-700" />
                <span>আপনার প্রোফাইল ইনপুট দিন</span>
              </h2>

              {/* Tuition & Paid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ১ম বর্ষের টিউশন ফি ({assessment.financialBreakdown.currencyCode})
                  </label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পরিশোধিত ফি ({assessment.financialBreakdown.currencyCode})
                  </label>
                  <input
                    type="number"
                    value={tuitionPaid}
                    onChange={(e) => setTuitionPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>

              {/* Liquid Funds & Holding Days */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ব্যাংক ফান্ড ({assessment.financialBreakdown.currencyCode})
                  </label>
                  <input
                    type="number"
                    value={liquidFunds}
                    onChange={(e) => setLiquidFunds(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    টাকা রাখার দিন (হোল্ডিং)
                  </label>
                  <input
                    type="number"
                    value={holdingDays}
                    onChange={(e) => setHoldingDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>

              {/* Sponsor Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  স্পনসর কে হচ্ছেন?
                </label>
                <select
                  value={sponsorType}
                  onChange={(e) => setSponsorType(e.target.value as SponsorType)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="PARENTS">পিতা-মাতা (বাবা/মা)</option>
                  <option value="SELF">শিক্ষার্থী নিজে (স্ব-অর্থায়ন)</option>
                  <option value="GOVERNMENT_SCHOLARSHIP">সরকারি পূর্ণ স্কলারশিপ</option>
                  <option value="UNIVERSITY_SCHOLARSHIP">বিশ্ববিদ্যালয় স্কলারশিপ</option>
                  <option value="BANK_LOAN">তফসিলি ব্যাংক শিক্ষা ঋণ (Student Loan)</option>
                  <option value="OTHER_RELATIVE">অন্যান্য আত্মীয় (চাচা/মামা/খালা)</option>
                </select>
              </div>

              {/* UK Specific London Checkbox */}
              {selectedCountry === "GB" && (
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isInsideLondon}
                    onChange={(e) => setIsInsideLondon(e.target.checked)}
                    className="rounded text-brand-700 focus:ring-brand-500"
                  />
                  <span>বিশ্ববিদ্যালয় লন্ডন শহরের ভেতরে (Inner London)?</span>
                </label>
              )}

              {/* Core Checkboxes */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-900">ডকুমেন্টস চেকলিস্ট:</span>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAdmission}
                    onChange={(e) => setHasAdmission(e.target.checked)}
                    className="rounded text-brand-700"
                  />
                  <span>চূড়ান্ত ভর্তি নিশ্চিতকরণ (CAS / I-20 / CoE / LOA) আছে</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPassport}
                    onChange={(e) => setHasPassport(e.target.checked)}
                    className="rounded text-brand-700"
                  />
                  <span>বৈধ মূল পাসপোর্ট (কমপক্ষে ৬ মাস মেয়াদ) আছে</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAcademic}
                    onChange={(e) => setHasAcademic(e.target.checked)}
                    className="rounded text-brand-700"
                  />
                  <span>সকল শিক্ষাগত সনদ ও ট্রান্সক্রিপ্ট সত্যায়িত আছে</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLanguage}
                    onChange={(e) => setHasLanguage(e.target.checked)}
                    className="rounded text-brand-700"
                  />
                  <span>ইংরেজি বা জার্মান ভাষা দক্ষতার স্কোরকার্ড আছে</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBankCert}
                    onChange={(e) => setHasBankCert(e.target.checked)}
                    className="rounded text-brand-700"
                  />
                  <span>ব্যাংক সলভেন্সি সার্টিফিকেট ও স্টেটমেন্ট সংগৃহীত</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTaxReturns}
                    onChange={(e) => setHasTaxReturns(e.target.checked)}
                    className="rounded text-brand-700"
                  />
                  <span>স্পনসরের ট্যাক্স রিটার্ন ও আয়ের প্রমাণাদি প্রস্তুত</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasMedical}
                    onChange={(e) => setHasMedical(e.target.checked)}
                    className="rounded text-brand-700"
                  />
                  <span>আইওএম (IOM) যক্ষ্মা বা মেডিকেল টেস্ট সম্পন্ন</span>
                </label>
              </div>

              {/* Prior Refusal Checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasRefusal}
                    onChange={(e) => setHasRefusal(e.target.checked)}
                    className="rounded text-amber-700"
                  />
                  <span>পূর্বে যেকোনো দেশে ভিসা প্রত্যাখ্যাত (Refused) হয়েছিল?</span>
                </label>

                {hasRefusal && (
                  <input
                    type="text"
                    placeholder="রিফিউজ হওয়া দেশের নাম (যেমন: ইউকে, সুইডেন)"
                    value={refusalCountry}
                    onChange={(e) => setRefusalCountry(e.target.value)}
                    className="mt-2 w-full px-3 py-1.5 text-xs rounded-xl border border-amber-300 bg-amber-50 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Results Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Verdict Summary Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    মূল্যায়ন ফলাফল (Assessment Result)
                  </span>
                  {getVerdictBadge(assessment.verdict)}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {assessment.summaryBn}
                </h3>

                {/* Financial Overview Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">অবশিষ্ট টিউশন</span>
                    <strong className="text-xs sm:text-sm text-slate-900">
                      {assessment.financialBreakdown.tuitionRemainingLocal.toLocaleString()}{" "}
                      {assessment.financialBreakdown.currencyCode}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">সংবিধিবদ্ধ লিভিং</span>
                    <strong className="text-xs sm:text-sm text-slate-900">
                      {assessment.financialBreakdown.livingFundsRequiredLocal.toLocaleString()}{" "}
                      {assessment.financialBreakdown.currencyCode}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">মোট আবশ্যক ফান্ড</span>
                    <strong className="text-xs sm:text-sm text-brand-900 font-bold">
                      {assessment.financialBreakdown.totalFundsRequiredLocal.toLocaleString()}{" "}
                      {assessment.financialBreakdown.currencyCode}
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      (~৳{assessment.financialBreakdown.totalFundsRequiredBdt.toLocaleString()})
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      assessment.financialBreakdown.financialGapLocal > 0
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : "bg-emerald-50 border-emerald-200 text-emerald-900"
                    }`}
                  >
                    <span className="text-[11px] block">ফান্ড ঘাটতি (Gap)</span>
                    <strong className="text-xs sm:text-sm font-bold">
                      {assessment.financialBreakdown.financialGapLocal > 0
                        ? `${assessment.financialBreakdown.financialGapLocal.toLocaleString()} ${assessment.financialBreakdown.currencyCode}`
                        : "কোনো ঘাটতি নেই"}
                    </strong>
                    {assessment.financialBreakdown.financialGapLocal > 0 && (
                      <span className="text-[10px] block mt-0.5">
                        (~৳{assessment.financialBreakdown.financialGapBdt.toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>

                {/* Refusal Advisory Banner */}
                {assessment.refusalAdvisoryBn && (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex gap-3 text-xs text-amber-950 leading-relaxed font-medium">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-900 mb-0.5">
                        রিফিউজাল ডিসক্লোজার আইনি বাধ্যবাধকতা:
                      </strong>
                      {assessment.refusalAdvisoryBn}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">
                    পরবর্তী করণীয় পরামর্শ (Actionable Next Steps):
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {assessment.actionableRecommendationsBn.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-700 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Distinction Disclaimer */}
                <p className="text-[11px] text-slate-500 italic pt-2 border-t border-slate-100">
                  {assessment.distinctionNoticeBn}
                </p>
              </div>

              {/* Requirement-by-Requirement Criteria Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  শর্তভিত্তিক বিস্তারিত মূল্যায়ন বিবরণী (Criteria Breakdown)
                </h4>

                <div className="divide-y divide-slate-100">
                  {assessment.requirementResults.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <strong className="text-slate-900 block">{item.requirementName}</strong>
                        <p className="text-slate-600">{item.explanationBn}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-md font-bold text-[11px] shrink-0 ${
                          item.status === "MET"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "MISSING"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status === "MET"
                          ? "পূরণ হয়েছে"
                          : item.status === "MISSING"
                          ? "ঘাটতি রয়েছে"
                          : "শর্তসাপেক্ষ"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: Chronological Workflow Roadmap & Documents */}
      {/* ======================================================== */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          {/* Step-by-Step Chronological Workflow */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {countryShared.nameBn} ভিসা আবেদন পরিক্রমা (Step-by-Step Application Workflow)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                বিশ্ববিদ্যালয় ভর্তি কনফার্মেশন থেকে শুরু করে ঢাকায় বায়োমেট্রিক ও ভিসা প্রাপ্তির সুনির্দিষ্ট ধাপসমূহ।
              </p>
            </div>

            <div className="space-y-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.stepOrder}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-brand-300 transition-all flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-9 h-9 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {step.stepOrder}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900">
                        {step.titleBn}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        আনুমানিক {step.estimatedDurationDays} দিন
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {step.descriptionBn}
                    </p>

                    {step.localAuthorityOrCenter && (
                      <div className="text-xs font-semibold text-brand-900 pt-1">
                        📍 কেন্দ্র: {step.localAuthorityOrCenter}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Verified Document Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-700" />
              <span>আবশ্যক ডকুমেন্ট চেকলিস্ট ও বাংলাদেশি সত্যায়ন নির্দেশিকা</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {documentChecklist.map((doc, idx) => (
                <div key={idx} className="py-4 space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm text-slate-900 font-bold">
                      {doc.titleBn} ({doc.titleEn})
                    </strong>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.isMandatory
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {doc.isMandatory ? "বাধ্যতামূলক" : "শর্তসাপেক্ষ"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{doc.instructionsBn}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                    {doc.issuingAuthorityBn && (
                      <span>
                        <strong>প্রদানকারী অফিস:</strong> {doc.issuingAuthorityBn}
                      </span>
                    )}
                    {doc.attestationRuleBn && (
                      <span className="text-amber-800">
                        <strong>সত্যায়ন নিয়ম:</strong> {doc.attestationRuleBn}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
