"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, RotateCcw } from "lucide-react";
import { site } from "@/content/site";

export function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className="flip-card w-48 md:w-full cursor-pointer text-left"
      onClick={() => setFlipped((f) => !f)}
      aria-label={flipped ? "Show photo" : "Show quick info"}
    >
      <div
        className={`flip-card-inner ${flipped ? "flip-card-flipped" : ""}`}
      >
        {/* Front — Photo */}
        <div className="flip-card-face flip-card-front">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-accent/15 translate-x-3 translate-y-3"
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
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-3">
            <RotateCcw size={11} strokeWidth={1.75} />
            Click to flip
          </div>
        </div>

        {/* Back — Quick CV */}
        <div className="flip-card-face flip-card-back rounded-[28px] border border-rule bg-bg-soft shadow-[0_2px_30px_rgba(0,0,0,0.08)]">
          <div className="p-6 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-ink-3 mb-5">
                Quick CV
              </h3>
              <dl className="space-y-3 text-sm">
                {site.currentRoles.map((r) => (
                  <div key={r.org} className="flex flex-col">
                    <dt className="font-medium text-ink">{r.role}</dt>
                    <dd className="text-ink-3">{r.org}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 pt-4 border-t border-rule">
                <div className="grid grid-cols-2 gap-3">
                  {site.stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="display text-lg text-accent">
                        {s.value}
                      </div>
                      <div className="text-[10px] text-ink-3 uppercase tracking-wide">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-rule flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-ink-3">
                <MapPin size={13} strokeWidth={1.5} />
                {site.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-3">
                <RotateCcw size={11} strokeWidth={1.75} />
                Flip
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
