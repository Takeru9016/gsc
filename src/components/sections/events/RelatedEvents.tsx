import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { EventCard } from "@/components/shared/EventCard.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { EventListItem } from "@/lib/sanity/queries.ts";

interface RelatedEventsProps {
  events: EventListItem[];
}

export function RelatedEvents({ events }: RelatedEventsProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="mb-8 flex items-center justify-between md:mb-12">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-3xl md:text-4xl"
        >
          Related Events
        </AnimatedText>
        <Link
          className="font-medium text-primary transition-all duration-200 hover:text-primary-hover"
          href="/events"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((event) => (
          <EventCard event={event} key={event._id} />
        ))}
      </div>
    </SectionWrapper>
  );
}
