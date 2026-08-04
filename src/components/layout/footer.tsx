"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import { AppStoreRow, FooterHeading, SocialRow } from "@/components/layout/footer-shared";
import { FooterSitemapVariant } from "@/components/layout/footer-v2";
import { FooterEcosystemVariant } from "@/components/layout/footer-v3";
import { footerLinks } from "@/data/footer";
import { useHeaderVariant } from "@/lib/header-variant";

// =====================================================================
// Гадны экспорт — бусад хуудсууд `Footer` гэж import-лоор ашигладаг.
//
// Хувилбар нь HEADER-ийн toggle-той ХАМТ солигдоно (`useHeaderVariant`):
//   1 → Одоогийн (лого + апп + сошиал)
//   2 → Телеком классик (sitemap багана / mobile accordion)
//   3 → Ecosystem (бараан, брэнд картууд / mobile snap-scroll)
//
// SSR-д header-ийн store үргэлж 1 буцаадаг тул server дээр Хувилбар 1
// рендэрлэгдээд, client дээр localStorage-оос уншиж зөөлөн солигдоно.
// =====================================================================
export function Footer() {
  const variant = useHeaderVariant();

  if (variant === 2) return <FooterSitemapVariant />;
  if (variant === 3) return <FooterEcosystemVariant />;
  // 1 — болон localStorage-д үлдсэн архивласан 4
  return <FooterClassic />;
}

// =====================================================================
// ХУВИЛБАР 1 — Одоогийн footer (Singtel-styled), хэвээр хадгалав.
// Дээд хэсэгт: Logo + tagline | Апп татах | Сошиал хаяг
// Дараа нь: түргэн холбоосын мөр
// Хамгийн доор: LegalStrip (3 хувилбарт нийтлэг)
// =====================================================================
function FooterClassic() {
  return (
    <footer aria-label="Footer" className="border-border bg-background border-t">
      <div className="container mx-auto px-4 py-6 lg:py-7">
        <div className="flex flex-col gap-10 md:flex-row md:flex-wrap md:items-start md:gap-12">
          {/* Зүүн — Logo + tagline (үлдсэн зайг шингээнэ) */}
          <div className="flex flex-col gap-4 md:max-w-sm md:flex-1">
            <LogoHomeLink className="inline-flex items-center" aria-label="Нүүр">
              <BrandLogo height={28} />
            </LogoHomeLink>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Монголын тэргүүлэх дижитал үйлчилгээ хаана ч, хэзээ ч тантай хамт.
            </p>
          </div>

          {/* Дунд — Апп татах (3-ыг нэг мөрөнд) */}
          <div>
            <FooterHeading>Апп татах</FooterHeading>
            <AppStoreRow className="mt-4" />
          </div>

          {/* Баруун — Сошиал хаяг */}
          <div>
            <FooterHeading>Сошиал хаяг</FooterHeading>
            <SocialRow className="mt-4" />
          </div>
        </div>
      </div>

      {/* Түргэн холбоос — өмнөх bottom strip-ийн nav хэсэг.
          Хувилбар 1-д LegalStrip (copyright / legal / бүс нутаг) ЗОРИУД
          байхгүй — зөвхөн Хувилбар 2, 3-т үлдээсэн. */}
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
    </footer>
  );
}
