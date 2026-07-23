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
  ArrowRight,
  Layers,
  ChevronDown,
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
import { useAuth } from "@/components/auth/auth-provider";
import {
  appleNavCategories,
  ecosystemBrands,
  mainNavLegacy,
  type AudienceSegment,
} from "@/data/navigation";
import { brandPages, type BrandPage } from "@/data/brand-pages";
import { useHeaderVariant, setHeaderVariant, type HeaderVariant } from "@/lib/header-variant";
import { cn } from "@/lib/utils";

// Шинэ header хувилбарууд — дээд toggle-оор солино (store: lib/header-variant):
//   1 = Apple  (нэгдсэн эко-систем, ганц нимгэн nav)
//   2 = Business line (хуучин маягийн header + Хувь хэрэглэгч/Өрх/Байгууллага сегмент)
//   3 = Hybrid (1 + 2): дээд bar = сегмент switcher, үндсэн nav = эко брэндийн нэрс
//   4 = Chat (header нь Хувилбар 1 шиг Apple; нүүр нь chat-hero — page.tsx удирдана)
type Variant = HeaderVariant;
const VARIANTS: { id: Variant; label: string }[] = [
  { id: 1, label: "Хувилбар 1 · Apple" },
  { id: 2, label: "Хувилбар 2 · Business line" },
  { id: 3, label: "Хувилбар 3 · Hybrid" },
  { id: 4, label: "Хувилбар 4 · Chat" },
];

export function Header() {
  const pathname = usePathname();
  const variant = useHeaderVariant();

  // /web4 — immersive концепцийн хуудас: header харуулахгүй
  if (pathname?.startsWith("/web4")) return null;

  return (
    <>
      <VariantToggle variant={variant} onChange={setHeaderVariant} />
      {variant === 2 ? <GroupHeader /> : variant === 3 ? <HybridHeader /> : <AppleHeader />}
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = VARIANTS.find((v) => v.id === variant);

  // Гадна дарахад хаах
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div
      role="group"
      aria-label="Header хувилбар сонгох"
      className="bg-foreground text-background flex items-center justify-end px-4 py-1.5 text-xs"
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

        {/* Dropdown — босоо жагсаалт, баруун ирмэгээс доош унжина */}
        {open && (
          <div
            role="menu"
            className="border-background/15 bg-foreground animate-in fade-in slide-in-from-top-1 absolute top-full right-0 z-[70] mt-1.5 flex min-w-52 flex-col gap-0.5 rounded-xl border p-1.5 shadow-2xl duration-150"
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
    </div>
  );
}

// =====================================================================
// ХУВИЛБАР 1 — Apple-аас санаа авсан нэгдсэн эко-системийн nav.
// Зүүн: жижиг лого · Төв: группын брэндүүд · Баруун: хайлт + профайл.
// =====================================================================

/**
 * Дотоод брэнд хуудсан дээр (/unitel, /univision) л тухайн брэндийг тодотгоно —
 * "тэнд нь байгаа" мэдрэмж өгнө. Бусад хуудсанд аль нь ч тодрохгүй.
 */
function useActiveBrand(): string | null {
  const pathname = usePathname();
  const brand = ecosystemBrands.find(
    (b) => !b.external && b.href !== "/" && pathname.startsWith(b.href),
  );
  return brand?.name ?? null;
}

function AppleHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeBrand = useActiveBrand();

  // Эко-систем nav-ын hover mega-menu (зөвхөн desktop). Триггерээс панел руу
  // хулгана шилжихэд хаагдахгүйгээр богино саатал (150ms) тавина.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openBrandMenu = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(name);
  };
  const closeBrandMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  return (
    <header className="bg-background/80 relative sticky top-0 z-50 backdrop-blur" role="banner">
      {/* Desktop */}
      <div className="mx-auto hidden h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
        <div className="flex items-center">
          <EcoLogo />
        </div>

        <nav aria-label="Үндсэн цэс" className="flex items-center justify-center gap-5">
          {appleNavCategories.map((brand) => {
            const active = brand.name === activeBrand;
            const linkClass = cn(
              "relative text-[13px] font-medium transition-colors",
              // Apple маягийн зөөлөн доогуур зураас — hover дээр төвөөс тэлнэ
              "after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
              active ? "text-foreground font-semibold" : "text-foreground/75 hover:text-foreground",
            );

            // Дотоод брэнд + mega-menu дата байвал hover дээр панел нээнэ
            const menu = !brand.external ? brandPages[brand.name] : undefined;
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
                    "hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors",
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

      {/* Desktop hover mega-menu — эко-систем брэндийн доор бүтэн өргөнөөр */}
      {openMenu && brandPages[openMenu] && (
        <div
          key={openMenu}
          onMouseEnter={() => openBrandMenu(openMenu)}
          onMouseLeave={closeBrandMenu}
          className="border-border bg-background/95 animate-in fade-in slide-in-from-top-1 absolute inset-x-0 top-full hidden border-t shadow-lg backdrop-blur duration-300 ease-out lg:block"
        >
          <BrandMegaPanel page={brandPages[openMenu]} onNavigate={() => setOpenMenu(null)} />
        </div>
      )}
    </header>
  );
}

/**
 * Apple маягийн минимал brand mega-panel. Зүүн: үндсэн sub-menu — section-ийн
 * гарчгууд (Дараа төлбөрт, Урьдчилсан төлбөрт г.м.) ТОМ, BOLD, anchor руу.
 * Баруун: зөвхөн шаардлагатай холбоотой цөөн линк (дэлгэрэнгүй items хасагдсан).
 */
/** Эко-системийн бүх брэндэд ерөнхий, бодит хуудас руу чиглэсэн холбоос */
const MEGA_RELATED_LINKS = [
  { label: "Багц сонгох", href: "/main-packages" },
  { label: "Төхөөрөмж", href: "/devices" },
  { label: "Тусламж", href: "/support" },
  { label: "Бүх урамшуулал", href: "/campaigns" },
];

function BrandMegaPanel({ page, onNavigate }: { page: BrandPage; onNavigate: () => void }) {
  const sections = page.sections.filter((s) => s.items.length > 0);

  return (
    <div className="mx-auto flex max-w-[1200px] gap-12 px-4 py-8">
      {/* ── Зүүн: section гарчгууд (2 багана) + tagline ── */}
      <div className="flex-1">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {page.name}
        </h3>
        <p className="text-muted-foreground/80 mt-1 text-sm">{page.tagline}</p>
        <ul className="mt-5 grid grid-cols-2 gap-x-10 gap-y-4">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                href={`/${page.slug}#${section.id}`}
                onClick={onNavigate}
                className="text-foreground hover:text-primary block text-lg font-semibold tracking-tight transition-colors"
              >
                {section.title}
              </Link>
              {section.description && (
                <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                  {section.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Баруун: холбоотой линкүүд + урамшууллын карт ── */}
      <div className="w-64 shrink-0">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Холбоотой
        </h3>
        <ul className="mt-4 space-y-2.5">
          {MEGA_RELATED_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className="text-foreground/80 hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {page.promo && (
          <Link
            href={page.promo.href}
            onClick={onNavigate}
            className="border-border bg-muted/50 hover:bg-muted group mt-5 block rounded-xl border p-4 transition-colors"
          >
            <span className="text-primary text-[11px] font-bold tracking-wider uppercase">
              Урамшуулал
            </span>
            <p className="text-foreground mt-1 text-sm leading-snug font-medium">
              {page.promo.text}
            </p>
            <span className="text-primary mt-2 inline-flex items-center gap-1 text-xs font-semibold">
              {page.promo.ctaLabel}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// ХУВИЛБАР 2 — Хуучин маягийн header (лого + бүтээгдэхүүний nav + icons),
// дээд талд группын компаниуд сегментээр (Хувь хэрэглэгч/Өрх/Байгууллага), hover дээр
// гишүүн брэндийн товч мэдээлэлтэй картууд.
// =====================================================================
function GroupHeader({
  segments,
  activeSegmentId,
  segmentsAlign = "start",
}: {
  /** Top bar-ын сегментүүд (default: audienceSegments) */
  segments?: AudienceSegment[];
  /** Идэвхтэй сегмент — саарал дэвсгэрээр тодотгогдоно */
  activeSegmentId?: AudienceSegment["id"];
  /** Сегмент табуудын байрлал — top bar-ын зүүн ("start") эсвэл баруун ("end") тал */
  segmentsAlign?: "start" | "end";
} = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur"
      role="banner"
    >
      {/* Top bar — группын сегментүүд (hover дээр брэнд карт) */}
      <div className="bg-muted/40 border-border hidden border-b lg:block">
        <div
          className={cn(
            "mx-auto flex h-9 max-w-300 items-center px-4",
            segmentsAlign === "end" && "justify-end",
          )}
        >
          <AudienceSwitchTabs
            segments={segments}
            activeId={activeSegmentId}
            align={segmentsAlign}
          />
        </div>
      </div>

      {/* Main row — лого + бүтээгдэхүүний nav + icons */}
      <div className="mx-auto flex h-14 max-w-300 items-center justify-between gap-4 px-4 lg:h-16">
        <EcoLogo />

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
                <AudienceSwitchMobile
                  segments={segments}
                  onItemClick={() => setMobileOpen(false)}
                />
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
// ХУВИЛБАР 3 — Hybrid (Хувилбар 1 + 2):
//   Дээд bar   = Хувилбар 2-той ИЖИЛ сегмент switcher (audienceSegments, hover-той).
//   Үндсэн мөр = эко-системийн брэндийн нэрс (Хувилбар 1 шиг, энгийн линк) + icons.
// =====================================================================
function HybridHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeBrand = useActiveBrand();

  // Хувилбар 3-т зөвхөн эдгээр брэнд — бусдыг (DDish, Nexmind, OSS, U-point, PSN, ESN) хассан
  const order = ["Unitel", "Univision", "Look TV", "Toki"];
  const hybridBrands = ecosystemBrands
    .filter((b) => order.includes(b.name))
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

  return (
    <header
      className="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur"
      role="banner"
    >
      {/* Top bar — Хувилбар 2-той ижил сегмент switcher (hover-той) */}
      <div className="bg-muted/40 border-border hidden border-b lg:block">
        <div className="mx-auto flex h-9 max-w-300 items-center px-4">
          <AudienceSwitchTabs />
        </div>
      </div>

      {/* Main row — лого + эко-системийн брэндийн нэрс + icons */}
      <div className="mx-auto flex h-14 max-w-300 items-center justify-between gap-4 px-4 lg:h-16">
        <EcoLogo />

        {/* Эко-систем брэндийн нэрс — Хувилбар 1 шиг, mega-menu-гүй (hover унтраасан) */}
        <nav
          aria-label="Эко-систем"
          className="hidden flex-1 items-center justify-center gap-5 lg:flex"
        >
          {hybridBrands.map((brand) => {
            const active = brand.name === activeBrand;
            const linkClass = cn(
              "text-[13px] font-medium transition-colors",
              active ? "text-foreground font-semibold" : "text-foreground/75 hover:text-foreground",
            );
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
          <Link
            href="/support"
            className="text-foreground/75 hover:text-foreground text-[13px] font-medium transition-colors"
          >
            Тусламж
          </Link>
        </nav>

        {/* Desktop icons */}
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

              {/* Группын сегментүүд — Хувилбар 2-той ижил */}
              <div className="mt-4">
                <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  Групп
                </p>
                <AudienceSwitchMobile onItemClick={() => setMobileOpen(false)} />
              </div>

              {/* Эко-систем брэндүүд */}
              <div className="border-border mt-4 border-t pt-4">
                <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  Эко-систем
                </p>
                <ul className="space-y-1">
                  {hybridBrands.map((brand) => (
                    <li key={brand.name}>
                      {brand.external ? (
                        <a
                          href={brand.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors"
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
                          className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors"
                        >
                          <span>{brand.name}</span>
                        </Link>
                      )}
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
