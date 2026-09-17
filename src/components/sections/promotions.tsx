import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { promotionCards, promotionsSection, type PromotionCard } from "@/data/promotions";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";

export function Promotions() {
  const cards = promotionCards[BRAND];

  return (
    <section aria-labelledby="promotions-title" className={cn(sectionBg.band, "w-full")}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="promotions-title" className={sectionType.title}>
            {promotionsSection.title}
          </h2>

          <p className={sectionType.subtitle}>{promotionsSection.description}</p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.id}>
              <PromotionTile card={card} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link
            href={promotionsSection.ctaHref}
            className="border-border text-foreground hover:bg-muted/60 focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {promotionsSection.ctaText}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PromotionTile({ card }: { card: PromotionCard }) {
  const hasImage = Boolean(card.image);

  return (
    <Link
      href={card.ctaHref}
      aria-label={`${card.title} — ${card.ctaText}`}
      className={cn(
        "group focus-visible:ring-ring focus-visible:ring-offset-background relative isolate flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl p-7 ring-1 transition-all duration-500 ease-out hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        hasImage
          ? "shadow-xl ring-black/10 hover:shadow-2xl"
          : "bg-card ring-border hover:shadow-lg",
      )}
    >
      {card.image && (
        <>
          <Image
            src={card.image}
            alt={card.imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="-z-10 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
          />
        </>
      )}

      {(card.badge || card.price) && (
        <div className="relative flex items-start justify-between gap-3">
          {card.badge && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                hasImage
                  ? "bg-black/60 text-white backdrop-blur-sm"
                  : "bg-muted text-foreground/70",
              )}
            >
              {card.badge}
            </span>
          )}

          {card.price && (
            <div
              className={cn(
                "ml-auto shrink-0 rounded-2xl px-3 py-2 text-right",
                hasImage ? "bg-black/60 backdrop-blur-sm" : "bg-muted",
              )}
            >
              <div
                className={cn(
                  "text-lg leading-none font-extrabold",
                  hasImage ? "text-white" : "text-foreground",
                )}
              >
                {card.price}
              </div>
              {card.priceNote && (
                <div
                  className={cn(
                    "mt-1 text-[11px] font-medium",
                    hasImage ? "text-white/70" : "text-foreground/70",
                  )}
                >
                  {card.priceNote}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="relative mt-6 flex flex-1 flex-col justify-end">
        <h3
          className={cn(
            "text-[1.2rem] font-bold tracking-tight",
            hasImage ? "text-white" : "text-foreground",
          )}
        >
          {card.title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-sm text-[0.7rem] leading-relaxed",
            hasImage ? "text-white/85" : "text-foreground/70",
          )}
        >
          {card.description}
        </p>
      </div>

      <div
        className={cn(
          "relative mt-6 flex items-center justify-between gap-3 border-t pt-4",
          hasImage ? "border-white/20" : "border-border",
        )}
      >
        <span
          className={cn("text-xs font-medium", hasImage ? "text-white/70" : "text-foreground/70")}
        >
          {card.validity}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold",
            hasImage ? "text-white" : "text-foreground",
          )}
        >
          {card.ctaText}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
