import { site } from "@/content/site";

const icons: Record<string, string> = {
  Python: "🐍",
  TypeScript: "TS",
  React: "⚛",
  "Next.js": "▲",
  PostgreSQL: "🐘",
  Neo4j: "◉",
  AWS: "☁",
  Docker: "🐳",
  PyTorch: "🔥",
  LangChain: "🔗",
};

export function TechGrid() {
  return (
    <ul className="flex flex-wrap gap-3">
      {site.techStack.map((t) => (
        <li
          key={t}
          className="inline-flex items-center gap-2 rounded-lg border border-rule bg-bg-soft/50 px-4 py-2 text-sm text-ink-2 transition-colors hover:border-accent/40 hover:text-accent"
        >
          <span className="text-base leading-none" aria-hidden>
            {icons[t] ?? "·"}
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}
