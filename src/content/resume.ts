// Single composition point for the résumé.
//
// Everything here is derived from the same content files that drive the rest of
// the site (experience, education, publications, platforms, …). Edit those and
// the /resume page and the generated /resume.pdf both update together. Only the
// fields that are genuinely résumé-specific (summary, competency matrix, full
// toolset, contact block) live in this file.

import { site } from "./site";
import { experience, education, type Role } from "./experience";
import { publications, patents } from "./publications";
import { platforms } from "./platforms";
import { talks } from "./speaking";

export const resumeContact = {
  name: site.name,
  label:
    "AI for Biomedicine — Hypothesis to Patient · GenAI · LLM-RAG · Knowledge Graphs · Digital Twins",
  location: site.location,
  email: site.emails.personal,
  linkedin: site.linkedin,
  website: site.url,
} as const;

export const resumeSummary =
  "Data-science executive with 18+ years spanning wet-lab biology, AI/ML engineering, and cross-site leadership across pharma, biotech, and consumer health. Architect of the AlphaMeld™ platform — an end-to-end AI stack that accelerates target triage and indication selection for global drug-makers. Deep experience in clinical-trial design and enrollment prediction, digital-twin modelling, and large-scale knowledge-graph analytics. Known for converting multimodal data into real business value, scaling cross-functional teams, and forging industry partnerships that redefine R&D.";

export type Competency = { label: string; items: string[] };

export const resumeCompetencies: Competency[] = [
  {
    label: "Leadership & Strategy",
    items: [
      "P&L & site management",
      "Product vision",
      "Agile delivery",
      "Partner & client engagement",
    ],
  },
  {
    label: "AI/ML & Data Science",
    items: [
      "GenAI & LLM-RAG",
      "Agentic workflows",
      "Predictive modelling",
      "Graph analytics",
      "NLP",
      "Causal inference",
    ],
  },
  {
    label: "Life Sciences & Health",
    items: [
      "Clinical-trial optimisation",
      "MOA & target validation",
      "Omics integration",
      "Real-world data",
      "Regulatory intelligence",
    ],
  },
  {
    label: "Cross-Functional Excellence",
    items: [
      "Team mentoring",
      "Stakeholder storytelling",
      "Change management",
      "Regulatory awareness",
    ],
  },
];

export const resumeToolset: string[] = [
  "Python",
  "R",
  "TypeScript",
  "React",
  "Next.js",
  "Neo4j",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "PyTorch",
  "LangChain",
  "spaCy",
  "BERT",
  "Tableau",
  "Power BI",
  "Metabase",
  "Git",
  "CI/CD",
];

// Re-export the raw content the page and PDF render directly, so they import
// everything résumé-related from one module.
export { experience, education, publications, patents, platforms, talks };
export type { Role };
