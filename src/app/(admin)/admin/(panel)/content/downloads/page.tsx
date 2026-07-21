import { DownloadsTable } from "@/components/sections/admin/content/DownloadsTable.tsx";
import { getAllDownloadsAdmin } from "@/lib/sanity/queries.ts";

export default async function AdminDownloadsPage() {
  const downloads = await getAllDownloadsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Downloads</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage notices, circulars, forms, and reports available to members.
        </p>
      </div>
      <DownloadsTable downloads={downloads} />
    </div>
  );
}
