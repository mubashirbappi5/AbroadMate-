"use client";

import React, { useState } from "react";
import { FolderLock, FileCheck2, Upload, AlertCircle, FileText } from "lucide-react";

interface RequiredDocument {
  id: string;
  nameBn: string;
  nameEn: string;
  category: "ACADEMIC" | "FINANCIAL" | "IDENTITY";
  status: "READY" | "PENDING";
  descriptionBn: string;
}

const DEFAULT_DOCUMENTS: RequiredDocument[] = [
  {
    id: "passport",
    nameBn: "মূল পাসপোর্ট (কমপক্ষে ২ বছর মেয়াদি)",
    nameEn: "Original Passport",
    category: "IDENTITY",
    status: "READY",
    descriptionBn: "ই-পাসপোর্টের প্রথম ও তথ্যবহুল পাতাগুলোর পরিষ্কার স্ক্যান কপি।",
  },
  {
    id: "transcripts",
    nameBn: "একাডেমিক ট্রান্সক্রিপ্ট ও সার্টিফিকেট",
    nameEn: "Academic Transcripts & Certificates",
    category: "ACADEMIC",
    status: "READY",
    descriptionBn: "এসএসসি, এইচএসসি বা অনার্সের মূল মার্কশিট ও সনদ (শিক্ষা মন্ত্রণালয়/বোর্ড সত্যায়িত)।",
  },
  {
    id: "ielts_trf",
    nameBn: "আইইএলটিএস টিআরএফ (IELTS TRF)",
    nameEn: "IELTS Test Report Form",
    category: "ACADEMIC",
    status: "READY",
    descriptionBn: "অফিসিয়াল টেস্ট রিপোর্ট ফর্মের ডিজিটাল ও হার্ডকপি।",
  },
  {
    id: "sop",
    nameBn: "স্টেটমেন্ট অব পারপাস (SOP)",
    nameEn: "Statement of Purpose",
    category: "ACADEMIC",
    status: "PENDING",
    descriptionBn: "উচ্চশিক্ষার কারণ ও ভবিষ্যৎ লক্ষ্য সম্বলিত নিজস্ব লেটার।",
  },
  {
    id: "lor",
    nameBn: "একাডেমিক রিকমেন্ডেশন লেটার (২টি)",
    nameEn: "Letters of Recommendation (LOR)",
    category: "ACADEMIC",
    status: "PENDING",
    descriptionBn: "বিশ্ববিদ্যালয়ের ডিন বা প্রফেসরের অফিসিয়াল প্যাডে সুপারিশপত্র।",
  },
  {
    id: "bank_solvency",
    nameBn: "ব্যাংক সলভেন্সি ও ৬ মাসের স্টেটমেন্ট",
    nameEn: "Bank Solvency Certificate & Statement",
    category: "FINANCIAL",
    status: "PENDING",
    descriptionBn: "ব্যাংক থেকে স্বাক্ষরিত ও সিলমোহরকৃত সলভেন্সি সার্টিফিকেট।",
  },
];

export default function DocumentVaultPage() {
  const [docs, setDocs] = useState<RequiredDocument[]>(DEFAULT_DOCUMENTS);

  const toggleStatus = (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "READY" ? "PENDING" : "READY" } : d
      )
    );
  };

  const readyCount = docs.filter((d) => d.status === "READY").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ডকুমেন্ট ভল্ট ও চেকলিস্ট</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ভিসা ও বিশ্ববিদ্যালয় আবেদনের জন্য প্রয়োজনীয় নথিপত্রের তালিকা এবং অগ্রগতি পর্যবেক্ষণ।
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
          প্রস্তুত: <span className="text-brand-700">{readyCount}</span> / {docs.length} টি নথি
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
        {docs.map((doc) => (
          <div key={doc.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStatus(doc.id)}
                className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  doc.status === "READY"
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "border-slate-300 hover:border-brand-500"
                }`}
              >
                {doc.status === "READY" && <FileCheck2 className="w-3.5 h-3.5" />}
              </button>

              <div>
                <h3 className={`text-sm font-bold ${doc.status === "READY" ? "text-slate-900" : "text-slate-700"}`}>
                  {doc.nameBn}
                </h3>
                <span className="text-[11px] text-slate-400 block">{doc.nameEn}</span>
                <p className="text-xs text-slate-500 mt-1">{doc.descriptionBn}</p>
              </div>
            </div>

            <div className="shrink-0">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  doc.status === "READY"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {doc.status === "READY" ? "প্রস্তুত আছে" : "বাকি আছে"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
