import Image from "next/image";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { AffiliatedClub } from "@/lib/sanity/queries.ts";

interface AffiliatedClubsListProps {
  clubs: AffiliatedClub[];
}

// [PENDING_CONTENT] — real affiliated clubs from Sanity membershipConfig
const DUMMY_CLUBS: AffiliatedClub[] = [
  {
    location: "[PENDING_CONTENT]",
    logo: null,
    name: "[PENDING_CONTENT] — Affiliated Club 1",
    reciprocalBenefits: "[PENDING_CONTENT] — Reciprocal benefits.",
  },
  {
    location: "[PENDING_CONTENT]",
    logo: null,
    name: "[PENDING_CONTENT] — Affiliated Club 2",
    reciprocalBenefits: "[PENDING_CONTENT] — Reciprocal benefits.",
  },
  {
    location: "[PENDING_CONTENT]",
    logo: null,
    name: "[PENDING_CONTENT] — Affiliated Club 3",
    reciprocalBenefits: "[PENDING_CONTENT] — Reciprocal benefits.",
  },
];

function AffiliatedClubCard({ club }: { club: AffiliatedClub }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8">
      {club.logo ? (
        <Image
          alt={club.name}
          className="h-12 w-auto object-contain"
          height={48}
          src={urlFor(club.logo).height(96).url()}
          width={120}
        />
      ) : null}
      <div>
        <h3 className="font-body font-semibold text-(--color-text-primary) text-xl">
          {club.name}
        </h3>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          {club.location}
        </p>
      </div>
      <p className="text-(--color-text-secondary)">
        {club.reciprocalBenefits ?? "[PENDING_CONTENT] — Reciprocal benefits."}
      </p>
    </div>
  );
}

export function AffiliatedClubsList({ clubs }: AffiliatedClubsListProps) {
  const displayClubs = clubs.length > 0 ? clubs : DUMMY_CLUBS;

  return (
    <SectionWrapper className="pt-0">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {displayClubs.map((club) => (
          <AffiliatedClubCard club={club} key={club.name} />
        ))}
      </div>
    </SectionWrapper>
  );
}
