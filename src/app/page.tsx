import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { SocialRow } from "@/components/social-row";
import { ParticlesBackdrop } from "@/components/particles-backdrop";
import { SectionDivider } from "@/components/section-divider";
import { StatsBar } from "@/components/stats-bar";
import { TechGrid } from "@/components/tech-grid";
import { AtAGlance } from "@/components/at-a-glance";
import { Typewriter } from "@/components/typewriter";
import { platforms } from "@/content/platforms";
import { products } from "@/content/products";

export default function HomePage() {
  const byName = <T extends { name: string }>(list: T[], name: string) =>
    list.find((x) => x.name === name)!;
  const featured = [
    byName(platforms, "AlphaMeld® Operating System"),
    byName(platforms, "Discovery Navigator"),
    byName(products, "QuriousRI"),
    byName(products, "Pipeline Alpha"),
  ];
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
      {/* ── Hero ── */}
      <section className="relative isolate grid md:grid-cols-[1fr_320px] gap-8 md:gap-16 items-start py-6 md:py-12">
        <ParticlesBackdrop />
        <div className="order-2 md:order-1">
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

        <div className="order-1 md:order-2 flex flex-col gap-6 items-center md:items-stretch">
          <div className="relative w-48 md:w-full">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-accent/15 translate-x-3 translate-y-3"
            />
            <Image
              src="/sanatan-square.jpg"
              alt="Sanatan Upmanyu"
              width={560}
              height={560}
              priority
              className="relative w-full h-auto rounded-[28px] shadow-[0_2px_30px_rgba(0,0,0,0.08)]"
            />
          </div>
          <div className="hidden md:block">
            <AtAGlance />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mt-16 md:mt-20">
        <StatsBar />
      </section>

      {/* ── At a Glance (mobile) ── */}
      <section className="mt-12 md:hidden">
        <AtAGlance />
      </section>

      {/* ── Tech Stack ── */}
      <SectionDivider className="mt-20 mb-14" />
      <section>
        <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)] mb-8">
          Tech <em>stack</em>
        </h2>
        <TechGrid />
      </section>

      {/* ── Selected work ── */}
      <SectionDivider className="mt-24 mb-14" />
      <section>
        <div className="flex items-baseline justify-between mb-10 flex-wrap gap-3">
          <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)]">
            Selected <em>work</em>
          </h2>
          <Link href="/work" className="link-arrow text-sm">
            all work <ArrowRight size={14} strokeWidth={1.75} />
          </Link>
        </div>
        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-12">
          {featured.map((p) => (
            <li key={p.name} className="flex flex-col">
              <h3 className="font-medium text-lg mb-2">{p.name}</h3>
              <div className="text-sm text-signal mb-3 min-h-[3em]">
                {p.impact ?? ""}
              </div>
              <p className="text-[15px] text-ink-2 leading-relaxed">
                {p.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Work together ── */}
      <SectionDivider className="mt-24 mb-14" />
      <section>
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
      </section>
    </div>
  );
}
