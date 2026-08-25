/**
 * ЭРЭЛТТЭЙ БАЙГАА ҮЙЛЧИЛГЭЭ — Univision нүүрний section.
 *
 * ЗОРИЛГО: хэрэглэгчид хамгийн их авдаг үйлчилгээ, багцуудыг харуулах ба
 * байгууллагын зүгээс ТҮЛХЭХ (push) хүсэж буй зүйлээ энд байрлуулна.
 * Тиймээс жагсаалт нь борлуулалтын тоогоор биш, ГАРААР эрэмбэлэгддэг —
 * маркетингийн шийдвэр энэ файлд бичигдэнэ.
 *
 * ⚠️ АГУУЛГА БҮХЭЛДЭЭ PLACEHOLDER. Картын БҮТЦИЙГ л үзүүлнэ:
 *
 *   [ Photo N ]      ← зургийн слот
 *   Badge N          ← ангиллын pill
 *   Title            ← үйлчилгээний нэр
 *   Description      ← нэг мөр тайлбар
 *   [ CTA → ]        ← текст линк
 *
 * Бичвэрийн загвар нь `recommended-plans.ts`-тэй ижил ("Title",
 * "Highlight N") — нүүрний бүх placeholder нэг хэлээр бичигдсэн байх нь
 * юу батлагдаагүйг нэг харцаар харуулна.
 */
export type FeaturedService = {
  id: string;
  /** Зургийн слотын зүүн дээд булангийн жижиг pill */
  badge: string;
  /** Зургийн слотод харагдах шошго — жинхэнэ зураг гартал */
  photoLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export const featuredServicesSection = {
  title: "Эрэлттэй байгаа үйлчилгээ",
};

/**
 * Хоёр карт — `md:grid-cols-2`. Гурав дахийг нэмвэл grid-ийг ч зэрэг
 * өөрчлөх шаардлагатай (`featured-services.tsx`).
 */
export const featuredServices: FeaturedService[] = [
  {
    id: "service-1",
    badge: "Badge 1",
    photoLabel: "Photo 1",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA",
    href: "#",
  },
  {
    id: "service-2",
    badge: "Badge 2",
    photoLabel: "Photo 2",
    title: "Title",
    description: "Description",
    ctaLabel: "CTA",
    href: "#",
  },
];
