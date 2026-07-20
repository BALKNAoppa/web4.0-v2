import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

import { homeHero } from "@/data/home";

/**
 * Нүүрний hero banner — цаг үеийн урамшууллыг харуулах Apple маягийн
 * дэлгэц дүүрэн (full-bleed) цайвар section. Доод хэсэгт нь бодит зураг
 * гартал "Banner 1" placeholder.
 */
export function HomeHeroBanner() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="animate-in fade-in bg-muted/40 w-full text-center duration-1000 ease-out"
    >
      <div className="mx-auto max-w-[1200px] px-4 pt-14 pb-6 md:pt-20 md:pb-8">
        <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          {homeHero.eyebrow}
        </p>
        <h1
          id="home-hero-title"
          className="text-foreground mt-3 text-4xl font-extrabold tracking-tight md:text-6xl"
        >
          {homeHero.title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base md:text-lg">
          {homeHero.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={homeHero.primaryCta.href}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-full px-7 text-sm font-semibold transition-colors duration-700 ease-out"
          >
            {homeHero.primaryCta.label}
          </Link>
          {homeHero.secondaryCta && (
            <Link
              href={homeHero.secondaryCta.href}
              className="text-foreground/80 hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors duration-700 ease-out"
            >
              {homeHero.secondaryCta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Банерын зургийн placeholder — бодит зураг гартал */}
        <div className="border-border/60 bg-background/60 mt-10 flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border md:h-72">
          <ImageIcon
            className="text-muted-foreground/40 size-8"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/60 text-sm font-medium">Banner 1</span>
        </div>
      </div>
    </section>
  );
}
