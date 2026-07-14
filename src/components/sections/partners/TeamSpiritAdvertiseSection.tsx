import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { TeamSpiritEdition } from "@/lib/sanity/queries.ts";

interface TeamSpiritAdvertiseSectionProps {
  latestEdition: TeamSpiritEdition | undefined;
}

export function TeamSpiritAdvertiseSection({
  latestEdition,
}: TeamSpiritAdvertiseSectionProps) {
  const adSpecs = latestEdition?.adSpecs;

  return (
    <SectionWrapper>
      <div className="max-w-3xl">
        <AnimatedText
          as="h2"
          className="font-body font-semibold text-(--color-text-primary) text-2xl"
        >
          Advertise in Team Spirit
        </AnimatedText>
        {adSpecs && adSpecs.length > 0 ? (
          <PortableTextRenderer className="mt-4" value={adSpecs} />
        ) : (
          <p className="mt-4 text-(--color-text-secondary)">
            {/* [PENDING_CONTENT] — ad sizes, rates, and specs from Sanity */}
            Ad specifications and rates available on request.
          </p>
        )}
        <Button className="mt-6" href="/contact?subject=partnership">
          Get Ad Specs
        </Button>
      </div>
    </SectionWrapper>
  );
}
