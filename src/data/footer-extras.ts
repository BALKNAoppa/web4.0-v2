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
  /** ⚠️ `x` нь 2026-09-08-нд загвараас нэмэгдсэн (Twitter → X) */
  id: "facebook" | "x" | "instagram" | "youtube";
  /** aria-label-д ашиглах нэр */
  name: string;
  href: string;
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
// ДАРААЛАЛ нь загварынх: Facebook · X · Instagram · YouTube.
// ⚠️ X-ийн хаяг PLACEHOLDER (`#`) — жинхэнэ Unitel-ийн X хаяг тодроогүй.
// `FooterNavLink`-ийн зарчмаас ЯЛГААТАЙ: сошиал линк нь ҮРГЭЛЖ гадаад тул
// `SocialRow` нь `target="_blank"`-ыг шууд тавьдаг. Хаяг `#` хэвээр байвал
// хоосон tab нээгдэнэ — жинхэнэ хаягаар СОЛИХ шаардлагатай.
export const socialLinks: SocialLink[] = [
  { id: "facebook", name: "Facebook", href: "https://www.facebook.com/UnitelMN" },
  { id: "x", name: "X", href: "#" },
  { id: "instagram", name: "Instagram", href: "https://instagram.com/unitelmn" },
  { id: "youtube", name: "YouTube", href: "https://www.youtube.com/@UnitelMN" },
];
