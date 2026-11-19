"use client";

import React, { useState } from "react";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import { calculateVisaFinancialProof } from "@abroadmate/visa-engine";
import { ShieldCheck, Banknote, FileCheck, ExternalLink, AlertTriangle } from "lucide-react";

export default function VisaGuidesPage() {
  const [selectedCountry, setSelectedCountry] = useState<"GB" | "CA" | "AU" | "DE" | "US">("GB");
  const country = COUNTRY_LIST.find((c) => c.code === selectedCountry)!;
  const breakdown = calculateVisaFinancialProof(selectedCountry, 15000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ভিসা প্রয়োজনীয়তা ও ব্যাংক সলভেন্সি গাইড</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          কোন দেশে কত টাকা ব্যাংক একাউন্টে কতদিন ধরে রাখতে হয়, স্পনসর কে হতে পারেন এবং বায়োমেট্রিক ধাপসমূহের শতভাগ সত্য তথ্য।
        </p>
      </div>

      {/* Country Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {COUNTRY_LIST.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCountry(c.code as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
              selectedCountry === c.code
                ? "bg-brand-700 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-lg">{c.flag}</span>
            <span>{c.nameBn}</span>
          </button>
        ))}
      </div>

      {/* Main Visa Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{country.nameBn} স্টুডেন্ট ভিসা নির্দেশিকা</h2>
              <span className="text-xs text-brand-800 font-semibold bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                ভিসা সাবক্লাস: {country.visaSubclass.name} ({country.visaSubclass.categoryBn})
              </span>
            </div>
          </div>

          <a
            href={country.officialImmigrationPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 px-3.5 py-2 rounded-xl border border-brand-200"
          >
            <span>সরকারি ইমিগ্রেশন পোর্টাল</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Financial Rules Callout */}
        <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-brand-950 font-bold text-sm">
            <Banknote className="w-5 h-5 text-brand-700" />
            <span>ব্যাংক ফান্ড প্রদর্শন ও ডিপোজিট শর্তাবলী:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {breakdown.holdingRuleNoticeBn}
          </p>
          <div className="pt-2 border-t border-brand-200/60 text-xs text-brand-900">
            <strong>অনুমোদিত স্পনসরশিপ নিয়ম:</strong> {breakdown.sponsorGuidelineBn}
          </div>
        </div>

        {/* Step-by-Step Roadmap for Visa */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-700" />
            <span>ভিসা আবেদনের মূল ধাপসমূহ (Step-by-Step)</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
              <div>
                <strong className="text-slate-900 block">বিশ্ববিদ্যালয় কনফার্মেশন ও অফিশিয়াল ডকুমেন্ট সংগ্রহ:</strong>
                <span className="text-slate-600">
                  {selectedCountry === "GB" && "CAS (Confirmation of Acceptance for Studies) লেটার গ্রহণ।"}
                  {selectedCountry === "DE" && "বিশ্ববিদ্যালয়ের Zulassungsbescheid (অ্যাডমিশন লেটার) গ্রহণ।"}
                  {selectedCountry === "US" && "Form I-20 এবং SEVIS আইডি প্রাপ্তি।"}
                  {selectedCountry === "CA" && "LOA (Letter of Acceptance) এবং প্রভিন্সিয়াল PAL সংগ্রহ।"}
                  {selectedCountry === "AU" && "CoE (Confirmation of Enrolment) পত্র সংগ্রহ।"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
              <div>
                <strong className="text-slate-900 block">ব্যাংক সলভেন্সি বা ব্লকড অ্যাকাউন্ট প্রস্তুতকরণ:</strong>
                <span className="text-slate-600">
                  সংশ্লিষ্ট দেশের নিয়ম মেনে ফান্ড প্রস্তুত করা এবং ব্যাংক সলভেন্সি সার্টিফিকেট ও স্টেটমেন্ট উত্তোলন করা।
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
              <div>
                <strong className="text-slate-900 block">অনলাইন ভিসা ফর্ম পূরণ ও ভিএফএস/দূতাবাস অ্যাপয়েন্টমেন্ট:</strong>
                <span className="text-slate-600">
                  অনলাইন ভিসা ফি এবং স্বাস্থ্য বীমা (যেমন UK IHS বা Australian OSHC) পরিশোধ করে ঢাকায় বায়োমেট্রিকের তারিখ বুকিং দেওয়া।
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
