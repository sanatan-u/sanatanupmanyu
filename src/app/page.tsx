import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { SocialRow } from "@/components/social-row";
import { platforms } from "@/content/platforms";

export default function HomePage() {
  const featured = platforms.slice(0, 3);
  return (
    <div className="mx-auto max-w-[1040px] px-6 md:px-12 pt-12 pb-8">
      <section className="grid md:grid-cols-[1fr_320px] gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <h1 className="display text-[clamp(2.75rem,6.5vw,5rem)] mb-6">
            Hi, I&rsquo;m <em>Sanatan</em>.
          </h1>
          <div className="prose text-[18px] leading-[1.65] text-ink-2 max-w-[56ch] mb-6">
            <p>{site.tagline}</p>
            <p>{site.currently}</p>
          </div>
          <div className="text-sm text-ink-3 mb-7">{site.statsInline}</div>
          <SocialRow />
        </div>
        <div className="order-1 md:order-2">
          <Image
            src="/sanatan-square.jpg"
            alt="Sanatan Upmanyu"
            width={560}
            height={560}
            priority
            className="w-full h-auto rounded-[28px] shadow-[0_2px_30px_rgba(0,0,0,0.08)]"
          />
        </div>
      </section>

      <section className="mt-28 pt-12 border-t border-rule">
        <div className="flex items-baseline justify-between mb-10 flex-wrap gap-3">
          <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)]">
            Selected <em>work</em>
          </h2>
          <Link
            href="/work"
            className="text-sm text-ink-2 hover:text-accent inline-flex items-center gap-1"
          >
            all work <ArrowRight size={14} strokeWidth={1.75} />
          </Link>
        </div>
        <ul className="grid md:grid-cols-3 gap-10">
          {featured.map((p) => (
            <li key={p.name}>
              <h3 className="font-medium text-lg mb-2">{p.name}</h3>
              {p.impact ? (
                <div className="text-sm text-signal mb-3">{p.impact}</div>
              ) : null}
              <p className="text-[15px] text-ink-2 leading-relaxed">
                {p.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-28 pt-12 border-t border-rule">
        <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)] mb-5">
          Work <em>together</em>
        </h2>
        <p className="text-[17px] text-ink-2 mb-7 max-w-[60ch]">
          Advisory engagements, speaking invitations, and technical consulting
          for pharma, biotech, and consumer health.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-ink font-medium"
        >
          Get in touch <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </section>
    </div>
  );
}
