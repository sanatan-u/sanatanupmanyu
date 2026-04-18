export type ServicePillar = {
  id: string;
  title: string;
  kicker: string;
  items: { name: string; description: string }[];
};

export const servicePillars: ServicePillar[] = [
  {
    id: "ai",
    kicker: "01",
    title: "AI & Data Science",
    items: [
      {
        name: "GenAI & LLM-RAG Systems",
        description:
          "Custom LLM orchestration with retrieval-augmented generation for domain-specific knowledge extraction and agentic workflows.",
      },
      {
        name: "Agentic AI Workflows",
        description:
          "Multi-agent pipelines — from biomedical Q&A engines scoring 97%+ accuracy to automated regulatory intelligence and secondary research automation.",
      },
      {
        name: "Predictive Modeling & Image Analysis",
        description:
          "Machine learning for clinical trial prediction, patient stratification, drug-response curves, portfolio risk quantification, and AI-powered image analysis.",
      },
      {
        name: "Knowledge Graphs & NLP",
        description:
          "End-to-end graph construction from literature, trials, and omics data — NER, relation extraction, evidence scoring, and hypothesis generation at scale.",
      },
    ],
  },
  {
    id: "infra",
    kicker: "02",
    title: "Scientific Computing & Infrastructure",
    items: [
      {
        name: "Cloud & HPC Architecture",
        description:
          "Design and optimization of hybrid cloud (AWS, Azure, GCP) with HPC workload management and cost-performance tuning.",
      },
      {
        name: "Data Pipeline Engineering",
        description:
          "Large-scale data integration — PostgreSQL, Neo4j graph databases, real-time ETL, and enterprise-grade data warehousing.",
      },
      {
        name: "Full-Stack Platform Development",
        description:
          "End-to-end product builds: React/JS frontends, Python/API backends, Docker/Kubernetes deployments, CI/CD automation.",
      },
      {
        name: "Digital Twin Modeling",
        description:
          "Patient-level digital twin pipelines using CVAE architectures for in-silico trial arms, protocol optimization, and hypothesis testing.",
      },
    ],
  },
  {
    id: "lifesci",
    kicker: "03",
    title: "Life Sciences & Drug Discovery",
    items: [
      {
        name: "Target Validation & MOA Analysis",
        description:
          "Deep molecular biology expertise — mechanism of action deconvolution, target viability assessment, and therapeutic hypothesis generation.",
      },
      {
        name: "Clinical Trial Optimization",
        description:
          "AI-driven trial design, enrollment prediction, endpoint benchmarking, and inclusion/exclusion criteria analytics across 200+ programs.",
      },
      {
        name: "Regulatory Intelligence",
        description:
          "Automated mining of global regulatory updates, AI-drafted submission dossiers, and compliance-driven digital transformation consulting.",
      },
      {
        name: "Drug Repurposing & Portfolio Strategy",
        description:
          "Big data–driven identification of repurposing candidates, competitive landscape analysis, and evidence-based indication prioritization.",
      },
    ],
  },
  {
    id: "leadership",
    kicker: "04",
    title: "Leadership & Strategic Consulting",
    items: [
      {
        name: "Team Building & Mentorship",
        description:
          "Scaling cross-site data science teams, fostering cross-functional collaboration among scientists, engineers, and business stakeholders.",
      },
      {
        name: "Partner & Client Engagement",
        description:
          "Strategic consulting for pharma/biotech on technology adoption, portfolio decisions, and R&D transformation with actionable analytics.",
      },
      {
        name: "Product Vision & Agile Delivery",
        description:
          "End-to-end product lifecycle — from concept to commercial SaaS platforms, using Agile methodologies and P&L management.",
      },
      {
        name: "Speaking & Thought Leadership",
        description:
          "Keynotes and panels at Web Summit, Microsoft AI Tour, GlobalBioIndia, and industry meetups reaching thousands of attendees.",
      },
    ],
  },
];
