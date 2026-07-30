"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Layers, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { AudienceSwitchTabs, AudienceSwitchMobile } from "@/components/layout/audience-switch";
import {
  AccountMenu,
  BrandLogoLink,
  BrandMegaPanel,
  MobileToggleRow,
  classifierSegments,
  useActiveNavName,
  useBrandMegaMenu,
} from "@/components/layout/header-shared";
import { appleMegaMenus, appleNavCategories, type EcosystemLink } from "@/data/navigation";
import { useHeaderVariant, setHeaderVariant, type HeaderVariant } from "@/lib/header-variant";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * HEADER — Хувилбар 3 (single-row) -ийн суурь дээр хоёр хувилбар
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Хоёулаа ИЖИЛ зүүн ангилалтай (`appleNavCategories`):
 *   Unitel · Univision · Дэлгүүр · Entertainment · Урамшуулал · Тусламж
 *
 * Ялгаа нь ЗӨВХӨН "Хувь хэрэглэгч / Байгууллага" ангилагчийг хэрхэн
 * харуулахад:
 *
 *   Хувилбар 1 — ГАНЦ МӨР. Ангилагч үндсэн мөрний баруун талд, профайлын хамт.
 *     ┌────────────────────────────────────────────────────────────┐
 *     │ Unitel Univision Дэлгүүр…   [ЛОГО]   Хувь хэрэглэгч ▾  👤 │
 *     └────────────────────────────────────────────────────────────┘
 *
 *   Хувилбар 2 — ХОЁР МӨР. Ангилагч дээд нимгэн мөрний баруун талд; түүний
 *     оронд үндсэн мөрний баруун талд хайх · профайл · theme toggle.
 *     ┌────────────────────────────────────────────────────────────┐
 *     │                                        Хувь хэрэглэгч ▾    │
 *     ├────────────────────────────────────────────────────────────┤
 *     │ Unitel Univision Дэлгүүр…   [ЛОГО]      🔍   👤   ☀/🌙    │
 *     └────────────────────────────────────────────────────────────┘
 *
 * Хоёуланд Unitel / Univision / Дэлгүүр / Entertainment дээр hover хийхэд
 * Apple маягийн mega panel задарна (`appleMegaMenus`-д бичлэгтэй нь).
 *
 * Ашиглагдахгүй болсон хувилбарууд (Apple · Group · Chat) header-archive.tsx-д
 * бүтнээр хадгалагдсан — build-д орохгүй.
 */

type Variant = HeaderVariant;

const VARIANTS: { id: Variant; label: string }[] = [
  { id: 1, label: "Хувилбар 1 · Ганц мөр" },
  { id: 2, label: "Хувилбар 2 · Дээд ангилагч" },
];

/** Хоёр хувилбарын ХУВААЛЦАХ зүүн талын ангилал */
const NAV_ITEMS: EcosystemLink[] = appleNavCategories;

export function Header() {
  const pathname = usePathname();
  const variant = useHeaderVariant();

  // /web4 — immersive presentation хуудас: header харуулахгүй
  if (pathname?.startsWith("/web4")) return null;

  return (
    <>
      <VariantToggle variant={variant} onChange={setHeaderVariant} />
      {/* Архивласан 3 / 4 localStorage-д үлдсэн байвал Хувилбар 1 рүү унана */}
      {variant === 2 ? <TopClassifierHeader /> : <SingleRowHeader />}
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
  activeName,
  openMenu,
  onOpen,
  onClose,
}: {
  activeName: string | null;
  openMenu: string | null;
  onOpen: (name: string) => void;
  onClose: () => void;
}) {
  return (
    <nav aria-label="Үндсэн цэс" className="flex items-center gap-5">
      {NAV_ITEMS.map((item) => {
        const active = !item.external && item.name === activeName;
        const label = item.name;
        const linkClass = cn(
          "relative whitespace-nowrap transition-colors",
          // Apple маягийн зөөлөн доогуур зураас — hover дээр төвөөс тэлнэ
          "after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
          active
            ? cn(navType.barActive, "text-foreground")
            : cn(navType.bar, "text-foreground/75 hover:text-foreground"),
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
                aria-current={active ? "page" : undefined}
                aria-expanded={openMenu === item.name}
                className={cn(
                  linkClass,
                  openMenu === item.name && "text-foreground after:scale-x-100",
                )}
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
            aria-current={active ? "page" : undefined}
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
  onOpen,
  onClose,
  onCloseNow,
}: {
  panelBrand: string | null;
  shown: boolean;
  onOpen: (name: string) => void;
  onClose: () => void;
  onCloseNow: () => void;
}) {
  if (!panelBrand || !appleMegaMenus[panelBrand]) return null;

  return (
    <div
      onMouseEnter={() => onOpen(panelBrand)}
      onMouseLeave={onClose}
      className={cn(
        "border-border bg-popover text-popover-foreground absolute inset-x-0 top-full z-50 hidden border-t shadow-xl transition-[opacity,transform] duration-500 ease-out lg:block",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <BrandMegaPanel menu={appleMegaMenus[panelBrand]} onNavigate={onCloseNow} />
    </div>
  );
}

/** Mobile Sheet — ангиллын жагсаалт. Хоёр хувилбарт ижил, доод хэсэг нь өөр. */
function MobileNav({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Цэс нээх">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-75 p-6 sm:w-90">
        <SheetHeader className="p-0">
          <SheetTitle>Цэс</SheetTitle>
        </SheetHeader>

        <ul className="mt-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const label = <span>{item.name}</span>;
            const rowClass = cn(
              navType.mobileLink,
              "hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 transition-colors",
            );

            return (
              <li key={item.name}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onOpenChange(false)}
                    className={rowClass}
                  >
                    {label}
                    <ArrowUpRight
                      className="text-muted-foreground ml-auto size-4"
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <Link href={item.href} onClick={() => onOpenChange(false)} className={rowClass}>
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {children}
      </SheetContent>
    </Sheet>
  );
}

// =====================================================================
// ХУВИЛБАР 1 — ГАНЦ МӨР
//   Зүүн: ангилал · Төв: лого · Баруун: Хувь хэрэглэгч/Байгууллага + профайл
// =====================================================================
function SingleRowHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeName = useActiveNavName(NAV_ITEMS);
  const { openMenu, panelBrand, shown, openBrandMenu, closeBrandMenu, closeNow } =
    useBrandMegaMenu();

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
        {/* Desktop — ганц мөр */}
        <div className="mx-auto hidden h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
          <CategoryNav
            activeName={activeName}
            openMenu={openMenu}
            onOpen={openBrandMenu}
            onClose={closeBrandMenu}
          />

          <div className="flex justify-center">
            <BrandLogoLink />
          </div>

          <div className="flex items-center justify-end gap-2">
            <AudienceSwitchTabs
              segments={classifierSegments}
              activeId="personal"
              align="end"
              hover={false}
              triggerClassName={navType.bar}
            />
            <AccountMenu />
          </div>
        </div>

        {/* Mobile — цэс · лого · профайл.
            Desktop-тэй ижил 3 баганат grid: хоёр талын багана 1fr тул лого
            хажуугийн icon-уудын тооноос үл хамааран ҮНЭХЭЭР төвд суудаг
            (justify-between нь өргөн зөрөхөд логог хазайлгадаг). */}
        <div className="mx-auto grid h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:hidden">
          <div className="flex justify-start">
            <MobileNav open={mobileOpen} onOpenChange={setMobileOpen}>
              <div className="border-border mt-4 border-t pt-4">
                <p className={cn(navType.groupLabel, "mb-1 px-2")}>Хэрэглэгчийн төрөл</p>
                <AudienceSwitchMobile
                  segments={classifierSegments}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>
            </MobileNav>
          </div>

          <div className="flex justify-center">
            <BrandLogoLink />
          </div>

          <div className="flex items-center justify-end">
            <AccountMenu />
          </div>
        </div>

        <MegaLayer
          panelBrand={panelBrand}
          shown={shown}
          onOpen={openBrandMenu}
          onClose={closeBrandMenu}
          onCloseNow={closeNow}
        />
      </header>
    </>
  );
}

// =====================================================================
// ХУВИЛБАР 2 — ХОЁР МӨР
//   Дээд нимгэн мөр: Хувь хэрэглэгч/Байгууллага (баруун)
//   Үндсэн мөр: зүүн ангилал · төв лого · баруун хайх + профайл + theme
// =====================================================================
function TopClassifierHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeName = useActiveNavName(NAV_ITEMS);
  const { openMenu, panelBrand, shown, openBrandMenu, closeBrandMenu, closeNow } =
    useBrandMegaMenu();

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
        {/* Дээд нимгэн мөр — ангилагч баруун талд (зөвхөн desktop) */}
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

        {/* Үндсэн мөр — зүүн ангилал · төв лого · баруун icons */}
        <div className="mx-auto hidden h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
          <CategoryNav
            activeName={activeName}
            openMenu={openMenu}
            onOpen={openBrandMenu}
            onClose={closeBrandMenu}
          />

          <div className="flex justify-center">
            <BrandLogoLink />
          </div>

          <div className="flex items-center justify-end gap-0.5">
            <AccountMenu />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile — цэс · лого · хайх + профайл.
            3 баганат grid — баруун талд 2 icon байгаа тул `justify-between`-д
            лого зүүн тийш хазайдаг. 1fr_auto_1fr нь логог ҮНЭХЭЭР төвд барина. */}
        <div className="mx-auto grid h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:hidden">
          <div className="flex justify-start">
            <MobileNav open={mobileOpen} onOpenChange={setMobileOpen}>
              <div className="border-border mt-4 border-t pt-4">
                <p className={cn(navType.groupLabel, "mb-1 px-2")}>Хэрэглэгчийн төрөл</p>
                <AudienceSwitchMobile
                  segments={classifierSegments}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>

              <div className="border-border mt-6 space-y-2 border-t pt-6">
                <MobileToggleRow label="Theme">
                  <ThemeToggle />
                </MobileToggleRow>
              </div>
            </MobileNav>
          </div>

          <div className="flex justify-center">
            <BrandLogoLink />
          </div>

          <div className="flex items-center justify-end gap-0.5">
            <AccountMenu />
          </div>
        </div>

        <MegaLayer
          panelBrand={panelBrand}
          shown={shown}
          onOpen={openBrandMenu}
          onClose={closeBrandMenu}
          onCloseNow={closeNow}
        />
      </header>
    </>
  );
}
