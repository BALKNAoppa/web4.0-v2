export type MobilePlanTier = "plus" | "priority" | "premium";

export type MobilePlanFeature = {
  title: string;
  description?: string;
};

export type MobilePlan = {
  id: string;
  name: string;
  data: string;
  tier: MobilePlanTier;
  price: string;
  features: MobilePlanFeature[];
  extras: string[];
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
