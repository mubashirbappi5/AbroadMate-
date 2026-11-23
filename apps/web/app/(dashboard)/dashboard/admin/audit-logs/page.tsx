"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  User,
  Clock,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  previousValue?: string | null;
  newValue?: string | null;
  changesJson?: string | null;
  approvalStatus?: string | null;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    primaryRole: string;
  } | null;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resourceType, setResourceType] = useState("");
  const [action, setAction] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (resourceType) params.set("resourceType", resourceType);
      if (action) params.set("action", action);

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLogs(json.data.logs);
        setTotal(json.data.total);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [resourceType, action]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            ইমিউটেবল সিকিউরিটি ও অডিট লগ (Audit Trail)
          </h2>
          <p className="text-xs text-slate-500">
            AbroadMate-এ যেকোনো সংবেদনশীল পলিসি, ভিসা নিয়ম বা প্রাতিষ্ঠানিক ডেটা পরিবর্তনের অপরিবর্তনীয় ট্রেইল ও রেকর্ড।
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          মোট সংরক্ষিত রেকর্ড: {total}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="">সব রিসোর্স টাইপ</option>
            <option value="VISA_POLICY_UPDATE">ভিসা পলিসি আপডেট</option>
            <option value="POLICY_CHANGE_PROPOSAL">পলিসি পরিবর্তনের প্রস্তাব</option>
            <option value="COUNTRY">দেশ সংক্রান্ত তথ্য</option>
            <option value="UNIVERSITY">বিশ্ববিদ্যালয় রেকর্ড</option>
            <option value="PROGRAM">ডিগ্রি কোর্স / প্রোগ্রাম</option>
            <option value="Scholarship">স্কলারশিপ</option>
            <option value="INFORMATION_SOURCE">অফিসিয়াল সোর্স</option>
          </select>

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="">সব অ্যাকশন</option>
            <option value="CREATE">CREATE (সংযোজন)</option>
            <option value="UPDATE">UPDATE (হালনাগাদ)</option>
            <option value="APPROVE">APPROVE (অনুমোদন)</option>
            <option value="REJECT">REJECT (বাতিল)</option>
            <option value="VERIFY">VERIFY (যাচাই)</option>
            <option value="DELETE">DELETE (মুছে ফেলা)</option>
          </select>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 inline-flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          রিফ্রেশ
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">টাইমস্ট্যাম্প</th>
                <th className="p-4">অ্যাডমিন ব্যবহারকারী</th>
                <th className="p-4">অ্যাকশন</th>
                <th className="p-4">রিসোর্স টাইপ ও আইডি</th>
                <th className="p-4">অনুমোদন স্ট্যাটাস</th>
                <th className="p-4 text-right">বিস্তারিত ডিটেইল</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-900 block">
                            {new Date(log.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block">
                            {log.user?.fullName || "সিস্টেম / অটোমেটেড"}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {log.user?.primaryRole || "SYSTEM"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            log.action === "APPROVE" || log.action === "VERIFY"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.action === "CREATE"
                              ? "bg-blue-100 text-blue-800"
                              : log.action === "UPDATE"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            {log.resourceType}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {log.resourceId.substring(0, 16)}...
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {log.approvalStatus ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.approvalStatus === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {log.approvalStatus}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">N/A</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>{isExpanded ? "লুকান" : "স্ন্যাপশট দেখুন"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Before/After Snapshot Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-b border-slate-200">
                        <td colSpan={6} className="p-4">
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-indigo-600" />
                              পরিবর্তনের বিবরণ ও স্ন্যাপশট (State Diff)
                            </h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                                  পূর্ববর্তী মান (Previous Value)
                                </span>
                                <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-2.5 rounded overflow-x-auto whitespace-pre-wrap max-h-40">
                                  {log.previousValue || "পূর্ববর্তী রেকর্ড ফাঁকা"}
                                </pre>
                              </div>

                              <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                                  নতুন মান (New Value / Changes)
                                </span>
                                <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-2.5 rounded overflow-x-auto whitespace-pre-wrap max-h-40">
                                  {log.newValue || log.changesJson || "কোনো পরিবর্তন রেকর্ড পাওয়া যায়নি"}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    কোনো অডিট রেকর্ড পাওয়া যায়নি।
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
