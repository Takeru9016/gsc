"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

const LEVEL_OPTIONS = ["District", "State", "National", "International"];
const TYPE_OPTIONS = ["Individual", "Team"];

interface AchievementFiltersProps {
  sports: string[];
  years: number[];
}

const labelClasses =
  "mb-2 block font-medium text-(--color-text-secondary) text-sm";

export function AchievementFilters({ sports, years }: AchievementFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSport = searchParams.get("sport") ?? "";
  const activeLevel = searchParams.get("level") ?? "";
  const activeType = searchParams.get("type") ?? "";
  const activeYear = searchParams.get("year") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const handleSportChange = useCallback(
    (value: string) => updateParam("sport", value),
    [updateParam]
  );
  const handleLevelChange = useCallback(
    (value: string) => updateParam("level", value),
    [updateParam]
  );
  const handleTypeChange = useCallback(
    (value: string) => updateParam("type", value),
    [updateParam]
  );
  const handleYearChange = useCallback(
    (value: string) => updateParam("year", value),
    [updateParam]
  );

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div>
        <span className={labelClasses}>Sport</span>
        <Select onValueChange={handleSportChange} value={activeSport || "all"}>
          <SelectTrigger aria-label="Filter by sport">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <span className={labelClasses}>Level</span>
        <Select onValueChange={handleLevelChange} value={activeLevel || "all"}>
          <SelectTrigger aria-label="Filter by level">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {LEVEL_OPTIONS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <span className={labelClasses}>Type</span>
        <Select onValueChange={handleTypeChange} value={activeType || "all"}>
          <SelectTrigger aria-label="Filter by type">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TYPE_OPTIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <span className={labelClasses}>Year</span>
        <Select onValueChange={handleYearChange} value={activeYear || "all"}>
          <SelectTrigger aria-label="Filter by year">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
