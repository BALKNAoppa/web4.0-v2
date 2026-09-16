import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  DesktopFooterCard,
  FooterNavLink,
  LegalStrip,
  SocialRow,
} from "@/components/layout/footer-shared";
import { footerSitemap, footerStripLinks } from "@/data/footer";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer aria-label="Footer" className="border-border bg-background border-t lg:border-t-0">
      <DesktopFooterCard />
      <MobileSitemap />
      <LegalStrip />
    </footer>
  );
}

const FOOTER_ROW =
  "flex w-full items-center justify-center border border-transparent py-3 text-center text-base";

const ACCORDION_FADE =
  "duration-[280ms] [[data-state=closed]>&]:animate-out [[data-state=closed]>&]:fade-out [[data-state=open]>&]:animate-in [[data-state=open]>&]:fade-in";

function MobileSitemap() {
  return (
    <div className="px-4 py-8 lg:hidden">
      <div className="bg-card border-border rounded-[28px] border px-4 py-10">
        {}
        <LogoHomeLink className="mx-auto flex w-fit items-center" aria-label="Нүүр">
          <BrandLogo height={28} />
        </LogoHomeLink>

        {
}

        {}
        <nav aria-label="Footer navigation" className="mt-6">
          {
}
          <Accordion type="multiple">
            {footerSitemap.map((column) => (
              <AccordionItem key={column.id} value={column.id} className="not-last:border-b-0">
                <AccordionTrigger
                  className={cn(
                    FOOTER_ROW,
                    "text-foreground gap-1.5 font-medium **:data-[slot=accordion-trigger-icon]:ml-0",
                  )}
                >
                  {column.title}
                </AccordionTrigger>
                {
}
                <AccordionContent className={cn("pb-0 [&_a]:no-underline", ACCORDION_FADE)}>
                  <ul>
                    {column.items.map((item) => (
                      <li key={item.id}>
                        <FooterNavLink item={item} className={FOOTER_ROW} />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {
}
          <ul>
            {footerStripLinks.map((item) => (
              <li key={item.id}>
                <FooterNavLink
                  item={item}
                  className={cn(FOOTER_ROW, "text-foreground font-medium hover:opacity-70")}
                />
              </li>
            ))}
          </ul>
        </nav>

        {}
        <SocialRow className="mt-2 justify-center" />
      </div>
    </div>
  );
}
