export type CampaignCategory = {
  id: string;
  label: string;
};

export type CampaignHighlight = {
  id: string;
  category: string; // CampaignCategory.id
  /** Top-right badge — brand ногоон өнгөөр харагдана */
  badge?: string;
  /** Жинхэнэ зураг бэлэн болтол харагдах placeholder текст */
  placeholderText: string;
  /** Урамшууллын хүчинтэй хугацаа */
  duration: string;
  title: string;
  ctaText: string;
  ctaHref: string;
};

export const campaignsHero = {
  title: "Урамшуулал",
  description:
    "Монголдоо тэргүүлэх интернет сүлжээгээр, ТВ, контент болон төхөөрөмжийн онцлох урамшууллыг аваарай.",
};

export const campaignCategories: CampaignCategory[] = [
  { id: "all", label: "Бүх урамшуулал" },
  { id: "internet-tv", label: "Интернет + ТВ" },
  { id: "content", label: "Контент, апп" },
  { id: "devices", label: "Төхөөрөмж" },
  { id: "accessories", label: "Дагалдах хэрэгсэл" },
];

export const campaignHighlights: CampaignHighlight[] = [
  {
    id: "promo-1",
    category: "internet-tv",
    badge: "Онцлох",
    placeholderText: "Promo 1",
    duration: "2026.05.01 — 2026.06.30",
    title: "Шинэ хэрэглэгч — Интернет + ТВ 30% хямдрал",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
  {
    id: "promo-2",
    category: "content",
    badge: "Онцлох",
    placeholderText: "Promo 2",
    duration: "2026.05.15 — 2026.07.15",
    title: "HBO Max — 3 сар үнэгүй",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
  {
    id: "promo-3",
    category: "internet-tv",
    badge: "Онцлох",
    placeholderText: "Promo 3",
    duration: "2026.06.01 — 2026.08.31",
    title: "Интернет + ТВ 1 жил — 39,900₮ /сар",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
  {
    id: "promo-4",
    category: "internet-tv",
    placeholderText: "Promo 4",
    duration: "2026.06.10 — 2026.07.10",
    title: "Үнэгүй суурилуулалт — Шинэ хэрэглэгчид",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
  {
    id: "promo-5",
    category: "devices",
    badge: "Онцлох",
    placeholderText: "Promo 5",
    duration: "2026.05.20 — 2026.06.20",
    title: "Univision 4.0 ТВ Box-той интернет багц",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
  {
    id: "promo-6",
    category: "accessories",
    placeholderText: "Promo 6",
    duration: "2026.06.01 — 2026.06.30",
    title: "Mesh Wi-Fi router бэлгэндээ",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
];
