"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Globe2,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  DollarSign,
  AlertCircle,
  FileCheck2,
  Share2,
} from "lucide-react";
import { formatBdt } from "@abroadmate/shared";

export default function UniversityDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [university, setUniversity] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUniversity() {
      try {
        setLoading(true);
        const res = await fetch(`/api/discovery/universities/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setUniversity(json.data);
        } else {
          setError(json.error || "বিশ্ববিদ্যালয়টি খুঁজে পাওয়া যায়নি।");
        }

        // Check if favorited
        const favRes = await fetch("/api/favorites");
        const favJson = await favRes.json();
        if (favJson.success && favJson.data) {
          setIsFavorited(favJson.data.some((f: any) => f.universityId === id));
        }
      } catch (err: any) {
        setError("তথ্য লোড করতে নেটওয়ার্ক সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchUniversity();
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "UNIVERSITY",
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
      <div className="max-w-5xl mx-auto py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">অফিসিয়াল ডাটাবেজ থেকে তথ্য যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">তথ্য পাওয়া যায়নি</h2>
        <p className="text-xs text-slate-600">{error || "বিশ্ববিদ্যালয়ের রেকর্ডটি খুঁজে পাওয়া যায়নি।"}</p>
        <Link
          href="/universities"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold shadow-xs hover:bg-brand-800"
        >
          <span>সকল বিশ্ববিদ্যালয়ে ফিরে যান</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Action Toast */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* 1. Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl">{university.country?.flagEmoji || "🌍"}</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {university.country?.nameBn || university.countryCode}
              </span>
              {university.worldRank && (
                <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold">
                  QS বিশ্ব র্যাঙ্কিং #{university.worldRank}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{university.verificationStatus === "VERIFIED" ? "অফিসিয়ালি ভেরিফাইড" : "পর্যালোচনায় রয়েছে"}</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {university.nameBn}
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">{university.nameEn}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {university.city}{university.stateOrProvince ? `, ${university.stateOrProvince}` : ""}, {university.country?.nameBn}
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

            {university.applicationUrl && (
              <a
                href={university.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>আবেদন পোর্টাল</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Official Accreditation Registry Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 uppercase font-semibold text-[11px] block">স্বীকৃতি প্রদানকারী কর্তৃপক্ষ</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{university.recognizingAuthority || "সরকারি শিক্ষা মন্ত্রণালয়"}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-semibold text-[11px] block">অফিসিয়াল রেজিস্ট্রি কোড</span>
            <span className="font-mono font-bold text-slate-800 mt-0.5 block">{university.institutionRegistryCode || "সরকারি ডাটাবেজ অন্তর্ভুক্ত"}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-semibold text-[11px] block">প্রতিষ্ঠান টাইপ</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {university.isPublic ? "পাবলিক / সরকারি বিশ্ববিদ্যালয়" : "অনুমোদিত প্রাইভেট প্রতিষ্ঠান"}
            </span>
          </div>
          {university.accreditationDetailsBn && (
            <div className="md:col-span-3 pt-2 border-t border-slate-200/80">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">অ্যাক্রিডিটেশন বিবরণ</span>
              <p className="text-slate-700 leading-relaxed text-xs">{university.accreditationDetailsBn}</p>
            </div>
          )}
        </div>

        {/* Quick Resource Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          {university.websiteUrl && (
            <a
              href={university.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
              <span>মূল ওয়েবসাইট</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
          {university.admissionsUrl && (
            <a
              href={university.admissionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>এডমিশন ইনফরমেশন</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
          {university.internationalStudentUrl && (
            <a
              href={university.internationalStudentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>ইন্টারন্যাশনাল স্টুডেন্ট অফিস</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>

      {/* 2. Offered Programs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">ভেরিফাইড প্রোগ্রামসমূহ</h2>
            <p className="text-xs text-slate-500 mt-0.5">এই বিশ্ববিদ্যালয় কর্তৃক পরিচালিত ডিগ্রি প্রোগ্রাম ও টিউশন বিবরণ</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            মোট প্রোগ্রাম: {university.programs?.length || 0}টি
          </span>
        </div>

        {(!university.programs || university.programs.length === 0) ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-600 font-semibold">তথ্য পর্যালোচনায় রয়েছে</p>
            <p className="text-[11px] text-slate-400">এই বিশ্ববিদ্যালয়ের প্রোগ্রামগুলো বর্তমানে অফিসিয়াল ডাটাবেজের সাথে ক্রসচেক করা হচ্ছে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {university.programs.map((prog: any) => {
              const bdtRate = university.country?.approxBdtRate || 1.0;
              const approxBdt = Math.round(prog.annualTuitionAmount * bdtRate);
              return (
                <div
                  key={prog.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-bold">
                        {prog.degreeLevel} • {prog.durationMonths} মাস
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">{prog.studyMode}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{prog.titleBn}</h3>
                      <p className="text-xs text-slate-500">{prog.titleEn}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">বাৎসরিক টিউশন</span>
                        <span className="font-bold text-brand-700">
                          {prog.annualTuitionAmount === 0 ? "টিউশন ফ্রি (€০)" : `${prog.tuitionCurrencyCode} ${prog.annualTuitionAmount.toLocaleString()}`}
                        </span>
                      </div>
                      {approxBdt > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">আনুমানিক টাকায়</span>
                          <span className="font-bold text-slate-900">{formatBdt(approxBdt)}</span>
                        </div>
                      )}
                    </div>

                    {prog.admissionRequirements && (
                      <div className="text-xs text-slate-600 flex items-center gap-3">
                        <span>IELTS: <strong>{prog.admissionRequirements.minIeltsOverall}</strong></span>
                        <span>CGPA: <strong>{prog.admissionRequirements.minGpaOrCgpa.toFixed(2)}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/programs/${prog.id}`}
                      className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                    >
                      <span>রিকোয়ারমেন্টস দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {prog.officialProgramUrl && (
                      <a
                        href={prog.officialProgramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
                      >
                        <span>কোর্স পেজ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Official Source Citations & Audit Proof */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800">অফিসিয়াল সোর্স ভেরিফিকেশন নিশ্চয়তা</p>
          <p className="text-[11px] leading-relaxed">
            এই বিশ্ববিদ্যালয়ের সকল তথ্য সরাসরি অফিশিয়াল ওয়েবসাইট এবং সংশ্লিষ্ট দেশের সরকারি উচ্চশিক্ষা রেজিস্ট্রি থেকে সংগ্রহ ও যাচাই করা হয়েছে। সর্বশেষ যাচাইয়ের তারিখ:{" "}
            <strong>{university.lastVerifiedAt ? new Date(university.lastVerifiedAt).toLocaleDateString("bn-BD") : "হালনাগাদ"}</strong>।
          </p>
        </div>
      </div>
    </div>
  );
}
