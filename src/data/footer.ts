/**
 * Univision Web 4.0 — Footer data
 *
 * Footer-ийн навигацийн линк болон компанийн нэр зэрэг
 * харьцангуй тогтвортой контентийг энд төвлөрүүлнэ.
 *
 * ⚠️ Доорх текст/линкүүдийн ИХЭНХ нь PLACEHOLDER. Жинхэнэ хаяг, дугаар,
 * хуудсууд тодрох үед зөвхөн энэ файлыг засна — компонентууд хөндөгдөхгүй.
 */

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  id: string;
  title: string;
  items: FooterLink[];
};

export const footerLinks: FooterLink[] = [
  { id: "about", label: "Бидний тухай", href: "#" },
  { id: "news", label: "Хэвлэлийн мэдээ", href: "#" },
  { id: "coverage", label: "Сүлжээний хамрах хүрээ", href: "#" },
  { id: "branches", label: "Салбарын байршил", href: "#" },
  { id: "contact", label: "Холбоо барих", href: "#" },
];

/**
 * FOOTER-ИЙН ГАРЧИГТАЙ БАГАНУУД (desktop-д 2–4-р багана).
 *
 * ⚠️ 2026-09-08-НД ЗАХИАЛАГЧИЙН ЗАГВАРААР ШИНЭЧЛЭГДСЭН:
 *   гарчиг  "Харилцаа холбоо" → "Харилцаа холбооны сүлжээ"
 *           "Платформ бизнес" → "Платформ"
 *   нэрс    брэндийн нэрийг ЛАТИНААР (Юнивишн → Univision, Look TV → LookTV,
 *           Toki App → TOKI, Гэр интернэт → Ger internet) — загварт брэнд
 *           бүрийг өөрийн бичлэгээр харуулсан
 *   хасагдсан  "Юнител" — энэ нь Unitel-ийн ӨӨРИЙН сайт тул footer-т өөрийгөө
 *              линкээр жагсаах нь давхардал
 *   нэмэгдсэн  "Nexmind" (Дижитал үйлчилгээ)
 *
 * ⚠️ `external: true` нь ХАРАГДАХ ↗ тэмдгийг шийднэ (сайтаас гарна гэсэн
 * мэдээлэл), `target="_blank"` нь ЗӨВХӨН href нь бодит `http` хаяг байхад
 * тавигдана (`FooterNavLink`). Ингэснээр `#` placeholder нь хоосон tab
 * нээхгүй, харин жинхэнэ хаяг орж ирэхэд шинэ tab өөрөө ажиллаж эхэлнэ.
 */
export const footerSitemap: FooterColumn[] = [
  {
    id: "connectivity",
    title: "Харилцаа холбоо",
    items: [{ id: "Current", label: "Unitel", href: "#", external: true },
      { id: "home-internet", label: "Ger internet", href: "#", external: true },
    
    ],
  },
  {
    id: "platform",
    title: "Платформ",
    items: [
      { id: "univision", label: "Univision", href: "#", external: true },
      { id: "looktv", label: "LookTV", href: "https://looktv.mn/", external: true },
      { id: "ddishtv", label: "DDISH TV", href: "#", external: true },
    ],
  },
  {
    id: "digital",
    title: "Дижитал үйлчилгээ",
    items: [
      { id: "toki", label: "Toki App", href: "https://toki.mn/", external: true },
      { id: "upoint", label: "U-Point", href: "https://u-point.mn/", external: true },
    ],
  },
];

/**
 * Брэндийн баганын тайлбар (desktop footer-ийн 1-р багана, логоны доор).
 * ⚠️ Захиалагчийн загвараас — өмнөх "Монголын тэргүүлэх дижитал үйлчилгээ
 * хаана ч, хэзээ ч тантай хамт." гэснийг СОЛИВ.
 */
export const footerTagline = "Монгол орныг дэлхийтэй холбосон үндэсний харилцаа холбооны групп.";

export const footerContact = {
  title: "Тусламж, холбоо барих",
  phone: { label: "1200", href: "tel:1200" },
  phoneNote: "Тусламжийн төв · үнэгүй",
  hours: "Ажиллах цаийн хуваарь 00:00–00:00",
  address: "Улаанбаатар, Сүхбаатар дүүрэг, 8-р хороо, etc...",
  email: { label: "info@unitel.mn", href: "mailto:info@unitel.mn" },
  actions: {
    call: { label: "Ажилтантай холбогдох", href: "tel:1200" },
    store: { label: "Салбар хайх", href: "#" },
  },
};

export const footerShopLine = {
  lead: "Салбараас үйлчилгээ авах:",
  storeLink: { label: "Өөрт ойрхон салбарыг олох", href: "#" },
  between: "эсвэл",
  afterLinks: "-ээс аваарай.",
  callLead: "Эсвэл",
  phone: { label: "0000", href: "#" },
  phoneNote: "(0000-0000)",
  callTail: "руу залгана уу.",
};

/**
 * КОМПАНИЙН ХОЛБООС — desktop footer-ийн 5-р (ГАРЧИГГҮЙ) багана, мобайл дээр
 * ангиллын accordion-ы доорх жагсаалт.
 *
 * ⚠️ 2026-09-08-НД ЗАХИАЛАГЧИЙН ЗАГВАРААР ШОШГО ШИНЭЧЛЭГДСЭН:
 *   "Бидний тухай"        → "Юнител групп"
 *   "Тогтвортой ирээдүй"  → "Тогтвортой хөгжил"
 *   "Нээлттэй ажлын байр" → "Career"
 *   НЭМЭГДСЭН             → "Тусламж"
 * Загвар нь ЗӨВХӨН desktop-ынх боловч шошго нь МОБАЙЛД ч дагаж солигдоно —
 * нэг линк хоёр өргөнд өөр нэртэй байвал алдаа болно.
 *
 * Эдгээр нь ДОТООД хуудсууд тул `external` БАЙХГҮЙ — загварт ч ↗ тэмдэггүй.
 */
export const footerStripLinks: FooterLink[] = [
  { id: "about", label: "Unitel Group", href: "#" },
  { id: "sustainability", label: "Тогтвортой хөгжил", href: "#" },
  { id: "news", label: "Хэвлэлийн мэдээ", href: "#" },
  { id: "careers", label: "Career", href: "#" },
  { id: "support", label: "Тусламж", href: "#" },
  { id: "contact", label: "Холбоо барих", href: "#" },
];

export const footerMeta = {
  /**
   * ⚠️ "Юнител ХХК" → "Unitel" (2026-09-08, загвараас: "© 2026 Unitel.").
   * Мөн "Copyright ©" гэсэн угтвар "©" болж хураагдсан.
   */
  copyrightOwner: "Unitel",
  rightsNote: "Бүх эрх хуулиар хамгаалагдсан.",
  /**
   * ⚠️ ХЭРЭГЛЭГДЭХЭЭ БОЛЬСОН. Өмнө нь desktop-ийн доод strip-ийн баруун
   * ирмэгт гардаг байсныг загварт СОШИАЛ ДҮРС эзэлсэн. Data-г устгаагүй —
   * шаардлагатай бол буцаах зардал бага.
   */
  region: "Монгол Улс",
};
