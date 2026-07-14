import Image from "next/image";
import type { CSSProperties } from "react";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { CorporatePartner } from "@/lib/sanity/queries.ts";

const MARQUEE_STYLE = { "--marquee-duration": "20s" } as CSSProperties;

const PLACEHOLDER_COUNT = 8;
const PARTNER_PLACEHOLDER_IDS = Array.from(
  { length: PLACEHOLDER_COUNT * 2 },
  (_, index) => `partner-placeholder-${index}`
);

interface PartnersStripProps {
  partners: CorporatePartner[];
}

function PartnerLogo({ partner }: { partner: CorporatePartner }) {
  return (
    <div className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl bg-surface-dark">
      {partner.logo ? (
        <Image
          alt={partner.name}
          className="max-h-10 w-auto object-contain"
          height={40}
          src={urlFor(partner.logo).height(80).url()}
          width={120}
        />
      ) : (
        <span className="text-(--color-text-secondary) text-xs">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export function PartnersStrip({ partners }: PartnersStripProps) {
  const hasPartners = partners.length > 0;

  return (
    <SectionWrapper className="py-12 md:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <AnimatedText
          as="h2"
          className="font-body font-medium text-(--color-text-secondary) text-sm uppercase tracking-wide"
        >
          Our Partners
        </AnimatedText>
        <Button href="/partners" size="sm" variant="secondary">
          Partner With Us
        </Button>
      </div>
      <div className="overflow-hidden">
        <div
          className="marquee-track flex w-max items-center gap-8"
          style={MARQUEE_STYLE}
        >
          {hasPartners ? (
            <>
              {partners.map((partner) => (
                <PartnerLogo key={`a-${partner.name}`} partner={partner} />
              ))}
              {partners.map((partner) => (
                <PartnerLogo key={`b-${partner.name}`} partner={partner} />
              ))}
            </>
          ) : (
            PARTNER_PLACEHOLDER_IDS.map((id) => (
              // [PENDING_CONTENT] — corporate partner logo from Sanity siteConfig
              <div
                className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl bg-surface-dark"
                key={id}
              />
            ))
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
