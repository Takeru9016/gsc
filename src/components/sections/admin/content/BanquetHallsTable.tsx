import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { BanquetHallListItem } from "@/lib/sanity/queries.ts";

interface BanquetHallsTableProps {
  halls: BanquetHallListItem[];
}

export function BanquetHallsTable({ halls }: BanquetHallsTableProps) {
  if (halls.length === 0) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
        No banquet halls found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-left text-sm">
        <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Capacity</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {halls.map((hall) => (
            <tr
              className="border-(--color-border) border-b last:border-0"
              key={hall._id}
            >
              <td className="px-4 py-3 align-top font-medium">{hall.name}</td>
              <td className="px-4 py-3 align-top">
                {hall.capacity ? (
                  hall.capacity
                ) : (
                  <Badge size="sm" variant="gold">
                    [PENDING]
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                <Button
                  href={`/admin/content/banquets/${hall.slug}`}
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
