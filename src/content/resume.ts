// Single composition point for the résumé.
//
// Everything here is derived from the same content files that drive the rest of
// the site (experience, education, publications, platforms, …). Edit those and
// the /resume page and the generated /resume.pdf both update together. Only the
// fields that are genuinely résumé-specific (summary, scope band, competency
// matrix, curated selected work, full toolset, contact block) live in this file.

import { site } from "./site";
import { experience, education, type Role } from "./experience";
import { publications, patents } from "./publications";
import { platforms, type Platform } from "./platforms";
import { products } from "./products";
import { talks } from "./speaking";

export const resumeContact = {
  name: site.name,
  label:
    "AI for Biomedicine — Hypothesis to Patient · Platform & Data-Science Executive · GenAI · Knowledge Graphs · Regulatory AI",
  location: site.location,
  email: site.emails.personal,
  linkedin: site.linkedin,
  website: site.url,
} as const;

export const resumeSummary =
  "Data-science and technology executive with 18+ years spanning wet-lab biology, AI/ML engineering, and cross-border leadership across pharma, biotech, and consumer health. Currently holds three concurrent executive mandates — co-founder at Apxora, site head and head of data sciences for AlphaMeld's Basel operation, and CTO at Artixio — with ownership of technology strategy, org building, and P&L-level delivery in each. Architected the AlphaMeld® Operating System, which compresses hypothesis-to-insight cycles from months to weeks, and built QuriousRI from concept into a regulatory platform that now performs CTD dossier authoring and per-section market-entry gap assessment across Modules 2–5 and 12+ agencies. Differentiated by the rare combination of bench-level molecular biology, production AI engineering, and regulatory fluency — the span required to take a decision from target hypothesis through trial design to a filed dossier.";

export type ScopeItem = { label: string; value: string };

/** Executive scope band — the at-a-glance facts a hiring board reads first. */
export const resumeScope: ScopeItem[] = [
  {
    label: "Executive Scope",
    value:
      "Co-Founder (Apxora) · Site Head & Head of Data Sciences, Basel (AlphaMeld) · CTO (Artixio) · Advisory board seat (RenaissThera)",
  },
  {
    label: "Org & Ventures",
    value:
      "2 companies co-founded · Basel site P&L and delivery accountability · data-science teams built and led since 2010",
  },
  {
    label: "Products Shipped",
    value:
      "5+ production platforms · 12 ML models in production · regulatory coverage across 12+ global agencies",
  },
  {
    label: "Client Base",
    value:
      "Publicly announced collaborations with Kyowa Kirin, Shionogi, GSK Consumer Healthcare, and Ono Pharmaceutical · further engagements with top-tier global pharma (confidential)",
  },
  {
    label: "Evidence & Standing",
    value:
      "2 patents · 5 peer-reviewed publications · invited speaker and panelist at industry forums (Web Summit, Microsoft AI Tour, GlobalBioIndia)",
  },
  {
    label: "Domain Span",
    value:
      "Target discovery → MOA & target validation → trial design and digital twins → regulatory dossier and market entry",
  },
];

export type Competency = { label: string; items: string[] };

export const resumeCompetencies: Competency[] = [
  {
    label: "Executive Leadership",
    items: [
      "P&L & site management",
      "Org building & hiring",
      "Cross-border teams",
      "Board & advisory",
      "Change management",
    ],
  },
  {
    label: "Strategy & Commercial",
    items: [
      "Product vision & roadmap",
      "Client & partner engagement",
      "Business-development enablement",
      "New revenue channels",
      "Agile delivery",
    ],
  },
  {
    label: "AI/ML & Data Science",
    items: [
      "GenAI & LLM-RAG",
      "Agentic workflows",
      "Knowledge graphs",
      "Predictive modelling",
      "Causal inference",
      "NLP",
    ],
  },
  {
    label: "Drug Development & Regulatory",
    items: [
      "CTD dossier authoring & gap assessment",
      "FDA / EMA / ICH standards",
      "Clinical-trial optimisation",
      "Digital twins",
      "MOA & target validation",
      "Omics & real-world data",
    ],
  },
];

export const resumeToolset: string[] = [
  "Python",
  "R",
  "TypeScript",
  "React",
  "Next.js",
  "LLMs & RAG",
  "Agentic AI",
  "NLP",
  "LangChain",
  "PyTorch",
  "spaCy",
  "Neo4j",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
];

// ── Curated selected work ───────────────────────────────────────────────────
// The /work page shows everything at full length. The résumé shows the handful
// of systems that best evidence executive scope and business impact, in a
// deliberate order and at résumé length. Entries are pulled by name from the
// canonical content files so name, stage, and impact never drift from the rest
// of the site; only the description may be tightened for the one-page format.
const pick = (
  list: readonly { name: string; stage?: string; impact?: string; description: string }[],
  name: string,
  description?: string,
): Platform => {
  const found = list.find((item) => item.name === name);
  if (!found) throw new Error(`Résumé selected work: unknown entry "${name}"`);
  return { ...found, description: description ?? found.description } as Platform;
};

export const resumeSelectedWork: Platform[] = [
  pick(
    platforms,
    "AlphaMeld® Operating System",
    "End-to-end AI stack — Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis, and AlphaClinMeld over 12 ML models (NER, relation extraction, evidence scoring, digital-twin trial predictors, landscape assessment) on PostgreSQL + Neo4j with self-hosted LLM APIs.",
  ),
  pick(
    products,
    "QuriousRI",
    "Secure role-based regulatory platform for pharma and biotech affairs teams, built from concept as CTO. Beyond search and comparison of global approvals, it drives CTD dossier authoring and per-section gap assessment across Modules 2 through 5 — Module 1 deliberately excluded as non-transferable country- and company-specific content — telling a sponsor exactly how a target market's requirements diverge from an existing filing. Reproducibility tested and repeated to date on Module 2, the Quality Overall Summary, 3.2.P.1, and 3.2.P.3.3.",
  ),
  pick(platforms, "AlphaCompass Portfolio Intelligence"),
  pick(
    platforms,
    "SequenceFlow® ResearchNexus & Clinical Navigator",
    "End-to-end AI stack combining Knowledge Graph, clinical-trial prediction, literature analysis, patient digital twins, TPP and TOP, with 12 ML models on PostgreSQL + Neo4j and self-hosted LLM APIs.",
  ),
  pick(
    platforms,
    "Discovery Navigator",
    "Guided hypothesis-generation platform on the AlphaMeld Knowledge Graph, supporting disease-first, target-first, indication-expansion, and combination-therapy entry points through a project → exploration → agent scoring → ranking workflow. Multi-tenant SaaS with SSO, RBAC, and audit logging.",
  ),
  pick(
    platforms,
    "Digital Twins for Systemic Sclerosis (EUSTAR)",
    "Digital-twin framework over a 23,000+ patient, 200+ center systemic sclerosis registry. A PyTorch deep/generative stack produces prognostic scores and synthetic placebo trajectories — an ML-generated digital control arm that lifts trial power and cuts sample size, aligned with FDA digital-twin and EMA/ICH MIDD guidance.",
  ),
  pick(platforms, "ChatAlphaMeld Benchmark Suite"),
];

// Re-export the raw content the page and PDF render directly, so they import
// everything résumé-related from one module.
export { experience, education, publications, patents, platforms, talks };
export type { Role };
