"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
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
  customerSegments,
  ecosystemBrands,
  mainNav,
  mainNavLegacy,
  unitelDomains,
  unitelNav,
  univisionDomains,
  type AudienceSegment,
  type EcosystemLink,
  type NavCategory,
} from "@/data/navigation";
import { brandPages, type BrandPage } from "@/data/brand-pages";
import { cn } from "@/lib/utils";

// Шинэ header хувилбарууд — дээд toggle-оор солино:
//   1 = Apple  (нэгдсэн эко-систем, ганц нимгэн nav)
//   2 = Груп   (хуучин маягийн header + Mobile/Өрх/Байгууллага сегмент hover-card)
//   3 = Unitel (Unitel.mn домэйны мобайл үйлчилгээний брэндүүд header дээр)
//   4 = Univision (Univision.mn — V3-тэй ижил бүтэц, Univision-ий тал)
//   5 = Swisscom (хуучин маягийн header; nav = бизнес үйлчилгээ, top bar = эко-систем)
//   6 = Хэрэглэгч (V2-той ижил бүтэц; сегмент = Хувь хэрэглэгч/Байгууллага/Бидний тухай)
type Variant = 1 | 2 | 3 | 4 | 5 | 6;
const VARIANTS: { id: Variant; label: string }[] = [
  { id: 1, label: "Хувилбар 1 · Apple" },
  { id: 2, label: "Хувилбар 2 · Business line" },
  { id: 3, label: "Хувилбар 3.1 · Unitel" },
  { id: 4, label: "Хувилбар 3.2 · Univision" },
  { id: 5, label: "Хувилбар 5 · Domain" },
  { id: 6, label: "Хувилбар 6 · Хэрэглэгчийн урсгал" },
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
  return v === "2" ? 2 : v === "3" ? 3 : v === "4" ? 4 : v === "5" ? 5 : v === "6" ? 6 : 1;
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
      ) : variant === 5 ? (
        <SwisscomHeader />
      ) : variant === 6 ? (
        <CustomerHeader />
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
    <div
      role="group"
      aria-label="Header хувилбар сонгох"
      className="bg-foreground text-background flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 text-xs"
    >
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

// Одоо байгаа сайт — nav дээр тодотгож "хаана байгаагаа" мэдэгдэнэ
const CURRENT_BRAND = "Univision";

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
    <header className="bg-background/80 sticky top-0 z-50 backdrop-blur relative" role="banner">
      {/* Desktop */}
      <div className="mx-auto hidden h-11 max-w-300 grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
        <div className="flex items-center">
          <EcoLogo />
        </div>

        <nav aria-label="Эко-систем" className="flex items-center justify-center gap-5">
          {ecosystemBrands.map((brand) => {
            const active = brand.name === activeBrand;
            const linkClass = cn(
              "text-[13px] font-medium transition-colors",
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
                    className={cn(linkClass, openMenu === brand.name && "text-foreground")}
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
                <SheetTitle>Эко-систем</SheetTitle>
              </SheetHeader>

              <ul className="mt-4 space-y-1">
                {ecosystemBrands.map((brand) => {
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
function BrandMegaPanel({ page, onNavigate }: { page: BrandPage; onNavigate: () => void }) {
  const sections = page.sections.filter((s) => s.items.length > 0);

  // Холбоотой цөөн линк — sample placeholder-ууд (дараа солино) + бодит линк
  const relatedLinks = [
    { label: "Sample цэс 1", href: "#" },
    { label: "Sample цэс 2", href: "#" },
    { label: "Sample цэс 3", href: "#" },
    ...(page.promo ? [{ label: page.promo.ctaLabel, href: page.promo.href }] : []),
    { label: "Урамшуулал", href: "/campaigns" },
  ];

  return (
    <div className="mx-auto flex max-w-[1200px] gap-16 px-4 py-8">
      {/* ── Зүүн: үндсэн sub-menu — section гарчгууд том, bold ── */}
      <div>
        <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          {page.name}
        </h3>
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                href={`/${page.slug}#${section.id}`}
                onClick={onNavigate}
                className="text-foreground hover:text-primary block text-xl font-semibold tracking-tight transition-colors"
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Баруун: холбоотой цөөн линк ── */}
      <div>
        <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          Холбоотой
        </h3>
        <ul className="space-y-2.5">
          {relatedLinks.map((link) => (
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
      </div>
    </div>
  );
}

// =====================================================================
// ХУВИЛБАР 2 · 6 — Хуучин маягийн header (лого + бүтээгдэхүүний nav + icons),
// дээд талд группын компаниуд сегментээр, hover дээр гишүүн брэндийн товч
// мэдээлэлтэй картууд. V2 = Mobile/Өрх/Байгууллага (default сегмент),
// V6 = Хувь хэрэглэгч/Байгууллага/Бидний тухай (customerSegments + activeId).
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
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
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
// ХУВИЛБАР 3 · 4 — нэг домэйнд төвлөрсөн header-ийн дундын бүтэц.
// Дээд bar: тухайн сайттай холбоотой домэйнууд (одоо байгаа нь тодотгогдоно);
// үндсэн мөр: лого + бүтээгдэхүүний nav + icons. Шинэ домэйн-хувилбар
// нэмэхдээ доорх UnitelHeader / UnivisionHeader шиг thin wrapper л бичнэ.
// =====================================================================
function DomainHeader({
  domains,
  activeDomain,
  categories,
  logo,
  sheetTitle,
  domainsTitle = "Холбоотой",
}: {
  /** Дээд bar-т гарах холбоотой домэйнууд */
  domains: EcosystemLink[];
  /** Одоо байгаа сайт — top bar дээр тодотгогдоно */
  activeDomain: string;
  /** Үндсэн nav-ын ангилал */
  categories: NavCategory[];
  logo: React.ReactNode;
  /** Mobile Sheet-ийн гарчиг */
  sheetTitle: string;
  /** Mobile Sheet доторх домэйн жагсаалтын гарчиг */
  domainsTitle?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background border-border sticky top-0 z-50 border-b" role="banner">
      {/* Top bar — холбоотой домэйнууд. Одоо байгаа сайт тодотгогдоно. */}
      <div className="bg-muted/40 border-border hidden border-b lg:block">
        <div className="mx-auto flex h-9 max-w-300 items-center gap-1 px-4">
          {domains.map((d) => {
            const active = d.name === activeDomain;
            return (
              <a
                key={d.name}
                href={d.href}
                target={d.external && !active ? "_blank" : undefined}
                rel={d.external && !active ? "noopener noreferrer" : undefined}
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

      {/* Main row — лого + бүтээгдэхүүний mega-menu + icons */}
      <div className="mx-auto flex h-14 max-w-300 items-center justify-between gap-4 px-4 lg:h-16">
        {logo}

        <div className="hidden flex-1 justify-start lg:flex">
          <Navigation variant="desktop" categories={categories} />
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
                <SheetTitle>{sheetTitle}</SheetTitle>
              </SheetHeader>

              {/* Бүтээгдэхүүний nav */}
              <div className="mt-4">
                <Navigation
                  variant="mobile"
                  categories={categories}
                  onItemClick={() => setMobileOpen(false)}
                />
              </div>

              {/* Холбоотой домэйнууд */}
              <div className="border-border mt-4 border-t pt-4">
                <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  {domainsTitle}
                </p>
                <ul className="space-y-1">
                  {domains.map((d) => (
                    <li key={d.name}>
                      <a
                        href={d.href}
                        target={d.external ? "_blank" : undefined}
                        rel={d.external ? "noopener noreferrer" : undefined}
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

// ХУВИЛБАР 3 — Unitel.mn: мобайл үйлчилгээтэй холбоотой брэндүүд (Unitel · Toki · Nexmind)
function UnitelHeader() {
  return (
    <DomainHeader
      domains={unitelDomains}
      activeDomain="Unitel"
      categories={unitelNav}
      logo={<UnitelLogo />}
      sheetTitle="Unitel.mn"
    />
  );
}

// ХУВИЛБАР 4 — Univision.mn: V3-тэй ижил бүтэц, Univision-ий тал (mainNavLegacy)
function UnivisionHeader() {
  return (
    <DomainHeader
      domains={univisionDomains}
      activeDomain="Univision"
      categories={mainNavLegacy}
      logo={<UnivisionLogo />}
      sheetTitle="Univision.mn"
    />
  );
}

// ХУВИЛБАР 5 — Swisscom маяг: үндсэн nav нь группын эрхэлдэг бизнес
// үйлчилгээнүүд (Мобайл · Интернэт · Телевиз · Life-style · Урамшуулал),
// дээд bar-т Хувилбар 1-ийн nav дээрх эко-системийн бүх брэнд.
function SwisscomHeader() {
  return (
    <DomainHeader
      domains={ecosystemBrands}
      activeDomain={CURRENT_BRAND}
      categories={mainNav}
      logo={<UnivisionLogo />}
      sheetTitle="Univision"
      domainsTitle="Эко-систем"
    />
  );
}

// ХУВИЛБАР 6 — V2-той ижил бүтэц; top bar-ын баруун талд Хувь хэрэглэгч /
// Байгууллага / Бидний тухай сегмент. Одоо байгаа сегмент (Хувь хэрэглэгч) тодотгогдоно.
function CustomerHeader() {
  return <GroupHeader segments={customerSegments} activeSegmentId="personal" segmentsAlign="end" />;
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
        preload
        className="h-6 w-6 dark:hidden"
      />
      <Image
        src="/eco-logo-dark.png"
        alt="Эко-систем"
        width={24}
        height={24}
        preload
        className="hidden h-6 w-6 dark:block"
      />
    </Link>
  );
}

/** Unitel wordmark лого (Хувилбар 3). Light/dark хувилбартай. */
function UnitelLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Unitel нүүр">
      <Image
        src="/unitel-logo.svg"
        alt="Unitel"
        width={135}
        height={28}
        preload
        className="h-6 w-auto dark:hidden"
      />
      <Image
        src="/unitel-logo-dark.svg"
        alt="Unitel"
        width={135}
        height={28}
        preload
        className="hidden h-6 w-auto dark:block"
      />
    </Link>
  );
}

/** Univision wordmark лого (Хувилбар 2, 4). Light/dark хувилбартай. */
function UnivisionLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Univision нүүр">
      <Image
        src="/univision-logo.svg"
        alt="Univision"
        width={140}
        height={32}
        preload
        className="block h-6 w-auto lg:h-7 dark:hidden"
      />
      <Image
        src="/univision-logo-dark.svg"
        alt="Univision"
        width={140}
        height={32}
        preload
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
