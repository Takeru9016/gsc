import Image from "next/image";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { CorporatePartner } from "@/lib/sanity/queries.ts";

const PLACEHOLDER_COUNT = 6;
const PLACEHOLDER_IDS = Array.from(
  { length: PLACEHOLDER_COUNT },
  (_, index) => `current-partner-placeholder-${index}`
);

interface CurrentPartnersGridProps {
  partners: CorporatePartner[];
}

export function CurrentPartnersGrid({ partners }: CurrentPartnersGridProps) {
  const hasPartners = partners.length > 0;

  return (
    <SectionWrapper>
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Current Partners
        </AnimatedText>
      </div>
      <StaggerReveal className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
        {hasPartners
          ? partners.map((partner) => (
              <div
                className="flex aspect-video items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-4"
                key={partner.name}
              >
                {partner.logo ? (
                  <Image
                    alt={partner.name}
                    className="max-h-12 w-auto object-contain"
                    height={48}
                    src={urlFor(partner.logo).height(96).url()}
                    width={140}
                  />
                ) : (
                  <span className="text-(--color-text-secondary) text-sm">
                    {partner.name}
                  </span>
                )}
              </div>
            ))
          : PLACEHOLDER_IDS.map((id) => (
              // [PENDING_CONTENT] — corporate partner logo from Sanity siteConfig
              <div
                className="flex aspect-video items-center justify-center rounded-2xl border border-(--color-border) bg-surface-dark"
                key={id}
              >
                <span className="text-sm text-text-secondary-dark">
                  Your Brand Here
                </span>
              </div>
            ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}
