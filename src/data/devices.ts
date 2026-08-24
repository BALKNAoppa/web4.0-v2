/**
 * ДЭЛГҮҮР (`/devices`) — төхөөрөмжийн каталогийн data.
 *
 * ⚠️ АГУУЛГЫН ЗАРЧИМ (`campaigns.ts` · `service-sample.tsx`-тэй ижил):
 * БҮТЭЦ нь бодит, АГУУЛГА нь шошготой sample.
 *   ангиллын нэр — ЭЦСИЙНХ, цэсний нэрсээс шууд авав
 *   барааны нэр  — төхөөрөмжийн ЕРӨНХИЙ төрөл. Хиймэл загварын нэр (SKU)
 *                  ЗОХИОХГҮЙ — бодит нэр, үнийн жагсаалт шийдэгдээгүй
 *   үнэ          — `000,000₮` слот (`ServiceSample`-ийн `00,000₮`-тэй ижил хэв)
 *   зураг        — шошготой placeholder (`campaigns.ts`-ийн `placeholderText`)
 *
 * ЦЭСТЭЙ ХОЛБОО: `DeviceCategory.id` нь `archivedMegaMenus.Дэлгүүр`-ийн section
 * id-тай ЯГ ТААРНА (phones · accessories · wifi · stb · fttr). Тиймээс цэсний
 * мөр `/devices?category=<id>` рүү шууд заана — шинэ mapping хүснэгт хэрэггүй.
 * Цэсэнд ангилал нэмбэл ЭНД мөр нэмнэ, эс бөгөөс тэр ангилал хоосон гарна.
 */

export type DeviceCategory = {
  /** URL-ийн `?category=` утга — цэсний section id-тай ижил */
  id: string;
  label: string;
};

export type DeviceProduct = {
  id: string;
  /** `DeviceCategory.id` */
  category: string;
  /** Төхөөрөмжийн ерөнхий төрөл (загварын нэр БИШ) */
  name: string;
  /** Нэг мөр үзүүлэлт — картан дээр нэрийн доор */
  spec: string;
  /** Жинхэнэ зураг бэлэн болтол харагдах placeholder текст */
  placeholderText: string;
  /** Картын баруун дээд булангийн тэмдэг (заавал биш) */
  badge?: string;
  /**
   * Дэлгэрэнгүй рүү очих зам. `groupNavV2`-д БҮРТГЭЛТЭЙ `?type=` утга байх
   * ЁСТОЙ — эс бөгөөс `findService` null буцааж, дэлгэрэнгүйн оронд landing
   * дахин гарна (`devices/page.tsx > DevicesRouter`).
   */
  detailHref: string;
};

export const devicesHero = {
  title: "Дэлгүүр",
  description:
    "Гар утаснаас эхлээд гэрийн интернэт, ТВ-ний төхөөрөмж хүртэл — үйлчилгээндээ тохирох төхөөрөмжөө нэг дороос сонгоорой.",
};

/**
 * Ангиллын шүүлтүүр. "Бүгд" нь `id: "all"` — URL дээр параметргүй `/devices`
 * гэсэнтэй тэнцүү (pill-ийн href нь параметргүй зам).
 *
 * Дараалал нь цэсний дараалалтай ИЖИЛ байлгав: хэрэглэгч цэснээс ирээд ижил
 * эрэмбэ хармагц хаана байгаагаа таньна.
 */
export const deviceCategories: DeviceCategory[] = [
  { id: "all", label: "Бүгд" },
  { id: "phones", label: "Гар утас" },
  { id: "accessories", label: "Дагалдах хэрэгсэл" },
  { id: "wifi", label: "Интернэтийн төхөөрөмж" },
  { id: "stb", label: "ТВ-н төхөөрөмж" },
  { id: "fttr", label: "Нэмэлт төхөөрөмж" },
];

/** `id → label` — картан дээрх ангиллын шошгод (`all`-ыг оруулахгүй) */
export const deviceCategoryLabel: Record<string, string> = Object.fromEntries(
  deviceCategories.filter((c) => c.id !== "all").map((c) => [c.id, c.label]),
);

/**
 * Каталогийн бараа. Ангилал бүрд 3 мөр — grid нь 1 / 2 / 3 баганаар эвхэгддэг
 * тул 3-ын үржвэр нь ямар ч өргөнд сүүлийн мөр цоорхойгүй дүүрнэ.
 */
export const deviceProducts: DeviceProduct[] = [
  // ── Гар утас ───────────────────────────────────────────────────────
  {
    id: "phone-smart",
    category: "phones",
    name: "Ухаалаг утас",
    spec: "Загвар, багтаамж, өнгөний сонголттой",
    placeholderText: "Device 1",
    badge: "Онцлох",
    detailHref: "/devices?type=phone",
  },
  {
    id: "phone-basic",
    category: "phones",
    name: "Энгийн утас",
    spec: "Урт цэнэгтэй, энгийн хэрэглээнд",
    placeholderText: "Device 2",
    detailHref: "/devices?type=phone",
  },
  {
    id: "phone-sim",
    category: "phones",
    name: "SIM | eSIM",
    spec: "Шинэ дугаар, дугаар шилжүүлэлт",
    placeholderText: "Device 3",
    detailHref: "/devices?type=sim",
  },

  // ── Дагалдах хэрэгсэл ──────────────────────────────────────────────
  {
    id: "acc-audio",
    category: "accessories",
    name: "Чихэвч",
    spec: "Утасгүй болон утастай сонголт",
    placeholderText: "Device 4",
    detailHref: "/devices?type=accessory",
  },
  {
    id: "acc-power",
    category: "accessories",
    name: "Цэнэглэгч, кабель",
    spec: "Хурдан цэнэглэлт, төрөл бүрийн холбогч",
    placeholderText: "Device 5",
    detailHref: "/devices?type=accessory",
  },
  {
    id: "acc-wearable",
    category: "accessories",
    name: "Ухаалаг цаг",
    spec: "Эрүүл мэнд, мэдэгдэл, дуудлага",
    placeholderText: "Device 6",
    badge: "Шинэ",
    detailHref: "/devices?type=accessory",
  },

  // ── Интернэтийн төхөөрөмж ──────────────────────────────────────────
  {
    id: "net-hgw",
    category: "wifi",
    name: "Wi-Fi 6 рутер (HGW)",
    spec: "Гэрийн үндсэн интернэтийн төхөөрөмж",
    placeholderText: "Device 7",
    badge: "Онцлох",
    detailHref: "/devices?type=hgw",
  },
  {
    id: "net-ont",
    category: "wifi",
    name: "ONT — шилэн кабелийн төгсгөл",
    spec: "FTTH холболтын суурь төхөөрөмж",
    placeholderText: "Device 8",
    detailHref: "/devices?type=hgw",
  },
  {
    id: "net-cpe",
    category: "wifi",
    name: "Гэр интернэтийн төхөөрөмж",
    spec: "Кабельгүй, сүлжээгээр холбогдох сонголт",
    placeholderText: "Device 9",
    detailHref: "/devices?type=cpe",
  },

  // ── ТВ-н төхөөрөмж ─────────────────────────────────────────────────
  {
    id: "tv-stb",
    category: "stb",
    name: "TV Box (STB)",
    spec: "Сувгийн үзэлт, буцаан үзэх боломж",
    placeholderText: "Device 10",
    detailHref: "/devices?type=stb",
  },
  {
    id: "tv-dongle",
    category: "stb",
    name: "Dongle",
    spec: "Smart TV-д шууд залгаж ашиглах",
    placeholderText: "Device 11",
    detailHref: "/devices?type=stb",
  },
  {
    id: "tv-remote",
    category: "stb",
    name: "Алсын удирдлага",
    spec: "Орлуулах болон нэмэлт удирдлага",
    placeholderText: "Device 12",
    detailHref: "/devices?type=stb",
  },

  // ── Нэмэлт төхөөрөмж ───────────────────────────────────────────────
  {
    id: "extra-mesh",
    category: "fttr",
    name: "Mesh цэг",
    spec: "Хамрах хүрээг өрөө бүрд тэлнэ",
    placeholderText: "Device 13",
    badge: "Онцлох",
    detailHref: "/devices?type=fttr",
  },
  {
    id: "extra-fttr",
    category: "fttr",
    name: "FTTR цэг",
    spec: "Өрөө бүрд шилэн кабелиар — хамгийн тогтвортой",
    placeholderText: "Device 14",
    detailHref: "/devices?type=fttr",
  },
  {
    id: "extra-network",
    category: "fttr",
    name: "Сүлжээний хэрэгсэл",
    spec: "Кабель, шилжүүлэгч, бэхэлгээ",
    placeholderText: "Device 15",
    detailHref: "/devices?type=fttr",
  },
];
