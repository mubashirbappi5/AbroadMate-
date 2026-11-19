"use client";

import React, { useState } from "react";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import { Globe2, ExternalLink, School, BookOpen, MapPin, Search } from "lucide-react";

export default function ExplorePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = selectedCountry === "ALL" 
    ? COUNTRY_LIST 
    : COUNTRY_LIST.filter(c => c.code === selectedCountry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">দেশ ও বিশ্ববিদ্যালয় এক্সপ্লোরার</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          শীর্ষ ৫টি দেশের অফিসিয়াল ভিসা নীতি, বিশ্ববিদ্যালয় তালিকা ও টিউশন ফির তুলনামূলক বিশ্লেষণ।
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCountry("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            selectedCountry === "ALL"
              ? "bg-brand-700 text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          সব দেশ ({COUNTRY_LIST.length})
        </button>
        {COUNTRY_LIST.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCountry(c.code)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              selectedCountry === c.code
                ? "bg-brand-700 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{c.flag}</span>
            <span>{c.nameBn}</span>
          </button>
        ))}
      </div>

      {/* Country Cards */}
      <div className="space-y-6">
        {filteredCountries.map((c) => (
          <div key={c.code} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{c.flag}</span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{c.nameBn} ({c.nameEn})</h2>
                  <span className="text-xs text-brand-800 font-semibold bg-brand-50 px-2 py-0.5 rounded border border-brand-200/60">
                    ভিসা ক্যাটাগরি: {c.visaSubclass.name} ({c.visaSubclass.categoryBn})
                  </span>
                </div>
              </div>

              <a
                href={c.officialImmigrationPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200"
              >
                <span>অফিসিয়াল ইমিগ্রেশন পোর্টাল</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                <span className="font-bold text-slate-900 block">মাসিক জীবনযাত্রার ব্যয়:</span>
                <span>{c.currency.symbol}{c.avgMonthlyLivingCostLocal.toLocaleString()} {c.currency.code}</span>
                <span className="text-slate-500 block">
                  (আনুমানিক {formatBdt(c.avgMonthlyLivingCostLocal * c.currency.rateToBdtApprox, "bn")})
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                <span className="font-bold text-slate-900 block">পড়াশোনা পরবর্তী কাজের সুযোগ (PSW):</span>
                <span>{c.postStudyWorkMonths.descriptionBn}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                <span className="font-bold text-slate-900 block">ঢাকাস্থ দূতাবাস ও তথ্যসূত্র:</span>
                <span>{c.dhakaEmbassyName}</span>
                <a
                  href={c.dhakaEmbassyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 block font-semibold hover:underline mt-0.5"
                >
                  দূতাবাস ওয়েবসাইট ভিজিট করুন ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
