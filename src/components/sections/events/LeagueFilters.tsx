"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  FilterBar,
  type FilterOption,
} from "@/components/shared/FilterBar.tsx";

interface LeagueFiltersProps {
  sports: string[];
}

export function LeagueFilters({ sports }: LeagueFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSport = searchParams.get("sport") ?? "";

  const sportOptions: FilterOption[] = sports.map((sport) => ({
    label: sport,
    value: sport,
  }));

  const handleSportChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("sport", value);
      } else {
        params.delete("sport");
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return (
    <FilterBar
      activeValue={activeSport}
      filters={sportOptions}
      onFilterChange={handleSportChange}
    />
  );
}
