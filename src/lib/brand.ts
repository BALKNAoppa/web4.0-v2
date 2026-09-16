export type BrandId = "unitel" | "univision";

export type Owner = BrandId | "self";

export const BRAND: BrandId =
  process.env.NEXT_PUBLIC_BRAND === "univision" ? "univision" : "unitel";

export const BRAND_LABEL: Record<BrandId, string> = {
  unitel: "Unitel",
  univision: "Univision",
};

export const BRAND_ACCENT: Record<BrandId, string> = {
  unitel: "#45c700",
  univision: "#0FAA0A",
};

export const ACCENT = BRAND_ACCENT[BRAND];

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

const SITE_URL: Record<BrandId, string> = {
  unitel: normalizeSiteUrl(process.env.NEXT_PUBLIC_UNITEL_URL, "http://localhost:3000"),
  univision: normalizeSiteUrl(process.env.NEXT_PUBLIC_UNIVISION_URL, "http://localhost:3001"),
};

function normalizeSiteUrl(value: string | undefined, fallback: string): string {
  return (value?.trim() || fallback).replace(/[/]+$/, "");
}

export function brandSiteUrl(brand: BrandId = BRAND): string {
  return SITE_URL[brand];
}

const OWN_SAMPLE_URLS: ReadonlySet<string> = new Set(Object.values(SITE_URL));

export type ResolvedHref = {
  href: string;
  external: boolean;
  newTab: boolean;
};

export function resolveHref(path: string, owner: Owner = "self"): ResolvedHref {
  if (path.startsWith("http")) {
    const own = OWN_SAMPLE_URLS.has(path.replace(/[/]+$/, ""));
    return { href: path, external: true, newTab: !own };
  }
  if (owner !== "self" && owner !== BRAND) {
    return { href: SITE_URL[owner], external: true, newTab: false };
  }
  if (path === "#" || path === "/#") return { href: path, external: false, newTab: false };
  return { href: path, external: false, newTab: false };
}
