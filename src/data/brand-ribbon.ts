/**
 * BRAND RIBBON — өнгөт дүрст ангиллын товчлолын мөр.
 *
 * ГАРАЛ: энэ нь `brand-showcase.tsx` (брэнд хуудасны template)-ийн ribbon
 * хэсэг байсан. `/unitel`, `/univision`, `/looktv` хуудсууд УСТСАН бөгөөд
 * тэдгээрийн бусад хэсэг (promo зурвас · том hero гарчиг · lineup section)
 * хамт устсан — ЗӨВХӨН энэ ribbon авч үлдэв.
 *
 * ⚠️ ОДООГООР ХААНА Ч БАЙРЛААГҮЙ. Component нь бэлэн (`BrandRibbon`), гэхдээ
 * ямар хуудсанд суухыг хараахан шийдээгүй. Байрлуулахдаа зүгээр л
 * `<BrandRibbon items={unitelRibbon} label="Unitel ангиллууд" />` гэж дуудна.
 */

export type BrandRibbonIcon =
  | "smartphone"
  | "credit-card"
  | "users"
  | "layers"
  | "gift"
  | "package";

export type BrandRibbonItem = {
  label: string;
  href: string;
  icon: BrandRibbonIcon;
  /** Дүрсний өнгөт дэвсгэр (Tailwind классууд) — ангилал бүр өөр өнгөтэй */
  tint: string;
  /** Жижиг улаан тэмдэглэгээ (ж: "Coming soon") */
  badge?: string;
};

/**
 * UNITEL-ийн ангиллын ribbon.
 *
 * ⚠️ ЛИНКҮҮД ХАРААХАН ШИЙДЭГДЭЭГҮЙ. Өмнө нь эдгээр нь тухайн хуудасны доторх
 * section руу заадаг `#anchor` байв (`#postpaid`, `#prepaid`, `#family`,
 * `#addons`, `#devices`) — тэр section-ууд устсан тул одоо `#` placeholder.
 *
 * Шийдэх зүйл: аль ангилалд ТУСДАА хуудас хэрэгтэй, алийг нь динамикаар
 * (нэг template + параметр) шийдэх вэ. Хуудас бүрд яг таг зам гаргахгүй —
 * зөвхөн шаардлагатайг нь. Үүнийг тухайн ажлыг хийхдээ ярина.
 *
 * "Урамшуулал" нь ГАНЦ бодит зам — `/campaigns` хуудас байгаа, устаагүй.
 */
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
