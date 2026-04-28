import type { Metadata } from "next";
import { MapPin, Mic } from "lucide-react";
import { talks } from "@/content/speaking";
import { FadeUp } from "@/components/fade-up";

export const metadata: Metadata = {
  title: "Speaking",
  description:
    "Keynotes, panels, and workshops at Web Summit, Microsoft AI Tour, GlobalBioIndia, and industry meetups on AI, drug discovery, and digital health.",
  alternates: { canonical: "/speaking" },
  openGraph: {
    title: "Speaking — Sanatan Upmanyu",
    description:
      "Conference talks and panels on AI for biomedicine, reaching thousands of attendees in pharma and deep-tech.",
  },
};

const roleBadge: Record<string, string> = {
  Keynote: "text-accent-ink bg-accent/10 border-accent/30",
  Panelist: "text-signal bg-signal/10 border-signal/30",
  "Startup Showcase": "text-signal bg-signal/10 border-signal/30",
  "Startup Pitch Presenter": "text-signal bg-signal/10 border-signal/30",
  "Invited Speaker": "text-accent-ink bg-accent/10 border-accent/30",
  Speaker: "text-accent-ink bg-accent/10 border-accent/30",
  "Workshop Presenter": "text-ink-2 bg-bg-soft border-rule",
};

function yearOf(date: string): string {
  const m = date.match(/\b(20\d{2})\b/);
  return m ? m[1] : "—";
}

export default function SpeakingPage() {
  const grouped = talks.reduce<Record<string, typeof talks>>((acc, t) => {
    const y = yearOf(t.date);
    (acc[y] ??= []).push(t);
    return acc;
  }, {});
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
      <h1 className="display text-[clamp(2rem,4.5vw,3.5rem)] mb-6">
        Speaking.
      </h1>
      <p className="text-[17px] leading-[1.65] text-ink-2 max-w-[62ch] mb-12">
        Keynotes, panels, and workshops at Web Summit, Microsoft AI Tour,
        GlobalBioIndia, and industry meetups — reaching thousands of attendees
        in pharma, biotech, and deep-tech. Open to 2026 invitations.
      </p>

      {years.map((year) => (
        <section key={year} className="mb-16">
          <FadeUp>
            <h2 className="display text-2xl mb-6 text-ink-3">{year}</h2>
          </FadeUp>
          <ul className="grid md:grid-cols-2 gap-5">
            {grouped[year].map((t, i) => {
              const badgeClass =
                roleBadge[t.role] ?? "text-ink-2 bg-bg-soft border-rule";
              return (
                <FadeUp key={i} delay={i * 60}>
                  <li className="card-lift rounded-xl border border-rule bg-bg-soft p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`text-[11px] uppercase tracking-[0.12em] rounded-full px-2.5 py-0.5 border ${badgeClass} shrink-0`}
                      >
                        {t.role}
                      </div>
                      <Mic
                        size={15}
                        strokeWidth={1.5}
                        className="text-ink-3 shrink-0 mt-0.5"
                        aria-hidden
                      />
                    </div>
                    <div>
                      <div className="font-medium text-ink leading-snug">
                        {t.event}
                      </div>
                      <div className="text-[15px] text-ink-2 mt-1.5 leading-snug">
                        {t.topic}
                      </div>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-3 pt-2 border-t border-rule">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} strokeWidth={1.75} aria-hidden />
                        {t.location}
                      </span>
                      <span>{t.date}</span>
                    </div>
                  </li>
                </FadeUp>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
