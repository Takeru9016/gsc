"use client";

import { type MouseEvent, useCallback } from "react";
import { cn } from "@/lib/utils.ts";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  activeValue: string;
  allLabel?: string;
  filters: FilterOption[];
  onFilterChange: (value: string) => void;
}

export function FilterBar({
  filters,
  activeValue,
  onFilterChange,
  allLabel = "All",
}: FilterBarProps) {
  const options: FilterOption[] = [{ label: allLabel, value: "" }, ...filters];

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onFilterChange(event.currentTarget.value);
    },
    [onFilterChange]
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {options.map((option) => {
        const isActive = option.value === activeValue;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-primary text-white"
                : "border border-(--color-border) text-(--color-text-secondary) hover:border-primary hover:text-primary"
            )}
            key={option.value || "all"}
            onClick={handleClick}
            type="button"
            value={option.value}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
