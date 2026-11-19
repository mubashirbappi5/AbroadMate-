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
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  KeyRound,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"password" | "magic-link">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন");
      return;
    }
    setIsLoading(true);
    // Simulate auth verification and route to dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 700);
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email) {
      setErrorMessage("অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMagicLinkSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Left Side: Brand Story & Trust Info (5 cols) */}
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

            <div className="pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-800/80 text-brand-200 text-xs font-semibold border border-brand-700/60 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-300" />
                <span>১০০% নিরাপদ ও দালালমুক্ত</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-snug">
                আপনার স্টাডি অ্যাব্রড ড্যাশবোর্ডে প্রবেশ করুন
              </h2>
              <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                আপনার সেভ করা বিশ্ববিদ্যালয়, রোডম্যাপ ট্র্যাকার, এসওপি ড্রাফট এবং অ্যাপ্লিকেশন ডেডলাইন এক ক্লিকে পরিচালনা করুন।
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>আপনার কোনো তথ্য কোনো এজেন্সির সাথে শেয়ার করা হয় না</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>আজীবন ১০০% বিনামূল্যে এক্সেস গ্যারান্টি</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>২৫৬-বিট এনক্রিপ্টেড সুরক্ষিত ডেটাবেস</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-800 text-[11px] text-slate-400">
            নিরাপত্তা বিষয়ে কোনো প্রশ্ন?{" "}
            <Link href="/privacy" className="text-brand-300 underline hover:text-white">
              আমাদের প্রাইভেসি পলিসি পড়ুন
            </Link>
          </div>
        </div>

        {/* Right Side: Authentication Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center sm:text-left mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900">লগইন করুন</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                নতুন শিক্ষার্থী?{" "}
                <Link href="/register" className="font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  নতুন অ্যাকাউন্ট খুলুন (ফ্রি)
                </Link>
              </p>
            </div>

            {/* Google Social Login */}
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => router.push("/dashboard"), 500);
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>গুগল দিয়ে সরাসরি প্রবেশ করুন</span>
            </button>

            {/* Or Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                  অথবা ইমেইল ব্যবহার করুন
                </span>
              </div>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("password");
                  setMagicLinkSent(false);
                }}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  authMode === "password"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "hover:text-slate-900"
                }`}
              >
                পাসওয়ার্ড দিয়ে
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("magic-link");
                  setMagicLinkSent(false);
                }}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  authMode === "magic-link"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "hover:text-slate-900"
                }`}
              >
                ম্যাজিক লিংক (পাসওয়ার্ড ছাড়া)
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Mode 1: Password Login */}
            {authMode === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
                    <button
                      type="button"
                      onClick={() =>
                        alert("পাসওয়ার্ড রিসেটের লিংক আপনার ইমেইলে পাঠানোর ব্যবস্থা করা হচ্ছে।")
                      }
                      className="text-[11px] text-brand-700 hover:text-brand-800 font-semibold"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs text-slate-600">আমাকে মনে রাখুন</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl shadow-xs transition-colors text-sm disabled:opacity-50"
                >
                  <span>{isLoading ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Form Mode 2: Passwordless Magic Link */}
            {authMode === "magic-link" && (
              <div>
                {magicLinkSent ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2.5">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="text-sm font-bold text-emerald-950">ম্যাজিক লিংক পাঠানো হয়েছে!</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      আমরা <strong>{email}</strong> ঠিকানায় একটি ওয়ান-ক্লিক লগইন লিংক পাঠিয়েছি। আপনার ইনবক্স চেক করে লিংকে ক্লিক করলেই লগইন হয়ে যাবে।
                    </p>
                    <button
                      type="button"
                      onClick={() => setMagicLinkSent(false)}
                      className="mt-2 text-xs font-bold text-brand-700 underline"
                    >
                      অন্য কোনো ইমেইল ব্যবহার করুন
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                    <p className="text-xs text-slate-500">
                      পাসওয়ার্ড মনে রাখার প্রয়োজন নেই। আপনার ইমেইল প্রদান করলে আমরা একটি তাত্ক্ষণিক সিকিউর লগইন লিংক পাঠাব।
                    </p>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl shadow-xs transition-colors text-sm disabled:opacity-50"
                    >
                      <span>{isLoading ? "পাঠানো হচ্ছে..." : "লগইন লিংক পাঠান"}</span>
                      <KeyRound className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
