/**
 * Нүүр хуудасны data — Apple-ийн нүүрээс санаа авсан шинэ бүтэц.
 *
 *  - hero  — цаг үеийн урамшууллыг харуулах том banner (агуулга нь
 *            campaigns/nav promos дээрх одоо байгаа урамшууллаас)
 *  - entryTiles — бүх бүтээгдэхүүн, үйлчилгээний entry point картууд
 *            (Apple-ийн нүүрний tile grid маяг)
 *
 * Зураг одоогоор ашиглахгүй — карт бүр "Photo N" placeholder талбайтай
 * (brand-pages-тэй ижил хэв маяг). Бодит зураг гарахаар холбоно.
 */

export type HomeHeroCta = {
  label: string;
  href: string;
};

export type HomeHero = {
  /** Жижиг eyebrow текст — банерын төрлийг заана */
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: HomeHeroCta;
  secondaryCta?: HomeHeroCta;
};

// Hero section — одоогоор элемент бүрийг үүргээр нь нэрлэсэн wireframe.
// Бодит контент ороход доорх утгуудыг л солино. Жишээ (өмнөх хувилбар):
//   eyebrow: "Цаг үеийн урамшуулал", title: "Шинэ хэрэглэгчийн захиалга",
//   subtitle: "Төхөөрөмж 50% хямдралтай — эхний захиалгын хамт.",
//   primaryCta: "Захиалах", secondaryCta: "Дэлгэрэнгүй"
export const homeHero: HomeHero = {
  eyebrow: "Цаг үеийн урамшуулал",
  title: "Интернэт + ТВ — сард 39,900₮",
  subtitle: "1 жилийн багц. Шинэ хэрэглэгчдэд үнэгүй суурилуулалттай.",
  primaryCta: { label: "Багц авах", href: "/main-packages" },
  secondaryCta: { label: "Бүх урамшуулал", href: "/campaigns" },
};

export type EntryTileIcon = "wifi" | "monitor-play" | "package" | "gift";

export type EntryTile = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon: EntryTileIcon;
  /** Дүрсний өнгөт дэвсгэр (Tailwind классууд) */
  tint: string;
};

// Бусад үйлчилгээнүүд — Мобайл, Телевиз/Үзвэр нь дээрх banner section-уудад
// тусдаа гардаг тул энд ДАВХАРДУУЛАХГҮЙ. Бүгд ижил Apple маягийн tile.
export const entryTiles: EntryTile[] = [
  {
    title: "Гэр интернэт",
    description: "M+, L+, XL+ багцууд — интернэт, IPTV, суурин утас.",
    href: "/main-packages",
    ctaLabel: "Багц харах",
    icon: "wifi",
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    title: "Univision Go",
    description: "Хүссэн газраа, хүссэн үедээ — гар утаснаасаа.",
    href: "/univision-go",
    ctaLabel: "Апп үзэх",
    icon: "monitor-play",
    tint: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Төхөөрөмж",
    description: "Wi-Fi 6 роутер, STB болон бусад төхөөрөмж.",
    href: "/devices",
    ctaLabel: "Төхөөрөмж харах",
    icon: "package",
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Урамшуулал",
    description: "Цаг үеийн хямдрал, урамшууллууд.",
    href: "/campaigns",
    ctaLabel: "Урамшуулал үзэх",
    icon: "gift",
    tint: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
];
