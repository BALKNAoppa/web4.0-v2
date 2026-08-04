import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  AppStoreRow,
  FooterHeading,
  LegalStrip,
  SocialRow,
} from "@/components/layout/footer-shared";
import { footerSitemap, type FooterLink } from "@/data/footer";

/**
 * ХУВИЛБАР 2 — "Телеком классик"
 *
 * Хоёр хэлбэр нь ЗОРИУД өөр:
 *
 * Desktop — БҮГД НЭГ ЭГНЭЭНД: зүүн ирмэгт брэндийн лого, дараа нь ангиллын
 *   3 багана нягт зэрэгцээд, баруун ирмэгт Апп татах + Сошиал хаяг.
 *   Dropdown/accordion БАЙХГҮЙ — бүх линк ил. Гарчиг нь линкүүдээсээ тодрох
 *   ч хэт хүчтэй биш (`FooterHeading` = 14px semibold + foreground, линк нь
 *   14px + muted).
 *
 * Mobile — дарааллаар:
 *   1. Апп татах (ХАМГИЙН ДЭЭР)
 *   2. Secondary navigation — accordion (dropdown) хэлбэрээр
 *   3. Сошиал хаяг
 *
 * Хамгийн доор — 3 хувилбарт нийтлэг `LegalStrip`: copyright + "Бидний тухай ·
 * Тогтвортой ирээдүй · …" линкүүд + бүс нутаг.
 */
export function FooterSitemapVariant() {
  return (
    <footer aria-label="Footer" className="border-border bg-background border-t">
      <DesktopSitemap />
      <MobileSitemap />
      <LegalStrip />
    </footer>
  );
}

/** Бүх багананд ашиглагдах линк — гадаад бол шинэ tab */
function FooterNavLink({ item }: { item: FooterLink }) {
  // `no-underline` — AccordionContent нь доторх бүх `<a>`-г underline болгодог
  const className =
    "text-muted-foreground hover:text-foreground text-sm no-underline transition-colors";

  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.label} (шинэ tab-д нээгдэнэ)`}
      className={className}
    >
      {item.label}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

// =====================================================================
// DESKTOP — лого + гарчигтай баганууд НЭГ эгнээнд
// =====================================================================
function DesktopSitemap() {
  return (
    <div className="container mx-auto hidden py-12 lg:block">
      {/* БҮГД НЭГ ЭГНЭЭНД: лого · 3 багана (зүүн тийш шахсан) · апп + сошиал (баруунд) */}
      <div className="flex items-start gap-12">
        {/* Брэндийн лого — зүүн ирмэгт */}
        <LogoHomeLink className="inline-flex shrink-0 items-center" aria-label="Нүүр">
          <BrandLogo height={28} />
        </LogoHomeLink>

        {/* БҮХ БАГАНА нэг flex-д — хоорондын зай БҮГД ижил `gap-14` (56px).
            `justify-between` БАЙХГҮЙ тул зай нь дэлгэцийн өргөнөөс хамаарч
            сунахгүй, тогтмол хэвээр. Логоны зай нь тусдаа (гадна `gap-12`).
            Дараалал: Харилцаа холбоо · Платформ · Дижитал үйлчилгээ ·
                      Апп татах · Сошиал хаяг */}
        <div className="flex items-start gap-14">
          {footerSitemap.map((column) => (
            <div key={column.id}>
              <FooterHeading>{column.title}</FooterHeading>
              <ul className="mt-4 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.id}>
                    <FooterNavLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <FooterHeading>Апп татах</FooterHeading>
            {/* `flex-col` — badge бүр өөрийн мөрөнд (3 мөр) */}
            <AppStoreRow className="mt-4 flex-col" />
          </div>

          <div>
            <FooterHeading>Сошиал хаяг</FooterHeading>
            <SocialRow className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// MOBILE — Апп татах ДЭЭР → accordion → сошиал → компани
// =====================================================================
function MobileSitemap() {
  return (
    <div className="container mx-auto py-8 lg:hidden">
      {/* 1. Апп татах — хамгийн дээр */}
      <div>
        <FooterHeading>Апп татах</FooterHeading>
        <AppStoreRow className="mt-3" />
      </div>

      {/* 2. Secondary navigation — dropdown (accordion) хэвээр */}
      <Accordion type="single" collapsible className="border-border mt-6 border-t pt-1">
        {footerSitemap.map((column) => (
          <AccordionItem key={column.id} value={column.id}>
            <AccordionTrigger className="text-foreground text-base font-semibold">
              {column.title}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2.5 pb-2">
                {column.items.map((item) => (
                  <li key={item.id}>
                    <FooterNavLink item={item} />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* 3. Сошиал хаяг — байрандаа хэвээр. Түүний доорх "Бидний тухай ·
             Тогтвортой ирээдүй …" хэсэг нь `LegalStrip` дотор байрлана. */}
      <div className="border-border mt-6 border-t pt-6">
        <FooterHeading>Сошиал хаяг</FooterHeading>
        <SocialRow className="mt-3" />
      </div>
    </div>
  );
}
