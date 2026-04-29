"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

type Props = { items: TocItem[] };

export function PostToc({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    items[0]?.id ?? null,
  );

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="Table of contents"
        className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
      >
        <p className="text-xs uppercase tracking-wider text-ink-3 mb-3 font-medium">
          On this page
        </p>
        <ol className="space-y-2 text-sm border-l border-rule">
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`block -ml-px pl-4 border-l transition-colors leading-snug ${
                    active
                      ? "border-accent text-accent"
                      : "border-transparent text-ink-3 hover:text-accent"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
