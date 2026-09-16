export type BrandHouse = {
  id: string;
  label: string;
  desc: string;
};

export type BrandType = {
  id: string;
  house: string;
  name: string;
  link: string;
  externalParent: string;
  externalProduct: string;
  note: string;
  ours: string[];
  color: string;
  image?: string;
  url?: string;
};

export const brandHouses: BrandHouse[] = [
  {
    id: "house-of-brands",
    label: "House of brands",
    desc: "Each product has its own name and its own identity.",
  },
  {
    id: "branded-house",
    label: "Branded house",
    desc: "Every product carries the parent's name and visual identity.",
  },
];

export const brandTypes: BrandType[] = [
  {
    id: "product-brand",
    house: "House of brands",
    name: "Product brand",
    link: "No link",
    externalParent: "Google",
    externalProduct: "Waymo",
    note: "No link at all. Users may not immediately know it belongs to Google.",
    ours: ["Toki", "Nomadia", "ESN", "PSN", "Ddish"],
    color: "#3b82f6",
    image: "/waymo.png",
    url: "https://waymo.com/",
  },
  {
    id: "endorsing-brand",
    house: "House of brands",
    name: "Endorsing brand",
    link: "Weak link",
    externalParent: "Google",
    externalProduct: "YouTube",
    note: "The brand keeps its own identity, while the parent connection appears only in secondary areas (sign-in, account settings).",
    ours: ["U-point"],
    color: "#a855f7",
    image: "/youtube.png",
    url: "https://www.youtube.com/",
  },
  {
    id: "umbrella-brand",
    house: "Branded house",
    name: "Umbrella brand",
    link: "Shared link",
    externalParent: "Google",
    externalProduct: "Google Workspace",
    note: "Gmail, Docs, Sheets — different products, one clear Google ecosystem.",
    ours: ["Unitel", "Univision", "Ger Internet", "Look TV", "Nexmind", "OSS"],
    color: "#45c700",
    image: "/google workspace.png",
    url: "https://workspace.google.com/",
  },
  {
    id: "source-brand",
    house: "Branded house",
    name: "Source brand",
    link: "Value link",
    externalParent: "Google",
    externalProduct: "Google Pixel",
    note: 'Parent-powered. "Made by Google" is a key selling point.',
    ours: [],
    color: "#eab308",
    image: "/google pixel.png",
    url: "https://store.google.com/us/?hl=en-US&regionRedirect=true",
  },
];
