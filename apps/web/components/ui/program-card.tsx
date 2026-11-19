import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Coins,
  FileCheck2,
  Calendar,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface ProgramCardData {
  id: string;
  universityId: string;
  universityName?: string;
  countryCode: string;
  titleEn: string;
  titleBn?: string;
  degreeLevel: "bachelor" | "master" | "phd";
  department?: string;
  durationMonths: number;
  annualTuitionLocal?: number;
  currencyCode?: string;
  annualTuitionBdtApprox: number;
  minIeltsOverall?: number;
  minIeltsEachBand?: number;
  minGpaOrCgpa?: number;
  applicationDeadlineNotice?: string;
  officialSourceUrl?: string;
}

export interface ProgramCardProps extends React.HTMLAttributes<HTMLDivElement> {
  program: ProgramCardData;
  onCheckEligibility?: (program: ProgramCardData) => void;
  detailsHref?: string;
}

const degreeLabels: Record<ProgramCardData["degreeLevel"], string> = {
  bachelor: "Bachelor's",
  master: "Master's",
  phd: "PhD / Doctorate",
};

export function ProgramCard({
  program,
  onCheckEligibility,
  detailsHref,
  className,
  ...props
}: ProgramCardProps) {
  const finalDetailsHref = detailsHref || `/explore/program/${program.id}`;

  const formatTuitionBdt = (bdt: number): string => {
    if (bdt === 0) return "Tuition Free";
    const lakh = bdt / 100000;
    return `~৳${lakh.toFixed(1)} Lakh/yr`;
  };

  const durationFormatted =
    program.durationMonths >= 12
      ? `${(program.durationMonths / 12).toFixed(program.durationMonths % 12 === 0 ? 0 : 1)} Years`
      : `${program.durationMonths} Months`;

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
          <div className="flex items-center gap-2">
            <Badge variant="subtle" size="sm" className="font-semibold">
              {degreeLabels[program.degreeLevel]}
            </Badge>
            {program.department && (
              <span className="text-xs text-slate-500 font-medium truncate max-w-[140px]">
                {program.department}
              </span>
            )}
          </div>

          <Badge variant="outline" size="sm" className="font-mono text-slate-500">
            {program.countryCode}
          </Badge>
        </div>

        {/* Title & University */}
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 group-hover:text-brand-800 transition-colors text-base leading-snug line-clamp-2">
            {program.titleEn}
          </h3>
          {program.titleBn && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
              {program.titleBn}
            </p>
          )}

          {program.universityName && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{program.universityName}</span>
            </div>
          )}
        </div>

        {/* Key Requirements Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-50 text-xs">
          {/* Tuition */}
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Tuition (Approx)
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-900 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span className="truncate">
                {formatTuitionBdt(program.annualTuitionBdtApprox)}
              </span>
            </div>
          </div>

          {/* IELTS */}
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Min IELTS
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-900 mt-0.5">
              <FileCheck2 className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>
                {program.minIeltsOverall ? `Band ${program.minIeltsOverall}` : "N/A"}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Duration
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{durationFormatted}</span>
            </div>
          </div>

          {/* GPA / CGPA */}
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Min GPA
            </span>
            <span className="font-semibold text-slate-800 block mt-0.5">
              {program.minGpaOrCgpa ? `${program.minGpaOrCgpa} / 4.0 or 5.0` : "Flexible"}
            </span>
          </div>
        </div>

        {/* Deadline Notice */}
        {program.applicationDeadlineNotice && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg mb-4">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{program.applicationDeadlineNotice}</span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {onCheckEligibility && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCheckEligibility(program)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-700" />}
            className="text-xs flex-1"
          >
            Check Eligibility
          </Button>
        )}

        <Link href={finalDetailsHref} className={onCheckEligibility ? "" : "w-full"}>
          <Button
            variant="default"
            size="sm"
            className="text-xs font-semibold w-full"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
