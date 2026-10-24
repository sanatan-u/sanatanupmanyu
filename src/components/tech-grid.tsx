import { Cloud } from "lucide-react";
import {
  siDocker,
  siLangchain,
  siNeo4j,
  siNextdotjs,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siTypescript,
} from "simple-icons";
import { site } from "@/content/site";

/**
 * The tech stack drawn as an architecture: four layers from what users touch
 * down to where it runs, with the two languages as a spine alongside every
 * layer. Same visual language as the project diagrams: bg-soft panel, faint
 * dot grid, teal for the system, dashed ticks for "alongside".
 *
 * Server component, so the icon library never reaches the client bundle.
 */

type Icon = { path: string } | "cloud";
type Tech = { name: string; role: string; icon: Icon };

// Descriptors say what each tool is, not how much it was used.
const TECH: Record<string, Omit<Tech, "name">> = {
  Python: { role: "Data and ML", icon: siPython },
  TypeScript: { role: "Web apps and APIs", icon: siTypescript },
  React: { role: "UI library", icon: siReact },
  "Next.js": { role: "Web framework", icon: siNextdotjs },
  PyTorch: { role: "Deep learning", icon: siPytorch },
  LangChain: { role: "LLM orchestration", icon: siLangchain },
  PostgreSQL: { role: "Relational database", icon: siPostgresql },
  Neo4j: { role: "Graph database", icon: siNeo4j },
  AWS: { role: "Cloud", icon: "cloud" },
  Docker: { role: "Containers", icon: siDocker },
};

const SPINE = ["Python", "TypeScript"];
const LAYERS: { name: string; sub: string; items: string[] }[] = [
  { name: "Interface", sub: "What users touch", items: ["React", "Next.js"] },
  { name: "Intelligence", sub: "Models and agents", items: ["PyTorch", "LangChain"] },
  { name: "Data", sub: "Stores and graphs", items: ["PostgreSQL", "Neo4j"] },
  { name: "Infrastructure", sub: "Where it runs", items: ["AWS", "Docker"] },
];

const tech = (name: string): Tech => ({ name, ...TECH[name] });

function Mark({ icon }: Readonly<{ icon: Icon }>) {
  if (icon === "cloud") return <Cloud size={20} strokeWidth={1.6} aria-hidden />;
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}

function Tile({ t }: Readonly<{ t: Tech }>) {
  return (
    <li className="group flex flex-col items-start gap-2.5 rounded-xl border border-rule bg-bg p-3 transition-colors hover:border-accent/50 sm:flex-row sm:items-center sm:gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/8 text-ink-2 transition-colors group-hover:bg-accent/15 group-hover:text-accent">
        <Mark icon={t.icon} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-tight text-ink">{t.name}</span>
        <span className="block text-xs text-ink-3 mt-0.5">{t.role}</span>
      </span>
    </li>
  );
}

export function TechGrid() {
  // Anything added to site.techStack without a layer still shows, in the last row.
  const placed = new Set([...SPINE, ...LAYERS.flatMap((l) => l.items)]);
  const extra = site.techStack.filter((t) => !placed.has(t) && TECH[t]);
  const layers = extra.length
    ? [...LAYERS, { name: "Also", sub: "Other tools", items: extra }]
    : LAYERS;

  return (
    <div className="tech-stack rounded-[24px] bg-bg-soft p-4 sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
        {/* Languages spine */}
        <div className="rounded-2xl border border-dashed border-accent/45 bg-accent/5 p-4 lg:flex lg:flex-col lg:justify-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Languages
          </div>
          <div className="text-xs text-ink-3 mt-0.5 mb-4">Across every layer</div>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {SPINE.map((n) => (
              <Tile key={n} t={tech(n)} />
            ))}
          </ul>
        </div>

        {/* Layers, top to bottom */}
        <ol className="grid">
          {layers.map((layer, i) => (
            <li
              key={layer.name}
              className={`tech-layer relative grid gap-3 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center sm:gap-6 ${
                i > 0 ? "border-t border-rule" : ""
              }`}
            >
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                  {layer.name}
                </div>
                <div className="text-xs text-ink-3 mt-0.5">{layer.sub}</div>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {layer.items.map((n) => (
                  <Tile key={n} t={tech(n)} />
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
