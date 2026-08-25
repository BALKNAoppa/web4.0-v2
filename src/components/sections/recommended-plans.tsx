"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ImageIcon } from "lucide-react";

import {
  RECOMMENDED_BADGE,
  type PlanCardContent,
  type PlanTab,
  type PlanTabId,
  type RecommendedPlansContent,
} from "@/data/recommended-plans";
import { ACCENT } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * "САНАЛ БОЛГОХ БАГЦ" — БҮРЭН ХЭМЖЭЭНИЙ section.
 *
 *          Санал болгох багц           ← том гарчиг
 *      Энд онцлох trigger үг байрлана  ← тайлбар
 *      [ Танд санал болгох | Бусад ]   ← таб, төвд
 *   ┌──────────┐ ┌──────────┐ ┌──────────┐
 *   │ Card     │ │ Card     │ │ Card     │
 *   │ photo    │ │ photo    │ │ photo    │
 *   │ Title    │ │ Title    │ │ Title    │
 *   │ ✓ H1…3   │ │ ✓ H1…4   │ │ ✓ H1…4   │
 *   │ [  CTA ] │ │ [  CTA ] │ │ [  CTA ] │
 *   └──────────┘ └──────────┘ └──────────┘
 *
 * ⚠️ ӨМНӨХ ХУВИЛБАРААС ЯЛГАА: энэ нь hero-гийн доод 40%-д шахагдаж байсан.
 * Тэр үед бүх хэмжээ `clamp(min, N·svh, max)`-аар дэлгэцийн өндрөөс
 * хамаардаг байв — карт 182px хүртэл хумигдаж, зураг 41px болдог байлаа.
 * Одоо ТУСДАА section болсон тул өндрийн хязгаар БАЙХГҮЙ: энгийн Tailwind
 * хэмжээ хэрэглэнэ, карт бүтэн хэмжээгээрээ гарна.
 *
 * ⚠️ `<section>` байх ЁСТОЙ бөгөөд `#main-content`-ийн ШУУД хүүхэд —
 * `SectionSnapScroller` тэгж хайдаг.
 */
export function RecommendedPlans({ content }: { content: RecommendedPlansContent }) {
  const [tab, setTab] = useState<PlanTabId>("recommended");
  const cards = content.cards[tab];

  return (
    // ДЭЭД зай нь ДООДООС бага — энэ section нь AI туслахын ШУУД дараа
    // ирдэг тул тэнд том завсар нь хоёрын хооронд "тасалдал" мэт харагдаж
    // байв. Доод зай нь дараагийн section-оос салгах үүрэгтэй тул хэвээр.
    <section
      aria-labelledby="plans-title"
      className="bg-background w-full pt-6 pb-14 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24"
    >
      <div className="mx-auto max-w-300 px-4">
        {/* ТОЛГОЙ — ТӨВД. Зүүн эгнүүлэлтийг туршаад БУЦААСАН: section бүр өөр
            өргөнтэй (туслах 768px · багц/үйлчилгээ 1200px) тул зүүн ирмэг нь
            зөрж, хуудас замбараагүй харагдаж байв. */}
        <h2
          id="plans-title"
          className="text-foreground text-center text-3xl font-extrabold tracking-tight text-balance md:text-4xl lg:text-5xl"
        >
          {content.heading.title}
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-center text-base text-pretty md:mt-4 md:text-lg">
          {content.heading.subtitle}
        </p>

        <PlanTabs tabs={content.tabs} value={tab} onChange={setTab} />

        {/* МОБАЙЛ: босоо жагсаалт, хуудсаараа доош урсана (дотоод гүйлгэлтгүй).
            md+: 3 тэнцүү багана. `items-stretch` — картууд ижил өндөртэй
            болж, доод талын CTA нэг шугамд эгнэнэ. */}
        <ul className="mt-8 grid grid-cols-1 items-stretch gap-5 md:mt-10 md:grid-cols-3 md:gap-6">
          {cards.map((item) => (
            <li key={item.id} className="min-w-0">
              <PlanCard card={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * ТАБ — segmented control, ТӨВД.
 *
 * `role="tablist"` хэрэглэхгүй: жинхэнэ tab widget нь сумны товчлуур, roving
 * tabindex шаарддаг. Энэ нь ердөө хоёр товч тул `aria-pressed`-ээр
 * илэрхийлсэн нь дэлгэц уншигчид ойлгомжтой бөгөөд буруу амлалт өгөхгүй.
 */
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

/**
 * БАГЦЫН КАРТ.
 *
 * PADDING нь картын хэмжээнд тохирсон — `p-3 md:p-4`. Дотор нь зураг өөрийн
 * дугуй булантай (`rounded-xl`), текстийн блок нь `px-1`-ээр зургийн ирмэгтэй
 * оптикоор эгнэнэ.
 *
 * `h-full` — grid-ийн `items-stretch`-тэй хамт бүх карт ижил өндөртэй болно;
 * highlight-ийн тоо (3 эсвэл 4) зөрсөн ч CTA-нууд нэг шугамд эгнэнэ
 * (`highlights` жагсаалт `flex-1`).
 */
function PlanCard({ card }: { card: PlanCardContent }) {
  const featured = card.recommended === true;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl border p-3 transition-shadow md:p-4",
        // ⚠️ Санал болгож буй багцын хүрээ нь БРЭНДИЙН өнгөний код
        // (`lib/brand.ts > ACCENT` — Unitel #45c700 / Univision #0FAA0A).
        // `border-primary` (oklch) БИШ: брэнд бүр өөрийн ногоонтой байх ёстой.
        featured ? "bg-card border-2 shadow-lg" : "border-border bg-card hover:shadow-md",
      )}
      style={featured ? { borderColor: ACCENT } : undefined}
    >
      {featured && (
        <span
          className="text-primary-foreground absolute top-5 right-5 z-10 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide md:top-6 md:right-6"
          style={{ backgroundColor: ACCENT }}
        >
          {RECOMMENDED_BADGE}
        </span>
      )}

      {/* ЗУРГИЙН СЛОТ — жинхэнэ зураг гартал шошготой талбай */}
      <div
        className="bg-muted flex aspect-16/10 shrink-0 items-center justify-center gap-2 rounded-2xl"
        aria-hidden="true"
      >
        <ImageIcon className="text-muted-foreground/50 size-5" strokeWidth={1.5} />
        <span className="text-muted-foreground/60 text-sm font-medium">{card.photoLabel}</span>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
          {card.title}
        </h3>

        {/* `flex-1` — highlight-ийн тоо зөрсөн ч CTA доод талд наалдана */}
        <ul className="mt-4 flex-1 space-y-2.5">
          {card.highlights.map((h) => (
            <li
              key={h}
              className="text-muted-foreground flex items-start gap-2 text-sm md:text-base"
            >
              <Check
                className="mt-0.5 size-4 shrink-0"
                style={{ color: ACCENT }}
                strokeWidth={3}
                aria-hidden="true"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* CTA — БҮТЭН ӨРГӨН. Шошго нь placeholder ("CTA"). */}
        <Link
          href={card.href}
          className={cn(
            "mt-7 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition-opacity duration-300 hover:opacity-85",
            featured ? "text-primary-foreground" : "bg-muted text-foreground",
          )}
          style={featured ? { backgroundColor: ACCENT } : undefined}
        >
          {card.ctaLabel}
        </Link>
      </div>
    </article>
  );
}
