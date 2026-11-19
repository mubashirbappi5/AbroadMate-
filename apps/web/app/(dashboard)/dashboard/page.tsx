"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { formatBdt } from "@abroadmate/shared";
import {
  FileCheck2,
  Compass,
  GraduationCap,
  Calculator,
  Bot,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  Target,
  School,
  FolderLock,
  FileText,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Bell,
  Coins,
  Check,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { locale } = useI18n();

  // Interactive milestone checklist
  const [milestones, setMilestones] = useState([
    { id: "ielts", text: "আইইএলটিএস বা সমমানের পরীক্ষায় কাঙ্ক্ষিত স্কোর অর্জন (লক্ষ্য: ৭.০+)", completed: false },
    { id: "transcripts", text: "অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট ও সার্টিফিকেট সংগ্রহ ও সত্যায়ন", completed: true },
    { id: "lor", text: "প্রফেসর বা সুপারভাইজারের কাছ থেকে ২টি একাডেমিক রিকমেন্ডেশন লেটার (LOR)", completed: false },
    { id: "sop", text: "স্টেটমেন্ট অব পারপাস (SOP) বা মোটিভেশন লেটারের খসড়া তৈরি", completed: true },
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Message & Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-brand-950/10">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/30 text-brand-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              <span>এজেন্সি ও মধ্যস্বত্বভোগী ছাড়া সম্পূর্ণ স্বাবলম্বী প্রস্তুতি</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              স্বাগতম, সাকিব আহমেদ!
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 leading-relaxed font-normal">
              আপনার লক্ষ্য: <strong>যুক্তরাজ্য ও কানাডায় ফল ২০২৬ সেশনে মাস্টার্স (কম্পিউটার সায়েন্স ও ডেটা সায়েন্স)</strong>। 
              সঠিক সময়ে সঠিক পদক্ষেপ নিয়ে শতভাগ নির্ভেজালভাবে আপনার উচ্চশিক্ষার স্বপ্ন পূরণ করুন।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/dashboard/roadmap"
              className="bg-white hover:bg-brand-50 text-brand-900 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-brand-700" />
              <span>পরবর্তী করণীয় দেখুন</span>
              <ArrowRight className="w-4 h-4 text-brand-700" />
            </Link>
            <Link
              href="/dashboard/ai-assistant"
              className="bg-brand-800/80 hover:bg-brand-700 text-white border border-brand-600/40 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-brand-300" />
              <span>এআই সহায়কের পরামর্শ নিন</span>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-600/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid: 2. Profile Completion Meter & 3. Active Study Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Student Profile Completion Meter */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">একাডেমিক প্রোফাইল পূর্ণতা</h2>
                <p className="text-xs text-slate-500">নির্ভুল এআই ম্যাচিং ও স্কলারশিপ পাওয়ার জন্য প্রোফাইল ১০০% পূর্ণ করুন</p>
              </div>
            </div>
            <span className="text-xl font-black text-brand-700">৭৫%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: "75%" }} />
          </div>

          {/* Actionable Check items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="line-through text-slate-500">ব্যক্তিগত ও যোগাযোগ তথ্য</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="line-through text-slate-500">এইচএসসি ও ব্যাচেলর সিজিপিএ (৩.৬৫)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-brand-50/70 rounded-xl border border-brand-200 text-brand-950">
              <div className="flex items-center gap-2 truncate">
                <AlertCircle className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-semibold truncate">আইইএলটিএস অফিসিয়াল TRF আপলোড</span>
              </div>
              <span className="text-[11px] font-bold text-brand-700 shrink-0">+১৫%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-brand-50/70 rounded-xl border border-brand-200 text-brand-950">
              <div className="flex items-center gap-2 truncate">
                <AlertCircle className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-semibold truncate">২টি একাডেমিক LOR রেফারেন্স যোগ</span>
              </div>
              <span className="text-[11px] font-bold text-brand-700 shrink-0">+১০%</span>
            </div>
          </div>

          <div className="pt-2 text-right">
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
            >
              <span>প্রোফাইল সম্পাদন ও ভেরিফিকেশন করুন</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3. Active Study Goals Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-700" />
                <h2 className="text-base font-bold text-slate-900">আমার স্টাডি গোল</h2>
              </div>
              <Link
                href="/dashboard/goals"
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
              >
                এডিট করুন
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">লক্ষ্য ইনটেক:</span>
                <span className="font-bold text-slate-800">ফল ২০২৬ (সেপ্টেম্বর)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">টার্গেট দেশ:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span>🇬🇧 যুক্তরাজ্য</span>, <span>🇨🇦 কানাডা</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">ডিগ্রি ও বিষয়:</span>
                <span className="font-bold text-slate-800">MSc Data Science / AI</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">বার্ষিক টিউশন বাজেট:</span>
                <span className="font-bold text-brand-700">২৫ - ৩০ লাখ টাকা</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/goals"
            className="w-full text-center py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-xl font-bold text-xs transition-colors border border-brand-200"
          >
            টার্গেট দেশ ও ইনটেক পরিবর্তন করুন
          </Link>
        </div>
      </div>

      {/* Grid: 4. Current Roadmap Progress & 5. Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Current Roadmap Progress Milestone */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">বর্তমান স্টাডি রোডম্যাপ পর্যায়</span>
                <h3 className="text-base font-bold text-slate-900">পর্যায় ২: ভাষাগত পরীক্ষা ও ডকুমেন্টেশন</h3>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">ইনটেকের ৯-১১ মাস পূর্বে</span>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-600 block">এই পর্যায়ের মূল অ্যাকশন আইটেম:</span>
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                onClick={() => toggleMilestone(milestone.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                  milestone.completed
                    ? "bg-slate-50 border-slate-200 text-slate-500"
                    : "bg-white border-slate-300 text-slate-900 hover:border-brand-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                    milestone.completed
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-400 bg-white"
                  }`}
                >
                  {milestone.completed && <Check className="w-3 h-3" />}
                </div>
                <span className={milestone.completed ? "line-through" : "font-medium"}>
                  {milestone.text}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">৪টির মধ্যে ২টি সম্পন্ন</span>
            <Link
              href="/dashboard/roadmap"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 hover:underline"
            >
              <span>সম্পূর্ণ ৫টি পর্যায় দেখুন</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 5. Upcoming Deadlines Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">আসন্ন সময়সীমা</span>
                <h3 className="text-base font-bold text-slate-900">গুরুত্বপূর্ণ ডেডলাইন ও রিমাইন্ডার</h3>
              </div>
            </div>
            <Link
              href="/dashboard/deadlines"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            >
              সব দেখুন
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🇬🇧</span>
                  <span className="text-xs font-bold text-slate-900">শেভেনিং স্কলারশিপ ডেডলাইন (UK)</span>
                </div>
                <span className="text-[11px] text-slate-600 block">ফুল-ফান্ডেড মাস্টার্স আবেদন সমাপ্তি</span>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded-md block">
                  ১৮ দিন বাকি
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">৫ নভেম্বর ২০২৫</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🇬🇧</span>
                  <span className="text-xs font-bold text-slate-900">কমনওয়েলথ শেয়ার্ড স্কলারশিপ</span>
                </div>
                <span className="text-[11px] text-slate-600 block">উন্নয়নশীল দেশের শিক্ষার্থীদের জন্য ফুল স্কলারশিপ</span>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded-md block">
                  ৫২ দিন বাকি
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">১২ ডিসেম্বর ২০২৫</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🇨🇦</span>
                  <span className="text-xs font-bold text-slate-900">কানাডা ফল ২০২৬ আর্লি অ্যাডমিশন রাউন্ড</span>
                </div>
                <span className="text-[11px] text-slate-600 block">অন্টারিও ও আলবার্টা বিশ্ববিদ্যালয়ের অগ্রাধিকার রাউন্ড</span>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 bg-slate-700 text-white font-bold text-[10px] rounded-md block">
                  ৮৫ দিন বাকি
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">১৫ জানুয়ারি ২০২৬</span>
              </div>
            </div>
          </div>

          <div className="pt-1 text-center">
            <Link
              href="/dashboard/deadlines"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
            >
              <span>ব্যক্তিগত রিমাইন্ডার সেট করুন</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: 6. Scholarship Matches Preview & 7. Admission Eligibility Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6. Scholarship Matches Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">এআই স্কলারশিপ ম্যাচিং</span>
                <h3 className="text-base font-bold text-slate-900">আপনার সাথে মানানসই স্কলারশিপ</h3>
              </div>
            </div>
            <Link
              href="/dashboard/scholarships"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            >
              সব স্কলারশিপ
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇬🇧</span>
                  <span className="text-xs font-bold text-slate-900">Chevening Scholarships (UK)</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-extrabold text-[10px] rounded-full">
                  ৯৫% ম্যাচ
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                সম্পূর্ণ টিউশন ফি মওকুফ + মাসিক লিভিং ভাতা (£1,023/মাস) + বিমান ভাড়া। আপনার সিজিপিএ ৩.৬৫ সম্পূর্ণ উপযোগী।
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-emerald-200/50">
                <span>সরকারি তহবিল | ১ বছরের মাস্টার্স</span>
                <span className="font-semibold text-emerald-800">ডেডলাইন: ৫ নভেম্বর ২০২৫</span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇨🇦</span>
                  <span className="text-xs font-bold text-slate-900">Ontario Graduate Scholarship (OGS)</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-600 text-white font-extrabold text-[10px] rounded-full">
                  ৮৮% ম্যাচ
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                বাৎসরিক $১৫,০০০ ক্যাড স্কলারশিপ অ্যাওয়ার্ড। কানাডার টরন্টো, অটোয়া ও ম্যাকমাস্টার বিশ্ববিদ্যালয়ের জন্য প্রযোজ্য।
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-blue-200/50">
                <span>প্রাদেশিক সরকার | মাস্টার্স ও পিএইচডি</span>
                <span className="font-semibold text-blue-800">ডেডলাইন: জানুয়ারি ২০২৬</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/scholarships"
            className="w-full text-center py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs transition-colors border border-slate-200 block"
          >
            আরো ৪টি ম্যাচিং স্কলারশিপ এক্সপ্লোর করুন
          </Link>
        </div>

        {/* 7. Admission Eligibility Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">যোগ্যতা বিশ্লেষণ</span>
                <h3 className="text-base font-bold text-slate-900">অ্যাডমিশন সম্ভাবনা সামারি</h3>
              </div>
            </div>
            <Link
              href="/dashboard/eligibility"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            >
              ডিটেইলস
            </Link>
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs text-purple-950">
            আপনার সিজিপিএ (৩.৬৫/৪.০০) এবং আইইএলটিএস প্রস্তুতি অনুযায়ী ২৮টি স্বীকৃত বিশ্ববিদ্যালয়ে আবেদন সম্ভাবনা রয়েছে।
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-rose-800 block">Ambitious (স্বপ্নদর্শী)</span>
              <span className="text-xl font-black text-rose-700 block">৬টি</span>
              <span className="text-[10px] text-slate-500 block">যেমন: Edinburgh, UBC</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-amber-800 block">Target (কাঙ্ক্ষিত)</span>
              <span className="text-xl font-black text-amber-700 block">১২টি</span>
              <span className="text-[10px] text-slate-500 block">যেমন: Sheffield, Ottawa</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 block">Safe (নিরাপদ)</span>
              <span className="text-xl font-black text-emerald-700 block">১০টি</span>
              <span className="text-[10px] text-slate-500 block">যেমন: Coventry, Windsor</span>
            </div>
          </div>

          <div className="pt-1">
            <Link
              href="/dashboard/eligibility"
              className="w-full text-center py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl font-bold text-xs transition-colors border border-purple-200 block"
            >
              আপনার সম্পূর্ণ যোগ্যতা ক্যালকুলেশন রিপোর্ট দেখুন
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: 8. Estimated Study Budget Card in BDT & 9. Recent Notifications Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8. Estimated Study Budget Card in BDT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">আর্থিক পরিকল্পনা</span>
                <h3 className="text-base font-bold text-slate-900">আনুমানিক স্টাডি বাজেট (টাকায়)</h3>
              </div>
            </div>
            <Link
              href="/dashboard/calculator"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            >
              ক্যালকুলেটর
            </Link>
          </div>

          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-900 font-semibold block">যুক্তরাজ্যে ১ বছরের মাস্টার্স সর্বমোট আনুমানিক ব্যয়:</span>
              <span className="text-2xl font-black text-emerald-950 block mt-0.5">
                {formatBdt(3465000, "bn")}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
              ~ £22,500
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600">বার্ষিক গড় টিউশন ফি:</span>
              <span className="font-bold text-slate-900">{formatBdt(1850000, "bn")} (~ £12,000)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600">৯ মাসের লিভিং কস্ট (লন্ডনের বাইরে):</span>
              <span className="font-bold text-slate-900">{formatBdt(1450000, "bn")} (£9,207)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600">ভিসা ফি ও IHS স্বাস্থ্য সারচার্জ:</span>
              <span className="font-bold text-slate-900">{formatBdt(1650000 / 10, "bn")} (~ £1,070)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-950">
              <span className="font-semibold">UK 28-day rule ব্যাংক সলভেন্সি প্রমাণ:</span>
              <span className="font-bold">{formatBdt(2850000, "bn")} একাউন্টে প্রদর্শন প্রয়োজন</span>
            </div>
          </div>

          <Link
            href="/dashboard/calculator"
            className="w-full text-center py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs transition-colors border border-emerald-200 block"
          >
            কানাডা ও জার্মানির খরচ তুলনা ও ব্লকড একাউন্ট হিসাব করুন
          </Link>
        </div>

        {/* 9. Recent Notifications Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">রিসেন্ট অ্যাক্টিভিটি</span>
                <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক নোটিফিকেশন ফিড</h3>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-500">৪টি নতুন</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  যুক্তরাজ্য স্টুডেন্ট ভিসা পলিসি আপডেট
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  হোম অফিস ২০২৬ সেশনের ব্যাংক ফান্ড রিকোয়ারমেন্ট হালনাগাদ করেছে। বিস্তারিত গাইড পড়ে নিন।
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">২ ঘণ্টা পূর্বে</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  নতুন ফুল-ফান্ডেড স্কলারশিপ ম্যাচ করেছে
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  আপনার মাস্টার্স ইন সিএস প্রোফাইলের জন্য কানাডার OGS স্কলারশিপ পোর্টাল উন্মুক্ত হয়েছে।
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">৫ ঘণ্টা পূর্বে</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  ডকুমেন্ট ভল্ট: ট্রান্সক্রিপ্ট সুরক্ষিত
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  আপনার ব্যাচেলর গ্রেডশিট সফলভাবে এনক্রিপ্টেড ক্লাউড স্টোরেজে সংরক্ষিত হয়েছে।
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">১ দিন পূর্বে</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  এআই সহায়ক: SOP রিভিউ প্রস্তুত
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  আপনার স্টেটমেন্ট অব পারপাস খসড়ার জন্য ৩টি গঠনমূলক পরামর্শ রেডি রয়েছে।
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">২ দিন পূর্বে</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Continue Journey CTA */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-brand-50 via-white to-brand-100/60 rounded-3xl border-2 border-brand-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-700 text-white text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>পরবর্তী প্রধান পদক্ষেপ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            স্টেটমেন্ট অব পারপাস (SOP) তৈরি শুরু করুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            আন্তর্জাতিক অ্যাডমিশন কমিটির কাছে নিজের লক্ষ্য ও একাডেমিক আগ্রহ তুলে ধরার সেরা মাধ্যম হল একটি চমৎকার SOP। 
            আমাদের ডেডিকেটেড SOP বিল্ডার ও এআই সহায়কের সাহায্য নিয়ে আজই প্রথম ড্রাফট তৈরি করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/dashboard/sop-builder"
            className="px-5 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>SOP বিল্ডার ওপেন করুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/universities"
            className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <School className="w-4 h-4 text-brand-700" />
            <span>শর্টলিস্ট করা বিশ্ববিদ্যালয় দেখুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
