"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  LayoutDashboard,
  UserCheck,
  Globe2,
  FileCheck2,
  GraduationCap,
  MapPin,
  Calculator,
  FolderLock,
  FileText,
  Compass,
  Bot,
  ShieldCheck,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "ড্যাশবোর্ড ওভারভিউ", icon: LayoutDashboard },
    { href: "/profile", label: "একাডেমিক প্রোফাইল", icon: UserCheck },
    { href: "/explore", label: "দেশ ও বিশ্ববিদ্যালয়", icon: Globe2 },
    { href: "/eligibility", label: "অ্যাডমিশন যোগ্যতা", icon: FileCheck2 },
    { href: "/scholarships", label: "স্কলারশিপ", icon: GraduationCap },
    { href: "/visa-guides", label: "ভিসা ও ব্যাংক সলভেন্সি", icon: MapPin },
    { href: "/calculator", label: "খরচ ক্যালকুলেটর", icon: Calculator },
    { href: "/documents", label: "ডকুমেন্ট ভল্ট", icon: FolderLock },
    { href: "/sop-builder", label: "SOP ও মোটিভেশন বিল্ডার", icon: FileText },
    { href: "/roadmap", label: "স্টাডি রোডম্যাপ", icon: Compass },
    { href: "/ai-assistant", label: "এআই সহায়ক", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* User Status Card */}
          <div className="p-3.5 bg-brand-50/80 border border-brand-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs">
                শিক্ষার্থী
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  সাকিব আহমেদ
                </span>
                <span className="text-[10px] text-brand-800 font-semibold block">
                  লক্ষ্য: ফল ২০২৬ (মাস্টার্স)
                </span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-brand-200/60 flex items-center justify-between text-[11px] text-slate-600">
              <span>প্রোফাইল পূর্ণতা:</span>
              <span className="font-bold text-brand-800">৭৫%</span>
            </div>
            <div className="w-full bg-brand-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-brand-600 h-full rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    isActive
                      ? "bg-brand-700 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Free Promise Badge */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
          <span>১০০% সম্পূর্ণ ফ্রি স্টুডেন্ট পোর্টাল</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
