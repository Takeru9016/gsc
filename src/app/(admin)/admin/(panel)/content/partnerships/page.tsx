import { PartnershipsTable } from "@/components/sections/admin/content/PartnershipsTable.tsx";
import { getPartnershipOpportunities } from "@/lib/sanity/queries.ts";

export default async function AdminPartnershipsPage() {
  const opportunities = await getPartnershipOpportunities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Partnership Opportunities
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the sponsorship and partnership tiers shown on /partners.
        </p>
      </div>
      <PartnershipsTable opportunities={opportunities} />
    </div>
  );
}
