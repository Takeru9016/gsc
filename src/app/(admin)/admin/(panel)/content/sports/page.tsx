import { SportsTable } from "@/components/sections/admin/content/SportsTable.tsx";
import { getSports } from "@/lib/sanity/queries.ts";

export default async function AdminSportsPage() {
  const sports = await getSports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Sports</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage sport listings, coaching availability, and sort order.
        </p>
      </div>
      <SportsTable sports={sports} />
    </div>
  );
}
