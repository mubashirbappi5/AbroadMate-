"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  RefreshCw,
  Play,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Radio,
  FileCheck2,
  Mail,
  GitPullRequest,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface QueueInfo {
  name: string;
  labelBn: string;
  interval: string;
  description: string;
  retries: number;
  backoff: string;
}

interface FailedJobItem {
  id: string;
  queueName: string;
  jobId: string;
  jobName: string;
  payloadJson: string;
  failedReason: string;
  attemptsMade: number;
  failedAt: string;
  isResolved: boolean;
}

export default function AdminJobsMonitoringPage() {
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [stats, setStats] = useState<any>({
    totalQueues: 8,
    activeWorkers: 8,
    dispatchedLast24h: 0,
    totalFailed: 0,
    unresolvedFailed: 0,
  });
  const [deadLetterQueue, setDeadLetterQueue] = useState<FailedJobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringAction, setTriggeringAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/jobs");
      const json = await res.json();
      if (json.success && json.data) {
        setQueues(json.data.queues);
        setStats(json.data.stats);
        setDeadLetterQueue(json.data.deadLetterQueue);
      }
    } catch (err) {
      console.error("Failed to load jobs data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsData();
  }, []);

  const handleManualTrigger = async (action: string, label: string) => {
    try {
      setTriggeringAction(action);
      setFeedback(null);
      const res = await fetch("/api/admin/jobs/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();

      if (json.success) {
        setFeedback({
          type: "success",
          message: json.message || `${label} সফলভাবে সম্পন্ন হয়েছে।`,
        });
        fetchJobsData();
      } else {
        setFeedback({
          type: "error",
          message: json.error || "ট্রিগার ব্যর্থ হয়েছে।",
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "নেটওয়ার্ক ত্রুটি।" });
    } finally {
      setTriggeringAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            ব্যাকগ্রাউন্ড জব ও নোটিফিকেশন অবকাঠামো (BullMQ & Redis)
          </h2>
          <p className="text-xs text-slate-500">
            ৮টি স্পেশালাইজড ব্যাকগ্রাউন্ড কিউ, এক্সপোনেনশিয়াল ব্যাকঅফ, স্ট্রিক্ট আইডেমপোটেন্সি এবং ডেড-লেটার কিউ (DLQ) পর্যবেক্ষণ।
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ৮টি কিউ সক্রিয়
          </span>
          <button
            onClick={fetchJobsData}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Manual Trigger Command Center */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
            অন-ডিমান্ড ম্যানুয়াল স্ক্যান ও ট্রিগার সেন্টার
          </h3>
          <p className="text-xs text-indigo-200">
            শিডিউলড ক্রন সময়ের পূর্বে তাৎক্ষণিক টেস্ট বা জরুরি স্ক্যান রান করতে নিচের বাটনে ক্লিক করুন:
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleManualTrigger("scan-deadlines", "ডেডলাইন রিমাইন্ডার স্ক্যান")}
            disabled={triggeringAction !== null}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Clock className="w-4 h-4" />
            {triggeringAction === "scan-deadlines" ? "স্ক্যান হচ্ছে..." : "ডেডলাইন রিমাইন্ডার স্ক্যান চালান"}
          </button>

          <button
            onClick={() => handleManualTrigger("scan-sources", "সোর্স মনিটরিং স্ক্যান")}
            disabled={triggeringAction !== null}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-sm disabled:opacity-50"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            {triggeringAction === "scan-sources" ? "স্ক্যান হচ্ছে..." : "সোর্স মনিটরিং স্ক্যান চালান"}
          </button>

          <button
            onClick={() => handleManualTrigger("audit-data", "পিরিয়ডিক ডেটা অডিট")}
            disabled={triggeringAction !== null}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-sm disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            {triggeringAction === "audit-data" ? "অডিট হচ্ছে..." : "পিরিয়ডিক ডেটা অডিট রান করুন"}
          </button>
        </div>
      </div>

      {/* 8 BullMQ Queue Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
          ৮টি প্রোডাকশন জব কিউ স্পেসিফিকেশন (Job Categories)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {queues.map((q, idx) => (
            <div
              key={q.name}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    কিউ #{idx + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{q.labelBn}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{q.name}</p>
                <p className="text-xs text-slate-600 pt-1 leading-snug">{q.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span>শিডিউল:</span>
                  <span className="font-semibold text-slate-700">{q.interval}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>রিট্রাই পলিসি:</span>
                  <span className="font-semibold text-indigo-600">{q.retries} বার</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ব্যাকঅফ:</span>
                  <span className="font-semibold text-slate-700">{q.backoff}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reliability & Failure Management Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">স্ট্রিক্ট আইডেমপোটেন্সি</h4>
          <p className="text-xs text-slate-500">
            প্রতিটি অ্যালার্টের জন্য ইউনিক কী তৈরি হয়। ফলে একই ডেডলাইনে একই শিক্ষার্থীকে বারবার ডুপ্লিকেট মেসেজ যাওয়ার কোনো সম্ভাবনা নেই।
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">এক্সপোনেনশিয়াল ব্যাকঅফ</h4>
          <p className="text-xs text-slate-500">
            নেটওয়ার্ক বা এপিআই ফেইলার হলে ২ সেকেন্ড, ৪ সেকেন্ড, ৮ সেকেন্ড, ১৬ সেকেন্ড পর্যায়ক্রমে ৫ বার পর্যন্ত স্বয়ংক্রিয় রিট্রাই সম্পন্ন হয়।
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">ডেড-লেটার কিউ (DLQ)</h4>
          <p className="text-xs text-slate-500">
            সব রিট্রাই ব্যর্থ হলে এরর ট্রেইস ও পে-লোড ডেটাবেজের <span className="font-mono">FailedJobLog</span>-এ সংরক্ষিত থাকে।
          </p>
        </div>
      </div>

      {/* Dead Letter Queue (DLQ) Inspector Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              ডেড-লেটার কিউ ও ফেইলড জব ট্রেইল (Dead Letter Queue - DLQ)
            </h4>
            <p className="text-xs text-slate-500">
              সর্বোচ্চ চেষ্টার পরও ব্যর্থ হওয়া জবগুলোর তালিকা।
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            ব্যর্থ জব: {deadLetterQueue.length}টি
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">টাইমস্ট্যাম্প</th>
                <th className="p-4">কিউ ও জব নাম</th>
                <th className="p-4">চেষ্টার সংখ্যা</th>
                <th className="p-4">ব্যর্থতার কারণ</th>
                <th className="p-4">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {deadLetterQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {new Date(item.failedAt).toLocaleString("bn-BD")}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{item.jobName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{item.queueName}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                      {item.attemptsMade} Attempts
                    </span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <span className="text-slate-700 font-mono text-[11px] line-clamp-2" title={item.failedReason}>
                      {item.failedReason}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isResolved
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.isResolved ? "সমাধানকৃত" : "সমাধানহীন (DLQ)"}
                    </span>
                  </td>
                </tr>
              ))}

              {deadLetterQueue.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    ডেড-লেটার কিউ সম্পূর্ণ পরিষ্কার! কোনো ফেইলড জব নেই।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
