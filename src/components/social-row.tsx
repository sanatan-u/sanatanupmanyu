import { Mail } from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/brand-icons";
import { site } from "@/content/site";

export function SocialRow() {
  const items = [
    {
      href: `mailto:${site.emails.personal}`,
      label: "Email",
      icon: <Mail size={20} strokeWidth={1.5} aria-hidden />,
    },
    {
      href: site.linkedin,
      label: "LinkedIn",
      icon: <LinkedinIcon size={20} />,
    },
    {
      href: site.github,
      label: "GitHub",
      icon: <GithubIcon size={20} />,
    },
  ];

  return (
    <ul className="flex items-center gap-6 text-ink-2">
      {items.map((it) => (
        <li key={it.label}>
          <a
            href={it.href}
            target={it.href.startsWith("http") ? "_blank" : undefined}
            rel={it.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={it.label}
            className="inline-flex items-center gap-2 hover:text-accent transition-colors"
          >
            {it.icon}
            <span className="sr-only md:not-sr-only md:text-sm">{it.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
