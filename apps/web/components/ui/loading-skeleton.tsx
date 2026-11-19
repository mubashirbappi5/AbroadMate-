import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80", className)}
      {...props}
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-3/5 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </div>
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs",
        className
      )}
    >
      {/* Header shimmer */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 grid gap-4 grid-flow-col auto-cols-fr">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`th-${i}`} className="h-4 w-3/4 rounded" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-slate-100 p-2">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={`tr-${rIdx}`}
            className="p-3 grid gap-4 grid-flow-col auto-cols-fr items-center"
          >
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={`td-${rIdx}-${cIdx}`}
                className={cn("h-4 rounded", cIdx === 0 ? "w-4/5" : "w-1/2")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6",
        className
      )}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </div>
      {/* Grid of info pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
      {/* Bio / Details */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  );
}
