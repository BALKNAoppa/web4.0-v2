"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselDots } from "@/components/ui/carousel-dots";
import { SmartLink } from "@/components/layout/smart-link";
import {
  promoBanners,
  samplePromoCards,
  type PromoCard,
  type PromoMedia,
} from "@/data/promo-banner";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function PromoBanner({ fill = false }: { fill?: boolean }) {
  return <PromoBannerPlaceholder fill={fill} />;
}

const bannerBox = (fill: boolean) =>
  fill
    ? "h-full"
    : "min-h-[52svh] sm:min-h-[34svh] lg:min-h-[38svh] py-10 [@media(max-height:720px)]:py-4";

void PromoBannerFull;

function PromoBannerPlaceholder({ fill }: { fill: boolean }) {
  const cards = samplePromoCards[BRAND];
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section
      aria-label="Онцлох урамшуулал"
      className={cn("flex w-full items-stretch", bannerBox(fill))}
    >
      <PromoFadeBanner cards={cards} />

      <div className="hidden w-full md:flex">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "center" }}
          className="w-full [&_[data-slot=carousel-content]]:h-full"
        >

          <CarouselContent className="-ml-2 h-full md:-ml-4">
            {cards.map((promo, i) => (
              <CarouselItem
                key={promo.id}
                className="h-full basis-[82%] pl-2 md:basis-[62.5%] md:pl-4"
              >
                <PromoSlide promo={promo} eager={i === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselCounter
            current={current}
            total={cards.length}
            onPrev={() => api?.scrollPrev()}
            onNext={() => api?.scrollNext()}
          />
        </Carousel>
      </div>
    </section>
  );
}

function PromoSlide({ promo, eager }: { promo: PromoCard; eager: boolean }) {
  const src = promo.imageDesktop ?? promo.image;

  if (!src) {
    return (
      <div className="bg-card flex h-full flex-col items-center justify-center gap-[clamp(0.75rem,2svh,1.5rem)] rounded-3xl">
        <span className="text-muted-foreground text-[clamp(0.875rem,2.2svh,1.125rem)] font-semibold sm:text-[clamp(1.125rem,3.4svh,2.25rem)]">
          {promo.placeholderText}
        </span>

        <Link
          href={promo.href}
          className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-[clamp(2.25rem,5svh,3rem)] items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-opacity duration-700 ease-out hover:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {promo.ctaLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative isolate flex h-full flex-col justify-end overflow-hidden rounded-3xl p-6">
      <Image
        src={src}
        alt={promo.imageAlt ?? ""}
        fill
        sizes="(min-width: 768px) 1920px, 100vw"
        priority={eager}
        style={{ objectPosition: promo.imageDesktopPosition ?? "center" }}
        className="-z-10 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/20 to-transparent"
      />

      <Link
        href={promo.href}
        className="focus-visible:ring-ring inline-flex h-[clamp(2.25rem,5svh,3rem)] w-fit items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-900 transition-colors duration-300 ease-out hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {promo.ctaLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

const FADE_MS = 500;
const SWIPE_MIN = 40;

function PromoFadeBanner({ cards }: { cards: PromoCard[] }) {
  const total = cards.length;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  return (
    <div className="flex w-full flex-col md:hidden">
      <div
        className="relative mx-6 aspect-[3/4] overflow-hidden rounded-3xl"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) < SWIPE_MIN) return;
          go(index + (dx < 0 ? 1 : -1));
        }}
      >
        {cards.map((promo, i) => (
          <PromoFadeSlide key={promo.id} promo={promo} active={i === index} />
        ))}
      </div>

      <CarouselDots total={total} index={index} onSelect={go} label="санал" className="mt-6" />
    </div>
  );
}

function PromoFadeSlide({ promo, active }: { promo: PromoCard; active: boolean }) {
  return (
    <div
      aria-hidden={!active}
      inert={!active}
      className={cn(
        "absolute inset-0 isolate flex flex-col justify-end p-4 pb-8 transition-opacity ease-out",
        promo.image ? "bg-foreground/5" : "bg-card",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >

      {promo.image ? (
        <>
          <Image
            src={promo.image}
            alt={promo.imageAlt ?? ""}
            fill
            priority={active}
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/20 to-transparent"
          />
        </>
      ) : (
        <span
          aria-hidden="true"
          className="text-foreground/75 absolute inset-0 flex items-center justify-center text-[11px] font-bold tracking-[0.18em] uppercase"
        >
          {promo.placeholderText}
        </span>
      )}

      <Link
        href={promo.href}
        tabIndex={active ? undefined : -1}
        className="focus-visible:ring-ring inline-flex h-9 w-fit items-center justify-center gap-1 self-end rounded-[28px] bg-white px-3 text-sm font-semibold text-neutral-900 transition-colors duration-300 ease-out hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {promo.ctaLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

function CarouselCounter({
  current,
  total,
  onPrev,
  onNext,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="bg-background/90 border-border absolute right-[calc(9%+0.75rem)] bottom-4 inline-flex items-center gap-1 rounded-full border p-1 shadow-md backdrop-blur sm:bottom-6 md:right-[calc(18.75%+1.5rem)]">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Өмнөх урамшуулал"
        className="hover:bg-muted focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none sm:size-8"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
      </button>

      <span aria-live="polite" className="text-foreground px-1 text-xs font-semibold tabular-nums">
        {current}/{total}
      </span>

      <button
        type="button"
        onClick={onNext}
        aria-label="Дараагийн урамшуулал"
        className="hover:bg-muted focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none sm:size-8"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function PromoBannerFull({ fill }: { fill: boolean }) {
  const content = promoBanners[BRAND];
  const isVideo = content.media.kind === "video";
  const needsScrim = content.media.kind !== "gradient";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.play().then(
      () => setPaused(false),
      () => setPaused(true),
    );
  }, []);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(
        () => setPaused(false),
        () => setPaused(true),
      );
    } else {
      el.pause();
      setPaused(true);
    }
  };

  return (
    <section
      aria-labelledby="promo-banner-title"
      className={cn("relative isolate w-full overflow-hidden", fill && "h-full")}
    >
      <PromoMediaLayer media={content.media} decorative={content.decorative} videoRef={videoRef} />

      {needsScrim && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25"
        />
      )}

      <div className={cn("relative mx-auto flex max-w-300 items-center px-4", bannerBox(fill))}>
        <div className="max-w-xl">
          <p className="text-xs font-bold tracking-[0.18em] text-white/80 uppercase">
            {content.eyebrow}
          </p>

          <h2
            id="promo-banner-title"
            className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-white md:text-5xl"
          >
            {content.title}
          </h2>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
            {content.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SmartLink
              href={content.cta.href}
              owner={content.cta.owner}
              className="bg-primary text-primary-foreground focus-visible:ring-offset-background inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-opacity duration-700 ease-out hover:opacity-85 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {content.cta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </SmartLink>

            {content.secondaryCta && (
              <SmartLink
                href={content.secondaryCta.href}
                owner={content.secondaryCta.owner}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
              >
                {content.secondaryCta.label}
              </SmartLink>
            )}
          </div>
        </div>
      </div>

      {isVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          aria-label={paused ? "Видеог тоглуулах" : "Видеог зогсоох"}
          className="absolute right-4 bottom-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
        >
          {paused ? (
            <Play className="size-4" aria-hidden="true" />
          ) : (
            <Pause className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </section>
  );
}

function PromoMediaLayer({
  media,
  decorative,
  videoRef,
}: {
  media: PromoMedia;
  decorative: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  if (media.kind === "video") {
    return (
      <video
        ref={videoRef}
        poster={media.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden={decorative ? "true" : undefined}
        tabIndex={-1}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        {media.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} media={source.media} />
        ))}
      </video>
    );
  }

  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={decorative ? "" : media.alt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
    );
  }

  return <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0d4f26]" />;
}
