"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  GraduationCap,
  Globe2,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Edit3,
  X,
  Plus,
  Trash2,
  Sparkles,
  Coins,
  Compass,
  ArrowRight,
  FileCheck2,
  Calendar,
  Building2,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { formatBdt, COUNTRY_LIST } from "@abroadmate/shared";

interface AcademicRecordItem {
  id?: string;
  level: "SSC" | "HSC" | "O_LEVEL" | "A_LEVEL" | "DIPLOMA" | "BACHELOR" | "MASTER" | "PHD";
  institutionName: string;
  boardOrAuthority?: string;
  groupOrMajor: string;
  gpaOrCgpa: number;
  scale: number;
  startYear?: number;
  passingYear: number;
  resultStatus: "PASSED" | "RUNNING" | "ENROLLED";
  hasBacklogs?: boolean;
  backlogsCount?: number;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Completion Score
  const [completionScore, setCompletionScore] = useState(75);
  const [missingRequired, setMissingRequired] = useState<string[]>([]);
  const [missingRecommended, setMissingRecommended] = useState<string[]>([]);
  const [optionalOpportunities, setOptionalOpportunities] = useState<string[]>([]);
  const [documentStatus, setDocumentStatus] = useState({
    totalUploaded: 2,
    needsVerification: 2,
    verified: 0,
  });

  // Section 1: Basic Info
  const [fullName, setFullName] = useState("সাকিব আহমেদ");
  const [email, setEmail] = useState("sakib.student@gmail.com");
  const [phone, setPhone] = useState("01712345678");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("2002-05-14");
  const [nationality, setNationality] = useState("Bangladeshi");
  const [currentCountry, setCurrentCountry] = useState("Bangladesh");
  const [currentCity, setCurrentCity] = useState("ঢাকা");
  const [hasPassport, setHasPassport] = useState(true);
  const [passportNumber, setPassportNumber] = useState("A01234567");
  const [passportExpiryDate, setPassportExpiryDate] = useState("2028-08-20");

  // Section 2: Education
  const [highestLevel, setHighestLevel] = useState("bachelor_passed");
  const [academicRecords, setAcademicRecords] = useState<AcademicRecordItem[]>([
    {
      level: "BACHELOR",
      institutionName: "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি",
      boardOrAuthority: "UGC / DIU",
      groupOrMajor: "কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)",
      gpaOrCgpa: 3.65,
      scale: 4.0,
      startYear: 2020,
      passingYear: 2024,
      resultStatus: "PASSED",
      hasBacklogs: false,
      backlogsCount: 0,
    },
    {
      level: "HSC",
      institutionName: "ঢাকা রেসিডেনসিয়াল মডেল কলেজ",
      boardOrAuthority: "ঢাকা বোর্ড",
      groupOrMajor: "বিজ্ঞান (Science)",
      gpaOrCgpa: 5.0,
      scale: 5.0,
      startYear: 2017,
      passingYear: 2019,
      resultStatus: "PASSED",
      hasBacklogs: false,
      backlogsCount: 0,
    },
  ]);

  // Section 3: Language Proficiency
  const [hasTakenTest, setHasTakenTest] = useState(true);
  const [testType, setTestType] = useState<"IELTS" | "PTE" | "TOEFL" | "DUOLINGO" | "MOI" | "NOT_TAKEN">("IELTS");
  const [overallScore, setOverallScore] = useState(7.0);
  const [listeningScore, setListeningScore] = useState(7.5);
  const [readingScore, setReadingScore] = useState(7.0);
  const [writingScore, setWritingScore] = useState(6.5);
  const [speakingScore, setSpeakingScore] = useState(7.0);
  const [testDate, setTestDate] = useState("2024-10-15");
  const [expiryDate, setExpiryDate] = useState("2026-10-15");
  const [trfNumber, setTrfNumber] = useState("24BD001234S");
  const [plannedTestDate, setPlannedTestDate] = useState("");

  // Section 4: Study Preferences
  const [desiredDegreeLevel, setDesiredDegreeLevel] = useState<"BACHELOR" | "MASTER" | "PHD">("MASTER");
  const [preferredSubject, setPreferredSubject] = useState("Data Science & Artificial Intelligence");
  const [targetCountryCodes, setTargetCountryCodes] = useState<string[]>(["GB", "CA"]);
  const [targetIntakeSeason, setTargetIntakeSeason] = useState<"FALL" | "SPRING" | "SUMMER">("FALL");
  const [targetIntakeYear, setTargetIntakeYear] = useState<number>(2026);
  const [studyMode, setStudyMode] = useState<"FULL_TIME" | "PART_TIME" | "HYBRID">("FULL_TIME");
  const [academicGoals, setAcademicGoals] = useState("মাস্টার্সে অ্যাডভান্সড মেশিন লার্নিং ও বিগ ডেটা নিয়ে গবেষণা করা।");
  const [careerGoals, setCareerGoals] = useState("পড়াশোনা শেষে শীর্ষ প্রযুক্তি প্রতিষ্ঠানে এআই ইঞ্জিনিয়ার হিসেবে কাজ করা।");

  // Section 5: Financial Background
  const [annualTuitionBudget, setAnnualTuitionBudget] = useState<number>(2800000);
  const [budgetCurrencyCode, setBudgetCurrencyCode] = useState<string>("BDT");
  const [liquidSavingsAmount, setLiquidSavingsAmount] = useState<number>(3200000);
  const [primaryBankName, setPrimaryBankName] = useState("ইস্টার্ন ব্যাংক পিএলসি (EBL)");
  const [fundingStrategyType, setFundingStrategyType] = useState<"SELF" | "PARTIAL_SCHOLARSHIP" | "FULL_SCHOLARSHIP" | "SELF_AND_FAMILY">("SELF_AND_FAMILY");
  const [hasSponsor, setHasSponsor] = useState(true);
  const [sponsorRelationship, setSponsorRelationship] = useState<"FATHER" | "MOTHER" | "SPOUSE" | "SELF" | "SIBLING" | "ORGANIZATION" | "GOVERNMENT" | "OTHER">("FATHER");
  const [sponsorName, setSponsorName] = useState("মো: রফিকুল ইসলাম");
  const [sponsorOccupation, setSponsorOccupation] = useState("ব্যবসায়ী ও রফতানিকারক");
  const [annualSponsorIncome, setAnnualSponsorIncome] = useState<number>(1800000);
  const [scholarshipPreference, setScholarshipPreference] = useState<"FULL_ONLY" | "PARTIAL_OK" | "NO_NEED">("PARTIAL_OK");
  const [educationLoanInterest, setEducationLoanInterest] = useState<"EXPLORING" | "APPLIED" | "NOT_INTERESTED">("EXPLORING");

  // Section 6: Immigration History
  const [hasTravelHistory, setHasTravelHistory] = useState(true);
  const [travelHistorySummary, setTravelHistorySummary] = useState("ভারত ও মালয়েশিয়া (২০২২, পর্যটন ভিসা)");
  const [hasPreviousRefusal, setHasPreviousRefusal] = useState(false);
  const [refusalReasonNotice, setRefusalReasonNotice] = useState("");
  const [hasViolations, setHasViolations] = useState(false);
  const [violationDetails, setViolationDetails] = useState("");

  // Load from API
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success && json.data) {
          const { user, profile, completion } = json.data;
          if (user) {
            if (user.fullName) setFullName(user.fullName);
            if (user.email) setEmail(user.email);
            if (user.phone) setPhone(user.phone);
          }

          if (profile) {
            if (profile.dateOfBirth) setDateOfBirth(profile.dateOfBirth.split("T")[0]);
            if (profile.nationality) setNationality(profile.nationality);
            if (profile.currentCountry) setCurrentCountry(profile.currentCountry);
            if (profile.currentCity) setCurrentCity(profile.currentCity);
            if (typeof profile.hasPassport === "boolean") setHasPassport(profile.hasPassport);
            if (profile.passportNumber) setPassportNumber(profile.passportNumber);
            if (profile.passportExpiryDate) setPassportExpiryDate(profile.passportExpiryDate.split("T")[0]);
            if (profile.alternatePhone) setAlternatePhone(profile.alternatePhone);

            if (profile.currentLevel) setHighestLevel(profile.currentLevel);
            if (profile.academicRecords?.length > 0) {
              setAcademicRecords(
                profile.academicRecords.map((r: any) => ({
                  id: r.id,
                  level: r.level,
                  institutionName: r.institutionName,
                  boardOrAuthority: r.boardOrAuthority || "",
                  groupOrMajor: r.groupOrMajor,
                  gpaOrCgpa: Number(r.gpaOrCgpa),
                  scale: Number(r.scale),
                  startYear: r.startYear || undefined,
                  passingYear: Number(r.passingYear),
                  resultStatus: r.resultStatus,
                  hasBacklogs: r.hasBacklogs || false,
                  backlogsCount: r.backlogsCount || 0,
                }))
              );
            }

            if (profile.languageTests?.length > 0) {
              const test = profile.languageTests[0];
              setHasTakenTest(test.testType !== "NOT_TAKEN");
              setTestType(test.testType);
              if (test.overallScore) setOverallScore(Number(test.overallScore));
              if (test.listeningScore) setListeningScore(Number(test.listeningScore));
              if (test.readingScore) setReadingScore(Number(test.readingScore));
              if (test.writingScore) setWritingScore(Number(test.writingScore));
              if (test.speakingScore) setSpeakingScore(Number(test.speakingScore));
              if (test.testDate) setTestDate(test.testDate.split("T")[0]);
              if (test.expiryDate) setExpiryDate(test.expiryDate.split("T")[0]);
              if (test.trfNumber) setTrfNumber(test.trfNumber);
              if (test.plannedTestDate) setPlannedTestDate(test.plannedTestDate.split("T")[0]);
            }

            if (profile.studyPreference) {
              const pref = profile.studyPreference;
              if (pref.desiredDegreeLevel) setDesiredDegreeLevel(pref.desiredDegreeLevel);
              if (pref.preferredSubject) setPreferredSubject(pref.preferredSubject);
              if (pref.targetCountryCodes?.length > 0) setTargetCountryCodes(pref.targetCountryCodes);
              if (pref.preferredIntakeSeason) setTargetIntakeSeason(pref.preferredIntakeSeason);
              if (pref.preferredIntakeYear) setTargetIntakeYear(pref.preferredIntakeYear);
              if (pref.studyMode) setStudyMode(pref.studyMode);
              if (pref.academicGoals) setAcademicGoals(pref.academicGoals);
              if (pref.careerGoals) setCareerGoals(pref.careerGoals);
            }

            if (profile.financialProfile) {
              const fin = profile.financialProfile;
              if (fin.annualTuitionBudget) setAnnualTuitionBudget(Number(fin.annualTuitionBudget));
              if (fin.budgetCurrencyCode) setBudgetCurrencyCode(fin.budgetCurrencyCode);
              if (fin.liquidSavingsAmount) setLiquidSavingsAmount(Number(fin.liquidSavingsAmount));
              if (fin.primaryBankName) setPrimaryBankName(fin.primaryBankName);
              if (fin.fundingStrategyType) setFundingStrategyType(fin.fundingStrategyType);
              if (typeof fin.hasSponsor === "boolean") setHasSponsor(fin.hasSponsor);
              if (fin.scholarshipPreference) setScholarshipPreference(fin.scholarshipPreference);
              if (fin.educationLoanInterest) setEducationLoanInterest(fin.educationLoanInterest);

              if (fin.sponsors?.length > 0) {
                const sp = fin.sponsors[0];
                if (sp.relationship) setSponsorRelationship(sp.relationship);
                if (sp.name) setSponsorName(sp.name);
                if (sp.occupation) setSponsorOccupation(sp.occupation);
                if (sp.annualIncomeAmount) setAnnualSponsorIncome(Number(sp.annualIncomeAmount));
              }
            }

            if (profile.immigrationHistory?.length > 0) {
              const imm = profile.immigrationHistory[0];
              if (typeof imm.hasTravelHistory === "boolean") setHasTravelHistory(imm.hasTravelHistory);
              if (imm.travelHistorySummary) setTravelHistorySummary(imm.travelHistorySummary);
              if (typeof imm.hasPreviousRefusal === "boolean") setHasPreviousRefusal(imm.hasPreviousRefusal);
              if (imm.refusalReasonNotice) setRefusalReasonNotice(imm.refusalReasonNotice);
              if (typeof imm.hasViolations === "boolean") setHasViolations(imm.hasViolations);
              if (imm.violationDetails) setViolationDetails(imm.violationDetails);
            }
          }

          if (completion) {
            setCompletionScore(completion.percentage);
            setMissingRequired(completion.missingRequired || []);
            setMissingRecommended(completion.missingRecommended || []);
            setOptionalOpportunities(completion.optionalOpportunities || []);
            if (completion.documentStatus) {
              setDocumentStatus(completion.documentStatus);
            }
          }
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Save Section Handler
  const handleSaveSection = async (sectionName: string) => {
    setErrorMessage(null);
    let payloadData: any = {};

    if (sectionName === "basicInfo") {
      payloadData = {
        fullName,
        dateOfBirth,
        nationality,
        currentCountry,
        currentCity,
        hasPassport,
        passportNumber,
        passportExpiryDate: hasPassport ? passportExpiryDate : undefined,
        phone,
        alternatePhone,
      };
    } else if (sectionName === "education") {
      payloadData = {
        highestCompletedLevel: highestLevel,
        academicRecords,
      };
    } else if (sectionName === "language") {
      payloadData = {
        hasTakenTest,
        testType,
        overallScore: hasTakenTest ? overallScore : undefined,
        listeningScore: hasTakenTest ? listeningScore : undefined,
        readingScore: hasTakenTest ? readingScore : undefined,
        writingScore: hasTakenTest ? writingScore : undefined,
        speakingScore: hasTakenTest ? speakingScore : undefined,
        testDate: hasTakenTest ? testDate : undefined,
        expiryDate: hasTakenTest ? expiryDate : undefined,
        trfNumber: hasTakenTest ? trfNumber : undefined,
        plannedTestDate: !hasTakenTest && plannedTestDate ? plannedTestDate : undefined,
      };
    } else if (sectionName === "preferences") {
      payloadData = {
        desiredDegreeLevel,
        preferredSubject,
        targetCountryCodes,
        targetIntakeSeason,
        targetIntakeYear,
        studyMode,
        preferredCityType: "AFFORDABLE_STUDENT_TOWN",
        pswWorkImportance: "HIGH",
        academicGoals,
        careerGoals,
      };
    } else if (sectionName === "financial") {
      payloadData = {
        annualTuitionBudget,
        budgetCurrencyCode,
        liquidSavingsAmount,
        savingsCurrencyCode: "BDT",
        primaryBankName,
        fundingStrategyType,
        hasSponsor,
        sponsorRelationship: hasSponsor ? sponsorRelationship : undefined,
        sponsorName: hasSponsor ? sponsorName : undefined,
        sponsorOccupation: hasSponsor ? sponsorOccupation : undefined,
        annualSponsorIncome: hasSponsor ? annualSponsorIncome : undefined,
        scholarshipPreference,
        educationLoanInterest,
      };
    } else if (sectionName === "immigration") {
      payloadData = {
        hasTravelHistory,
        travelHistorySummary: hasTravelHistory ? travelHistorySummary : undefined,
        outcomeStatus: hasPreviousRefusal ? "REFUSED" : "NONE",
        hasPreviousRefusal,
        refusalReasonNotice: hasPreviousRefusal ? refusalReasonNotice : undefined,
        hasViolations,
        violationDetails: hasViolations ? violationDetails : undefined,
      };
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionName,
          data: payloadData,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "প্রোফাইল আপডেট ব্যর্থ হয়েছে।");
      }

      setSavedSuccess("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      setEditingSection(null);
      if (json.completion) {
        setCompletionScore(json.completion.percentage);
        setMissingRequired(json.completion.missingRequired || []);
        setMissingRecommended(json.completion.missingRecommended || []);
        setOptionalOpportunities(json.completion.optionalOpportunities || []);
      }
      setTimeout(() => setSavedSuccess(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।");
    }
  };

  const handleAddAcademicRecord = () => {
    setAcademicRecords([
      ...academicRecords,
      {
        level: "SSC",
        institutionName: "",
        boardOrAuthority: "ঢাকা বোর্ড",
        groupOrMajor: "বিজ্ঞান (Science)",
        gpaOrCgpa: 5.0,
        scale: 5.0,
        passingYear: 2017,
        resultStatus: "PASSED",
        hasBacklogs: false,
        backlogsCount: 0,
      },
    ]);
  };

  const handleRemoveAcademicRecord = (index: number) => {
    if (academicRecords.length <= 1) {
      alert("কমপক্ষে একটি শিক্ষাগত রেকর্ড থাকা আবশ্যক।");
      return;
    }
    setAcademicRecords(academicRecords.filter((_, i) => i !== index));
  };

  const handleUpdateRecord = (index: number, field: keyof AcademicRecordItem, value: any) => {
    const updated = [...academicRecords];
    const current = updated[index];
    if (current) {
      updated[index] = { ...current, [field]: value } as AcademicRecordItem;
      setAcademicRecords(updated);
    }
  };

  const toggleTargetCountry = (code: string) => {
    if (targetCountryCodes.includes(code)) {
      if (targetCountryCodes.length === 1) return;
      setTargetCountryCodes(targetCountryCodes.filter((c) => c !== code));
    } else {
      setTargetCountryCodes([...targetCountryCodes, code]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>শিক্ষার্থীর সম্পূর্ণ প্রোফাইল ও এআই অ্যাসেসমেন্ট</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            শিক্ষার্থী প্রোফাইল ও যোগ্যতা রেকর্ড
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            আপনার সকল শিক্ষাগত রেকর্ড, ভাষা পরীক্ষার ফলাফল ও স্টাডি পছন্দ এখানে সংরক্ষিত। আপনার তথ্যের ভিত্তিতেইAbroadMate এআই অ্যালগরিদম শতভাগ নির্ভুলভাবে যোগ্য বিশ্ববিদ্যালয় ও স্কলারশিপ সুপারিশ করে।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>অনবোর্ডিং উইজার্ডে যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Global Alerts */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{savedSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Profile Completion Meter Card */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
                প্রোফাইল স্কোর ইঞ্জিন
              </span>
              <span className="text-xs text-slate-300">• রিয়েল-টাইম ক্যালকুলেশন</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              প্রোফাইল সম্পূর্ণতা: <span className="text-brand-400 font-black">{completionScore}%</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              আপনার প্রোফাইল যত বেশি বিস্তারিত হবে, এআই অ্যাডমিশন স্কোরিং ও ভিসা এলিজিবিলিটি অ্যাসেসমেন্ট তত বেশি সুনির্দিষ্ট হবে।
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-brand-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${Math.max(5, completionScore)}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">আবশ্যক ফিল্ড</p>
              <p className="text-lg font-bold text-white mt-1">
                {missingRequired.length === 0 ? "সম্পূর্ণ ✓" : `${missingRequired.length}টি বাকি`}
              </p>
              <span className="text-[10px] text-brand-300">ভিত্তিগত তথ্য</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">সুপারিশকৃত</p>
              <p className="text-lg font-bold text-white mt-1">
                {missingRecommended.length === 0 ? "সম্পূর্ণ ✓" : `${missingRecommended.length}টি বাকি`}
              </p>
              <span className="text-[10px] text-amber-300">উচ্চ নির্ভুলতা</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">ডকুমেন্ট স্ট্যাটাস</p>
              <p className="text-lg font-bold text-amber-400 mt-1">
                {documentStatus.needsVerification > 0 ? "যাচাই প্রয়োজন" : "কোনোটি নেই"}
              </p>
              <span className="text-[10px] text-slate-300">অ্যাডমিন রিভিউ</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Tags */}
        {(missingRequired.length > 0 || missingRecommended.length > 0) && (
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {missingRequired.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  আবশ্যকীয় বাকি তথ্য:
                </span>
                <p className="text-[11px] text-rose-200/90 leading-relaxed">
                  {missingRequired.join(" • ")}
                </p>
              </div>
            )}
            {missingRecommended.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  সুপারিশকৃত অতিরিক্ত তথ্য:
                </span>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  {missingRecommended.join(" • ")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Verification Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-900 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <p className="font-bold text-amber-950">
            ডকুমেন্ট যাচাইকরণ নীতিমালা ও সতর্কতা (Anti-Fraud Policy)
          </p>
          <p className="text-amber-800 text-xs leading-relaxed">
            শিক্ষার্থী কর্তৃক আপলোডকৃত যেকোনো সার্টিফিকেট বা পাসপোর্ট প্রাথমিক পর্যায়ে <strong>"যাচাইকরণ প্রয়োজন (Needs Verification)"</strong> হিসেবে চিহ্নিত থাকবে। কোনো ডকুমেন্ট স্বয়ংক্রিয়ভাবে অফিসিয়ালি ভেরিফাইড বলে গণ্য হবে না। অ্যাডমিন বা ভেরিফায়ার টিম ম্যানুয়ালি রিভিউ করার পরই তা অফিসিয়াল স্ট্যাটাস পাবে।
          </p>
        </div>
      </div>

      {/* SECTION 1: Personal & Basic Info */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              ১
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">মৌলিক ও ব্যক্তিগত তথ্য</h2>
              <p className="text-xs text-slate-500">পাসপোর্ট ও জাতীয় তথ্যের বিবরণ</p>
            </div>
          </div>
          {editingSection === "basicInfo" ? (
            <button
              onClick={() => setEditingSection(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>বাতিল</span>
            </button>
          ) : (
            <button
              onClick={() => setEditingSection("basicInfo")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>সম্পাদনা করুন</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {editingSection === "basicInfo" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("basicInfo");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পূর্ণ নাম (পাসপোর্ট অনুযায়ী)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">জন্ম তারিখ (Date of Birth)</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">বর্তমান শহর</label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">বাংলাদেশি মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Passport Block */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="hasPassportEdit"
                    checked={hasPassport}
                    onChange={(e) => setHasPassport(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="hasPassportEdit" className="text-xs font-semibold text-slate-800">
                    আমার বৈধ আন্তর্জাতিক পাসপোর্ট আছে
                  </label>
                </div>

                {hasPassport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">পাসপোর্ট নম্বর</label>
                      <input
                        type="text"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        placeholder="যেমন: A01234567"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">পাসপোর্টের মেয়াদ উত্তীর্ণের তারিখ</label>
                      <input
                        type="date"
                        value={passportExpiryDate}
                        onChange={(e) => setPassportExpiryDate(e.target.value)}
                        required={hasPassport}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">পূর্ণ নাম</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{fullName || "দেওয়া হয়নি"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ইমেইল এড্রেস</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{email || "দেওয়া হয়নি"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ফোন নম্বর</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{phone || "দেওয়া হয়নি"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">জন্ম তারিখ</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{dateOfBirth || "দেওয়া হয়নি"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">বর্তমান শহর ও দেশ</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{currentCity}, {currentCountry}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">পাসপোর্ট স্ট্যাটাস</p>
                <p className="text-sm font-bold mt-0.5">
                  {hasPassport ? (
                    <span className="text-emerald-700 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> বৈধ পাসপোর্ট আছে
                    </span>
                  ) : (
                    <span className="text-amber-700">পাসপোর্ট এখনও নেই</span>
                  )}
                </p>
              </div>
              {hasPassport && (
                <>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">পাসপোর্ট নম্বর</p>
                    <p className="text-sm font-mono font-semibold text-slate-800 mt-0.5">{passportNumber || "উহ্য"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">মেয়াদোত্তীর্ণের তারিখ</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{passportExpiryDate || "অজানা"}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Academic Background */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              ২
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">শিক্ষাগত রেকর্ড ও ফলাফল</h2>
              <p className="text-xs text-slate-500">পূর্ববর্তী সকল ডিগ্রি, জিপিএ এবং পাশের সাল</p>
            </div>
          </div>
          {editingSection === "education" ? (
            <button
              onClick={() => setEditingSection(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>বাতিল</span>
            </button>
          ) : (
            <button
              onClick={() => setEditingSection("education")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>সম্পাদনা করুন</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {editingSection === "education" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("education");
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">সর্বোচ্চ সম্পন্ন শিক্ষাগত স্তর</label>
                <select
                  value={highestLevel}
                  onChange={(e) => setHighestLevel(e.target.value)}
                  className="w-full max-w-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                >
                  <option value="hsc_passed">এইচএসসি / সমমান সম্পন্ন</option>
                  <option value="a_level">এ লেভেল (A-Level)</option>
                  <option value="diploma">ডিপ্লোমা ইন ইঞ্জিনিয়ারিং</option>
                  <option value="bachelor_running">ব্যাচেলর শেষ বর্ষে অধ্যয়নরত</option>
                  <option value="bachelor_passed">ব্যাচেলর / স্নাতক সম্পন্ন</option>
                  <option value="master_passed">মাস্টার্স / স্নাতকোত্তর সম্পন্ন</option>
                  <option value="phd">পিএইচডি / ডক্টরেট</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">একাডেমিক রেকর্ডসমূহ</h3>
                  <button
                    type="button"
                    onClick={handleAddAcademicRecord}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন রেকর্ড যোগ করুন</span>
                  </button>
                </div>

                {academicRecords.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-800">রেকর্ড #{idx + 1} ({rec.level})</span>
                      {academicRecords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAcademicRecord(idx)}
                          className="text-rose-600 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">ডিগ্রির ধরন</label>
                        <select
                          value={rec.level}
                          onChange={(e) => handleUpdateRecord(idx, "level", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        >
                          <option value="SSC">এসএসসি (SSC)</option>
                          <option value="HSC">এইচএসসি (HSC)</option>
                          <option value="O_LEVEL">ও লেভেল (O-Level)</option>
                          <option value="A_LEVEL">এ লেভেল (A-Level)</option>
                          <option value="DIPLOMA">ডিপ্লোমা (Diploma)</option>
                          <option value="BACHELOR">ব্যাচেলর (Bachelor)</option>
                          <option value="MASTER">মাস্টার্স (Master)</option>
                          <option value="PHD">পিএইচডি (PhD)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">শিক্ষা প্রতিষ্ঠানের নাম</label>
                        <input
                          type="text"
                          value={rec.institutionName}
                          onChange={(e) => handleUpdateRecord(idx, "institutionName", e.target.value)}
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">বিভাগ বা বিষয়</label>
                        <input
                          type="text"
                          value={rec.groupOrMajor}
                          onChange={(e) => handleUpdateRecord(idx, "groupOrMajor", e.target.value)}
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">জিপিএ / সিজিপিএ</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={rec.scale}
                          value={rec.gpaOrCgpa}
                          onChange={(e) => handleUpdateRecord(idx, "gpaOrCgpa", parseFloat(e.target.value) || 0)}
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">স্কেল (Scale)</label>
                        <select
                          value={rec.scale}
                          onChange={(e) => handleUpdateRecord(idx, "scale", parseFloat(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        >
                          <option value="4.0">৪.০০ স্কেল</option>
                          <option value="5.0">৫.০০ স্কেল</option>
                          <option value="10.0">১০.০০ স্কেল</option>
                          <option value="100.0">১০০% (শতাংশ)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">পাশের সাল</label>
                        <input
                          type="number"
                          value={rec.passingYear}
                          onChange={(e) => handleUpdateRecord(idx, "passingYear", parseInt(e.target.value, 10))}
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">ফলাফলের অবস্থা</label>
                        <select
                          value={rec.resultStatus}
                          onChange={(e) => handleUpdateRecord(idx, "resultStatus", e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                        >
                          <option value="PASSED">পাসকৃত (Passed)</option>
                          <option value="RUNNING">অধ্যয়নরত (Running)</option>
                          <option value="ENROLLED">ভর্তিকৃত (Enrolled)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {academicRecords.map((rec, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-brand-100 text-brand-800 font-bold text-xs">
                        {rec.level}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">পাশের সাল: {rec.passingYear}</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{rec.institutionName}</p>
                    <p className="text-xs text-slate-600">{rec.groupOrMajor}</p>
                    <div className="flex items-center gap-3 pt-2 text-xs border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-500">ফলাফল: </span>
                        <span className="font-bold text-brand-700">
                          {rec.gpaOrCgpa.toFixed(2)} / {rec.scale.toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">স্ট্যাটাস: </span>
                        <span className="font-semibold text-slate-700">{rec.resultStatus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Language Proficiency */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              ৩
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">ইংরেজি ভাষা দক্ষতা (Language Proficiency)</h2>
              <p className="text-xs text-slate-500">IELTS, PTE, TOEFL, Duolingo বা ভবিষ্যৎ পরীক্ষার পরিকল্পনা</p>
            </div>
          </div>
          {editingSection === "language" ? (
            <button
              onClick={() => setEditingSection(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>বাতিল</span>
            </button>
          ) : (
            <button
              onClick={() => setEditingSection("language")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>সম্পাদনা করুন</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {editingSection === "language" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("language");
              }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  id="hasTakenTestEdit"
                  checked={hasTakenTest}
                  onChange={(e) => setHasTakenTest(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="hasTakenTestEdit" className="text-xs font-semibold text-slate-800">
                  আমি ইতোমধ্যে ভাষা পরীক্ষায় অংশগ্রহণ করেছি ও স্কোর পেয়েছি
                </label>
              </div>

              {hasTakenTest ? (
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">পরীক্ষার ধরন</label>
                      <select
                        value={testType}
                        onChange={(e) => setTestType(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      >
                        <option value="IELTS">IELTS (Academic)</option>
                        <option value="PTE">PTE Academic</option>
                        <option value="TOEFL">TOEFL iBT</option>
                        <option value="DUOLINGO">Duolingo English Test (DET)</option>
                        <option value="MOI">Medium of Instruction (MOI)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">ওভারঅল স্কোর (Overall Band)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="120"
                        value={overallScore}
                        onChange={(e) => setOverallScore(parseFloat(e.target.value) || 0)}
                        required
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none font-bold text-brand-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">টিআরএফ / স্কোর নম্বর (TRF)</label>
                      <input
                        type="text"
                        value={trfNumber}
                        onChange={(e) => setTrfNumber(e.target.value)}
                        placeholder="যেমন: 24BD001234S"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Listening</label>
                      <input
                        type="number"
                        step="0.5"
                        value={listeningScore}
                        onChange={(e) => setListeningScore(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reading</label>
                      <input
                        type="number"
                        step="0.5"
                        value={readingScore}
                        onChange={(e) => setReadingScore(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Writing</label>
                      <input
                        type="number"
                        step="0.5"
                        value={writingScore}
                        onChange={(e) => setWritingScore(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Speaking</label>
                      <input
                        type="number"
                        step="0.5"
                        value={speakingScore}
                        onChange={(e) => setSpeakingScore(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পরীক্ষা দেওয়ার সম্ভাব্য তারিখ</label>
                  <input
                    type="date"
                    value={plannedTestDate}
                    onChange={(e) => setPlannedTestDate(e.target.value)}
                    className="w-full max-w-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    পরীক্ষার সম্ভাব্য তারিখ দিলে আপনার রোডম্যাপ স্বয়ংক্রিয়ভাবে সাজানো হবে।
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            <div>
              {hasTakenTest ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-brand-50/50 border border-brand-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-700 text-white flex flex-col items-center justify-center font-bold">
                        <span className="text-[10px] leading-tight font-normal">Score</span>
                        <span className="text-lg leading-tight">{overallScore.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 font-bold text-xs">
                          {testType}
                        </span>
                        <p className="text-xs text-slate-600 mt-1">
                          পরীক্ষার তারিখ: {testDate} • মেয়াদ: {expiryDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-semibold">L</span>
                        <span className="font-bold text-slate-800">{listeningScore.toFixed(1)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-semibold">R</span>
                        <span className="font-bold text-slate-800">{readingScore.toFixed(1)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-semibold">W</span>
                        <span className="font-bold text-slate-800">{writingScore.toFixed(1)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-semibold">S</span>
                        <span className="font-bold text-slate-800">{speakingScore.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">এখনও কোনো ভাষা পরীক্ষা সম্পন্ন হয়নি।</span>
                  {plannedTestDate && (
                    <span className="block mt-1 text-brand-700">পরিকল্পিত পরীক্ষার তারিখ: {plannedTestDate}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: Study Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              ৪
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">উচ্চশিক্ষা লক্ষ্য ও দেশ নির্বাচন</h2>
              <p className="text-xs text-slate-500">টার্গেট দেশ, ডিগ্রির স্তর এবং ইনটেক</p>
            </div>
          </div>
          {editingSection === "preferences" ? (
            <button
              onClick={() => setEditingSection(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>বাতিল</span>
            </button>
          ) : (
            <button
              onClick={() => setEditingSection("preferences")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>সম্পাদনা করুন</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {editingSection === "preferences" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("preferences");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">কাঙ্ক্ষিত ডিগ্রির স্তর</label>
                  <select
                    value={desiredDegreeLevel}
                    onChange={(e) => setDesiredDegreeLevel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  >
                    <option value="BACHELOR">ব্যাচেলর / স্নাতক (Bachelor)</option>
                    <option value="MASTER">মাস্টার্স / স্নাতকোত্তর (Master)</option>
                    <option value="PHD">পিএইচডি / ডক্টরেট (PhD)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পড়ার পছন্দের বিষয় / মেজর</label>
                  <input
                    type="text"
                    value={preferredSubject}
                    onChange={(e) => setPreferredSubject(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">টার্গেট ইনটেক সিজন</label>
                  <select
                    value={targetIntakeSeason}
                    onChange={(e) => setTargetIntakeSeason(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  >
                    <option value="FALL">ফল (Fall / সেপ্টেম্বর)</option>
                    <option value="SPRING">স্প্রিং (Spring / জানুয়ারি)</option>
                    <option value="SUMMER">সামার (Summer / মে)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">টার্গেট ইনটেক সাল</label>
                  <input
                    type="number"
                    value={targetIntakeYear}
                    onChange={(e) => setTargetIntakeYear(parseInt(e.target.value, 10))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">স্টাডি মোড</label>
                  <select
                    value={studyMode}
                    onChange={(e) => setStudyMode(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  >
                    <option value="FULL_TIME">ফুল-টাইম (Full-Time)</option>
                    <option value="PART_TIME">পার্ট-টাইম (Part-Time)</option>
                    <option value="HYBRID">হাইব্রিড (Hybrid)</option>
                  </select>
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">পছন্দের দেশসমূহ (একাধিক নির্বাচনযোগ্য)</label>
                <div className="flex flex-wrap gap-2">
                  {COUNTRY_LIST.map((c) => {
                    const isSelected = targetCountryCodes.includes(c.code);
                    return (
                      <button
                        type="button"
                        key={c.code}
                        onClick={() => toggleTargetCountry(c.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-brand-700 text-white border-brand-700 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.nameBn}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ভবিষ্যৎ ক্যারিয়ার লক্ষ্য ও ভিশন</label>
                <textarea
                  rows={2}
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">কাঙ্ক্ষিত ডিগ্রি</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{desiredDegreeLevel}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">পছন্দের বিষয়</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{preferredSubject}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ইনটেক সেশন</p>
                <p className="text-sm font-bold text-brand-700 mt-0.5">{targetIntakeSeason} {targetIntakeYear}</p>
              </div>
              <div className="sm:col-span-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase mb-2">টার্গেট দেশসমূহ</p>
                <div className="flex flex-wrap gap-2">
                  {targetCountryCodes.map((code) => {
                    const country = COUNTRY_LIST.find((c) => c.code === code);
                    return (
                      <span
                        key={code}
                        className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                      >
                        <span>{country?.flag || "🌍"}</span>
                        <span>{country?.nameBn || code}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
              {careerGoals && (
                <div className="sm:col-span-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">ক্যারিয়ার লক্ষ্য</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{careerGoals}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: Financial Background */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              ৫
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">আর্থিক সক্ষমতা ও স্পন্সরশিপ বিবরণ</h2>
              <p className="text-xs text-slate-500">পড়াশোনার বাজেট ও সলভেন্সি পরিকল্পনা</p>
            </div>
          </div>
          {editingSection === "financial" ? (
            <button
              onClick={() => setEditingSection(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>বাতিল</span>
            </button>
          ) : (
            <button
              onClick={() => setEditingSection("financial")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>সম্পাদনা করুন</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {editingSection === "financial" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("financial");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">বার্ষিক টিউশন ফি বাজেট (টাকা / BDT)</label>
                  <input
                    type="number"
                    step="50000"
                    value={annualTuitionBudget}
                    onChange={(e) => setAnnualTuitionBudget(parseInt(e.target.value, 10) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    আনুমানিক: {formatBdt(annualTuitionBudget)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ব্যাংক সেভিংস / তরল তহবিল (টাকা / BDT)</label>
                  <input
                    type="number"
                    step="50000"
                    value={liquidSavingsAmount}
                    onChange={(e) => setLiquidSavingsAmount(parseInt(e.target.value, 10) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    আনুমানিক: {formatBdt(liquidSavingsAmount)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">তহবিল ব্যবস্থাপনা কৌশল</label>
                  <select
                    value={fundingStrategyType}
                    onChange={(e) => setFundingStrategyType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  >
                    <option value="SELF_AND_FAMILY">নিজে ও পরিবারের স্পন্সর (Self & Family)</option>
                    <option value="SELF">সম্পূর্ণ নিজস্ব তহবিল (Self)</option>
                    <option value="PARTIAL_SCHOLARSHIP">আংশিক স্কলারশিপ আবশ্যক</option>
                    <option value="FULL_SCHOLARSHIP">১০০% ফুল স্কলারশিপ ছাড়া সম্ভব নয়</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ব্যাংকের নাম (সলভেন্সি অ্যাকাউন্ট)</label>
                  <input
                    type="text"
                    value={primaryBankName}
                    onChange={(e) => setPrimaryBankName(e.target.value)}
                    placeholder="যেমন: ইস্টার্ন ব্যাংক, ব্র্যাক ব্যাংক"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sponsor details */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="hasSponsorEdit"
                    checked={hasSponsor}
                    onChange={(e) => setHasSponsor(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="hasSponsorEdit" className="text-xs font-semibold text-slate-800">
                    আমার আর্থিক স্পন্সর রয়েছে
                  </label>
                </div>

                {hasSponsor && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">স্পন্সরের সাথে সম্পর্ক</label>
                      <select
                        value={sponsorRelationship}
                        onChange={(e) => setSponsorRelationship(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      >
                        <option value="FATHER">বাবা (Father)</option>
                        <option value="MOTHER">মা (Mother)</option>
                        <option value="SPOUSE">স্বামী / স্ত্রী (Spouse)</option>
                        <option value="SIBLING">ভাই / বোন (Sibling)</option>
                        <option value="SELF">নিজ (Self)</option>
                        <option value="ORGANIZATION">প্রতিষ্ঠান / স্কলারশিপ সংস্থা</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">স্পন্সরের নাম</label>
                      <input
                        type="text"
                        value={sponsorName}
                        onChange={(e) => setSponsorName(e.target.value)}
                        required={hasSponsor}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">স্পন্সরের পেশা</label>
                      <input
                        type="text"
                        value={sponsorOccupation}
                        onChange={(e) => setSponsorOccupation(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">বার্ষিক টিউশন ফি বাজেট</p>
                <p className="text-base font-bold text-brand-700 mt-0.5">{formatBdt(annualTuitionBudget)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ব্যাংক সঞ্চয় / লিকুইড ফান্ড</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{formatBdt(liquidSavingsAmount)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">তহবিল কৌশল</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{fundingStrategyType}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">প্রাথমিক ব্যাংক</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{primaryBankName || "উল্লেখ করা হয়নি"}</p>
              </div>
              {hasSponsor && (
                <div className="sm:col-span-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">স্পন্সর</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{sponsorName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">সম্পর্ক</span>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5">{sponsorRelationship}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">পেশা</span>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5">{sponsorOccupation || "ব্যবসায়ী"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: Immigration & Visa History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              ৬
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">ইমিগ্রেশন ও ভ্রমণ ইতিহাস</h2>
              <p className="text-xs text-slate-500">ভ্রমণ ও পূর্ববর্তী ভিসা আবেদন ঘোষণা</p>
            </div>
          </div>
          {editingSection === "immigration" ? (
            <button
              onClick={() => setEditingSection(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>বাতিল</span>
            </button>
          ) : (
            <button
              onClick={() => setEditingSection("immigration")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>সম্পাদনা করুন</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {editingSection === "immigration" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSection("immigration");
              }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasTravelHistoryEdit"
                    checked={hasTravelHistory}
                    onChange={(e) => setHasTravelHistory(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="hasTravelHistoryEdit" className="text-xs font-semibold text-slate-800">
                    পূর্বে বিদেশ ভ্রমণের অভিজ্ঞতা আছে
                  </label>
                </div>

                {hasTravelHistory && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ভ্রমণকৃত দেশ ও সংক্ষিপ্ত বিবরণ</label>
                    <input
                      type="text"
                      value={travelHistorySummary}
                      onChange={(e) => setTravelHistorySummary(e.target.value)}
                      placeholder="যেমন: ভারত, মালয়েশিয়া, থাইল্যান্ড (পর্যটন ভিসা)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasPreviousRefusalEdit"
                    checked={hasPreviousRefusal}
                    onChange={(e) => setHasPreviousRefusal(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="hasPreviousRefusalEdit" className="text-xs font-semibold text-slate-800">
                    অতীতে কোনো দেশের ভিসা প্রত্যাখ্যান (Refusal) হয়েছিল
                  </label>
                </div>

                {hasPreviousRefusal && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ভিসা রিফিউজের কারণ ও ব্যাখ্যা</label>
                    <textarea
                      rows={2}
                      value={refusalReasonNotice}
                      onChange={(e) => setRefusalReasonNotice(e.target.value)}
                      placeholder="সঠিক কারণ উল্লেখ করুন। সঠিক ডিক্লারেশন দিলে ভিসা অফিসারের সন্তুষ্টি বাড়ে।"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">বিদেশ ভ্রমণ ইতিহাস</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {hasTravelHistory ? travelHistorySummary : "পূর্বে কোনো আন্তর্জাতিক ভ্রমণের রেকর্ড নেই"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">ভিসা প্রত্যাখ্যান স্ট্যাটাস</p>
                  <p className="text-sm font-bold mt-1">
                    {hasPreviousRefusal ? (
                      <span className="text-rose-700">পূর্বে ভিসা রিফিউজের রেকর্ড রয়েছে</span>
                    ) : (
                      <span className="text-emerald-700">কোনো ভিসা রিফিউজের ইতিহাস নেই ✓</span>
                    )}
                  </p>
                  {hasPreviousRefusal && refusalReasonNotice && (
                    <p className="text-xs text-slate-600 mt-1">{refusalReasonNotice}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
