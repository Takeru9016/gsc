import { notFound } from "next/navigation";
import { PartnershipForm } from "@/components/sections/admin/content/PartnershipForm.tsx";
import { getPartnershipOpportunityById } from "@/lib/sanity/queries.ts";

export default async function AdminPartnershipEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await getPartnershipOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          {opportunity.title}
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit partnership opportunity details.
        </p>
      </div>
      <PartnershipForm mode="edit" opportunity={opportunity} />
    </div>
  );
}
