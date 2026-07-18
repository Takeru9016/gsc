import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { EventCard } from "@/components/shared/EventCard.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";
import type { EventListItem } from "@/lib/sanity/queries.ts";

interface EventsPreviewProps {
  events: EventListItem[];
}

export function EventsPreview({ events }: EventsPreviewProps) {
  const upcomingEvents = events.slice(0, 3);

  return (
    <SectionWrapper>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          What's On
        </AnimatedText>
        <Button href="/events" variant="secondary">
          View All Events
        </Button>
      </div>
      {upcomingEvents.length === 0 ? (
        <p className="text-(--color-text-secondary)">
          No upcoming events. Check back soon.
        </p>
      ) : (
        <StaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {upcomingEvents.map((event) => (
            <EventCard event={event} key={event._id} />
          ))}
        </StaggerReveal>
      )}
    </SectionWrapper>
  );
}
