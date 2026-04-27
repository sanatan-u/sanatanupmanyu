"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, RotateCcw, ArrowRight } from "lucide-react";
import { site } from "@/content/site";

const coreProtocols = ["Python", "TypeScript", "React", "Neo4j", "AWS", "LangChain"];

export function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-card w-48 md:w-full">
      <div className={`flip-card-inner ${flipped ? "flip-card-flipped" : ""}`}>

        {/* ── Front ── */}
        <div className="flip-card-face flip-card-front">
          <button
            type="button"
            className="relative w-full cursor-pointer group"
            onClick={() => setFlipped(true)}
            aria-label="Show quick profile info"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-accent/15 translate-x-3 translate-y-3 transition-opacity group-hover:opacity-0"
            />
            <Image
              src="/sanatan-square.jpg"
              alt="Sanatan Upmanyu"
              width={560}
              height={560}
              priority
              className="relative w-full h-auto rounded-[28px] shadow-[0_2px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-[1.01]"
            />
            {/* hover overlay */}
            <div className="absolute inset-0 rounded-[28px] bg-accent/0 group-hover:bg-accent/8 transition-all duration-300 flex items-end justify-center pb-5">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-xs font-medium text-white bg-accent/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <RotateCcw size={11} strokeWidth={2} />
                Click to flip
              </span>
            </div>
          </button>

          {/* Status line below image */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-ink-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {site.availability}
          </div>
        </div>

        {/* ── Back ── */}
        <div className="flip-card-face flip-card-back rounded-[28px] border border-rule bg-bg shadow-[0_2px_30px_rgba(0,0,0,0.08)]">
          <div className="p-5 flex flex-col h-full gap-4">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-ink-3 mb-1">Quick CV</div>
                <div className="font-semibold text-ink text-base leading-tight">{site.name}</div>
                <div className="text-xs text-accent mt-0.5">{site.headline}</div>
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

            {/* Current focus */}
            <div className="rounded-lg bg-bg-soft border border-rule px-3 py-2.5">
              <div className="text-[9px] uppercase tracking-[0.14em] text-ink-3 mb-1">Current Focus</div>
              <p className="text-xs text-ink leading-snug">
                Building AI platforms for pharma &amp; biotech — drug discovery, clinical trial intelligence, and regulatory automation.
              </p>
            </div>

            {/* Current roles */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-ink-3 mb-2">Active Roles</div>
              <div className="space-y-1.5">
                {site.currentRoles.map((r) => (
                  <div key={r.org} className="flex items-center justify-between text-xs">
                    <span className="text-ink-2">{r.org}</span>
                    <span className="text-accent font-medium">{r.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-1.5">
              {site.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-bg-soft border border-rule py-2 text-center"
                >
                  <div className="display text-sm text-accent leading-none">{s.value}</div>
                  <div className="text-[9px] text-ink-3 uppercase tracking-wide mt-1 leading-tight">{s.label.split(" ").slice(-1)[0]}</div>
                </div>
              ))}
            </div>

            {/* Core protocols */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-ink-3 mb-2">Core Protocols</div>
              <div className="flex flex-wrap gap-1.5">
                {coreProtocols.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium uppercase tracking-wide text-accent border border-accent/30 bg-accent/8 rounded px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-rule flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-ink-3">
                <MapPin size={11} strokeWidth={1.5} />
                {site.location}
              </div>
              <Link
                href="/about"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] uppercase tracking-[0.12em] text-accent font-medium hover:text-accent-ink transition-colors flex items-center gap-1"
              >
                Full profile <ArrowRight size={10} strokeWidth={2} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
