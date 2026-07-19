"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  FilterBar,
  type FilterOption,
} from "@/components/shared/FilterBar.tsx";

export interface SubmissionColumn<T> {
  header: string;
  key: string;
  render: (row: T) => ReactNode;
}

interface SubmissionsTableShellProps<T> {
  columns: SubmissionColumn<T>[];
  emptyLabel: string;
  getId: (row: T) => string;
  getStatus: (row: T) => string;
  renderActions: (row: T) => ReactNode;
  rows: T[];
  statusFilters: FilterOption[];
}

export function SubmissionsTableShell<T>({
  columns,
  emptyLabel,
  getId,
  getStatus,
  renderActions,
  rows,
  statusFilters,
}: SubmissionsTableShellProps<T>) {
  const [activeFilter, setActiveFilter] = useState("");

  const filteredRows = useMemo(() => {
    if (!activeFilter) {
      return rows;
    }
    return rows.filter((row) => getStatus(row) === activeFilter);
  }, [rows, activeFilter, getStatus]);

  return (
    <div className="space-y-6">
      <FilterBar
        activeValue={activeFilter}
        filters={statusFilters}
        onFilterChange={setActiveFilter}
      />

      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          {emptyLabel}
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface) md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
                <tr>
                  {columns.map((column) => (
                    <th className="px-4 py-3 font-medium" key={column.key}>
                      {column.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    className="border-(--color-border) border-b last:border-0"
                    key={getId(row)}
                  >
                    {columns.map((column) => (
                      <td className="px-4 py-3 align-top" key={column.key}>
                        {column.render(row)}
                      </td>
                    ))}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-2">
                        {renderActions(row)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {filteredRows.map((row) => (
              <div
                className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4"
                key={getId(row)}
              >
                {columns.map((column) => (
                  <div key={column.key}>
                    <p className="text-(--color-text-secondary) text-xs uppercase tracking-wide">
                      {column.header}
                    </p>
                    <div className="mt-0.5 text-sm">{column.render(row)}</div>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-1">
                  {renderActions(row)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
