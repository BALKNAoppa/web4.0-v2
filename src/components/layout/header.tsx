"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Menu, Search, User, Globe, LogOut, ArrowUpRight } from "lucide-react";

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
import { useAuth } from "@/components/auth/auth-provider";
import {
  ecosystemBrands,
  mainNavLegacy,
  unitelDomains,
  unitelNav,
  univisionDomains,
} from "@/data/navigation";
import { cn } from "@/lib/utils";

// Шинэ header хувилбарууд — дээд toggle-оор солино:
//   1 = Apple  (нэгдсэн эко-систем, ганц нимгэн nav)
//   2 = Груп   (хуучин маягийн header + Mobile/Өрх/Байгууллага сегмент hover-card)
//   3 = Unitel (Unitel.mn домэйны мобайл үйлчилгээний брэндүүд header дээр)
//   4 = Univision (Univision.mn — V3-тэй ижил бүтэц, Univision-ий тал)
type Variant = 1 | 2 | 3 | 4;
const VARIANTS: { id: Variant; label: string }[] = [
  { id: 1, label: "Хувилбар 1 · Apple" },
  { id: 2, label: "Хувилбар 2 · Груп" },
  { id: 3, label: "Хувилбар 3 · Unitel" },
  { id: 4, label: "Хувилбар 4 · Univision" },
];

const VARIANT_KEY = "uv-header-variant-new";
const VARIANT_EVENT = "uv-header-variant-new-change";

function subscribeVariant(cb: () => void) {
  window.addEventListener(VARIANT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(VARIANT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
const getVariantSnapshot = (): Variant => {
  const v = window.localStorage.getItem(VARIANT_KEY);
  return v === "2" ? 2 : v === "3" ? 3 : v === "4" ? 4 : 1;
};
const getVariantServerSnapshot = (): Variant => 1;

function setHeaderVariant(v: Variant) {
  window.localStorage.setItem(VARIANT_KEY, String(v));
  window.dispatchEvent(new Event(VARIANT_EVENT));
}

export function Header() {
  const variant = useSyncExternalStore(
    subscribeVariant,
    getVariantSnapshot,
    getVariantServerSnapshot,
  );

  return (
    <>
      <VariantToggle variant={variant} onChange={setHeaderVariant} />
      {variant === 2 ? (
        <GroupHeader />
      ) : variant === 3 ? (
        <UnitelHeader />
      ) : variant === 4 ? (
        <UnivisionHeader />
      ) : (
        <AppleHeader />
      )}
    </>
  );
}

/**
 * Хувилбар сонгох toggle — дэлгэцийн дээд талд, хэвийн урсгалд (header дээр
 * давхцахгүй). Шийдсэний дараа энэ toggle-ийг устгана.
 */
function VariantToggle({
  variant,
  onChange,
}: {
  variant: Variant;
  onChange: (v: Variant) => void;
}) {
  return (
    <div className="bg-foreground text-background flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 text-xs">
      {VARIANTS.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onChange(v.id)}
          aria-pressed={variant === v.id}
          className={cn(
            "rounded-full px-3 py-0.5 font-medium transition-colors",
            variant === v.id
              ? "bg-background text-foreground"
              : "text-background/80 hover:bg-background/15",
          )}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

// =====================================================================
// ХУВИЛБАР 1 — Apple-аас санаа авсан нэгдсэн эко-системийн nav.
// Зүүн: жижиг лого · Төв: группын брэндүүд · Баруун: хайлт + профайл.
// =====================================================================
function AppleHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background/80 sticky top-0 z-50 backdrop-blur" role="banner">
      {/* Desktop */}
      <div className="mx-auto hidden h-11 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
        <div className="flex items-center">
          <EcoLogo />
        </div>

        <nav aria-label="Эко-систем" className="flex items-center justify-center gap-5">
          {ecosystemBrands.map((brand) => (
            <a
              key={brand.name}
              href={brand.href}
              target={brand.external ? "_blank" : undefined}
              rel={brand.external ? "noopener noreferrer" : undefined}
              className="text-foreground/75 hover:text-foreground text-[13px] font-medium transition-colors"
            >
              {brand.name}
            </a>
          ))}
          <Link
            href="/support"
            className="text-foreground/75 hover:text-foreground text-[13px] font-medium transition-colors"
          >
            Тусламж
          </Link>
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
      <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-4 lg:hidden">
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
                <SheetTitle>Эко-систем</SheetTitle>
              </SheetHeader>

              <ul className="mt-4 space-y-1">
                {ecosystemBrands.map((brand) => (
                  <li key={brand.name}>
                    <a
                      href={brand.href}
                      target={brand.external ? "_blank" : undefined}
                      rel={brand.external ? "noopener noreferrer" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors"
                    >
                      <span>{brand.name}</span>
                      <ArrowUpRight
                        className="text-muted-foreground ml-auto size-4"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/support"
                    onClick={() => setMobileOpen(false)}
                    className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors"
                  >
                    <span>Тусламж</span>
                  </Link>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// ХУВИЛБАР 2 — Хуучин маягийн header (лого + бүтээгдэхүүний nav + icons),
// дээд талд группын компаниуд Mobile / Өрх / Байгууллага сегментээр,
// hover дээр гишүүн брэндийн товч мэдээлэлтэй картууд.
// =====================================================================
function GroupHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
      {/* Top bar — группын сегментүүд (hover дээр брэнд карт) */}
      <div className="bg-muted/40 border-border hidden border-b lg:block">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center px-4">
          <AudienceSwitchTabs />
        </div>
      </div>

      {/* Main row — лого + бүтээгдэхүүний nav + icons */}
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 lg:h-16">
        <UnivisionLogo />

        <div className="hidden flex-1 justify-start lg:flex">
          <Navigation variant="desktop" categories={mainNavLegacy} />
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

              {/* Группын сегментүүд */}
              <div className="mt-4">
                <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  Групп
                </p>
                <AudienceSwitchMobile onItemClick={() => setMobileOpen(false)} />
              </div>

              {/* Бүтээгдэхүүний nav */}
              <div className="border-border mt-4 border-t pt-4">
                <Navigation
                  variant="mobile"
                  categories={mainNavLegacy}
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
// ХУВИЛБАР 3 — Unitel.mn домэйны мобайл үйлчилгээтэй холбоотой брэндүүд
// (Unitel · Toki · Nexmind) header дээр шууд харагдана.
// =====================================================================
function UnitelHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
      {/* Top bar — Mobile-тэй холбоотой домэйнууд. Одоо байгаа сайт (Unitel) тодотгогдоно. */}
      <div className="bg-muted/40 border-border hidden border-b lg:block">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center gap-1 px-4">
          {unitelDomains.map((d) => {
            const active = d.name === "Unitel";
            return (
              <a
                key={d.name}
                href={d.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors sm:text-sm",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                )}
              >
                {d.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Main row — Unitel брэнд + бүтээгдэхүүний mega-menu + icons */}
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 lg:h-16">
        <Link href="/" className="inline-flex items-center" aria-label="Unitel нүүр">
          <Image
            src="/unitel-logo.svg"
            alt="Unitel"
            width={135}
            height={28}
            priority
            className="h-6 w-auto dark:hidden"
          />
          <Image
            src="/unitel-logo-dark.svg"
            alt="Unitel"
            width={135}
            height={28}
            priority
            className="hidden h-6 w-auto dark:block"
          />
        </Link>

        <div className="hidden flex-1 justify-start lg:flex">
          <Navigation variant="desktop" categories={unitelNav} />
        </div>

        <div className="hidden items-center gap-0.5 lg:flex">
          <IconButton label="Хайх">
            <Search className="size-5" />
          </IconButton>
          <AccountMenu />
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-0.5 lg:hidden">
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
                <SheetTitle>Unitel.mn</SheetTitle>
              </SheetHeader>

              {/* Бүтээгдэхүүний nav */}
              <div className="mt-4">
                <Navigation
                  variant="mobile"
                  categories={unitelNav}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>

              {/* Холбоотой домэйнууд */}
              <div className="border-border mt-4 border-t pt-4">
                <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  Холбоотой
                </p>
                <ul className="space-y-1">
                  {unitelDomains.map((d) => (
                    <li key={d.name}>
                      <a
                        href={d.href}
                        onClick={() => setMobileOpen(false)}
                        className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors"
                      >
                        <span>{d.name}</span>
                        <ArrowUpRight
                          className="text-muted-foreground ml-auto size-4"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// ХУВИЛБАР 4 — Univision.mn (V3-тэй ижил бүтэц). Дээд bar: Univision-тэй
// холбоотой домэйнууд (Univision · Гэр интернэт · DDish); үндсэн nav нь
// Univision-ий бүтээгдэхүүн (mainNavLegacy).
// =====================================================================
function UnivisionHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
      {/* Top bar — Univision-тэй холбоотой домэйнууд. Одоо байгаа сайт (Univision) тодотгогдоно. */}
      <div className="bg-muted/40 border-border hidden border-b lg:block">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center gap-1 px-4">
          {univisionDomains.map((d) => {
            const active = d.name === "Univision";
            return (
              <a
                key={d.name}
                href={d.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors sm:text-sm",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                )}
              >
                {d.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Main row — Univision лого + бүтээгдэхүүний mega-menu + icons */}
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 lg:h-16">
        <UnivisionLogo />

        <div className="hidden flex-1 justify-start lg:flex">
          <Navigation variant="desktop" categories={mainNavLegacy} />
        </div>

        <div className="hidden items-center gap-0.5 lg:flex">
          <IconButton label="Хайх">
            <Search className="size-5" />
          </IconButton>
          <AccountMenu />
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-0.5 lg:hidden">
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
                <SheetTitle>Univision.mn</SheetTitle>
              </SheetHeader>

              {/* Бүтээгдэхүүний nav */}
              <div className="mt-4">
                <Navigation
                  variant="mobile"
                  categories={mainNavLegacy}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>

              {/* Холбоотой домэйнууд */}
              <div className="border-border mt-4 border-t pt-4">
                <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  Холбоотой
                </p>
                <ul className="space-y-1">
                  {univisionDomains.map((d) => (
                    <li key={d.name}>
                      <a
                        href={d.href}
                        onClick={() => setMobileOpen(false)}
                        className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors"
                      >
                        <span>{d.name}</span>
                        <ArrowUpRight
                          className="text-muted-foreground ml-auto size-4"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
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

/** Эко-системийн жижиг icon-лого (Хувилбар 1). Light: хар, Dark: цагаан. */
function EcoLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Нүүр">
      <Image
        src="/eco-logo.png"
        alt="Эко-систем"
        width={24}
        height={24}
        priority
        className="h-6 w-6 dark:hidden"
      />
      <Image
        src="/eco-logo-dark.png"
        alt="Эко-систем"
        width={24}
        height={24}
        priority
        className="hidden h-6 w-6 dark:block"
      />
    </Link>
  );
}

/** Univision wordmark лого (Хувилбар 2 — хуучин маяг). Light/dark хувилбартай. */
function UnivisionLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Univision нүүр">
      <Image
        src="/univision-logo.svg"
        alt="Univision"
        width={140}
        height={32}
        priority
        className="block h-6 w-auto lg:h-7 dark:hidden"
      />
      <Image
        src="/univision-logo-dark.svg"
        alt="Univision"
        width={140}
        height={32}
        priority
        className="hidden h-6 w-auto lg:h-7 dark:block"
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
          <span className="block text-sm font-semibold">{user?.name}</span>
          <span className="text-muted-foreground block text-xs font-normal">Нэвтэрсэн</span>
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
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}
