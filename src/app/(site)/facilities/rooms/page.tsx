import type { Metadata } from "next";
import { RoomBookingCTA } from "@/components/sections/facilities/RoomBookingCTA.tsx";
import { RoomGrid } from "@/components/sections/facilities/RoomGrid.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getBookingConfig } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "18 comfortable rooms for members and guests.",
    title: "Rooms | Facilities | Goregaon Sports Club",
  };
}

export default async function RoomsPage() {
  const bookingConfig = await getBookingConfig();

  return (
    <>
      <PageHero
        headline="Guest Rooms"
        subline="18 comfortable rooms for members and guests."
      />
      <RoomGrid rooms={bookingConfig?.rooms ?? []} />
      <RoomBookingCTA />
    </>
  );
}
