/**
 * ИТГЭЛ ТӨРҮҮЛЭХ (trust build) section — Jio-гийн нүүрнээс санаа авсан.
 *
 * Гурван блок ЭРГЭЛДЭЖ байрлана (текст ↔ медиа солигдоно):
 *
 *   ┌────────────┐              ┌──────────────┐
 *   │  Title     │  [ Video 1 ] │  [ Video 2 ] │  Title
 *   │  Desc      │              │              │  Desc
 *   │  [ CTA ]   │              │              │  [ CTA ]
 *   └────────────┘              └──────────────┘
 *                 …гурав дахь нь дахин зүүн талд
 *
 * ⚠️ АГУУЛГА БҮХЭЛДЭЭ PLACEHOLDER. Медиа хэсэг нь ВИДЕО тоглох байр —
 * одоогоор "Video N" гэсэн шошготой талбай.
 *
 * ⚠️ ЖИНХЭНЭ ВИДЕО тавихад WCAG 2.2.2 (Pause, Stop, Hide) хүчинтэй болно:
 * 5 секундээс урт автомат хөдөлгөөнд ЗОГСООХ товч ЗААВАЛ шаардлагатай.
 * `promo-banner.tsx > PromoBannerFull`-д тэр товчны бэлэн хэрэгжүүлэлт
 * байгаа — түүнийг эндээ хуулж авна. Placeholder дээр товч тавиагүй:
 * ажиллахгүй товч нь screen reader-т хуурамч амлалт өгнө.
 */
export type TrustBlock = {
  id: string;
  /** Видеоны байрны шошго — жинхэнэ видео тавигдтал */
  videoLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export const trustBuildSection = {
  /** Харагдахгүй гарчиг — section landmark-д нэр өгнө (Jio-д ч харагдах гарчиг байхгүй) */
  srTitle: "Итгэл төрүүлэх",
};

export const trustBlocks: TrustBlock[] = [
  {
    id: "trust-1",
    videoLabel: "Video 1",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA button",
    href: "#",
  },
  {
    id: "trust-2",
    videoLabel: "Video 2",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA button",
    href: "#",
  },
  {
    id: "trust-3",
    videoLabel: "Video 3",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA button",
    href: "#",
  },
];
