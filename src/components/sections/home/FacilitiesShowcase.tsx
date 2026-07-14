import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";
import { cn } from "@/lib/utils.ts";

const FACILITIES = [
  {
    description:
      "Three premium event venues — Regal, Rhythm, and Glamourra — for weddings, celebrations, and corporate events.",
    href: "/facilities/banquets",
    name: "Banquets",
  },
  {
    description:
      "Six restaurants and cafes spanning fine dining to casual bites, including the exclusive Bleu Restobar.",
    href: "/facilities/dining",
    name: "Dining",
  },
  {
    description:
      "Eighteen comfortable guest rooms for members and visitors, available for short and extended stays.",
    href: "/facilities/rooms",
    name: "Rooms",
  },
];

export function FacilitiesShowcase() {
  return (
    <SectionWrapper>
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Premium Facilities
        </AnimatedText>
      </div>
      <StaggerReveal className="flex flex-col gap-12 md:gap-16 lg:gap-20">
        {FACILITIES.map((facility, index) => (
          <div
            className={cn(
              "flex flex-col items-center gap-6 md:gap-10 lg:flex-row",
              index % 2 === 1 && "lg:flex-row-reverse"
            )}
            key={facility.name}
          >
            {/* [PENDING_CONTENT] — facility image from Sanity */}
            <div className="aspect-video w-full flex-1 rounded-2xl bg-surface-dark" />
            <div className="flex-1">
              <AnimatedText
                as="h3"
                className="font-body font-semibold text-(--color-text-primary) text-2xl"
              >
                {facility.name}
              </AnimatedText>
              <p className="mt-3 text-(--color-text-secondary)">
                {facility.description}
              </p>
              <Button className="mt-6" href={facility.href} variant="secondary">
                Explore {facility.name}
              </Button>
            </div>
          </div>
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}
