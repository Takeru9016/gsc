import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { OpeningHoursEntry } from "@/lib/sanity/queries.ts";

interface DiningVenueHoursProps {
  openingHours: OpeningHoursEntry[];
  reservationInfo: string | null;
}

export function DiningVenueHours({
  openingHours,
  reservationInfo,
}: DiningVenueHoursProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
            Hours
          </h2>
          {openingHours.length > 0 ? (
            <table className="mt-4 w-full border-collapse text-sm">
              <tbody>
                {openingHours.map((entry) => (
                  <tr
                    className="border-(--color-border) border-b last:border-b-0"
                    key={entry.day}
                  >
                    <td className="py-3 pr-4 font-medium text-(--color-text-primary)">
                      {entry.day}
                    </td>
                    <td className="py-3 text-(--color-text-secondary)">
                      {entry.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // [PENDING_CONTENT] — opening hours from manager
            <p className="mt-4 text-(--color-text-secondary)">
              [PENDING_CONTENT] — Opening hours.
            </p>
          )}
        </div>
        <div>
          <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
            Reservations
          </h2>
          <p className="mt-4 text-(--color-text-secondary)">
            {reservationInfo ??
              "[PENDING_CONTENT] — Reservation info from manager."}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
