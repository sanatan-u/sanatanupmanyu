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
    impact: "Drug & biologic regulatory intelligence spanning 12+ agencies — FDA, EMA, PMDA, NMPA, Health Canada, MHRA, Swissmedic, and more",
    description:
      "Secure, role-based platform for pharma/biotech regulatory affairs teams to search, analyze, compare, and manage global drug and biologic approvals. Covers pharmaceuticals, biologics, biosimilars, and generics across 12+ regulators. Combines role-based dashboards, pathway and classification guides, dossier preparation support, a centralized guidelines library, Q&A with expert responses, and LLM-powered document analysis.",
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
