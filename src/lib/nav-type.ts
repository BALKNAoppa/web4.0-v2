/**
 * Header-ийн ҮСГИЙН НЭГДСЭН СТАНДАРТ — Apple.com-ын global nav / flyout-оос.
 * Бүх хувилбар (1/2/3/4), бүх цэс (bar · mega menu · mobile sheet) энэ 6 роль
 * дотроос л сонгоно. Шинэ хэмжээ нэмэхгүй — роль нэмнэ.
 *
 * Apple-ийн хэмжээс (лавлагаа):
 *   globalnav линк ................ 12px / 400
 *   flyout бүлгийн гарчиг ......... 12px / 400, саарал, ТОМ ҮСЭГГҮЙ
 *   flyout үндсэн линк ............ 24px / 600, tracking -
 *   flyout дэд линк (Quick Links) . 12px / 600
 *
 * Кирилл үсэг латинаас нягт харагддаг тул Apple-ийн 12px-ийг томсгов:
 * header мөр = 14px, панелийн доторх гарчиг/дэд линк/тайлбар = 13px.
 * Хэмжээ солих бол ЗӨВХӨН энэ файлыг засна — бүх хувилбарт нэг дор мөрдөгдөнө.
 */
export const navType = {
  /** Header мөрний линк / trigger — 14px · 400 */
  bar: "text-sm font-normal",
  /** Header мөрний идэвхтэй линк — 14px · 600 */
  barActive: "text-sm font-semibold",
  /** Багана / бүлгийн гарчиг — 13px · 400 · muted (uppercase БИШ) */
  groupLabel: "text-muted-foreground text-[13px] font-normal",
  /** Үндсэн (том) линк — 24px · 600. Зөвхөн панелийн гол жагсаалтад. */
  primaryLink: "text-2xl font-semibold tracking-tight",
  /** Дэд линк — 13px · 600. Quick links, баганат жагсаалт, promo гарчиг. */
  secondaryLink: "text-[13px] font-semibold",
  /** Тайлбар / туслах текст — 13px · 400 */
  body: "text-[13px] font-normal",
  /** Mobile Sheet доторх линк — 14px · 500 (хүрэх талбайд тохируулсан) */
  mobileLink: "text-sm font-medium",
  /** Тоон badge, "SAMPLE" зэрэг жижиг тэмдэг — 10px · 700 */
  badge: "text-[10px] font-bold",
} as const;
