import Link from "next/link";

import { footerMeta, footerStripLinks } from "@/data/footer";
import { appStores, socialLinks, type AppStoreLink, type SocialLink } from "@/data/footer-extras";
import { cn } from "@/lib/utils";

/**
 * LegalStrip — Apple маягийн доод strip (3 хувилбарт БҮГДЭД НЬ ижил).
 *
 * Desktop: copyright · компанийн линкүүд · баруун ирмэгт бүс нутаг — нэг мөрөнд,
 *          зүүн ирмэгээс эхэлнэ.
 * Mobile:  бүх агуулга ГОЛЛУУЛСАН — copyright дээрээ, доор нь линкүүд хугарч
 *          хоёр мөр болоод тэдгээр ч мөр бүрдээ голлоно.
 */
export function LegalStrip() {
  const year = new Date().getFullYear();

  return (
    <div className="border-border bg-muted/40 text-muted-foreground border-t text-xs">
      <div className="container mx-auto">
        {/* copyright · компанийн линк · бүс нутаг */}
        <div className="flex flex-col items-center gap-2 py-4 md:flex-row md:items-center md:gap-8">
          <p className="text-center md:text-left">
            Copyright © {year} {footerMeta.copyrightOwner}. {footerMeta.rightsNote}
          </p>

          <nav aria-label="Компанийн холбоос">
            <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-start">
              {footerStripLinks.map((item, i) => (
                <li key={item.id} className="flex items-center gap-x-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="opacity-40">
                      |
                    </span>
                  )}
                  <StripLink href={item.href}>{item.label}</StripLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop — бүс нутаг баруун ирмэгт шахагдана */}
          <p className="hidden md:ml-auto md:block">{footerMeta.region}</p>
        </div>
      </div>
    </div>
  );
}

/** Strip доторх линк — Apple шиг underline-тай, hover дээр тодорно */
function StripLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  const className =
    "hover:text-foreground underline underline-offset-3 transition-colors focus-visible:ring-ring rounded-xs focus-visible:ring-2 focus-visible:outline-none";

  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}

// =====================================================================
// Апп татах — Singtel маягийн pill (icon + "Download on the" + store нэр)
// =====================================================================
export function AppStoreRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-start gap-2", className)}>
      {appStores.map((store) => (
        <li key={store.id}>
          <AppStoreBadge store={store} />
        </li>
      ))}
    </ul>
  );
}

export function AppStoreBadge({ store }: { store: AppStoreLink }) {
  return (
    <Link
      href={store.href}
      aria-label={`${store.prefix} ${store.storeName}`}
      className="bg-muted hover:bg-muted/70 text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <StoreIcon storeId={store.id} className="size-4 shrink-0" />
      <div className="flex flex-col text-left leading-tight whitespace-nowrap">
        <span className="text-[9px] tracking-wide opacity-80">{store.prefix}</span>
        <span className="text-[11px] font-semibold">{store.storeName}</span>
      </div>
    </Link>
  );
}

// =====================================================================
// Сошиал — дугуй icon товчнууд
// =====================================================================
export function SocialRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
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
  );
}

/** Багана гарчиг — 3 хувилбарт ижил хэмжээ/жин */
export function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-foreground text-sm font-semibold">{children}</h3>;
}

// =====================================================================
// STORE / SOCIAL icons — monochrome SVG
// =====================================================================
export function StoreIcon({
  storeId,
  className,
}: {
  storeId: AppStoreLink["id"];
  className?: string;
}) {
  const cls = className ?? "size-5";

  if (storeId === "app-store") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M17.05 12.04c-.03-3.07 2.51-4.55 2.62-4.62-1.43-2.09-3.66-2.38-4.45-2.41-1.89-.19-3.7 1.12-4.66 1.12-.97 0-2.45-1.1-4.03-1.07-2.07.03-3.99 1.21-5.06 3.07-2.16 3.74-.55 9.27 1.55 12.31 1.03 1.49 2.25 3.16 3.85 3.1 1.55-.06 2.13-1 4-1 1.86 0 2.4 1 4.03.97 1.66-.03 2.72-1.51 3.74-3.01 1.18-1.73 1.67-3.4 1.69-3.49-.04-.02-3.25-1.25-3.28-4.97zM14.21 3.18C15.07 2.14 15.65.71 15.49-.7c-1.21.05-2.69.81-3.58 1.83-.79.91-1.49 2.37-1.31 3.75 1.35.11 2.74-.69 3.61-1.7z" />
      </svg>
    );
  }

  if (storeId === "google-play") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zM14.539 12.748l2.273 2.273-12.02 6.89c-.232.13-.483.13-.703.07l10.45-9.233zM20.16 10.81c.66.378.66 1.34 0 1.717l-3.346 1.918-2.273-2.273-1.067-1.067 2.273-2.273 1.067-1.067 3.346 1.918v.001zM4.087 1.985l12.02 6.89-2.273 2.273L4.087 1.985z" />
      </svg>
    );
  }

  // AppGallery
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true">
      <path d="M14.36 2.5h5.13c1.11 0 2.01.9 2.01 2.01v15.13c0 1.11-.9 2.01-2.01 2.01h-5.13c2.65-1.6 4.43-4.51 4.43-7.84V10.34c0-3.33-1.78-6.24-4.43-7.84zM4.5 2.5h5.14c-2.65 1.6-4.43 4.51-4.43 7.84v3.47c0 3.33 1.78 6.24 4.43 7.84H4.5c-1.11 0-2.01-.9-2.01-2.01V4.51c0-1.11.9-2.01 2.01-2.01zm7.5 4.6c-2.71 0-4.91 2.2-4.91 4.91s2.2 4.91 4.91 4.91 4.91-2.2 4.91-4.91-2.2-4.91-4.91-4.91zm0 2.05a2.86 2.86 0 110 5.72 2.86 2.86 0 010-5.72z" />
    </svg>
  );
}

export function SocialIcon({ socialId }: { socialId: SocialLink["id"] }) {
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
