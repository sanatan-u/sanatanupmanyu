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
      "End-to-end AI stack combining a custom UI layer (Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis, AlphaClinMeld) with 12 ML models — including NER, RE, evidence scoring, digital-twin CT predictors and landscape assessment — running on PostgreSQL + Neo4j and self-hosted GPT/Claude custom APIs.",
  },
  {
    name: "Discovery Navigator",
    stage: "Early access",
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
      "Two agentic workflow engines fine-tuned on biomedical tasks; outperformed GPT-4o, GPT-4o-mini, and o3-mini variants; delivered richer step-by-step rationales critical for complex clinical questions.",
  },
  {
    name: "SequenceFlow® ResearchNexus & Clinical Navigator",
    stage: "Live",
    tags: ["AI/ML", "Full Stack", "Clinical Trials"],
    impact: "6+ integrated modules",
    description:
      "End-to-end AI stack combining Knowledge Graph, Clinical Trial Prediction, Literature Analysis, Patient Digital Twin, TPP, TOP with 12 ML models running on PostgreSQL + Neo4j and self-hosted GPT/Claude custom APIs.",
  },
  {
    name: "AlphaCompass Portfolio Intelligence",
    stage: "Live",
    tags: ["AI/ML", "Data Science", "Drug Discovery"],
    impact: "Standardized indication-prioritization across 200 active programs",
    description:
      "Clinical-trial–centric SaaS module on AlphaMeld® graph analytics; benchmarks pipeline assets and quantifies comparative risk. Adopted by two BD teams within six months, standardizing evidence-based indication-prioritization across 200 active programs.",
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
