import type { Metadata } from "next";
import Image from "next/image";
import { experience, education } from "@/content/experience";

export const metadata: Metadata = {
  title: "About",
  description:
    "18+ years spanning wet-lab biology, AI/ML engineering, and leadership across pharma, biotech, and consumer health. Career timeline, skills, and education.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Sanatan Upmanyu",
    description:
      "Data-science executive with 18+ years in AI for biomedicine. Architect of the AlphaMeld platform. Based in Basel, Switzerland.",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
      <section className="grid md:grid-cols-[1fr_280px] gap-10 md:gap-14 items-start">
        <div>
          <h1 className="display text-[clamp(2rem,4.5vw,3.5rem)] mb-8">
            About.
          </h1>
          <div className="prose text-[17px] leading-[1.7] text-ink-2 max-w-[62ch]">
            <p>
              I&rsquo;m a data-science executive with 18+ years spanning
              wet-lab biology, AI/ML engineering, HPC/cloud infrastructure,
              and leadership across pharma, biotech, and consumer health.
            </p>
            <p>
              I architected the AlphaMeld&trade; platform &mdash; an end-to-end AI stack
              that accelerates target triage and indication selection for
              global drug-makers. My work covers clinical-trial design and
              enrollment prediction, digital-twin modelling, and large-scale
              knowledge-graph analytics.
            </p>
            <p>
              I care about converting multimodal data into real business
              value, scaling cross-site teams, and forging the kind of
              partnerships that redefine R&amp;D.
            </p>
          </div>
        </div>
        <Image
          src="/sanatan-portrait.jpg"
          alt="Sanatan Upmanyu"
          width={640}
          height={800}
          className="w-full h-auto rounded-2xl shadow-[0_2px_30px_rgba(0,0,0,0.08)]"
        />
      </section>

      <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mt-24 mb-10">
        Career
      </h2>
      <ol className="relative ml-4 border-l-2 border-rule space-y-0">
        {experience.map((r, i) => {
          const current = r.period.includes("Present");
          return (
            <li key={`${r.company}-${i}`} className="relative pl-8 pb-12 last:pb-0">
              {/* timeline dot */}
              <span
                aria-hidden
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  current
                    ? "bg-accent border-accent"
                    : "bg-bg border-rule"
                }`}
              />

              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-medium text-ink">{r.company}</span>
                {current ? (
                  <span className="text-[11px] uppercase tracking-[0.12em] text-signal bg-signal/10 border border-signal/30 rounded-full px-2 py-[1px]">
                    now
                  </span>
                ) : null}
              </div>

              <div className="text-sm text-ink-3 mb-1">
                {r.title} &middot; {r.location}
              </div>
              <div className="text-sm text-ink-3 mb-3">{r.period}</div>

              {r.skills && r.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {r.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] text-accent tracking-wide uppercase rounded-full bg-accent/8 border border-accent/20 px-2.5 py-0.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}

              <ul className="space-y-1.5 text-[15px] text-ink-2 leading-relaxed">
                {r.bullets.map((b, j) => (
                  <li key={j}>&mdash; {b}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>

      <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mt-20 mb-6">
        Education
      </h2>
      <ul className="relative ml-4 border-l-2 border-rule space-y-0">
        {education.map((e) => (
          <li
            key={e.institution}
            className="relative pl-8 pb-8 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-bg border-rule"
            />
            <div className="font-medium">{e.institution}</div>
            <div className="text-sm text-ink-3">{e.degree}</div>
            <div className="text-sm text-ink-3">{e.year}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
