import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

const SPORT_CATEGORIES = [
  { count: 7, label: "Outdoor" },
  { count: 11, label: "Indoor" },
  { count: 1, label: "Aquatic" },
  { count: 3, label: "Health & Fitness" },
  { count: 2, label: "Track" },
  { count: null, label: "Coaching" },
];

export function SportsGrid() {
  return (
    <SectionWrapper>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          World-Class Sports
        </AnimatedText>
        <Button href="/sports" variant="secondary">
          View All Sports
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
        {SPORT_CATEGORIES.map((category) => (
          <Link
            className="group block overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
            href="/sports"
            key={category.label}
          >
            {/* [PENDING_CONTENT] — category image from Sanity */}
            <div className="mb-4 aspect-video rounded-xl bg-surface-dark" />
            <h3 className="font-body font-semibold text-(--color-text-primary) text-xl">
              {category.label}
            </h3>
            <p className="mt-1 text-(--color-text-secondary) text-sm">
              {category.count === null
                ? "Expert-led programs"
                : `${category.count} sport${category.count === 1 ? "" : "s"}`}
            </p>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
