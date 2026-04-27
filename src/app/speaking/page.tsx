import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { talks } from "@/content/speaking";

export const metadata: Metadata = {
  title: "Speaking",
  alternates: { canonical: "/speaking" },
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
        <section key={year} className="mb-14">
          <h2 className="display text-2xl mb-4 text-ink-3">{year}</h2>
          <ul className="space-y-6">
            {grouped[year].map((t, i) => (
              <li key={i} className="border-t border-rule pt-4">
                <div className="font-medium">{t.event}</div>
                <div className="text-[15px] text-ink-2 mt-1">{t.topic}</div>
                <div className="text-sm text-ink-3 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <span>{t.role}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} strokeWidth={1.75} aria-hidden />
                    {t.location}
                  </span>
                  <span>{t.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
