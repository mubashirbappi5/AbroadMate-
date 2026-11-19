"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  FileCheck2,
  Trash2,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-14 pb-14 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-700" />
            <span>শিক্ষার্থী ডেটা সুরক্ষা সনদ</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            গোপনীয়তা নীতি ও <span className="text-brand-700">ডেটা সুরক্ষা</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AbroadMate-এ আপনার তথ্য শতভাগ সুরক্ষিত। আমরা কোনো বাণিজ্যিক এজেন্সির কাছে শিক্ষার্থীদের তথ্য বিক্রি বা সরবরাহ করি না।
          </p>
          <div className="mt-4 text-xs font-medium text-slate-400">
            সর্বশেষ পরিমার্জন: নভেম্বর ২০২৬
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Core Guarantee Highlight Card */}
        <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-3xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-2.5 text-brand-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            <span>আমাদের অটুট অঙ্গীকার</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            কোনো বিজ্ঞাপনদাতা বা কনসালটেন্সি এজেন্সির কাছে আপনার ডেটা বিক্রি হবে না
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            বাংলাদেশে স্টাডি অ্যাব্রড শিক্ষার্থীদের সবচেয়ে বড় আতঙ্ক হলো বিভিন্ন কনসালটেন্সি থেকে বারবার বিরক্তিকর কল ও প্রতারণামূলক অফার পাওয়া। AbroadMate কোনো বাণিজ্যিক সংস্থা নয়; আমাদের সিস্টেমে প্রবেশ করানো আপনার ফোন নম্বর ও ইমেইল শুধুমাত্র আপনার অ্যাকাউন্টের নিরাপত্তা এবং সঠিক বিশ্ববিদ্যালয় ম্যাচিংয়ের উদ্দেশ্যেই সংরক্ষিত থাকে।
          </p>

          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-brand-200 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>জিরো-ডাটা শেয়ারিং পলিসি</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>২৫৬-বিট SSL এনক্রিপশন</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>যেকোনো সময় ডেটা ডিলিটের অধিকার</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ১
              </span>
              <span>আমরা যেসব তথ্য সংগ্রহ করি</span>
            </h3>
            <p className="text-slate-600 text-sm">
              আমাদের প্ল্যাটফর্মের সেবা কার্যকর ও ব্যক্তিগতকৃত করার জন্য আমরা সীমিত কিছু তথ্য সংগ্রহ করি:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>
                <strong>অ্যাকাউন্ট প্রোফাইল তথ্য:</strong> আপনার পুরো নাম, ইমেইল ঠিকানা, মোবাইল নম্বর এবং কাঙ্ক্ষিত ইনটেক ও দেশ।
              </li>
              <li>
                <strong>শিক্ষাগত তথ্য (ঐচ্ছিক কিন্তু সহায়ক):</strong> আপনার এসএসসি/এইচএসসি বা স্নাতক জিপিএ/সিজিপিএ, পাসের সন এবং মূল বিভাগ।
              </li>
              <li>
                <strong>ইংরেজি ভাষা দক্ষতার স্কোর:</strong> আইইএলটিএস, পিটিই, টোফেল বা ডুয়োলিঙ্গো ব্যান্ডের তথ্য।
              </li>
              <li>
                <strong>আপনার প্রস্তুতকৃত ড্রাফট:</strong> এসওপি জেনারেটরে আপনার লেখা নোটস, পছন্দের বিশ্ববিদ্যালয়ের শর্টলিস্ট ও রোডম্যাপ ট্র্যাকিং স্ট্যাটাস।
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ২
              </span>
              <span>সংগৃহীত তথ্যের সঠিক ব্যবহার</span>
            </h3>
            <p className="text-slate-600 text-sm">
              আমরা আপনার তথ্য শুধুমাত্র নিম্নলিখিত সৎ উদ্দেশ্যেই ব্যবহার করি:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>আপনার যোগ্যতার সাথে মানানসই সরকারি বিশ্ববিদ্যালয় ও স্কলারশিপ ফিল্টার করে প্রদর্শন করা।</li>
              <li>টাকায় আপনার পড়াশোনা ও জীবনযাত্রার বাস্তবসম্মত খরচের হিসাব প্রদান করা।</li>
              <li>আপনার নিজস্ব ইউনিক এসওপি (SOP) ড্রাফটিংয়ে সহায়তা করা।</li>
              <li>ভিসা নীতিমালা পরিবর্তন বা গুরুত্বপূর্ণ ডেডলাইন সংক্রান্ত জরুরি অ্যালার্ট পাঠানো (যদি আপনি নোটিফিকেশন অন রাখেন)।</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ৩
              </span>
              <span>তৃতীয় পক্ষের কাছে তথ্য অপ্রকাশযোগ্যতা (Zero Third-Party Sharing)</span>
            </h3>
            <p className="text-slate-600 text-sm">
              AbroadMate স্পষ্টভাবে ঘোষণা করছে যে:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
              <p>
                • আমরা কোনো শিক্ষার্থী ডেটা লিড জেনারেশন কোম্পানি, বেসরকারি কোচিং সেন্টার বা বাণিজ্যিক শিক্ষা কনসালটেন্সির কাছে বিক্রয় বা হস্তান্তর করি না।
              </p>
              <p>
                • আমরা বিশ্ববিদ্যালয়ের অফিসিয়াল লিঙ্কিং ছাড়া কোনো থার্ড-পার্টি রিডাইরেকশন ট্র্যাকার বা অনৈতিক স্পাইওয়্যার ব্যবহার করি না।
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ৪
              </span>
              <span>আপনার অধিকার ও ডেটা মুছে ফেলা (Right to Deletion)</span>
            </h3>
            <p className="text-slate-600 text-sm">
              আপনার তথ্যের পূর্ণ নিয়ন্ত্রণ আপনার হাতে। আপনি যেকোনো সময় আপনার প্রোফাইল সেটিংস থেকে সমস্ত তথ্য সম্পাদনা করতে পারবেন অথবা আপনার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলার আবেদন করতে পারবেন। অ্যাকাউন্ট মুছে ফেললে আমাদের ডেটাবেস থেকে আপনার নাম, নম্বর ও সংরক্ষিত সমস্ত ফাইল চিরতরে বিলুপ্ত করা হবে।
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                ৫
              </span>
              <span>যোগাযোগ ও প্রাইভেসি হেল্পডেস্ক</span>
            </h3>
            <p className="text-slate-600 text-sm">
              আমাদের গোপনীয়তা নীতি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের ডাটা প্রোটেকশন টিমের সাথে যোগাযোগ করতে পারেন:
            </p>
            <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
              <Mail className="w-4 h-4" />
              <span>privacy@abroadmate.org</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
          >
            <span>আমাদের ব্যবহারবিধির শর্তাবলী (Terms & Conditions) দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
