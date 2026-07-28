"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { type NavPromo } from "@/data/navigation";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

/**
 * Mega menu-ийн "цаг үеийн урамшуулал" мөр — БҮХ header хувилбарт (1/2/3/4)
 * ижил харагдана. Байрлал: зүүн дугуй (56px) · баруун гарчиг + богино тайлбар + CTA.
 *   · promo.image байвал → дугуй дотор зураг
 *   · байхгүй бол        → өнгөт badge текст (legacy promo-нууд)
 *
 * asMenuLink — NavigationMenu (Хувилбар 2/4) дотор ашиглах үед true: линк дарахад
 * mega menu автоматаар хаагдана. Хувилбар 1/3-ын custom панелд false (энгийн Link),
 * тэнд onNavigate-аар панелийг хаана.
 */
export function PromoCard({
  promo,
  asMenuLink = false,
  onNavigate,
}: {
  promo: NavPromo;
  asMenuLink?: boolean;
  onNavigate?: () => void;
}) {
  const card = (
    <Link
      href={promo.href}
      onClick={onNavigate}
      className="hover:bg-muted/50 group flex items-start gap-3 rounded-lg p-2 transition-colors"
    >
      {/* Зүүн дугуй — зураг байвал зураг, эсвэл өнгөт badge (хуучин promo-нууд) */}
      {promo.image ? (
        <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-full">
          <Image
            src={promo.image}
            alt={promo.imageAlt ?? ""}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            navType.badge,
            "flex size-14 shrink-0 items-center justify-center rounded-full px-1 text-center leading-tight",
            promo.badgeClass ?? "bg-muted text-foreground",
          )}
        >
          {promo.badgeText ?? "PROMO"}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className={cn(navType.secondaryLink, "leading-snug")}>{promo.title}</p>
        {promo.description && (
          <p className={cn(navType.body, "text-muted-foreground mt-0.5 leading-snug")}>
            {promo.description}
          </p>
        )}
        <span
          className={cn(
            navType.secondaryLink,
            "text-primary mt-1 inline-flex items-center gap-1 group-hover:underline",
          )}
        >
          {promo.ctaLabel}
          <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  );

  return asMenuLink ? <NavigationMenuLink asChild>{card}</NavigationMenuLink> : card;
}
