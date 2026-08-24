"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Layers, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { AudienceSwitchTabs } from "@/components/layout/audience-switch";
import { MobileBrandHeader } from "@/components/layout/mobile-header";
import {
  AccountMenu,
  BrandLogoLink,
  BrandMegaPanel,
  DOMAIN_NAV_NAME,
  IconButton,
  classifierSegments,
  useBrandMegaMenu,
  useCurrentNavName,
} from "@/components/layout/header-shared";
import { appleMegaMenus, appleNavCategories, type EcosystemLink } from "@/data/navigation";
import { useHeaderVariant, setHeaderVariant, type HeaderVariant } from "@/lib/header-variant";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

type Variant = HeaderVariant;

// ⚠️ Хувилбар 3 (mobile-ын доод tab bar) ба 4 (chat нүүр) нь ХАСАГДСАН —
// код нь бүрэн устсан. localStorage-д тэр утга үлдсэн бол `useHeaderVariant`
// 1 рүү унагана (`lib/header-variant.ts`).
const VARIANTS: { id: Variant; label: string }[] = [
  { id: 1, label: "Хувилбар 1 · Only L1" },
  { id: 2, label: "Хувилбар 2 · L1 & L2" },
];

/** Хоёр хувилбарын ХУВААЛЦАХ зүүн талын ангилал (Layer 2) */
const NAV_ITEMS: EcosystemLink[] = appleNavCategories;

/**
 * Ангиллын ДАРААЛАЛ — `useBrandMegaMenu` нь панел хооронд шилжихэд агуулгыг
 * аль чиглэлд гулсуулахыг эндээс тооцно (баруун тийшх ангилал → баруунаас).
 */
const NAV_ORDER = NAV_ITEMS.map((item) => item.name);

/**
 * Баруун талын хэрэгслүүд — хоёр хувилбарт ИЖИЛ: профайл · хэл · theme.
 *
 * Анхаар: "Хэл солих" нь ОДООГООР зөвхөн харагдах тал. Проектод i18n
 * давхарга байхгүй (`layout.tsx` дээр `lang="mn"` тогтмол, бүх data монгол)
 * тул дарахад сольж болох зүйл байхгүй. i18n нэмэгдмэгц MN/EN сонголттой
 * dropdown болгоно. `header-archive.tsx`-д ч ижил placeholder байсан.
 */
function HeaderTools() {
  return (
    <div className="flex items-center gap-0.5">
      <AccountMenu />
      <IconButton label="Хэл солих">
        <Globe className="size-5" />
      </IconButton>
      <ThemeToggle />
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const variant = useHeaderVariant();

  // /web4 — immersive presentation хуудас: header харуулахгүй
  if (pathname?.startsWith("/web4")) return null;

  return (
    <>
      <VariantToggle variant={variant} onChange={setHeaderVariant} />
      {variant === 2 ? <TopClassifierHeader /> : <LogoLeftHeader />}
    </>
  );
}

/**
 * Хувилбар сонгох toggle — дэлгэцийн дээд талд. Зөв хувилбараа шийдсэний дараа
 * энэ toggle-ийг устгана.
 *
 * Энэ layer-ийг БҮХЭЛД НЬ хааж болно (X товч) — stakeholder-т үзүүлэхэд дэлгэц
 * цэвэрхэн харагдана. Хаагдсан үед зөвхөн баруун дээд булангийн үл мэдэгдэх
 * button үлдэнэ: hover хийхэд л гарч ирнэ, дарахад bar буцаж задарна.
 */
function VariantToggle({
  variant,
  onChange,
}: {
  variant: Variant;
  onChange: (v: Variant) => void;
}) {
  const [open, setOpen] = useState(false);
  // Анхнаасаа ХААЛТТАЙ — танилцуулгад дэлгэц цэвэрхэн байна. Нээх бол баруун
  // дээд булан руу hover хийж бариулыг гаргана.
  const [barOpen, setBarOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Архивласан хувилбар localStorage-д үлдсэн байвал Хувилбар 1 гэж үзнэ
  const current = VARIANTS.find((v) => v.id === variant) ?? VARIANTS[0];

  // хүрээнээс гадна дарахад хаагдана
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!barOpen) {
    return (
      <button
        type="button"
        onClick={() => setBarOpen(true)}
        aria-label="Хувилбар сонгох мөрийг нээх"
        className="bg-foreground text-background focus-visible:ring-foreground/40 fixed top-0 right-0 z-80 inline-flex size-6 items-center justify-center rounded-bl-lg opacity-0 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
      >
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Header хувилбар сонгох"
      className="bg-foreground text-background flex items-center justify-end gap-1 px-4 py-1.5 text-xs"
    >
      {/* Баруун талын жижиг товч — дарахад dropdown нээгдэж/хаагдана */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Header хувилбар сонгох"
          className="bg-background/15 hover:bg-background/25 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 font-semibold transition-colors"
        >
          <Layers className="size-3.5" aria-hidden="true" />
          {current.label}
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            role="menu"
            className="border-background/15 bg-foreground animate-in fade-in slide-in-from-top-1 absolute top-full right-0 z-70 mt-1.5 flex min-w-52 flex-col gap-0.5 rounded-xl border p-1.5 shadow-2xl duration-150"
          >
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="menuitemradio"
                aria-checked={variant === v.id}
                onClick={() => {
                  onChange(v.id);
                  setOpen(false);
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-left whitespace-nowrap transition-colors",
                  variant === v.id
                    ? "bg-background text-foreground font-semibold"
                    : "text-background/80 hover:bg-background/15",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setBarOpen(false);
        }}
        aria-label="Хувилбар сонгох мөрийг хаах"
        className="hover:bg-background/20 focus-visible:ring-background/40 inline-flex size-5 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
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

  return (
    <nav aria-label="Үндсэн цэс" className="flex items-center gap-5">
      {NAV_ITEMS.map((item) => {
        const highlighted = !item.external && item.name === highlightedName;
        const isCurrentPage = !item.external && item.name === currentName;
        const label = item.name;
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
        );

        // appleMegaMenus-д бичлэгтэй ангилал — hover дээр панел задарна
        const menu = !item.external ? appleMegaMenus[item.name] : undefined;
        if (menu) {
          return (
            <div
              key={item.name}
              className="flex items-center"
              onMouseEnter={() => onOpen(item.name)}
              onMouseLeave={onClose}
            >
              <Link
                href={item.href}
                aria-current={isCurrentPage ? "page" : undefined}
                aria-expanded={openMenu === item.name}
                className={linkClass}
              >
                {label}
              </Link>
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
      onMouseEnter={() => onOpen(panelBrand)}
      onMouseLeave={onClose}
      className={cn(
        "border-border bg-popover text-popover-foreground absolute inset-x-0 top-full z-50 hidden overflow-hidden border-t shadow-xl lg:block",
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
// ХУВИЛБАР 1 — ЛОГО ЗҮҮН ТАЛД
//   Layer 1: ангилагч БАРУУН талд (header-ийн баруун ирмэгт шахсан)
//   Layer 2: [ЛОГО] → араас нь ангиллын mega menu … баруунд хэрэгслүүд
//
//   ┌────────────────────────────────────────────────────────────┐
//   │                          Хувь хэрэглэгч ▾  Байгууллага ↗   │ L1
//   ├────────────────────────────────────────────────────────────┤
//   │ [ЛОГО] Unitel Univision Дэлгүүр …          👤  🌐  ☀       │ L2
//   └────────────────────────────────────────────────────────────┘
// =====================================================================
function LogoLeftHeader() {
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

      <header className="bg-background border-border relative top-0 z-50 border-b" role="banner">
        {/* Layer 1 — ангилагч header-ийн БАРУУН ирмэгт шахсан (зөвхөн desktop) */}
        <div className="bg-muted/40 border-border hidden border-b lg:block">
          <div className="mx-auto flex h-8 max-w-300 items-center justify-end px-4">
            <AudienceSwitchTabs
              segments={classifierSegments}
              activeId="personal"
              align="end"
              hover={false}
              triggerClassName={navType.bar}
            />
          </div>
        </div>

        {/* Layer 2 — лого ЗҮҮН ирмэгт шахаад, араас нь ангиллын mega menu.
            `mr-auto` нь хэрэгслүүдийг баруун ирмэг рүү түлхэнэ. */}
        <div className="mx-auto hidden h-11 max-w-300 items-center gap-6 px-4 lg:flex">
          <BrandLogoLink />

          <div className="mr-auto">
            <CategoryNav openMenu={openMenu} onOpen={openBrandMenu} onClose={closeBrandMenu} />
          </div>

          <HeaderTools />
        </div>

        {/* Mobile — Хувилбар 1: таб төвд */}
        <MobileBrandHeader variant={1} />

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

// =====================================================================
// ХУВИЛБАР 2 — ЛОГО ТӨВД
//   Layer 1: ангилагч ЗҮҮН талд (header-ийн зүүн ирмэгт шахсан)
//   Layer 2: зүүн ангиллын mega menu · төв лого · баруун хэрэгслүүд
//
//   ┌────────────────────────────────────────────────────────────┐
//   │ Хувь хэрэглэгч ▾  Байгууллага ↗                            │ L1
//   ├────────────────────────────────────────────────────────────┤
//   │ Unitel Univision Дэлгүүр …   [ЛОГО]        👤  🌐  ☀       │ L2
//   └────────────────────────────────────────────────────────────┘
// =====================================================================
function TopClassifierHeader() {
  const { openMenu, panelBrand, shown, direction, openBrandMenu, closeBrandMenu, closeNow } =
    useBrandMegaMenu(NAV_ORDER);

  return (
    <>
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

      <header className="bg-background border-border relative top-0 z-50 border-b" role="banner">
        {/* Layer 1 — ангилагч header-ийн ЗҮҮН ирмэгт шахсан (зөвхөн desktop).
            `align="start"` — hover панел ч зүүн ирмэгээр зэрэгцэнэ. */}
        <div className="bg-muted/40 border-border hidden border-b lg:block">
          <div className="mx-auto flex h-8 max-w-300 items-center justify-start px-4">
            <AudienceSwitchTabs
              segments={classifierSegments}
              activeId="personal"
              align="start"
              hover={false}
              triggerClassName={navType.bar}
            />
          </div>
        </div>

        {/* Үндсэн мөр — зүүн ангилал · төв лого · баруун icons */}
        <div className="mx-auto hidden h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
          <CategoryNav openMenu={openMenu} onOpen={openBrandMenu} onClose={closeBrandMenu} />

          <div className="flex justify-center">
            <BrandLogoLink />
          </div>

          <div className="flex items-center justify-end">
            <HeaderTools />
          </div>
        </div>

        {/* Mobile — Хувилбар 2: header дээр таб байхгүй, бүх цэс burger дотор */}
        <MobileBrandHeader variant={2} />

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
