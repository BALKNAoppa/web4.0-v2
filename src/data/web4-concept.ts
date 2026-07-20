/**
 * Web 4.0 концепцийн дата — /web4 хуудасны bubble deck-д ашиглана.
 *
 * Байгууллагын (COMPANY) стратегийн зорилтууд + хэрэглэгчийн (CUSTOMERS)
 * үндсэн хэрэгцээ. Хоёул нэг цэгт нийлж Web 4.0 болно.
 *
 * Өнгө нь эх зургийн (strategy map) багануудын өнгөтэй тааруулсан.
 * Label-ууд эх дата ёсоор англиар; шаардвал эндээс монголчилно.
 */

export type ConceptGoal = {
  id: string;
  label: string;
  /** Hex accent — bubble болон холбоос */
  color: string;
  items: string[];
};

// ── COMPANY — байгууллага юу хийхийг зорьдог вэ ──
export const companyGoals: ConceptGoal[] = [
  {
    id: "awareness",
    label: "Build awareness",
    color: "#3b82f6", // blue
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
    color: "#45c700", // green
    items: [
      "Omnichannel, seamless experience",
      "Unified customer recognition (one profile)",
      "All digital payment options",
    ],
  },
  {
    id: "selling",
    label: "Increase selling",
    color: "#eab308", // yellow
    items: ["Cross-sell & bundle support"],
  },
  {
    id: "manage",
    label: "Manage easier",
    color: "#a855f7", // purple
    items: ["Easy to maintain", "Robust, trend-aligned"],
  },
  {
    id: "trust",
    label: "Build trust",
    color: "#f97316", // orange
    items: ["Sustainability (ESG) promotion", "Positive public image across all brands"],
  },
];

// ── CUSTOMERS — хэрэглэгч юу хүсдэг вэ ──
export const customerGoals: ConceptGoal[] = [
  {
    id: "simplicity",
    label: "Simplicity",
    color: "#22c55e", // green
    items: ["Mobile-friendly, minimal clicks", "Clear, easy-to-find information", "Low cognitive effort"],
  },
  {
    id: "completion",
    label: "Completion",
    color: "#16a34a", // deep green
    items: ["Easy to pay (complete the task)", "Zero errors or failed steps"],
  },
  {
    id: "care",
    label: "Care",
    color: "#3b82f6", // blue
    items: [
      "Product & service information available",
      "Personalized offers & services",
      "Help, assistance",
    ],
  },
  {
    id: "inclusion",
    label: "Inclusion",
    color: "#f97316", // orange
    items: ["Accessible (WCAG)"],
  },
  {
    id: "confidence",
    label: "Confidence",
    color: "#eab308", // amber
    items: ["Strong, trustworthy aesthetic design", "Security, reliability & safety"],
  },
];
