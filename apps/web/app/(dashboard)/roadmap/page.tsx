"use client";

import React, { useState } from "react";
import { generatePersonalizedRoadmap } from "@abroadmate/roadmap-engine";
import { Compass, CheckCircle2, Circle, Calendar, AlertCircle } from "lucide-react";

export default function RoadmapPage() {
  const [targetSeason, setTargetSeason] = useState<"fall" | "spring">("fall");
  const [targetYear, setTargetYear] = useState<number>(2026);

  const steps = generatePersonalizedRoadmap("GB", targetSeason, targetYear);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ইনটেকভিত্তিক উচ্চশিক্ষা রোডম্যাপ</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            আপনার কাঙ্ক্ষিত শিক্ষাবর্ষের সাথে মিলিয়ে নির্দিষ্ট সময়সীমার মধ্যে প্রতিটি মাইলস্টোন সম্পন্ন করার রোডম্যাপ।
          </p>
        </div>

        {/* Season Picker */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setTargetSeason("fall")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              targetSeason === "fall"
                ? "bg-brand-700 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ফল ইনটেক ২০২৬
          </button>
          <button
            onClick={() => setTargetSeason("spring")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              targetSeason === "spring"
                ? "bg-brand-700 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            স্প্রিং ইনটেক ২০২৭
          </button>
        </div>
      </div>

      {/* Vertical Timeline Steps */}
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.stageNumber} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row gap-6">
            <div className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
              <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 text-sm font-bold flex items-center justify-center mb-2">
                ধাপ {s.stageNumber}
              </span>
              <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/60 inline-block">
                {s.monthsBeforeIntake}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{s.titleBn}</h3>
              <span className="text-xs text-slate-400">{s.titleEn}</span>
            </div>

            <div className="flex-1 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                এই ধাপে যা যা করতে হবে:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {s.tasksBn.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
