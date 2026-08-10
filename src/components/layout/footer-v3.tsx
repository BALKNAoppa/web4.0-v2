import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  AppStoreRow,
  FooterHeading,
  LegalStrip,
  SHOW_APP_DOWNLOAD,
  SocialRow,
  StoreIcon,
} from "@/components/layout/footer-shared";
import { footerLinks } from "@/data/footer";
import { appStores, footerEcosystem, type FooterBrand } from "@/data/footer-extras";
import { cn } from "@/lib/utils";

/**
 * ХУВИЛБАР 3 — "Ecosystem"
 *
 * Header-ийн Apple маягийн нэгдсэн nav-ийн санааг footer дээр давтана:
 * групп нь тусдаа сайтуудын цуглуулга биш, НЭГ экосистем.
 *
 * Desktop: брэндүүд 5 карт болж зэрэгцэнэ.
 * Mobile:  desktop-ынхоо хуулбар БИШ — картууд хэвтээ snap-scroll болж,
 *          хуруугаараа гүйлгэдэг "апп шиг" мэдрэмж өгнө.
 *
 * Өнгө: бүхэл footer-ээ `.dark` wrapper дотор оруулсан тул site-ийн theme
 * ямар ч байсан ҮРГЭЛЖ бараан "арал" болж харагдана. Ингэснээр token-ууд
 * (`bg-background`, `text-muted-foreground` …) болон BrandLogo-ийн dark
 * хувилбар автоматаар зөв сонгогдоно — гар аргаар өнгө бичих шаардлагагүй.
 */
export function FooterEcosystemVariant() {
  return (
    <div className="dark">
      <footer aria-label="Footer" className="bg-background text-foreground">
        <div className="container mx-auto py-12 lg:py-16">
          {/* ── Брэнд мессеж ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 lg:max-w-xl">
            <LogoHomeLink className="inline-flex w-fit items-center" aria-label="Нүүр">
              <BrandLogo height={28} />
            </LogoHomeLink>
            <h2 className="text-foreground text-xl font-semibold lg:text-2xl">
              Нэг экосистем — бүх үйлчилгээ
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Өндөр хурдны интернэт, 4G/5G сүлжээ, утасүй интернэт, байгуулагын үйлчилгээ зэрэг бүх
              үйлчилгээ нэг дор.
            </p>
          </div>

          {/* ── Брэнд картууд ────────────────────────────────────────── */}
          {/* Desktop — 5 карт зэрэгцэнэ */}
          <ul className="mt-8 hidden gap-3 lg:grid lg:grid-cols-5">
            {footerEcosystem.map((brand) => (
              <li key={brand.id}>
                <BrandCard brand={brand} />
              </li>
            ))}
          </ul>

          {/* Mobile — SCROLL БАЙХГҮЙ: бүх брэнд нэг дор харагдана.
              2 баганат grid; нийт тоо сондгой бол сүүлийн карт бүтэн мөр эзэлнэ. */}
          <ul className="mt-8 grid grid-cols-2 gap-3 lg:hidden">
            {footerEcosystem.map((brand, i, arr) => (
              <li
                key={brand.id}
                className={cn(i === arr.length - 1 && arr.length % 2 === 1 && "col-span-2")}
              >
                <BrandCard brand={brand} />
              </li>
            ))}
          </ul>

          {/* ── Түргэн холбоос + апп + сошиал ───────────────────────── */}
          <div className="border-border mt-10 flex flex-col gap-8 border-t pt-8 lg:flex-row lg:items-start lg:justify-between">
            <nav aria-label="Түргэн холбоос">
              <FooterHeading>Түргэн холбоос</FooterHeading>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-6">
                {footerLinks.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
              {SHOW_APP_DOWNLOAD && (
                <div>
                  <FooterHeading>Апп татах</FooterHeading>
                  {/* Desktop — зөвхөн icon; hover дээр QR задарна */}
                  <AppQrRow className="mt-4 hidden lg:flex" />
                  {/* Mobile — hover байхгүй тул badge хэвээр */}
                  <AppStoreRow className="mt-4 lg:hidden" />
                </div>
              )}
              <div>
                <FooterHeading>Сошиал хаяг</FooterHeading>
                <SocialRow className="mt-4" />
              </div>
            </div>
          </div>
        </div>

        <LegalStrip />
      </footer>
    </div>
  );
}

// =====================================================================
// AppQrRow — ЗӨВХӨН DESKTOP. Апп татах нь badge биш, зөвхөн дугуй icon.
// Icon дээр hover (эсвэл tab-аар focus) хийхэд дээр нь QR задарна.
//
// QR нь `pointer-events-none` тул хулганы доор орж hover-ыг тасалдуулахгүй.
// Утга нь `appStores[].qrValue` — одоогоор sample холбоос.
// =====================================================================
function AppQrRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {appStores.map((store) => (
        <li key={store.id} className="group relative">
          <Link
            href={store.href}
            aria-label={`${store.prefix} ${store.storeName}`}
            className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <StoreIcon storeId={store.id} />
          </Link>

          {/* Hover panel — icon-ы ДЭЭР талд, төвлөрсөн */}
          <div
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 translate-y-1 scale-95 opacity-0 transition-[opacity,transform] duration-200 ease-out group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
          >
            <div className="bg-popover border-border rounded-2xl border p-3 shadow-xl">
              {/* QR нь уншигдахын тулд ҮРГЭЛЖ цагаан дэвсгэр дээр байна */}
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG
                  value={store.qrValue}
                  size={104}
                  bgColor="#ffffff"
                  fgColor="#0a0a0a"
                  level="M"
                  marginSize={0}
                />
              </div>
              <p className="text-muted-foreground mt-2 text-center text-[11px] whitespace-nowrap">
                {store.storeName}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// =====================================================================
// BrandCard — desktop grid болон mobile grid-д ижил карт
// =====================================================================
function BrandCard({ brand, className }: { brand: FooterBrand; className?: string }) {
  return (
    <Link
      href={brand.href}
      {...(brand.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={brand.external ? `${brand.name} (шинэ tab-д нээгдэнэ)` : brand.name}
      className={cn(
        "border-border hover:bg-muted/50 hover:border-foreground/30 focus-visible:ring-ring flex h-full flex-col rounded-2xl border p-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      <span className="text-foreground flex items-center gap-1 text-base font-semibold">
        {brand.name}
        {brand.external && <ArrowUpRight className="size-3.5 opacity-60" aria-hidden="true" />}
      </span>
      <span className="text-muted-foreground mt-1 text-xs leading-relaxed">{brand.tagline}</span>
    </Link>
  );
}
