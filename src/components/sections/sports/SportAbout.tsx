import type { PortableTextBlock } from "next-sanity";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface SportAboutProps {
  facilityDetails: PortableTextBlock[] | null;
  fullDescription: PortableTextBlock[] | null;
}

export function SportAbout({
  fullDescription,
  facilityDetails,
}: SportAboutProps) {
  return (
    <SectionWrapper>
      <AnimatedText
        as="h2"
        className="mb-8 font-display text-(--color-text-primary) text-3xl md:text-4xl"
      >
        About the Sport
      </AnimatedText>
      {fullDescription ? (
        <PortableTextRenderer className="max-w-3xl" value={fullDescription} />
      ) : (
        // [PENDING_CONTENT] — sport full description from Sanity
        <p className="max-w-3xl text-(--color-text-secondary)">
          [PENDING_CONTENT] — Full description coming soon.
        </p>
      )}
      {facilityDetails ? (
        <div className="mt-8 max-w-3xl">
          <h3 className="mb-3 font-body font-semibold text-(--color-text-primary) text-xl">
            Facility Details
          </h3>
          <PortableTextRenderer value={facilityDetails} />
        </div>
      ) : null}
    </SectionWrapper>
  );
}
