import * as React from "react";
import Link from "next/link";
import {
  Globe,
  Briefcase,
  Wallet,
  ShieldAlert,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface CountryCardData {
  code: string;
  nameEn: string;
  nameBn: string;
  flag: string;
  currencySymbol?: string;
  currencyCode?: string;
  avgLivingCostBdtApprox?: number;
  blockedAccountRequired?: boolean;
  postStudyWorkMonths?: number;
  minIelts?: number;
  universitiesCount?: number;
}

export interface CountryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  country: CountryCardData;
  onExplore?: () => void;
  onViewVisa?: () => void;
  exploreHref?: string;
  visaHref?: string;
}

export function CountryCard({
  country,
  onExplore,
  onViewVisa,
  exploreHref,
  visaHref,
  className,
  ...props
}: CountryCardProps) {
  const finalExploreHref = exploreHref || `/explore?country=${country.code}`;
  const finalVisaHref = visaHref || `/visa-guides?country=${country.code}`;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none select-none drop-shadow-xs">
              {country.flag}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-brand-800 transition-colors text-base leading-tight">
                {country.nameEn}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {country.nameBn}
              </p>
            </div>
          </div>

          <Badge variant="subtle" size="sm" className="font-mono text-[11px]">
            {country.code}
          </Badge>
        </div>

        {/* Feature Badges & Key Highlights */}
        <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100 text-xs">
          {/* Post-study work */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-700">
            <Briefcase className="w-4 h-4 text-brand-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                PSW Visa
              </span>
              <span className="font-semibold text-slate-800 truncate block">
                {country.postStudyWorkMonths
                  ? `${Math.round(country.postStudyWorkMonths / 12)} Years`
                  : "Available"}
              </span>
            </div>
          </div>

          {/* Blocked Account Info */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-700">
            <ShieldAlert className="w-4 h-4 text-brand-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                Blocked Account
              </span>
              <span className="font-semibold text-slate-800 truncate block">
                {country.blockedAccountRequired ? "Required" : "Not Required"}
              </span>
            </div>
          </div>

          {/* Living Cost Approx */}
          {country.avgLivingCostBdtApprox && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-700 col-span-2">
              <Wallet className="w-4 h-4 text-brand-700 shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-slate-500">
                  Est. Monthly Living Cost
                </span>
                <span className="font-semibold text-slate-800">
                  ৳{(country.avgLivingCostBdtApprox / 1000).toFixed(0)}k BDT/mo
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Link href={finalExploreHref} className="flex-1">
          <Button
            variant="default"
            size="sm"
            className="w-full text-xs font-semibold"
            onClick={onExplore}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore
          </Button>
        </Link>

        <Link href={finalVisaHref} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={onViewVisa}
          >
            Visa Guide
          </Button>
        </Link>
      </div>
    </div>
  );
}
