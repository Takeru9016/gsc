import { BanquetHallsTable } from "@/components/sections/admin/content/BanquetHallsTable.tsx";
import { getBanquetHalls } from "@/lib/sanity/queries.ts";

export default async function AdminBanquetsPage() {
  const halls = await getBanquetHalls();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Banquets</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the 3 banquet halls — capacity, setup options, and galleries.
        </p>
      </div>
      <BanquetHallsTable halls={halls} />
    </div>
  );
}
