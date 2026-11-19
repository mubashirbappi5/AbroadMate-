"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  Settings,
  Languages,
  Bell,
  ShieldCheck,
  KeyRound,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  Coins,
  Save,
  Laptop,
} from "lucide-react";

export default function SettingsPage() {
  const { locale, setLocale } = useI18n();

  // Notification toggles
  const [deadlineAlertsEmail, setDeadlineAlertsEmail] = useState(true);
  const [deadlineAlertsWeb, setDeadlineAlertsWeb] = useState(true);
  const [scholarshipAlerts, setScholarshipAlerts] = useState(true);
  const [visaRuleUpdates, setVisaRuleUpdates] = useState(true);
  const [weeklyRoadmapChecklist, setWeeklyRoadmapChecklist] = useState(false);

  // Localization
  const [currencyPref, setCurrencyPref] = useState("BDT");

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage("নোটিফিকেশন পছন্দসমূহ সফলভাবে সংরক্ষিত হয়েছে!");
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!");
      return;
    }
    setSavedMessage("আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const handleExportData = () => {
    const studentData = {
      name: "সাকিব আহমেদ",
      email: "sakib.student@gmail.com",
      phone: "+8801712345678",
      targetDegree: "Master's (Postgraduate)",
      targetIntake: "Fall 2026",
      targetCountries: ["United Kingdom", "Canada"],
      bachelorCgpa: 3.65,
      ieltsTarget: 7.0,
      annualBudgetBdt: 2800000,
      exportTimestamp: new Date().toISOString(),
      ethicalDeclaration: "Exported from AbroadMate AI - 100% Free & Open Student Education Portal.",
    };

    const blob = new Blob([JSON.stringify(studentData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abroadmate-student-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5 text-brand-700" />
          <span>কাস্টমাইজেশন ও অ্যাকাউন্ট সিকিউরিটি</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          স্টুডেন্ট সেটিংস ও নিরাপত্তা
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          আপনার পছন্দসই ভাষা, মুদ্রা, সময়োপযোগী নোটিফিকেশন ও পাসওয়ার্ড সেটিংস পরিচালনা করুন। 
          আপনার ডেটা সম্পূর্ণ এনক্রিপ্টেড ও সুরক্ষিত।
        </p>
      </div>

      {/* Global Success Notification */}
      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{savedMessage}</span>
        </div>
      )}

      {/* 1. Language & Localization */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Languages className="w-5 h-5 text-brand-700" />
          <div>
            <h2 className="text-base font-bold text-slate-900">১. ভাষা ও মুদ্রা পছন্দ (Localization)</h2>
            <p className="text-xs text-slate-500">পোর্টালের ডিসপ্লে ভাষা ও হিসাবের মুদ্রা নির্ধারণ করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">পোর্টালের ভাষা (Language):</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocale("bn")}
                className={`p-3 rounded-xl border text-center transition-all ${
                  locale === "bn"
                    ? "border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm font-bold block">বাংলা (Bengali)</span>
                <span className="text-[10px] text-brand-700 block mt-0.5">ডিফল্ট মাতৃভাষা</span>
              </button>

              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`p-3 rounded-xl border text-center transition-all ${
                  locale === "en"
                    ? "border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm font-bold block">English (US/UK)</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">International</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">ডিফল্ট মুদ্রা (Currency Display):</label>
            <select
              value={currencyPref}
              onChange={(e) => setCurrencyPref(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            >
              <option value="BDT">🇧🇩 BDT (৳) - বাংলাদেশি টাকা (প্রস্তাবিত)</option>
              <option value="GBP">🇬🇧 GBP (£) - ব্রিটিশ পাউন্ড</option>
              <option value="CAD">🇨🇦 CAD ($) - কানাডিয়ান ডলার</option>
              <option value="EUR">🇩🇪 EUR (€) - ইউরো</option>
              <option value="USD">🇺🇸 USD ($) - মার্কিন ডলার</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              টিউশন ফি ও জীবনযাত্রার খরচের হিসাব এই মুদ্রায় প্রদর্শিত হবে।
            </span>
          </div>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <form onSubmit={handleSaveNotifications} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-brand-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">২. নোটিফিকেশন ও এলার্ট পছন্দ</h2>
              <p className="text-xs text-slate-500">গুরুত্বপূর্ণ আপডেট ও ডেডলাইন রিমাইন্ডার নিয়ন্ত্রণ করুন</p>
            </div>
          </div>
          <span className="text-xs text-brand-800 font-semibold bg-brand-50 px-2.5 py-1 rounded-lg">
            ইমেইল: sakib.student@gmail.com
          </span>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">
                আসন্ন ডেডলাইন এলার্ট (ইমেইল)
              </span>
              <p className="text-[11px] text-slate-500">
                স্কলারশিপ ও বিশ্ববিদ্যালয় আবেদনের ৩০ দিন, ৭ দিন এবং ১ দিন আগে অটোমেটিক ইমেইল।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={deadlineAlertsEmail}
                onChange={() => setDeadlineAlertsEmail(!deadlineAlertsEmail)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">
                নতুন স্কলারশিপ ম্যাচিং এলার্ট
              </span>
              <p className="text-[11px] text-slate-500">
                আপনার সিজিপিএ ও মেজরের সাথে মানানসই নতুন কোনো সরকারি বা প্রাতিষ্ঠানিক ফান্ডিং চালু হলে জানানো হবে।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={scholarshipAlerts}
                onChange={() => setScholarshipAlerts(!scholarshipAlerts)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">
                অফিসিয়াল ভিসা ও ইমিগ্রেশন নীতি আপডেট
              </span>
              <p className="text-[11px] text-slate-500">
                ইউকে হোম অফিস, আইআরসিসি কানাডা বা জার্মান দূতাবাসের ব্যাংক সলভেন্সি নিয়ম পরিবর্তনের তাৎক্ষণিক নোটিশ।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={visaRuleUpdates}
                onChange={() => setVisaRuleUpdates(!visaRuleUpdates)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">
                সাপ্তাহিক স্টাডি রোডম্যাপ চেকইন
              </span>
              <p className="text-[11px] text-slate-500">
                সপ্তাহে একবার আপনার চলমান রোডম্যাপের বাকি থাকা টাস্কগুলোর রিভিউ সামারি পাঠানো হবে।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyRoadmapChecklist}
                onChange={() => setWeeklyRoadmapChecklist(!weeklyRoadmapChecklist)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
          >
            নোটিফিকেশন পছন্দ সংরক্ষণ করুন
          </button>
        </div>
      </form>

      {/* 3. Account Security & Password */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <div>
            <h2 className="text-base font-bold text-slate-900">৩. অ্যাকাউন্ট নিরাপত্তা ও লগইন</h2>
            <p className="text-xs text-slate-500">পাসওয়ার্ড পরিবর্তন ও টু-ফ্যাক্টর অথেনটিকেশন</p>
          </div>
        </div>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-slate-500" />
            <span>পাসওয়ার্ড পরিবর্তন করুন</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">বর্তমান পাসওয়ার্ড:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর):</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors"
          >
            পাসওয়ার্ড আপডেট করুন
          </button>
        </form>

        {/* Active Sessions */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-slate-500" />
            <span>সক্রিয় লগইন সেশন</span>
          </h3>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <span className="font-bold text-slate-900 block">বর্তমান ব্রাউজার (Chrome on Windows)</span>
                <span className="text-[11px] text-slate-500">আইপি: ঢাকা, বাংলাদেশ • সক্রিয় এখন</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Current Device
            </span>
          </div>
        </div>
      </div>

      {/* 4. Privacy, Ethical Manifesto & Data Export */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <div>
            <h2 className="text-base font-bold text-slate-900">৪. ডেটা সুরক্ষা ও শিক্ষার্থী অধিকার (Privacy & Rights)</h2>
            <p className="text-xs text-slate-500">আমাদের ১০০% বাণিজ্যিক এজেন্সি-মুক্ত অঙ্গীকার</p>
          </div>
        </div>

        {/* Ethical Anti-Agency Manifesto Card */}
        <div className="p-4 bg-brand-50/80 border border-brand-200 rounded-2xl space-y-2 text-xs text-brand-950 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-brand-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-brand-700" />
            <span>আমাদের কঠোর ডেটা প্রাইভেসি অঙ্গীকার</span>
          </div>
          <p>
            AbroadMate কোনো বাণিজ্যিক কনসালটেন্সি বা দালাল এজেন্সি নয়। আপনার নাম, শিক্ষাগত ট্রান্সক্রিপ্ট, সিজিপিএ বা যোগাযোগের কোনো তথ্য কোনো শিক্ষাপ্রতিষ্ঠান বা থার্ড-পার্টি এজেন্সির কাছে বিক্রি করা হয় না।
            আপনার সকল ডাটা শুধুমাত্র আপনার আবেদনের স্বয়ংক্রিয় পথনির্দেশ ও এআই বিশ্লেষণের জন্য ব্যবহৃত হয়।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="space-y-0.5 text-xs text-slate-600 text-center sm:text-left">
            <span className="font-bold text-slate-900 block">আপনার ব্যক্তিগত তথ্যের কপি ডাউনলোড</span>
            <span className="text-[11px] text-slate-500 block">
              আপনার ড্যাশবোর্ডের সব তথ্য, গোল ও শর্টলিস্ট একটি JSON ফাইলে এক্সপোর্ট করুন।
            </span>
          </div>

          <button
            onClick={handleExportData}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4 text-brand-700" />
            <span>প্রোফাইল ডেটা এক্সপোর্ট (.JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
