import type { Metadata } from "next";
import Image from "next/image";
import { experience, education } from "@/content/experience";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 md:px-12 pt-12 pb-8">
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
              I architected the AlphaMeld™ platform — an end-to-end AI stack
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

      <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mt-24 mb-8">
        Career
      </h2>
      <ol className="space-y-10">
        {experience.map((r, i) => (
          <li
            key={`${r.company}-${i}`}
            className="grid md:grid-cols-[200px_1fr] gap-3 md:gap-10"
          >
            <div className="text-sm text-ink-3 pt-1">{r.period}</div>
            <div>
              <div className="font-medium text-ink">{r.company}</div>
              <div className="text-sm text-ink-3 mb-3">
                {r.title} · {r.location}
              </div>
              <ul className="space-y-1.5 text-[15px] text-ink-2 leading-relaxed">
                {r.bullets.map((b, j) => (
                  <li key={j}>— {b}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mt-20 mb-6">
        Education
      </h2>
      <ul className="space-y-3">
        {education.map((e) => (
          <li
            key={e.institution}
            className="grid md:grid-cols-[200px_1fr] gap-3 md:gap-10"
          >
            <div className="text-sm text-ink-3">{e.year}</div>
            <div>
              <div className="font-medium">{e.institution}</div>
              <div className="text-sm text-ink-3">{e.degree}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
