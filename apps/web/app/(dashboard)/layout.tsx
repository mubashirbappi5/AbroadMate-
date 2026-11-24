"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  LayoutDashboard,
  UserCheck,
  Target,
  Globe2,
  School,
  FileCheck2,
  GraduationCap,
  MapPin,
  Calculator,
  FolderLock,
  Compass,
  CalendarClock,
  FileText,
  Bot,
  Settings,
  ShieldCheck,
  Menu,
  X,
  Bell,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";

interface MenuItem {
  href: string;
  alternateHref?: string;
  label: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, toggleLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ fullName: string; email: string } | null>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchUserContext() {
      try {
        const [sessRes, profRes] = await Promise.allSettled([
          fetch("/api/auth/session"),
          fetch("/api/profile"),
        ]);
        if (sessRes.status === "fulfilled") {
          const sJson = await sessRes.value.json();
          if (sJson.authenticated && sJson.user) {
            setCurrentUser(sJson.user);
          }
        }
        if (profRes.status === "fulfilled") {
          const pJson = await profRes.value.json();
          if (pJson.success && pJson.data) {
            setCurrentProfile(pJson.data);
          }
        }
      } catch (e) {
        // silent fallback
      }
    }
    fetchUserContext();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
    router.refresh();
  };

  const isBn = locale === "bn";

  const menuItems: MenuItem[] = [
    {
      href: "/dashboard",
      label: "ড্যাশবোর্ড ওভারভিউ",
      labelEn: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/profile",
      alternateHref: "/profile",
      label: "একাডেমিক প্রোফাইল",
      labelEn: "My Profile",
      icon: UserCheck,
      badge: isBn ? "৭৫%" : "75%",
      badgeColor: "bg-brand-100 text-brand-800",
    },
    {
      href: "/dashboard/goals",
      alternateHref: "/goals",
      label: "আমার লক্ষ্য ও ইনটেক",
      labelEn: "My Goals",
      icon: Target,
    },
    {
      href: "/dashboard/explore",
      alternateHref: "/explore",
      label: "দেশ এক্সপ্লোরার",
      labelEn: "Explore Countries",
      icon: Globe2,
    },
    {
      href: "/dashboard/universities",
      label: "বিশ্ববিদ্যালয় ও প্রোগ্রাম",
      labelEn: "Universities & Programs",
      icon: School,
      badge: isBn ? "৩টি শর্টলিস্ট" : "3 Shortlisted",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      href: "/dashboard/eligibility",
      alternateHref: "/eligibility",
      label: "অ্যাডমিশন যোগ্যতা",
      labelEn: "Admission Eligibility",
      icon: FileCheck2,
    },
    {
      href: "/dashboard/scholarships",
      alternateHref: "/scholarships",
      label: "স্কলারশিপ ফাইন্ডার",
      labelEn: "Scholarship Finder",
      icon: GraduationCap,
      badge: isBn ? "ম্যাচিং" : "Matches",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      href: "/dashboard/visa-guides",
      alternateHref: "/visa-guides",
      label: "ভিসা ও ব্যাংক সলভেন্সি",
      labelEn: "Student Visa Guide",
      icon: MapPin,
    },
    {
      href: "/dashboard/calculator",
      alternateHref: "/calculator",
      label: "খরচ ক্যালকুলেটর (টাকায়)",
      labelEn: "Financial Planner",
      icon: Calculator,
    },
    {
      href: "/dashboard/documents",
      alternateHref: "/documents",
      label: "ডকুমেন্ট ভল্ট",
      labelEn: "My Documents",
      icon: FolderLock,
    },
    {
      href: "/dashboard/roadmap",
      alternateHref: "/roadmap",
      label: "স্টাডি রোডম্যাপ",
      labelEn: "My Roadmap",
      icon: Compass,
      badge: isBn ? "পর্যায় ২" : "Stage 2",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      href: "/dashboard/deadlines",
      alternateHref: "/deadlines",
      label: "ডেডলাইন ও রিমাইন্ডার",
      labelEn: "Deadlines & Reminders",
      icon: CalendarClock,
      badge: isBn ? "৪টি আসন্ন" : "4 Upcoming",
      badgeColor: "bg-rose-100 text-rose-800",
    },
    {
      href: "/dashboard/sop-builder",
      alternateHref: "/sop-builder",
      label: "SOP ও মোটিভেশন বিল্ডার",
      labelEn: "SOP Builder",
      icon: FileText,
    },
    {
      href: "/dashboard/ai-assistant",
      alternateHref: "/ai-assistant",
      label: "এআই সহায়ক (ভেরিফাইড)",
      labelEn: "AI Study Abroad Assistant",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-purple-100 text-purple-800",
    },
    {
      href: "/dashboard/settings",
      alternateHref: "/settings",
      label: "সেটিংস ও নিরাপত্তা",
      labelEn: "Settings",
      icon: Settings,
    },
    {
      href: "/dashboard/admin",
      alternateHref: "/admin",
      label: "ইন্টারনাল অ্যাডমিন ও রিসার্চ",
      labelEn: "Admin & Research",
      icon: ShieldCheck,
      badge: "Staff",
      badgeColor: "bg-indigo-100 text-indigo-800",
    },
  ];

  const isLinkActive = (item: MenuItem) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return (
      pathname === item.href ||
      (item.alternateHref && pathname === item.alternateHref) ||
      pathname.startsWith(`${item.href}/`)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              AM
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 block leading-tight">AbroadMate</span>
              <span className="text-[10px] text-brand-700 font-semibold block leading-tight">
                {isBn ? "স্টুডেন্ট পোর্টাল" : "Student Portal"}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocale}
            className="px-2 py-1 text-[11px] font-bold text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50"
          >
            {locale === "bn" ? "EN" : "বাং"}
          </button>
          <Link
            href="/dashboard/deadlines"
            className="relative p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </Link>
          <Link href="/dashboard/profile" className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-brand-700 text-white text-[11px] font-bold flex items-center justify-center">
              {(currentUser?.fullName?.trim() || "AM").slice(0, 2)}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-white h-full overflow-y-auto p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    AM
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">AbroadMate</span>
                    <span className="text-[10px] text-brand-700 font-semibold block">
                      {isBn ? "স্টুডেন্ট পোর্টাল" : "Student Portal"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student status card in mobile */}
              <div className="p-3 bg-brand-50/90 border border-brand-200 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {(currentUser?.fullName?.trim() || "AM").slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {currentUser?.fullName || (locale === "bn" ? "শিক্ষার্থী" : "Student")}
                    </span>
                    <span className="text-[10px] text-brand-800 font-semibold block truncate">
                      {isBn ? "লক্ষ্য: " : "Target: "}
                      {currentProfile?.profile?.targetIntakeSeason
                        ? `${currentProfile.profile.targetIntakeSeason} ${currentProfile.profile.targetIntakeYear || 2026}`
                        : isBn
                        ? "ফল ২০২৬"
                        : "Fall 2026"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-brand-200/70 flex items-center justify-between text-[11px] text-slate-600">
                  <span>{isBn ? "প্রোফাইল পূর্ণতা:" : "Profile Completion:"}</span>
                  <span className="font-bold text-brand-800">
                    {currentProfile?.completion?.percentage ?? currentProfile?.profile?.completionPercentage ?? 25}%
                  </span>
                </div>
                <div className="w-full bg-brand-200 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full"
                    style={{ width: `${currentProfile?.completion?.percentage ?? currentProfile?.profile?.completionPercentage ?? 25}%` }}
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isLinkActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                        isActive
                          ? "bg-brand-700 text-white shadow-xs"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span>{locale === "bn" ? item.label : item.labelEn}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{locale === "bn" ? "লগআউট" : "Logout"}</span>
              </button>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 px-1">
                <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
                <span>{isBn ? "১০০% ফ্রি ও এজেন্সি-মুক্ত প্ল্যাটফর্ম" : "100% Free & Independent Platform"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 flex-col justify-between p-4 h-screen sticky top-0 overflow-y-auto">
        <div className="space-y-5">
          {/* Logo Branding */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-brand-800 transition-colors">
                AM
              </div>
              <div>
                <span className="font-extrabold text-base text-slate-900 block leading-tight tracking-tight">AbroadMate</span>
                <span className="text-[10px] text-brand-700 font-bold block leading-tight">
                  {isBn ? "স্টুডেন্ট ড্যাশবোর্ড" : "Student Dashboard"}
                </span>
              </div>
            </Link>

            <button
              onClick={toggleLocale}
              title="Change Language"
              className="px-2 py-1 text-[11px] font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {locale === "bn" ? "EN" : "বাং"}
            </button>
          </div>

          {/* User Status Card */}
          <div className="p-3.5 bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {(currentUser?.fullName?.trim() || "AM").slice(0, 2)}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {currentUser?.fullName || (locale === "bn" ? "শিক্ষার্থী" : "Student")}
                </span>
                <span className="text-[10px] text-brand-800 font-semibold block truncate">
                  {isBn ? "লক্ষ্য: " : "Target: "}
                  {currentProfile?.profile?.targetIntakeSeason
                    ? `${currentProfile.profile.targetIntakeSeason} ${currentProfile.profile.targetIntakeYear || 2026}`
                    : isBn
                    ? "ফল ২০২৬"
                    : "Fall 2026"}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-brand-200/80 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-medium">{isBn ? "প্রোফাইল পূর্ণতা:" : "Profile Completion:"}</span>
              <span className="font-extrabold text-brand-800">
                {currentProfile?.completion?.percentage ?? currentProfile?.profile?.completionPercentage ?? 25}%
              </span>
            </div>
            <div className="w-full bg-brand-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentProfile?.completion?.percentage ?? currentProfile?.profile?.completionPercentage ?? 25}%` }}
              />
            </div>
            <div className="mt-2.5 text-right">
              <Link
                href="/dashboard/profile"
                className="text-[10px] font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-0.5 hover:underline"
              >
                <span>{isBn ? "বাকি তথ্য পূরণ করুন" : "Complete Remaining Steps"}</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {locale === "bn" ? "মূল মেনু" : "MAIN MENU"}
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isLinkActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-brand-700 text-white shadow-xs font-bold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{locale === "bn" ? item.label : item.labelEn}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-1.5 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Free Promise Badge & Logout */}
        <div className="pt-3 border-t border-slate-100 space-y-2 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{locale === "bn" ? "লগআউট" : "Logout"}</span>
          </button>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">
                {isBn ? "১০০% সম্পূর্ণ ফ্রি পোর্টাল" : "100% Free & Independent Portal"}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                {isBn
                  ? "কোনো এজেন্সি মধ্যস্বত্বভোগী নয়, সরাসরি অফিসিয়াল নির্দেশিকা।"
                  : "Direct official guidelines without commercial agency intermediaries."}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
