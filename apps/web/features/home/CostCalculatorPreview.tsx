"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { calculateVisaFinancialProof } from "@abroadmate/visa-engine";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import { Calculator, ShieldAlert, Info } from "lucide-react";

export function CostCalculatorPreview() {
  const { t, locale } = useI18n();
  const isBn = locale === "bn";

  const [countryCode, setCountryCode] = useState<"GB" | "CA" | "AU" | "DE" | "US">("GB");
  const [tuitionInput, setTuitionInput] = useState<number>(16000);

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
            {t.calculator.heading}
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
              <span>{t.calculator.selectInfo}</span>
            </h3>

            {/* Country buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.calculator.targetCountry}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COUNTRY_LIST.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountryCode(c.code as any);
                      if (c.code === "DE") setTuitionInput(500);
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
                    <span className="truncate">{isBn ? c.nameBn : c.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tuition fee input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.calculator.tuitionLabel} ({currentCountry?.currency.symbol}{" "}
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
                  {t.calculator.germanyTip}
                </p>
              )}
            </div>

            {/* Currency conversion indicator */}
            <div className="p-3 bg-brand-50/60 border border-brand-200 rounded-xl text-xs text-brand-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? `১ ${currentCountry?.currency.code} = প্রায় ${currentCountry?.currency.rateToBdtApprox} বাংলাদেশি টাকা (BDT) হিসেবে হিসাব করা হয়েছে।`
                  : `Calculated based on standard benchmark: 1 ${currentCountry?.currency.code} ≈ ${currentCountry?.currency.rateToBdtApprox} BDT.`}
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
                  {formatBdt(breakdown.totalBdtApprox, isBn ? "bn" : "en")}
                </span>
              </div>
              <div className="text-left sm:text-right text-xs text-brand-200">
                <span>{isBn ? "সমপরিমাণ স্থানীয় মুদ্রা:" : "Equivalent Local Currency:"}</span>
                <span className="block text-base font-bold text-white">
                  {breakdown.currencyCode} {breakdown.totalLocal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  {isBn ? "১ম বর্ষের টিউশন ফি:" : "1st Year Tuition Fee:"}
                </span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.tuitionFeeLocal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  {countryCode === "DE"
                    ? isBn
                      ? "বাধ্যতামূলক ব্লকড অ্যাকাউন্ট ডিপোজিট (১ বছর):"
                      : "Mandatory Blocked Account (1 Year):"
                    : isBn
                    ? "প্রয়োজনীয় জীবনযাত্রার ব্যয় (Living Cost):"
                    : "Living Funds Required:"}
                </span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.livingFundsRequiredLocal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  {isBn ? "ভিসা আবেদন ও বায়োমেট্রিক ফি:" : "Visa & Biometrics Fee:"}
                </span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.visaApplicationFeeLocal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">
                  {isBn ? "বাধ্যতামূলক স্বাস্থ্য সুরক্ষা ও বীমা:" : "Health Insurance / Surcharge:"}
                </span>
                <span className="font-semibold text-slate-900">
                  {breakdown.currencyCode} {breakdown.healthInsuranceLocal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Official Holding Rule Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{isBn ? "অফিসিয়াল ব্যাংক ফান্ড নীতি:" : "Official Bank Holding Rule:"}</span>
              </div>
              <p className="leading-relaxed">{breakdown.holdingRuleNoticeBn}</p>
              <p className="leading-relaxed font-medium">
                {isBn ? `👨‍👩‍👦 স্পনসর নির্দেশনা: ${breakdown.sponsorGuidelineBn}` : `👨‍👩‍👦 Sponsor Guideline: ${breakdown.sponsorGuidelineBn}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
