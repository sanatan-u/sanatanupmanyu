import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { platforms } from "@/content/platforms";
import type { Stage } from "@/content/platforms";
import { products } from "@/content/products";
import { servicePillars } from "@/content/services";

export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: "/work" },
};

type WorkItem = {
  name: string;
  stage?: Stage;
  url?: string;
  builtFor?: string;
  impact?: string;
  description: string;
};

const stageStyle: Record<Stage, string> = {
  Live: "text-accent-ink border-accent/40",
  "Early access": "text-signal border-signal/40",
  MVP: "text-signal border-signal/40",
  Research: "text-ink-3 border-rule",
  Engagement: "text-ink-3 border-rule",
};

function StageChip({ stage }: { stage: Stage }) {
  return (
    <span
      className={`text-[11px] uppercase tracking-[0.12em] rounded-full px-2 py-[1px] border ${stageStyle[stage]}`}
    >
      {stage}
    </span>
  );
}

export default function WorkPage() {
  const items: WorkItem[] = [...platforms, ...products];

  return (
    <div className="mx-auto max-w-[1040px] px-6 md:px-12 pt-12 pb-8">
      <h1 className="display text-[clamp(2rem,4.5vw,3.5rem)] mb-6">Work.</h1>
      <p className="text-[17px] leading-[1.65] text-ink-2 max-w-[62ch] mb-12">
        Production AI systems and commercial products I&rsquo;ve built or led
        — spanning target discovery, clinical-trial intelligence, digital
        twins, regulatory automation, and portfolio decisions. Stages reflect
        where each sits today; all continue to evolve.
      </p>

      <section className="mt-6">
        <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mb-8">
          Selected work
        </h2>
        <ul className="space-y-12">
          {items.map((p) => (
            <li key={p.name} className="border-t border-rule pt-6">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-medium text-lg">{p.name}</h3>
                  {p.stage ? <StageChip stage={p.stage} /> : null}
                </div>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:text-accent-ink inline-flex items-center gap-1"
                  >
                    {new URL(p.url).hostname.replace(/^www\./, "")}
                    <ArrowUpRight size={14} strokeWidth={1.75} />
                  </a>
                ) : null}
              </div>
              {p.builtFor ? (
                <div className="text-sm text-ink-3 mt-1">
                  Built for {p.builtFor}
                </div>
              ) : null}
              {p.impact ? (
                <div className="text-sm text-signal mt-1">{p.impact}</div>
              ) : null}
              <p className="text-[15px] text-ink-2 leading-relaxed mt-3">
                {p.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mb-8">
          What I help with
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
          {servicePillars.map((pillar) => (
            <div key={pillar.id}>
              <h3 className="font-medium mb-3">{pillar.title}</h3>
              <ul className="space-y-1.5 text-[15px] text-ink-2">
                {pillar.items.map((i) => (
                  <li key={i.name}>— {i.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 text-accent hover:text-accent-ink font-medium"
        >
          Discuss a collaboration <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </section>
    </div>
  );
}
