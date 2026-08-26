"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, Gift, LogOut, User } from "lucide-react";

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
export const MENU_PROMOS_HEADING =
  "Энэ цэстэй холбоотой урамшуулалууд энд байрлана /Онцлох урамшуулал гэсэн title байна/";

/**
 * Цэсний урамшуулал — PLACEHOLDER. Мөр бүрийн БҮТЭЦ нь screenshot-ийн дагуу:
 *
 *   ( ◯ дугуй зураг )   Урамшууллын гарчиг
 *                       → CTA
 *
 * Desktop (`BrandMegaPanel`) ба mobile (`MenuPromoTeaser`) ХОЁУЛАА эндээс
 * уншина тул тоо, бичвэр зөрөхгүй. Жинхэнэ урамшууллын data гарахад энэ
 * жагсаалт цэсээс хамаарч динамик болно.
 *
 * ⚠️ `title` · `ctaLabel` нь ЕРӨНХИЙ шошго — жинхэнэ маркетингийн үг ЗОХИОХГҮЙ.
 * `image` талбар ОДООГООР байхгүй: зураг бэлэн болоход энд `image: string`
 * нэмээд `PromoAvatar` дотор `next/image` болгоно. Түүнийг хүртэл дугуй нь
 * дүрстэй placeholder.
 */
export const MENU_PROMOS: { title: string; ctaLabel: string; href: string }[] = [
  {
    title: "Урамшууллыг илтгэх highlight хийх title энд байрлана",
    ctaLabel: "Дэлгэрэнгүй",
    href: "/campaigns",
  },
  {
    title: "Урамшууллыг илтгэх highlight хийх title энд байрлана",
    ctaLabel: "Дэлгэрэнгүй",
    href: "/campaigns",
  },
];

/**
 * Урамшууллын ДУГУЙ ЗУРАГ — одоогоор placeholder.
 *
 * ХЭМЖЭЭ: `size-14` (56px) нь header-ийн мөрний өндөртэй (56–64px) тэнцүү —
 * screenshot дээрх дугуй ч мөрний өндрийн хэрээр байна. Үүнээс томсговол
 * хоёр урамшуулал панелийн зүүн баганаас (Unitel = 6 мөр) илүү өндөр болж,
 * панел сунана.
 *
 * `shrink-0` — гарчиг хоёр мөр болоход дугуй зууван болохоос сэргийлнэ.
 */
function PromoAvatar() {
  return (
    <span
      aria-hidden="true"
      className="bg-muted text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-full"
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

  /**
   * НЭМЭЛТ багана — туслах шинжтэй тул pill-гүй, зөвхөн өнгө хүчждэг.
   *
   * ⚠️ `navType.secondaryLink` (13px · **600**) байсныг `body` (13px · 400)
   * болгов. Үндсэн багана нь `navType.bar` (15px · **400**) тул туслах багана
   * нь үндсэнээсээ ЗУЗААН байж, зэрэглэл нүдэнд ЭСРЭГ уншигдаж байв.
   * Mobile-ийн `SectionRow`-д ч ижил алдаа байсныг хамт зассан.
   */
  const extraCls = cn(
    navType.body,
    "text-muted-foreground hover:text-foreground block transition-colors",
  );

  /**
   * ХУРДАН ҮЙЛДЭЛ — дээд мөр. МИНИМАЛ: хүрээтэй pill байсныг хассан.
   * Ангиллын линкээс ялгарах нь хэлбэрээр биш БАЙРЛАЛААР шийдэгдэнэ —
   * дээд мөрөнд, доогуураа зааглагдсан. Тод илэрхийлэл нь өнгө + underline.
   */
  // `navType.body` (13px) — өмнөх `navType.bar` (15px)-ээс ЖИЖИГ. Эдгээр нь
  // ангиллын үндсэн линкүүдээс дэд зэрэглэлийн шууд үйлдэл тул мөрний
  // линкүүдтэй ижил хэмжээтэй байх шаардлагагүй.
  // Underline ХЭРЭГЛЭХГҮЙ — доогуур зураас нь ИДЭВХТЭЙ ангиллын тэмдэг
  // (`header.tsx > CategoryNav`), quick action-д тавибал утга давхцана.
  const quickCls = cn(
    navType.body,
    "text-foreground/75 hover:text-foreground focus-visible:text-foreground inline-flex items-center transition-colors focus-visible:outline-none",
  );

  const extras = menu.extras ?? MEGA_RELATED_LINKS;

  return (
    // `py-8` (32px) байсныг ДЭЭД талд `pt-4` (16px) болгов — панел header-ийн
    // доод ирмэгээс шууд задардаг тул дээд зай нь header-тэй хамт хуримтлагдаж
    // хэтэрхий сул харагдаж байв. Доод `pb-8` хэвээр: панелийн доод ирмэг нь
    // хуудасны агуулгатай зааглагдах зай хэрэгтэй.
    <div className="mx-auto max-w-300 px-4 pt-4 pb-8">
      {/* ХУРДАН ҮЙЛДЭЛ — ГАРЧИГГҮЙ дээд мөр, доогуураа зааглана.
          `quickActions` өгөөгүй цэс дээр мөр бүхэлдээ рендерлэгдэхгүй —
          хоосон зай гаргахгүй. (Одоо панелтай хоёр цэс — Unitel · Univision —
          хоёулаа өгсөн байгаа тул энэ салаа ажиллахгүй, гэхдээ шинэ цэс
          нэмэхэд хамгаалалт болж үлдэнэ.) */}
      {menu.quickActions && menu.quickActions.length > 0 && (
        // pill-ийн padding явсан тул элементүүд хоорондоо `gap-x-6`-аар
        // амьсгална — эс бөгөөс текстүүд нэг урт мөр шиг нийлж уншигдана.
        <div className="border-border mb-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-b pb-6">
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

        {/* Багана 3 — УРАМШУУЛАЛ. Мөр бүр = дугуй зураг + гарчиг + CTA
            (screenshot-ийн бүтэц). Баганын ерөнхий тайлбар нь ДЭЭР нэг л удаа
            (`MENU_PROMOS_HEADING`) — мөр бүр дээр давтагдахгүй.

            ӨРГӨН: `w-fit` нь дугуй + текстийн баганаас бүрдэх мөрөнд ТОХИРОХГҮЙ
            (агуулга нь өөрөө өргөнөө тогтоох гэж зууван болно). Тиймээс `w-76`
            (304px) — дугуй 56px + зай 16px ⇒ текстэд ~230px үлдэнэ, ерөнхий
            гарчиг хоёр мөрөнд багтана. */}
        <div className="ml-auto w-76 shrink-0">
          <h3 className={cn(navType.groupLabel, "mb-4")}>{MENU_PROMOS_HEADING}</h3>

          {/* `gap-5` — хоёр урамшууллыг тод салгана, эс бөгөөс нэгний CTA
              нөгөөгийн гарчигтай солбицож уншигдана. */}
          <div className="flex flex-col gap-5">
            {MENU_PROMOS.map((promo, i) => (
              // Гарчиг/CTA нь ХОЁУЛАА placeholder тул `key`-д давтагдашгүй
              // зүйл алга — index хэрэглэв. Жинхэнэ data орж ирэхэд promo.id.
              <div key={i} className="flex items-center gap-4">
                <PromoAvatar />
                {/* `min-w-0` — flex хүүхэд нь анхдагчаар агуулгынхаа доод
                    өргөнөөс шахагддаггүй; үүнгүйгээр урт гарчиг баганаас
                    халина. */}
                <div className="flex min-w-0 flex-col items-start">
                  <p className={cn(navType.secondaryLink, "text-foreground")}>{promo.title}</p>
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
