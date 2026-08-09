import type { Metadata } from "next";
import { MapPin, Mail, Globe } from "lucide-react";
import { LinkedinIcon } from "@/components/brand-icons";
import { ResumeActions } from "@/components/resume-actions";
import {
  resumeContact,
  resumeSummary,
  resumeScope,
  resumeCompetencies,
  resumeToolset,
  resumeSelectedWork,
  experience,
  education,
  publications,
  patents,
  talks,
} from "@/content/resume";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Résumé of Sanatan Upmanyu — data-science and technology executive with 18+ years in AI for biomedicine, holding three concurrent executive mandates across Basel and India. Download as PDF or machine-readable JSON.",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Résumé — Sanatan Upmanyu",
    description:
      "18+ years across wet-lab biology, AI/ML engineering, and executive leadership in pharma and biotech. Architect of the AlphaMeld platform and QuriousRI.",
    type: "profile",
  },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent border-b border-rule pb-2 mb-5">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <div className="resume-doc mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-16">
      {/* ── Header ── */}
      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-12">
        <div>
          <h1 className="display text-[clamp(2rem,4vw,3rem)] leading-none mb-2">
            {resumeContact.name}
          </h1>
          <p className="text-[15px] text-ink-2 max-w-[60ch] leading-snug">
            {resumeContact.label}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-ink-3">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.75} aria-hidden />
              {resumeContact.location}
            </span>
            <a
              href={`mailto:${resumeContact.email}`}
              className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Mail size={14} strokeWidth={1.75} aria-hidden />
              {resumeContact.email}
            </a>
            <a
              href={resumeContact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <LinkedinIcon size={14} />
              linkedin.com/in/sanatan-upmanyu
            </a>
            <a
              href={resumeContact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Globe size={14} strokeWidth={1.75} aria-hidden />
              sanatanupmanyu.com
            </a>
          </div>
        </div>
        <ResumeActions />
      </header>

      {/* ── Body: main narrative + facts sidebar ── */}
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
        {/* Main column */}
        <div className="min-w-0 space-y-12">
          {/* Executive summary */}
          <section className="break-inside-avoid">
            <SectionTitle>Executive Summary</SectionTitle>
            <p className="text-[15px] leading-[1.65] text-ink-2">
              {resumeSummary}
            </p>
          </section>

          {/* Scope at a glance */}
          <section className="break-inside-avoid">
            <SectionTitle>Scope at a Glance</SectionTitle>
            <dl className="space-y-2.5">
              {resumeScope.map((sc) => (
                <div
                  key={sc.label}
                  className="grid gap-x-4 gap-y-0.5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
                >
                  <dt className="text-[13px] font-medium text-ink">
                    {sc.label}
                  </dt>
                  <dd className="text-[13.5px] text-ink-2 leading-relaxed">
                    {sc.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Experience */}
          <section>
            <SectionTitle>Leadership Experience</SectionTitle>
            <div className="space-y-7">
              {experience.map((r, i) => {
                const current = r.period.includes("Present");
                return (
                  <div key={`${r.company}-${i}`} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[15px] font-semibold text-ink">
                        {r.company}
                        {current ? (
                          <span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-[0.12em] text-signal">
                            now
                          </span>
                        ) : null}
                      </h3>
                      <span className="text-[13px] text-ink-3 tabular-nums">
                        {r.period}
                      </span>
                    </div>
                    <div className="text-[13px] text-ink-2 mb-2">
                      {r.title} · {r.location}
                    </div>
                    <ul className="space-y-1 text-[13.5px] text-ink-2 leading-relaxed">
                      {r.bullets.map((b, j) => (
                        <li key={j} className="pl-4 -indent-4">
                          — {b}
                        </li>
                      ))}
                    </ul>
                    {r.skills && r.skills.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.skills.map((s) => (
                          <span
                            key={s}
                            className="resume-tag text-[10.5px] text-accent tracking-wide uppercase rounded-full bg-accent/8 border border-accent/20 px-2 py-0.5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Selected platforms & initiatives */}
          <section>
            <SectionTitle>Selected Platforms &amp; Business Impact</SectionTitle>
            <div className="space-y-4">
              {resumeSelectedWork.map((p) => (
                <div key={p.name} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="text-[14px] font-semibold text-ink">
                      {p.name}
                    </h3>
                    {p.stage ? (
                      <span className="text-[11px] text-ink-3">{p.stage}</span>
                    ) : null}
                  </div>
                  {p.impact ? (
                    <div className="text-[13px] text-accent-ink mb-0.5">
                      {p.impact}
                    </div>
                  ) : null}
                  <p className="text-[13px] text-ink-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar column */}
        <aside className="min-w-0 space-y-12">
          {/* Key competencies */}
          <section className="break-inside-avoid">
            <SectionTitle>Executive Competencies</SectionTitle>
            <div className="space-y-5">
              {resumeCompetencies.map((c) => (
                <div key={c.label}>
                  <div className="text-[13px] font-medium text-ink mb-1.5">
                    {c.label}
                  </div>
                  <div className="text-[13px] text-ink-2 leading-relaxed">
                    {c.items.join("  ·  ")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Technical toolset */}
          <section className="break-inside-avoid">
            <SectionTitle>Technical Toolset</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {resumeToolset.map((t) => (
                <span
                  key={t}
                  className="resume-tag text-[11.5px] text-ink-2 rounded-md bg-bg-soft border border-rule px-2 py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="break-inside-avoid">
            <SectionTitle>Education</SectionTitle>
            <ul className="space-y-3">
              {education.map((e) => (
                <li key={e.institution}>
                  <div className="text-[14px] font-medium text-ink">
                    {e.institution}
                  </div>
                  <div className="text-[13px] text-ink-2">{e.degree}</div>
                  <div className="text-[12px] text-ink-3">{e.year}</div>
                </li>
              ))}
            </ul>
          </section>

          {/* Selected speaking */}
          <section className="break-inside-avoid">
            <SectionTitle>Selected Speaking</SectionTitle>
            <ul className="space-y-2.5">
              {talks.map((t) => (
                <li key={`${t.event}-${t.date}`}>
                  <div className="text-[13.5px] font-medium text-ink">
                    {t.event}
                    <span className="font-normal text-ink-3"> · {t.role}</span>
                  </div>
                  <div className="text-[12.5px] text-ink-2 leading-snug">
                    {t.topic}
                  </div>
                  <div className="text-[11.5px] text-ink-3">
                    {t.location} · {t.date}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* ── Full-width: Publications + Patents ── */}
      <section className="mt-14 break-inside-avoid">
        <SectionTitle>Publications</SectionTitle>
        <ol className="grid gap-x-14 gap-y-2.5 md:grid-cols-2 text-[12.5px] text-ink-2 leading-relaxed list-decimal pl-5">
          {publications.map((pub) => (
            <li key={pub.citation} className="pl-1">
              {pub.url ? (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {pub.citation}
                </a>
              ) : (
                pub.citation
              )}{" "}
              <span className="text-ink-3 italic">{pub.venue}.</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 break-inside-avoid">
        <SectionTitle>Patents</SectionTitle>
        <ul className="grid gap-x-14 gap-y-2 md:grid-cols-2 text-[12.5px] text-ink-2 leading-relaxed">
          {patents.map((p) => (
            <li key={p.number} className="pl-4 -indent-4">
              —{" "}
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {p.title}
                </a>
              ) : (
                p.title
              )}{" "}
              <span className="text-ink-3">
                ({p.number}, {p.office})
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
