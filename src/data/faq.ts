/**
 * Univision Web 4.0 — Тусламжийн (FAQ) section data
 *
 * Бүтэц:
 *  - faqCategories: Home page-н entry point (6 circular icon)
 *  - faqMeta:       Home + Support хуудасны гарчиг, хайлтын текстүүд
 *  - faqTopics:     /support хуудас дээрх Accordion-н түгээмэл асуултууд
 */

// ====================================================
// TYPES
// ====================================================
/** Lucide icon-ы нэр (faq.tsx-д map хийгдэнэ) */
export type FaqIcon =
  | "internet"
  | "tv"
  | "movie"
  | "billing"
  | "subscription"
  | "agent";

export type FaqCategory = {
  id: string;
  label: string;
  icon: FaqIcon;
  href: string;
  /** /support хуудсанд категори сонгогдсон үед харагдах гарчиг */
  supportTitle: string;
  /** true бол хуудас руу шилжихгүй, глобал chatbot-ыг нээнэ */
  opensChat?: boolean;
};

export type FaqTopic = {
  id: string;
  question: string;
  /** Plain текст — олон параграфтай бол `\n\n`-ээр тусгаарлана */
  answer: string;
};

export type SupportTopic = {
  id: string;
  label: string;
  href: string;
};

export type CategoryDetail = {
  /** Title-ын доор харагдах товч тайлбар */
  description: string;
  /** Ask bar-ийн доор харагдах жишээ асуултууд (chip) */
  quickQuestions: string[];
  /** Зүүн card — "Түгээмэл асуудлууд" */
  frequentTopics: SupportTopic[];
  /** Баруун card — "Бусад асуудлууд" (2-багана) */
  otherTopics: SupportTopic[];
};

/** Quick link иконы нэр (support-category-detail.tsx-д map хийгдэнэ) */
export type SupportQuickLinkIcon = "usage" | "account" | "app" | "business";

export type SupportQuickLink = {
  id: string;
  icon: SupportQuickLinkIcon;
  /** Иконы дугуй дэвсгэр + икон өнгө (tailwind class) */
  iconBg: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
};

// ====================================================
// META
// ====================================================
export const faqMeta = {
  title: "Танд туслaмж хэрэгтэй юу?",
  description: "Түгээмэл асуултыг ангилал тус бүрээр хялбархан хайж олоорой.",
  searchPlaceholder: "Жишээ нь: Интернетийн хурд хэрхэн шалгах вэ?",
  askButtonText: "Асуух",
  trendingTitle: "Түгээмэл асуултууд",
};

// ====================================================
// CATEGORIES — Home entry point (circular icons)
// Бүгд /support руу заана
// ====================================================
export const faqCategories: FaqCategory[] = [
  {
    id: "internet",
    label: "Интернэт",
    icon: "internet",
    href: "/support?category=internet",
    supportTitle: "Танд интернэттэй холбоотой тусламж хэрэгтэй юу?",
  },
  {
    id: "tv",
    label: "ТВ суваг",
    icon: "tv",
    href: "/support?category=tv",
    supportTitle: "Танд ТВ сувагтай холбоотой тусламж хэрэгтэй юу?",
  },
  {
    id: "movie",
    label: "Кино багц",
    icon: "movie",
    href: "/support?category=movie",
    supportTitle: "Танд кино багцтай холбоотой тусламж хэрэгтэй юу?",
  },
  {
    id: "billing",
    label: "Төлбөр",
    icon: "billing",
    href: "/support?category=billing",
    supportTitle: "Танд төлбөртэй холбоотой тусламж хэрэгтэй юу?",
  },
  {
    id: "subscription",
    label: "Захиалга",
    icon: "subscription",
    href: "/support?category=subscription",
    supportTitle: "Танд захиалгатай холбоотой тусламж хэрэгтэй юу?",
  },
  {
    id: "agent",
    label: "Ажилтантай холбогдох",
    icon: "agent",
    href: "/support?category=agent",
    supportTitle: "Манай ажилтантай хэрхэн холбогдох вэ?",
    opensChat: true,
  },
];

// ====================================================
// TRENDING TOPICS — /support page accordion
// ====================================================
// ====================================================
// CATEGORY DETAIL — /support?category={id} хуудсанд харагдах
// ====================================================
const t = (id: string, label: string, href: string = "#"): SupportTopic => ({
  id,
  label,
  href,
});

/**
 * Priority дарааллаар — бүх категори хуудасны "Түгээмэл асуудлууд" хэсэгт
 * ИЖИЛ 5 топик ижил дарааллаар харагдана.
 */
const priorityFrequentTopics: SupportTopic[] = [
  t(
    "top-internet-setup",
    "Интернет тохиргооны заавар",
    "https://ckb.unitel.mn/category?categoryId=41082",
  ),
  t(
    "top-tv-setup",
    "ТВ сувгийн тохиргоо",
    "https://ckb.unitel.mn/category?categoryId=41124",
  ),
  t("top-movie-app", "Кино болон багц идэвхжүүлэх", "/support?category=movie"),
  t("top-billing-guide", "Төлбөр төлөх заавар", "/support?category=billing"),
  t("top-wifi-password", "Wi-Fi нууц үг солих"),
];

/**
 * Бүх категори хуудасны доод хэсэгт харагдах quick link card-ууд
 * (Singtel-ийн "Check Data Usage / My Account / ..." загвар)
 */
export const supportQuickLinks: SupportQuickLink[] = [
  {
    id: "usage",
    icon: "usage",
    iconBg: "bg-teal-100 text-teal-700",
    title: "Хэрэглээ шалгах",
    description: "Хэрэглэний дэлгэрэнгүйгээ харах",
    linkText: "Хэрхэн шалгахаа үзэх",
    href: "#",
  },
  {
    id: "account",
    icon: "account",
    iconBg: "bg-amber-100 text-amber-700",
    title: "Миний бүртгэл",
    description: "Univision үйлчилгээгээ удирдаж, гэрээний мэдээллээ шалгаарай",
    linkText: "Бүртгэлдээ нэвтрэх",
    href: "#",
  },
  {
    id: "go-app",
    icon: "app",
    iconBg: "bg-rose-100 text-rose-700",
    title: "Univision GO app",
    description: "Үйлчилгээгээ утаснаасаа удирдаж, контентоо хаанаас ч үзээрэй",
    linkText: "Апп татах",
    href: "/univision-go",
  },
  {
    id: "business",
    icon: "business",
    iconBg: "bg-slate-200 text-slate-700",
    title: "Бизнес тусламж",
    description: "Байгууллагын интернет, ТВ үйлчилгээний дэмжлэг",
    linkText: "Бизнес FAQ үзэх",
    href: "/support?category=agent",
  },
];

export const supportCategoryDetails: Record<string, CategoryDetail> = {
  internet: {
    description:
      "Wi-Fi холболт, сүлжээний хурд, тохиргоо болон интернеттэй холбоотой бусад түгээмэл асуудлуудын шийдлийг эндээс хайж олоорой.",
    quickQuestions: [
      "Интернетийн хурд яагаад удаан байна вэ?",
      "Wi-Fi нууц үгээ хэрхэн солих вэ?",
      "Mesh Wi-Fi нэмэхэд ямар үнэтэй вэ?",
    ],
    frequentTopics: priorityFrequentTopics,
    otherTopics: [
      t("int-7", "Интернет холболт"),
      t("int-8", "Утасгүй интернэтийн үйчилгээ"),
      t("int-9", "Нэмэлт Mesh Wi-Fi холболт"),
      t("int-10", "Салаа төхөөрөмж холбох"),
      t("int-11", "Хаяг шилжүүлэх үйлчилгээ"),
    ],
  },
  tv: {
    description:
      "ТВ суваг, ТВ box тохиргоо, дохионы асуудал болон бусад түгээмэл асуудлын шийдлийг эндээс олоорой.",
    quickQuestions: [
      "ТВ дохиогүй болсон яах вэ?",
      "Nemelt suvag yaj idevhjuuleh we?",
      "Univision GO-гоор ТВ үзэж болох уу?",
    ],
    frequentTopics: priorityFrequentTopics,
    otherTopics: [
      t("tv-7", "Үндсэн сувгийн жагсаалт"),
      t("tv-8", "Нэмэлт суваг захиалах"),
      t("tv-9", "Онцлох сувгийн агуулга"),
      t("tv-10", "Univision 4.0 ТВ box захиалах"),
      t("tv-11", "Univision GO утсаар ТВ үзэх"),
    ],
  },
  movie: {
    description:
      "HBO Max, кино түрээс, Univision GO app болон контенттай холбоотой түгээмэл асуудлуудын шийдлийг эндээс олоорой.",
    quickQuestions: [
      "HBO Max-ийг хэрхэн идэвхжүүлэх вэ?",
      "Кино түрээслэхэд ямар үнэтэй вэ?",
      "Univision GO app-ыг хаанаас татах вэ?",
    ],
    frequentTopics: priorityFrequentTopics,
    otherTopics: [
      t("mv-7", "Кино сангаас түрээслэх (TVOD)"),
      t("mv-8", "Кино багц шинэчлэх"),
      t("mv-9", "HBO Max идэвхжүүлэх"),
      t("mv-10", "Хүүхдийн профайл үүсгэх"),
      t("mv-11", "Univision GO app татах"),
    ],
  },
  billing: {
    description:
      "Сарын төлбөр, нэхэмжлэл, төлбөрийн арга болон төлбөрийн түүхтэй холбоотой түгээмэл асуудлын шийдлийг эндээс олоорой.",
    quickQuestions: [
      "Төлөгдөөгүй төлбөр байгаа эсэхээ яаж шалгах вэ?",
      "QR кодоор хэрхэн төлөх вэ?",
      "U-Point оноогоо хэрхэн ашиглах вэ?",
    ],
    frequentTopics: priorityFrequentTopics,
    otherTopics: [
      t("bl-7", "U-Point оноо ашиглах"),
      t("bl-8", "Хялбар бүртгэл бүртгэх / цуцлах"),
      t("bl-9", "Төлбөрийн баримт татах"),
      t("bl-10", "QR кодоор төлөх"),
      t("bl-11", "Урамшуулалын эрх ашиглах"),
    ],
  },
  subscription: {
    description:
      "Шинээр захиалга өгөх, багц шинэчлэх, цуцлах болон захиалгатай холбоотой бусад түгээмэл асуудлуудын шийдлийг эндээс олоорой.",
    quickQuestions: [
      "Шинээр багц хэрхэн захиалах вэ?",
      "Гэр шилжихэд үйлчилгээгээ авч явж болох уу?",
      "Гэрээгээ хэрхэн сунгах вэ?",
    ],
    frequentTopics: priorityFrequentTopics,
    otherTopics: [
      t("sb-7", "Гурвалсан үйлчилгээ захиалга"),
      t("sb-8", "Үндсэн үйлчилгээгээ шинэчлэх"),
      t("sb-9", "Нэмэлт үйлчилгээ нэмэх"),
      t("sb-10", "Бизнес багц"),
      t("sb-11", "Гэрээ сунгах эсвэл цуцлах"),
    ],
  },
  agent: {
    description:
      "Манай ажилтнуудтай хэрхэн холбогдох, тусламжийн төвийн ажиллах цаг, үйлчилгээний газрын хаяг зэрэг мэдээллийг эндээс олоорой.",
    quickQuestions: [
      "Дуудлагын төв хэдэн цагт ажилладаг вэ?",
      "Хамгийн ойр үйлчилгээний газар хаана вэ?",
      "Гомдол хэрхэн гаргах вэ?",
    ],
    frequentTopics: priorityFrequentTopics,
    otherTopics: [
      t("ag-7", "24/7 дуудлагын төвтэй холбогдох"),
      t("ag-8", "Үйлчилгээний газрын байршил"),
      t("ag-9", "Социал сүлжээгээр холбогдох"),
      t("ag-10", "Гомдол гаргах"),
      t("ag-11", "Санал, хүсэлт илгээх"),
    ],
  },
};

export const faqTopics: FaqTopic[] = [
  {
    id: "subscription",
    question: "Захиалга ба худалдан авалт",
    answer:
      "Багц захиалах, шинэчлэх, цуцлах болон захиалгатай холбоотой бүх асуултын хариуг эндээс мэдээлэл аваарай. Шинэ хэрэглэгчийн бүртгэлийг онлайнаар хийх боломжтой.",
  },
  {
    id: "technical",
    question: "Техникийн асуудал, аюулгүй байдал",
    answer:
      "Сүлжээний хурд, тасалдал, ТВ боксын тохиргоо, апп-н алдаа болон бусад техникийн асуудлыг хэрхэн шийдэхийг энд тайлбарласан. Шаардлагатай үед 24/7 туслaмжийн төв рүү шууд хандах боломжтой.",
  },
  {
    id: "installation",
    question: "Суурилуулалт, засвар, шилжүүлэлт",
    answer:
      "Шинэ хэрэглэгчийн суурилуулалтын цаг товлох, гэр шилжих үед үйлчилгээгээ авч явах, тоног төхөөрөмжийн засварын талаар мэдээлэл аваарай.",
  },
  {
    id: "billing",
    question: "Төлбөрийн асуулт",
    answer:
      "Сарын төлбөр, нэхэмжлэл хэрхэн харах, онлайнаар төлөх, автомат төлбөрийн тохиргоо хийх талаар энд мэдээлэл байна.",
  },
  {
    id: "tv-content",
    question: "ТВ суваг ба кино контент",
    answer:
      "ТВ сувгийн жагсаалт, кино багц, HBO Max, Univision GO app-н контентыг хэрхэн ашиглах талаар мэдээлэл аваарай.",
  },
  {
    id: "account",
    question: "Хэрэглэгчийн дансаа удирдах",
    answer:
      "Нэвтрэх нэр, нууц үг солих, гэр бүлийн профайл нэмэх, мэдэгдлийн тохиргоо болон бусад дансны тохиргоог энд хийх боломжтой.",
  },
];
