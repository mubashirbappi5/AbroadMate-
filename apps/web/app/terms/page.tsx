"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldAlert,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Mail,
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-14 pb-14 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold mb-4">
            <Scale className="w-4 h-4 text-brand-700" />
            <span>আইনি নীতিমালা ও আচরণবিধি</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            ব্যবহারবিধির <span className="text-brand-700">শর্তাবলী ও নীতিমালা</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AbroadMate প্ল্যাটফর্ম ব্যবহারের পূর্বে অনুগ্রহ করে আমাদের শর্তাবলী ও নন-এজেন্সি আইনি অস্বীকৃতি মনোযোগ দিয়ে পড়ুন।
          </p>
          <div className="mt-4 text-xs font-medium text-slate-400">
            সর্বশেষ পরিমার্জন: নভেম্বর ২০২৬
          </div>
        </div>
      </section>

      {/* Main Terms Document */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Anti-Agency Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 mb-10 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>গুরুত্বপূর্ণ আইনি অস্বীকৃতি (Legal Disclaimer)</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            AbroadMate কোনো বাণিজ্যিক শিক্ষা কনসালটেন্সি বা ইমিগ্রেশন আইন সংস্থা নয়। আমরা কোনো বিশ্ববিদ্যালয় থেকে শিক্ষার্থীর ভর্তির গ্যারান্টি কিংবা সংশ্লিষ্ট দেশের দূতাবাসের ভিসার ১০০% নিশ্চয়তা দিই না। ভিসা ও ভর্তি সম্পূর্ণভাবে শিক্ষার্থীর নিজস্ব মেধা, সঠিক কাগজপত্র এবং সংশ্লিষ্ট দেশের সরকারের অভিবাসন কর্তৃপক্ষের একক এখতিয়ার।
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ১
              </span>
              <span>প্ল্যাটফর্মের প্রকৃতি ও উদ্দেশ্য</span>
            </h3>
            <p className="text-slate-600 text-sm">
              AbroadMate বাংলাদেশের উচ্চাকাঙ্ক্ষী শিক্ষার্থীদের জন্য একটি মুক্ত, স্বাধীন ও এআই-পাওয়ার্ড স্বাবলম্বী তথ্যসেবা প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য শিক্ষার্থীদের আত্মবিশ্বাসী করা যাতে তারা কোনো মধ্যস্বত্বভোগী এজেন্সির খপ্পরে না পড়ে সরাসরি বিশ্বখ্যাত প্রতিষ্ঠানে আবেদন করতে সক্ষম হন।
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ২
              </span>
              <span>অফিসিয়াল সোর্স ও তথ্যের যথার্থতা</span>
            </h3>
            <p className="text-slate-600 text-sm">
              আমাদের প্ল্যাটফর্মে প্রদর্শিত যাবতীয় তথ্য সংশ্লিষ্ট দেশের সরকার ও দূতাবাসের উন্মুক্ত সরকারি পোর্টাল থেকে সংগৃহীত:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>যুক্তরাজ্য: UK Visas and Immigration (gov.uk/student-visa)</li>
              <li>কানাডা: Immigration, Refugees and Citizenship Canada (canada.ca)</li>
              <li>অস্ট্রেলিয়া: Department of Home Affairs (immi.homeaffairs.gov.au)</li>
              <li>জার্মানি: German Federal Foreign Office & DAAD (make-it-in-germany.com)</li>
              <li>যুক্তরাষ্ট্র: U.S. Department of State - Bureau of Consular Affairs (travel.state.gov)</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              * আন্তর্জাতিক অভিবাসন নীতিমালা ও মুদ্রার বিনিময় হার (BDT Conversion) প্রতিনিয়ত পরিবর্তিত হয়। শিক্ষার্থীদের আবেদনের চূড়ান্ত ধাপে অফিশিয়াল লিংক থেকে তথ্য ক্রস-চেক করার অনুরোধ করা হচ্ছে।
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ৩
              </span>
              <span>শিক্ষার্থীদের নৈতিক আচরণবিধি ও ডকুমেন্ট জালিয়াতি নিষিদ্ধকরণ</span>
            </h3>
            <p className="text-slate-600 text-sm">
              AbroadMate উচ্চশিক্ষায় শতভাগ সততা ও স্বচ্ছতায় বিশ্বাস করে:
            </p>
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs sm:text-sm text-rose-900 space-y-2">
              <p>
                • <strong>জিরো টলারেন্স নীতি:</strong> কোনো প্রকার ভুয়া বা জালিয়াতি করা শিক্ষাগত সনদ, নকল ব্যাংক স্টেটমেন্ট বা জাল রিকমেন্ডেশন লেটার তৈরি অথবা প্রদর্শন করা সম্পূর্ণ নিষিদ্ধ।
              </p>
              <p>
                • কোনো শিক্ষার্থী অনৈতিক তথ্য উপস্থাপন করলে তার প্রোফাইল অবিলম্বে স্থায়ীভাবে বাতিল করা হবে।
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ৪
              </span>
              <span>বাণিজ্যিক ব্যবহার ও এজেন্সির প্রবেশাধিকার নিষিদ্ধ</span>
            </h3>
            <p className="text-slate-600 text-sm">
              AbroadMate শুধুমাত্র ব্যক্তিগতভাবে শিক্ষার্থীদের ব্যবহারের জন্য তৈরি। কোনো বাণিজ্যিক শিক্ষা পরামর্শক এজেন্সি, দালাল বা এজেন্ট আমাদের প্ল্যাটফর্মের টুলস, ক্যালকুলেটর বা ডেটা ব্যবহার করে কোনো শিক্ষার্থীর কাছ থেকে ফি বা অর্থ আদায় করতে পারবে না। এরূপ কার্যকলাপ সম্পূর্ণ বেআইনি এবং কপিরাইট লঙ্ঘনের আওতায় পড়বে।
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ৫
              </span>
              <span>দায়বদ্ধতার সীমাবদ্ধতা (Limitation of Liability)</span>
            </h3>
            <p className="text-slate-600 text-sm">
              আমাদের প্ল্যাটফর্মের তথ্য সর্বোচ্চ যত্নসহকারে নিয়মিত হালনাগাদ করা হয়। তবে কোনো বিশ্ববিদ্যালয় যদি তাদের শর্ত পরিবর্তন করে, কিংবা কোনো দূতাবাস যদি শিক্ষার্থীর ভিসা আবেদন প্রত্যাখ্যান করে, তার জন্য AbroadMate আইনগত বা আর্থিকভাবে দায়ী থাকবে না।
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ৬
              </span>
              <span>আইনি ও নীতি সহায়তা</span>
            </h3>
            <p className="text-slate-600 text-sm">
              শর্তাবলী বা নৈতিক নির্দেশিকা সংক্রান্ত যেকোনো আইনি প্রশ্নের জন্য যোগাযোগ করুন:
            </p>
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
            <span>আমাদের গোপনীয়তা নীতি (Privacy Policy) পড়ুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
