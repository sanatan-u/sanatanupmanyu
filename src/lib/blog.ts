import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  updated: string;
  excerpt: string;
  tags: string[];
  readingTimeMin: number;
  body: string;
  image?: string;
  imageAlt?: string;
};

export type BlogMeta = Omit<BlogPost, "body">;

function toIsoDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function readPost(file: string): BlogPost {
  const filePath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx$/, "");
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMin = Math.max(1, Math.round(words / 220));
  const date = toIsoDate(data.date);
  const frontmatterUpdated = toIsoDate(data.updated);
  const updated =
    frontmatterUpdated ||
    fs.statSync(filePath).mtime.toISOString().slice(0, 10);
  if (!data.title) {
    throw new Error(`Blog post "${slug}" is missing frontmatter field "title"`);
  }
  if (!data.date) {
    throw new Error(`Blog post "${slug}" is missing frontmatter field "date"`);
  }
  const image = data.image ? String(data.image) : undefined;
  const imageAlt = data.imageAlt ? String(data.imageAlt) : undefined;
  return {
    slug,
    title: String(data.title),
    date,
    updated,
    excerpt: String(data.excerpt ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    readingTimeMin,
    body: content,
    image,
    imageAlt,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPostMeta(): BlogMeta[] {
  return getAllPosts().map(({ body: _body, ...meta }) => {
    void _body;
    return meta;
  });
}

export function getPost(slug: string): BlogPost | null {
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  return readPost(file);
}
