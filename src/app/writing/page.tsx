import type { Metadata } from "next";
import { getAllPostMeta } from "@/lib/blog";
import { BlogIndex } from "@/components/blog-index";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on AI, drug discovery, and building platforms in biomedicine.",
  alternates: {
    canonical: "/writing",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function WritingPage() {
  const posts = getAllPostMeta();
  return (
    <div className="mx-auto max-w-[880px] px-6 md:px-12 pt-12 pb-8">
      <h1 className="display text-[clamp(2rem,4.5vw,3.5rem)] mb-6">
        Writing.
      </h1>
      <p className="text-[17px] leading-[1.65] text-ink-2 max-w-[62ch] mb-12">
        Notes on AI, drug discovery, and building platforms in biomedicine.
        Short posts. No listicles. Occasional diagrams.
      </p>
      <BlogIndex posts={posts} />
    </div>
  );
}
