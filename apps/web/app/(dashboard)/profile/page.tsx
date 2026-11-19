"use client";

import React, { useState } from "react";
import { BANGLADESH_EDUCATION_BOARDS, ACADEMIC_GROUPS, ENGLISH_TEST_TYPES, COUNTRY_LIST } from "@abroadmate/shared";
import { UserCheck, GraduationCap, Globe2, Save, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">শিক্ষার্থীর একাডেমিক ও ব্যক্তিগত প্রোফাইল</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          আপনার শিক্ষাগত যোগ্যতার সঠিক তথ্য দিন। এই তথ্যের ভিত্তিতে এআই ইঞ্জিন আপনার জন্য উপযুক্ত দেশ, বিশ্ববিদ্যালয় ও স্কলারশিপ নির্ধারণ করবে।
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>আপনার প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-4 h-4 text-brand-700" />
            <span>ব্যক্তিগত ও যোগাযোগের তথ্য</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">পূর্ণ নাম (পাসপোর্ট অনুযায়ী)</label>
              <input
                type="text"
                defaultValue="সাকিব আহমেদ"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ইমেইল এড্রেস</label>
              <input
                type="email"
                defaultValue="sakib.student@gmail.com"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">বাংলাদেশি মোবাইল নম্বর</label>
              <input
                type="tel"
                defaultValue="01712345678"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">বর্তমান একাডেমিক অবস্থা</label>
              <select
                defaultValue="bachelor_passed"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="hsc_passed">এইচএসসি সম্পন্ন (অনার্স/ব্যাচেলরে ভর্তি হতে ইচ্ছুক)</option>
                <option value="a_level">এ লেভেল সম্পন্ন (A-Level Passed)</option>
                <option value="diploma">ডিপ্লোমা ইন ইঞ্জিনিয়ারিং সম্পন্ন</option>
                <option value="bachelor_running">ব্যাচেলর শেষ বর্ষে অধ্যয়নরত</option>
                <option value="bachelor_passed">ব্যাচেলর / অনার্স সম্পন্ন (মাস্টার্সে ভর্তি হতে ইচ্ছুক)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Records */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-4 h-4 text-brand-700" />
            <span>শিক্ষাগত ফলাফল (GPA / CGPA)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">এইচএসসি / সমমান জিপিএ (স্কেল ৫.০০)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5.0"
                defaultValue="4.83"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">এইচএসসি শিক্ষা বোর্ড</label>
              <select
                defaultValue="dhaka"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                {BANGLADESH_EDUCATION_BOARDS.map((b) => (
                  <option key={b.id} value={b.id}>{b.nameBn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">গ্রুপ / বিভাগ</label>
              <select
                defaultValue="science"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                {ACADEMIC_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>{g.nameBn}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">স্নাতক সিজিপিএ (স্কেল ৪.০০)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                defaultValue="3.45"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">স্নাতকের বিষয় (Major)</label>
              <input
                type="text"
                defaultValue="Computer Science & Engineering"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">বিশ্ববিদ্যালয়ের নাম</label>
              <input
                type="text"
                defaultValue="University of Dhaka"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* English Test */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe2 className="w-4 h-4 text-brand-700" />
            <span>ইংরেজি ভাষা দক্ষতার স্কোর</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ওভারঅল ব্যান্ড</label>
              <input
                type="number"
                step="0.5"
                defaultValue="7.0"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">লিসেনিং</label>
              <input
                type="number"
                step="0.5"
                defaultValue="7.5"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">রিডিং</label>
              <input
                type="number"
                step="0.5"
                defaultValue="7.0"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">রাইটিং</label>
              <input
                type="number"
                step="0.5"
                defaultValue="6.5"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">স্পিকিং</label>
              <input
                type="number"
                step="0.5"
                defaultValue="7.0"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-colors flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>প্রোফাইল আপডেট করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
}
