"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
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
  Award,
  Globe2,
  Building,
  ChevronRight,
} from "lucide-react";

export default function HowItWorksPage() {
  const { locale } = useI18n();
  const isBn = locale === "bn";

  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      number: isBn ? "০১" : "01",
      title: isBn ? "প্রোফাইল তৈরি ও প্রস্তুতি" : "Profile & Readiness",
      subtitle: isBn ? "Profile & Academic Readiness" : "Assess Eligibility & Standardized Requirements",
      shortDesc: isBn
        ? "আপনার পূর্ববর্তী রেজাল্ট ও টার্গেটের ভিত্তিতে বাস্তবসম্মত রোডম্যাপ নির্ধারণ করুন।"
        : "Evaluate your academic GPA and language scores against international entry thresholds.",
      icon: UserCheck,
      details: [
        {
          heading: isBn ? "শিক্ষাগত যোগ্যতার সঠিক মূল্যায়ন" : "Accurate Academic Evaluation",
          text: isBn
            ? "আপনার এসএসসি, এইচএসসি অথবা স্নাতক (অনার্স) সিজিপিএ আন্তর্জাতিক গ্রেডিং স্কেলে স্বয়ংক্রিয়ভাবে রূপান্তর করে যাচাই করুন।"
            : "Convert and compare your SSC, HSC, or Bachelor CGPA against international equivalencies (such as UK 2:1 or US 4.0).",
        },
        {
          heading: isBn ? "ভাষা দক্ষতার লক্ষ্যমাত্রা (IELTS/PTE)" : "Language Target (IELTS/PTE)",
          text: isBn
            ? "পছন্দের দেশের ভিসার ন্যূনতম ব্যান্ড স্কোর (যেমন ইউকে/কানাডা/অস্ট্রেলিয়াতে ন্যূনতম ৬.০ বা ৬.৫) এবং কোনো ব্যান্ড যাতে ৫.৫ এর নিচে না থাকে তা নিশ্চিত করুন।"
            : "Confirm your target country's minimum language criteria (typically 6.0 - 6.5 overall with no sub-band below 5.5 - 6.0).",
        },
        {
          heading: isBn ? "পারিবারিক বাজেট ও ইনটেক প্ল্যানিং" : "Budget & Intake Planning",
          text: isBn
            ? "ফল নাকি স্প্রিং ইনটেকে যাবেন এবং টিউশন ফি ও লিভিং কস্টের জন্য প্রয়োজনীয় ফান্ডিং প্ল্যান ঠিক করুন।"
            : "Determine your preferred intake (Fall vs Spring) and establish an upfront budget for tuition and living funds.",
        },
      ],
      deliverables: isBn
        ? ["জিপিএ রূপান্তর রিপোর্ট", "টার্গেট ইনটেক ক্যালেন্ডার", "ভাষা পরীক্ষার চেকলিস্ট"]
        : ["GPA Conversion Report", "Target Intake Calendar", "Language Exam Checklist"],
    },
    {
      id: 2,
      number: isBn ? "০২" : "02",
      title: isBn ? "এক্সপ্লোর ও বিশ্ববিদ্যালয় ম্যাচিং" : "University & Program Matching",
      subtitle: isBn ? "Explore & University Matching" : "Discover Ranked Institutions & Scholarships",
      shortDesc: isBn
        ? "ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও ইউএসএ-র স্বীকৃত প্রতিষ্ঠান থেকে আপনার জন্য সেরাটি বেছে নিন।"
        : "Shortlist accredited, government-recognized universities and eligible scholarship programs.",
      icon: Search,
      details: [
        {
          heading: isBn ? "ভেরিফাইড বিশ্ববিদ্যালয় ক্যাটালগ" : "Verified Institution Directory",
          text: isBn
            ? "শুধুমাত্র সরকারি অনুমোদিত এবং বিশ্ব র‍্যাঙ্কিংয়ে থাকা বিশ্ববিদ্যালয়গুলো ব্রাউজ করুন। কোনো ভুয়া বা অকার্যকর বেসরকারি কলেজ নয়।"
            : "Browse strictly recognized and accredited public universities with verified international student credentials.",
        },
        {
          heading: isBn ? "টিউশন ফি ও স্কলারশিপ যোগ্যতা" : "Tuition & Scholarship Screening",
          text: isBn
            ? "জার্মানির টিউশন-ফ্রি পাবলিক বিশ্ববিদ্যালয় কিংবা ইউকে ও কানাডার স্কলারশিপ সুযোগ (যেমন শেভেনিং, ডিএএডি, অস্ট্রেলিয়া অ্যাওয়ার্ডস) ফিল্টার করে দেখুন।"
            : "Filter tuition-free options (German public universities) alongside major scholarships like Chevening, DAAD, and AAS.",
        },
        {
          heading: isBn ? "পোস্ট-স্টাডি ওয়ার্ক পারমিট (PSW)" : "Post-Study Work Rights (PSW)",
          text: isBn
            ? "পড়াশোনা শেষে কোন দেশে কত বছর কাজের ভিসা (যেমন ইউকে ২ বছর, কানাডা ৩ বছর, জার্মানি ১৮ মাস) পাওয়া যাবে তা শুরুতেই জেনে নিন।"
            : "Review post-graduation work rights (UK 2 years, Canada up to 3 years, Germany 18 months) prior to committing.",
        },
      ],
      deliverables: isBn
        ? ["৫টি পছন্দের বিশ্ববিদ্যালয়ের তালিকা", "স্কলারশিপ ডেডলাইন ট্র্যাকার", "এন্ট্রি রিকোয়ারমেন্টস শিট"]
        : ["Shortlist of 5 Universities", "Scholarship Deadline Tracker", "Entry Requirements Sheet"],
    },
    {
      id: 3,
      number: isBn ? "০৩" : "03",
      title: isBn ? "ডকুমেন্টেশন ও সরাসরি আবেদন" : "Documentation & Direct Application",
      subtitle: isBn ? "Documentation & Direct Apply" : "Draft SOP & Submit Without Intermediaries",
      shortDesc: isBn
        ? "বিশ্ববিদ্যালয়ের নিজস্ব অফিশিয়াল ওয়েবসাইটে নিজে নিজেই নির্ভুল আবেদন সম্পন্ন করুন।"
        : "Prepare compelling, authentic academic documents and submit directly through official admissions portals.",
      icon: FileText,
      details: [
        {
          heading: isBn ? "প্রফেশনাল এসওপি (SOP) ও মোটিভেশন লেটার" : "Structured SOP & Motivation Letters",
          text: isBn
            ? "আমাদের এআই নির্দেশিকা ব্যবহার করে সম্পূর্ণ প্লাগিয়ারিজম-মুক্ত এবং আপনার নিজস্ব বাস্তব গল্পনির্ভর আকর্ষণীয় স্টেটমেন্ট অব পারপাস তৈরি করুন।"
            : "Use our domain-tailored AI assistant to draft compelling, plagiarism-free Statements of Purpose based on your genuine background.",
        },
        {
          heading: isBn ? "সুপারিশপত্র (LOR) ও একাডেমিক সনদ" : "Letters of Recommendation & Transcripts",
          text: isBn
            ? "কলেজ বা বিশ্ববিদ্যালয়ের শিক্ষকদের কাছ থেকে একাডেমিক রিকমেন্ডেশন লেটার এবং শিক্ষাবোর্ড থেকে ট্রান্সক্রিপ্ট সত্যায়নের নিয়মাবলী অনুসরণ করুন।"
            : "Obtain academic recommendation letters and follow board/university attestation protocols.",
        },
        {
          heading: isBn ? "সরাসরি আবেদন—কোনো মধ্যস্বত্বভোগী ছাড়া" : "Direct Portal Submission",
          text: isBn
            ? "বিশ্ববিদ্যালয়ের নিজস্ব অ্যাপলিকেশন পোর্টালে নিজেই অ্যাকাউন্ট খুলে আবেদন ফি পরিশোধ করুন। আপনার পোর্টালের লগইন অ্যাক্সেস থাকবে শতভাগ আপনার নিজের হাতে।"
            : "Create your personal account on the university application portal and track your file with 100% direct transparency.",
        },
      ],
      deliverables: isBn
        ? ["স্ট্যান্ডার্ড এসওপি ড্রাফট", "ডকুমেন্ট ভেরিফিকেশন চেকলিস্ট", "অফিশিয়াল অ্যাপ্লিকেশন আইডি"]
        : ["Standard SOP Draft", "Document Verification Checklist", "Official Application ID"],
    },
    {
      id: 4,
      number: isBn ? "০৪" : "04",
      title: isBn ? "ভিসা ও স্বপ্নের দেশান্তর" : "Visa Approval & Departure",
      subtitle: isBn ? "Visa Approval & Pre-departure" : "Financial Solvency & Official Embassy Submission",
      shortDesc: isBn
        ? "অফার লেটার প্রাপ্তির পর ঢাকায় অফিশিয়াল দূতাবাসে ভিসা আবেদন এবং ফ্লাইটের চূড়ান্ত প্রস্তুতি।"
        : "Finalize financial proof, schedule biometrics in Dhaka, and prepare for your departure.",
      icon: PlaneTakeoff,
      details: [
        {
          heading: isBn ? "অফার লেটার ও কনফার্মেশন ডকুমেন্ট" : "Offer Letter & Confirmation (CAS/I-20/LOA)",
          text: isBn
            ? "বিশ্ববিদ্যালয় থেকে অফার লেটার পাওয়ার পর ইউকের জন্য CAS, ইউএসএর জন্য I-20, অস্ট্রেলিয়ার জন্য CoE বা কানাডার লেটার অব অ্যাক্সেপ্টেন্স (LOA) নিশ্চিত করুন।"
            : "Secure your official acceptance confirmation (CAS for UK, I-20 for USA, CoE for Australia, LOA for Canada).",
        },
        {
          heading: isBn ? "আর্থিক সক্ষমতার প্রমাণ (Financial Proof)" : "Proof of Financial Capacity",
          text: isBn
            ? "বাংলাদেশি ব্যাংকে স্পন্সরের বৈধ ফান্ডিং হিস্ট্রি অথবা জার্মানির ক্ষেত্রে Expatrio/Fintiba-র মাধ্যমে সরকারি নিয়মে ব্লকড অ্যাকাউন্ট ফান্ড ট্রান্সফার সম্পন্ন করুন।"
            : "Complete the 28-day holding period in Bangladeshi banks or open a verified German Blocked Account via official partners.",
        },
        {
          heading: isBn ? "ঢাকায় ভিসা ফাইল সাবমিশন ও ভিএফএস বায়োমেট্রিক" : "Dhaka Visa Submission & Biometrics",
          text: isBn
            ? "বারিধারা বা গুলশানের অফিশিয়াল দূতাবাস অথবা ভিএফএস গ্লোবাল (VFS Global)/টিএলএসকন্টাক্ট সেন্টারে সরাসরি গিয়ে বায়োমেট্রিক ও সাক্ষাৎকার সম্পন্ন করুন।"
            : "Attend your biometric appointment and visa interview directly at VFS Global or diplomatic missions in Baridhara/Gulshan.",
        },
      ],
      deliverables: isBn
        ? ["ভিসা ইন্টারভিউ প্রশ্নোত্তর গাইড", "ব্যাংক ব্যালেন্স স্টেটমেন্ট ফরম্যাট", "প্রাক-যাত্রা ও বিমান টিকিট চেকলিস্ট"]
        : ["Visa Interview Q&A Guide", "Bank Solvency Format", "Pre-Departure Checklist"],
    },
  ];

  const comparisonPoints = [
    {
      parameter: isBn ? "সার্ভিস ফি / ফাইল ওপেনিং চার্জ" : "Service & File Opening Fees",
      agency: isBn ? "৫০,০০০ থেকে ২,৫০,০০০+ টাকা অযৌক্তিক ফি" : "BDT 50,000 - 250,000+ extracted",
      abroadmate: isBn ? "১০০% সম্পূর্ণ ফ্রি (০ টাকা)" : "100% Free Forever (0 BDT)",
      agencyBad: true,
    },
    {
      parameter: isBn ? "বিশ্ববিদ্যালয় নির্বাচন" : "University Selection",
      agency: isBn ? "যেসব বেসরকারি কলেজ বেশি কমিশন দেয় সেগুলোতে পুশ করা" : "Pushed toward low-tier colleges offering kickbacks",
      abroadmate: isBn ? "আপনার যোগ্যতা ও ক্যারিয়ারের জন্য সেরা বিশ্বখ্যাত সরকারি বিশ্ববিদ্যালয়" : "Top accredited public institutions based purely on merit",
      agencyBad: true,
    },
    {
      parameter: isBn ? "আবেদনের নিয়ন্ত্রণ ও একাউন্ট" : "Account Control & Transparency",
      agency: isBn ? "ইমেইল ও পাসওয়ার্ড গোপন রাখে, শিক্ষার্থী কিছুই দেখতে পারে না" : "Credentials hidden; correspondence withheld from student",
      abroadmate: isBn ? "বিশ্ববিদ্যালয় পোর্টালে সরাসরি আপনার নিজস্ব অ্যাকাউন্ট ও শতভাগ স্বচ্ছতা" : "Direct personal ownership of your portal logins & records",
      agencyBad: true,
    },
    {
      parameter: isBn ? "ভিসা ও ভর্তির প্রতিশ্রুতি" : "Visa Guarantees & Claims",
      agency: isBn ? "১০০% গ্যারান্টির ভুয়া আশ্বাস ও মিথ্যা তথ্য উপস্থাপন" : "Fake '100% visa guarantees' risking multi-year bans",
      abroadmate: isBn ? "সংশ্লিষ্ট দেশের দূতাবাস ও অভিবাসন আইনের সত্য ও বাস্তবসম্মত তথ্য" : "Real, documented immigration rules with official links",
      agencyBad: true,
    },
    {
      parameter: isBn ? "এসওপি (SOP) লিখন" : "Statement of Purpose (SOP)",
      agency: isBn ? "কপি-পেস্ট করা জেনেরিক এসওপি যা প্রায়শই রিজেকশনের মূল কারণ হয়" : "Recycled templates causing immediate refusal for plagiarism",
      abroadmate: isBn ? "আপনার নিজস্ব যোগ্যতা ও স্বপ্নের ভিত্তিতে এআই নির্দেশিত ইউনিক এসওপি" : "Authentic, tailored SOP generated from your exact profile",
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
            <span>{isBn ? "স্বাবলম্বী উচ্চশিক্ষার বিশ্বস্ত গাইডলাইন" : "Independent Study Abroad Guide"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {isBn ? (
              <>
                কোনো এজেন্সির সাহায্য ছাড়াই <br className="hidden sm:inline" />
                <span className="text-brand-700">উচ্চশিক্ষার ৪টি সহজ ও নির্ভুল ধাপ</span>
              </>
            ) : (
              <>
                Navigate Global Admissions in <br className="hidden sm:inline" />
                <span className="text-brand-700">4 Clear Steps Without Agencies</span>
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {isBn
              ? "বিদেশের বিশ্ববিদ্যালয়ে আবেদন করা রকেট সায়েন্স নয়। একটু সচেতনতা ও সঠিক নির্দেশিকা থাকলে আপনি নিজেই সম্পূর্ণ আবেদন ও ভিসা প্রক্রিয়া সম্পন্ন করতে পারেন—কোনো মধ্যস্বত্বভোগী দালাল ছাড়া।"
              : "Applying to international universities is straightforward with verified information. Take control of your admission and visa journey completely free."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-6 py-3.5 rounded-xl font-bold shadow-md shadow-brand-700/25 transition-all hover:-translate-y-0.5"
            >
              <span>{isBn ? "ফ্রি প্রোফাইল শুরু করুন" : "Start Free Profile"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-xl font-semibold shadow-xs transition-colors"
            >
              <Building className="w-4 h-4 text-brand-700" />
              <span>{isBn ? "বিশ্ববিদ্যালয়সমূহ দেখুন" : "Browse Universities"}</span>
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
                    {isBn ? `ধাপ ${s.number}` : `Step ${s.number}`}
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
                    <span>{isBn ? `ধাপ নম্বর ${s.number}` : `Step Number ${s.number}`}</span>
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
                    <span>{isBn ? "এই ধাপের প্রধান প্রাপ্তি:" : "Key Deliverables:"}</span>
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
                  ← {isBn ? "পূর্ববর্তী ধাপ" : "Previous Step"}
                </button>
                <div className="text-xs text-slate-400 font-medium">
                  {isBn ? `ধাপ ${activeStep} / ৪` : `Step ${activeStep} of 4`}
                </div>
                {activeStep < 4 ? (
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                    className="px-5 py-2 text-sm font-bold rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{isBn ? "পরবর্তী ধাপ" : "Next Step"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-bold rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{isBn ? "এখনই শুরু করুন" : "Get Started Now"}</span>
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
            <span>{isBn ? "সচেতনতার চোখ দিয়ে দেখুন" : "Fair Comparison"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
            {isBn ? "বাণিজ্যিক এজেন্সি বনাম নিজেই AbroadMate" : "Commercial Agency vs. AbroadMate"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {isBn
              ? "কেন হাজার হাজার মেধাবী শিক্ষার্থী এখন মধ্যস্বত্বভোগী এজেন্সি বাদ দিয়ে নিজেই আবেদন করছেন?"
              : "Why thousands of ambitious students choose direct self-application over agency intermediaries."}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-sm">
                  <th className="py-4 px-6 font-bold w-1/3">{isBn ? "বিষয় / প্যারামিটার" : "Parameter"}</th>
                  <th className="py-4 px-6 font-bold text-rose-700 w-1/3">
                    {isBn ? "প্রচলিত এজেন্সি / কনসালটেন্সি" : "Commercial Agency"}
                  </th>
                  <th className="py-4 px-6 font-bold text-brand-800 bg-brand-50/60 w-1/3">
                    {isBn ? "AbroadMate-এর মাধ্যমে নিজে" : "Independent with AbroadMate"}
                  </th>
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
              {isBn ? "৫টি শীর্ষ গন্তব্য দেশ" : "5 Top Destinations"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {isBn
                ? "যুক্তরাজ্য, কানাডা, অস্ট্রেলিয়া, জার্মানি ও যুক্তরাষ্ট্রে সরাসরি আবেদন"
                : "Direct Guidance for UK, Canada, Australia, Germany & USA"}
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              {isBn
                ? "প্রতিটি দেশের স্টুডেন্ট ভিসা, আইইএলটিএস ছাড়ের নিয়ম, অফিশিয়াল টিউশন ফি এবং স্কলারশিপের আপডেট তথ্য এক ছাতার নিচে।"
                : "Visa requirements, post-study work rights, verified tuition benchmarks, and official university portals under one roof."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/universities"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                <span>{isBn ? "বিশ্ববিদ্যালয় তালিকা খুঁজুন" : "Browse Universities"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-slate-700"
              >
                <span>{isBn ? "ঢাকাস্থ দূতাবাস ও এফএকিউ" : "Dhaka Embassies & FAQs"}</span>
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
        <h3 className="text-2xl font-bold text-slate-900">
          {isBn ? "আপনার স্বপ্নপূরণের প্রস্তুতি আজই শুরু করুন" : "Start Preparing for Your Dream University Today"}
        </h3>
        <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto">
          {isBn
            ? "আপনার প্রোফাইল তৈরি করতে মাত্র ২ মিনিট সময় লাগবে। কোনো টাকা বা ক্রেডিট কার্ডের প্রয়োজন নেই।"
            : "Creating your academic profile takes only 2 minutes. Completely free forever."}
        </p>
        <div className="mt-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-8 py-4 rounded-xl font-bold shadow-md shadow-brand-700/25 transition-all hover:-translate-y-0.5 text-base"
          >
            <span>{isBn ? "বিনামূল্যে রেজিস্ট্রেশন করুন" : "Create Free Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
