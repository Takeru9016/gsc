import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { MembershipInquiry } from "@/lib/db/schema.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface RecentMembershipInquiriesProps {
  memberships: MembershipInquiry[];
}

export function RecentMembershipInquiries({
  memberships,
}: RecentMembershipInquiriesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-body font-semibold text-lg">
          Membership Submissions
        </h2>
        <Button
          href="/admin/submissions/memberships"
          size="sm"
          variant="secondary"
        >
          View All
        </Button>
      </div>

      {memberships.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No membership inquiries yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((row) => (
                <tr
                  className="border-(--color-border) border-b last:border-0"
                  key={row.id}
                >
                  <td className="px-4 py-3 align-top font-medium">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 align-top">{row.email}</td>
                  <td className="px-4 py-3 align-top">{row.membershipType}</td>
                  <td className="px-4 py-3 align-top">
                    <Badge
                      size="sm"
                      variant={getStatusBadgeVariant(row.status)}
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {formatDate(row.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
