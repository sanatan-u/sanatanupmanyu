export type Stage = "Live" | "Early access" | "MVP" | "Research" | "Engagement";

export type Platform = {
  name: string;
  stage?: Stage;
  impact?: string;
  description: string;
  url?: string;
  tags?: string[];
};

export const platforms: Platform[] = [
  {
    name: "AlphaMeld® Operating System",
    stage: "Live",
    tags: ["AI/ML", "Full Stack", "Knowledge Graph"],
    impact: "Compresses hypothesis-to-insight cycles from months to weeks, varying by disease area",
    url: "https://alphameld.com",
    description:
      "End-to-end biomedical AI platform. A daily literature pipeline (PubMed, PMC, Semantic Scholar, GEO) runs transformer NER, relation extraction, entity linking and evidence-level classification (spaCy, PubMedBERT) on RabbitMQ workers, building a knowledge graph on DozerDB (Neo4j) and PostgreSQL. A FastAPI and MCP API serves that graph to the product modules (Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis, AlphaClinMeld) and to Discovery Navigator, alongside HINT graph-neural-network trial-outcome predictors and frontier LLMs (GPT, Claude, Gemini) routed through OpenRouter.",
  },
  {
    name: "Discovery Navigator",
    stage: "Live",
    tags: ["AI/ML", "Full Stack", "Drug Discovery"],
    impact: "Hypothesis landscaping compressed from weeks to hours, with traceable evidence at every step",
    url: "https://discovery.alphameld.com",
    description:
      "Guided drug-discovery hypothesis-generation platform built on the AlphaMeld Knowledge Graph. Supports four starting points — disease-first, target-first, indication expansion, and combination therapy — through a step-by-step workflow (project → config → exploration → agent scoring → ranking → hypotheses). A project-aware Discovery Copilot accompanies every step. Multi-tenant SaaS with SSO, RBAC, and audit logging.",
  },
  {
    name: "ChatAlphaMeld Benchmark Suite",
    stage: "Research",
    tags: ["AI/ML", "NLP", "Automation"],
    impact: "97.34% accuracy on 188-question ACM benchmark",
    url: "https://www.inveniai.com/press-detail.php?id=22",
    description:
      "Two agentic workflow engines fine-tuned on biomedical tasks; outperformed leading general-purpose frontier LLMs; delivered richer step-by-step rationales critical for complex clinical questions.",
  },
  {
    name: "SequenceFlow® ResearchNexus & Clinical Navigator",
    stage: "Live",
    tags: ["AI/ML", "Full Stack", "Clinical Trials"],
    impact: "6+ integrated modules",
    description:
      "Asset-lifecycle intelligence platform for pharma. An Angular front end reads a multi-schema PostgreSQL warehouse through PostgREST, fed by Python pipelines for ClinicalTrials.gov (AACT), drug ontologies, Mondo and HPO, Orphanet, German G-BA HTA decisions and drug pricing. FastAPI model services add clinical-trial outcome prediction (a HINT graph neural network in PyTorch), phase-transition prediction, HTA analog search, epidemiology and CVAE patient digital twins. Its successor, Clinical Navigator, is being rebuilt on React, NestJS, Prisma and BullMQ.",
  },
  {
    name: "AlphaCompass Portfolio Intelligence",
    stage: "Live",
    tags: ["AI/ML", "Data Science", "Drug Discovery"],
    impact: "Standardized indication-prioritization across 200 active programs",
    description:
      "Clinical-trial–centric portfolio-intelligence SaaS in the AlphaMeld® suite; benchmarks pipeline assets and quantifies comparative risk. Adopted by two BD teams within six months, standardizing evidence-based indication-prioritization across 200 active programs.",
  },
  {
    name: "Digital Twins for Systemic Sclerosis (EUSTAR)",
    stage: "Research",
    tags: ["AI/ML", "Clinical Trials", "Deep Learning"],
    impact: "In-silico control arms over a 23,000+ patient, 200+ center systemic sclerosis registry",
    description:
      "Outcome-focused digital-twin framework built on the EUSTAR systemic sclerosis registry — longitudinal records for 23,000+ patients across 200+ centers. A PyTorch deep/generative stack (a mask- and time-aware GRU-D sequence forecaster plus a conditional sequence-VAE twin generator) produces prognostic scores and synthetic placebo trajectories for organ-specific and composite clinical outcomes. Designed as an ML-generated digital control arm — a PROCOVA/ANCOVA covariate that lifts trial power and cuts sample size — aligned with FDA digital-twin and EMA/ICH MIDD guidance.",
  },
  {
    name: "Clinical-Trial Digital Twins",
    stage: "Research",
    tags: ["AI/ML", "Clinical Trials", "Deep Learning"],
    impact: "In-silico placebo arms demonstrated for Phase II Type 2 Diabetes trials",
    description:
      "Conditional variational auto-encoder (CVAE) pipeline that synthesizes patient-level digital twins for Phase II Type 2 Diabetes trials. Generated matched placebo trajectories and predicted drug-response curves — proving feasibility of in-silico arms for protocol optimization and hypothesis testing.",
  },
];
