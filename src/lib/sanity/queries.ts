import type { PortableTextBlock } from "next-sanity";
import { client } from "@/lib/sanity/client.ts";
import type { SanityImageSource } from "@/lib/sanity/image.ts";

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface ScheduleEntry {
  closeTime: string;
  day: string;
  openTime: string;
}

// ─── siteConfig ─────────────────────────────────────────────────────────────

export interface SiteConfigSocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface CorporatePartner {
  logo: SanityImageSource | null;
  name: string;
  url: string | null;
}

export interface SiteConfig {
  address: string;
  corporatePartners: CorporatePartner[];
  email: string;
  emergencyPhone: string;
  emergencyPhone2: string;
  phone: string;
  siteName: string;
  socialLinks: SiteConfigSocialLinks;
  tagline: string;
}

// siteConfig singleton schema (sanity/schemaTypes) lands in 1A-07 — until then
// every fetch resolves null and we fall back to these placeholders.
const DEFAULT_SITE_CONFIG: SiteConfig = {
  address: "[PENDING_CONTENT]",
  corporatePartners: [],
  email: "[PENDING_CONTENT]",
  emergencyPhone: "[PENDING_CONTENT]",
  emergencyPhone2: "[PENDING_CONTENT]",
  phone: "[PENDING_CONTENT]",
  siteName: "Goregaon Sports Club",
  socialLinks: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
  },
  tagline: "Mumbai's Premier Sports Destination",
};

const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0]{
  siteName,
  tagline,
  phone,
  email,
  address,
  emergencyPhone,
  emergencyPhone2,
  socialLinks,
  corporatePartners
}`;

export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await client.fetch<Partial<SiteConfig> | null>(
    SITE_CONFIG_QUERY,
    {},
    { next: { tags: ["site-config"] } }
  );

  return {
    ...DEFAULT_SITE_CONFIG,
    ...data,
    socialLinks: {
      ...DEFAULT_SITE_CONFIG.socialLinks,
      ...data?.socialLinks,
    },
  };
}

// ─── sport ───────────────────────────────────────────────────────────────────

export interface SportListItem {
  _id: string;
  category: string;
  hasCoaching: boolean;
  heroImage: SanityImageSource | null;
  name: string;
  schedule: ScheduleEntry[];
  shortDescription: string;
  slug: string;
  threeObjectType: string;
}

export interface SportDetail extends SportListItem {
  coachingInfo: PortableTextBlock[] | null;
  coachingLevel: string | null;
  coachingSchedule: string | null;
  coachName: string | null;
  externalRegistrationUrl: string | null;
  facilityDetails: PortableTextBlock[] | null;
  fullDescription: PortableTextBlock[] | null;
  gallery: SanityImageSource[];
  metaDescription: string | null;
  metaTitle: string | null;
}

const SPORT_LIST_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  category,
  shortDescription,
  heroImage,
  hasCoaching,
  threeObjectType,
  schedule
`;

export async function getSports(): Promise<SportListItem[]> {
  return await client.fetch<SportListItem[]>(
    `*[_type == "sport"] | order(order asc) { ${SPORT_LIST_FIELDS} }`,
    {},
    { next: { tags: ["sports"] } }
  );
}

export async function getSportBySlug(
  slug: string
): Promise<SportDetail | null> {
  return await client.fetch<SportDetail | null>(
    `*[_type == "sport" && slug.current == $slug][0] {
      ${SPORT_LIST_FIELDS},
      fullDescription,
      gallery,
      coachingInfo,
      coachName,
      coachingSchedule,
      coachingLevel,
      externalRegistrationUrl,
      facilityDetails,
      metaTitle,
      metaDescription
    }`,
    { slug },
    { next: { tags: ["sports"] } }
  );
}

export interface CoachingSport extends SportListItem {
  coachingLevel: string | null;
  coachingSchedule: string | null;
  coachName: string | null;
  externalRegistrationUrl: string | null;
}

export async function getCoachingSports(): Promise<CoachingSport[]> {
  return await client.fetch<CoachingSport[]>(
    `*[_type == "sport" && hasCoaching == true] | order(order asc) {
      ${SPORT_LIST_FIELDS},
      coachName,
      coachingSchedule,
      coachingLevel,
      externalRegistrationUrl
    }`,
    {},
    { next: { tags: ["sports"] } }
  );
}

// ─── committeeMember ─────────────────────────────────────────────────────────

export interface CommitteeMember {
  _id: string;
  bio: string | null;
  designation: string;
  name: string;
  photo: SanityImageSource | null;
  role: string;
}

export async function getCommitteeMembers(): Promise<CommitteeMember[]> {
  return await client.fetch<CommitteeMember[]>(
    `*[_type == "committeeMember"] | order(order asc) {
      _id,
      name,
      designation,
      role,
      photo,
      bio
    }`,
    {},
    { next: { tags: ["committee"] } }
  );
}

// ─── milestone ───────────────────────────────────────────────────────────────

export interface Milestone {
  _id: string;
  description: string | null;
  image: SanityImageSource | null;
  title: string;
  year: number;
}

export async function getMilestones(): Promise<Milestone[]> {
  return await client.fetch<Milestone[]>(
    `*[_type == "milestone"] | order(year desc) {
      _id,
      year,
      title,
      description,
      image
    }`,
    {},
    { next: { tags: ["milestones"] } }
  );
}

// ─── achievement ─────────────────────────────────────────────────────────────

export interface Achievement {
  _id: string;
  description: string | null;
  image: SanityImageSource;
  level: string;
  memberName: string | null;
  sport: string;
  title: string;
  type: string;
  year: number;
}

export interface AchievementFilters {
  level?: string;
  sport?: string;
  type?: string;
  year?: number;
}

export async function getAchievements(
  filters?: AchievementFilters
): Promise<Achievement[]> {
  const conditions = [
    '_type == "achievement"',
    "isApproved == true",
    filters?.sport ? "sport == $sport" : null,
    filters?.level ? "level == $level" : null,
    filters?.type ? "type == $type" : null,
    filters?.year ? "year == $year" : null,
  ]
    .filter(Boolean)
    .join(" && ");

  return await client.fetch<Achievement[]>(
    `*[${conditions}] | order(year desc) {
      _id,
      title,
      sport,
      level,
      type,
      year,
      image,
      memberName,
      description
    }`,
    filters ?? {},
    { next: { tags: ["achievements"] } }
  );
}

// ─── event ───────────────────────────────────────────────────────────────────

export interface EventListItem {
  _id: string;
  description: PortableTextBlock[] | null;
  heroImage: SanityImageSource | null;
  slug: string;
  startDate: string;
  status: string;
  title: string;
  type: string;
}

export interface EventDetail extends EventListItem {
  endDate: string | null;
  metaDescription: string | null;
  metaTitle: string | null;
  registrationDeadline: string | null;
  registrationUrl: string | null;
  schedule: PortableTextBlock[] | null;
  venue: string | null;
}

const EVENT_LIST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  type,
  status,
  startDate,
  heroImage,
  description
`;

export async function getEvents(status?: string): Promise<EventListItem[]> {
  const condition = status
    ? '_type == "event" && status == $status'
    : '_type == "event"';

  return await client.fetch<EventListItem[]>(
    `*[${condition}] | order(startDate asc) { ${EVENT_LIST_FIELDS} }`,
    status ? { status } : {},
    { next: { tags: ["events"] } }
  );
}

export async function getEventBySlug(
  slug: string
): Promise<EventDetail | null> {
  return await client.fetch<EventDetail | null>(
    `*[_type == "event" && slug.current == $slug][0] {
      ${EVENT_LIST_FIELDS},
      endDate,
      venue,
      schedule,
      registrationUrl,
      registrationDeadline,
      metaTitle,
      metaDescription
    }`,
    { slug },
    { next: { tags: ["events"] } }
  );
}

export async function getRelatedEvents(
  type: string,
  excludeSlug: string
): Promise<EventListItem[]> {
  return await client.fetch<EventListItem[]>(
    `*[_type == "event" && type == $type && slug.current != $excludeSlug] | order(startDate asc) [0...3] { ${EVENT_LIST_FIELDS} }`,
    { excludeSlug, type },
    { next: { tags: ["events"] } }
  );
}

// ─── banquetHall ─────────────────────────────────────────────────────────────

export interface BanquetHallListItem {
  _id: string;
  capacity: number | null;
  heroImage: SanityImageSource | null;
  name: string;
  slug: string;
  tagline: string | null;
}

export interface BanquetHallDetail extends BanquetHallListItem {
  amenities: PortableTextBlock[] | null;
  description: PortableTextBlock[] | null;
  floorPlanImage: SanityImageSource | null;
  gallery: SanityImageSource[];
  metaDescription: string | null;
  metaTitle: string | null;
  setupOptions: string[];
}

const BANQUET_HALL_LIST_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  tagline,
  capacity,
  heroImage
`;

export async function getBanquetHalls(): Promise<BanquetHallListItem[]> {
  return await client.fetch<BanquetHallListItem[]>(
    `*[_type == "banquetHall"] { ${BANQUET_HALL_LIST_FIELDS} }`,
    {},
    { next: { tags: ["banquets"] } }
  );
}

export async function getBanquetHallBySlug(
  slug: string
): Promise<BanquetHallDetail | null> {
  return await client.fetch<BanquetHallDetail | null>(
    `*[_type == "banquetHall" && slug.current == $slug][0] {
      ${BANQUET_HALL_LIST_FIELDS},
      "setupOptions": coalesce(setupOptions, []),
      amenities,
      "gallery": coalesce(gallery, []),
      description,
      floorPlanImage,
      metaTitle,
      metaDescription
    }`,
    { slug },
    { next: { tags: ["banquets"] } }
  );
}

// ─── diningVenue ─────────────────────────────────────────────────────────────

export interface DiningVenueListItem {
  _id: string;
  ageRestriction: number | null;
  cuisineType: string | null;
  hasBar: boolean;
  heroImage: SanityImageSource | null;
  name: string;
  slug: string;
  tagline: string | null;
  type: string;
}

export interface OpeningHoursEntry {
  day: string;
  hours: string;
}

export interface DiningVenueDetail extends DiningVenueListItem {
  barMenuPdf: string | null;
  description: PortableTextBlock[] | null;
  gallery: SanityImageSource[];
  menuPdf: string | null;
  metaDescription: string | null;
  metaTitle: string | null;
  openingHours: OpeningHoursEntry[];
  reservationInfo: string | null;
  seatingCapacity: number | null;
}

const DINING_VENUE_LIST_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  tagline,
  type,
  hasBar,
  ageRestriction,
  cuisineType,
  heroImage
`;

export async function getDiningVenues(): Promise<DiningVenueListItem[]> {
  return await client.fetch<DiningVenueListItem[]>(
    `*[_type == "diningVenue"] { ${DINING_VENUE_LIST_FIELDS} }`,
    {},
    { next: { tags: ["dining"] } }
  );
}

export async function getDiningVenueBySlug(
  slug: string
): Promise<DiningVenueDetail | null> {
  return await client.fetch<DiningVenueDetail | null>(
    `*[_type == "diningVenue" && slug.current == $slug][0] {
      ${DINING_VENUE_LIST_FIELDS},
      description,
      "menuPdf": menuPdf.asset->url,
      "barMenuPdf": barMenuPdf.asset->url,
      gallery,
      openingHours,
      seatingCapacity,
      reservationInfo,
      metaTitle,
      metaDescription
    }`,
    { slug },
    { next: { tags: ["dining"] } }
  );
}

// ─── bookingConfig ───────────────────────────────────────────────────────────

export interface BookingConfigRoom {
  capacity: number | null;
  name: string;
  type: string | null;
}

export interface BookingConfig {
  bookingEmail: string | null;
  responseTime: string | null;
  rooms: BookingConfigRoom[];
}

export async function getBookingConfig(): Promise<BookingConfig | null> {
  return await client.fetch<BookingConfig | null>(
    `*[_type == "bookingConfig"][0] {
      bookingEmail,
      responseTime,
      rooms
    }`,
    {},
    { next: { tags: ["booking-config"] } }
  );
}

// ─── membershipType ──────────────────────────────────────────────────────────

export interface MembershipTypeListItem {
  _id: string;
  benefits: PortableTextBlock[] | null;
  eligibility: PortableTextBlock[] | null;
  isActive: boolean;
  slug: string;
  tagline: string | null;
  title: string;
  type: string;
}

export interface MembershipTypeDetail extends MembershipTypeListItem {
  feeStructure: PortableTextBlock[] | null;
}

const MEMBERSHIP_TYPE_LIST_FIELDS = `
  _id,
  type,
  "slug": slug.current,
  title,
  tagline,
  isActive,
  eligibility,
  benefits
`;

export async function getMembershipTypes(): Promise<MembershipTypeListItem[]> {
  return await client.fetch<MembershipTypeListItem[]>(
    `*[_type == "membershipType"] | order(order asc) { ${MEMBERSHIP_TYPE_LIST_FIELDS} }`,
    {},
    { next: { tags: ["membership"] } }
  );
}

export async function getMembershipTypeBySlug(
  slug: string
): Promise<MembershipTypeDetail | null> {
  return await client.fetch<MembershipTypeDetail | null>(
    `*[_type == "membershipType" && slug.current == $slug][0] {
      ${MEMBERSHIP_TYPE_LIST_FIELDS},
      feeStructure
    }`,
    { slug },
    { next: { tags: ["membership"] } }
  );
}

// ─── membershipConfig ────────────────────────────────────────────────────────

export interface AffiliatedClub {
  location: string;
  logo: SanityImageSource | null;
  name: string;
  reciprocalBenefits: string | null;
}

export interface MembershipConfig {
  affiliatedClubs: AffiliatedClub[];
  enrollmentNotice: string | null;
  enrollmentOpen: boolean;
}

export async function getMembershipConfig(): Promise<MembershipConfig | null> {
  return await client.fetch<MembershipConfig | null>(
    `*[_type == "membershipConfig"][0] {
      enrollmentOpen,
      enrollmentNotice,
      affiliatedClubs
    }`,
    {},
    { next: { tags: ["membership-config"] } }
  );
}

// ─── partnershipOpportunity ──────────────────────────────────────────────────

export interface PartnershipOpportunity {
  _id: string;
  benefits: string[];
  description: PortableTextBlock[] | null;
  isHighlighted: boolean;
  reachStats: string | null;
  title: string;
}

export async function getPartnershipOpportunities(): Promise<
  PartnershipOpportunity[]
> {
  return await client.fetch<PartnershipOpportunity[]>(
    `*[_type == "partnershipOpportunity"] | order(order asc) {
      _id,
      title,
      description,
      reachStats,
      benefits,
      isHighlighted
    }`,
    {},
    { next: { tags: ["partners"] } }
  );
}

// ─── teamSpiritEdition ───────────────────────────────────────────────────────

export interface TeamSpiritEdition {
  _id: string;
  adSpecs: PortableTextBlock[] | null;
  coverImage: SanityImageSource | null;
  description: string | null;
  edition: string;
  editionName: string;
  pdfFile: string | null;
  publicationDate: string | null;
  year: number;
}

export async function getTeamSpiritEditions(): Promise<TeamSpiritEdition[]> {
  return await client.fetch<TeamSpiritEdition[]>(
    `*[_type == "teamSpiritEdition"] | order(publicationDate desc) {
      _id,
      editionName,
      edition,
      year,
      coverImage,
      description,
      publicationDate,
      "pdfFile": pdfFile.asset->url,
      adSpecs
    }`,
    {},
    { next: { tags: ["team-spirit"] } }
  );
}

// ─── annualReport ────────────────────────────────────────────────────────────

export interface AnnualReport {
  _id: string;
  coverImage: SanityImageSource | null;
  pdfFile: string;
  publishedDate: string | null;
  title: string;
  year: string;
}

export async function getAnnualReports(): Promise<AnnualReport[]> {
  return await client.fetch<AnnualReport[]>(
    `*[_type == "annualReport"] | order(publishedDate desc) {
      _id,
      title,
      year,
      coverImage,
      "pdfFile": pdfFile.asset->url,
      publishedDate
    }`,
    {},
    { next: { tags: ["annual-reports"] } }
  );
}

// ─── download ────────────────────────────────────────────────────────────────

export interface Download {
  _id: string;
  category: string;
  file: string;
  fileSize: string | null;
  publishedDate: string;
  title: string;
}

export async function getDownloads(category?: string): Promise<Download[]> {
  const condition = category
    ? '_type == "download" && isActive == true && category == $category'
    : '_type == "download" && isActive == true';

  return await client.fetch<Download[]>(
    `*[${condition}] | order(publishedDate desc) {
      _id,
      title,
      category,
      "file": file.asset->url,
      fileSize,
      publishedDate
    }`,
    category ? { category } : {},
    { next: { tags: ["downloads"] } }
  );
}

// ─── legalPage ───────────────────────────────────────────────────────────────

export interface LegalPage {
  _id: string;
  content: PortableTextBlock[] | null;
  lastUpdated: string | null;
  metaDescription: string | null;
  metaTitle: string | null;
  slug: string;
  title: string;
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  return await client.fetch<LegalPage | null>(
    `*[_type == "legalPage" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      content,
      lastUpdated,
      metaTitle,
      metaDescription
    }`,
    { slug },
    { next: { tags: ["legal"] } }
  );
}

// ─── leaguesConfig ───────────────────────────────────────────────────────────

export interface League {
  approximateDates: string | null;
  description: string | null;
  format: string;
  frequency: string;
  isActive: boolean;
  name: string;
  sport: string;
}

export interface LeaguesConfig {
  leagues: League[];
}

export async function getLeaguesConfig(): Promise<LeaguesConfig | null> {
  return await client.fetch<LeaguesConfig | null>(
    `*[_type == "leaguesConfig"][0] {
      leagues
    }`,
    {},
    { next: { tags: ["leagues"] } }
  );
}
