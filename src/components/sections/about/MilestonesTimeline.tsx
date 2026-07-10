import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { Milestone } from "@/lib/sanity/queries.ts";
import { cn } from "@/lib/utils.ts";

// Shown only when Sanity has no `milestone` documents yet.
const PLACEHOLDER_MILESTONES: Milestone[] = [
  {
    _id: "placeholder-1993",
    description:
      "Goregaon Sports Club was established to bring world-class sporting facilities to Mumbai's western suburbs. [PENDING_CONTENT]",
    image: null,
    title: "Club Founded",
    year: 1993,
  },
  {
    _id: "placeholder-2008",
    description:
      "New courts, banquet halls, and dining venues were added, marking a decade of rapid growth. [PENDING_CONTENT]",
    image: null,
    title: "Major Facility Expansion",
    year: 2008,
  },
  {
    _id: "placeholder-2023",
    description:
      "GSC crossed 12,000 members, cementing its place as one of Mumbai's premier multi-sport clubs. [PENDING_CONTENT]",
    image: null,
    title: "12,000+ Members Strong",
    year: 2023,
  },
];

interface MilestonesTimelineProps {
  milestones: Milestone[];
}

export function MilestonesTimeline({ milestones }: MilestonesTimelineProps) {
  const items = milestones.length > 0 ? milestones : PLACEHOLDER_MILESTONES;

  return (
    <SectionWrapper>
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Our Journey
        </AnimatedText>
        <p className="mt-3 text-(--color-text-secondary)">
          Three decades of milestones that shaped Goregaon Sports Club.
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-4 w-px bg-(--color-border) md:left-1/2"
        />
        <ol className="flex flex-col gap-10 md:gap-4">
          {items.map((milestone, index) => {
            const isEven = index % 2 === 0;

            return (
              <li
                className={cn(
                  "relative flex flex-col gap-2 pl-12 md:flex-row md:items-start md:gap-8 md:py-6 md:pl-0",
                  !isEven && "md:flex-row-reverse"
                )}
                key={milestone._id}
              >
                <span
                  aria-hidden
                  className="absolute top-1.5 left-4 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent-gold bg-(--color-bg) md:left-1/2"
                />
                <div
                  className={cn(
                    "md:w-1/2",
                    isEven ? "md:pr-8 md:text-right" : "md:pl-8"
                  )}
                >
                  <Badge variant="gold">{milestone.year}</Badge>
                  <AnimatedText
                    as="h3"
                    className="mt-3 font-body font-semibold text-(--color-text-primary) text-xl"
                  >
                    {milestone.title}
                  </AnimatedText>
                  {milestone.description ? (
                    <p className="mt-2 text-(--color-text-secondary)">
                      {milestone.description}
                    </p>
                  ) : null}
                </div>
                <div aria-hidden className="hidden md:block md:w-1/2" />
              </li>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}
