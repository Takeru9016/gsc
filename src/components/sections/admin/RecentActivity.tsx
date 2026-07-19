import Link from "next/link";
import { Badge } from "@/components/shared/Badge.tsx";
import type { BookingInquiry, ContactInquiry } from "@/lib/db/schema.ts";
import type { EventListItem } from "@/lib/sanity/queries.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

interface RecentActivityProps {
  bookings: BookingInquiry[];
  contacts: ContactInquiry[];
  events: EventListItem[];
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ActivityRow {
  date: string;
  href: string;
  key: string;
  status: string;
  title: string;
}

function ActivityColumn({
  title,
  rows,
  emptyLabel,
}: {
  emptyLabel: string;
  rows: ActivityRow[];
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
      <h3 className="mb-4 font-body font-semibold text-(--color-text-primary)">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-(--color-text-secondary) text-sm">{emptyLabel}</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              className="flex items-start justify-between gap-3 border-(--color-border) border-b pb-3 last:border-0 last:pb-0"
              key={row.key}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-(--color-text-primary) text-sm">
                  {row.title}
                </p>
                <p className="mt-0.5 text-(--color-text-secondary) text-xs">
                  {row.date}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <Badge size="sm" variant={getStatusBadgeVariant(row.status)}>
                  {row.status}
                </Badge>
                <Link
                  className="text-primary text-xs transition-colors duration-200 hover:text-primary-hover"
                  href={row.href}
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RecentActivity({
  bookings,
  contacts,
  events,
}: RecentActivityProps) {
  const bookingRows: ActivityRow[] = bookings.map((booking) => ({
    date: formatDate(booking.createdAt),
    href: "/admin/submissions/bookings",
    key: booking.id,
    status: booking.status,
    title: `${booking.name} — ${booking.bookingType}`,
  }));

  const contactRows: ActivityRow[] = contacts.map((contact) => ({
    date: formatDate(contact.createdAt),
    href: "/admin/submissions/contacts",
    key: contact.id,
    status: contact.status,
    title: `${contact.name} — ${contact.subject}`,
  }));

  const eventRows: ActivityRow[] = events.map((event) => ({
    date: formatDate(event.startDate),
    href: `/admin/content/events/${event.slug}`,
    key: event._id,
    status: event.status,
    title: event.title,
  }));

  return (
    <section className="space-y-4">
      <h2 className="font-display font-semibold text-xl">Recent Activity</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ActivityColumn
          emptyLabel="No bookings yet."
          rows={bookingRows}
          title="Latest Bookings"
        />
        <ActivityColumn
          emptyLabel="No contacts yet."
          rows={contactRows}
          title="Latest Contacts"
        />
        <ActivityColumn
          emptyLabel="No events yet."
          rows={eventRows}
          title="Latest Events"
        />
      </div>
    </section>
  );
}
