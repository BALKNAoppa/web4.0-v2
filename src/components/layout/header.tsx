"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  User,
  Globe,
  LogOut,
  ArrowUpRight,
  Layers,
  ChevronDown,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Navigation } from "@/components/layout/navigation";
import { AudienceSwitchTabs, AudienceSwitchMobile } from "@/components/layout/audience-switch";
import { PromoCard } from "@/components/layout/promo-card";
import { useAuth } from "@/components/auth/auth-provider";
import {
  appleMegaMenus,
  appleNavCategories,
  currentPromos,
  customerSegments,
  ecosystemBrands,
  groupNavV2,
  type AudienceSegment,
  type EcosystemLink,
  type MegaMenu,
} from "@/data/navigation";
import { useHeaderVariant, setHeaderVariant, type HeaderVariant } from "@/lib/header-variant";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

type Variant = HeaderVariant;
const VARIANTS: { id: Variant; label: string }[] = [
  { id: 1, label: "Хувилбар 1 · Company 1st" },
  { id: 2, label: "Хувилбар 2 · Consumer & Company" },
  { id: 3, label: "Хувилбар 3 · Company & Consumer" },
  { id: 4, label: "Хувилбар 4 · Hybrid" },
];

const classifierSegments: AudienceSegment[] = [
  ...customerSegments.filter((s) => s.id === "personal"),
  {
    id: "business",
    label: "Байгууллага",
    href: "https://nexmind.mn/",
    external: true,
    icon: "building",
  },
];

export function Header() {
  const pathname = usePathname();
  const variant = useHeaderVariant();

  // /web4 — immersive presentation хуудас: header харуулахгүй
  if (pathname?.startsWith("/web4")) return null;

  return (
    <>
      <VariantToggle variant={variant} onChange={setHeaderVariant} />
      {variant === 2 ? (
        <GroupHeader />
      ) : variant === 3 ? (
        <HybridHeader />
      ) : variant === 4 ? (
        <ChatHeader />
      ) : (
        <AppleHeader />
      )}
    </>
  );
}

/**
 * Хувилбар сонгох toggle — дэлгэцийн дээд талд. Зөв хувилбараа шийдсэний дараа энэ toggle-ийг устгана.
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
  const [barOpen, setBarOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const current = VARIANTS.find((v) => v.id === variant);

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
          {current?.label ?? "Хувилбар"}
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

function useActiveBrand(): string | null {
  const pathname = usePathname();
  const brand = ecosystemBrands.find(
    (b) => !b.external && b.href !== "/" && pathname.startsWith(b.href),
  );
  return brand?.name ?? null;
}

function useBrandMegaMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelBrand, setPanelBrand] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  const openBrandMenu = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setPanelBrand(name);
    setOpenMenu(name);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setShown(true));
  };
  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
    setShown(false);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => setPanelBrand(null), 500);
  };
  const closeBrandMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(closeNow, 150);
  };

  return { openMenu, panelBrand, shown, openBrandMenu, closeBrandMenu, closeNow };
}

function AppleHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeBrand = useActiveBrand();

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
      <header className="bg-background relative top-0 z-50" role="banner">
        {/* Desktop */}
        <div className="mx-auto hidden h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
          <div className="flex items-center">
            <EcoLogo />
          </div>

          <nav aria-label="Үндсэн цэс" className="flex items-center justify-center gap-5">
            {appleNavCategories.map((brand) => {
              const active = brand.name === activeBrand;
              const linkClass = cn(
                "relative transition-colors",
                "after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
                active
                  ? cn(navType.barActive, "text-foreground")
                  : cn(navType.bar, "text-foreground/75 hover:text-foreground"),
              );
              const menu = !brand.external ? appleMegaMenus[brand.name] : undefined;
              if (menu) {
                return (
                  <div
                    key={brand.name}
                    className="flex items-center"
                    onMouseEnter={() => openBrandMenu(brand.name)}
                    onMouseLeave={closeBrandMenu}
                  >
                    <Link
                      href={brand.href}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={openMenu === brand.name}
                      className={cn(
                        linkClass,
                        openMenu === brand.name && "text-foreground after:scale-x-100",
                      )}
                    >
                      {brand.name}
                    </Link>
                  </div>
                );
              }

              return brand.external ? (
                <a
                  key={brand.name}
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {brand.name}
                </a>
              ) : (
                <Link
                  key={brand.name}
                  href={brand.href}
                  aria-current={active ? "page" : undefined}
                  className={linkClass}
                >
                  {brand.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-0.5">
            <IconButton label="Хайх">
              <Search className="size-4" />
            </IconButton>
            <AccountMenu />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile */}
        <div className="mx-auto flex h-11 max-w-300 items-center justify-between px-4 lg:hidden">
          <EcoLogo />

          <div className="flex items-center gap-0.5">
            <IconButton label="Хайх">
              <Search className="size-5" />
            </IconButton>
            <AccountMenu />
            <ThemeToggle />

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Цэс нээх">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-75 p-6 sm:w-90">
                <SheetHeader className="p-0">
                  <SheetTitle>Цэс</SheetTitle>
                </SheetHeader>

                <ul className="mt-4 space-y-1">
                  {appleNavCategories.map((brand) => {
                    const active = brand.name === activeBrand;
                    const linkClass = cn(
                      cn(
                        navType.mobileLink,
                        "hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 transition-colors",
                      ),
                      active && "bg-muted",
                    );
                    return (
                      <li key={brand.name}>
                        {brand.external ? (
                          <a
                            href={brand.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileOpen(false)}
                            className={linkClass}
                          >
                            <span>{brand.name}</span>
                            <ArrowUpRight
                              className="text-muted-foreground ml-auto size-4"
                              aria-hidden="true"
                            />
                          </a>
                        ) : (
                          <Link
                            href={brand.href}
                            onClick={() => setMobileOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={linkClass}
                          >
                            <span>{brand.name}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {panelBrand && appleMegaMenus[panelBrand] && (
          <div
            onMouseEnter={() => openBrandMenu(panelBrand)}
            onMouseLeave={closeBrandMenu}
            className={cn(
              "border-border bg-popover text-popover-foreground absolute inset-x-0 top-full z-50 hidden border-t shadow-xl transition-[opacity,transform] duration-500 ease-out lg:block",
              shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
            )}
          >
            <BrandMegaPanel menu={appleMegaMenus[panelBrand]} onNavigate={closeNow} />
          </div>
        )}
      </header>
    </>
  );
}

const MEGA_RELATED_LINKS = [
  { label: "Багц сонгох", href: "/main-packages" },
  { label: "Төхөөрөмж", href: "/devices" },
  { label: "Тусламж", href: "/support" },
  { label: "Бүх урамшуулал", href: "/campaigns" },
];

function BrandMegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  const linkCls = cn(
    navType.primaryLink,
    "text-foreground hover:text-primary block transition-colors",
  );

  return (
    <div className="mx-auto flex max-w-300 items-start gap-16 px-4 py-10">
      <div>
        <h3 className={cn(navType.groupLabel, "mb-4")}>{menu.name}</h3>
        <ul className="space-y-3">
          {menu.sections.map((section) =>
            section.href.startsWith("http") ? (
              <li key={section.id}>
                <a
                  href={section.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  {section.title}
                </a>
              </li>
            ) : (
              <li key={section.id}>
                <Link href={section.href} onClick={onNavigate} className={linkCls}>
                  {section.title}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="w-52 shrink-0">
        <h3 className={cn(navType.groupLabel, "mb-4")}>Холбоотой</h3>
        <ul className="space-y-2.5">
          {MEGA_RELATED_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className={cn(
                  navType.secondaryLink,
                  "text-foreground/80 hover:text-foreground block transition-colors",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="ml-auto w-72 shrink-0 space-y-4">
        {currentPromos.map((promo) => (
          <PromoCard key={promo.title} promo={promo} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function GroupHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
      <div className="bg-muted/40 border-border hidden border-b lg:block">
        <div className="mx-auto flex h-8 max-w-300 items-center px-4">
          <AudienceSwitchTabs
            segments={classifierSegments}
            activeId="personal"
            hover={false}
            triggerClassName={navType.bar}
          />
        </div>
      </div>

      {/* Main row — лого + mega-menu nav + icons (h-12, багассан) */}
      <div className="mx-auto flex h-12 max-w-300 items-center justify-between gap-4 px-4">
        <EcoLogo />

        <div className="hidden flex-1 justify-start lg:flex">
          <Navigation variant="desktop" categories={groupNavV2} />
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          <IconButton label="Хайх">
            <Search className="size-5" />
          </IconButton>
          <AccountMenu />
          <ThemeToggle />
          <IconButton label="Хэл солих">
            <Globe className="size-5" />
          </IconButton>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 lg:hidden">
          <IconButton label="Хайх">
            <Search className="size-5" />
          </IconButton>
          <AccountMenu />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Цэс нээх">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-75 p-6 sm:w-90">
              <SheetHeader className="p-0">
                <SheetTitle>Цэс</SheetTitle>
              </SheetHeader>

              {/* Хувь хэрэглэгч / Байгууллага сегмент */}
              <div className="mt-4">
                <p className={cn(navType.groupLabel, "mb-1 px-2")}>Хэрэглэгчийн төрөл</p>
                <AudienceSwitchMobile
                  segments={classifierSegments}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>

              {/* Бүтээгдэхүүний nav */}
              <div className="border-border mt-4 border-t pt-4">
                <Navigation
                  variant="mobile"
                  categories={groupNavV2}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>

              {/* Theme / Хэл */}
              <div className="border-border mt-6 space-y-2 border-t pt-6">
                <MobileToggleRow label="Theme">
                  <ThemeToggle />
                </MobileToggleRow>
                <MobileToggleRow label="Хэл солих">
                  <Globe className="size-5" />
                </MobileToggleRow>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// ХУВИЛБАР 3 — Single-row (whiteboard sketch-ийн дагуу):
//   Ганц мөр (нэг layer). Зүүн: эко брэнд + Mobile + Тусламж nav.
//   Төв (гол): Unitel үгэн лого.
//   Баруун: Хувь хэрэглэгч / Байгууллага ангилагч + профайл (бусад icon-гүй).
// =====================================================================
function HybridHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeBrand = useActiveBrand();

  // Hover mega-menu — Хувилбар 1-ийн sub-menu дата (appleMegaMenus), гэхдээ
  // зөвхөн Unitel / Univision дээр. Бусад линк хэвээрээ энгийн линк.
  const { openMenu, panelBrand, shown, openBrandMenu, closeBrandMenu, closeNow } =
    useBrandMegaMenu();
  const V3_MEGA_BRANDS = ["Unitel", "Univision"];

  // Ганц эгнээний nav — эко брэнд + Mobile + Тусламж
  const v3Nav: EcosystemLink[] = [
    { name: "Unitel", href: "/unitel" },
    { name: "Univision", href: "/univision" },
    { name: "Toki", href: "https://toki.mn/", external: true },
    { name: "Mobile", href: "/main-packages" },
    { name: "LookTV", href: "https://looktv.mn/", external: true },
    { name: "Тусламж", href: "/support" },
  ];
  // Баруун талын ангилагч (Хувь хэрэглэгч / Байгууллага) — module-level
  // classifierSegments-ийг Хувилбар 2-той хуваалцана.

  return (
    <>
      {/* Apple шиг scrim — mega-menu нээгдэхэд body бүдгэрнэ (Хувилбар 1-тэй ижил) */}
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
        {/* Desktop — ганц мөр: зүүн nav · төв Unitel лого · баруун ангилагч + профайл */}
        <div className="mx-auto hidden h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
          {/* Зүүн — эко брэнд nav */}
          <nav aria-label="Үндсэн цэс" className="flex items-center gap-5">
            {v3Nav.map((brand) => {
              const active = !brand.external && brand.name === activeBrand;
              const linkClass = cn(
                "relative whitespace-nowrap transition-colors",
                // Apple маягийн зөөлөн доогуур зураас (Хувилбар 1-тэй ижил) — hover дээр төвөөс тэлнэ
                "after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
                active
                  ? cn(navType.barActive, "text-foreground")
                  : cn(navType.bar, "text-foreground/75 hover:text-foreground"),
              );

              // Unitel / Univision — hover дээр Хувилбар 1-ийн mega panel нээнэ
              const menu =
                !brand.external && V3_MEGA_BRANDS.includes(brand.name)
                  ? appleMegaMenus[brand.name]
                  : undefined;
              if (menu) {
                return (
                  <div
                    key={brand.name}
                    className="flex items-center"
                    onMouseEnter={() => openBrandMenu(brand.name)}
                    onMouseLeave={closeBrandMenu}
                  >
                    <Link
                      href={brand.href}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={openMenu === brand.name}
                      className={cn(
                        linkClass,
                        openMenu === brand.name && "text-foreground after:scale-x-100",
                      )}
                    >
                      {brand.name}
                    </Link>
                  </div>
                );
              }

              return brand.external ? (
                <a
                  key={brand.name}
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {brand.name}
                </a>
              ) : (
                <Link
                  key={brand.name}
                  href={brand.href}
                  aria-current={active ? "page" : undefined}
                  className={linkClass}
                >
                  {brand.name}
                </Link>
              );
            })}
          </nav>

          {/* Төв (гол) — Unitel үгэн лого */}
          <div className="flex justify-center">
            <UnitelLogo />
          </div>

          {/* Баруун — Хувь хэрэглэгч / Байгууллага ангилагч + профайл */}
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

        {/* Mobile — цэс · лого · профайл */}
        <div className="mx-auto flex h-11 max-w-300 items-center justify-between px-4 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Цэс нээх">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-75 p-6 sm:w-90">
              <SheetHeader className="p-0">
                <SheetTitle>Цэс</SheetTitle>
              </SheetHeader>

              {/* Nav линкүүд */}
              <ul className="mt-4 space-y-1">
                {v3Nav.map((brand) => (
                  <li key={brand.name}>
                    {brand.external ? (
                      <a
                        href={brand.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          navType.mobileLink,
                          "hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 transition-colors",
                        )}
                      >
                        <span>{brand.name}</span>
                        <ArrowUpRight
                          className="text-muted-foreground ml-auto size-4"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <Link
                        href={brand.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          navType.mobileLink,
                          "hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 transition-colors",
                        )}
                      >
                        <span>{brand.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Ангилагч — Хувь хэрэглэгч / Байгууллага */}
              <div className="border-border mt-4 border-t pt-4">
                <p className={cn(navType.groupLabel, "mb-1 px-2")}>Хэрэглэгчийн төрөл</p>
                <AudienceSwitchMobile
                  segments={classifierSegments}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>

          <UnitelLogo />

          <AccountMenu />
        </div>

        {/* Desktop hover mega-menu — Хувилбар 1-ийн панел, зөвхөн Unitel/Univision */}
        {panelBrand && appleMegaMenus[panelBrand] && (
          <div
            onMouseEnter={() => openBrandMenu(panelBrand)}
            onMouseLeave={closeBrandMenu}
            className={cn(
              // Панелийн дэвсгэр — Хувилбар 2-ын dropdown-той ижил bg-popover (--background-2)
              "border-border bg-popover text-popover-foreground absolute inset-x-0 top-full z-50 hidden border-t shadow-xl transition-[opacity,transform] duration-500 ease-out lg:block",
              shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
            )}
          >
            <BrandMegaPanel menu={appleMegaMenus[panelBrand]} onNavigate={closeNow} />
          </div>
        )}
      </header>
    </>
  );
}

// =====================================================================
// ХУВИЛБАР 4 (Chat) — Apple маягийн цэвэр header (Хувилбар 1 шиг: лого · төв nav ·
// icons) + Хувилбар 2-ийн ангилал (groupNavV2). Mega menu задрахад Apple-style
// panel (navigation.tsx): зүүн "Хувь хэрэглэгч" тод жагсаалт, баруун "Бизнес
// эрхлэгч бол" quick links. Нүүр хуудас нь chat-hero (page.tsx).
// =====================================================================
function ChatHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
      {/* Desktop — лого · төв mega-menu nav · icons (Хувилбар 1 шиг) */}
      <div className="mx-auto hidden h-12 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
        <div className="flex items-center">
          <EcoLogo />
        </div>
        <div className="flex justify-center">
          <Navigation variant="desktop" categories={groupNavV2} panel="apple" />
        </div>
        <div className="flex items-center justify-end gap-0.5">
          <IconButton label="Хайх">
            <Search className="size-5" />
          </IconButton>
          <AccountMenu />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile — лого · icons + цэс */}
      <div className="mx-auto flex h-12 max-w-300 items-center justify-between px-4 lg:hidden">
        <EcoLogo />
        <div className="flex items-center gap-0.5">
          <IconButton label="Хайх">
            <Search className="size-5" />
          </IconButton>
          <AccountMenu />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Цэс нээх">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 p-6 sm:w-90">
              <SheetHeader className="p-0">
                <SheetTitle>Цэс</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Navigation
                  variant="mobile"
                  categories={groupNavV2}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>
              <div className="border-border mt-6 space-y-2 border-t pt-6">
                <MobileToggleRow label="Theme">
                  <ThemeToggle />
                </MobileToggleRow>
                <MobileToggleRow label="Хэл солих">
                  <Globe className="size-5" />
                </MobileToggleRow>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// Туслах компонентууд
// =====================================================================

/** Эко swirl icon-лого (текстгүй, бүх хувилбарт нэгдсэн). Light: хар, Dark: цагаан. */
function EcoLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Нүүр">
      <Image
        src="/eco-logo.png"
        alt="Unitel"
        width={28}
        height={28}
        preload
        className="h-7 w-7 dark:hidden"
      />
      <Image
        src="/eco-logo-dark.png"
        alt="Unitel"
        width={28}
        height={28}
        preload
        className="hidden h-7 w-7 dark:block"
      />
    </Link>
  );
}

/**
 * Unitel үгэн лого (wordmark) — Хувилбар 3-ын төвд (гол). viewBox 2470×510.
 * Light: хар + ногоон · Dark: цагаан + ногоон (EcoLogo-той ижил зарчим).
 */
function UnitelLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Unitel — Нүүр">
      <Image
        src="/unitel-logo.svg"
        alt="Unitel"
        width={116}
        height={24}
        preload
        className="h-6 w-auto dark:hidden"
      />
      <Image
        src="/unitel-logo-dark.svg"
        alt="Unitel"
        width={116}
        height={24}
        preload
        className="hidden h-6 w-auto dark:block"
      />
    </Link>
  );
}

/**
 * Account товч — нэвтрээгүй бол login dialog нээнэ, нэвтэрсэн бол хэрэглэгчийн
 * нэр + "Гарах"-тай dropdown харуулна.
 */
function AccountMenu() {
  const { isAuthenticated, user, openLogin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="icon" aria-label="Нэвтрэх" onClick={() => openLogin()}>
        <User className="size-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Миний бүртгэл" className="relative">
          <User className="size-5" />
          <span
            className="bg-primary ring-background absolute top-1.5 right-1.5 size-2 rounded-full ring-2"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className={cn(navType.secondaryLink, "block")}>{user?.name}</span>
          <span className={cn(navType.body, "text-muted-foreground block")}>Нэвтэрсэн</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Гарах
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Icon-only ghost button */
function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Button variant="ghost" size="icon" aria-label={label}>
      {children}
    </Button>
  );
}

/** Mobile-ийн Sheet дотор тогтсон toggle мөр */
function MobileToggleRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="hover:bg-muted flex items-center justify-between rounded-md px-2 py-2 transition-colors">
      <span className={navType.mobileLink}>{label}</span>
      {children}
    </div>
  );
}
