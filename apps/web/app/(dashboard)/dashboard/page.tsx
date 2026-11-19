"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
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
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-brand-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-700/60 text-brand-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সফল আবেদনকারী হতে প্রস্তুতি নিন</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            স্বাগতম, সাকিব আহমেদ!
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            আপনার লক্ষ্য: <strong>যুক্তরাজ্য ও কানাডায় ফল ২০২৬ সেশনে মাস্টার্স</strong>। কোনো মধ্যস্বত্বভোগী বা এজেন্সি ছাড়াই আপনার আবেদন প্রক্রিয়া সম্পন্ন করতে আমরা আপনার পাশে আছি।
          </p>
        </div>

        <Link
          href="/roadmap"
          className="shrink-0 bg-white hover:bg-brand-50 text-brand-900 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-brand-700" />
          <span>পরবর্তী করণীয় দেখুন</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Progress & Current Milestone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">বর্তমান পর্যায়</span>
            <Clock className="w-4 h-4 text-brand-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">ভাষাগত পরীক্ষা ও SOP</h3>
          <p className="text-xs text-slate-600 mt-1">
            ইনটেকের ৯-১১ মাস পূর্বে: আইইএলটিএস পরীক্ষা দিন এবং ২টি LOR সংগ্রহ করুন।
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">লক্ষ্য ইনটেক</span>
            <Compass className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">ফল ২০২৬ (সেপ্টেম্বর)</h3>
          <p className="text-xs text-slate-600 mt-1">
            আবেদন উইন্ডো উন্মুক্ত হবে: অক্টোবর ২০২৫ - জানুয়ারি ২০২৬।
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">ব্যাংক ফান্ড প্রস্তুত</span>
            <Calculator className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">UK 28-day rule</h3>
          <p className="text-xs text-slate-600 mt-1">
            ভিসা আবেদনের পূর্বে টানা ২৮ দিন একাউন্টে ২৮-৩৫ লাখ টাকা প্রস্তুত রাখতে হবে।
          </p>
        </div>
      </div>

      {/* Quick Launchpad Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          প্রয়োজনীয় টুলস ও গাইড
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/eligibility"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3 group-hover:bg-brand-700 group-hover:text-white transition-colors">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              যোগ্যতা যাচাই
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনার সিজিপিএ ও আইইএলটিএস অনুযায়ী কোন কোন বিশ্ববিদ্যালয় আবেদন নেবে।
            </p>
          </Link>

          <Link
            href="/scholarships"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              সরকারি স্কলারশিপ
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              শেভেনিং, ডিএএডি, ফুলব্রাইট ও অস্ট্রেলিয়া অ্যাওয়ার্ডস সংক্রান্ত তথ্য।
            </p>
          </Link>

          <Link
            href="/calculator"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              খরচের হিসাব (টাকায়)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              টিউশন ফি, লিভিং কস্ট ও ভিসা ফির পূর্ণাঙ্গ বাজেট গণনা করুন।
            </p>
          </Link>

          <Link
            href="/ai-assistant"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              ভেরিফাইড এআই সহায়ক
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ভিসা ও পড়াশোনা সংক্রান্ত যেকোনো প্রশ্ন নির্দ্বিধায় জিজ্ঞাসা করুন।
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
