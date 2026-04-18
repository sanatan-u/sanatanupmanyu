import type { Metadata } from "next";
import { publications, patents } from "@/content/publications";

export const metadata: Metadata = { title: "Publications & Patents" };

export default function PublicationsPage() {
  return (
    <div className="mx-auto max-w-[880px] px-6 md:px-12 pt-12 pb-8">
      <h1 className="display text-[clamp(2rem,4.5vw,3.5rem)] mb-6">
        Publications.
      </h1>
      <p className="text-[17px] leading-[1.65] text-ink-2 max-w-[62ch] mb-12">
        Peer-reviewed work and granted patents in AI for drug discovery,
        immuno-oncology, and molecular biology.
      </p>
      <section>
        <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mb-6">Papers</h2>
        <ol className="space-y-6">
          {publications.map((p, i) => (
            <li key={i} className="border-t border-rule pt-4 grid md:grid-cols-[60px_1fr] gap-4">
              <div className="text-sm text-ink-3">{p.year}</div>
              <div>
                <p className="text-[15px] text-ink-2 leading-relaxed">{p.citation}</p>
                <div className="text-sm text-ink-3 italic mt-1">{p.venue}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-16">
        <h2 className="display text-[clamp(1.5rem,2.5vw,2rem)] mb-6">Patents</h2>
        <ul className="space-y-6">
          {patents.map((p) => (
            <li key={p.number} className="border-t border-rule pt-4 grid md:grid-cols-[140px_1fr] gap-4">
              <div className="text-sm text-ink-3">{p.number}</div>
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-ink-3 mt-1">{p.office}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
