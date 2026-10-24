"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export type ExhibitItem = {
  slug: string;
  name: string;
  stage?: string;
  domain?: string;
  impact?: string;
  description: string;
  url?: string;
  diagram: { desktop: string; mobile: string };
};

const KEY_STEP: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

/**
 * Featured-project exhibition: a project list beside one large illustrative
 * diagram and that project's existing description. Visitors choose a project;
 * nothing rotates on its own. Below the lg breakpoint the list becomes a row of
 * tabs, and below md the diagram switches to its tall phone layout.
 */
export function ProjectExhibition({ items }: Readonly<{ items: ExhibitItem[] }>) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = KEY_STEP[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (i + step + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12 lg:items-start">
      <div
        role="tablist"
        aria-label="Featured projects"
        aria-orientation="vertical"
        className="exhibit-tabs"
      >
        {items.map((p, i) => (
          <button
            key={p.slug}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${p.slug}`}
            aria-controls={`panel-${p.slug}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="exhibit-tab"
          >
            <span className="exhibit-tab-name">{p.name}</span>
            <span className="exhibit-tab-meta">
              {[p.stage, p.domain].filter(Boolean).join(" · ")}
            </span>
          </button>
        ))}
      </div>

      <div className="min-w-0">
        {items.map((p, i) => {
          const open = !!expanded[p.slug];
          const descId = `desc-${p.slug}`;
          return (
            <div
              key={p.slug}
              role="tabpanel"
              id={`panel-${p.slug}`}
              aria-labelledby={`tab-${p.slug}`}
              hidden={i !== active}
              className="exhibit-panel"
            >
              <div
                className="exhibit-diagram exhibit-diagram-desktop"
                dangerouslySetInnerHTML={{ __html: p.diagram.desktop }}
              />
              <div
                className="exhibit-diagram exhibit-diagram-mobile"
                dangerouslySetInnerHTML={{ __html: p.diagram.mobile }}
              />

              <div className="grid gap-3 max-w-[70ch]">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="display text-[clamp(1.6rem,2.6vw,2.1rem)]">{p.name}</h3>
                  {p.stage ? <span className="stage-chip">{p.stage}</span> : null}
                </div>
                {p.impact ? (
                  <p className="text-signal text-base leading-relaxed">{p.impact}</p>
                ) : null}
                <p
                  id={descId}
                  className={`text-ink-2 text-base leading-[1.7] ${open ? "" : "line-clamp-3"}`}
                >
                  {p.description}
                </p>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={descId}
                  onClick={() => setExpanded((s) => ({ ...s, [p.slug]: !open }))}
                  className="justify-self-start text-sm font-medium text-accent hover:text-accent-ink transition-colors"
                >
                  {open ? "Show less" : "Read full description"}
                </button>
                <div className="flex flex-wrap gap-6 text-sm">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-arrow"
                    >
                      Visit product <ArrowUpRight size={14} strokeWidth={1.75} />
                    </a>
                  ) : null}
                  <Link href="/work" className="link-arrow">
                    All work <ArrowRight size={14} strokeWidth={1.75} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
