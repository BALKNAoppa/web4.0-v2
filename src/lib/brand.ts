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
  unitel: process.env.NEXT_PUBLIC_UNITEL_URL ?? "http://localhost:3000",
  univision: process.env.NEXT_PUBLIC_UNIVISION_URL ?? "http://localhost:3001",
};

export type ResolvedHref = {
  href: string;
  /** true бол өөр домэйн — шинэ tab-аар нээнэ */
  external: boolean;
};

/**
 * Зам + эзэн → бодит href.
 *   эзэн нь энэ сайт (эсвэл "self") → дотоод зам хэвээр
 *   эзэн нь нөгөө сайт            → бүтэн URL, шинэ tab
 * Гадаад URL (http…) болон "#" placeholder-ыг хөндөхгүй дамжуулна.
 */
export function resolveHref(path: string, owner: Owner = "self"): ResolvedHref {
  if (path.startsWith("http")) return { href: path, external: true };
  if (path === "#") return { href: path, external: false };
  if (owner === "self" || owner === BRAND) return { href: path, external: false };
  return { href: `${SITE_URL[owner]}${path}`, external: true };
}
