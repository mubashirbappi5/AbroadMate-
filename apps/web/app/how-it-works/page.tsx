"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Search,
  FileText,
  PlaneTakeoff,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Award,
  Globe2,
  Building,
  GraduationCap,
  Clock,
  DollarSign,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      number: "০১",
      title: "প্রোফাইল তৈরি ও প্রস্তুতি",
      subtitle: "Profile & Academic Readiness",
      shortDesc: "আপনার পূর্ববর্তী রেজাল্ট ও টার্গেটের ভিত্তিতে বাস্তবসম্মত রোডম্যাপ নির্ধারণ করুন।",
      icon: UserCheck,
      details: [
        {
          heading: "শিক্ষাগত যোগ্যতার সঠিক মূল্যায়ন",
          text: "আপনার এসএসসি, এইচএসসি অথবা স্নাতক (অনার্স) সিজিপিএ আন্তর্জাতিক গ্রেডিং স্কেলে (যেমন ৪.০ বা ইউকে ২:১ সমমান) স্বয়ংক্রিয়ভাবে রূপান্তর করে যাচাই করুন।",
        },
        {
          heading: "ভাষা দক্ষতার লক্ষ্যমাত্রা (IELTS/PTE)",
          text: "পছন্দের দেশের ভিসার ন্যূনতম ব্যান্ড স্কোর (যেমন ইউকে/কানাডা/অস্ট্রেলিয়াতে ন্যূনতম ৬.০ বা ৬.৫) এবং কোনো ব্যান্ড যাতে ৫.৫ এর নিচে না থাকে তা নিশ্চিত করুন।",
        },
        {
          heading: "পারিবারিক বাজেট ও ইনটেক প্ল্যানিং",
          text: "ফল (Fall - সেপ্টেম্বর/অক্টোবর) নাকি স্প্রিং (Spring - জানুয়ারি/ফেব্রুয়ারি) ইনটেকে যাবেন এবং টিউশন ফি ও লিভিং কস্টের জন্য প্রয়োজনীয় ফান্ডিং প্ল্যান ঠিক করুন।",
        },
      ],
      deliverables: ["জিপিএ রূপান্তর রিপোর্ট", "টার্গেট ইনটেক ক্যালেন্ডার", "ভাষা পরীক্ষার চেকলিস্ট"],
    },
    {
      id: 2,
      number: "০২",
      title: "এক্সপ্লোর ও বিশ্ববিদ্যালয় ম্যাচিং",
      subtitle: "Explore & University Matching",
      shortDesc: "ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও ইউএসএ-র স্বীকৃত প্রতিষ্ঠান থেকে আপনার জন্য সেরাটি বেছে নিন।",
      icon: Search,
      details: [
        {
          heading: "ভেরিফাইড বিশ্ববিদ্যালয় ক্যাটালগ",
          text: "শুধুমাত্র সরকারি অনুমোদিত এবং বিশ্ব র‍্যাঙ্কিংয়ে থাকা বিশ্ববিদ্যালয়গুলো ব্রাউজ করুন। কোনো ভুয়া বা অকার্যকর বেসরকারি কলেজ নয়।",
        },
        {
          heading: "টিউশন ফি ও স্কলারশিপ যোগ্যতা",
          text: "জার্মানির টিউশন-ফ্রি পাবলিক বিশ্ববিদ্যালয় কিংবা ইউকে ও কানাডার স্কলারশিপ সুযোগ (যেমন শেভেনিং, ডিএএডি, অস্ট্রেলিয়া অ্যাওয়ার্ডস) ফিল্টার করে দেখুন।",
        },
        {
          heading: "পোস্ট-স্টাডি ওয়ার্ক পারমিট (PSW)",
          text: "পড়াশোনা শেষে কোন দেশে কত বছর কাজের ভিসা (যেমন ইউকে ২ বছর, কানাডা ৩ বছর, জার্মানি ১৮ মাস) পাওয়া যাবে তা শুরুতেই জেনে নিন।",
        },
      ],
      deliverables: ["৫টি পছন্দের বিশ্ববিদ্যালয়ের তালিকা", "স্কলারশিপ ডেডলাইন ট্র্যাকার", "এন্ট্রি রিকোয়ারমেন্টস শিট"],
    },
    {
      id: 3,
      number: "০৩",
      title: "ডকুমেন্টেশন ও সরাসরি আবেদন",
      subtitle: "Documentation & Direct Apply",
      shortDesc: "বিশ্ববিদ্যালয়ের নিজস্ব অফিশিয়াল ওয়েবসাইটে নিজে নিজেই নির্ভুল আবেদন সম্পন্ন করুন।",
      icon: FileText,
      details: [
        {
          heading: "প্রফেশনাল এসওপি (SOP) ও মোটিভেশন লেটার",
          text: "আমাদের এআই নির্দেশিকা ব্যবহার করে সম্পূর্ণ প্লাগিয়ারিজম-মুক্ত এবং আপনার নিজস্ব বাস্তব গল্পনির্ভর আকর্ষণীয় স্টেটমেন্ট অব পারপাস তৈরি করুন।",
        },
        {
          heading: "সুপারিশপত্র (LOR) ও একাডেমিক সনদ",
          text: "কলেজ বা বিশ্ববিদ্যালয়ের শিক্ষকদের কাছ থেকে একাডেমিক রিকমেন্ডেশন লেটার এবং শিক্ষাবোর্ড থেকে ট্রান্সক্রিপ্ট সত্যায়নের নিয়মাবলী অনুসরণ করুন।",
        },
        {
          heading: "সরাসরি আবেদন—কোনো মধ্যস্বত্বভোগী ছাড়া",
          text: "বিশ্ববিদ্যালয়ের নিজস্ব অ্যাপলিকেশন পোর্টালে নিজেই অ্যাকাউন্ট খুলে আবেদন ফি পরিশোধ করুন। আপনার পোর্টালের লগইন অ্যাক্সেস থাকবে শতভাগ আপনার নিজের হাতে।",
        },
      ],
      deliverables: ["স্ট্যান্ডার্ড এসওপি ড্রাফট", "ডকুমেন্ট ভেরিফিকেশন চেকলিস্ট", "অফিশিয়াল অ্যাপ্লিকেশন আইডি"],
    },
    {
      id: 4,
      number: "০৪",
      title: "ভিসা ও স্বপ্নের দেশান্তর",
      subtitle: "Visa Approval & Pre-departure",
      shortDesc: "অফার লেটার প্রাপ্তির পর ঢাকায় অফিশিয়াল দূতাবাসে ভিসা আবেদন এবং ফ্লাইটের চূড়ান্ত প্রস্তুতি।",
      icon: PlaneTakeoff,
      details: [
        {
          heading: "অফার লেটার ও কনফার্মেশন ডকুমেন্ট",
          text: "বিশ্ববিদ্যালয় থেকে অফার লেটার পাওয়ার পর ইউকের জন্য CAS, ইউএসএর জন্য I-20, অস্ট্রেলিয়ার জন্য CoE বা কানাডার লেটার অব অ্যাক্সেপ্টেন্স (LOA) নিশ্চিত করুন।",
        },
        {
          heading: "আর্থিক সক্ষমতার প্রমাণ (Financial Proof)",
          text: "বাংলাদেশি ব্যাংকে স্পন্সরের বৈধ ফান্ডিং হিস্ট্রি অথবা জার্মানির ক্ষেত্রে Expatrio/Fintiba-র মাধ্যমে সরকারি নিয়মে ব্লকড অ্যাকাউন্ট ফান্ড ট্রান্সফার সম্পন্ন করুন।",
        },
        {
          heading: "ঢাকায় ভিসা ফাইল সাবমিশন ও ভিএফএস বায়োমেট্রিক",
          text: "বারিধারা বা গুলশানের অফিশিয়াল দূতাবাস অথবা ভিএফএস গ্লোবাল (VFS Global)/টিএলএসকন্টাক্ট (TLScontact) সেন্টারে সরাসরি গিয়ে বায়োমেট্রিক ও সাক্ষাৎকার সম্পন্ন করুন।",
        },
      ],
      deliverables: ["ভিসা ইন্টারভিউ প্রশ্নোত্তর গাইড", "ব্যাংক ব্যালেন্স স্টেটমেন্ট ফরম্যাট", "প্রাক-যাত্রা ও বিমান টিকিট চেকলিস্ট"],
    },
  ];

  const comparisonPoints = [
    {
      parameter: "সার্ভিস ফি / ফাইল ওপেনিং চার্জ",
      agency: "৫০,০০০ থেকে ২,৫০,০০০+ টাকা অযৌক্তিক ফি",
      abroadmate: "১০০% সম্পূর্ণ ফ্রি (০ টাকা)",
      agencyBad: true,
    },
    {
      parameter: "বিশ্ববিদ্যালয় নির্বাচন",
      agency: "যেসব বেসরকারি কলেজ তাদের বেশি কমিশন দেয় সেগুলোতে পুশ করা",
      abroadmate: "আপনার যোগ্যতা ও ক্যারিয়ারের জন্য সেরা বিশ্বখ্যাত সরকারি বিশ্ববিদ্যালয়",
      agencyBad: true,
    },
    {
      parameter: "আবেদনের নিয়ন্ত্রণ ও একাউন্ট",
      agency: "ইমেইল ও পাসওয়ার্ড গোপন রাখে, শিক্ষার্থী কিছুই দেখতে পারে না",
      abroadmate: "বিশ্ববিদ্যালয় পোর্টালে সরাসরি আপনার নিজস্ব অ্যাকাউন্ট ও শতভাগ স্বচ্ছতা",
      agencyBad: true,
    },
    {
      parameter: "ভিসা ও ভর্তির প্রতিশ্রুতি",
      agency: "১০০% গ্যারান্টির ভুয়া আশ্বাস ও মিথ্যা তথ্য উপস্থাপন",
      abroadmate: "সংশ্লিষ্ট দেশের দূতাবাস ও অভিবাসন আইনের সত্য ও বাস্তবসম্মত তথ্য",
      agencyBad: true,
    },
    {
      parameter: "এসওপি (SOP) লিখন",
      agency: "কপি-পেস্ট করা জেনেরিক এসওপি যা প্রায়শই রিজেকশনের মূল কারণ হয়",
      abroadmate: "আপনার নিজস্ব যোগ্যতা ও স্বপ্নের ভিত্তিতে এআই নির্দেশিত ইউনিক এসওপি",
      agencyBad: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-14 pb-20 border-b border-slate-200/80">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0596690a_1px,transparent_1px),linear-gradient(to_bottom,#0596690a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-brand-700" />
            <span>স্বাবলম্বী উচ্চশিক্ষার বিশ্বস্ত গাইডলাইন</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            কোনো এজেন্সির সাহায্য ছাড়াই <br className="hidden sm:inline" />
            <span className="text-brand-700">উচ্চশিক্ষার ৪টি সহজ ও নির্ভুল ধাপ</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            বিদেশের বিশ্ববিদ্যালয়ে আবেদন করা রকেট সায়েন্স নয়। একটু সচেতনতা ও সঠিক নির্দেশিকা থাকলে আপনি নিজেই সম্পূর্ণ আবেদন ও ভিসা প্রক্রিয়া সম্পন্ন করতে পারেন—কোনো মধ্যস্বত্বভোগী দালাল ছাড়া।
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-6 py-3.5 rounded-xl font-bold shadow-md shadow-brand-700/25 transition-all hover:-translate-y-0.5"
            >
              <span>ফ্রি প্রোফাইল শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-xl font-semibold shadow-xs transition-colors"
            >
              <Building className="w-4 h-4 text-brand-700" />
              <span>বিশ্ববিদ্যালয়সমূহ দেখুন</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Steps Interactive Walkthrough */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Step Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200">
          {steps.map((s) => {
            const Icon = s.icon;
            const isSelected = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-brand-50 border-2 border-brand-600 shadow-xs"
                    : "hover:bg-slate-50 border-2 border-transparent text-slate-600"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                    isSelected ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold ${isSelected ? "text-brand-700" : "text-slate-400"}`}>
                    ধাপ {s.number}
                  </div>
                  <div className={`text-sm font-bold truncate ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                    {s.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Content Card */}
        {steps.map((s) => {
          if (s.id !== activeStep) return null;
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="mt-6 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-brand-700 bg-brand-50 px-3 py-1 rounded-md">
                    <span>ধাপ নম্বর {s.number}</span>
                    <span>•</span>
                    <span>{s.subtitle}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <Icon className="w-8 h-8 text-brand-700 shrink-0" />
                    <span>{s.title}</span>
                  </h2>
                  <p className="text-base text-slate-600 max-w-2xl">{s.shortDesc}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 lg:w-72 shrink-0">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-brand-700" />
                    <span>এই ধাপের প্রধান প্রাপ্তি:</span>
                  </div>
                  <ul className="space-y-2">
                    {s.deliverables.map((d, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sub-steps grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {s.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center mb-3">
                        {idx + 1}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">{detail.heading}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{detail.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation between steps */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  disabled={activeStep === 1}
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ← পূর্ববর্তী ধাপ
                </button>
                <div className="text-xs text-slate-400 font-medium">ধাপ {activeStep} / ৪</div>
                {activeStep < 4 ? (
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                    className="px-5 py-2 text-sm font-bold rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>পরবর্তী ধাপ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-bold rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>এখনই শুরু করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Comparison: Agency vs Self Application */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>সচেতনতার চোখ দিয়ে দেখুন</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
            বাণিজ্যিক এজেন্সি বনাম নিজেই AbroadMate
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            কেন হাজার হাজার মেধাবী শিক্ষার্থী এখন মধ্যস্বত্বভোগী এজেন্সি বাদ দিয়ে নিজেই আবেদন করছেন?
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-sm">
                  <th className="py-4 px-6 font-bold w-1/3">বিষয় / প্যারামিটার</th>
                  <th className="py-4 px-6 font-bold text-rose-700 w-1/3">প্রচলিত এজেন্সি / কনসালটেন্সি</th>
                  <th className="py-4 px-6 font-bold text-brand-800 bg-brand-50/60 w-1/3">AbroadMate-এর মাধ্যমে নিজে</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {comparisonPoints.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{item.parameter}</td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-rose-950/90">{item.agency}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-900 bg-brand-50/30">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                        <span className="font-medium text-brand-950">{item.abroadmate}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Target Countries Overview Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-brand-400 font-bold text-xs uppercase tracking-wider block mb-2">
              ৫টি শীর্ষ গন্তব্য দেশ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              যুক্তরাজ্য, কানাডা, অস্ট্রেলিয়া, জার্মানি ও যুক্তরাষ্ট্রে সরাসরি আবেদন
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              প্রতিটি দেশের স্টুডেন্ট ভিসা, আইইএলটিএস ছাড়ের নিয়ম, অফিশিয়াল টিউশন ফি এবং স্কলারশিপের আপডেট তথ্য এক ছাতার নিচে।
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/universities"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                <span>বিশ্ববিদ্যালয় তালিকা খুঁজুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-slate-700"
              >
                <span>ঢাকাস্থ দূতাবাস ও এফএকিউ</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Globe2 className="w-96 h-96 text-white" />
          </div>
        </div>
      </section>

      {/* Final Action Call */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <h3 className="text-2xl font-bold text-slate-900">আপনার স্বপ্নপূরণের প্রস্তুতি আজই শুরু করুন</h3>
        <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto">
          আপনার প্রোফাইল তৈরি করতে মাত্র ২ মিনিট সময় লাগবে। কোনো টাকা বা ক্রেডিট কার্ডের প্রয়োজন নেই।
        </p>
        <div className="mt-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-8 py-4 rounded-xl font-bold shadow-md shadow-brand-700/25 transition-all hover:-translate-y-0.5 text-base"
          >
            <span>বিনামূল্যে রেজিস্ট্রেশন করুন</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
