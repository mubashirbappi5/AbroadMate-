"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Compass,
  AlertCircle,
  FileCheck2,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Info,
  Clock,
  RotateCcw,
} from "lucide-react";
import { OfficialSourceCitation } from "@abroadmate/ai";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  citedSources?: OfficialSourceCitation[];
  applicableRequirement?: string;
  limitations?: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "যুক্তরাজ্যের স্টুডেন্ট ভিসায় কত টাকার ব্যাংক ব্যালেন্স দেখাতে হবে?",
  "জার্মানির ব্লকড অ্যাকাউন্টে কত ইউরো জমা রাখা বাধ্যতামূলক?",
  "শেভেনিং স্কলারশিপে আবেদনের জন্য কী কী যোগ্যতা ও ডকুমেন্ট লাগে?",
  "আইইএলটিএস স্কোরের শর্ত কীভাবে বিশ্ববিদ্যালয় অনুযায়ী নির্ধারণ হয়?",
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content:
        "আসসালামু আলাইকুম! আমি AbroadMate-এর ভেরিফাইড এআই শিক্ষা সহায়ক।\n\nযুক্তরাজ্য, কানাডা, অস্ট্রেলিয়া, জার্মানি ও যুক্তরাষ্ট্রের ভর্তি, সরকারি স্কলারশিপ, আইইএলটিএস শর্তাবলী ও ইমিগ্রেশন ব্যাংক ব্যালেন্সের অফিসিয়াল নিয়ম নিয়ে বাংলায় যেকোনো প্রশ্ন করতে পারেন।\n\n📌 *আমি কোনো বাণিজ্যিক দালাল বা এজেন্সির মতো ভিত্তিহীন আশ্বাস দিই না; সকল তথ্য সরাসরি সরকারি ওয়েবসাইট থেকে যাচাইকৃত।*",
      citedSources: [
        {
          title: "UKVI Student Visa Guidance",
          url: "https://www.gov.uk/student-visa",
          organization: "UK Visas and Immigration",
          lastVerifiedDate: "2026-10-15",
          applicableRequirement: "অফিসিয়াল স্টাডি রুট নীতিমালা",
        },
        {
          title: "Make it in Germany Portal",
          url: "https://www.make-it-in-germany.com",
          organization: "Federal Government of Germany",
          lastVerifiedDate: "2026-10-15",
          applicableRequirement: "জার্মান ভিসা ও ব্লকড অ্যাকাউন্ট",
        },
      ],
      timestamp: "এখন",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [activeContext, setActiveContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          conversationId: conversationId || undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.conversationId) {
          setConversationId(json.data.conversationId);
        }
        if (json.data.studentContextApplied) {
          setActiveContext(json.data.studentContextApplied);
        }

        const assistantMsg: ChatMessageItem = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: json.data.reply,
          citedSources: json.data.citedSources || [],
          applicableRequirement: json.data.applicableRequirement,
          limitations: json.data.limitations,
          timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages([...newMessages, assistantMsg]);
      } else {
        setMessages([
          ...newMessages,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: json.error || "দুঃখিত, উত্তর তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
            timestamp: "এখন",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "নেটওয়ার্ক সংযোগ বিঘ্নিত হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
          timestamp: "এখন",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-7.5rem)] flex flex-col pb-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-bold mb-1">
            <Bot className="w-3.5 h-3.5 text-brand-700" />
            <span>সততা ও নীতিমালাভিত্তিক এআই শিক্ষা উপদেষ্টা</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>ভেরিফাইড স্টাডি অ্যাব্রড অ্যাসিস্ট্যান্ট</span>
          </h1>
        </div>

        {/* Active Profile Context Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            🇬🇧 ইউকে / গ্লোবাল
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            ✓ সরকারি তথ্যে গ্রাউন্ডেড
          </span>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 shrink-0 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>সেফটি নিশ্চয়তা:</strong> এই এআই কখনোই কোনো মিথ্যা ভিসা গ্যারান্টি বা অবাস্তব আশ্বাসে উত্তর দেয় না। সমস্ত আর্থিক ও ইমিগ্রেশন তথ্য সরকারি ডাটাবেজের সাথে সামঞ্জস্যপূর্ণ।
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-5 shadow-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                m.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-brand-700 text-white"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] space-y-2.5 ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-brand-700 text-white font-medium rounded-tr-xs shadow-xs"
                    : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs whitespace-pre-wrap font-sans"
                }`}
              >
                {m.content}
              </div>

              {/* Citations Box for Assistant */}
              {m.role === "assistant" && m.citedSources && m.citedSources.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    <FileCheck2 className="w-3.5 h-3.5 text-brand-700" />
                    <span>যাচাইকৃত তথ্যসূত্র (Official Sources):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {m.citedSources.map((source, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 line-clamp-1">{source.title}</span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-700 hover:text-brand-800 shrink-0"
                            title="সরকারি সাইট দেখুন"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>{source.organization}</span>
                          <span>ভেরিফাইড: {source.lastVerifiedDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {m.limitations && (
                    <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/50">
                      আইনি সীমাবদ্ধতা: {m.limitations}
                    </p>
                  )}
                </div>
              )}

              <span className="text-[10px] text-slate-400 block px-2">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-brand-700 font-bold pl-11 py-2">
            <Sparkles className="w-4 h-4 animate-spin text-brand-700" />
            <span>সরকারি ডাটাবেজ ও নীতিমালা যাচাই করে উত্তর প্রস্তুত করা হচ্ছে...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length <= 3 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">দ্রুত প্রশ্ন করুন:</span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-800 text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ভিসা, ব্যাংক ফান্ড, স্কলারশিপ বা আইইএলটিএস নিয়ে বাংলায় প্রশ্ন করুন..."
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center"
          title="বার্তা পাঠান"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
