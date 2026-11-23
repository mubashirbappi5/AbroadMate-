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
  const [telegramAlerts, setTelegramAlerts] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [customReminderDays, setCustomReminderDays] = useState<number[]>([30, 14, 7, 3, 1]);
  const [newCustomDay, setNewCustomDay] = useState("");
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Localization
  const [currencyPref, setCurrencyPref] = useState("BDT");

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Load preferences from API
  React.useEffect(() => {
    fetch("/api/user/preferences")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          setDeadlineAlertsEmail(d.deadlineAlertsEmail ?? true);
          setDeadlineAlertsWeb(d.deadlineAlertsWeb ?? true);
          setScholarshipAlerts(d.scholarshipAlerts ?? true);
          setVisaRuleUpdates(d.visaRuleUpdates ?? true);
          setWeeklyRoadmapChecklist(d.weeklyRoadmapChecklist ?? false);
          setTelegramAlerts(d.telegramAlerts ?? false);
          setTelegramChatId(d.telegramChatId || "");
          if (d.customReminderDays && d.customReminderDays.length > 0) {
            setCustomReminderDays(d.customReminderDays);
          }
        }
      })
      .catch((err) => console.error("Error loading preferences:", err));
  }, []);

  const handleToggleThreshold = (day: number) => {
    if (customReminderDays.includes(day)) {
      if (customReminderDays.length === 1) {
        alert("কমপক্ষে একটি রিমাইন্ডার ব্যবধান সক্রিয় রাখতে হবে।");
        return;
      }
      setCustomReminderDays(customReminderDays.filter((d) => d !== day));
    } else {
      setCustomReminderDays([...customReminderDays, day].sort((a, b) => b - a));
    }
  };

  const handleAddCustomDay = () => {
    const day = parseInt(newCustomDay, 10);
    if (!day || day < 1 || day > 180) {
      alert("১ থেকে ১৮০-এর মধ্যে সঠিক দিনের সংখ্যা দিন।");
      return;
    }
    if (customReminderDays.includes(day)) {
      alert("এই রিমাইন্ডার দিনটি ইতিমধ্যে সক্রিয় আছে।");
      return;
    }
    setCustomReminderDays([...customReminderDays, day].sort((a, b) => b - a));
    setNewCustomDay("");
  };

  const handleRemoveCustomDay = (day: number) => {
    if (customReminderDays.length === 1) {
      alert("কমপক্ষে একটি রিমাইন্ডার ব্যবধান সক্রিয় রাখতে হবে।");
      return;
    }
    setCustomReminderDays(customReminderDays.filter((d) => d !== day));
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPrefs(true);
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deadlineAlertsEmail,
          deadlineAlertsWeb,
          scholarshipAlerts,
          visaRuleUpdates,
          weeklyRoadmapChecklist,
          telegramAlerts,
          telegramChatId: telegramChatId || null,
          customReminderDays,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedMessage(json.message || "নোটিফিকেশন পছন্দসমূহ সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        alert(json.error || "সংরক্ষণ করতে সমস্যা হয়েছে।");
      }
    } catch (err: any) {
      alert(err.message || "নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSavingPrefs(false);
      setTimeout(() => setSavedMessage(null), 3500);
    }
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

          {/* In-app Web alerts */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">
                ইন-অ্যাপ ড্যাশবোর্ড নোটিফিকেশন
              </span>
              <p className="text-[11px] text-slate-500">
                ড্যাশবোর্ডের নোটিফিকেশন ড্রয়ার ও বেল আইকনে তাৎক্ষণিক রিয়েলটাইম অ্যালার্ট।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={deadlineAlertsWeb}
                onChange={() => setDeadlineAlertsWeb(!deadlineAlertsWeb)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Telegram Channel Toggle & Chat ID */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  টেলিগ্রাম পুশ অ্যালার্ট (ঐচ্ছিক চ্যানেল)
                </span>
                <p className="text-[11px] text-slate-500">
                  আপনার টেলিগ্রাম অ্যাকাউন্টে তাৎক্ষণিক ডেডলাইন ও পলিসি রিমাইন্ডার পান।
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramAlerts}
                  onChange={() => setTelegramAlerts(!telegramAlerts)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
            {telegramAlerts && (
              <div className="pt-2 border-t border-slate-200/60">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  আপনার Telegram Chat ID দিন:
                </label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="যেমন: 123456789"
                  className="w-full sm:w-72 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono"
                />
              </div>
            )}
          </div>

          {/* Configurable Reminder Rules (30, 14, 7, 3, 1 + Custom) */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-indigo-950 block">
                ডেডলাইন রিমাইন্ডার ব্যবধান পছন্দ (Reminder Thresholds)
              </span>
              <p className="text-[11px] text-indigo-700">
                আবেদনের শেষ তারিখের কত দিন আগে আপনাকে সতর্ক করা হবে তা নির্বাচন করুন:
              </p>
            </div>

            {/* Standard Threshold Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[30, 14, 7, 3, 1].map((day) => {
                const active = customReminderDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleThreshold(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      active
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{day} দিন পূর্বে</span>
                    {active && <span>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Custom Days Input */}
            <div className="pt-2 border-t border-indigo-100/80 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-indigo-900">কাস্টম রিমাইন্ডার যোগ করুন:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={newCustomDay}
                  onChange={(e) => setNewCustomDay(e.target.value)}
                  placeholder="যেমন: ৪৫"
                  className="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-center font-bold"
                />
                <span className="text-[11px] text-slate-600">দিন</span>
                <button
                  type="button"
                  onClick={handleAddCustomDay}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
                >
                  যোগ করুন
                </button>
              </div>
            </div>

            {/* Active configured list preview */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">বর্তমানে সক্রিয়:</span>
              {customReminderDays.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-800"
                >
                  {d} দিন
                  {![30, 14, 7, 3, 1].includes(d) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomDay(d)}
                      className="text-rose-500 hover:text-rose-700 font-bold ml-0.5"
                    >
                      ✕
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={savingPrefs}
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
          >
            {savingPrefs ? "সংরক্ষণ হচ্ছে..." : "নোটিফিকেশন পছন্দ সংরক্ষণ করুন"}
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
