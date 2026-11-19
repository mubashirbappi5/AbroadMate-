import * as React from "react";
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "subtle";
  size?: "sm" | "md";
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-brand-700 text-white border-transparent",
  secondary: "bg-slate-100 text-slate-800 border-transparent hover:bg-slate-200",
  outline: "text-slate-700 border-slate-300 bg-white",
  destructive: "bg-red-50 text-red-700 border-red-200",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  subtle: "bg-brand-50 text-brand-800 border-brand-200",
};

const badgeSizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs font-semibold",
};

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700/20",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    />
  );
}

export type StatusVariant =
  | "verified"
  | "pending"
  | "eligible"
  | "borderline"
  | "warning";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusVariant;
  label?: string;
  showIcon?: boolean;
  showDot?: boolean;
  size?: "sm" | "md";
}

const statusConfig: Record<
  StatusVariant,
  {
    classes: string;
    dotClass: string;
    defaultLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  verified: {
    classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
    defaultLabel: "Verified",
    icon: ShieldCheck,
  },
  eligible: {
    classes: "bg-brand-50 text-brand-800 border-brand-200",
    dotClass: "bg-brand-600",
    defaultLabel: "Eligible",
    icon: CheckCircle2,
  },
  pending: {
    classes: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
    defaultLabel: "Pending Review",
    icon: Clock,
  },
  borderline: {
    classes: "bg-orange-50 text-orange-800 border-orange-200",
    dotClass: "bg-orange-500",
    defaultLabel: "Borderline",
    icon: AlertCircle,
  },
  warning: {
    classes: "bg-rose-50 text-rose-800 border-rose-200",
    dotClass: "bg-rose-500",
    defaultLabel: "Action Required",
    icon: AlertTriangle,
  },
};

export function StatusBadge({
  status,
  label,
  showIcon = true,
  showDot = false,
  size = "md",
  className,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.classes,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-semibold",
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass)}
        />
      )}
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{displayLabel}</span>
    </span>
  );
}
