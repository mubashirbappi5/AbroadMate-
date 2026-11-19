import * as React from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 bg-white/60",
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 shadow-xs">
        {icon || <Inbox className="w-7 h-7" />}
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>

      {description && (
        <div className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
          {description}
        </div>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center flex-wrap justify-center gap-3">
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button variant="default" size="md" leftIcon={action.icon}>
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button
                variant="default"
                size="md"
                onClick={action.onClick}
                leftIcon={action.icon}
              >
                {action.label}
              </Button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="outline" size="md" leftIcon={secondaryAction.icon}>
                  {secondaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="md"
                onClick={secondaryAction.onClick}
                leftIcon={secondaryAction.icon}
              >
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
