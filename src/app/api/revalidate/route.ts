import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

const TAG_MAP: Record<string, string> = {
  achievement: "achievements",
  annualReport: "annual-reports",
  banquetHall: "banquets",
  bookingConfig: "booking-config",
  committeeMember: "committee",
  diningVenue: "dining",
  download: "downloads",
  event: "events",
  leaguesConfig: "leagues",
  legalPage: "legal",
  membershipConfig: "membership-config",
  membershipType: "membership",
  milestone: "milestones",
  partnershipOpportunity: "partners",
  siteConfig: "site-config",
  sport: "sports",
  teamSpiritEdition: "team-spirit",
};

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (!(signature && secret)) {
      return Response.json(
        { error: "Missing signature or secret" },
        { status: 401 }
      );
    }

    // Read raw body before JSON.parse — HMAC is computed on raw bytes
    const body = await request.text();

    const isValid = await isValidSignature(body, signature, secret);
    if (!isValid) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: unknown = JSON.parse(body);
    const documentType =
      typeof payload === "object" && payload !== null && "_type" in payload
        ? (payload as { _type: unknown })._type
        : undefined;

    const tag =
      typeof documentType === "string" ? TAG_MAP[documentType] : undefined;
    if (tag) {
      // Next.js 16 requires a cache profile arg — "max" performs the same
      // full immediate revalidation the single-arg call used to do.
      revalidateTag(tag, "max");
      return Response.json({ revalidated: true, tag }, { status: 200 });
    }

    return Response.json(
      { reason: "Unknown document type", revalidated: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("[revalidate] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
