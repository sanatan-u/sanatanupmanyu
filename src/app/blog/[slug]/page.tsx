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
import { BlogPostingJsonLd } from "@/components/json-ld";
import { site } from "@/content/site";
import { Figure, Callout, References, Cite, Ref, Mermaid } from "@/components/mdx";

type Params = { slug: string };

const mdxComponents = {
  Figure,
  Callout,
  References,
  Cite,
  Ref,
  Mermaid,
};

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
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
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
      <h1 className="display text-[clamp(2rem,4.5vw,3.25rem)] mb-4">
        {post.title}
      </h1>
      {post.image ? (
        <div className="relative mt-6 mb-10 aspect-[1200/630] overflow-hidden rounded-lg border border-rule bg-bg-soft">
          <Image
            src={post.image}
            alt={post.imageAlt ?? ""}
            fill
            sizes="(max-width: 1040px) 100vw, 1040px"
            priority
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="text-sm text-ink-3 mb-10 flex flex-wrap gap-x-3 gap-y-1">
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readingTimeMin} min read</span>
        {post.tags.length > 0 ? (
          <>
            <span>·</span>
            <span>{post.tags.join(", ")}</span>
          </>
        ) : null}
      </div>
      <div className="prose-post">
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
    </article>
  );
}
