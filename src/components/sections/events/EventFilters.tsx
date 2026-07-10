"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  FilterBar,
  type FilterOption,
} from "@/components/shared/FilterBar.tsx";

const STATUS_OPTIONS: FilterOption[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Past", value: "past" },
];

const TYPE_OPTIONS: FilterOption[] = [
  { label: "Tournament", value: "Tournament" },
  { label: "Cultural", value: "Cultural" },
  { label: "League", value: "League" },
  { label: "Special", value: "Special" },
];

export function EventFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get("status") ?? "";
  const activeType = searchParams.get("type") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const handleStatusChange = useCallback(
    (value: string) => updateParam("status", value),
    [updateParam]
  );

  const handleTypeChange = useCallback(
    (value: string) => updateParam("type", value),
    [updateParam]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 font-medium text-(--color-text-secondary) text-sm">
          Status
        </p>
        <FilterBar
          activeValue={activeStatus}
          filters={STATUS_OPTIONS}
          onFilterChange={handleStatusChange}
        />
      </div>
      <div>
        <p className="mb-2 font-medium text-(--color-text-secondary) text-sm">
          Type
        </p>
        <FilterBar
          activeValue={activeType}
          filters={TYPE_OPTIONS}
          onFilterChange={handleTypeChange}
        />
      </div>
    </div>
  );
}
