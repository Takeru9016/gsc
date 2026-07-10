import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  ArrowRight,
  BedDouble,
  BookOpen,
  Gamepad2,
  PartyPopper,
  ShoppingBag,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface FacilityCategory {
  description: string;
  href: string;
  icon: LucideIcon;
  title: string;
}

const FACILITY_CATEGORIES: FacilityCategory[] = [
  {
    description: "18 comfortable rooms for members and guests",
    href: "/facilities/rooms",
    icon: BedDouble,
    title: "Rooms",
  },
  {
    description: "3 premium event venues",
    href: "/facilities/banquets",
    icon: PartyPopper,
    title: "Banquets",
  },
  {
    description: "6 restaurants and cafes",
    href: "/facilities/dining",
    icon: UtensilsCrossed,
    title: "Dining",
  },
  {
    description: "Kids zone, cards room, and more",
    href: "/facilities/recreation",
    icon: Gamepad2,
    title: "Recreation",
  },
  {
    description: "Equipment and apparel",
    href: "/facilities/sports-shop",
    icon: ShoppingBag,
    title: "Sports Shop",
  },
  {
    description: "Relaxation area",
    href: "/facilities/massage-chairs",
    icon: Armchair,
    title: "Massage Chairs",
  },
  {
    description: "Reading and reference",
    href: "/facilities/library",
    icon: BookOpen,
    title: "Library",
  },
  {
    description: "On-site medical support",
    href: "/facilities/medical-cell",
    icon: Stethoscope,
    title: "Medical Cell",
  },
];

export function FacilityCategoryGrid() {
  return (
    <SectionWrapper>
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Explore Our Facilities
        </AnimatedText>
        <p className="mt-3 max-w-2xl text-(--color-text-secondary)">
          Everything a member needs, all under one roof.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
        {FACILITY_CATEGORIES.map((category) => (
          <Link
            className="group flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
            href={category.href}
            key={category.title}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <category.icon aria-hidden="true" size={22} />
            </span>
            <div>
              <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
                {category.title}
              </h3>
              <p className="mt-2 text-(--color-text-secondary) text-sm">
                {category.description}
              </p>
            </div>
            <span className="mt-auto flex items-center gap-1 font-medium text-primary text-sm">
              Explore
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
                size={16}
              />
            </span>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
