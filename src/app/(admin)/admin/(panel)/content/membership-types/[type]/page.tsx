import { notFound } from "next/navigation";
import { MembershipTypeEditForm } from "@/components/sections/admin/content/MembershipTypeEditForm.tsx";
import { getMembershipTypeByType } from "@/lib/sanity/queries.ts";

export default async function AdminMembershipTypeEditPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const membershipType = await getMembershipTypeByType(type);

  if (!membershipType) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          {membershipType.title}
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit membership type details.
        </p>
      </div>
      <MembershipTypeEditForm membershipType={membershipType} />
    </div>
  );
}
