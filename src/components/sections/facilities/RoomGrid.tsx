import { Users } from "lucide-react";
import { Badge } from "@/components/shared/Badge.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { BookingConfigRoom } from "@/lib/sanity/queries.ts";

interface RoomGridProps {
  rooms: BookingConfigRoom[];
}

// [PENDING_CONTENT] — Room types, counts, and amenities from manager
const ROOMS_FALLBACK: BookingConfigRoom[] = [
  { capacity: null, name: "Standard Room", type: "Standard" },
  { capacity: null, name: "Deluxe Room", type: "Deluxe" },
  { capacity: null, name: "Suite", type: "Suite" },
];

const AMENITIES_PLACEHOLDER = ["[PENDING_CONTENT] — Amenities list"];

function RoomCard({ room }: { room: BookingConfigRoom }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8">
      {/* [PENDING_CONTENT] — Replace with actual Sanity room image */}
      <div className="aspect-video rounded-2xl bg-surface-dark" />
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
          {room.name}
        </h3>
        {room.capacity ? (
          <Badge className="shrink-0" variant="outline">
            <Users aria-hidden="true" className="mr-1" size={14} />
            Up to {room.capacity}
          </Badge>
        ) : null}
      </div>
      <ul className="list-inside list-disc space-y-1 text-(--color-text-secondary) text-sm">
        {AMENITIES_PLACEHOLDER.map((amenity) => (
          <li key={amenity}>{amenity}</li>
        ))}
      </ul>
    </div>
  );
}

export function RoomGrid({ rooms }: RoomGridProps) {
  const displayRooms = rooms.length > 0 ? rooms : ROOMS_FALLBACK;

  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {displayRooms.map((room) => (
          <RoomCard key={room.name} room={room} />
        ))}
      </div>
    </SectionWrapper>
  );
}
