"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PromoCard } from "@/components/layout/promo-card";
import { mainNav, businessQuickLinks, type NavCategory, type NavItem } from "@/data/navigation";
import { Gift, Tag, Percent } from "lucide-react";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

/** Data-аас ирэх icon-ы нэрийг lucide компонент руу хөрвүүлнэ */
function getCategoryIcon(name?: NavCategory["icon"]) {
  switch (name) {
    case "gift":
      return Gift;
    case "tag":
      return Tag;
    case "percent":
      return Percent;
    default:
      return null;
  }
}

/** Тооны badge (жишээ 36) — улбар шар дугуйтай */
function CountBadge({ count }: { count: number }) {
  return (
    <span
      className={cn(
        navType.badge,
        "ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-white",
      )}
    >
      {count}
    </span>
  );
}

type NavigationProps = {
  variant: "desktop" | "mobile";
  /** Аль ангиллыг харуулах — V1 нь mainNavLegacy, V2/V3 нь mainNav (default) */
  categories?: NavCategory[];
  /** Mobile дээр item дарахад Sheet-ыг хаахын тулд */
  onItemClick?: () => void;
  /** Desktop mega panel-ийн загвар: "columns" (V2) эсвэл "apple" (V4) */
  panel?: "columns" | "apple";
};

export function Navigation({
  variant,
  categories = mainNav,
  onItemClick,
  panel = "columns",
}: NavigationProps) {
  if (variant === "desktop") {
    return <DesktopNav categories={categories} panel={panel} />;
  }
  return <MobileNav categories={categories} onItemClick={onItemClick} />;
}

// =====================================================================
// DESKTOP — Horizontal mega-menu (hover тренд)
// =====================================================================
function DesktopNav({
  categories,
  panel = "columns",
}: {
  categories: NavCategory[];
  panel?: "columns" | "apple";
}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map((category) => {
          // Direct link mode — dropdown биш, шууд линк
          if (category.isDirectLink && category.href) {
            const Icon = getCategoryIcon(category.icon);
            return (
              <NavigationMenuItem key={category.label}>
                <NavigationMenuLink asChild>
                  <Link
                    href={category.href}
                    className={cn(
                      navType.bar,
                      "hover:bg-muted focus-visible:ring-ring/50 inline-flex h-8 items-center gap-1.5 rounded-md px-3 py-1.5 transition-all outline-none focus-visible:ring-3 focus-visible:outline-1",
                    )}
                  >
                    {Icon && <Icon className="size-4" aria-hidden="true" />}
                    <span>{category.label}</span>
                    {category.count != null && <CountBadge count={category.count} />}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          // Default — dropdown mega-menu
          return (
            <NavigationMenuItem key={category.label}>
              <NavigationMenuTrigger className={cn(navType.bar, "h-8 px-3 py-1.5")}>
                {category.label}
                {category.count != null && <CountBadge count={category.count} />}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:w-full">
                <div className="mx-auto w-full max-w-[1200px] px-4 py-8">
                  {panel === "apple" ? (
                    <AppleMegaPanel category={category} />
                  ) : category.columns ? (
                    <MegaMenuColumns category={category} />
                  ) : (
                    <SimpleList category={category} />
                  )}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
/** Multi-column layout — Apple маягийн цэвэр багана (тусгаарлах зураасгүй) */
function MegaMenuColumns({ category }: { category: NavCategory }) {
  const columns = category.columns ?? [];
  const promos = category.promos ?? [];
  const hasPromos = promos.length > 0;

  return (
    <div className="flex items-start gap-12">
      {/* Links section — багана бүр цэвэр жагсаалт (Apple.com шиг) */}
      <div className={cn("flex items-start gap-12", hasPromos ? "flex-1" : "w-full")}>
        {columns.map((column) => (
          <div key={column.title} className="min-w-0 flex-1">
            <h3 className={cn(navType.groupLabel, "mb-3.5")}>{column.title}</h3>
            <ul className="space-y-2.5">
              {column.items.map((item) => (
                <li key={item.label}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Promo section — байвал баруун талд (одоогоор groupNavV2-д promo байхгүй) */}
      {hasPromos && (
        <div className="w-72 shrink-0 space-y-4">
          {promos.map((promo) => (
            <PromoCard key={promo.title} promo={promo} asMenuLink />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Apple маягийн mega panel (Хувилбар 4) — зүүн: "Хувь хэрэглэгч" тод жагсаалт
 * (screenshot шиг), баруун: "Бизнес эрхлэгч бол" жижиг quick link-үүд.
 */
function AppleMegaPanel({ category }: { category: NavCategory }) {
  const columns =
    category.columns ?? (category.items ? [{ title: category.label, items: category.items }] : []);

  return (
    <div className="flex items-start gap-10">
      {/* Хувь хэрэглэгч — үндсэн (тод) жагсаалт */}
      <div className="flex-1">
        <h3 className={cn(navType.groupLabel, "mb-5")}>Хувь хэрэглэгч</h3>
        <div className="flex items-start gap-10">
          {columns.map((col) => (
            <div key={col.title} className="min-w-0">
              <p className={cn(navType.groupLabel, "mb-2.5")}>{col.title}</p>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          navType.secondaryLink,
                          "text-foreground hover:text-primary transition-colors",
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Бизнес эрхлэгч бол — жижиг quick link-үүд (ард нь) */}
      <div className="border-border w-60 shrink-0 border-l pl-10">
        <h3 className={cn(navType.groupLabel, "mb-4")}>Бизнес эрхлэгч бол</h3>
        <ul className="space-y-2.5">
          {businessQuickLinks.map((item) => (
            <li key={item.label}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    navType.secondaryLink,
                    "text-muted-foreground hover:text-foreground transition-colors",
                  )}
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Энгийн list — Life-style, Урамшуулал-д ашиглана */
function SimpleList({ category }: { category: NavCategory }) {
  return (
    <div>
      <h3 className={cn(navType.groupLabel, "mb-3")}>{category.label}</h3>
      <ul className="space-y-2">
        {category.items?.map((item) => (
          <li key={item.label}>
            <NavLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Нэг item — badge ("Coming soon") дэмждэг */
function NavLink({ item }: { item: NavItem }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className={cn(
          navType.secondaryLink,
          "hover:text-primary focus-visible:ring-ring! -mx-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors focus-visible:ring-2! focus-visible:ring-offset-2! focus-visible:outline-none!",
        )}
      >
        <span>{item.label}</span>
        {item.badge && (
          <span
            className={cn(navType.badge, "bg-muted text-muted-foreground rounded-full px-2 py-0.5")}
          >
            {item.badge}
          </span>
        )}
      </Link>
    </NavigationMenuLink>
  );
}

// =====================================================================
// MOBILE — Vertical accordion (Sheet дотор)
// =====================================================================
function MobileNav({
  categories,
  onItemClick,
}: {
  categories: NavCategory[];
  onItemClick?: () => void;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category) => {
        // Direct link mode — accordion биш, шууд линк
        if (category.isDirectLink && category.href) {
          const Icon = getCategoryIcon(category.icon);
          return (
            <Link
              key={category.label}
              href={category.href}
              onClick={onItemClick}
              className={cn(
                navType.mobileLink,
                "hover:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-md px-2 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none",
              )}
            >
              {Icon && <Icon className="size-4" aria-hidden="true" />}
              <span>{category.label}</span>
              {category.count != null && <CountBadge count={category.count} />}
            </Link>
          );
        }

        return (
          <AccordionItem key={category.label} value={category.label}>
            <AccordionTrigger className={navType.mobileLink}>
              <span className="flex items-center">
                {category.label}
                {category.count != null && <CountBadge count={category.count} />}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {category.columns ? (
                <MobileColumns category={category} onItemClick={onItemClick} />
              ) : (
                <MobileList items={category.items ?? []} onItemClick={onItemClick} />
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

/** Mobile дээр column-уудыг доош нь нийлүүлж харуулна */
function MobileColumns({
  category,
  onItemClick,
}: {
  category: NavCategory;
  onItemClick?: () => void;
}) {
  return (
    <div className="space-y-4 pl-2">
      {category.columns?.map((column) => (
        <div key={column.title}>
          <h4 className={cn(navType.groupLabel, "mb-2")}>{column.title}</h4>
          <MobileList items={column.items} onItemClick={onItemClick} />
        </div>
      ))}
    </div>
  );
}

/** Mobile item list */
function MobileList({ items, onItemClick }: { items: NavItem[]; onItemClick?: () => void }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            onClick={onItemClick}
            className={cn(
              navType.mobileLink,
              "hover:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-md px-2 py-2 transition-colors focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  navType.badge,
                  "bg-muted text-muted-foreground rounded-full px-2 py-0.5",
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
