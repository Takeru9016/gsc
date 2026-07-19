import { PartnersTable } from "@/components/sections/admin/submissions/PartnersTable.tsx";
import { getAllPartners } from "@/lib/db/adminQueries.ts";

export default async function AdminPartnerSubmissionsPage() {
  const partners = await getAllPartners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Partner Submissions
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Corporate partnership and sponsorship inquiries.
        </p>
      </div>
      <PartnersTable partners={partners} />
    </div>
  );
}
