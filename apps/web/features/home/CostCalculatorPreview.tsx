"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { calculateVisaFinancialProof } from "@abroadmate/visa-engine";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import { Calculator, Banknote, ShieldAlert, ArrowRight, Info } from "lucide-react";
import Link from "next/link";

export function CostCalculatorPreview() {
  const { t } = useI18n();

  const [countryCode, setCountryCode] = useState<"GB" | "CA" | "AU" | "DE" | "US">("GB");
  const [tuitionInput, setTuitionInput] = useState<number>(15000);

  const currentCountry = COUNTRY_LIST.find((c) => c.code === countryCode);
  const breakdown = calculateVisaFinancialProof(countryCode, Number(tuitionInput) || 0);

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {t.calculator.title}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            উচ্চশিক্ষায় আপনার মোট খরচের বাস্তব হিসাব
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-700" />
              <span>তথ্য নির্বাচন করুন</span>
            </h3>

            {/* Country buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                গন্তব্য দেশ:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COUNTRY_LIST.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountryCode(c.code as any);
                      // Set a realistic default tuition
                      if (c.code === "DE") setTuitionInput(500); // Public uni semester fees
                      else if (c.code === "GB") setTuitionInput(16000);
                      else if (c.code === "CA") setTuitionInput(22000);
                      else if (c.code === "AU") setTuitionInput(32000);
                      else if (c.code === "US") setTuitionInput(25000);
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left flex items-center gap-2 transition-all ${
                      countryCode === c.code
                        ? "bg-brand-700 text-white border-brand-700 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.nameBn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tuition fee input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ১ম বর্ষের বার্ষিক আনুমানিক টিউশন ফি ({currentCountry?.currency.symbol}{" "}
                {currentCountry?.currency.code})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={tuitionInput}
                  onChange={(e) => setTuitionInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
              {countryCode === "DE" && (
                <p className="text-[11px] text-brand-700 mt-1 font-medium">
                  💡 জার্মানির অধিকাংশ পাবলিক বিশ্ববিদ্যালয়ে কোনো টিউশন ফি নেই, শুধুমাত্র প্রতি সেমিস্টারে €২৫০-€৩৫০ সেমিস্টার কন্ট্রিবিউশন দিতে হয়।
                </p>
              )}
            </div>

            {/* Currency conversion indicator */}
            <div className="p-3 bg-brand-50/60 border border-brand-200 rounded-xl text-xs text-brand-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <span>
                ১ {currentCountry?.currency.code} = প্রায়{" "}
                {currentCountry?.currency.rateToBdtApprox} বাংলাদেশি টাকা (BDT) হিসেবে হিসাব করা হয়েছে।
              </span>
            </div>
          </div>

          {/* Breakdown & Total Result Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="bg-brand-900 text-white p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-brand-900/10">
              <div>
                <span className="text-xs text-brand-200 font-medium block">
                  {t.calculator.totalEstimate}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {formatBdt(breakdown.totalBdtApprox, "bn")}
                </span>
              </div>
              <div className="text-left sm:text-right text-xs text-brand-200">
                <span>সমপরিমাণ স্থানীয় মুদ্রা:</span>
                <span className="block text-base font-bold text-white">
                  {breakdown.currencyCode} {breakdown.totalLocal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">১ম বর্ষের টিউশন ফি:</span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.tuitionFeeLocal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  {countryCode === "DE"
                    ? "বাধ্যতামূলক ব্লকড অ্যাকাউন্ট ডিপোজিট (১ বছর):"
                    : "প্রয়োজনীয় জীবনযাত্রার ব্যয় (Living Cost):"}
                </span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.livingFundsRequiredLocal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">ভিসা আবেদন ও বায়োমেট্রিক ফি:</span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.visaApplicationFeeLocal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">বাধ্যতামূলক স্বাস্থ্য সুরক্ষা ও বীমা:</span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.healthInsuranceLocal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Official Holding Rule Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>অফিসিয়াল ব্যাংক ফান্ড নীতি:</span>
              </div>
              <p className="leading-relaxed">{breakdown.holdingRuleNoticeBn}</p>
              <p className="leading-relaxed font-medium">
                👨‍👩‍👦 স্পনসর নির্দেশনা: {breakdown.sponsorGuidelineBn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
