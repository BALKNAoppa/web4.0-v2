import { brandSiteUrl, type Owner } from "@/lib/brand";

export type NavItem = {
  label: string;
  href: string;
  badge?: string;
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
  badgeClass?: string;
  badgeText?: string;
  image?: string;
  imageAlt?: string;
};

export type NavCategory = {
  label: string;
  href?: string;
  owner?: Owner;
  columns?: NavColumn[];
  items?: NavItem[];
  promos?: NavPromo[];
  isDirectLink?: boolean;
  icon?: "gift" | "tag" | "percent";
  count?: number;
};

export type TopBarLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const topBar: TopBarLink[] = [
  { label: "Юнивишн", href: "https://univision.mn/", external: true },
  { label: "Юнител", href: "https://unitel.mn/unitel/", external: true },
  { label: "LookTV", href: "https://looktv.mn/#/setup", external: true },
  { label: "Nexmind", href: "https://nexmind.mn/managednetwork", external: true },
];

export type EcosystemLink = {
  name: string;
  href: string;
  external?: boolean;
  owner?: Owner;
};

export const ecosystemBrands: EcosystemLink[] = [
  { name: "Unitel", href: "#" },
  { name: "Univision", href: "#" },
  { name: "Toki", href: "https://toki.mn/", external: true },
  { name: "Look TV", href: "https://looktv.mn/", external: true },
  { name: "DDish TV", href: "#" },
  { name: "Nexmind", href: "https://nexmind.mn/", external: true },
  { name: "OSS", href: "#" },
  { name: "U-point", href: "https://u-point.mn/", external: true },
  { name: "PSN", href: "#" },
  { name: "ESN", href: "#" },
];

export const appleNavCategories: EcosystemLink[] = [
  { name: "Unitel", href: brandSiteUrl("unitel"), owner: "unitel" },
  { name: "Univision", href: brandSiteUrl("univision"), owner: "univision" },
  { name: "Дэлгүүр", href: brandSiteUrl() },
  { name: "Урамшуулал", href: brandSiteUrl() },
  { name: "LookTV", href: brandSiteUrl() },
];

export type MegaMenuSection = { id: string; title: string; href: string };

export type MegaMenuGroup = { id: string; title?: string; items: MegaMenuSection[] };

export type MegaBranchStatus = "maintenance" | "coming-soon" | "link-only";

export type MegaMenuBranch = MegaMenuSection & {
  groups?: MegaMenuGroup[];
  status?: MegaBranchStatus;
};
export type MegaMenu = {
  name: string;
  sectionsLabel?: string;
  sections: MegaMenuBranch[];
  extrasLabel?: string;
  extras?: MegaMenuSection[];
};

const unitelBranches: MegaMenuBranch[] = [
  {
    id: "packages",
    title: "Үндсэн багцууд",
    href: "/#",
    groups: [
      {
        id: "packages-all",
        items: [
          { id: "premium", title: "Premium багц", href: "/#" },
          { id: "priority", title: "Priority багц", href: "/#" },
          { id: "plus", title: "Plus багц", href: "/#" },
          { id: "smart-data", title: "Smart Data", href: "/#" },
          { id: "smart-talk", title: "Smart Talk", href: "/#" },
          { id: "family", title: "Family", href: "/#" },
        ],
      },
    ],
  },
  {
    id: "other-services",
    title: "Бусад үйлчилгээ",
    href: "/#",
    groups: [
      {
        id: "other-services-all",
        items: [
          { id: "home-internet", title: "Гэр интернет", href: "/#" },
          { id: "international", title: "Олон улсын үйлчилгээ", href: "#" },
          { id: "foreigners", title: "For Foreigners", href: "https://unitel.mn/toursim/" },
          { id: "extra-data", title: "Нэмэлт дата багц", href: "#" },
          { id: "addons", title: "Нэмэлт үйлчилгээ", href: "#" },
        ],
      },
    ],
  },
];

const univisionBranches: MegaMenuBranch[] = [
  { id: "core", title: "Үндсэн бүтээгдэхүүн", href: "/#", status: "link-only" },
  {
    id: "internet",
    title: "Интернэтийн шийдэл",
    href: "/#",
    groups: [
      {
        id: "internet-solutions",
        items: [
          { id: "internet-addons", title: "Нэмэлт үйлчилгээ", href: "#" },
          { id: "coverage-boost", title: "Хамрах хүрээг сайжруулах", href: "#" },
          { id: "infrastructure", title: "Дэд бүтцийн шийдэл", href: "#" },
        ],
      },
    ],
  },
  {
    id: "entertainment",
    title: "Энтертайнмэнт",
    href: "/#",
    groups: [
      {
        id: "entertainment-areas",
        items: [
          { id: "content", title: "Контент", href: "#" },
          { id: "tv-channels", title: "ТВ суваг", href: "#" },
          { id: "tv-apps", title: "ТВ апп", href: "#" },
          { id: "tv-addons", title: "Нэмэлт үйлчилгээ", href: "#" },
        ],
      },
    ],
  },
  { id: "lifestyle", title: "Life-style", href: "#", status: "coming-soon" },
];

export const LOOKTV_SITE = "https://looktv.mn/";
export const LOOKTV_APP_HREF = "https://looktv.mn/#/setup";

export const appleMegaMenus: Record<string, MegaMenu> = {
  Unitel: { name: "Unitel", sections: unitelBranches },
  Univision: { name: "Univision", sections: univisionBranches },
};

export const mobileMegaMenus: Record<string, MegaMenu> = {
  Unitel: { name: "Unitel", sections: unitelBranches },
  Univision: { name: "Univision", sections: univisionBranches },
};

export const archivedMegaMenus: Record<string, { desktop: MegaMenu; mobile: MegaMenu }> = {
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

export const unitelDomains: EcosystemLink[] = [
  { name: "Unitel", href: "https://unitel.mn/", external: true },
  { name: "Toki", href: "https://toki.mn/", external: true },
  { name: "Nexmind", href: "https://nexmind.mn/", external: true },
];

export const unitelNav: NavCategory[] = [
  { label: "Дараа төлбөрт", href: "#", isDirectLink: true },
  { label: "Урьдчилсан төлбөрт", href: "#", isDirectLink: true },
  { label: "Family үйлчилгээ", href: "#", isDirectLink: true },
  { label: "Нэмэлт үйлчилгээ", href: "#", isDirectLink: true },
  { label: "Гар утас", href: "#", isDirectLink: true },
];

export const univisionDomains: EcosystemLink[] = [
  { name: "Univision", href: "https://univision.mn/", external: true },
  { name: "Гэр интернэт", href: "https://unitel.mn/unitel/product/ger", external: true },
  { name: "DDish", href: "#" },
];

export type BrandCard = {
  name: string;
  description: string;
  href: string;
  external?: boolean;
  badge: string;
};

export type AudienceSegment = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  icon: "user" | "building" | "info" | "smartphone" | "home";
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
  { label: "Урамшуулал", href: "/campaigns", isDirectLink: true, icon: "gift", owner: "self" },
  { label: "Тусламж", href: "/support", isDirectLink: true, owner: "self" },
];

export const businessQuickLinks: NavItem[] = [
  { label: "Байгууллагын багц", href: "#" },
  { label: "Corporate үйлчилгээ", href: "#" },
  { label: "Nexmind — Managed network", href: "https://nexmind.mn/managednetwork" },
  { label: "Борлуулалттай холбогдох", href: "#" },
];

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

export const xfinityNav: NavCategory[] = [
  ...mainNavLegacy.filter((c) => !c.isDirectLink),
  businessCategory,
  ...mainNavLegacy.filter((c) => c.isDirectLink),
];
