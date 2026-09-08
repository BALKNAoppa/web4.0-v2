"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageIcon, Sparkles, Star } from "lucide-react";

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
import { ACCENT } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * "САНАЛ БОЛГОХ БАГЦ" — БҮРЭН ХЭМЖЭЭНИЙ section.
 *
 *          Санал болгох багц           ← том гарчиг
 *      Энд онцлох trigger үг байрлана  ← тайлбар
 *      [ Танд санал болгох | Бусад ]   ← таб, төвд
 *
 * МОБАЙЛ (< md) — ХЯЗГААРГҮЙ (loop) CAROUSEL. Нэг карт төвд, хоёр талд нь
 *   хөршүүдийн ирмэг харагдана; доор нь цэгэн заагч.
 * md+ — тэнцүү багана: 3 карттай таб → 3, 2 карттай ("Бусад багцууд") → 2.
 *
 * ⚠️ ЯАГААД МОБАЙЛД CAROUSEL: гурван карт босоо жагсвал section нь ~2000px
 * болж, доорх бүх агуулгыг түлхдэг байв. Хэвтээ carousel нь гурвыг НЭГ
 * дэлгэцэнд багтаана.
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
      </div>

      {/* МОБАЙЛ — ХЯЗГААРГҮЙ CAROUSEL.
          ⚠️ Контейнерийн ГАДНА: карт нь `max-w-300 px-4`-ийн дотор байвал
          хөршийн ирмэг тайрагдаж, "хязгааргүй" мэдрэмж алдагдана. Тиймээс
          carousel нь бүтэн өргөнөө авч, дотогшоо суулгалт нь `basis`-аас
          гарна.
          ⚠️ `key={tab}` — таб солиход embla-г ШИНЭЭР босгоно. Үгүй бол
          хуучин байрлалдаа (жишээ нь 3 дахь карт) гацаж, шинэ табын эхний
          карт харагдахгүй. */}
      <div className="mt-8 md:hidden">
        <PlanCarousel key={tab} cards={cards} />
      </div>

      {/* md+ — тэнцүү багана (тоо нь доор, картаас). `items-stretch` — картууд
          ижил өндөртэй болж, доод талын үнэ/CTA мөр нэг шугамд эгнэнэ. */}
      <div className="mx-auto hidden max-w-300 px-4 md:block">
        <ul
          className={cn(
            "mt-10 grid grid-cols-1 items-stretch gap-6",
            // ⚠️ БАГАНЫН ТОО КАРТААС. "Бусад багцууд" таб 2 карттай тул
            // `md:grid-cols-3` үлдээвэл баруун талд ХООСОН багана үлдэнэ.
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
    </section>
  );
}

/**
 * МОБАЙЛЫН CAROUSEL — embla. `loop` нь ГУРВААС ОЛОН карттай үед л асна
 * (доорх `canLoop`-ийн тайлбарыг үз).
 *
 * `align: "center"` + `basis-[86%]` — идэвхтэй карт төвд, хоёр талд нь
 * ~26px ирмэг. Тэр ирмэг нь "цааш байна" гэдгийг сумгүйгээр хэлнэ.
 *
 * ⚠️ ЦЭГЭН ЗААГЧ нь promo banner-тайгаа ИЖИЛ (`CarouselDots`) — нэг хуудсан
 * дээр хоёр өөр хэлбэрийн заагч байвал систем задарна.
 */
function PlanCarousel({ cards }: { cards: PlanCardContent[] }) {
  /**
   * ГУРВААС ЦӨӨН КАРТ ДЭЭР LOOP ХИЙХ БОЛОМЖГҮЙ — embla өөрөө унтраадаг.
   *
   * `embla-carousel`-ийн `SlideLooper.canLoop()`:
   *
   *     viewSize − Σ(БУСАД бүх слайдын өргөн) <= 0.1
   *
   * буюу "нэг слайдыг эргүүлэхийн тулд ҮЛДСЭН слайдууд viewport-ыг БҮТНЭЭР
   * дүүргэж чадах ёстой". Манай слайд `basis-[84%]` тул:
   *   3 карт → үлдсэн 2 нь 168% ✓ loop асна
   *   2 карт → үлдсэн 1 нь ердөө 84% ✗ loop УНТАРНА
   * (`embla-carousel.esm.js:1528` — `loop && !canLoop()` бол engine-ээ
   * `loop: false`-оор ДАХИН үүсгэдэг, чимээгүйхэн.)
   *
   * Loop унтармагц анхдагч `containScroll: "trimSnaps"` нь гүйлтийг агуулгын
   * ирмэгээр ХАЗААРЛАДАГ. `align: "center"` нь 0 дугаар картыг голлуулахын
   * тулд СӨРӨГ байрлал шаардах тул хазаарлагдаж, карт зүүн ирмэгт наалддаг —
   * захиалагчийн "карт голлож харагдахгүй байна" гэсэн нь ЯГ ЭНЭ.
   *
   * ЗАСВАР: loop боломжгүй үед `containScroll: false` — снапууд тайрагдахгүй
   * тул карт голлоно. Гадна талд нь хоосон зай үлдэнэ (хөрш байхгүй тул
   * тэр талд peek гарах боломжгүй) — 2 картаар peek-тэй loop хийх нь
   * дээрх томьёогоор ЗАРЧМЫН ХУВЬД боломжгүй.
   *
   * ⚠️ `basis-[84%]`-ийг өөрчилвөл энэ 3-ын босгыг ДАХИН тооц.
   */
  const canLoop = cards.length > 2;
  const [api, setApi] = useState<CarouselApi>();
  /**
   * Идэвхтэй индекс. Effect-ийн БИЕД `setState` дуудахгүй
   * (`react-hooks/set-state-in-effect`) — carousel үргэлж 0-оос эхэлдэг тул
   * анхны утга нь аль хэдийн зөв.
   */
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
        // `containScroll` нь `loop: true` үед embla-д ХЭРЭГСЭГДЭХГҮЙ тул
        // "trimSnaps" (анхдагч) нь тэр тохиолдолд юу ч өөрчлөхгүй.
        opts={{ loop: canLoop, align: "center", containScroll: canLoop ? "trimSnaps" : false }}
        // `data-slot=carousel-content` нь `CarouselContent`-ийн ГАДНА
        // (`ref`-тэй) div — тэр нь className хүлээж авдаггүй тул өндрийг
        // эндээс дамжуулна. `items-stretch` — карт бүр эгнээний бүтэн
        // өндрийг авч, үнийн мөр нь доод ирмэгт наалдана.
        className="w-full [&_[data-slot=carousel-content]]:items-stretch"
      >
        {/* ЗАГВАРЫН ӨРГӨН: карт = 325px (390px frame дээр).
            Тооцоо: `CarouselContent` нь `-ml-4` тул контейнер 390+16=406.
            406 × 84% = 341, түүнээс `pl-4` (16) хасвал ЯГ 325. Ирмэг нь
            хоёр талд (390−325)/2 = 32.5px (загварт X=34). */}
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
 *   ┌─────────────────────────────┐
 *   │ ┌─────────────────────────┐ │  ← 1:1 зургийн слот
 *   │ │            ★ САНАЛ БОЛГОХ│ │  ← онцлох тэмдэг (`recommended`)
 *   │ │ ▌PRIORITY       ┌──────┐│ │  ← нэр + дата, ЗУРГИЙН ДЭЭР
 *   │ │ ▌Сар бүр        │ 48GB ││ │
 *   │ └─────────────────────────┘ │
 *   │  ✓ 3–4 онцлох эрх           │
 *   │  ───────────────────────    │
 *   │  Суурь хураамж:  [Дэлгэр…]  │  ← үнэ + CTA
 *   └─────────────────────────────┘
 *
 * ЗУРАГГҮЙ ХУВИЛБАР — слот нь ЯГ ИЖИЛ ХЭМЖЭЭТЭЙ, зүгээр л саарал:
 *
 *   ┌─────────────────────────────┐
 *   │ ┌─────────────────────────┐ │  ← ижил 1:1 слот, `bg-muted`
 *   │ │                         │ │     (`photoLabel` өгвөл дундаа
 *   │ │ ▌SMART DATA             │ │      дүрс+шошготой wireframe)
 *   │ └─────────────────────────┘ │
 *   │  ✓ 3 онцлох эрх             │
 *   │  ───────────────────────    │
 *   │                 [Дэлгэр…]   │  ← CTA (үнэ нь `planId`-гүй тул алга)
 *   └─────────────────────────────┘
 *
 * ⚠️ СЛОТЫГ ОГТ ХАСАХГҮЙ. Баннергүй хувилбар туршиж үзсэн боловч тэр карт
 * зурагтай картаас ~340px намхан болж, таб солиход section-ий өндөр үсэрдэг
 * байв (захиалагчийн "дэлгэцийн хэмжээг алдуулж байна").
 *
 * ⚠️ НЭР · ДАТА · ҮНЭ гурвуулаа `mobile-plans.ts`-ээс `planId`-аар ирнэ —
 * энд давхардуулж бичихгүй. `planId` байхгүй карт (Univision-ы placeholder,
 * SMART DATA/TALK) дээр дата pill ба үнийн мөр ОГТ гарахгүй, `title` нь
 * нэрийн оронд орно.
 */
function PlanCard({ card }: { card: PlanCardContent }) {
  const plan = card.planId ? mobilePlans.find((p) => p.id === card.planId) : undefined;
  const featured = card.recommended === true;
  const hasImage = Boolean(card.image);

  return (
    <article
      className={cn(
        // `overflow-hidden` — зураг нь картын дугуй буланг давахгүй.
        "bg-card relative flex h-full flex-col overflow-hidden rounded-3xl border p-3 md:p-4",
        // ⚠️ НОГООН ХҮРЭЭ ХАСАГДСАН (2026-09-07, захиалагчийн шийдвэр).
        // Өмнө нь санал болгож буй карт `border-2` + `borderColor: ACCENT`
        // (брэндийн ногоон) авдаг байв. Одоо хүрээ нь бусадтай ИЖИЛ.
        //
        // Онцлохыг заасан ХОЁР дохио ҮЛДСЭН тул карт танигдахаа болиогүй:
        //   1. `shadow-lg` — хөрш картуудын `hover:shadow-md`-ээс тод
        //   2. зургийн баруун дээд булангийн ★ "ТАНД ТОХИРНО" тэмдэг,
        //      түүний дугуй нь брэндийн ногоон хэвээр
        featured ? "border-border shadow-lg" : "border-border hover:shadow-md",
      )}
    >
      {/* ── 1:1 СЛОТ + дээр нь суух мэдээлэл ──
          ⚠️ ЭНЭ СЛОТ КАРТ БҮРД ГАРНА, зурагтай эсэхээс ҮЛ ХАМААРЧ. Түр
          зуур баннергүй хувилбар хийж үзсэн боловч тэр карт нь зурагтай
          картаас ~340px намхан болж, таб солиход section-ий өндөр үсэрдэг
          байв. Одоо зураггүй үед слот нь ЗҮГЭЭР Л саарал (`bg-muted`)
          талбай болж, өндөр нь бүх табад ижил хэвээр үлдэнэ.

          `isolate` — доорх `-z-10` зураг картын ДОТООД stacking context-д
          хоригдоно. Үүнгүй бол зураг картын дэвсгэрийн АРД орох эрсдэлтэй. */}
      <div
        className={cn(
          "relative isolate aspect-square shrink-0 overflow-hidden rounded-2xl",
          // ⚠️ САААРАЛ нь СЛОТ ӨӨРӨӨ дээр, `-z-10` ХҮҮХЭД дээр БИШ. Өмнө нь
          // `bg-muted` нь `absolute inset-0 -z-10` div дээр байсан бөгөөд
          // эцгийн `isolate`-тай хамт саарал нь картын дэвсгэрээс ялгарахгүй
          // болох эрсдэлтэй байв. Слот дээр шууд тавихад stacking-аас
          // ХАМААРАХГҮЙ — placeholder ҮРГЭЛЖ харагдана.
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
            {/* Scrim — доод талд нэр ба дата pill суудаг тул тэнд хамгийн
                бараан. Зургийн ХАМГИЙН ЦАЙВАР frame дээр цагаан текст
                4.5:1-д хүрэхгүй бол alpha-г нэмнэ (WCAG 1.4.3). */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
            />
          </>
        ) : (
          /* ЗУРГИЙН PLACEHOLDER-ийн ТЭМДЭГЛЭГЭЭ — дүрс + шошго, слотын ДУНДАА.
             `photoLabel` өгөгдсөн үед л гарна; орхивол слот нь цулгуй саарал
             хэвээр (өндөр нь аль ч тохиолдолд хэвээр). */
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

        {/* НЭР + ДАТА — слотын ДООД ирмэгт */}
        <div className="absolute inset-x-3 bottom-3 z-10">
          <PlanIdentity card={card} plan={plan} onImage={hasImage} />
        </div>
      </div>

      {/* ── ОНЦЛОХ ЭРХҮҮД ──
          `flex-1` — 3 ба 4 мөрийн зөрүүг энэ шингээж, доорх үнийн мөр бүх
          картад нэг шугамд эгнэнэ. */}
      {/* ⚠️ `px-2` = картын `p-3` (12) дээр нэмээд 20px — загварын дотоод
          зай. Зургийн слот нь картын ирмэгээс 12px байхад бичвэр нь 20px
          дотогш суух нь оптик тэнцвэрийг өгнө (зураг өөрөө ирмэгтэй,
          бичвэр биш). */}
      <ul className="flex-1 space-y-3 px-2 pt-5">
        {card.highlights.map((h) => (
          <li key={h} className="text-foreground flex items-start gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="mt-px flex size-5 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `color-mix(in oklab, ${ACCENT} 18%, transparent)` }}
            >
              {/* ⚠️ `Sparkles` — захиалагчийн сонгосон дүрс (AI туслахын оролт,
                  header-т хэрэглэгддэгтэй ИЖИЛ). `Check` байсныг сольсон.
                  strokeWidth нь анхны 2 — `Check`-ийн 3 нь оч дүрсний нарийн
                  туяануудыг наалдуулж толбо мэт болгодог. */}
              <Sparkles className="size-3.5" style={{ color: ACCENT }} />
            </span>
            <span className="leading-snug">{h}</span>
          </li>
        ))}
      </ul>

      {/* ── СУУРЬ ХУРААМЖ + CTA ──
          ⚠️ `planId` байхгүй карт дээр зөвхөн CTA гарна (үнэ нь хаанаас ч
          ирэхгүй тул хуурамч тоо зохиохгүй). */}
      <div className="border-border mt-5 flex items-center justify-between gap-3 border-t px-2 pt-4">
        {plan ? (
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Суурь хураамж:</p>
            {/* ⚠️ `mobile-plans.ts`-ийн үнэ нь НӨАТ-ГҮЙ (тэр файлын тайлбарт
                заасан). Тэр тэмдэглэлийг картад бичээгүй — загварт байхгүй
                бөгөөд `/main-packages` хуудсанд бүрэн тайлбар байдаг. */}
            <p className="text-foreground text-xl font-extrabold tracking-tight">{plan.price}</p>
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

/**
 * ОНЦЛОХ ТЭМДЭГ — ★ + "САНАЛ БОЛГОХ".
 *
 * Баннертай карт дээр зургийн баруун дээд буланд ХӨВНӨ (`absolute`),
 * баннергүй дээр нэрийн ДЭЭР энгийн мөр болж суудаг тул байрлалыг ГАДНААС
 * `className`-аар өгнө.
 *
 * `onImage` — scrim дээр суух эсэх: тийм бол шошго ЦАГААН, эс бөгөөс
 * картын энгийн өнгө. Дугуй нь хоёр тохиолдолд ч брэндийн ногоон.
 */
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

/**
 * БАГЦЫН НЭР + дата pill.
 *
 * Баннертай карт (зургийн доод ирмэгт) ба баннергүй карт (картын дээд талд)
 * ХОЁУЛАА үүнийг дууддаг — бүтэц НЭГ л газарт байснаар хоёр хэлбэр хожим
 * зөрөх боломжгүй.
 *
 * ⚠️ НЭР нь `plan?.name` → `card.title` дарааллаар: `planId`-тай карт дээр
 * нэр `mobile-plans.ts`-ээс ирнэ, энд давхардуулж бичихгүй.
 */
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
        {/* Брэнд өнгөт босоо зураас — нэрийг зургийн шуугианаас таслана */}
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
