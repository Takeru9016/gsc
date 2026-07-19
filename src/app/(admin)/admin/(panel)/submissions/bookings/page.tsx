import { BookingsTable } from "@/components/sections/admin/submissions/BookingsTable.tsx";
import { getAllBookings } from "@/lib/db/adminQueries.ts";

export default async function AdminBookingSubmissionsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Booking Submissions
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Room, banquet, ground, and coaching inquiries.
        </p>
      </div>
      <BookingsTable bookings={bookings} />
    </div>
  );
}
