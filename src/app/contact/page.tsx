import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { LinkedinIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch for advisory engagements, consulting, speaking invitations, or collaboration in pharma, biotech, and AI.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Sanatan Upmanyu",
    description:
      "Advisory, consulting, speaking, or collaboration. Basel, Switzerland.",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 pt-12 pb-8">
      <h1 className="display text-[clamp(2rem,4.5vw,3.5rem)] mb-6">
        Let&rsquo;s <em>talk</em>.
      </h1>
      <p className="text-[17px] leading-[1.65] text-ink-2 max-w-[62ch] mb-12">
        Advisory, consulting, speaking, or collaboration. I usually reply
        within two working days.
      </p>

      {/* Mobile: contact info first, form second. Desktop: form + sidebar */}
      <aside className="md:hidden space-y-4 text-[15px] text-ink-2 mb-10 rounded-xl border border-rule bg-bg-soft/40 p-5">
        <div className="flex items-center gap-3">
          <Mail size={18} strokeWidth={1.5} className="text-ink-3 shrink-0" aria-hidden />
          <div>
            <a href={`mailto:${site.emails.personal}`} className="block hover:text-accent">
              {site.emails.personal}
            </a>
            <a href={`mailto:${site.emails.work}`} className="block hover:text-accent text-ink-3 text-sm">
              {site.emails.work}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-ink-3 shrink-0"><LinkedinIcon size={16} /></span>
          <a href={site.linkedin} className="hover:text-accent" target="_blank" rel="noopener noreferrer">
            {site.linkedinLabel}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={18} strokeWidth={1.5} className="text-ink-3 shrink-0" aria-hidden />
          <div>{site.location}</div>
        </div>
      </aside>

      <div className="grid md:grid-cols-[1fr_220px] gap-12">
        <ContactForm />
        <aside className="hidden md:block space-y-5 text-[15px] text-ink-2 border-l border-rule pl-8">
          <div className="flex items-start gap-3">
            <Mail size={18} strokeWidth={1.5} className="mt-1 text-ink-3 shrink-0" aria-hidden />
            <div>
              <a href={`mailto:${site.emails.personal}`} className="block hover:text-accent">
                {site.emails.personal}
              </a>
              <a href={`mailto:${site.emails.work}`} className="block hover:text-accent text-ink-3 text-sm">
                {site.emails.work}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 text-ink-3 shrink-0"><LinkedinIcon size={16} /></span>
            <a href={site.linkedin} className="hover:text-accent" target="_blank" rel="noopener noreferrer">
              {site.linkedinLabel}
            </a>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} strokeWidth={1.5} className="mt-1 text-ink-3 shrink-0" aria-hidden />
            <div>{site.location}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
