"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PromoCard } from "@/components/layout/promo-card";
import { useAuth } from "@/components/auth/auth-provider";
import {
  currentPromos,
  customerSegments,
  ecosystemBrands,
  type AudienceSegment,
  type EcosystemLink,
  type MegaMenu,
} from "@/data/navigation";
import { BRAND, BRAND_LABEL } from "@/lib/brand";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

/**
 * Header-ийн хувилбаруудын ХУВААЛЦАХ хэсэг.
 *
 * Ажиллаж байгаа хувилбарууд (header.tsx) болон архивласан хувилбарууд
 * (header-archive.tsx) хоёулаа эндээс уншина — хуулбар байхгүй тул зөрөх
 * боломжгүй.
 */

// =====================================================================
// ХЭРЭГЛЭГЧИЙН АНГИЛАГЧ — Хувь хэрэглэгч / Байгууллага
// =====================================================================
export const classifierSegments: AudienceSegment[] = [
  ...customerSegments.filter((s) => s.id === "personal"),
  {
    id: "business",
    label: "Байгууллага",
    href: "https://nexmind.mn/",
    external: true,
    icon: "building",
  },
];

// =====================================================================
// АКТИВ ЛИНК ТОДОРХОЙЛОХ
// =====================================================================

/**
 * Эко-системийн брэнд хуудсан дээр байгаа эсэх (архивласан хувилбарууд).
 * Зөвхөн `ecosystemBrands`-ийн зам дээр тулгуурладаг.
 */
export function useActiveBrand(): string | null {
  const pathname = usePathname();
  const brand = ecosystemBrands.find(
    (b) => !b.external && b.href !== "/" && pathname.startsWith(b.href),
  );
  return brand?.name ?? null;
}

/**
 * ХАРАГДАЖ БАЙГАА цэсний жагсаалттай нь тулгаж актив линкийг олно.
 *
 * `useActiveBrand` нь зөвхөн `ecosystemBrands`-аас хайдаг тул "Дэлгүүр",
 * "Entertainment", "Урамшуулал", "Тусламж" зэрэг ангилал хэзээ ч актив
 * болдоггүй байсан. Энэ нь рендерлэгдэж байгаа жагсаалтаас хайна.
 *
 * Хамгийн УРТ таарсан зам хожино — `/entertainment` ба `/entertainment/main`
 * хоёр зэрэг байвал тодорхой нь сонгогдоно.
 */
export function useActiveNavName(items: EcosystemLink[]): string | null {
  const pathname = usePathname();

  let best: { name: string; length: number } | null = null;
  for (const item of items) {
    if (item.external || item.href === "/" || item.href.startsWith("#")) continue;
    // Замын хэсэг бүтнээр таарах ёстой: /devices нь /devices-extra-г тааруулахгүй
    const base = item.href.split(/[?#]/)[0];
    if (pathname !== base && !pathname.startsWith(`${base}/`)) continue;
    if (!best || base.length > best.length) best = { name: item.name, length: base.length };
  }

  return best?.name ?? null;
}

// =====================================================================
// MEGA MENU — hover-оор задардаг панелийн төлөв
// =====================================================================
export function useBrandMegaMenu() {
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

const MEGA_RELATED_LINKS = [
  { label: "Багц сонгох", href: "/main-packages" },
  { label: "Төхөөрөмж", href: "/devices" },
  { label: "Тусламж", href: "/support" },
  { label: "Бүх урамшуулал", href: "/campaigns" },
];

export function BrandMegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
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

// =====================================================================
// ЖИЖИГ ТУСЛАХУУД
// =====================================================================

/**
 * Header-ийн төвийн тэмдгийн хэмжээ (px) — эко тэмдэг БОЛОН Univision-ы
 * тэмдэг хоёуланд нь хамаарна, ингэснээр хоёр брэнд дээр ижил хэмжээтэй.
 * 24 → 29 (20% томсгосон).
 */
const CENTER_LOGO_SIZE = 29;

/**
 * Header-ийн ТӨВИЙН лого — БРЭНДЭЭС хамаарна. Хоёулаа дөрвөлжин, хар цагаан
 * тэмдэг тул хоёр сайтын header оптикоор жигд харагдана.
 *
 *   Unitel сайт    → эко тэмдэг (eco-logo.png / eco-logo-dark.png)
 *   Univision сайт → Univision-ы тэмдэг (univision-mark-mono.svg)
 *
 * Univision-ы тэмдгийг үндсэн логооос тасалж, ногоон дөрвөлжинг хар болгоод
 * 3 сэлбээг мaскaap цоолсон. Хар + тунгалаг гэсэн хоёр өнгөтэй тул dark theme-д
 * `dark:invert`-ээр цагаан болно — нэг файл, хоёр өнгө.
 *
 * `BRAND` нь build-ийн үед шигтгэгддэг тогтмол тул салаа нь build бүрд
 * статикаар шийдэгдэнэ (client дээр шалгалт үлдэхгүй).
 */
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

/**
 * Account товч — нэвтрээгүй бол login dialog нээнэ, нэвтэрсэн бол хэрэглэгчийн
 * нэр + "Гарах"-тай dropdown харуулна.
 */
export function AccountMenu() {
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
export function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Button variant="ghost" size="icon" aria-label={label}>
      {children}
    </Button>
  );
}

/** Mobile-ийн Sheet дотор тогтсон toggle мөр */
export function MobileToggleRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="hover:bg-muted flex items-center justify-between rounded-md px-2 py-2 transition-colors">
      <span className={navType.mobileLink}>{label}</span>
      {children}
    </div>
  );
}
