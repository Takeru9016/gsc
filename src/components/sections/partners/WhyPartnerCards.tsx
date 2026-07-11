import type { LucideIcon } from "lucide-react";
import { Eye, HeartHandshake, Users } from "lucide-react";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface ValueProp {
  description: string;
  icon: LucideIcon;
  title: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    description: "40,000+ member network and 2,000+ daily footfall.",
    icon: Users,
    title: "Massive Reach",
  },
  {
    description:
      "Logo placement, digital presence, and event branding across the club.",
    icon: Eye,
    title: "Premium Visibility",
  },
  {
    description: "Association with a 30+ year legacy sporting institution.",
    icon: HeartHandshake,
    title: "Community Impact",
  },
];

export function WhyPartnerCards() {
  return (
    <SectionWrapper>
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Why Partner With GSC
        </AnimatedText>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
        {VALUE_PROPS.map((prop) => (
          <div
            className="flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8"
            key={prop.title}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <prop.icon aria-hidden="true" size={22} />
            </span>
            <div>
              <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
                {prop.title}
              </h3>
              <p className="mt-2 text-(--color-text-secondary) text-sm">
                {prop.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
