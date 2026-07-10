import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BanquetHallBookingCTA } from "@/components/sections/facilities/BanquetHallBookingCTA.tsx";
import { BanquetHallDetails } from "@/components/sections/facilities/BanquetHallDetails.tsx";
import { BanquetHallGallery } from "@/components/sections/facilities/BanquetHallGallery.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getBanquetHallBySlug } from "@/lib/sanity/queries.ts";

interface BanquetHallPageProps {
  params: Promise<{ hall: string }>;
}

const HALL_SLUGS = ["regal", "rhythm", "glamourra"];

export function generateStaticParams() {
  return HALL_SLUGS.map((hall) => ({ hall }));
}

export async function generateMetadata({
  params,
}: BanquetHallPageProps): Promise<Metadata> {
  const { hall } = await params;
  const banquetHall = await getBanquetHallBySlug(hall);

  if (!banquetHall) {
    return { title: "Hall Not Found | Goregaon Sports Club" };
  }

  return {
    description:
      banquetHall.metaDescription ??
      banquetHall.tagline ??
      "3 premium event venues for every occasion.",
    title:
      banquetHall.metaTitle ?? `${banquetHall.name} | Goregaon Sports Club`,
  };
}

export default async function BanquetHallPage({
  params,
}: BanquetHallPageProps) {
  const { hall } = await params;
  const banquetHall = await getBanquetHallBySlug(hall);

  if (!banquetHall) {
    notFound();
  }

  return (
    <>
      <PageHero
        badge={
          banquetHall.capacity
            ? `Up to ${banquetHall.capacity} guests`
            : "[PENDING_CONTENT] — capacity"
        }
        headline={banquetHall.name}
        image={banquetHall.heroImage ?? undefined}
        subline={banquetHall.tagline ?? undefined}
      />
      <BanquetHallGallery
        gallery={banquetHall.gallery}
        hallName={banquetHall.name}
      />
      <BanquetHallDetails
        amenities={banquetHall.amenities}
        floorPlanImage={banquetHall.floorPlanImage}
        hallName={banquetHall.name}
        setupOptions={banquetHall.setupOptions}
      />
      <BanquetHallBookingCTA
        hallName={banquetHall.name}
        hallSlug={banquetHall.slug}
      />
    </>
  );
}
