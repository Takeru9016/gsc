import { BookingContactForm } from "@/components/sections/admin/content/BookingContactForm.tsx";
import { RoomsManager } from "@/components/sections/admin/content/RoomsManager.tsx";
import { getBookingConfig } from "@/lib/sanity/queries.ts";

export default async function AdminBookingConfigPage() {
  const config = await getBookingConfig();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-semibold text-3xl">Booking Config</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Control booking notifications and the room list shown on the public
          rooms page.
        </p>
      </div>

      <BookingContactForm
        defaultValues={{
          bookingEmail: config?.bookingEmail ?? "",
          responseTime: config?.responseTime ?? "",
        }}
      />

      <RoomsManager rooms={config?.rooms ?? []} />
    </div>
  );
}
