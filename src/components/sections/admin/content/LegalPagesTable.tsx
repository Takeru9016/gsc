import { Button } from "@/components/shared/Button.tsx";
import type { LegalPage } from "@/lib/sanity/queries.ts";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface LegalPagesTableProps {
  pages: LegalPage[];
}

export function LegalPagesTable({ pages }: LegalPagesTableProps) {
  if (pages.length === 0) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
        No legal pages found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-left text-sm">
        <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Last Updated</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr
              className="border-(--color-border) border-b last:border-0"
              key={page._id}
            >
              <td className="px-4 py-3 align-top font-medium">{page.title}</td>
              <td className="px-4 py-3 align-top text-(--color-text-secondary)">
                {page.slug}
              </td>
              <td className="px-4 py-3 align-top">
                {formatDate(page.lastUpdated)}
              </td>
              <td className="px-4 py-3 align-top">
                <Button
                  href={`/admin/content/legal/${page.slug}`}
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
