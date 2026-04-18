import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostMeta, getPost } from "@/lib/blog";

type Params = { slug: string };

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
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
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

export default async function WritingPost({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[720px] px-6 md:px-12 pt-12 pb-8">
      <Link
        href="/writing"
        className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-accent mb-10"
      >
        <ArrowLeft size={14} strokeWidth={1.75} /> all writing
      </Link>
      <h1 className="display text-[clamp(2rem,4.5vw,3.25rem)] mb-4">
        {post.title}
      </h1>
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
        <MDXRemote source={post.body} />
      </div>
    </article>
  );
}
