import { site } from "@/content/site";

export function StatsBar() {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {site.stats.map((s) => (
        <li
          key={s.label}
          className="rounded-xl border border-rule bg-bg-soft/60 px-5 py-4 text-center"
        >
          <div className="display text-[clamp(1.5rem,3vw,2rem)] text-accent">
            {s.value}
          </div>
          <div className="text-xs text-ink-3 mt-1 tracking-wide uppercase">
            {s.label}
          </div>
        </li>
      ))}
    </ul>
  );
}
