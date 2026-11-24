"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { generatePersonalizedRoadmap } from "@abroadmate/roadmap-engine";
import { Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RoadmapTimelinePreview() {
  const { locale } = useI18n();
  const isBn = locale === "bn";

  const [selectedSeason, setSelectedSeason] = useState<"fall" | "spring">("fall");
  const roadmapSteps = generatePersonalizedRoadmap("GB", selectedSeason, 2026);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-100/60 px-3 py-1 rounded-full border border-brand-200">
              {isBn ? "ধাপ অনুযায়ী প্রস্তুতি" : "Structured Timeline"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {isBn ? "আপনার উচ্চশিক্ষার সময়রেখা (Roadmap)" : "Your Study Abroad Roadmap"}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {isBn
                ? "ইনটেকের অন্তত ১২-১৪ মাস পূর্বে থেকে ধাপে ধাপে কী কী কাজ সম্পন্ন করতে হবে তার নিখুঁত পরিকল্পনা।"
                : "A clear step-by-step master plan starting 12-14 months prior to your target university intake."}
            </p>
          </div>

          {/* Intake Season Picker */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setSelectedSeason("fall")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                selectedSeason === "fall"
                  ? "bg-brand-700 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isBn ? "ফল ইনটেক (সেপ্টেম্বর ২০২৬)" : "Fall Intake (Sept 2026)"}
            </button>
            <button
              onClick={() => setSelectedSeason("spring")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                selectedSeason === "spring"
                  ? "bg-brand-700 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isBn ? "স্প্রিং ইনটেক (জানুয়ারি ২০২৭)" : "Spring Intake (Jan 2027)"}
            </button>
          </div>
        </div>

        {/* Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {roadmapSteps.map((step) => {
            const title = isBn || !step.titleEn ? step.titleBn : step.titleEn;
            const tasks = isBn || !step.tasksEn?.length ? step.tasksBn : step.tasksEn;
            return (
              <div
                key={step.stageNumber}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-brand-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                      {step.stageNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60">
                      {step.monthsBeforeIntake}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {title}
                  </h3>

                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-brand-600 font-bold">•</span>
                        <span className="line-clamp-2">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                  {isBn ? `পর্যায় ${step.stageNumber} অফ ৫` : `Stage ${step.stageNumber} of 5`}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-5 py-2.5 rounded-xl border border-brand-200 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>
              {isBn
                ? "আপনার প্রোফাইলের জন্য কাস্টমাইজড রোডম্যাপ ও ডেডলাইন দেখুন"
                : "View Personalized Roadmap & Upcoming Deadlines"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
