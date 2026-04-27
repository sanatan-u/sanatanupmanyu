import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { platforms } from "@/content/platforms";
import { products } from "@/content/products";
import { servicePillars } from "@/content/services";
import { WorkGrid } from "@/components/work-grid";

export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const items = [...platforms, ...products].map((p) => ({
    name: p.name,
    stage: p.stage,
    url: p.url,
    builtFor: "builtFor" in p ? (p.builtFor as string | undefined) : undefined,
    impact: p.impact,
    description: p.description,
    tags: p.tags ?? [],
  }));

  const allTags = Array.from(new Set(items.flatMap((i) => i.tags))).sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
      <h1 className="display text-[clamp(2rem,4.5vw,3.5rem)] mb-6">Work.</h1>
      <p className="text-[17px] leading-[1.65] text-ink-2 max-w-[62ch] mb-12">
        Production AI systems and commercial products I&rsquo;ve built or led
        — spanning target discovery, clinical-trial intelligence, digital
        twins, regulatory automation, and portfolio decisions.
      </p>

      <WorkGrid items={items} allTags={allTags} />

      <section className="mt-20">
        <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mb-8">
          What I help with
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
          {servicePillars.map((pillar) => (
            <div
              key={pillar.id}
              className="rounded-xl border border-rule bg-bg-soft/40 p-6"
            >
              <div className="text-xs text-accent font-medium tracking-widest uppercase mb-2">
                {pillar.kicker}
              </div>
              <h3 className="font-medium mb-4">{pillar.title}</h3>
              <ul className="space-y-1.5 text-[15px] text-ink-2">
                {pillar.items.map((i) => (
                  <li key={i.name}>— {i.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/contact" className="link-arrow mt-10">
          Discuss a collaboration <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </section>
    </div>
  );
}
