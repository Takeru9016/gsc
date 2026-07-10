import type { SchemaTypeDefinition } from "sanity";
import { achievement } from "./documents/achievement.ts";
import { annualReport } from "./documents/annualReport.ts";
import { banquetHall } from "./documents/banquetHall.ts";
import { committeeMember } from "./documents/committeeMember.ts";
import { diningVenue } from "./documents/diningVenue.ts";
import { download } from "./documents/download.ts";
import { event } from "./documents/event.ts";
import { foodStall } from "./documents/foodStall.ts";
import { legalPage } from "./documents/legalPage.ts";
import { membershipType } from "./documents/membershipType.ts";
import { milestone } from "./documents/milestone.ts";
import { partnershipOpportunity } from "./documents/partnershipOpportunity.ts";
import { sport } from "./documents/sport.ts";
import { teamSpiritEdition } from "./documents/teamSpiritEdition.ts";
import { bookingConfig } from "./singletons/bookingConfig.ts";
import { leaguesConfig } from "./singletons/leaguesConfig.ts";
import { membershipConfig } from "./singletons/membershipConfig.ts";
import { siteConfig } from "./singletons/siteConfig.ts";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Singletons
    siteConfig,
    membershipConfig,
    bookingConfig,
    leaguesConfig,
    // Documents
    sport,
    committeeMember,
    milestone,
    achievement,
    event,
    banquetHall,
    diningVenue,
    foodStall,
    membershipType,
    partnershipOpportunity,
    teamSpiritEdition,
    annualReport,
    download,
    legalPage,
  ],
};
