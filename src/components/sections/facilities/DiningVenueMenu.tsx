import { PDFViewerLazy } from "@/components/shared/PDFViewerLazy.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface DiningVenueMenuProps {
  barMenuPdf: string | null;
  hasBar: boolean;
  menuPdf: string | null;
}

export function DiningVenueMenu({
  menuPdf,
  hasBar,
  barMenuPdf,
}: DiningVenueMenuProps) {
  return (
    <SectionWrapper className="pt-0">
      <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
        Menu
      </h2>
      <div className="mt-6 flex flex-col gap-8">
        {menuPdf ? (
          <PDFViewerLazy title="Food Menu" url={menuPdf} />
        ) : (
          <p className="text-(--color-text-secondary)">
            Menu available at the venue.
          </p>
        )}
        {hasBar && barMenuPdf ? (
          <PDFViewerLazy title="Bar Menu" url={barMenuPdf} />
        ) : null}
      </div>
    </SectionWrapper>
  );
}
