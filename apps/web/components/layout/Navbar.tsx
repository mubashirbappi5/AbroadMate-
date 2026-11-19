"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export function Navbar() {
  const { t, locale, toggleLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/explore", label: t.nav.countries, icon: Globe2 },
    { href: "/eligibility", label: t.nav.eligibility, icon: FileCheck2 },
    { href: "/scholarships", label: t.nav.scholarships, icon: GraduationCap },
    { href: "/visa-guides", label: t.nav.visaGuide, icon: MapPin },
    { href: "/calculator", label: t.nav.costCalculator, icon: Calculator },
    { href: "/roadmap", label: t.nav.roadmap, icon: Compass },
    { href: "/ai-assistant", label: t.nav.assistant, icon: Bot },
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
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-sm shadow-brand-700/20">
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
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-brand-800 bg-brand-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Locale Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              title="বাংলা ও ইংরেজির মধ্যে পরিবর্তন করুন"
            >
              <Languages className="w-3.5 h-3.5 text-brand-700" />
              <span>{locale === "bn" ? "English" : "বাংলা"}</span>
            </button>

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors shadow-brand-700/20"
            >
              <User className="w-4 h-4" />
              <span>{t.nav.dashboard}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLocale}
              className="px-2 py-1 text-xs font-semibold bg-slate-100 border border-slate-200 rounded text-slate-700"
            >
              {locale === "bn" ? "EN" : "বাং"}
            </button>
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
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg ${
                  isActive
                    ? "text-brand-800 bg-brand-50 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5 text-brand-700" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-brand-700 hover:bg-brand-800 text-white px-4 py-3 text-base font-semibold rounded-lg shadow-sm"
            >
              <User className="w-5 h-5" />
              <span>{t.nav.dashboard}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
