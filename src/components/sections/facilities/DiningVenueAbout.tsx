import { Users, UtensilsCrossed } from "lucide-react";
import type { PortableTextBlock } from "next-sanity";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface DiningVenueAboutProps {
  cuisineType: string | null;
  description: PortableTextBlock[] | null;
  seatingCapacity: number | null;
}

export function DiningVenueAbout({
  cuisineType,
  description,
  seatingCapacity,
}: DiningVenueAboutProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
        <div>
          <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
            About
          </h2>
          {description && description.length > 0 ? (
            <PortableTextRenderer className="mt-4" value={description} />
          ) : (
            // [PENDING_CONTENT] — venue description from manager
            <p className="mt-4 text-(--color-text-secondary)">
              [PENDING_CONTENT] — Venue description.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
            <div className="flex items-center gap-2 text-(--color-text-secondary) text-sm">
              <UtensilsCrossed aria-hidden="true" size={16} />
              Cuisine
            </div>
            <p className="mt-1 font-body font-semibold text-(--color-text-primary)">
              {cuisineType ?? "[PENDING_CONTENT]"}
            </p>
          </div>
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
            <div className="flex items-center gap-2 text-(--color-text-secondary) text-sm">
              <Users aria-hidden="true" size={16} />
              Seating Capacity
            </div>
            <p className="mt-1 font-body font-semibold text-(--color-text-primary)">
              {seatingCapacity
                ? `Up to ${seatingCapacity}`
                : "[PENDING_CONTENT]"}
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
