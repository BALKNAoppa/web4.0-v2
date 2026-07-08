import Link from "next/link";

import { mainNav, type NavCategory } from "@/data/navigation";
import {
  appDownloadSection,
  appStores,
  socialLinks,
  type AppStoreLink,
  type SocialLink,
} from "@/data/footer-extras";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Footer-ийн secondary navigation
 *
 * Desktop (lg+): grid layout — бүх багана зэрэг харагдана.
 * Mobile: Swisscom-маягийн accordion — багц бүр дарж нээдэг.
 */
export function SecondaryNav() {
  const columns = flattenNav(mainNav);

  return (
    <nav aria-label="Secondary navigation" className="border-border bg-background border-t">
      <div className="container mx-auto py-8 md:py-16 lg:py-20">
        {/* ===== Mobile — Accordion (үндсэн category-ор бүлэглэсэн) ===== */}
        <div className="lg:hidden">
          <Accordion type="single" collapsible className="w-full">
            {mainNav.map((category) => (
              <AccordionItem key={category.label} value={category.label}>
                <AccordionTrigger className="text-foreground text-base font-semibold">
                  {category.label}
                </AccordionTrigger>
                <AccordionContent>
                  {category.columns?.length ? (
                    // Multi-column category — sub-category гарчигтайгаар бүлэглэнэ
                    <div className="space-y-5 pb-2">
                      {category.columns.map((col) => (
                        <div key={col.title}>
                          <h4 className="text-foreground mb-2.5 text-sm font-semibold tracking-wide">
                            {col.title}
                          </h4>
                          <ul className="space-y-2.5">
                            {col.items.map((item) => (
                              <li key={`${col.title}-${item.label}`}>
                                <Link
                                  href={item.href}
                                  className="text-foreground/75 hover:text-foreground text-sm transition-colors"
                                >
                                  <span>{item.label}</span>
                                  {item.badge && (
                                    <span className="bg-muted text-muted-foreground ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Энгийн list category
                    <ul className="space-y-2.5 pb-2">
                      {category.items?.map((item) => (
                        <li key={`${category.label}-${item.label}`}>
                          <Link
                            href={item.href}
                            className="text-foreground/75 hover:text-foreground text-sm transition-colors"
                          >
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="bg-muted text-muted-foreground ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}

          </Accordion>

          {/* App татах + Social — accordion-аас гадуур, icon-тойгоор үргэлж харагдана */}
          <div className="border-border mt-8 flex flex-row gap-8 border-t pt-8 sm:gap-16">
            <div>
              <h3 className="text-foreground text-sm font-semibold">{appDownloadSection.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {appStores.map((store) => (
                  <li key={store.id}>
                    <Link
                      href={store.href}
                      aria-label={`${store.prefix} ${store.storeName}`}
                      className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      <StoreIcon storeId={store.id} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-sm font-semibold">Сошиал сувгууд</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <li key={social.id}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.name} (шинэ tab-д нээгдэнэ)`}
                      className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      <SocialIcon socialId={social.id} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Desktop — Grid ===== */}
        <ul className="hidden gap-x-6 gap-y-10 lg:grid lg:grid-cols-5">
          {/* Nav columns */}
          {columns.map((column) => (
            <li key={column.title}>
              <h3 className="text-foreground text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="bg-muted text-muted-foreground ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {/* App татах — minimal icon buttons */}
          <li>
            <h3 className="text-foreground text-sm font-semibold">{appDownloadSection.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {appStores.map((store) => (
                <li key={store.id}>
                  <Link
                    href={store.href}
                    aria-label={`${store.prefix} ${store.storeName}`}
                    className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <StoreIcon storeId={store.id} />
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Social — minimal icon buttons */}
          <li>
            <h3 className="text-foreground text-sm font-semibold">Сошиал сувгууд</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} (шинэ tab-д нээгдэнэ)`}
                    className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <SocialIcon socialId={social.id} />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// =====================================================================
// Helper — mainNav-ийг нэгдсэн "багана" жагсаалт болгох
// =====================================================================
type FlatColumn = {
  title: string;
  items: { label: string; href: string; badge?: string }[];
};

function flattenNav(nav: NavCategory[]): FlatColumn[] {
  return nav.flatMap<FlatColumn>((category) => {
    if (category.columns?.length) {
      return category.columns.map((col) => ({
        title: col.title,
        items: col.items,
      }));
    }
    if (category.items?.length) {
      return [{ title: category.label, items: category.items }];
    }
    return [];
  });
}

// =====================================================================
// STORE ICONS — minimal monochrome (currentColor)
// =====================================================================
function StoreIcon({ storeId }: { storeId: AppStoreLink["id"] }) {
  const className = "size-5";

  if (storeId === "app-store") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M17.05 12.04c-.03-3.07 2.51-4.55 2.62-4.62-1.43-2.09-3.66-2.38-4.45-2.41-1.89-.19-3.7 1.12-4.66 1.12-.97 0-2.45-1.1-4.03-1.07-2.07.03-3.99 1.21-5.06 3.07-2.16 3.74-.55 9.27 1.55 12.31 1.03 1.49 2.25 3.16 3.85 3.1 1.55-.06 2.13-1 4-1 1.86 0 2.4 1 4.03.97 1.66-.03 2.72-1.51 3.74-3.01 1.18-1.73 1.67-3.4 1.69-3.49-.04-.02-3.25-1.25-3.28-4.97zM14.21 3.18C15.07 2.14 15.65.71 15.49-.7c-1.21.05-2.69.81-3.58 1.83-.79.91-1.49 2.37-1.31 3.75 1.35.11 2.74-.69 3.61-1.7z" />
      </svg>
    );
  }

  if (storeId === "google-play") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zM14.539 12.748l2.273 2.273-12.02 6.89c-.232.13-.483.13-.703.07l10.45-9.233zM20.16 10.81c.66.378.66 1.34 0 1.717l-3.346 1.918-2.273-2.273-1.067-1.067 2.273-2.273 1.067-1.067 3.346 1.918v.001zM4.087 1.985l12.02 6.89-2.273 2.273L4.087 1.985z" />
      </svg>
    );
  }

  // AppGallery
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14.36 2.5h5.13c1.11 0 2.01.9 2.01 2.01v15.13c0 1.11-.9 2.01-2.01 2.01h-5.13c2.65-1.6 4.43-4.51 4.43-7.84V10.34c0-3.33-1.78-6.24-4.43-7.84zM4.5 2.5h5.14c-2.65 1.6-4.43 4.51-4.43 7.84v3.47c0 3.33 1.78 6.24 4.43 7.84H4.5c-1.11 0-2.01-.9-2.01-2.01V4.51c0-1.11.9-2.01 2.01-2.01zm7.5 4.6c-2.71 0-4.91 2.2-4.91 4.91s2.2 4.91 4.91 4.91 4.91-2.2 4.91-4.91-2.2-4.91-4.91-4.91zm0 2.05a2.86 2.86 0 110 5.72 2.86 2.86 0 010-5.72z" />
    </svg>
  );
}

// =====================================================================
// SOCIAL ICONS — minimal (currentColor)
// =====================================================================
function SocialIcon({ socialId }: { socialId: SocialLink["id"] }) {
  const className = "size-5";

  if (socialId === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  if (socialId === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }

  // YouTube
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
