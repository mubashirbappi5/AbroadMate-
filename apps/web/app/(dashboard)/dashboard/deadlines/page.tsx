"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  CalendarClock,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  ExternalLink,
  Bell,
  BellRing,
  Filter,
  Check,
  ChevronRight,
  Sparkles,
  Tag,
  Share2,
} from "lucide-react";

export interface DeadlineItem {
  id: string;
  titleBn: string;
  titleEn: string;
  countryCode: string;
  countryName: string;
  flag: string;
  date: string; // YYYY-MM-DD
  daysLeft: number;
  category: "scholarship" | "university" | "test" | "visa" | "personal";
  categoryLabelBn: string;
  isUrgent: boolean;
  notesBn: string;
  officialUrl?: string;
  completed: boolean;
  isCustom?: boolean;
}

const INITIAL_DEADLINES: DeadlineItem[] = [
  {
    id: "chevening-2026",
    titleBn: "শেভেনিং স্কলারশিপ অনলাইন আবেদন সমাপ্তি (UK)",
    titleEn: "Chevening Scholarships Online Application Deadline",
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    date: "2025-11-05",
    daysLeft: 18,
    category: "scholarship",
    categoryLabelBn: "সরকারি স্কলারশিপ",
    isUrgent: true,
    notesBn: "যুক্তরাজ্যের পররাষ্ট্র মন্ত্রণালয়ের সম্পূর্ণ অর্থায়নে মাস্টার্স। ৪টি এসএ (Leadership, Networking, Study in UK, Career Plan) জমা দিতে হবে।",
    officialUrl: "https://www.chevening.org/apply/",
    completed: false,
  },
  {
    id: "ielts-booking",
    titleBn: "আইইএলটিএস একাডেমিক টেস্ট রেজিস্ট্রেশন",
    titleEn: "IELTS Academic Test Registration & Exam Date",
    countryCode: "GLOBAL",
    countryName: "Global",
    flag: "🌐",
    date: "2025-11-25",
    daysLeft: 38,
    category: "test",
    categoryLabelBn: "ভাষাগত পরীক্ষা",
    isUrgent: true,
    notesBn: "ব্রিটিশ কাউন্সিল অথবা আইডিপি বাংলাদেশ সেন্টারে পরীক্ষার স্লট বুক করুন। লক্ষ্য স্কোর: ন্যূনতম ৭.০ (প্রতিটি ব্যান্ড ৬.৫+)।",
    officialUrl: "https://www.britishcouncil.org.bd/en/exam/ielts",
    completed: false,
  },
  {
    id: "commonwealth-shared",
    titleBn: "কমনওয়েলথ শেয়ার্ড স্কলারশিপ আবেদন (UK)",
    titleEn: "Commonwealth Shared Scholarships Application Deadline",
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    date: "2025-12-12",
    daysLeft: 52,
    category: "scholarship",
    categoryLabelBn: "সরকারি স্কলারশিপ",
    isUrgent: false,
    notesBn: "উন্নয়নশীল দেশের মেধাবী শিক্ষার্থীদের জন্য পার্টনার ব্রিটিশ বিশ্ববিদ্যালয়গুলোতে সম্পূর্ণ বিনামূল্যে মাস্টার্স পড়ার সুযোগ।",
    officialUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/",
    completed: false,
  },
  {
    id: "canada-fall-early",
    titleBn: "কানাডা ফল ২০২৬ আর্লি অ্যাডমিশন উইন্ডো সমাপ্তি",
    titleEn: "Canada Fall 2026 Early Application Round",
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    date: "2026-01-15",
    daysLeft: 85,
    category: "university",
    categoryLabelBn: "বিশ্ববিদ্যালয় আবেদন",
    isUrgent: false,
    notesBn: "অন্টারিও, ব্রিটিশ কলাম্বিয়া ও আলবার্টার শীর্ষ বিশ্ববিদ্যালয়গুলোতে স্কলারশিপ বিবেচনার জন্য আর্লি রাউন্ডে আবেদন আবশ্যক।",
    officialUrl: "https://www.ouac.on.ca/",
    completed: false,
  },
  {
    id: "daad-germany",
    titleBn: "ডিএএডি (DAAD) ইপিওএস স্কলারশিপ জার্মানি",
    titleEn: "DAAD EPOS / Study Scholarships Germany",
    countryCode: "DE",
    countryName: "Germany",
    flag: "🇩🇪",
    date: "2026-01-31",
    daysLeft: 101,
    category: "scholarship",
    categoryLabelBn: "সরকারি স্কলারশিপ",
    isUrgent: false,
    notesBn: "জার্মানিতে টিউশন-ফ্রি মাস্টার্সের জন্য মাসিক ৯৩৪ ইউরো লিভিং স্টাইপেন্ড এবং স্বাস্থ্য বীমা।",
    officialUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    completed: false,
  },
  {
    id: "uk-bank-28days",
    titleBn: "ইউকে ভিসা ২৮-দিনের ব্যাংক ফান্ড শুরু (Bank Solvency)",
    titleEn: "UK Student Visa 28-Day Bank Funds Maintenance",
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    date: "2026-05-15",
    daysLeft: 206,
    category: "visa",
    categoryLabelBn: "ভিসা ও ব্যাংক সলভেন্সি",
    isUrgent: false,
    notesBn: "ভিসা আবেদনের পূর্বে অনুমোদিত বাংলাদেশি ব্যাংক অ্যাকাউন্টে টানা ২৮ দিন ২৮-৩৫ লাখ টাকা নিরবচ্ছিন্নভাবে মেইনটেইন করতে হবে।",
    officialUrl: "https://www.gov.uk/student-visa/money",
    completed: false,
  },
];

export default function DeadlinesPage() {
  const { locale } = useI18n();

  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(INITIAL_DEADLINES);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState<"scholarship" | "university" | "test" | "visa" | "personal">("personal");
  const [newNotes, setNewNotes] = useState("");

  // Load from API with localStorage fallback
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/deadlines");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDeadlines(json.data);
        } else {
          const saved = localStorage.getItem("abroadmate_student_deadlines");
          if (saved) setDeadlines(JSON.parse(saved));
        }
      } catch (e) {
        const saved = localStorage.getItem("abroadmate_student_deadlines");
        if (saved) setDeadlines(JSON.parse(saved));
      }

      try {
        const alertRes = await fetch("/api/deadlines/alerts");
        const alertJson = await alertRes.json();
        if (alertJson.success && Array.isArray(alertJson.data)) {
          setActiveAlerts(alertJson.data);
        }
      } catch (e) {}
    }
    loadData();
  }, []);

  const saveDeadlines = (updated: DeadlineItem[]) => {
    setDeadlines(updated);
    try {
      localStorage.setItem("abroadmate_student_deadlines", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const toggleComplete = async (id: string) => {
    const updated = deadlines.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d));
    saveDeadlines(updated);

    try {
      await fetch(`/api/deadlines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !deadlines.find((d) => d.id === id)?.completed }),
      });
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    const updated = deadlines.filter((d) => d.id !== id);
    saveDeadlines(updated);

    try {
      await fetch(`/api/deadlines/${id}`, { method: "DELETE" });
    } catch (e) {}
  };

  const handleAddCustomDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const diffDays = Math.max(
      0,
      Math.ceil((new Date(newDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    );

    const categoryLabels: Record<string, string> = {
      scholarship: "সরকারি স্কলারশিপ",
      university: "বিশ্ববিদ্যালয় আবেদন",
      test: "ভাষাগত পরীক্ষা",
      visa: "ভিসা ও ব্যাংক ফান্ড",
      personal: "ব্যক্তিগত রিমাইন্ডার",
    };

    const newItem: DeadlineItem = {
      id: `custom-${Date.now()}`,
      titleBn: newTitle,
      titleEn: newTitle,
      countryCode: "BD",
      countryName: "Personal",
      flag: "📌",
      date: newDate,
      daysLeft: diffDays,
      category: newCategory,
      categoryLabelBn: categoryLabels[newCategory] || "ব্যক্তিগত",
      isUrgent: diffDays <= 30,
      notesBn: newNotes || "ব্যক্তিগত স্টাডি রিমাইন্ডার।",
      completed: false,
      isCustom: true,
    };

    saveDeadlines([newItem, ...deadlines]);
    setNewTitle("");
    setNewDate("");
    setNewNotes("");
    setShowAddForm(false);

    try {
      await fetch("/api/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleBn: newItem.titleBn,
          titleEn: newItem.titleEn,
          deadlineDate: newItem.date,
          category: newItem.category.toUpperCase(),
          deadlineType: "CUSTOM_REMINDER",
          notesBn: newItem.notesBn,
        }),
      });
    } catch (e) {}
  };

  const filteredDeadlines = deadlines.filter((d) => {
    if (selectedCategory === "ALL") return true;
    if (selectedCategory === "URGENT") return d.isUrgent && !d.completed;
    if (selectedCategory === "COMPLETED") return d.completed;
    return d.category === selectedCategory;
  });

  const urgentCount = deadlines.filter((d) => d.isUrgent && !d.completed).length;
  const completedCount = deadlines.filter((d) => d.completed).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-2">
            <CalendarClock className="w-3.5 h-3.5 text-rose-600" />
            <span>সময়সীমা ট্র্যাকার</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            গুরুত্বপূর্ণ ডেডলাইন ও রিমাইন্ডার
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            সরকারি স্কলারশিপ, বিশ্ববিদ্যালয় আবেদন রাউন্ড, আইইএলটিএস পরীক্ষা এবং ভিসা ব্যাংক ফান্ডের সময়সীমা ট্র্যাক করুন।
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "ফর্ম বন্ধ করুন" : "নতুন রিমাইন্ডার যোগ করুন"}</span>
        </button>
      </div>

      {/* Urgent Alert Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-700/80 border border-rose-500/40 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">
              জরুরি আসন্ন ডেডলাইন
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              🇬🇧 শেভেনিং স্কলারশিপ ডেডলাইন: ৫ নভেম্বর ২০২৫ (আর মাত্র ১৮ দিন বাকি!)
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">
              যুক্তরাজ্য সরকারের সম্পূর্ণ অর্থায়নে পড়াশোনার আবেদন পোর্টাল দ্রুত ক্লোজ হবে।
            </p>
          </div>
        </div>

        <a
          href="https://www.chevening.org/apply/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-white text-rose-950 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span>আবেদন পোর্টাল</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Add Custom Reminder Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCustomDeadline}
          className="bg-white p-6 rounded-2xl border-2 border-brand-300 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-700" />
              <span>আপনার ব্যক্তিগত রিমাইন্ডার যোগ করুন</span>
            </h3>
            <span className="text-xs text-slate-500">আপনার ব্রাউজার স্টোরেজে সংরক্ষিত থাকবে</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">রিমাইন্ডারের শিরোনাম:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="যেমন: ম্যানচেস্টার বিশ্ববিদ্যালয় ফি ডিপোজিট ডেডলাইন"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ডেডলাইন তারিখ:</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="scholarship">সরকারি স্কলারশিপ</option>
                <option value="university">বিশ্ববিদ্যালয় আবেদন</option>
                <option value="test">ভাষাগত পরীক্ষা (IELTS)</option>
                <option value="visa">ভিসা ও ব্যাংক সলভেন্সি</option>
                <option value="personal">ব্যক্তিগত রিমাইন্ডার</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রয়োজনীয় নোট (ঐচ্ছিক):</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="যেমন: অফার লেটার এক্সেপ্ট করতে হবে ও ৫০০ পাউন্ড ডিপোজিট দিতে হবে।"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-700 text-white font-bold text-xs rounded-xl hover:bg-brand-800 transition-colors"
            >
              রিমাইন্ডার সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: `সব ডেডলাইন (${deadlines.length})` },
            { id: "URGENT", label: `জরুরি (${urgentCount})` },
            { id: "scholarship", label: "স্কলারশিপ" },
            { id: "university", label: "বিশ্ববিদ্যালয়" },
            { id: "test", label: "পরীক্ষা" },
            { id: "visa", label: "ভিসা ও ব্যাংক" },
            { id: "COMPLETED", label: `সম্পন্ন (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === tab.id
                  ? "bg-brand-700 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {filteredDeadlines.length}টি সময়সীমা প্রদর্শিত
        </span>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {filteredDeadlines.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              item.completed
                ? "bg-slate-50/70 border-slate-200 opacity-60"
                : item.isUrgent
                ? "bg-rose-50/40 border-rose-200 hover:border-rose-300 shadow-xs"
                : "bg-white border-slate-200 hover:border-brand-300 shadow-xs"
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1">
              {/* Checkbox */}
              <button
                onClick={() => toggleComplete(item.id)}
                title={item.completed ? "আবার অপরিপূর্ণ করুন" : "সম্পন্ন হিসেবে মার্ক করুন"}
                className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                  item.completed
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 bg-white hover:border-brand-600"
                }`}
              >
                {item.completed && <Check className="w-4 h-4" />}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg">{item.flag}</span>
                  <h3
                    className={`text-sm font-bold ${
                      item.completed ? "line-through text-slate-500" : "text-slate-900"
                    }`}
                  >
                    {item.titleBn}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {item.categoryLabelBn}
                  </span>
                  {item.isCustom && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      ব্যক্তিগত
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.notesBn}</p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>তারিখ: <strong>{item.date}</strong></span>
                  {item.officialUrl && (
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>অফিসিয়াল পোর্টাল</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Days remaining & Delete button */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black block ${
                    item.completed
                      ? "bg-slate-200 text-slate-600"
                      : item.daysLeft <= 30
                      ? "bg-rose-600 text-white shadow-xs"
                      : item.daysLeft <= 90
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  {item.completed ? "সম্পন্ন" : `${item.daysLeft} দিন বাকি`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {item.completed ? "আর্কাইভড" : "কাউন্টডাউন"}
                </span>
              </div>

              {item.isCustom && (
                <button
                  onClick={() => handleDelete(item.id)}
                  title="রিমাইন্ডার মুছে ফেলুন"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reminder Notification Settings Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">ইমেইল ও মোবাইল নোটিফিকেশন এলার্ট</h3>
            <p className="text-xs text-slate-500">
              যেকোনো বড় ডেডলাইনের ৩০ দিন, ৭ দিন এবং ১ দিন পূর্বে অটোমেটিক এলার্ট পেতে সেটিংস চালু রাখুন।
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/settings"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs shrink-0 transition-colors"
        >
          নোটিফিকেশন সেটিংস
        </Link>
      </div>
    </div>
  );
}
