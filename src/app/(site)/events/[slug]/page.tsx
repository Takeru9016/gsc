import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetails } from "@/components/sections/events/EventDetails.tsx";
import { EventRegistration } from "@/components/sections/events/EventRegistration.tsx";
import { RelatedEvents } from "@/components/sections/events/RelatedEvents.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { client } from "@/lib/sanity/client.ts";
import { getEventBySlug, getRelatedEvents } from "@/lib/sanity/queries.ts";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await client.fetch<{ slug: string }[]>(
    `*[_type == "event"] { "slug": slug.current }`,
    {},
    { next: { tags: ["events"] } }
  );

  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found | Goregaon Sports Club" };
  }

  return {
    description: event.metaDescription ?? undefined,
    title: event.metaTitle ?? `${event.title} | Goregaon Sports Club`,
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const dateRangeLabel = endDate
    ? `${startDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${endDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
    : startDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const relatedEvents = await getRelatedEvents(event.type, event.slug);

  return (
    <>
      <PageHero
        badge={dateRangeLabel}
        headline={event.title}
        image={event.heroImage ?? undefined}
      >
        <Badge variant="primary">{event.type}</Badge>
      </PageHero>
      <EventDetails
        description={event.description}
        endDate={event.endDate}
        schedule={event.schedule}
        startDate={event.startDate}
        status={event.status}
        type={event.type}
        venue={event.venue}
      />
      <EventRegistration
        registrationDeadline={event.registrationDeadline}
        registrationUrl={event.registrationUrl}
        status={event.status}
      />
      {relatedEvents.length > 0 ? (
        <RelatedEvents events={relatedEvents} />
      ) : null}
    </>
  );
}
