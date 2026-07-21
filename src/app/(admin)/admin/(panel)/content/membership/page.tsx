import { AffiliatedClubsManager } from "@/components/sections/admin/content/AffiliatedClubsManager.tsx";
import { MembershipEnrollmentCard } from "@/components/sections/admin/content/MembershipEnrollmentCard.tsx";
import { RecentMembershipInquiries } from "@/components/sections/admin/content/RecentMembershipInquiries.tsx";
import { getLatestMemberships } from "@/lib/db/adminQueries.ts";
import { getMembershipConfig } from "@/lib/sanity/queries.ts";

const EMPTY_MEMBERSHIP_CONFIG = {
  affiliatedClubs: [],
  enrollmentNotice: "",
  enrollmentOpen: false,
};

export default async function AdminMembershipContentPage() {
  const [config, memberships] = await Promise.all([
    getMembershipConfig(),
    getLatestMemberships(10),
  ]);

  const resolvedConfig = config ?? EMPTY_MEMBERSHIP_CONFIG;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-semibold text-3xl">Membership</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Control enrollment status, review inquiries, and manage affiliated
          clubs.
        </p>
      </div>

      <MembershipEnrollmentCard config={resolvedConfig} />

      <RecentMembershipInquiries memberships={memberships} />

      <AffiliatedClubsManager clubs={resolvedConfig.affiliatedClubs} />
    </div>
  );
}
