export type BrandRibbonIcon =
  | "smartphone"
  | "credit-card"
  | "users"
  | "layers"
  | "gift"
  | "package"
  | "wifi";

export type BrandRibbonItem = {
  label: string;
  href: string;
  icon: BrandRibbonIcon;
  tint: string;
  badge?: string;
};

export const unitelRibbon: BrandRibbonItem[] = [
  {
    label: "Дараа төлбөрт",
    href: "#",
    icon: "smartphone",
    tint: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    label: "Урьдчилсан төлбөрт",
    href: "#",
    icon: "credit-card",
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    label: "Family үйлчилгээ",
    href: "#",
    icon: "users",
    tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    label: "Нэмэлт үйлчилгээ",
    href: "#",
    icon: "layers",
    tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    label: "Гар утас",
    href: "#",
    icon: "package",
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    label: "Урамшуулал",
    href: "/campaigns",
    icon: "gift",
    tint: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
];

export const recommendedServicesRibbon: BrandRibbonItem[] = [
  {
    label: "Product 1",
    href: "#",
    icon: "users",
    tint: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    label: "Product 2",
    href: "#",
    icon: "layers",
    tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    label: "Product 3",
    href: "#",
    icon: "package",
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    label: "Product 4",
    href: "#",
    icon: "gift",
    tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    label: "Product 5",
    href: "#",
    icon: "wifi",
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    label: "Product 6",
    href: "#",
    icon: "smartphone",
    tint: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    label: "Product 7",
    href: "#",
    icon: "credit-card",
    tint: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
];
