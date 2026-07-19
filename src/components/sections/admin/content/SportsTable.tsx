"use client";

import { type ChangeEvent, useCallback, useState } from "react";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { SportListItem } from "@/lib/sanity/queries.ts";

const CATEGORY_LABELS: Record<string, string> = {
  aquatic: "Aquatic",
  health: "Health & Fitness",
  indoor: "Indoor",
  outdoor: "Outdoor",
  track: "Track",
};

interface SportRowProps {
  onOrderChange: (id: string, slug: string, order: number) => void;
  onToggleCoaching: (id: string, slug: string, hasCoaching: boolean) => void;
  pendingId: string | null;
  sport: SportListItem;
}

function SportRow({
  onOrderChange,
  onToggleCoaching,
  pendingId,
  sport,
}: SportRowProps) {
  const isPending = pendingId === sport._id;

  const handleOrderChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (Number.isNaN(value)) {
        return;
      }
      onOrderChange(sport._id, sport.slug, value);
    },
    [onOrderChange, sport._id, sport.slug]
  );

  const handleToggleCoaching = useCallback(() => {
    onToggleCoaching(sport._id, sport.slug, !sport.hasCoaching);
  }, [onToggleCoaching, sport._id, sport.slug, sport.hasCoaching]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{sport.name}</td>
      <td className="px-4 py-3 align-top">
        <Badge size="sm" variant="outline">
          {CATEGORY_LABELS[sport.category] ?? sport.category}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top">
        <button
          className="inline-flex"
          disabled={isPending}
          onClick={handleToggleCoaching}
          type="button"
        >
          <Badge size="sm" variant={sport.hasCoaching ? "green" : "outline"}>
            {sport.hasCoaching ? "Yes" : "No"}
          </Badge>
        </button>
      </td>
      <td className="px-4 py-3 align-top">
        <input
          className="w-16 rounded-lg border border-(--color-border) bg-(--color-surface) px-2 py-1 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          defaultValue={sport.order}
          disabled={isPending}
          onBlur={handleOrderChange}
          type="number"
        />
      </td>
      <td className="px-4 py-3 align-top">
        <Button
          href={`/admin/content/sports/${sport.slug}`}
          size="sm"
          variant="secondary"
        >
          Edit
        </Button>
      </td>
    </tr>
  );
}

interface SportsTableProps {
  sports: SportListItem[];
}

export function SportsTable({ sports }: SportsTableProps) {
  const [rows, setRows] = useState(sports);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const patchSport = useCallback(
    async (id: string, slug: string, patch: Record<string, unknown>) => {
      setPendingId(id);
      try {
        const response = await fetch(`/api/admin/content/sports/${slug}`, {
          body: JSON.stringify(patch),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });
        if (!response.ok) {
          return;
        }
        setRows((prev) =>
          prev.map((row) => (row._id === id ? { ...row, ...patch } : row))
        );
      } finally {
        setPendingId(null);
      }
    },
    []
  );

  const handleToggleCoaching = useCallback(
    (id: string, slug: string, hasCoaching: boolean) => {
      patchSport(id, slug, { hasCoaching });
    },
    [patchSport]
  );

  const handleOrderChange = useCallback(
    (id: string, slug: string, order: number) => {
      patchSport(id, slug, { order });
    },
    [patchSport]
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
        No sports found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-left text-sm">
        <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Sport Name</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Has Coaching</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((sport) => (
              <SportRow
                key={sport._id}
                onOrderChange={handleOrderChange}
                onToggleCoaching={handleToggleCoaching}
                pendingId={pendingId}
                sport={sport}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
