import * as React from "react";
import Link from "next/link";
import {
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface ScholarshipCardData {
  id: string;
  countryCode: string;
  titleEn: string;
  titleBn?: string;
  providerType: "GOVERNMENT" | "UNIVERSITY" | "TRUST" | "EXTERNAL";
  coverageType: "FULL_FUNDED" | "TUITION_WAIVER" | "STIPEND_ONLY";
  coverageDescriptionBn: string;
  eligibilitySummaryBn: string;
  applicationDeadlineNotice: string;
  officialPortalUrl?: string;
}

export interface ScholarshipCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  scholarship: ScholarshipCardData;
  onCheckEligibility?: (scholarship: ScholarshipCardData) => void;
  detailsHref?: string;
}

const coverageBadges: Record<
  ScholarshipCardData["coverageType"],
  { label: string; variant: "success" | "subtle" | "secondary" }
> = {
  FULL_FUNDED: { label: "Fully Funded (সম্পূর্ণ অর্থায়ন)", variant: "success" },
  TUITION_WAIVER: { label: "Tuition Waiver", variant: "subtle" },
  STIPEND_ONLY: { label: "Monthly Stipend", variant: "secondary" },
};

const providerLabels: Record<ScholarshipCardData["providerType"], string> = {
  GOVERNMENT: "Govt Funded",
  UNIVERSITY: "University Merit",
  TRUST: "Foundation / Trust",
  EXTERNAL: "External Agency",
};

export function ScholarshipCard({
  scholarship,
  onCheckEligibility,
  detailsHref,
  className,
  ...props
}: ScholarshipCardProps) {
  const finalDetailsHref =
    detailsHref || `/scholarships/${scholarship.id}`;
  const coverage = coverageBadges[scholarship.coverageType];

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={coverage.variant}
            size="sm"
            className="font-semibold gap-1"
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span>{coverage.label}</span>
          </Badge>

          <Badge variant="outline" size="sm" className="font-mono text-slate-500">
            {scholarship.countryCode}
          </Badge>
        </div>

        {/* Title & Provider */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Landmark className="w-3.5 h-3.5 text-brand-700 shrink-0" />
            <span className="font-medium">
              {providerLabels[scholarship.providerType]}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 group-hover:text-brand-800 transition-colors text-base leading-snug line-clamp-2">
            {scholarship.titleEn}
          </h3>
          {scholarship.titleBn && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
              {scholarship.titleBn}
            </p>
          )}
        </div>

        {/* Coverage Description */}
        <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 text-xs text-brand-900 mb-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-700 tracking-wider block">
            যা যা কাভার করবে
          </span>
          <p className="leading-relaxed line-clamp-2">
            {scholarship.coverageDescriptionBn}
          </p>
        </div>

        {/* Eligibility Snippet */}
        <div className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          <span className="font-semibold text-slate-700">যোগ্যতা: </span>
          {scholarship.eligibilitySummaryBn}
        </div>

        {/* Deadline Notice */}
        {scholarship.applicationDeadlineNotice && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg mb-4 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">
              ডেডলাইন: {scholarship.applicationDeadlineNotice}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {scholarship.officialPortalUrl && (
          <a
            href={scholarship.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-brand-700 inline-flex items-center gap-1 font-medium transition-colors p-1"
            title="Official Scholarship Portal"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Official Portal</span>
          </a>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {onCheckEligibility && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCheckEligibility(scholarship)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-700" />}
              className="text-xs"
            >
              Eligibility
            </Button>
          )}

          <Link href={finalDetailsHref}>
            <Button
              variant="default"
              size="sm"
              className="text-xs font-semibold"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
