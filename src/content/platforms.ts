export type Platform = {
  name: string;
  status?: "In development";
  impact?: string;
  description: string;
  url?: string;
};

export const platforms: Platform[] = [
  {
    name: "AlphaMeld® Operating System",
    impact: "~60% faster hypothesis-to-insight cycle time",
    url: "https://alphameld.com",
    description:
      "End-to-end AI stack combining a custom UI layer (Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis, AlphaClinMeld) with 12 ML models — including NER, RE, evidence scoring, digital-twin CT predictors and landscape assessment — running on PostgreSQL + Neo4j and self-hosted GPT/Claude custom APIs.",
  },
  {
    name: "Discovery Navigator",
    status: "In development",
    description:
      "Extension to AlphaMeld that goes beyond standard knowledge graphs — uses KG-driven hypothesis generation and project-based safety assessments in a detailed, complex manner.",
  },
  {
    name: "ChatAlphaMeld Benchmark Suite",
    impact: "97.34% accuracy on 188-question ACM benchmark",
    url: "https://www.inveniai.com/press-detail.php?id=22",
    description:
      "Two agentic workflow engines fine-tuned on biomedical tasks; outperformed GPT-4o, GPT-4o-mini, and o3-mini variants; delivered richer step-by-step rationales critical for complex clinical questions.",
  },
  {
    name: "SequenceFlow® ResearchNexus & Clinical Navigator",
    impact: "6+ integrated modules",
    description:
      "End-to-end AI stack combining Knowledge Graph, Clinical Trial Prediction, Literature Analysis, Patient Digital Twin, TPP, TOP with 12 ML models running on PostgreSQL + Neo4j and self-hosted GPT/Claude custom APIs.",
  },
  {
    name: "AlphaCompass Portfolio Intelligence",
    impact: "~30% faster portfolio-review turnaround",
    description:
      "Clinical-trial–centric SaaS module on AlphaMeld® graph analytics; benchmarks pipeline assets and quantifies comparative risk. Adopted by two BD teams within six months, standardizing evidence-based indication-prioritization across 200 active programs.",
  },
  {
    name: "Clinical-Trial Digital Twins",
    description:
      "Conditional variational auto-encoder (CVAE) pipeline that synthesizes patient-level digital twins for Phase II Type 2 Diabetes trials. Generated matched placebo trajectories and predicted drug-response curves — proving feasibility of in-silico arms for protocol optimization and hypothesis testing.",
  },
];
