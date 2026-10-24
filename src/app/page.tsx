import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { SocialRow } from "@/components/social-row";
import { ParticlesBackdrop } from "@/components/particles-backdrop";
import { SectionDivider } from "@/components/section-divider";
import { StatsBar } from "@/components/stats-bar";
import { TechGrid } from "@/components/tech-grid";
import { FlipCard } from "@/components/flip-card";
import { Typewriter } from "@/components/typewriter";
import { FadeUp } from "@/components/fade-up";
import { platforms } from "@/content/platforms";
import { products } from "@/content/products";
import { projectDiagrams } from "@/content/project-diagrams";
import { ProjectExhibition } from "@/components/project-exhibition";

export default function HomePage() {
  const byName = <T extends { name: string }>(list: T[], name: string) =>
    list.find((x) => x.name === name)!;
  // Featured order is a deliberate choice: Discovery Navigator leads, AlphaMeld closes.
  const featured = [
    { slug: "discovery-navigator", ...byName(platforms, "Discovery Navigator") },
    { slug: "quriousri", ...byName(products, "QuriousRI") },
    { slug: "pipeline-alpha", ...byName(products, "Pipeline Alpha") },
    { slug: "alphameld", ...byName(platforms, "AlphaMeld® Operating System") },
  ].map((p) => ({
    slug: p.slug,
    name: p.name,
    stage: p.stage,
    domain: p.tags?.find((t) => t !== "AI/ML" && t !== "Full Stack"),
    impact: p.impact,
    description: p.description,
    url: p.url,
    diagram: projectDiagrams[p.slug],
  }));
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
      {/* ── Hero ── */}
      <section className="relative isolate grid md:grid-cols-[1fr_320px] gap-8 md:gap-16 items-start py-6 md:py-12">
        <ParticlesBackdrop />
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-xs text-accent mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {site.availability}
          </div>

          <h1 className="display text-[clamp(2.75rem,6.5vw,5rem)] mb-4">
            Hi, I&rsquo;m <em>Sanatan</em>.
          </h1>
          <div className="mb-6">
            <Typewriter />
          </div>
          <div className="prose text-[18px] leading-[1.65] text-ink-2 max-w-[56ch] mb-8">
            <p>{site.tagline}</p>
            <p>{site.currently}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link href="/work" className="btn-primary">
              Explore my work
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            <Link href="/contact" className="btn-outline">
              Get in touch
            </Link>
          </div>

          <SocialRow />
        </div>

        <div className="flex flex-col items-center md:items-stretch">
          <FlipCard />
        </div>
      </section>

      {/* ── Stats ── */}
      <FadeUp className="mt-16 md:mt-20">
        <StatsBar />
      </FadeUp>

      {/* ── Tech Stack ── */}
      <SectionDivider className="mt-20 mb-14" />
      <FadeUp>
        <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)] mb-8">
          Tech <em>stack</em>
        </h2>
        <TechGrid />
      </FadeUp>

      {/* ── Selected work ── */}
      <SectionDivider className="mt-24 mb-14" />
      <section>
        <FadeUp>
          <div className="flex items-baseline justify-between mb-10 flex-wrap gap-3">
            <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)]">
              Selected <em>work</em>
            </h2>
            <Link href="/work" className="link-arrow text-sm">
              all work <ArrowRight size={14} strokeWidth={1.75} />
            </Link>
          </div>
        </FadeUp>
        <FadeUp>
          <ProjectExhibition items={featured} />
        </FadeUp>
      </section>

      {/* ── Work together ── */}
      <SectionDivider className="mt-24 mb-14" />
      <FadeUp>
        <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)] mb-5">
          Work <em>together</em>
        </h2>
        <p className="text-[17px] text-ink-2 mb-7 max-w-[60ch]">
          Advisory engagements, speaking invitations, and technical consulting
          for pharma, biotech, and consumer health.
        </p>
        <Link href="/contact" className="link-arrow">
          Get in touch <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </FadeUp>
    </div>
  );
}
