"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  User,
  GraduationCap,
  Globe2,
  Target,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building2,
  MapPin,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  Award,
  Briefcase,
  HelpCircle,
  Clock,
  Save,
  ArrowRight,
} from "lucide-react";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";

interface AcademicRecordItem {
  level: "SSC" | "HSC" | "O_LEVEL" | "A_LEVEL" | "DIPLOMA" | "BACHELOR" | "MASTER" | "PHD";
  institutionName: string;
  boardOrAuthority: string;
  groupOrMajor: string;
  gpaOrCgpa: number;
  scale: number;
  startYear?: number;
  passingYear: number;
  resultStatus: "PASSED" | "RUNNING" | "ENROLLED";
  hasBacklogs: boolean;
  backlogsCount: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { locale } = useI18n();

  // Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completionScore, setCompletionScore] = useState<number>(25);

  // Step 1: Basic Information
  const [fullName, setFullName] = useState("সাকিব আহমেদ");
  const [dateOfBirth, setDateOfBirth] = useState("2002-05-14");
  const [nationality, setNationality] = useState("Bangladeshi");
  const [currentCountry, setCurrentCountry] = useState("Bangladesh");
  const [currentCity, setCurrentCity] = useState("ঢাকা");
  const [hasPassport, setHasPassport] = useState(true);
  const [passportNumber, setPassportNumber] = useState("A01234567");
  const [passportExpiryDate, setPassportExpiryDate] = useState("2028-08-20");
  const [phone, setPhone] = useState("01712345678");
  const [alternatePhone, setAlternatePhone] = useState("");

  // Step 2: Education Background
  const [highestCompletedLevel, setHighestCompletedLevel] = useState("bachelor_passed");
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

  // Step 3: Language Proficiency
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

  // Step 4: Study Preferences
  const [desiredDegreeLevel, setDesiredDegreeLevel] = useState<"BACHELOR" | "MASTER" | "PHD">("MASTER");
  const [preferredSubject, setPreferredSubject] = useState("Data Science & Artificial Intelligence");
  const [targetCountryCodes, setTargetCountryCodes] = useState<string[]>(["GB", "CA"]);
  const [targetIntakeSeason, setTargetIntakeSeason] = useState<"FALL" | "SPRING" | "SUMMER">("FALL");
  const [targetIntakeYear, setTargetIntakeYear] = useState<number>(2026);
  const [studyMode, setStudyMode] = useState<"FULL_TIME" | "PART_TIME" | "HYBRID">("FULL_TIME");
  const [preferredCityType, setPreferredCityType] = useState<"AFFORDABLE_STUDENT_TOWN" | "METROPOLITAN" | "RESEARCH_CAMPUS">("AFFORDABLE_STUDENT_TOWN");
  const [pswWorkImportance, setPswWorkImportance] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [academicGoals, setAcademicGoals] = useState("মাস্টার্সে অ্যাডভান্সড মেশিন লার্নিং ও বিগ ডেটা নিয়ে গবেষণা করা।");
  const [careerGoals, setCareerGoals] = useState("পড়াশোনা শেষে শীর্ষ প্রযুক্তি প্রতিষ্ঠানে এআই ইঞ্জিনিয়ার হিসেবে কাজ করা।");

  // Step 5: Financial Background
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

  // Step 6: Immigration History
  const [hasTravelHistory, setHasTravelHistory] = useState(true);
  const [travelHistorySummary, setTravelHistorySummary] = useState("ভারত ও মালয়েশিয়া (২০২২, পর্যটন ভিসা)");
  const [outcomeStatus, setOutcomeStatus] = useState<"GRANTED" | "REFUSED" | "WITHDRAWN" | "NONE">("NONE");
  const [hasPreviousRefusal, setHasPreviousRefusal] = useState(false);
  const [refusalReasonNotice, setRefusalReasonNotice] = useState("");
  const [hasViolations, setHasViolations] = useState(false);
  const [violationDetails, setViolationDetails] = useState("");

  // Step 7: Confirmation
  const [explicitConfirmation, setExplicitConfirmation] = useState(false);

  // Fetch existing draft on mount
  useEffect(() => {
    async function loadOnboardingDraft() {
      try {
        const res = await fetch("/api/onboarding");
        const json = await res.json();
        if (json.success && json.data) {
          const { profile, user, onboardingStep, completionPercentage } = json.data;
          if (user?.fullName) setFullName(user.fullName);
          if (user?.phone) setPhone(user.phone);

          if (profile) {
            if (profile.dateOfBirth) setDateOfBirth(profile.dateOfBirth.split("T")[0]);
            if (profile.currentCity) setCurrentCity(profile.currentCity);
            if (typeof profile.hasPassport === "boolean") setHasPassport(profile.hasPassport);
            if (profile.passportNumber) setPassportNumber(profile.passportNumber);
            if (profile.passportExpiryDate) setPassportExpiryDate(profile.passportExpiryDate.split("T")[0]);

            if (profile.currentLevel) setHighestCompletedLevel(profile.currentLevel);
            if (profile.academicRecords?.length > 0) {
              setAcademicRecords(profile.academicRecords);
            }

            if (profile.languageTests?.length > 0) {
              const test = profile.languageTests[0];
              setHasTakenTest(test.testType !== "NOT_TAKEN");
              setTestType(test.testType);
              if (test.overallScore) setOverallScore(test.overallScore);
              if (test.listeningScore) setListeningScore(test.listeningScore);
              if (test.readingScore) setReadingScore(test.readingScore);
              if (test.writingScore) setWritingScore(test.writingScore);
              if (test.speakingScore) setSpeakingScore(test.speakingScore);
              if (test.testDate) setTestDate(test.testDate.split("T")[0]);
              if (test.expiryDate) setExpiryDate(test.expiryDate.split("T")[0]);
              if (test.trfNumber) setTrfNumber(test.trfNumber);
            }

            if (profile.studyPreference) {
              const pref = profile.studyPreference;
              if (pref.desiredDegreeLevel) setDesiredDegreeLevel(pref.desiredDegreeLevel);
              if (pref.preferredSubject) setPreferredSubject(pref.preferredSubject);
              if (pref.targetCountryCodes?.length > 0) setTargetCountryCodes(pref.targetCountryCodes);
              if (pref.studyMode) setStudyMode(pref.studyMode);
              if (pref.academicGoals) setAcademicGoals(pref.academicGoals);
              if (pref.careerGoals) setCareerGoals(pref.careerGoals);
            }

            if (profile.financialProfile) {
              const fin = profile.financialProfile;
              setAnnualTuitionBudget(fin.annualTuitionBudget);
              setLiquidSavingsAmount(fin.liquidSavingsAmount);
              if (fin.primaryBankName) setPrimaryBankName(fin.primaryBankName);
              if (fin.fundingStrategyType) setFundingStrategyType(fin.fundingStrategyType);
              if (fin.sponsors?.length > 0) {
                const sp = fin.sponsors[0];
                setSponsorName(sp.name);
                setSponsorRelationship(sp.relationship);
                if (sp.occupation) setSponsorOccupation(sp.occupation);
                if (sp.annualIncomeAmount) setAnnualSponsorIncome(sp.annualIncomeAmount);
              }
            }

            if (profile.immigrationHistory?.length > 0) {
              const imm = profile.immigrationHistory[0];
              setHasTravelHistory(imm.hasTravelHistory);
              if (imm.travelHistorySummary) setTravelHistorySummary(imm.travelHistorySummary);
              setHasPreviousRefusal(imm.hasPreviousRefusal);
              if (imm.refusalReasonNotice) setRefusalReasonNotice(imm.refusalReasonNotice);
            }

            if (onboardingStep) setCurrentStep(Math.min(7, onboardingStep));
            if (completionPercentage) setCompletionScore(completionPercentage);
          }
        }
      } catch (err) {
        console.error("Failed to load onboarding draft:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOnboardingDraft();
  }, []);

  const addAcademicRecord = () => {
    setAcademicRecords([
      ...academicRecords,
      {
        level: "HSC",
        institutionName: "",
        boardOrAuthority: "ঢাকা বোর্ড",
        groupOrMajor: "বিজ্ঞান",
        gpaOrCgpa: 5.0,
        scale: 5.0,
        passingYear: 2021,
        resultStatus: "PASSED",
        hasBacklogs: false,
        backlogsCount: 0,
      },
    ]);
  };

  const removeAcademicRecord = (index: number) => {
    if (academicRecords.length <= 1) {
      alert("কমপক্ষে একটি শিক্ষাগত রেকর্ড থাকা আবশ্যক।");
      return;
    }
    setAcademicRecords(academicRecords.filter((_, i) => i !== index));
  };

  const updateAcademicRecord = (index: number, field: keyof AcademicRecordItem, value: any) => {
    const updated = [...academicRecords];
    const item = updated[index];
    if (item) {
      updated[index] = { ...item, [field]: value };
      setAcademicRecords(updated);
    }
  };

  const handleCountryToggle = (code: string) => {
    if (targetCountryCodes.includes(code)) {
      if (targetCountryCodes.length > 1) {
        setTargetCountryCodes(targetCountryCodes.filter((c) => c !== code));
      }
    } else {
      setTargetCountryCodes([...targetCountryCodes, code]);
    }
  };

  // Step Saver
  const handleSaveAndNext = async (stepNumber: number) => {
    setSaving(true);
    setErrorMessage(null);

    let payload: any = {};
    if (stepNumber === 1) {
      payload = {
        fullName,
        dateOfBirth,
        nationality,
        currentCountry,
        currentCity,
        hasPassport,
        passportNumber: hasPassport ? passportNumber : undefined,
        passportExpiryDate: hasPassport ? passportExpiryDate : undefined,
        phone,
        alternatePhone,
      };
    } else if (stepNumber === 2) {
      payload = {
        highestCompletedLevel,
        academicRecords,
      };
    } else if (stepNumber === 3) {
      payload = {
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
        plannedTestDate: !hasTakenTest ? plannedTestDate : undefined,
      };
    } else if (stepNumber === 4) {
      payload = {
        desiredDegreeLevel,
        preferredSubject,
        targetCountryCodes,
        targetIntakeSeason,
        targetIntakeYear,
        studyMode,
        preferredCityType,
        pswWorkImportance,
        academicGoals,
        careerGoals,
      };
    } else if (stepNumber === 5) {
      payload = {
        annualTuitionBudget,
        budgetCurrencyCode,
        liquidSavingsAmount,
        savingsCurrencyCode: budgetCurrencyCode,
        primaryBankName,
        fundingStrategyType,
        hasSponsor,
        sponsorRelationship,
        sponsorName: hasSponsor ? sponsorName : undefined,
        sponsorOccupation: hasSponsor ? sponsorOccupation : undefined,
        annualSponsorIncome: hasSponsor ? annualSponsorIncome : undefined,
        scholarshipPreference,
        educationLoanInterest,
      };
    } else if (stepNumber === 6) {
      payload = {
        hasTravelHistory,
        travelHistorySummary: hasTravelHistory ? travelHistorySummary : undefined,
        countryCode: targetCountryCodes[0] || "NONE",
        outcomeStatus,
        hasPreviousRefusal,
        refusalReasonNotice: hasPreviousRefusal ? refusalReasonNotice : undefined,
        hasViolations,
        violationDetails: hasViolations ? violationDetails : undefined,
      };
    }

    try {
      const res = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: stepNumber, data: payload }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.error || "সংরক্ষণ করতে ব্যর্থ হয়েছে।");
        setSaving(false);
        return;
      }

      if (json.data?.completionPercentage) {
        setCompletionScore(json.data.completionPercentage);
      }

      setCurrentStep(stepNumber + 1);
    } catch (err: any) {
      setErrorMessage("নেটওয়ার্ক সমস্যা। পুনরায় চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!explicitConfirmation) {
      setErrorMessage("অনুগ্রহ করে তথ্যের সত্যতা স্বীকার ও চেকবক্সে টিক দিন।");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ explicitConfirmation }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.error || "অনবোর্ডিং চূড়ান্ত করতে ব্যর্থ হয়েছে।");
        setSaving(false);
        return;
      }

      // Successful completion! Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage("সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
      setSaving(false);
    }
  };

  const stepTitles = [
    { number: 1, title: "প্রাথমিক তথ্য", icon: User },
    { number: 2, title: "শিক্ষাগত পটভূমি", icon: GraduationCap },
    { number: 3, title: "ভাষার দক্ষতা", icon: Globe2 },
    { number: 4, title: "স্টাডি পছন্দ", icon: Target },
    { number: 5, title: "আর্থিক পটভূমি", icon: Coins },
    { number: 6, title: "ইমিগ্রেশন ইতিহাস", icon: Briefcase },
    { number: 7, title: "পর্যালোচনা ও সমাপ্তি", icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-600">অনবোর্ডিং তথ্য লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-black text-base shadow-sm">
              AM
            </div>
            <div>
              <span className="font-black text-lg text-slate-900 block leading-tight">AbroadMate</span>
              <span className="text-xs text-brand-700 font-bold block">উচ্চশিক্ষা অনবোর্ডিং পোর্টাল</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">প্রোফাইল পূর্ণতা:</span>
              <span className="text-sm font-black text-brand-800">{completionScore}%</span>
            </div>
            <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7-Step Navigation Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {stepTitles.map((st) => {
              const Icon = st.icon;
              const isCurrent = currentStep === st.number;
              const isPassed = currentStep > st.number;

              return (
                <button
                  key={st.number}
                  onClick={() => setCurrentStep(st.number)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-brand-700 text-white shadow-xs"
                      : isPassed
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? "bg-white/20 text-white"
                        : isPassed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : st.number}
                  </div>
                  <span className="truncate">{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-950 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 1: Basic Information */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">ধাপ ১ / ৭</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">ব্যক্তিগত ও যোগাযোগের তথ্য</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                আন্তর্জাতিক ভর্তির আবেদনের সুবিধার্থে আপনার সঠিক নাম ও পাসপোর্ট তথ্য দিন।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  পূর্ণ নাম (পাসপোর্ট অনুযায়ী) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  জন্মতারিখ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">জাতীয়তা</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  বর্তমান শহর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="যেমন: ঢাকা"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিকল্প নম্বর / হোয়াটসঅ্যাপ (ঐচ্ছিক)</label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="01812345678"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Passport Toggle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">আপনার আন্তর্জাতিক পাসপোর্ট আছে কি?</span>
                  <span className="text-[11px] text-slate-500">ভিসা আবেদনের জন্য কমপক্ষে ৬ মাস মেয়াদের পাসপোর্ট আবশ্যক।</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasPassport(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hasPassport ? "bg-brand-700 text-white" : "bg-white border text-slate-700"
                    }`}
                  >
                    হ্যাঁ, আছে
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPassport(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !hasPassport ? "bg-slate-800 text-white" : "bg-white border text-slate-700"
                    }`}
                  >
                    না, এখনও নেই
                  </button>
                </div>
              </div>

              {hasPassport && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পাসপোর্ট নম্বর</label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="যেমন: A01234567"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      পাসপোর্টের মেয়াদ শেষ হওয়ার তারিখ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={passportExpiryDate}
                      onChange={(e) => setPassportExpiryDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSaveAndNext(1)}
                disabled={saving}
                className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <span>সংরক্ষণ করুন ও পরবর্তী ধাপে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: Education Background */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">ধাপ ২ / ৭</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">শিক্ষাগত পটভূমি ও ফলাফল</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার অর্জিত ডিগ্রি, সিজিপিএ ও পাশের বছর যোগ করুন (একাধিক রেকর্ড যোগ করতে পারেন)।
                </p>
              </div>

              <button
                type="button"
                onClick={addAcademicRecord}
                className="px-3.5 py-2 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-800 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>আরেকটি রেকর্ড যোগ করুন</span>
              </button>
            </div>

            {/* Highest Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                আপনার সর্বোচ্চ সম্পন্ন করা শিক্ষার স্তর:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: "hsc_passed", label: "এইচএসসি / আলিম" },
                  { id: "a_level", label: "A-Level / সমমান" },
                  { id: "diploma", label: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং" },
                  { id: "bachelor_passed", label: "স্নাতক (ব্যাচেলর)" },
                  { id: "master_passed", label: "স্নাতকোত্তর (মাস্টার্স)" },
                  { id: "phd", label: "ডক্টরেট (PhD)" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setHighestCompletedLevel(lvl.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      highestCompletedLevel === lvl.id
                        ? "border-brand-600 bg-brand-50 text-brand-900 font-bold shadow-2xs"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Records List */}
            <div className="space-y-4">
              {academicRecords.map((rec, index) => (
                <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-brand-700" />
                      <span className="font-bold text-slate-900">
                        রেকর্ড #{index + 1}: {rec.level}
                      </span>
                    </div>
                    {academicRecords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAcademicRecord(index)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="এই রেকর্ডটি মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">লেভেল</label>
                      <select
                        value={rec.level}
                        onChange={(e) => updateAcademicRecord(index, "level", e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2"
                      >
                        <option value="BACHELOR">Bachelor's / স্নাতক</option>
                        <option value="HSC">HSC / উচ্চ মাধ্যমিক</option>
                        <option value="SSC">SSC / মাধ্যমিক</option>
                        <option value="A_LEVEL">A-Level</option>
                        <option value="O_LEVEL">O-Level</option>
                        <option value="DIPLOMA">Diploma</option>
                        <option value="MASTER">Master's</option>
                        <option value="PHD">PhD</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">শিক্ষা প্রতিষ্ঠানের নাম</label>
                      <input
                        type="text"
                        value={rec.institutionName}
                        onChange={(e) => updateAcademicRecord(index, "institutionName", e.target.value)}
                        placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">বিভাগ বা বিষয় (Major)</label>
                      <input
                        type="text"
                        value={rec.groupOrMajor}
                        onChange={(e) => updateAcademicRecord(index, "groupOrMajor", e.target.value)}
                        placeholder="যেমন: CSE, BBA, Science"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">প্রাপ্ত GPA / CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        value={rec.gpaOrCgpa}
                        onChange={(e) => updateAcademicRecord(index, "gpaOrCgpa", parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">স্কেল (৪.০০ নাকি ৫.০০)</label>
                      <select
                        value={rec.scale}
                        onChange={(e) => updateAcademicRecord(index, "scale", parseFloat(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2"
                      >
                        <option value={4.0}>৪.০০ স্কেল (স্নাতক / মাস্টার্স)</option>
                        <option value={5.0}>৫.০০ স্কেল (এসএসসি / এইচএসসি)</option>
                        <option value={100}>১০০% স্কেল (শতাংশ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">পাশের সাল</label>
                      <input
                        type="number"
                        value={rec.passingYear}
                        onChange={(e) => updateAcademicRecord(index, "passingYear", parseInt(e.target.value) || 2024)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">বোর্ড বা বিশ্ববিদ্যালয়</label>
                      <input
                        type="text"
                        value={rec.boardOrAuthority}
                        onChange={(e) => updateAcademicRecord(index, "boardOrAuthority", e.target.value)}
                        placeholder="যেমন: ঢাকা বোর্ড"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">ফলাফল স্ট্যাটাস</label>
                      <select
                        value={rec.resultStatus}
                        onChange={(e) => updateAcademicRecord(index, "resultStatus", e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2"
                      >
                        <option value="PASSED">উত্তীর্ণ (Passed)</option>
                        <option value="RUNNING">চলমান / শেষ বর্ষে (Appeared)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী ধাপ</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAndNext(2)}
                disabled={saving}
                className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <span>সংরক্ষণ করুন ও পরবর্তী ধাপে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: Language Proficiency */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">ধাপ ৩ / ৭</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">ইংরেজি ভাষার দক্ষতা (Language Proficiency)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                আইইএলটিএস, পিটিই বা টোফেল টেস্টের স্কোর প্রদান করুন। এখনও পরীক্ষা না দিয়ে থাকলে তা উল্লেখ করুন।
              </p>
            </div>

            {/* Test status toggle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">আপনি কি কোনো ইংরেজি দক্ষতা পরীক্ষা দিয়েছেন?</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setHasTakenTest(true);
                    setTestType("IELTS");
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    hasTakenTest
                      ? "bg-brand-700 text-white font-bold shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  হ্যাঁ, পরীক্ষা সম্পন্ন করেছি
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasTakenTest(false);
                    setTestType("NOT_TAKEN");
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    !hasTakenTest
                      ? "bg-slate-800 text-white font-bold shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  না, এখনও দিইনি / প্রস্তুতি নিচ্ছি
                </button>
              </div>
            </div>

            {hasTakenTest ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পরীক্ষার ধরন</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold"
                  >
                    <option value="IELTS">IELTS Academic (আইইএলটিএস)</option>
                    <option value="PTE">PTE Academic (পিটিই)</option>
                    <option value="TOEFL">TOEFL iBT (টোফেল)</option>
                    <option value="DUOLINGO">Duolingo English Test (DET)</option>
                    <option value="MOI">Medium of Instruction (MOI Certificate)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Overall Band</label>
                    <input
                      type="number"
                      step="0.5"
                      value={overallScore}
                      onChange={(e) => setOverallScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-black text-brand-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Listening</label>
                    <input
                      type="number"
                      step="0.5"
                      value={listeningScore}
                      onChange={(e) => setListeningScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Reading</label>
                    <input
                      type="number"
                      step="0.5"
                      value={readingScore}
                      onChange={(e) => setReadingScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Writing</label>
                    <input
                      type="number"
                      step="0.5"
                      value={writingScore}
                      onChange={(e) => setWritingScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Speaking</label>
                    <input
                      type="number"
                      step="0.5"
                      value={speakingScore}
                      onChange={(e) => setSpeakingScore(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">পরীক্ষার তারিখ</label>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">মেয়াদ শেষ হওয়ার তারিখ</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">TRF / রিপোর্ট ফর্ম নম্বর</label>
                    <input
                      type="text"
                      value={trfNumber}
                      onChange={(e) => setTrfNumber(e.target.value)}
                      placeholder="যেমন: 24BD001234S"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 text-xs">
                <span className="font-bold text-amber-950 block">কবে নাগাদ পরীক্ষা দেওয়ার পরিকল্পনা করছেন?</span>
                <input
                  type="date"
                  value={plannedTestDate}
                  onChange={(e) => setPlannedTestDate(e.target.value)}
                  className="w-full sm:w-64 bg-white border border-slate-300 rounded-xl px-3 py-2"
                />
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  💡 কোনো সমস্যা নেই! আপনার টার্গেট ইনটেকের অন্তত ৬ মাস আগে আইইএলটিএস পরীক্ষা দেওয়া নিরাপদ। AbroadMate আপনাকে ডেডলাইন অনুযায়ী প্রস্তুতি রিমাইন্ডার দিবে।
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী ধাপ</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAndNext(3)}
                disabled={saving}
                className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <span>সংরক্ষণ করুন ও পরবর্তী ধাপে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: Study Preferences */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">ধাপ ৪ / ৭</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">পড়াশোনার পছন্দ ও ক্যারিয়ার লক্ষ্য</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                আপনার কাঙ্ক্ষিত দেশ, ডিগ্রি লেভেল, ইনটেক এবং ভবিষ্যৎ ক্যারিয়ার ভাবনা জানান।
              </p>
            </div>

            {/* Target Countries */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                টার্গেট দেশসমূহ নির্বাচন করুন (কমপক্ষে ১টি) <span className="text-rose-500">*</span>:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {COUNTRY_LIST.map((country) => {
                  const isSelected = targetCountryCodes.includes(country.code);
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryToggle(country.code)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "border-brand-600 bg-brand-50 shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-2xl block">{country.flag}</span>
                      <span className="text-xs font-bold text-slate-900 block mt-1">{country.nameBn}</span>
                      <span className="text-[10px] text-slate-500 block">{country.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কাঙ্ক্ষিত ডিগ্রি লেভেল</label>
                <select
                  value={desiredDegreeLevel}
                  onChange={(e) => setDesiredDegreeLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold"
                >
                  <option value="MASTER">মাস্টার্স (Master's)</option>
                  <option value="BACHELOR">স্নাতক (Bachelor's)</option>
                  <option value="PHD">ডক্টরেট (PhD)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">টার্গেট ইনটেক সেশন</label>
                <select
                  value={targetIntakeSeason}
                  onChange={(e) => setTargetIntakeSeason(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold"
                >
                  <option value="FALL">ফল ইনটেক (সেপ্টেম্বর / অক্টোবর)</option>
                  <option value="SPRING">স্প্রিং ইনটেক (জানুয়ারি / ফেব্রুয়ারি)</option>
                  <option value="SUMMER">সামার ইনটেক (মে / জুন)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ইনটেক বছর</label>
                <select
                  value={targetIntakeYear}
                  onChange={(e) => setTargetIntakeYear(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold"
                >
                  <option value={2025}>২০২৫</option>
                  <option value={2026}>২০২৬</option>
                  <option value={2027}>২০২৭</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">
                  যে বিষয়ে পড়তে চান (Subject / Major) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={preferredSubject}
                  onChange={(e) => setPreferredSubject(e.target.value)}
                  placeholder="যেমন: Data Science & Artificial Intelligence"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">ভবিষ্যৎ ক্যারিয়ার লক্ষ্য ও ভিশন (ঐচ্ছিক)</label>
                <textarea
                  rows={2}
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  placeholder="যেমন: পড়াশোনা শেষে মাল্টিন্যাশনাল কোম্পানিতে ডেটা সায়েন্টিস্ট হিসেবে ক্যারিয়ার গড়া..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী ধাপ</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAndNext(4)}
                disabled={saving}
                className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <span>সংরক্ষণ করুন ও পরবর্তী ধাপে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 5: Financial Background */}
        {/* ============================================================== */}
        {currentStep === 5 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">ধাপ ৫ / ৭</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">আর্থিক পটভূমি ও স্পন্সর পরিকল্পনা</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                টিউশন বাজেট এবং ব্যাংক সলভেন্সির আনুমানিক হিসাব দিন।
              </p>
            </div>

            {/* Privacy Promise Banner */}
            <div className="p-3.5 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-2.5 text-xs text-brand-950">
              <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0" />
              <span>
                <strong>শতভাগ নিরাপদ:</strong> আমরা কখনো কোনো ব্যাংক একাউন্ট নম্বর বা সংবেদনশীল পাসওয়ার্ড চাই না। এই তথ্য কেবল ভিসা ও স্কলারশিপ সম্ভাব্যতা যাচাইয়ের জন্য ব্যবহৃত হবে।
              </span>
            </div>

            {/* Tuition budget range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>বার্ষিক সর্বোচ্চ টিউশন ফি বাজেট:</span>
                <span className="text-brand-800 bg-brand-100 px-3 py-1 rounded-lg">
                  {formatBdt(annualTuitionBudget, "bn")}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={5000000}
                step={250000}
                value={annualTuitionBudget}
                onChange={(e) => setAnnualTuitionBudget(parseInt(e.target.value))}
                className="w-full accent-brand-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>৫ লাখ</span>
                <span>২৫ লাখ</span>
                <span>৫০ লাখ+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্যাংক সেভিংস ব্যালান্স (আনুমানিক)</label>
                <input
                  type="number"
                  value={liquidSavingsAmount}
                  onChange={(e) => setLiquidSavingsAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-bold"
                  placeholder="টাকায় পরিমাণ লিখুন"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  ইউকে ২৮-দিনের ব্যাংক রুল বা জার্মানির ব্লকড একাউন্টে প্রদর্শনযোগ্য ব্যালান্স।
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রাথমিক ব্যাংক</label>
                <input
                  type="text"
                  value={primaryBankName}
                  onChange={(e) => setPrimaryBankName(e.target.value)}
                  placeholder="যেমন: ইস্টার্ন ব্যাংক, ব্র্যাক ব্যাংক"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">স্পন্সরের সাথে সম্পর্ক</label>
                <select
                  value={sponsorRelationship}
                  onChange={(e) => setSponsorRelationship(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold"
                >
                  <option value="FATHER">বাবা (Father)</option>
                  <option value="MOTHER">মা (Mother)</option>
                  <option value="SELF">নিজস্ব অর্থায়ন (Self)</option>
                  <option value="SPOUSE">স্বামী / স্ত্রী (Spouse)</option>
                  <option value="SIBLING">ভাই / বোন (Sibling)</option>
                  <option value="ORGANIZATION">প্রতিষ্ঠান বা কোম্পানি</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">স্পন্সরের নাম</label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="যেমন: মো: রফিকুল ইসলাম"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">স্পন্সরের পেশা</label>
                <input
                  type="text"
                  value={sponsorOccupation}
                  onChange={(e) => setSponsorOccupation(e.target.value)}
                  placeholder="যেমন: ব্যবসায়ী, সরকারি চাকরিজীবী"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">স্পন্সরের বার্ষিক আয় (আনুমানিক)</label>
                <input
                  type="number"
                  value={annualSponsorIncome}
                  onChange={(e) => setAnnualSponsorIncome(parseInt(e.target.value) || 0)}
                  placeholder="১৮০০০০০"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী ধাপ</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAndNext(5)}
                disabled={saving}
                className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <span>সংরক্ষণ করুন ও পরবর্তী ধাপে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 6: Immigration History */}
        {/* ============================================================== */}
        {currentStep === 6 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">ধাপ ৬ / ৭</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">পূর্ববর্তী ইমিগ্রেশন ও ভিসা ইতিহাস</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                আন্তর্জাতিক ভিসা অনুমোদনের পূর্বশর্ত হিসেবে আপনার অতীত ভ্রমণ ও ভিসা ইতিহাস প্রকাশ করা আবশ্যক।
              </p>
            </div>

            {/* Travel History */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">আপনার কি পূর্ববর্তী আন্তর্জাতিক ভ্রমণের অভিজ্ঞতা আছে?</span>
                  <span className="text-[11px] text-slate-500">পূর্ববর্তী ভ্রমণ রেকর্ড জেনুইন ট্রাভেলার প্রমাণে সহায়তা করে।</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasTravelHistory(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hasTravelHistory ? "bg-brand-700 text-white" : "bg-white border text-slate-700"
                    }`}
                  >
                    হ্যাঁ, আছে
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasTravelHistory(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !hasTravelHistory ? "bg-slate-800 text-white" : "bg-white border text-slate-700"
                    }`}
                  >
                    না, কখনও যাইনি
                  </button>
                </div>
              </div>

              {hasTravelHistory && (
                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 mb-1">ভ্রমণকৃত দেশ ও বছর সংক্ষেপে লিখুন</label>
                  <input
                    type="text"
                    value={travelHistorySummary}
                    onChange={(e) => setTravelHistorySummary(e.target.value)}
                    placeholder="যেমন: ভারত (২০২২), মালয়েশিয়া (২০২৩)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              )}
            </div>

            {/* Refusal declaration */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">কোনো দেশের ভিসা কি কখনও প্রত্যাখ্যাত (Refused) হয়েছে?</span>
                  <span className="text-[11px] text-slate-500">ভিসা রিফিউজাল গোপন করা গুরুতর অপরাধ। সত্য জানালে এসওপি দিয়ে ডিফেন্ড করা যায়।</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasPreviousRefusal(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hasPreviousRefusal ? "bg-rose-700 text-white" : "bg-white border text-slate-700"
                    }`}
                  >
                    হ্যাঁ, হয়েছে
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPreviousRefusal(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !hasPreviousRefusal ? "bg-slate-800 text-white" : "bg-white border text-slate-700"
                    }`}
                  >
                    না, হয়নি
                  </button>
                </div>
              </div>

              {hasPreviousRefusal && (
                <div className="pt-2 space-y-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    অফিসিয়াল রিফিউজাল কারণ ও দেশ <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={refusalReasonNotice}
                    onChange={(e) => setRefusalReasonNotice(e.target.value)}
                    placeholder="যেমন: ২০২৩ সালে কানাডা ভিজিটর ভিসা প্রত্যাখ্যান হয়েছিল ফান্ড প্রমাণের অপর্যাপ্ততায়।"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী ধাপ</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAndNext(6)}
                disabled={saving}
                className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <span>সংরক্ষণ করুন ও রিভিউ ধাপে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 7: Review and Final Confirmation */}
        {/* ============================================================== */}
        {currentStep === 7 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">ধাপ ৭ / ৭</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">পূর্ণাঙ্গ প্রোফাইল পর্যালোচনা ও চূড়ান্ত অনুমোদন</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                আপনার দেওয়া সকল তথ্য যাচাই করে চূড়ান্ত অনুমোদন দিন। যেকোনো সেকশন এখনও এডিট করা যাবে।
              </p>
            </div>

            {/* Structured Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Card 1: Basic Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-700" />
                    <span>ব্যক্তিগত তথ্য</span>
                  </span>
                  <button onClick={() => setCurrentStep(1)} className="text-brand-700 font-bold hover:underline">
                    এডিট
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  <p><strong>নাম:</strong> {fullName}</p>
                  <p><strong>জন্মতারিখ:</strong> {dateOfBirth}</p>
                  <p><strong>বর্তমান শহর:</strong> {currentCity}, {currentCountry}</p>
                  <p><strong>পাসপোর্ট:</strong> {hasPassport ? `আছে (${passportNumber || "নম্বর প্রদান করা হয়নি"})` : "নেই"}</p>
                  <p><strong>মোবাইল:</strong> {phone}</p>
                </div>
              </div>

              {/* Card 2: Education */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-brand-700" />
                    <span>শিক্ষাগত যোগ্যতা ({academicRecords.length}টি রেকর্ড)</span>
                  </span>
                  <button onClick={() => setCurrentStep(2)} className="text-brand-700 font-bold hover:underline">
                    এডিট
                  </button>
                </div>
                <div className="space-y-2 text-slate-700">
                  {academicRecords.map((r, i) => (
                    <div key={i} className="pb-1 border-b border-slate-200/40 last:border-b-0">
                      <p className="font-bold text-slate-900">{r.level} — {r.groupOrMajor}</p>
                      <p className="text-[11px] text-slate-600">{r.institutionName} | GPA: {r.gpaOrCgpa} / {r.scale} ({r.passingYear})</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Language */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-brand-700" />
                    <span>ভাষার দক্ষতা</span>
                  </span>
                  <button onClick={() => setCurrentStep(3)} className="text-brand-700 font-bold hover:underline">
                    এডিট
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  {hasTakenTest ? (
                    <>
                      <p><strong>টেস্ট:</strong> {testType}</p>
                      <p><strong>Overall Score:</strong> {overallScore}</p>
                      <p className="text-[11px] text-slate-500">L: {listeningScore} | R: {readingScore} | W: {writingScore} | S: {speakingScore}</p>
                    </>
                  ) : (
                    <p className="text-slate-600">টেস্ট এখনও দেওয়া হয়নি (পরিকল্পিত তারিখ: {plannedTestDate || "নির্ধারিত হয়নি"})</p>
                  )}
                </div>
              </div>

              {/* Card 4: Study Preferences */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-brand-700" />
                    <span>স্টাডি গোল</span>
                  </span>
                  <button onClick={() => setCurrentStep(4)} className="text-brand-700 font-bold hover:underline">
                    এডিট
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  <p><strong>ডিগ্রি:</strong> {desiredDegreeLevel} in {preferredSubject}</p>
                  <p><strong>টার্গেট দেশ:</strong> {targetCountryCodes.join(", ")}</p>
                  <p><strong>ইনটেক:</strong> {targetIntakeSeason} {targetIntakeYear}</p>
                </div>
              </div>

              {/* Card 5: Financials */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-brand-700" />
                    <span>আর্থিক সক্ষমতা</span>
                  </span>
                  <button onClick={() => setCurrentStep(5)} className="text-brand-700 font-bold hover:underline">
                    এডিট
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  <p><strong>বার্ষিক বাজেট:</strong> {formatBdt(annualTuitionBudget, "bn")}</p>
                  <p><strong>সেভিংস ফান্ড:</strong> {formatBdt(liquidSavingsAmount, "bn")}</p>
                  <p><strong>স্পন্সর:</strong> {hasSponsor ? `${sponsorName} (${sponsorRelationship})` : "নিজস্ব"}</p>
                </div>
              </div>

              {/* Card 6: Immigration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-brand-700" />
                    <span>ইমিগ্রেশন ইতিহাস</span>
                  </span>
                  <button onClick={() => setCurrentStep(6)} className="text-brand-700 font-bold hover:underline">
                    এডিট
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  <p><strong>পূর্ববর্তী ভ্রমণ:</strong> {hasTravelHistory ? travelHistorySummary : "নেই"}</p>
                  <p><strong>ভিসা রিফিউজাল:</strong> {hasPreviousRefusal ? `হ্যাঁ (${refusalReasonNotice})` : "না, কোনো রিফিউজাল নেই"}</p>
                </div>
              </div>
            </div>

            {/* Explicit Confirmation Checkbox */}
            <div className="p-4 bg-brand-50 border-2 border-brand-300 rounded-2xl space-y-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-brand-950 font-semibold leading-relaxed">
                <input
                  type="checkbox"
                  checked={explicitConfirmation}
                  onChange={(e) => setExplicitConfirmation(e.target.checked)}
                  className="w-5 h-5 accent-brand-700 rounded mt-0.5 shrink-0"
                />
                <span>
                  আমি নিশ্চিত করছি যে উপরে প্রদত্ত সকল শিক্ষাগত, ব্যক্তিগত ও আর্থিক তথ্য সত্য, নির্ভুল এবং নির্ভরযোগ্য। 
                  এই তথ্যের ওপর ভিত্তি করে এআই ইঞ্জিন আমার জন্য দেশ, বিশ্ববিদ্যালয় ও স্কলারশিপের সুপারিশ প্রস্তুত করতে পারে।
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী ধাপ</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={saving || !explicitConfirmation}
                className="px-8 py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>প্রোফাইল অনুমোদন ও ড্যাশবোর্ডে প্রবেশ করুন</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
