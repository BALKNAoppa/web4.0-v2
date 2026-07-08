"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Wifi } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { heroSlides, type HeroSlide } from "@/data/hero-slides";

export function Hero() {
  const autoplay = useMemo(() => Autoplay({ delay: 6000, stopOnInteraction: true }), []);

  return (
    <section aria-label="Онцлох banner" className="w-full">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={[autoplay]}
        onMouseEnter={autoplay.stop}
        onMouseLeave={autoplay.reset}
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <HeroSlideCard slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="left-4 size-11 border-0 bg-white/90 text-black hover:bg-white"
          aria-label="Өмнөх слайд"
        />
        <CarouselNext
          className="right-4 size-11 border-0 bg-white/90 text-black hover:bg-white"
          aria-label="Дараагийн слайд"
        />
      </Carousel>
    </section>
  );
}

/** V1 — Нэг slide */
function HeroSlideCard({ slide }: { slide: HeroSlide }) {
  const ctaPositionClass =
    slide.ctaPosition === "left"
      ? "left-[8%] md:left-[12%] lg:left-[15%]"
      : "right-[8%] md:right-[12%] lg:right-[15%]";

  return (
    <div className="relative h-80 w-full overflow-hidden bg-gray-300 md:h-105 lg:h-160">
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="text-2xl font-semibold text-gray-600 md:text-4xl">
          {slide.placeholderText}
        </span>
      </div>
      <div className={`absolute bottom-[25%] ${ctaPositionClass}`}>
        <Link
          href={slide.ctaHref}
          className="focus-visible:ring-primary inline-flex h-10 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-black shadow-lg transition-colors hover:bg-black hover:text-white focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {slide.ctaText}
        </Link>
      </div>
    </div>
  );
}

export function HeroSplit() {
  return (
    <section aria-label="Гол banner" className="bg-background relative w-full overflow-hidden">
      <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:py-24 lg:py-18">
        {/* Зүүн — text & CTA */}
        <div className="flex flex-col items-start">
          <span className="text-primary inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="size-4" aria-hidden="true" />
            Шинэ үеийн интернэт
          </span>

          <h1 className="text-foreground mt-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Хурдтай, тогтвортой — <span className="text-primary">танай гэрийн</span> Wi-Fi
          </h1>

          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed md:text-lg">
            Univision — Mongolia-н хамгийн дэвшилтэт fiber сүлжээгээр таны гэр, оффисыг тогтвортой
            сүлжээгээр хангаж ажиллана.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/main-packages"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-12 items-center gap-2 rounded-md px-6 text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Багц сонгох
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/campaigns"
              className="border-border hover:bg-muted focus-visible:ring-ring text-foreground inline-flex h-12 items-center gap-2 rounded-md border-2 px-6 text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Урамшуулал үзэх
            </Link>
          </div>
        </div>

        {/* Баруун — featured visual (placeholder gradient) */}
        <div className="relative aspect-5/4 w-full overflow-hidden rounded-2xl md:aspect-square">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-2) 0%, var(--color-3) 50%, var(--primary) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <Wifi className="size-32 text-white/80 md:size-40" strokeWidth={1.2} />
          </div>
          {/* Floating speed badge */}
          <div className="absolute right-5 bottom-5 rounded-xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
            <div className="text-primary text-xs font-semibold tracking-wider uppercase">
              Хурд хүртэл
            </div>
            <div className="text-foreground text-3xl font-extrabold">1 Gbps</div>
          </div>
        </div>
      </div>

      {/* Trust strip — доод хэсэг */}
      <div className="border-border bg-muted/30 border-t">
        <div className="container mx-auto grid gap-6 px-4 py-6 sm:grid-cols-3">
          <TrustStat value="500k+" label="Хэрэглэгчид" />
          <TrustStat value="99.9%" label="Сүлжээний тогтворшил" />
          <TrustStat value="24/7" label="Хэрэглэгчийн тусламж" />
        </div>
      </div>
    </section>
  );
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3 sm:text-left">
      <div className="text-foreground text-2xl font-extrabold md:text-3xl">{value}</div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  );
}
