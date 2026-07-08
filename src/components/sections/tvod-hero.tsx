"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { tvodHeroFeatures, type TvodHeroFeature } from "@/data/tvod-hero";

/**
 * IMAX-маягийн full-width hero banner. Featured кинонууд carousel-аар
 * 6 секунд тутамд эргэлддэг. Доод-баруун буланд "feature picker" panel
 * нь идэвхтэй болон дараагийн кинонуудыг харуулна, click-хад шилжинэ.
 */
export function TvodHero() {
  const autoplay = useMemo(() => Autoplay({ delay: 6000, stopOnInteraction: true }), []);
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => setCurrentIndex(api.selectedScrollSnap());
    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);
    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  return (
    <div aria-label="TVOD онцлох кино" className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        plugins={[autoplay]}
        onMouseEnter={autoplay.stop}
        onMouseLeave={autoplay.reset}
        className="w-full"
      >
        <CarouselContent>
          {tvodHeroFeatures.map((feature, index) => (
            <CarouselItem key={feature.id}>
              <HeroCard feature={feature} priority={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="left-4 size-11 border-0 bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
          aria-label="Өмнөх"
        />
        <CarouselNext
          className="right-4 size-11 border-0 bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
          aria-label="Дараагийн"
        />
      </Carousel>

      {/* Feature picker — banner-ийн доод-баруун булан */}
      <FeaturePicker
        features={tvodHeroFeatures}
        currentIndex={currentIndex}
        onSelect={(idx) => api?.scrollTo(idx)}
      />
    </div>
  );
}

// =====================================================================
// FEATURE PICKER — banner-ийн доод буланд харагдах highlight panel
// =====================================================================
function FeaturePicker({
  features,
  currentIndex,
  onSelect,
}: {
  features: TvodHeroFeature[];
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="pointer-events-none absolute right-4 bottom-20 z-10 hidden md:block lg:right-8 lg:bottom-28">
      <div className="mb-3 flex items-center justify-end gap-2 text-[10px] font-semibold tracking-widest text-white/70 uppercase md:text-xs">
        <span>Онцлох</span>
        <span className="text-white/40">·</span>
        <span className="tabular-nums text-white">
          {String(currentIndex + 1).padStart(2, "0")}
          <span className="text-white/40"> / {String(features.length).padStart(2, "0")}</span>
        </span>
      </div>
      <div className="pointer-events-auto flex gap-3">
        {features.map((feature, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => onSelect(idx)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${feature.title} (${feature.year})`}
              className={cn(
                "focus-visible:ring-primary group/picker relative w-44 overflow-hidden rounded-md border bg-white/10 px-3 py-2.5 text-left backdrop-blur-md transition-all focus-visible:ring-2 focus-visible:outline-none",
                isActive
                  ? "border-white/70 bg-white/20"
                  : "border-white/15 opacity-60 hover:border-white/40 hover:opacity-100",
              )}
            >
              {/* Top bar — active highlight */}
              <span
                className={cn(
                  "absolute top-0 right-2 left-2 h-0.5 transition-colors",
                  isActive ? "bg-white" : "bg-transparent",
                )}
                aria-hidden="true"
              />
              <div className="text-[10px] font-bold tracking-widest text-white/60">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="mt-1 line-clamp-1 text-sm font-bold text-white">{feature.title}</div>
              <div className="text-xs text-white/60">({feature.year})</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeroCard({ feature, priority }: { feature: TvodHeroFeature; priority: boolean }) {
  return (
    <div className="relative h-[75vh] min-h-[500px] w-full overflow-hidden bg-slate-900 md:h-[82vh] md:min-h-[640px] lg:min-h-[760px]">
      {/* Backdrop image эсвэл cinema gradient placeholder */}
      {feature.backdrop ? (
        <Image
          src={feature.backdrop}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black"
          aria-hidden="true"
        >
          {/* Subtle texture — placeholder feel */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[14rem] font-black tracking-tight text-white md:text-[20rem] lg:text-[26rem]">
              {feature.title.split(" ")[0]}
            </span>
          </div>
        </div>
      )}

      {/* Dark overlay: дооноос дээш текст уншигдахуйц */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10"
        aria-hidden="true"
      />

      {/* Content — bottom-left, IMAX-маягийн том typography */}
      <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-20 md:pb-28 lg:pb-32">
        {feature.badge && (
          <span className="mb-4 inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm md:text-sm">
            {feature.badge}
          </span>
        )}
        <h2 className="max-w-4xl text-4xl leading-[1.05] font-black tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
          {feature.title}{" "}
          <span className="font-light text-white/70">({feature.year})</span>
        </h2>
        {feature.tagline && (
          <p className="mt-5 max-w-2xl text-base text-white/85 drop-shadow md:text-lg lg:text-xl">
            {feature.tagline}
          </p>
        )}
        <Link
          href={feature.detailHref}
          className="focus-visible:ring-primary mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-md border-2 border-white/80 bg-transparent px-7 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:text-base"
        >
          Дэлгэрэнгүй
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
