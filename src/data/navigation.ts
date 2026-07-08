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
  { name: "Unitel", href: "https://unitel.mn/", external: true },
  { name: "Univision", href: "https://univision.mn/", external: true },
  { name: "Toki", href: "https://toki.mn/", external: true },
  { name: "Look TV", href: "https://look.tv/", external: true },
  { name: "U-point", href: "https://u-point.mn/", external: true },
];

// =====================================================================
// Audience segments — Хувь хэрэглэгч / Байгууллага / Бидний тухай
// Дэлхийн группүүдийн (Vodafone, Singtel, Samsung) жишгээр үзэгчээр салгасан.
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
  id: "personal" | "corporate" | "about";
  label: string;
  /** Сегментийн landing / "Бидний тухай"-н шууд линк */
  href: string;
  external?: boolean;
  icon: "user" | "building" | "info";
  /** Hover дээр гарах брэнд cards. "Бидний тухай"-д байхгүй (шууд линк). */
  brands?: BrandCard[];
};

export const audienceSegments: AudienceSegment[] = [
  {
    id: "personal",
    label: "Хувь хэрэглэгч",
    href: "https://univision.mn/",
    external: true,
    icon: "user",
    brands: [
      {
        name: "Unitel",
        badge: "UNT",
        description: "Мобайл, гэрийн интернэт болон ярианы багцууд.",
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
        description: "Кино болон шууд дамжуулалт.",
        href: "https://looktv.mn/#/setup",
        external: true,
      },
    ],
  },
  {
    id: "corporate",
    label: "Байгууллага",
    href: "https://unitel.mn/unitel/",
    external: true,
    icon: "building",
    brands: [
      {
        name: "Unitel Corp",
        badge: "UNT",
        description: "Байгууллагын мобайл, интернэт болон нэгдсэн холболт.",
        href: "https://unitel.mn/unitel/",
        external: true,
      },
      {
        name: "Univision Corp",
        badge: "UNV",
        description: "Байгууллагад зориулсан IPTV болон контентын шийдэл.",
        href: "https://univision.mn/",
        external: true,
      },
      {
        name: "U-point",
        badge: "UP",
        description: "Дижитал төлбөр, лояалти платформ.",
        href: "#",
      },
      {
        name: "Nexmind",
        badge: "NEX",
        description: "Managed network, дата төв, IT шийдэл.",
        href: "https://nexmind.mn/managednetwork",
        external: true,
      },
    ],
  },
  {
    id: "about",
    label: "Бидний тухай",
    href: "https://univision.mn/about/",
    external: true,
    icon: "info",
    // brands байхгүй — группын сайт руу шилжих placeholder линк
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
