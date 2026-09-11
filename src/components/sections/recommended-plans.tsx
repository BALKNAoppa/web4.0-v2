"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageIcon, Phone, Play, Sparkles, Star, Tv, Wifi, type LucideIcon } from "lucide-react";

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
import { type PlanGroup } from "@/data/plans";
import { ACCENT } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";

/**
 * `plans.ts`-ийн бүлгийн дүрсийн нэр → lucide компонент.
 *
 * ⚠️ `/main-packages`-ийн `iconMap`-тай ИЖИЛ дөрвөн хос. Хоёр газарт
 * тархсан нь ЗӨРӨХ эрсдэлтэй — `plans.ts`-д `icon` төрөл нэмэгдвэл ХОЁУЛАА
 * шинэчлэх шаардлагатай (TypeScript `Record` тул алдаа build-д илэрнэ).
 */
const PLAN_GROUP_ICONS: Record<PlanGroup["icon"], LucideIcon> = {
  wifi: Wifi,
  tv: Tv,
  play: Play,
  phone: Phone,
};

/**
 * "САНАЛ БОЛГОХ БАГЦ" — БҮРЭН ХЭМЖЭЭНИЙ section.
 *
 *          Танд санал болгох багц      ← том гарчиг
 *      Хэрэглээнд тань тохирох …       ← тайлбар
 *      [ Танд санал болгох | Бусад ]   ← таб, төвд · ЗААВАЛ БИШ
 *              [ картууд ]
 *      [ Бусад багцын мэдээллийг … ]   ← section-ийн CTA · ЗААВАЛ БИШ
 *
 * МОБАЙЛ (< md) — CAROUSEL. Нэг карт төвд, хоёр талд нь хөршүүдийн ирмэг
 *   харагдана; доор нь цэгэн заагч. Хязгааргүй (loop) эргэх эсэх нь
 *   data-аас (`content.loop`) — анхдагч нь ХЯЗГААРТАЙ.
 * md+ — тэнцүү багана: 3 карттай → 3, 2 карттай → 2.
 *
 * ⚠️ ЯАГААД МОБАЙЛД CAROUSEL: гурван карт босоо жагсвал section нь ~2000px
 * болж, доорх бүх агуулгыг түлхдэг байв. Хэвтээ carousel нь гурвыг НЭГ
 * дэлгэцэнд багтаана.
 *
 * ⚠️ ХОЁР БРЭНД ХОЁР ХЭЛБЭР (2026-09-09):
 *   Unitel    — таб (Танд санал болгох | Бусад багцууд) · loop ON · CTA-гүй
 *   Univision — табгүй, 3 багц шууд · loop OFF · доод CTA-тай
 * Хэлбэрийг ЗӨВХӨН data шийднэ (`tabs` / `cta` / `loop` талбарууд байгаа
 * эсэх) — компонентод брэндийн шалгалт БАЙХГҮЙ.
 *
 * ⚠️ `<section>` байх ЁСТОЙ бөгөөд `#main-content`-ийн ШУУД хүүхэд —
 * `SectionSnapScroller` тэгж хайдаг.
 */
export function RecommendedPlans({ content }: { content: RecommendedPlansContent }) {
  const [tab, setTab] = useState<PlanTabId>("recommended");
  /**
   * ⚠️ `?? []` — `cards.other` нь ЗААВАЛ БИШ болсон (2026-09-09). Табгүй
   * section-д `tab` нь "recommended"-ээс хэзээ ч хөдлөхгүй тул практикт
   * хоосон болохгүй, гэхдээ тип нь `undefined`-ыг зөвшөөрдөг.
   */
  const cards = content.cards[tab] ?? [];
  /**
   * ТАБЫГ РЕНДЕРЛЭХ ЭСЭХ — ХОЁРООС БАГА бол ОГТ ҮГҮЙ. Нэг товчтой
   * segmented control нь дарах юмгүй, гэхдээ таб мэт харагдаж хэрэглэгчийг
   * "хаана нөгөө нь вэ?" гэж хайлгана.
   */
  const showTabs = (content.tabs?.length ?? 0) > 1;

  return (
    // ДЭЭД зай нь ДООДООС бага — энэ section нь AI туслахын ШУУД дараа
    // ирдэг тул тэнд том завсар нь хоёрын хооронд "тасалдал" мэт харагдаж
    // байв. Доод зай нь дараагийн section-оос салгах үүрэгтэй тул хэвээр.
    <section
      aria-labelledby="plans-title"
      className={cn(sectionBg.band, "w-full pt-6 pb-14 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24")}
    >
      <div className="mx-auto max-w-300 px-4">
        {/* ТОЛГОЙ — ТӨВД. Зүүн эгнүүлэлтийг туршаад БУЦААСАН: section бүр өөр
            өргөнтэй (туслах 768px · багц/үйлчилгээ 1200px) тул зүүн ирмэг нь
            зөрж, хуудас замбараагүй харагдаж байв. */}
        <h2 id="plans-title" className={cn("text-center", sectionType.title)}>
          {content.heading.title}
        </h2>
        <p className={cn("text-center", sectionType.subtitle)}>{content.heading.subtitle}</p>

        {showTabs && content.tabs && <PlanTabs tabs={content.tabs} value={tab} onChange={setTab} />}
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
        <PlanCarousel key={tab} cards={cards} loop={content.loop ?? false} />
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

      {/**
       * SECTION-ИЙН ДООД CTA — бүх багцын хуудас руу (2026-09-09).
       *
       * ⚠️ КОНТЕЙНЕРИЙН ГАДНА, өөрийн `mx-auto`-той: дээрх `md:block`
       * контейнер нь мобайлд НУУГДДАГ (`hidden`) тул CTA-г түүний дотор
       * тавибал утсан дээр ОГТ гарахгүй байсан.
       *
       * `border` + `bg-transparent` — картын дотоод CTA нь дүүрэн хар
       * (`bg-foreground`) тул ижил хэлбэр давхарлавал аль нь гол үйлдэл
       * болох нь мэдэгдэхгүй. Section-ийн CTA нь ХОЁРДОГЧ: хэрэглэгч
       * гурван багцаас сонгож чадаагүй үед л хэрэгтэй.
       */}
      {content.cta && (
        <div className="mt-10 flex justify-center px-4 md:mt-12">
          <Link
            href={content.cta.href}
            className="border-border text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none md:text-base"
          >
            {content.cta.label}
          </Link>
        </div>
      )}
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
function PlanCarousel({ cards, loop }: { cards: PlanCardContent[]; loop: boolean }) {
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
   *
   * ⚠️⚠️ `loop` PROP НЭМЭГДСЭН (2026-09-09, захиалагч Univision-ы багцын
   * carousel дээр: "Infinity биш байна"). Data-аас `false` ирвэл дээрх
   * тооцоо ямар байхаас үл хамааран loop УНТАРНА, тэр үед доорх
   * `containScroll: false` нь картыг голлуулсан хэвээр байлгах ба хоёр
   * талын peek нь ЭХНИЙ/СҮҮЛИЙН слайд дээр л алга болно (хөрш байхгүй тул
   * зарчмын хувьд гаргах боломжгүй) — дунд слайд дээр хэвээр.
   */
  const canLoop = loop && cards.length > 2;
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
/**
 * ХОЁР ХЭЛБЭРИЙН ХУВААРИЛАГЧ.
 *
 * `groups` бий → ҮЗҮҮЛЭЛТИЙН карт (Univision, захиалагчийн 2026-09-09-ны
 *   screenshot). Зураг байхгүй, badge · нэр+үнэ · хүснэгт · линк.
 * эс бөгөөс → ЗУРАГТАЙ карт (Unitel) — 1:1 слот + ✦ жагсаалт + доод CTA.
 *
 * Брэндийн шалгалт БАЙХГҮЙ: хэлбэрийг ЗӨВХӨН дата шийднэ. Тиймээс Unitel
 * дээр `groups` өгөх өдөр компонент хөндөгдөхгүй, эсрэгээр ч мөн адил.
 */
function PlanCard({ card }: { card: PlanCardContent }) {
  if (card.groups?.length) return <PlanSpecCard card={card} />;
  return <PlanPhotoCard card={card} />;
}

/**
 * ҮЗҮҮЛЭЛТИЙН КАРТ — захиалагчийн 2026-09-09-ны screenshot.
 *
 *   ┌───────────────────────────────┐
 *   │ (САНАЛ БОЛГОХ)                │ ← ногоон pill, зөвхөн `recommended`
 *   │ L+                   79'900₮  │ ← нэр зүүн, үнэ баруун
 *   │            / сарын суурь …/   │ ← `priceNote`
 *   │ ᯤ Интернэт                    │
 *   │   Үндсэн хурд   100Mbps* хүр… │
 *   │   Дата эрх              1 TB  │
 *   │ ▭ IPTV · ▶ Энтертайнмент · ☎  │
 *   │        Дэлгэрэнгүй харах      │ ← төвд, доогуур зураастай
 *   └───────────────────────────────┘
 *
 * ⚠️ БҮТЭН КАРТ ЛИНК БИШ. Доод линк нь ГАНЦ дарах цэг: хүснэгтэн дэх
 * шошго/утга нь унших зүйл тул тэднийг дарагдах талбай болгох нь хэрэглэгчийг
 * "юуг дарж болох вэ" гэж таамаглуулна. (Зурагтай карт нь мөн ижил зарчим —
 * тэнд ч зөвхөн CTA линк.)
 *
 * ⚠️ `<dl>` — шошго → утга нь ТОДОРХОЙЛОЛТЫН жагсаалт, `<div>` биш.
 * Screen reader "Үндсэн хурд: 100Mbps" гэж ХОСООР уншина; `<div>` бол хоёр
 * тусдаа мөр болж, аль утга алинд хамаарахыг хэлэхгүй.
 */
function PlanSpecCard({ card }: { card: PlanCardContent }) {
  const featured = card.recommended === true;

  return (
    <article
      className={cn(
        // ⚠️ `border-border` нь ОДОО ХОЁУЛАНД. Өмнө нь зөвхөн featured БИШ
        // салаанд байсан: featured картын хүрээний өнгийг inline `style` нь
        // өгдөг байв. Тэр style хасагдсан тул хүрээ өнгөгүй үлдэж, Tailwind
        // v4-т `border` нь `currentColor` рүү унаж БИЧВЭРИЙН өнгөтэй бараан
        // хүрээ гарна. Токеныг хоёуланд тавьж тэгшитгэв.
        "bg-card border-border relative flex h-full flex-col rounded-3xl border p-5 md:p-6",
        featured ? "shadow-lg" : "hover:shadow-md",
      )}
      // ⚠️⚠️ НОГООН ХҮРЭЭ ХАСАГДСАН (2026-09-11, захиалагч: "санал болгох
      // багцын green border-г хас, би тэрийг бас хас гэж хэлж байсан").
      // Дэлгэрэнгүй түүхийг `PlanPhotoCard`-ын ижил мөрөнд бичсэн.
    >
      {/* ── BADGE ──
          ⚠️ ХООСОН ЗАЙ ХАДГАЛАГДАНА (`h-7` — badge-гүй картад ч).
          Үүнгүй бол L+ карт бусдаасаа 28px өндөр болж, `md:grid-cols-3`
          эгнээнд нэр+үнэ мөр нь хөршүүдтэйгээ ЭГНЭХГҮЙ. */}
      <div className="mb-3 h-7">
        {featured && (
          <span
            className="inline-flex h-7 items-center rounded-full px-3 text-[11px] font-bold tracking-wide text-white uppercase"
            style={{ backgroundColor: ACCENT }}
          >
            {/* `uppercase` нь CSS-ээр — тогтмол нь "Санал болгох" (захиалагчийн
                2026-09-09-ны бичвэр), screenshot дээр ТОМ үсгээр харагдана.
                Ингэснээр хоёр заавар зэрэг биелнэ, мөн screen reader
                хашгирахгүй (CSS transform нь уншилтад нөлөөлөхгүй). */}
            {RECOMMENDED_BADGE}
          </span>
        )}
      </div>

      {/* ── НЭР + ҮНЭ ── */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-foreground text-3xl leading-none font-extrabold tracking-tight">
          {card.title}
        </h3>
        {card.price && (
          <div className="shrink-0 text-right">
            <p className="text-foreground text-2xl leading-none font-extrabold tracking-tight">
              {card.price}
            </p>
            {card.priceNote && (
              <p className="text-muted-foreground mt-1.5 text-[11px] leading-tight">
                {card.priceNote}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── ҮЗҮҮЛЭЛТИЙН БҮЛГҮҮД ──
          `flex-1` — багц бүр өөр тооны бүлэгтэй (M+ нь 3, L+/XL+ нь 4) тул
          зөрүүг энэ шингээж, доод линк бүх картад НЭГ шугамд эгнэнэ. */}
      <div className="mt-6 flex-1 space-y-5">
        {card.groups?.map((group) => (
          <PlanSpecGroup key={group.title} group={group} />
        ))}
      </div>

      {/* ── ДООД ЛИНК — ТӨВД, доогуур зураастай ──
          ⚠️ Дүүрэн товч БИШ (зурагтай картын `bg-foreground` CTA-аас
          өөр): screenshot дээр энэ нь энгийн текст линк. `min-h-11` нь
          хүрэх талбайг 44px болгоно (WCAG 2.5.8). */}
      <div className="border-border mt-6 flex justify-center border-t pt-4">
        <Link
          href={card.href}
          className="text-foreground focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
        >
          {card.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

/** Дүрс + бүлгийн гарчиг, доор нь шошго → утга мөрүүд. */
function PlanSpecGroup({ group }: { group: PlanGroup }) {
  const Icon = PLAN_GROUP_ICONS[group.icon];
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="size-5 shrink-0" style={{ color: ACCENT }} aria-hidden="true" />
        <h4 className="text-foreground text-sm font-bold">{group.title}</h4>
      </div>
      {/* `pl-7` = дүрс (20) + зай (8) — утгын мөрүүд гарчигтайгаа эгнэнэ. */}
      <dl className="mt-1.5 space-y-1 pl-7">
        {group.features.map((feature) => (
          <div key={feature.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{feature.label}</dt>
            <dd className="text-foreground text-right font-semibold">{feature.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PlanPhotoCard({ card }: { card: PlanCardContent }) {
  const plan = card.planId ? mobilePlans.find((p) => p.id === card.planId) : undefined;
  const featured = card.recommended === true;
  const hasImage = Boolean(card.image);
  /**
   * ҮНЭ — ХОЁР ЭХ СУРВАЛЖ, `planId` нь ЭРХ ЧӨЛӨӨТЭЙ:
   *   `planId` бий  → `mobile-plans.ts` (Unitel-ийн мобайл тариф)
   *   эс бөгөөс     → `card.price` (Univision — `plans.ts`-ээс уншсан)
   * Хоёр зэрэг өгвөл `planId` хожино: тэр нь НЭГ эх сурвалжийн зарчмыг
   * (тариф нэг файлд) хамгаална.
   */
  const price = plan?.price ?? card.price;

  return (
    <article
      className={cn(
        // `overflow-hidden` — зураг нь картын дугуй буланг давахгүй.
        // ⚠️ `border-border` нь ОДОО ХОЁУЛАНД — `PlanSpecCard`-тай ижил
        // шалтгаан (inline хүрээний өнгө хасагдсан).
        "bg-card border-border relative flex h-full flex-col overflow-hidden rounded-3xl border p-3 md:p-4",
        // ⚠️⚠️ НОГООН ХҮРЭЭ БҮРМӨСӨН ХАСАГДСАН (2026-09-11, захиалагч: "санал
        // болгох багцын green border-г хас, би тэрийг бас хас гэж хэлж байсан"
        // — хоёр брэндээс).
        //
        // ТҮҮХ — ГУРВАН ШИЙДВЭР, ЭНЭ НЬ ГУРАВДАХЬ:
        //   09-07  захиалагч хасав
        //   09-09  захиалагч Univision-ы L+ дээр "activated мэт ногоон
        //          border-той байна" гэж СЭРГЭЭВ
        //   09-11  захиалагч ДАХИН хасав, энэ удаа ХОЁР БРЭНДЭЭС (тодорхой
        //          баталсан). ⇒ Дахин нэмэх санаа гарвал энэ дарааллыг үз:
        //          "хасагдсаныг мартсан" биш, ГУРВАН УДАА үзэгдсэн асуудал.
        //
        // ⇒ `PlanCardContent.activeBorder` гэсэн брэнд тус бүрийн туг ХЭРЭГГҮЙ
        // болов (09-09-нд хүлээлтэд байсан) — хоёр брэнд одоо ижил.
        //
        // `recommended` нь ОДОО `shadow-lg` ба ★ badge ХОЁРООР дохионо. Тэр
        // хоёр нь ХЭВЭЭР: ногоон хүрээ хасагдсанаар санал болгосон карт
        // ямар ч ялгаагүй болох нь захиалагчийн хүссэн зүйл БИШ.
        featured ? "shadow-lg" : "hover:shadow-md",
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
      {/* `?? []` — `highlights` нь заавал биш болсон (`groups`-тай карт
          түүнийг хэрэглэдэггүй). Хоосон үед `flex-1` нь зайг эзэлсэн
          хэвээр байх тул үнэ/CTA мөр доод ирмэгтээ үлдэнэ. */}
      <ul className="flex-1 space-y-3 px-2 pt-5">
        {(card.highlights ?? []).map((h) => (
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
        {price ? (
          <div className="min-w-0">
            {/* ⚠️ ХОЁР ЭХ СУРВАЛЖ, ХОЁР ТЭМДЭГЛЭЛ:
                `planId` (Unitel, `mobile-plans.ts`) → "Суурь хураамж:"
                `card.price` (Univision, `plans.ts`) → захиалагчийн бичсэн
                  "/ сарын суурь хураамж /НӨАТ-гүй үнэ/" (`priceNote`)
                Тэмдэглэл нь ҮНЭЭС ӨМНӨ эсвэл ХОЙНО байхыг эх сурвалж
                өөрөө шийднэ — Unitel-д дээр (шошго), Univision-д доор
                (тодотгол) байх нь захиалагчийн загварын дагуу. */}
            {!card.priceNote && <p className="text-muted-foreground text-xs">Суурь хураамж:</p>}
            <p className="text-foreground text-xl font-extrabold tracking-tight">{price}</p>
            {card.priceNote && (
              <p className="text-muted-foreground mt-0.5 text-[11px] leading-tight">
                {card.priceNote}
              </p>
            )}
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
