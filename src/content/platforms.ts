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
      "End-to-end biomedical AI platform behind the AlphaMeld knowledge graph. A daily pipeline ingests PubMed, PMC and Semantic Scholar, classifies each article's evidence level (a PubMedBERT model) and runs transformer named-entity recognition, entity linking against 3.3M ontology concepts and sentence-level relation extraction on RabbitMQ workers, writing a daily evidence graph of every sentence and relation. Weekly builds aggregate and score it into a 492K-entity, ~26M-relationship graph on DozerDB (Neo4j) and PostgreSQL, with direct, association and directional scores. A read-only REST API and a 16-tool MCP server, gated by tiered evaluations on every deploy, serve it to Discovery Navigator, AI agents, Rediscovery and the original platform modules (Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis, AlphaClinMeld). A next-generation graph with whole-article, span-grounded and Biolink-aligned extraction is in R&D.",
  },
  {
    name: "Discovery Navigator",
    stage: "Live",
    tags: ["AI/ML", "Full Stack", "Drug Discovery"],
    impact: "Hypothesis landscaping compressed from weeks to hours, with traceable evidence at every step",
    url: "https://discovery.alphameld.com",
    description:
      "Drug-discovery platform on the AlphaMeld knowledge graph, organised as six workflows: Target Discovery, Indication Discovery, Safety Assessment, Hypothesis De-risking, Drug Repurposing and Biomarker Identification. Each designs its graph queries, validates every relationship at sentence level, runs agent-led assessments with live-verified citations from PubMed and ClinicalTrials.gov, and ends in ranked hypotheses, an organ-level risk report, a go/no-go dossier, a candidate matrix or a biomarker panel; any result can continue into another workflow, pre-filled. Alongside sit a project-aware Co-Pilot that plans research and builds charts and files, a 13-step Trial Designer with an approval gate on every step, power calculations, scenario comparison and benchmarking against registered trials, a Network Explorer, verified Custom Reports, a Literature Radar and a weekly digest. Exports to PDF, Word, Excel, PowerPoint and CSV carry the run ID, graph snapshot and model versions. Multi-tenant, with SSO, MFA and passkeys, five roles and audit logging.",
  },
  {
    name: "AlphaMeld Knowledge Graph API & MCP Server",
    stage: "Live",
    tags: ["Knowledge Graph", "AI/ML", "NLP"],
    impact: "Read-only REST and MCP access to a ~26M-relationship biomedical knowledge graph, with sentence-level literature provenance behind every edge",
    url: "https://api.alphameld.com/docs",
    description: "FastAPI service over the AlphaMeld knowledge graph on DozerDB (Neo4j): node, relationship, search, path-traversal and analytics endpoints, plus sentence-level evidence from the literature graph behind each relationship. A FastMCP server exposes the same graph to AI agents as 16 tools — find entities, explain relationships, find connections, retrieve evidence, surface evidence gaps — gated by a tiered evaluation suite that runs on every deploy. Hashed API keys, rate limiting and request logs live in PostgreSQL. Discovery Navigator and Rediscovery build on it.",
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
    url: "https://alphacompass-node.alphameld.com",
    description:
      "Clinical-trial–centric portfolio-intelligence SaaS in the AlphaMeld® suite; benchmarks pipeline assets and quantifies comparative risk. Adopted by two BD teams within six months, standardizing evidence-based indication-prioritization across 200 active programs.",
  },
  {
    name: "Digital Twins for Systemic Sclerosis (EUSTAR)",
    stage: "Early access",
    tags: ["AI/ML", "Clinical Trials", "Deep Learning"],
    impact: "In-silico control arms over a 23,000+ patient, 200+ center systemic sclerosis registry",
    url: "https://twin.sequenceflow.ch",
    description:
      "Outcome-focused digital-twin framework built on the EUSTAR systemic sclerosis registry — longitudinal records for 23,000+ patients across 200+ centers. Forecasters (a clinical logistic regression, gradient boosting, and a PyTorch GRU-D sequence model) and a cross-fitted baseline prognostic score drive power planning, trial emulation, and prognostic survival models for organ-specific and composite outcomes; the generative synthetic-control arm is parked. Designed as an ML-generated digital control arm — a PROCOVA/ANCOVA covariate that lifts trial power and cuts sample size — aligned with FDA digital-twin guidance and EMA/ICH M15 MIDD principles. Delivered as an invite-only web application, with every figure flagged provisional until the clinical lead signs off.",
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
