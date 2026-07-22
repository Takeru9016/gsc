import { MilestoneForm } from "@/components/sections/admin/content/MilestoneForm.tsx";

export default function AdminMilestoneCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Add Milestone</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Add a new entry to the club history timeline.
        </p>
      </div>
      <MilestoneForm mode="create" />
    </div>
  );
}
