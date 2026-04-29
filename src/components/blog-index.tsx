"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
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

export function BlogIndex({
  posts,
  initialTag,
}: Readonly<{ posts: BlogMeta[]; initialTag?: string }>) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(initialTag ?? null);

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

  const isFiltering = query.trim() !== "" || activeTag !== null;
  const featuredPost = !isFiltering && posts.length > 0 ? posts[0] : null;
  const listPosts = featuredPost ? filtered.slice(1) : filtered;
  const listYears = useMemo(() => {
    if (!featuredPost) return years;
    const grouped: Record<string, BlogMeta[]> = {};
    listPosts.forEach((p) => {
      const y = (p.date || "").slice(0, 4) || "Undated";
      (grouped[y] ??= []).push(p);
    });
    return Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  }, [featuredPost, listPosts, years]);

  const listByYear = useMemo(() => {
    if (!featuredPost) return byYear;
    const grouped: Record<string, BlogMeta[]> = {};
    listPosts.forEach((p) => {
      const y = (p.date || "").slice(0, 4) || "Undated";
      (grouped[y] ??= []).push(p);
    });
    return grouped;
  }, [featuredPost, listPosts, byYear]);

  return (
    <div>
      {/* ── Search + tag filter ── */}
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

      {/* ── Featured post (most recent, unfiltered) ── */}
      {featuredPost ? (
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group block mb-14 rounded-2xl border border-rule bg-bg-soft overflow-hidden card-lift"
        >
          {featuredPost.image ? (
            <div className="relative w-full aspect-[1200/630] overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.imageAlt ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {featuredPost.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTag(tag);
                  }}
                  className="text-xs px-2 py-0.5 rounded-full border border-rule text-ink-3 hover:border-accent hover:text-accent transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
            <h2 className="display text-[clamp(1.5rem,3vw,2.25rem)] group-hover:text-accent transition-colors mb-2">
              {featuredPost.title}
            </h2>
            <div className="text-sm text-ink-3 mb-3 flex flex-wrap gap-x-3 gap-y-1">
              <span>{formatDate(featuredPost.date)}</span>
              <span>·</span>
              <span>{featuredPost.readingTimeMin} min read</span>
            </div>
            {featuredPost.excerpt ? (
              <p className="text-[16px] text-ink-2 leading-relaxed max-w-[72ch] mb-4">
                {featuredPost.excerpt}
              </p>
            ) : null}
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
              Read post <ArrowRight size={14} strokeWidth={1.75} />
            </span>
          </div>
        </Link>
      ) : null}

      {/* ── Filtered empty state ── */}
      {filtered.length === 0 ? (
        <p className="text-ink-3 text-sm py-8">
          No posts match — try a different search or clear the filter.
        </p>
      ) : (
        listYears.map((year) => (
          <section key={year} className="mb-14">
            <h2 className="display text-2xl mb-6 text-ink-3">{year}</h2>
            <ul className="space-y-8">
              {listByYear[year].map((p) => (
                <li key={p.slug} className="border-t border-rule pt-5">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group grid gap-4 md:grid-cols-[200px_1fr]"
                  >
                    {p.image ? (
                      <div className="relative aspect-[1200/630] overflow-hidden rounded-md border border-rule bg-bg-soft md:aspect-[200/120]">
                        <Image
                          src={p.image}
                          alt={p.imageAlt ?? ""}
                          fill
                          sizes="(max-width: 768px) 100vw, 200px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="hidden md:block" aria-hidden />
                    )}
                    <div>
                      <h3 className="font-medium text-lg group-hover:text-accent transition-colors">
                        {p.title}
                      </h3>
                      <div className="text-sm text-ink-3 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>{formatDate(p.date)}</span>
                        <span>·</span>
                        <span>{p.readingTimeMin} min read</span>
                      </div>
                      {p.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {p.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTag(tag);
                              }}
                              className="text-xs px-2 py-0.5 rounded-full border border-rule text-ink-3 hover:border-accent hover:text-accent transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {p.excerpt ? (
                        <p className="text-[15px] text-ink-2 leading-relaxed mt-2">
                          {p.excerpt}
                        </p>
                      ) : null}
                    </div>
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
