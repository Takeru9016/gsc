"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  FilterBar,
  type FilterOption,
} from "@/components/shared/FilterBar.tsx";
import { SPORT_CATEGORIES } from "@/lib/sportCategories.ts";

const CATEGORY_OPTIONS: FilterOption[] = SPORT_CATEGORIES.filter(
  (category) => category.value !== "track"
).map((category) => ({ label: category.label, value: category.value }));

export function CoachingFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  const handleFilterChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("category", value);
      } else {
        params.delete("category");
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return (
    <FilterBar
      activeValue={activeCategory}
      filters={CATEGORY_OPTIONS}
      onFilterChange={handleFilterChange}
    />
  );
}
