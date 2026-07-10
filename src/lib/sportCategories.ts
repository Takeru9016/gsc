export interface SportCategoryMeta {
  anchorId: string;
  label: string;
  value: string;
}

// Mirrors the `sport.category` enum (sanity/schemaTypes/documents/sport.ts)
// and the Navbar SPORTS dropdown anchors (/sports#<anchorId>) — keep all
// three in sync if categories ever change.
export const SPORT_CATEGORIES: SportCategoryMeta[] = [
  { anchorId: "outdoor", label: "Outdoor", value: "outdoor" },
  { anchorId: "indoor", label: "Indoor", value: "indoor" },
  { anchorId: "aquatic", label: "Aquatic", value: "aquatic" },
  { anchorId: "health-fitness", label: "Health & Fitness", value: "health" },
  { anchorId: "track", label: "Track", value: "track" },
];

export function getSportCategoryLabel(value: string): string {
  return (
    SPORT_CATEGORIES.find((category) => category.value === value)?.label ??
    value
  );
}
