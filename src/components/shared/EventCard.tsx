import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { EventListItem } from "@/lib/sanity/queries.ts";
import { cn, getPortableTextSnippet } from "@/lib/utils.ts";

interface EventCardProps {
  className?: string;
  event: EventListItem;
}

export function EventCard({ event, className }: EventCardProps) {
  const date = new Date(event.startDate);
  const day = date.toLocaleDateString("en-IN", { day: "2-digit" });
  const month = date.toLocaleDateString("en-IN", { month: "short" });

  return (
    <Link
      className={cn(
        "group block overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md",
        className
      )}
      href={`/events/${event.slug}`}
    >
      <div className="relative aspect-video bg-surface-dark">
        {event.heroImage ? (
          <Image
            alt={event.title}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            fill
            src={urlFor(event.heroImage).width(600).height(340).url()}
          />
        ) : null}
        <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl border border-border-dark bg-bg-dark/80 px-3 py-1.5 text-text-primary-dark backdrop-blur-sm">
          <span className="font-display font-semibold text-lg leading-none">
            {day}
          </span>
          <span className="text-[11px] uppercase leading-none">{month}</span>
        </div>
      </div>
      <div className="p-6">
        <Badge className="mb-3" variant="primary">
          {event.type}
        </Badge>
        <h3 className="font-body font-semibold text-(--color-text-primary) text-lg">
          {event.title}
        </h3>
        {event.description ? (
          <p className="mt-2 text-(--color-text-secondary) text-sm">
            {getPortableTextSnippet(event.description, 110)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
