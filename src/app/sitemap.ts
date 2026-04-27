import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllPostMeta } from "@/lib/blog";

const priorities: Record<string, number> = {
  "": 1,
  "/about": 0.9,
  "/work": 0.9,
  "/blog": 0.8,
  "/publications": 0.7,
  "/speaking": 0.7,
  "/contact": 0.6,
};

const frequencies: Record<string, "weekly" | "monthly" | "yearly"> = {
  "": "weekly",
  "/about": "monthly",
  "/work": "monthly",
  "/blog": "weekly",
  "/publications": "monthly",
  "/speaking": "monthly",
  "/contact": "yearly",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", ...site.nav.map((n) => n.href)];
  const pages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: frequencies[path] ?? "monthly",
    priority: priorities[path] ?? 0.5,
  }));
  const posts: MetadataRoute.Sitemap = getAllPostMeta().map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.updated || p.date || now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
