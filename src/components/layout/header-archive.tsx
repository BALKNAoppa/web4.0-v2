"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * АРХИВ — АШИГЛАГДАХГҮЙ header хувилбарууд
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Эдгээрийг ХААНААС Ч import хийхгүй тул build-д орохгүй (dead code). Зөвхөн
 * лавлагаа болон хэрэгцээ гарвал буцааж авахад зориулж бүтнээр хадгалсан.
 *
 *   AppleHeader  — лого зүүн · төв ангилал · icons баруун (эх Хувилбар 1)
 *   GroupHeader  — дээд ангилагч мөр + лого · groupNavV2 nav · icons
 *   ChatHeader   — Apple маягийн цэвэр header + groupNavV2, chat-hero нүүртэй
 *
 * Ажиллаж байгаа хувилбарууд header.tsx дотор. Хуваалцах туслахууд
 * (BrandLogoLink, AccountMenu, BrandMegaPanel г.м.) header-shared.tsx дотор —
 * эндээс ч, тэндээс ч НЭГ эх сурвалжаас уншина.
 *
 * Буцааж ашиглах бол: header.tsx-д import хийж, VARIANTS жагсаалтад нэмнэ.
 */

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Globe, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Navigation } from "@/components/layout/navigation";
import { AudienceSwitchTabs, AudienceSwitchMobile } from "@/components/layout/audience-switch";
import {
  AccountMenu,
  BrandLogoLink,
  BrandMegaPanel,
  IconButton,
  MobileToggleRow,
  classifierSegments,
  useActiveBrand,
  useBrandMegaMenu,
} from "@/components/layout/header-shared";
import { appleMegaMenus, appleNavCategories, groupNavV2 } from "@/data/navigation";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

// =====================================================================
// ЭХ ХУВИЛБАР 1 (Apple) — лого зүүн · төв ангилал · icons баруун
// =====================================================================
export function AppleHeader() {
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
            <BrandLogoLink />
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
          <BrandLogoLink />

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

// =====================================================================
// ЭХ ХУВИЛБАР 2 (Group) — дээд ангилагч мөр + лого · groupNavV2 · icons
// =====================================================================
export function GroupHeader() {
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
        <BrandLogoLink />

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
// ЭХ ХУВИЛБАР 4 (Chat) — Apple маягийн цэвэр header + groupNavV2 ангилал.
// Mega menu задрахад Apple-style panel (navigation.tsx): зүүн "Хувь хэрэглэгч"
// тод жагсаалт, баруун "Бизнес эрхлэгч бол" quick links.
// =====================================================================
export function ChatHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
      {/* Desktop — лого · төв mega-menu nav · icons */}
      <div className="mx-auto hidden h-12 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
        <div className="flex items-center">
          <BrandLogoLink />
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
        <BrandLogoLink />
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
