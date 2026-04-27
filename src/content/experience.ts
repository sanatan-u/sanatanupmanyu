export type Role = {
  company: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
  skills?: string[];
};

export const experience: Role[] = [
  {
    company: "AlphaMeld GmbH (formerly InveniAI GmbH)",
    location: "Basel, Switzerland",
    title: "Head of Data Sciences – Site Head",
    period: "Dec 2020 – Present",
    skills: ["Python", "Neo4j", "AWS", "React", "LLMs", "Knowledge Graphs"],
    bullets: [
      "Leads development and deployment of the AlphaMeld Platform.",
      "Spearheads strategic AI/ML initiatives to enhance AlphaMeld/AlphaCompass capacity.",
      "Advises pharma/biotech companies on leveraging data science methodologies.",
      "Applied deep molecular biology expertise for MOA analyses and therapeutic target viability.",
      "Manages a data science team of 5 members.",
    ],
  },
  {
    company: "ArtiXio Pvt Ltd",
    location: "Remote",
    title: "Chief Technology Officer",
    period: "Sep 2017 – Present",
    skills: ["React", "Next.js", "TypeScript", "GPT-4", "Claude", "PostgreSQL"],
    bullets: [
      "Owns technology strategy, architecture, and delivery of Artixio's digital product portfolio — from concept to production.",
      "Conceptualized and built QuriousRI, a secure role-based regulatory intelligence platform covering pharmaceuticals, biologics, biosimilars, and generics across 12+ agencies (FDA, EMA, PMDA, NMPA, Health Canada, MHRA, Swissmedic, and more), with AI-assisted document analysis (GPT-4, Claude).",
      "Architected additional technology applications for the company, including an AI assistant that mines global regulatory updates and auto-drafts submission dossiers — opening a new non-pharma revenue channel.",
      "Directs enterprise-level data science and AI product development using Agile methodologies, ensuring adherence to global regulatory standards (FDA, EMA, ICH) across the drug development lifecycle.",
    ],
  },
  {
    company: "Apxora GmbH",
    location: "Basel, Switzerland",
    title: "Co-Founder & AI/Data Science Head",
    period: "Dec 2024 – Present",
    skills: ["Python", "LLMs", "React", "AWS", "Neo4j"],
    bullets: [
      "Drives development and deployment of the ResearchNexus and Clinical Navigator platforms.",
      "Leads strategic AI/ML initiatives for detecting early innovation signals for emerging targets, novel therapeutics, and healthcare solutions.",
      "Supports the Asset Lifecycle Manager and Portfolio Management platforms.",
    ],
  },
  {
    company: "RenaissThera Pvt Ltd",
    location: "Remote",
    title: "Scientific & AI Advisory Board",
    period: "Sep 2024 – Present",
    skills: ["AI Strategy", "Drug Discovery"],
    bullets: [
      "Advising on AI-driven strategies for early-stage drug discovery and translational research.",
      "Shaping the future of health through regulatory-aware innovation in digital and data sciences.",
    ],
  },
  {
    company: "Kstych Pvt Ltd",
    location: "Gurgaon, India",
    title: "Co-Founder | Director Data Sciences | Life Science Consultant",
    period: "Jul 2012 – Aug 2023",
    skills: ["Python", "R", "NLP", "MongoDB", "Hadoop", "Tableau"],
    bullets: [
      "Co-founded and led data sciences, applying statistical, mathematical, and predictive modeling to build algorithms for life-science research questions.",
      "Advised pharma and biotech firms on de novo, reformulation, repurposing, and drug-rescue strategies using real-world data.",
      "Built statistical predictive models using NLP and machine learning on RWD; led therapeutic target assessment and MOA analysis.",
      "Hands-on expertise in Python, R, KNIME, MongoDB, Hadoop, MySQL/MariaDB, Tableau, Gephi, and Cytoscape.",
    ],
  },
  {
    company: "InveniAI LLC",
    location: "Hybrid Gurgaon IN / CT US",
    title: "Senior Director of Data Science",
    period: "Sep 2017 – Nov 2020",
    skills: ["Python", "Agile", "Data Science", "AI/ML"],
    bullets: [
      "Conceptualized, built, and executed innovative solutions throughout the drug development lifecycle.",
      "Managed enterprise-level data science products using Agile methodologies.",
      "Established short- to long-term strategies for Data Science and AI teams.",
    ],
  },
  {
    company: "BioXcel Corporation",
    location: "Gurgaon, India",
    title: "Director Data Sciences | Life Science Consultant",
    period: "Nov 2010 – Jul 2017",
    skills: ["Data Science", "Drug Repurposing", "Big Data", "Strategy"],
    bullets: [
      "Directed drug repurposing and novel target hypothesis generation using big data and statistical techniques.",
      "Advised pharma and biotech firms on diverse scientific strategic projects, surveys, and future opportunity mapping (de novo, reformulation, repurposing, drug rescue) using real-world data.",
      "Managed and mentored a team of data scientists; partnered closely with US-based pharma and biotech clients.",
      "Led project management and strategy consulting efforts, providing scientific support to business development.",
    ],
  },
  {
    company: "Ranbaxy",
    location: "Gurgaon, India",
    title: "Research Biologist",
    period: "Jan 2008 – Nov 2010",
    skills: ["Molecular Biology", "siRNA", "Drug Discovery"],
    bullets: [
      "Conducted siRNA targeted gene silencing for target-based drug discovery.",
      "Cloning, expression, purification, and activity analysis of human kinases, cytochrome P450 proteins, GPCRs, and bacterial enzymes — supporting enzyme- and cell-based NCE screening assays.",
      "Managed experiments using mammalian, baculovirus, and Dictyostelium expression systems.",
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
