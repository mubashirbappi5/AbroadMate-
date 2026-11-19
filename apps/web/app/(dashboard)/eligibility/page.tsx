"use client";

import React, { useState } from "react";
import { QuickEligibilityWidget } from "@/features/home/QuickEligibilityWidget";
import { CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

export default function EligibilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">অ্যাডমিশন যোগ্যতা যাচাই ইঞ্জিন</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          বিশ্ববিদ্যালয়গুলোর নির্ধারিত কাট-অফ জিপিএ ও আইইএলটিএস ব্যান্ডের সাথে আপনার বর্তমান প্রোফাইল মিলিয়ে সরাসরি অ্যাডমিশন পাওয়ার সম্ভাবনা যাচাই করুন।
        </p>
      </div>

      <QuickEligibilityWidget />

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-700" />
          <span>বাংলাদেশি শিক্ষার্থীদের জন্য যোগ্যতা সংক্রান্ত জরুরি গাইড</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <span className="font-bold text-slate-900 block">এইচএসসি-র পর সরাসরি ব্যাচেলর ভর্তি:</span>
            <p className="leading-relaxed">
              যুক্তরাজ্য ও অস্ট্রেলিয়ায় সাধারণ এইচএসসি জিপিএ ৪.০+ থাকলে সরাসরি অথবা ফাউন্ডেশন/ইন্টারন্যাশনাল ইয়ার ওয়ান প্রোগ্রামে ভর্তি হওয়া যায়। জার্মানিতে ব্যাচেলর করতে এইচএসসি-র পর বাংলাদেশে ১ বছর বিশ্ববিদ্যালয়ে অধ্যয়ন অথবা স্টুডিয়ানকলেগ (Studienkolleg) প্রয়োজন হয়।
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <span className="font-bold text-slate-900 block">মাস্টার্স কোর্সে সিজিপিএ সমমান:</span>
            <p className="leading-relaxed">
              যুক্তরাজ্যের ২:১ সমমানের জন্য সাধারণত সিজিপিএ ৩.০০ - ৩.২৫ প্রয়োজন হয়। টপ-টিয়ার বিশ্ববিদ্যালয়ে ৩.৪০+ প্রাধান্য পায়। আইইএলটিএস ব্যান্ড ওভারঅল ৬.৫ (প্রতিটি ব্যান্ডে ন্যূনতম ৬.০) সবচেয়ে বেশি গ্রহণযোগ্য।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
