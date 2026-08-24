/**
 * Нүүр хуудасны data — Apple-ийн нүүрээс санаа авсан шинэ бүтэц.
 *
 *  - hero  — цаг үеийн урамшууллыг харуулах том banner (агуулга нь
 *            campaigns/nav promos дээрх одоо байгаа урамшууллаас)
 *  - entryTiles — бүх бүтээгдэхүүн, үйлчилгээний entry point картууд
 *            (Apple-ийн нүүрний tile grid маяг)
 *
 * Зураг одоогоор ашиглахгүй — карт бүр "Photo N" placeholder талбайтай
 * Бодит зураг гарахаар холбоно.
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

export type EntryTileIcon =
  | "wifi"
  | "monitor-play"
  | "package"
  | "gift"
  | "globe"
  | "smartphone"
  | "plane"
  | "clapperboard"
  | "router";

export type EntryTile = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon: EntryTileIcon;
  /** Дүрсний өнгөт дэвсгэр (Tailwind классууд) */
  tint: string;
};

// ====================================================
// ENTRY TILES — брэнд бүрт өөрийн бүтээгдэхүүн
// Нүүрний үндсэн banner-т аль хэдийн гарсан зүйлийг энд ДАВХАРДУУЛАХГҮЙ
// (Unitel: дараа төлбөрт, Univision: үндсэн багц).
// ====================================================

/** Unitel — гэр интернэт энд харьяалагдана */
export const unitelEntryTiles: EntryTile[] = [
  {
    title: "Гэр интернэт",
    description: "Утасгүй, гэрийн интернэт.",
    href: "/main-packages",
    ctaLabel: "Багц харах",
    icon: "wifi",
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    title: "Олон улсын үйлчилгээ",
    description: "Олон улсын дуудлага - хилийн чанадад ч холбоотой.",
    href: "#",
    ctaLabel: "Үйлчилгээ харах",
    icon: "globe",
    tint: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Урьдчилсан төлбөрт",
    description: "Дата, ярианы нэгжээ хүссэн үедээ цэнэглэ.",
    href: "#",
    ctaLabel: "Багц харах",
    icon: "smartphone",
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "TourSim",
    description: "SIM and eSIM for Visitors to Mongolia",
    href: "#",
    ctaLabel: "Дэлгэрэнгүй",
    icon: "plane",
    tint: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
];

/** Univision — контент болон гэрийн шийдэл */
export const univisionEntryTiles: EntryTile[] = [
  {
    title: "Single internet",
    description: "Зөвхөн интернэт — дан холболтын багцууд.",
    href: "#",
    ctaLabel: "Багц харах",
    icon: "wifi",
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    title: "Univision Go",
    description: "Хүссэн газраа, хүссэн үедээ — гар утаснаасаа.",
    href: "/univision-go",
    ctaLabel: "Апп татах",
    icon: "monitor-play",
    tint: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "HBO Max",
    description: "Дэлхийн шилдэг кино, цуврал, шоу нэвтрүүлэг нэг дор.",
    href: "#",
    ctaLabel: "Контент үзэх",
    icon: "clapperboard",
    tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Mesh",
    description: "FTTR, Wi-Fi 6 — гэрийн булан бүрт тасралтгүй сүлжээ.",
    href: "/mesh",
    ctaLabel: "Шийдэл харах",
    icon: "router",
    tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];
