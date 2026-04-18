import type { Stage } from "./platforms";

export type Product = {
  name: string;
  stage?: Stage;
  url?: string;
  builtFor?: string;
  impact?: string;
  description: string;
};

export const products: Product[] = [
  {
    name: "Pipeline Alpha",
    stage: "Live",
    url: "https://pipelinealpha.com",
    impact: "Clinical-trial outcome prediction feeding public-market investment signals",
    description:
      "Stock value analysis and clinical trial outcome prediction platform — data-driven investment and pharma pipeline intelligence.",
  },
  {
    name: "QuriousRI",
    stage: "Live",
    url: "https://app.quriousri.com",
    builtFor: "Artixio Pvt Ltd",
    impact: "Real-time global regulatory signal with expert-written risk summaries",
    description:
      "AI-powered regulatory tracking and risk analysis tool — real-time updates, expert-written summaries, and risk impact analysis in one platform.",
  },
  {
    name: "Secondary Research Automation",
    stage: "Engagement",
    impact: "Agent-orchestrated multi-step research, delivered to dashboard or Excel",
    description:
      "Fully agent-orchestrated, multi-step LLM process. Input parameters, run a series of LLM processes to extract information from the web, compile, and store in a dashboard or export to Excel.",
  },
  {
    name: "Booking System Platform",
    stage: "Engagement",
    impact: "Bespoke booking platform delivered end-to-end to client spec",
    description:
      "End-to-end booking and scheduling platform — custom-built to client specification with real-time availability, notifications, and management dashboard.",
  },
  {
    name: "Regulatory Intelligence for ArtiXio",
    stage: "Live",
    impact: "Auto-drafts submission dossiers for first-in-class device filings; opened a new non-pharma revenue channel",
    description:
      "AI assistant that mines global regulatory updates and auto-drafts submission dossiers; established a new non-pharma revenue channel.",
  },
];
