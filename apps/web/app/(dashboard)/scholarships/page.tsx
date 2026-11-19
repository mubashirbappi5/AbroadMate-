"use client";

import React, { useState } from "react";
import { GraduationCap, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { COUNTRY_LIST } from "@abroadmate/shared";

interface ScholarshipItem {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  titleBn: string;
  titleEn: string;
  coverageType: string;
  coverageDesc: string;
  deadline: string;
  eligibility: string;
  officialUrl: string;
}

const SCHOLARSHIPS: ScholarshipItem[] = [
  {
    id: "chevening",
    countryCode: "GB",
    countryName: "যুক্তরাজ্য",
    flag: "🇬🇧",
    titleBn: "শেভেনিং স্কলারশিপ",
    titleEn: "Chevening Scholarship",
    coverageType: "সম্পূর্ণ অর্থায়িত (Full Ride)",
    coverageDesc: "১০০% টিউশন ফি, মাসিক থাকা-খাওয়ার ভাতা, রিটার্ন ফ্লাইট ও ভিসা ফি অন্তর্ভুক্ত।",
    deadline: "নভেম্বরের প্রথম সপ্তাহ (প্রতি বছর)",
    eligibility: "ব্যাচেলর ডিগ্রি, ন্যূনতম ২ বছরের পেশাগত কাজের অভিজ্ঞতা, পড়াশোনা শেষে বাংলাদেশে ফিরে আসার অঙ্গীকার।",
    officialUrl: "https://www.chevening.org/scholarship/bangladesh/",
  },
  {
    id: "daad",
    countryCode: "DE",
    countryName: "জার্মানি",
    flag: "🇩🇪",
    titleBn: "ডিএএডি ইপোস স্কলারশিপ",
    titleEn: "DAAD EPOS Scholarship",
    coverageType: "সম্পূর্ণ অর্থায়িত (Full Ride)",
    coverageDesc: "বিনামূল্যে পড়াশোনা, প্রতি মাসে €৯৩৪ ইউরো স্টাইপেন্ড, ট্রাভেল ভাতা ও স্বাস্থ্য বীমা।",
    deadline: "আগস্ট থেকে নভেম্বর (কোর্স অনুযায়ী ভিন্ন)",
    eligibility: "সংশ্লিষ্ট বিষয়ে অনার্স/ব্যাচেলর (সিজিপিএ ৩.০০+), অন্তত ২ বছরের কাজের অভিজ্ঞতা, আইইএলটিএস ৬.০ বা ৬.৫।",
    officialUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
  },
  {
    id: "australia-awards",
    countryCode: "AU",
    countryName: "অস্ট্রেলিয়া",
    flag: "🇦🇺",
    titleBn: "অস্ট্রেলিয়া অ্যাওয়ার্ডস",
    titleEn: "Australia Awards Scholarship",
    coverageType: "সম্পূর্ণ অর্থায়িত (Full Ride)",
    coverageDesc: "সম্পূর্ণ টিউশন, বিমান ভাড়া, সেটেলমেন্ট ভাতা, মাসিক লিভিং অ্যালাউন্স ও ওএসএইচসি।",
    deadline: "এপ্রিল - মে মাস (প্রতি বছর)",
    eligibility: "আইইএলটিএস ৬.৫ (কোনো ব্যান্ডে ৬.০ এর কম নয়), ন্যূনতম ২ বছরের চাকরির অভিজ্ঞতা।",
    officialUrl: "https://www.dfat.gov.au/people-to-people/australia-awards",
  },
  {
    id: "fulbright",
    countryCode: "US",
    countryName: "যুক্তরাষ্ট্র",
    flag: "🇺🇸",
    titleBn: "ফুলব্রাইট ফরেন স্টুডেন্ট প্রোগ্রাম",
    titleEn: "Fulbright Foreign Student Program",
    coverageType: "সম্পূর্ণ অর্থায়িত (Full Ride)",
    coverageDesc: "আমেরিকান বিশ্ববিদ্যালয়ের পূর্ণ টিউশন ফি, মাসিক লিভিং স্টাইপেন্ড, স্বাস্থ্য সুরক্ষা ও প্লেন টিকিট।",
    deadline: "মে মাসের শেষ সপ্তাহ (প্রতি বছর)",
    eligibility: "৪ বছরের ব্যাচেলর ডিগ্রি, চমৎকার সিজিপিএ, আইইএলটিএস ৭.০ বা টোফেল ৮৮+, অন্তত ২ বছরের কাজের অভিজ্ঞতা।",
    officialUrl: "https://bd.usembassy.gov/education-culture/fulbright-program/",
  },
];

export default function ScholarshipsPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");

  const filtered = selectedCountry === "ALL" 
    ? SCHOLARSHIPS 
    : SCHOLARSHIPS.filter(s => s.countryCode === selectedCountry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">সরকারি ও বিশ্ববিদ্যালয় স্কলারশিপ ডিরেক্টরি</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          বাংলাদেশের শিক্ষার্থীদের জন্য সম্পূর্ণ অর্থায়িত (Full Ride) মর্যাদাপূর্ণ স্কলারশিপের ভেরিফাইড তথ্য ও আবেদন নির্দেশিকা।
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCountry("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            selectedCountry === "ALL"
              ? "bg-brand-700 text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          সকল স্কলারশিপ ({SCHOLARSHIPS.length})
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{s.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{s.titleBn}</h3>
                    <span className="text-xs text-slate-500">{s.titleEn}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {s.coverageType}
                </span>
              </div>

              <div className="py-3 space-y-2.5 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900 block">কী কী সুবিধা অন্তর্ভুক্ত:</span>
                  <p className="text-slate-600">{s.coverageDesc}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block">আবেদনের প্রধান যোগ্যতা:</span>
                  <p className="text-slate-600">{s.eligibility}</p>
                </div>

                <div className="flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>আবেদনের সময়সীমা: {s.deadline}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">সরকারি অফিসিয়াল পোর্টাল</span>
              <a
                href={s.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
              >
                <span>সরাসরি আবেদন লিঙ্ক</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
