type DiningVenueBadgeVariant = "green" | "red" | "gold";

interface DiningVenueTypeMeta {
  label: string;
  variant: DiningVenueBadgeVariant;
}

// Mirrors the `diningVenue.type` free-text field (docs/spec/SCHEMA.md) — Veg
// maps to green, NonVeg to red, Mixed (Food Court) to gold.
const DINING_VENUE_TYPES: Record<string, DiningVenueTypeMeta> = {
  Mixed: { label: "Mixed", variant: "gold" },
  NonVeg: { label: "Non-Veg", variant: "red" },
  Veg: { label: "Veg", variant: "green" },
};

export function getDiningVenueTypeMeta(type: string): DiningVenueTypeMeta {
  return DINING_VENUE_TYPES[type] ?? { label: type, variant: "gold" };
}
