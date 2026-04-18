export type Product = {
  name: string;
  url?: string;
  builtFor?: string;
  impact?: string;
  description: string;
};

export const products: Product[] = [
  {
    name: "Pipeline Alpha",
    url: "https://pipelinealpha.com",
    description:
      "Stock value analysis and clinical trial outcome prediction platform — data-driven investment and pharma pipeline intelligence.",
  },
  {
    name: "QuriousRI",
    url: "https://app.quriousri.com",
    builtFor: "Artixio Pvt Ltd",
    description:
      "AI-powered regulatory tracking and risk analysis tool — real-time updates, expert-written summaries, and risk impact analysis in one platform.",
  },
  {
    name: "Secondary Research Automation",
    description:
      "Fully agent-orchestrated, multi-step LLM process. Input parameters, run a series of LLM processes to extract information from the web, compile, and store in a dashboard or export to Excel.",
  },
  {
    name: "Booking System Platform",
    description:
      "End-to-end booking and scheduling platform — custom-built to client specification with real-time availability, notifications, and management dashboard.",
  },
  {
    name: "Regulatory Intelligence for ArtiXio",
    impact: "Auto-drafts submission dossiers for first-in-class device filings; opened a new non-pharma revenue channel",
    description:
      "AI assistant that mines global regulatory updates and auto-drafts submission dossiers; established a new non-pharma revenue channel.",
  },
];
