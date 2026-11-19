"use client";

import React, { useState } from "react";
import { Bot, Send, User, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import { aiProvider, ChatMessage } from "@abroadmate/ai";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "আসসালামু আলাইকুম! আমি AbroadMate-এর এআই শিক্ষা সহায়ক। স্টুডেন্ট ভিসা, আইইএলটিএস শর্তাবলী, টিউশন ফি বা ব্যাংক সলভেন্সি সংক্রান্ত যেকোনো প্রশ্ন আপনি বাংলায় নির্দ্বিধায় করতে পারেন।",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await aiProvider.generateChatResponse(newMessages);
      setMessages([...newMessages, { role: "assistant", content: response.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "দুঃখিত, উত্তর প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-700" />
          <span>ভেরিফাইড এআই স্টাডি অ্যাসিস্ট্যান্ট</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          অফিসিয়াল সরকারি নিয়মাবলীর ওপর ভিত্তি করে সরাসরি সৎ ও নিরপেক্ষ পরামর্শ।
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.role === "user"
                  ? "bg-slate-800 text-white"
                  : "bg-brand-700 text-white"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-brand-700 text-white font-medium"
                  : "bg-slate-50 border border-slate-200/80 text-slate-800 whitespace-pre-wrap"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-brand-700 font-semibold pl-11">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>ভেরিফাইড তথ্য যাচাই করে উত্তর প্রস্তুত করা হচ্ছে...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="যেমন: জার্মানিতে ব্লকড অ্যাকাউন্টে কত টাকা লাগে এবং কীভাবে পাঠাতে হয়?"
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600 shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs sm:text-sm"
        >
          <Send className="w-4 h-4" />
          <span>পাঠান</span>
        </button>
      </form>
    </div>
  );
}
