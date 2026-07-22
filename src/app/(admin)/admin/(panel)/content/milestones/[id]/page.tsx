import { notFound } from "next/navigation";
import { MilestoneForm } from "@/components/sections/admin/content/MilestoneForm.tsx";
import { getMilestoneById } from "@/lib/sanity/queries.ts";

export default async function AdminMilestoneEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const milestone = await getMilestoneById(id);

  if (!milestone) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          {milestone.title}
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit milestone details.
        </p>
      </div>
      <MilestoneForm milestone={milestone} mode="edit" />
    </div>
  );
}
