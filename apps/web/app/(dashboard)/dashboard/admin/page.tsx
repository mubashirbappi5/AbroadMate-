"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Target,
  Globe2,
  Building2,
  GraduationCap,
  Award,
  BookOpenCheck,
  AlertTriangle,
  Clock,
  Radio,
  GitPullRequest,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";

interface MetricsData {
  totalStudents: number;
  activeGoals: number;
  countries: number;
  universities: number;
  programs: number;
  scholarships: number;
  visaRules: number;
  unverifiedRecords: number;
  pendingReviews: number;
  expiredSources: number;
  detectedPolicyChanges: number;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricsData>({
    totalStudents: 148,
    activeGoals: 132,
    countries: 5,
    universities: 18,
    programs: 42,
    scholarships: 15,
    visaRules: 12,
    unverifiedRecords: 3,
    pendingReviews: 2,
    expiredSources: 1,
    detectedPolicyChanges: 2,
  });
  const [alerts, setAlerts] = useState<any>({
    pendingPolicyList: [],
    expiredSourcesList: [],
  });

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success && json.data) {
        setMetrics(json.data.metrics);
        setAlerts(json.data.alerts);
      }
    } catch (err) {
      console.error("Failed to load admin metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Action / Refresh Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            রিসার্চ ও ডেটা নির্ভুলতা ওভারভিউ
          </h2>
          <p className="text-xs text-slate-500">
            AbroadMate-এর সমস্ত লাইভ এডুকেশন ও ইমিগ্রেশন তথ্যের স্টেটাস ও ভেরিফিকেশন হেলথ।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            রিফ্রেশ মেট্রিক্স
          </button>
          <Link
            href="/dashboard/admin/policy-changes"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition shadow-sm"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            নতুন পলিসি রিভিউ ({metrics.pendingReviews})
          </Link>
        </div>
      </div>

      {/* Critical Alert Banners (if any pending/expired) */}
      {(metrics.pendingReviews > 0 || metrics.expiredSources > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.pendingReviews > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-amber-900">
                  {metrics.pendingReviews}টি পলিসি পরিবর্তন অনুমোদনের অপেক্ষায়
                </h4>
                <p className="text-xs text-amber-700">
                  নতুন ইমিগ্রেশন গেজেট বা নিয়মের পরিবর্তন সনাক্ত হয়েছে। শিক্ষার্থীদের বিভ্রান্তি এড়াতে মানবিক ভেরিফিকেশন সম্পন্ন করুন।
                </p>
                <Link
                  href="/dashboard/admin/policy-changes"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline pt-1"
                >
                  এভিডেন্স কম্প্যারিজন ও রিভিউ করুন
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {metrics.expiredSources > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-rose-900">
                  {metrics.expiredSources}টি অফিসিয়াল তথ্যসূত্রের রিভিউ মেয়াদোত্তীর্ণ
                </h4>
                <p className="text-xs text-rose-700">
                  নির্ধারিত ৯০ দিনের রিভিউ সময়সীমা পার হয়েছে। অফিসিয়াল পোর্টালগুলোর সাথে ক্রস-চেক করে আপডেট নিশ্চিত করুন।
                </p>
                <Link
                  href="/dashboard/admin/sources?expiredOnly=true"
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-900 hover:underline pt-1"
                >
                  মেয়াদোত্তীর্ণ সোর্সগুলো রিনিউ করুন
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 11 KPI Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
          ১. প্ল্যাটফর্ম স্কেল ও এনরোলমেন্ট মেট্রিক্স
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">মোট শিক্ষার্থী</p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.totalStudents}
              </h4>
              <p className="text-[11px] text-blue-600 font-semibold">নিবন্ধিত শিক্ষার্থী</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">সক্রিয় স্টাডি গোল</p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.activeGoals}
              </h4>
              <p className="text-[11px] text-indigo-600 font-semibold">ইনটেক লক্ষ্যমাত্রা</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">গন্তব্য দেশসমূহ</p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.countries}
              </h4>
              <p className="text-[11px] text-emerald-600 font-semibold">UK, CA, AU, DE, US</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">তালিকাভুক্ত বিশ্ববিদ্যালয়</p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.universities}
              </h4>
              <p className="text-[11px] text-purple-600 font-semibold">ভেরিফাইড প্রতিষ্ঠান</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">ডিগ্রি প্রোগ্রাম ও কোর্স</p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.programs}
              </h4>
              <p className="text-[11px] text-cyan-600 font-semibold">টিউশন ফিসহ সংরক্ষিত</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">স্কলারশিপ অপশন</p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.scholarships}
              </h4>
              <p className="text-[11px] text-amber-600 font-semibold">সরকারি ও প্রাতিষ্ঠানিক</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">ভিসা নিয়ম ও রুলস</p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.visaRules}
              </h4>
              <p className="text-[11px] text-teal-600 font-semibold">আইনগতভাবে প্রযোজ্য</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integrity & Verification Metrics */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
          ২. ভেরিফিকেশন, ইন্টিগ্রিটি ও অ্যাকশন মেট্রিক্স
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">অযাচাইকৃত রেকর্ড</p>
              <h4 className="text-2xl font-black text-orange-600">
                {metrics.unverifiedRecords}
              </h4>
              <p className="text-[11px] text-slate-500">রিভিউ প্রয়োজন</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">পেন্ডিং রিভিউ</p>
              <h4 className="text-2xl font-black text-purple-600">
                {metrics.pendingReviews}
              </h4>
              <p className="text-[11px] text-slate-500">অনুমোদনের অপেক্ষায়</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">মেয়াদোত্তীর্ণ সোর্স</p>
              <h4 className="text-2xl font-black text-rose-600">
                {metrics.expiredSources}
              </h4>
              <p className="text-[11px] text-slate-500">ক্রস-চেক বাকি</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">পলিসি পরিবর্তন</p>
              <h4 className="text-2xl font-black text-indigo-600">
                {metrics.detectedPolicyChanges}
              </h4>
              <p className="text-[11px] text-slate-500">সনাক্তকৃত আপডেট</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          প্রশাসনিক কুইক অ্যাকশন হাব
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/policy-changes"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition group flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">
                পলিসি চেঞ্জ ওয়ার্কফ্লো (৯ ধাপ)
              </h4>
              <p className="text-xs text-slate-500">
                হোম অফিস ও আইআরসিসির নতুন সার্কুলারের সাইড-বাই-সাইড এভিডেন্স যাচাই এবং পরিবর্তন অনুমোদন করুন।
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600">
              ওয়ার্কফ্লো বোর্ডে যান <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/sources"
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition group flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition">
                অফিসিয়াল সোর্স মনিটরিং
              </h4>
              <p className="text-xs text-slate-500">
                UKVI, IRCC, DAAD সহ সমস্ত দূতাবাস ও মন্ত্রণালয়ের সোর্স ইউআরএল এবং ৯-দিনের রিভিউ সাইকেল পর্যবেক্ষণ করুন।
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              সোর্স তালিকা দেখুন <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/audit-logs"
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition group flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition">
                ইমিউটেবল অডিট ও সিকিউরিটি লগ
              </h4>
              <p className="text-xs text-slate-500">
                কোন অ্যাডমিন কোন ভিসা তথ্য কখন পরিবর্তন করেছেন তার পূর্ণ হিস্টোরিক্যাল স্ন্যাপশট ও প্রমাণপত্র দেখুন।
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-700">
              অডিট লগ পড়ুন <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
