import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AbroadMate — কোনো এজেন্সি ছাড়াই উচ্চশিক্ষার নির্ভরযোগ্য প্ল্যাটফর্ম",
  description:
    "বাংলাদেশের শিক্ষার্থীদের জন্য ১০০% সম্পূর্ণ ফ্রি, সঠিক ও ভেরিফাইড তথ্য দিয়ে সাজানো প্রথম এআই-পাওয়ার্ড স্টাডি অ্যাব্রড প্ল্যাটফর্ম। ইউকে, কানাডা, অস্ট্রেলিয়া, জার্মানি ও ইউএসএ উচ্চশিক্ষা গাইড।",
  keywords: [
    "study abroad bangladesh",
    "free study abroad guide",
    "ielts bangladesh",
    "uk student visa bangladesh",
    "germany blocked account bangladesh",
    "canada study permit",
    "australia subclass 500",
    "sop generator bengali",
    "scholarship for bangladeshi students",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-brand-100 selection:text-brand-900">
        <I18nProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
