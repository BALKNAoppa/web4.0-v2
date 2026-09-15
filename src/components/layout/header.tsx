"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AudienceSwitchTabs } from "@/components/layout/audience-switch";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import { MobileBrandHeader, type MobileVariant } from "@/components/layout/mobile-header";
import {
  AccountMenu,
  BrandMegaPanel,
  DOMAIN_NAV_NAME,
  LOOKTV_MORPH_TEXTS,
  LanguagePill,
  ThemePill,
  classifierSegments,
  useBrandMegaMenu,
  useCurrentNavName,
} from "@/components/layout/header-shared";
import { appleMegaMenus, appleNavCategories, type EcosystemLink } from "@/data/navigation";
import { useHeaderVariant } from "@/lib/header-variant";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";
import { sectionBg } from "@/lib/section-bg";
import { SparklesText } from "@/components/ui/sparkles-text";

/**
 * ⚠️ ХУВИЛБАР СОНГОХ TOGGLE ЭНДЭЭС ХАСАГДСАН (2026-09-15).
 * Өмнө нь баруун дээд буланд нуугдмал товч + `VariantToggle` мөр байв.
 * Хоёр асуудалтай байсан: танилцуулга дээр stakeholder өөрөө санамсаргүй
 * дарах эрсдэлтэй, бас ЗӨВХӨН өөрийнх нь браузерт нөлөөлдөг тул зайнаас
 * солих боломжгүй байв.
 *
 * Одоо солих ЦОРЫН ГАНЦ газар нь `/admin`, төлөв нь сервер дээр —
 * `lib/header-variant.ts` ба `app/api/header-variant/route.ts`-ийг үз.
 * Хувилбарын дугаарлалт ба шошго нь `app/admin/variant-switch.tsx`-д.
 */

/** Хоёр хувилбарын ХУВААЛЦАХ зүүн талын ангилал (Layer 2) */
const NAV_ITEMS: EcosystemLink[] = appleNavCategories;

/**
 * LAYER 1-ИЙН АНГИЛАГЧИЙН ТОВЧ — "Хувь хэрэглэгч ⌄ · Байгууллага ↗ ·
 * Unitel Group ↗".
 *
 * ⚠️ 15px → 13px БОЛЖ ЖИЖИГРЭВ (2026-09-08, захиалагчийн заавар).
 *
 * ЯАГААД: L1 нь `navType.bar` (15px) байсан — L2-ийн ҮНДСЭН навигацитай ЯГ
 * ИЖИЛ хэмжээ. Хоёр давхарга ижил жинтэй байвал нүд аль нь чухал болохыг
 * өөрөө шийдэх шаардлагатай болно. Гэтэл хэрэглээний давтамж ЭРС өөр:
 *   L1 — "би хэн бэ / ямар сайт руу" гэсэн КОНТЕКСТ сэлгүүр. Нэг хэрэглэгч
 *        нэг сессэд ХАМГИЙН ИХДЭЭ НЭГ УДАА хүрнэ.
 *   L2 — бүтээгдэхүүний үндсэн цэс. БАЙНГА хэрэглэгдэнэ.
 * Проектын лавлагаа болгосон Apple-ийн global nav ч тусламжийн зурвасаа
 * үндсэн цэснээсээ жижиг байлгадаг (`nav-type.ts`-ийн толгойд бий).
 *
 * 13px = `navType.body` — АЛЬ ХЭДИЙН БАЙГАА роль (панелийн тайлбар, бүлгийн
 * гарчигт хэрэглэгддэг). Шинэ хэмжээ НЭМЭЭГҮЙ. Apple-ийн 12px руу
 * буугаагүй: кирилл үсэг тэр хэмжээнд уншигдахаа болино.
 *
 * `px-2 gap-1` — 15px-д тохируулсан 10px/6px зай нь 13px үсэгт хэт сул.
 *
 * ⚠️ МӨРНИЙ ӨНДӨР (`h-8` = 32px) ХӨНДӨӨГҮЙ. Товчны `py-1` (8px) + 13px-ийн
 * мөрийн өндөр (≈19.5px) = 27.5px хүрэх талбай — WCAG 2.5.8-ын 24px-ээс
 * ДЭЭГҮҮР. `h-7` болговол `py`-г 4px болгох шаардлагатай бөгөөс тэр үед
 * хүрэх талбай 23.5px болж ХЯЗГААРААС ДООШ унана. Одоогийн 32px мөрөнд
 * үсэг жижигрэхэд 1.5px байсан сул зай 4.5px болж, зурвас нь "шахагдсан"
 * биш ЗУРВАС мэт харагдана.
 *
 * ⚠️ Дүрсний хэмжээг ЭНД зааж өгөх шаардлагагүй: `audience-switch.tsx`-ийн
 * дүрснүүд `em`-ээр тооцогддог тул текстийн хэмжээг дагаж өөрсдөө жижигрэнэ.
 *
 * ХОЁР ХУВИЛБАР ХУВААЛЦАНА. Өмнө нь хувилбар 1 ба 2-ын L1 хоёулаа
 * `navType.bar`-ыг ТУС ТУСДАА бичдэг байв — нэгийг сольж нөгөөг мартвал
 * хоёр header чимээгүй зөрөх эрсдэлтэй. Одоо ганц эх сурвалж.
 */
const CLASSIFIER_TRIGGER = cn(navType.body, "gap-1 px-2");

/**
 * Desktop-ийн mega панелийн id. Ангиллын trigger нь `aria-controls`-оор үүн
 * рүү заана, мөн ↓ дарахад фокусыг панел руу зөөхөд хаяг болно.
 * (`CategoryNav` ба `MegaLayer` хоёр ХУВААЛЦАНА.)
 */
const MEGA_PANEL_ID = "brand-mega-panel";

/**
 * Ангиллын ДАРААЛАЛ — `useBrandMegaMenu` нь панел хооронд шилжихэд агуулгыг
 * аль чиглэлд гулсуулахыг эндээс тооцно (баруун тийшх ангилал → баруунаас).
 */
const NAV_ORDER = NAV_ITEMS.map((item) => item.name);

/**
 * КАПСУЛ ДОТОРХ ХЭРЭГСЛИЙН БҮЛЭГ — ⊕MN · профайл · theme
 * (2026-09-09, захиалагчийн screenshot).
 *
 * ⚠️ ХЭЛБЭР Л ЭНД, КОМПОНЕНТ НЬ `header-shared.tsx`-Д. `LanguagePill` ба
 * `ThemePill` нь мобайлын хувилбар 3-ын drawer-тай ЯГ ижил компонент —
 * зөвхөн `className` (дугуй, 36px) нь өөр. Тиймээс дүрс, өнгө, зан төлөв
 * хоёр давхаргад хэзээ ч зөрөхгүй.
 *
 * ⚠️ БҮЛГИЙН НЭГДСЭН ДЭВСГЭР ХАСАГДСАН (2026-09-10, захиалагч: "гурвыг
 * тусад нь салгах"). Өмнө нь `bg-muted/60 rounded-full p-1` нь гурвыг НЭГ
 * саарал капсулд багтаадаг байв — капсул дотор капсул болж, header өөрөө
 * шил болсны дараа хоёр давхар "тамга" мэт харагдаж эхэлсэн. Одоо дэвсгэр
 * нь ХЭРЭГСЭЛ ТУС БҮР дээр (`HEADER_TOOL_BASE`), хооронд нь `gap-2` зай.
 */
const HEADER_TOOL_GROUP = "flex items-center gap-2";

/**
 * Бүх хэрэгслийн ХУВААЛЦАХ суурь — дугуй, 36px, төвлөрсөн, ӨӨРИЙН дэвсгэртэй.
 *
 * ⚠️ `bg-muted/60` нь одоо ЭНД (өмнө нь бүлгийн div дээр байсан). Шилэн
 * капсулын дотор бүрэн ил тод үлдээвэл дүрснүүд hero-гийн бараан зураг дээр
 * уншигдахаа болино — хагас тунгалаг саарал нь тэдэнд ӨӨРИЙН суурь өгнө.
 */
const HEADER_TOOL_BASE =
  "text-foreground focus-visible:ring-ring bg-muted/60 inline-flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none";

/** Бичвэртэй (MN) — өргөн нь агуулгаараа. */
const HEADER_TOOL_TEXT = cn(HEADER_TOOL_BASE, "h-9 gap-1.5 px-3");

/**
 * Зөвхөн дүрстэй — 36×36 дөрвөлжин (WCAG 2.5.8-ын 24px-ээс дээгүүр).
 * ⚠️ `hover:bg-background` → `hover:bg-muted`. Өмнөх нь "саарал бүлгийн
 * дотор ЦАЙВАР болж тодрох" зарчимтай байсан; бүлэг арилсан тул одоо эсрэгээр
 * — өөрийнх нь `bg-muted/60`-оос БҮДЭГ болж hover мэдэгдэнэ.
 */
const HEADER_TOOL_ICON = cn(HEADER_TOOL_BASE, "hover:bg-muted size-9");

function HeaderTools() {
  return (
    <div className={HEADER_TOOL_GROUP}>
      {/* ДАРААЛАЛ = screenshot: ⊕MN → профайл → theme */}
      <LanguagePill className={HEADER_TOOL_TEXT} />
      {/* ⚠️ `ProfilePill` БИШ `AccountMenu` — dropdown (нэр + Гарах) нь
          desktop-д хэрэгтэй, `ProfilePill` нь шууд гаргадаг. Тайлбарыг
          `header-shared.tsx > AccountMenu`-д үз. */}
      <AccountMenu className={HEADER_TOOL_ICON} />
      <ThemePill className={HEADER_TOOL_ICON} />
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const variant = useHeaderVariant();

  // /web4 — immersive presentation хуудас, /admin — танилцуулгын удирдлага:
  // хоёулаа header-гүй
  if (pathname?.startsWith("/web4") || pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/**
       * ⚠️⚠️ DESKTOP НЬ ХОЁР ХУВИЛБАРТ ЯГ ИЖИЛ — `LogoLeftHeader` (2026-09-14,
       * захиалагч: "desktop дээр бүх header-г хувилбар 3 шиг болго, тэр нь
       * desktop дээр батлагдсан хувилбар"). Хувилбар нь ЗӨВХӨН `mobileVariant`
       * -ыг л сольж, desktop-ийн бүтэц хөндөгдөхгүй.
       *
       * ⚠️ ХУУЧИН `TopClassifierHeader` (лого төвд, L1 зүүн ирмэгт) БҮРМӨСӨН
       * УСТСАН. Түүнтэй хамт ЗӨВХӨН тэр дээр байсан DESKTOP-ИЙН AI ОРОЛТ
       * (`useHeaderAsk` — ✦ товч + header-ээс гулсдаг асуултын зурвас) ч
       * устсан: батлагдсан desktop хувилбарт тэр элемент байхгүй. Буцааж
       * авах бол git түүхээс (2026-09-14-өөс өмнөх `header.tsx`) сэргээнэ.
       */}
      <LogoLeftHeader mobileVariant={variant} />
    </>
  );
}

// =====================================================================
// ХУВААЛЦАХ — зүүн талын ангиллын nav (desktop) + mega menu hover
// =====================================================================
function CategoryNav({
  openMenu,
  onOpen,
  onClose,
}: {
  openMenu: string | null;
  onOpen: (name: string) => void;
  onClose: () => void;
}) {
  // `aria-current`-д ЗӨВХӨН замаар таарсан нь (fallback-гүй)
  const currentName = useCurrentNavName(NAV_ITEMS);

  /**
   * ДООГУУР ЗУРААС нь ХАМГИЙН ИХДЭЭ НЭГ элемент дээр байна. Эрэмбэ:
   *   1. Цэс НЭЭЛТТЭЙ бол ТЭР — хэрэглэгчийн одоогийн СОНГОЛТ хамгийн чухал
   *   2. Эс бөгөөс замаар таарсан нь (`/devices` → "Дэлгүүр")
   *   3. Эс бөгөөс build-ийн домэйн (нүүр, `/support` гэх мэт)
   *
   * ⚠️ Өмнө нь 2/3-аар гарсан нь БАЙНГА зураастай байсан ба нээлттэй цэс нь
   * ТУСДАА зураас авдаг байв — тиймээс Unitel build дээр Univision-ий цэсийг
   * нээхэд ХОЁР зураас зэрэг харагдаж, аль нь сонгогдсоныг ялгахад хүндрэлтэй
   * байлаа.
   */
  const highlightedName = openMenu ?? currentName ?? DOMAIN_NAV_NAME;

  /**
   * ФОКУС NAV-ААС Ч, ПАНЕЛААС Ч ГАРВАЛ ХААНА.
   *
   * `relatedTarget === null` бол хаяхгүй: тэр нь хуудасны хоосон зайд дарсан
   * (эсвэл tab гадагш явсан) гэсэн үг бөгөөс тэр тохиолдлыг scrim ба
   * `mouseleave` аль хэдийн хаадаг. Хэрэв энд ч хаавал хулганаар панел дээр
   * дарж линк сонгох гэсэн үйлдэл тасалдана.
   *
   * Панел нь ЭНЭ nav-ийн ГАДНА (header-ийн sibling) тул `contains` хоёуланг
   * тусад нь шалгах ёстой — эс бөгөөс табаар панел руу орох гэхэд цэс хаагдана.
   */
  const handleNavBlur = (e: React.FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (!next) return;
    if (e.currentTarget.contains(next)) return;
    if (document.getElementById(MEGA_PANEL_ID)?.contains(next)) return;
    onClose();
  };

  return (
    <nav
      aria-label="Үндсэн цэс"
      onBlur={handleNavBlur}
      onKeyDown={(e) => {
        if (e.key === "Escape" && openMenu) onClose();
      }}
      className="flex items-center gap-5"
    >
      {NAV_ITEMS.map((item) => {
        const highlighted = !item.external && item.name === highlightedName;
        const isCurrentPage = !item.external && item.name === currentName;
        /**
         * ⚠️⚠️ LOOKTV — `MorphingText` → `SparklesText` (2026-09-10,
         * захиалагч: "morph нь хэтэрхий common effect байна … MagicUI-ийн
         * энэ component-оор хийе" + sparkles-text-ийн холбоос).
         *
         * ТҮҮХ (гурав дахь эффект): glitch (09-09-нд хасагдсан) → morph
         * (09-09…09-10) → sparkles. Morph нь хоёр өөр урттай үгийг нэг
         * байрлалд уусгадаг тул дунд нь уншигдахгүй болдог асуудалтай байв;
         * оч нь бичвэрийг ОГТ хөдөлгөхгүй, зөвхөн эргэн тойронд нь анивчина.
         *
         * ⚠️ "ИЛҮҮГ ҮЗ" ГЭСЭН ХОЁР ДАХЬ БИЧВЭР ОДООГООР ГАРАХГҮЙ.
         * `SparklesText` нь бичвэр СОЛИХ БИШ, чимэглэх компонент. Хоёуланг
         * хамт хүсвэл `<SparklesText><MorphingText …/></SparklesText>` гэж
         * үүрлүүлж болно — захиалагчаас лавласны дараа.
         * `LOOKTV_MORPH_TEXTS[0]` нь каноник нэр тул түүнийг л үлдээв.
         *
         * ⚠️ ӨНГӨ нь брэндийн ногоон (`--primary`) ба түүний цайвар хувилбар
         * — MagicUI-ийн анхдагч ягаан/нил нь Unitel-ийн палитрт харш.
         * `sparklesCount={8}` — анхдагч 10 нь 15px шошгоны эргэн тойронд
         * шигүү, цэсний бусад нэрийг бүдгэрүүлнэ.
         *
         * ⚠️ ӨРГӨН нь одоо ЗӨВХӨН "LookTV" гэсэн үгээр тогтоно (morph-ийн
         * "хэмжээ тогтоогч" хэрэггүй болсон) тул цэс нь ~35px нарийсна.
         */
        const label =
          item.name === "LookTV" ? (
            <SparklesText
              sparklesCount={8}
              colors={{
                first: "var(--primary)",
                second: "color-mix(in oklab, var(--primary) 45%, white)",
              }}
            >
              {LOOKTV_MORPH_TEXTS[0]}
            </SparklesText>
          ) : (
            item.name
          );
        const linkClass = cn(
          // ⚠️ ҮСГИЙН ЗУЗААН СОЛИГДОХГҮЙ (`navType.bar` бүгдэд). Тодотгол нь
          // hover-оор зөөгддөг болсон тул зузаан сольвол элементийн өргөн
          // хэлбэлзэж, хажуугийн ангиллууд хажуу тийш цүүрнэ.
          navType.bar,
          "relative whitespace-nowrap transition-colors",
          // Apple маягийн зөөлөн доогуур зураас — hover дээр төвөөс тэлнэ
          "after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
          highlighted
            ? // Дээрх `after:` зураас нь hover үед тэлдэг — `scale-x-100`-аар
              // түүнийг тогтмол болгоно (шинэ элемент нэмэхгүй).
              "text-foreground after:scale-x-100"
            : "text-foreground/75 hover:text-foreground",
          // ⚠️ `glitch-text` ХАСАГДСАН — LookTV нь одоо `MorphingText`
          // (доорх `label`-ийг үз). `globals.css`-ийн `.glitch-text` дүрэм
          // ба хоёр keyframe ч хамт устсан.
        );

        // appleMegaMenus-д бичлэгтэй ангилал — hover/гараар панел задарна
        const menu = !item.external ? appleMegaMenus[item.name] : undefined;
        if (menu) {
          const isOpen = openMenu === item.name;
          return (
            <div
              key={item.name}
              className="flex items-center"
              onMouseEnter={() => onOpen(item.name)}
              onMouseLeave={onClose}
            >
              {/**
               * ⚠️ `<Link href="#">` → `<button>` (2026-09-08). ГОЛ ЗАСВАР.
               *
               * Өмнө нь энэ trigger нь `aria-expanded`-тай АНКЕР байв. Гурван
               * зөрчил:
               *   1. Панел ЗӨВХӨН `mouseenter`-ээр нээгддэг байсан — гараар
               *      (Tab) явж байгаа хэрэглэгч Unitel/Univision-ы дэд цэсийг
               *      ХЭЗЭЭ Ч нээж чадахгүй (WCAG 2.1.1 Keyboard).
               *   2. Enter дарахад анкер нь `href="#"` рүү "шилжиж" юу ч
               *      болохгүй — хэрэглэгч цэс эвдэрсэн гэж дүгнэнэ.
               *   3. `aria-expanded` нь товчны атрибут; анкер дээр байх нь
               *      "энэ линк хаашаа ч явахгүй, панел нээнэ" гэдгийг
               *      screen reader-т зөрүүтэй хэлнэ.
               *
               * `href` нь ЯМАР Ч ААНГИЛАЛД `"#"` (зам хойшлуулсан) тул анкер
               * болгож үлдээх ямар ч ашиг байхгүй — товч нь хатуу дээр.
               *
               * ⚠️ ХЭРЭВ ЖИНХЭНЭ ЗАМ ОРВОЛ: товчийг линк болгож БУЦААХГҮЙ.
               * W3C APG-ийн загвар нь "линк + хажууд нь дэлгэх ТУСДАА товч"
               * эсвэл "товч + панелийн ПЕРВЫЙ мөр нь тэр landing зам".
               * Хоёр үүрэг (шилжих + дэлгэх) НЭГ элемент дээр байх нь гараар
               * хүрэх боломжийг үргэлж эвддэг.
               *
               * `aria-current` ХАСАГДСАН: `isCurrentPage` нь href-ийг замтай
               * тулгадаг ба href нь `"#"` тул ХЭЗЭЭ Ч true болохгүй байсан —
               * өөрөөр хэлбэл юу ч алдагдаагүй. Тодотголыг `highlighted`
               * (доогуур зураас) хариуцна.
               */}
              <button
                type="button"
                data-mega-trigger={item.name}
                aria-expanded={isOpen}
                aria-controls={MEGA_PANEL_ID}
                onClick={() => (isOpen ? onClose() : onOpen(item.name))}
                onKeyDown={(e) => {
                  // ↓ — нээгээд ПАНЕЛ РУУ фокус зөөнө (APG-ийн disclosure
                  // navigation). Панел нь DOM-д header-ийн ДАРАА байдаг тул
                  // зүгээр Tab дарвал дараагийн АНГИЛАЛ руу явна, панел руу
                  // биш — тиймээс зөөлтийг ил хийх шаардлагатай.
                  if (e.key !== "ArrowDown") return;
                  e.preventDefault();
                  onOpen(item.name);
                  // Панел нээгдэж рендерлэгдэх хүртэл нэг frame хүлээнэ.
                  requestAnimationFrame(() => {
                    document
                      .getElementById(MEGA_PANEL_ID)
                      ?.querySelector<HTMLElement>("a[href], button")
                      ?.focus();
                  });
                }}
                className={cn(linkClass, "cursor-pointer")}
              >
                {label}
              </button>
            </div>
          );
        }

        return item.external ? (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {label}
          </a>
        ) : (
          <Link
            key={item.name}
            href={item.href}
            aria-current={isCurrentPage ? "page" : undefined}
            className={linkClass}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mega panel + Apple маягийн scrim — хоёр хувилбарт ижил */
function MegaLayer({
  panelBrand,
  shown,
  direction,
  onOpen,
  onClose,
  onCloseNow,
}: {
  panelBrand: string | null;
  shown: boolean;
  direction: "from-start" | "from-end" | null;
  onOpen: (name: string) => void;
  onClose: () => void;
  onCloseNow: () => void;
}) {
  if (!panelBrand || !appleMegaMenus[panelBrand]) return null;

  return (
    <div
      // Mobile-ын `NavigationMenuViewport`-ийн wrapper ч `absolute top-full`
      // тул CSS класс дээр тулгуурласан selector хоёрыг зөрүүлдэг — desktop
      // панелд тогтвортой тэмдэг.
      data-mega-panel={panelBrand}
      /**
       * `id` — trigger-ийн `aria-controls` ба гараар фокус зөөх хоёрын
       * хаяг (`CategoryNav`). Нэг зэрэг ЗӨВХӨН НЭГ `MegaLayer` рендерлэгддэг
       * (хувилбар 1 ↔ 2 нь хоёулаа биш) тул тогтмол id зөрчил үүсгэхгүй.
       */
      id={MEGA_PANEL_ID}
      /**
       * ESCAPE — панел дотор фокустай байхад хаагаад фокусыг ГАРСАН
       * trigger рүү БУЦААНА. Буцаахгүй бол панел алга болоод фокус нь
       * `<body>` дээр унаж, хэрэглэгч "хаана байгаагаа" алдана.
       *
       * `CSS.escape` — `panelBrand` нь одоогоор "Unitel"/"Univision" боловч
       * ангиллын нэр кирилл эсвэл зайтай болбол сонгогч эвдэрнэ.
       */
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        onCloseNow();
        document
          .querySelector<HTMLElement>(`[data-mega-trigger="${CSS.escape(panelBrand)}"]`)
          ?.focus();
      }}
      onMouseEnter={() => onOpen(panelBrand)}
      onMouseLeave={onClose}
      className={cn(
        /**
         * ⚠️ БҮТЭН ӨРГӨН → ГОЛЛУУЛСАН ХӨВӨГЧ ПАНЕЛ (2026-09-09, захиалагч:
         * "header дээрх mega menu-г голлуулаад …").
         *
         * ӨМНӨ НЬ: `inset-x-0` + `border-t` — панел нь дэлгэцийн ЗАХААС ЗАХ
         * хүрч, дөрвөлжин булантай, header-ийн доод зураас мэт наалддаг байв.
         * Тэр нь ХАВТГАЙ header-т зохилдож байсан; header нь одоо
         * бөөрөнхий ХӨВӨГЧ КАПСУЛ болсон тул хоёр хэлбэр зөрж, панел нь
         * "өөр системийн" хэсэг мэт харагдаж байлаа.
         *
         * ОДОО: `mx-auto max-w-300` (капсултай ЯГ ижил өргөн) +
         * `rounded-[32px]` + `border` (дөрвөн талд) + `mt-2` зай. Панел нь
         * капсулын ЯГ ДООР, ижил хүрээнд, ижил хэлбэрийн хэлээр байрлана.
         *
         * ⚠️ `inset-x-0` ХЭВЭЭР: `absolute` элемент нь өргөнөө агуулгаасаа
         * авдаг тул түүнгүйгээр `mx-auto` голлуулах ЮМ БАЙХГҮЙ болно
         * (`max-w-300` нь дээд хязгаар л, өргөн биш). `px-4` нь нарийн
         * дэлгэцэнд панелыг ирмэгт наалдуулахгүй.
         *
         * ⚠️ `BranchedMegaPanel`-ийн ДОТООД `mx-auto max-w-300` нь одоо
         * ДАВХАРДАЛ боловч ХӨНДӨӨГҮЙ: 1200px хүрээ дотор 1200px хязгаар нь
         * no-op бөгөөс тэр компонентыг `header-archive.tsx` ч дуудаж болно.
         *
         * ⚠️ ДЭВСГЭР, ХҮРЭЭ, БУЛАН нь ДООРХ хүүхэд (`key={panelBrand}`) дээр
         * — энэ гаднах элемент нь ЗӨВХӨН байрлал ба opacity/translate-ийн
         * шилжилтийг хариуцна. Хоёрыг нэг элемент дээр хамт тавибал
         * `px-4` доторх дэвсгэр нь ирмэг хүртэл татагдаж, голлуулалт
         * үгүй болно.
         */
        "absolute inset-x-0 top-full z-50 hidden px-4 lg:block",
        // ӨНДРИЙН ШИЛЖИЛТ — Unitel (6 мөр) → Univision (4 мөр) сольвол панелийн
        // өндөр ҮСРЭХГҮЙ, зөөлөн тэнийнэ. Mobile-ын `NavigationMenuViewport`
        // үүнийг `--radix-…-viewport-height` хувьсагчаар хийдэг; desktop-д тэр
        // хувьсагч байхгүй тул `height: auto`-г шууд interpolate хийлгэнэ.
        //
        // ⚠️ `interpolate-size: allow-keywords` нь ОДООГООР Chromium-д л
        // ажиллана. Firefox/Safari-д өндөр нь өмнөх шигээ шууд солигдоно —
        // зүгээр л энэ сайжруулалт нь тэдэнд үзэгдэхгүй, эвдрэхгүй.
        "transition-[height,opacity,transform] duration-500 ease-out [interpolate-size:allow-keywords]",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      {/* АГУУЛГЫН ГУЛСАЛТ — mobile-ын `NavigationMenu`-тай ижил зан.
          Гаднах дэвсгэр (энэ div) нь НЭГ суурь болж үлдэж, зөвхөн ДОТООД
          агуулга нь шилжих чиглэлд гулсаж орж ирнэ.

          `key={panelBrand}` — брэнд солигдоход React дахин mount хийж
          `animate-in`-ийг ДАХИН тоглуулна (key-гүй бол зөвхөн эхний удаа).
          `direction === null` (шинээр нээгдэж байна) бол гулсалтгүй, fade л. */}
      <div
        key={panelBrand}
        className={cn(
          /**
           * ГОЛЛУУЛСАН ХАВТАН — header-ийн капсултай ИЖИЛ ИРМЭГ ба хэлбэрийн
           * хэл. `rounded-[32px]` нь капсулын `rounded-[100px]`-аас ЖИЖИГ:
           * 96px өндөр капсулд 100px нь бүтэн дугуй болдог, харин ~300px
           * өндөр панелд ижил радиус нь хэт бөөрөнхий "шахмал" болно.
           * `mt-2` (8px) — капсулаас салгах зай.
           *
           * ⚠️⚠️ `max-w-292` (1168px) = КАПСУЛЫН БОДИТ ӨРГӨН (2026-09-10,
           * захиалагч: "mega menu-г header-д голлуул, тэр нь horizontally
           * гэсэн үг"). Панелийн зүүн/баруун ирмэг капсултай ЯГ таарна.
           *
           * ⚠️ ЯАГААД 300 БИШ ВЭ: `max-w-300` (1200px) нь капсулын ГАДНАХ
           * хүрээ. Капсул өөрөө тэр хүрээний `px-4`-ийн дотор суудаг тул
           * бодит өргөн нь 1200 − 32 = 1168. 300 үлдээвэл панел хоёр талдаа
           * 16px-ээр халж, "header-тэй эгнээгүй" харагдана.
           *
           * ⚠️⚠️ ЭНЭ НЬ ӨМНӨ ХИЙГДЭЭД БУЦААГДСАН — ОДОО Л БОЛОМЖТОЙ БОЛСОН.
           * Тэр үед Unitel-ийн "Үндсэн багцууд" салаа ХОЁР бүлэгтэй байсан
           * тул мөрийн агуулга 1144px шаардаж, 1168px хавтанд `px-6`-тай
           * (=1120px) багтахгүй ТАЙРАГДДАГ байв. 2026-09-10-ны цэсний
           * бүтцийн өөрчлөлтөөр (2 mega category, салаа бүр НЭГ бүлэгтэй)
           * шаардлага 856px болж буурсан:
           *     w-56 (224) + gap-10 (40) + [pl-10 (40) + w-52 (208)]
           *     + gap-10 (40) + w-76 (304) = 856
           * Univision-ы хоёр салаа ч мөн НЭГ бүлэгтэй тул хоёр брэндэд
           * 1120px нөөцтэй.
           *
           * ⚠️ ХЭЗЭЭ ДАХИН ЭВДЭРЧ БОЛОХ ВЭ: аль нэг салаанд ХОЁР ДАХЬ бүлэг
           * нэмбэл шаардлага 856 → 1144 болж ДАХИН тайрагдана (208 + 80
           * gap-20). Тэр үед энэ тоог 300 руу буцаах БИШ, харин `w-52` /
           * `gap-20`-г захиалагчтай ярина.
           */
          "border-border bg-popover text-popover-foreground mx-auto mt-2 max-w-292 overflow-hidden rounded-[32px] border shadow-xl",
          // `duration-500` — mobile-ын Content/Viewport-той ИЖИЛ хугацаа.
          // Өмнө 300 байсан тул хоёр давхарга өөр хэмнэлтэй мэдрэгддэг байв.
          "animate-in fade-in duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          direction === "from-end" && "slide-in-from-right-8",
          direction === "from-start" && "slide-in-from-left-8",
        )}
      >
        <BrandMegaPanel menu={appleMegaMenus[panelBrand]} onNavigate={onCloseNow} />
      </div>
    </div>
  );
}

// =====================================================================
// DESKTOP HEADER — ЛОГО ЗҮҮН ТАЛД (БАТЛАГДСАН, ХОЁР ХУВИЛБАРТ ИЖИЛ)
//   Layer 1: ангилагч БАРУУН талд (header-ийн баруун ирмэгт шахсан)
//   Layer 2: [ЛОГО] → араас нь ангиллын mega menu … баруунд хэрэгслүүд
//
//   ┌────────────────────────────────────────────────────────────┐
//   │                          Хувь хэрэглэгч ▾  Байгууллага ↗   │ L1
//   ├────────────────────────────────────────────────────────────┤
//   │ [ЛОГО] Unitel Univision Дэлгүүр …          👤  🌐  ☀       │ L2
//   └────────────────────────────────────────────────────────────┘
//
// ⚠️ ЗАХИАЛАГЧИЙН 2026-09-07-НЫ ЗАГВАР нь МОБАЙЛЫНХ байсан тул desktop энд
// ХӨНДӨГДӨӨГҮЙ. Тэр загварын хэрэгжилтийг `mobile-header.tsx > BrandTabsHeader`
// дотроос үз (ангиллын мөр + капсул).
//
// ⚠️ ХОЁУЛАА ХУВИЛБАР ЭНЭ DESKTOP БҮТЦИЙГ ХЭРЭГЛЭНЭ (2026-09-14, захиалагч:
// "desktop дээр батлагдсан хувилбар") — `mobileVariant` prop-оор зөвхөн
// мобайлын давхарга л сална (1 = доод dock, 2 = burger drawer).
// =====================================================================
function LogoLeftHeader({ mobileVariant = 1 }: { mobileVariant?: MobileVariant }) {
  const { openMenu, panelBrand, shown, direction, openBrandMenu, closeBrandMenu, closeNow } =
    useBrandMegaMenu(NAV_ORDER);

  return (
    <>
      {/* Apple шиг scrim — mega-menu нээгдэхэд body бүдгэрнэ */}
      {panelBrand && appleMegaMenus[panelBrand] && (
        <div
          aria-hidden
          onClick={closeNow}
          className={cn(
            "bg-foreground/10 fixed inset-0 z-40 hidden backdrop-blur-sm transition-opacity duration-500 ease-out lg:block",
            shown ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      )}

      {/**
       * ⚠️ `border-b` ХАСАГДСАН (2026-09-09, захиалагчийн screenshot). Header
       * нь одоо ХӨВӨГЧ КАПСУЛ — доод зураас нь капсулын доор өөр нэг ирмэг
       * үүсгэж, "хөвж байгаа" мэдрэмжийг эвдэнэ. Хуудсаас салгах үүргийг
       * капсулын `shadow-sm` авна.
       */}
      {/**
       * ⚠️⚠️ `relative` — STICKY БИШ. ЗАХИАЛАГЧИЙН ШИЙДВЭР (2026-09-10):
       * "banner дээр sticky байдлаар биш" + screenshot. Header нь хуудастай
       * хамт дээш гүйж алга болно, banner нь дугуй булангуудаараа БҮТНЭЭР,
       * header-ийн ДООР харагдана.
       *
       * ⚠️ ЭНЭ НЬ GLASS-ЫГ УНТРААДАГ — тэгэхээр л зөв. `backdrop-filter` нь
       * элементийн АРД байгаа зургийг л бүдгэрүүлдэг; `relative` header-ийн
       * ард юу ч гүйдэггүй тул капсулын `backdrop-blur-xl` нь ЯМАР Ч ҮР ДҮНГҮЙ
       * (Figma спекийн бүрэлдэхүүн болж үлдсэн). Капсулыг харагдуулах зүйл нь
       * ЗӨВХӨН drop shadow.
       *
       * ⇒ "Шил харагдахгүй байна" гэдэг нь АЛДАА БИШ. Түүнийг асаах гурван
       * нөхцөлийг (2026-09-10-нд туршиж, хөтөч дээр ажиллуулж үзсэн) бүгдийг
       * НЭГ ДОР хийж байж болно:
       *   1. энд `sticky top-0`
       *   2. энд `bg-background` хасах
       *   3. доорх Layer 2-ын нуурын `sectionBg.page` хасах
       *   4. `page.tsx`-ийн `<main>`-д `-mt-[var(--header-h)]` (эхний
       *      дэлгэцэнд ч шил харагдуулах бол) + `PromoHero`-гийн өндөрт
       *      `+ var(--header-h)` нөхөлт
       * Захиалагч 4-ийг харчихаад ХАССАН (капсул banner-ыг дарж байсан) тул
       * 1-3-ыг ч хамт буцаав. Дахин асаахаас өмнө ЗААВАЛ лавлана.
       */}
      <header className="bg-background relative top-0 z-50" role="banner">
        {/**
         * Layer 1 — ангилагч header-ийн БАРУУН ирмэгт шахсан (зөвхөн desktop).
         *
         * ⚠️ `sectionBg.band` (=`bg-card`, #f3f5f7) ИЛ БИЧИГДСЭН. Өмнө нь
         * дэвсгэр огт өгөөгүй, `<header>`-ийн `bg-background`-ыг өвлөж
         * байсан — ГЭТЭЛ энэ палитрт `--background` нь #e2e8ec буюу САААРАЛ
         * (`lib/section-bg.ts`-ийн тайлбарыг үз). Тиймээс "цагаан" гэж
         * төлөвлөсөн зурвас саарал болж, доорх капсулын нууртай нэгдэж
         * байв. Захиалагч: "Layer 1 буюу Хувь хэрэглэгч/Байгууллага гэдэг
         * нь ЦАГААН bg-тэй байх ёстой".
         */}
        <div className={cn(sectionBg.band, "hidden lg:block")}>
          <div className="mx-auto flex h-8 max-w-300 items-center justify-end px-4">
            <AudienceSwitchTabs
              segments={classifierSegments}
              activeId="personal"
              align="end"
              hover={false}
              triggerClassName={CLASSIFIER_TRIGGER}
            />
          </div>
        </div>

        {/**
         * Layer 2 — ХӨВӨГЧ КАПСУЛ: лого · ангиллын цэс · хэрэгслүүд
         * (2026-09-09, захиалагч: "desktop дээрх header-ийн design-г
         * screenshot-оор оруулсанс шиг болгоё, mobile дээр ашигласан
         * style-уудаа ашигла").
         *
         * ⚠️⚠️ ХЭМЖЭЭ БА ЭФФЕКТ нь ЗАХИАЛАГЧИЙН FIGMA-ИЙН СПЕКЭЭР
         * (2026-09-09-ны Properties панелийн screenshot). ТАМГА тус бүр:
         *
         *   Flow      Horizontal            → `flex`
         *   Width     Fill (1,216px)        → `max-w-300` (1200px) + `px-4`
         *   Height    Hug (96px)            → `h-24`
         *   Radius    100px                 → `rounded-[100px]`
         *   Justify   space-between         → `justify-between`
         *   Padding   12 / 24 / 12 / 24     → `px-6` (+ өндөр нь тогтмол тул
         *                                     босоо 12px нь `items-center`-ээр
         *                                     автоматаар тэнцэнэ)
         *   Fill · Shadow · Effects         → `.glass-lens` (globals.css)
         *
         * ⚠️⚠️ `.glass-capsule` → `.glass-lens` (2026-09-15, захиалагчийн
         * Figma "Glass" панелийн screenshot: Light −45°·80% · Refraction 80 ·
         * Depth 20 · Dispersion 50 · Frost 4 · Splay 0).
         *
         * ⚠️ МОБАЙЛЫН ХУВИЛБАР 1-ИЙН КАПСУЛ ч мөн ЭНЭ КЛАССЫГ хэрэглэнэ
         * (`mobile-header.tsx > CapsuleRow`) — тэр өдөр захиалагч хоёуланг
         * нь нэгтгэсэн. Хуучин `.glass-capsule` нь хэрэглэгчгүй үлдэж
         * УСТСАН. ⇒ Энд өнгө/сүүдэр сольвол МОБАЙЛ Ч ДАГАНА.
         *
         * ⚠️ ӨНГӨТЭЙ ИРМЭГ (Dispersion) ХАСАГДСАН — градиент хүрээ мэт
         * харагдаж, AI туслахын ногоон-ягаан хүрээтэй андуурагдаж байв.
         * Бүтэн тайлбар globals.css-д.
         *
         * ⚠️ `backdrop-blur-xl` ХАСАГДСАН — blur нь одоо `.glass-lens` дотор
         * (Frost 4 = 4px). Класс нь бие даасан болсон тул өөр газар тавихад
         * нэмэлт Tailwind класс шаардахгүй.
         *
         * ⚠️⚠️ FILL/SHADOW-ЫГ КЛАСС АВСАН (2026-09-10). Өмнө нь энд
         * `bg-black/[0.001]` + `shadow-[0_4px_12px_8px_…]` гэж Figma-гийн
         * тоонууд ШУУД бичигдсэн байв. Гэвч тэр гурав (0.1% fill, 5% хар
         * сүүдэр, background blur) нь ХОЁУЛАНГ НЬ БИШ, зөвхөн ЦАЙВАР темийг
         * бодсон байсан тул dark theme дээр капсул БҮРЭН АЛГА болдог байлаа
         * (захиалагчийн screenshot 2). `.glass-capsule` нь Figma-гийн drop
         * shadow-г хадгалаад дээр нь ирмэгийн ЦАЙВАР ТУСГАЛ нэмж, хоёр темд
         * тус тусдаа тохируулсан. Бүтэн тайлбар нь globals.css-д.
         *
         * ⚠️ `backdrop-blur-xl` нь ОДООГООР ҮР ДҮНГҮЙ (header нь `relative`) —
         * Figma спекийн бүрэлдэхүүн болж л үлдсэн. Шил нь одоо `.glass-capsule`
         * -ийн ирмэг/градиентээр гардаг тул blur асаагүй ч БҮРЭН харагдана.
         *
         * ⚠️⚠️ `backdrop-blur-xl` НЬ ОДООГООР ЯМАР Ч ҮР ДҮНГҮЙ — Figma спекийн
         * бүрэлдэхүүн болж л үлдсэн. Шалтгаан нь ЭНД БИШ, дээрх `<header>`
         * дээр: тэр нь `relative` (захиалагчийн 2026-09-10-ны шийдвэр) тул
         * капсулын ард юу ч гүйдэггүй. Бүтэн тайлбар ба асаах 4 нөхцөлийг
         * `<header>`-ийн тайлбараас үз.
         *
         * ⇒ Энэ мөрийг "blur ажиллахгүй байна" гэж БҮҮ ЗАС. Засвар нь энд биш.
         *
         * ⚠️ `h-16` (64px) → `h-24` (96px). Header-ийн бодит өндрийг
         * `HeaderHeightVar` ДИНАМИКААР хэмждэг тул hero-гийн `--header-h`
         * тооцоо өөрөө зөв дагана — тогтмол засах шаардлагагүй.
         */}
        <div className={cn(sectionBg.page, "hidden lg:block")}>
          <div className="mx-auto max-w-300 px-4 py-3">
            {/**
             * ⚠️⚠️ `flex justify-between` → `grid grid-cols-[1fr_auto_1fr]`
             * (2026-09-10, захиалагч: "mega menu-г голлуул гэсэн нь улаанаар
             * тэмдэглэсэн дээр голлуул гэсэн юм" + капсулын ЯГ ГОЛД зурсан
             * тэмдэг).
             *
             * ЯАГААД FLEX-ЭЭР БОЛОХГҮЙ ВЭ: өмнө нь лого · цэс · хэрэгсэл
             * гурав `justify-between`-ээр тарж, цэс нь `mr-auto`-той байсан
             * тул ЛОГОНЫ ЯГ ХАЖУУД наалддаг байв. Flex-ийн space-between нь
             * үлдсэн зайг ТЭНЦҮҮ тарааж чадах ч дунд элементийг капсулын ГОЛД
             * авчирдаггүй — учир нь лого (≈150px) ба хэрэгсэл (≈190px) хоёр
             * ӨӨР ӨРГӨНТЭЙ.
             *
             * `1fr auto 1fr` нь хажуугийн хоёр баганыг ХҮЧЭЭР тэнцүү болгодог
             * тул дунд багана нь агуулгынхаа өргөнөөс үл хамааран капсулын
             * ЖИНХЭНЭ голд суух баталгаатай. (Хувилбар 2-ын төв лого мөн
             * ЯГ ЭНЭ торыг хэрэглэдэг — шинэ хэв маяг нэмээгүй.)
             *
             * ⚠️ `justify-items` тавиагүй: лого нь 1-р баганын ЭХЭНД, хэрэгсэл
             * нь 3-рынхаа ТӨГСГӨЛД байх ёстой тул тэдгээр нь өөрсдийн
             * `justify-self`-ээ доор авна.
             */}
            <div className="glass-lens grid h-24 grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-[100px] px-6">
              {/**
               * ⚠️⚠️ `BrandLogoLink` (ЭКО ТЭМДЭГ) → `BrandLogo` (ҮГЭН ЛОГО)
               * (2026-09-10, захиалагч: "desktop хувилбар дээр Unitel
               * Univision-ий ТОМ лого-г ашигла").
               *
               * `BrandLogoLink` нь `eco-logo.png` / `univision-mark-mono.svg`
               * буюу дугуй ТЭМДЭГ — 96px өндөр капсулд хэт жижиг, брэндийн
               * нэр уншигдахгүй байв. `BrandLogo` нь `lib/brand.ts`-ийн
               * `BRAND_LOGO` -оос брэнд бүрийн ҮГЭН логог (light/dark хос)
               * авна — мобайлын капсул 2026-09-08-наас хойш ЭНИЙГ хэрэглэж
               * байсан ба одоо хоёр өргөн НЭГ логотой боллоо.
               *
               * `height={28}` — мобайлын 24-өөс арай том: капсул 64 → 96px
               * болсныг дагасан. Бодит өндөр нь `BRAND_LOGO[BRAND].scale`-аар
               * үржигдэнэ (Univision 1.2 тул түүнийх ~34px) — тэр scale нь
               * хоёр брэндийн логог ОПТИКООР тэнцүү харагдуулах зорилготой
               * тул энд брэнд шалгах ШААРДЛАГАГҮЙ.
               */}
              {/* 1-Р БАГАНА — лого нь баганынхаа ЗҮҮН ирмэгт (`justify-self`
                  -гүй бол `1fr` багана дүүрэн татагдана). */}
              <LogoHomeLink
                className="inline-flex items-center justify-self-start"
                aria-label="Нүүр"
              >
                <BrandLogo height={28} preload />
              </LogoHomeLink>

              {/* 2-Р БАГАНА — КАПСУЛЫН ГОЛ. `auto` тул цэсний бодит өргөнөөр
                  хумигдаж, хажуугийн хоёр `1fr` түүнийг голлуулна. */}
              <CategoryNav openMenu={openMenu} onOpen={openBrandMenu} onClose={closeBrandMenu} />

              {/* 3-Р БАГАНА — хэрэгслүүд баганынхаа БАРУУН ирмэгт. */}
              <div className="justify-self-end">
                <HeaderTools />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile — Хувилбар 1: ангиллын мөр + капсул (2 давхарга) */}
        <MobileBrandHeader variant={mobileVariant} />

        <MegaLayer
          panelBrand={panelBrand}
          shown={shown}
          direction={direction}
          onOpen={openBrandMenu}
          onClose={closeBrandMenu}
          onCloseNow={closeNow}
        />
      </header>
    </>
  );
}
