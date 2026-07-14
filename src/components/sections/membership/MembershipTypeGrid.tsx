import { Button } from "@/components/shared/Button.tsx";
import { MEMBERSHIP_TYPES_FALLBACK } from "@/lib/membershipTypes.ts";
import type { MembershipTypeListItem } from "@/lib/sanity/queries.ts";
import {
  getPortableTextListItems,
  getPortableTextSnippet,
} from "@/lib/utils.ts";

interface MembershipTypeGridProps {
  membershipTypes: MembershipTypeListItem[];
}

export function MembershipTypeGrid({
  membershipTypes,
}: MembershipTypeGridProps) {
  const byType = new Map(
    membershipTypes.map((membershipType) => [
      membershipType.type,
      membershipType,
    ])
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {MEMBERSHIP_TYPES_FALLBACK.map((fallback) => {
        const membershipType = byType.get(fallback.type);
        const title = membershipType?.title ?? fallback.title;
        const eligibilitySummary = membershipType
          ? getPortableTextSnippet(membershipType.eligibility, 140)
          : fallback.tagline;
        const benefits = membershipType
          ? getPortableTextListItems(membershipType.benefits, 3)
          : [];

        return (
          <div
            className="flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
            key={fallback.slug}
          >
            <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
              {title}
            </h3>
            <p className="line-clamp-2 text-(--color-text-secondary)">
              {eligibilitySummary || "[PENDING_CONTENT] — Eligibility details."}
            </p>
            {benefits.length > 0 ? (
              <ul className="list-inside list-disc space-y-1 text-(--color-text-secondary) text-sm">
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            ) : (
              <p className="text-(--color-text-secondary) text-sm">
                [PENDING_CONTENT] — Benefits list.
              </p>
            )}
            <Button
              className="self-start"
              href={`/membership/${fallback.slug}`}
            >
              Express Interest
            </Button>
          </div>
        );
      })}
    </div>
  );
}
