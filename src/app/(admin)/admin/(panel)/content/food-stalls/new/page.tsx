import { FoodStallForm } from "@/components/sections/admin/content/FoodStallForm.tsx";

export default function AdminFoodStallCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Add Stall</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Add a new stall to the Food Court.
        </p>
      </div>
      <FoodStallForm mode="create" />
    </div>
  );
}
