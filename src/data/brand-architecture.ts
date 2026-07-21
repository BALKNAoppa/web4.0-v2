/**
 * Brand architecture — /web4 танилцуулгын нээлтийн хэсэг.
 *
 * Хоёр үндсэн философи (House of brands / Branded house) ба доор нь 4 төрөл.
 * Төрөл бүрд эхлээд ГАДНЫ жишээ (Google), дараа нь ӨӨРСДИЙН группын жишээ.
 * Дата нь эх зургаас (strategy slide) авсан.
 */

export type BrandHouse = {
  id: string;
  label: string;
  desc: string;
};

export type BrandType = {
  id: string;
  house: string; // аль философид хамаарах
  name: string; // Product brand, Endorsing brand ...
  link: string; // No link, Weak link, Shared link, Value link
  /** Гадны жишээ — эцэг брэнд + бүтээгдэхүүн */
  externalParent: string;
  externalProduct: string;
  /** Тайлбар */
  note: string;
  /** Өөрсдийн группын жишээ брэндүүд */
  ours: string[];
  /** Accent hex */
  color: string;
  /**
   * Жишээ компанийн live web screenshot (public/-д тавина).
   * Байхгүй бол "Live web" placeholder харагдана.
   */
  image?: string;
  /** Жинхэнэ сайтын URL — "Live site нээх" товч шинэ таб-д нээнэ */
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
    color: "#3b82f6", // blue
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
    color: "#a855f7", // purple
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
    color: "#45c700", // green
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
    color: "#eab308", // amber
    image: "/google pixel.png",
    url: "https://store.google.com/us/?hl=en-US&regionRedirect=true",
  },
];
