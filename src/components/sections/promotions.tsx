import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { promotionCards, promotionsSection, type PromotionCard } from "@/data/promotions";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";

export function Promotions() {
  // ⚠️ БРЭНДЭЭР — энэ section-ийг Unitel ба Univision ХОЁУЛАА дууддаг тул
  // карт нь тус бүрийнхээ хавтаснаас ирнэ (`promotions.ts > promotionCards`).
  const cards = promotionCards[BRAND];

  return (
    <section aria-labelledby="promotions-title" className={cn(sectionBg.band, "w-full")}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
        {/* ============ HEADER — гарчиг + нэг мөр тайлбар ============
            Хэмжээ/эгнүүлэлт нь `RecommendedPlans` · `OtherServices`-тэй
            НЭГ: `text-center` + `text-3xl md:text-4xl lg:text-5xl`. Нүүрний
            section-ууд нэг хэмнэлтэй байх ёстой тул гурвыг зэрэг өөрчил. */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="promotions-title" className={sectionType.title}>
            {promotionsSection.title}
          </h2>

          <p className={sectionType.subtitle}>{promotionsSection.description}</p>
        </div>

        {/* ============ CARDS — Swiss / Be inspired-маягийн 3 card ============ */}
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
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
// PROMOTION TILE — ХОЁР ТӨЛӨВТЭЙ.
//
//   ЗУРАГТАЙ (`card.image`) → зураг картыг бүтнээр дүүргэж, доошоо
//     гүнзгийрэх бараан scrim орж, БҮХ бичвэр цагаан болно.
//   ЗУРАГГҮЙ                → саарал `bg-card` placeholder, бичвэр
//     `foreground` — `promo-banner.tsx`-ийн placeholder-тай ижил гадарга.
//
// ⚠️ Зургийн салаа нь 2026-09-07-нд ЭРГЭЖ ОРСОН. Өмнө нь карт бүгд
// placeholder байх үед зураг нь "энэ бодит санал уу?" гэсэн эргэлзээ
// төрүүлдэг тул хасагдсан байв; одоо захиалагчийн бодит урамшууллын
// зураг (`public/Unitel/Campaigns/`) холбогдсон.
// БУЦААЖ АВААГҮЙ зүйлс: `TONES` gradient map ба чимэглэлийн icon
// (Lock / Trophy / Clapperboard) — тэдгээр нь агуулгын УТГА дамжуулдаг тул
// зурагтай карт дээр илүүц. Хэрэгтэй бол git түүхээс.
//
// ТЕКСТИЙН ӨНГӨ (зураггүй төлөв): туслах мөрүүдэд `text-muted-foreground`
// БИШ `text-foreground/70`. Шалтгаан: dark theme-д `--text-2` нь
// `rgba(184,184,184,0.6)` бөгөөд `bg-card` (#1c202d) дээр ойролцоогоор
// 3.8:1 болдог — 11-12px жижиг текстэд WCAG AA (4.5:1) хүрэхгүй.
// `foreground/70` нь light 6.4:1, dark 8.6:1 өгнө.
// =====================================================================
function PromotionTile({ card }: { card: PromotionCard }) {
  const hasImage = Boolean(card.image);

  return (
    <Link
      href={card.ctaHref}
      aria-label={`${card.title} — ${card.ctaText}`}
      className={cn(
        // `isolate` — доорх `-z-10` зураг ЭНЭ картын дотоод stacking context-д
        // хоригдоно (`promo-banner.tsx`, `recommended-plans.tsx`-тэй ижил).
        "group focus-visible:ring-ring focus-visible:ring-offset-background relative isolate flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl p-7 ring-1 transition-all duration-500 ease-out hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        hasImage
          ? "shadow-xl ring-black/10 hover:shadow-2xl"
          : "bg-card ring-border hover:shadow-lg",
      )}
    >
      {/* ── ДЭВСГЭР ЗУРАГ ──
          Зураг нь картын БҮТЭН талбайг эзэлж, дээр нь доошоо гүнзгийрэх
          scrim орно: гарчиг, тайлбар нь доод хэсэгт суудаг тул тэнд хамгийн
          бараан. Зураггүй үед энэ бүхэлдээ гарахгүй, карт нь `bg-card`. */}
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

      {/* Дээд эгнээ — badge pill + price bubble.
          ⚠️ ХОЁУЛАА ЗААВАЛ БИШ. Аль нь ч байхгүй бол эгнээ ӨӨРӨӨ гарахгүй —
          хоосон `div` үлдээвэл доорх гарчиг 24px-ээр доошилж, картууд
          хоорондоо зөрнө. Доорх гарчгийн блок `flex-1 justify-end` тул
          эгнээгүй үед ч гарчиг картын ЁРОНД наалдсан хэвээр.
          ⚠️ Зурагтай үед pill нь БАРААН (`bg-black/60`), тунгалаг цагаан БИШ.
          Картын ДЭЭД хэсэгт scrim нь ердөө 25% тул цайвар зураг дээр
          цагаан бичвэр 4.5:1-д хүрэхгүй. `black/60` нь хамгийн муу
          тохиолдолд (цав цагаан зураг) ч ≈5.7:1 өгнө (WCAG 1.4.3). */}
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
            // `ml-auto` — badge байхгүй үед ганцаараа үлдэхэд `justify-between`
            // нь зүүн тийш нааж орхино; bubble нь ҮРГЭЛЖ баруун ирмэгт.
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

      {/* Title + description */}
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

      {/* Доод эгнээ — хүчинтэй хугацаа + CTA */}
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
