import { MembershipTypesTable } from "@/components/sections/admin/content/MembershipTypesTable.tsx";
import { getMembershipTypes } from "@/lib/sanity/queries.ts";

export default async function AdminMembershipTypesPage() {
  const membershipTypes = await getMembershipTypes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Membership Types
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit eligibility, benefits, and fees for each of the 5 membership
          types. Enrollment status is controlled from the Membership page.
        </p>
      </div>
      <MembershipTypesTable membershipTypes={membershipTypes} />
    </div>
  );
}
