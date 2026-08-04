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

// =====================================================================
// Secondary navigation — Хувилбар 2
// Групп нь ҮЙЛЧИЛГЭЭНИЙ ТӨРЛӨӨР биш, ЭКОСИСТЕМИЙН БҮЛГЭЭР ангилагдана:
// харилцаа холбоо · платформ · дижитал үйлчилгээ.
//   Desktop — гарчигтай баганууд НЭГ эгнээнд (dropdown байхгүй)
//   Mobile  — багана бүр accordion (dropdown) болж хумигдана
// `external: true` бол шинэ tab-д нээгдэнэ.
// =====================================================================
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

// =====================================================================
// Холбоо барих — Хувилбар 2-ын баруун талын блок
// =====================================================================
export const footerContact = {
  title: "Тусламж, холбоо барих",
  phone: { label: "1200", href: "tel:1200" },
  phoneNote: "Тусламжийн төв · үнэгүй",
  hours: "Ажиллах цаийн хуваарь 00:00–00:00",
  address: "Улаанбаатар, Сүхбаатар дүүрэг, 8-р хороо, etc...",
  email: { label: "info@unitel.mn", href: "mailto:info@unitel.mn" },
  /** Mobile-д дээд талд гарах хоёр товч */
  actions: {
    call: { label: "Ажилтантай холбогдох", href: "tel:1200" },
    store: { label: "Салбар хайх", href: "#" },
  },
};

// =====================================================================
// Apple маягийн доод strip — 3 хувилбарт БҮГДЭД НЬ ижил
// =====================================================================

/** "Өөр аргаар үйлчлүүлэх: … Эсвэл 1200 руу залгана уу." мөрийн хэсгүүд */
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

/**
 * Доод strip-ийн линкүүд — copyright-ын хажууд `|`-аар тусгаарлагдана.
 * Хууль эрх зүйн линкүүдийн оронд компанийн тухай хэсгүүд байрлана.
 */
export const footerStripLinks: FooterLink[] = [
  { id: "about", label: "Бидний тухай", href: "#" },
  { id: "sustainability", label: "Тогтвортой ирээдүй", href: "#" },
  { id: "news", label: "Хэвлэлийн мэдээ", href: "#" },
  { id: "careers", label: "Нээлттэй ажлын байр", href: "#" },
  { id: "contact", label: "Холбоо барих", href: "#" },
];

export const footerMeta = {
  /** "Copyright © 2026 Юнител ХХК." хэлбэрээр харагдана */
  copyrightOwner: "Юнител ХХК",
  rightsNote: "Бүх эрх хуулиар хамгаалагдсан.",
  /** Apple-ийн "United States"-тэй ижил байрлалд — бүс нутаг / хэл */
  region: "Монгол Улс",
};
