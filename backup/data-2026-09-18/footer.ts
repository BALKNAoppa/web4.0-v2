export type FooterLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  id: string;
  title: string;
  items: FooterLink[];
};

export const footerLinks: FooterLink[] = [
  { id: "about", label: "Бидний тухай", href: "#" },
  { id: "news", label: "Хэвлэлийн мэдээ", href: "#" },
  { id: "coverage", label: "Сүлжээний хамрах хүрээ", href: "#" },
  { id: "branches", label: "Салбарын байршил", href: "#" },
  { id: "contact", label: "Холбоо барих", href: "#" },
];

export const footerSitemap: FooterColumn[] = [
  {
    id: "connectivity",
    title: "Харилцаа холбоо",
    items: [
      { id: "Current", label: "Unitel", href: "#", external: true },
      { id: "home-internet", label: "Ger internet", href: "#", external: true },
    ],
  },
  {
    id: "platform",
    title: "Платформ",
    items: [
      { id: "univision", label: "Univision", href: "#", external: true },
      { id: "looktv", label: "LookTV", href: "https://looktv.mn/", external: true },
      { id: "ddishtv", label: "DDISH TV", href: "#", external: true },
    ],
  },
  {
    id: "digital",
    title: "Дижитал үйлчилгээ",
    items: [
      { id: "toki", label: "Toki App", href: "https://toki.mn/", external: true },
      { id: "upoint", label: "U-Point", href: "https://u-point.mn/", external: true },
    ],
  },
];

export const footerTagline = "Монгол орныг дэлхийтэй холбосон үндэсний харилцаа холбооны групп.";

export const footerContact = {
  title: "Тусламж, холбоо барих",
  phone: { label: "1200", href: "tel:1200" },
  phoneNote: "Тусламжийн төв · үнэгүй",
  hours: "Ажиллах цаийн хуваарь 00:00–00:00",
  address: "Улаанбаатар, Сүхбаатар дүүрэг, 8-р хороо, etc...",
  email: { label: "info@unitel.mn", href: "mailto:info@unitel.mn" },
  actions: {
    call: { label: "Ажилтантай холбогдох", href: "tel:1200" },
    store: { label: "Салбар хайх", href: "#" },
  },
};

export const footerShopLine = {
  lead: "Салбараас үйлчилгээ авах:",
  storeLink: { label: "Өөрт ойрхон салбарыг олох", href: "#" },
  between: "эсвэл",
  afterLinks: "-ээс аваарай.",
  callLead: "Эсвэл",
  phone: { label: "0000", href: "#" },
  phoneNote: "(0000-0000)",
  callTail: "руу залгана уу.",
};

export const footerStripLinks: FooterLink[] = [
  { id: "about", label: "Unitel Group", href: "#" },
  { id: "sustainability", label: "Тогтвортой хөгжил", href: "#" },
  { id: "news", label: "Хэвлэлийн мэдээ", href: "#" },
  { id: "careers", label: "Career", href: "#" },
  { id: "contact", label: "Холбоо барих", href: "#" },
];

export const footerMeta = {
  copyrightOwner: "Unitel",
  rightsNote: "Бүх эрх хуулиар хамгаалагдсан.",
  region: "Монгол Улс",
};
