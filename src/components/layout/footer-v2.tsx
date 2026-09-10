import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  DesktopFooterCard,
  FooterNavLink,
  LegalStrip,
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
 * `py-3` + `text-base` (мөрийн өндөр 24px) + 1px хүрээ = 50px — WCAG 2.5.8-ын
 * 24px-ийн доод хэмжээнээс хангалттай том, хуруунд таарна.
 *
 * ⚠️⚠️ `text-sm` → `text-base` (2026-09-10, захиалагч: "footer-ийн үсгийн
 * фонтны хэмжээ бага зэрэг жижиг байна, 20 орчим %-р нэм").
 *
 * ⚠️ ЗӨВХӨН МОБАЙЛД. Эхэндээ desktop-ийг ч хамт томсгосон нь ЗӨРҮҮ байлаа —
 * захиалагч: "би мобайл дээр л өөрчил гэж хэлж байсан, desktop дээр биш".
 * Энэ тогтмол нь `MobileSitemap` (`lg:hidden`) дотор л хэрэглэгддэг тул
 * `lg:` таслалт ХЭРЭГГҮЙ. Харин ХУВААЛЦАХ компонентууд (`FooterNavLink`,
 * `FooterHeading`, `FooterCopyright`) нь desktop-ийн картад ч ордог тул
 * тэдэнд `lg:`-ээр буцаалт хийгдсэн — `footer-shared.tsx`-ийг үз.
 *
 * Мобайлын хэмжээ Tailwind-ийн шатаар НЭГ АЛХАМ дээшилсэн — дурын
 * `text-[17px]` гэх мэт тоо БИЧЭЭГҮЙ:
 *     мөр · линк · гарчиг   `text-sm` 14px → `text-base` 16px  (+14%)
 *     copyright             `text-xs` 12px → `text-sm`   14px  (+17%)
 * Хүссэн 20%-аас 3-6% дутуу боловч шатан дээр үлдсэн нь дараагийн засварт
 * "энэ 17px хаанаас гарав?" гэсэн асуулт үүсгэхгүй. Илүү том хэрэгтэй бол
 * дараагийн алхам нь `text-lg` (18px = +29%) — дунд утга БҮҮ ЗОХИО.
 *
 * ⚠️ Мөрийн ӨНДӨР 46 → 50px болсон: хүрэх талбай ТОМОРСОН тул WCAG-ийн
 * хувьд сайжирсан, харин мобайл footer нь ~10% УРТАССАН.
 *
 * ⚠️ `border border-transparent` нь ЧИМЭГЛЭЛ БИШ. `AccordionTrigger` өөрөө
 * focus-ring-ийнхээ төлөө 1px хүрээтэй байдаг тул гарчгийн мөр линкийн
 * мөрнөөс 2px өндөр болно. Ижил хүрээг линкүүдэд ч тавьж тэгшитгэв.
 */
const FOOTER_ROW =
  "flex w-full items-center justify-center border border-transparent py-3 text-center text-base";

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
    /**
     * ⚠️⚠️ ХӨВӨГЧ КАРТ БОЛОВ (2026-09-10, захиалагчийн загварын screenshot:
     * "footer-ийн хэсэг screenshot дээрх шиг bg-тэй биш байна").
     *
     * Өмнө нь мобайлын footer нь хуудасны саарал дэвсгэр дээр ШУУД суудаг,
     * ямар ч хайрцаггүй байв. Загварт бол цайвар дугуй КАРТ хөвж, доор нь
     * copyright нь картын ГАДНА, саарал дээр үлддэг.
     *
     * ⚠️ Энэ нь ШИНЭ ХЭВ МАЯГ БИШ — `DesktopFooterCard` нь ЯГ ижил хосыг
     * (`bg-card` карт + `--background` саарал дэвсгэр) 2026-09-08-наас хойш
     * хэрэглэж байсан. Мобайл л хоцорсон байв. Тиймээс токен, радиус, хүрээ
     * гурвыг тэндээс ХУУЛСАН — хоёр өргөнд footer нэг гэр бүл болно.
     *
     * ⚠️ `rounded-[28px]` нь desktop-ийн `rounded-2xl` (16px)-ээс ТОМ:
     * мобайлын карт нь дэлгэцийн бараг бүтэн өргөнийг эзэлдэг тул ижил
     * радиус нь оптикоор ХАВТГАЙ харагдана (загварт ч илүү бөөрөнхий).
     */
    <div className="px-4 py-8 lg:hidden">
      <div className="bg-card border-border rounded-[28px] border px-4 py-10">
        {/* 1. Брэндийн лого — голд */}
        <LogoHomeLink className="mx-auto flex w-fit items-center" aria-label="Нүүр">
          <BrandLogo height={28} />
        </LogoHomeLink>

        {/* ⚠️ "АПП ТАТАХ" БЛОК ХАСАГДСАН (2026-09-10, захиалагч: "Univision
            дээр тусдаа байгаа апп татах хэсгийг хас, би огт нэм гэж
            хэлээгүй"). Өмнө нь `SHOW_APP_DOWNLOAD` (= `BRAND !== "unitel"`)
            -оор ЗӨВХӨН Univision дээр гарч байсан ба тэр нь нүүрэн дэх
            `AppPromo` section-той ДАВХАРДАЖ, нэг хуудсанд ижил CTA хоёр
            удаа гарч байв. Загварын footer-т энэ блок БАЙХГҮЙ.
            ⇒ Хоёр брэнд одоо ижил: апп татах нь ЗӨВХӨН `AppPromo` section-д. */}

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
    </div>
  );
}
