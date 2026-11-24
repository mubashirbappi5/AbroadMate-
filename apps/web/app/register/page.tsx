"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const isBn = locale === "bn";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    targetIntake: "Fall 2026",
    targetCountry: "GB",
    degreeLevel: "masters",
    password: "",
    confirmPassword: "",
    agreedToTerms: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage(
        isBn ? "অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন" : "Please fill in all required fields"
      );
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage(
        isBn ? "পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে" : "Password must be at least 8 characters"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(
        isBn ? "দুইটি পাসওয়ার্ড মিলছে না" : "The two passwords do not match"
      );
      return;
    }

    if (!formData.agreedToTerms) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে শর্তাবলী ও প্রাইভেসি পলিসিতে সম্মতি দিন"
          : "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || undefined,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          targetIntakeSeason: "FALL",
          targetIntakeYear: 2026,
          ethicalNonAgencyConsent: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error ||
            (isBn
              ? "রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি। আবার চেষ্টা করুন।"
              : "Could not complete registration. Please try again.")
        );
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setErrorMessage(
        isBn
          ? "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Could not connect to the server. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Left Side: Benefits & Trust Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 via-brand-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">AbroadMate</span>
                <span className="text-[10px] text-brand-300 block font-medium">
                  {isBn ? "বাংলাদেশি শিক্ষার্থীদের বিশ্বস্ত সঙ্গী" : "Trusted Guide for Bangladeshi Students"}
                </span>
              </div>
            </Link>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-800/80 text-brand-200 text-xs font-semibold border border-brand-700/60 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                <span>{isBn ? "১০০% সম্পূর্ণ ফ্রি আজীবন এক্সেস" : "100% Free Lifetime Access"}</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-snug">
                {isBn ? "কোনো দালাল ছাড়াই উচ্চশিক্ষার যাত্রা শুরু করুন" : "Start Your Study Abroad Journey Directly"}
              </h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {isBn
                  ? "AbroadMate-এ অ্যাকাউন্ট খুললে আপনি যে অনন্য সুবিধাগুলো পাবেন:"
                  : "Key benefits you unlock with your free AbroadMate account:"}
              </p>
            </div>

            <div className="space-y-3.5 pt-2 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  1
                </div>
                <div>
                  <strong className="text-white block font-semibold">
                    {isBn ? "এআই ভর্তি যোগ্যতা ম্যাচিং" : "AI Admission Eligibility Matching"}
                  </strong>
                  <span className="text-slate-300 text-[11px]">
                    {isBn
                      ? "আপনার এসএসসি, এইচএসসি ও ব্যাচেলর রেজাল্ট অনুযায়ী সঠিক বিশ্ববিদ্যালয় নির্বাচন"
                      : "Matched against verified minimum academic and IELTS score cutoffs"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  2
                </div>
                <div>
                  <strong className="text-white block font-semibold">
                    {isBn ? "ইউনিক এসওপি (SOP) বিল্ডার" : "SOP & Motivation Letter Builder"}
                  </strong>
                  <span className="text-slate-300 text-[11px]">
                    {isBn
                      ? "ভিসা অফিসার ও ভর্তি কমিটির জন্য প্লাগিয়ারিজম-মুক্ত ড্রাফট প্রস্তুত করুন"
                      : "Generate authentic, structured, plagiarism-free academic statements"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  3
                </div>
                <div>
                  <strong className="text-white block font-semibold">
                    {isBn ? "টাকায় মোট খরচের হিসাব" : "Realistic Expense Calculation (BDT)"}
                  </strong>
                  <span className="text-slate-300 text-[11px]">
                    {isBn
                      ? "টিউশন ফি, ভিসা ফি, স্বাস্থ্য বীমা ও মাসিক খরচের বাস্তবসম্মত বাজেট"
                      : "Tuition, blocked account, visa fees, and realistic living cost estimates"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  4
                </div>
                <div>
                  <strong className="text-white block font-semibold">
                    {isBn ? "ঢাকাস্থ দূতাবাস ও ভিসা গাইড" : "Dhaka Embassies & Visa Guidelines"}
                  </strong>
                  <span className="text-slate-300 text-[11px]">
                    {isBn
                      ? "অফিসিয়াল চেকলিস্ট ও সঠিক ব্যাংক সলভেন্সি পদ্ধতির গাইডলাইন"
                      : "Official document checklists, VFS centers, and bank solvency rules"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2 text-brand-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? "আপনার গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার" : "Your Privacy is Fully Protected"}</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {isBn
                ? "আমরা আপনার ফোন নম্বর বা ইমেইল কোনো কোচিং সেন্টার বা বাণিজ্যিক কনসালটেন্সির কাছে বিক্রি করি না।"
                : "We never sell or share your contact info with coaching centres or commercial consultancies."}
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-lg w-full mx-auto">
            <div className="text-center sm:text-left mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {isBn ? "ফ্রি স্টুডেন্ট একাউন্ট তৈরি করুন" : "Create Free Student Account"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {isBn ? "ইতিমধ্যে একাউন্ট আছে? " : "Already have an account? "}
                <Link href="/login" className="font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  {isBn ? "লগইন করুন" : "Log In"}
                </Link>
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? "পুরো নাম (পাসপোর্ট / সার্টিফিকেট অনুযায়ী)" : "Full Legal Name (as per Passport)"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={isBn ? "যেমন: মোঃ সাকিব আল হাসান" : "e.g. John Doe"}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? "ইমেইল ঠিকানা" : "Email Address"} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? "মোবাইল নম্বর" : "Phone Number"} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 pointer-events-none">
                      <span>🇧🇩</span>
                      <span>+880</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="1700-000000"
                      className="w-full pl-19 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Target Country & Target Intake */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? "টার্গেট ইনটেক" : "Target Intake"}
                  </label>
                  <select
                    value={formData.targetIntake}
                    onChange={(e) => setFormData({ ...formData, targetIntake: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  >
                    <option value="Fall 2026">
                      {isBn ? "Fall 2026 (আগস্ট/সেপ্টেম্বর ২০২৬)" : "Fall 2026 (August/September 2026)"}
                    </option>
                    <option value="Spring 2027">
                      {isBn ? "Spring 2027 (জানুয়ারি/ফেব্রুয়ারি ২০২৭)" : "Spring 2027 (January/February 2027)"}
                    </option>
                    <option value="Fall 2027">Fall 2027</option>
                    <option value="Undecided">{isBn ? "পরবর্তীতে ঠিক করব" : "Undecided"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? "পছন্দের দেশ" : "Target Country"}
                  </label>
                  <select
                    value={formData.targetCountry}
                    onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  >
                    <option value="GB">🇬🇧 {isBn ? "যুক্তরাজ্য (UK)" : "United Kingdom"}</option>
                    <option value="CA">🇨🇦 {isBn ? "কানাডা (Canada)" : "Canada"}</option>
                    <option value="AU">🇦🇺 {isBn ? "অস্ট্রেলিয়া (Australia)" : "Australia"}</option>
                    <option value="DE">🇩🇪 {isBn ? "জার্মানি (Germany)" : "Germany"}</option>
                    <option value="US">🇺🇸 {isBn ? "যুক্তরাষ্ট্র (USA)" : "United States"}</option>
                    <option value="ALL">{isBn ? "এখনও সিদ্ধান্ত নিইনি" : "Not sure yet"}</option>
                  </select>
                </div>
              </div>

              {/* Degree Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? "কোন ডিগ্রির জন্য আবেদন করবেন?" : "Degree Level"}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {[
                    { id: "bachelor", labelBn: "ব্যাচেলর (স্নাতক)", labelEn: "Bachelor's" },
                    { id: "masters", labelBn: "মাস্টার্স (স্নাতকোত্তর)", labelEn: "Master's" },
                    { id: "phd", labelBn: "পিএইচডি (গবেষণা)", labelEn: "Ph.D. / Research" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, degreeLevel: lvl.id })}
                      className={`py-2 px-2 text-center rounded-xl border transition-all ${
                        formData.degreeLevel === lvl.id
                          ? "bg-brand-50 border-brand-600 text-brand-900 font-bold"
                          : "border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {isBn ? lvl.labelBn : lvl.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? "পাসওয়ার্ড" : "Password"} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={isBn ? "কমপক্ষে ৮ অক্ষর" : "Minimum 8 characters"}
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder={isBn ? "পুনরায় পাসওয়ার্ড দিন" : "Re-enter password"}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength meter */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1.5 h-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 rounded-full ${
                          strength >= step
                            ? strength <= 2
                              ? "bg-amber-400"
                              : "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>{isBn ? "পাসওয়ার্ড শক্তি" : "Password strength"}</span>
                    <span>
                      {strength < 2
                        ? isBn
                          ? "সহজ"
                          : "Weak"
                        : strength < 4
                        ? isBn
                          ? "মাঝারি"
                          : "Moderate"
                        : isBn
                        ? "শক্তিশালী"
                        : "Strong"}
                    </span>
                  </div>
                </div>
              )}

              {/* Terms checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? (
                      <>
                        আমি AbroadMate-এর{" "}
                        <Link href="/terms" target="_blank" className="text-brand-700 underline font-semibold">
                          শর্তাবলী
                        </Link>{" "}
                        ও{" "}
                        <Link href="/privacy" target="_blank" className="text-brand-700 underline font-semibold">
                          প্রাইভেসি পলিসি
                        </Link>{" "}
                        মেনে নিচ্ছি এবং নিশ্চিত করছি যে আমি কোনো বাণিজ্যিক এজেন্সির কর্মী নই।
                      </>
                    ) : (
                      <>
                        I accept AbroadMate&apos;s{" "}
                        <Link href="/terms" target="_blank" className="text-brand-700 underline font-semibold">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" target="_blank" className="text-brand-700 underline font-semibold">
                          Privacy Policy
                        </Link>
                        , and confirm that I am applying independently.
                      </>
                    )}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-sm disabled:opacity-50 mt-2"
              >
                <span>
                  {isLoading
                    ? isBn
                      ? "একাউন্ট তৈরি করা হচ্ছে..."
                      : "Creating account..."
                    : isBn
                    ? "বিনামূল্যে অ্যাকাউন্ট তৈরি করুন"
                    : "Create Free Account"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
