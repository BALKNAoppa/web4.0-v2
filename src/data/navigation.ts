/**
 * Univision Web 4.0 — Navigation data
 *
 * Header цэсэн дэх data. Front-end дээр л ашиглагдах static data-уудыг энд төвлөрүүлсэн. Үүнд:,
 * - Top bar линкүүд (гадаад domain)
 * - Main navigation (Мобайл, Интернэт, Телевиз, Life-style, Урамшуулал)
 */
export type NavItem = {
  label: string;
  href: string;
  badge?: string;
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
};

export type NavCategory = {
  label: string;
  href?: string;
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
export type EcosystemLink = { name: string; href: string; external?: boolean };

export const ecosystemBrands: EcosystemLink[] = [
  // Unitel, Univision — Apple маягийн дотоод брэнд хуудсууд (/unitel, /univision)
  { name: "Unitel", href: "/unitel" },
  { name: "Univision", href: "/univision" },
  { name: "Toki", href: "https://toki.mn/", external: true },
  { name: "Look TV", href: "https://look.tv/", external: true },
  { name: "DDish TV", href: "#" }, // TODO: домэйн (ddishtv.mn?)
  { name: "Nexmind", href: "https://nexmind.mn/", external: true },
  { name: "OSS", href: "#" }, // TODO: домэйн
  { name: "U-point", href: "https://u-point.mn/", external: true },
  { name: "PSN", href: "#" }, // TODO: домэйн
  { name: "ESN", href: "#" }, // TODO: домэйн
];

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
        title: "Гэрийн интернэт",
        items: [
          { label: "Triple", href: "#" },
          { label: "Single", href: "#" },
          { label: "FTTH", href: "#" },
        ],
      },
      {
        title: "Wi-Fi төхөөрөмж",
        items: [
          { label: "FTTR, Mesh", href: "#" },
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
          { label: "FTTR, Mesh", href: "#" },
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
