"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import {
  campaignCategories,
  campaignHighlights,
  campaignsHero,
} from "@/data/campaigns";

export default function CampaignsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const visibleHighlights = useMemo(
    () =>
      activeCategory === "all"
        ? campaignHighlights
        : campaignHighlights.filter((h) => h.category === activeCategory),
    [activeCategory],
  );

  return (
    <main id="main-content" className="bg-background min-h-screen">
      <Breadcrumb items={[{ label: "Урамшуулал" }]} />

      {/* ============ HERO — төв тэгшилсэн гарчиг + тайлбар ============ */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center md:pt-20 md:pb-12">
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          {campaignsHero.title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed md:text-lg">
          {campaignsHero.description}
        </p>
      </section>

      {/* ============ CATEGORY FILTER PILLS ============ */}
      <section
        aria-label="Урамшууллын ангилал"
        className="container mx-auto px-4 pb-12 md:pb-16"
      >
        <div
          role="tablist"
          aria-label="Урамшууллын ангиллууд"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {campaignCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`focus-visible:ring-ring inline-flex h-12 min-w-[7.5rem] items-center justify-center rounded-2xl border px-5 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:text-base ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ HIGHLIGHTS — Card grid ============ */}
      <section
        aria-labelledby="highlights-title"
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <h2
          id="highlights-title"
          className="text-foreground mb-8 text-center text-3xl font-bold tracking-tight md:mb-12 md:text-4xl"
        >
          Онцлох санал
        </h2>

        {visibleHighlights.length === 0 ? (
          <p className="text-muted-foreground py-16 text-center">
            Энэ ангилалд урамшуулал одоогоор алга байна.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleHighlights.map((item) => (
              <HighlightCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

// =====================================================================
// HIGHLIGHT CARD
// =====================================================================
function HighlightCard({ item }: { item: (typeof campaignHighlights)[number] }) {
  return (
    <article className="bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-lg">
      {/* Visual placeholder — production-д жинхэнэ зургаар солих */}
      <div
        className="relative flex aspect-[4/3] items-center justify-center bg-gray-100"
        aria-hidden="true"
      >
        <span className="text-2xl font-semibold text-gray-400 md:text-3xl">
          {item.placeholderText}
        </span>
        {item.badge && (
          <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-[#0FAA0A] px-3 py-1.5 text-[11px] font-bold tracking-wide text-white shadow-md">
            {item.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0FAA0A]">
          <Clock className="size-4" aria-hidden="true" />
          <span>{item.duration}</span>
        </div>
        <h3 className="text-foreground mt-2 text-xl font-bold tracking-tight md:text-2xl">
          {item.title}
        </h3>

        <div className="mt-auto pt-6">
          <Link
            href={item.ctaHref}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {item.ctaText}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
