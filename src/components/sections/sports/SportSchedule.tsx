import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { ScheduleEntry } from "@/lib/sanity/queries.ts";

interface SportScheduleProps {
  schedule: ScheduleEntry[];
}

export function SportSchedule({ schedule }: SportScheduleProps) {
  return (
    <SectionWrapper className="pt-0">
      <AnimatedText
        as="h2"
        className="mb-8 font-display text-(--color-text-primary) text-3xl md:text-4xl"
      >
        Schedule &amp; Timings
      </AnimatedText>
      {schedule.length > 0 ? (
        <div className="max-w-2xl overflow-hidden rounded-2xl border border-(--color-border)">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-(--color-surface)">
                <th className="px-6 py-3 font-body font-semibold text-(--color-text-primary) text-sm">
                  Day
                </th>
                <th className="px-6 py-3 font-body font-semibold text-(--color-text-primary) text-sm">
                  Open
                </th>
                <th className="px-6 py-3 font-body font-semibold text-(--color-text-primary) text-sm">
                  Close
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((entry) => (
                <tr
                  className="border-(--color-border) border-t"
                  key={entry.day}
                >
                  <td className="px-6 py-3 text-(--color-text-primary) text-sm">
                    {entry.day}
                  </td>
                  <td className="px-6 py-3 text-(--color-text-secondary) text-sm">
                    {entry.openTime}
                  </td>
                  <td className="px-6 py-3 text-(--color-text-secondary) text-sm">
                    {entry.closeTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-(--color-text-secondary)">
          Contact us for current timings.
        </p>
      )}
    </SectionWrapper>
  );
}
