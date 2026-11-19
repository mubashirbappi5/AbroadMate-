"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
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
  Sparkles,
} from "lucide-react";

interface EmbassyInfo {
  country: string;
  flag: string;
  name: string;
  address: string;
  phone: string;
  vfsCenter: string;
  officialUrl: string;
}

const DHAKA_EMBASSIES: EmbassyInfo[] = [
  {
    country: "যুক্তরাজ্য (ইউকে)",
    flag: "🇬🇧",
    name: "British High Commission, Dhaka",
    address: "ইউনাইটেড নেশনস রোড, বারিধারা ডিপ্লোম্যাটিক জোন, ঢাকা ১২১২",
    phone: "+880 2 5566 8700",
    vfsCenter: "ভিএফএস গ্লোবাল (VFS Global), ডেল্টা লাইফ টাওয়ার, গুলশান ২, ঢাকা",
    officialUrl: "https://www.gov.uk/world/organisations/british-high-commission-dhaka",
  },
  {
    country: "কানাডা",
    flag: "🇨🇦",
    name: "High Commission of Canada in Bangladesh",
    address: "মাদানী এভিনিউ, বারিধারা ডিপ্লোম্যাটিক এনক্লেভ, ঢাকা ১২১২",
    phone: "+880 2 5566 8600",
    vfsCenter: "কানাডা ভিসা অ্যাপলিকেশন সেন্টার (CVAC / VFS), ডেল্টা লাইফ টাওয়ার, গুলশান ২, ঢাকা",
    officialUrl: "https://www.international.gc.ca/country-pays/bangladesh/dhaka.aspx",
  },
  {
    country: "অস্ট্রেলিয়া",
    flag: "🇦🇺",
    name: "Australian High Commission, Dhaka",
    address: "১৮৪ গুলশান এভিনিউ, গুলশান ২, ঢাকা ১২১২",
    phone: "+880 2 5881 3105",
    vfsCenter: "ভিএফএস অস্ট্রেলিয়া বায়োমেট্রিক কালেকশন সেন্টার, বোরাক মেহনুর, গুলশান ১, ঢাকা",
    officialUrl: "https://bangladesh.embassy.gov.au/",
  },
  {
    country: "জার্মানি",
    flag: "🇩🇪",
    name: "Embassy of the Federal Republic of Germany, Dhaka",
    address: "মাদানী এভিনিউ (কানাডিয়ান হাইকমিশনের বিপরীতে), বারিধারা, ঢাকা ১২১২",
    phone: "+880 2 5566 8650",
    vfsCenter: "জার্মান ভিসা আবেদন ও সাক্ষাৎকার: সরাসরি দূতাবাস কনস্যুলার সেকশন / ভিএফএস ঢাকা",
    officialUrl: "https://dhaka.diplo.de/bd-en/service/visa-einreise/studium-und-ausbildung",
  },
  {
    country: "যুক্তরাষ্ট্র (ইউএসএ)",
    flag: "🇺🇸",
    name: "Embassy of the United States of America, Dhaka",
    address: "মাদানী এভিনিউ, বারিধারা, ঢাকা ১২১২",
    phone: "+880 2 5566 2000",
    vfsCenter: "ডিএস-১৬০ পূরণ ও ভিসা অ্যাপয়েন্টমেন্ট: USTravelDocs বাংলাদেশ কনস্যুলার পোর্টাল",
    officialUrl: "https://bd.usembassy.gov/",
  },
];

const FAQS = [
  {
    question: "বিদেশে আবেদনের জন্য আসলেই কি কোনো এজেন্সির সাহায্য দরকার আছে?",
    answer:
      "একেবারেই না। বিশ্বমানের সব বিশ্ববিদ্যালয়ের নিজস্ব অনলাইন অ্যাপ্লিকেশন পোর্টাল রয়েছে, যা সরাসরি শিক্ষার্থীদের ব্যবহারের উপযোগী করে তৈরি। কোনো এজেন্সির বিশেষ কোনো 'ভিসা কোটা' বা স্পেশাল এক্সেস থাকে না। আপনি প্রয়োজনীয় কাগজপত্র গুছিয়ে অফিশিয়াল ওয়েবসাইটে নিজেই নির্ভুলভাবে আবেদন করতে পারেন।",
  },
  {
    question: "ব্যাংক সলভেন্সি ও স্পন্সরশিপ ফান্ড কিভাবে দেখাতে হয়?",
    answer:
      "ইউকে, অস্ট্রেলিয়া বা কানাডার জন্য পিতা/মাতার একাউন্টে নির্দিষ্ট মেয়াদ (যেমন ইউকেতে টানা ২৮ দিন) ধরে টিউশন ও লিভিং খরচের বৈধ ফান্ড দেখাতে হয়। টাকার উৎস (যেমন বেতন, ব্যবসা, জমি বিক্রির ট্যাক্স রিটার্ন ফাইল) পরিষ্কার থাকা আবশ্যক। আর জার্মানির ক্ষেত্রে নির্দিষ্ট অংকের টাকা (€১১,৯০৪ ইউরো) সরকারি নিয়মে Expatrio বা Fintiba-এর মতো অনুমোদিত ব্লকড অ্যাকাউন্টে রাখতে হয়।",
  },
  {
    question: "জার্মানিতে কি ইংরেজি মাধ্যমে ব্যাচেলর বা মাস্টার্স পড়া যায়?",
    answer:
      "হ্যাঁ, জার্মানিতে শত শত মাস্টার্স কোর্স এবং বেশ কিছু ব্যাচেলর কোর্স সম্পূর্ণ ইংরেজি ভাষায় পড়ানো হয়। এর জন্য কোনো জার্মান ভাষা জানা বাধ্যতামূলক নয়, শুধুমাত্র আইইএলটিএস বা টোফেল স্কোর থাকলেই চলে। তবে জার্মানিতে দৈনন্দিন চলাফেরার জন্য প্রাথমিক (A1/A2) শেখা সহায়ক।",
  },
  {
    question: "বাংলাদেশ থেকে বিশ্ববিদ্যালয়ের আবেদন ফি কিভাবে পরিশোধ করব?",
    answer:
      "যেকোনো বাংলাদেশি ব্যাংকের ডুয়েল কারেন্সি (Dual Currency) ডেবিট বা ক্রেডিট কার্ড (পাসপোর্টের সাথে এন্ডোর্সমেন্ট করা) দিয়ে বিশ্ববিদ্যালয়ের অফিশিয়াল পোর্টালে অনলাইনেই সরাসরি আবেদন ফি পেমেন্ট করা যায়। এছাড়া অধিকাংশ বিশ্ববিদ্যালয় Flywire বা Convera-এর মাধ্যমে ব্যাংক ট্রান্সফার গ্রহণ করে।",
  },
  {
    question: "AbroadMate প্ল্যাটফর্ম কি সবসময় সম্পূর্ণ ফ্রি থাকবে?",
    answer:
      "হ্যাঁ, AbroadMate প্ল্যাটফর্মের সমস্ত গাইডলাইন, ক্যালকুলেটর, এসওপি নির্দেশিকা ও বিশ্ববিদ্যালয়ের তথ্য আজীবন ১০০% ফ্রি থাকবে। আমরা কখনোই কোনো শিক্ষার্থীর কাছ থেকে কনসালটেন্সি বা ফাইল ওপেনিংয়ের নামে টাকা নেব না।",
  },
  {
    question: "আমার এসওপি (SOP) কি এআই দিয়ে সরাসরি সাবমিট করা নিরাপদ?",
    answer:
      "আমাদের প্ল্যাটফর্মের এআই টুল আপনাকে আপনার নিজস্ব গল্প, লক্ষ্য ও অভিজ্ঞতা গুছিয়ে লেখার রূপরেখা দেয়। আমরা কখনোই হুবহু রোবটিক এসওপি জেনারেট করে জমা দিতে বলি না। এআই নির্দেশিকা অনুযায়ী আপনার নিজস্ব বাস্তব উদাহরণ যুক্ত করে একটি ইউনিক এসওপি তৈরি করাই সেরা উপায়।",
  },
];

export default function ContactPage() {
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
            <span>সাপোর্ট ও ঢাকা দূতাবাস ডিরেক্টরি</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            যোগাযোগ ও <span className="text-brand-700">সহায়তা কেন্দ্র</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            কোনো দ্বিধা বা প্রশ্ন থাকলে আমাদের জানান। নিচে ঢাকার শীর্ষ দূতাবাসগুলোর অফিশিয়াল ঠিকানা এবং জরুরি প্রশ্নোত্তর সংযুক্ত রয়েছে।
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Form + Support Info */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-2">শিক্ষার্থী বার্তা ও সহায়তা ফর্ম</h2>
            <p className="text-xs text-slate-500 mb-6">
              উচ্চশিক্ষা সংক্রান্ত যেকোনো প্রশ্ন বা পরামর্শের জন্য আমাদের বার্তা পাঠান।
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-950">আপনার বার্তা সফলভাবে গৃহীত হয়েছে!</h3>
                <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  ধন্যবাদ, {formData.name}। আমাদের ভলান্টিয়ার স্টুডেন্ট সাপোর্ট টিম শীঘ্রই আপনার ইমেইল ({formData.email})-এ বিস্তারিত নির্দেশনা পাঠাবে।
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
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      মোবাইল নম্বর (+৮৮০)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1700 000000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      পছন্দের গন্তব্য দেশ
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                    >
                      <option value="UK">🇬🇧 যুক্তরাজ্য (UK)</option>
                      <option value="CA">🇨🇦 কানাডা (Canada)</option>
                      <option value="AU">🇦🇺 অস্ট্রেলিয়া (Australia)</option>
                      <option value="DE">🇩🇪 জার্মানি (Germany)</option>
                      <option value="US">🇺🇸 যুক্তরাষ্ট্র (USA)</option>
                      <option value="OTHER">অন্যান্য / এখনও নিশ্চিত নই</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    আপনার প্রশ্ন বা সমস্যা <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="আপনার শিক্ষাগত যোগ্যতা, আইইএলটিএস স্কোর বা নির্দিষ্ট কোনো জিজ্ঞাসা বিস্তারিত লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>বিনামূল্যে পরামর্শের জন্য বার্তা পাঠান</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info: 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-7 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wide">
                <Globe2 className="w-4 h-4" />
                <span>সরাসরি শিক্ষার্থী সহায়তা</span>
              </div>
              <h3 className="text-xl font-bold text-white">AbroadMate হেল্পডেস্ক</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                আমরা কোনো বাণিজ্যিক কল সেন্টার নই। আমাদের স্বেচ্ছাসেবী প্যানেলে আছেন বিভিন্ন দেশে অধ্যয়নরত অভিজ্ঞ বাংলাদেশি গ্র্যাজুয়েট ও গবেষকবৃন্দ।
              </p>

              <div className="pt-2 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>ইমেইল: support@abroadmate.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>রেসপন্স টাইম: সাধারণত ২৪ ঘণ্টার মধ্যে</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>১০০% গোপনীয়তা ও কোনো ধরনের ডাটা বিক্রি নয়</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 p-6 rounded-3xl border border-brand-200/80 space-y-3">
              <h4 className="text-sm font-bold text-brand-900">কমিউনিটি ডিসকাশন গ্রুপ</h4>
              <p className="text-xs text-brand-800 leading-relaxed">
                ফেসবুক এবং টেলিগ্রাম গ্রুপে যুক্ত হয়ে সহপাঠীদের সাথে আইইএলটিএস প্রস্তুতি, ভিসা অ্যাপয়েন্টমেন্ট ও এয়ার টিকিট টিপস শেয়ার করুন।
              </p>
              <div className="pt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline"
                >
                  <span>ফেসবুক গ্রুপে যোগ দিন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dhaka Embassies Directory */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-md">
            ভেরিফাইড সরকারি ঠিকানা
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">
            ঢাকাস্থ অফিশিয়াল দূতাবাস ও হাইকমিশন ডিরেক্টরি
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            ভিসা আবেদন ও বায়োমেট্রিকের জন্য প্রয়োজনীয় ঢাকা ভিত্তিক দূতাবাস ও ভিএফএস সেন্টারের সঠিক তথ্য
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DHAKA_EMBASSIES.map((emb, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-brand-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{emb.flag}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{emb.country}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-3">{emb.name}</h3>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{emb.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{emb.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                    <Building className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{emb.vfsCenter}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <a
                  href={emb.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
                >
                  <span>অফিশিয়াল ওয়েবসাইট ভিজিট করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-md">
            সচরাচর জিজ্ঞাসিত প্রশ্ন
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">
            উচ্চশিক্ষা ও ভিসা সংক্রান্ত সাধারণ জিজ্ঞাসা (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-brand-700"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-brand-700" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
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
