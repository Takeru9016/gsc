import { PartnershipForm } from "@/components/sections/admin/content/PartnershipForm.tsx";

export default function AdminPartnershipCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Add Opportunity</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Add a new partnership opportunity for /partners.
        </p>
      </div>
      <PartnershipForm mode="create" />
    </div>
  );
}
