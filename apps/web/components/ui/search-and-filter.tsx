"use client";

import * as React from "react";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Select } from "./select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selectedCountry?: string;
  onCountryChange?: (country: string) => void;
  countryOptions?: FilterOption[];
  selectedDegree?: string;
  onDegreeChange?: (degree: string) => void;
  degreeOptions?: FilterOption[];
  selectedSort?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: FilterOption[];
  onReset?: () => void;
  className?: string;
}

const DEFAULT_DEGREES: FilterOption[] = [
  { value: "all", label: "All Degrees" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD / Doctorate" },
];

const DEFAULT_SORT: FilterOption[] = [
  { value: "relevance", label: "Most Relevant" },
  { value: "ranking_asc", label: "World Rank (Top First)" },
  { value: "tuition_asc", label: "Tuition: Low to High" },
  { value: "tuition_desc", label: "Tuition: High to Low" },
];

export function SearchAndFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search by university, program, or keyword...",
  selectedCountry = "all",
  onCountryChange,
  countryOptions = [],
  selectedDegree = "all",
  onDegreeChange,
  degreeOptions = DEFAULT_DEGREES,
  selectedSort = "relevance",
  onSortChange,
  sortOptions = DEFAULT_SORT,
  onReset,
  className,
}: SearchAndFilterProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const hasActiveFilters =
    (selectedCountry && selectedCountry !== "all") ||
    (selectedDegree && selectedDegree !== "all") ||
    (selectedSort && selectedSort !== "relevance") ||
    Boolean(searchValue.trim());

  const activeFiltersCount = [
    Boolean(searchValue.trim()),
    selectedCountry && selectedCountry !== "all",
    selectedDegree && selectedDegree !== "all",
    selectedSort && selectedSort !== "relevance",
  ].filter(Boolean).length;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3",
        className
      )}
    >
      {/* Top Search Bar & Mobile Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-slate-300 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition-colors"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          className={cn(
            "sm:hidden flex items-center justify-center h-10 px-3 rounded-xl border text-sm font-medium transition-colors gap-1.5",
            mobileFiltersOpen || activeFiltersCount > 0
              ? "border-brand-600 bg-brand-50 text-brand-800"
              : "border-slate-300 bg-white text-slate-700"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-700 text-white text-[11px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Selects: Desktop always visible, Mobile toggleable */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 items-end",
          mobileFiltersOpen ? "block" : "hidden sm:grid"
        )}
      >
        {/* Country Filter */}
        {onCountryChange && (
          <div>
            <Select
              label="Country"
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              options={
                countryOptions.length > 0
                  ? countryOptions
                  : [{ value: "all", label: "All Countries" }]
              }
            />
          </div>
        )}

        {/* Degree Filter */}
        {onDegreeChange && (
          <div>
            <Select
              label="Degree Level"
              value={selectedDegree}
              onChange={(e) => onDegreeChange(e.target.value)}
              options={degreeOptions}
            />
          </div>
        )}

        {/* Sort Dropdown */}
        {onSortChange && (
          <div>
            <Select
              label="Sort By"
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              options={sortOptions}
            />
          </div>
        )}

        {/* Reset Filter Button */}
        {hasActiveFilters && onReset && (
          <div className="flex sm:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
              className="text-xs text-slate-600 hover:text-red-600"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
