"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Calculator,
} from "lucide-react";

export function HeroSection() {
  const { t, locale } = useI18n();
  const isBn = locale === "bn";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0596690a_1px,transparent_1px),linear-gradient(to_bottom,#0596690a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
            <span>{t.app.antiAgencyBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.25]">
            {t.app.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.app.heroSubtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/eligibility"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-7 py-3.5 text-base font-bold rounded-xl shadow-md shadow-brand-700/25 transition-all hover:translate-y-[-1px]"
            >
              <span>{t.app.getStarted}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 text-base font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Calculator className="w-5 h-5 text-brand-700" />
              <span>{t.app.calculateCost}</span>
            </Link>
          </div>

          {/* Value Bullet Points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{isBn ? "ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও ইউএসএ" : "UK, Canada, Australia, Germany & USA"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{isBn ? "অফিসিয়াল ভিসা ও ব্যাংক সলভেন্সি নিয়মাবলী" : "Official Visa & Bank Solvency Rules"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{isBn ? "আইইএলটিএস ও জিপিএ অনুযায়ী অ্যাডমিশন চেকার" : "Admission Eligibility by IELTS & GPA"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
