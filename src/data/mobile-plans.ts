/**
 * Мобайл · Дараа төлбөрт багцууд — нүүр хуудасны main product section.
 *
 * Unitel-ийн бодит дараа төлбөрт багцын мэдээллээс (PLUS / PRIORITY /
 * PREMIUM, НӨАТ-гүй сарын суурь хураамж) санаа авсан. Үнэ, эрхүүд
 * өөрчлөгдвөл эндээс л засна.
 */

/** Багцын түвшин — badge болон check дүрсний өнгийг тодорхойлно */
export type MobilePlanTier = "plus" | "priority" | "premium";

export type MobilePlanFeature = {
  /** Онцлох хэсэг — картан дээр тодоор гарна */
  title: string;
  /** Тайлбар (байвал title-ийн ард үргэлжилнэ) */
  description?: string;
};

export type MobilePlan = {
  id: string;
  /** Багцын нэр (PLUS, PRIORITY, PREMIUM) */
  name: string;
  /** Дата эрх — нэрийн хажуудах pill badge */
  data: string;
  tier: MobilePlanTier;
  /** Сарын суурь хураамж (НӨАТ-гүй) */
  price: string;
  features: MobilePlanFeature[];
  /** "Багцын нэмэлт эрх" жагсаалт */
  extras: string[];
  /** Санал болгох багц — ялгаатай styling */
  recommended?: boolean;
  detailHref: string;
};

export const mobilePlansTitle = "Мобайл · Дараа төлбөрт";
export const mobilePlansDescription =
  "Сар бүрийн тогтмол төлбөртэй, хэрэглээндээ тохирсон багцаа сонгоорой.";

export const mobilePlans: MobilePlan[] = [
  {
    id: "plus-12",
    name: "PLUS",
    data: "12GB",
    tier: "plus",
    price: "28'000₮",
    detailHref: "#",
    features: [{ title: "Сүлжээндээ хязгааргүй", description: "ярих эрх" }],
    extras: ["MMusic & MBook 60% хөнгөлөлт"],
  },
  {
    id: "plus-16",
    name: "PLUS",
    data: "16GB",
    tier: "plus",
    price: "32'000₮",
    detailHref: "#",
    features: [{ title: "Сүлжээндээ хязгааргүй", description: "ярих эрх" }],
    extras: ["LookTV | Basic багц", "MMusic & MBook 6 сарын эрх"],
  },
  {
    id: "priority-24",
    name: "PRIORITY",
    data: "24GB",
    tier: "priority",
    price: "55'000₮",
    recommended: true,
    detailHref: "#",
    features: [
      {
        title: "Priority хурд",
        description: "Сүлжээний ачаалалтай цагуудад 3 дахин өндөр хурдтай дата",
      },
      {
        title: "Priority үйлчилгээ",
        description: "Лавлах төвийн хүлээлэггүй үйлчилгээ",
      },
      { title: "Бүх сүлжээнд хязгааргүй", description: "ярих эрх" },
    ],
    extras: ["LookTV | Premium багц", "MMusic & MBook 6 сарын эрх"],
  },
  {
    id: "priority-48",
    name: "PRIORITY",
    data: "48GB",
    tier: "priority",
    price: "73'000₮",
    detailHref: "#",
    features: [
      {
        title: "Priority хурд",
        description: "Сүлжээний ачаалалтай цагуудад 3 дахин өндөр хурдтай дата",
      },
      {
        title: "Priority үйлчилгээ",
        description: "Лавлах төвийн хүлээлэггүй үйлчилгээ",
      },
      { title: "Бүх улсад ашиглах Роуминг 1GB", description: "дата" },
      { title: "Бүх сүлжээнд хязгааргүй", description: "ярих эрх" },
    ],
    extras: ["Gadget SIM 4GB", "LookTV | Premium багц", "MMusic & MBook 6 сарын эрх"],
  },
  {
    id: "premium-88",
    name: "PREMIUM",
    data: "88GB",
    tier: "premium",
    price: "100'000₮",
    detailHref: "#",
    features: [
      {
        title: "Premium үйлчилгээ",
        description: "24/7 Юнител, Юнивишн нэгдсэн хувийн туслах үйлчилгээ",
      },
      {
        title: "Priority хурд",
        description: "Сүлжээний ачаалалтай цагуудад 3 дахин өндөр хурдтай дата",
      },
      { title: "Бүх улсад ашиглах Роуминг 2GB", description: "дата" },
      { title: "Бүх сүлжээнд хязгааргүй", description: "ярих, мессеж бичих" },
    ],
    extras: ["Gadget SIM 4GB", "LookTV | Premium багц", "MMusic & MBook 6 сарын эрх"],
  },
];

/**
 * БАГЦЫН ГЭР БҮЛИЙН ОНЦЛОХ ЭРХҮҮД — `tier`-ээр, тухайн ШАТААР БИШ.
 *
 * ⚠️⚠️ ЭНД ТӨВЛӨРҮҮЛСЭН ШАЛТГААН (2026-09-11). Эдгээр гурван жагсаалт өмнө нь
 * ХОЁР ГАЗАР бие даан бичигдсэн байв:
 *   · `hero-assistant.ts > YOUTH_PLAN_HIGHLIGHTS`  (AI туслахын карт)
 *   · `recommended-plans.ts > unitelRecommendedPlans.cards.recommended[].highlights`
 *     (нүүрний "Санал болгох багц" карт)
 * Захиалагч эрхүүдийг шинэчлэхэд ЗӨВХӨН НЭГ нь засагдаж, нөгөө нь хоцорсон:
 * нүүрний PREMIUM карт нь PRIORITY-гийнхтэй ЯГ ИЖИЛ гурван мөр харуулж байв
 * ("суулд update хийсэн тэр нь эргээд буруу болсон"). Одоо НЭГ эх сурвалж —
 * дараагийн шинэчлэлт хоёр газарт зэрэг хүрнэ.
 *
 * ⚠️ ДАТАНЫ ЭРХ нь ХҮРЭЭ ("8GB-32GB"), тухайн шатны тоо БИШ — PLUS гэр бүлд
 * 8, 12, 16, 32GB шатууд байдгийг илэрхийлнэ. Картын ТОМ тоо (`plan.data`) нь
 * харин ТОДОРХОЙ шат. Хоёр нь өөр зүйл хэлж байгааг санах.
 *
 * ⚠️ ЭРЭМБЭ САНААТАЙ: дата эрхийн мөр ГУРВУУЛАНД ХАМГИЙН ДООР. Гурван карт
 * зэрэгцэхэд ижил төрлийн мөр ижил эгнээнд байх нь харьцуулахад хялбар.
 * (Өмнө нь PLUS дээр дата эрх 2-рт байсан.)
 *
 * ⚠️ Эдгээр нь `MobilePlan.extras` (LookTV, MMusic & MBook) БИШ. `extras` нь
 * тухайн ШАТАД дагалддаг зүйл, эдгээр нь ГЭР БҮЛИЙН онцлог. Хоёуланг нэг
 * жагсаалт болгож хутгахгүй.
 */
export const planTierHighlights: Record<MobilePlanTier, string[]> = {
  plus: [
    "Хэрэглээндээ тохируулан багцаа бүтээх боломж",
    "Сүлжээндээ хязгааргүй ярих эрх",
    "8GB-32GB дата эрх",
  ],
  priority: [
    "Сүлжээний ачаалалтай цагуудад x3 өндөр хурд",
    "Лавлах төвийн хүлээлэггүй үйлчилгээ",
    "16GB-88GB дата эрх",
  ],
  premium: [
    "24/7 Юнител, Юнивишн хувийн туслах үйлчилгээ",
    "Сүлжээний ачаалалтай цагуудад x3 өндөр хурд",
    "88GB-200GB дата эрх",
  ],
};
