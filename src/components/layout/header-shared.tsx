"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  type MegaMenuSection,
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
/**
 * Панел нээх/хаах төлөв.
 *
 * `order` — цэсний нэрсийн ДАРААЛАЛ (`appleNavCategories`-ийн). Ангилал
 * хооронд шилжихэд агуулга ЯМАР ЧИГЛЭЛД гулсахыг эндээс тооцно: баруун тийшх
 * ангилал руу орвол шинэ агуулга баруунаас, зүүн тийш бол зүүнээс орж ирнэ —
 * mobile-ын `NavigationMenu` (Radix `data-motion`)-тай ижил зан.
 */
export function useBrandMegaMenu(order: string[] = []) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelBrand, setPanelBrand] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  /** null = шинээр нээгдэж байна (гулсалтгүй, зөвхөн fade) */
  const [direction, setDirection] = useState<"from-start" | "from-end" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  const openBrandMenu = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setPanelBrand((prev) => {
      // Нэг панелаас нөгөө рүү шилжиж байгаа үед л чиглэл гаргана
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
      // Дараагийн нээлт нь "шинээр нээгдэж байна" гэж тооцогдоно
      setDirection(null);
    }, 500);
  };
  const closeBrandMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(closeNow, 150);
  };

  return { openMenu, panelBrand, shown, direction, openBrandMenu, closeBrandMenu, closeNow };
}

/**
 * "Нэмэлт" баганын DEFAULT агуулга — `menu.extras` өгөөгүй брэндэд.
 * Ингэснээр Univision-д тусгай жагсаалт орсон ч Unitel · Дэлгүүр · LookTV-ийн
 * панелаас эдгээр линк алдагдахгүй.
 */
const MEGA_RELATED_LINKS: MegaMenuSection[] = [
  { id: "packages", title: "Багц сонгох", href: "/main-packages" },
  { id: "devices", title: "Төхөөрөмж", href: "/devices" },
  { id: "support", title: "Тусламж", href: "/support" },
  { id: "campaigns", title: "Бүх урамшуулал", href: "/campaigns" },
];

/**
 * Дэд цэсний нэг зүйл — гадаад бол `<a target="_blank">`, дотоод бол `<Link>`.
 * Хоёр багана хоёулаа эндээс рендерлэгддэг тул логик нэг л газарт байна.
 */
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

export function BrandMegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  /**
   * ҮНДСЭН АНГИЛАЛ — hover/focus дээр ХАР pill + цагаан текст.
   *
   * Өмнө 24px (`primaryLink`) + hover дээр ногоон текст байсан. Одоо 15px
   * (`navType.bar`) бөгөөд тодотгол нь ӨНГӨ БИШ, БҮТЭН ДЭВСГЭР — ингэснээр
   * "хаана байна" гэдэг нь тодхон харагдана.
   *
   * `bg-foreground` / `text-background` — theme-ийн токеноор: light-д хар
   * дэвсгэр + цагаан үсэг, dark-д цагаан дэвсгэр + хар үсэг. Брэнд ногоон
   * хэрэглэхгүй (header-ийн бусад тодотголтой нэгдсэн байхын тулд).
   *
   * `w-fit` — pill нь баганы бүтэн өргөнөөр татагдахгүй, үсгээ л ална.
   */
  const sectionCls = cn(
    navType.bar,
    "block w-fit rounded-full px-3 py-1.5 transition-colors",
    "text-foreground hover:bg-foreground hover:text-background",
    "focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none",
  );

  /** НЭМЭЛТ багана — 13px, туслах шинжтэй тул pill-гүй, зөвхөн өнгө хүчждэг. */
  const extraCls = cn(
    navType.secondaryLink,
    "text-foreground/70 hover:text-foreground block transition-colors",
  );

  /**
   * ХУРДАН ҮЙЛДЭЛ — дээд мөр. Ангиллын линкээс ЯЛГАРАХ ёстой (тэднийг тойрч
   * шууд үйлдэл хийдэг) тул хүрээтэй pill: дэвсгэргүй, hover дээр л дүүрнэ.
   */
  const quickCls = cn(
    navType.bar,
    "border-border text-foreground hover:bg-foreground hover:text-background hover:border-foreground focus-visible:bg-foreground focus-visible:text-background inline-flex items-center rounded-full border px-3.5 py-1.5 transition-colors focus-visible:outline-none",
  );

  const extras = menu.extras ?? MEGA_RELATED_LINKS;

  return (
    <div className="mx-auto max-w-300 px-4 py-8">
      {/* ХУРДАН ҮЙЛДЭЛ — ГАРЧИГГҮЙ дээд мөр, доогуураа зааглана.
          Байхгүй брэнд (Univision · Дэлгүүр · LookTV) дээр мөр бүхэлдээ
          рендерлэгдэхгүй — хоосон зай гаргахгүй. */}
      {menu.quickActions && menu.quickActions.length > 0 && (
        <div className="border-border mb-7 flex flex-wrap items-center gap-2 border-b pb-6">
          {menu.quickActions.map((action) => (
            <MegaItem
              key={action.id}
              section={action}
              className={quickCls}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-16">
        {/* Багана 1 — үндсэн ангилал. `-ml-3` нь pill-ийн зүүн padding-ийг
            нөхөж, үсэг нь гарчигтай оптикоор жигдэрнэ.
            Гарчиг нь брэндийн нэр БИШ байж болно (`sectionsLabel`) — Unitel-д
            "Багц", учир нь багана нь тарифын нэрсийг агуулдаг. */}
        <div>
          <h3 className={cn(navType.groupLabel, "mb-4")}>{menu.sectionsLabel ?? menu.name}</h3>
          <ul className="-ml-3 space-y-1">
            {menu.sections.map((section) => (
              <li key={section.id}>
                <MegaItem section={section} className={sectionCls} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        {/* Багана 2 — Нэмэлт / Бусад үйлчилгээ (`sections`-ийн ард) */}
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

        {/* Багана 3 — УРАМШУУЛАЛ.
            Өмнө `currentPromos`-ийн "Sample 1 / Sample 2" картууд байсан. Тэднийг
            mobile-д аль хэдийн байгаа PLACEHOLDER бичвэрээр солив — жинхэнэ
            урамшуулал нь тухайн ЦЭСТЭЙ холбоотой байх ёстой бөгөөд тэр data
            хараахан байхгүй. Хоёр давхарга (desktop/mobile) нэг бичвэр
            хэрэглэснээр аль хэдийн байгаа зөрөх шалтгаан үлдэхгүй. */}
        <div className="ml-auto w-72 shrink-0">
          <h3 className={cn(navType.groupLabel, "mb-4")}>Урамшуулал</h3>
          <p className={cn(navType.body, "text-muted-foreground")}>
            Энэ цэстэй холбоотой урамшуулал энд байрлана.
          </p>
          <Link
            href="/campaigns"
            onClick={onNavigate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-colors"
          >
            Sample CTA
            <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
          </Link>
        </div>
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
