import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Trophy, Clapperboard, type LucideIcon } from "lucide-react";

import {
  promotionCards,
  promotionsSection,
  type PromotionCard,
  type PromotionTone,
} from "@/data/promotions";

// =====================================================================
// TONE MAP — зураг байхгүй үеийн gradient fallback + чимэглэлийн icon.
// =====================================================================
const TONES: Record<
  PromotionTone,
  {
    /** Зураг байхгүй үеийн gradient background */
    card: string;
    icon: LucideIcon;
  }
> = {
  violet: {
    card: "bg-gradient-to-br from-[#3B0A6B] via-[#4C1D95] to-[#1E1B4B]",
    icon: Lock,
  },
  green: {
    card: "bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0A3D2E]",
    icon: Trophy,
  },
  amber: {
    card: "bg-gradient-to-br from-[#7C2D12] via-[#B45309] to-[#3F1D0B]",
    icon: Clapperboard,
  },
};

export function Promotions() {
  return (
    <section aria-labelledby="promotions-title" className="bg-background w-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
        {/* ============ HEADER — Singtel-маягийн том гарчиг ============ */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.18em] text-[#0FAA0A] uppercase">
            <span className="size-2 rounded-full bg-[#0FAA0A]" aria-hidden="true" />
            {promotionsSection.eyebrow}
          </div>

          <h2
            id="promotions-title"
            className="text-foreground mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {promotionsSection.titlePre}
            <span className="text-[#0FAA0A]">{promotionsSection.titleAccent}</span>
            {promotionsSection.titlePost}
          </h2>

          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg">
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
// PROMOTION TILE — бүхэлдээ даргддаг link. Background нь жинхэнэ
// урамшууллын зураг (`card.image`); зураг байхгүй бол tone gradient.
// Текст уншигдахуйц байхын тулд доороос дээш бараан scrim тавина.
// =====================================================================
function PromotionTile({ card }: { card: PromotionCard }) {
  const tone = TONES[card.tone];
  const Icon = tone.icon;

  return (
    <Link
      href={card.ctaHref}
      aria-label={`${card.title} — ${card.ctaText}`}
      className={`group focus-visible:ring-offset-background relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl p-7 shadow-xl ring-1 ring-black/10 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none ${tone.card}`}
    >
      {card.image ? (
        <>
          {/* Жинхэнэ урамшууллын зураг — background */}
          <Image
            src={card.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Бараан scrim — цагаан текстийг уншигдахуйц болгох */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
            aria-hidden="true"
          />
        </>
      ) : (
        /* Зураг байхгүй үед — gradient дээр бүдэг чимэглэлийн icon */
        <Icon
          className="pointer-events-none absolute -right-4 -bottom-4 size-36 text-white/10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:text-white/15"
          aria-hidden="true"
          strokeWidth={1.5}
        />
      )}

      {/* Дээд эгнээ — badge pill + price bubble */}
      <div className="relative flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {card.badge}
        </span>

        <div className="shrink-0 rounded-2xl bg-black/35 px-3 py-2 text-right backdrop-blur-sm">
          <div className="text-lg leading-none font-extrabold text-white">{card.price}</div>
          <div className="mt-1 text-[11px] font-medium text-white/70">{card.priceNote}</div>
        </div>
      </div>

      {/* Title + description */}
      <div className="relative mt-6 flex flex-1 flex-col justify-end">
        <h3 className="text-[1.2rem] font-bold tracking-tight text-white">{card.title}</h3>
        <p className="mt-3 max-w-sm text-[0.7rem] leading-relaxed text-white/85">{card.description}</p>
      </div>

      {/* Доод эгнээ — хүчинтэй хугацаа + CTA */}
      <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
        <span className="text-xs font-medium text-white/70">{card.validity}</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
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
