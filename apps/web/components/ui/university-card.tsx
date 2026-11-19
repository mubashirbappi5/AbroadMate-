import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Trophy,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface UniversityCardData {
  id: string;
  nameEn: string;
  nameBn?: string;
  countryCode: string;
  city: string;
  stateOrProvince?: string;
  worldRank?: number;
  isPublic?: boolean;
  websiteUrl?: string;
  logoUrl?: string;
  programsCount?: number;
}

export interface UniversityCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  university: UniversityCardData;
  onCheckEligibility?: (university: UniversityCardData) => void;
  detailsHref?: string;
}

export function UniversityCard({
  university,
  onCheckEligibility,
  detailsHref,
  className,
  ...props
}: UniversityCardProps) {
  const finalDetailsHref =
    detailsHref || `/explore/university/${university.id}`;

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
            {university.worldRank && (
              <Badge variant="subtle" size="sm" className="font-semibold gap-1">
                <Trophy className="w-3 h-3 text-brand-700" />
                Rank #{university.worldRank}
              </Badge>
            )}
            <Badge variant="secondary" size="sm">
              {university.isPublic ? "Public University" : "Private"}
            </Badge>
          </div>

          <Badge variant="outline" size="sm" className="font-mono text-slate-500">
            {university.countryCode}
          </Badge>
        </div>

        {/* University Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 shrink-0 shadow-xs">
            {university.logoUrl ? (
              <img
                src={university.logoUrl}
                alt={university.nameEn}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <GraduationCap className="w-6 h-6" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 group-hover:text-brand-800 transition-colors text-base leading-snug line-clamp-2">
              {university.nameEn}
            </h3>
            {university.nameBn && (
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {university.nameBn}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {university.city}
                {university.stateOrProvince
                  ? `, ${university.stateOrProvince}`
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Highlights */}
        {university.programsCount !== undefined && (
          <div className="py-2.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-600 flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-700" />
              <span>Available Programs</span>
            </div>
            <span className="font-semibold text-slate-900">
              {university.programsCount}+
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {university.websiteUrl && (
          <a
            href={university.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-brand-700 inline-flex items-center gap-1 font-medium transition-colors p-1"
            title="Official University Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Official Site</span>
          </a>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {onCheckEligibility && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCheckEligibility(university)}
              className="text-xs"
            >
              Check Eligibility
            </Button>
          )}

          <Link href={finalDetailsHref}>
            <Button
              variant="default"
              size="sm"
              className="text-xs font-semibold"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Programs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
