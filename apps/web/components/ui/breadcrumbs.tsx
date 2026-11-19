import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  items: BreadcrumbItemType[];
  showHome?: boolean;
  homeHref?: string;
  separator?: React.ReactNode;
}

export function Breadcrumbs({
  items,
  showHome = true,
  homeHref = "/",
  separator,
  className,
  ...props
}: BreadcrumbsProps) {
  const defaultSeparator = <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-slate-600", className)}
      {...props}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {showHome && (
          <li className="inline-flex items-center gap-1.5">
            <Link
              href={homeHref}
              className="inline-flex items-center text-slate-500 hover:text-brand-700 transition-colors"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
            {items.length > 0 && (
              <span className="flex items-center" aria-hidden="true">
                {separator || defaultSeparator}
              </span>
            )}
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-1.5"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-700 transition-colors font-medium"
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-semibold",
                    isLast ? "text-slate-900" : "text-slate-600"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && (
                <span className="flex items-center" aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
