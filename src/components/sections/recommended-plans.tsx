"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageIcon, Phone, Play, Sparkles, Star, Tv, Wifi, type LucideIcon } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselDots } from "@/components/ui/carousel-dots";
import {
  RECOMMENDED_BADGE,
  type PlanCardContent,
  type PlanTab,
  type PlanTabId,
  type RecommendedPlansContent,
} from "@/data/recommended-plans";
import { mobilePlans, type MobilePlan } from "@/data/mobile-plans";
import { type PlanGroup } from "@/data/plans";
import { ACCENT } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";

const PLAN_GROUP_ICONS: Record<PlanGroup["icon"], LucideIcon> = {
  wifi: Wifi,
  tv: Tv,
  play: Play,
  phone: Phone,
};

export function RecommendedPlans({ content }: { content: RecommendedPlansContent }) {
  const [tab, setTab] = useState<PlanTabId>("recommended");
  const cards = content.cards[tab] ?? [];
  const showTabs = (content.tabs?.length ?? 0) > 1;

  return (
    <section
      aria-labelledby="plans-title"
      className={cn(sectionBg.band, "w-full pt-6 pb-14 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24")}
    >
      <div className="mx-auto max-w-300 px-4">
        <h2 id="plans-title" className={cn("text-center", sectionType.title)}>
          {content.heading.title}
        </h2>
        <p className={cn("text-center", sectionType.subtitle)}>{content.heading.subtitle}</p>

        {showTabs && content.tabs && <PlanTabs tabs={content.tabs} value={tab} onChange={setTab} />}
      </div>

      <div className="mt-8 md:hidden">
        <PlanCarousel key={tab} cards={cards} loop={content.loop ?? false} />
      </div>

      <div className="mx-auto hidden max-w-300 px-4 md:block">
        <ul
          className={cn(
            "mt-10 grid grid-cols-1 items-stretch gap-6",
            cards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
          )}
        >
          {cards.map((item) => (
            <li key={item.id} className="min-w-0">
              <PlanCard card={item} />
            </li>
          ))}
        </ul>
      </div>

      {content.cta && (
        <div className="mt-10 flex justify-center px-4 md:mt-12">
          <Link
            href={content.cta.href}
            className="border-border text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none md:text-base"
          >
            {content.cta.label}
          </Link>
        </div>
      )}
    </section>
  );
}

function PlanCarousel({ cards, loop }: { cards: PlanCardContent[]; loop: boolean }) {
  const canLoop = loop && cards.length > 2;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ loop: canLoop, align: "center", containScroll: canLoop ? "trimSnaps" : false }}
        className="w-full [&_[data-slot=carousel-content]]:items-stretch"
      >
        <CarouselContent className="-ml-4">
          {cards.map((card) => (
            <CarouselItem key={card.id} className="basis-[84%] pl-4">
              <PlanCard card={card} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CarouselDots
        total={cards.length}
        index={current}
        onSelect={(i) => api?.scrollTo(i)}
        label="багц"
        className="mt-6"
      />
    </>
  );
}

function PlanTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: PlanTab[];
  value: PlanTabId;
  onChange: (v: PlanTabId) => void;
}) {
  return (
    <div className="mt-7 flex justify-center md:mt-8">
      <div className="border-border bg-muted/50 flex gap-1 rounded-full border p-1">
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-pressed={active}
              className={cn(
                "focus-visible:ring-ring rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlanCard({ card }: { card: PlanCardContent }) {
  if (card.groups?.length) return <PlanSpecCard card={card} />;
  return <PlanPhotoCard card={card} />;
}

function PlanSpecCard({ card }: { card: PlanCardContent }) {
  const featured = card.recommended === true;

  return (
    <article
      className={cn(
        "bg-card border-border relative flex h-full flex-col rounded-3xl border p-5 md:p-6",
        featured ? "shadow-lg" : "hover:shadow-md",
      )}
    >
      <div className="mb-3 h-7">
        {featured && (
          <span
            className="inline-flex h-7 items-center rounded-full px-3 text-[11px] font-bold tracking-wide text-white uppercase"
            style={{ backgroundColor: ACCENT }}
          >
            {RECOMMENDED_BADGE}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-foreground text-3xl leading-none font-extrabold tracking-tight">
          {card.title}
        </h3>
        {card.price && (
          <div className="shrink-0 text-right">
            <p className="text-foreground text-2xl leading-none font-extrabold tracking-tight">
              {card.price}
            </p>
            {card.priceNote && (
              <p className="text-muted-foreground mt-1.5 text-[11px] leading-tight">
                {card.priceNote}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex-1 space-y-5">
        {card.groups?.map((group) => (
          <PlanSpecGroup key={group.title} group={group} />
        ))}
      </div>

      <div className="border-border mt-6 flex justify-center border-t pt-4">
        <Link
          href={card.href}
          className="text-foreground focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
        >
          {card.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function PlanSpecGroup({ group }: { group: PlanGroup }) {
  const Icon = PLAN_GROUP_ICONS[group.icon];
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="size-5 shrink-0" style={{ color: ACCENT }} aria-hidden="true" />
        <h4 className="text-foreground text-sm font-bold">{group.title}</h4>
      </div>
      <dl className="mt-1.5 space-y-1 pl-7">
        {group.features.map((feature) => (
          <div key={feature.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{feature.label}</dt>
            <dd className="text-foreground text-right font-semibold">{feature.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PlanPhotoCard({ card }: { card: PlanCardContent }) {
  const plan = card.planId ? mobilePlans.find((p) => p.id === card.planId) : undefined;
  const featured = card.recommended === true;
  const hasImage = Boolean(card.image);
  const price = plan?.price ?? card.price;

  return (
    <article
      className={cn(
        "bg-card border-border relative flex h-full flex-col overflow-hidden rounded-3xl border p-3 md:p-4",
        featured ? "shadow-lg" : "hover:shadow-md",
      )}
    >

      <div
        className={cn(
          "relative isolate aspect-square shrink-0 overflow-hidden rounded-2xl",
          !hasImage && "bg-muted",
        )}
      >
        {card.image ? (
          <>
            <Image
              src={card.image}
              alt={card.imageAlt ?? ""}
              fill
              sizes="(max-width: 768px) 86vw, 33vw"
              className="-z-10 object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
            />
          </>
        ) : (
          card.photoLabel && (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center gap-2"
            >
              <ImageIcon className="text-muted-foreground/50 size-5" strokeWidth={1.5} />
              <span className="text-muted-foreground text-sm font-medium">{card.photoLabel}</span>
            </span>
          )
        )}

        {featured && <RecommendedFlag onImage={hasImage} className="absolute top-3 right-3 z-10" />}

        <div className="absolute inset-x-3 bottom-3 z-10">
          <PlanIdentity card={card} plan={plan} onImage={hasImage} />
        </div>
      </div>

      <ul className="flex-1 space-y-3 px-2 pt-5">
        {(card.highlights ?? []).map((h) => (
          <li key={h} className="text-foreground flex items-start gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="mt-px flex size-5 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `color-mix(in oklab, ${ACCENT} 18%, transparent)` }}
            >
              <Sparkles className="size-3.5" style={{ color: ACCENT }} />
            </span>
            <span className="leading-snug">{h}</span>
          </li>
        ))}
      </ul>

      <div className="border-border mt-5 flex items-center justify-between gap-3 border-t px-2 pt-4">
        {price ? (
          <div className="min-w-0">
            {!card.priceNote && <p className="text-muted-foreground text-xs">Суурь хураамж:</p>}
            <p className="text-foreground text-xl font-extrabold tracking-tight">{price}</p>
            {card.priceNote && (
              <p className="text-muted-foreground mt-0.5 text-[11px] leading-tight">
                {card.priceNote}
              </p>
            )}
          </div>
        ) : (
          <span aria-hidden="true" />
        )}

        <Link
          href={card.href}
          className="bg-foreground text-background inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-opacity duration-300 hover:opacity-85"
        >
          {card.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function RecommendedFlag({ onImage, className }: { onImage: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5", className)}>
      <span
        className="flex size-5 items-center justify-center rounded-full"
        style={{ backgroundColor: ACCENT }}
      >
        <Star className="size-3 fill-white text-white" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "text-[11px] font-bold tracking-wide",
          onImage ? "text-white" : "text-foreground",
        )}
      >
        {RECOMMENDED_BADGE}
      </span>
    </span>
  );
}

function PlanIdentity({
  card,
  plan,
  onImage,
}: {
  card: PlanCardContent;
  plan: MobilePlan | undefined;
  onImage: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-2">
      <div className="flex min-w-0 items-stretch gap-2">
        <span
          aria-hidden="true"
          className="w-1 shrink-0 rounded-full"
          style={{ backgroundColor: ACCENT }}
        />
        <div className="min-w-0">
          <h3
            className={cn(
              "truncate text-xl leading-tight font-bold tracking-tight",
              onImage ? "text-white" : "text-foreground",
            )}
          >
            {plan?.name ?? card.title}
          </h3>
          {plan && (
            <p
              className={cn(
                "text-[11px] leading-tight",
                onImage ? "text-white/80" : "text-muted-foreground",
              )}
            >
              Сар бүр
            </p>
          )}
        </div>
      </div>

      {plan && (
        <span
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-sm font-bold",
            onImage ? "border-white/60 text-white" : "border-border text-foreground bg-card",
          )}
        >
          {plan.data}
        </span>
      )}
    </div>
  );
}
