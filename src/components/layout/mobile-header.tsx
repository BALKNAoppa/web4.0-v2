"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  BotMessageSquare,
  Globe,
  LogOut,
  Menu,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/components/auth/auth-provider";
import { SmartLink } from "@/components/layout/smart-link";
import { BrandLogoLink, classifierSegments } from "@/components/layout/header-shared";
import { appleMegaMenus, appleNavCategories, type EcosystemLink } from "@/data/navigation";
import { BRAND } from "@/lib/brand";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MOBILE HEADER — 3 хувилбар (desktop-ийн хувилбартай хамт солигдоно)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ХУВИЛБАР 1 — таб төвд
 *   ┌──────────────────────────────────────┐
 *   │ (◉)   Unitel Univision Дэлгүүр    ☰ │
 *   └──────────────────────────────────────┘
 *   Таб дарахад dropdown. Табанд ороогүй ангилал (Entertainment ·
 *   Урамшуулал) burger дотор.
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
 * Гурвуулаа НИЙТЛЭГ: одоо байгаа ДОМЭЙН (build-ийн брэнд) брэнд ногооноор
 * тодорно — Хувилбар 1-д таб, 2-т burger-ийн ангилал, 3-т доод bar дээр.
 */

export type MobileVariant = 1 | 2 | 3;

/** Хувилбар 1-ийн header дээрх табууд. */
const TAB_NAMES = ["Unitel", "Univision", "Дэлгүүр"] as const;
type TabName = (typeof TAB_NAMES)[number];

const isTab = (name: string): name is TabName => TAB_NAMES.includes(name as TabName);

const TABS = appleNavCategories.filter((c): c is EcosystemLink & { name: TabName } =>
  isTab(c.name),
);

/**
 * ОДОО БАЙГАА ДОМЭЙН — build-ийн брэнд (`NEXT_PUBLIC_BRAND`). Unitel build дээр
 * "Unitel", Univision build дээр "Univision" брэнд ногооноор тодорно тул
 * хэрэглэгч аль домэйн дээрээ байгаагаа цэс нээхгүйгээр харна. "Дэлгүүр" нь
 * домэйн биш тул хэзээ ч тодрохгүй.
 */
const DOMAIN_TAB: TabName = BRAND === "univision" ? "Univision" : "Unitel";

/**
 * Burger дотор ямар ангилал харуулах вэ.
 *   Хувилбар 1 — табанд ОРООГҮЙ нь (табууд нь өөрсдөө dropdown-той)
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

/** Доод tab bar-ын ангилал бүрийн icon (Хувилбар 3). */
const TAB_ICONS: Record<TabName, typeof Smartphone> = {
  Unitel: Smartphone,
  Univision: Tv,
  Дэлгүүр: ShoppingBag,
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
  if (variant === 1) {
    return (
      <HeaderRow variant={1}>
        {/* Табууд дэлгэцийн ҮНЭН ТӨВД — `w-max` + `mx-auto` нь зай байвал
            төвлүүлж, багтахгүй болбол зүүн захаас хайчлахгүйгээр гүйлгэнэ. */}
        <nav aria-label="Брэнд сонгох" className="no-scrollbar -my-1 overflow-x-auto py-1">
          <div className="mx-auto flex w-max items-center gap-0.5">
            {TABS.map((tab) => (
              <BrandTab key={tab.name} tab={tab} />
            ))}
          </div>
        </nav>
      </HeaderRow>
    );
  }

  if (variant === 2) return <HeaderRow variant={2} />;

  return (
    <>
      <HeaderRow variant={3} />
      <BottomTabBar />
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
      {/* `1fr … 1fr` — хоёр талын багана ижил өргөнтэй тул дундах агуулга
          (Хувилбар 1-ийн табууд) лого/burger-ийн өргөнөөс үл хамааран ҮНЭН
          ТӨВД суудаг. `minmax(0,auto)` — нарийн дэлгэцэнд хумигдана. */}
      <div className="mx-auto grid h-12 max-w-300 grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-1 px-3">
        <div className="flex justify-start">
          <BrandLogoLink />
        </div>

        <div className="min-w-0">{children}</div>

        <div className="flex items-center justify-end">
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
 *   - брэнд ногоон текст = одоо байгаа домэйн (тогтмол)
 *   - өргөгдсөн pill      = dropdown нээлттэй (`data-[state=open]`)
 * Нээхэд ҮСГИЙН ЗУЗААН СОЛИГДОХГҮЙ — эс бөгөөс таб өргөсөж, хажуугийн
 * табууд хажуу тийш "цүүрнэ".
 */
function BrandTab({ tab }: { tab: EcosystemLink & { name: TabName } }) {
  const isDomain = tab.name === DOMAIN_TAB;
  const sections = appleMegaMenus[tab.name]?.sections ?? [];

  const triggerClass = cn(
    "shrink-0 rounded-full border border-transparent px-2.5 py-1.5 whitespace-nowrap transition-colors",
    "data-[state=open]:border-border data-[state=open]:bg-background data-[state=open]:shadow-sm",
    isDomain
      ? cn(navType.barActive, "text-primary")
      : cn(
          navType.bar,
          "text-foreground/75 hover:text-foreground data-[state=open]:text-foreground",
        ),
  );

  if (sections.length === 0) {
    return (
      <Link href={tab.href} className={triggerClass}>
        <TabLabel name={tab.name} isDomain={isDomain} />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={triggerClass}>
          <TabLabel name={tab.name} isDomain={isDomain} />
        </button>
      </DropdownMenuTrigger>
      <SectionMenu sections={sections} />
    </DropdownMenu>
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

/** Ангиллын дэд цэс — dropdown агуулга (Хувилбар 1 ба 3-д хуваалцана). */
function SectionMenu({
  sections,
  side = "bottom",
}: {
  sections: { id: string; title: string; href: string }[];
  side?: "bottom" | "top";
}) {
  return (
    <DropdownMenuContent
      side={side}
      align="center"
      sideOffset={8}
      collisionPadding={12}
      className="w-64"
    >
      {sections.map((section) => (
        <DropdownMenuItem key={section.id} asChild>
          {section.href.startsWith("http") ? (
            <a href={section.href} target="_blank" rel="noopener noreferrer">
              {section.title.trim()}
              <ArrowUpRight className="ml-auto size-3.5 shrink-0 opacity-60" aria-hidden="true" />
            </a>
          ) : (
            <Link href={section.href}>{section.title.trim()}</Link>
          )}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
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

  return (
    <nav
      ref={ref}
      data-bottom-tab-bar
      aria-label="Доод цэс"
      style={{ bottom: "var(--vv-bottom, 0px)" }}
      className="border-border bg-background/95 supports-backdrop-filter:bg-background/75 fixed inset-x-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur transition-[bottom,transform,opacity] duration-300 ease-out data-[keyboard=open]:pointer-events-none data-[keyboard=open]:translate-y-full data-[keyboard=open]:opacity-0 lg:hidden"
    >
      <ul className="mx-auto flex max-w-300 items-stretch">
        {BOTTOM_LEFT.map((tab) => (
          <li key={tab.name} className="flex-1">
            <BottomTab tab={tab} />
          </li>
        ))}
        <li className="flex-1">
          <BottomChatTab />
        </li>
        {BOTTOM_RIGHT.map((tab) => (
          <li key={tab.name} className="flex-1">
            <BottomTab tab={tab} />
          </li>
        ))}
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
 * Хоёр тэмдэг:
 *   - брэнд ногоон = одоо байгаа домэйн (тогтмол, build-ээс)
 *   - `text-foreground` + `aria-current="page"` = ОДОО байгаа хуудас
 */
function BottomTab({ tab }: { tab: EcosystemLink & { name: TabName } }) {
  const pathname = usePathname() ?? "";
  const isDomain = tab.name === DOMAIN_TAB;
  // Нөгөө домэйны таб хэзээ ч "одоогийн хуудас" болохгүй
  const isCurrent =
    (!tab.owner || tab.owner === "self" || tab.owner === BRAND) &&
    (pathname === tab.href || pathname.startsWith(`${tab.href}/`));
  const Icon = TAB_ICONS[tab.name];

  return (
    <SmartLink
      href={tab.href}
      owner={tab.owner}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        BOTTOM_TAB,
        isDomain
          ? "text-primary font-semibold"
          : isCurrent
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground",
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

const BOTTOM_TAB =
  "flex w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors";

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
        <div className="mt-5">
          <Accordion type="single" collapsible className="gap-0.5">
            {categories.map((category) => {
              const menu = appleMegaMenus[category.name];
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
                      isDomain && "text-primary font-semibold",
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
