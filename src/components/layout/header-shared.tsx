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
  /**
   * Группын корпорэйт сайт. `brands` талбар АЛГА тул `AudienceSwitchTabs` нь
   * үүнийг dropdown биш, ↗ сумтай ШУУД линк болгож буулгана — "Байгууллага"-
   * тай яг ижил зан.
   *
   * Icon нь `building` БИШ `info`: хажуудаа зогсох "Байгууллага" аль хэдийн
   * `building` (Building2) хэрэглэж байгаа тул давхарлавал хоёр нь нүдэнд
   * ялгарахгүй. `customerSegments`-ийн "Бидний тухай" гэсэн группын линк ч
   * мөн `info` хэрэглэдэг — тэр жишгийг дагав.
   */
  {
    id: "group",
    label: "Unitel Group",
    href: "https://unitelgroup.mn/",
    external: true,
    icon: "info",
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
 * ОДОО БАЙГАА ДОМЭЙНЫ цэсний нэр — `NEXT_PUBLIC_BRAND`-аас гарна.
 * Unitel build дээр "Unitel", Univision build дээр "Univision".
 * Зөвхөн FALLBACK — доорх `useActiveNavName`-ийг үз.
 */
export const DOMAIN_NAV_NAME: string = BRAND_LABEL[BRAND];

/**
 * ТОДРОХ (underline) цэсний нэр — ХОЁР ШАТЛАЛТ:
 *
 *   1. Одоогийн зам цэсний элементтэй таарвал ТЭР тодорно.
 *      `/devices` → "Дэлгүүр", `/campaigns` → "Урамшуулал".
 *      Хамгийн УРТ таарсан зам хожино — `/entertainment` ба
 *      `/entertainment/main` хоёр зэрэг байвал тодорхой нь сонгогдоно.
 *   2. Юу ч таарахгүй бол (нүүр `/`, `/support`, `/main-packages` …)
 *      build-ийн ДОМЭЙН тодорно (`DOMAIN_NAV_NAME`).
 *
 * ⚠️ `owner`-оор ШҮҮХГҮЙ: хоёр брэнд НЭГ Next.js апп дотор амьдардаг тул
 * нэг build дээр байгаа хэрэглэгч нөгөө брэндийн зам руу орж чадна — тэр үед
 * тэр цэс тодрох ёстой. `owner === BRAND` гэж шүүвэл нөгөө брэнд ХЭЗЭЭ Ч
 * тодрохгүй болно.
 *
 * ⚠️ Unitel · Univision · LookTV нь ОДООГООР `#` (хуудас нь устсан) тул
 * 1-р шат тэднийг ХЭЗЭЭ Ч сонгохгүй — `base` хоосон болж шүүгддэг. Тэд
 * зөвхөн 2-р шатаар (build-ийн домэйн) тодорно. Бодит зам сэргэмэгц
 * ямар ч засваргүйгээр дахин ажиллана.
 *
 * Desktop (`CategoryNav`), mobile таб (`BrandTab`), burger, доод tab bar —
 * БҮГД үүнийг уншина тул давхаргууд хооронд зөрөхгүй.
 */
export function useActiveNavName(items: EcosystemLink[]): string {
  return useCurrentNavName(items) ?? DOMAIN_NAV_NAME;
}

/**
 * ЗӨВХӨН замаар таарсан цэс — таарахгүй бол `null` (домэйн руу унахгүй).
 *
 * `aria-current="page"`-д ЯГ ҮҮНИЙГ хэрэглэнэ: нүүр (`/`) хуудсанд домэйны
 * цэс нь ХАРАГДАХ тодотголтой байж болох ч тэр нь "одоогийн хуудас" БИШ —
 * screen reader-т ийм гэж хэлбэл хэрэглэгч тэр хуудсан дээр байна гэж
 * төөрөгдөнө.
 */
export function useCurrentNavName(items: EcosystemLink[]): string | null {
  const pathname = usePathname() ?? "";

  let best: { name: string; length: number } | null = null;
  for (const item of items) {
    if (item.external) continue;
    const base = item.href.split(/[?#]/)[0];
    // Нүүр (`/`) нь бүх замтай таарах тул оролцуулахгүй. Гадаад URL мөн адил.
    if (base === "/" || !base.startsWith("/")) continue;
    // Замын хэсэг БҮТНЭЭР таарах ёстой: /devices нь /devices-extra-г авахгүй
    if (pathname !== base && !pathname.startsWith(`${base}/`)) continue;
    if (!best || base.length > best.length) best = { name: item.name, length: base.length };
  }

  return best?.name ?? null;
}

/**
 * Цэсний урамшууллын баганын ГАРЧИГ — багана бүхэлдээ юу болохыг НЭГ УДАА
 * тайлбарлана.
 *
 * Өмнө нь гарчиг нь "Урамшуулал" байж, мөр бүр дээр "…урамшуулал 1 энд
 * байрлана", "…урамшуулал 2 энд байрлана" гэж ДАВТАГДАЖ байв. Тэр нь
 * placeholder-ын бичвэрийг агуулга мэт харагдуулж, мөр нэмэх бүрд шинэ
 * дугаар зохиох шаардлага үүсгэдэг байлаа. Одоо тайлбар нь ДЭЭР нэг л удаа,
 * мөрүүд нь өөрсдийн үүргээр (гарчиг + CTA) л ярина.
 */
export const MENU_PROMOS_HEADING = "Онцлох урамшуулал";

/**
 * LOOKTV-ИЙН УУСАХ БИЧВЭР — desktop-ийн `CategoryNav` ба мобайлын `TabLabel`
 * ХОЁУЛАА эндээс уншина (2026-09-09).
 *
 * ⚠️ RGB GLITCH ХАСАГДСАН (захиалагчийн заавар: "LookTV-ийн glitch effect-г
 * хасаад MagicUI-ийн morphing-text component-г ашиглаад уурчилдуг болго").
 * Өмнө нь `globals.css`-ийн `.glitch-text` класс нь 6 сек тутам RGB-split
 * хийж, `::before`-ийн `content: "Илүүг Үз"` давхаргыг гаргадаг байв.
 * ХОЁР БИЧВЭР ХАДГАЛАГДСАН — зөвхөн ХӨДӨЛГӨӨН нь уусалт болов.
 *
 * ⚠️ `texts[0]` нь КАНОНИК нэр: `MorphingText` нь дэлгэц уншигчид зөвхөн
 * түүнийг л дамжуулна ("LookTV"). Дараалал сольвол цэсний хүртээмжит нэр
 * "Илүүг Үз" болно — тэр нь ангиллын нэр БИШ.
 */
export const LOOKTV_MORPH_TEXTS = ["LookTV", "Илүүг Үз"];

// =====================================================================
// ХЭРЭГСЛИЙН ГУРВАН PILL — ХЭЛ · ПРОФАЙЛ · THEME
//
// ⚠️ 2026-09-09-НД `mobile-header.tsx`-ЭЭС ЭНД ЗӨӨГДСӨН (захиалагч:
// "desktop дээрх header-ийн design-г screenshot-оор оруулсанс шиг болгоё,
// mobile дээр ашигласан style-уудаа ашигла").
//
// Тэдгээр нь хувилбар 3-ын burger drawer-ийн доод мөрөнд бүтээгдсэн байсан.
// Одоо desktop-ийн капсулын БАРУУН талд ч ЯГ ижил гурав суух тул хоёр
// давхарга НЭГ эх сурвалжаас уншина — эс бөгөөс `useTheme` шалгалт,
// нэвтрэлтийн зан төлөв, дүрсний сонголт гурвуулаа ХОЁР газар давхардаж,
// нэгийг сольж нөгөөг мартах эрсдэл үүснэ.
//
// ⚠️ ХЭЛБЭР нь ГАДНААС (`className`). Drawer-т pill нь `min-h-11 flex-1
// rounded-xl` (мөрийг тэнцүү хуваана), desktop-ийн капсулд `size-9
// rounded-full` (дугуй). Хэлбэрийг компонент дотор шигтгэвэл хоёр
// контекстийн аль нэг нь зайлшгүй эвдэрнэ. Дотор нь үлдсэн нь: дүрс, өнгө,
// дүрсний хэмжээ, a11y, ҮЙЛДЭЛ.
//
// ⚠️ `components/theme-toggle.tsx` НЬ ОДОО ХААНА Ч ДУУДАГДАХГҮЙ БОЛОВ —
// desktop-ийн header түүнийг хэрэглэдэг байсныг `ThemePill` орлов. Файлыг
// УСТГААГҮЙ (shadcn-ийн үүсгэсэн, `.prettierignore`-д) боловч зан төлөв нь
// `useThemeSwitch`-тэй ЯГ ижил байсан тул юу ч алдагдаагүй.
// =====================================================================

/**
 * Theme-ийн төлөв + солих үйлдэл — `ThemePill` (капсул ба drawer) ба
 * `ThemeRow` (хувилбар 1/2-ын Sheet) БҮГД эндээс уншина.
 *
 * ⚠️ Гурван газар `useTheme()`-ийг тусад нь бичих нь `resolvedTheme === "dark"`
 * гэсэн шалгалтыг давхардуулна — нэгийг сольж (жишээ нь system-ийг гурав дахь
 * төлөв болгож) нөгөөг мартвал давхаргууд өөр өөр зан гаргана.
 * `components/theme-toggle.tsx` нь shadcn-ийн үүсгэсэн ТУСДАА компонент
 * (`.prettierignore`-д) тул тэр үүнийг хэрэглэхгүй.
 */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return { isDark, toggle: () => setTheme(isDark ? "light" : "dark") };
}

/** Гурван pill-ийн ДОТООД дүрс — хэмжээ, өнгө нэг л газарт. */
const TOOL_PILL_ICON = "text-muted-foreground size-5 shrink-0";

/**
 * ХЭЛ — дүрс + одоогийн хэлний код.
 *
 * ОДООГООР ХАРАГДАХ ТАЛ ЛЭ: проектод i18n давхарга байхгүй (`layout.tsx`-д
 * `lang="mn"` тогтмол, бүх data монгол) тул дарахад сольж болох зүйл байхгүй.
 * `<div aria-disabled>` — товч болгож дүр эсгэвэл дарж үзсэн хэрэглэгч
 * "эвдэрсэн" гэж дүгнэнэ. `hover` мөн байхгүй — дарагдахгүй гэдгийг хэлбэр
 * нь өгнө. i18n нэмэгдмэгц энэ pill-ийг MN/EN сонголттой болгоно.
 */
export function LanguagePill({ className }: { className?: string }) {
  return (
    <div aria-disabled="true" aria-label="Хэл — одоо MN" className={className}>
      <Globe className={TOOL_PILL_ICON} aria-hidden="true" />
      <span className="text-[13px]">MN</span>
    </div>
  );
}

/**
 * ПРОФАЙЛ — `AccountRow`/`AccountMenu`-тай ИЖИЛ зан төлөв, хэлбэр нь pill.
 *
 * ⚠️ ДҮРС нь ТӨЛӨВӨӨС ХАМААРНА, ингэснээр ХАРАГДАХ дүрс нь ҮЙЛДЭЛТЭЙГЭЭ
 * үргэлж таарна:
 *   нэвтрээгүй → `User`   (дарвал нэвтрэх хэлбэр нээгдэнэ)
 *   нэвтэрсэн  → `LogOut` (дарвал ГАРНА)
 * Зөвхөн `User` дүрсийг үлдээвэл нэвтэрсэн хэрэглэгч "профайл харах" гэж
 * бодоод дарж, санамсаргүй гарах болно.
 *
 * `onDone` — ЗААВАЛ БИШ. Drawer-аас дуудахад тэр хаагдах ёстой; desktop-ийн
 * капсулд хаах юм байхгүй тул өгөхгүй.
 */
export function ProfilePill({ className, onDone }: { className?: string; onDone?: () => void }) {
  const { isAuthenticated, user, openLogin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        aria-label="Нэвтрэх"
        onClick={() => {
          onDone?.();
          /**
           * ⚠️ 220ms — ЗӨВХӨН drawer-тай үед шаардлагатай: тэр хаагдаж
           * фокусаа буцаах хугацаа, эс бөгөөс login хэлбэр нээгдэнгүүт
           * фокусаа алдана. Desktop-д `onDone` байхгүй ч ижил хугацаа
           * хэрэглэсэн нь мэдэгдэхүйц биш (220ms).
           */
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
      {/* Нэр нь `sr-only`-д — нарийн pill-д урт нэр багтахгүй, харин screen
          reader хэрэглэгчид ХЭН гарах нь тодорхой байх ёстой. */}
      <span className="sr-only">Гарах — {user?.name}</span>
    </button>
  );
}

/** THEME — light ⇄ dark. Одоогийн төлөвийн дүрс харагдана. */
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

/**
 * ЦЭСНИЙ АНГИЛЛЫН СТАТУС — дэд агуулга нь ХЭРЭГЛЭГЧИД харагдах шалтгаанаар
 * бэлэн биш ангиллын мэдэгдэл (2026-09-09, захиалагчийн заавар).
 *
 * ⚠️ БИЧВЭР НЭГ Л ГАЗАРТ. Desktop-ийн mega панел ба мобайлын ХОЁР рендер
 * (хувилбар 1 `SectionMenu`, хувилбар 3 `DrawerSubmenu`) — гурвуулаа
 * үүнийг дууддаг. Өмнөх "дэд агуулга тодорхойлогдоогүй" бичвэр нь ГУРВАН
 * газарт тархвал нэгийг сольж нөгөөг мартах эрсдэлтэй байв.
 *
 * ⚠️ ХЭРЭГЛЭГЧИЙН чиглэсэн үг. "Агуулга тодорхойлогдоогүй" нь ХӨГЖҮҮЛЭГЧИЙН
 * дотоод төлөв (агуулга шийдэгдээгүй), харин "maintain хийгдэж байгаа" /
 * "Coming soon…" нь хэрэглэгчид хандсан статус — өөр зүйл тул кодод ч
 * салангид.
 */
export const MAINTENANCE_TEXT = "Maintain хийгдэж байгаа";

/**
 * ⚠️ ТӨЛӨВ ХОЁР БОЛОВ (2026-09-09, захиалагч: Univision > Life-style дээр
 * "Maintain хийгдэж байна биш Coming soon… гэж оруул").
 *
 * Бичвэр ба дүрсийг ЭНД ХОСООР хадгална — рендер хийдэг гурван газар
 * (desktop `BranchedMegaPanel`, мобайл `SectionMenu`, `DrawerSubmenu`)
 * `if (status === …)` бичихгүй, зөвхөн `BRANCH_STATUS[status]`-ыг уншина.
 * Дөрөв дэх төлөв нэмэхэд ЗӨВХӨН энэ мап өснө.
 *
 * `"link-only"` ЭНД БАЙХГҮЙ — тэр нь "мэдэгдэл харуулахгүй" гэсэн утга тул
 * харуулах юмгүй. `BRANCH_STATUS[...]` нь `undefined` буцаах ба рендерүүд
 * түүнийг чимээгүй алгасна (доорх `BranchStatusNote`-ийн `if (!info)`).
 *
 * Дүрс — зөвхөн статусын дохио, `aria-hidden`. Бичвэр өөрөө бүх мэдээллийг
 * дамжуулна (WCAG 1.1.1).
 */
export const BRANCH_STATUS: Partial<Record<MegaBranchStatus, { text: string; Icon: LucideIcon }>> =
  {
    maintenance: { text: MAINTENANCE_TEXT, Icon: Wrench },
    /**
     * `…` нь ГУРВАН ТОМЬЁОЛСОН ЦЭГ (U+2026), гурван цуваа цэг БИШ —
     * захиалагчийн бичсэн "Coming soon..." нь ижил уншигдана, гэхдээ typographic
     * ellipsis нь өөр фонт/өргөнд ч тогтвортой, screen reader ч зөв уншина.
     */
    "coming-soon": { text: "Coming soon…", Icon: Clock },
  };

export function BranchStatusNote({
  /**
   * Аль төлөв. `"link-only"` (эсвэл мапд байхгүй утга) бол ЮУ Ч рендерлэхгүй —
   * дуудагч тал нь `status &&` шалгалт бичих шаардлагагүй.
   */
  status,
  className,
  /**
   * ГОЛЛУУЛСАН ХУВИЛБАР — desktop-ийн mega панелийн БАРУУН талд, өөр агуулга
   * байхгүй үед (2026-09-09, захиалагч: "icon-г томруулаад div дотроо
   * голлуул").
   *
   * ⚠️ Мобайлд ХЭРЭГЛЭХГҮЙ. Тэнд статус нь ЖАГСААЛТЫН МӨРНИЙ ДОР суудаг —
   * голлуулбал өмнөх мөртэйгээ хамааралгүй мэт таслагдана. Тиймээс хоёр
   * харагдац: `centered` (хоосон талбайн төлөв) ба мөрийн доорх нэг мөр.
   */
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
      /**
       * `h-full` — эцэг панел нь `items-stretch`-ээр мөрийн (=зүүн баганын)
       * бүтэн өндөрт татагдсан байдаг тул тодорхой өндөртэй; түүнгүйгээр
       * `justify-center` төвлөрөх зүйлгүй болно. `min-h-44` нь зүүн багана
       * богино байсан ч гэсэн доод хязгаар өгнө.
       *
       * Дүрс 14px → 40px (`size-10`), `opacity-40` — хоосон талбайн
       * төлөвийн жишгээр: анхаарал татна, гэхдээ бичвэрээ дийлэхгүй.
       */
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

/**
 * Цэсний урамшуулал — ОДОО БОДИТ ДАТА (2026-09-08, захиалагчийн заавар:
 * "хамгийн ард байрлах урамшууллын хэсэгт homepage дээр ашиглаж байгаа
 * бодит мэдээллийг ашиглаад болид болго").
 *
 * ⚠️ ӨМНӨ НЬ PLACEHOLDER байв: гарчиг нь "Урамшууллыг илтгэх highlight хийх
 * title энд байрлана" гэсэн ХОЁР ижил мөр, дугуй нь `Gift` дүрс. Одоо
 * `data/promotions.ts > promotionCards[BRAND]` — нүүрний "Онцлох урамшуулал"
 * хэсэг ЯГ ТЭР жагсаалтыг уншдаг тул цэс ба нүүр хоёр ХЭЗЭЭ Ч ЗӨРӨХГҮЙ.
 *
 * `slice(0, 2)` — панелийн багана хоёр мөрөнд тохирсон өндөртэй (`w-76`,
 * дугуй 56px). Гурав дахийг харуулбал зүүн баганаас (6 мөр) өндөр болж
 * панел сунана. "Бүх урамшуулал" рүү хүрэх нь `/campaigns` (мөр бүрийн CTA).
 *
 * ⚠️ ГАРЧИГ Ч БОДИТ БОЛОВ: `MENU_PROMOS_HEADING` нь өмнө нь брифийн бичвэр
 * ("…гэсэн title байна") байсныг нүүрний хэсгийн нэрээр — "Онцлох
 * урамшуулал" — сольсон.
 *
 * Desktop (`BrandMegaPanel`) ба mobile (`MenuPromoTeaser`) ХОЁУЛАА эндээс
 * уншина тул тоо, бичвэр, зураг зөрөхгүй.
 */
export type MenuPromo = {
  id: string;
  title: string;
  /**
   * НЭГ ӨГҮҮЛБЭРИЙН тайлбар (2026-09-08, захиалагч: "урамшууллын мэдээллийг
   * тохирсон нэг өгүүлбэр оруул, title-тай нь хамт").
   *
   * ⚠️ ШИНЭ БИЧВЭР ЗОХИООГҮЙ — `promotionCards[…].description` нь нүүрний
   * "Онцлох урамшуулал" картан дээр аль хэдийн харагддаг ЯГ ТЭР өгүүлбэр
   * (захиалагчийн 2026-09-07-ны бичвэрээс). Цэс ба нүүр хоёр нэг эх
   * сурвалжтай тул хэзээ ч зөрөхгүй.
   */
  description: string;
  ctaLabel: string;
  href: string;
  image?: string;
};

/**
 * ЦЭСНИЙ НЭР → БРЭНД. `appleMegaMenus`-ийн түлхүүр нь "Unitel" / "Univision".
 * Бусад нэр (LookTV г.м) нь mega цэсгүй тул энд байхгүй.
 */
const MENU_BRAND: Record<string, BrandId> = {
  Unitel: "unitel",
  Univision: "univision",
};

/**
 * ⚠️⚠️ УРАМШУУЛЛЫГ BUILD-ИЙН БИШ, НЭЭГДСЭН ЦЭСНИЙ БРЭНДЭЭР СОНГОНО
 * (2026-09-10, захиалагч: "desktop дээр Univision-ий mega menu дээрх
 * урамшуулал Univision-ийх биш байна").
 *
 * ӨМНӨ НЬ `MENU_PROMOS = promotionCards[BRAND]` гэсэн ТОГТМОЛ байв — `BRAND`
 * нь `NEXT_PUBLIC_BRAND` буюу BUILD-ийн брэнд. Гэтэл header дээр ХОЁУЛАН
 * брэндийн цэс (Unitel · Univision) зэрэг байдаг тул Unitel build дээр
 * Univision-ы цэс нээхэд Unitel-ийн урамшуулал ("Багцаа бүтээ", "Plus багц")
 * гарч байлаа. Одоо Univision-ы цэс нээвэл Univision-ы урамшуулал
 * ("Flash Deals", "Спорт Апп") гарна — хоёр build дээр ч ижил.
 *
 * ⚠️ FALLBACK нь `BRAND`: цэсний нэр танигдахгүй бол (шинэ mega цэс нэмэгдэх
 * г.м) хоосон биш, build-ийн брэндийн урамшуулал гарна — өмнөх зан төлөв.
 *
 * ⚠️ ФУНКЦ болсон нь ЗОРИУД: тогтмол үлдээвэл модуль ачаалагдах үедээ НЭГ
 * л удаа бодогдох тул цэс солигдоход дагахгүй.
 */
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

/**
 * Урамшууллын ДУГУЙ ЗУРАГ.
 *
 * ⚠️ Зураг БАЙВАЛ бодит кампанийн зураг (`next/image`), эс бөгөөс `Gift`
 * дүрстэй саарал дугуй. Univision-ы `promotionCards` нь одоогоор
 * PLACEHOLDER бөгөөд зурaггүй тул тэр build дээр хуучин дугуй хэвээр —
 * нэг компонент хоёр төлөвийг хариуцна.
 *
 * ХЭМЖЭЭ: `size-14` (56px) нь header-ийн мөрний өндөртэй (56–64px) тэнцүү.
 * Үүнээс томсговол хоёр урамшуулал панелийн зүүн баганаас (Unitel = 6 мөр)
 * илүү өндөр болж, панел сунана.
 *
 * `shrink-0` — гарчиг хоёр мөр болоход дугуй зууван болохоос сэргийлнэ.
 * `sizes="56px"` — Next нь баннерын хэмжээгээр бус ЯГ энэ дугуйн хэмжээгээр
 * файл нийлүүлнэ (кампанийн зураг нь 1000px+ өргөнтэй).
 */
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

/**
 * УРАМШУУЛЛЫН БАГАНА — хоёр хэлбэрт (хоёр панелт ба хуучин) ХУВААЛЦАНА.
 *
 * Мөр бүр = дугуй зураг + гарчиг + CTA (захиалагчийн загварын бүтэц).
 * Баганын ерөнхий тайлбар нь ДЭЭР нэг л удаа (`MENU_PROMOS_HEADING`) —
 * мөр бүр дээр давтагдахгүй.
 *
 * ӨРГӨН: `w-fit` нь дугуй + текстийн баганаас бүрдэх мөрөнд ТОХИРОХГҮЙ
 * (агуулга нь өөрөө өргөнөө тогтоох гэж зууван болно). Тиймээс `w-76`
 * (304px) — дугуй 56px + зай 16px ⇒ текстэд ~230px үлдэнэ.
 */
/**
 * ⚠️ `menuName` — АЛЬ ЦЭС нээгдсэн бэ. Урамшуулал нь build-ийн брэндээр БИШ,
 * ҮҮГЭЭР сонгогдоно (`menuPromos`-ийн тайлбарыг үз). Дуудагч нь `menu.name`-г
 * дамжуулна; өгөөгүй бол build-ийн брэнд рүү унана.
 */
function MegaPromoColumn({ menuName, onNavigate }: { menuName?: string; onNavigate: () => void }) {
  return (
    <div className="ml-auto w-76 shrink-0">
      <h3 className={cn(navType.groupLabel, "mb-4")}>{MENU_PROMOS_HEADING}</h3>

      {/* `gap-5` — хоёр урамшууллыг тод салгана, эс бөгөөс нэгний CTA
          нөгөөгийн гарчигтай солбицож уншигдана. */}
      <div className="flex flex-col gap-5">
        {menuPromos(menuName).map((promo) => (
          <div key={promo.id} className="flex items-center gap-4">
            <PromoAvatar image={promo.image} />
            {/* `min-w-0` — flex хүүхэд нь анхдагчаар агуулгынхаа доод
                өргөнөөс шахагддаггүй; үүнгүйгээр урт гарчиг баганаас
                халина. */}
            <div className="flex min-w-0 flex-col items-start">
              <p className={cn(navType.secondaryLink, "text-foreground")}>{promo.title}</p>
              {/* ⚠️ `line-clamp-3` — бичвэрийн урт нь DATA-аас ирдэг тул
                  хязгааргүй бол урт өгүүлбэр панелийг сунгаж, зүүн баганаас
                  (~224px) хамаагүй өндөр болгоно. Одоогийн хоёр өгүүлбэр
                  232px өргөнд 2-3 мөр тул хайчлагдахгүй; хязгаар нь зөвхөн
                  ирээдүйн урт бичвэрт зориулсан хамгаалалт. */}
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

/**
 * ЗҮҮН БАГАНЫН НЭГ МӨР (хоёр панелт цэс).
 *
 * ⚠️ HOVER/FOCUS нь БАРУУН панелийг л сольдог, ХААШАА Ч ШИЛЖҮҮЛДЭГГҮЙ.
 * Дарахад л `href` рүү явна. Хоёр үүрэг нэг элемент дээр байгаа нь ЗӨВ:
 * "сонгох" нь пассив (hover/focus), "явах" нь актив (click) тул хоорондоо
 * зөрчилдөхгүй — `header.tsx > CategoryNav`-ийн trigger дээрх асуудал
 * (Enter дарахад `#` рүү үсэрч цэс нээгддэггүй) ЭНД гарахгүй.
 *
 * `onFocus` нь ЗАЙЛШГҮЙ: `onMouseEnter` л байвал гараар Tab дарж явахад
 * баруун панел хөдөлгөөнгүй үлдэж, зөвхөн хулганатай хүнд ажиллана.
 *
 * ТОДОТГОЛ — ХАР pill (`bg-foreground` / `text-background`): light-д хар
 * дэвсгэр + цагаан үсэг, dark-д эсрэгээр. Брэнд ногоон хэрэглэхгүй
 * (header-ийн бусад тодотголтой нэгдсэн байхын тулд).
 */
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

  /**
   * БАРУУН ТАЛЫН ТЭМДЭГ — ЗӨВХӨН `ChevronRight`, зөвхөн дэд агуулгатай мөрөнд
   * (баруун панел задарна гэсэн дохио).
   *
   * ⚠️ ГАДААД ЛИНКИЙН ↗ ТЭМДЭГ ХАСАГДСАН (2026-09-09, захиалагчийн заавар).
   * Өмнө нь "For Foreigners" (unitel.mn руу заадаг) дээр `ArrowUpRight`
   * гардаг байв. Захиалагч зүүн баганыг цэвэр үсгэн жагсаалт байлгахыг
   * сонгосон тул хассан. Гадагш гарах нь `target="_blank"`-аар ХЭВЭЭР
   * ажиллана — зөвхөн ХАРАГДАХ тэмдэг л алга болсон.
   */
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

/**
 * ХОЁР ПАНЕЛТ MEGA MENU (захиалагчийн 2026-09-08-ны загвар).
 *
 * ┌────────────────────┬──────────────────────────┬─────────────────────┐
 * │ Багцууд          → │ Дараа төлбөрт            │ Онцлох урамшуулал   │
 * │ Нэмэлт дата багц   │   Priority багц          │ ◯ Багцаа бүтээ      │
 * │ Гэр интернет       │   Premium багц           │   → Дэлгэрэнгүй     │
 * │ Олон улсын үйлч.   │   Plus багц              │ ◯ Plus багц         │
 * │ For Foreigners     │ Урьдчилсан төлбөрт       │   → Дэлгэрэнгүй     │
 * │ Нэмэлт үйлчилгээ   │   Smart Data/Talk/Days   │                     │
 * └────────────────────┴──────────────────────────┴─────────────────────┘
 *      ТОГТМОЛ            hover/focus-оор СОЛИГДОНО       бодит дата
 *
 * ЗҮҮН БАГАНА ХӨДӨЛДӨГГҮЙ — өргөн нь `w-56` ТОГТМОЛ. `w-fit` бол мөрийн
 * урт нь баганы өргөнийг тогтоох ба сонголт солигдоход баруун панелийн
 * агуулга өөр өргөнтэй болж ЗҮҮН багана ч хамт "цүүрнэ".
 *
 * ⚠️ Анхны сонголт нь ҮРГЭЛЖ 1-р мөр. Панел нь брэнд солигдох бүрд дахин
 * mount хийгддэг (`header.tsx > MegaLayer`-ийн `key={panelBrand}`) тул
 * `useState`-ийн анхны утга нь тухай бүрд шинэчлэгдэнэ — хэрэглэгч сүүлд
 * хаана байснаа "санахгүй", цэс нээх нь үргэлж ижил байдлаас эхэлнэ.
 */
function BranchedMegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  const [activeId, setActiveId] = useState(menu.sections[0]?.id ?? "");
  const active = menu.sections.find((s) => s.id === activeId) ?? menu.sections[0];

  const leafCls = cn(
    navType.bar,
    "text-foreground/80 hover:text-foreground focus-visible:text-foreground block transition-colors focus-visible:outline-none",
  );

  return (
    /**
     * ⚠️ `pt-4 pb-8` → `py-8` (2026-09-09, захиалагч: "pb нь илүү байгааг ижил
     * болго … pt-8 pb-8 болго ижил хэмжээтэй").
     *
     * ЯАГААД pb ИЛҮҮ БАЙСАН: панелийн ДООД захад ямар ч зааг байхгүй (`border`
     * зөвхөн доор нь, дэвсгэр нь хуудастай нэг өнгө) тул сүүлийн мөр ирмэгт
     * "цавчигдсан" харагдахгүйн тулд илүү зай авсан байв. ДЭЭД тал нь
     * header-ийн мөртэй зэрэгцдэг тул тэр эрсдэл байхгүй байсан. Захиалагч
     * тэгш зайг сонгосон — контент header-ийн доороос 32px-т эхэлж амьсгаа
     * авна, доод тал нь мөн 32px.
     *
     * ⚠️ `pt-8 pb-8` БИШ `py-8`. Хоёр нь ЯГ ижил CSS (padding-block: 32px)
     * гаргах ба Tailwind-ийн жишиг нь хосыг нэгтгэх — ингэснээр дараа нь
     * нэгийг сольж нөгөөг мартах боломж үндсээрээ үгүй болно.
     *
     * ⚠️ ХУУЧИН хоёр баганат рендер (`BrandMegaPanel`-ийн доод хэсэг) ч ИЖИЛ
     * болов — хоёр хэлбэрийн панел өөр өндөртэй бол хэлбэр солигдоход цэс
     * "цохилно".
     *
     * ⚠️⚠️ `px-4` → `px-6` (2026-09-10, захиалагч: "хэт наалдсан харагдаж
     * байна", дараа нь дахин "container-ын padding бага харагдаж байна").
     *
     * ⚠️ 24px нь ДЭЭД ХЯЗГААР, СОНГОЛТ БИШ. Мөрний агуулга нь тогтмол
     * өргөнүүдийн нийлбэр = **1144px** (`w-56` + `gap-10` + `pl-10` +
     * `w-52` + `gap-20` + `w-52` + `gap-10` + `w-76`), хавтан нь 1200px:
     *     (1200 − 1144) / 2 = 28px
     * ⇒ `px-7`-оос ДЭЭШ тавибал агуулга `overflow-hidden`-д ТАЙРАГДАНА.
     * (`px-10` туршиж үзэхэд баруун талын promo багана 59px-ээр таслагдсан.)
     * Илүү зай хэрэгтэй бол ЭНИЙГ БИШ, дээрх тогтмол өргөнүүдийг
     * захиалагчтай ярьж багасгана — тэдгээр нь бүгд 09-09-ний шийдвэр.
     *
     * ЗАЙГ БОДИТООР НЭМСЭН ЗАСВАР нь `-ml-3` ХАСАГДСАН явдал (доор үз):
     * өмнө нь 16 − 12 = ердөө **4px** үлддэг байсан бол одоо бүтэн 24px.
     */
    <div className="mx-auto max-w-300 px-6 py-8">
      {/**
       * ⚠️ `items-start` → `items-stretch` (2026-09-08, захиалагч:
       * "separator-г бүтэн болго").
       *
       * Separator нь баруун панелийн `border-l` — өөрөөр хэлбэл ТЭР div-ийн
       * ӨНДРӨӨР л зурагдана. `items-start` үед хүүхэд бүр өөрийн агуулгын
       * өндрөөр хумигддаг: зүүн багана 6 мөр (~250px), баруун панел ердөө
       * 2 бүлэг × 3 мөр (~130px) тул зураас нь зүүн баганаас ХАМААГҮЙ
       * ДООГУУР тасарч байв. `items-stretch` нь хүүхдүүдийг мөрийн (=хамгийн
       * өндөр баганы) өндөрт татах тул зураас бүтэн болно.
       *
       * `min-h-44` доод хязгаар нь ХЭВЭЭР — зүүн багана богино цэсэнд
       * (ж. 2-3 мөр) зураас хэтэрхий бахим болохоос сэргийлнэ.
       */}
      <div className="flex items-stretch gap-10">
        {/* ─── ЗҮҮН: тогтмол ангиллын багана ─── */}
        <nav aria-label={`${menu.name} — ангилал`} className="w-56 shrink-0">
          {/* ⚠️⚠️ `-ml-3` ХАСАГДСАН (2026-09-10, захиалагч: "container-ын
              padding бага харагдаж байна").

              Тэр нь pill-ийн зүүн padding-ийг нөхөж ҮСГИЙГ панелийн ирмэгтэй
              оптикоор жигдрүүлдэг байв. Гэвч pill нь ДЭВСГЭРТЭЙ (идэвхтэй
              мөр дээр цагаан капсул) тул жигдэрч байсан зүйл нь үсэг, харин
              НҮД нь дэвсгэрийн ирмэгийг хардаг: 24px padding − 12px = ердөө
              **12px** үлдэж, цагаан капсул хавтангийн ирмэгт наалддаг байлаа.

              Одоо pill-ийн дэвсгэр бүтэн 24px-т эхэлнэ; үсэг нь 36px-т
              (pill-ийн өөрийн `px-3`-ийн улмаас) буух ба энэ нь баруун
              талын бүлгийн гарчгуудаас бага зэрэг доогуур эхэлж байгаа нь
              pill-тэй жагсаалтад ХЭВИЙН. */}
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

        {/* ─── SEPARATOR + БАРУУН: солигддог панел ───
            `min-h-44` — агуулга нь бүлгийн тоогоор өндөр/намхан болдог тул
            зураас нь мөр бүрт өөр урттай болж "хэлбэлзэнэ". Доод хязгаар
            тавихад зураас тогтвортой, зүүн баганаас доогуур харагдана.

            `role="group"` + `aria-labelledby` — зүүн талын СОНГОСОН мөр нь
            энэ хэсгийн НЭР болно. `role`-гүйгээр `aria-labelledby` нь
            `<div>` дээр илэрхийлэгддэггүй. */}
        <div
          role="group"
          aria-labelledby={active ? `mega-branch-${active.id}` : undefined}
          className="border-border min-h-44 flex-1 border-l pl-10"
        >
          {active?.groups?.length ? (
            /* БҮЛГИЙН БАГАНА — ӨРГӨН ТОГТМОЛ (`w-52` = 208px).
               ⚠️ 2026-09-09, захиалагч: "Дараа төлбөрт ба Урьдчилсан төлбөрт
               үйлчилгээний дэд агуулгын хоорондын зайг Гэр интернет шиг
               болго … цаашдаа ийм хэмжээтэй хий".

               ЯАГААД ЗАЙ БИШ, ӨРГӨН: `gap` нь ХОЁР салаанд аль хэдийн ИЖИЛ
               (80px) байсан — зөрж байсан нь 1-р баганын ӨРГӨН, учир нь
               өргөн нь агуулгаараа тогтдог байв:
                 Үндсэн багцууд  "Priority багц"               ≈  85px
                 Гэр интернет    "4.5G Гэр интернет төхөөрөмж" ≈ 203px
               Тиймээс 2-р багана салаа сольвол ~120px үсэрч, "Багцууд" дээр
               баруун тал хоосон харагдаж байв.

               `w-52` нь хамгийн урт мөрийг (203px) нэг мөрөнд багтаах бөгөөд
               ХАМГИЙН БАГА тогтмол: 2-р багана одоо БҮХ салаанд ЯГ 288px
               (208 + 80)-д суух тул салаа сольвол ХӨДӨЛӨХГҮЙ.

               ⚠️ `shrink-0` ТАВИАГҮЙ ЗОРИУД. Бүлэг ГУРАВ болбол
               3×208 + 2×80 = 784px нь панелийн ~520px-ээс халина; `shrink`
               нээлттэй тул тэр үед баганууд агуулгынхаа доод өргөн хүртэл
               өөрсдөө хумигдаж, хэвтээ халилт гарахгүй. */
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

              {/* Дэд нэрс БЭЛЭН боловч зам нь `#` — жагсаалтын ДООР статус
                  (ж. Олон улсын үйлчилгээ). Хэрэглэгч дарахаасаа өмнө
                  хүлээлтээ тааруулна. */}
              {active.status && <BranchStatusNote status={active.status} className="mt-6" />}
            </>
          ) : active?.status ? (
            /* ⚠️ `"link-only"` ч ЭНД унана — `BranchStatusNote` нь тэр үед
               `null` буцаах тул баруун панел ЗӨРИУД ХООСОН болно
               (ж. Univision > Үндсэн бүтээгдэхүүн: дэд цэс байх ёсгүй, зүгээр
               линк). `min-h-44` + `border-l` тул зураас, layout хөдлөхгүй. */
            <BranchStatusNote status={active.status} centered />
          ) : (
            /* ⚠️ АГУУЛГА ТОДОРХОЙЛОГДООГҮЙ — `maintenance` ч ТАВИАГҮЙ.
               Энэ нь "хөгжүүлэлт дээр" гэсэн ӨӨР төлөв: агуулга нь өөрөө
               ШИЙДЭГДЭЭГҮЙ. Хоёрыг хутгахгүй — data-д `groups` эсвэл
               `maintenance` нэмэхэд тэр дороо ажиллана. */
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

/**
 * Брэндийн mega панел — ХОЁР ХЭЛБЭР.
 *
 * `sections`-ийн нэг ч мөр `groups`-тай бол ХОЁР ПАНЕЛТ (зүүн тогтмол,
 * баруун солигддог — захиалагчийн шинэ загвар). Эс бөгөөс ХУУЧИН хоёр
 * баганат (`sections` + `extras`).
 *
 * Хоёр хэлбэрийг data-аас ТААМАГЛАНА, тусдаа туг тавьдаггүй — codebase-ийн
 * бусад хэсэгтэй ижил зарчим (`mobileMegaMenus[name]` байгаа эсэхээр цэс
 * задрах эсэх шийдэгддэгтэй адил).
 *
 * Одоогоор: Unitel = хоёр панелт · Univision = хуучин.
 */
export function BrandMegaPanel({ menu, onNavigate }: { menu: MegaMenu; onNavigate: () => void }) {
  if (menu.sections.some((s) => s.groups?.length)) {
    return <BranchedMegaPanel menu={menu} onNavigate={onNavigate} />;
  }

  /**
   * ҮНДСЭН АНГИЛАЛ — hover/focus дээр ХАР pill + цагаан текст.
   *
   * `bg-foreground` / `text-background` — theme-ийн токеноор: light-д хар
   * дэвсгэр + цагаан үсэг, dark-д цагаан дэвсгэр + хар үсэг.
   *
   * `w-fit` — pill нь баганы бүтэн өргөнөөр татагдахгүй, үсгээ л ална.
   */
  const sectionCls = cn(
    navType.bar,
    "block w-fit rounded-full px-3 py-1.5 transition-colors",
    "text-foreground hover:bg-foreground hover:text-background",
    "focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none",
  );

  /**
   * НЭМЭЛТ багана — туслах шинжтэй тул pill-гүй, зөвхөн өнгө хүчждэг.
   * `navType.body` (13px · 400) — үндсэн багана 15px · 400 тул зэрэглэл зөв.
   */
  const extraCls = cn(
    navType.body,
    "text-muted-foreground hover:text-foreground block transition-colors",
  );

  const extras = menu.extras ?? MEGA_RELATED_LINKS;

  return (
    // `px-6 py-8` — салаалсан рендертэй ИЖИЛ. Хоёулангийнх нь тайлбарыг
    // `BranchedMegaPanel`-д үз; нэгийг сольвол НӨГӨӨГ НЬ ч дагаж засна.
    <div className="mx-auto max-w-300 px-6 py-8">
      <div className="flex items-start gap-16">
        <div>
          <h3 className={cn(navType.groupLabel, "mb-4")}>{menu.sectionsLabel ?? menu.name}</h3>
          {/* `-ml-3` ХАСАГДСАН — салаалсан рендертэй ИЖИЛ шалтгаанаар
              (`BranchedMegaPanel`-ийн тайлбарыг үз). */}
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
 *
 * ⚠️ `className` НЭМЭГДСЭН (2026-09-09). Desktop-ийн капсулын хэрэгслийн
 * бүлэгт дугуй хэлбэрээр суух шаардлагатай болсон. `ProfilePill`-ЭЭР
 * ОРЛУУЛААГҮЙ ЗӨРИУД: тэр нь нэвтэрсэн үед ШУУД гаргадаг, харин энэ нь
 * хэрэглэгчийн нэр + "Гарах" гэсэн dropdown үзүүлдэг — desktop-д тэр илүү
 * баялаг зан төлөв бөгөөс түүнийг хэлбэрийн төлөө алдах нь регресс болно.
 */
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

/** Icon-only ghost button */
export function IconButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  /**
   * Өгвөл БОДИТ товч болно. Өгөхгүй бол зөвхөн харагдац — жишээ нь
   * "Хэл солих" нь i18n давхарга байхгүй тул одоогоор үйлдэлгүй.
   */
  onClick?: () => void;
  /** Нээлттэй төлөв — дэвсгэрээр тодруулж, `aria-expanded` мөн тавина. */
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

/** Mobile-ийн Sheet дотор тогтсон toggle мөр */
export function MobileToggleRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="hover:bg-muted flex items-center justify-between rounded-md px-2 py-2 transition-colors">
      <span className={navType.mobileLink}>{label}</span>
      {children}
    </div>
  );
}
