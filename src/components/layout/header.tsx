"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AudienceSwitchTabs } from "@/components/layout/audience-switch";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import { MobileBrandHeader, type MobileVariant } from "@/components/layout/mobile-header";
import {
  AccountMenu,
  BrandMegaPanel,
  DOMAIN_NAV_NAME,
  LOOKTV_MORPH_TEXTS,
  LanguagePill,
  ThemePill,
  classifierSegments,
  useBrandMegaMenu,
  useCurrentNavName,
} from "@/components/layout/header-shared";
import { appleMegaMenus, appleNavCategories, type EcosystemLink } from "@/data/navigation";
import { useHeaderVariant } from "@/lib/header-variant";
import { navType } from "@/lib/nav-type";
import { useHideOnScrollDown } from "@/lib/scroll-direction";
import { cn } from "@/lib/utils";
import { sectionBg } from "@/lib/section-bg";
import { SparklesText } from "@/components/ui/sparkles-text";

const NAV_ITEMS: EcosystemLink[] = appleNavCategories;

const CLASSIFIER_TRIGGER = cn(navType.body, "gap-1 px-2");

const MEGA_PANEL_ID = "brand-mega-panel";

const NAV_ORDER = NAV_ITEMS.map((item) => item.name);

const HEADER_TOOL_GROUP = "flex items-center gap-2";

const HEADER_TOOL_BASE =
  "text-foreground focus-visible:ring-ring bg-muted/60 inline-flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none";

const HEADER_TOOL_TEXT = cn(HEADER_TOOL_BASE, "h-9 gap-1.5 px-3");

const HEADER_TOOL_ICON = cn(HEADER_TOOL_BASE, "hover:bg-muted size-9");

function HeaderTools() {
  return (
    <div className={HEADER_TOOL_GROUP}>
      <LanguagePill className={HEADER_TOOL_TEXT} />
      <AccountMenu className={HEADER_TOOL_ICON} />
      <ThemePill className={HEADER_TOOL_ICON} />
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const variant = useHeaderVariant();

  if (pathname?.startsWith("/web4") || pathname?.startsWith("/admin")) return null;

  return (
    <>
      <LogoLeftHeader mobileVariant={variant} />
    </>
  );
}

function CategoryNav({
  openMenu,
  onOpen,
  onClose,
}: {
  openMenu: string | null;
  onOpen: (name: string) => void;
  onClose: () => void;
}) {
  const currentName = useCurrentNavName(NAV_ITEMS);

  const highlightedName = openMenu ?? currentName ?? DOMAIN_NAV_NAME;

  const handleNavBlur = (e: React.FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (!next) return;
    if (e.currentTarget.contains(next)) return;
    if (document.getElementById(MEGA_PANEL_ID)?.contains(next)) return;
    onClose();
  };

  return (
    <nav
      aria-label="Үндсэн цэс"
      onBlur={handleNavBlur}
      onKeyDown={(e) => {
        if (e.key === "Escape" && openMenu) onClose();
      }}
      className="flex items-center gap-5"
    >
      {NAV_ITEMS.map((item) => {
        const highlighted = !item.external && item.name === highlightedName;
        const isCurrentPage = !item.external && item.name === currentName;
        const label =
          item.name === "LookTV" ? (
            <SparklesText
              sparklesCount={8}
              colors={{
                first: "var(--primary)",
                second: "color-mix(in oklab, var(--primary) 45%, white)",
              }}
            >
              {LOOKTV_MORPH_TEXTS[0]}
            </SparklesText>
          ) : (
            item.name
          );
        const linkClass = cn(
          navType.bar,
          "relative whitespace-nowrap transition-colors",
          "after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
          highlighted
            ?
              "text-foreground after:scale-x-100"
            : "text-foreground/75 hover:text-foreground",
        );

        const menu = !item.external ? appleMegaMenus[item.name] : undefined;
        if (menu) {
          const isOpen = openMenu === item.name;
          return (
            <div
              key={item.name}
              className="flex items-center"
              onMouseEnter={() => onOpen(item.name)}
              onMouseLeave={onClose}
            >
              <button
                type="button"
                data-mega-trigger={item.name}
                aria-expanded={isOpen}
                aria-controls={MEGA_PANEL_ID}
                onClick={() => (isOpen ? onClose() : onOpen(item.name))}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown") return;
                  e.preventDefault();
                  onOpen(item.name);
                  requestAnimationFrame(() => {
                    document
                      .getElementById(MEGA_PANEL_ID)
                      ?.querySelector<HTMLElement>("a[href], button")
                      ?.focus();
                  });
                }}
                className={cn(linkClass, "cursor-pointer")}
              >
                {label}
              </button>
            </div>
          );
        }

        return item.external ? (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {label}
          </a>
        ) : (
          <Link
            key={item.name}
            href={item.href}
            aria-current={isCurrentPage ? "page" : undefined}
            className={linkClass}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function MegaLayer({
  panelBrand,
  shown,
  direction,
  onOpen,
  onClose,
  onCloseNow,
}: {
  panelBrand: string | null;
  shown: boolean;
  direction: "from-start" | "from-end" | null;
  onOpen: (name: string) => void;
  onClose: () => void;
  onCloseNow: () => void;
}) {
  if (!panelBrand || !appleMegaMenus[panelBrand]) return null;

  return (
    <div
      data-mega-panel={panelBrand}
      id={MEGA_PANEL_ID}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        onCloseNow();
        document
          .querySelector<HTMLElement>(`[data-mega-trigger="${CSS.escape(panelBrand)}"]`)
          ?.focus();
      }}
      onMouseEnter={() => onOpen(panelBrand)}
      onMouseLeave={onClose}
      className={cn(
        "absolute inset-x-0 top-full z-50 hidden px-4 lg:block",
        "transition-[height,opacity,transform] duration-500 ease-out [interpolate-size:allow-keywords]",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >

      <div
        key={panelBrand}
        className={cn(
          "border-border bg-popover text-popover-foreground mx-auto mt-2 max-w-292 overflow-hidden rounded-[32px] border shadow-xl",
          "animate-in fade-in duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          direction === "from-end" && "slide-in-from-right-8",
          direction === "from-start" && "slide-in-from-left-8",
        )}
      >
        <BrandMegaPanel menu={appleMegaMenus[panelBrand]} onNavigate={onCloseNow} />
      </div>
    </div>
  );
}

function LogoLeftHeader({ mobileVariant = 1 }: { mobileVariant?: MobileVariant }) {
  const { openMenu, panelBrand, shown, direction, openBrandMenu, closeBrandMenu, closeNow } =
    useBrandMegaMenu(NAV_ORDER);
  const bandHidden = useHideOnScrollDown();

  return (
    <>
      {panelBrand && appleMegaMenus[panelBrand] && (
        <div
          aria-hidden
          onClick={closeNow}
          className={cn(
            "bg-foreground/10 fixed inset-0 z-40 hidden backdrop-blur-sm transition-opacity duration-500 ease-out lg:block",
            shown ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      )}

      <header
        className={cn(
          "top-0 z-50 bg-transparent",
          mobileVariant === 1 ? "sticky" : "relative",
          "lg:sticky lg:h-38 lg:bg-transparent lg:transition-transform lg:duration-300 lg:ease-out",
          "lg:pointer-events-none lg:[&>*]:pointer-events-auto",
          bandHidden ? "lg:-translate-y-8" : "lg:translate-y-0",
        )}
        role="banner"
      >
        <div className={cn(sectionBg.band, "hidden lg:block")}>
          <div className="mx-auto flex h-8 max-w-300 items-center justify-end px-4">
            <AudienceSwitchTabs
              segments={classifierSegments}
              activeId="personal"
              align="end"
              hover={false}
              triggerClassName={CLASSIFIER_TRIGGER}
            />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="mx-auto max-w-300 px-4 py-3">
            <div
              className={cn(
                "glass-lens glass-tint grid grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-[100px] px-6",
                "transition-[height] duration-300 ease-out",
                bandHidden ? "h-18" : "h-24",
              )}
            >
              <LogoHomeLink
                className="inline-flex items-center justify-self-start"
                aria-label="Нүүр"
              >
                <BrandLogo height={28} preload />
              </LogoHomeLink>

              <CategoryNav openMenu={openMenu} onOpen={openBrandMenu} onClose={closeBrandMenu} />

              <div className="justify-self-end">
                <HeaderTools />
              </div>
            </div>
          </div>
        </div>

        <MobileBrandHeader variant={mobileVariant} />

        <MegaLayer
          panelBrand={panelBrand}
          shown={shown}
          direction={direction}
          onOpen={openBrandMenu}
          onClose={closeBrandMenu}
          onCloseNow={closeNow}
        />
      </header>
    </>
  );
}
