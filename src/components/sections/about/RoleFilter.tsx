"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  FilterBar,
  type FilterOption,
} from "@/components/shared/FilterBar.tsx";

const ROLE_OPTIONS: FilterOption[] = [
  { label: "Founder Members", value: "founderMember" },
  { label: "Promoter Members", value: "promoterMember" },
  { label: "Office Bearers", value: "officeBearer" },
  { label: "Governing Council", value: "governingCouncil" },
];

export function RoleFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeRole = searchParams.get("role") ?? "";

  const handleFilterChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("role", value);
      } else {
        params.delete("role");
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return (
    <FilterBar
      activeValue={activeRole}
      filters={ROLE_OPTIONS}
      onFilterChange={handleFilterChange}
    />
  );
}
