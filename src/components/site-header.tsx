"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { LogoMark } from "@/components/logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu on navigation. Adjusting state during render (rather
  // than in an effect) avoids an extra render pass with the stale menu open.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rule/60 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-4 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label={`${site.name} — home`}
        >
          <LogoMark size={28} />
          <span className="font-medium text-ink group-hover:text-accent transition-colors">
            {site.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <nav
            aria-label="Primary"
            className="flex items-center gap-5 text-[15px] text-ink-2"
          >
            {site.nav.map((n) => {
              const active =
                n.href === "/"
                  ? pathname === "/"
                  : pathname === n.href ||
                    pathname?.startsWith(`${n.href}/`);
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

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="p-2 -mr-2 text-ink-2 hover:text-accent transition-colors"
          >
            {open ? (
              <X size={22} strokeWidth={1.75} />
            ) : (
              <Menu size={22} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open ? (
        <nav
          aria-label="Mobile"
          className="md:hidden border-t border-rule bg-bg"
        >
          <ul className="flex flex-col px-6 py-4 gap-1">
            {site.nav.map((n) => {
              const active =
                n.href === "/"
                  ? pathname === "/"
                  : pathname === n.href ||
                    pathname?.startsWith(`${n.href}/`);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`block py-3 px-3 rounded-lg text-[17px] transition-colors ${
                      active
                        ? "text-accent font-medium bg-accent/5"
                        : "text-ink-2 hover:text-accent hover:bg-accent/5"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
