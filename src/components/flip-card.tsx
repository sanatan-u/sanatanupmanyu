"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, RotateCcw, ArrowRight } from "lucide-react";
import { site } from "@/content/site";

const coreStack = ["Python", "TypeScript", "React", "Neo4j", "AWS", "LangChain"];

export function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-card w-full max-w-[300px] md:max-w-none">
      <div className={`flip-card-inner ${flipped ? "flip-card-flipped" : ""}`}>

        {/* ── Front ── */}
        <div className="flip-card-face flip-card-front rounded-[28px] border border-rule bg-bg-soft shadow-[0_2px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <button
            type="button"
            className="w-full h-full flex flex-col cursor-pointer group"
            onClick={() => setFlipped(true)}
            aria-label="Flip to see profile details"
          >
            {/* Photo — inset with padding so it reads as "card with image" */}
            <div className="px-6 pt-6 pb-4">
              <div className="relative mx-auto">
                <Image
                  src="/sanatan-square.jpg"
                  alt="Sanatan Upmanyu"
                  width={560}
                  height={560}
                  priority
                  className="w-full h-auto rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.10)] transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {/* hover flip hint */}
                <div className="absolute inset-0 rounded-2xl bg-accent/0 group-hover:bg-accent/10 transition-all duration-300 flex items-end justify-center pb-4">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-xs font-medium text-white bg-ink/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <RotateCcw size={11} strokeWidth={2} />
                    Flip
                  </span>
                </div>
              </div>
            </div>

            {/* Name + title below photo */}
            <div className="px-6 pb-2 text-center">
              <div className="font-semibold text-ink text-base leading-tight">{site.name}</div>
              <div className="text-xs text-ink-3 mt-0.5">AI &amp; Data Science Executive</div>
            </div>

            {/* Visible flip affordance; the hover hint above does not exist on touch screens.
                Availability and stats are shown once, beside the greeting and in the stats strip. */}
            <div className="mt-auto px-6 pt-1 pb-5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-3 group-hover:text-accent transition-colors">
                <RotateCcw size={11} strokeWidth={1.75} aria-hidden />
                Flip for profile
              </span>
            </div>
          </button>
        </div>

        {/* ── Back ── */}
        <div className="flip-card-face flip-card-back rounded-[28px] border border-rule bg-bg shadow-[0_2px_30px_rgba(0,0,0,0.08)]">
          <div className="p-5 flex flex-col h-full gap-3.5">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-ink text-base leading-tight">{site.name}</div>
                <div className="text-xs text-ink-3 mt-0.5">Basel, Switzerland</div>
              </div>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                aria-label="Show photo"
                className="text-ink-3 hover:text-accent transition-colors p-1 -mr-1 -mt-1"
              >
                <RotateCcw size={14} strokeWidth={1.75} />
              </button>
            </div>

            <div className="border-t border-rule" />

            {/* What I do */}
            <div className="rounded-lg bg-bg-soft border border-rule px-3 py-2.5">
              <div className="text-[9px] uppercase tracking-[0.14em] text-ink-3 mb-1.5">What I do</div>
              <p className="text-xs text-ink leading-snug">
                I build AI systems that move drugs from hypothesis to patient — platforms for target discovery, clinical trial intelligence, and regulatory automation.
              </p>
            </div>

            {/* Currently */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-ink-3 mb-2">Currently</div>
              <div className="space-y-1.5">
                {site.currentRoles.map((r) => (
                  <div key={r.org} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-ink-2 truncate">{r.org}</span>
                    <span className="text-accent font-medium shrink-0">{r.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-ink-3 mb-2">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {coreStack.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium uppercase tracking-wide text-accent border border-accent/30 bg-accent/8 rounded px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-3 border-t border-rule">
              <Link
                href="/about"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between w-full rounded-lg bg-accent/8 border border-accent/25 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/15 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} strokeWidth={1.5} />
                  View full experience
                </div>
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
