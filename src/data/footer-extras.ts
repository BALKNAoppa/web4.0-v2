/**
 * Univision Web 4.0 — Footer-ийн нэмэлт мэдээлэл
 * (App татах линкүүд + Social media)
 */

export type AppStoreLink = {
  id: "app-store" | "google-play" | "app-gallery";
  /** Дэлгэц дээр харагдах нэр (badge доторх) */
  storeName: string;
  /** Badge дээрх нэмэлт текст: "Download on the", "Get it on", "Explore it on" */
  prefix: string;
  /** Татах URL */
  href: string;
  /**
   * Хувилбар 3-ын desktop дээр icon дээр hover хийхэд гарах QR-ийн утга.
   * ⚠️ PLACEHOLDER — жинхэнэ store холбоосоор солино.
   */
  qrValue: string;
};

export type SocialLink = {
  id: "facebook" | "instagram" | "youtube";
  /** aria-label-д ашиглах нэр */
  name: string;
  href: string;
};

/** Хувилбар 3 (Ecosystem footer)-ын брэнд карт */
export type FooterBrand = {
  id: string;
  name: string;
  href: string;
  external?: boolean;
  /** Картан доторх нэг мөр тайлбар — PLACEHOLDER */
  tagline: string;
};

// ====================================================
// APP STORES — Бүх үйлчилгээний нэг апп
// ====================================================
export const appDownloadSection = {
  /** Багана гарчиг — секционы бусад column-уудтай адил байх */
  title: "Unitel Aпп татах",
};
export const appStores: AppStoreLink[] = [
  {
    id: "app-store",
    storeName: "App Store",
    prefix: "Download on the",
    href: "#",
    qrValue: "https://unitel.mn/app/ios",
  },
  {
    id: "google-play",
    storeName: "Google Play",
    prefix: "Get it on",
    href: "#",
    qrValue: "https://unitel.mn/app/android",
  },
  {
    id: "app-gallery",
    storeName: "AppGallery",
    prefix: "Explore it on",
    href: "#",
    qrValue: "https://unitel.mn/app/huawei",
  },
];

// ====================================================
// SOCIAL — Линкийг өөрийн жинхэнэ хаягаар солих
// ====================================================
export const socialLinks: SocialLink[] = [
  { id: "facebook", name: "Facebook", href: "https://www.facebook.com/UnitelMN" },
  { id: "instagram", name: "Instagram", href: "https://instagram.com/unitelmn" },
  { id: "youtube", name: "YouTube", href: "https://www.youtube.com/@UnitelMN" },
];

// ====================================================
// ECOSYSTEM — Хувилбар 3-ын брэнд эгнээ
// Header-ийн Apple маягийн нэгдсэн nav-тай ижил санаа: групп нь
// ганц экосистем гэдгийг footer дээр давтан хэлнэ.
// tagline-ууд PLACEHOLDER — маркетингийн эцсийн үгээр солино.
// ====================================================
export const footerEcosystem: FooterBrand[] = [
  { id: "unitel", name: "Unitel", href: "/unitel", tagline: "Мобайл холбоо, дугаар, багц" },
  { id: "univision", name: "Univision", href: "/univision", tagline: "Гэрийн интернэт, телевиз" },
  {
    id: "toki",
    name: "Toki",
    href: "https://toki.mn/",
    external: true,
    tagline: "Хүргэлт, худалдан авалт",
  },
  {
    id: "looktv",
    name: "Look TV",
    href: "https://looktv.mn/",
    external: true,
    tagline: "Кино, контент стриминг",
  },
  {
    id: "u-point",
    name: "U-point",
    href: "https://u-point.mn/",
    external: true,
    tagline: "Оноо цуглуулах, урамшуулал",
  },
];
