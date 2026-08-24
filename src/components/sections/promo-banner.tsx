"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SmartLink } from "@/components/layout/smart-link";
import {
  promoBanners,
  samplePromoCards,
  type PromoCard,
  type PromoMedia,
} from "@/data/promo-banner";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

// =====================================================================
// Гадны экспорт — нүүр хуудас `PromoBanner` гэж дууддаг.
// Доорх return-н мөрүүдээс нэгийг идэвхтэй үлдээж нөгөөг `//`-аар сольно.
// =====================================================================

/**
 * `fill` — banner нь ЭЦГИЙНХЭЭ өндрийг бүтнээр эзэлнэ (`h-full`), өөрийн
 * `svh`-д суурилсан өндрөө хэрэглэхгүй.
 *
 * ЯАГААД: Unitel-ийн нүүрэнд banner нь hero-гийн ДЭЭД 60%-д суудаг
 * (`UnitelHero`) — тэр өндрийг эцэг нь аль хэдийн тооцсон байдаг. Өөрийн
 * `min-h-[52svh]`-ээ хэвээр барих юм бол хоёр тооцоо зөрж hero нь дэлгэцээс
 * халина. `fill` өгөөгүй үед (Univision нүүр) хуучин зан хэвээр.
 */
export function PromoBanner({ fill = false }: { fill?: boolean }) {
  return <PromoBannerPlaceholder fill={fill} />; // Танилцуулгын sample — энгийн саарал хоосон banner
  // return <PromoBannerFull fill={fill} />; // Жинхэнэ хувилбар — видео/зураг + eyebrow, гарчиг, CTA
}

/** `fill` үед эцгийн өндрийг дүүргэнэ, эс бөгөөс өөрийн svh өндөр. */
const bannerBox = (fill: boolean) =>
  fill
    ? "h-full"
    : "min-h-[52svh] sm:min-h-[34svh] lg:min-h-[38svh] py-10 [@media(max-height:720px)]:py-4";

// Идэвхгүй хувилбарыг TypeScript "unused" гэж бүү зэмлэ
void PromoBannerFull;

// =====================================================================
// SAMPLE — 3 САНАЛТАЙ CAROUSEL, site-ийн ерөнхий өргөнд (1200px) багтсан.
//
// Танилцуулгад хуурамч маркетингийн текст анхаарал сарниулахгүйн тулд
// зориуд шошготой хоосон талбай болгосон (`samplePromoCards`).
//
// ⚠️ 3 санал нь ЗЭРЭГЦЭЭ БИШ — нэг зэрэг НЭГ л харагдана, баруун доод
// булангийн сум/тоолуураар солигдоно. Тиймээс panel нь эцгээсээ (hero-гийн
// 60%) авсан БҮТЭН өндрийг эзэлнэ: слайд бүр тэр талбайг дүүргэнэ.
//
// ӨРГӨН нь full-bleed БИШ, `max-w-300` (1200px) — бусад section болон доорх
// багцын мөртэй босоо тэнхлэгээр тэгширнэ.
// =====================================================================
function PromoBannerPlaceholder({ fill }: { fill: boolean }) {
  const [api, setApi] = useState<CarouselApi>();
  /**
   * Одоогийн слайд (1-ээс эхэлнэ). Effect дотор setState СИНХРОНООР
   * дуудахгүй (`react-hooks/set-state-in-effect`) — carousel үргэлж 0-р
   * слайдаас эхэлдэг тул анхны утга нь аль хэдийн зөв.
   */
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section
      aria-label="Онцлох урамшуулал"
      className={cn("w-full", fill ? "flex h-full items-stretch" : "py-8")}
    >
      {/* FULL WIDTH — `max-w-300` (1200px) хязгаарыг ЗОРИУДААР ЦУЦАЛСАН.
          Promo нь дэлгэцийн бүтэн өргөнийг эзэлнэ; идэвхтэй panel нь
          peek-ийн хэмжээгээр л дотогшоо суух тул хоёр ирмэг дээр өмнөх/
          дараагийн banner харагдана.
          ⚠️ Доорх багцын хэсэг (`RecommendedPlans`) нь 1200px-дээ ХЭВЭЭР —
          зөвхөн promo нь full-bleed. */}
      <div className="flex w-full">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "center" }}
          // `data-slot=carousel-content` нь `CarouselContent`-ийн ГАДНА
          // (`ref`-тэй) div — тэр нь className хүлээж авдаггүй тул өндрийг
          // эндээс дамжуулна. Үүнгүйгээр panel нь эцгийн 60%-ыг дүүргэхгүй.
          className="w-full [&_[data-slot=carousel-content]]:h-full"
        >
          {/* PEEK — слайд бүр контейнерийн БҮТЭН өргөнийг эзлэхгүй
              (`basis` < 100%) тул хажуугийн хоёр слайдын ирмэг харагдана.
              `-ml-4`/`pl-4` (shadcn-ийн анхдагч завсар) нь харагдаж буй
              ирмэгүүдийг идэвхтэй panel-аас зааглана.

              DESKTOP (md+) — 62.5% нь Jio-гийн нүүрнээс ХЭМЖСЭН харьцаа:
              1919px дэлгэцэнд идэвхтэй banner ~1183px (≈62%), хоёр талын
              ирмэг тус бүр ~350px (≈18%). Ирмэг нь "бас banner байна" гэдгийг
              хангалттай тод хэлнэ.

              МОБАЙЛ — 82% хэвээр. Jio-гийн 62.5%-ийг 375px дэлгэцэнд тавибал
              идэвхтэй banner 234px болж уншигдахгүй; тэнд ирмэг 26px нь
              хангалттай дохио өгнө. Завсар ч 8px (md+ дээр 16px). */}
          <CarouselContent className="-ml-2 h-full md:-ml-4">
            {samplePromoCards.map((promo) => (
              <CarouselItem
                key={promo.id}
                className="h-full basis-[82%] pl-2 md:basis-[62.5%] md:pl-4"
              >
                <PromoSlide promo={promo} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselCounter
            current={current}
            total={samplePromoCards.length}
            onPrev={() => api?.scrollPrev()}
            onNext={() => api?.scrollNext()}
          />
        </Carousel>
      </div>
    </section>
  );
}

/**
 * Нэг слайд — panel-ийн бүтэн талбайг эзэлнэ.
 *
 * ӨНГӨ: `bg-card` (= `--background-2`) — `bg-muted` нь dark theme-д ягаан
 * (#27203e) болж үндсэн өнгөнөөс зөрдөг.
 */
function PromoSlide({ promo }: { promo: PromoCard }) {
  return (
    <div className="bg-card flex h-full flex-col items-center justify-center gap-[clamp(0.75rem,2svh,1.5rem)] rounded-3xl">
      {/* МОБАЙЛД ЖИЖИГ — 306px өргөнтэй картан дээр 3.4svh (≈28px) нь хэтэрхий
          том байв. `sm:`-ээс дээш хуучин хэмжээ хэвээр. */}
      <span className="text-muted-foreground text-[clamp(0.875rem,2.2svh,1.125rem)] font-semibold sm:text-[clamp(1.125rem,3.4svh,2.25rem)]">
        {promo.placeholderText}
      </span>

      <Link
        href={promo.href}
        className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-[clamp(2.25rem,5svh,3rem)] items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-opacity duration-700 ease-out hover:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {promo.ctaLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/**
 * Carousel-ийн удирдлага — БАРУУН ДООД буланд нэг pill дотор `←  n/N  →`.
 *
 * shadcn-ийн `CarouselPrevious`/`CarouselNext`-ийг ХЭРЭГЛЭХГҮЙ: тэдгээр нь
 * panel-ийн ГАДНА, хоёр хажуугаар нь хөвдөг дугуй товчнууд бөгөөд энд
 * 1200px-ийн хүрээнээс халина. Мөн тоолуур (`n/N`) байхгүй.
 *
 * `loop: true` тул хоёр товч ҮРГЭЛЖ идэвхтэй — `canScrollPrev/Next`
 * шалгах шаардлагагүй.
 *
 * ХҮРЭХ ТАЛБАЙ: мобайлд `size-11` (44px) — хуруунд зориулсан доод хэмжээ
 * (`sm:size-8` = 32px нь зөвхөн хулгана/trackpad-тай өргөн дэлгэцэнд).
 */
function CarouselCounter({
  current,
  total,
  onPrev,
  onNext,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    // `right` — контейнерийн ирмэг БИШ, идэвхтэй panel-ийн ирмэгээс тооцов:
    // peek нь (100% − basis) / 2 тул мобайлд 9%, md+ дээр 18.75% дотогш.
    <div className="bg-background/90 border-border absolute right-[calc(9%+0.75rem)] bottom-4 inline-flex items-center gap-1 rounded-full border p-1 shadow-md backdrop-blur sm:bottom-6 md:right-[calc(18.75%+1.5rem)]">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Өмнөх урамшуулал"
        className="hover:bg-muted focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none sm:size-8"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
      </button>

      {/* `aria-live` — сумаар гүйлгэхэд дэлгэц уншигчид байрлал сонсогдоно.
          `tabular-nums` — 1/3 → 2/3 солигдоход өргөн үсрэхгүй. */}
      <span aria-live="polite" className="text-foreground px-1 text-xs font-semibold tabular-nums">
        {current}/{total}
      </span>

      <button
        type="button"
        onClick={onNext}
        aria-label="Дараагийн урамшуулал"
        className="hover:bg-muted focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none sm:size-8"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Нүүрний PROMO BANNER — chat-hero-гийн ДЭЭР суух зурвас.
 *
 * Медиа нь видео / зураг / gradient — `promo-banner.ts`-ээс сонгогдоно. Видео
 * бэлэн болоход зөвхөн тэр data-г солино, энэ компонент хөндөгдөхгүй.
 *
 * ─── WCAG 2.1 AA ──────────────────────────────────────────────────────
 * 2.2.2 Pause, Stop, Hide (A) — 5 сек-с урт автомат хөдөлгөөнд зогсоох
 *   боломж ЗААВАЛ байна. Тиймээс видео үед ХАРАГДАХ pause/play товч гарна
 *   (hover-д нуугдахгүй), keyboard-аар хүрнэ, focus ring-тэй (2.1.1, 2.4.7).
 * 1.4.2 Audio Control (A) — видеонд аудио track БАЙХГҮЙ (ffmpeg -an) тул
 *   автоматаар хангагдана.
 * 1.4.3 Contrast (AA) — цулгуй өнгөт дэвсгэр дээр өнгө өөрөө 9.7:1 өгдөг тул
 *   scrim БАЙХГҮЙ. Видео/зураг тавихад scrim автоматаар эргэж ирнэ
 *   (`needsScrim`). ЧУХАЛ: бодит видео тавихдаа харьцааг видеоны ХАМГИЙН
 *   ЦАЙВАР frame-тэй тулгаж хэмжинэ (дундажаар биш). Хүрэлцэхгүй бол
 *   scrim-ийн alpha-г нэмнэ.
 * 1.1.1 Non-text Content (A) — `decorative: true` үед `aria-hidden`, бүх
 *   мэдээлэл доорх текстэд байна.
 *
 * prefers-reduced-motion: globals.css-ийн дүрэм нь `animation`/`transition`-ыг
 *   л тэглэдэг, `<video>`-г ЗОГСООХГҮЙ. Тиймээс `autoPlay` атрибут ХЭРЭГЛЭХГҮЙ
 *   — JS-ээр matchMedia шалгаж, зөвшөөрөгдсөн үед л `play()` дуудна.
 * ──────────────────────────────────────────────────────────────────────
 */
function PromoBannerFull({ fill }: { fill: boolean }) {
  const content = promoBanners[BRAND];
  const isVideo = content.media.kind === "video";
  // Scrim нь зөвхөн ЖИНХЭНЭ медиа (видео/зураг) дээр хэрэгтэй — тэдгээрийн
  // тод frame дээр цагаан текст уншигдахгүй болох эрсдэлтэй. Цулгуй өнгөт
  // дэвсгэр өөрөө хангалттай contrast-тай тул scrim нэмбэл зүгээр л бохирдоно.
  const needsScrim = content.media.kind !== "gradient";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Эхний төлөв нь ЗОГССОН — poster харагдана. Autoplay зөвшөөрөгдвөл л
  // доорх effect үүнийг false болгоно.
  const [paused, setPaused] = useState(true);

  // Autoplay-г ЗӨВХӨН reduced-motion унтраалттай үед эхлүүлнэ
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Хөдөлгөөн хүсээгүй — эхний `paused: true` төлөв хэвээр, poster үлдэнэ
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.play().then(
      () => setPaused(false),
      // Browser autoplay-г блоклов — poster + play товч харагдана
      () => setPaused(true),
    );
  }, []);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(
        () => setPaused(false),
        () => setPaused(true),
      );
    } else {
      el.pause();
      setPaused(true);
    }
  };

  return (
    <section
      aria-labelledby="promo-banner-title"
      className={cn("relative isolate w-full overflow-hidden", fill && "h-full")}
    >
      {/* ============ МЕДИА ============ */}
      <PromoMediaLayer media={content.media} decorative={content.decorative} videoRef={videoRef} />

      {/* Scrim — текстийг уншигдахуйц болгоно (1.4.3). Зүүн тал хамгийн бараан. */}
      {needsScrim && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25"
        />
      )}

      {/* ============ КОНТЕНТ ============
          ӨНДРИЙГ ХЭМНЭНЭ: promo banner + доорх AI туслах ХОЁУЛАА нүүрний
          ПЕРВЫЙ дэлгэцэнд багтах ёстой. Тиймээс өндөр нь px биш `svh`-д
          тулгуурлана (`svh` = URL bar хураагдахаас үл хамаарсан жижиг
          viewport; `vh` бол мобайлд бодит харагдахаас өндөр гардаг).
          Banner нь анхаарал татах хэмжээгээ хадгална — 34/38svh нь ~1/3
          дэлгэц. Хэрэв текст түүнээс өндөр бол агуулга давамгайлна. */}
      <div className={cn("relative mx-auto flex max-w-300 items-center px-4", bannerBox(fill))}>
        <div className="max-w-xl">
          <p className="text-xs font-bold tracking-[0.18em] text-white/80 uppercase">
            {content.eyebrow}
          </p>

          <h2
            id="promo-banner-title"
            className="mt-4 text-3xl font-extrabold tracking-tight text-balance text-white md:text-5xl"
          >
            {content.title}
          </h2>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
            {content.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SmartLink
              href={content.cta.href}
              owner={content.cta.owner}
              className="bg-primary text-primary-foreground focus-visible:ring-offset-background inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-opacity duration-700 ease-out hover:opacity-85 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {content.cta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </SmartLink>

            {content.secondaryCta && (
              <SmartLink
                href={content.secondaryCta.href}
                owner={content.secondaryCta.owner}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
              >
                {content.secondaryCta.label}
              </SmartLink>
            )}
          </div>
        </div>
      </div>

      {/* ============ PAUSE / PLAY — WCAG 2.2.2 (заавал) ============ */}
      {isVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          aria-label={paused ? "Видеог тоглуулах" : "Видеог зогсоох"}
          className="absolute right-4 bottom-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
        >
          {paused ? (
            <Play className="size-4" aria-hidden="true" />
          ) : (
            <Pause className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </section>
  );
}

// =====================================================================
// МЕДИА ДАВХАРГА — төрөл нэмэх = нэг case нэмэх
// =====================================================================
function PromoMediaLayer({
  media,
  decorative,
  videoRef,
}: {
  media: PromoMedia;
  decorative: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  if (media.kind === "video") {
    return (
      <video
        ref={videoRef}
        poster={media.poster}
        muted
        loop
        // iOS-д autoplay ажиллуулахад muted + playsInline ЗААВАЛ
        playsInline
        // "auto" тавьбал LCP-тэй тэмцэлдэнэ
        preload="metadata"
        aria-hidden={decorative ? "true" : undefined}
        tabIndex={-1}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        {media.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} media={source.media} />
        ))}
      </video>
    );
  }

  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={decorative ? "" : media.alt}
        fill
        // Хамгийн дээд section тул LCP элемент байх магадлалтай
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
    );
  }

  // gradient — медиа файлгүй ажиллах суурь хувилбар.
  // ЦУЛГУЙ НЭГ ӨНГӨ: өмнө нь ногоон→turquoise→цэнхэр gradient дээр хоёр blur
  // толбо нэмээд, дээрээс нь бараан scrim тавьдаг байсан — гурван давхарга
  // хоорондоо уусаж бохир харагддаг байсан тул бүгдийг хассан.
  //
  // #0d4f26 — брэндийн ногооны гүн сүүдэр. Цагаан текстэд 9.7:1 (WCAG AA
  // 4.5:1, AAA 7:1 хоёуланг давна) тул тусдаа scrim шаардлагагүй. Хоёр theme
  // дээр ижил — банер дээрх текст үргэлж цагаан тул өнгө нь солигдох ёсгүй.
  return <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0d4f26]" />;
}
