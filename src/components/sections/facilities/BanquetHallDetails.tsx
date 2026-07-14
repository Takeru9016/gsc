import Image from "next/image";
import type { PortableTextBlock } from "next-sanity";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { SanityImageSource } from "@/lib/sanity/image.ts";
import { urlFor } from "@/lib/sanity/image.ts";

interface BanquetHallDetailsProps {
  amenities: PortableTextBlock[] | null;
  floorPlanImage: SanityImageSource | null;
  hallName: string;
  setupOptions: string[];
}

export function BanquetHallDetails({
  amenities,
  floorPlanImage,
  hallName,
  setupOptions,
}: BanquetHallDetailsProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
            Amenities
          </h2>
          {amenities && amenities.length > 0 ? (
            <PortableTextRenderer className="mt-4" value={amenities} />
          ) : (
            // [PENDING_CONTENT] — amenities and AV equipment list from manager
            <p className="mt-4 text-(--color-text-secondary)">
              [PENDING_CONTENT] — Amenities and AV equipment details.
            </p>
          )}
        </div>
        <div>
          <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
            Setup Options
          </h2>
          {setupOptions.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {setupOptions.map((option) => (
                <li
                  className="rounded-full border border-(--color-border) px-4 py-2 text-(--color-text-secondary) text-sm"
                  key={option}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            // [PENDING_CONTENT] — setup options from manager
            <p className="mt-4 text-(--color-text-secondary)">
              [PENDING_CONTENT] — Setup options.
            </p>
          )}
          {floorPlanImage ? (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-surface-dark">
              <Image
                alt={`${hallName} floor plan`}
                className="object-contain"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={urlFor(floorPlanImage).width(800).height(450).url()}
              />
            </div>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  );
}
