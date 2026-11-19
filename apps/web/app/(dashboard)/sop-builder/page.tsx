"use client";

import React, { useState } from "react";
import { FileText, Sparkles, Copy, Check, Info } from "lucide-react";
import { aiProvider } from "@abroadmate/ai";

export default function SopBuilderPage() {
  const [degree, setDegree] = useState("মাস্টার্স");
  const [major, setMajor] = useState("Computer Science & Engineering");
  const [country, setCountry] = useState("যুক্তরাজ্য");
  const [background, setBackground] = useState("বাংলাদেশে ৪ বছরের বিএসসি ডিগ্রি সম্পন্ন, সিজিপিএ ৩.৪৫।");
  const [careerGoals, setCareerGoals] = useState("ডাটা সায়েন্স ও এআই ইঞ্জিনিয়ারিংয়ে বিশেষজ্ঞ হয়ে দেশের টেক ইন্ডাস্ট্রিতে অবদান রাখা।");

  const [loading, setLoading] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const outline = await aiProvider.generateSopOutline(
        degree,
        major,
        country,
        background,
        careerGoals
      );
      setGeneratedOutline(outline);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedOutline) {
      navigator.clipboard.writeText(generatedOutline);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">এআই স্টেটমেন্ট অব পারপাস (SOP) বিল্ডার</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          আপনার নিজস্ব শিক্ষাগত পটভূমি ও লক্ষ্যের ভিত্তিতে একটি বিশ্বাসযোগ্য, সৎ ও আন্তর্জাতিক মানের এসওপি কাঠামো তৈরি করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-brand-700" />
            <span>প্রয়োজনীয় তথ্যাবলী</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">কাঙ্ক্ষিত ডিগ্রি</label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">পড়াশোনার বিষয় (Subject / Major)</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">কাঙ্ক্ষিত দেশ</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">পূর্ববর্তী একাডেমিক ব্যাকগ্রাউন্ড</label>
            <textarea
              rows={3}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ভবিষ্যৎ ক্যারিয়ার লক্ষ্য</label>
            <textarea
              rows={3}
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "এসওপি কাঠামো প্রস্তুত হচ্ছে..." : "এসওপি আউটলাইন তৈরি করুন"}</span>
            </button>
          </div>
        </form>

        {/* Output Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">জেনারেটেড এসওপি ড্রাফট ও নির্দেশনা</h2>
            {generatedOutline && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "কপি হয়েছে!" : "কপি করুন"}</span>
              </button>
            )}
          </div>

          {generatedOutline ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
              {generatedOutline}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs sm:text-sm">বামে আপনার তথ্য পূরণ করে জেনারেট বাটনে ক্লিক করুন।</p>
            </div>
          )}

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>সতর্কতা:</strong> এআই জেনারেট করা টেক্সট হুবহু কপি-পেস্ট না করে নিজের বাস্তব অভিজ্ঞতার সাথে সামঞ্জস্য রেখে সম্পাদনা করুন। এতে বিশ্ববিদ্যালয়ের প্লেজিয়ারিজম চেকার সহজেই পাশ হবে।
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
