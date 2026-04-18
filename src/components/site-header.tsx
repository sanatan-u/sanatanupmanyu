import Link from "next/link";
import { site } from "@/content/site";
import { LogoMark } from "@/components/logo-mark";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-[1040px] px-6 md:px-12 pt-8 pb-4 flex items-center justify-between gap-6 flex-wrap">
        <Link href="/" className="flex items-center gap-3 group">
          <LogoMark size={32} />
          <span className="font-medium text-ink group-hover:text-accent transition-colors">
            {site.name}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-[15px] text-ink-2">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hover:text-accent transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
