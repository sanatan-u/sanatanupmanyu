"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { BlogMeta } from "@/lib/blog";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogIndex({ posts }: { posts: BlogMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, activeTag]);

  const byYear = useMemo(() => {
    const grouped: Record<string, BlogMeta[]> = {};
    filtered.forEach((p) => {
      const y = (p.date || "").slice(0, 4) || "Undated";
      (grouped[y] ??= []).push(p);
    });
    return grouped;
  }, [filtered]);

  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4">
        <div className="relative max-w-[360px]">
          <Search
            size={16}
            strokeWidth={1.75}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-3"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="w-full border-b border-rule bg-transparent pl-6 pr-6 py-2 outline-none focus:border-accent transition-colors text-[15px] placeholder:text-ink-3"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
            >
              <X size={14} strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
        {allTags.length > 0 ? (
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                activeTag === null
                  ? "border-ink bg-ink text-white"
                  : "border-rule text-ink-2 hover:border-ink"
              }`}
            >
              all
            </button>
            {allTags.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  activeTag === tag
                    ? "border-ink bg-ink text-white"
                    : "border-rule text-ink-2 hover:border-ink"
                }`}
              >
                {tag} <span className="text-ink-3">·{count}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-3 text-sm py-8">
          No posts match — try a different search or clear the filter.
        </p>
      ) : (
        years.map((year) => (
          <section key={year} className="mb-14">
            <h2 className="display text-2xl mb-6 text-ink-3">{year}</h2>
            <ul className="space-y-8">
              {byYear[year].map((p) => (
                <li key={p.slug} className="border-t border-rule pt-5">
                  <Link href={`/writing/${p.slug}`} className="group block">
                    <h3 className="font-medium text-lg group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <div className="text-sm text-ink-3 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{formatDate(p.date)}</span>
                      <span>·</span>
                      <span>{p.readingTimeMin} min read</span>
                      {p.tags.length > 0 ? (
                        <>
                          <span>·</span>
                          <span className="text-ink-3">
                            {p.tags.join(", ")}
                          </span>
                        </>
                      ) : null}
                    </div>
                    {p.excerpt ? (
                      <p className="text-[15px] text-ink-2 leading-relaxed mt-2">
                        {p.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
