"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play, ArrowRight, Lock } from "lucide-react";

import { apps, movies, featuredSection, type MarqueeItem } from "@/data/marquee-items";
import { cn } from "@/lib/utils";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";

const AUTOPLAY_INTERVAL = 5000;
const REPEAT_COUNT = 3;

/**
 * md breakpoint (768px) дээш эсэхийг хянана — carousel-ын картын өргөнийг
 * утас/desktop-д тус тусад нь тохируулахад ашиглана.
 */
function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMdUp(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMdUp;
}

// =====================================================================
// MAIN SECTION
// =====================================================================
export function FeaturedMarquee() {
  const [appIndex, setAppIndex] = useState(apps.length);
  const [movieIndex, setMovieIndex] = useState(movies.length);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressKey, setProgressKey] = useState(0);

  // Pause/Resume remaining-time logic-д ашиглах ref-үүд
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(AUTOPLAY_INTERVAL);

  // 1 алхам урагшилуулах функц
  const advance = useCallback(() => {
    setAppIndex((prev) => prev + 1);
    setMovieIndex((prev) => prev + 1);
    setProgressKey((k) => k + 1);
    remainingRef.current = AUTOPLAY_INTERVAL;
  }, []);

  // scheduleNext recursive-аар өөрийгөө дуудах ёстой тул ref-ээр хадгална.
  // `useCallback` deps-д өөрийгөө хийж болохгүй учир ref pattern ашиглав.
  const scheduleNextRef = useRef<(delay: number) => void>(() => {});

  const scheduleNext = useCallback(
    (delay: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      startTimeRef.current = Date.now(); // ✅ render-ийн гадна (useCallback дотор)
      timerRef.current = setTimeout(() => {
        advance();
        // Дараагийн cycle-г өөрсдөө 5s бүтнээр нь scheduleл
        scheduleNextRef.current(AUTOPLAY_INTERVAL);
      }, delay);
    },
    [advance],
  );

  // Ref-ийг хамгийн сүүлийн scheduleNext-ээр шинэчилнэ
  useEffect(() => {
    scheduleNextRef.current = scheduleNext;
  }, [scheduleNext]);

  // Pause/Resume effect
  useEffect(() => {
    if (isPlaying) {
      // Resume — үлдсэн хугацаагаар үргэлжлүүлэх
      scheduleNext(remainingRef.current);
    } else {
      // Pause — timer цуцлах, үлдсэн хугацааг хадгалах
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // startTimeRef === 0 байх юм бол elapsed тооцохгүй (анхны pause-аас өмнө)
      if (startTimeRef.current > 0) {
        const elapsed = Date.now() - startTimeRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, scheduleNext]);

  const activeDotIndex = appIndex % apps.length;

  return (
    <section
      aria-labelledby="featured-title"
      className={cn(sectionBg.page, "overflow-hidden py-6 lg:py-7")}
    >
      <div className="container mx-auto px-4">
        {/* ⚠️ Өмнө нь `eyebrow` (дээр) ба `description` (доор) хоёр
            comment-д орсон мөр байсныг ХАСАВ — тэдгээр талбарууд
            `marquee-items.ts`-ээс гарсан тул зөвхөн эргэлзээ төрүүлнэ.
            Хэрэгтэй бол git түүхээс. */}
        <div className="mb-8 text-center">
          <h2 id="featured-title" className={sectionType.title}>
            {featuredSection.title}
          </h2>
        </div>

        <Carousel
          items={apps}
          activeIndex={appIndex}
          setActiveIndex={setAppIndex}
          variant="large"
          ariaLabel="Featured apps"
        />

        <div className="mt-6">
          <Carousel
            items={movies}
            activeIndex={movieIndex}
            setActiveIndex={setMovieIndex}
            variant="small"
            ariaLabel="Featured movies"
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <ProgressDots
            count={apps.length}
            activeIndex={activeDotIndex}
            isPlaying={isPlaying}
            durationMs={AUTOPLAY_INTERVAL}
            progressKey={progressKey}
          />

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="bg-muted hover:bg-muted/80 focus-visible:ring-ring flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={isPlaying ? "Auto-play зогсоох" : "Auto-play эхлүүлэх"}
          >
            {isPlaying ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// CAROUSEL — Infinity loop pattern (Apps large / Movies small)
// =====================================================================
function Carousel({
  items,
  activeIndex,
  setActiveIndex,
  variant,
  ariaLabel,
}: {
  items: MarqueeItem[];
  activeIndex: number;
  setActiveIndex: (idx: number | ((prev: number) => number)) => void;
  variant: "large" | "small";
  ariaLabel: string;
}) {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMdUp = useIsMdUp();

  const repeatedItems = Array.from({ length: REPEAT_COUNT }, () => items).flat();

  // Утсан дээр картууд илүү өргөн — нарийн өндөр харагдахаас сэргийлнэ
  const itemWidthVW = variant === "large" ? (isMdUp ? 60 : 85) : isMdUp ? 10 : 26;
  const gapVW = isMdUp ? 1.5 : 2.5;

  const translateX = `calc(50% - ${activeIndex * (itemWidthVW + gapVW)}vw - ${itemWidthVW / 2}vw)`;

  // Эцсийн copy-ийн төгсгөлд хүрсэн үед — silent jump хийх
  useEffect(() => {
    if (activeIndex < items.length * 2) return;

    const handleTransitionEnd = () => {
      // 1. Animation off
      setIsTransitioning(false);
      // 2. Active index-ыг middle copy руу буцаах
      setActiveIndex((prev) => prev - items.length);
      // 3. DOM update-ийг хүлээж байгаад animation дахин on болгох
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
    };

    const track = trackRef.current;
    track?.addEventListener("transitionend", handleTransitionEnd, {
      once: true,
    });
    return () => {
      track?.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [activeIndex, items.length, setActiveIndex]);

  return (
    <div role="region" aria-label={ariaLabel} aria-live="polite" className="relative w-full">
      <div
        ref={trackRef}
        className="flex"
        style={{
          transform: `translateX(${translateX})`,
          gap: `${gapVW}vw`,
          transition: isTransitioning ? "transform 700ms ease-in-out" : "none",
        }}
      >
        {repeatedItems.map((item, index) => (
          <CarouselCard
            key={`${item.id}-${index}`}
            item={item}
            isActive={index === activeIndex}
            variant={variant}
            widthVW={itemWidthVW}
          />
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// CAROUSEL CARD
// =====================================================================
function CarouselCard({
  item,
  isActive,
  variant,
  widthVW,
}: {
  item: MarqueeItem;
  isActive: boolean;
  variant: "large" | "small";
  widthVW: number;
}) {
  const shadeClass = {
    light: "bg-gray-200 text-gray-800",
    medium: "bg-gray-400 text-gray-900",
    dark: "bg-gray-700 text-white",
  }[item.shade];

  // Large (apps) + Small (movies) — хоёулаа нэг дэлгэцэнд багтах өндөртэй
  const shapeClass = variant === "large" ? "h-[38vh] min-h-[300px] md:h-[50vh]" : "aspect-[2/3]";
  const titleClass =
    variant === "large" ? "text-xl sm:text-2xl md:text-5xl" : "text-sm md:text-base";

  return (
    // Card бүхэлдээ даргддаг link — доторх CTA нь зөвхөн харагдац (span)
    <Link
      href={item.href}
      aria-label={`${item.name} — дэлгэрэнгүй үзэх`}
      tabIndex={isActive ? 0 : -1}
      className={`relative block shrink-0 cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ${shapeClass} ${shadeClass} ${
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-50"
      }`}
      style={{ width: `${widthVW}vw` }}
      aria-current={isActive ? "true" : undefined}
    >
      {/* Бодит зураг — байгаа үед. Үгүй бол shade + нэрийн placeholder */}
      {item.image ? (
        <Image
          src={item.image}
          /**
           * ⚠️ ХЯЗГААРЛАСАН КАРТАД `alt=""`. Зураг нь бүрхэгдсэн (blur)
           * УТГА нь харагдахгүй болсон тул харааны хэрэглэгчид түүнээс юу ч
           * авахгүй; screen reader-т агуулгыг нэрлэвэл ХАРАХГҮЙ хүнд
           * ХАРАГДАХ хүнээс ИЛҮҮ мэдээлэл өгөх ба бүрхсэн шалтгаан нь
           * үгүйсгэгдэнэ. Анхааруулгын бичвэр доор ил байгаа тул мэдээлэл
           * алдагдахгүй (WCAG 1.1.1 — чимэглэлийн зураг).
           */
          alt={item.restricted ? "" : item.name}
          fill
          sizes={
            variant === "large" ? "(min-width: 768px) 60vw, 85vw" : "(min-width: 768px) 10vw, 26vw"
          }
          /**
           * ⚠️ `blur-2xl` + `scale-110` (2026-09-09, захиалагчийн заавар:
           * "4-ләнг нь харуулах гэхдээ blur хийгдсэн, насанд хүрэгчдийн
           * контент гэсэн анхааруулгатайгаар л харуул").
           *
           * `scale-110` нь ЗАЙЛШГҮЙ: CSS `blur` нь элементийн ирмэгийн
           * пикселийг гадагш "тарааж" уусгадаг тул ирмэг дагуу тунгалаг
           * зурвас гарч, доорх `shade` дэвсгэр цухуйна. 10% томсгосноор
           * бүрхэг ирмэг картын гадна гарч, `overflow-hidden` тайрна.
           */
          className={cn("object-cover", item.restricted && "scale-110 blur-2xl")}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span
            className={`font-bold opacity-30 ${
              variant === "large" ? "text-6xl md:text-8xl" : "text-2xl md:text-4xl"
            }`}
          >
            {item.photoLabel}
          </span>
        </div>
      )}

      {/* Доороос дээш бараан gradient — текст уншигдахуйц болгох */}
      {item.image && (
        <div
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
          aria-hidden="true"
        />
      )}

      {/**
       * НАСАНД ХҮРЭГЧДИЙН КОНТЕНТЫН АНХААРУУЛГА (2026-09-09, захиалагч).
       *
       * ⚠️ Blur ДЭЭР БИЧВЭР. Зөвхөн бүрхэх нь хангалтгүй: хэрэглэгч зургийг
       * "ачаалагдаагүй" эсвэл "эвдэрсэн" гэж уншиж, дарж шалгах магадлалтай.
       * Ил бичвэр нь ЯАГААД бүрхэгдснийг хэлж, дарахаасаа өмнө сонголт
       * өгнө — контентын анхааруулгын үндсэн зарчим.
       *
       * ⚠️ `variant` ЯЛГААГҮЙ: жижиг картад ч ижил хамгаалалт хэрэгтэй
       * (одоогоор `restricted` нь зөвхөн ТВ апп-д тавигдсан, гэхдээ кинонд
       * гарвал автоматаар ажиллана).
       *
       * `pointer-events-none` — эцэг `Link`-ийн даралтыг хаахгүй.
       * `aria-hidden` ТАВИАГҮЙ: screen reader-т хязгаарлалтыг хэлэх ёстой,
       * зурганд `alt=""` тавьсны нөхөн мэдээлэл нь ЯГ энэ бичвэр.
       */}
      {item.restricted && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col items-center gap-2 px-4 text-center text-white",
            /**
             * ⚠️ ТОМ КАРТАД ДЭЭД тал, ЖИЖИГ картад ГОЛ. Том картын доод
             * 1/3-д гарчиг + тайлбар + CTA аль хэдийн суудаг (`bottom-6`,
             * ~150px). Хамгийн намхан үед (`min-h-[300px]`) голлуулсан
             * анхааруулга тэр блоктой ДАВХЦАНА — тиймээс дээш зөөв.
             * Жижиг картад доод бичвэр нь ердөө нэг мөр (`bottom-3`) тул
             * гол нь чөлөөтэй.
             */
            variant === "large" ? "justify-start pt-8 md:pt-12" : "justify-center",
          )}
        >
          <Lock className={variant === "large" ? "size-8" : "size-5"} aria-hidden="true" />
          <p
            className={cn(
              "font-semibold",
              variant === "large" ? "text-base md:text-lg" : "text-xs",
            )}
          >
            Насанд хүрэгчдийн контент
          </p>
          <span
            className={cn(
              "rounded-full border border-white/60 font-bold",
              variant === "large" ? "px-3 py-0.5 text-sm" : "px-2 text-[10px]",
            )}
          >
            18+
          </span>
        </div>
      )}

      {variant === "large" && (
        <div
          className={`absolute right-6 bottom-6 left-6 md:right-8 md:bottom-8 md:left-8 ${
            item.image ? "text-white" : ""
          }`}
        >
          <h3 className={`font-bold tracking-tight ${titleClass}`}>{item.name}</h3>
          <p className="mt-1.5 max-w-2xl text-sm opacity-90 md:mt-2 md:text-lg">
            {item.description}
          </p>
          {/* Товчны харагдацтай span — navigation-ыг гадна талын Link хариуцна */}
          <span className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105 md:text-base">
            {featuredSection.ctaLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      )}

      {/* Кино нэр — утсан дээр poster жижиг тул нуугдана, md+-д харагдана */}
      {variant === "small" && (
        <div
          className={`absolute right-4 bottom-3 left-4 hidden md:block ${item.image ? "text-white" : ""}`}
        >
          <h3 className={`font-semibold ${titleClass}`}>{item.name}</h3>
        </div>
      )}
    </Link>
  );
}

// =====================================================================
// PROGRESS DOTS — Apple-style segmented indicator
// =====================================================================
function ProgressDots({
  count,
  activeIndex,
  isPlaying,
  durationMs,
  progressKey,
}: {
  count: number;
  activeIndex: number;
  isPlaying: boolean;
  durationMs: number;
  progressKey: number;
}) {
  return (
    <div role="tablist" aria-label="Slide progress" className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={`Slide ${i + 1} of ${count}`}
            className={`bg-muted-foreground/30 relative h-2 overflow-hidden rounded-full transition-all duration-500 ${
              isActive ? "w-8" : "w-2"
            }`}
          >
            {isActive && (
              <div
                key={`fill-${progressKey}`}
                className="bg-foreground h-full rounded-full"
                style={{
                  animation: `progress-fill ${durationMs}ms linear forwards`,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
