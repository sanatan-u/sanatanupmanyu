import Link from "next/link";
import { site } from "@/content/site";

const techStack = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "PostgreSQL",
  "Neo4j",
  "AWS",
  "Docker",
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-rule">
      <div className="mx-auto max-w-[1040px] px-6 md:px-12 py-12 grid gap-8 md:grid-cols-[1fr_auto] items-start">
        <div>
          <div className="text-ink-3 text-sm mb-3">Toolset</div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-2">
            {techStack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm text-ink-2">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-accent">
              {n.label}
            </Link>
          ))}
          <a href="/feed.xml" className="hover:text-accent">rss</a>
        </nav>
      </div>
      <div className="mx-auto max-w-[1040px] px-6 md:px-12 pb-10 text-sm text-ink-3 flex flex-wrap justify-between gap-4">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.location}</span>
      </div>
    </footer>
  );
}
