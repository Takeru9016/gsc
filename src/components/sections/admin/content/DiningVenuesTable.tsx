import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { DiningVenueListItem } from "@/lib/sanity/queries.ts";

interface DiningVenuesTableProps {
  venues: DiningVenueListItem[];
}

export function DiningVenuesTable({ venues }: DiningVenuesTableProps) {
  if (venues.length === 0) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
        No dining venues found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-left text-sm">
        <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Bar</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((venue) => (
            <tr
              className="border-(--color-border) border-b last:border-0"
              key={venue._id}
            >
              <td className="px-4 py-3 align-top font-medium">{venue.name}</td>
              <td className="px-4 py-3 align-top">
                <Badge size="sm" variant="outline">
                  {venue.type}
                </Badge>
              </td>
              <td className="px-4 py-3 align-top">
                {venue.hasBar ? (
                  <Badge size="sm" variant="gold">
                    Bar Available
                  </Badge>
                ) : (
                  <span className="text-(--color-text-secondary) text-xs">
                    —
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                <Button
                  href={`/admin/content/dining/${venue.slug}`}
                  size="sm"
                  variant="secondary"
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
