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
};

export type SocialLink = {
  id: "facebook" | "instagram" | "youtube";
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
  },
  {
    id: "google-play",
    storeName: "Google Play",
    prefix: "Get it on",
    href: "#",
  },
  {
    id: "app-gallery",
    storeName: "AppGallery",
    prefix: "Explore it on",
    href: "#",
  },
];

// ====================================================
// SOCIAL — Линкийг өөрийн жинхэнэ хаягаар солих
// ====================================================
export const socialLinks: SocialLink[] = [
  { id: "facebook", name: "Facebook", href: "https://www.facebook.com/UnivisionMN" },
  { id: "instagram", name: "Instagram", href: "https://instagram.com/univisionmn" },
  { id: "youtube", name: "YouTube", href: "https://www.youtube.com/@UnivisionMon" },
];