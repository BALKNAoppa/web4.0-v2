export type AppStoreLink = {
  id: "app-store" | "google-play" | "app-gallery";
  storeName: string;
  prefix: string;
  href: string;
  qrValue: string;
};

export type SocialLink = {
  id: "facebook" | "x" | "instagram" | "youtube";
  name: string;
  href: string;
};

export const appDownloadSection = {
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

export const socialLinks: SocialLink[] = [
  { id: "facebook", name: "Facebook", href: "https://www.facebook.com/UnitelMN" },
  { id: "x", name: "X", href: "#" },
  { id: "instagram", name: "Instagram", href: "https://instagram.com/unitelmn" },
  { id: "youtube", name: "YouTube", href: "https://www.youtube.com/@UnitelMN" },
];
