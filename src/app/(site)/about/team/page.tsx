import type { Metadata } from "next";
import { CommitteeGrid } from "@/components/sections/about/CommitteeGrid.tsx";
import { RoleFilter } from "@/components/sections/about/RoleFilter.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getCommitteeMembers } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "The people who lead GSC forward.",
    title: "Committee | About | Goregaon Sports Club",
  };
}

interface TeamPageProps {
  searchParams: Promise<{ role?: string }>;
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const [members, resolvedSearchParams] = await Promise.all([
    getCommitteeMembers(),
    searchParams,
  ]);
  const activeRole = resolvedSearchParams.role ?? "";

  return (
    <>
      <PageHero
        headline="Club Committee"
        subline="The people who lead GSC forward."
      />
      <SectionWrapper>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <RoleFilter />
        </div>
        <CommitteeGrid activeRole={activeRole} members={members} />
      </SectionWrapper>
    </>
  );
}
