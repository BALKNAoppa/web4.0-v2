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
import { mainNav, type NavCategory, type NavItem, type NavPromo } from "@/data/navigation";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Gift, Tag, Percent } from "lucide-react";
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

type NavigationProps = {
  variant: "desktop" | "mobile";
  /** Аль ангиллыг харуулах — V1 нь mainNavLegacy, V2/V3 нь mainNav (default) */
  categories?: NavCategory[];
  /** Mobile дээр item дарахад Sheet-ыг хаахын тулд */
  onItemClick?: () => void;
};

export function Navigation({ variant, categories = mainNav, onItemClick }: NavigationProps) {
  if (variant === "desktop") {
    return <DesktopNav categories={categories} />;
  }
  return <MobileNav categories={categories} onItemClick={onItemClick} />;
}

// =====================================================================
// DESKTOP — Horizontal mega-menu (hover тренд)
// =====================================================================
function DesktopNav({ categories }: { categories: NavCategory[] }) {
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
                    className="hover:bg-muted focus-visible:ring-ring/50 inline-flex h-9 items-center gap-1.5 rounded-md px-4 py-2 text-base font-medium transition-all outline-none focus-visible:ring-3 focus-visible:outline-1"
                  >
                    {Icon && <Icon className="size-4" aria-hidden="true" />}
                    <span>{category.label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          // Default — dropdown mega-menu
          return (
            <NavigationMenuItem key={category.label}>
              <NavigationMenuTrigger className="text-base font-medium">
                {category.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:w-full">
                <div className="mx-auto w-full max-w-[1200px] px-4 py-8">
                  {category.columns ? (
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
/** Multi-column layout — Бүтээгдэхүүн, Энтертайнмент-д ашиглана */
function MegaMenuColumns({ category }: { category: NavCategory }) {
  const columns = category.columns ?? [];
  const promos = category.promos ?? [];
  const hasPromos = promos.length > 0;

  return (
    <div className="flex items-stretch gap-8">
      {/* Links section — 2/3 of width when promos exist, full when not */}
      <div className={cn("flex items-stretch gap-8", hasPromos ? "flex-1" : "w-full")}>
        {columns.map((column, index) => (
          <React.Fragment key={column.title}>
            <div className="min-w-0 flex-1">
              <h3 className="text-muted-foreground mb-3 text-xs font-extrabold tracking-wider uppercase">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <NavLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
            {index < columns.length - 1 && (
              <Separator orientation="vertical" className="bg-border w-px" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Promo section — right side */}
      {hasPromos && (
        <>
          <Separator orientation="vertical" className="bg-border w-px" />
          <div className="w-72 shrink-0 space-y-4">
            {promos.map((promo) => (
              <PromoCard key={promo.title} promo={promo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Promo card — right side of mega menu */
function PromoCard({ promo }: { promo: NavPromo }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={promo.href}
        className="hover:bg-muted/50 group flex items-start gap-3 rounded-lg p-2 transition-colors"
      >
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-full px-1 text-center text-[10px] leading-tight font-bold",
            promo.badgeClass ?? "bg-muted text-foreground",
          )}
        >
          {promo.badgeText ?? "PROMO"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug font-semibold">{promo.title}</p>
          {promo.description && (
            <p className="text-muted-foreground mt-0.5 text-xs leading-snug">{promo.description}</p>
          )}
          <span className="text-primary mt-1 inline-flex items-center gap-1 text-xs font-medium group-hover:underline">
            {promo.ctaLabel}
            <ArrowRight className="size-3" />
          </span>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

/** Энгийн list — Life-style, Урамшуулал-д ашиглана */
function SimpleList({ category }: { category: NavCategory }) {
  return (
    <div>
      <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
        {category.label}
      </h3>
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
        className="hover:text-primary focus-visible:ring-ring! -mx-2 flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors focus-visible:ring-2! focus-visible:ring-offset-2! focus-visible:outline-none!"
      >
        <span>{item.label}</span>
        {item.badge && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
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
              className="hover:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-md px-2 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {Icon && <Icon className="size-4" aria-hidden="true" />}
              <span>{category.label}</span>
            </Link>
          );
        }

        return (
          <AccordionItem key={category.label} value={category.label}>
            <AccordionTrigger className="text-base font-medium">{category.label}</AccordionTrigger>
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
          <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
            {column.title}
          </h4>
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
            className="hover:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span>{item.label}</span>
            {item.badge && (
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                {item.badge}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
