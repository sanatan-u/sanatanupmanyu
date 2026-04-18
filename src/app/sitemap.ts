import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllPostMeta } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", ...site.nav.map((n) => n.href)];
  const pages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  const posts: MetadataRoute.Sitemap = getAllPostMeta().map((p) => ({
    url: `${site.url}/writing/${p.slug}`,
    lastModified: new Date(p.updated || p.date || now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
