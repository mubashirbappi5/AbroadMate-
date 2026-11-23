"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  Printer,
  History,
  AlertCircle,
  HelpCircle,
  Wand2,
  RefreshCw,
  Eye,
  Sliders,
  Award,
  ChevronRight,
  BookOpen,
  Send,
  X,
  FileCheck2,
} from "lucide-react";
import { SopSectionKey, SopTone } from "@abroadmate/ai";

interface SectionContent {
  introductionMotivation: string;
  academicBackground: string;
  workResearchExperience: string;
  whyThisUniversity: string;
  careerGoalsContribution: string;
}

const SECTION_LABELS: Record<SopSectionKey, { titleBn: string; titleEn: string; icon: string }> = {
  introductionMotivation: { titleBn: "১. ভূমিকা ও বিষয়ের অনুপ্রেরণা", titleEn: "Introduction & Academic Spark", icon: "🌱" },
  academicBackground: { titleBn: "২. পূর্ববর্তী একাডেমিক ভিত্তি", titleEn: "Academic Foundation & Projects", icon: "🎓" },
  workResearchExperience: { titleBn: "৩. কর্ম ও গবেষণার অভিজ্ঞতা", titleEn: "Work & Laboratory Experience", icon: "💼" },
  whyThisUniversity: { titleBn: "৪. কেন এই বিশ্ববিদ্যালয় ও দেশ", titleEn: "Why this Program & Faculty", icon: "🏛️" },
  careerGoalsContribution: { titleBn: "৫. ক্যারিয়ার লক্ষ্য ও বাংলাদেশে অবদান", titleEn: "Career Goals & Contribution", icon: "🇧🇩" },
};

export default function SopBuilderPage() {
  const [activeTab, setActiveTab] = useState<SopSectionKey | "fullDocument">("fullDocument");
  const [degree, setDegree] = useState("মাস্টার্স");
  const [major, setMajor] = useState("Advanced Computer Science");
  const [university, setUniversity] = useState("University of Manchester");
  const [country, setCountry] = useState("যুক্তরাজ্য");
  const [background, setBackground] = useState("বিএসসি ইন সিএসই, সিজিপিএ ৩.৮০, ফাইনাল ইয়ার থিসিস অন মেশিন লার্নিং।");
  const [workExperience, setWorkExperience] = useState("১ বছরের সফটওয়্যার ইঞ্জিনিয়ার হিসেবে কাজ করার অভিজ্ঞতা।");
  const [careerGoals, setCareerGoals] = useState("বাংলাদেশে ফিরে এসে টেক ইন্ডাস্ট্রিতে এআই সলিউশন ও গবেষণায় নেতৃত্ব দেওয়া।");
  const [genuineMotivation, setGenuineMotivation] = useState("ডাটা ও কৃত্রিম বুদ্ধিমত্তার মাধ্যমে উন্নয়নশীল দেশের স্বাস্থ্য ও শিক্ষা খাতের অটোমেশন করা।");
  const [selectedTone, setSelectedTone] = useState<SopTone>("ACADEMIC");

  // Output State
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionContent>({
    introductionMotivation: "",
    academicBackground: "",
    workResearchExperience: "",
    whyThisUniversity: "",
    careerGoalsContribution: "",
  });
  const [fullDraft, setFullDraft] = useState<string>("");
  const [missingAlerts, setMissingAlerts] = useState<string[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);

  // Feedback & Critique State
  const [critiqueResult, setCritiqueResult] = useState<any>(null);
  const [showCritiqueModal, setShowCritiqueModal] = useState(false);

  // Revisions Modal State
  const [showRevisionsModal, setShowRevisionsModal] = useState(false);
  const [revisions, setRevisions] = useState<any[]>([]);

  // Section Edit State
  const [sectionPrompt, setSectionPrompt] = useState("");
  const [editingSection, setEditingSection] = useState(false);

  // Loading States
  const [generating, setGenerating] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load existing SOP if available
  useEffect(() => {
    async function loadSavedSop() {
      try {
        const res = await fetch("/api/ai/sop/revisions");
        const json = await res.json();
        if (json.success && json.currentDocument) {
          const doc = json.currentDocument;
          setDocumentId(doc.id);
          setFullDraft(doc.content || "");
          if (doc.sectionsJson) {
            try {
              setSections(JSON.parse(doc.sectionsJson));
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    loadSavedSop();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setCritiqueResult(null);

    try {
      const res = await fetch("/api/ai/sop/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCountry: country,
          targetUniversity: university,
          targetProgram: major,
          degreeLevel: degree.includes("মাস্টার্স") ? "MASTER" : "BACHELOR",
          academicHistory: [
            { degree: "Undergraduate Degree", institution: "University in Bangladesh", cgpa: 3.8 },
          ],
          workExperience: workExperience ? [{ role: "Professional", company: "Company", durationMonths: 12 }] : [],
          careerGoals,
          genuineMotivation,
          tone: selectedTone,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setDocumentId(json.data.documentId || null);
        setFullDraft(json.data.fullDraft);
        setSections(json.data.sections);
        setMissingAlerts(json.data.missingInformationAlerts || []);
        setFollowUpQuestions(json.data.followUpQuestionsBn || []);
      } else {
        alert(json.error || "এসওপি ড্রাফট তৈরিতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      alert("সার্ভার সমস্যা হয়েছে।");
    } finally {
      setGenerating(false);
    }
  };

  const handleSectionEdit = async (sectionKey: SopSectionKey) => {
    if (!sectionPrompt.trim()) return;
    setEditingSection(true);

    try {
      const res = await fetch("/api/ai/sop/section-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          sectionKey,
          currentContent: sections[sectionKey] || "",
          userInstruction: sectionPrompt,
          context: {
            targetUniversity: university,
            targetProgram: major,
            targetCountry: country,
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const updatedSecs = {
          ...sections,
          [sectionKey]: json.data.updatedContent,
        };
        setSections(updatedSecs);
        setFullDraft(Object.values(updatedSecs).join("\n\n"));
        setSectionPrompt("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingSection(false);
    }
  };

  const handlePolishTone = async (targetTone: SopTone) => {
    if (!fullDraft) return;
    setPolishing(true);

    try {
      const res = await fetch("/api/ai/sop/tone-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          fullContent: fullDraft,
          targetTone,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSelectedTone(targetTone);
        setFullDraft(json.data.polishedContent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPolishing(false);
    }
  };

  const handleCritique = async () => {
    if (!fullDraft) return;

    try {
      const res = await fetch("/api/ai/sop/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          fullContent: fullDraft,
          targetUniversity: university,
          targetProgram: major,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCritiqueResult(json.data);
        setShowCritiqueModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportDocx = async () => {
    if (!fullDraft) return;

    try {
      const res = await fetch("/api/ai/sop/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          title: `Statement of Purpose - ${major}`,
          content: fullDraft,
        }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SOP_${major.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("DOCX ফাইল ডাউনলোডে সমস্যা হয়েছে।");
    }
  };

  const handleExportPdf = () => {
    if (!fullDraft) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    fetch("/api/ai/sop/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId,
        title: `Statement of Purpose - ${major}`,
        content: fullDraft,
      }),
    })
      .then((res) => res.text())
      .then((html) => {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
      });
  };

  const handleCopy = () => {
    if (fullDraft) {
      navigator.clipboard.writeText(fullDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordCount = fullDraft.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
            <span>সততা ও নীতিমালাভিত্তিক এআই এসওপি নির্মাতা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            স্টেটমেন্ট অব পারপাস (SOP) ও মোটিভেশন লেটার বিল্ডার
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            কোনো কৃত্রিম বা মিথ্যা তথ্য ছাড়াই আপনার নিজস্ব শিক্ষাগত অর্জন, গবেষণা ও ক্যারিয়ার লক্ষ্যের ভিত্তিতে একটি শীর্ষ মানের আন্তর্জাতিক এসওপি প্রস্তুত করুন।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={async () => {
              const res = await fetch("/api/ai/sop/revisions");
              const json = await res.json();
              if (json.success) setRevisions(json.data || []);
              setShowRevisionsModal(true);
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>ভার্সন হিস্ট্রি</span>
          </button>

          {fullDraft && (
            <>
              <button
                type="button"
                onClick={handleCritique}
                className="px-3.5 py-2 bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Award className="w-4 h-4 text-purple-600" />
                <span>রিভিউ ও স্কোরিং</span>
              </button>

              <button
                type="button"
                onClick={handleExportDocx}
                className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>DOCX ডাউনলোড</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                title="প্রিন্ট বা পিডিএফ সেভ করুন"
              >
                <Printer className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Column */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-700" />
              <span>আপনার প্রোফাইল ও লক্ষ্যের তথ্যাবলী</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">সত্যানুগ তথ্য দিন</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কাঙ্ক্ষিত ডিগ্রি:</label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="মাস্টার্স">মাস্টার্স (Master's Degree)</option>
                <option value="ব্যাচেলর">ব্যাচেলর (Bachelor's Degree)</option>
                <option value="পিএইচডি">পিএইচডি (Doctorate / PhD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কাঙ্ক্ষিত দেশ:</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">লক্ষ্য বিশ্ববিদ্যালয়:</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পড়াশোনার বিষয় (Subject / Major):</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ববর্তী একাডেমিক ব্যাকগ্রাউন্ড ও প্রজেক্ট:</label>
            <textarea
              rows={2}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="যেমন: অনার্স সাবজেক্ট, সিজিপিএ এবং থিসিস বা ল্যাব প্রজেক্টের সংক্ষিপ্ত বিবরণ।"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">কর্ম বা ইন্টার্নশিপ অভিজ্ঞতা (ঐচ্ছিক):</label>
            <textarea
              rows={2}
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              placeholder="কোম্পানির নাম, পদবি এবং দায়িত্ব।"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পড়ার মূল প্রেরণা (Genuine Motivation):</label>
            <textarea
              rows={2}
              value={genuineMotivation}
              onChange={(e) => setGenuineMotivation(e.target.value)}
              placeholder="কেন আপনি এই বিষয়ে আগ্রহী হলেন?"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ভবিষ্যৎ ক্যারিয়ার লক্ষ্য ও দেশে অবদান:</label>
            <textarea
              rows={2}
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="কোর্স শেষ করে দেশে ফিরে কীভাবে অবদান রাখতে চান?"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">কাঙ্ক্ষিত টোন নির্বাচন করুন:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "ACADEMIC", label: "একাডেমিক" },
                { id: "PROFESSIONAL", label: "পেশাদার" },
                { id: "PERSUASIVE", label: "প্রভাবশালী" },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSelectedTone(t.id as SopTone)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedTone === t.id
                      ? "bg-brand-50 border-brand-500 text-brand-900"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={generating}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>এসওপি ড্রাফট প্রস্তুত হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>৫-সেকশন এসওপি তৈরি করুন</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Output & Section Editor Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col min-h-[640px]">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">এসওপি ড্রাফট ও সেকশন এডিটর</h2>
              {fullDraft && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {wordCount} শব্দ • প্রায় {Math.ceil(wordCount / 200)} মিনিট পাঠ
                </span>
              )}
            </div>

            {fullDraft && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePolishTone(selectedTone)}
                  disabled={polishing}
                  className="px-3 py-1 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  {polishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>টোন ও ব্যাকরণ রিফাইন</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "কপি হয়েছে!" : "কপি"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Missing Information Alerts */}
          {missingAlerts.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>প্রয়োজনীয় তথ্যের অনুপস্থিতি (সতর্কবার্তা):</span>
              </div>
              <ul className="list-disc list-inside text-amber-800 space-y-1 pl-1">
                {missingAlerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
              {followUpQuestions.length > 0 && (
                <div className="pt-2 border-t border-amber-200/60 text-amber-900">
                  <span className="font-bold block mb-1">স্পষ্টীকরণের জন্য প্রশ্নাবলী:</span>
                  {followUpQuestions.map((q, idx) => (
                    <p key={idx} className="italic text-[11px]">• {q}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section Navigation Tabs */}
          {fullDraft && (
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("fullDocument")}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  activeTab === "fullDocument"
                    ? "bg-brand-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                📄 সম্পূর্ণ এসওপি ড্রাফট
              </button>

              {(Object.keys(SECTION_LABELS) as SopSectionKey[]).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeTab === key
                      ? "bg-brand-700 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{SECTION_LABELS[key].icon}</span>
                  <span>{SECTION_LABELS[key].titleBn.split(". ")[1]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active View Content */}
          <div className="flex-1">
            {fullDraft ? (
              activeTab === "fullDocument" ? (
                <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {fullDraft}
                </div>
              ) : (
                /* Individual Section Editor */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200/60">
                    <span className="font-bold text-xs text-brand-900 block">
                      {SECTION_LABELS[activeTab as SopSectionKey].titleBn}
                    </span>
                    <span className="text-[11px] text-brand-700">
                      {SECTION_LABELS[activeTab as SopSectionKey].titleEn}
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    value={sections[activeTab as SopSectionKey] || ""}
                    onChange={(e) => {
                      const updated = {
                        ...sections,
                        [activeTab as SopSectionKey]: e.target.value,
                      };
                      setSections(updated);
                      setFullDraft(Object.values(updated).join("\n\n"));
                    }}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-300 font-serif text-sm leading-relaxed text-slate-800 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />

                  {/* Section AI Re-writer Input */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      এই অনুচ্ছেদে কোনো নির্দিষ্ট তথ্য বা পরিমার্জন চান?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="যেমন: গবেষণার থিসিস বিষয়ে ২ বাক্য বিশদ করুন..."
                        value={sectionPrompt}
                        onChange={(e) => setSectionPrompt(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSectionEdit(activeTab as SopSectionKey)}
                        disabled={editingSection || !sectionPrompt.trim()}
                        className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        {editingSection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                        <span>সম্পাদনা করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-24 text-slate-400 space-y-3">
                <FileText className="w-12 h-12 mx-auto text-slate-300" />
                <h3 className="text-sm font-bold text-slate-700">এসওপি ড্রাফট খালি আছে</h3>
                <p className="text-xs max-w-sm mx-auto leading-relaxed">
                  বামে আপনার লক্ষ্য ও অর্জনের বিবরণ পূরণ করে "৫-সেকশন এসওপি তৈরি করুন" বাটনে ক্লিক করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          CRITIQUE & SCORING MODAL
      ======================================================== */}
      {showCritiqueModal && critiqueResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>অ্যাডমিশন কমিটি রুব্রিক স্কোর ও পর্যালোচনা</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCritiqueModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Ring */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-5 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block">
                  সার্বিক এসওপি মানদণ্ড স্কোর
                </span>
                <span className="text-3xl font-black text-white">{critiqueResult.overallScore}/১০০</span>
                <span className="text-xs text-purple-200 block mt-0.5">
                  {critiqueResult.isReadyForSubmission
                    ? "✓ আন্তর্জাতিক মানদণ্ড অনুযায়ী জমাদানের উপযুক্ত"
                    : "⚠️ কিছু জায়গায় আরও স্পষ্টীকরণ প্রয়োজন"}
                </span>
              </div>
              <div className="text-right text-xs space-y-1">
                <div>স্পষ্টতা: <strong>{critiqueResult.clarityScore}%</strong></div>
                <div>প্রেরণা: <strong>{critiqueResult.motivationScore}%</strong></div>
                <div>একাডেমিক ফিট: <strong>{critiqueResult.academicFitScore}%</strong></div>
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-emerald-800 block">শক্তিশালী দিকসমূহ:</span>
              <ul className="space-y-1 text-slate-700">
                {critiqueResult.strengthsBn.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Points */}
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-amber-800 block">উন্নয়নের পরামর্শ:</span>
              <ul className="space-y-1 text-slate-700">
                {critiqueResult.improvementPointsBn.map((pt: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold shrink-0">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCritiqueModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VERSION HISTORY MODAL
      ======================================================== */}
      {showRevisionsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-brand-700" />
                <span>এসওপি ড্রাফট ভার্সন হিস্ট্রি</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRevisionsModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto text-xs">
              {revisions.length === 0 ? (
                <p className="text-slate-500 py-6 text-center">কোনো পূর্ববর্তী সংস্করণ নেই।</p>
              ) : (
                revisions.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-brand-800">সংস্করণ {rev.versionNumber}</span>
                        <span className="text-[10px] text-slate-400">{rev.wordCount} শব্দ</span>
                      </div>
                      <p className="text-slate-600">{rev.changeSummary}</p>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(rev.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const res = await fetch("/api/ai/sop/revisions", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ revisionId: rev.id }),
                        });
                        const json = await res.json();
                        if (json.success && json.data) {
                          setFullDraft(json.data.content);
                          if (json.data.sectionsJson) {
                            try {
                              setSections(JSON.parse(json.data.sectionsJson));
                            } catch (e) {}
                          }
                          setShowRevisionsModal(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-lg shrink-0 transition-colors"
                    >
                      রিস্টোর
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRevisionsModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
