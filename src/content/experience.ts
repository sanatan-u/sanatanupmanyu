export type Role = {
  company: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
  skills?: string[];
};

// Ordered by executive weight within the current-roles block (operating roles
// before the advisory seat), then reverse-chronologically for prior roles.
export const experience: Role[] = [
  {
    company: "Apxora GmbH",
    location: "Basel, Switzerland",
    title: "Co-Founder & AI/Data Science Head",
    period: "Dec 2024 – Present",
    skills: ["Python", "LLMs", "React", "AWS", "Neo4j"],
    bullets: [
      "Co-founded the company and own the AI/data-science function end to end — technical strategy, architecture, hiring, and delivery across the product portfolio.",
      "Direct build and deployment of SequenceFlow ResearchNexus and Clinical Navigator: an Angular and PostgREST platform over a multi-schema PostgreSQL warehouse, fed by Python pipelines for ClinicalTrials.gov, drug ontologies, HTA decisions and pricing, with FastAPI model services for trial-outcome prediction, phase-transition prediction and patient digital twins.",
      "Set the AI/ML agenda for early innovation-signal detection across emerging targets, novel therapeutics, and healthcare solutions — and translate it into the commercial product roadmap.",
      "Steer the Asset Lifecycle Manager and Portfolio Management platforms, extending the company's reach from discovery signals into portfolio decision-making.",
      "Lead delivery of AI engagements for top-tier global pharmaceutical companies (client names confidential).",
    ],
  },
  {
    company: "AlphaMeld GmbH (formerly InveniAI GmbH)",
    location: "Basel, Switzerland",
    title: "Head of Data Sciences — Site Head",
    period: "Dec 2020 – Present",
    skills: ["Python", "Neo4j", "AWS", "React", "LLMs", "Knowledge Graphs"],
    bullets: [
      "Site head for the Basel operation and owner of the data-sciences function — team of 5 data scientists, hiring, technical direction, and site-level delivery accountability.",
      "Own the AlphaMeld Operating System end to end — a custom UI layer (Knowledge Graph, ChatAlphaMeld, Bioinformatics, Literature Analysis, AlphaClinMeld) over transformer NLP models, a Neo4j-based knowledge graph and graph-neural trial predictors — compressing hypothesis-to-insight cycles from months to weeks.",
      "Conceived and designed the AlphaMeld NLP pipeline: daily literature ingestion with transformer NER, relation extraction, entity linking and evidence-level classification over RabbitMQ workers, feeding the knowledge graph, and later the read-only Knowledge Graph API and MCP server that expose it to applications and AI agents.",
      "Delivered AlphaCompass portfolio intelligence: adopted by two business-development teams within six months, standardizing evidence-based indication prioritization across 200 active programs.",
      "Directed the ChatAlphaMeld benchmark programme — 97.34% accuracy on a 188-question biomedical benchmark, outperforming leading general-purpose frontier models and delivering the step-by-step rationales complex clinical questions demand.",
      "Anchor platform delivery and support for the publicly announced collaborations that validate AlphaMeld commercially: Kyowa Kirin (multi-year strategic partnership; subscription-and-support relationship spanning five years, with an AI-identified program validated in preclinical proof-of-concept), Shionogi (multi-target drug discovery, worth up to $200M per program in upfronts, milestones, and royalties), GSK Consumer Healthcare (three-year AI innovation collaboration), and Ono Pharmaceutical (2024 target discovery).",
      "Act as senior data-science advisor to pharma and biotech clients, applying molecular-biology depth to MOA analysis and target-viability calls that shape client program decisions.",
    ],
  },
  {
    company: "ArtiXio Pvt Ltd",
    location: "Remote",
    title: "Chief Technology Officer",
    period: "Sep 2017 – Present",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "LLMs",
      "Agentic AI",
      "PostgreSQL",
    ],
    bullets: [
      "Own technology strategy, architecture, and delivery for the company's entire digital product portfolio — concept to production — and the engineering function behind it.",
      "Conceptualized and built QuriousRI, a secure role-based regulatory-intelligence platform covering pharmaceuticals, biologics, biosimilars, and generics across 12+ agencies (FDA, EMA, PMDA, NMPA, Health Canada, MHRA, Swissmedic, and more).",
      "Extended QuriousRI into CTD dossier preparation, driving AI-assisted authoring across Modules 2 through 5 — and scoping Module 1 out deliberately, as country- and company-specific content that does not transfer reliably. Generated sections evaluated to date against expert gold standards for the Quality Overall Summary (Module 2.3), 3.2.P.1, and 3.2.P.3.3, with section coverage expanding.",
      "Built per-module, per-section regulatory gap assessment for market expansion: for a drug already approved in one market, the platform resolves what a target market requires for that drug type and where those requirements diverge from the original filing — converting a manual, consultant-heavy exercise into a repeatable product capability.",
      "Architected an AI assistant that mines global regulatory updates and auto-drafts submission dossiers for first-in-class device filings, opening a new non-pharma revenue channel.",
      "Direct enterprise data-science and AI product development on Agile, holding delivery to FDA, EMA, and ICH standards across the drug-development lifecycle.",
    ],
  },
  {
    company: "RenaissThera Pvt Ltd",
    location: "Remote",
    title: "Scientific & AI Advisory Board",
    period: "Sep 2024 – Present",
    skills: ["AI Strategy", "Drug Discovery"],
    bullets: [
      "Board-level advisor on AI-driven strategy for early-stage drug discovery and translational research.",
      "Guide regulatory-aware innovation across the company's digital and data-science agenda.",
    ],
  },
  {
    company: "Kstych Pvt Ltd",
    location: "Gurgaon, India",
    title: "Co-Founder | Director, Data Sciences",
    period: "Jul 2012 – Aug 2023",
    skills: ["Python", "R", "NLP", "MongoDB", "Hadoop", "Tableau"],
    bullets: [
      "Co-founded the firm and built the data-sciences practice from zero — team, methodology, delivery model, and client base.",
      "Advised pharma and biotech leadership on de novo, reformulation, repurposing, and drug-rescue strategy grounded in real-world data.",
      "Built statistical and machine-learning predictive models over RWD using NLP; led therapeutic target assessment and MOA analysis for client programs.",
    ],
  },
  {
    company: "InveniAI LLC",
    location: "Hybrid Gurgaon IN / CT US",
    title: "Senior Director of Data Science",
    period: "Sep 2017 – Nov 2020",
    skills: ["Python", "Agile", "Data Science", "AI/ML"],
    bullets: [
      "Set short- and long-term strategy for the data-science and AI organization.",
      "Owned enterprise-scale data-science products end to end across the drug-development lifecycle, delivered on Agile.",
      "Conceptualized and shipped novel solutions spanning discovery through clinical development.",
    ],
  },
  {
    company: "BioXcel Corporation",
    location: "Gurgaon, India",
    title: "Director, Data Sciences | Life Science Consultant",
    period: "Nov 2010 – Jul 2017",
    skills: ["Data Science", "Drug Repurposing", "Big Data", "Strategy"],
    bullets: [
      "Directed drug-repurposing and novel-target hypothesis generation using big-data and statistical methods.",
      "Built and mentored the data-science team, owning delivery for US-based pharma and biotech clients.",
      "Advised clients on de novo, reformulation, repurposing, and drug-rescue strategy, plus surveys and future-opportunity mapping using real-world data.",
      "Led strategy consulting and project management, providing the scientific backing for business development.",
    ],
  },
  {
    company: "Ranbaxy",
    location: "Gurgaon, India",
    title: "Research Biologist",
    period: "Jan 2008 – Nov 2010",
    skills: ["Molecular Biology", "siRNA", "Drug Discovery"],
    bullets: [
      "Ran siRNA targeted gene silencing for target-based drug discovery.",
      "Cloning, expression, purification, and activity analysis of human kinases, cytochrome P450 proteins, GPCRs, and bacterial enzymes — supporting enzyme- and cell-based NCE screening assays across mammalian, baculovirus, and Dictyostelium expression systems.",
    ],
  },
];

export const education = [
  {
    institution: "University of Rajasthan",
    degree: "Bachelor's Degree, Biotechnology",
    year: "2008",
  },
  {
    institution: "Bioinformatics Institute of India",
    degree: "Diploma, Bioinformatics",
    year: "2004",
  },
];
