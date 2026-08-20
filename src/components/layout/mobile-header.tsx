"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  ArrowUpRight,
  BotMessageSquare,
  Gift,
  Globe,
  LogOut,
  Menu,
  MonitorPlay,
  Moon,
  ShoppingBag,
  Smartphone,
  Sun,
  Tv,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/components/auth/auth-provider";
import { SmartLink } from "@/components/layout/smart-link";
import { BrandLogoLink, classifierSegments } from "@/components/layout/header-shared";
import {
  appleNavCategories,
  mobileMegaMenus,
  type EcosystemLink,
  type MegaMenu,
  type MegaMenuSection,
} from "@/data/navigation";
import { BRAND } from "@/lib/brand";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MOBILE HEADER — 3 хувилбар (desktop-ийн хувилбартай хамт солигдоно)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ХУВИЛБАР 1 — таб төвд, Layer 2-ын БҮХ 5 ангилал
 *   ┌────────────────────────────────────────────────────┐
 *   │ (◉) Unitel Univision Дэлгүүр Урамшуулал LookTV  ☰ │
 *   └────────────────────────────────────────────────────┘
 *   Таб дарахад дэд цэс задарна — `NavigationMenu`-ийн НЭГ хуваалцах Viewport
 *   дотор. Дэд цэсгүй ангилал (Урамшуулал) нь ШУУД /campaigns руу шилжинэ.
 *
 *   ДЭД ЦЭС: дэлгэцийн БҮТЭН өргөн, header-ийн доод ирмэгээс зайгүй. Хуудас нь
 *   scrim-ээр бүдгэрнэ (`backdrop-blur`). Таб хооронд сольвол суурь хаагдахгүй,
 *   өндрөө зөөлөн тааруулж агуулга нь хажуугаас гулсаж орж ирнэ.
 *
 *   5 нь нэг мөрөнд багтахын тулд: текст 12px (`navType.mobileTab`),
 *   pill padding px-0.5, табын gap-1, hit area нь мөрийн бүтэн өндөр (48px).
 *   Агуулга 284px / боломжтой зай 286px (375px дэлгэц). Түүнээс нарийн бол
 *   хэвтээ гүйлгэнэ — mask нь гүйлгэх боломжийг ирмэг бүдгэрүүлж харуулна.
 *
 *   Burger-т ангилал ҮЛДЭХГҮЙ — зөвхөн Байгууллага + тохиргоо.
 *
 * ХУВИЛБАР 2 — бүх цэс burger дотор
 *   ┌──────────────────────────────────────┐
 *   │ (◉)                               ☰ │
 *   └──────────────────────────────────────┘
 *   Header дээр таб байхгүй. Desktop-ийн mega menu БҮГД burger дотор
 *   dropdown (accordion)-оор задарна.
 *
 * ХУВИЛБАР 3 — доод tab bar (ЗӨВХӨН mobile; desktop нь Хувилбар 1-тэй ижил)
 *   ┌──────────────────────────────────────┐
 *   │ (◉)                               ☰ │  header
 *   └──────────────────────────────────────┘
 *                      ╭────╮
 *   ┌────────────────│ 🤖 │────────────────┐  sticky доод bar
 *   │  📱      📺    ╰────╯    🛍      👤  │
 *   │ Unitel Univision Chat Дэлгүүр Профайл│
 *   └──────────────────────────────────────┘
 *   Доод bar нь `fixed bottom-0 z-50` — контентын хамгийн наана. Ангилал
 *   дарахад ДЭД ЦЭС нээгдэхгүй, ШУУД тухайн хуудас руу шилжинэ; дэд цэсэнд
 *   burger-ээс хүрнэ (Хувилбар 3-ын burger нь Хувилбар 2-той ижил — бүх
 *   ангилал accordion-оор). Chat нь ГОЛД, брэнд өнгөт өргөгдсөн дугуйгаар
 *   бусдаасаа ялгарна; навигацын хэсэг болсон тул хөвөгч chat товч
 *   нуугдана (globals.css).
 *
 * ОДОО БАЙГАА ДОМЭЙН (build-ийн брэнд) тодорсон байна — БҮХ хувилбарт ИЖИЛ
 * хэлбэрээр: `text-foreground` + зузаан үсэг (light-д хар, dark-д цагаан).
 * Брэнд ногоон (`text-primary`) байхаа больсон — desktop-ийн `CategoryNav`
 * ч хараар тодруулдаг тул давхаргууд хооронд зөрөх шалтгаан байхгүй.
 * Ногоон нь одоо ЗӨВХӨН CTA / promo / Chat-ын дугуйд үлдсэн.
 */

export type MobileVariant = 1 | 2 | 3;

/**
 * Хувилбар 1-ийн header дээрх табууд — Layer 2-ын БҮХ 5 ангилал.
 *
 * Өмнө нь зөвхөн 3 (Unitel · Univision · Дэлгүүр) байсан бөгөөд Урамшуулал нь
 * burger-т унадаг байв. Одоо 5 нь бүгд header-т — тиймээс `BURGER_CATEGORIES[1]`
 * хоосон болж, Хувилбар 1-ийн burger нь зөвхөн Байгууллага + тохиргоо болно.
 *
 * ⚠️ Дараалал `appleNavCategories`-аас өвлөгддөг (доорх `TABS` нь тэрийг
 * шүүдэг), энэ массивын дараалал НӨЛӨӨЛӨХГҮЙ — зөвхөн гишүүнчлэлийг шийднэ.
 */
const TAB_NAMES = ["Unitel", "Univision", "Дэлгүүр", "Урамшуулал", "LookTV"] as const;
type TabName = (typeof TAB_NAMES)[number];

const isTab = (name: string): name is TabName => TAB_NAMES.includes(name as TabName);

const TABS = appleNavCategories.filter((c): c is EcosystemLink & { name: TabName } =>
  isTab(c.name),
);

/**
 * ОДОО БАЙГАА ДОМЭЙН — build-ийн брэнд (`NEXT_PUBLIC_BRAND`). Unitel build дээр
 * "Unitel", Univision build дээр "Univision" нь ХАРААР (`text-foreground`) +
 * зузаан үсгээр тодорно тул хэрэглэгч аль домэйн дээрээ байгаагаа цэс
 * нээхгүйгээр харна. "Дэлгүүр" нь домэйн биш тул хэзээ ч тодрохгүй.
 */
const DOMAIN_TAB: TabName = BRAND === "univision" ? "Univision" : "Unitel";

/**
 * Burger дотор ямар ангилал харуулах вэ.
 *   Хувилбар 1 — табанд ОРООГҮЙ нь. `TAB_NAMES` нь 5 ангилал БҮГДИЙГ агуулдаг
 *     болсон тул энэ нь одоо ХООСОН — burger-т зөвхөн Байгууллага + тохиргоо
 *     үлдэнэ. (Ангиллын дэд цэсэнд header-ийн таб dropdown-оос хүрнэ.)
 *   Хувилбар 2 · 3 — БҮГД. Хувилбар 3-ын доод bar нь дэд цэс нээхгүй, шууд
 *     хуудас руу шилжүүлдэг тул дэд цэсэнд хүрэх ганц зам нь burger болно.
 */
const BURGER_CATEGORIES: Record<MobileVariant, EcosystemLink[]> = {
  1: appleNavCategories.filter((c) => !isTab(c.name)),
  2: appleNavCategories,
  3: appleNavCategories,
};

/** Байгууллага — дэд цэсгүй, дарвал ШУУД Nexmind руу (`classifierSegments`). */
const BUSINESS = classifierSegments.find((s) => s.id === "business");

/**
 * Доод tab bar-ын ангилал бүрийн icon (Хувилбар 3).
 *
 * `TabName` нь 5 болсон тул бүгдэд бичлэг шаардлагатай (TS). Гэхдээ доод bar нь
 * `BOTTOM_LEFT`/`BOTTOM_RIGHT`-аар зөвхөн Unitel · Univision · Дэлгүүр-ийг
 * авдаг тул Урамшуулал/LookTV-ийн icon одоогоор ЗӨВХӨН нөөц — доод bar-ын
 * бүтэц (5 slot: 2 + Chat + 1 + Профайл) өөрчлөгдөөгүй.
 */
const TAB_ICONS: Record<TabName, typeof Smartphone> = {
  Unitel: Smartphone,
  Univision: Tv,
  Дэлгүүр: ShoppingBag,
  Урамшуулал: Gift,
  LookTV: MonitorPlay,
};

/**
 * Доод bar-ын ДАРААЛАЛ:
 *   Unitel · Univision · [Chat] · Дэлгүүр · Профайл
 * Chat нь ГОЛД, брэнд өнгөт өргөгдсөн дугуйгаар бусдаасаа ялгарна.
 */
const BOTTOM_LEFT = TABS.filter((t) => t.name === "Unitel" || t.name === "Univision");
const BOTTOM_RIGHT = TABS.filter((t) => t.name === "Дэлгүүр");

// =====================================================================
// ROUTER — хувилбараар салгана
// =====================================================================
export function MobileBrandHeader({ variant }: { variant: MobileVariant }) {
  if (variant === 1) return <BrandTabsHeader />;

  if (variant === 2) return <HeaderRow variant={2} />;

  return (
    <>
      <HeaderRow variant={3} />
      <BottomTabBar />
    </>
  );
}

/**
 * ХУВИЛБАР 1 — 5 таб + дэд цэс.
 *
 * `DropdownMenu`-гээс `NavigationMenu`-руу ШИЛЖҮҮЛСЭН. Шалтгаан: DropdownMenu-д
 * таб бүр ӨӨРИЙН menu instance-тай тул Unitel → Univision дарахад нэг нь
 * хаагдаж нөгөө нь нээгддэг — "поп-поп". NavigationMenu-ийн `Viewport` нь
 * НЭГ хуваалцах суурь бөгөөд:
 *   - өндөр нь `--radix-navigation-menu-viewport-height`-ээр зөөлөн тэнийнэ
 *   - агуулга нь `data-motion`-оор хажуугаас гулсаж орж ирнэ
 *
 * ЗАЙЛШГҮЙ БҮТЭЦ:
 *   1. `overflow-x-auto` нь ЗӨВХӨН List-ийг ороосон div-д. Viewport нь түүний
 *      ГАДНА sibling — эс бөгөөс хайчлагдана.
 *   2. `NavigationMenu` Root-д `relative` БАЙХГҮЙ. Ингэснээр Viewport-ийн
 *      `absolute top-full left-0 right-0` нь `<header className="relative">`
 *      -ээс тооцогдож ДЭЛГЭЦИЙН БҮТЭН ӨРГӨНӨӨР зурагдана (дунд баганын
 *      278px-ээр биш).
 */
function BrandTabsHeader() {
  // Controlled — нээлттэй эсэхийг мэдэж scrim (page blur)-ыг харуулна
  const [openValue, setOpenValue] = useState("");
  const isOpen = openValue !== "";

  return (
    <>
      {/* PAGE BLUR — desktop-ийн scrim-тэй ижил (`header.tsx`). Дарвал хаагдана.
          `z-40` — header (z-50)-ийн доор, хуудасны агуулгын дээр. */}
      <div
        aria-hidden
        onClick={() => setOpenValue("")}
        className={cn(
          "bg-foreground/10 fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <HeaderRow variant={1}>
        <NavigationMenu
          value={openValue}
          onValueChange={setOpenValue}
          // `flex-1 items-center justify-start` нь Root-ийн default — өндрөө
          // мөрөөр дүүргэхийн тулд `h-full`, төвлөрүүлэхийн тулд `justify-center`
          className="h-full w-full justify-center"
          // Viewport — header-тэй НИЙЛСЭН: дугуйрал/хүрээ байхгүй.
          // `border-t` тавихгүй — `<header>` өөрөө `border-b`-тэй тул давхар
          // 2px зураас гарна. `shadow-lg` нь хуудсаас салгаж өгнө.
          viewportClassName="rounded-none shadow-lg ring-0"
        >
          {/* MASK нь ГҮЙЛГЭХ БОЛОМЖИЙН ТЭМДЭГ: `no-scrollbar` нь scrollbar-ыг
              нуудаг тул 320px зэрэг нарийн дэлгэцэнд "гүйлгэж болно" гэдэг нь
              харагдахгүй байв. Багтаж байх үед `mx-auto` нь агуулгыг
              төвлүүлдэг тул бүдгэрэх 10px нь ХООСОН зай дээр буудаг. */}
          <div className="no-scrollbar h-full w-full overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)]">
            {/* `h-12` нь ТОДОРХОЙ өндөр — `h-full` БОЛОХГҮЙ. Radix нь энэ List
                ба гаднах scroller хооронд ӨӨРИЙН div үүсгэдэг бөгөөд тэр div-д
                өндөр байхгүй тул `height: 100%`-ийн гинж тасарч, табын hit area
                48px-ээс 30px хүртэл унадаг. `h-12` нь мөрний өндөртэй (`h-12`)
                тэнцүү — эндээс доош `h-full` дахин зөв ажиллана. */}
            <NavigationMenuList className="mx-auto h-12 w-max gap-1">
              {TABS.map((tab) => (
                <BrandTab key={tab.name} tab={tab} />
              ))}
            </NavigationMenuList>
          </div>
        </NavigationMenu>
      </HeaderRow>
    </>
  );
}

/**
 * Header-ийн мөр — гурван хувилбарт ижил хэлбэр: лого ЗҮҮН, burger БАРУУН.
 * Хувилбар 1-д дунд нь табууд орно; 2 ба 3-д дунд хоосон.
 */
function HeaderRow({ variant, children }: { variant: MobileVariant; children?: React.ReactNode }) {
  return (
    <div className="lg:hidden">
      {/* GRID → FLEX болгов.
          Өмнө `grid-cols-[1fr_minmax(0,auto)_1fr]` байсан нь табуудыг дэлгэцийн
          ҮНЭН ТӨВД суулгадаг ч талын хоёр багана ХАМГИЙН ӨРГӨН агуулгаараа
          (burger 36px) тэнцдэг тул дунд руу 271px-ээс их зай гардаггүй байв.
          5 таб нь 11px-ээр ~254px тул тэр хязгаар хэтэрхий шахуу байна.

          Flex-д лого (29px) ба burger (36px) зөвхөн өөрсдийн өргөнийг эзэлж,
          дунд нь `flex-1` — 375px дэлгэц дээр 278px, 360px дээр 263px болж
          ~15px нөөц гарна. Табууд `mx-auto`-гоор дундаа хэвээр төвлөрөх ба
          лого/burger-ийн 7px зөрүүгээр л оптик төвөөс хазайна (үл ялиг). */}
      {/* `px-2.5` + `gap-0.5` — табуудад зай гаргахын тулд мөрний гадна ирмэг ба
          лого/burger-ийн хоорондын зайнаас 8px "зээлсэн" (px-3 → px-2.5 нь
          4px, gap-1 → gap-0.5 нь 4px). Ирмэгийн 10px зай mobile-д хэвийн. */}
      <div className="mx-auto flex h-12 max-w-300 items-center gap-0.5 px-2.5">
        <div className="flex shrink-0 justify-start">
          <BrandLogoLink />
        </div>

        {/* `h-full` ЗААВАЛ — дотор нь табын hit area нь `h-full`-ээр 48px болдог.
            Энэ багана өндөргүй бол тэр гинж тасарч, hit area нь текстийн
            өндөр (29px) хүртэл хумигдана (44px-ийн шаардлага биелэхгүй). */}
        <div className="h-full min-w-0 flex-1">{children}</div>

        <div className="flex shrink-0 items-center justify-end">
          <MobileMenuSheet variant={variant} />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// ХУВИЛБАР 1 — header дээрх брэнд таб + dropdown
// =====================================================================

/**
 * Хоёр ТУСДАА тэмдэг зэрэг харагдаж болно:
 *   - хар + зузаан үсэг = одоо байгаа домэйн (тогтмол)
 *   - өргөгдсөн pill    = dropdown нээлттэй (`data-[state=open]`)
 * Нээхэд ҮСГИЙН ЗУЗААН СОЛИГДОХГҮЙ — эс бөгөөс таб өргөсөж, хажуугийн
 * табууд хажуу тийш "цүүрнэ".
 */
function BrandTab({ tab }: { tab: EcosystemLink & { name: TabName } }) {
  const isDomain = tab.name === DOMAIN_TAB;
  const sections = mobileMegaMenus[tab.name]?.sections ?? [];

  /**
   * ХҮРЭХ ТАЛБАЙ ба ХАРАГДАХ PILL-ийг САЛГАВ.
   *
   * Өмнө pill өөрөө trigger байсан тул хүрэх талбай 34px — iOS/WCAG-ийн 44px
   * шаардлагаас доогуур байв. Одоо trigger нь мөрийн БҮТЭН өндөр (`h-full` =
   * 48px), pill нь дотор `<span>`. Нүдэнд ижил нягт, хуруунд 48px.
   */
  const hitClass = "group/tab flex h-full shrink-0 items-center outline-none";

  /**
   * ӨРГӨН ба ЗАЙ.
   *
   * Табууд хоорондоо "зодолдож" харагдахгүйн тулд хооронд нь зай хэрэгтэй.
   * Зайг хаанаас гаргах нь ӨРГӨНИЙ ӨРТӨГТ нөлөөлнө:
   *   padding-аас → 5 таб × 2 тал = зайн 5 дахин өртөг
   *   gap-аас     → 4 зай        = зайн 4 дахин өртөг  ← ХЯМД
   * Тиймээс pill-д ЗӨВХӨН өөрт хэрэгтэй padding (px-0.5) үлдээж, харагдах зайг
   * `gap-1`-ээр өгсөн. Хоёр табын үсэг хооронд 2+4+2 = 8px зай гарна.
   *
   * ⚠️ ЯАГААД 8px, 12px БИШ ГЭЖ: 375px дэлгэцэнд боломжтой зай 286px, 5 табын
   * үсэг 248px. Үлдэх 38px-ийг padding+gap-д хуваана. 8px зай = 284px (багтана),
   * 12px зай = 304px (412px-ээс доош ГҮЙЛГЭНЭ). Хамгийн урт нэр "Урамшуулал"
   * (72px) богиносвол 12px зай ч багтана.
   *
   * `border → ring` — ring нь layout-д өргөн НЭМДЭГГҮЙ (таб бүрт 2px хэмнэнэ).
   *
   * ТОДОТГОЛ — идэвхтэй/одоогийн домэйны таб нь БРЭНД НОГООН БИШ, `text-foreground`
   * (light-д хар, dark-д цагаан) + `font-bold`. Ингэснээр desktop-ийн
   * `CategoryNav` (`header.tsx`) болон Хувилбар 3-ын доод bar-тай ИЖИЛ болно —
   * бүх давхарга дээр "би хаана байна" гэдэг нь нэг л хэлбэрээр илэрхийлэгдэнэ.
   */
  const pillClass = cn(
    "rounded-full px-0.5 py-1.5 whitespace-nowrap transition-colors",
    "group-data-[state=open]/tab:bg-background group-data-[state=open]/tab:ring-border group-data-[state=open]/tab:shadow-sm group-data-[state=open]/tab:ring-1",
    isDomain
      ? cn(navType.mobileTabActive, "text-foreground")
      : cn(
          navType.mobileTab,
          "text-foreground/75 group-hover/tab:text-foreground group-data-[state=open]/tab:text-foreground",
        ),
  );

  const label = (
    <span className={pillClass}>
      <TabLabel name={tab.name} isDomain={isDomain} />
    </span>
  );

  // Дэд цэсгүй ангилал (Урамшуулал) — цэс нээхгүй, ШУУД тухайн хуудас руу
  if (sections.length === 0) {
    return (
      <NavigationMenuItem className="h-full">
        <NavigationMenuLink asChild className={cn(hitClass, "p-0 hover:bg-transparent")}>
          <Link href={tab.href}>{label}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem value={tab.name} className="h-full">
      {/* `unstyled` — `navigationMenuTriggerStyle()` нь `h-9 px-4 text-sm` тул
          12px / px-0.5-тай табтай зөрчилддөг.
          `chevron={false}` — 5 chevron нь ~60px өргөн авах ба тэр нь 375px-ийн
          нөөцийг (2px) бүрэн залгина. */}
      <NavigationMenuTrigger unstyled chevron={false} className={hitClass}>
        {label}
      </NavigationMenuTrigger>
      <SectionMenu menu={mobileMegaMenus[tab.name]} />
    </NavigationMenuItem>
  );
}

function TabLabel({ name, isDomain }: { name: string; isDomain: boolean }) {
  return (
    <>
      {name}
      {isDomain && <span className="sr-only"> (одоо байгаа домэйн)</span>}
    </>
  );
}

/**
 * Ангиллын дэд цэс — dropdown агуулга (Хувилбар 1). ЗӨВХӨН MOBILE.
 * Desktop-ийн mega menu (`BrandMegaPanel`) эндээс ТУСДАА бөгөөд зэрэгцээ явна.
 *
 * ӨРГӨН: дэлгэцийн БҮТЭН өргөн, header-ийн доод ирмэгээс зайгүй — дэд цэс нь
 * header-ийн үргэлжлэл мэт харагдана. Үүнийг `NavigationMenuViewport`-ийн
 * wrapper (`absolute top-full left-0 right-0`) хангана.
 *
 * БҮТЭЦ — desktop-ийн панелтай ижил хоёр хэсэг, гэхдээ mobile-д хажуу
 * зэрэгцүүлэх өргөн байхгүй тул ДООШ өрөв:
 *   1. `sections` — үндсэн ангилал, НЭГ багана. Тодорсон мөр нь ХАР pill.
 *   2. `extras`   — "Нэмэлт" гарчигтай туслах блок (desktop-ийн 2-р багана)
 *   3. promo teaser
 *
 * ⚠️ Өмнө 2 баганат grid + мөр хоорондын зураас байсан. Одоо нэг багана,
 * зураасгүй — тодотгол нь зураас биш, ДЭВСГЭР (pill) болсон тул зураас нь
 * pill-тэй зөрчилдөж байв.
 */
function SectionMenu({ menu }: { menu?: MegaMenu }) {
  if (!menu) return null;
  const extras = menu.extras;

  return (
    // `w-full p-3` — Content нь Viewport-ийн дотор бүтэн өргөнөөр суудаг.
    // Хажуугийн гулсалтыг Radix `data-motion`-оор өөрөө хийнэ (ui компонентод).
    <NavigationMenuContent className="w-full p-3">
      <div className="mx-auto flex max-w-300 flex-col gap-0.5">
        {/* ХУРДАН ҮЙЛДЭЛ — ГАРЧИГГҮЙ дээд мөр, хүрээтэй pill.
            Desktop-той ижил: ангиллын жагсаалтыг тойрч шууд үйлдэл. */}
        {menu.quickActions && menu.quickActions.length > 0 && (
          <div className="border-border mb-1.5 flex flex-wrap gap-2 border-b px-1 pb-3">
            {menu.quickActions.map((action) => (
              <QuickActionChip key={action.id} section={action} />
            ))}
          </div>
        )}

        {menu.sections.map((section) => (
          <SectionRow key={section.id} section={section} />
        ))}

        {extras && extras.length > 0 && (
          <div className="border-border mt-2.5 border-t pt-2.5">
            <p className={cn(navType.groupLabel, "mb-1 px-3")}>{menu.extrasLabel ?? "Нэмэлт"}</p>
            <div className="flex flex-col gap-0.5">
              {extras.map((item) => (
                <SectionRow key={item.id} section={item} secondary />
              ))}
            </div>
          </div>
        )}

        <MenuPromoTeaser />
      </div>
    </NavigationMenuContent>
  );
}

/** Хурдан үйлдлийн chip — хүрээтэй, дарахад дүүрнэ (desktop-той ижил хэлбэр). */
function QuickActionChip({ section }: { section: MegaMenuSection }) {
  // `min-h-11` = 44px — эдгээр нь ДАРАГДАХ үйлдэл тул хүрэх талбайн доод
  // хязгаарыг мөрдөнө (padding-аар 36px л болж байсан).
  const cls = cn(
    navType.mobileTab,
    "border-border text-foreground inline-flex min-h-11 items-center rounded-full border px-4 transition-colors",
    "hover:bg-foreground! hover:text-background! hover:border-foreground",
    "focus-visible:bg-foreground! focus-visible:text-background! focus-visible:ring-0",
  );

  return section.href.startsWith("http") ? (
    <NavigationMenuLink asChild className={cls}>
      <a href={section.href} target="_blank" rel="noopener noreferrer">
        {section.title}
      </a>
    </NavigationMenuLink>
  ) : (
    <NavigationMenuLink asChild className={cls}>
      <Link href={section.href}>{section.title}</Link>
    </NavigationMenuLink>
  );
}

/**
 * Дэд цэсний нэг мөр. Тодорсон үед ХАР pill + цагаан текст — desktop-ийн mega
 * панелтай ИЖИЛ хэлбэр.
 *
 * `NavigationMenuLink` нь baseline-даа `rounded-md p-2 text-sm hover:bg-muted
 * focus:bg-muted` -тай тул тэднийг дарж бичих шаардлагатай: хэмжээ/padding-ыг
 * дараа нь тавьж, дэвсгэрийг `!`-ээр албадав.
 */
function SectionRow({
  section,
  secondary = false,
}: {
  section: MegaMenuSection;
  secondary?: boolean;
}) {
  const external = section.href.startsWith("http");

  const rowCls = cn(
    secondary ? navType.secondaryLink : navType.mobileLink,
    "group/row flex items-center justify-between gap-2 rounded-full px-3 py-2.5",
    secondary ? "text-foreground/70" : "text-foreground",
    "hover:bg-foreground! hover:text-background! hover:**:text-background!",
    "focus-visible:bg-foreground! focus-visible:text-background! focus-visible:**:text-background! focus-visible:ring-0",
  );

  // Сум нь ЗӨВХӨН гадаад линкэд — тэр нь "сайтаас гарна" гэсэн ХЭРЭГТЭЙ мэдээлэл.
  // Дотоод мөрний `ArrowRight`-ыг хассан: pill өөрөө дарагдахыг илэрхийлдэг тул
  // мөр бүрт сум байх нь шуугиан болж, screenshot-ийн цэвэр хэлбэртэй зөрж байв.
  const arrowCls =
    "size-3.5 shrink-0 opacity-60 transition-transform duration-300 ease-out group-hover/row:translate-x-0.5";

  return (
    <NavigationMenuLink asChild className={rowCls}>
      {external ? (
        <a href={section.href} target="_blank" rel="noopener noreferrer">
          <span className="min-w-0">{section.title.trim()}</span>
          <ArrowUpRight className={arrowCls} aria-hidden="true" />
        </a>
      ) : (
        <Link href={section.href}>
          <span className="min-w-0">{section.title.trim()}</span>
        </Link>
      )}
    </NavigationMenuLink>
  );
}

/**
 * Дэд цэсний ЁРООЛ — тухайн ангилалтай холбоотой урамшуулал энд суух блок.
 * Одоогоор SAMPLE: жинхэнэ урамшуулал холбогдох үед энэ текст/CTA-г тухайн
 * ангиллын promo data-гаар солино.
 */
function MenuPromoTeaser() {
  return (
    <div className="border-border mt-2 border-t px-1 pt-3 pb-1">
      <p className={cn(navType.body, "text-muted-foreground")}>
        Энэ цэстэй холбоотой урамшуулал энд байрлана.
      </p>
      <NavigationMenuLink
        asChild
        className="bg-primary text-primary-foreground hover:bg-primary/90! hover:text-primary-foreground! mt-2.5 inline-flex h-9 w-auto items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold"
      >
        <Link href="/campaigns">
          Sample CTA
          <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
        </Link>
      </NavigationMenuLink>
    </div>
  );
}

// =====================================================================
// ХУВИЛБАР 3 — sticky доод tab bar
// =====================================================================

/**
 * Хөтчийн ДООД UI-ийн өндрийг хөөж, доод bar-ыг тэр хэмжээгээр дээш зөөнө.
 *
 * ЯАГААД: iOS Safari-д `position: fixed; bottom: 0` нь LAYOUT viewport-д
 * бэхлэгддэг. Safari-ийн доод toolbar задрахад layout viewport дахин
 * тооцогддоггүй — toolbar нь bar-ыг ДАРНА. `env(safe-area-inset-bottom)` нь
 * зөвхөн home indicator-ын зурааст зориулагдсан тул үүнийг НӨХӨХГҮЙ.
 *
 * `visualViewport` нь ХАРАГДАЖ байгаа хэсгийг мэдээлдэг тул
 * `innerHeight − vv.height − vv.offsetTop` = доод талд нуугдсан px. Тэрийг
 * CSS хувьсагчаар өгч bar-ыг toolbar задрах/хураагдах бүрд дагуулна.
 *
 * REACT STATE ХЭРЭГЛЭХГҮЙ — scroll бүрд re-render хийхгүйн тулд ref-ээр
 * шууд CSS хувьсагч бичнэ (rAF-аар нэгтгэсэн).
 *
 * ГАР ЧУХАЛ: экран дээрх KEYBOARD нээгдэхэд visualViewport ЭРС жижигрэнэ.
 * Тэр үед bar-ыг дэлгэцийн голд хөвүүлэх нь эвгүй тул 120px-ээр хязгаарлаж,
 * 150px-ээс их бол `data-keyboard="open"` болгож бүхэлд нь нууна.
 */
function useBrowserBottomInset(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const vv = window.visualViewport;
    const el = ref.current;
    if (!vv || !el) return;

    let raf = 0;
    const apply = () => {
      const hidden = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      el.style.setProperty("--vv-bottom", `${Math.min(hidden, 120)}px`);
      el.dataset.keyboard = hidden > 150 ? "open" : "closed";
    };
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    apply();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [ref]);
}

/**
 * Доод tab bar — `fixed z-50`, контентын хамгийн наана.
 *
 * `bottom` нь 0 БИШ — `--vv-bottom` (дээрх hook) тул Safari-ийн доод toolbar
 * задрахад bar нь зөөлөн дээш гарч, хураагдахад буцаж доошилно.
 *
 * `data-bottom-tab-bar` — globals.css дотор `body:has(…)`-аар доод зай
 * гаргахад ашиглагдана (bar нь fixed тул footer-ийг дардаг).
 */
function BottomTabBar() {
  const ref = useRef<HTMLElement>(null);
  useBrowserBottomInset(ref);
  const pathname = usePathname() ?? "";

  /**
   * ХАМГИЙН ИХДЭЭ НЭГ таб тодорно — доод tab bar-т "би хаана байна" гэдэг нь
   * ганц байх ёстой. Замтай таарсан таб байвал тэр, эс бөгөөс (жишээ нь
   * нүүр хуудсанд) build-ийн домэйны таб тодорно.
   *
   * Нөгөө домэйны таб (шинэ tab-аар нээгддэг) хэзээ ч "одоогийн" болохгүй.
   */
  const isInternal = (t: (typeof TABS)[number]) =>
    !t.owner || t.owner === "self" || t.owner === BRAND;
  const currentName = TABS.find(
    (t) => isInternal(t) && (pathname === t.href || pathname.startsWith(`${t.href}/`)),
  )?.name;
  const highlightedName = currentName ?? DOMAIN_TAB;

  const renderTab = (tab: (typeof TABS)[number]) => (
    <li key={tab.name} className="flex-1">
      <BottomTab
        tab={tab}
        highlighted={tab.name === highlightedName}
        isCurrentPage={tab.name === currentName}
      />
    </li>
  );

  return (
    <nav
      ref={ref}
      data-bottom-tab-bar
      aria-label="Доод цэс"
      style={{ bottom: "var(--vv-bottom, 0px)" }}
      className="border-border bg-background/95 supports-backdrop-filter:bg-background/75 fixed inset-x-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur transition-[bottom,transform,opacity] duration-300 ease-out data-[keyboard=open]:pointer-events-none data-[keyboard=open]:translate-y-full data-[keyboard=open]:opacity-0 lg:hidden"
    >
      <ul className="mx-auto flex max-w-300 items-stretch">
        {BOTTOM_LEFT.map(renderTab)}
        <li className="flex-1">
          <BottomChatTab />
        </li>
        {BOTTOM_RIGHT.map(renderTab)}
        <li className="flex-1">
          <BottomAccountTab />
        </li>
      </ul>
    </nav>
  );
}

/**
 * Доод bar-ын нэг ангилал — дэд цэс НЭЭХГҮЙ, дарвал ШУУД тухайн брэнд рүү
 * шилжинэ. Дэд цэсэнд burger-ээс хүрнэ (Хувилбар 3-ын burger нь бүх
 * ангиллыг accordion-оор агуулна).
 *
 * `SmartLink` — AI туслахын CTA-тай ЯГ ИЖИЛ логик (`resolveHref`):
 *   Unitel build дээр  → Unitel: дотоод /unitel · Univision: univision домэйн
 *   Univision build    → Univision: дотоод /univision · Unitel: unitel домэйн
 * Нөгөө домэйн бол шинэ tab-аар нээгдэнэ. Дотоод/гадаадыг ХАРАГДАЦААР
 * ялгахгүй (сум, брэндийн нэр нэмэхгүй) — нэгдсэн эко-системийн зарчим.
 *
 * ТОДОТГОЛ — брэнд ногоон БИШ, `text-foreground` + `font-bold` (light theme-д
 * хар, dark theme-д цагаан). Ногоон нь доод bar-ын бусад элементтэй
 * зохицохгүй байсан. Тодорсон таб нь ХАМГИЙН ИХДЭЭ НЭГ (`BottomTabBar`-д
 * шийдэгдэнэ): замтай таарсан нь, эс бөгөөс домэйны таб.
 */
function BottomTab({
  tab,
  highlighted,
  isCurrentPage,
}: {
  tab: EcosystemLink & { name: TabName };
  highlighted: boolean;
  isCurrentPage: boolean;
}) {
  const isDomain = tab.name === DOMAIN_TAB;
  const Icon = TAB_ICONS[tab.name];

  return (
    <SmartLink
      href={tab.href}
      owner={tab.owner}
      aria-current={isCurrentPage ? "page" : undefined}
      className={cn(
        BOTTOM_TAB,
        highlighted ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate">
        <TabLabel name={tab.name} isDomain={isDomain} />
      </span>
    </SmartLink>
  );
}

/** Доод bar-ын профайл — Хувилбар 3-д профайл burger-т биш, энд байна. */
function BottomAccountTab() {
  const { isAuthenticated, user, openLogin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => openLogin()}
        className={cn(BOTTOM_TAB, "text-muted-foreground hover:text-foreground")}
      >
        <User className="size-5 shrink-0" aria-hidden="true" />
        <span className="truncate">Нэвтрэх</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            BOTTOM_TAB,
            "text-muted-foreground hover:text-foreground data-[state=open]:text-foreground",
          )}
        >
          <User className="size-5 shrink-0" aria-hidden="true" />
          <span className="truncate">{user?.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="center" sideOffset={8} className="w-48">
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut className="size-4" aria-hidden="true" />
          Гарах
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Chat — Хувилбар 3-д chatbot нь НАВИГАЦЫН нэг хэсэг болно.
 *
 * `chat-widget.tsx` нь `univision:chat-open` window event-ийг аль хэдийн
 * сонсдог (support/service хуудсууд ч түүгээр дуудаж байгаа) тул шинэ store
 * хэрэггүй. Хөвөгч chat товч нь globals.css-д нуугдана — эс бөгөөс доод
 * bar-ыг дардаг.
 */
function BottomChatTab() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("univision:chat-open"))}
      aria-label="Chat нээх"
      className={cn(BOTTOM_TAB, "text-foreground")}
    >
      {/* ГОЛЫН ТАБ — брэнд өнгөт дугуй, bar-аас 28px ДЭЭШ өргөгдсөн тул
          бусдаасаа шууд ялгарна. `-mt-7` нь өргөлтийн хэмжээтэй тэнцүү flow
          өндрийг хасдаг учир bar-ын өндөр бусад табтай ижил (58px) хэвээр.
          `ring-background` — bar-ын дэвсгэртэй цэвэр зааг гаргана. */}
      <span className="bg-primary text-primary-foreground ring-background -mt-7 flex size-12 shrink-0 items-center justify-center rounded-full shadow-lg ring-4">
        <BotMessageSquare className="size-6" aria-hidden="true" />
      </span>
      <span className="truncate">Chat</span>
    </button>
  );
}

// 11px · 500 нь `navType.mobileTab`-тай ИЖИЛ роль — header-ийн таб ба доод
// bar хоёр нэг хэмжээнээс уншина (өмнө энд inline hardcode байсан).
const BOTTOM_TAB = cn(
  navType.mobileTab,
  "flex w-full flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
);

// =====================================================================
// BURGER
// =====================================================================

/** Бүх мөрийн НЭГ хэлбэр — ингэснээр хоорондын зай жигд болно (40px). */
const ROW =
  "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left transition-colors";

function MobileMenuSheet({ variant }: { variant: MobileVariant }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const categories = BURGER_CATEGORIES[variant];
  const rowClass = cn(navType.mobileLink, ROW);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Цэс нээх">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 gap-0 overflow-y-auto p-6 sm:w-90">
        <SheetHeader className="p-0">
          <SheetTitle>Цэс</SheetTitle>
        </SheetHeader>

        {/* ── 1. Ангилал — дэд цэстэй нь accordion, дэд цэсгүй нь шууд линк ── */}
        {/* Хувилбар 1-д `categories` ХООСОН (5 ангилал бүгд header-т) — тэр үед
            хоосон `mt-5` зай гаргахгүйн тулд блокийг бүхэлд нь рендерлэхгүй. */}
        {categories.length > 0 && (
          <div className="mt-5">
            <Accordion type="single" collapsible className="gap-0.5">
              {categories.map((category) => {
                const menu = mobileMegaMenus[category.name];
                const isDomain = category.name === DOMAIN_TAB;

                // Дэд цэсгүй ангилал (Урамшуулал) — accordion биш, шууд линк
                if (!menu) {
                  return (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={close}
                      className={rowClass}
                    >
                      {category.name}
                    </Link>
                  );
                }

                return (
                  <AccordionItem key={category.name} value={category.name} className="border-b-0">
                    {/* `border-0` — AccordionTrigger-ийн 1px хүрээ мөрийг 42px
                      болгож бусад мөрөөс 2px зөрүүлдэг. Focus-ийн тэмдэг нь
                      `focus-visible:ring-3`-аар хэвээр харагдана. */}
                    <AccordionTrigger
                      className={cn(
                        navType.mobileLink,
                        ROW,
                        "border-0 hover:no-underline",
                        // Ногоон БИШ — header-ийн табтай ижил `text-foreground`
                        isDomain && "text-foreground font-semibold",
                      )}
                    >
                      <TabLabel name={category.name} isDomain={isDomain} />
                    </AccordionTrigger>
                    <AccordionContent className="pt-0.5 pb-1">
                      <ul className="space-y-0.5 pl-4">
                        {menu.sections.map((section) => (
                          <li key={section.id}>
                            <SubItem href={section.href} onNavigate={close}>
                              {section.title.trim()}
                            </SubItem>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}

        {/* ── 2. Байгууллага — шууд Nexmind руу ────────────────────── */}
        {BUSINESS && (
          <div className="border-border mt-4 border-t pt-4">
            <a
              href={BUSINESS.href}
              target={BUSINESS.external ? "_blank" : undefined}
              rel={BUSINESS.external ? "noopener noreferrer" : undefined}
              onClick={close}
              className={rowClass}
            >
              {BUSINESS.label}
              <ArrowUpRight className="ml-auto size-4 shrink-0 opacity-60" aria-hidden="true" />
            </a>
          </div>
        )}

        {/* ── 3. Тохиргоо. Хувилбар 3-д профайл нь доод bar-т тул энд гарахгүй ── */}
        <div className="border-border mt-4 space-y-0.5 border-t pt-4">
          <ThemeRow />
          <LanguageRow />
          {variant !== 3 && <AccountRow onDone={close} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Accordion доторх дэд линк */
function SubItem({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  const cls = cn(
    navType.mobileLink,
    "text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2 no-underline transition-colors",
  );

  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className={cls}>
      {children}
      <ArrowUpRight className="ml-auto size-3.5 shrink-0 opacity-60" aria-hidden="true" />
    </a>
  ) : (
    <Link href={href} onClick={onNavigate} className={cls}>
      {children}
    </Link>
  );
}

/** Theme — мөр бүхэлдээ дарагдана (icon товч нэмэхгүй, зай жигд байхын тулд) */
function ThemeRow() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(navType.mobileLink, ROW)}
    >
      Theme
      {/* Зөвхөн ICON — "Dark/Light" текст нь icon-той давхардаж байсан тул
          хассан. Screen reader-т одоогийн төлөв `sr-only`-гоор хэвээр хүрнэ. */}
      <span className="text-muted-foreground ml-auto">
        {isDark ? (
          <Moon className="size-4" aria-hidden="true" />
        ) : (
          <Sun className="size-4" aria-hidden="true" />
        )}
      </span>
      <span className="sr-only">— одоо {isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

/**
 * Хэл солих — ОДООГООР ХАРАГДАХ ТАЛ ЛЭ. Проектод i18n давхарга байхгүй
 * (`layout.tsx` дээр `lang="mn"` тогтмол) тул дарахад сольж болох зүйл байхгүй.
 * i18n нэмэгдмэгц энэ мөрийг MN/EN сонголттой болгоно.
 */
function LanguageRow() {
  return (
    <div
      aria-disabled="true"
      className={cn(navType.mobileLink, "flex items-center gap-2 rounded-md px-2 py-2.5")}
    >
      Хэл солих
      <span className="text-muted-foreground ml-auto flex items-center gap-2">
        <span className="text-[13px]">MN</span>
        <Globe className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}

/** Профайл — Хувилбар 1 ба 2-т burger дотор (3-т доод bar-т). */
function AccountRow({ onDone }: { onDone: () => void }) {
  const { isAuthenticated, user, openLogin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => {
          onDone();
          // Sheet хаагдаж focus-аа trigger рүү буцаах хугацаа — эс бөгөөс
          // login dialog нээгдэнгүүт focus-оо алдана.
          setTimeout(() => openLogin(), 220);
        }}
        className={cn(navType.mobileLink, ROW)}
      >
        Нэвтрэх
        <User className="text-muted-foreground ml-auto size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        onDone();
      }}
      className={cn(navType.mobileLink, ROW)}
    >
      <span className="truncate">{user?.name}</span>
      <span className="text-destructive ml-auto flex shrink-0 items-center gap-2">
        <span className="text-[13px]">Гарах</span>
        <LogOut className="size-4" aria-hidden="true" />
      </span>
    </button>
  );
}
