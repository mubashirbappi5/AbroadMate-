"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const { locale } = useI18n();
  const isBn = locale === "bn";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-14 pb-14 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-700" />
            <span>{isBn ? "শিক্ষার্থী ডেটা সুরক্ষা সনদ" : "Student Data Protection Charter"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            {isBn ? (
              <>
                গোপনীয়তা নীতি ও <span className="text-brand-700">ডেটা সুরক্ষা</span>
              </>
            ) : (
              <>
                Privacy Policy & <span className="text-brand-700">Data Protection</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "AbroadMate-এ আপনার তথ্য শতভাগ সুরক্ষিত। আমরা কোনো বাণিজ্যিক এজেন্সির কাছে শিক্ষার্থীদের তথ্য বিক্রি বা সরবরাহ করি না।"
              : "Your data is 100% private. We never sell, lease, or share student records with commercial agencies or third-party brokers."}
          </p>
          <div className="mt-4 text-xs font-medium text-slate-400">
            {isBn ? "সর্বশেষ পরিমার্জন: নভেম্বর ২০২৬" : "Last updated: November 2026"}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Core Guarantee Highlight Card */}
        <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-3xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-2.5 text-brand-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            <span>{isBn ? "আমাদের অটুট অঙ্গীকার" : "Our Ironclad Guarantee"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {isBn
              ? "কোনো বিজ্ঞাপনদাতা বা কনসালটেন্সি এজেন্সির কাছে আপনার ডেটা বিক্রি হবে না"
              : "Your Contact Details Will Never Be Sold to Agencies"}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isBn
              ? "বাংলাদেশে স্টাডি অ্যাব্রড শিক্ষার্থীদের সবচেয়ে বড় আতঙ্ক হলো বিভিন্ন কনসালটেন্সি থেকে বারবার বিরক্তিকর কল ও প্রতারণামূলক অফার পাওয়া। AbroadMate কোনো বাণিজ্যিক সংস্থা নয়; আমাদের সিস্টেমে প্রবেশ করানো আপনার ফোন নম্বর ও ইমেইল শুধুমাত্র আপনার অ্যাকাউন্টের নিরাপত্তা এবং সঠিক বিশ্ববিদ্যালয় ম্যাচিংয়ের উদ্দেশ্যেই সংরক্ষিত থাকে।"
              : "Students in Bangladesh frequently suffer unsolicited marketing calls from aggressive agencies. AbroadMate is completely non-commercial; your profile, email, and phone number exist solely for your own academic tracking and authenticated access."}
          </p>

          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-brand-200 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{isBn ? "জিরো-ডাটা শেয়ারিং পলিসি" : "Zero Data Sharing"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{isBn ? "২৫৬-বিট SSL এনক্রিপশন" : "256-bit Encryption"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{isBn ? "যেকোনো সময় ডেটা ডিলিটের অধিকার" : "Right to Complete Deletion"}</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>{isBn ? "আমরা যেসব তথ্য সংগ্রহ করি" : "Information We Collect"}</span>
            </h3>
            <p className="text-slate-600 text-sm">
              {isBn
                ? "আমাদের প্ল্যাটফর্মের সেবা কার্যকর ও ব্যক্তিগতকৃত করার জন্য আমরা সীমিত কিছু তথ্য সংগ্রহ করি:"
                : "To tailor your eligibility checks and roadmaps, we collect minimal, essential information:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>
                <strong>{isBn ? "অ্যাকাউন্ট প্রোফাইল তথ্য:" : "Account Profile:"}</strong>{" "}
                {isBn
                  ? "আপনার পুরো নাম, ইমেইল ঠিকানা, মোবাইল নম্বর এবং কাঙ্ক্ষিত ইনটেক ও দেশ।"
                  : "Your name, verified email, mobile number, and target intake season."}
              </li>
              <li>
                <strong>{isBn ? "শিক্ষাগত তথ্য (ঐচ্ছিক):" : "Academic Records (Optional):"}</strong>{" "}
                {isBn
                  ? "আপনার এসএসসি/এইচএসসি বা স্নাতক জিপিএ/সিজিপিএ, পাসের সন এবং মূল বিভাগ।"
                  : "Your SSC/HSC or Bachelor's GPA, passing year, and academic discipline."}
              </li>
              <li>
                <strong>{isBn ? "ইংরেজি ভাষা দক্ষতা:" : "English Proficiency Scores:"}</strong>{" "}
                {isBn
                  ? "আইইএলটিএস, পিটিই, টোফেল বা ডুয়োলিঙ্গো ব্যান্ডের তথ্য।"
                  : "Overall band scores for IELTS, PTE, or TOEFL."}
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>{isBn ? "সংগৃহীত তথ্যের সঠিক ব্যবহার" : "How We Use Your Data"}</span>
            </h3>
            <p className="text-slate-600 text-sm">
              {isBn
                ? "আমরা আপনার তথ্য শুধুমাত্র নিম্নলিখিত সৎ উদ্দেশ্যেই ব্যবহার করি:"
                : "Your information is used strictly to power your personalized tools:"}
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>{isBn ? "আপনার যোগ্যতার সাথে মানানসই সরকারি বিশ্ববিদ্যালয় ও স্কলারশিপ ফিল্টার করে প্রদর্শন করা।" : "Filter matching university courses and scholarships based on real cutoffs."}</li>
              <li>{isBn ? "টাকায় আপনার পড়াশোনা ও জীবনযাত্রার বাস্তবসম্মত খরচের হিসাব প্রদান করা।" : "Compute accurate first-year study budgets and solvency amounts in BDT."}</li>
              <li>{isBn ? "আপনার নিজস্ব ইউনিক এসওপি (SOP) ড্রাফটিংয়ে সহায়তা করা।" : "Generate tailored SOP outlines reflecting your true academic story."}</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>{isBn ? "তৃতীয় পক্ষের কাছে তথ্য অপ্রকাশযোগ্যতা (Zero Third-Party Sharing)" : "Strict Zero Third-Party Sharing"}</span>
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
              <p>
                {isBn
                  ? "• আমরা কোনো শিক্ষার্থী ডেটা লিড জেনারেশন কোম্পানি, বেসরকারি কোচিং সেন্টার বা বাণিজ্যিক শিক্ষা কনসালটেন্সির কাছে বিক্রয় বা হস্তান্তর করি না।"
                  : "• AbroadMate strictly prohibits selling, licensing, or distributing student data to lead brokers or consultancy agencies."}
              </p>
              <p>
                {isBn
                  ? "• আমরা বিশ্ববিদ্যালয়ের অফিসিয়াল লিঙ্কিং ছাড়া কোনো থার্ড-পার্টি রিডাইরেকশন ট্র্যাকার বা অনৈতিক স্পাইওয়্যার ব্যবহার করি না।"
                  : "• All university and visa outbound links route directly to official .edu, .ac.uk, or government portal domains."}
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>{isBn ? "আপনার অধিকার ও ডেটা মুছে ফেলা (Right to Deletion)" : "Right to Data Erasure"}</span>
            </h3>
            <p className="text-slate-600 text-sm">
              {isBn
                ? "আপনার তথ্যের পূর্ণ নিয়ন্ত্রণ আপনার হাতে। আপনি যেকোনো সময় আপনার প্রোফাইল সেটিংস থেকে সমস্ত তথ্য সম্পাদনা করতে পারবেন অথবা আপনার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলার আবেদন করতে পারবেন।"
                : "You maintain full sovereignty over your data. You may export or permanently delete your account and all associated drafts at any time."}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                5
              </span>
              <span>{isBn ? "যোগাযোগ ও প্রাইভেসি হেল্পডেস্ক" : "Privacy Inquiries"}</span>
            </h3>
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
            <span>{isBn ? "আমাদের ব্যবহারবিধির শর্তাবলী (Terms & Conditions) দেখুন" : "Read Terms & Conditions"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
