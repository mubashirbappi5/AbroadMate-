"use client";

import React from "react";
import { useI18n } from "@/lib/i18n-context";
import { Check, X, AlertOctagon } from "lucide-react";

export function EthicalPledgeSection() {
  const { locale } = useI18n();
  const isBn = locale === "bn";

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{isBn ? "সচেতনতা ও সততা" : "Awareness & Integrity"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isBn
              ? "কেন এজেন্সি ছাড়া নিজের অ্যাপ্লিকেশন নিজে করবেন?"
              : "Why Apply Independently Without Agencies?"}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {isBn
              ? "বাংলাদেশে প্রতি বছর হাজারো শিক্ষার্থী অসৎ এজেন্সির মিথ্যা আশ্বাস ও অতিরিক্ত ফি-এর শিকার হন। AbroadMate আপনাকে দিচ্ছে সম্পূর্ণ নিয়ন্ত্রণ ও স্বচ্ছতা।"
              : "Every year thousands of Bangladeshi students fall victim to predatory agency fees and misleading promises. AbroadMate gives you 100% control, confidence, and transparency."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Agency Column */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-lg">
              <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-sm">✕</span>
              <span>{isBn ? "বাণিজ্যিক কনসালটেন্সি এজেন্সি" : "Commercial Agency Brokers"}</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "উচ্চ সার্ভিস চার্জ বা ফাইল ওপেনিং ফির দাবি করে (৫০,০০০ - ২,০০,০০০+ টাকা)।"
                    : "Demands high service charges or 'file opening' fees (BDT 50,000 - 200,000+)."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "যেসব নিম্নমানের কলেজ এজেন্টদের বেশি কমিশন দেয়, সেগুলোতে জোরপূর্বক ভর্তি করায়।"
                    : "Pushes low-tier private colleges that offer them 20-30% agent recruitment commissions."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "ভুল বা ভুয়া ব্যাংক সলভেন্সি ও সার্টিফিকেট সাজিয়ে ভিসার স্থায়ী নিষেধাজ্ঞা (Ban)-র ঝুঁকি তৈরি করে।"
                    : "Fabricates questionable bank solvency or fraudulent documents, risking multi-year visa bans."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "শিক্ষার্থীর অ্যাপ্লিকেশন পোর্টালের আইডি ও পাসওয়ার্ড নিজেরা গোপন রেখে জিম্মি করে।"
                    : "Withholds application portal login credentials and correspondence, holding students hostage."}
                </span>
              </li>
            </ul>
          </div>

          {/* AbroadMate Column */}
          <div className="bg-brand-50/60 border border-brand-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-brand-900 font-bold text-lg">
              <span className="w-6 h-6 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 text-sm">✓</span>
              <span>{isBn ? "AbroadMate প্ল্যাটফর্ম" : "AbroadMate Platform"}</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-800">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "সম্পূর্ণ ১০০% ফ্রি। কোনো ফাইল ওপেনিং চার্জ বা কোনো প্রিমিয়াম ফি নেই।"
                    : "100% Free forever. No file opening fees, no hidden subscriptions, zero commissions."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "সরাসরি বিশ্ববিদ্যালয়ের নিজস্ব অফিসিয়াল পোর্টালে সরাসরি আবেদন করার স্পষ্ট নির্দেশনা।"
                    : "Step-by-step guidance to apply directly through official, accredited university portals."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "সম্পূর্ণ জেনুইন ব্যাংক সলভেন্সি নিয়ম এবং দূতাবাস অনুমোদিত পদ্ধতির দিকনির্দেশনা।"
                    : "Verified, 100% legal bank solvency procedures adhering strictly to embassy regulations."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? "আপনার আবেদনপত্র, নথিপত্র এবং ব্যক্তিগত তথ্যের সম্পূর্ণ মালিকানা শুধুই আপনার হাতে।"
                    : "Full ownership of your application data, passwords, and documents remains in your hands."}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
