/**
 * Хоёр сайтын НЭГ КОД — Unitel ба Univision нэг codebase-ээс, зөвхөн env-ээр
 * ялгаатай build хийгдэнэ. Ингэснээр header, mega menu, chat хоёр талдаа
 * автоматаар ижил байна (хуулбар байхгүй → зөрөх боломжгүй).
 *
 * Локал:
 *   $env:NEXT_PUBLIC_BRAND='unitel';    npm run dev -- -p 3000
 *   $env:NEXT_PUBLIC_BRAND='univision'; npm run dev -- -p 3001
 * Vercel: нэг repo → 2 project, тус бүр өөрийн NEXT_PUBLIC_BRAND + домэйнтэй.
 */
export type BrandId = "unitel" | "univision";

/**
 * Цэсний зүйлийн эзэн — линк дотогшоо явах уу, нөгөө сайт руу үсрэх үү
 * гэдгийг шийднэ. "self" = хоёр сайт дээр хоёуланд нь дотоод хуудас
 * (Урамшуулал, Тусламж гэх мэт тус бүр өөрийн хувилбартай зүйлс).
 */
export type Owner = BrandId | "self";

/** Энэ build аль брэндийнх вэ. Тодорхойгүй бол Unitel. */
export const BRAND: BrandId =
  process.env.NEXT_PUBLIC_BRAND === "univision" ? "univision" : "unitel";

export const BRAND_LABEL: Record<BrandId, string> = {
  unitel: "Unitel",
  univision: "Univision",
};

/**
 * Брэндийн онцлох ногоон (лого-гоос). Section-үүд дотор hex hardcode хийхийн
 * оронд эндээс авна — ингэснээр build бүр өөрийн өнгөөр гарна.
 */
export const BRAND_ACCENT: Record<BrandId, string> = {
  unitel: "#45c700",
  univision: "#0FAA0A",
};

/** Энэ build-ийн онцлох ногоон */
export const ACCENT = BRAND_ACCENT[BRAND];

/**
 * Брэндийн үгэн лого (wordmark) — light/dark хос. width/height нь SVG-ийн
 * жинхэнэ харьцаа (next/image-д intrinsic хэмжээ шаардлагатай).
 *
 * scale — харагдах хэмжээний тохируулга. Univision-ы SVG-д viewBox дотроо
 * босоо хоосон зай багтсан (37-ийн 30 нь агуулга) тул ижил өндөр дээр жижиг
 * харагддаг; 1.2-оор нөхөж хоёр брэндийн лого оптикоор жигдэрнэ.
 *   unitel    viewBox 2470×510 → 4.84:1, зай багтаагүй
 *   univision viewBox  152×37  → 4.11:1, ~19% босоо зайтай
 */
export const BRAND_LOGO: Record<
  BrandId,
  { light: string; dark: string; width: number; height: number; scale: number; icon: string }
> = {
  unitel: {
    light: "/unitel-logo.svg",
    dark: "/unitel-logo-dark.svg",
    width: 116,
    height: 24,
    scale: 1,
    icon: "/unitel-icon.svg",
  },
  univision: {
    light: "/univision-logo.svg",
    dark: "/univision-logo-dark.svg",
    width: 99,
    height: 24,
    scale: 1.2,
    icon: "/univision-icon.svg",
  },
};

/**
 * Брэнд бүрийн үндсэн хаяг. Локал дээр порт, Vercel дээр бодит домэйн.
 * Хоёр project хоёулаа ХОЁУЛАНГ нь мэдэж байх ёстой — эс бөгөөс хөндлөн
 * линк үүсгэж чадахгүй.
 */
const SITE_URL: Record<BrandId, string> = {
  unitel: normalizeSiteUrl(process.env.NEXT_PUBLIC_UNITEL_URL, "http://localhost:3000"),
  univision: normalizeSiteUrl(process.env.NEXT_PUBLIC_UNIVISION_URL, "http://localhost:3001"),
};

/**
 * Хаягийн төгсгөлийн ташуу зураасыг жигдрүүлнэ. Vercel-ийн env-д
 * `https://univision-web4.vercel.app/` гэж зураастай хуулах нь элбэг —
 * түүнийг хасахгүй бол `…app//` гэсэн хоёр зураас үүснэ.
 */
function normalizeSiteUrl(value: string | undefined, fallback: string): string {
  return (value?.trim() || fallback).replace(/[/]+$/, "");
}

/**
 * Брэндийн sample сайтын үндсэн хаяг (төгсгөлийн "/"-гүй).
 * Аргументгүй бол ЭНЭ build-ийн брэнд.
 *
 * ⚠️ `data/navigation.ts` нь header-ийн ангиллыг ЭНДЭЭС барина — цэсний
 * мөрүүд нь зам биш, БҮТЭН ХАЯГ агуулна (2026-09-15). Тиймээс Unitel-ийн
 * sample дээрх "Univision" нь Univision-ы sample руу шууд очно.
 */
export function brandSiteUrl(brand: BrandId = BRAND): string {
  return SITE_URL[brand];
}

/**
 * Манай ХОЁР sample-ийн хаяг. `resolveHref` эдгээрийг "гадаад сайт"-аас
 * ялгаж, ШИНЭ TAB НЭЭХГҮЙ — хоёр sample нь нэг танилцуулгын хоёр тал тул
 * таб үржүүлэх нь танилцуулгыг эмх замбараагүй болгоно.
 */
const OWN_SAMPLE_URLS: ReadonlySet<string> = new Set(Object.values(SITE_URL));

export type ResolvedHref = {
  href: string;
  /** true бол Next-ийн router биш, энгийн `<a>` (өөр домэйн) */
  external: boolean;
  /**
   * ШИНЭ tab-аар нээх үү.
   * ⚠️ ХӨНДЛӨН БРЭНД нь FALSE — ЭНЭ ТАБ ДОТРОО шилжинэ (2026-09-15,
   * захиалагч: "шинэ tab-аар шилжүүлэхгүйгээр тухайн таб дотроо").
   * ЖИНХЭНЭ гадаад сайт (http…, ж. unitelgroup.mn) л шинэ tab-аар нээгдэнэ.
   */
  newTab: boolean;
};

/**
 * Зам + эзэн → бодит href.
 *   эзэн нь энэ сайт (эсвэл "self") → дотоод зам хэвээр
 *   эзэн нь НӨГӨӨ сайт            → тэр сайтын НҮҮР, ЭНЭ ТАБ ДОТРОО
 *   http… гадаад URL              → хэвээр, ШИНЭ tab
 *
 * ⚠️⚠️ ХӨНДЛӨН БРЭНД ҮРГЭЛЖ НҮҮР РҮҮ (2026-09-15, захиалагч: "янз бүрийн
 * хуудас руу биш, яг Univision-ы sample руу шилжүүлээрэй"). Өмнө нь зам нь
 * хадгалагдаж `univision-web4.vercel.app/main-packages?plan=triple` гэх мэт
 * ГҮН хуудас руу үсэрдэг байв. Танилцуулгад нөгөө сайтыг ЭХЛЭЛЭЭС нь үзүүлэх
 * ёстой тул зам нь ЗОРИУД хаягдана.
 *
 * ⚠️⚠️ ДАРААЛАЛ СОЛИГДСОН: хөндлөн брэндийн шалгалт нь `"#"`-ЭЭС ӨМНӨ.
 * Өмнө нь `"#"` эхэлж таслан буцаадаг байсан тул `{ name: "Univision",
 * href: "#", owner: "univision" }` гэх мэт цэс (dock, burger) ХААШАА Ч
 * заадаггүй байв. Одоо ЗАМ БИШ, ЭЗЭН нь шийднэ — тиймээс `href` нь `"#"`
 * хэвээр байсан ч нөгөө брэнд рүү зөв шилжинэ.
 * ⇒ Дотоод замуудыг идэвхгүй болгосон `"/#"` дүрэм нь ЭНЭ САЙТЫН
 *   (`self`/өөрийн брэнд) линкүүдэд хэвээр үйлчилнэ.
 */
export function resolveHref(path: string, owner: Owner = "self"): ResolvedHref {
  if (path.startsWith("http")) {
    // Манай нөгөө sample мөн ЭНЭ ТАБ ДОТРОО; жинхэнэ гадаад сайт (unitel.mn,
    // unitelgroup.mn …) л шинэ tab нээнэ.
    const own = OWN_SAMPLE_URLS.has(path.replace(/[/]+$/, ""));
    return { href: path, external: true, newTab: !own };
  }
  if (owner !== "self" && owner !== BRAND) {
    return { href: SITE_URL[owner], external: true, newTab: false };
  }
  if (path === "#" || path === "/#") return { href: path, external: false, newTab: false };
  return { href: path, external: false, newTab: false };
}
