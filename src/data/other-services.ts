/**
 * "БУСАД ҮЙЛЧИЛГЭЭ" — нүүрний үйлчилгээний товчлолын СЕТКА.
 *
 *              Бусад үйлчилгээ                  ← ГАНЦ гарчиг
 *   [◯ Дата багц      ] [◯ Нэмэлт үйлчилгээ ]   ← 2 багана (мобайл)
 *   [◯ Family үйлчилг.] [◯ Олон улсын үйлч.  ]
 *   …
 *
 * ⚠️ ТАЙЛБАР МӨР (short description) ЗОРИУД БАЙХГҮЙ — захиалагчийн шаардлага
 * (2026-09-07). Бусад section-ууд гарчиг + нэг мөр тайлбартай байдаг ч энэ
 * нь навигацийн товчлол тул шошгууд өөрсдөө хангалттай.
 *
 * ⚠️ ДҮРСИЙГ НЭРЭЭР өгнө (`icon: "data"`), component дамжуулдаггүй: data
 * давхарга `lucide-react`-аас хамаарах ёсгүй (`brand-ribbon.ts`-ийн ижил
 * зарчим). Нэрийг `other-services.tsx > ICONS`-д дүрс болгож хөрвүүлнэ.
 *
 * ⚠️ ЛИНК БҮГД `#` — маршрут хараахан шийдэгдээгүй
 * ([[web4-route-targets-pending]] тэмдэглэлтэй ижил байдал). Зам гармагц
 * ЗӨВХӨН энэ файлын `href`-үүдийг засна.
 */

export type OtherServiceIcon =
  | "data"
  | "addons"
  | "family"
  | "international"
  | "home-internet"
  | "phone"
  | "prepaid-card";

export type OtherServiceItem = {
  label: string;
  href: string;
  icon: OtherServiceIcon;
};

/** Section-ий гарчиг — өөрчлөх бол ЗӨВХӨН энэ мөр */
export const otherServicesTitle = "Бусад үйлчилгээ";

/**
 * ⚠️ ШОШГО нь захиалагчийн явуулсан загварын ЯГ ТЭР 7 нэр.
 *
 * `brand-ribbon.ts > unitelRibbon`-той ХЭСЭГЧЛЭН давхцана (Family үйлчилгээ ·
 * Нэмэлт үйлчилгээ · Гар утас) ч тэр жагсаалтыг ХЭРЭГЛЭЭГҮЙ: түүнд байхгүй
 * 4 зүйл (Дата багц · Олон улсын · Гэр интернэт · Цэнэглэгч карт) байгаа
 * бөгөөд "Дараа төлбөрт", "Урьдчилсан төлбөрт", "Урамшуулал" гурав нь энэ
 * загварт БАЙХГҮЙ. Хоёр жагсаалт нэгдэх шаардлагатай эсэхийг захиалагчаас
 * лавлана.
 */
export const otherServices: OtherServiceItem[] = [
  { label: "Дата багц", href: "#", icon: "data" },
  { label: "Нэмэлт үйлчилгээ", href: "#", icon: "addons" },
  { label: "Family үйлчилгээ", href: "#", icon: "family" },
  { label: "Олон улсын үйлчилгээ", href: "#", icon: "international" },
  { label: "Гэр интернэт", href: "#", icon: "home-internet" },
  { label: "Гар утас", href: "#", icon: "phone" },
  { label: "Цэнэглэгч карт", href: "#", icon: "prepaid-card" },
];
