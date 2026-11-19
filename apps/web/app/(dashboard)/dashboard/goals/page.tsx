"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { COUNTRY_LIST, INTAKE_SEASONS, STUDY_LEVELS, formatBdt } from "@abroadmate/shared";
import {
  Target,
  Globe2,
  Calendar,
  GraduationCap,
  Coins,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Save,
  Check,
  Compass,
  AlertCircle,
  Building2,
  Briefcase,
} from "lucide-react";

export default function GoalsPage() {
  const { locale } = useI18n();

  // State
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["GB", "CA"]);
  const [targetIntake, setTargetIntake] = useState<string>("fall");
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [degreeLevel, setDegreeLevel] = useState<string>("master");
  const [targetMajor, setTargetMajor] = useState<string>("Data Science & Artificial Intelligence");
  const [annualBudgetBdt, setAnnualBudgetBdt] = useState<number>(2800000); // 28 Lakhs
  const [fundingStrategy, setFundingStrategy] = useState<string>("partial_scholarship");
  const [postStudyWorkPriority, setPostStudyWorkPriority] = useState<string>("high");
  const [cityPreference, setCityPreference] = useState<string>("affordable");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("abroadmate_student_goals");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedCountries) setSelectedCountries(parsed.selectedCountries);
        if (parsed.targetIntake) setTargetIntake(parsed.targetIntake);
        if (parsed.targetYear) setTargetYear(parsed.targetYear);
        if (parsed.degreeLevel) setDegreeLevel(parsed.degreeLevel);
        if (parsed.targetMajor) setTargetMajor(parsed.targetMajor);
        if (parsed.annualBudgetBdt) setAnnualBudgetBdt(parsed.annualBudgetBdt);
        if (parsed.fundingStrategy) setFundingStrategy(parsed.fundingStrategy);
        if (parsed.postStudyWorkPriority) setPostStudyWorkPriority(parsed.postStudyWorkPriority);
        if (parsed.cityPreference) setCityPreference(parsed.cityPreference);
      }
    } catch (e) {
      // Ignore fallback
    }
  }, []);

  const handleCountryToggle = (code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((c) => c !== code)
          : prev
        : [...prev, code]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "abroadmate_student_goals",
        JSON.stringify({
          selectedCountries,
          targetIntake,
          targetYear,
          degreeLevel,
          targetMajor,
          annualBudgetBdt,
          fundingStrategy,
          postStudyWorkPriority,
          cityPreference,
        })
      );
    } catch (e) {
      // ignore
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5 text-brand-700" />
            <span>উচ্চশিক্ষা লক্ষ্য নির্ধারণ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            আমার স্টাডি গোল ও ইনটেক পরিকল্পনা
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            আপনার পছন্দের দেশ, ইনটেক সেশন, ডিগ্রি লেভেল ও বাজেট নির্ধারণ করুন। 
            এই তথ্যের ওপর ভিত্তি করে AbroadMate-এর এআই ইঞ্জিন আপনার জন্য কাস্টমাইজড রোডম্যাপ ও শর্টলিস্ট তৈরি করবে।
          </p>
        </div>

        <Link
          href="/dashboard/roadmap"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-brand-700" />
          <span>রোডম্যাপ দেখুন</span>
        </Link>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">আপনার স্টাডি গোল সফলভাবে সংরক্ষিত হয়েছে!</span>
              <span className="text-[11px] text-emerald-800">
                আপনার পরিবর্তিত গোলের সাথে মিলিয়ে ড্যাশবোর্ড ও বিশ্ববিদ্যালয় শর্টলিস্ট আপডেট করা হয়েছে।
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/universities"
            className="text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg shrink-0 transition-colors"
          >
            শর্টলিস্ট চেক করুন
          </Link>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Target Countries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-brand-700" />
              <div>
                <h2 className="text-base font-bold text-slate-900">১. টার্গেট দেশ নির্বাচন</h2>
                <p className="text-xs text-slate-500">একাধিক দেশ পছন্দ করতে পারেন ({selectedCountries.length}টি নির্বাচিত)</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
              কমপক্ষে ১টি দেশ আবশ্যক
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTRY_LIST.map((country) => {
              const isSelected = selectedCountries.includes(country.code);
              return (
                <div
                  key={country.code}
                  onClick={() => handleCountryToggle(country.code)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-brand-600 bg-brand-50/60 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {country.nameBn}
                        </h3>
                        <span className="text-[11px] text-slate-500">{country.nameEn}</span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-brand-600 border-brand-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>পোস্ট স্টাডি ওয়ার্ক (PSW):</span>
                      <span className="font-bold text-slate-800">
                        {country.postStudyWorkMonths.masters / 12} বছর
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>মাসিক জীবনযাত্রার ব্যয়:</span>
                      <span className="font-semibold text-slate-800">
                        ~ {formatBdt(country.avgMonthlyLivingCostLocal * country.currency.rateToBdtApprox, "bn")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Target Intake & Academic Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Intake */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-brand-700" />
              <div>
                <h2 className="text-base font-bold text-slate-900">২. কাঙ্ক্ষিত ইনটেক সেশন ও বছর</h2>
                <p className="text-xs text-slate-500">কখন ক্লাস শুরু করতে চান</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">ইনটেক সেশন:</label>
                <div className="grid grid-cols-3 gap-2">
                  {INTAKE_SEASONS.map((intake) => (
                    <button
                      key={intake.id}
                      type="button"
                      onClick={() => setTargetIntake(intake.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        targetIntake === intake.id
                          ? "border-brand-600 bg-brand-50 text-brand-900 font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs"
                      }`}
                    >
                      <span className="block text-xs font-bold">{intake.nameEn.split(" ")[0]}</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">{intake.nameBn.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">ইনটেক বছর:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2025, 2026, 2027].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setTargetYear(year)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        targetYear === year
                          ? "border-brand-600 bg-brand-50 text-brand-900 font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                      }`}
                    >
                      <span className="text-sm font-bold">{year}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>পরামর্শ:</strong> {targetIntake === "fall" ? "ফল" : targetIntake === "spring" ? "স্প্রিং" : "সামার"} {targetYear} সেশনের জন্য আপনার আবেদন প্রক্রিয়া <strong>{targetYear - 1} সালের অক্টোবর-ডিসেম্বরের</strong> মধ্যে শুরু করা সর্বোত্তম।
                </p>
              </div>
            </div>
          </div>

          {/* Academic Level & Field */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-brand-700" />
              <div>
                <h2 className="text-base font-bold text-slate-900">৩. ডিগ্রি লেভেল ও পড়ার বিষয়</h2>
                <p className="text-xs text-slate-500">আপনার উদ্দিষ্ট উচ্চশিক্ষা ক্ষেত্র</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">ডিগ্রি লেভেল:</label>
                <div className="grid grid-cols-3 gap-2">
                  {STUDY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setDegreeLevel(level.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        degreeLevel === level.id
                          ? "border-brand-600 bg-brand-50 text-brand-900 font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs"
                      }`}
                    >
                      <span className="block text-xs font-bold">{level.nameEn.split(" ")[0]}</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">{level.nameBn.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নির্দিষ্ট বিষয় বা ডিপার্টমেন্ট:
                </label>
                <input
                  type="text"
                  value={targetMajor}
                  onChange={(e) => setTargetMajor(e.target.value)}
                  placeholder="যেমন: MSc in Computer Science, MBA, Public Health"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  বিশ্ববিদ্যালয় সার্চ ও স্কলারশিপ ফিল্টারে এই মেজরটি প্রাধান্য পাবে।
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Budget & Funding Strategy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-brand-700" />
              <div>
                <h2 className="text-base font-bold text-slate-900">৪. আর্থিক সামর্থ্য ও ফান্ডিং কৌশল</h2>
                <p className="text-xs text-slate-500">টিউশন ফি ও জীবনযাত্রার বাজেট পরিকল্পনা</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-brand-800 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200">
              {formatBdt(annualBudgetBdt, "bn")} / বছর
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>বার্ষিক সর্বোচ্চ টিউশন ফি বাজেট (টাকায়):</span>
                <span className="font-bold text-brand-700">{formatBdt(annualBudgetBdt, "bn")}</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={5000000}
                step={200000}
                value={annualBudgetBdt}
                onChange={(e) => setAnnualBudgetBdt(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>১০ লাখ (কম খরচের দেশ/স্কলারশিপ)</span>
                <span>২৫ লাখ (মাঝারি বাজেট)</span>
                <span>৫০ লাখ+ (উচ্চমানের গ্লোবাল প্রতিষ্ঠান)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">ফান্ডিং কৌশল:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setFundingStrategy("self_funded")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    fundingStrategy === "self_funded"
                      ? "border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs font-bold block mb-1">সম্পূর্ণ স্ব-তহবিল / ব্যাংক স্পন্সর</span>
                  <span className="text-[11px] text-slate-500 font-normal leading-snug block">
                    পরিবারের নিজস্ব সেভিংস বা অনুমোদিত ব্যাংক অ্যাকাউন্টের মাধ্যমে ফান্ড প্রদর্শন করবেন।
                  </span>
                </div>

                <div
                  onClick={() => setFundingStrategy("partial_scholarship")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    fundingStrategy === "partial_scholarship"
                      ? "border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs font-bold block mb-1">আংশিক স্কলারশিপ আবশ্যক</span>
                  <span className="text-[11px] text-slate-500 font-normal leading-snug block">
                    বিশ্ববিদ্যালয়ের ২৫-৫০% টিউশন ফি ওয়েভার পেলে খরচ বহন করতে পারবেন।
                  </span>
                </div>

                <div
                  onClick={() => setFundingStrategy("full_scholarship")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    fundingStrategy === "full_scholarship"
                      ? "border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs font-bold block mb-1">শতভাগ ফুল-ফান্ডেড স্কলারশিপ</span>
                  <span className="text-[11px] text-slate-500 font-normal leading-snug block">
                    শেভেনিং, ফুলব্রাইট, ডিএএডি ইত্যাদি সরকারি ১০০% স্কলারশিপ ছাড়া পড়তে যাওয়া সম্ভব নয়।
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Post-Study Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Briefcase className="w-5 h-5 text-brand-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">৫. পড়াশোনা পরবর্তী ক্যারিয়ার ও ক্যাম্পাস পছন্দ</h2>
              <p className="text-xs text-slate-500">আপনার দীর্ঘমেয়াদি পরিকল্পনা</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                পোস্ট স্টাডি ওয়ার্ক পারমিট (PSW) গুরুত্ব:
              </label>
              <div className="space-y-2">
                {[
                  { id: "high", title: "অত্যন্ত গুরুত্বপূর্ণ (PSW ও পিআর পাথওয়ে লক্ষ্য)" },
                  { id: "medium", title: "মাঝারি (কাজের অভিজ্ঞতা পেলে ভালো, তবে দেশে ফেরার ইচ্ছা আছে)" },
                  { id: "low", title: "শুধুমাত্র উচ্চশিক্ষা অর্জনই মূল লক্ষ্য" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="pswPriority"
                      checked={postStudyWorkPriority === item.id}
                      onChange={() => setPostStudyWorkPriority(item.id)}
                      className="accent-brand-600"
                    />
                    <span>{item.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">ক্যাম্পাস ও শহর পছন্দ:</label>
              <div className="space-y-2">
                {[
                  { id: "affordable", title: "কম খরচের শহর (যেখানে থাকার ব্যয় ও বাড়ি ভাড়া সাশ্রয়ী)" },
                  { id: "metro", title: "বড় মেট্রোপলিটন শহর (লন্ডন, টরন্টো ইত্যাদি - পার্ট-টাইম কাজের সুযোগ বেশি)" },
                  { id: "research", title: "বিশ্বসেরা গবেষণা ক্যাম্পাস (র‍্যাংকিংই মূল প্রাধান্য)" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="cityPreference"
                      checked={cityPreference === item.id}
                      onChange={() => setCityPreference(item.id)}
                      className="accent-brand-600"
                    />
                    <span>{item.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit & Save Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-100 rounded-2xl">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            পরিবর্তন সংরক্ষণ করলে ড্যাশবোর্ডের পরবর্তী করণীয় ও এআই সুপারিশ স্বয়ংক্রিয়ভাবে আপডেট হবে।
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>লক্ষ্য ও পছন্দসমূহ সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
