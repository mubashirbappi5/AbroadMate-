"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  BookOpen,
  ArrowRight,
  FileCheck2,
  Coins,
  Check,
} from "lucide-react";
import { formatBdt } from "@abroadmate/shared";

export default function ProgramDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgram() {
      try {
        setLoading(true);
        const res = await fetch(`/api/discovery/programs/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProgram(json.data);
        } else {
          setError(json.error || "প্রোগ্রামটি খুঁজে পাওয়া যায়নি।");
        }

        // Check if favorited
        const favRes = await fetch("/api/favorites");
        const favJson = await favRes.json();
        if (favJson.success && favJson.data) {
          setIsFavorited(favJson.data.some((f: any) => f.programId === id));
        }
      } catch (err) {
        setError("তথ্য লোড করতে নেটওয়ার্ক সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProgram();
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "PROGRAM",
          targetId: id,
          category: "TARGET",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsFavorited(true);
        setActionSuccess("শর্টলিস্টে সফলভাবে যুক্ত হয়েছে!");
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        alert(json.error || "শর্টলিস্টে যোগ করতে লগইন করুন।");
      }
    } catch (err) {
      console.error("Save favorite error:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">প্রোগ্রামের তথ্য ক্রসচেক করা হচ্ছে...</p>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">তথ্য পাওয়া যায়নি</h2>
        <p className="text-xs text-slate-600">{error || "প্রোগ্রামের রেকর্ডটি পাওয়া যায়নি।"}</p>
        <Link
          href="/universities"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold shadow-xs hover:bg-brand-800"
        >
          <span>প্রোগ্রাম ডিরেক্টরিতে ফিরে যান</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const req = program.admissionRequirements;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Toast */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* 1. Program Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold">
                {program.degreeLevel} • {program.durationMonths} মাস
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {program.studyMode === "FULL_TIME" ? "ফুল-টাইম" : program.studyMode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>অফিসিয়ালি ভেরিফাইড কোর্স</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {program.titleBn}
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">{program.titleEn}</p>
            </div>

            {/* University Link */}
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Building2 className="w-4 h-4 text-brand-700 shrink-0" />
              <Link
                href={`/universities/${program.university?.id}`}
                className="font-bold hover:text-brand-700 underline underline-offset-2"
              >
                {program.university?.nameBn} ({program.university?.nameEn})
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {program.university?.city}, {program.university?.country?.nameBn} {program.university?.country?.flagEmoji}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
            <button
              onClick={handleToggleFavorite}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                isFavorited
                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isFavorited ? "শর্টলিস্টে আছে ✓" : "শর্টলিস্টে যোগ করুন"}</span>
            </button>

            {program.officialProgramUrl && (
              <a
                href={program.officialProgramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>অফিসিয়াল কোর্স পেজ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Tuition Fee Breakdown Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-brand-300 uppercase tracking-wider font-semibold">বাৎসরিক টিউশন ফি</span>
            <p className="text-2xl font-black text-white">
              {program.annualTuitionAmount === 0
                ? "টিউশন ফ্রি (€০ জার্মানি)"
                : `${program.tuitionCurrencyCode} ${program.annualTuitionAmount.toLocaleString()}`}
            </p>
          </div>

          {program.approxTuitionBdt && program.approxTuitionBdt > 0 && (
            <div className="sm:text-right space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">আনুমানিক বাংলাদেশি টাকায়</span>
              <p className="text-xl font-bold text-brand-300">
                {formatBdt(program.approxTuitionBdt)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Admission Requirements Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-700" />
            <span>ভর্তি ও যোগ্যতার আবশ্যিক শর্তাবলী (Admission Requirements)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            সরাসরি বিশ্ববিদ্যালয়ের আন্তর্জাতিক ভর্তি নির্দেশিকা থেকে সংগৃহীত নূন্যতম স্কোর।
          </p>
        </div>

        {req ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">CGPA আবশ্যকতা</span>
              <p className="text-lg font-bold text-slate-900">
                {req.minGpaOrCgpa.toFixed(2)} / {req.gpaScale.toFixed(1)}
              </p>
              <span className="text-[11px] text-slate-500">৪.০০ বা ৫.০০ স্কেলে সমমান</span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 space-y-1">
              <span className="text-brand-600 font-semibold uppercase text-[10px]">IELTS Overall</span>
              <p className="text-lg font-bold text-brand-800">{req.minIeltsOverall}</p>
              <span className="text-[11px] text-brand-700">নূন্যতম ওভারঅল ব্যান্ড</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">IELTS প্রতিটি ব্যান্ড</span>
              <p className="text-lg font-bold text-slate-900">{req.minIeltsEachBand}</p>
              <span className="text-[11px] text-slate-500">L, R, W, S পৃথক শর্ত</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">GRE / GMAT</span>
              <p className="text-lg font-bold text-slate-900">
                {req.greRequired ? "আবশ্যক (Required)" : "প্রয়োজন নেই (Waived)"}
              </p>
              <span className="text-[11px] text-slate-500">আন্তর্জাতিক আবেদনকারী</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">এই কোর্সের বিস্তারিত রিকোয়ারমেন্ট বর্তমানে পর্যালোচনায় রয়েছে।</p>
        )}

        {/* Prerequisites Notes */}
        {program.prerequisitesBn && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <span className="font-bold text-slate-800 block">পূর্বশর্ত ও শিক্ষাগত ব্যাকগ্রাউন্ড:</span>
            <p className="text-slate-700 leading-relaxed">{program.prerequisitesBn}</p>
          </div>
        )}

        {req?.notesBn && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1 text-amber-900">
            <span className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>বাংলাদেশি শিক্ষার্থীদের জন্য বিশেষ নির্দেশনা:</span>
            </span>
            <p className="text-amber-800 leading-relaxed">{req.notesBn}</p>
          </div>
        )}
      </div>

      {/* 3. Intakes & Deadlines */}
      {program.intakes && program.intakes.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-700" />
              <span>ইনটেক সেশন ও আবেদনের সময়সীমা (Deadlines)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">অফিসিয়াল ইনটেক ও শেষ তারিখসমূহ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {program.intakes.map((intake: any) => (
              <div key={intake.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {intake.season} {intake.year}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold">
                    ইনটেক
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">আবেদনের শেষ তারিখ</span>
                  <p className="font-bold text-rose-700 mt-0.5">
                    {new Date(intake.applicationDeadline).toLocaleDateString("bn-BD")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Official Registry Verification Seal */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">অফিসিয়াল সোর্স নিশ্চয়তা</p>
          <p className="text-[11px] leading-relaxed">
            এই প্রোগ্রামের ডিগ্রি কারিকুলাম ও টিউশন ফি সরাসরি বিশ্ববিদ্যালয় ও সংশ্লিষ্ট দেশের অনুমোদিত সরকারি রেগুলেটরি বডি (UK HESA / IRCC DLI / TEQSA / Anabin) থেকে যাচাইকৃত।
          </p>
        </div>
      </div>
    </div>
  );
}
