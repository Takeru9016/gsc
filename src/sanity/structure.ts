import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = [
  "siteConfig",
  "membershipConfig",
  "bookingConfig",
  "leaguesConfig",
];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Config")
        .id("siteConfig")
        .child(S.document().schemaType("siteConfig").documentId("siteConfig")),
      S.listItem()
        .title("Membership Config")
        .id("membershipConfig")
        .child(
          S.document()
            .schemaType("membershipConfig")
            .documentId("membershipConfig")
        ),
      S.listItem()
        .title("Booking Config")
        .id("bookingConfig")
        .child(
          S.document().schemaType("bookingConfig").documentId("bookingConfig")
        ),
      S.listItem()
        .title("Leagues Config")
        .id("leaguesConfig")
        .child(
          S.document().schemaType("leaguesConfig").documentId("leaguesConfig")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.includes(item.getId() ?? "")
      ),
    ]);
