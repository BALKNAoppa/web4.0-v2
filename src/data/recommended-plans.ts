/**
 * "САНАЛ БОЛГОХ БАГЦ" — нүүрний БҮРЭН ХЭМЖЭЭНИЙ section-ий data.
 *
 * ⚠️ АГУУЛГА БҮХЭЛДЭЭ PLACEHOLDER. Картын БҮТЦИЙГ л үзүүлнэ:
 *
 *   [ Card photo ]        ← зургийн слот
 *   Title                 ← багцын нэр
 *   ✓ Highlight 1…4       ← онцлох эрхүүд
 *   [ CTA ]               ← бүтэн өргөний товч
 *
 * Бодит багцын жагсаалт `mobile-plans.ts > mobilePlans`-д ХЭВЭЭР байгаа —
 * агуулга батлагдахад эндээс тэр рүү холбоно.
 *
 * ⚠️ Энэ section нь өмнө hero-гийн доод 40%-д шахагдаж байсан. Одоо ТУСДАА,
 * өндрийн хязгааргүй section болсон тул карт нь бүтэн хэмжээгээрээ гарна.
 */

export type PlanTabId = "recommended" | "other";

export type PlanTab = {
  id: PlanTabId;
  label: string;
};

export type PlanCardContent = {
  id: string;
  /** Зургийн слотод харагдах шошго — жинхэнэ зураг гартал */
  photoLabel: string;
  title: string;
  /** Картан дээр check-тэй гарах 3–4 мөр */
  highlights: string[];
  ctaLabel: string;
  href: string;
  /**
   * Санал болгож буй багц — брэнд өнгөт хүрээ + баруун дээд булангийн тэмдэг
   * (`lib/brand.ts > ACCENT`).
   */
  recommended?: boolean;
};

/**
 * Section-ий толгой. Бичвэр нь PLACEHOLDER — жинхэнэ маркетингийн "trigger"
 * үг шийдэгдээгүй тул слотыг нэрлэсэн шошго л тавьсан.
 */
export const plansHeading = {
  title: "Санал болгох багц",
  subtitle: "Энд онцлох trigger үг байрлана",
};

/** Санал болгож буй картын баруун дээд булангийн тэмдэг */
export const RECOMMENDED_BADGE = "САНАЛ БОЛГОХ";

/** Хоёр таб. Нэрс нь ТОДОРХОЙ — доторх карт нь placeholder. */
export const planTabs: PlanTab[] = [
  { id: "recommended", label: "Танд санал болгох багц" },
  { id: "other", label: "Бусад багцууд" },
];

/**
 * Карт бүр ИЖИЛ placeholder-тай — энэ нь wireframe тул ялгаа нь агуулгад биш,
 * БҮТЦЭД байна. Ялгарах цорын ганц зүйл нь `recommended`.
 *
 * `count` — highlight-ийн тоо. 3 ба 4 хоёулаа зөв харагдахыг үзүүлэхээр
 * зориуд ХОЛИСОН (жинхэнэ багцууд ч ижил тооны эрхтэй байх албагүй).
 */
const card = (id: string, count: 3 | 4, recommended = false): PlanCardContent => ({
  id,
  photoLabel: "Card photo",
  title: "Title",
  highlights: Array.from({ length: count }, (_, i) => `Highlight ${i + 1}`),
  ctaLabel: "CTA",
  href: "#",
  recommended,
});

export const planCards: Record<PlanTabId, PlanCardContent[]> = {
  recommended: [card("rec-1", 3), card("rec-2", 4, true), card("rec-3", 4)],
  other: [card("other-1", 3), card("other-2", 3), card("other-3", 4)],
};
