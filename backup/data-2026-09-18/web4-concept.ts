export type ConceptGoal = {
  id: string;
  label: string;
  color: string;
  items: string[];
};

export const companyGoals: ConceptGoal[] = [
  {
    id: "awareness",
    label: "Build awareness",
    color: "#3b82f6",
    items: [
      "Product & service catalog",
      "Consistent brand recognition across the portfolio",
      "Direct navigation across all daughter companies",
      "Support for sub-brands",
    ],
  },
  {
    id: "needs",
    label: "Provide customer needs",
    color: "#45c700",
    items: [
      "Omnichannel, seamless experience",
      "Unified customer recognition (one profile)",
      "All digital payment options",
    ],
  },
  {
    id: "selling",
    label: "Increase selling",
    color: "#eab308",
    items: ["Cross-sell & bundle support"],
  },
  {
    id: "manage",
    label: "Manage easier",
    color: "#a855f7",
    items: ["Easy to maintain", "Robust, trend-aligned"],
  },
  {
    id: "trust",
    label: "Build trust",
    color: "#f97316",
    items: ["Sustainability (ESG) promotion", "Positive public image across all brands"],
  },
];

export const customerGoals: ConceptGoal[] = [
  {
    id: "simplicity",
    label: "Simplicity",
    color: "#22c55e",
    items: ["Mobile-friendly, minimal clicks", "Clear, easy-to-find information", "Low cognitive effort"],
  },
  {
    id: "completion",
    label: "Completion",
    color: "#16a34a",
    items: ["Easy to pay (complete the task)", "Zero errors or failed steps"],
  },
  {
    id: "care",
    label: "Care",
    color: "#3b82f6",
    items: [
      "Product & service information available",
      "Personalized offers & services",
      "Help, assistance",
    ],
  },
  {
    id: "inclusion",
    label: "Inclusion",
    color: "#f97316",
    items: ["Accessible (WCAG)"],
  },
  {
    id: "confidence",
    label: "Confidence",
    color: "#eab308",
    items: ["Strong, trustworthy aesthetic design", "Security, reliability & safety"],
  },
];
