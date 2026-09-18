export type TrustBlock = {
  id: string;
  videoLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export const trustBuildSection = {
  srTitle: "Итгэл төрүүлэх",
};

export const trustBlocks: TrustBlock[] = [
  {
    id: "trust-1",
    videoLabel: "Video 1",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA button",
    href: "#",
  },
  {
    id: "trust-2",
    videoLabel: "Video 2",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA button",
    href: "#",
  },
  {
    id: "trust-3",
    videoLabel: "Video 3",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA button",
    href: "#",
  },
];
