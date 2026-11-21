"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Building2,
  GraduationCap,
  ExternalLink,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  BookOpen,
  Bookmark,
  RefreshCw,
  Sliders,
  Check,
  Award,
} from "lucide-react";
import { EligibilityEvaluationOutput } from "@abroadmate/validation";

interface ProgramOption {
  id: string;
  titleEn: string;
  titleBn: string;
  degreeLevel: string;
  department: string;
  university: {
    nameEn: string;
    nameBn: string;
    countryCode: string;
    city: string;
  };
  intakes: Array<{
    id: string;
    season: string;
    year: number;
    applicationDeadline: string;
  }>;
}

export default function AdmissionEligibilityPage() {
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>("");
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Student Input State (Pre-filled with profile or customizable)
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [degreeLevel, setDegreeLevel] = useState<string>("BACHELOR");
  const [discipline, setDiscipline] = useState<string>("Computer Science");
  const [gpa, setGpa] = useState<number>(3.4);
  const [scale, setScale] = useState<number>(4.0);
  const [percentage, setPercentage] = useState<number | "">("");
  const [passingYear, setPassingYear] = useState<number>(2024);

  const [testType, setTestType] = useState<string>("IELTS");
  const [overallScore, setOverallScore] = useState<number>(6.5);
  const [listening, setListening] = useState<number>(6.5);
  const [reading, setReading] = useState<number>(6.5);
  const [writing, setWriting] = useState<number>(6.0);
  const [speaking, setSpeaking] = useState<number>(6.5);
  const [isPlannedOnly, setIsPlannedOnly] = useState<boolean>(false);

  const [workExperienceMonths, setWorkExperienceMonths] = useState<number>(0);
  const [hasPortfolio, setHasPortfolio] = useState<boolean>(false);

  // Result state
  const [result, setResult] = useState<EligibilityEvaluationOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Load Programs on Mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoadingPrograms(true);
        const res = await fetch("/api/discovery/programs?take=30");
        const json = await res.json();
        if (json.success && json.data?.programs?.length > 0) {
          setPrograms(json.data.programs);
          const firstProg = json.data.programs[0];
          setSelectedProgramId(firstProg.id);
          if (firstProg.intakes?.length > 0) {
            setSelectedIntakeId(firstProg.intakes[0].id);
          }
        }

        // Attempt to prefill student profile
        const profRes = await fetch("/api/profile");
        const profJson = await profRes.json();
        if (profJson.success && profJson.data) {
          const prof = profJson.data;
          if (prof.academicRecords?.length > 0) {
            const topRec = prof.academicRecords[0];
            setDegreeLevel(topRec.level);
            setDiscipline(topRec.groupOrMajor || "Computer Science");
            setGpa(topRec.gpaOrCgpa || 3.4);
            setScale(topRec.scale || 4.0);
            setPassingYear(topRec.passingYear || 2024);
          }
          if (prof.languageTests?.length > 0) {
            const topTest = prof.languageTests[0];
            setTestType(topTest.testType);
            setOverallScore(topTest.overallScore || 6.5);
            setListening(topTest.listeningScore || 6.5);
            setReading(topTest.readingScore || 6.5);
            setWriting(topTest.writingScore || 6.0);
            setSpeaking(topTest.speakingScore || 6.5);
            setIsPlannedOnly(!topTest.overallScore || topTest.overallScore === 0);
          }
        }
      } catch (e) {
        console.error("Failed to load initial eligibility data", e);
      } finally {
        setIsLoadingPrograms(false);
      }
    }

    loadInitialData();
  }, []);

  // Update selected intake when selected program changes
  const currentProgram = programs.find((p) => p.id === selectedProgramId);

  useEffect(() => {
    if (currentProgram && currentProgram.intakes?.length > 0 && currentProgram.intakes[0]) {
      setSelectedIntakeId(currentProgram.intakes[0].id);
    }
  }, [selectedProgramId, currentProgram]);

  // 2. Handle Evaluation Action
  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) {
      setErrorMsg("অনুগ্রহ করে একটি বিশ্ববিদ্যালয় প্রোগ্রাম নির্বাচন করুন।");
      return;
    }

    setErrorMsg(null);
    setIsEvaluating(true);

    try {
      const payload: any = {
        programId: selectedProgramId,
        intakeId: selectedIntakeId || undefined,
        academicRecord: {
          degreeLevel,
          discipline,
          gpa: Number(gpa),
          scale: Number(scale),
          percentage: percentage !== "" ? Number(percentage) : undefined,
          passingYear: Number(passingYear),
          resultStatus: "PASSED",
        },
        languageTest: {
          testType,
          overallScore: Number(overallScore),
          listening: Number(listening),
          reading: Number(reading),
          writing: Number(writing),
          speaking: Number(speaking),
          isPlannedOnly,
        },
        workExperienceMonths: Number(workExperienceMonths),
        hasPortfolio,
      };

      const res = await fetch("/api/eligibility/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        setErrorMsg(json.error || "যোগ্যতা মূল্যায়ন সম্পন্ন করতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      setErrorMsg("সার্ভারের সাথে যোগাযোগে ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-700/60 border border-brand-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>১০০% ডিটারমিনিস্টিক ও নো-এলএলএম অ্যালগরিদম</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            অ্যাডমিশন যোগ্যতা যাচাই ইঞ্জিন
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 leading-relaxed">
            জার্মান বাভারিয়ান ফর্মুলা, ইউকে অনার্স ২:১ সমমান ও অফিশিয়াল বিশ্ববিদ্যালয় প্রকাশিত কাট-অফ নিয়মের মাধ্যমে
            আপনার প্রোফাইলের সরাসরি অ্যাডমিশন যোগ্যতা অবজেক্টিভভাবে যাচাই করুন।
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form & Program Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration & Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-700" />
                <span>প্রোগ্রাম ও ইনটেক নির্বাচন</span>
              </h2>
              <span className="text-xs text-slate-500">ধাপ ১</span>
            </div>

            {/* Program Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                টার্গেট বিশ্ববিদ্যালয় ও কোর্স
              </label>
              {isLoadingPrograms ? (
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ) : (
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-brand-600 focus:bg-white"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.university.nameEn} — {p.titleEn} ({p.university.countryCode})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Intake Selection */}
            {currentProgram && currentProgram.intakes && currentProgram.intakes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>টার্গেট ইনটেক সেশন</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentProgram.intakes.map((intake) => {
                    const isSelected = selectedIntakeId === intake.id;
                    const deadline = new Date(intake.applicationDeadline);
                    const isPassed = deadline.getTime() < Date.now();
                    return (
                      <button
                        key={intake.id}
                        type="button"
                        onClick={() => setSelectedIntakeId(intake.id)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? "border-brand-600 bg-brand-50/70 text-brand-900 font-semibold shadow-2xs"
                            : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>
                            {intake.season} {intake.year}
                          </span>
                          {isPassed ? (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-normal">
                              শেষ
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-normal">
                              খোলা
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          ডেডলাইন: {deadline.toISOString().split("T")[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Profile Mode Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {isCustomMode ? "কাস্টম মান দিয়ে সিমুলেশন" : "প্রোফাইল থেকে তথ্য লোড"}
              </span>
              <button
                type="button"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="inline-flex items-center gap-1.5 text-xs text-brand-700 font-semibold hover:text-brand-900 hover:underline"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isCustomMode ? "রিসেট প্রোফাইল" : "মান পরিবর্তন করুন"}</span>
              </button>
            </div>

            {/* Academic Inputs Form */}
            <form onSubmit={handleEvaluate} className="space-y-4 pt-2">
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-700" />
                  <span>শিক্ষাগত পটভূমি</span>
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-600 mb-1 block">ডিগ্রি লেভেল</label>
                    <select
                      value={degreeLevel}
                      onChange={(e) => setDegreeLevel(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                    >
                      <option value="HSC">HSC / A-Level</option>
                      <option value="DIPLOMA">Diploma</option>
                      <option value="BACHELOR">Bachelor's Degree</option>
                      <option value="MASTER">Master's Degree</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 mb-1 block">বিভাগ / বিষয়</label>
                    <input
                      type="text"
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                      placeholder="CSE / BBA / Science"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 mb-1 block">জিপিএ / সিজিপিএ</label>
                    <input
                      type="number"
                      step="0.01"
                      value={gpa}
                      onChange={(e) => setGpa(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 mb-1 block">স্কেল</label>
                    <select
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                    >
                      <option value={4.0}>৪.০ স্কেল (Bachelor)</option>
                      <option value={5.0}>৫.০ স্কেল (HSC/SSC)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Language Proficiency Inputs */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-700" />
                  <span>ভাষা দক্ষতা (IELTS / PTE)</span>
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-600 mb-1 block">টেস্ট টাইপ</label>
                    <select
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                    >
                      <option value="IELTS">IELTS Academic</option>
                      <option value="PTE">PTE Academic</option>
                      <option value="TOEFL_IBT">TOEFL iBT</option>
                      <option value="DUOLINGO">Duolingo (DET)</option>
                      <option value="NONE">এখনও পরীক্ষা দেইনি</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 mb-1 block">ওভারঅল স্কোর</label>
                    <input
                      type="number"
                      step="0.5"
                      value={overallScore}
                      onChange={(e) => setOverallScore(Number(e.target.value))}
                      disabled={testType === "NONE"}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium disabled:bg-slate-100"
                    />
                  </div>

                  {testType === "IELTS" && (
                    <>
                      <div>
                        <label className="text-slate-600 mb-1 block">লিসেনিং ব্যান্ড</label>
                        <input
                          type="number"
                          step="0.5"
                          value={listening}
                          onChange={(e) => setListening(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 mb-1 block">রাইটিং ব্যান্ড</label>
                        <input
                          type="number"
                          step="0.5"
                          value={writing}
                          onChange={(e) => setWriting(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <input
                    type="checkbox"
                    id="plannedTest"
                    checked={isPlannedOnly || testType === "NONE"}
                    onChange={(e) => setIsPlannedOnly(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600"
                  />
                  <label htmlFor="plannedTest" className="text-slate-600">
                    এখনও পরীক্ষা দিইনি / পরিকল্পনাধীন (Conditional Offer চেক করতে চান)
                  </label>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>মূল্যায়ন গণনা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>যোগ্যতা মূল্যায়ন করুন (Evaluate)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed Verdict & Results Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-brand-50 text-brand-700 rounded-2xl mx-auto flex items-center justify-center shadow-2xs">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                আপনার কাঙ্ক্ষিত প্রোগ্রাম নির্বাচন করে মূল্যায়ন শুরু করুন
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                বাম পাশের মেনু থেকে পছন্দের প্রোগ্রাম সিলেক্ট করুন এবং আপনার জিপিএ ও আইইএলটিএস দিয়ে
                ডিটারমিনিস্টিক ফলাফল ও রিকোয়ারমেন্ট বিশ্লেষণ দেখুন।
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Verdict Banner */}
              <div
                className={`p-6 rounded-2xl border shadow-sm ${
                  result.verdict === "ELIGIBLE"
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : result.verdict === "CONDITIONALLY_ELIGIBLE"
                    ? "bg-amber-50/80 border-amber-300 text-amber-950"
                    : result.verdict === "NOT_ELIGIBLE"
                    ? "bg-rose-50/80 border-rose-300 text-rose-950"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5">
                    {result.verdict === "ELIGIBLE" && (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    )}
                    {result.verdict === "CONDITIONALLY_ELIGIBLE" && (
                      <AlertTriangle className="w-8 h-8 text-amber-600" />
                    )}
                    {result.verdict === "NOT_ELIGIBLE" && (
                      <XCircle className="w-8 h-8 text-rose-600" />
                    )}
                    {result.verdict === "UNABLE_TO_DETERMINE" && (
                      <HelpCircle className="w-8 h-8 text-slate-600" />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 border border-current">
                        {result.verdict}
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        ভার্সন v{result.requirementVersion} • অফিশিয়াল ভেরিফায়েড
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold tracking-tight">
                      {result.verdictTitleBn}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                      {result.summaryBn}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium border-t border-current/15 mt-3">
                      <span>ইনটেক: {result.intakeSeason} {result.intakeYear}</span>
                      {result.applicationDeadline && (
                        <span>
                          ডেডলাইন: {result.applicationDeadline}{" "}
                          {result.deadlinePassed ? "(মেয়াদোত্তীর্ণ)" : ""}
                        </span>
                      )}
                      <a
                        href={result.officialAdmissionsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold underline hover:opacity-80"
                      >
                        <span>বিশ্ববিদ্যালয়ের অফিসিয়াল পেইজ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement Items Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-700" />
                    <span>শর্তভিত্তিক পুঙ্খানুপুঙ্খ ফলাফল (Line-by-Line Breakdown)</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    মোট {result.items.length}টি শর্ত যাচাই করা হয়েছে
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{item.nameBn}</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            ({item.nameEn})
                          </span>
                        </span>

                        <div>
                          {item.status === "MET" && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> পূরিত (MET)
                            </span>
                          )}
                          {item.status === "PARTIALLY_MET" && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" /> শর্তযুক্ত (PARTIALLY MET)
                            </span>
                          )}
                          {item.status === "NOT_MET" && (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" /> অপূরিত (NOT MET)
                            </span>
                          )}
                          {item.status === "INFORMATION_MISSING" && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              তথ্য বাকি (MISSING)
                            </span>
                          )}
                          {item.status === "UNABLE_TO_DETERMINE" && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              অনির্ধারিত
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mb-2">
                        <div>
                          <span className="text-slate-500 font-medium block">বিশ্ববিদ্যালয়ের শর্ত:</span>
                          <span className="font-bold text-slate-900">{item.requiredValue}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium block">আপনার প্রোফাইল:</span>
                          <span className="font-bold text-slate-900">{item.studentValue}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.explanationBn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              {result.recommendationsBn.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-brand-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-700" />
                    <span>আপনার জন্য পরবর্তী করণীয় ও সুপারিশ</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {result.recommendationsBn.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimers & Visa Distinction */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5 text-amber-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                  <p className="leading-relaxed">
                    <strong>ভর্তি বনাম ভিসা সতর্কতা:</strong> {result.visaDistinctionNoticeBn}
                  </p>
                </div>

                <p className="leading-relaxed text-[11px] text-slate-500">
                  {result.admissionGuaranteeDisclaimerBn}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
