"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";

import { SmartLink } from "@/components/layout/smart-link";
import { promoBanners, type PromoMedia } from "@/data/promo-banner";
import { BRAND } from "@/lib/brand";

// =====================================================================
// Гадны экспорт — нүүр хуудас `PromoBanner` гэж дууддаг.
// Доорх return-н мөрүүдээс нэгийг идэвхтэй үлдээж нөгөөг `//`-аар сольно.
// =====================================================================
export function PromoBanner() {
  return <PromoBannerPlaceholder />; // Танилцуулгын sample — энгийн саарал хоосон banner
  // return <PromoBannerFull />; // Жинхэнэ хувилбар — видео/зураг + eyebrow, гарчиг, CTA
}

// Идэвхгүй хувилбарыг TypeScript "unused" гэж бүү зэмлэ
void PromoBannerFull;

// =====================================================================
// SAMPLE — зөвхөн "Sample banner" гэсэн placeholder + "Sample" CTA.
// Танилцуулгад хуурамч маркетингийн текст анхаарал сарниулахгүйн тулд
// зориуд саарал хоосон талбай болгосон. Өндөр нь жинхэнэ banner-тайгаа
// ижил (34/38svh) тул доорх AI туслахын байрлал өөрчлөгдөхгүй.
//
// ӨНГӨ: `bg-card` = `--background-2` (light #f3f5f7 / dark #1c202d) — дизайн
// системийн саарал гадарга. `bg-muted` (= `--background-3`) хэрэглэхгүй:
// dark theme дээр тэр нь #27203e буюу ЯГААН болж үндсэн өнгөнөөс зөрдөг.
// Contrast: light 6.4:1, dark 3.8:1 — гарчиг нь 24/36px semibold буюу "том
// текст" тул AA-гийн 3:1 шаардлагыг давна.
// =====================================================================
function PromoBannerPlaceholder() {
  return (
    <section aria-label="Sample banner" className="bg-card w-full">
      {/* Өндөр: МОБАЙЛ дээр 52svh (доорх AI туслахаас илүү зай авна),
          sm:-ээс дээш хуучин 34/38svh. PromoBannerFull-тай ижил байлгана. */}
      <div className="mx-auto flex min-h-[52svh] max-w-300 flex-col items-center justify-center gap-6 px-4 py-10 sm:min-h-[34svh] lg:min-h-[38svh] [@media(max-height:720px)]:py-4">
        <span className="text-muted-foreground text-2xl font-semibold md:text-4xl">
          Sample banner
        </span>

        <Link
          href="#"
          className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-opacity duration-700 ease-out hover:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Sample
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
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
function PromoBannerFull() {
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
      className="relative isolate w-full overflow-hidden"
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
      <div className="relative mx-auto flex min-h-[52svh] max-w-300 items-center px-4 py-10 sm:min-h-[34svh] lg:min-h-[38svh] [@media(max-height:720px)]:py-4">
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
