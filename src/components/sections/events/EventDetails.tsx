import type { PortableTextBlock } from "next-sanity";
import { Badge } from "@/components/shared/Badge.tsx";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface EventDetailsProps {
  description: PortableTextBlock[] | null;
  endDate: string | null;
  schedule: PortableTextBlock[] | null;
  startDate: string;
  status: string;
  type: string;
  venue: string | null;
}

const STATUS_BADGE_VARIANT: Record<string, "green" | "gold" | "outline"> = {
  ongoing: "gold",
  past: "outline",
  upcoming: "green",
};

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  past: "Past",
  upcoming: "Upcoming",
};

function formatEventDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventDetails({
  description,
  schedule,
  startDate,
  endDate,
  venue,
  type,
  status,
}: EventDetailsProps) {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
        <div className="md:col-span-2">
          {description && description.length > 0 ? (
            <PortableTextRenderer value={description} />
          ) : (
            // [PENDING_CONTENT] — event description from manager
            <p className="text-(--color-text-secondary)">
              [PENDING_CONTENT] — Event description.
            </p>
          )}
          {schedule && schedule.length > 0 ? (
            <div className="mt-8">
              <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
                Schedule
              </h2>
              <PortableTextRenderer className="mt-4" value={schedule} />
            </div>
          ) : null}
        </div>
        <div className="h-fit rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
          <h2 className="font-body font-semibold text-(--color-text-primary) text-lg">
            Event Details
          </h2>
          <dl className="mt-4 flex flex-col gap-4">
            <div>
              <dt className="text-(--color-text-secondary) text-sm">
                Start Date
              </dt>
              <dd className="mt-1 text-(--color-text-primary)">
                {formatEventDate(startDate)}
              </dd>
            </div>
            {endDate ? (
              <div>
                <dt className="text-(--color-text-secondary) text-sm">
                  End Date
                </dt>
                <dd className="mt-1 text-(--color-text-primary)">
                  {formatEventDate(endDate)}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-(--color-text-secondary) text-sm">Venue</dt>
              <dd className="mt-1 text-(--color-text-primary)">
                {venue ?? "[PENDING_CONTENT]"}
              </dd>
            </div>
            <div>
              <dt className="text-(--color-text-secondary) text-sm">Type</dt>
              <dd className="mt-1">
                <Badge variant="primary">{type}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-(--color-text-secondary) text-sm">Status</dt>
              <dd className="mt-1">
                <Badge variant={STATUS_BADGE_VARIANT[status] ?? "outline"}>
                  {STATUS_LABEL[status] ?? status}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SectionWrapper>
  );
}
