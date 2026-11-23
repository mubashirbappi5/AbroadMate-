"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  Clock,
  Lock,
  ExternalLink,
  RefreshCw,
  History,
  FileText,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  ListTodo,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  Check,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  generateIntelligentRoadmap,
  RoadmapPhaseDefinition,
  RoadmapTaskDefinition,
  TaskStatus,
  TaskPriority,
} from "@abroadmate/roadmap-engine";

type ViewMode = "timeline" | "monthly" | "weekly" | "calendar" | "taskList" | "dashboard";

interface RoadmapData {
  id?: string;
  targetCountryCode: string;
  targetIntakeSeason: string;
  targetIntakeYear: number;
  fundingChoice: string;
  versionNumber?: number;
  phases: RoadmapPhaseDefinition[];
  progress?: {
    totalTasks: number;
    completedTasks: number;
    blockedTasks: number;
    needsReviewTasks: number;
    progressPercentage: number;
    totalEstimatedCostBdt: number;
  };
}

const COUNTRY_FLAGS: Record<string, { flag: string; nameBn: string }> = {
  GB: { flag: "🇬🇧", nameBn: "যুক্তরাজ্য (UK)" },
  DE: { flag: "🇩🇪", nameBn: "জার্মানি (Germany)" },
  CA: { flag: "🇨🇦", nameBn: "কানাডা (Canada)" },
  AU: { flag: "🇦🇺", nameBn: "অস্ট্রেলিয়া (Australia)" },
  US: { flag: "🇺🇸", nameBn: "যুক্তরাষ্ট্র (USA)" },
};

export default function RoadmapPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [selectedTask, setSelectedTask] = useState<RoadmapTaskDefinition | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({ 1: true, 2: true });

  // Recalculate Modal State
  const [showRecalculateModal, setShowRecalculateModal] = useState(false);
  const [newCountry, setNewCountry] = useState("GB");
  const [newSeason, setNewSeason] = useState<"fall" | "spring" | "summer">("fall");
  const [newYear, setNewYear] = useState(2026);
  const [newFunding, setNewFunding] = useState<"SCHOLARSHIP_FUNDED" | "SELF_FUNDED">("SELF_FUNDED");
  const [recalculateReason, setRecalculateReason] = useState("");
  const [recalculating, setRecalculating] = useState(false);

  // History Drawer State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [versionHistories, setVersionHistories] = useState<any[]>([]);

  // Task List Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  // Load Roadmap
  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roadmap/me");
      const json = await res.json();
      if (json.success && json.data) {
        setRoadmap(json.data);
        if (json.data.targetCountryCode) setNewCountry(json.data.targetCountryCode);
        if (json.data.targetIntakeYear) setNewYear(json.data.targetIntakeYear);
      } else {
        // Fallback default
        const defaultBlueprint = generateIntelligentRoadmap({
          targetCountryCode: "GB",
          targetIntakeSeason: "fall",
          targetIntakeYear: 2026,
          fundingChoice: "SELF_FUNDED",
        });
        setRoadmap({
          targetCountryCode: "GB",
          targetIntakeSeason: "FALL",
          targetIntakeYear: 2026,
          fundingChoice: "SELF_FUNDED",
          phases: defaultBlueprint,
          progress: {
            totalTasks: defaultBlueprint.flatMap((p) => p.tasks).length,
            completedTasks: 0,
            blockedTasks: 0,
            needsReviewTasks: 0,
            progressPercentage: 0,
            totalEstimatedCostBdt: defaultBlueprint
              .flatMap((p) => p.tasks)
              .reduce((s, t) => s + t.estimatedCostBdt, 0),
          },
        });
      }
    } catch (e) {
      console.error("Failed to load roadmap:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/roadmap/history");
      const json = await res.json();
      if (json.success) {
        setVersionHistories(json.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const togglePhase = (phaseNumber: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNumber]: !prev[phaseNumber],
    }));
  };

  const toggleTaskStatus = async (task: RoadmapTaskDefinition) => {
    if (!roadmap) return;

    const newStatus: TaskStatus = task.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";

    // Optimistic UI update
    const updatedPhases = roadmap.phases.map((phase) => ({
      ...phase,
      tasks: phase.tasks.map((t) => {
        if (t.taskCode === task.taskCode) {
          return {
            ...t,
            status: newStatus,
            isCompleted: newStatus === "COMPLETED",
            completedAt: newStatus === "COMPLETED" ? new Date().toISOString() : null,
          };
        }
        return t;
      }),
    }));

    // Recompute progress metrics optimistically
    const allTasks = updatedPhases.flatMap((p) => p.tasks);
    const completedCount = allTasks.filter((t) => t.status === "COMPLETED" || t.isCompleted).length;
    const totalCount = allTasks.length;

    setRoadmap({
      ...roadmap,
      phases: updatedPhases,
      progress: {
        totalTasks: totalCount,
        completedTasks: completedCount,
        blockedTasks: allTasks.filter((t) => t.status === "BLOCKED").length,
        needsReviewTasks: allTasks.filter((t) => t.needsReview).length,
        progressPercentage: Math.round((completedCount / totalCount) * 100),
        totalEstimatedCostBdt: allTasks.reduce((s, t) => s + (t.estimatedCostBdt || 0), 0),
      },
    });

    if (selectedTask?.taskCode === task.taskCode) {
      setSelectedTask({
        ...selectedTask,
        status: newStatus,
        isCompleted: newStatus === "COMPLETED",
      });
    }

    // Call API if task has an ID
    if (task.id) {
      try {
        await fetch(`/api/roadmap/tasks/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (err) {
        console.error("Task update failed:", err);
      }
    }
  };

  const handleRecalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecalculating(true);
    try {
      const res = await fetch("/api/roadmap/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newCountryCode: newCountry,
          newIntakeSeason: newSeason,
          newIntakeYear: Number(newYear),
          newFundingChoice: newFunding,
          changeReasonBn: recalculateReason || "শিক্ষার্থীর উচ্চশিক্ষা পরিকল্পনা পরিবর্তন",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setShowRecalculateModal(false);
        fetchRoadmap();
      } else {
        alert(json.error || "রোডম্যাপ রিক্যালকুলেট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      alert("সার্ভার সমস্যা হয়েছে।");
    } finally {
      setRecalculating(false);
    }
  };

  if (loading && !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-700 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">রোডম্যাপ লোড হচ্ছে...</p>
      </div>
    );
  }

  const countryInfo = COUNTRY_FLAGS[roadmap?.targetCountryCode || "GB"] || { flag: "🌐", nameBn: "গ্লোবাল" };
  const allTasks = roadmap?.phases.flatMap((p) => p.tasks) || [];
  const completedTasksCount = allTasks.filter((t) => t.status === "COMPLETED" || t.isCompleted).length;
  const blockedTasksCount = allTasks.filter((t) => t.status === "BLOCKED").length;
  const reviewTasks = allTasks.filter((t) => t.needsReview);
  const totalCostBdt = allTasks.reduce((sum, t) => sum + (t.estimatedCostBdt || 0), 0);
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasksCount / allTasks.length) * 100) : 0;

  // Filtered tasks for Task List view
  const filteredTasks = allTasks.filter((t) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchBn = t.titleBn.toLowerCase().includes(query);
      const matchEn = t.titleEn.toLowerCase().includes(query);
      if (!matchBn && !matchEn) return false;
    }
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5 text-brand-700" />
            <span>পার্সোনালাইজড উচ্চশিক্ষা রোডম্যাপ</span>
            <span className="text-slate-300">•</span>
            <span>১২টি ফেজ ও ডিপেন্ডেন্সি ট্র্যাকার</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            আপনার উচ্চশিক্ষা ও ভিসা প্রস্তুতি রোডম্যাপ
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            পাসপোর্ট, আইইএলটিএস, অ্যাডমিশন ও ইমিগ্রেশন ব্যাংক ব্যালেন্স থেকে শুরু করে বিশ্ববিদ্যালয়ে ক্লাসে যোগদানের প্রতিটি ধাপে নির্ভরযোগ্য গাইডলাইন।
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => {
              fetchHistory();
              setShowHistoryModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-2xs transition-colors"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>সংস্করণ হিস্ট্রি {roadmap?.versionNumber ? `(v${roadmap.versionNumber})` : ""}</span>
          </button>

          <button
            onClick={() => setShowRecalculateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>রোডম্যাপ রিক্যালকুলেট</span>
          </button>
        </div>
      </div>

      {/* Target Profile Tags Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
            <span className="text-base">{countryInfo.flag}</span>
            <span>{countryInfo.nameBn}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {roadmap?.targetIntakeSeason === "SPRING"
                ? "স্প্রিং ইনটেক"
                : roadmap?.targetIntakeSeason === "SUMMER"
                ? "সামার ইনটেক"
                : "ফল ইনটেক"}{" "}
              {roadmap?.targetIntakeYear}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200/60">
            <DollarSign className="w-3.5 h-3.5 text-purple-600" />
            <span>
              {roadmap?.fundingChoice === "SCHOLARSHIP_FUNDED" ? "স্কলারশিপ অর্থায়ন" : "নিজস্ব অর্থায়ন (Self-funded)"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>
            আনুমানিক মোট প্রস্তুতি খরচ:{" "}
            <strong className="text-slate-900 font-bold">৳{totalCostBdt.toLocaleString("en-IN")} BDT</strong>
          </span>
        </div>
      </div>

      {/* Policy Update Alert Banner (If Applicable) */}
      {reviewTasks.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-900">ইমিগ্রেশন পলিসি আপডেট সতর্কতা</h4>
            <p className="text-amber-800 mt-0.5">
              সরকারি ভিসা বা আর্থিক নীতিমালায় পরিবর্তন আসায় আপনার রোডম্যাপের {reviewTasks.length}টি টাস্ক পর্যালোচনার জন্য চিহ্নিত করা হয়েছে। টাস্কগুলোর বিস্তারিত দেখে প্রয়োজনীয় প্রস্তুতি নিন।
            </p>
          </div>
        </div>
      )}

      {/* Progress Metric Gauge */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider block">
              রোডম্যাপ মাইলস্টোন প্রগ্রেস
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-white">{progressPercent}%</span>
              <span className="text-xs text-slate-300">
                ({completedTasksCount} / {allTasks.length}টি টাস্ক সম্পন্ন)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
              ✓ {completedTasksCount} সম্পন্ন
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
              ⚡ {allTasks.length - completedTasksCount - blockedTasksCount} সক্রিয়
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 text-rose-300 text-xs font-bold border border-white/10">
              🔒 {blockedTasksCount} পূর্বশর্তের অপেক্ষায়
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-400 to-brand-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 6 View Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: "timeline", label: "টাইমলাইন ভিউ", icon: Compass },
            { id: "monthly", label: "মাসিক ভিউ", icon: CalendarRange },
            { id: "weekly", label: "সাপ্তাহিক স্প্রিন্ট", icon: CalendarDays },
            { id: "calendar", label: "ক্যালেন্ডার ভিউ", icon: Calendar },
            { id: "taskList", label: "টাস্ক লিস্ট", icon: ListTodo },
            { id: "dashboard", label: "প্রগ্রেস ড্যাশবোর্ড", icon: LayoutDashboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-brand-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          VIEW 1: TIMELINE VIEW (CHRONOLOGICAL 12 PHASES)
      ======================================================== */}
      {viewMode === "timeline" && (
        <div className="space-y-6">
          {roadmap?.phases.map((phase) => {
            const isExpanded = expandedPhases[phase.phaseNumber] ?? true;
            const phaseCompletedCount = phase.tasks.filter((t) => t.status === "COMPLETED" || t.isCompleted).length;
            const isPhaseAllDone = phaseCompletedCount === phase.tasks.length && phase.tasks.length > 0;

            return (
              <div
                key={phase.phaseNumber}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isPhaseAllDone ? "border-emerald-200 shadow-xs" : "border-slate-200 shadow-xs"
                }`}
              >
                {/* Phase Header Accordion */}
                <button
                  type="button"
                  onClick={() => togglePhase(phase.phaseNumber)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs ${
                        isPhaseAllDone
                          ? "bg-emerald-600 text-white"
                          : "bg-brand-50 text-brand-800 border border-brand-200"
                      }`}
                    >
                      {isPhaseAllDone ? <Check className="w-4 h-4" /> : phase.phaseNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{phase.titleBn}</h3>
                        <span className="text-xs text-slate-400">({phase.titleEn})</span>
                      </div>
                      <span className="text-xs font-bold text-brand-700 mt-0.5 inline-block">
                        {phase.timeframeNoticeBn}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {phaseCompletedCount}/{phase.tasks.length} সম্পন্ন
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Phase Tasks Grid */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 divide-y divide-slate-100">
                    {phase.tasks.map((task) => {
                      const isTaskCompleted = task.status === "COMPLETED" || task.isCompleted;
                      const isBlocked = task.status === "BLOCKED";

                      return (
                        <div
                          key={task.taskCode}
                          className={`py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                            isTaskCompleted ? "opacity-75" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3.5 flex-1">
                            {/* Checkbox Button */}
                            <button
                              type="button"
                              onClick={() => toggleTaskStatus(task)}
                              disabled={isBlocked}
                              title={
                                isBlocked
                                  ? "পূর্ববর্তী টাস্ক সম্পন্ন না হওয়া পর্যন্ত এটি ব্লকড থাকবে।"
                                  : isTaskCompleted
                                  ? "অসম্পূর্ণ হিসেবে মার্ক করুন"
                                  : "সম্পন্ন হিসেবে মার্ক করুন"
                              }
                              className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
                                isTaskCompleted
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : isBlocked
                                  ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
                                  : "border-slate-300 bg-white hover:border-brand-600 text-transparent"
                              }`}
                            >
                              {isTaskCompleted ? (
                                <Check className="w-4 h-4" />
                              ) : isBlocked ? (
                                <Lock className="w-3 h-3 text-slate-400" />
                              ) : null}
                            </button>

                            {/* Task Content */}
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4
                                  onClick={() => setSelectedTask(task)}
                                  className={`text-sm font-bold cursor-pointer hover:text-brand-700 transition-colors ${
                                    isTaskCompleted ? "line-through text-slate-500" : "text-slate-900"
                                  }`}
                                >
                                  {task.titleBn}
                                </h4>

                                {/* Priority Badge */}
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                    task.priority === "CRITICAL"
                                      ? "bg-rose-100 text-rose-800"
                                      : task.priority === "HIGH"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {task.priority === "CRITICAL"
                                    ? "অতীব জরুরি"
                                    : task.priority === "HIGH"
                                    ? "উচ্চ অগ্রাধিকার"
                                    : "সাধারণ"}
                                </span>

                                {isBlocked && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                                    লকড (পূর্বশর্ত প্রয়োজন)
                                  </span>
                                )}

                                {task.needsReview && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                    পলিসি রিভিউ প্রয়োজন
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {task.bengaliExplanation}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                                <span>আনুমানিক সময়: <strong>{task.estimatedDurationDays} দিন</strong></span>
                                {task.estimatedCostBdt > 0 && (
                                  <span>
                                    ফি: <strong>৳{task.estimatedCostBdt.toLocaleString("en-IN")} BDT</strong>
                                  </span>
                                )}
                                {task.dueDate && <span>ডেডলাইন: <strong>{task.dueDate}</strong></span>}
                              </div>
                            </div>
                          </div>

                          {/* Detail Drawer Trigger */}
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedTask(task)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors flex items-center gap-1"
                            >
                              <span>বিস্তারিত ও ডকুমেন্টস</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          VIEW 2: MONTHLY VIEW
      ======================================================== */}
      {viewMode === "monthly" && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
            💡 ইনটেক ক্লাসের তারিখের উপর ভিত্তি করে প্রতিটি মাসের গুরুত্বপূর্ণ করণীয় কার্যাবলী পর্যায়ক্রমে সাজানো হয়েছে।
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap?.phases.map((phase) => (
              <div key={phase.phaseNumber} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold text-brand-700">{phase.timeframeNoticeBn}</span>
                  <span className="text-[11px] text-slate-400 font-bold">ধাপ {phase.phaseNumber}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{phase.titleBn}</h4>
                <ul className="space-y-2 text-xs">
                  {phase.tasks.map((task) => (
                    <li key={task.taskCode} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                      <span
                        onClick={() => setSelectedTask(task)}
                        className={`cursor-pointer hover:underline ${
                          task.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-700"
                        }`}
                      >
                        {task.titleBn}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: WEEKLY SPRINT VIEW
      ======================================================== */}
      {viewMode === "weekly" && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900">
            🚀 <strong>বর্তমান সাপ্তাহিক স্প্রিন্ট:</strong> অবিলম্বে যে টাস্কগুলো শুরু করা প্রয়োজন বা ডেডলাইন সন্নিকটে।
          </div>

          <div className="space-y-3">
            {allTasks
              .filter((t) => t.status !== "COMPLETED" && t.status !== "BLOCKED")
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.taskCode}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800">
                        {task.priority}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{task.titleBn}</h4>
                    </div>
                    <p className="text-xs text-slate-600">{task.bengaliExplanation}</p>
                    <span className="text-[11px] text-slate-500 font-semibold block pt-1">
                      সমাপ্তির সময়সীমা: <strong>{task.dueDate || "শীঘ্রই"}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTaskStatus(task)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors"
                  >
                    সম্পন্ন মার্ক করুন
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 4: CALENDAR VIEW
      ======================================================== */}
      {viewMode === "calendar" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-700" />
              <span>ইন্টারেক্টিভ ডেডলাইন ও টাস্ক শিডিউল</span>
            </h3>
            <span className="text-xs text-slate-500">কালার কোডেড ইভেন্টস</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allTasks
              .filter((t) => !!t.dueDate)
              .map((task) => (
                <div
                  key={task.taskCode}
                  onClick={() => setSelectedTask(task)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-300 cursor-pointer transition-all bg-slate-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-100 text-brand-800">
                      📅 {task.dueDate}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{task.phaseKey}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{task.titleBn}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{task.bengaliExplanation}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 5: TASK LIST VIEW (FILTERABLE TABLE)
      ======================================================== */}
      {viewMode === "taskList" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="টাস্ক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
              >
                <option value="ALL">সব স্ট্যাটাস</option>
                <option value="COMPLETED">সম্পন্ন (Completed)</option>
                <option value="NOT_STARTED">শুরু হয়নি (Not Started)</option>
                <option value="BLOCKED">ব্লকড (Blocked)</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
              >
                <option value="ALL">সব প্রায়োরিটি</option>
                <option value="CRITICAL">অতীব জরুরি</option>
                <option value="HIGH">উচ্চ অগ্রাধিকার</option>
                <option value="MEDIUM">সাধারণ</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5">টাস্ক শিরোনাম</th>
                    <th className="p-3.5">অগ্রাধিকার</th>
                    <th className="p-3.5">আনুমানিক খরচ</th>
                    <th className="p-3.5">ডেডলাইন</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <tr key={task.taskCode} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => toggleTaskStatus(task)}
                          disabled={task.status === "BLOCKED"}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            task.status === "COMPLETED"
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : task.status === "BLOCKED"
                              ? "bg-slate-100 text-slate-400"
                              : "border-slate-300"
                          }`}
                        >
                          {task.status === "COMPLETED" && <Check className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        <span onClick={() => setSelectedTask(task)} className="cursor-pointer hover:underline">
                          {task.titleBn}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.priority === "CRITICAL"
                              ? "bg-rose-100 text-rose-800"
                              : task.priority === "HIGH"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold">
                        {task.estimatedCostBdt > 0 ? `৳${task.estimatedCostBdt.toLocaleString("en-IN")}` : "ফ্রি"}
                      </td>
                      <td className="p-3.5 text-slate-500 font-semibold">{task.dueDate || "—"}</td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTask(task)}
                          className="text-brand-700 hover:underline font-bold"
                        >
                          বিস্তারিত
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 6: PROGRESS DASHBOARD VIEW
      ======================================================== */}
      {viewMode === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold">মোট সম্পূর্ণ টাস্ক</span>
              <h3 className="text-2xl font-black text-emerald-600">
                {completedTasksCount} / {allTasks.length}
              </h3>
              <p className="text-[11px] text-slate-400">{progressPercent}% অগ্রগতি সম্পন্ন হয়েছে</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold">লকড / পূর্বশর্ত অপেক্ষমাণ</span>
              <h3 className="text-2xl font-black text-rose-600">{blockedTasksCount}টি</h3>
              <p className="text-[11px] text-slate-400">পূর্ববর্তী টাস্ক সম্পন্ন হলে আনলক হবে</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-bold">প্রাক্কলিত মোট বাজেট</span>
              <h3 className="text-2xl font-black text-slate-900">৳{totalCostBdt.toLocaleString("en-IN")}</h3>
              <p className="text-[11px] text-slate-400">পরীক্ষা, ভিসা ও ডিপোজিট বাবদ</p>
            </div>
          </div>

          {/* Phase-by-Phase Completion Bars */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">১২টি ফেজের সমাপ্তি বিশ্লেষণ</h4>
            <div className="space-y-3">
              {roadmap?.phases.map((p) => {
                const done = p.tasks.filter((t) => t.status === "COMPLETED" || t.isCompleted).length;
                const pct = p.tasks.length > 0 ? Math.round((done / p.tasks.length) * 100) : 0;
                return (
                  <div key={p.phaseNumber} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>ধাপ {p.phaseNumber}: {p.titleBn}</span>
                      <span>{done}/{p.tasks.length} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-700 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TASK DETAIL MODAL / DRAWER
      ======================================================== */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-brand-100 text-brand-800">
                    {selectedTask.taskCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800">
                    {selectedTask.priority}
                  </span>
                  {selectedTask.needsReview && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900">
                      পলিসি রিভিউ
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedTask.titleBn}</h3>
                <span className="text-xs text-slate-400 font-medium">{selectedTask.titleEn}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation & Why it matters */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                  বিস্তারিত নির্দেশিকা:
                </span>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  {selectedTask.bengaliExplanation}
                </p>
              </div>

              <div>
                <span className="font-extrabold text-brand-900 uppercase tracking-wider text-[11px] block mb-1">
                  কেন এটি অপরিহার্য (Why It Matters):
                </span>
                <p className="text-brand-900 bg-brand-50/60 p-3.5 rounded-xl border border-brand-200/50">
                  {selectedTask.whyItMattersBn}
                </p>
              </div>
            </div>

            {/* Required Documents Checklist */}
            {selectedTask.requiredDocuments && selectedTask.requiredDocuments.length > 0 && (
              <div>
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                  প্রয়োজনীয় কাগজপত্র (Required Documents):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTask.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-xs text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Criteria */}
            {selectedTask.completionCriteriaBn && (
              <div>
                <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                  কীভাবে বুঝবেন সম্পন্ন হয়েছে (Completion Criteria):
                </span>
                <p className="text-xs text-emerald-900 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/50 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedTask.completionCriteriaBn}</span>
                </p>
              </div>
            )}

            {/* Official Source Citation */}
            {selectedTask.officialSourceUrl && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  অফিসিয়াল সোর্স: <strong>{selectedTask.officialSourceOrg || "Government Authority"}</strong>
                </span>
                <a
                  href={selectedTask.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>সরকারি নির্দেশিকা</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Status Switcher Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                বর্তমান স্ট্যাটাস:{" "}
                <strong className="text-slate-900 font-bold">{selectedTask.status}</strong>
              </span>

              <button
                type="button"
                onClick={() => {
                  toggleTaskStatus(selectedTask);
                }}
                disabled={selectedTask.status === "BLOCKED"}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors ${
                  selectedTask.status === "COMPLETED"
                    ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                    : selectedTask.status === "BLOCKED"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {selectedTask.status === "COMPLETED" ? "অসম্পূর্ণ হিসেবে পরিবর্তন" : "সম্পন্ন হিসেবে চিহ্নিত করুন"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          RECALCULATE ROADMAP MODAL
      ======================================================== */}
      {showRecalculateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleRecalculate}
            className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-brand-700" />
                  <span>রোডম্যাপ রিক্যালকুলেট ও লক্ষ্য পরিবর্তন</span>
                </h3>
                <span className="text-xs text-slate-500">
                  সম্পন্নকৃত কোনো টাস্ক মুছে যাবে না; পূর্ববর্তী মাইলস্টোন অক্ষুণ্ণ থাকবে।
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowRecalculateModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কাঙ্ক্ষিত দেশ:</label>
                <select
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-brand-600 focus:outline-none"
                >
                  <option value="GB">🇬🇧 যুক্তরাজ্য (United Kingdom)</option>
                  <option value="DE">🇩🇪 জার্মানি (Germany)</option>
                  <option value="CA">🇨🇦 কানাডা (Canada)</option>
                  <option value="AU">🇦🇺 অস্ট্রেলিয়া (Australia)</option>
                  <option value="US">🇺🇸 যুক্তরাষ্ট্র (United States)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইনটেক সিজন:</label>
                  <select
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  >
                    <option value="fall">ফল (Fall)</option>
                    <option value="spring">স্প্রিং (Spring)</option>
                    <option value="summer">সামার (Summer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইনটেক বছর:</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  >
                    <option value={2025}>২০২৫</option>
                    <option value={2026}>২০২৬</option>
                    <option value={2027}>২০২৭</option>
                    <option value={2028}>২০২৮</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অর্থায়নের ধরন (Funding Choice):</label>
                <select
                  value={newFunding}
                  onChange={(e) => setNewFunding(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-brand-600 focus:outline-none"
                >
                  <option value="SELF_FUNDED">নিজের খরচে (Self-funded)</option>
                  <option value="SCHOLARSHIP_FUNDED">স্কলারশিপ নিয়ে (Scholarship-funded)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পরিবর্তনের কারণ বা নোট (ঐচ্ছিক):</label>
                <input
                  type="text"
                  placeholder="যেমন: জার্মানির টিউশন-ফ্রি মাস্টার্সের জন্য দেশ পরিবর্তন।"
                  value={recalculateReason}
                  onChange={(e) => setRecalculateReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRecalculateModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={recalculating}
                className="px-5 py-2 bg-brand-700 text-white font-bold text-xs rounded-xl hover:bg-brand-800 transition-colors flex items-center gap-1.5"
              >
                {recalculating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{recalculating ? "রিক্যালকুলেট হচ্ছে..." : "নতুন রোডম্যাপ জেনারেট করুন"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          VERSION HISTORY MODAL
      ======================================================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-brand-700" />
                <span>রোডম্যাপ সংস্করণ ইতিহাস (Version History)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto text-xs">
              {versionHistories.length === 0 ? (
                <p className="text-slate-500 py-6 text-center">কোনো পূর্ববর্তী সংস্করণ আর্কাইভ করা নেই।</p>
              ) : (
                versionHistories.map((h) => (
                  <div key={h.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-brand-800">সংস্করণ {h.versionNumber}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(h.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                    <p className="text-slate-700">{h.changeReasonBn}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
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
