"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { FilterOption } from "@/components/shared/FilterBar.tsx";
import { FilterBar } from "@/components/shared/FilterBar.tsx";

const CATEGORY_FILTERS: FilterOption[] = [
  { label: "Notices", value: "Notice" },
  { label: "Circulars", value: "Circular" },
  { label: "Forms", value: "Form" },
  { label: "Reports", value: "Report" },
];

export function DownloadsFilterBar() {
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
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <FilterBar
      activeValue={activeCategory}
      filters={CATEGORY_FILTERS}
      onFilterChange={handleFilterChange}
    />
  );
}
