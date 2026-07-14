import { Download } from "lucide-react";
import Image from "next/image";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { TeamSpiritEdition } from "@/lib/sanity/queries.ts";

interface TeamSpiritEditionsGridProps {
  editions: TeamSpiritEdition[];
}

const EDITION_LABELS: Record<string, string> = {
  Diwali: "Diwali",
  NewYear: "New Year",
  Summer: "Summer",
};

// [PENDING_CONTENT] — shown until teamSpiritEdition documents exist in Sanity.
const PLACEHOLDER_EDITIONS: TeamSpiritEdition[] = [
  {
    _id: "placeholder-summer",
    adSpecs: null,
    coverImage: null,
    description: null,
    edition: "Summer",
    editionName: "Summer Edition",
    pdfFile: null,
    publicationDate: null,
    year: 0,
  },
  {
    _id: "placeholder-diwali",
    adSpecs: null,
    coverImage: null,
    description: null,
    edition: "Diwali",
    editionName: "Diwali Edition",
    pdfFile: null,
    publicationDate: null,
    year: 0,
  },
  {
    _id: "placeholder-new-year",
    adSpecs: null,
    coverImage: null,
    description: null,
    edition: "NewYear",
    editionName: "New Year Edition",
    pdfFile: null,
    publicationDate: null,
    year: 0,
  },
];

function formatPublicationDate(publicationDate: string | null): string | null {
  if (!publicationDate) {
    return null;
  }

  return new Date(publicationDate).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function EditionCard({ edition }: { edition: TeamSpiritEdition }) {
  const formattedDate = formatPublicationDate(edition.publicationDate);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8">
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-surface-dark">
        {edition.coverImage ? (
          <Image
            alt={edition.editionName}
            className="object-cover"
            fill
            src={urlFor(edition.coverImage).width(600).height(800).url()}
          />
        ) : (
          // [PENDING_CONTENT] — edition cover image from Sanity
          <div className="absolute inset-0 bg-surface-dark" />
        )}
      </div>
      <Badge className="mt-4 self-start" variant="gold">
        {EDITION_LABELS[edition.edition] ?? edition.edition}
      </Badge>
      <h3 className="mt-3 font-body font-semibold text-(--color-text-primary) text-2xl">
        {edition.editionName}
      </h3>
      <p className="mt-1 text-(--color-text-secondary) text-sm">
        {formattedDate ?? "[PENDING_CONTENT] — publication date"}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {edition.pdfFile ? (
          <>
            <Button external href={edition.pdfFile} variant="secondary">
              View Edition
            </Button>
            <Button download href={edition.pdfFile}>
              <Download aria-hidden="true" size={16} />
              Download
            </Button>
          </>
        ) : (
          <Badge variant="outline">Coming Soon</Badge>
        )}
      </div>
    </div>
  );
}

export function TeamSpiritEditionsGrid({
  editions,
}: TeamSpiritEditionsGridProps) {
  const displayEditions = editions.length > 0 ? editions : PLACEHOLDER_EDITIONS;

  return (
    <SectionWrapper className="bg-(--color-surface)">
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Editions
        </AnimatedText>
        <p className="mt-3 max-w-2xl text-(--color-text-secondary)">
          Browse and download every edition of Team Spirit.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
        {displayEditions.map((edition) => (
          <EditionCard edition={edition} key={edition._id} />
        ))}
      </div>
    </SectionWrapper>
  );
}
