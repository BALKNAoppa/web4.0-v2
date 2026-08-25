import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { promotionCards, promotionsSection, type PromotionCard } from "@/data/promotions";

export function Promotions() {
  return (
    <section aria-labelledby="promotions-title" className="bg-background w-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
        {/* ============ HEADER — гарчиг + нэг мөр тайлбар ============
            Хэмжээ/эгнүүлэлт нь `RecommendedPlans` · `RecommendedServices`-тэй
            НЭГ: `text-center` + `text-3xl md:text-4xl lg:text-5xl`. Нүүрний
            section-ууд нэг хэмнэлтэй байх ёстой тул гурвыг зэрэг өөрчил. */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="promotions-title"
            className="text-foreground text-3xl font-extrabold tracking-tight text-balance md:text-4xl lg:text-5xl"
          >
            {promotionsSection.title}
          </h2>

          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base text-pretty md:mt-4 md:text-lg">
            {promotionsSection.description}
          </p>
        </div>

        {/* ============ CARDS — Swiss / Be inspired-маягийн 3 card ============ */}
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotionCards.map((card) => (
            <li key={card.id}>
              <PromotionTile card={card} />
            </li>
          ))}
        </ul>

        {/* ============ FOOTER CTA ============ */}
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

// =====================================================================
// PROMOTION TILE — PLACEHOLDER хэлбэр: ӨНГӨГҮЙ, саарал.
//
// ⚠️ ӨМНӨ нь карт бүр өөрийн ӨНГӨТ байсан (violet / green / amber gradient
// эсвэл жинхэнэ урамшууллын зураг + бараан scrim, дээр нь цагаан текст).
// Контент нь бүхэлдээ placeholder болсон үед тэр өнгө нь картуудыг хуудсын
// хамгийн тод элемент болгож, "энэ бодит санал уу?" гэсэн эргэлзээ
// төрүүлж байв. Одоо `bg-card` — `promo-banner.tsx`-ийн
// `PromoBannerPlaceholder`-тай ЯГ ижил саарал гадарга.
//
// Хасагдсан зүйлс: `TONES` gradient map, чимэглэлийн icon (Lock / Trophy /
// Clapperboard — тэдгээр нь агуулгын УТГА дамжуулдаг тул placeholder-т
// зохисгүй), зургийн салаа, бараан scrim, `next/image` import.
// Жинхэнэ урамшуулал холбогдох үед git түүхээс сэргээнэ.
//
// ТЕКСТИЙН ӨНГӨ: туслах мөрүүдэд `text-muted-foreground` БИШ
// `text-foreground/70`. Шалтгаан: dark theme-д `--text-2` нь
// `rgba(184,184,184,0.6)` бөгөөд `bg-card` (#1c202d) дээр ойролцоогоор
// 3.8:1 болдог — 11-12px жижиг текстэд WCAG AA (4.5:1) хүрэхгүй.
// `foreground/70` нь light 6.4:1, dark 8.6:1 өгнө.
// =====================================================================
function PromotionTile({ card }: { card: PromotionCard }) {
  return (
    <Link
      href={card.ctaHref}
      aria-label={`${card.title} — ${card.ctaText}`}
      className="group bg-card ring-border focus-visible:ring-ring focus-visible:ring-offset-background relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl p-7 ring-1 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {/* Дээд эгнээ — badge pill + price bubble */}
      <div className="relative flex items-start justify-between gap-3">
        <span className="bg-muted text-foreground/70 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
          {card.badge}
        </span>

        <div className="bg-muted shrink-0 rounded-2xl px-3 py-2 text-right">
          <div className="text-foreground text-lg leading-none font-extrabold">{card.price}</div>
          <div className="text-foreground/70 mt-1 text-[11px] font-medium">{card.priceNote}</div>
        </div>
      </div>

      {/* Title + description */}
      <div className="relative mt-6 flex flex-1 flex-col justify-end">
        <h3 className="text-foreground text-[1.2rem] font-bold tracking-tight">{card.title}</h3>
        <p className="text-foreground/70 mt-3 max-w-sm text-[0.7rem] leading-relaxed">
          {card.description}
        </p>
      </div>

      {/* Доод эгнээ — хүчинтэй хугацаа + CTA */}
      <div className="border-border relative mt-6 flex items-center justify-between gap-3 border-t pt-4">
        <span className="text-foreground/70 text-xs font-medium">{card.validity}</span>
        <span className="text-foreground inline-flex items-center gap-1.5 text-sm font-semibold">
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
