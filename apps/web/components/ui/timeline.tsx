import * as React from "react";
import { Check, AlertCircle, Clock, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStepStatus = "completed" | "current" | "upcoming" | "failed";

export interface TimelineStep {
  id: string | number;
  title: string;
  description?: React.ReactNode;
  date?: string;
  status: TimelineStepStatus;
  icon?: React.ReactNode;
  badge?: string;
  action?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[];
  orientation?: "vertical" | "horizontal";
}

export function Timeline({
  steps,
  orientation = "vertical",
  className,
  ...props
}: TimelineProps) {
  if (orientation === "horizontal") {
    return (
      <div
        className={cn("w-full overflow-x-auto pb-4 pt-2", className)}
        {...props}
      >
        <div className="flex items-start justify-between min-w-[640px] relative">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isFailed = step.status === "failed";

            return (
              <div
                key={step.id}
                className="flex-1 flex flex-col items-center relative text-center px-2 group"
              >
                {/* Connecting bar */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute top-5 left-1/2 w-full h-0.5 -z-0 transition-colors",
                      isCompleted ? "bg-brand-600" : "bg-slate-200"
                    )}
                  />
                )}

                {/* Step indicator icon */}
                <div
                  className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all shadow-sm",
                    isCompleted &&
                      "bg-brand-700 text-white ring-4 ring-brand-50",
                    isCurrent &&
                      "bg-white border-2 border-brand-700 text-brand-700 ring-4 ring-brand-100 animate-pulse",
                    isFailed &&
                      "bg-red-600 text-white ring-4 ring-red-50",
                    step.status === "upcoming" &&
                      "bg-slate-100 text-slate-400 border border-slate-300"
                  )}
                >
                  {step.icon ? (
                    step.icon
                  ) : isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isFailed ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <CircleDot className="w-5 h-5 text-brand-700" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="mt-3 space-y-1 w-full max-w-[160px]">
                  {step.date && (
                    <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block">
                      {step.date}
                    </span>
                  )}
                  <h4
                    className={cn(
                      "text-sm font-bold leading-tight",
                      isCurrent
                        ? "text-brand-900"
                        : isCompleted
                        ? "text-slate-800"
                        : "text-slate-500"
                    )}
                  >
                    {step.title}
                  </h4>
                  {step.badge && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-700 rounded-full">
                      {step.badge}
                    </span>
                  )}
                  {step.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {step.description}
                    </p>
                  )}
                  {step.action && <div className="pt-1">{step.action}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical Timeline
  return (
    <div className={cn("relative pl-6 space-y-8", className)} {...props}>
      {/* Continuous line */}
      <div className="absolute top-3 left-[17px] bottom-3 w-0.5 bg-slate-200" />

      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";
        const isFailed = step.status === "failed";

        return (
          <div key={step.id} className="relative flex items-start gap-4 group">
            {/* Step icon/bullet */}
            <div
              className={cn(
                "relative z-10 w-9 h-9 -ml-6 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 transition-all shadow-sm",
                isCompleted &&
                  "bg-brand-700 text-white ring-4 ring-brand-50",
                isCurrent &&
                  "bg-white border-2 border-brand-700 text-brand-700 ring-4 ring-brand-100",
                isFailed &&
                  "bg-red-600 text-white ring-4 ring-red-50",
                step.status === "upcoming" &&
                  "bg-slate-100 text-slate-400 border border-slate-300"
              )}
            >
              {step.icon ? (
                step.icon
              ) : isCompleted ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : isFailed ? (
                <AlertCircle className="w-4 h-4" />
              ) : isCurrent ? (
                <Clock className="w-4 h-4 text-brand-700" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Content card / box */}
            <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={cn(
                      "text-sm font-bold",
                      isCurrent
                        ? "text-brand-900"
                        : isCompleted
                        ? "text-slate-900"
                        : "text-slate-600"
                    )}
                  >
                    {step.title}
                  </h4>
                  {step.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200 rounded-full">
                      {step.badge}
                    </span>
                  )}
                </div>
                {step.date && (
                  <span className="text-xs font-medium text-slate-400">
                    {step.date}
                  </span>
                )}
              </div>

              {step.description && (
                <div className="text-xs text-slate-600 leading-relaxed mt-1">
                  {step.description}
                </div>
              )}

              {step.action && <div className="mt-3">{step.action}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
