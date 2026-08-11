/**
 * Univision Web 4.0 — Footer data
 *
 * Footer-ийн навигацийн линк болон компанийн нэр зэрэг
 * харьцангуй тогтвортой контентийг энд төвлөрүүлнэ.
 *
 * ⚠️ Доорх текст/линкүүдийн ИХЭНХ нь PLACEHOLDER. Жинхэнэ хаяг, дугаар,
 * хуудсууд тодрох үед зөвхөн энэ файлыг засна — компонентууд хөндөгдөхгүй.
 */

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  /** true бол шинэ tab-д нээгдэнэ (өөр домэйн) */
  external?: boolean;
};

/** Sitemap-ын нэг багана (Хувилбар 2 — desktop grid / mobile accordion) */
export type FooterColumn = {
  id: string;
  title: string;
  items: FooterLink[];
};

// =====================================================================
// Түргэн холбоос — Хувилбар 1, 3-т ашиглагдана
// =====================================================================
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
      { id: "unitel", label: "Юнител", href: "/unitel" },
      { id: "home-internet", label: "Гэр интернэт", href: "#" },
    ],
  },
  {
    id: "platform",
    title: "Платформ",
    items: [
      { id: "univision", label: "Юнивишн", href: "/univision" },
      { id: "looktv", label: "Look TV", href: "#" },
      { id: "ddishtv", label: "DDISH TV", href: "#" },
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
  { id: "about", label: "Бидний тухай", href: "#" },
  { id: "sustainability", label: "Тогтвортой ирээдүй", href: "#" },
  { id: "news", label: "Хэвлэлийн мэдээ", href: "#" },
  { id: "careers", label: "Нээлттэй ажлын байр", href: "#" },
  { id: "contact", label: "Холбоо барих", href: "#" },
];

export const footerMeta = {
  copyrightOwner: "Юнител ХХК",
  rightsNote: "Бүх эрх хуулиар хамгаалагдсан.",
  region: "Монгол Улс",
};
