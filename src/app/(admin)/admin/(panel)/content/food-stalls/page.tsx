import { FoodStallsTable } from "@/components/sections/admin/content/FoodStallsTable.tsx";
import { getFoodStalls } from "@/lib/sanity/queries.ts";

export default async function AdminFoodStallsPage() {
  const stalls = await getFoodStalls();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Food Stalls</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the stalls inside the Food Court.
        </p>
      </div>
      <FoodStallsTable stalls={stalls} />
    </div>
  );
}
