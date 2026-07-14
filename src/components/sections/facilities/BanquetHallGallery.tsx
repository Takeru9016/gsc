import Image from "next/image";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { SanityImageSource } from "@/lib/sanity/image.ts";
import { urlFor } from "@/lib/sanity/image.ts";

interface BanquetHallGalleryProps {
  gallery: SanityImageSource[];
  hallName: string;
}

const PLACEHOLDER_KEYS = [
  "placeholder-1",
  "placeholder-2",
  "placeholder-3",
  "placeholder-4",
];

function galleryImageKey(image: SanityImageSource, fallback: string): string {
  if (typeof image === "object" && image !== null && "asset" in image) {
    const { asset } = image as { asset?: { _id?: string; _ref?: string } };
    if (asset?._ref) {
      return asset._ref;
    }
    if (asset?._id) {
      return asset._id;
    }
  }
  return fallback;
}

export function BanquetHallGallery({
  gallery,
  hallName,
}: BanquetHallGalleryProps) {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {gallery.length > 0
          ? gallery.map((image, position) => (
              <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-surface-dark"
                key={galleryImageKey(image, `${hallName}-${position}`)}
              >
                <Image
                  alt={`${hallName} — venue photo`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  src={urlFor(image).width(500).height(500).url()}
                />
              </div>
            ))
          : // [PENDING_CONTENT] — hall gallery images from Sanity
            PLACEHOLDER_KEYS.map((key) => (
              <div
                className="aspect-square rounded-2xl bg-surface-dark"
                key={key}
              />
            ))}
      </div>
    </SectionWrapper>
  );
}
