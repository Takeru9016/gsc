import { notFound } from "next/navigation";
import { FoodStallForm } from "@/components/sections/admin/content/FoodStallForm.tsx";
import { getFoodStallById } from "@/lib/sanity/queries.ts";

export default async function AdminFoodStallEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stall = await getFoodStallById(id);

  if (!stall) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{stall.name}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit food stall details.
        </p>
      </div>
      <FoodStallForm mode="edit" stall={stall} />
    </div>
  );
}
