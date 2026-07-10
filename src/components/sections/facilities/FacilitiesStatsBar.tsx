import { StatCounter } from "@/components/shared/StatCounter.tsx";

const STATS = [
  { label: "Banquet Halls", suffix: "", value: 3 },
  { label: "Dining Venues", suffix: "", value: 6 },
  { label: "Guest Rooms", suffix: "", value: 18 },
];

export function FacilitiesStatsBar() {
  return (
    <section
      className="border-border-dark border-y bg-surface-dark py-12 md:py-16"
      data-theme="dark"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {STATS.map((stat) => (
          <StatCounter
            key={stat.label}
            label={stat.label}
            suffix={stat.suffix}
            value={stat.value}
          />
        ))}
      </div>
    </section>
  );
}
