"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Stage } from "@/content/platforms";

type WorkItem = {
  name: string;
  stage?: Stage;
  url?: string;
  builtFor?: string;
  impact?: string;
  description: string;
  tags: string[];
};

const stageStyle: Record<Stage, string> = {
  Live: "text-accent-ink bg-accent/10 border-accent/30",
  "Early access": "text-signal bg-signal/10 border-signal/30",
  MVP: "text-signal bg-signal/10 border-signal/30",
  Research: "text-ink-3 bg-bg-soft border-rule",
  Engagement: "text-ink-3 bg-bg-soft border-rule",
};

function StageChip({ stage }: Readonly<{ stage: Stage }>) {
  return (
    <span
      className={`text-[11px] uppercase tracking-[0.12em] rounded-full px-2.5 py-0.5 border ${stageStyle[stage]}`}
    >
      {stage}
    </span>
  );
}

export function WorkGrid({
  items,
  allTags,
}: Readonly<{
  items: WorkItem[];
  allTags: string[];
}>) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? items.filter((i) => i.tags.includes(active))
    : items;

  return (
    <section>
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-none">
        <button
          onClick={() => setActive(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm border transition-all duration-200 ${
            active === null
              ? "bg-accent text-white border-accent"
              : "bg-transparent text-ink-2 border-rule hover:border-accent hover:text-accent"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(active === tag ? null : tag)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm border transition-all duration-200 ${
              active === tag
                ? "bg-accent text-white border-accent"
                : "bg-transparent text-ink-2 border-rule hover:border-accent hover:text-accent"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
        {filtered.map((p) => (
          <li
            key={p.name}
            className="card-lift rounded-xl border border-rule bg-bg-soft p-6 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-medium text-lg leading-snug">{p.name}</h3>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-accent hover:text-accent-ink transition-colors"
                  aria-label={`Visit ${p.name}`}
                >
                  <ArrowUpRight size={18} strokeWidth={1.75} />
                </a>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {p.stage ? <StageChip stage={p.stage} /> : null}
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] text-ink-3 uppercase tracking-[0.08em] rounded-full bg-bg-soft px-2 py-0.5 border border-rule"
                >
                  {t}
                </span>
              ))}
            </div>

            {p.builtFor ? (
              <div className="text-sm text-ink-3 mb-2">
                Built for {p.builtFor}
              </div>
            ) : null}

            {p.impact ? (
              <div className="text-sm text-signal mb-3 font-medium">
                {p.impact}
              </div>
            ) : null}

            <p className="text-[15px] text-ink-2 leading-relaxed mt-auto">
              {p.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
