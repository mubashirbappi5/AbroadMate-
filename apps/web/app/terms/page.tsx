"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  ShieldAlert,
  Scale,
  ArrowRight,
  Mail,
} from "lucide-react";

export default function TermsPage() {
  const { locale } = useI18n();
  const isBn = locale === "bn";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-14 pb-14 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold mb-4">
            <Scale className="w-4 h-4 text-brand-700" />
            <span>{isBn ? "আইনি নীতিমালা ও আচরণবিধি" : "Legal Framework & Code of Conduct"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            {isBn ? (
              <>
                ব্যবহারবিধির <span className="text-brand-700">শর্তাবলী ও নীতিমালা</span>
              </>
            ) : (
              <>
                Terms of Service & <span className="text-brand-700">User Agreement</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "AbroadMate প্ল্যাটফর্ম ব্যবহারের পূর্বে অনুগ্রহ করে আমাদের শর্তাবলী ও নন-এজেন্সি আইনি অস্বীকৃতি মনোযোগ দিয়ে পড়ুন।"
              : "Please review our terms of service, acceptable use guidelines, and non-agency legal disclaimers."}
          </p>
          <div className="mt-4 text-xs font-medium text-slate-400">
            {isBn ? "সর্বশেষ পরিমার্জন: নভেম্বর ২০২৬" : "Last updated: November 2026"}
          </div>
        </div>
      </section>

      {/* Main Terms Document */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Anti-Agency Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 mb-10 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>{isBn ? "গুরুত্বপূর্ণ আইনি অস্বীকৃতি (Legal Disclaimer)" : "Important Legal Disclaimer"}</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            {isBn
              ? "AbroadMate কোনো বাণিজ্যিক শিক্ষা কনসালটেন্সি বা ইমিগ্রেশন আইন সংস্থা নয়। আমরা কোনো বিশ্ববিদ্যালয় থেকে শিক্ষার্থীর ভর্তির গ্যারান্টি কিংবা সংশ্লিষ্ট দেশের দূতাবাসের ভিসার ১০০% নিশ্চয়তা দিই না। ভিসা ও ভর্তি সম্পূর্ণভাবে শিক্ষার্থীর নিজস্ব মেধা, সঠিক কাগজপত্র এবং সংশ্লিষ্ট দেশের সরকারের অভিবাসন কর্তৃপক্ষের একক এখতিয়ার।"
              : "AbroadMate is an independent, non-commercial educational platform. We do not sell or offer 'guaranteed admissions' or '100% visa promises'. Visa issuance and university admissions remain strictly under the sovereign authority of official immigration departments and accredited institutions."}
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>{isBn ? "প্ল্যাটফর্মের প্রকৃতি ও উদ্দেশ্য" : "Nature and Purpose of AbroadMate"}</span>
            </h3>
            <p className="text-slate-600 text-sm">
              {isBn
                ? "AbroadMate বাংলাদেশের উচ্চাকাঙ্ক্ষী শিক্ষার্থীদের জন্য একটি মুক্ত, স্বাধীন ও এআই-পাওয়ার্ড স্বাবলম্বী তথ্যসেবা প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য শিক্ষার্থীদের আত্মবিশ্বাসী করা যাতে তারা কোনো মধ্যস্বত্বভোগী এজেন্সির খপ্পরে না পড়ে সরাসরি বিশ্বখ্যাত প্রতিষ্ঠানে আবেদন করতে সক্ষম হন।"
                : "AbroadMate is a completely free, self-service informational platform designed to empower Bangladeshi students to navigate their study abroad applications independently, without commercial agency brokers."}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>{isBn ? "অফিসিয়াল সোর্স ও তথ্যের যথার্থতা" : "Official Sources & Data Accuracy"}</span>
            </h3>
            <p className="text-slate-600 text-sm">
              {isBn
                ? "আমাদের প্ল্যাটফর্মে প্রদর্শিত যাবতীয় তথ্য সংশ্লিষ্ট দেশের সরকার ও দূতাবাসের উন্মুক্ত সরকারি পোর্টাল থেকে সংগৃহীত:"
                : "All regulatory criteria and visa metrics are benchmarked against official public portals:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>UK: UK Visas and Immigration (gov.uk/student-visa)</li>
              <li>Canada: Immigration, Refugees and Citizenship Canada (canada.ca)</li>
              <li>Australia: Department of Home Affairs (immi.homeaffairs.gov.au)</li>
              <li>Germany: German Federal Foreign Office & DAAD (make-it-in-germany.com)</li>
              <li>USA: U.S. Department of State - Bureau of Consular Affairs (travel.state.gov)</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>{isBn ? "শিক্ষার্থীদের নৈতিক আচরণবিধি ও ডকুমেন্ট জালিয়াতি নিষিদ্ধকরণ" : "Prohibition of Fraudulent Documents"}</span>
            </h3>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs sm:text-sm text-rose-900 space-y-2">
              <p>
                • <strong>{isBn ? "জিরো টলারেন্স নীতি:" : "Zero Tolerance:"}</strong>{" "}
                {isBn
                  ? "কোনো প্রকার ভুয়া বা জালিয়াতি করা শিক্ষাগত সনদ, নকল ব্যাংক স্টেটমেন্ট বা জাল রিকমেন্ডেশন লেটার তৈরি অথবা প্রদর্শন করা সম্পূর্ণ নিষিদ্ধ।"
                  : "Fabricating or uploading altered bank solvency certificates, fraudulent academic records, or forged recommendation letters is strictly prohibited."}
              </p>
              <p>
                {isBn
                  ? "• কোনো শিক্ষার্থী অনৈতিক তথ্য উপস্থাপন করলে তার প্রোফাইল অবিলম্বে স্থায়ীভাবে বাতিল করা হবে।"
                  : "• Any account associated with deliberate document falsification will be permanently terminated."}
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>{isBn ? "বাণিজ্যিক ব্যবহার ও এজেন্সির প্রবেশাধিকার নিষিদ্ধ" : "Ban on Commercial Exploitation"}</span>
            </h3>
            <p className="text-slate-600 text-sm">
              {isBn
                ? "AbroadMate শুধুমাত্র ব্যক্তিগতভাবে শিক্ষার্থীদের ব্যবহারের জন্য তৈরি। কোনো বাণিজ্যিক শিক্ষা পরামর্শক এজেন্সি, দালাল বা এজেন্ট আমাদের প্ল্যাটফর্মের টুলস, ক্যালকুলেটর বা ডেটা ব্যবহার করে কোনো শিক্ষার্থীর কাছ থেকে ফি বা অর্থ আদায় করতে পারবে না।"
                : "AbroadMate tools, calculators, and verified data may not be resold or used by commercial educational agencies to charge students service fees."}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                5
              </span>
              <span>{isBn ? "আইনি ও নীতি সহায়তা" : "Legal Correspondence"}</span>
            </h3>
            <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
              <Mail className="w-4 h-4" />
              <span>legal@abroadmate.org</span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
          >
            <span>{isBn ? "আমাদের গোপনীয়তা নীতি (Privacy Policy) পড়ুন" : "Read Privacy Policy"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
