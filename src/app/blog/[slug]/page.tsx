import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { getAllPostMeta, getPost } from "@/lib/blog";
import { extractToc, slugify } from "@/lib/toc";
import type { ReactNode } from "react";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { ReadingProgress } from "@/components/reading-progress";
import { PostToc } from "@/components/post-toc";
import { site } from "@/content/site";
import { Figure, Callout, References, Cite, Ref, Mermaid, Comparison, Col, Row } from "@/components/mdx";

type Params = { slug: string };

function buildCiteMap(body: string): Map<string, number> {
  const map = new Map<string, number>();
  const re = /<Cite\s+[^>]*id\s*=\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const id = m[1];
    if (!map.has(id)) map.set(id, map.size + 1);
  }
  return map;
}

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function buildMdxComponents(citeMap: Map<string, number>) {
  const seen = new Map<string, number>();
  return {
    Figure,
    Callout,
    References,
    Ref,
    Mermaid,
    Comparison,
    Col,
    Row,
    Cite: ({ id, n }: { id: string; n?: number }) => {
      const resolved = n ?? citeMap.get(id) ?? 0;
      return <Cite id={id} n={resolved} />;
    },
    h2: ({ children, ...rest }: { children?: ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) => {
      const base = slugify(nodeText(children));
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = base ? (count === 0 ? base : `${base}-${count}`) : undefined;
      return <h2 id={id} {...rest}>{children}</h2>;
    },
  };
}

export function generateStaticParams(): Params[] {
  return getAllPostMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  const images = post.image
    ? [{ url: post.image, alt: post.imageAlt ?? post.title }]
    : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: site.name, url: site.url }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [site.url],
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPost({
  params,
}: Readonly<{
  params: Promise<Params>;
}>) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const citeMap = buildCiteMap(post.body);
  const mdxComponents = buildMdxComponents(citeMap);
  const toc = extractToc(post.body);

  return (
    <article className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
      <ReadingProgress />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <BlogPostingJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        datePublished={post.date}
        dateModified={post.updated}
        tags={post.tags}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-accent mb-10"
      >
        <ArrowLeft size={14} strokeWidth={1.75} /> all posts
      </Link>

      {/* Title — full container width */}
      <h1 className="display text-[clamp(2rem,4.5vw,3.25rem)] mb-4 max-w-[900px]">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="text-sm text-ink-3 mb-8 flex flex-wrap gap-x-3 gap-y-1 items-center">
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readingTimeMin} min read</span>
        {post.tags.length > 0 ? (
          <>
            <span>·</span>
            <span className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs px-2 py-0.5 rounded-full border border-rule text-ink-3 hover:border-accent hover:text-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </span>
          </>
        ) : null}
      </div>

      {/* Hero image — full container width */}
      {post.image ? (
        <div className="relative mb-12 aspect-[1200/630] overflow-hidden rounded-xl border border-rule bg-bg-soft">
          <Image
            src={post.image}
            alt={post.imageAlt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {/* Prose body + TOC */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
        <div className="prose-post min-w-0">
          <MDXRemote
            source={post.body}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
              },
            }}
          />
        </div>
        <PostToc items={toc} />
      </div>
    </article>
  );
}
