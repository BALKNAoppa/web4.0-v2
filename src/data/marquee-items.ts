/**
 * Энтертайнмэнт section-ий контент (`featured-marquee.tsx`).
 *
 * Хоёр тусдаа carousel, ижил pattern, 5 сек тутам зэрэг шилжинэ:
 *  - `apps`   — ТОМ center-peek carousel (гарчиг · тайлбар · CTA харагдана)
 *  - `movies` — ЖИЖИГ center-peek carousel (зөвхөн нэр, md+ дээр)
 *
 * ⚠️ АГУУЛГА БҮХЭЛДЭЭ PLACEHOLDER. Зураг ч, бичвэр ч жинхэнэ биш —
 * зөвхөн слотуудыг НЭРЛЭСЭН. Компонент нь `image` байхгүй үед `shade`
 * дэвсгэр + `photoLabel`-ийн том бүдэг бичээсээр буулгадаг.
 *
 * Жинхэнэ контент холбогдох үед: `photoLabel` → `image`, `name`/
 * `description`-д бодит бичвэр. Компонент хөндөх шаардлагагүй.
 */

export type MarqueeItem = {
  id: string;
  /**
   * Зургийн слотод харагдах шошго — `image` байхгүй үед л хэрэглэгдэнэ.
   * `name`-ээс ТУСДАА: доод талын гарчиг ба зургийн байрны бичээс хоёр
   * ижил байвал нэг картан дээр нэг үг хоёр удаа гарна.
   */
  photoLabel: string;
  name: string;
  description: string;
  href: string;
  /** Зураггүй үеийн дэвсгэрийн аяс */
  shade: "light" | "medium" | "dark";
  /** Landscape зураг — байхгүй үед `shade` + `photoLabel` placeholder */
  image?: string;
};

// ====================================================
// APPS — ТОМ carousel. Дугаарласан шалтгаан: carousel-д нэг зэрэг НЭГ карт
// харагддаг тул бүгд ижил бичвэртэй байвал шилжиж байгаа эсэх нь мэдэгдэхгүй.
// (`promo-banner.ts > samplePromoCards`-тай ижил зарчим.)
// ====================================================
export const apps: MarqueeItem[] = [
  {
    id: "package-1",
    photoLabel: "Package picture 1",
    name: "Package name 1",
    description: "Description",
    href: "#",
    shade: "dark",
  },
  {
    id: "package-2",
    photoLabel: "Package picture 2",
    name: "Package name 2",
    description: "Description",
    href: "#",
    shade: "medium",
  },
  {
    id: "package-3",
    photoLabel: "Package picture 3",
    name: "Package name 3",
    description: "Description",
    href: "#",
    shade: "light",
  },
  {
    id: "package-4",
    photoLabel: "Package picture 4",
    name: "Package name 4",
    description: "Description",
    href: "#",
    shade: "dark",
  },
];

// ====================================================
// MOVIES — ЖИЖИГ carousel.
//
// ⚠️ Өмнө нь `tvod-movies.ts`-ээс бодит 8 киног (Dune, Oppenheimer …)
// постертой нь татдаг байсныг ХАСАВ: агуулга placeholder болсон тул тэр
// хамаарал шаардлагагүй, мөн тэнд id таарахгүй бол `throw` хийдэг байв.
// ====================================================
export const movies: MarqueeItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `movie-${i + 1}`,
  photoLabel: `Movie picture ${i + 1}`,
  name: `Movie name ${i + 1}`,
  description: "Description",
  href: "#",
  shade: (["light", "medium", "dark"] as const)[i % 3],
}));

export const featuredSection = {
  title: "Энтертайнмэнттэй холбоотой гарчиг энд байрлана",
  /** ТОМ картын товчны бичвэр */
  ctaLabel: "CTA button",
};
