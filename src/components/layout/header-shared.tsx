"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Gift,
  Globe,
  LogOut,
  Moon,
  Sun,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-provider";
import {
  customerSegments,
  ecosystemBrands,
  type AudienceSegment,
  type EcosystemLink,
  type MegaMenu,
  type MegaBranchStatus,
  type MegaMenuBranch,
  type MegaMenuSection,
} from "@/data/navigation";
import { promotionCards } from "@/data/promotions";
import { BRAND, BRAND_LABEL, type BrandId } from "@/lib/brand";
import { LOCALES, LOCALE_LABEL, setLocale, useLocale } from "@/lib/locale";
import { useT } from "@/lib/t";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

export const classifierSegments: AudienceSegment[] = [
  ...customerSegments.filter((s) => s.id === "personal"),
  {
    id: "business",
    label: "Байгууллага",
    href: "https://nexmind.mn/",
    external: true,
    icon: "building",
  },
  {
    id: "group",
    label: "Unitel Group",
    href: "https://unitelgroup.mn/",
    external: true,
    icon: "info",
  },
];

export function useActiveBrand(): string | null {
  const pathname = usePathname();
  const brand = ecosystemBrands.find(
    (b) => !b.external && b.href !== "/" && pathname.startsWith(b.href),
  );
  return brand?.name ?? null;
}

export const DOMAIN_NAV_NAME: string = BRAND_LABEL[BRAND];

export function useActiveNavName(items: EcosystemLink[]): string {
  return useCurrentNavName(items) ?? DOMAIN_NAV_NAME;
}

export function useCurrentNavName(items: EcosystemLink[]): string | null {
  const pathname = usePathname() ?? "";

  let best: { name: string; length: number } | null = null;
  for (const item of items) {
    if (item.external) continue;
    const base = item.href.split(/[?#]/)[0];
    if (base === "/" || !base.startsWith("/")) continue;
    if (pathname !== base && !pathname.startsWith(`${base}/`)) continue;
    if (!best || base.length > best.length) best = { name: item.name, length: base.length };
  }

  return best?.name ?? null;
}

export const MENU_PROMOS_HEADING = "Онцлох урамшуулал";

export const LOOKTV_MORPH_TEXTS = ["LookTV", "Илүүг Үз"];

export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return { isDark, toggle: () => setTheme(isDark ? "light" : "dark") };
}

const TOOL_PILL_ICON = "text-muted-foreground size-5 shrink-0";

export function LanguagePill({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${t("Хэл")} — ${LOCALE_LABEL[locale].short}`}
          className={className}
        >
          <Globe className={TOOL_PILL_ICON} aria-hidden="true" />
          <span className="text-[13px]">{LOCALE_LABEL[locale].short}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        role="radiogroup"
        aria-label={t("Хэл")}
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={12}
        className="flex w-[var(--radix-popover-trigger-width)] flex-col gap-0.5 rounded-2xl p-1 shadow-lg"
      >
        {LOCALES.map((id) => {
          const active = locale === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setLocale(id);
                setOpen(false);
              }}
              className={cn(
                "focus-visible:ring-ring min-h-9 shrink-0 rounded-xl px-1.5 text-[13px] whitespace-nowrap",
                "transition-colors focus-visible:ring-2 focus-visible:outline-none",
                active
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {LOCALE_LABEL[id].name}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function ProfilePill({ className, onDone }: { className?: string; onDone?: () => void }) {
  const { isAuthenticated, user, openLogin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        aria-label="Нэвтрэх"
        onClick={() => {
          onDone?.();
          setTimeout(() => openLogin(), 220);
        }}
        className={className}
      >
        <User className={TOOL_PILL_ICON} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        onDone?.();
      }}
      className={className}
    >
      <LogOut className="text-destructive size-5 shrink-0" aria-hidden="true" />
      <span className="sr-only">Гарах — {user?.name}</span>
    </button>
  );
}

export function ThemePill({ className }: { className?: string }) {
  const { isDark, toggle } = useThemeSwitch();

  return (
    <button type="button" onClick={toggle} className={className}>
      {isDark ? (
        <Moon className={TOOL_PILL_ICON} aria-hidden="true" />
      ) : (
        <Sun className={TOOL_PILL_ICON} aria-hidden="true" />
      )}
      <span className="sr-only">Theme солих — одоо {isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

export const MAINTENANCE_TEXT = "Maintain хийгдэж байгаа";

export const BRANCH_STATUS: Partial<Record<MegaBranchStatus, { text: string; Icon: LucideIcon }>> =
  {
    maintenance: { text: MAINTENANCE_TEXT, Icon: Wrench },
    "coming-soon": { text: "Coming soon…", Icon: Clock },
  };

export function BranchStatusNote({
  status,
  className,
  centered = false,
}: {
  status: MegaBranchStatus;
  className?: string;
  centered?: boolean;
}) {
  const info = BRANCH_STATUS[status];
  if (!info) return null;
  const { text, Icon } = info;

  if (centered) {
    return (
      <div
        className={cn(
          "flex h-full min-h-44 flex-col items-center justify-center gap-3 text-center",
          className,
        )}
      >
        <Icon className="text-muted-foreground size-10 opacity-40" aria-hidden="true" />
        <p className={cn(navType.body, "text-muted-foreground")}>{text}</p>
      </div>
    );
  }

  return (
    <p className={cn(navType.body, "text-muted-foreground flex items-center gap-2", className)}>
      <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
      {text}
    </p>
  );
}

export type MenuPromo = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image?: string;
};

const MENU_BRAND: Record<string, BrandId> = {
  Unitel: "unitel",
  Univision: "univision",
};

export function menuPromos(menuName?: string): MenuPromo[] {
  const brand = (menuName && MENU_BRAND[menuName]) || BRAND;
  return promotionCards[brand].slice(0, 2).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    ctaLabel: p.ctaText,
    href: p.ctaHref,
    image: p.image,
  }));
}

function PromoAvatar({ image, size = 56 }: { image?: string; size?: number }) {
  if (image) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="bg-muted relative shrink-0 overflow-hidden rounded-full"
      >
        <Image src={image} alt="" fill sizes={`${size}px`} className="object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-full"
    >
      <Gift className="size-6" />
    </span>
  );
}

export function useBrandMegaMenu(order: string[] = []) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelBrand, setPanelBrand] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const [direction, setDirection] = useState<"from-start" | "from-end" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  const openBrandMenu = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setPanelBrand((prev) => {
      if (prev && prev !== name) {
        const from = order.indexOf(prev);
        const to = order.indexOf(name);
        setDirection(from !== -1 && to !== -1 && to < from ? "from-start" : "from-end");
      } else if (!prev) {
        setDirection(null);
      }
      return name;
    });
    setOpenMenu(name);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setShown(true));
  };
  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
    setShown(false);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      setPanelBrand(null);
      setDirection(null);
    }, 500);
  };
  const closeBrandMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(closeNow, 150);
  };

  return { openMenu, panelBrand, shown, direction, openBrandMenu, closeBrandMenu, closeNow };
}

const MEGA_RELATED_LINKS: MegaMenuSection[] = [
  { id: "packages", title: "Багц сонгох", href: "/main-packages" },
  { id: "devices", title: "Төхөөрөмж", href: "/devices" },
  { id: "support", title: "Тусламж", href: "/support" },
  { id: "campaigns", title: "Бүх урамшуулал", href: "/campaigns" },
];

function MegaItem({
  section,
  className,
  onNavigate,
}: {
  section: MegaMenuSection;
  className: string;
  onNavigate: () => void;
}) {
  return section.href.startsWith("http") ? (
    <a href={section.href} target="_blank" rel="noopener noreferrer" className={className}>
      {section.title}
    </a>
  ) : (
    <Link href={section.href} onClick={onNavigate} className={className}>
      {section.title}
    </Link>
  );
}

function MegaPromoColumn({ menuName, onNavigate }: { menuName?: string; onNavigate: () => void }) {
  return (
    <div className="ml-auto w-76 shrink-0">
      <h3 className={cn(navType.groupLabel, "mb-4")}>{MENU_PROMOS_HEADING}</h3>

      <div className="flex flex-col gap-5">
        {menuPromos(menuName).map((promo) => (
          <div key={promo.id} className="flex items-center gap-4">
            <PromoAvatar image={promo.image} />
            <div className="flex min-w-0 flex-col items-start">
              <p className={cn(navType.secondaryLink, "text-foreground")}>{promo.title}</p>
              <p className={cn(navType.body, "text-muted-foreground mt-1 line-clamp-3")}>
                {promo.description}
              </p>
              <Link
                href={promo.href}
                onClick={onNavigate}
                className="text-primary hover:text-primary/80 mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
              >
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                {promo.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MegaBranchRow({
  section,
  active,
  onSelect,
  onNavigate,
}: {
  section: MegaMenuBranch;
  active: boolean;
  onSelect: () => void;
  onNavigate: () => void;
}) {
  const cls = cn(
    navType.bar,
    "flex w-full items-center justify-between gap-3 rounded-full px-3 py-1.5 transition-colors",
    active ? "bg-foreground text-background" : "text-foreground hover:bg-muted",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
  );

  const external = section.href.startsWith("http");

  const body = (
    <>
      <span>{section.title}</span>
      {section.groups?.length ? (
        <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden="true" />
      ) : null}
    </>
  );

  const shared = {
    id: `mega-branch-${section.id}`,
    onMouseEnter: onSelect,
    onFocus: onSelect,
    className: cls,
  };

  return external ? (
    <a {...shared} href={section.href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <Link {...shared} href={section.href} onClick={onNavigate}>
      {body}
    </Link>
  );
}

function BranchedMegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  const [activeId, setActiveId] = useState(menu.sections[0]?.id ?? "");
  const active = menu.sections.find((s) => s.id === activeId) ?? menu.sections[0];

  const leafCls = cn(
    navType.bar,
    "text-foreground/80 hover:text-foreground focus-visible:text-foreground block transition-colors focus-visible:outline-none",
  );

  return (
    <div className="mx-auto max-w-300 px-6 py-8">
      <div className="flex items-stretch gap-10">
        <nav aria-label={`${menu.name} — ангилал`} className="w-56 shrink-0">

          <ul className="space-y-1">
            {menu.sections.map((section) => (
              <li key={section.id}>
                <MegaBranchRow
                  section={section}
                  active={section.id === active?.id}
                  onSelect={() => setActiveId(section.id)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div
          role="group"
          aria-labelledby={active ? `mega-branch-${active.id}` : undefined}
          className="border-border min-h-44 flex-1 border-l pl-10"
        >
          {active?.groups?.length ? (

            <>
              <div className="flex items-start gap-20">
                {active.groups.map((group) => (
                  <div key={group.id} className="w-52">
                    {group.title && (
                      <h3 className={cn(navType.groupLabel, "mb-4")}>{group.title}</h3>
                    )}
                    <ul className="space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <MegaItem section={item} className={leafCls} onNavigate={onNavigate} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {active.status && <BranchStatusNote status={active.status} className="mt-6" />}
            </>
          ) : active?.status ? (
            <BranchStatusNote status={active.status} centered />
          ) : (
            <p className={cn(navType.body, "text-muted-foreground")}>
              {active?.title} — дэд агуулга тодорхойлогдоогүй
            </p>
          )}
        </div>

        <MegaPromoColumn menuName={menu.name} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export function BrandMegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  if (menu.sections.some((s) => s.groups?.length)) {
    return <BranchedMegaPanel menu={menu} onNavigate={onNavigate} />;
  }

  const sectionCls = cn(
    navType.bar,
    "block w-fit rounded-full px-3 py-1.5 transition-colors",
    "text-foreground hover:bg-foreground hover:text-background",
    "focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none",
  );

  const extraCls = cn(
    navType.body,
    "text-muted-foreground hover:text-foreground block transition-colors",
  );

  const extras = menu.extras ?? MEGA_RELATED_LINKS;

  return (
    <div className="mx-auto max-w-300 px-6 py-8">
      <div className="flex items-start gap-16">
        <div>
          <h3 className={cn(navType.groupLabel, "mb-4")}>{menu.sectionsLabel ?? menu.name}</h3>
          <ul className="space-y-1">
            {menu.sections.map((section) => (
              <li key={section.id}>
                <MegaItem section={section} className={sectionCls} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        <div className="w-52 shrink-0">
          <h3 className={cn(navType.groupLabel, "mb-4")}>{menu.extrasLabel ?? "Нэмэлт"}</h3>
          <ul className="space-y-2.5">
            {extras.map((item) => (
              <li key={item.id}>
                <MegaItem section={item} className={extraCls} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        <MegaPromoColumn menuName={menu.name} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

const CENTER_LOGO_SIZE = 29;

export function BrandLogoLink() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label={`${BRAND_LABEL[BRAND]} — Нүүр`}>
      {BRAND === "univision" ? (
        <Image
          src="/univision-mark-mono.svg"
          alt=""
          width={CENTER_LOGO_SIZE}
          height={CENTER_LOGO_SIZE}
          preload
          className="dark:invert"
        />
      ) : (
        <>
          <Image
            src="/eco-logo.png"
            alt=""
            width={CENTER_LOGO_SIZE}
            height={CENTER_LOGO_SIZE}
            preload
            className="dark:hidden"
          />
          <Image
            src="/eco-logo-dark.png"
            alt=""
            width={CENTER_LOGO_SIZE}
            height={CENTER_LOGO_SIZE}
            preload
            className="hidden dark:block"
          />
        </>
      )}
    </Link>
  );
}

export function AccountMenu({ className }: { className?: string }) {
  const { isAuthenticated, user, openLogin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Нэвтрэх"
        onClick={() => openLogin()}
        className={className}
      >
        <User className="size-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Миний бүртгэл"
          className={cn("relative", className)}
        >
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

export function IconButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-expanded={onClick ? active : undefined}
      onClick={onClick}
      className={cn(active && "bg-muted text-foreground")}
    >
      {children}
    </Button>
  );
}

export function MobileToggleRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="hover:bg-muted flex items-center justify-between rounded-md px-2 py-2 transition-colors">
      <span className={navType.mobileLink}>{label}</span>
      {children}
    </div>
  );
}
