import type { PortableTextBlock } from "next-sanity";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface MembershipBenefitsProps {
  benefits: PortableTextBlock[] | null;
  typeTitle: string;
}

export function MembershipBenefits({
  benefits,
  typeTitle,
}: MembershipBenefitsProps) {
  return (
    <SectionWrapper className="pt-0">
      <h2 className="mb-8 font-display text-(--color-text-primary) text-3xl md:text-4xl">
        Membership Benefits
      </h2>
      {benefits && benefits.length > 0 ? (
        <PortableTextRenderer className="max-w-3xl" value={benefits} />
      ) : (
        <p className="max-w-3xl text-(--color-text-secondary)">
          [PENDING_CONTENT] — Benefits for {typeTitle} coming soon.
        </p>
      )}
    </SectionWrapper>
  );
}
