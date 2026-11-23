"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitPullRequest,
  Globe,
  Radio,
  Building2,
  Award,
  History,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const adminTabs = [
  {
    href: "/dashboard/admin",
    label: "ড্যাশবোর্ড মেট্রিক্স",
    labelEn: "Metrics Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/admin/policy-changes",
    label: "পলিসি চেঞ্জ ওয়ার্কফ্লো",
    labelEn: "Policy Workflow (9 Steps)",
    icon: GitPullRequest,
    badge: "৯ ধাপ",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    href: "/dashboard/admin/sources",
    label: "সোর্স মনিটরিং",
    labelEn: "Source Monitoring",
    icon: Radio,
  },
  {
    href: "/dashboard/admin/countries",
    label: "দেশ ও ভিসা নিয়ম",
    labelEn: "Countries & Visa Rules",
    icon: Globe,
  },
  {
    href: "/dashboard/admin/universities",
    label: "বিশ্ববিদ্যালয় ও প্রোগ্রাম",
    labelEn: "Universities & Programs",
    icon: Building2,
  },
  {
    href: "/dashboard/admin/scholarships",
    label: "স্কলারশিপ ম্যানেজমেন্ট",
    labelEn: "Scholarships",
    icon: Award,
  },
  {
    href: "/dashboard/admin/audit-logs",
    label: "সিকিউরিটি ও অডিট লগ",
    labelEn: "Audit Trail",
    icon: History,
  },
  {
    href: "/dashboard/admin/jobs",
    label: "ব্যাকগ্রাউন্ড জব ও কিউ",
    labelEn: "Jobs & Queues",
    icon: Cpu,
    badge: "৮ কিউ",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-medium text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              ইন্টারনাল অ্যাডমিন ও রিসার্চ কন্ট্রোল প্ল্যাটফর্ম
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              অফিসিয়াল রিসার্চ ও ডেটা অ্যাকুরেসি সিস্টেম
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              বাংলাদেশি শিক্ষার্থীদের জন্য শতভাগ যাচাইকৃত ইমিগ্রেশন ও শিক্ষা তথ্য নিশ্চিতকরণ। মানবিক ভেরিফিকেশন ছাড়া কোনো ভিসা বা ব্যাংক ব্যালান্স নিয়ম প্রকাশিত হয় না।
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-medium">রিসার্চ ইঞ্জিন: সক্রিয়</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.href === "/dashboard/admin"
                ? pathname === "/dashboard/admin"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-md font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                      isActive ? "bg-indigo-100 text-indigo-800" : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
}
