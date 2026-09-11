import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  footerMeta,
  footerSitemap,
  footerStripLinks,
  footerTagline,
  type FooterLink,
} from "@/data/footer";
import { appStores, socialLinks, type AppStoreLink, type SocialLink } from "@/data/footer-extras";
import { cn } from "@/lib/utils";

/**
 * ⚠️ `SHOW_APP_DOWNLOAD` УСТСАН (2026-09-10). Тэр нь `BRAND !== "unitel"`
 * байсан бөгөөд ЗӨВХӨН Univision-ы footer-т "Апп татах" блок гаргадаг байв.
 * Захиалагч: "Univision дээр тусдаа байгаа апп татах хэсгийг хас, би огт
 * нэм гэж хэлээгүй" — тэр блок нүүрний `AppPromo` section-той давхардаж,
 * нэг хуудсанд ижил CTA хоёр удаа гаргаж байсан.
 *
 * ⇒ Апп татах CTA нь одоо ХОЁУЛАН БРЭНД дээр ЗӨВХӨН `AppPromo` section-д.
 * Footer-ийн мобайл ба desktop хоёрын аль алинд нь (`footer.tsx`,
 * `DesktopFooterCard`) энэ блок БАЙХГҮЙ болов.
 *
 * `AppStoreRow` компонент нь ХЭВЭЭР (доор) — `AppPromo` буцаад footer-т
 * хэрэгтэй болвол дахин бичих шаардлагагүй.
 */

/** Copyright мөр — desktop card ба мобайлын strip ХОЁУЛАА эндээс. */
export function FooterCopyright({ className }: { className?: string }) {
  // Он нь ГАРААР бичигдээгүй: загварт "© 2026" гэж байгаа боловч он дараа
  // жил өөрөө хөгширнө. Дүрс нь ижил, засвар шаардахгүй.
  const year = new Date().getFullYear();

  return (
    <p className={cn("text-muted-foreground text-sm lg:text-xs", className)}>
      © {year} {footerMeta.copyrightOwner}. {footerMeta.rightsNote}
    </p>
  );
}

/**
 * LegalStrip — ЗӨВХӨН МОБАЙЛЫН copyright зурвас.
 *
 * ⚠️ DESKTOP-ААС ХАСАГДСАН (2026-09-08). Өмнө нь desktop-д мөн харагдаж,
 * "copyright · компанийн линк | … · Монгол Улс" гэсэн нэг мөр байв. Шинэ
 * desktop загвар (`DesktopFooterCard`) нь ХОЁУЛАНГ НЬ өөртөө шингээсэн:
 *   компанийн линкүүд → картын 5-р (гарчиггүй) багана
 *   copyright        → картын доод мөр, сошиал дүрсний хажууд
 * Тиймээс энэ зурвас `lg:hidden` болов. Тэгэхгүй бол desktop-д copyright
 * ХОЁР УДАА гарна. Мөн `StripLink` ба `footerMeta.region`-ийн хэрэглээ
 * үүнтэй хамт хасагдсан (data-г устгаагүй).
 */
export function LegalStrip() {
  return (
    /**
     * ⚠️ `border-t bg-muted/40` ХАСАГДСАН (2026-09-10, захиалагчийн загвар).
     * Copyright нь өмнө нь ӨӨРИЙН зурвастай, дээрээ зураастай байв. Загварт
     * бол `MobileSitemap`-ийн цайвар КАРТ дуусаад, доор нь copyright нь
     * хуудасны САААРАЛ дэвсгэр дээр ил, ямар ч хайрцаг/зураасгүй суудаг —
     * тэгснээр карт л "footer" мэт харагдана. Дэвсгэр өгвөл картын доор
     * ХОЁР ДАХЬ зурвас үүсч, хөвөгч мэдрэмж эвдэрнэ.
     */
    <div className="lg:hidden">
      <div className="container mx-auto">
        {/* ⚠️ ДООД ЗАЙ ТОМ (`pb-10` = 40px, `pt-4` = 16px хэвээр).
            Шалтгаан: copyright нь ХУУДАСНЫ ХАМГИЙН СҮҮЛИЙН элемент бөгөөд
            өмнө нь ердөө 16px зайтай байв. Тэр 49px өндөр зурвасыг мобайл
            хөтчийн доод хэрэгслийн зурвас, төхөөрөмжийн home bar, эсвэл
            төхөөрөмжийн mockup-ийн bezel ДАРЖ, "2 дахь layer харагдахгүй"
            гэсэн шинж үүсгэж байсан (2026-09-07-нд захиалагч мэдэгдсэн).
            40px нь тэдгээрээс дээш өргөж, зурвасыг үргэлж уншигдахуйц болгоно.

            ⚠️ `env(safe-area-inset-bottom)` ХЭРЭГЛЭЭГҮЙ: тэр нь зөвхөн
            `viewport-fit=cover` үед 0-ээс өөр утга авдаг ба cover нь хуудсыг
            safe area руу будаж, БҮХ `fixed` элементэд (чат widget, хүртээмжийн
            панел) тус тусын inset padding шаардана. Тогтмол 40px нь тэр
            эрсдэлгүйгээр ижил үр дүн өгнө. */}
        <div className="flex flex-col items-center pt-4 pb-10">
          <FooterCopyright className="text-center" />
        </div>
      </div>
    </div>
  );
}

/**
 * Footer-ийн линк — гадаад бол ↗ тэмдэгтэй.
 *
 * ⚠️ `external` (ХАРАГДАХ ↗) ба `target="_blank"` (ЗАН ТӨЛӨВ) хоёрыг САЛГАВ.
 * Загварт Univision, DDISH TV, Ger internet бүгд ↗-тэй боловч тэдний зам нь
 * одоогоор `#` (проектод 179 линк ийм — зам тодроогүй). `target="_blank"`-ыг
 * `external` талбараар тавибал `#` руу ХООСОН TAB нээгдэнэ. Тиймээс:
 *   ↗ тэмдэг      ← `item.external` (агуулгын үнэн: сайтаас гарна)
 *   шинэ tab      ← href нь бодит `http` эсэх (техникийн үнэн)
 * Жинхэнэ хаяг орж ирэхэд шинэ tab нь ӨӨРӨӨ ажиллаж эхэлнэ, кодыг дахин
 * засах шаардлагагүй.
 */
export function FooterNavLink({
  item,
  className,
  showArrow = false,
}: {
  item: FooterLink;
  className?: string;
  /** ↗ тэмдгийг харуулах эсэх. Desktop-ийн карт л хэрэглэнэ. */
  showArrow?: boolean;
}) {
  // `no-underline` — AccordionContent нь доторх бүх `<a>`-г underline болгодог
  const cls = cn(
    /**
     * ⚠️⚠️ ЗӨВХӨН МОБАЙЛД ТОМ: `text-base` (16px) → `lg:text-sm` (14px).
     *
     * 2026-09-10-нд эхлээд БҮХ өргөнд 16px болгосон нь ЗӨРҮҮ байлаа —
     * захиалагч: "би footer-ийн текстийн хэмжээг МОБАЙЛ ДЭЭР Л өөрчил гэж
     * хэлж байсан, desktop дээр биш". Desktop нь 14px-ээрээ БУЦСАН.
     *
     * ⚠️ Энэ компонент нь desktop-ийн карт (`DesktopFooterCard`) БА мобайлын
     * жагсаалт ХОЁУЛАНД дуудагддаг тул хоёр тусдаа класс бичих боломжгүй —
     * `lg:` таслалт нь цорын ганц зөв арга. Мобайл-онцгой хэсгүүд
     * (`FOOTER_ROW` г.м) нь `lg:hidden` савандаа байдаг тул тэнд `lg:`
     * ХЭРЭГГҮЙ.
     */
    "text-muted-foreground hover:text-foreground text-base no-underline transition-colors lg:text-sm",
    showArrow && "inline-flex items-center gap-1",
    className,
  );

  const external = item.external ?? item.href.startsWith("http");
  const newTab = item.href.startsWith("http");
  const arrow = showArrow && external && (
    <ArrowUpRight className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
  );

  return newTab ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.label} (шинэ tab-д нээгдэнэ)`}
      className={cls}
    >
      {item.label}
      {arrow}
    </a>
  ) : (
    <Link href={item.href} className={cls}>
      {item.label}
      {arrow}
    </Link>
  );
}

// =====================================================================
// DESKTOP FOOTER — ХӨВӨГЧ КАРТ, 5 БАГАНА (БҮХ ХУВИЛБАРТ ИЖИЛ)
// =====================================================================
/**
 * ⚠️ 2026-09-08 — ЗАХИАЛАГЧИЙН ЗАГВАР. Өмнө нь desktop-д ХОЁР ӨӨР footer
 * байсан (`DesktopSitemap` нь header-ийн хувилбар 1/3-д, `FooterClassic` нь
 * хувилбар 2-д). Захиалагч "desktop-ийн БҮХ footer"-ыг үүгээр солихыг заасан
 * тул хоёулаа ЭНЭ компонентыг дуудаж, desktop-ийн footer нь хувилбараас
 * хамаарахаа больсон. 2026-09-11-нд МОБАЙЛ нь ч мөн адил болов: хоёр footer
 * компонент нэгдэж, `footer.tsx > Footer` ганцаараа үлдсэн.
 *
 * ┌─ bg-background ───────────────────────────────────────────────────┐
 * │ ╭─ bg-card, rounded-2xl ───────────────────────────────────────╮  │
 * │ │ UNITEL      Харилцаа      Платформ    Дижитал      Юнител групп│ │
 * │ │             холбооны                  үйлчилгээ    Тогтвортой… │ │
 * │ │ тайлбар…    сүлжээ                                 Хэвлэлийн… │ │
 * │ │             Ger internet↗ Univision↗  TOKI↗        Career     │ │
 * │ │                           LookTV↗     U-Point↗     Тусламж    │ │
 * │ │                           DDISH TV↗   Nexmind↗     Холбоо…    │ │
 * │ │ ──────────────────────────────────────────────────────────────│ │
 * │ │ © 2026 Unitel. Бүх эрх…                       f  𝕏  ◙  ▶     │ │
 * │ ╰──────────────────────────────────────────────────────────────╯  │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * 5-Р БАГАНА ГАРЧИГГҮЙ — загварынх. Гарчиг зохиож нэмбэл загвараас зөрнө,
 * гэхдээ screen reader-т бүлэг нь нэрлэгдэх ёстой тул `<nav aria-label>`
 * -оор ЗӨВХӨН семантик нэр өглөө (харагдахгүй).
 *
 * `АППЫГ ТАТАХ` блок ЭНД БАЙХГҮЙ — загварт байхгүй. 2026-09-10-наас хойш
 * МОБАЙЛД Ч БАЙХГҮЙ (`SHOW_APP_DOWNLOAD` устсан, энэ файлын толгойг үз).
 */
export function DesktopFooterCard() {
  return (
    <div className="container mx-auto hidden py-10 lg:block">
      {/* Карт — хуудасны дэвсгэр (`--background`, light-д #e2e8ec) дээр хөвөх
          цайвар талбай (`--card`, #f3f5f7). Загварт ЯГ ийм хос өнгө байна тул
          токенууд ямар ч theme-д зөв дагана. */}
      <div className="bg-card border-border rounded-2xl border p-10">
        {/* 1-Р БАГАНА нь бусдаасаа 1.5 дахин ӨРГӨН — доор нь тайлбар бичвэр
            суудаг тул линкийн баганатай ижил өргөнд 4-5 мөр болж хагарна.
            `grid-cols-5` дээр `col-span-2` тавих ч болох ч тэгвэл багана
            хоорондын зай ЗӨРНӨ (брэндийн дараа хоёр багананы зай нэмэгдэнэ).

            ⚠️ `grid-rows-[auto_1fr]` + доорх `grid-rows-subgrid` нь ЗАЙЛШГҮЙ.
            Загварт 2–4-р баганын ЭХНИЙ ЛИНК бүгд НЭГ шугамаас эхэлдэг —
            "Харилцаа холбооны сүлжээ" гарчиг ХОЁР мөр болсон ч. Багана
            тус бүр ӨӨРИЙН урсгалаар бичигдвэл тэр баганын жагсаалт 20px
            доошилж, гурван багана шаталж харагдана (хэмжсэн: Ger internet
            y=100, Univision/TOKI y=80).

            subgrid нь гарчгийн мөрийг ГАДНАХ grid-ийн НЭГ track болгож,
            хамгийн өндөр гарчгаар (2 мөр = 40px) бүгдийг тэгшитгэнэ.
            `min-h-10` гэж ГАРААР тавих аргаас дээр: гарчиг 3 мөр болбол
            subgrid өөрөө дагана, харин тогтмол тоо хоцорно. */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] grid-rows-[auto_1fr] gap-x-8 gap-y-4">
          {/* Брэнд — хоёр мөрийг эзэлнэ, subgrid БИШ: лого ба тайлбар нь
              гарчиг/жагсаалтын шугамд эгнэх шаардлагагүй, өөрийн урсгалаар. */}
          <div className="row-span-2">
            <LogoHomeLink className="inline-flex items-center" aria-label="Нүүр">
              <BrandLogo height={28} />
            </LogoHomeLink>
            {/* `max-w-xs` — багана өргөссөн ч мөрийн урт 45-75 тэмдэгтийн
                уншихад тохиромжтой хязгаарт үлдэнэ. */}
            <p className="text-muted-foreground mt-5 max-w-xs text-xs leading-relaxed">
              {footerTagline}
            </p>
          </div>

          {footerSitemap.map((column) => (
            <nav
              key={column.id}
              aria-labelledby={`footer-col-${column.id}`}
              className="row-span-2 grid grid-rows-subgrid"
            >
              <FooterHeading id={`footer-col-${column.id}`}>{column.title}</FooterHeading>
              {/* `mt-4` БАЙХГҮЙ — гарчиг/жагсаалтын зайг гаднах grid-ийн
                  `gap-y-4` өгнө. `mt` нэмбэл subgrid-ийн track-д давхарлаж,
                  баганууд дахин зөрнө. */}
              <ul className="space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.id}>
                    <FooterNavLink item={item} showArrow />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* 5-Р БАГАНА — ГАРЧИГГҮЙ. Загварт линкүүд нь ГАРЧГИЙН эхний
              мөрөөс эхэлдэг тул subgrid-д ОРОХГҮЙ (орвол хоосон гарчгийн
              track нь жагсаалтыг 40px доошлуулна).

              ⚠️ ЭДГЭЭР НЬ ЗУЗААН (2026-09-08, захиалагчийн заавар).
              `font-semibold` нь `FooterHeading`-тэй ЯГ ИЖИЛ жин — багана
              гарчиггүй тул линкүүд өөрсдөө гарчгийн зэрэглэлд гарч, бусад
              баганы ГАРЧИГТАЙ нэг шугамд эгнэнэ.

              ⚠️ ӨНГӨ ч `text-foreground` болов. Зузаан + `muted` хосолбол
              ЖИН нь "чухал", ӨНГӨ нь "хоёрдогч" гэж ЭСРЭГ зүйл хэлж,
              бичвэр бүдэг зузаан болж уншигдана. Класс нь `<ul>`-ийн
              `text-muted-foreground`-ыг дарахын тулд линк тус бүрд өгөгдөнө
              (эцгийн класс нь өвлөгддөг тул `<ul>` дээр л сольсон бол
              `FooterNavLink`-ийн өөрийн `text-muted-foreground` дийлнэ). */}
          <nav aria-label="Компанийн холбоос" className="row-span-2">
            <ul className="space-y-2.5 text-sm">
              {footerStripLinks.map((item) => (
                <li key={item.id}>
                  <FooterNavLink item={item} className="text-foreground font-semibold" />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-border mt-10 flex items-center gap-6 border-t pt-6">
          <FooterCopyright />
          <SocialRow square className="ml-auto" />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Апп татах — Singtel маягийн pill (icon + "Download on the" + store нэр)
// =====================================================================
export function AppStoreRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-start gap-2", className)}>
      {appStores.map((store) => (
        <li key={store.id}>
          <AppStoreBadge store={store} />
        </li>
      ))}
    </ul>
  );
}

export function AppStoreBadge({ store }: { store: AppStoreLink }) {
  return (
    <Link
      href={store.href}
      aria-label={`${store.prefix} ${store.storeName}`}
      className="bg-muted hover:bg-muted/70 text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <StoreIcon storeId={store.id} className="size-4 shrink-0" />
      <div className="flex flex-col text-left leading-tight whitespace-nowrap">
        <span className="text-[9px] tracking-wide opacity-80">{store.prefix}</span>
        <span className="text-[11px] font-semibold">{store.storeName}</span>
      </div>
    </Link>
  );
}

// =====================================================================
// Сошиал — дугуй icon товчнууд
// =====================================================================
export function SocialRow({
  className,
  square = false,
}: {
  className?: string;
  /**
   * ДӨРВӨЛЖИН (загварын desktop карт) эсвэл ДУГУЙ (мобайл, хуучин хэлбэр).
   *
   * ⚠️ Хоёр хэлбэр ЗЭРЭГ байгаа нь зориуд: desktop-ийн карт нь дүүрсэн
   * дэвсгэртэй 36px бөөрөнхий дөрвөлжин (загвараас), мобайл нь хүрээтэй 40px
   * дугуй (хуруунд таарах том хэмжээ). Хоёуланг нэг хэлбэрт нийлүүлэх нь
   * ХОЁР загварын НЭГИЙГ зөрчинө тул props-оор салгав.
   */
  square?: boolean;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {socialLinks.map((social) => (
        <li key={social.id}>
          <Link
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${social.name} (шинэ tab-д нээгдэнэ)`}
            className={cn(
              "text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              square
                ? // 36px — desktop-ийн хулганы онилолтод WCAG 2.5.8-ын 24px-ээс
                  // дээгүүр. Дүүрсэн дэвсгэр тул хүрээ шаардлагагүй.
                  "bg-muted hover:bg-muted/70 size-9 rounded-lg"
                : "border-border hover:border-foreground/40 size-10 rounded-full border",
            )}
          >
            <SocialIcon socialId={social.id} className={square ? "size-4" : undefined} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Багана гарчиг — бүх хувилбарт ижил хэмжээ/жин.
 *
 * `id` — desktop картын багана нь `<nav aria-labelledby>`-гаар өөрийн
 * гарчгаас нэрээ авдаг (гарчгийг ХОЁР УДАА бичихгүйн тулд `aria-label`
 * хэрэглээгүй).
 */
export function FooterHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="text-foreground text-base font-semibold lg:text-sm">
      {children}
    </h3>
  );
}

// =====================================================================
// STORE / SOCIAL icons — monochrome SVG
// =====================================================================
export function StoreIcon({
  storeId,
  className,
}: {
  storeId: AppStoreLink["id"];
  className?: string;
}) {
  const cls = className ?? "size-5";

  if (storeId === "app-store") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M17.05 12.04c-.03-3.07 2.51-4.55 2.62-4.62-1.43-2.09-3.66-2.38-4.45-2.41-1.89-.19-3.7 1.12-4.66 1.12-.97 0-2.45-1.1-4.03-1.07-2.07.03-3.99 1.21-5.06 3.07-2.16 3.74-.55 9.27 1.55 12.31 1.03 1.49 2.25 3.16 3.85 3.1 1.55-.06 2.13-1 4-1 1.86 0 2.4 1 4.03.97 1.66-.03 2.72-1.51 3.74-3.01 1.18-1.73 1.67-3.4 1.69-3.49-.04-.02-3.25-1.25-3.28-4.97zM14.21 3.18C15.07 2.14 15.65.71 15.49-.7c-1.21.05-2.69.81-3.58 1.83-.79.91-1.49 2.37-1.31 3.75 1.35.11 2.74-.69 3.61-1.7z" />
      </svg>
    );
  }

  if (storeId === "google-play") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zM14.539 12.748l2.273 2.273-12.02 6.89c-.232.13-.483.13-.703.07l10.45-9.233zM20.16 10.81c.66.378.66 1.34 0 1.717l-3.346 1.918-2.273-2.273-1.067-1.067 2.273-2.273 1.067-1.067 3.346 1.918v.001zM4.087 1.985l12.02 6.89-2.273 2.273L4.087 1.985z" />
      </svg>
    );
  }

  // AppGallery
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
      <path d="M14.36 2.5h5.13c1.11 0 2.01.9 2.01 2.01v15.13c0 1.11-.9 2.01-2.01 2.01h-5.13c2.65-1.6 4.43-4.51 4.43-7.84V10.34c0-3.33-1.78-6.24-4.43-7.84zM4.5 2.5h5.14c-2.65 1.6-4.43 4.51-4.43 7.84v3.47c0 3.33 1.78 6.24 4.43 7.84H4.5c-1.11 0-2.01-.9-2.01-2.01V4.51c0-1.11.9-2.01 2.01-2.01zm7.5 4.6c-2.71 0-4.91 2.2-4.91 4.91s2.2 4.91 4.91 4.91 4.91-2.2 4.91-4.91-2.2-4.91-4.91-4.91zm0 2.05a2.86 2.86 0 110 5.72 2.86 2.86 0 010-5.72z" />
    </svg>
  );
}

export function SocialIcon({
  socialId,
  className: classNameProp,
}: {
  socialId: SocialLink["id"];
  className?: string;
}) {
  const className = classNameProp ?? "size-5";

  if (socialId === "x") {
    // X (хуучин Twitter) — албан ёсны тэмдэг: хоёр диагональ зурвас.
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (socialId === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  if (socialId === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }

  // YouTube
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
