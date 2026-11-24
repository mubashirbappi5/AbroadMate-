"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  Compass,
  GraduationCap,
  Globe2,
  Calculator,
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
  ChevronDown,
  CheckCircle2,
  Calendar,
  FileCheck2,
} from "lucide-react";

export function Navbar() {
  const { t, locale, toggleLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<{ fullName: string } | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  // Primary navigation links visible directly in the header
  const primaryNavLinks = [
    { href: "/explore", label: t.nav.countries, icon: Globe2 },
    { href: "/universities", label: t.nav.universities, icon: Building2 },
    { href: "/scholarships", label: t.nav.scholarships, icon: GraduationCap },
    { href: "/calculator", label: t.nav.costCalculator, icon: Calculator },
    { href: "/how-it-works", label: t.nav.howItWorks, icon: Workflow },
  ];

  // Secondary items kept in a sleek dropdown to prevent any wrapping on 1024px-1366px screens
  const moreNavLinks = [
    { href: "/eligibility", label: t.nav.eligibility, icon: FileCheck2 },
    { href: "/roadmap", label: t.nav.roadmap, icon: Compass },
    { href: "/about", label: t.nav.about, icon: Info },
    { href: "/contact", label: t.nav.contact, icon: PhoneCall },
  ];

  const allNavLinks = [...primaryNavLinks, ...moreNavLinks];

  const isMoreActive = moreNavLinks.some(
    (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      {/* Top Trust Notice Banner */}
      <div className="bg-brand-900 text-brand-50 text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-300 shrink-0" />
        <span className="truncate">{t.app.antiAgencyBadge}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-xs shadow-brand-700/20 group-hover:bg-brand-800 transition-colors">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-0.5 leading-none">
                Abroad<span className="text-brand-700">Mate</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5 whitespace-nowrap">
                {t.nav.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Visible on lg: 1024px and up) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-brand-800 bg-brand-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isMoreActive
                    ? "text-brand-800 bg-brand-50 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>{t.nav.more}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? "rotate-180 text-brand-700" : "text-slate-400"
                  }`}
                />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {locale === "bn" ? "অতিরিক্ত সেবাসমূহ" : "Additional Features"}
                  </div>
                  {moreNavLinks.map((subLink) => {
                    const SubIcon = subLink.icon;
                    const isSubActive =
                      pathname === subLink.href ||
                      (subLink.href !== "/" && pathname.startsWith(subLink.href));
                    return (
                      <Link
                        key={subLink.href}
                        href={subLink.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                          isSubActive
                            ? "bg-brand-50 text-brand-800 font-semibold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <SubIcon className="w-4 h-4 text-brand-600 shrink-0" />
                        <span>{subLink.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons & Locale Switcher (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
              title={locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            >
              <Languages className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>{locale === "bn" ? "English" : "বাংলা"}</span>
            </button>

            {/* Authenticated user button or login/register */}
            {sessionUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-colors shadow-brand-700/20 whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {sessionUser.fullName.split(" ")[0]} ({t.common.dashboard})
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{t.common.login}</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-colors shadow-brand-700/20 whitespace-nowrap"
                >
                  <span>{t.common.signup}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls (Visible on < lg) */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={toggleLocale}
              className="px-2 py-1 text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Toggle Language"
            >
              {locale === "bn" ? "EN" : "বাং"}
            </button>

            {sessionUser ? (
              <Link
                href="/dashboard"
                className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 font-bold text-xs"
              >
                <User className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {t.common.login}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 max-h-[85vh] overflow-y-auto shadow-xl">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {locale === "bn" ? "মেনু" : "NAVIGATION"}
          </div>

          {allNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? "text-brand-800 bg-brand-50 font-bold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-700" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            {sessionUser ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-brand-700 hover:bg-brand-800 text-white px-4 py-2.5 text-sm font-bold rounded-xl shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>
                  {sessionUser.fullName} ({t.common.dashboard})
                </span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.common.login}</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl text-center shadow-xs"
                >
                  <span>{t.common.signup}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
