"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  Globe2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    targetIntake: "Fall 2025 (আগস্ট/সেপ্টেম্বর ২০২৫)",
    targetCountry: "UK",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage("অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("দুইটি পাসওয়ার্ড মিলছে না");
      return;
    }

    if (!formData.agreedToTerms) {
      setErrorMessage("অনুগ্রহ করে শর্তাবলী ও প্রাইভেসি পলিসিতে সম্মতি দিন");
      return;
    }

    setIsLoading(true);
    // Simulate signup and auto-login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
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
                  বাংলাদেশি শিক্ষার্থীদের বিশ্বস্ত সঙ্গী
                </span>
              </div>
            </Link>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-800/80 text-brand-200 text-xs font-semibold border border-brand-700/60 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                <span>১০০% সম্পূর্ণ ফ্রি আজীবন এক্সেস</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-snug">
                কোনো দালাল ছাড়াই উচ্চশিক্ষার যাত্রা শুরু করুন
              </h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                AbroadMate-এ অ্যাকাউন্ট খুললে আপনি যে অনন্য সুবিধাগুলো পাবেন:
              </p>
            </div>

            <div className="space-y-3.5 pt-2 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ১
                </div>
                <div>
                  <strong className="text-white block font-semibold">এআই ভর্তি যোগ্যতা ম্যাচিং</strong>
                  <span className="text-slate-300 text-[11px]">
                    আপনার এসএসসি, এইচএসসি ও ব্যাচেলর রেজাল্ট অনুযায়ী সঠিক বিশ্ববিদ্যালয় নির্বাচন
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ২
                </div>
                <div>
                  <strong className="text-white block font-semibold">ইউনিক এসওপি (SOP) বিল্ডার</strong>
                  <span className="text-slate-300 text-[11px]">
                    ভিসা অফিসার ও ভর্তি কমিটির মন জয় করার মতো প্লাগিয়ারিজম-মুক্ত স্টেটমেন্ট অব পারপাস
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ৩
                </div>
                <div>
                  <strong className="text-white block font-semibold">টাকায় মোট খরচের হিসাব</strong>
                  <span className="text-slate-300 text-[11px]">
                    টিউশন ফি, ভিসা ফি, স্বাস্থ্য বীমা ও মাসিক খরচের বাস্তবসম্মত বাজেট
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ৪
                </div>
                <div>
                  <strong className="text-white block font-semibold">ঢাকাস্থ দূতাবাস ও ভিসা গাইড</strong>
                  <span className="text-slate-300 text-[11px]">
                    অফিসিয়াল চেকলিস্ট ও ইন্টারভিউ প্রস্তুতির পূর্ণাঙ্গ গাইডলাইন
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2 text-brand-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>আপনার গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার</span>
            </div>
            <p className="text-[10px] text-slate-400">
              আমরা আপনার ফোন নম্বর বা ইমেইল কোনো কোচিং সেন্টার বা বাণিজ্যিক কনসালটেন্সির কাছে বিক্রি করি না।
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-lg w-full mx-auto">
            <div className="text-center sm:text-left mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900">ফ্রি স্টুডেন্ট একাউন্ট তৈরি করুন</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                ইতিমধ্যে একাউন্ট আছে?{" "}
                <Link href="/login" className="font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  লগইন করুন
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
                  পুরো নাম (পাসপোর্ট / সার্টিফিকেট অনুযায়ী) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="যেমন: মোঃ সাকিব আল হাসান"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ইমেইল ঠিকানা <span className="text-rose-500">*</span>
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
                    মোবাইল নম্বর <span className="text-rose-500">*</span>
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
                    টার্গেট ইনটেক
                  </label>
                  <select
                    value={formData.targetIntake}
                    onChange={(e) => setFormData({ ...formData, targetIntake: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  >
                    <option value="Fall 2025 (আগস্ট/সেপ্টেম্বর ২০২৫)">Fall 2025 (আগস্ট/সেপ্টেম্বর ২০২৫)</option>
                    <option value="Spring 2026 (জানুয়ারি/ফেব্রুয়ারি ২০২৬)">Spring 2026 (জানুয়ারি/ফেব্রুয়ারি ২০২৬)</option>
                    <option value="Fall 2026 (আগস্ট/সেপ্টেম্বর ২০২৬)">Fall 2026 (আগস্ট/সেপ্টেম্বর ২০২৬)</option>
                    <option value="Spring 2027">Spring 2027</option>
                    <option value="Undecided">পরবর্তীতে ঠিক করব</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পছন্দের দেশ
                  </label>
                  <select
                    value={formData.targetCountry}
                    onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  >
                    <option value="GB">🇬🇧 যুক্তরাজ্য (UK)</option>
                    <option value="CA">🇨🇦 কানাডা (Canada)</option>
                    <option value="AU">🇦🇺 অস্ট্রেলিয়া (Australia)</option>
                    <option value="DE">🇩🇪 জার্মানি (Germany)</option>
                    <option value="US">🇺🇸 যুক্তরাষ্ট্র (USA)</option>
                    <option value="ALL">এখনও সিদ্ধান্ত নিইনি</option>
                  </select>
                </div>
              </div>

              {/* Degree Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কোন ডিগ্রির জন্য আবেদন করবেন?
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {[
                    { id: "bachelor", label: "ব্যাচেলর (স্নাতক)" },
                    { id: "masters", label: "মাস্টার্স (স্নাতকোত্তর)" },
                    { id: "phd", label: "পিএইচডি (গবেষণা)" },
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
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পাসওয়ার্ড <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="কমপক্ষে ৮ অক্ষর"
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
                    পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="পুনরায় পাসওয়ার্ড দিন"
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
                    <span>পাসওয়ার্ড শক্তি</span>
                    <span>{strength < 2 ? "সহজ" : strength < 4 ? "মাঝারি" : "শক্তিশালী"}</span>
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
                    আমি AbroadMate-এর{" "}
                    <Link href="/terms" target="_blank" className="text-brand-700 underline font-semibold">
                      শর্তাবলী
                    </Link>{" "}
                    ও{" "}
                    <Link href="/privacy" target="_blank" className="text-brand-700 underline font-semibold">
                      প্রাইভেসি পলিসি
                    </Link>{" "}
                    মেনে নিচ্ছি এবং নিশ্চিত করছি যে আমি কোনো বাণিজ্যিক এজেন্সির কর্মী নই।
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-sm disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? "একাউন্ট তৈরি করা হচ্ছে..." : "বিনামূল্যে অ্যাকাউন্ট তৈরি করুন"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
