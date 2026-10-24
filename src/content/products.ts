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
      "External-innovation asset-screening dashboard on the AlphaMeld platform. A disease-first funnel narrows the ~9,000-disease rare-disease universe into a ranked longlist and a focused asset shortlist, with provenance on every score, gate, and number — deterministic and computed values kept visibly distinct from LLM-proposed-then-confirmed ones. A React 19 + TypeScript front end runs over a Hono API and PostgreSQL via Prisma. Demonstrated on synthetic, illustrative data.",
  },
  {
    name: "Pipeline Alpha",
    stage: "Live",
    tags: ["Full Stack", "AI/ML", "FinTech"],
    url: "https://pipelinealpha.com",
    impact: "Tracks ~10,000 clinical-trial drugs and AI-predicts the catalysts that move small-cap biotech stocks",
    description:
      "Investment research platform for small/mid-cap NASDAQ biotechs, where a single trial readout can move a stock 50%+. A nightly nine-stage pipeline syncs companies, assets and events from Clinical Navigator with ClinicalTrials.gov and market data (Alpha Vantage, Yahoo Finance, Finnhub, SerpAPI), runs LLM catalyst discovery and milestone prediction, and derives trading signals. On demand, four specialist agents feed a critic, a bull/bear debate with memory and an LLM judge, streaming per-event predictions and a five-tier company outlook. Around it sit a catalyst calendar, bulk briefings, a screener built from configurable scouts, smart-money tracking of VC holdings and Congress trades, AI paper-trading simulations, a research chat, and a projections hub that grades every prediction against the actual price move.",
  },
  {
    name: "QuriousRI",
    stage: "Live",
    tags: ["Full Stack", "Regulatory", "AI/ML"],
    url: "https://app.quriousri.com",
    builtFor: "Artixio Pvt Ltd",
    impact: "Regulatory intelligence, product registers and patents in one platform, plus reference-product search, per-section gap assessment and CTD authoring for generic filings",
    description:
      "Secure regulatory-intelligence platform for pharma and biotech regulatory teams. A Regulatory Explorer and AI assistant search agency guidelines and announcements with full text, translations and cited answers, while analytics and a weekly regulatory brief track activity by market. Databases cover national product registers, market landscapes, US Orange Book and Purple Book patents and exclusivity, cross-market matrices and company portfolios. For generic filings, an RLD Finder identifies the reference product in each target market, Gap Assessment judges a held dossier section by section against target-market rules, and Dossier Authoring drafts CMC sections in a live co-editing editor with eCTD export, evaluated so far against expert gold standards for 2.3.S, 3.2.P.1 and 3.2.P.3.3. A Report Builder researches documents from a shared evidence ledger, and My Products flags which regulatory changes affect each product now, later or not yet. English and Japanese, with SSO, MFA, passkeys and a tamper-evident audit trail.",
  },
  {
    name: "SafetyIQ",
    stage: "Live",
    tags: ["Regulatory", "Full Stack", "AI/ML"],
    url: "https://safetyiq.artixio.com",
    impact: "Medicine and medical-device safety intelligence for Africa, built on regulator alerts from Nigeria's NAFDAC and South Africa's SAHPRA",
    description: "Pharmaceutical and medical-device safety intelligence platform for Africa. Python pipelines scrape regulator alerts from NAFDAC (Nigeria) and SAHPRA (South Africa), extract structured fields with an LLM, and resolve the same company across sources with ML-based de-duplication. The web app — Next.js, tRPC and Prisma over a multi-schema PostgreSQL database — provides role-based dashboards, company watchlists, notifications, exports and an AI research assistant with live web search. Installable as a progressive web app, with NextAuth sign-in and passkeys.",
  },
  {
    name: "Rediscovery: Essential-Tremor Drug Repurposing",
    stage: "Engagement",
    tags: ["Drug Discovery", "Knowledge Graph", "AI/ML"],
    builtFor: "Specialty pharmaceutical company",
    impact: "Assembles a verified disease graph for essential tremor, then screens 1,280 marketed medicines toward a repurposing shortlist",
    description: "Single-purpose drug-repurposing application for essential tremor. Stage 1 assembles the disease — its circuit, druggable targets with a direction of effect, the endpoints its phenotypes are measured at, and neighbouring diseases ranked by shared circuit genes — from the AlphaMeld knowledge graph, PubMed, ClinicalTrials.gov and model-grounded web search, with every relationship verified and a person signing off. Stage 2 screens marketed medicines through six checks, brain-exposure estimates (RDKit, ADMET-AI) and translation dossiers. FastAPI and PostgreSQL behind a Next.js interface, with a calibration harness and a full audit log.",
  },
  {
    name: "BRANE",
    stage: "Live",
    tags: ["Full Stack", "SaaS", "Automation"],
    url: "https://branes.artixio.com",
    impact: "One white-label platform for CRM, proposals, projects, timesheets, invoicing and HR, re-skinnable per tenant",
    description: "White-label CRM and operations platform for consultancies: clients, opportunities, proposals, agreements, projects and timesheets, invoicing, vendor bills and payments, leave and salary, under an organisation-level RBAC layer, with an AI assistant routed through OpenRouter. Each tenant re-skins the app with its own logo, colours, themes, name and code prefixes. TypeScript end to end in a pnpm and Turborepo monorepo: NestJS 11 and Prisma 7 over PostgreSQL, pg-boss background jobs, and a Vite + React 19 client.",
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
