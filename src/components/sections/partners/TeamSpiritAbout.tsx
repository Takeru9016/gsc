import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function TeamSpiritAbout() {
  return (
    <SectionWrapper className="pt-0">
      <div className="max-w-3xl">
        <AnimatedText
          as="h2"
          className="font-body font-semibold text-(--color-text-primary) text-2xl"
        >
          About Team Spirit
        </AnimatedText>
        <p className="mt-4 text-(--color-text-secondary)">
          Team Spirit is Goregaon Sports Club's quarterly member magazine,
          distributed to all 12,000+ primary members. Published 3 times a year —
          Summer, Diwali, and New Year editions.
        </p>
      </div>
    </SectionWrapper>
  );
}
