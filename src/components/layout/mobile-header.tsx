"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Gift,
  Menu,
  MonitorPlay,
  Star,
  Store,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SmartLink } from "@/components/layout/smart-link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoHomeLink } from "@/components/layout/logo-home-link";
import {
  menuPromos,
  MENU_PROMOS_HEADING,
  BranchStatusNote,
  LOOKTV_MORPH_TEXTS,
  LanguagePill,
  ProfilePill,
  ThemePill,
  classifierSegments,
  useActiveNavName,
} from "@/components/layout/header-shared";
import {
  appleNavCategories,
  mobileMegaMenus,
  type EcosystemLink,
  type MegaMenu,
} from "@/data/navigation";
import { BRAND } from "@/lib/brand";
import { navType } from "@/lib/nav-type";
import { sectionBg } from "@/lib/section-bg";
import { cn } from "@/lib/utils";
import { SparklesText } from "@/components/ui/sparkles-text";

export type MobileVariant = 1 | 2;

const PILL_ICON_BUTTON =
  "bg-muted hover:bg-muted/70 text-foreground focus-visible:ring-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

const TAB_NAMES = ["Unitel", "Univision", "Дэлгүүр", "Урамшуулал", "LookTV"] as const;
type TabName = (typeof TAB_NAMES)[number];

const isTab = (name: string): name is TabName => TAB_NAMES.includes(name as TabName);

const TABS = appleNavCategories.filter((c): c is EcosystemLink & { name: TabName } =>
  isTab(c.name),
);

const DIRECT_SEGMENTS = classifierSegments.filter((s) => !s.brands?.length);

function UnitelMark({ className }: { className?: string }) {
  return <Image src="/Unitel/Unitel100.svg" alt="" width={24} height={24} className={className} />;
}

function UnivisionMark({ className }: { className?: string }) {
  return <Image src="/Univision/UV100.svg" alt="" width={24} height={24} className={className} />;
}

const TAB_ICONS: Record<TabName, React.ComponentType<{ className?: string }>> = {
  Unitel: UnitelMark,
  Univision: UnivisionMark,
  Дэлгүүр: Store,
  Урамшуулал: Star,
  LookTV: MonitorPlay,
};

const BOTTOM_TAB =
  "flex h-full w-full flex-col items-center justify-center gap-2 px-0.5 transition-colors";

function useKeyboardOpen(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const vv = window.visualViewport;
    const el = ref.current;
    if (!vv || !el) return;

    let raf = 0;
    const apply = () => {
      const hidden = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      el.dataset.keyboard = hidden > 150 ? "open" : "closed";
    };
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    apply();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [ref]);
}

const DOCK_CHROME_COLOR = { light: "#343535", dark: "#030407" };

function useDockBrowserChrome() {
  useEffect(() => {
    const metas = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'),
    );
    if (metas.length === 0) return;

    const original = metas.map((m) => m.content);
    const mq = window.matchMedia("(max-width: 1023px)");

    const apply = () => {
      metas.forEach((m, i) => {
        if (!mq.matches) {
          m.content = original[i];
          return;
        }
        m.content = m.media.includes("dark") ? DOCK_CHROME_COLOR.dark : DOCK_CHROME_COLOR.light;
      });
    };

    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      metas.forEach((m, i) => (m.content = original[i]));
    };
  }, []);
}

function BottomTabBar() {
  const ref = useRef<HTMLElement>(null);
  useKeyboardOpen(ref);
  useDockBrowserChrome();
  const pathname = usePathname() ?? "";

  const isInternal = (t: (typeof TABS)[number]) =>
    !t.owner || t.owner === "self" || t.owner === BRAND;
  const currentName = TABS.find(
    (t) => isInternal(t) && (pathname === t.href || pathname.startsWith(`${t.href}/`)),
  )?.name;
  const highlightedName = useActiveNavName(appleNavCategories);

  return (
    <nav
      ref={ref}
      data-bottom-tab-bar
      aria-label="Доод цэс"
      className="glass-lens glass-tint fixed inset-x-0 bottom-0 z-50 rounded-t-[32px] transition-[opacity,translate] duration-300 ease-out data-[keyboard=open]:translate-y-full data-[keyboard=open]:opacity-0 lg:hidden"
    >

      <ul className="flex h-[var(--dock-h)] w-full items-center justify-between px-4 py-3">
        {TABS.map((tab) => (
          <li key={tab.name} className="min-w-0 flex-1">
            <BottomTab
              tab={tab}
              highlighted={tab.name === highlightedName}
              isCurrentPage={tab.name === currentName}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function BottomTab({
  tab,
  highlighted,
  isCurrentPage,
}: {
  tab: EcosystemLink & { name: TabName };
  highlighted: boolean;
  isCurrentPage: boolean;
}) {
  const Icon = TAB_ICONS[tab.name];

  return (
    <SmartLink
      href={tab.href}
      owner={tab.owner}
      aria-current={isCurrentPage ? "page" : undefined}
      className={cn(
        BOTTOM_TAB,
        highlighted ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >

      <span className="flex size-6 shrink-0 items-center justify-center">
        <Icon className="size-6 shrink-0" />
      </span>

      <span
        className={cn(
          highlighted ? navType.bottomTabActive : navType.bottomTab,
          "leading-none whitespace-nowrap",
        )}
      >
        <TabLabel name={tab.name} isDomain={highlighted} />
      </span>
    </SmartLink>
  );
}

export function MobileBrandHeader({ variant }: { variant: MobileVariant }) {
  if (variant === 1) return <BurgerDrawerHeader />;

  return (
    <>
      <BurgerDrawerHeader row="flat" subRow={<BrandSubmenuRow />} />
      <BottomTabBar />
    </>
  );
}

function CapsuleRow({ burger }: { burger: React.ReactNode }) {
  return (
    <div className="h-22 px-4 pt-6 pb-0">
      <div className="glass-lens glass-tint flex h-16 items-center rounded-full px-5">
        <LogoHomeLink className="inline-flex items-center" aria-label="Нүүр">
          <BrandLogo height={24} preload />
        </LogoHomeLink>

        <div className="ml-auto flex items-center">{burger}</div>
      </div>
    </div>
  );
}

function HeaderRow({ burger }: { burger: React.ReactNode }) {
  return (
    <div className="flex items-center px-6 pt-6 pb-3">
      <LogoHomeLink className="inline-flex items-center" aria-label="Нүүр">
        <BrandLogo height={24} preload />
      </LogoHomeLink>

      <div className="ml-auto flex items-center gap-1">
        <ProfilePill className={PILL_ICON_BUTTON} />
        {burger}
      </div>
    </div>
  );
}

function BrandSubmenuRow() {
  const activeName = useActiveNavName(appleNavCategories);
  const menu = mobileMegaMenus[activeName];
  if (!menu) return null;

  const items = menu.sections.flatMap((branch) => {
    const leaves = (branch.groups ?? []).flatMap((group) => group.items);
    return leaves.length > 0 ? leaves : [{ id: branch.id, title: branch.title, href: branch.href }];
  });
  if (items.length === 0) return null;

  return (
    <nav aria-label={`${activeName} дэд цэс`} className={sectionBg.band}>
      <div className="no-scrollbar overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]">
        <ul className="flex w-max items-center gap-5 px-6 py-3">
          {items.map((item) => (
            <li key={item.id}>
              <SmartLink
                href={item.href}
                className={cn(
                  navType.mobileLink,
                  "text-foreground hover:text-primary whitespace-nowrap transition-colors",
                )}
              >
                {item.title}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function BurgerButton({
  open = false,
  ...rest
}: { open?: boolean } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={open ? "Цэс хаах" : "Цэс нээх"}
      className={PILL_ICON_BUTTON}
      {...rest}
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );
}

const DRAWER_ID = "mobile-burger-drawer";

const hasSubmenu = (name: string) => Boolean(mobileMegaMenus[name]);

const DRAWER_PRIMARY_ROW = cn(
  navType.drawerPrimary,
  "hover:bg-muted flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left transition-colors",
);

const DRAWER_LEAF_ROW = cn(
  navType.drawerPrimary,
  "hover:bg-muted flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left no-underline transition-colors",
);

function BurgerDrawerHeader({
  row = "capsule",
  subRow,
}: {
  row?: "capsule" | "flat";
  subRow?: React.ReactNode;
}) {
  const Layer1 = row === "flat" ? HeaderRow : CapsuleRow;
  const [open, setOpen] = useState(false);
  const [subName, setSubName] = useState<string | null>(null);
  const [subMenu, setSubMenu] = useState<MegaMenu | null>(null);

  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rootPaneRef = useRef<HTMLDivElement>(null);
  const subPaneRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<string | null>(null);

  const [paneH, setPaneH] = useState<number>();
  const pathname = usePathname();
  const activeName = useActiveNavName(appleNavCategories);

  const close = () => {
    setOpen(false);
    burgerRef.current?.focus({ preventScroll: true });
  };

  const dismiss = () => setOpen(false);

  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    if (subName) {
      panel.querySelector<HTMLElement>("[data-drawer-back]")?.focus({ preventScroll: true });
      return;
    }
    const want = returnTo.current;
    const rows = [...panel.querySelectorAll<HTMLElement>("[data-drawer-cat]")];
    const target = want ? rows.find((r) => r.dataset.drawerCat === want) : rows[0];
    (target ?? rows[0])?.focus({ preventScroll: true });
    returnTo.current = null;
  }, [open, subName]);

  useEffect(() => {
    if (!open) return;
    const el = subName ? subPaneRef.current : rootPaneRef.current;
    if (!el) return;
    const apply = () => setPaneH(el.offsetHeight);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, subName]);

  const openSub = (name: string) => {
    const menu = mobileMegaMenus[name];
    if (!menu) return;
    returnTo.current = name;
    setSubMenu(menu);
    setSubName(name);
  };

  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "bg-foreground/10 fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div className="relative z-50 lg:hidden">
        <Layer1
          burger={
            <BurgerButton
              ref={burgerRef}
              open={open}
              aria-expanded={open}
              aria-controls={DRAWER_ID}
              onClick={() => {
                if (open) {
                  close();
                  return;
                }
                returnTo.current = null;
                setSubName(null);
                setOpen(true);
              }}
            />
          }
        />

        {subRow}

        <div
          className={cn(
            "absolute inset-x-0 top-full z-50 px-4 pb-4 transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none",
            open ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <div
            ref={panelRef}
            id={DRAWER_ID}
            inert={!open}
            className="bg-card border-border max-h-[calc(100lvh-6.5rem)] overflow-y-auto rounded-[28px] border shadow-2xl"
          >
            <div
              style={{ height: paneH }}
              className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
            >
              <div
                className={cn(
                  "flex w-[200%] items-start transition-transform duration-300 ease-out motion-reduce:transition-none",
                  subName && "-translate-x-1/2",
                )}
              >
                <div ref={rootPaneRef} inert={!!subName} className="w-1/2 p-4">
                  <nav aria-label="Ангилал">
                    <ul className="flex flex-col">
                      {appleNavCategories.map((cat) => (
                        <li key={cat.name}>
                          {hasSubmenu(cat.name) ? (
                            <button
                              type="button"
                              data-drawer-cat={cat.name}
                              onClick={() => openSub(cat.name)}
                              className={DRAWER_PRIMARY_ROW}
                            >
                              <DrawerCatLabel name={cat.name} active={cat.name === activeName} />
                              <ArrowRight
                                className="ml-auto size-4 shrink-0 opacity-60"
                                aria-hidden="true"
                              />
                              <span className="sr-only">— дэд цэс нээх</span>
                            </button>
                          ) : (
                            <SmartLink
                              href={cat.href}
                              owner={cat.owner}
                              data-drawer-cat={cat.name}
                              onClick={dismiss}
                              className={DRAWER_PRIMARY_ROW}
                            >
                              <DrawerCatLabel name={cat.name} active={cat.name === activeName} />
                            </SmartLink>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {DIRECT_SEGMENTS.length > 0 && (
                    <div className="border-border mt-4 space-y-0.5 border-t pt-4">
                      {DIRECT_SEGMENTS.map((seg) => (
                        <a
                          key={seg.id}
                          href={seg.href}
                          target={seg.external ? "_blank" : undefined}
                          rel={seg.external ? "noopener noreferrer" : undefined}
                          onClick={dismiss}
                          className={cn(navType.mobileLink, ROW)}
                        >
                          {seg.label}
                          <ArrowUpRight
                            className="ml-auto size-4 shrink-0 opacity-60"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-stretch gap-2">
                    <LanguagePill className={cn(DRAWER_TOOL_PILL, navType.mobileLink)} />
                    <ProfilePill className={DRAWER_TOOL_PILL_ACTIVE} onDone={dismiss} />
                    <ThemePill className={DRAWER_TOOL_PILL_ACTIVE} />
                  </div>
                </div>

                <div ref={subPaneRef} inert={!subName} className="w-1/2 p-4">
                  {subMenu && (
                    <DrawerSubmenu
                      menu={subMenu}
                      onBack={() => setSubName(null)}
                      onNavigate={dismiss}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DrawerCatLabel({ name, active }: { name: string; active: boolean }) {
  return (
    <span className={cn(active && "underline underline-offset-4")}>
      <TabLabel name={name} isDomain={active} />
    </span>
  );
}

function DrawerSubmenu({
  menu,
  onBack,
  onNavigate,
}: {
  menu: MegaMenu;
  onBack: () => void;
  onNavigate: () => void;
}) {
  const headingId = `${DRAWER_ID}-${menu.name}-heading`;

  const defaultOpen = menu.sections.find((s) => s.groups?.length)?.id;

  return (
    <section aria-labelledby={headingId}>
      <button
        type="button"
        data-drawer-back
        onClick={onBack}
        className={cn(
          navType.mobileLink,
          "hover:bg-muted text-muted-foreground hover:text-foreground mb-1 -ml-2 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 transition-colors",
        )}
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
        Буцах
      </button>

      <h2 id={headingId} className={cn(navType.drawerHeading, "text-foreground mb-1 px-2")}>
        {menu.name}
      </h2>

      <Accordion type="multiple" defaultValue={defaultOpen ? [defaultOpen] : []} className="mt-3">
        {menu.sections.map((branch) =>
          branch.groups?.length ? (
            <AccordionItem key={branch.id} value={branch.id} className="border-b-0">
              <AccordionTrigger
                className={cn(
                  DRAWER_PRIMARY_ROW,
                  "py-0 hover:no-underline",
                )}
              >
                {branch.title.trim()}
              </AccordionTrigger>

              <AccordionContent className="pb-0 [&_a]:no-underline">
                {branch.status && <BranchStatusNote status={branch.status} className="mb-1 pl-5" />}

                {branch.groups.map((group) => (
                  <div key={group.id} className="mt-1 pl-3">
                    {group.title && (
                      <p className={cn(navType.groupLabel, "mb-1 px-2")}>{group.title}</p>
                    )}
                    <ul aria-label={group.title} className="flex flex-col">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <DrawerLink
                            href={item.href}
                            onNavigate={onNavigate}
                            className={cn(
                              navType.mobileLink,
                              ROW,
                              "text-muted-foreground no-underline",
                            )}
                          >
                            {item.title.trim()}
                          </DrawerLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ) : (
            <div key={branch.id}>
              <DrawerLink href={branch.href} onNavigate={onNavigate} className={DRAWER_LEAF_ROW}>
                {branch.title.trim()}
              </DrawerLink>
              {branch.status && <BranchStatusNote status={branch.status} className="mt-1 pl-5" />}
            </div>
          ),
        )}
      </Accordion>

      {menu.extras && menu.extras.length > 0 && (
        <DrawerGroup label={menu.extrasLabel ?? "Нэмэлт"}>
          {menu.extras.map((s) => (
            <li key={s.id}>
              <DrawerLink
                href={s.href}
                onNavigate={onNavigate}
                className={cn(navType.mobileLink, ROW, "text-muted-foreground no-underline")}
              >
                {s.title.trim()}
              </DrawerLink>
            </li>
          ))}
        </DrawerGroup>
      )}

      <div className="border-border mt-4 border-t px-2 pt-4">
        <h3 className={cn(navType.groupLabel, "mb-3")}>{MENU_PROMOS_HEADING}</h3>
        <div className="flex flex-col gap-4">
          {menuPromos(menu.name).map((promo) => (
            <div key={promo.id} className="flex items-start gap-3">
              <MobilePromoAvatar image={promo.image} />
              <div className="flex min-w-0 flex-col items-start">
                <p className={cn(navType.secondaryLink, "text-foreground")}>{promo.title}</p>
                <p className={cn(navType.body, "text-muted-foreground mt-1 line-clamp-3")}>
                  {promo.description}
                </p>
                <Link
                  href={promo.href}
                  onClick={onNavigate}
                  className="text-primary mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold no-underline"
                >
                  <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                  {promo.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DrawerGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className={cn(navType.groupLabel, "mb-1 px-2")}>{label}</p>
      <ul aria-label={label} className="flex flex-col">
        {children}
      </ul>
    </div>
  );
}

const DRAWER_TOOL_PILL =
  "bg-muted text-foreground focus-visible:ring-ring inline-flex min-h-11 flex-1 basis-0 items-center justify-center gap-2 rounded-xl transition-colors focus-visible:ring-2 focus-visible:outline-none";

const DRAWER_TOOL_PILL_ACTIVE = cn(DRAWER_TOOL_PILL, "hover:bg-muted/70");

function DrawerLink({
  href,
  onNavigate,
  className,
  children,
}: {
  href: string;
  onNavigate: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {children}
        <ArrowUpRight className="ml-auto size-3.5 shrink-0 opacity-60" aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link href={href} onClick={onNavigate} className={className}>
      {children}
    </Link>
  );
}

function TabLabel({ name, isDomain }: { name: string; isDomain: boolean }) {
  return (
    <>
      {name === "LookTV" ? (
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
        name
      )}
      {isDomain && <span className="sr-only"> (одоо байгаа домэйн)</span>}
    </>
  );
}

function MobilePromoAvatar({ image }: { image?: string }) {
  if (image) {
    return (
      <span
        aria-hidden="true"
        className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-full"
      >
        <Image src={image} alt="" fill sizes="48px" className="object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-full"
    >
      <Gift className="size-5" />
    </span>
  );
}

const ROW =
  "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left transition-colors";
