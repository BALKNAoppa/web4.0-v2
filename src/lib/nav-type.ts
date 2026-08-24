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
 * header мөр = 15px, панелийн доторх гарчиг/дэд линк/тайлбар = 13px.
 * Хэмжээ солих бол ЗӨВХӨН энэ файлыг засна — бүх хувилбарт нэг дор мөрдөгдөнө.
 */
export const navType = {
  /** Header мөрний линк / trigger — 15px · 400 (14px-ээс томсгосон) */
  bar: "text-[15px] font-normal",
  /** Header мөрний идэвхтэй линк — 15px · 600 */
  barActive: "text-[15px] font-semibold",
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
  /**
   * Mobile header-ийн ангиллын таб — 12px · 500.
   *
   * Layer 2 нь 5 ангилал болсноор 15px-ээр нэг мөрөнд БАГТАХГҮЙ (5 таб ≈ 415px,
   * боломжтой зай 278px @375px). Иймд жижигрүүлсэн — эхлээд 11px байсныг
   * уншихад хүнд гэж 12px болгов; өргөний зөрүүг pill-ийн padding (px-0.5) ба
   * табын хоорондын зай (gap-0)-аар нөхсөн.
   */
  mobileTab: "text-[12px] font-medium",
  /** Идэвхтэй / одоогийн домэйны mobile таб — 12px · 700 */
  mobileTabActive: "text-[12px] font-bold",
  /** Тоон badge, "SAMPLE" зэрэг жижиг тэмдэг — 10px · 700 */
  badge: "text-[10px] font-bold",
} as const;
