import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { SportCard } from "@/components/shared/SportCard.tsx";
import type { SportListItem } from "@/lib/sanity/queries.ts";
import { SPORT_CATEGORIES } from "@/lib/sportCategories.ts";

const SKELETON_IDS = ["skeleton-1", "skeleton-2", "skeleton-3"];

interface SportsCategoryGridProps {
  sports: SportListItem[];
}

function CategorySkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SKELETON_IDS.map((id) => (
        <div
          className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-6"
          key={id}
        >
          <div className="aspect-video rounded-xl bg-(--color-border)" />
          <div className="mt-4 h-5 w-2/3 rounded bg-(--color-border)" />
          <div className="mt-2 h-4 w-full rounded bg-(--color-border)" />
        </div>
      ))}
    </div>
  );
}

interface CategoryBodyProps {
  categoryLabel: string;
  categorySports: SportListItem[];
  hasAnySports: boolean;
}

function CategoryBody({
  hasAnySports,
  categorySports,
  categoryLabel,
}: CategoryBodyProps) {
  if (!hasAnySports) {
    return <CategorySkeleton />;
  }

  if (categorySports.length === 0) {
    return (
      <p className="mt-4 text-(--color-text-secondary)">
        {/* [PENDING_CONTENT] — awaiting sport documents in this category */}
        More {categoryLabel.toLowerCase()} sports coming soon.
      </p>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categorySports.map((sport) => (
        <SportCard key={sport._id} sport={sport} />
      ))}
    </div>
  );
}

export function SportsCategoryGrid({ sports }: SportsCategoryGridProps) {
  return (
    <SectionWrapper>
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Every Sport, One Club
        </AnimatedText>
        <p className="mt-3 max-w-2xl text-(--color-text-secondary)">
          23+ disciplines across five categories — find yours below.
        </p>
      </div>
      <div className="flex flex-col gap-16 md:gap-20">
        {SPORT_CATEGORIES.map((category) => {
          const categorySports = sports.filter(
            (sport) => sport.category === category.value
          );

          return (
            <div
              className="scroll-mt-24"
              id={category.anchorId}
              key={category.value}
            >
              <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
                {category.label}
              </h3>
              <CategoryBody
                categoryLabel={category.label}
                categorySports={categorySports}
                hasAnySports={sports.length > 0}
              />
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
