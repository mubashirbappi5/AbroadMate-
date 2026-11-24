"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  GraduationCap,
  ExternalLink,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { COUNTRY_LIST } from "@abroadmate/shared";

export function Footer() {
  const { t, locale } = useI18n();

  const isBn = locale === "bn";

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Official Government Verification Sources Bar */}
      <div className="border-b border-slate-800 bg-slate-950/70 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse shrink-0" />
              <span className="font-medium">{t.app.officialSourceGuaranteed}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {COUNTRY_LIST.map((country) => (
                <a
                  key={country.code}
                  href={country.officialImmigrationPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60"
                >
                  <span>{country.flag}</span>
                  <span>{isBn ? country.nameBn : country.nameEn}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">AbroadMate</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.disclaimer.footerPitch}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-brand-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>{t.disclaimer.noFileCharge}</span>
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              {isBn ? "উচ্চশিক্ষা ফিচার" : "Core Features"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/universities" className="hover:text-brand-400 transition-colors">
                  {isBn ? "বিশ্ববিদ্যালয় ক্যাটালগ" : "University Catalog"}
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-brand-400 transition-colors">
                  {isBn ? "শীর্ষ ৫টি দেশের গাইড" : "Top 5 Country Guides"}
                </Link>
              </li>
              <li>
                <Link href="/eligibility" className="hover:text-brand-400 transition-colors">
                  {isBn ? "অ্যাডমিশন যোগ্যতা যাচাই" : "Admission Eligibility"}
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="hover:text-brand-400 transition-colors">
                  {isBn ? "সম্পূর্ণ অর্থায়িত স্কলারশিপ" : "Fully Funded Scholarships"}
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-brand-400 transition-colors">
                  {isBn ? "পড়াশোনার খরচ ক্যালকুলেটর" : "Expense Calculator"}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-brand-400 transition-colors">
                  {isBn ? "ইনটেকভিত্তিক রোডম্যাপ" : "Study Abroad Roadmap"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick & Public Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              {isBn ? "স্বাবলম্বী গাইডলাইন" : "Guidance & Info"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/how-it-works" className="hover:text-brand-400 transition-colors font-medium text-slate-300">
                  {isBn ? "কিভাবে কাজ করে (৪ ধাপ)" : "How It Works (4 Steps)"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  {isBn ? "আমাদের লক্ষ্য ও মিশন" : "Our Mission & Story"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  {isBn ? "যোগাযোগ ও ঢাকা দূতাবাস" : "Contact & Dhaka Embassies"}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-400 transition-colors">
                  {isBn ? "শিক্ষার্থী লগইন" : "Student Log In"}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-400 transition-colors text-brand-400 font-semibold">
                  {isBn ? "বিনামূল্যে একাউন্ট খুলুন" : "Create Free Account"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Disclaimers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              {isBn ? "নীতিমালা ও আইনি তথ্য" : "Policies & Legal"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-brand-400 transition-colors">
                  {isBn ? "গোপনীয়তা ও ডেটা সুরক্ষা" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-400 transition-colors">
                  {isBn ? "ব্যবহারবিধির শর্তাবলী" : "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  {isBn ? "এন্টি-এজেন্সি প্রতিশ্রুতি" : "Anti-Agency Pledge"}
                </Link>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400 leading-relaxed">
              <span className="text-amber-400 font-semibold block mb-0.5">
                {isBn ? "অস্বীকৃতি:" : "Disclaimer:"}
              </span>
              {isBn
                ? "AbroadMate কোনো ভিসা এজেন্ট নয়। সমস্ত তথ্য অফিশিয়াল সরকারি উৎস থেকে সংগৃহীত।"
                : "AbroadMate is not a visa consultancy or agency. All information is verified against official government sources."}
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            {isBn
              ? `© ${new Date().getFullYear()} AbroadMate. বাংলাদেশের শিক্ষার্থীদের জন্য সম্পূর্ণ অলাভজনক উদ্যোগে তৈরি।`
              : `© ${new Date().getFullYear()} AbroadMate. Free & independent initiative for Bangladeshi students.`}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {isBn ? "প্রাইভেসি" : "Privacy"}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {isBn ? "শর্তাবলী" : "Terms"}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {isBn ? "যোগাযোগ" : "Contact"}
            </Link>
            <p className="flex items-center gap-1 text-slate-400">
              <span>{isBn ? "উচ্চশিক্ষার পথে সততা ও আত্মবিশ্বাস" : "Integrity in global education"}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
