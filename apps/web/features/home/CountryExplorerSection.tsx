"use client";

import React from "react";
import { useI18n } from "@/lib/i18n-context";
import { COUNTRY_LIST, formatBdt } from "@abroadmate/shared";
import { Briefcase, Coins, ShieldAlert, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CountryExplorerSection() {
  const { t } = useI18n();

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-100/60 px-3 py-1 rounded-full border border-brand-200">
              গ্লোবাল ডেস্টিনেশন
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {t.countries.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {t.countries.subtitle}
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800"
          >
            <span>সব দেশের তুলনা দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRY_LIST.map((country) => (
            <div
              key={country.code}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {country.nameBn}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {country.nameEn} • {country.visaSubclass.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="py-4 space-y-3.5 text-xs text-slate-600">
                  {/* Currency & Living Cost */}
                  <div className="flex items-start gap-2.5">
                    <Coins className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        মাসিক জীবনযাত্রার ব্যয়:
                      </span>
                      <span>
                        {country.currency.symbol}
                        {country.avgMonthlyLivingCostLocal.toLocaleString()} {country.currency.code} (প্রায়{" "}
                        {formatBdt(
                          country.avgMonthlyLivingCostLocal * country.currency.rateToBdtApprox,
                          "bn"
                        )}
                        )
                      </span>
                    </div>
                  </div>

                  {/* Post-study work */}
                  <div className="flex items-start gap-2.5">
                    <Briefcase className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {t.countries.postStudyWork}:
                      </span>
                      <span className="line-clamp-2">
                        {country.postStudyWorkMonths.descriptionBn}
                      </span>
                    </div>
                  </div>

                  {/* Blocked Account rule */}
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        country.blockedAccountRequired ? "text-amber-600" : "text-slate-400"
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        ব্লকড অ্যাকাউন্ট:
                      </span>
                      <span>
                        {country.blockedAccountRequired
                          ? "জার্মানিতে ভিসা আবেদনের পূর্বে বাধ্যতামূলক (€১১,৯০৪ ইউরো)"
                          : "প্রয়োজন নেই (নিয়মিত ব্যাংক স্টেটমেন্ট প্রদর্শন প্রযোজ্য)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <a
                  href={country.officialImmigrationPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
                >
                  <span>অফিসিয়াল পোর্টাল</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href={`/explore?country=${country.code}`}
                  className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-bold"
                >
                  <span>গাইড দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
