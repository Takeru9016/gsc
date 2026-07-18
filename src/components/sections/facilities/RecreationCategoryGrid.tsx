import type { LucideIcon } from "lucide-react";
import { ArrowRight, Baby, Spade, Ticket } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";

interface RecreationCategory {
  description: string;
  href: string;
  icon: LucideIcon;
  title: string;
}

const RECREATION_CATEGORIES: RecreationCategory[] = [
  {
    description: "A supervised play area for members' children.",
    href: "/facilities/recreation/kids-zone",
    icon: Baby,
    title: "Kids Zone",
  },
  {
    description: "A members-only room for classic card games.",
    href: "/facilities/recreation/cards-room",
    icon: Spade,
    title: "Cards Room",
  },
  {
    description: "Monthly tambola nights with prizes to be won.",
    href: "/facilities/recreation/housie",
    icon: Ticket,
    title: "Housie Nights",
  },
];

function RecreationCategoryCard({
  category,
}: {
  category: RecreationCategory;
}) {
  return (
    <Link
      className="group block overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
      href={category.href}
    >
      {/* [PENDING_CONTENT] — Replace with actual Sanity image */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-surface-dark">
        <category.icon aria-hidden="true" className="text-primary" size={32} />
      </div>
      <h3 className="mt-4 font-body font-semibold text-(--color-text-primary) text-2xl">
        {category.title}
      </h3>
      <p className="mt-2 text-(--color-text-secondary) text-sm">
        {category.description}
      </p>
      <span className="mt-4 flex items-center gap-1 font-medium text-primary text-sm">
        Explore
        <ArrowRight
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
          size={16}
        />
      </span>
    </Link>
  );
}

export function RecreationCategoryGrid() {
  return (
    <SectionWrapper>
      <StaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {RECREATION_CATEGORIES.map((category) => (
          <RecreationCategoryCard category={category} key={category.title} />
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}
