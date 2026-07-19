import { DiningVenuesTable } from "@/components/sections/admin/content/DiningVenuesTable.tsx";
import { getDiningVenues } from "@/lib/sanity/queries.ts";

export default async function AdminDiningPage() {
  const venues = await getDiningVenues();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Dining</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the 6 dining venues — menus, hours, and galleries.
        </p>
      </div>
      <DiningVenuesTable venues={venues} />
    </div>
  );
}
