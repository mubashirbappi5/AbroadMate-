"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Globe2,
  FileCheck2,
  Building,
  Target,
  Eye,
  Flag,
  Award,
} from "lucide-react";

export default function AboutPage() {
  const manifestoPillars = [
    {
      title: "১০০% সম্পূর্ণ ফ্রি—চিরকাল",
      description:
        "AbroadMate একটি অলাভজনক আদর্শে গড়ে ওঠা প্ল্যাটফর্ম। আমরা শিক্ষার্থীদের কাছ থেকে ফাইল ওপেনিং, কনসালটেন্সি বা এসওপি তৈরির নামে এক পয়সাও নিই না এবং কখনোই নেব না।",
      icon: Heart,
      badge: "কোনো গোপন চার্জ নেই",
    },
    {
      title: "শূন্য কমিশন (Zero Agency Commission)",
      description:
        "প্রচলিত এজেন্সিগুলো সেসব প্রাইভেট কলেজে শিক্ষার্থী পাঠায় যেখানে তারা সর্বোচ্চ ২০-৩০% কমিশন পায়। আমরা কোনো বিশ্ববিদ্যালয় থেকে কমিশন গ্রহণ করি না; আমাদের সুপারিশ ১০০% মেধা ও শিক্ষার্থীর স্বার্থের ভিত্তিতে।",
      icon: ShieldCheck,
      badge: "নিরপেক্ষ ও বস্তুনিষ্ঠ",
    },
    {
      title: "আবেদনের পূর্ণ মালিকানা শিক্ষার্থীর",
      description:
        "বিশ্ববিদ্যালয়ের পোর্টালের ইউজার আইডি, পাসওয়ার্ড ও ইমেইল যোগাযোগ পুরোটাই থাকে শিক্ষার্থীর নিজস্ব নিয়ন্ত্রণে। কোনো তথ্য গোপন বা জিম্মি করা হয় না।",
      icon: Users,
      badge: "পূর্ণ স্বাধীনতা ও স্বাবলম্বিতা",
    },
    {
      title: "অফিসিয়াল সোর্সের সত্যনিষ্ঠ তথ্য",
      description:
        "আমরা কোনো ভুয়া '১০০% ভিসা গ্যারান্টি' দিই না। যুক্তরাজ্যের UKVI, কানাডার IRCC, অস্ট্রেলিয়ার Home Affairs এবং জার্মানির অফিশিয়াল দূতাবাস নির্দেশিত সত্য নিয়মাবলীই আমরা তুলে ধরি।",
      icon: FileCheck2,
      badge: "সরকারি উৎস থেকে যাচাইকৃত",
    },
  ];

  const milestones = [
    { number: "১০,০০০+", label: "শিক্ষার্থীর স্বাবলম্বী গাইডলাইন প্রাপ্তি" },
    { number: "০ টাকা", label: "শিক্ষার্থীদের কাছ থেকে গৃহীত সার্ভিস ফি" },
    { number: "১০০%", label: "অফিসিয়াল ও সরকারি সোর্স নির্ভর তথ্য" },
    { number: "৫টি দেশ", label: "ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও ইউএসএ" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold mb-6">
            <Flag className="w-4 h-4 text-brand-700" />
            <span>আমাদের অঙ্গীকার ও লক্ষ্য</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            বাংলাদেশের মেধাবী শিক্ষার্থীদের জন্য <br className="hidden sm:inline" />
            <span className="text-brand-700">উচ্চশিক্ষাকে উন্মুক্ত ও দালালমুক্ত করা</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            বিদেশের শীর্ষ বিশ্ববিদ্যালয়ে পড়ার স্বপ্ন কোনো এজেন্সির ব্যবসায়িক পণ্যে পরিণত হতে পারে না। সঠিক তথ্য, প্রযুক্তি এবং আত্মবিশ্বাস দিয়ে আমরা প্রতিটি বাংলাদেশি শিক্ষার্থীকে স্বাবলম্বী করে তুলতে প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>
      </section>

      {/* Origin Story / The Anti-Agency Problem */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-md">
                কেন জন্ম হলো AbroadMate-এর?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                ঢাকায় কনসালটেন্সি এজেন্সির বাণিজ্য ও শিক্ষার্থীদের অসহায়ত্ব
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                প্রতি বছর বাংলাদেশ থেকে হাজার হাজার শিক্ষার্থী উচ্চশিক্ষার উদ্দেশ্যে বিদেশে যাওয়ার চেষ্টা করেন। কিন্তু পান্থপথ, ধানমন্ডি বা গুলশানের বাণিজ্যিক এজেন্সিগুলো শিক্ষার্থীদের দুর্বল ইংরেজি কিংবা তথ্যের ঘাটতির সুযোগ নিয়ে ৫০ হাজার থেকে আড়াই লক্ষ টাকা পর্যন্ত ফাইল চার্জ আদায় করে।
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                আরও ভয়ানক বিষয় হলো—বেশি কমিশনের লোভে অনেক শিক্ষার্থীকে নিম্নমানের বেসরকারি প্রতিষ্ঠানে ভর্তি করানো হয়, তাদের আবেদন পোর্টালের পাসওয়ার্ড গোপন রাখা হয় এবং এসওপি কপি-পেস্ট করে জমা দেওয়ার কারণে ভিসা রিজেকশন ঘটে।
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-800">
                AbroadMate তৈরি হয়েছে এই অনৈতিক চর্চাকে চিরতরে রুখে দিতে। আমরা বিশ্বাস করি—ইন্টারনেট ও প্রযুক্তির যুগে নিজের যোগ্যতা ও মেধার জোর থাকলে কোনো শিক্ষার্থীর মধ্যস্বত্বভোগীর দ্বারস্থ হওয়ার প্রয়োজন নেই।
              </p>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 to-slate-900 text-white p-7 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>আমাদের ভিশন</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                বাংলাদেশের প্রতিটি কোণ থেকে বিশ্বমানের ক্যাম্পাসে
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ঢাকা কিংবা চট্টগ্রাম নয়, রাজশাহী, রংপুর, সিলেট বা বরগুনার একজন প্রত্যন্ত অঞ্চলের শিক্ষার্থীও যেন ঘরে বসেই অক্সফোর্ড, টরোন্টো বা মিউনিখের আবেদন প্রক্রিয়া নিজেই নির্ভুলভাবে সম্পন্ন করতে পারেন।
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs text-brand-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>মেধার কোনো সীমানা নেই, তথ্যের কোনো মূল্য নেই</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto 4 Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-md">
            নৈতিক নীতিমালা
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-950">
            আমাদের এন্টি-এজেন্সি ইথিক্যাল ম্যানিফেস্টো
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            যে ৪টি মূলনীতির উপর ভিত্তি করে আমাদের পুরো প্ল্যাটফর্ম ও সেবা পরিচালিত হয়
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {manifestoPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-brand-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-brand-900 text-white rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-brand-800/80">
            {milestones.map((m, idx) => (
              <div key={idx} className="pt-4 lg:pt-0 lg:px-4">
                <div className="text-3xl sm:text-4xl font-black text-brand-300 tracking-tight">
                  {m.number}
                </div>
                <div className="mt-2 text-xs sm:text-sm font-medium text-brand-100">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who built this */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 bg-brand-100 text-brand-700 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            বিদেশ ফেরত শিক্ষার্থী ও প্রযুক্তিবিদদের সম্মিলিত উদ্যোগ
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AbroadMate কোনো বাণিজ্যিক করপোরেট প্রতিষ্ঠান নয়। এটি যুক্তরাজ্য, জার্মানি, কানাডা ও অস্ট্রেলিয়ার বিভিন্ন বিশ্ববিদ্যালয়ে সরাসরি আবেদন করে পড়তে যাওয়া বাংলাদেশি শিক্ষার্থী, গবেষক ও সফটওয়্যার ইঞ্জিনিয়ারদের একটি স্বেচ্ছাসেবী উদ্যোগ।
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xs transition-colors"
            >
              <span>কিভাবে কাজ করে জেনে নিন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold text-sm transition-colors border border-slate-300"
            >
              <span>যোগাযোগ করুন</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
