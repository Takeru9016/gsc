import type { PortableTextBlock } from "next-sanity";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface MembershipEligibilityProps {
  eligibility: PortableTextBlock[] | null;
  typeTitle: string;
}

export function MembershipEligibility({
  eligibility,
  typeTitle,
}: MembershipEligibilityProps) {
  return (
    <SectionWrapper>
      <h2 className="mb-8 font-display text-(--color-text-primary) text-3xl md:text-4xl">
        Who Can Apply
      </h2>
      {eligibility && eligibility.length > 0 ? (
        <PortableTextRenderer className="max-w-3xl" value={eligibility} />
      ) : (
        <p className="max-w-3xl text-(--color-text-secondary)">
          [PENDING_CONTENT] — Eligibility criteria for {typeTitle} coming soon.
        </p>
      )}
    </SectionWrapper>
  );
}
