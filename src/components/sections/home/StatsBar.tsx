import { StatCounter } from "@/components/shared/StatCounter.tsx";

const STATS = [
  { label: "Members", suffix: "+", value: 12_000 },
  { label: "Daily Footfall", suffix: "+", value: 2000 },
  { label: "Sports", suffix: "+", value: 23 },
  { label: "Years", suffix: "+", value: 30 },
];

export function StatsBar() {
  return (
    <section
      className="border-border-dark border-y bg-surface-dark py-12 md:py-16"
      data-theme="dark"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
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
