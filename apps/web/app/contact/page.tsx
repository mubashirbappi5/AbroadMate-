"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import {
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
  Send,
  CheckCircle2,
  HelpCircle,
  Building,
  ShieldCheck,
  MessageSquare,
  Globe2,
  Clock,
} from "lucide-react";

interface EmbassyInfo {
  countryBn: string;
  countryEn: string;
  flag: string;
  name: string;
  addressBn: string;
  addressEn: string;
  phone: string;
  vfsCenterBn: string;
  vfsCenterEn: string;
  officialUrl: string;
}

const DHAKA_EMBASSIES: EmbassyInfo[] = [
  {
    countryBn: "যুক্তরাজ্য (ইউকে)",
    countryEn: "United Kingdom",
    flag: "🇬🇧",
    name: "British High Commission, Dhaka",
    addressBn: "ইউনাইটেড নেশনস রোড, বারিধারা ডিপ্লোম্যাটিক জোন, ঢাকা ১২১২",
    addressEn: "United Nations Road, Baridhara Diplomatic Zone, Dhaka 1212",
    phone: "+880 2 5566 8700",
    vfsCenterBn: "ভিএফএস গ্লোবাল (VFS Global), ডেল্টা লাইফ টাওয়ার, গুলশান ২, ঢাকা",
    vfsCenterEn: "VFS Global, Delta Life Tower, Gulshan 2, Dhaka",
    officialUrl: "https://www.gov.uk/world/organisations/british-high-commission-dhaka",
  },
  {
    countryBn: "কানাডা",
    countryEn: "Canada",
    flag: "🇨🇦",
    name: "High Commission of Canada in Bangladesh",
    addressBn: "মাদানী এভিনিউ, বারিধারা ডিপ্লোম্যাটিক এনক্লেভ, ঢাকা ১২১২",
    addressEn: "Madani Avenue, Baridhara Diplomatic Enclave, Dhaka 1212",
    phone: "+880 2 5566 8600",
    vfsCenterBn: "কানাডা ভিসা অ্যাপলিকেশন সেন্টার (CVAC / VFS), ডেল্টা লাইফ টাওয়ার, গুলশান ২, ঢাকা",
    vfsCenterEn: "Canada Visa Application Centre (CVAC/VFS), Delta Life Tower, Gulshan 2, Dhaka",
    officialUrl: "https://www.international.gc.ca/country-pays/bangladesh/dhaka.aspx",
  },
  {
    countryBn: "অস্ট্রেলিয়া",
    countryEn: "Australia",
    flag: "🇦🇺",
    name: "Australian High Commission, Dhaka",
    addressBn: "১৮৪ গুলশান এভিনিউ, গুলশান ২, ঢাকা ১২১২",
    addressEn: "184 Gulshan Avenue, Gulshan 2, Dhaka 1212",
    phone: "+880 2 5881 3105",
    vfsCenterBn: "ভিএফএস অস্ট্রেলিয়া বায়োমেট্রিক কালেকশন সেন্টার, বোরাক মেহনুর, গুলশান ১, ঢাকা",
    vfsCenterEn: "VFS Australian Biometric Collection Centre, Borak Mehnur, Gulshan 1, Dhaka",
    officialUrl: "https://bangladesh.embassy.gov.au/",
  },
  {
    countryBn: "জার্মানি",
    countryEn: "Germany",
    flag: "🇩🇪",
    name: "Embassy of the Federal Republic of Germany, Dhaka",
    addressBn: "মাদানী এভিনিউ (কানাডিয়ান হাইকমিশনের বিপরীতে), বারিধারা, ঢাকা ১২১২",
    addressEn: "Madani Avenue (Opposite Canadian High Commission), Baridhara, Dhaka 1212",
    phone: "+880 2 5566 8650",
    vfsCenterBn: "জার্মান ভিসা আবেদন ও সাক্ষাৎকার: সরাসরি দূতাবাস কনস্যুলার সেকশন / ভিএফএস ঢাকা",
    vfsCenterEn: "German Visa Section: Embassy Consular Section / VFS Dhaka",
    officialUrl: "https://dhaka.diplo.de/bd-en/service/visa-einreise/studium-und-ausbildung",
  },
  {
    countryBn: "যুক্তরাষ্ট্র (ইউএসএ)",
    countryEn: "United States",
    flag: "🇺🇸",
    name: "Embassy of the United States of America, Dhaka",
    addressBn: "মাদানী এভিনিউ, বারিধারা, ঢাকা ১২১২",
    addressEn: "Madani Avenue, Baridhara, Dhaka 1212",
    phone: "+880 2 5566 2000",
    vfsCenterBn: "ডিএস-১৬০ পূরণ ও ভিসা অ্যাপয়েন্টমেন্ট: USTravelDocs বাংলাদেশ কনস্যুলার পোর্টাল",
    vfsCenterEn: "DS-160 & Visa Appointments: USTravelDocs Bangladesh Consular Portal",
    officialUrl: "https://bd.usembassy.gov/",
  },
];

export default function ContactPage() {
  const { locale } = useI18n();
  const isBn = locale === "bn";

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "UK",
    topic: "admission",
    message: "",
  });

  const faqs = [
    {
      qBn: "বিদেশে আবেদনের জন্য আসলেই কি কোনো এজেন্সির সাহায্য দরকার আছে?",
      qEn: "Do I really need an educational agency or agent to apply abroad?",
      aBn: "একেবারেই না। বিশ্বমানের সব বিশ্ববিদ্যালয়ের নিজস্ব অনলাইন অ্যাপ্লিকেশন পোর্টাল রয়েছে, যা সরাসরি শিক্ষার্থীদের ব্যবহারের উপযোগী করে তৈরি। কোনো এজেন্সির বিশেষ কোনো 'ভিসা কোটা' বা স্পেশাল এক্সেস থাকে না। আপনি প্রয়োজনীয় কাগজপত্র গুছিয়ে অফিশিয়াল ওয়েবসাইটে নিজেই নির্ভুলভাবে আবেদন করতে পারেন।",
      aEn: "Not at all. Globally accredited universities host their own direct online application portals. No agency holds exclusive visa quotas or secret channels. With verified instructions and accurate documents, you can apply directly with complete confidence.",
    },
    {
      qBn: "ব্যাংক সলভেন্সি ও স্পন্সরশিপ ফান্ড কিভাবে দেখাতে হয়?",
      qEn: "How does bank solvency and sponsorship funding work?",
      aBn: "ইউকে, অস্ট্রেলিয়া বা কানাডার জন্য পিতা/মাতার একাউন্টে নির্দিষ্ট মেয়াদ (যেমন ইউকেতে টানা ২৮ দিন) ধরে টিউশন ও লিভিং খরচের বৈধ ফান্ড দেখাতে হয়। টাকার উৎস পরিষ্কার থাকা আবশ্যক। আর জার্মানির ক্ষেত্রে নির্দিষ্ট অংকের টাকা (€১১,৯০৪ ইউরো) সরকারি নিয়মে অনুমোদিত ব্লকড অ্যাকাউন্টে রাখতে হয়।",
      aEn: "For the UK, Australia, and Canada, legitimate funding (tuition + living expenses) must be held in your parents' or your own bank account for the mandated duration (e.g. 28 consecutive days for the UK). For Germany, €11,904 must be placed into an official blocked account.",
    },
    {
      qBn: "জার্মানিতে কি ইংরেজি মাধ্যমে ব্যাচেলর বা মাস্টার্স পড়া যায়?",
      qEn: "Can I study in Germany with English as the medium of instruction?",
      aBn: "হ্যাঁ, জার্মানিতে শত শত মাস্টার্স কোর্স এবং বেশ কিছু ব্যাচেলর কোর্স সম্পূর্ণ ইংরেজি ভাষায় পড়ানো হয়। এর জন্য কোনো জার্মান ভাষা জানা বাধ্যতামূলক নয়, শুধুমাত্র আইইএলটিএস বা টোফেল স্কোর থাকলেই চলে।",
      aEn: "Yes! German universities offer hundreds of English-taught Master's degrees and an increasing number of Bachelor's programs requiring only IELTS or TOEFL scores.",
    },
    {
      qBn: "বাংলাদেশ থেকে বিশ্ববিদ্যালয়ের আবেদন ফি কিভাবে পরিশোধ করব?",
      qEn: "How do I pay university application fees from Bangladesh?",
      aBn: "যেকোনো বাংলাদেশি ব্যাংকের ডুয়েল কারেন্সি ডেবিট বা ক্রেডিট কার্ড (পাসপোর্টের সাথে এন্ডোর্সমেন্ট করা) দিয়ে বিশ্ববিদ্যালয়ের অফিশিয়াল পোর্টালে অনলাইনেই সরাসরি আবেদন ফি পেমেন্ট করা যায়। এছাড়া অধিকাংশ বিশ্ববিদ্যালয় Flywire বা Convera-এর মাধ্যমে ব্যাংক ট্রান্সফার গ্রহণ করে।",
      aEn: "Any dual-currency debit or credit card endorsed against your Bangladeshi passport can be used directly on the official application portal. Most universities also accept bank transfers via Flywire or Convera.",
    },
    {
      qBn: "AbroadMate প্ল্যাটফর্ম কি সবসময় সম্পূর্ণ ফ্রি থাকবে?",
      qEn: "Will AbroadMate always remain completely free?",
      aBn: "হ্যাঁ, AbroadMate প্ল্যাটফর্মের সমস্ত গাইডলাইন, ক্যালকুলেটর, এসওপি নির্দেশিকা ও বিশ্ববিদ্যালয়ের তথ্য আজীবন ১০০% ফ্রি থাকবে। আমরা কখনোই কোনো শিক্ষার্থীর কাছ থেকে কনসালটেন্সি বা ফাইল ওপেনিংয়ের নামে টাকা নেব না।",
      aEn: "Yes. All guides, calculators, SOP tools, and university data are 100% free forever. We never charge students service fees, commissions, or file opening charges.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-14 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold mb-4">
            <MessageSquare className="w-4 h-4 text-brand-700" />
            <span>{isBn ? "সাপোর্ট ও ঢাকা দূতাবাস ডিরেক্টরি" : "Support & Dhaka Embassy Directory"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            {isBn ? (
              <>
                যোগাযোগ ও <span className="text-brand-700">সহায়তা কেন্দ্র</span>
              </>
            ) : (
              <>
                Contact & <span className="text-brand-700">Student Support</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "কোনো দ্বিধা বা প্রশ্ন থাকলে আমাদের জানান। নিচে ঢাকার শীর্ষ দূতাবাসগুলোর অফিশিয়াল ঠিকানা এবং জরুরি প্রশ্নোত্তর সংযুক্ত রয়েছে।"
              : "Have questions about studying abroad independently? Reach out to our community or explore official embassy directories in Dhaka below."}
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Form + Support Info */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {isBn ? "শিক্ষার্থী বার্তা ও সহায়তা ফর্ম" : "Send Us a Message"}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {isBn
                ? "উচ্চশিক্ষা সংক্রান্ত যেকোনো প্রশ্ন বা পরামর্শের জন্য আমাদের বার্তা পাঠান।"
                : "Ask any question regarding university admission, visa rules, or document requirements."}
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-950">
                  {isBn ? "আপনার বার্তা সফলভাবে গৃহীত হয়েছে!" : "Message Sent Successfully!"}
                </h3>
                <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {isBn
                    ? `ধন্যবাদ, ${formData.name}। আমাদের ভলান্টিয়ার স্টুডেন্ট সাপোর্ট টিম শীঘ্রই আপনার ইমেইল (${formData.email})-এ বিস্তারিত নির্দেশনা পাঠাবে।`
                    : `Thank you, ${formData.name}. Our student support team will reply directly to ${formData.email}.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      country: "UK",
                      topic: "admission",
                      message: "",
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  {isBn ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? "আপনার নাম" : "Your Name"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isBn ? "যেমন: তানভীর আহমেদ" : "e.g. Tanvir Ahmed"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? "ইমেইল ঠিকানা" : "Email Address"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? "পছন্দের দেশ" : "Target Country"}
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    >
                      <option value="UK">🇬🇧 {isBn ? "যুক্তরাজ্য (UK)" : "United Kingdom"}</option>
                      <option value="CA">🇨🇦 {isBn ? "কানাডা (Canada)" : "Canada"}</option>
                      <option value="AU">🇦🇺 {isBn ? "অস্ট্রেলিয়া (Australia)" : "Australia"}</option>
                      <option value="DE">🇩🇪 {isBn ? "জার্মানি (Germany)" : "Germany"}</option>
                      <option value="US">🇺🇸 {isBn ? "যুক্তরাষ্ট্র (USA)" : "United States"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isBn ? "বার্তার বিষয়" : "Topic"}
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    >
                      <option value="admission">{isBn ? "বিশ্ববিদ্যালয় ভর্তি ও যোগ্যতা" : "University Admission & Eligibility"}</option>
                      <option value="visa">{isBn ? "ভিসা ও ব্যাংক সলভেন্সি" : "Visa & Bank Solvency"}</option>
                      <option value="scholarship">{isBn ? "স্কলারশিপ সংক্রান্ত প্রশ্ন" : "Scholarships"}</option>
                      <option value="technical">{isBn ? "ওয়েবসাইট ব্যবহারের সমস্যা" : "Technical Support"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isBn ? "আপনার বিস্তারিত বার্তা" : "Your Message"} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isBn
                        ? "আপনার পূর্ববর্তী রেজাল্ট, আইইএলটিএস স্কোর বা নির্দিষ্ট কোনো সমস্যা বিস্তারিত লিখুন..."
                        : "Describe your academic background, test scores, or specific question..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl shadow-xs transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isBn ? "বার্তা পাঠান" : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info: 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>{isBn ? "সরাসরি যোগাযোগ ও সহায়তা" : "Direct Support Channels"}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? "আমাদের স্টুডেন্ট হেল্পডেস্ক সম্পূর্ণ অলাভজনক ভিত্তিতে পরিচালিত হয়। আমরা কোনো বাণিজ্যিক সার্ভিস ফি গ্রহণ করি না।"
                  : "AbroadMate support is completely volunteer and non-profit driven. We do not sell consultancy packages."}
              </p>
              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-900">{isBn ? "ইমেইল যোগাযোগ:" : "Official Email:"}</span>
                    <a href="mailto:support@abroadmate.org" className="text-brand-700 hover:underline">
                      support@abroadmate.org
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-900">{isBn ? "সাপোর্ট সময়:" : "Support Hours:"}</span>
                    <span>{isBn ? "রবিবার - বৃহস্পতিবার: সকাল ৯টা - সন্ধ্যা ৬টা" : "Sunday - Thursday: 9:00 AM - 6:00 PM (BST)"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Dhaka Embassies Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-3">
            <Building className="w-4 h-4 text-brand-700" />
            <span>{isBn ? "অফিসিয়াল কূটনৈতিক ও ভিসা ডিরেক্টরি" : "Diplomatic Missions"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
            {isBn ? "ঢাকাস্থ অফিশিয়াল দূতাবাস ও হাইকমিশন" : "Official Embassies & High Commissions in Dhaka"}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {isBn
              ? "সরাসরি দূতাবাস ও সরকার অনুমোদিত ভিসা অ্যাপ্লিকেশন সেন্টারের অফিশিয়াল ঠিকানা"
              : "Direct contact and biometric center locations for student visa applicants"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DHAKA_EMBASSIES.map((e, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-brand-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="text-3xl">{e.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {isBn ? e.countryBn : e.countryEn}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium block">{e.name}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                    <span>{isBn ? e.addressBn : e.addressEn}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">{isBn ? "ভিসা সেন্টার: " : "Visa Center: "}</strong>
                      {isBn ? e.vfsCenterBn : e.vfsCenterEn}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <a
                  href={e.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  <span>{isBn ? "অফিসিয়াল পোর্টাল দেখুন" : "Visit Official Portal"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-3">
            <HelpCircle className="w-4 h-4 text-brand-700" />
            <span>{isBn ? "জরুরি প্রশ্নোত্তর" : "Frequently Asked Questions"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {isBn ? "শিক্ষার্থীদের সাধারণ প্রশ্নসমূহ" : "Common Questions From Students"}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
                >
                  <span>{isBn ? faq.qBn : faq.qEn}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-700" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {isBn ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
