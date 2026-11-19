"use client";

import React from "react";
import { CostCalculatorPreview } from "@/features/home/CostCalculatorPreview";
import { Coins, HelpCircle } from "lucide-react";

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">স্টাডি অ্যাব্রড খরচ ক্যালকুলেটর</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          টিউশন ফি, লিভিং কস্ট, ভিসা ফি এবং স্বাস্থ্য বীমার আনুমানিক খরচ বাংলাদেশি টাকায় (BDT) বিস্তারিত হিসাব করুন।
        </p>
      </div>

      <CostCalculatorPreview />
    </div>
  );
}
