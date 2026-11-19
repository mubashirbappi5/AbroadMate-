"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { GraduationCap, ShieldAlert, ExternalLink, Heart } from "lucide-react";
import { COUNTRY_LIST } from "@abroadmate/shared";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Official Government Verification Sources Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>{t.app.officialSourceGuaranteed}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              {COUNTRY_LIST.map((country) => (
                <a
                  key={country.code}
                  href={country.officialImmigrationPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/60"
                >
                  <span>{country.flag}</span>
                  <span>{country.nameBn}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">AbroadMate</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              বাংলাদেশের শিক্ষার্থীদের জন্য ১০০% ফ্রি ও স্বাধীন উচ্চশিক্ষা প্ল্যাটফর্ম। কোনো বাণিজ্যিক দালাল বা এজেন্ট ছাড়াই নিজের যোগ্যতায় বিশ্বমানের বিশ্ববিদ্যালয়ে পড়ার প্রস্তুতি নিন।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              প্রধান ফিচারসমূহ
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/eligibility" className="hover:text-brand-400 transition-colors">
                  অ্যাডমিশন যোগ্যতা যাচাই
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-brand-400 transition-colors">
                  শীর্ষ ৫টি দেশের গাইড
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="hover:text-brand-400 transition-colors">
                  সম্পূর্ণ অর্থায়িত স্কলারশিপ
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-brand-400 transition-colors">
                  টাকায় পড়াশোনার খরচ ক্যালকুলেটর
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-brand-400 transition-colors">
                  ইনটেকভিত্তিক স্টাডি রোডম্যাপ
                </Link>
              </li>
            </ul>
          </div>

          {/* Dhaka Embassies */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              ঢাকাস্থ দূতাবাস ও হাই কমিশন
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {COUNTRY_LIST.map((c) => (
                <li key={c.code}>
                  <a
                    href={c.dhakaEmbassyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{c.flag} {c.dhakaEmbassyName}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Anti Agency Disclaimer Box */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>সতর্কবার্তা ও নীতি</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.disclaimer.text}
            </p>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AbroadMate. বাংলাদেশের শিক্ষার্থীদের জন্য সম্পূর্ণ অলাভজনক উদ্যোগে তৈরি।</p>
          <p className="flex items-center gap-1">
            <span>উচ্চশিক্ষার পথে আত্মবিশ্বাস ও সততার সাথে</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
