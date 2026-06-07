export type Talk = {
  event: string;
  role: string;
  topic: string;
  location: string;
  date: string;
};

export const talks: Talk[] = [
  {
    event: "NLP for Life Sciences",
    role: "Speaker",
    topic:
      "NLP in Healthcare: From Patient Records to Research & Education",
    location: "Delhi (Virtual)",
    date: "14 Nov 2025",
  },
  {
    event: "Web Summit 2025",
    role: "Startup Showcase",
    topic: "Agentic AI for Asset and Portfolio Lifecycle Decisions",
    location: "Lisbon",
    date: "14 Nov 2025",
  },
  {
    event: "Microsoft AI Tour",
    role: "Startup Pitch Presenter",
    topic: "Agentic AI for Portfolio & Product Lifecycle Decisions",
    location: "Lausanne",
    date: "18 Jun 2025",
  },
  {
    event: "Basel Data Science & AI Meetup",
    role: "Invited Speaker",
    topic: "Effects & Impact of Knowledge Graphs in Drug Discovery",
    location: "Basel",
    date: "11 Dec 2024",
  },
  {
    event: "GlobalBioIndia 2024",
    role: "Panelist",
    topic: "AI for Next-Generation Therapeutics",
    location: "New Delhi",
    date: "13 Sep 2024",
  },
  {
    event: "AI for Pharma & Biotech",
    role: "Workshop Presenter",
    topic:
      "Quantum Leap in Drug Discovery: LLMs & Deep Learning for Material Sciences",
    location: "Virtual",
    date: "2024",
  },
];
