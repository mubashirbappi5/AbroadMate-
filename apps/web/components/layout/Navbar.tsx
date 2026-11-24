"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  Compass,
  GraduationCap,
  Globe2,
  FileCheck2,
  Calculator,
  Bot,
  MapPin,
  Menu,
  X,
  Languages,
  ShieldCheck,
  User,
  Building2,
  Workflow,
  LogIn,
  Info,
  PhoneCall,
} from "lucide-react";

export function Navbar() {
  const { t, locale, toggleLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<{ fullName: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSessionUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const publicNavLinks = [
    { href: "/how-it-works", label: "কিভাবে কাজ করে", icon: Workflow },
    { href: "/universities", label: "বিশ্ববিদ্যালয়সমূহ", icon: Building2 },
    { href: "/explore", label: t.nav.countries, icon: Globe2 },
    { href: "/scholarships", label: t.nav.scholarships, icon: GraduationCap },
    { href: "/calculator", label: t.nav.costCalculator, icon: Calculator },
    { href: "/about", label: "আমাদের কথা", icon: Info },
    { href: "/contact", label: "যোগাযোগ", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Trust Notice Banner */}
      <div className="bg-brand-900 text-brand-50 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-300" />
        <span>{t.app.antiAgencyBadge}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-xs shadow-brand-700/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Abroad<span className="text-brand-700">Mate</span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium">
                বাংলা স্টাডি অ্যাব্রড গাইড
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-1">
            {publicNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-brand-800 bg-brand-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Locale Switcher */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              title="বাংলা ও ইংরেজির মধ্যে পরিবর্তন করুন"
            >
              <Languages className="w-3.5 h-3.5 text-brand-700" />
              <span>{locale === "bn" ? "English" : "বাংলা"}</span>
            </button>

            {/* User Navigation / CTA */}
            {sessionUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-colors shadow-brand-700/20"
              >
                <User className="w-3.5 h-3.5" />
                <span>{sessionUser.fullName.split(" ")[0]} ({t.nav.dashboard})</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-transparent transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>লগইন</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-colors shadow-brand-700/20"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>ফ্রি রেজিস্ট্রেশন</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleLocale}
              className="px-2 py-1 text-xs font-semibold bg-slate-100 border border-slate-200 rounded text-slate-700"
            >
              {locale === "bn" ? "EN" : "বাং"}
            </button>
            <Link
              href="/login"
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 border border-slate-200 rounded text-slate-700"
            >
              লগইন
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1.5 max-h-[80vh] overflow-y-auto">
          {publicNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "text-brand-800 bg-brand-50 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4 text-brand-700" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg text-center"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-brand-700 rounded-lg text-center"
              >
                <span>রেজিস্ট্রেশন (ফ্রি)</span>
              </Link>
            </div>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-sm font-semibold rounded-lg shadow-xs"
            >
              <User className="w-4 h-4" />
              <span>{t.nav.dashboard}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
