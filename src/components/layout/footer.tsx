"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  AppStoreRow,
  DesktopFooterCard,
  FooterHeading,
  SHOW_APP_DOWNLOAD,
  SocialRow,
} from "@/components/layout/footer-shared";
import { FooterSitemapVariant } from "@/components/layout/footer-v2";
import { footerLinks, footerTagline } from "@/data/footer";
import { useHeaderVariant } from "@/lib/header-variant";

// =====================================================================
// Гадны экспорт — бусад хуудсууд `Footer` гэж import-лоор ашигладаг.
//
// Хувилбар нь HEADER-ийн toggle-той ХАМТ солигдоно (`useHeaderVariant`):
//   1 → Телеком классик (sitemap багана / mobile accordion)
//   2 → Singtel-styled (лого + апп + сошиал)
//
// ⚠️ 1 ба 2 нь ЗОРИУД СОЛИГДСОН (өмнө 1 = Singtel, 2 = sitemap байсан).
// ⚠️ Хувилбар 3 (Ecosystem footer) нь header-ийн Хувилбар 3-тай хамт УСТСАН.
//
// SSR-д header-ийн store үргэлж 1 буцаадаг тул server дээр Хувилбар 1
// рендэрлэгдээд, client дээр localStorage-оос уншиж зөөлөн солигдоно.
// =====================================================================
export function Footer() {
  const variant = useHeaderVariant();

  if (variant === 2) return <FooterClassic />;
  return <FooterSitemapVariant />;
}

// =====================================================================
// ХУВИЛБАР 2 — Singtel-styled footer.
//
// Desktop — `DesktopFooterCard`: БҮХ ХУВИЛБАРТАЙ ИЖИЛ (2026-09-08,
//   захиалагчийн заавар "desktop-ийн бүх footer"). Өмнө нь энэ файлын
//   responsive блок нь desktop-д ч рендерлэгддэг байсан (Logo + tagline |
//   Апп татах | Сошиал, доор нь түргэн холбоосын мөр) — тэр нь одоо
//   `lg:hidden`-ээр ЗӨВХӨН мобайл/таблетад үлдэв.
//
// Mobile — хуучин бүтэц ХӨНДӨГДӨӨГҮЙ.
//
// ⚠️ LegalStrip нь энэ хувилбарт ЗОРИУД байхгүй (мобайлд copyright
// харуулахгүй) — desktop-д харин картын дотор орсон.
// =====================================================================
function FooterClassic() {
  return (
    <footer aria-label="Footer" className="border-border bg-background border-t lg:border-t-0">
      <DesktopFooterCard />

      <div className="lg:hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-10 md:flex-row md:flex-wrap md:items-start md:gap-12">
            {/* Зүүн — Logo + tagline (үлдсэн зайг шингээнэ) */}
            <div className="flex flex-col gap-4 md:max-w-sm md:flex-1">
              <LogoHomeLink className="inline-flex items-center" aria-label="Нүүр">
                <BrandLogo height={28} />
              </LogoHomeLink>
              {/* Тайлбар нь одоо data-аас (`footerTagline`) — desktop картын
                  тайлбартай НЭГ эх сурвалж, хоёр өргөнд зөрөхгүй. */}
              <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                {footerTagline}
              </p>
            </div>

            {/* Дунд — Апп татах (3-ыг нэг мөрөнд). Unitel дээр харагдахгүй. */}
            {SHOW_APP_DOWNLOAD && (
              <div>
                <FooterHeading>Апп татах</FooterHeading>
                <AppStoreRow className="mt-4" />
              </div>
            )}

            {/* Баруун — Сошиал хаяг */}
            <div>
              <FooterHeading>Сошиал хаяг</FooterHeading>
              <SocialRow className="mt-4" />
            </div>
          </div>
        </div>

        {/* Түргэн холбоос — өмнөх bottom strip-ийн nav хэсэг */}
        <div className="border-border border-t">
          <nav aria-label="Footer navigation" className="container mx-auto px-4 py-5">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start md:gap-x-8">
              {footerLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-foreground text-sm transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
