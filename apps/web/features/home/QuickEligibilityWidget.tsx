"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { evaluateQuickEligibility, EligibilityEvaluationResult } from "@abroadmate/eligibility-engine";
import { COUNTRY_LIST } from "@abroadmate/shared";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickEligibilityWidget() {
  const { t, locale } = useI18n();
  const isBn = locale === "bn";

  const [country, setCountry] = useState<string>("GB");
  const [degreeLevel, setDegreeLevel] = useState<"bachelor" | "master" | "phd">("master");
  const [gpa, setGpa] = useState<number>(3.2);
  const [ielts, setIelts] = useState<number>(6.5);
  const [result, setResult] = useState<EligibilityEvaluationResult | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const res = evaluateQuickEligibility({
      targetCountry: country,
      degreeLevel: degreeLevel,
      currentGpa: Number(gpa),
      ieltsBand: Number(ielts),
    });
    setResult(res);
  };

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {t.eligibility.checkNow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t.eligibility.title}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.eligibility.subtitle}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleCheck} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.eligibility.targetCountry}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                {COUNTRY_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {isBn ? c.nameBn : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.eligibility.degreeLevel}
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as "bachelor" | "master" | "phd")}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="bachelor">{t.eligibility.bachelor}</option>
                <option value="master">{t.eligibility.master}</option>
                <option value="phd">{t.eligibility.phd}</option>
              </select>
            </div>

            {/* GPA Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {degreeLevel === "bachelor" ? t.eligibility.hscGpa : t.eligibility.bachelorCgpa}
              </label>
              <input
                type="number"
                step="0.05"
                min="2.0"
                max={degreeLevel === "bachelor" ? "5.0" : "4.0"}
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* IELTS Band */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.eligibility.ieltsLabel} (0.0 - 9.0)
              </label>
              <select
                value={ielts}
                onChange={(e) => setIelts(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="0">{t.eligibility.notTakenIelts}</option>
                <option value="5.5">5.5 {t.eligibility.band}</option>
                <option value="6.0">6.0 {t.eligibility.band}</option>
                <option value="6.5">6.5 {t.eligibility.band}</option>
                <option value="7.0">7.0 {t.eligibility.band}</option>
                <option value="7.5">7.5 {t.eligibility.band}</option>
                <option value="8.0">8.0 {t.eligibility.band}</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 mt-2">
              <button
                type="submit"
                className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-6 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.eligibility.checkEligibilityBtn}</span>
              </button>
            </div>
          </form>

          {/* Result Card */}
          {result && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div
                className={`p-4 sm:p-5 rounded-xl border ${
                  result.status === "ELIGIBLE"
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : result.status === "BORDERLINE"
                    ? "bg-amber-50/80 border-amber-300 text-amber-950"
                    : "bg-rose-50/80 border-rose-300 text-rose-950"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {result.status === "ELIGIBLE" && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  {result.status === "BORDERLINE" && (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  )}
                  {result.status === "INELIGIBLE" && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-base font-bold">
                      {result.status === "ELIGIBLE"
                        ? t.eligibility.resultEligible
                        : result.status === "BORDERLINE"
                        ? t.eligibility.resultBorderline
                        : t.eligibility.resultIneligible}
                    </h4>
                    <span className="text-xs font-semibold opacity-80">
                      {isBn ? `ম্যাচিং স্কোর: ${result.scorePercentage}%` : `Match Score: ${result.scorePercentage}%`}
                    </span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs sm:text-sm pl-7 list-disc">
                  {(isBn || !result.reasonsEn?.length ? result.reasonsBn : result.reasonsEn).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                  {(isBn || !result.recommendationsEn?.length ? result.recommendationsBn : result.recommendationsEn).map((rec, i) => (
                    <li key={i} className="font-semibold text-slate-800">
                      💡 {isBn ? "পরামর্শ" : "Recommendation"}: {rec}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between">
                  <span className="text-xs">
                    {isBn
                      ? "সম্পূর্ণ প্রোফাইল দিয়ে বিস্তারিত যাচাই করতে চান?"
                      : "Want to run an in-depth evaluation with your full profile?"}
                  </span>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-xs font-bold underline hover:opacity-80"
                  >
                    <span>{isBn ? "প্রোফাইল তৈরি করুন" : "Go to Dashboard"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
