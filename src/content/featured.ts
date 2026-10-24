import { platforms } from "./platforms";
import { products } from "./products";
import { projectDiagrams, type ProjectDiagram } from "./project-diagrams";

export type FeaturedProject = {
  slug: string;
  name: string;
  stage?: string;
  domain?: string;
  impact?: string;
  description: string;
  url?: string;
  diagram: ProjectDiagram;
};

// Featured order is a deliberate choice: Discovery Navigator leads, AlphaMeld closes.
const FEATURED: { slug: string; name: string }[] = [
  { slug: "discovery-navigator", name: "Discovery Navigator" },
  { slug: "quriousri", name: "QuriousRI" },
  { slug: "pipeline-alpha", name: "Pipeline Alpha" },
  { slug: "alphameld", name: "AlphaMeld® Operating System" },
];

export const featuredNames = FEATURED.map((f) => f.name);

export function getFeaturedProjects(): FeaturedProject[] {
  const all = [...platforms, ...products];
  return FEATURED.map(({ slug, name }) => {
    const p = all.find((x) => x.name === name);
    if (!p) throw new Error(`Featured project not found: ${name}`);
    return {
      slug,
      name: p.name,
      stage: p.stage,
      domain: p.tags?.find((t) => t !== "AI/ML" && t !== "Full Stack"),
      impact: p.impact,
      description: p.description,
      url: p.url,
      diagram: projectDiagrams[slug],
    };
  });
}
