export interface MembershipTypeFallback {
  slug: string;
  tagline: string;
  title: string;
  type: string;
}

// The 5 membership types (GSC.md § Key Data Decisions — all currently
// interestOnly). Used as placeholder cards until the matching
// `membershipType` document exists in Sanity for a given type.
export const MEMBERSHIP_TYPES_FALLBACK: MembershipTypeFallback[] = [
  {
    slug: "life",
    tagline: "Primary membership tier — lifetime access to GSC facilities.",
    title: "Life Membership",
    type: "life",
  },
  {
    slug: "corporate",
    tagline: "Corporate entity membership for organizations.",
    title: "Corporate Membership",
    type: "corporate",
  },
  {
    slug: "ward",
    tagline: "Ward-level membership for eligible dependents.",
    title: "Ward Membership",
    type: "ward",
  },
  {
    slug: "service",
    tagline: "Service membership tier.",
    title: "Service Membership",
    type: "service",
  },
  {
    slug: "yearly",
    tagline:
      "Available to children and parents of Life Members, and senior citizens 65 years and above.",
    title: "Yearly Membership",
    type: "yearly",
  },
];
