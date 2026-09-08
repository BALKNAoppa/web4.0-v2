import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  AppStoreRow,
  DesktopFooterCard,
  FooterHeading,
  FooterNavLink,
  LegalStrip,
  SHOW_APP_DOWNLOAD,
  SocialRow,
} from "@/components/layout/footer-shared";
import { footerSitemap, footerStripLinks } from "@/data/footer";
import { cn } from "@/lib/utils";

/**
 * ХУВИЛБАР 1 ба 3-ЫН FOOTER.
 *
 * Desktop — `DesktopFooterCard` (`footer-shared.tsx`): хөвөгч карт, 5 багана.
 *   ⚠️ БҮХ ХУВИЛБАРТ ИЖИЛ. Өмнө нь энд `DesktopSitemap` гэсэн ӨӨР бүтэц
 *   байсан (лого + 3 багана + Апп татах + Сошиал, бүгд нэг эгнээнд, картгүй).
 *   2026-09-08-нд захиалагч "desktop-ийн БҮХ footer"-ыг шинэ загвараар
 *   хийхийг заасан тул `DesktopSitemap` УСТСАН, хувилбар 2-той хуваалцах
 *   нэг компонент болов.
 *
 * Mobile — ГОЛЛУУЛСАН НЭГ БАГАНА: лого → (Апп татах) → ангиллын accordion →
 *   ангилалд ороогүй бусад линк → сошиал icon (`MobileSitemap`). ХӨНДӨГДӨӨГҮЙ.
 *
 * Хамгийн доор — `LegalStrip` нь одоо ЗӨВХӨН МОБАЙЛД (copyright). Desktop-д
 * copyright нь картын дотор орсон.
 */
export function FooterSitemapVariant() {
  return (
    <footer aria-label="Footer" className="border-border bg-background border-t lg:border-t-0">
      <DesktopFooterCard />
      <MobileSitemap />
      <LegalStrip />
    </footer>
  );
}

/**
 * МОБАЙЛЫН ЖАГСААЛТЫН МӨР — ангиллын гарчиг, ангилал доторх линк, ангилалд
 * ороогүй бусад линк ГУРВУУЛАА ЯГ ЭНЭ өндөр, ижил голлолттой. Ингэснээр
 * accordion задарсан ч, хаагдсан ч бүхэлдээ НЭГ жагсаалт мэт уншигдана.
 *
 * `py-3` + `text-sm` (мөрийн өндөр 20px) + 1px хүрээ = 46px — WCAG 2.5.8-ын
 * 24px-ийн доод хэмжээнээс хангалттай том, хуруунд таарна.
 *
 * ⚠️ `border border-transparent` нь ЧИМЭГЛЭЛ БИШ. `AccordionTrigger` өөрөө
 * focus-ring-ийнхээ төлөө 1px хүрээтэй байдаг тул гарчгийн мөр линкийн
 * мөрнөөс 2px өндөр болно. Ижил хүрээг линкүүдэд ч тавьж тэгшитгэв.
 */
const FOOTER_ROW =
  "flex w-full items-center justify-center border border-transparent py-3 text-center text-sm";

/**
 * Доторх бичвэр өндөртэй ХАМТ уусч гарна/арилна.
 *
 * Өндрийн муруй, хугацаа нь `ui/accordion.tsx`-д (300ms) — бүх accordion-д
 * нийтлэг. Энэ уусалт нь ЗӨВХӨН footer-ийнх.
 *
 * Зөвхөн өндөр хөдөлбөл бичвэр нь `overflow-hidden`-д ТАЙРАГДАЖ илэрдэг —
 * эхний хэдэн frame-д мөр хагасаараа зүсэгдэж харагдана. Уусалт нэмэхэд тэр
 * зүсэлт мэдрэгдэхээ болино. 280ms нь өндрийн 300ms-ээс арай богино —
 * бичвэр бүрэн харагдсан хойно хөдөлгөөн жаахан үргэлжилж зөөлөн зогсоно.
 *
 * `[[data-state=open]>&]` — төлөв нь ЭЦЭГ элемент дээр (Content) байдаг тул
 * дотоод div-ийг эцгийнх нь төлөвөөр сонгоно.
 */
const ACCORDION_FADE =
  "duration-[280ms] [[data-state=closed]>&]:animate-out [[data-state=closed]>&]:fade-out [[data-state=open]>&]:animate-in [[data-state=open]>&]:fade-in";

// =====================================================================
// MOBILE — ГОЛЛУУЛСАН НЭГ БАГАНА
//
// Дараалал: лого → (Апп татах) → ангилал × 3 (accordion) → бусад линк →
//           сошиал icon. Доор нь `LegalStrip`-ийн copyright.
//
// ⚠️ ЗААГ ЗУРААС БАЙХГҮЙ. `AccordionItem`-ийн анхны `not-last:border-b`-г
// `not-last:border-b-0`-оор дардаг. Яагаад ЯГ ижил variant-тай бичив гэвэл:
// зүгээр `border-b-0` гэвэл tailwind-merge хоёуланг нь үлдээх ба
// `.not-last\:border-b:not(:last-child)` нь pseudo-class-аасаа болж
// специфик өндөр тул ЗУРААС АРИЛАХГҮЙ.
//
// ⚠️ "Бусад линк" нь `footerStripLinks` — desktop дээр `LegalStrip`-ийн доод
// мөрөнд гардаг ЯГ ТЭР жагсаалт. Хоёр газар давхар гарахгүйн тулд
// `LegalStrip` доторх nav нь `lg`-ээс доош нуугддаг болов.
// =====================================================================
function MobileSitemap() {
  return (
    <div className="container mx-auto py-8 lg:hidden">
      {/* 1. Брэндийн лого — голд */}
      <LogoHomeLink className="mx-auto flex w-fit items-center" aria-label="Нүүр">
        <BrandLogo height={28} />
      </LogoHomeLink>

      {/* 2. Апп татах — зөвхөн Univision дээр (Unitel-ийн нүүрэнд аль хэдийн бий) */}
      {SHOW_APP_DOWNLOAD && (
        <div className="mt-8 flex flex-col items-center">
          <FooterHeading>Апп татах</FooterHeading>
          <AppStoreRow className="mt-3 justify-center" />
        </div>
      )}

      {/* 3. Ангилал + бусад линк — НЭГ жагсаалт, мөр бүр `FOOTER_ROW` */}
      <nav aria-label="Footer navigation" className="mt-6">
        {/* `multiple` — зурган дээрх шиг ГУРВУУЛАА зэрэг задарч чадна.
            `single` үед Платформыг дарахад Харилцаа холбоо хаагдана. Анхны
            төлөв нь БҮГД ХААЛТТАЙ — accordion-ы гол зорилго нь мобайл дээр
            footer-ийн уртыг богиносгох. */}
        <Accordion type="multiple">
          {footerSitemap.map((column) => (
            <AccordionItem key={column.id} value={column.id} className="not-last:border-b-0">
              <AccordionTrigger
                className={cn(
                  FOOTER_ROW,
                  // `gap-1.5` — chevron гарчгийн ЯГ ХАЖУУД. Анхны утга нь
                  // `ml-auto` буюу баруун ирмэг рүү түлхдэг тул `ml-0` болгов.
                  "text-foreground gap-1.5 font-medium **:data-[slot=accordion-trigger-icon]:ml-0",
                )}
              >
                {column.title}
              </AccordionTrigger>
              {/* `pb-0` — анхны `pb-4` нь ангилал хоорондын хэмнэлийг эвдэнэ.
                  `[&_a]:no-underline` — AccordionContent-ийн анхны `[&_a]:underline`
                  нь ҮР ДҮНД НЬ линк дээрх `no-underline`-ыг ялдаг (descendant
                  сонгогч тул специфик өндөр). Тиймээс ЯГ ижил variant-аар
                  дарж, tailwind-merge-ээр солиулав. */}
              <AccordionContent className={cn("pb-0 [&_a]:no-underline", ACCORDION_FADE)}>
                <ul>
                  {column.items.map((item) => (
                    <li key={item.id}>
                      <FooterNavLink item={item} className={FOOTER_ROW} />
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Ангилалд ороогүй бусад линк — ангиллын гарчигтай ИЖИЛ хэв, ижил мөр.
            `hover:opacity-70` — өнгө нь аль хэдийн `foreground` тул үндсэн
            хэвийн `hover:text-foreground` энд харагдах өөрчлөлт өгөхгүй. */}
        <ul>
          {footerStripLinks.map((item) => (
            <li key={item.id}>
              <FooterNavLink
                item={item}
                className={cn(FOOTER_ROW, "text-foreground font-medium hover:opacity-70")}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* 4. Сошиал — гарчиггүй, дээрх мөрүүдтэй ижил голлолтоор */}
      <SocialRow className="mt-2 justify-center" />
    </div>
  );
}
