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
    detailHref: "/unitel#postpaid",
    features: [{ title: "Сүлжээндээ хязгааргүй", description: "ярих эрх" }],
    extras: ["MMusic & MBook 60% хөнгөлөлт"],
  },
  {
    id: "plus-16",
    name: "PLUS",
    data: "16GB",
    tier: "plus",
    price: "32'000₮",
    detailHref: "/unitel#postpaid",
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
    detailHref: "/unitel#postpaid",
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
    detailHref: "/unitel#postpaid",
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
    detailHref: "/unitel#postpaid",
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
