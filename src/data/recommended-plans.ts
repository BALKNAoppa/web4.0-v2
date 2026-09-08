/**
 * "САНАЛ БОЛГОХ БАГЦ" — нүүрний БҮРЭН ХЭМЖЭЭНИЙ section-ий data.
 *
 * Картын БҮТЭЦ хоёр брэндэд ИЖИЛ:
 *
 *   [ Card photo ]        ← зургийн слот
 *   Title                 ← багцын нэр
 *   ✓ Highlight 1…4       ← онцлох эрхүүд
 *   [ CTA ]               ← бүтэн өргөний товч
 *
 * ⚠️ АГУУЛГА нь брэнд бүрд ӨӨР. `AppPromo`-той ижил зарчим: НЭГ компонент,
 * `content` prop-оор data өгнө. Ингэснээр хоёр section хожим зөрөх
 * боломжгүй, гэхдээ доторх багц нь брэндийнхээ бодит контексттэй байна.
 *
 *   Unitel    — бүхэлдээ PLACEHOLDER (мобайл багцын агуулга батлагдаагүй)
 *   Univision — БОДИТ багцууд (`plans.ts`-ийн M+ · L+ · XL+)
 */

export type PlanTabId = "recommended" | "other";

export type PlanTab = {
  id: PlanTabId;
  label: string;
};

export type PlanCardContent = {
  id: string;
  /**
   * Зургийн слотын ДУНДАА гарах WIREFRAME шошго ("Card photo" гэх мэт) —
   * "энд зураг ирнэ" гэдгийг заана.
   *
   * ⚠️ ЗААВАЛ БИШ. Орхивол слот нь ЗҮГЭЭР Л саарал талбай болно (дүрс,
   * шошго гарахгүй) — SMART DATA / SMART TALK зэрэг БОДИТ багцад ийм.
   *
   * ⚠️ Слот ӨӨРӨӨ ХЭЗЭЭ Ч ХАСАГДАХГҮЙ: `image` ч, `photoLabel` ч байхгүй
   * үед 1:1 хэмжээ нь хэвээр үлдэнэ. Эс бөгөөс тэр карт зурагтай картаас
   * ~340px намхан болж, таб солиход section-ий өндөр үсэрнэ.
   */
  photoLabel?: string;
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
  /**
   * `mobile-plans.ts`-ийн багцын id.
   *
   * ⚠️ БАГЦЫН НЭР, ДАТА ЭРХ, СУУРЬ ХУРААМЖ гурвуулаа ТЭНДЭЭС ирнэ — энд
   * ДАВХАРДУУЛЖ БИЧИХГҮЙ. Тариф өөрчлөгдвөл `mobile-plans.ts`-ийг л засна.
   * Байхгүй бол карт нь `title`-ээ хэрэглэж, дата pill ба үнийн мөр
   * ОГТ гарахгүй (Univision-ы placeholder картууд ийм).
   */
  planId?: string;
  /**
   * Картын дээд талын ЗУРАГ — `public/`-ээс эхлэх зам.
   *
   * ХЭМЖЭЭ: слот нь 1:1 (дөрвөлжин) тул 2× нягтад **880 × 880**.
   * Байвал зураг `object-cover`-оор слотыг дүүргэж, дээр нь scrim орж,
   * багцын нэр ба дата pill ЦАГААН болно. Байхгүй бол саарал
   * placeholder + шошго хэвээр.
   *
   * ⚠️ БАГЦЫН НЭР, ДАТА нь зургийн ДООД ЗҮҮН/БАРУУН буланд ГАРНА тул
   * тэр хоёр талбайг зурган дээрээ чөлөөтэй үлдээ.
   */
  image?: string;
  /** Зургийн alt. Чимэглэл бол бүү бич (WCAG 1.1.1). */
  imageAlt?: string;
};

export type RecommendedPlansContent = {
  heading: { title: string; subtitle: string };
  tabs: PlanTab[];
  cards: Record<PlanTabId, PlanCardContent[]>;
};

/** Санал болгож буй картын баруун дээд булангийн тэмдэг — хоёр брэндэд ижил */
export const RECOMMENDED_BADGE = "САНАЛ БОЛГОХ";

// =====================================================================
// UNITEL — бүхэлдээ PLACEHOLDER (wireframe)
// =====================================================================

/**
 * Карт бүр ИЖИЛ placeholder-тай — энэ нь wireframe тул ялгаа нь агуулгад биш,
 * БҮТЦЭД байна. Ялгарах цорын ганц зүйл нь `recommended`.
 *
 * `count` — highlight-ийн тоо. 3 ба 4 хоёулаа зөв харагдахыг үзүүлэхээр
 * зориуд ХОЛИСОН (жинхэнэ багцууд ч ижил тооны эрхтэй байх албагүй).
 */
const placeholderCard = (id: string, count: 3 | 4, recommended = false): PlanCardContent => ({
  id,
  photoLabel: "Card photo",
  title: "Title",
  highlights: Array.from({ length: count }, (_, i) => `Highlight ${i + 1}`),
  ctaLabel: "CTA",
  href: "#",
  recommended,
});

export const unitelRecommendedPlans: RecommendedPlansContent = {
  // ⚠️ SUBTITLE нь одоо БОДИТ бичвэр (2026-09-07) — өмнө нь "Энд онцлох
  // trigger үг байрлана" гэсэн нэрлэсэн placeholder байв.
  heading: {
    title: "Санал болгох багц",
    subtitle: "Хэрэглээнд тань тохирох дата болон ярианы багцууд.",
  },
  tabs: [
    { id: "recommended", label: "Танд санал болгох багц" },
    { id: "other", label: "Бусад багцууд" },
  ],
  cards: {
    // ⚠️ ЭНЭ ГУРАВ нь PLACEHOLDER БИШ — захиалагчийн өгсөн бодит эрхүүд.
    // Нэр, дата, үнэ нь `planId`-аар `mobile-plans.ts`-ээс ирнэ.
    //
    // ЗУРАГ — `public/Unitel/Recommandation/` (хавтасны нэр захиалагчийн
    // байршуулсан хэлбэрээр, "Recommendation" БИШ). `alt` бичээгүй нь
    // ЗӨВ: багцын нэр, дата эрх нь зургийн дээр БОДИТ бичвэр болж гардаг
    // тул зураг нь чимэглэл (WCAG 1.1.1).
    // ⚠️ Слот нь 1:1. `Plus.jpg` (2048×2048) яг таарна; `Priority.png` ба
    // `Premium.png` нь 1080×1350 (4:5) тул дээд/доод ~20% ТАЙРАГДАНА —
    // гол дүрс нь төвөөс хол бол шинэ кроп хэрэгтэй.
    recommended: [
      {
        id: "rec-plus",
        planId: "plus-16",
        image: "/Unitel/Recommandation/Plus.jpg",
        photoLabel: "Card photo",
        title: "PLUS",
        highlights: [
          "Хэрэглээндээ тохируулан багцаа бүтээх боломж",
          "8GB-32GB дата эрх",
          "Сүлжээндээ хязгааргүй ярих эрх",
        ],
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
      {
        id: "rec-priority",
        planId: "priority-48",
        image: "/Unitel/Recommandation/Priority.png",
        photoLabel: "Card photo",
        title: "PRIORITY",
        highlights: [
          "Сүлжээний ачаалалтай цагуудад x3 өндөр хурд",
          "Лавлах төвийн хүлээлэггүй үйлчилгээ",
          "16GB-88GB дата эрх",
        ],
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
        recommended: true,
      },
      {
        id: "rec-premium",
        planId: "premium-88",
        image: "/Unitel/Recommandation/Premium.png",
        photoLabel: "Card photo",
        title: "PREMIUM",
        // ⚠️⚠️ ЭДГЭЭР 3 МӨР нь PRIORITY-гийнхтэй ЯГ ИЖИЛ. Захиалагчийн
        // өгсөн жагсаалтад 3 дахь багц нь "Priority" гэж ХОЁР ДАХЬ УДАА
        // бичигдсэн (хуулсан алдаа бололтой) тул PREMIUM-ийн ӨӨРИЙН
        // эрхүүд ХҮЛЭЭГДЭЖ БАЙНА. Ирэхэд зөвхөн энэ гурван мөрийг солино.
        highlights: [
          "Сүлжээний ачаалалтай цагуудад x3 өндөр хурд",
          "Лавлах төвийн хүлээлэггүй үйлчилгээ",
          "16GB-88GB дата эрх",
        ],
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
    ],
    // ⚠️ ЗУРАГГҮЙ — саарал PLACEHOLDER слоттой (захиалагчийн шийдвэр):
    // `image` өгөөгүй тул слот нь саарал placeholder болж, дундаа "энд зураг
    // ирнэ" гэсэн дүрс+шошготой (`photoLabel`) гарна. 1:1 хэмжээ нь зурагтай
    // картуудтай ижил байснаар таб солиход section-ий өндөр үсрэхгүй.
    //
    // ⚠️ Өмнөх 3 placeholder карт (`other-1..3`) ХАСАГДСАН — эдгээр нь
    // захиалагчийн өгсөн БОДИТ хоёр багц тул wireframe-ийн орлуулагчийг
    // дэргэд нь үлдээх нь "аль нь батлагдсан бэ" гэдгийг ойлгомжгүй болгоно.
    //
    // ⚠️ `planId` АЛГА — эдгээр багц `mobile-plans.ts`-д бүртгэлгүй тул
    // дата pill ба суурь хураамжийн мөр гарахгүй. Тарифыг нь тэнд бүртгээд
    // `planId` өгвөл автоматаар гарна, энд тоо давхардуулж бичихгүй.
    other: [
      {
        id: "smart-data",
        photoLabel: "Card photo",
        title: "SMART DATA",
        highlights: ["Хэрэглээнд тохирсон дата", "Өндөр хурдны сүлжээ", "Уян хатан сонголт"],
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
      {
        id: "smart-talk",
        photoLabel: "Card photo",
        title: "SMART TALK",
        // ⚠️ "Хязгаарлалттай дуудлага" — захиалагчийн бичсэн ЯГ ТЭР ҮГ.
        // Давуу тал болгож харуулж буй мөрөнд "хязгаарлалттай" гэдэг нь
        // сөрөг сонсогдох тул "Хязгааргүй" гэсэн үг байсан эсэхийг лавлах.
        highlights: ["Бүх сүлжээнд ярих эрх", "Хязгаарлалттай дуудлага", "Нэмэлт боломжууд"],
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
    ],
  },
};

// =====================================================================
// UNIVISION — картын агуулга ч PLACEHOLDER
//
// ⚠️ Эхлээд `plans.ts`-ээс M+ · L+ · XL+-ийн БОДИТ үзүүлэлтийг (хурд, дата
// эрх, кино эрх, HBO Max) хуулж тавьсан байсныг ХАСАВ. Хоёр шалтгаан:
//   1. Тоо давхардаж бичигдэж, тариф өөрчлөгдөхөд хоёр файл зөрөх эрсдэлтэй
//   2. Нүүрний бусад бүх блок placeholder байхад ганц энэ нь бодит тоотой
//      байвал "аль нь батлагдсан вэ" гэдэг нь харагчид эргэлзээтэй болно
// Бодит үзүүлэлт `/main-packages` хуудсанд ХЭВЭЭР байгаа.
//
// ТАБЫН НЭРС нь Univision-ынхаараа хэвээр — тэр нь хуурамч тоо биш,
// бүтээгдэхүүний БҮТЭЦ (гурвалсан = интернэт + ТВ + суурин утас).
// =====================================================================

export const univisionRecommendedPlans: RecommendedPlansContent = {
  heading: {
    title: "Санал болгох багц",
    subtitle: "Энд онцлох trigger үг байрлана",
  },
  tabs: [
    { id: "recommended", label: "Гурвалсан багц" },
    { id: "other", label: "Бусад үйлчилгээ" },
  ],
  cards: {
    recommended: [
      placeholderCard("uv-rec-1", 3),
      placeholderCard("uv-rec-2", 4, true),
      placeholderCard("uv-rec-3", 4),
    ],
    other: [
      placeholderCard("uv-other-1", 3),
      placeholderCard("uv-other-2", 3),
      placeholderCard("uv-other-3", 4),
    ],
  },
};
