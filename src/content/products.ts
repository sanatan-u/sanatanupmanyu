import type { Stage } from "./platforms";

export type Product = {
  name: string;
  stage?: Stage;
  url?: string;
  builtFor?: string;
  impact?: string;
  description: string;
  tags?: string[];
};

export const products: Product[] = [
  {
    name: "Neurological Biomarker Intelligence Platform",
    stage: "Engagement",
    tags: ["AI/ML", "Automation", "Full Stack"],
    builtFor: "Global pharmaceutical company",
    impact: "Multi-agent pipeline aggregating pricing, availability, and distributor intelligence for diagnostic kits across global markets",
    description:
      "Full-stack platform that collects, validates, and structures biomarker market intelligence — pricing, availability, and distributors — for neurological diagnostic kits worldwide. A six-layer, event-driven multi-agent pipeline pairs deep web research with schema-enforced LLM synthesis; every data point carries source lineage, a credibility rating, and a stated-vs-extrapolated confidence flag. Vision-first PDF extraction, resumable checkpointing, and a canonical-run batch model keep large refreshes auditable. Built on Next.js, Drizzle/PostgreSQL, and Inngest for event-driven orchestration.",
  },
  {
    name: "Rare-Disease Asset Screening (AlphaProspect Scout)",
    stage: "MVP",
    tags: ["AI/ML", "Full Stack", "Drug Discovery"],
    builtFor: "Specialty pharmaceutical company",
    impact: "Narrows a ~9,000-disease rare-disease universe to a ranked longlist and a provenance-backed asset shortlist",
    description:
      "External-innovation asset-screening dashboard on the AlphaMeld platform. A disease-first funnel narrows the ~9,000-disease rare-disease universe into a ranked longlist and a focused asset shortlist, with provenance on every score, gate, and number — deterministic and computed values kept visibly distinct from LLM-proposed-then-confirmed ones. A React 19 + TypeScript front end runs over a Hono API and PostgreSQL + pgvector for similarity search and entity resolution. Demonstrated on synthetic, illustrative data.",
  },
  {
    name: "Pipeline Alpha",
    stage: "Live",
    tags: ["Full Stack", "AI/ML", "FinTech"],
    url: "https://pipelinealpha.com",
    impact: "Tracks ~10,000 clinical-trial drugs and AI-predicts the catalysts that move small-cap biotech stocks",
    description:
      "Investment research platform for small/mid-cap NASDAQ biotechs where a single trial readout can move the stock 50%+. Syncs clinical-trial data (ClinicalTrials.gov, Clinical Navigator) with live stock and financials (Alpha Vantage), then runs LLM catalyst discovery and streaming AI predictions for upcoming readouts, PDUFA dates, partnerships, and conference events. Includes bulk catalyst briefings and an interactive research chat.",
  },
  {
    name: "QuriousRI",
    stage: "Live",
    tags: ["Full Stack", "Regulatory", "AI/ML"],
    url: "https://app.quriousri.com",
    builtFor: "Artixio Pvt Ltd",
    impact: "Regulatory intelligence plus CTD dossier authoring and per-section market-entry gap assessment across Modules 2–5 and 12+ agencies — FDA, EMA, PMDA, NMPA, Health Canada, MHRA, Swissmedic, and more",
    description:
      "Secure, role-based platform for pharma/biotech regulatory affairs teams to search, analyze, compare, and manage global drug and biologic approvals across pharmaceuticals, biologics, biosimilars, and generics. Beyond intelligence, it now carries two operational workstreams, both targeting Modules 2 through 5 of the CTD — Module 1 is deliberately out of scope, being country- and company-specific administrative content that does not transfer reliably between filings. CTD dossier preparation: AI-assisted authoring, with reproducibility tested and repeated so far on Module 2, the Quality Overall Summary, 3.2.P.1, and 3.2.P.3.3, and section coverage expanding across the remaining modules. Market-entry gap assessment: for a drug already approved in one market, the platform resolves, module by module and section by section, what a target market requires for that drug type and where those requirements diverge from the original filing. Underneath sit role-based dashboards, pathway and classification guides, a centralized guidelines library, expert Q&A, and LLM-powered document analysis.",
  },
  {
    name: "Secondary Research Automation",
    stage: "Engagement",
    tags: ["Automation", "AI/ML", "NLP"],
    impact: "Agent-orchestrated multi-step research, delivered to dashboard or Excel",
    description:
      "Fully agent-orchestrated, multi-step LLM process. Input parameters, run a series of LLM processes to extract information from the web, compile, and store in a dashboard or export to Excel.",
  },
  {
    name: "Booking System Platform",
    stage: "Engagement",
    tags: ["Full Stack", "SaaS"],
    impact: "Bespoke booking platform delivered end-to-end to client spec",
    description:
      "End-to-end booking and scheduling platform — custom-built to client specification with real-time availability, notifications, and management dashboard.",
  },
  {
    name: "Regulatory Intelligence for ArtiXio",
    stage: "Live",
    tags: ["AI/ML", "Regulatory", "Automation"],
    impact: "Auto-drafts submission dossiers for first-in-class device filings; opened a new non-pharma revenue channel",
    description:
      "AI assistant that mines global regulatory updates and auto-drafts submission dossiers; established a new non-pharma revenue channel.",
  },
];
