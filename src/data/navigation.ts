/**
 * Univision Web 4.0 — Navigation data
 *
 * Header цэсэн дэх data. Front-end дээр л ашиглагдах static data-уудыг энд төвлөрүүлсэн. Үүнд:,
 * - Top bar линкүүд (гадаад domain)
 * - Main navigation (Мобайл, Интернэт, Телевиз, Life-style, Урамшуулал)
 */
import { type Owner } from "@/lib/brand";

export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  /**
   * Энэ үйлчилгээг хэн эзэмших вэ. Өгөөгүй бол багана/категорийнхоо эзнийг
   * өвлөнө. Unitel сайт дээр owner="univision" зүйл дархад univision.mn руу
   * шинэ tab-аар үсэрнэ (мөн эсрэгээр).
   */
  owner?: Owner;
};

export type NavColumn = {
  title: string;
  items: NavItem[];
};

export type NavPromo = {
  title: string;
  description?: string;
  ctaLabel: string;
  href: string;
  /** Background tint for the promo badge (Tailwind class, e.g. "bg-red-500") */
  badgeClass?: string;
  /** Short label shown inside the badge circle */
  badgeText?: string;
  /** Урамшууллын зураг (16:9). Байвал badge-ийн оронд зурган карт гарна. */
  image?: string;
  imageAlt?: string;
};

export type NavCategory = {
  label: string;
  href?: string;
  /** Категорийн default эзэн — доторх item-ууд өвлөнө (item дээрээс дарж бичиж болно) */
  owner?: Owner;
  // Multi-column mega-menu (Бүтээгдэхүүн, Энтертайнмент)
  columns?: NavColumn[];
  // Энгийн dropdown list (Life-style, Урамшуулал)
  items?: NavItem[];
  // Right-side promo cards (mega-menu only)
  promos?: NavPromo[];
  // Direct link (no dropdown) — icon-той шууд линк болгох
  isDirectLink?: boolean;
  // Trigger / линкийн өмнө харагдах lucide icon-ы нэр
  icon?: "gift" | "tag" | "percent";
  // Тооны badge (жишээ 36) — байвал улбар шар дугуйтай гарна
  count?: number;
};

export type TopBarLink = {
  label: string;
  href: string;
  external?: boolean;
};

// Top bar — Групп компанийн линк (2 хувилбар хоёуланд ил харагдана)
export const topBar: TopBarLink[] = [
  { label: "Юнивишн", href: "https://univision.mn/", external: true },
  { label: "Юнител", href: "https://unitel.mn/unitel/", external: true },
  { label: "LookTV", href: "https://looktv.mn/#/setup", external: true },
  { label: "Nexmind", href: "https://nexmind.mn/managednetwork", external: true },
];

// =====================================================================
// Эко-систем брэндүүд — Шинэ Хувилбар 1 (Apple маягийн нэгдсэн nav).
// Ганц navigation дээр группын брэндүүдийг цэвэр нэрээр (домэйнгүй) харуулна.
// =====================================================================
export type EcosystemLink = {
  name: string;
  href: string;
  external?: boolean;
  /**
   * Хэн эзэмших вэ. Өгөөгүй бол "self" — хоёр build хоёуланд дотоод хуудас.
   * Өгсөн бол `SmartLink`/`resolveHref` нь тухайн брэндийн БУСАД build дээр
   * нөгөө домэйн руу (шинэ tab) шилжүүлнэ — AI туслахын CTA-тай ижил логик.
   */
  owner?: Owner;
};

export const ecosystemBrands: EcosystemLink[] = [
  // ⚠️ Unitel, Univision — өмнө нь дотоод `/unitel`, `/univision` хуудас руу
  // заадаг байсан. Тэр ХОЁР ХУУДАС УСТСАН (LookTV-тэй хамт) тул одоо `#`.
  // Хаашаа заахыг хойшлуулсан — доорх `appleNavCategories`-ийн тайлбарыг үз.
  { name: "Unitel", href: "#" },
  { name: "Univision", href: "#" },
  { name: "Toki", href: "https://toki.mn/", external: true },
  { name: "Look TV", href: "https://looktv.mn/", external: true },
  { name: "DDish TV", href: "#" }, // TODO: домэйн (ddishtv.mn?)
  { name: "Nexmind", href: "https://nexmind.mn/", external: true },
  { name: "OSS", href: "#" }, // TODO: домэйн
  { name: "U-point", href: "https://u-point.mn/", external: true },
  { name: "PSN", href: "#" }, // TODO: домэйн
  { name: "ESN", href: "#" }, // TODO: домэйн
];

// Layer 2 — 5 ангилал: Unitel · Univision · Дэлгүүр · Урамшуулал · LookTV.
//
// Жагсаалтаас ХАСАГДСАН нь:
//   "Тусламж"       — nav-д биш, footer болон нүүрийн FAQ блокоос хүрнэ.
//   "Entertainment" — дэд цэсний агуулга нь `archivedMegaMenus`-д 1:1
//                     хадгалагдсан; /entertainment/* хуудсууд хэвээр ажиллана.
//
// ДЭД ЦЭС ЗАДРАХ ЭСЭХ нь `appleMegaMenus`-д бичлэгтэй эсэхээр шийдэгдэнэ
// (header.tsx > CategoryNav). Тиймээс:
//   Unitel · Univision            → hover панел задарна
//   Дэлгүүр · Урамшуулал · LookTV → бичлэггүй ⇒ ЭНГИЙН ЛИНК, панел задрахгүй
//
// Дэлгүүр, LookTV-гийн ӨМНӨХ дэд цэс нь `archivedMegaMenus`-д 1:1 хадгалагдсан
// (устгаагүй) — тэдгээрийг буцаахад л панел дахин задарна.
//
// ⚠️⚠️ ХҮЛЭЭГДЭЖ БУЙ ШИЙДВЭР — Unitel · Univision · LookTV нь `#`.
// `/unitel`, `/univision`, `/looktv` ГУРВАН ХУУДАС УСТСАН (тэдгээрийн ribbon
// нь `data/brand-ribbon.ts` + `components/sections/brand-ribbon.tsx` болж
// авч үлдсэн, бусад хэсэг нь устсан). Тиймээс эдгээр цэс одоогоор ХААШАА Ч
// ЗААХГҮЙ.
//   Unitel · Univision — hover дээр панел задардаг тул үйлдэлгүй биш
//   LookTV             — панелгүй ⇒ дархад ЮУ Ч БОЛОХГҮЙ
// Аль ангилалд ТУСДАА хуудас хэрэгтэй, алийг нь нэг template + параметрээр
// динамикаар шийдэхийг тухайн ажлыг хийхдээ ярина. Хуурмаг зам ЗОХИОХГҮЙ.
//
// `#` нь энэ codebase-ийн стандарт placeholder (`resolveHref` тусад нь
// боловсруулдаг). `useCurrentNavName` нь `#`-ийг чимээгүй алгасдаг тул active
// тодотгол нь `/devices`, `/campaigns` дээр ажиллаж, бусад үед build-ийн
// домэйн рүү унана — алдаа гаргахгүй.
//
// `owner` — Unitel/Univision нь ТУС БҮРИЙН домэйны эзэн. ⚠️ `resolveHref` нь
// `#`-ийг owner шалгахаас ӨМНӨ таслан буцаадаг тул ХӨНДЛӨН ДОМЭЙН РҮҮ ҮСРЭХ
// нь ОДООГООР АЖИЛЛАХГҮЙ. Бодит зам сэргэмэгц дахин ажиллана.
export const appleNavCategories: EcosystemLink[] = [
  { name: "Unitel", href: "#", owner: "unitel" },
  { name: "Univision", href: "#", owner: "univision" },
  { name: "Дэлгүүр", href: "/devices" },
  { name: "Урамшуулал", href: "/campaigns" },
  { name: "LookTV", href: "#" },
];

// =====================================================================
// Хувилбар 1 (Apple) header-ийн mega menu. groupNavV2 ангилалд нийцүүлэв:
//   Unitel    = Mobile + Family
//   Univision = Internet + Entertainment (төхөөрөмжийг Дэлгүүр рүү зөөв)
//   Дэлгүүр   = Unitel/Univision-ийн төхөөрөмжтэй холбоотой хэсгүүд
//   LookTV    = стриминг ТВ (ТҮР ЗУУРЫН каркас — доорх тайлбарыг үз)
// Section title = том тод линк (section.href рүү; http бол шинэ таб).
//
// "Урамшуулал" энд ЗӨРИУДААР байхгүй — бичлэггүй ангилал нь энгийн линк болж,
// hover панел задардаггүй. Мөрдөх дүрэм: энд нэмбэл панел гарна.
// =====================================================================
export type MegaMenuSection = { id: string; title: string; href: string };
export type MegaMenu = {
  name: string;
  /**
   * ХУРДАН ҮЙЛДЭЛ — дэд цэсний ХАМГИЙН ДЭЭД мөр, ГАРЧИГГҮЙ.
   *
   * Ангиллын жагсаалтыг тойрч шууд хийдэг 1-2 үйлдлийн товч. Зориудаар ЕРӨНХИЙ
   * нэртэй (`quickActions`) — брэнд бүр өөр үйлдэл тавьж болно.
   *
   * ⚠️ Одоогоор ЗӨВХӨН PLACEHOLDER ("Quick action 1/2"). Header-т ЦЭСНИЙ НЭРС
   * л тодорхой болсон; товч/CTA/урамшууллын бодит агуулга дараа шийдэгдэнэ.
   * Тиймээс энд жинхэнэ нэр ЗОХИОХГҮЙ — slot байгааг л үзүүлнэ.
   */
  quickActions?: MegaMenuSection[];
  /** 1-р баганын гарчиг. Өгөөгүй бол `name` (ж. "Unitel") харагдана. */
  sectionsLabel?: string;
  /**
   * ҮНДСЭН АНГИЛАЛ — дэд цэсний ЗҮҮН багана. Бүтээгдэхүүнийг ангилдаг
   * (ж: Үндсэн бүтээгдэхүүн · Интернэтийн шийдэл · Энтертайнмэнт · Life-style).
   * Hover/идэвхтэй үед ХАР pill + цагаан текстээр тодорно.
   */
  sections: MegaMenuSection[];
  /** 2-р баганын гарчиг. Өгөөгүй бол "Нэмэлт". */
  extrasLabel?: string;
  /**
   * НЭМЭЛТ — дэд цэсний ХОЁР ДАХЬ багана (`sections`-ийн ард).
   *
   * `sections` нь зөвхөн бүтээгдэхүүнийг ангилдаг тул үйлчилгээ/туслах шинжтэй
   * зүйлс (Нэмэлт үйлчилгээ · Хамрах хүрээ · Тусламж г.м) хаана ч суудаггүй —
   * тэднийг энэ баганад цуглуулна.
   *
   * Өгөөгүй бол `BrandMegaPanel` нь бүх брэндэд хуваалцах default жагсаалтыг
   * (Багц сонгох · Төхөөрөмж · Тусламж · Бүх урамшуулал) харуулна.
   */
  extras?: MegaMenuSection[];
};

const TOKI_FAMILY_HREF =
  "https://www.toki.mn/family-%D2%AF%D0%B9%D0%BB%D1%87%D0%B8%D0%BB%D0%B3%D1%8D%D1%8D-%D1%88%D0%B8%D0%BD%D1%8D%D1%87%D0%BB%D1%8D%D0%B3%D0%B4%D0%BB%D1%8D%D1%8D/";

/**
 * LookTV-ийн ГАДААД сайт. Кодод `looktv.mn` ба `look.tv` хоёр зэрэг байсныг
 * `looktv.mn` руу нэгтгэв. Nav-ийн "LookTV" өөрөө дотоод `/looktv` хуудас —
 * гадагш үсрэх нь зөвхөн эндээс.
 */
export const LOOKTV_SITE = "https://looktv.mn/";
export const LOOKTV_APP_HREF = "https://looktv.mn/#/setup";

export const appleMegaMenus: Record<string, MegaMenu> = {
  /**
   * UNITEL — багцын нэрээр ангилсан (өмнө "Дараа/Урьдчилсан төлбөрт" гэсэн
   * төлбөрийн хэлбэрээр байсан).
   *
   * `sectionsLabel: "Багц"` — 1-р баганын гарчиг брэндийн нэр БИШ. Багана нь
   * тарифын нэрсийг агуулдаг тул "Unitel" гэсэн гарчиг агуулгыг тайлбарлахгүй.
   */
  Unitel: {
    name: "Unitel",
    // ⚠️ PLACEHOLDER — жинхэнэ үйлдлийн нэр ТОДОРХОЙ БОЛООГҮЙ. Энэ мөрөнд
    // "хурдан үйлдлийн товч ЭНД байрлана" гэдгийг л үзүүлж байна.
    quickActions: [
      { id: "quick-1", title: "Quick action 1", href: "#" },
      { id: "quick-2", title: "Quick action 2", href: "#" },
    ],
    sectionsLabel: "Багц",
    sections: [
      { id: "premium", title: "Premium", href: "/main-packages" },
      { id: "priority", title: "Priority", href: "/main-packages" },
      { id: "plus", title: "Plus", href: "/main-packages" },
      { id: "smart-data", title: "Smart Data", href: "/main-packages" },
      { id: "smart-talk", title: "Smart Talk", href: "/main-packages" },
      { id: "family", title: "Family", href: TOKI_FAMILY_HREF },
    ],
    extrasLabel: "Бусад үйлчилгээ",
    extras: [
      { id: "extra-data", title: "Нэмэлт дата", href: "#" },
      { id: "addons", title: "Нэмэлт үйлчилгээ", href: "#" },
      { id: "home-internet", title: "Гэр интернэт", href: "/main-packages" },
      { id: "foreigners", title: "For foreigners", href: "#" },
    ],
  },
  /**
   * UNIVISION — 4 ангилал + Нэмэлт багана.
   *
   * Ангилал нь Univision-ы бүтээгдэхүүнийг ингэж бүлэглэдэг:
   *   Үндсэн бүтээгдэхүүн ← Гурвалсан (M+/L+/XL+) · Single (дан интернэт/телевиз)
   *   Интернэтийн шийдэл  ← FTTH · STB/Dongle · FTTR/Mesh · Wi-Fi 6
   *   Энтертайнмэнт       ← Linier TV · PayTV · TVOD · SVOD · HBO Max …
   *   Life-style          ← Smart Home · Security · Gaming
   *
   * ✅ "Энтертайнмэнт" нь `/entertainment/main` руу холбогдсоноор Entertainment
   * ангилал Layer 2-оос гарснаас хойш ТАСАРСАН desktop-ийн зам сэргэв
   * (агуулга нь `archivedMegaMenus.Entertainment`-д хэвээр).
   */
  Univision: {
    name: "Univision",
    // ⚠️ PLACEHOLDER — Unitel-тэй ижил. Жинхэнэ үйлдлийн нэр ТОДОРХОЙ БОЛООГҮЙ.
    quickActions: [
      { id: "quick-1", title: "Quick action 1", href: "#" },
      { id: "quick-2", title: "Quick action 2", href: "#" },
    ],
    sections: [
      { id: "core", title: "Үндсэн бүтээгдэхүүн", href: "/main-packages" },
      { id: "internet", title: "Интернэтийн шийдэл", href: "/mesh" },
      { id: "entertainment", title: "Энтертайнмэнт", href: "/entertainment/main" },
      { id: "lifestyle", title: "Life-style", href: "#" },
    ],
    extras: [
      { id: "addons", title: "Нэмэлт үйлчилгээ", href: "#" },
      { id: "coverage", title: "Сүлжээний хамрах хүрээ", href: "#" },
      { id: "devices", title: "Төхөөрөмж", href: "/devices" },
      { id: "support", title: "Тусламж", href: "/support" },
      { id: "campaigns", title: "Бүх урамшуулал", href: "/campaigns" },
    ],
  },
};

// =====================================================================
// MOBILE-ЫН дэд цэс — ЗӨВХӨН mobile header (таб dropdown + burger).
//
// Desktop-ийн mega menu (`appleMegaMenus`) ЭНЭ ангиллаас ТУСДАА бөгөөд
// хуучнаараа хэвээр. Mobile дээр дэлгэц нарийн тул ангиллыг цөөлж,
// нэрийг нь нэгтгэж болно.
//
// ⚠️ Түлхүүрүүд нь `appleMegaMenus`-тай ТААРАХ ЁСТОЙ. Эс бөгөөс нэг ангилал
// desktop дээр панелтай, mobile дээр энгийн линк (эсвэл эсрэгээр) болж
// хоёр давхарга зөрнө. Одоо хоёулаа: Unitel · Univision.
//
// ⚠️ Хоёр цэсний АГУУЛГА ТУСДАА хөгжинө — mobile-д мөр нэмэхэд desktop
// өөрчлөгдөхгүй.
// =====================================================================
export const mobileMegaMenus: Record<string, MegaMenu> = {
  // Desktop-той ИЖИЛ агуулга — багцын нэрс + Бусад үйлчилгээ + хурдан үйлдэл.
  Unitel: {
    name: "Unitel",
    // ⚠️ PLACEHOLDER — жинхэнэ үйлдлийн нэр ТОДОРХОЙ БОЛООГҮЙ. Энэ мөрөнд
    // "хурдан үйлдлийн товч ЭНД байрлана" гэдгийг л үзүүлж байна.
    quickActions: [
      { id: "quick-1", title: "Quick action 1", href: "#" },
      { id: "quick-2", title: "Quick action 2", href: "#" },
    ],
    sectionsLabel: "Багц",
    sections: [
      { id: "premium", title: "Premium", href: "/main-packages" },
      { id: "priority", title: "Priority", href: "/main-packages" },
      { id: "plus", title: "Plus", href: "/main-packages" },
      { id: "smart-data", title: "Smart Data", href: "/main-packages" },
      { id: "smart-talk", title: "Smart Talk", href: "/main-packages" },
      { id: "family", title: "Family", href: TOKI_FAMILY_HREF },
    ],
    extrasLabel: "Бусад үйлчилгээ",
    extras: [
      { id: "extra-data", title: "Нэмэлт дата", href: "#" },
      { id: "addons", title: "Нэмэлт үйлчилгээ", href: "#" },
      { id: "home-internet", title: "Гэр интернэт", href: "/main-packages" },
      { id: "foreigners", title: "For foreigners", href: "#" },
    ],
  },
  // Desktop-той ИЖИЛ 4 ангилал (screenshot-ийн бүтэц mobile-д ч мөрдөгдөнө).
  // Mobile-д хажуу зэрэгцүүлэх өргөн байхгүй тул `extras` нь доор тусдаа
  // блок болж, "Нэмэлт" гэсэн жижиг гарчигтай гарна (`SectionMenu`).
  Univision: {
    name: "Univision",
    // ⚠️ PLACEHOLDER — desktop-той ИЖИЛ (`appleMegaMenus.Univision`).
    quickActions: [
      { id: "quick-1", title: "Quick action 1", href: "#" },
      { id: "quick-2", title: "Quick action 2", href: "#" },
    ],
    sections: [
      { id: "core", title: "Үндсэн бүтээгдэхүүн", href: "/main-packages" },
      { id: "internet", title: "Интернэтийн шийдэл", href: "/mesh" },
      { id: "entertainment", title: "Энтертайнмэнт", href: "/entertainment/main" },
      { id: "lifestyle", title: "Life-style", href: "#" },
    ],
    extras: [
      { id: "addons", title: "Нэмэлт үйлчилгээ", href: "#" },
      { id: "coverage", title: "Сүлжээний хамрах хүрээ", href: "#" },
      { id: "devices", title: "Төхөөрөмж", href: "/devices" },
      { id: "support", title: "Тусламж", href: "/support" },
      { id: "campaigns", title: "Бүх урамшуулал", href: "/campaigns" },
    ],
  },
};

// =====================================================================
// АРХИВ — ДЭД ЦЭСГҮЙ болсон ангиллын агуулга. УСТГАХГҮЙ.
//
// Энд байгаа нь nav-аас ГАРСАН гэсэн үг БИШ — "Дэлгүүр" ба "LookTV" нь
// `appleNavCategories`-д хэвээр, зүгээр л ПАНЕЛГҮЙ энгийн линк болсон
// ("Дэлгүүр" нь `/devices` рүү; "LookTV" нь хуудас нь устсан тул `#`).
// "Entertainment" нь nav-аас ч гарсан.
//
// Сэргээх бол `desktop`-ыг `appleMegaMenus`, `mobile`-ыг `mobileMegaMenus`
// рүү буцааж хуулна — панел тэр дороо задарна (`header.tsx > CategoryNav`).
//
// ⚠️ ЭНД БАЙГАА ЗАМУУД ХААГДААГҮЙ. Хүрэх бусад зам:
//   Дэлгүүр       — `/devices` landing-ийн ангиллын шүүлтүүр (pill) дээрх
//                   `?category=` линкүүд ЯГ ижил зорилготой
//   LookTV        — ⚠️ ЗАМГҮЙ. `/looktv` хуудас УСТСАН, шинэ зам шийдэгдээгүй
//   Entertainment — `/entertainment/main` · `/entertainment/category/[id]` ·
//                   `/entertainment/movie/[id]` бүгд ажиллаж байна;
//                   `appleMegaMenus.Univision > "Энтертайнмэнт"`-аас хүрнэ
// =====================================================================
export const archivedMegaMenus: Record<string, { desktop: MegaMenu; mobile: MegaMenu }> = {
  /**
   * ДЭЛГҮҮР — `/devices` landing-ийн ангилал бүрийг нээдэг байсан панел.
   *
   * `?category=<id>` дэх id нь `data/devices.ts > deviceCategories`-ийн
   * id-тай ЯГ ТААРНА. Mobile нь ангиллыг НЭГТГЭСЭН тул нэг мөр хоёр ангилал
   * нээдэг (`?category=` таслалаар олон утга авдаг).
   *
   * ⚠️ `?category=` ба `?type=` нь ӨӨР зүйл: `type` нь өмнөх хувилбарын
   * SAMPLE дэлгэрэнгүй хуудсыг нээдэг (`service-index.ts`).
   */
  Дэлгүүр: {
    desktop: {
      name: "Дэлгүүр",
      sections: [
        { id: "phones", title: "Гар утас", href: "/devices?category=phones" },
        { id: "accessories", title: "Дагалдах хэрэгсэл", href: "/devices?category=accessories" },
        { id: "wifi", title: "Интернэтийн төхөөрөмж", href: "/devices?category=wifi" },
        { id: "stb", title: "ТВ-н төхөөрөмж", href: "/devices?category=stb" },
        { id: "fttr", title: "Нэмэлт төхөөрөмж", href: "/devices?category=fttr" },
      ],
    },
    mobile: {
      name: "Дэлгүүр",
      sections: [
        {
          id: "phones_accessories",
          title: "Гар утас & Дагалдах хэрэгсэл",
          href: "/devices?category=phones,accessories",
        },
        {
          id: "tv_internet_devices",
          title: "ТВ & Интернэтийн төхөөрөмж",
          href: "/devices?category=stb,wifi",
        },
      ],
    },
  },
  // LOOKTV — ТҮР ЗУУРЫН каркас байсан (гурав нь `#` placeholder, "Апп татах"
  // нь бодит гадаад линк). Агуулгыг эцэслэхэд `Entertainment.desktop`-оос
  // авах эсэхийг шийднэ.
  LookTV: {
    desktop: {
      name: "LookTV",
      sections: [
        { id: "channels", title: "Бүх суваг", href: "#" },
        { id: "packages", title: "Багц ба үнэ", href: "#" },
        { id: "movies", title: "Кино сан", href: "#" },
        { id: "app", title: "Апп татах", href: LOOKTV_APP_HREF },
      ],
    },
    mobile: {
      name: "LookTV",
      sections: [
        { id: "channels", title: "Бүх суваг", href: "#" },
        { id: "packages", title: "Багц ба үнэ", href: "#" },
        { id: "app", title: "Апп татах", href: LOOKTV_APP_HREF },
      ],
    },
  },
  Entertainment: {
    desktop: {
      name: "Entertainment",
      sections: [
        { id: "univision-go", title: "Univision Go", href: "/univision-go" },
        { id: "svod", title: "Кино сан", href: "/entertainment/main" },
        { id: "tvod", title: "Кино багц", href: "/entertainment/main#tvod" },
        { id: "apps", title: "Look TV", href: "#" },
        { id: "channels", title: "Бүх суваг", href: "#" },
      ],
    },
    mobile: {
      name: "Entertainment",
      sections: [
        { id: "univision-go", title: "Univision Go", href: "/univision-go" },
        { id: "look-tv", title: "Look TV", href: "#" },
        { id: "hbo-max", title: "HBO Max", href: "#" },
      ],
    },
  },
};

// Хувилбар 3 (Unitel) — Unitel.mn домэйны мобайл үйлчилгээтэй холбоотой брэндүүд
// (дээд bar-т байрлана)
export const unitelDomains: EcosystemLink[] = [
  { name: "Unitel", href: "https://unitel.mn/", external: true },
  { name: "Toki", href: "https://toki.mn/", external: true },
  { name: "Nexmind", href: "https://nexmind.mn/", external: true },
];

// Хувилбар 3 (Unitel) — үндсэн navigation ангилал (зурган дээрх шиг)
export const unitelNav: NavCategory[] = [
  { label: "Дараа төлбөрт", href: "#", isDirectLink: true },
  { label: "Урьдчилсан төлбөрт", href: "#", isDirectLink: true },
  { label: "Family үйлчилгээ", href: "#", isDirectLink: true },
  { label: "Нэмэлт үйлчилгээ", href: "#", isDirectLink: true },
  { label: "Гар утас", href: "#", isDirectLink: true },
];

// Хувилбар 4 (Univision) — Univision.mn домэйны холбоотой брэндүүд (дээд bar-т).
// Үндсэн nav нь mainNavLegacy (Бүтээгдэхүүн / Энтертайнмент / Life-style / Урамшуулал).
export const univisionDomains: EcosystemLink[] = [
  { name: "Univision", href: "https://univision.mn/", external: true },
  { name: "Гэр интернэт", href: "https://unitel.mn/unitel/product/ger", external: true },
  { name: "DDish", href: "#" }, // TODO: домэйн (ddishtv.mn?)
];

// =====================================================================
// Группын сегментүүд — Хувь хэрэглэгч / Өрх / Байгууллага (Хувилбар 2 top bar).
// Группын компаниудыг хэрэглээгээр бүлэглэж, hover дээр гишүүн брэндийн
// картуудыг (товч мэдээлэл + домэйн линк) харуулна.
// =====================================================================
export type BrandCard = {
  name: string;
  /** Картан дахь товч тайлбар */
  description: string;
  /** Тухайн брэндийн домэйн */
  href: string;
  external?: boolean;
  /** Картын дугуй badge доторх товч нэр (UNT, UNV...) */
  badge: string;
};

export type AudienceSegment = {
  id: string;
  label: string;
  /** Брэндгүй сегментийн шууд линк (одоогоор бүгд брэндтэй) */
  href: string;
  external?: boolean;
  icon: "user" | "building" | "info" | "smartphone" | "home";
  /** Hover дээр гарах гишүүн брэндийн cards. Байхгүй бол шууд линк. */
  brands?: BrandCard[];
};

export const audienceSegments: AudienceSegment[] = [
  {
    id: "mobile",
    label: "Хувь хэрэглэгч",
    href: "#",
    icon: "user",
    brands: [
      {
        name: "Unitel",
        badge: "UNT",
        description: "Мобайл, дата болон ярианы багцууд.",
        href: "https://unitel.mn/unitel/",
        external: true,
      },
      {
        name: "Toki",
        badge: "TOKI",
        description: "Супер-апп: төлбөр, мобайл болон дижитал үйлчилгээ.",
        href: "https://toki.mn/",
        external: true,
      },
    ],
  },
  {
    id: "home",
    label: "Өрх",
    href: "#",
    icon: "home",
    brands: [
      {
        name: "Univision",
        badge: "UNV",
        description: "IPTV, телевиз болон контентын үйлчилгээ.",
        href: "https://univision.mn/",
        external: true,
      },
      {
        name: "Гэр интернэт",
        badge: "NET",
        description: "Гэрийн шилэн кабелийн интернэт.",
        href: "https://unitel.mn/",
        external: true,
      },
    ],
  },
  {
    id: "business",
    label: "Байгууллага",
    href: "#",
    icon: "building",
    brands: [
      {
        name: "Nexmind",
        badge: "NEX",
        description: "Managed network, дата төв, IT шийдэл.",
        href: "https://nexmind.mn/managednetwork",
        external: true,
      },
      {
        name: "U-point",
        badge: "UP",
        description: "Дижитал төлбөр, лояалти платформ.",
        href: "https://u-point.mn/",
        external: true,
      },
    ],
  },
];

// =====================================================================
// Хувилбар 6 — Хувь хэрэглэгч / Байгууллага / Бидний тухай сегментүүд.
// "Бидний тухай" нь brands-гүй тул группын сайт руу шууд линк болно.
// =====================================================================
export const customerSegments: AudienceSegment[] = [
  {
    id: "personal",
    label: "Хувь хэрэглэгч",
    href: "#",
    icon: "user",
    brands: [
      {
        name: "Unitel",
        badge: "UNT",
        description: "Мобайл, дата болон ярианы багцууд.",
        href: "https://unitel.mn/unitel/",
        external: true,
      },
      {
        name: "Univision",
        badge: "UNV",
        description: "IPTV, телевиз болон контентын үйлчилгээ.",
        href: "https://univision.mn/",
        external: true,
      },
      {
        name: "LookTV",
        badge: "LOOK",
        description: "Интернэт телевиз — хүссэн газраа, хүссэн үедээ.",
        href: "https://looktv.mn/",
        external: true,
      },
    ],
  },
  {
    id: "business",
    label: "Байгууллага",
    href: "#",
    icon: "building",
    brands: [
      {
        name: "Unitel Business",
        badge: "UNT",
        description: "Байгууллагын мобайл болон интернэт шийдэл.",
        href: "https://unitel.mn/",
        external: true,
      },
      {
        name: "Nexmind",
        badge: "NEX",
        description: "Managed network, дата төв, IT шийдэл.",
        href: "https://nexmind.mn/managednetwork",
        external: true,
      },
      {
        name: "U-point",
        badge: "UP",
        description: "Дижитал төлбөр, лояалти платформ.",
        href: "https://u-point.mn/",
        external: true,
      },
    ],
  },
  {
    id: "about",
    label: "Бидний тухай",
    href: "https://unitel.mn/",
    external: true,
    icon: "info",
  },
];

// Main navigation — бүтээгдэхүүний төрлөөр ангилсан (Мобайл / Интернэт / Телевиз)
export const mainNav: NavCategory[] = [
  {
    label: "Мобайл",
    columns: [
      {
        title: "Багцууд",
        items: [
          { label: "Дата багц", href: "#" },
          { label: "Ярианы багц", href: "#" },
          { label: "Урьдчилсан төлбөрт", href: "#" },
        ],
      },
      {
        title: "Нэмэлт үйлчилгээ",
        items: [
          { label: "Data Add-on", href: "#" },
          { label: "Роуминг", href: "#" },
          { label: "Дугаар сонголт", href: "#" },
        ],
      },
      {
        title: "Төхөөрөмж",
        items: [
          { label: "Гар утас", href: "#" },
          { label: "SIM | eSIM", href: "#" },
          { label: "Дагалдах хэрэгсэл", href: "#" },
        ],
      },
    ],
    promos: [
      {
        title: "Шинэ хэрэглэгчийн захиалга",
        description: "Төхөөрөмж 50% хямдралтай",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-red-500 text-white",
        badgeText: "50% OFF",
      },
    ],
  },
  {
    label: "Интернэт",
    columns: [
      {
        title: "Гэр интернэт",
        items: [
          { label: "Triple", href: "#" },
          { label: "Single", href: "#" },
          { label: "FTTH", href: "#" },
        ],
      },
      {
        title: "Wi-Fi төхөөрөмж",
        items: [
          { label: "FTTR, Mesh", href: "/mesh" },
          { label: "Wi-Fi 6 | HGW, ONT", href: "#" },
          { label: "STB, Dongle", href: "#" },
        ],
      },
      {
        title: "Нэмэлт",
        items: [
          { label: "Net Boost", href: "#" },
          { label: "Data Add-on", href: "#" },
        ],
      },
    ],
    promos: [
      {
        title: "Хуучин төхөөрөмжөө сольж аваарай",
        description: "Хуучнаа өгөөд шинэ төхөөрөмжийг хөнгөлөлттэй үнээр",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-sky-600 text-white",
        badgeText: "Trade-in",
      },
    ],
  },
  {
    label: "Телевиз",
    columns: [
      {
        title: "Суваг",
        items: [
          { label: "Linier TV", href: "#" },
          { label: "PayTV багц", href: "#" },
          { label: "UniLive", href: "#" },
        ],
      },
      {
        title: "Үзвэр",
        items: [
          { label: "TVOD", href: "/entertainment/main#tvod" },
          { label: "SVOD", href: "#" },
          { label: "Univision Go", href: "#" },
        ],
      },
      {
        title: "Апп",
        items: [
          { label: "HBO Max", href: "#" },
          { label: "Sport App", href: "#" },
          { label: "M Karaoke", href: "#" },
          { label: "Traffic App", href: "#" },
        ],
      },
    ],
    promos: [
      {
        title: "HBO Max — 1 сар үнэгүй",
        description: "Шинэ хэрэглэгчдэд",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-violet-600 text-white",
        badgeText: "HBO",
      },
      {
        title: "Sport App багц",
        description: "Бүх лигийн шууд дамжуулалт",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-emerald-600 text-white",
        badgeText: "Sport",
      },
    ],
  },
  {
    label: "Life-style",
    items: [
      { label: "Smart Home", href: "#", badge: "Coming soon" },
      { label: "Security", href: "#", badge: "Coming soon" },
      { label: "Gaming", href: "#", badge: "Coming soon" },
    ],
  },
  {
    label: "Урамшуулал",
    href: "/campaigns",
    isDirectLink: true,
    icon: "gift",
  },
];

// Mega menu-ийн баруун талд (хоосон талбарт) харуулах "цаг үеийн" урамшуулал
// (1-2 ширхэг). Бүх header хувилбарт (1/2/3/4) ИЖИЛ энэ жагсаалт гарна —
// PromoCard-аар: зүүн дугуй ("SAMPLE") + title + богино тайлбар + CTA.
// Бодит баннер бэлэн болоход badgeText-ийн оронд image өгвөл дугуйд зураг орно.
export const currentPromos: NavPromo[] = [
  {
    title: "Sample 1",
    description: "Цаг үеийн урамшууллын мэдээлэл байрлана",
    ctaLabel: "Дэлгэрэнгүй",
    href: "/campaigns",
    badgeClass: "bg-primary text-primary-foreground",
    badgeText: "SAMPLE",
  },
  {
    title: "Sample 2",
    description: "Цаг үеийн урамшууллын мэдээлэл байрлана",
    ctaLabel: "Дэлгэрэнгүй",
    href: "/campaigns",
    badgeClass: "bg-primary text-primary-foreground",
    badgeText: "SAMPLE",
  },
];

export const groupNavV2: NavCategory[] = [
  {
    label: "Mobile",
    owner: "unitel",
    columns: [
      {
        title: "Дараа төлбөрт",
        items: [
          { label: "Premium багц", href: "/main-packages?plan=premium" },
          { label: "Priority багц", href: "/main-packages?plan=priority" },
          { label: "Plus багц", href: "/main-packages?plan=plus" },
        ],
      },
      {
        title: "Урьдчилсан төлбөрт",
        items: [
          { label: "Smart Data", href: "/main-packages?plan=smart-data" },
          { label: "Smart Talk", href: "/main-packages?plan=smart-talk" },
          { label: "Smart Days", href: "/main-packages?plan=smart-days" },
        ],
      },
      {
        title: "Нэмэлт үйлчилгээ",
        items: [
          { label: "Нэмэлт дата багц", href: "/main-packages?plan=extra-data" },
          { label: "Нэмэлт үйлчилгээ", href: "/main-packages?plan=addons" },
          { label: "Олон улсын дуудлага", href: "/main-packages?plan=intl-call" },
          { label: "Олон улсын роуминг", href: "/main-packages?plan=roaming" },
        ],
      },
      {
        title: "For Foreigners",
        items: [
          { label: "Tour SIM", href: "/main-packages?plan=tour-sim" },
          { label: "Expat", href: "/main-packages?plan=expat" },
        ],
      },
    ],
    promos: currentPromos,
  },
  {
    label: "Internet",
    owner: "univision",
    columns: [
      {
        title: "Main packages",
        items: [
          { label: "Triple", href: "/main-packages?plan=triple" },
          { label: "Single", href: "/main-packages?plan=single" },
        ],
      },
      {
        title: "Add-On",
        items: [
          { label: "Net Boost", href: "/main-packages?plan=net-boost" },
          { label: "Data-Add-on", href: "/main-packages?plan=data-addon" },
          { label: "2nd screen", href: "/main-packages?plan=2nd-screen" },
        ],
      },
      {
        title: "Solutions",
        items: [
          { label: "FTTH", href: "/main-packages?plan=ftth" },
          { label: "STB, Dongle", href: "/devices?type=stb" },
          { label: "FTTR, Mesh", href: "/devices?type=fttr" },
          { label: "Wi-Fi 6 | HGW, ONT", href: "/devices?type=hgw" },
        ],
      },
    ],
    promos: currentPromos,
  },
  {
    label: "Entertainment",
    owner: "univision",
    columns: [
      {
        title: "Main",
        items: [
          { label: "VOD library", href: "/entertainment/main" },
          { label: "SVOD", href: "/entertainment/main#svod" },
        ],
      },
      {
        title: "Channels",
        items: [
          { label: "Linier TV", href: "/service?id=linear-tv" },
          { label: "Pay TV packages", href: "/main-packages?plan=paytv" },
          { label: "UniLive", href: "/univision-go" },
        ],
      },
      {
        title: "Apps",
        items: [
          { label: "HBO Max", href: "/service?id=hbo-max" },
          { label: "Sport App", href: "/service?id=sport-app" },
          { label: "Adult App", href: "/service?id=adult-app" },
          { label: "M Karaoke", href: "/service?id=m-karaoke" },
          { label: "Traffic App", href: "/service?id=traffic-app" },
        ],
      },
      {
        title: "Life-style",
        items: [
          { label: "Smart Home", href: "/service?id=smart-home", badge: "in future" },
          { label: "Security", href: "/service?id=security", badge: "in future" },
          { label: "Gaming", href: "/service?id=gaming", badge: "in future" },
        ],
      },
    ],
    promos: currentPromos,
  },
  {
    // Холимог категори — item тус бүр өөрийн эзэнтэй
    label: "Төхөөрөмж",
    owner: "unitel",
    items: [
      { label: "Гар утас", href: "/devices?type=phone" },
      { label: "SIM | eSIM", href: "/devices?type=sim" },
      { label: "Гэр интернэт төхөөрөмж", href: "/devices?type=cpe", owner: "univision" },
      { label: "Дагалдах хэрэгсэл", href: "/devices?type=accessory" },
    ],
  },
  {
    label: "Family үйлчилгээ",
    owner: "unitel",
    href: "https://www.toki.mn/family-%D2%AF%D0%B9%D0%BB%D1%87%D0%B8%D0%BB%D0%B3%D1%8D%D1%8D-%D1%88%D0%B8%D0%BD%D1%8D%D1%87%D0%BB%D1%8D%D0%B3%D0%B4%D0%BB%D1%8D%D1%8D/",
    isDirectLink: true,
  },
  // "self" — хоёр сайт тус бүр өөрийн Урамшуулал/Тусламж хуудастай, үсрэхгүй
  { label: "Урамшуулал", href: "/campaigns", isDirectLink: true, icon: "gift", owner: "self" },
  { label: "Тусламж", href: "/support", isDirectLink: true, owner: "self" },
];

// Хувилбар 4 (Apple mega panel) — panel-ийн баруун талын "Бизнес эрхлэгч бол"
// хэсгийн жижиг quick link-үүд (Хувь хэрэглэгчийн үндсэн жагсаалтын ард).
// Агуулга нь placeholder — бодит бизнес линкээр солино.
export const businessQuickLinks: NavItem[] = [
  { label: "Байгууллагын багц", href: "#" },
  { label: "Corporate үйлчилгээ", href: "#" },
  { label: "Nexmind — Managed network", href: "https://nexmind.mn/managednetwork" },
  { label: "Борлуулалттай холбогдох", href: "#" },
];

// =====================================================================
// Хувилбар 3 (Xfinity) — segment switcher-гүй, нэг мөрт nav.
// Ангилал нь V1/V2-тэй ижил (хуучин) + "Байгууллага" (Xfinity дээрх
// "Comcast Business" шиг nav дотроо). xfinityNav нь mainNavLegacy-ийн
// дараа тодорхойлогдоно (доор).
// =====================================================================
const businessCategory: NavCategory = {
  label: "Байгууллага",
  columns: [
    {
      title: "Холболт",
      items: [
        { label: "Байгууллагын интернэт", href: "#" },
        { label: "Dedicated line", href: "#" },
        { label: "VPN / MPLS", href: "#" },
      ],
    },
    {
      title: "Шийдэл",
      items: [
        { label: "Дата төв", href: "#" },
        { label: "Cloud hosting", href: "#" },
        { label: "Кибер аюулгүй байдал", href: "#" },
      ],
    },
    {
      title: "Тусламж",
      items: [
        { label: "Корпорэйт борлуулалт", href: "#" },
        { label: "24/7 тусламж", href: "#" },
      ],
    },
  ],
};

// =====================================================================
// Хувилбар 1 (Хуучин) — өөрчлөлт хийхээс өмнөх анхны ангилал.
// V1 нь бүх зүйлээрээ хуучнаараа үлдэх тул тусдаа хадгалав.
// (Шинэ Мобайл/Интернэт/Телевиз ангилал зөвхөн V2/V3-д — mainNav.)
// =====================================================================
export const mainNavLegacy: NavCategory[] = [
  {
    label: "Бүтээгдэхүүн",
    columns: [
      {
        title: "Main packages",
        items: [
          { label: "Triple", href: "#" },
          { label: "Single", href: "#" },
        ],
      },
      {
        title: "Add-On",
        items: [
          { label: "Net Boost", href: "#" },
          { label: "Data-Add-on", href: "#" },
          { label: "Univision Go", href: "#" },
        ],
      },
      {
        title: "Solutions",
        items: [
          { label: "FTTH", href: "#" },
          { label: "STB, Dongle", href: "#" },
          { label: "FTTR, Mesh", href: "/mesh" },
          { label: "Wi-Fi 6 | HGW, ONT", href: "#" },
        ],
      },
    ],
    promos: [
      {
        title: "Шинэ хэрэглэгчийн захиалга",
        description: "Төхөөрөмж 50% хямдралтай",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-red-500 text-white",
        badgeText: "50% OFF",
      },
      {
        title: "Хуучин төхөөрөмжөө сольж аваарай",
        description: "Хуучнаа өгөөд шинэ төхөөрөмжийг хөнгөлөлттэй үнээр",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-sky-600 text-white",
        badgeText: "Trade-in",
      },
    ],
  },
  {
    label: "Энтертайнмент",
    columns: [
      {
        title: "Main",
        items: [
          { label: "TVOD", href: "/entertainment/main#tvod" },
          { label: "SVOD", href: "#" },
        ],
      },
      {
        title: "Channels",
        items: [
          { label: "Linier TV", href: "#" },
          { label: "PayTV packages", href: "#" },
          { label: "UniLive", href: "#" },
        ],
      },
      {
        title: "Apps",
        items: [
          { label: "HBO Max", href: "#" },
          { label: "Sport App", href: "#" },
          { label: "Adult App", href: "#" },
          { label: "M Karaoke", href: "#" },
          { label: "Traffic App", href: "#" },
        ],
      },
    ],
    promos: [
      {
        title: "HBO Max — 1 сар үнэгүй",
        description: "Шинэ хэрэглэгчдэд",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-violet-600 text-white",
        badgeText: "HBO",
      },
      {
        title: "Sport App багц",
        description: "Бүх лигийн шууд дамжуулалт",
        ctaLabel: "Дэлгэрэнгүй",
        href: "/campaigns",
        badgeClass: "bg-emerald-600 text-white",
        badgeText: "Sport",
      },
    ],
  },
  {
    label: "Life-style",
    items: [
      { label: "Smart Home", href: "#", badge: "Coming soon" },
      { label: "Security", href: "#", badge: "Coming soon" },
      { label: "Gaming", href: "#", badge: "Coming soon" },
    ],
  },
  {
    label: "Урамшуулал",
    href: "/campaigns",
    isDirectLink: true,
    icon: "gift",
  },
];

// =====================================================================
// Хувилбар 3 (Xfinity) nav — V1/V2-тэй ижил хуучин ангилал + "Байгууллага"
// ("Урамшуулал" шууд линкийн өмнө). mainNavLegacy-ийн дараа тодорхойлов.
// =====================================================================
export const xfinityNav: NavCategory[] = [
  ...mainNavLegacy.filter((c) => !c.isDirectLink),
  businessCategory,
  ...mainNavLegacy.filter((c) => c.isDirectLink),
];
