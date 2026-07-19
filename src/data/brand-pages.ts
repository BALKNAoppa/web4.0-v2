/**
 * Unitel · Univision брэнд хуудсууд (/unitel, /univision) — Apple-ийн iPad
 * хуудаснаас санаа авсан бүтцийн data.
 *
 * Хуудасны бүтэц:
 *  - promo   — header-ийн доорх нимгэн урамшууллын зурвас
 *  - hero    — том брэнд гарчиг (Manrope, хар өнгө) + tagline
 *  - ribbon  — ангиллын дүрст товчлолууд (Apple-ийн product ribbon маяг),
 *              #anchor-аар доорх section руу үсэрнэ
 *  - sections — ангилал бүрийн lineup картууд
 *
 * Агуулга нь navigation.ts дээрх одоо байгаа sub menu-ний мэдээллээс
 * ангиллаар нь бүлэглэж авсан. Дараа шаардлагатай бол эндээс л засна.
 *
 * Зураг: одоогоор бодит зураг ашиглахгүй — карт бүр section доторх дарааллаараа
 * "Photo 1", "Photo 2"... гэсэн placeholder талбайтай (component дээр үүсгэнэ).
 * Бодит зураг гарахаар item-д image талбар нэмж холбоно.
 */

export type BrandRibbonIcon =
  | "smartphone"
  | "credit-card"
  | "users"
  | "layers"
  | "gift"
  | "package"
  | "zap"
  | "router"
  | "tv"
  | "clapperboard"
  | "monitor-play"
  | "sparkles";

export type BrandRibbonItem = {
  label: string;
  /** #section-anchor эсвэл энгийн route */
  href: string;
  icon: BrandRibbonIcon;
  /** Дүрсний өнгөт дэвсгэр (Tailwind классууд) — ангилал бүр өөр өнгөтэй */
  tint: string;
  /** Жижиг улаан тэмдэглэгээ (Apple-ийн "Preview" шиг) */
  badge?: string;
};

export type BrandLineupItem = {
  label: string;
  description?: string;
  href: string;
  badge?: string;
};

export type BrandSection = {
  /** Ribbon-оос үсрэх anchor id */
  id: string;
  title: string;
  description?: string;
  items: BrandLineupItem[];
};

export type BrandPromoStrip = {
  text: string;
  ctaLabel: string;
  href: string;
};

export type BrandPage = {
  slug: string;
  name: string;
  tagline: string;
  promo?: BrandPromoStrip;
  ribbon: BrandRibbonItem[];
  sections: BrandSection[];
};

// =====================================================================
// UNITEL — мобайл үйлчилгээ (ангилал: unitelNav, агуулга: mainNav > Мобайл)
// =====================================================================
export const unitelPage: BrandPage = {
  slug: "unitel",
  name: "Unitel",
  tagline: "Мобайл, дата болон ярианы багцууд.",
  promo: {
    text: "Шинэ хэрэглэгчийн захиалга — Төхөөрөмж 50% хямдралтай.",
    ctaLabel: "Дэлгэрэнгүй",
    href: "/campaigns",
  },
  ribbon: [
    {
      label: "Дараа төлбөрт",
      href: "#postpaid",
      icon: "smartphone",
      tint: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      label: "Урьдчилсан төлбөрт",
      href: "#prepaid",
      icon: "credit-card",
      tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      label: "Family үйлчилгээ",
      href: "#family",
      icon: "users",
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      label: "Нэмэлт үйлчилгээ",
      href: "#addons",
      icon: "layers",
      tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      label: "Гар утас",
      href: "#devices",
      icon: "package",
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Урамшуулал",
      href: "/campaigns",
      icon: "gift",
      tint: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  ],
  sections: [
    {
      id: "postpaid",
      title: "Дараа төлбөрт",
      description: "Сар бүрийн төлбөрт дата болон ярианы багцууд.",
      items: [
        { label: "Дата багц", href: "#" },
        { label: "Ярианы багц", href: "#" },
      ],
    },
    {
      id: "prepaid",
      title: "Урьдчилсан төлбөрт",
      description: "Хэрэглээндээ тааруулж цэнэглэдэг багцууд.",
      items: [{ label: "Урьдчилсан төлбөрт багц", href: "#" }],
    },
    {
      id: "family",
      title: "Family үйлчилгээ",
      description: "Гэр бүлээрээ хамтдаа хэрэглэх үйлчилгээ.",
      items: [],
    },
    {
      id: "addons",
      title: "Нэмэлт үйлчилгээ",
      items: [
        { label: "Data Add-on", href: "#" },
        { label: "Роуминг", href: "#" },
        { label: "Дугаар сонголт", href: "#" },
      ],
    },
    {
      id: "devices",
      title: "Гар утас",
      description: "Төхөөрөмж болон дагалдах хэрэгслүүд.",
      items: [
        { label: "Гар утас", href: "#" },
        { label: "SIM | eSIM", href: "#" },
        { label: "Дагалдах хэрэгсэл", href: "#" },
      ],
    },
  ],
};

// =====================================================================
// UNIVISION — телевиз, интернэт (ангилал + агуулга: mainNavLegacy)
// =====================================================================
export const univisionPage: BrandPage = {
  slug: "univision",
  name: "Univision",
  tagline: "IPTV, телевиз болон контентын үйлчилгээ.",
  promo: {
    text: "HBO Max — 1 сар үнэгүй. Шинэ хэрэглэгчдэд.",
    ctaLabel: "Дэлгэрэнгүй",
    href: "/campaigns",
  },
  ribbon: [
    {
      label: "Багцууд",
      href: "#packages",
      icon: "package",
      tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Add-On",
      href: "#addons",
      icon: "zap",
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Шийдэл",
      href: "#solutions",
      icon: "router",
      tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      label: "Суваг",
      href: "#channels",
      icon: "tv",
      tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      label: "Үзвэр",
      href: "#vod",
      icon: "clapperboard",
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      label: "Апп",
      href: "#apps",
      icon: "monitor-play",
      tint: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Life-style",
      href: "#lifestyle",
      icon: "sparkles",
      tint: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
      badge: "Coming soon",
    },
    {
      label: "Урамшуулал",
      href: "/campaigns",
      icon: "gift",
      tint: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  ],
  sections: [
    {
      id: "packages",
      title: "Багцууд",
      description: "Гэрийн интернэт, телевизийн үндсэн багцууд.",
      items: [
        { label: "Triple", href: "#" },
        { label: "Single", href: "#" },
      ],
    },
    {
      id: "addons",
      title: "Add-On",
      items: [
        { label: "Net Boost", href: "#" },
        { label: "Data-Add-on", href: "#" },
        { label: "Univision Go", href: "/univision-go" },
      ],
    },
    {
      id: "solutions",
      title: "Шийдэл",
      description: "Холболтын болон төхөөрөмжийн шийдлүүд.",
      items: [
        { label: "FTTH", href: "#" },
        { label: "STB, Dongle", href: "#" },
        { label: "FTTR, Mesh", href: "#" },
        { label: "Wi-Fi 6 | HGW, ONT", href: "#" },
      ],
    },
    {
      id: "channels",
      title: "Суваг",
      items: [
        { label: "Linier TV", href: "#" },
        { label: "PayTV packages", href: "#" },
        { label: "UniLive", href: "#" },
      ],
    },
    {
      id: "vod",
      title: "Үзвэр",
      description: "Хүссэн үедээ үзэх кино, контент.",
      items: [
        { label: "TVOD", href: "/entertainment/main#tvod" },
        { label: "SVOD", href: "#" },
      ],
    },
    {
      id: "apps",
      title: "Апп",
      items: [
        { label: "HBO Max", href: "#" },
        { label: "Sport App", href: "#" },
        { label: "M Karaoke", href: "#" },
        { label: "Traffic App", href: "#" },
      ],
    },
    {
      id: "lifestyle",
      title: "Life-style",
      items: [
        { label: "Smart Home", href: "#", badge: "Coming soon" },
        { label: "Security", href: "#", badge: "Coming soon" },
        { label: "Gaming", href: "#", badge: "Coming soon" },
      ],
    },
  ],
};
