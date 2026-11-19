import * as React from "react";
import { cn } from "@/lib/utils";

export type ProgressVariant = "brand" | "amber" | "rose" | "blue";

export interface ProgressIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: ProgressVariant;
}

const linearVariantClasses: Record<ProgressVariant, string> = {
  brand: "bg-brand-700",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  blue: "bg-blue-600",
};

const linearSizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressIndicator({
  value,
  max = 100,
  label,
  showValue = false,
  size = "md",
  variant = "brand",
  className,
  ...props
}: ProgressIndicatorProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-700">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="font-semibold text-slate-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-100",
          linearSizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            linearVariantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  variant?: ProgressVariant;
  showValue?: boolean;
  valueLabel?: string;
  sublabel?: string;
}

const circularVariantStroke: Record<ProgressVariant, string> = {
  brand: "text-brand-700",
  amber: "text-amber-500",
  rose: "text-rose-500",
  blue: "text-blue-600",
};

export function CircularProgress({
  value,
  size = 72,
  strokeWidth = 6,
  variant = "brand",
  showValue = true,
  valueLabel,
  sublabel,
  className,
  ...props
}: CircularProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg] transition-all"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-slate-100"
        />
        {/* Value progress indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-700 ease-out",
            circularVariantStroke[variant]
          )}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-bold text-slate-900 leading-none">
            {valueLabel ?? `${Math.round(clampedValue)}%`}
          </span>
          {sublabel && (
            <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
