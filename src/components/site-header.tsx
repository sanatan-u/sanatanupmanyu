"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { LogoMark } from "@/components/logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-rule/60 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-4 flex items-center justify-between gap-6 flex-wrap">
        <Link href="/" className="flex items-center gap-3 group" aria-label={`${site.name} — home`}>
          <LogoMark size={28} />
          <span className="font-medium text-ink group-hover:text-accent transition-colors">
            {site.name}
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <nav aria-label="Primary" className="flex items-center gap-5 text-[15px] text-ink-2">
            {site.nav.map((n) => {
              const active =
                n.href === "/"
                  ? pathname === "/"
                  : pathname === n.href || pathname?.startsWith(`${n.href}/`);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`hover:text-accent transition-colors ${
                    active ? "text-ink font-medium" : ""
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
