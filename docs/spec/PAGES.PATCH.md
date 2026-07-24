# GSC — PAGES Patch
# Additions to docs/spec/PAGES.md. Do not modify PAGES.md itself.
# Covers: Food Court stalls rendering + food stalls section spec.

---

## Patch 1 — Food Court Stalls (addition to Dining Venue template)

This section applies ONLY to the `/facilities/dining/food-court` slug.
Add this section to the Dining Venue page template in PAGES.md after "About" and before "Menu":

**Page**: `/facilities/dining/food-court`
**Extra data**: Also fetch `getFoodStalls()` with ISR tag `food-stalls`

### Additional Section — Food Stalls Grid
Render between "About" and "Gallery" sections, only when `slug === 'food-court'`.

```
Heading: "What's Inside"
Subline: "Multiple cuisines from our resident stalls."

Grid: 3-col (lg) / 2-col (md) / 1-col (sm)
Each stall card:
  - image (urlFor) or grey placeholder if no image
  - Stall name (Heading S)
  - cuisineType (Body S, muted)
  - isVeg badge: green "Veg" or red "Non-Veg"

If no foodStall documents in Sanity yet:
  Show [PENDING_CONTENT] note: "Stall listings coming soon."
  Do not show empty grid.
```

---

## Patch 2 — /about/bye-laws (clarification to existing spec)

The existing PAGES.md § Bye-Laws spec says "bye-laws PDF. Cloudinary-hosted."
Clarify the data source:

PDF source: `aboutPage.byeLawsPdfUrl` from Sanity (fetched via `getAboutPage()`)
Last updated: `aboutPage.byeLawsUpdatedAt` — show as "Last updated: [date]" below viewer

States:
- `byeLawsPdfUrl` is set → render PDFViewer + Download button + last updated date
- `byeLawsPdfUrl` is null → show placeholder card: "Bye-laws document being prepared. Contact us for a copy." + CTA → /contact

---

## Patch 3 — /about (clarification to existing spec)

The existing PAGES.md § About spec says "Text from Sanity `aboutPage` singleton."
Clarify the data source:

Data fetch: `getAboutPage()` with ISR tag `about-page`
Fields used:
- `aboutPage.historyText` (portableText) → rendered by PortableTextRenderer in History & Legacy section
- `aboutPage.historyImage` (image) → urlFor() in right column of History & Legacy

Null states:
- `historyText` null → show [PENDING_CONTENT] paragraph placeholder
- `historyImage` null → show grey aspect-ratio placeholder div
