"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * MagicUI — Sparkles Text (https://magicui.design/docs/components/sparkles-text)
 *
 * Бичвэрийн эргэн тойронд санамсаргүй байрлалд оч (од) гарч, анивчиж, дахин
 * шинэ байранд төрнө. 2026-09-10-нд `MorphingText`-ийг ОРЛОВ (захиалагч:
 * "morph нь хэтэрхий common effect байна … MagicUI-ийн энэ component-оор
 * хийе").
 *
 * ⚠️⚠️ `motion` САН СУУЛГААГҮЙ — АНИМАЦИ CSS-ЭЭР. Эх файл нь
 * `motion/react`-ийн `<motion.svg>`-г ашигладаг ба тэр нь ~60KB (gz) шинэ
 * хамаарал. Массив бүхий `animate` (`[0,1,0]`) нь 0%/50%/100% keyframe-тэй
 * ЯГ ижил тул `globals.css > @keyframes sparkle-pop` нь ижил хөдөлгөөнийг
 * хамааралгүйгээр өгнө. Хугацаа (0.8s), эргэлт (75→120→150°), давталт,
 * санамсаргүй хоцролт/хэмжээ — БҮГД эх хувилбарын утгаараа.
 *
 * ⚠️ ЭХ ХУВИЛБАРААС ГУРАВ ЗӨРНӨ, гурвуул ХЭРЭГЦЭЭНЭЭС:
 *
 *   1. `<div className="text-6xl font-bold">` → `<span>`, ХЭМЖЭЭГҮЙ.
 *      Эх нь ДЭМО-гийн том гарчигт зориулагдсан. Энэ проектод компонент нь
 *      15px цэсний шошгонд, `<a>`/`<button>` ДОТОР суух тул блок элемент ч,
 *      албадсан хэмжээ/жин ч болохгүй. Типографыг ДУУДАГЧ өгнө.
 *
 *   2. `<strong>` ХАСАГДСАН. Тэр нь цэсний линкийн үгэнд "онцгой ач
 *      холбогдол" гэсэн СЕМАНТИК өгөх ба жинг нь дур мэдэн бүдүүн болгоно.
 *
 *   3. REDUCED MOTION хамгаалалт НЭМЭГДСЭН. Эх хувилбарт БАЙХГҮЙ. Хэрэглэгч
 *      хөдөлгөөн багасгахыг сонгосон бол оч ОГТ үүсэхгүй (JS тал) — CSS-д ч
 *      хоёр дахь хаалт бий.
 */

type Sparkle = {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  /** Хэдэн секунд амьдраад шинэ байранд ДАХИН төрөх вэ (эх хувилбартай ижил) */
  lifespan: number;
};

/**
 * Очны SVG — MagicUI-ийн зам ҮСЭГ ҮСГЭЭРЭЭ хуулагдсан (дөрвөн салаа од).
 *
 * ⚠️ `data-sparkle` нь ЧИМЭГЛЭЛ БИШ: `globals.css`-ийн reduced-motion дүрэм
 * үүгээр сонгодог. Класс нэрээр сонгуулбал Tailwind-ийн класс өөрчлөгдөхөд
 * тэр хамгаалалт чимээгүй тасарна.
 */
function SparkleStar({
  x,
  y,
  color,
  delay,
  scale,
  size,
}: Omit<Sparkle, "id" | "lifespan"> & { size: string }) {
  return (
    <svg
      data-sparkle
      aria-hidden="true"
      className="pointer-events-none absolute z-20"
      viewBox="0 0 21 21"
      style={
        {
          left: x,
          top: y,
          /**
           * ⚠️⚠️ ОЧ НЬ ЦЭГЭН ДЭЭРЭЭ ГОЛЛОНО — сөрөг хүрээгээр (2026-09-10,
           * захиалагч: "sparkling effect нь text дээрээ голлож харагдахгүй
           * байна").
           *
           * `position:absolute` дээр `left/top` нь элементийн ЗҮҮН ДЭЭД
           * БУЛАНГ байрлуулдаг. Тиймээс `left:100%` дээрх од БҮХЭЛДЭЭ
           * хайрцгийн ГАДНА, баруун тийш гардаг; дунджаар оч бүр өөрийн
           * хагас хэмжээгээр (≈5.5px) БАРУУН ДООШ шилжинэ. Үр дүнд бүх
           * бүлэг үгнээс доогуур бөөгнөрч, "дээрээ" биш "доор нь" харагдана
           * (MagicUI-ийн эх хувилбарт ч ийм — гэхдээ `text-6xl` дээр 21px
           * од нь харьцангуй жижиг тул мэдэгддэггүй).
           *
           * ⚠️ `translate(-50%,-50%)` ХЭРЭГЛЭЖ БОЛОХГҮЙ: `transform`-ыг
           * `@keyframes sparkle-pop` (scale + rotate) АЛЬ ХЭДИЙН эзэмшсэн
           * тул дарж бичих ба анимаци эвдэрнэ. Сөрөг хүрээ нь `transform`-д
           * ОГТ хүрэхгүйгээр ижил үр дүн өгнө.
           */
          marginLeft: `calc(${size} / -2)`,
          marginTop: `calc(${size} / -2)`,
          // ⚠️ `width`/`height` нь ATTRIBUTE биш STYLE-ээр — `em` утга
          // хэрэглэхийн тулд (attribute нь зөвхөн px/тоо авна).
          width: size,
          height: size,
          "--sparkle-scale": scale,
          animation: "sparkle-pop 0.8s linear infinite",
          animationDelay: `${delay}s`,
        } as CSSProperties
      }
    >
      <path
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
        fill={color}
      />
    </svg>
  );
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

/**
 * ⚠️ `useSyncExternalStore` — `morphing-text.tsx`-тэй ИЖИЛ зарчим.
 * `useState` + effect нь `react-hooks/set-state-in-effect`-д унана, рендерийн
 * үед `matchMedia` дуудвал `react-hooks/purity`-д. SSR-д `false` буцаана.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = { first: "#9E7AFF", second: "#FE8BBB" },
  starSize = "0.7em",
}: {
  children: React.ReactNode;
  className?: string;
  /** Нэг зэрэг харагдах очны тоо. Эх хувилбарын анхдагч 10. */
  sparklesCount?: number;
  /** Хоёр өнгийг санамсаргүй сонгоно. Эх хувилбарын анхдагч ягаан/нил. */
  colors?: { first: string; second: string };
  /**
   * Очны СУУРЬ хэмжээ (CSS урт).
   *
   * ⚠️ ЭХ ХУВИЛБАРТ БАЙХГҮЙ ТАЛБАР, ЗАЙЛШГҮЙ НЭМЭГДСЭН. MagicUI нь 21px гэж
   * ХАТУУ бичдэг ба тэр нь `text-6xl` (60px) дэмод жижиг цэг мэт харагддаг.
   * Энэ проектод компонент нь 15px цэсний шошгонд суух тул 21px од нь
   * ҮСГЭЭСЭЭ ТОМ болж, үгийг халхалдаг (2026-09-10-нд хөтөч дээр харсан).
   *
   * `em` анхдагч тул од нь ФОНТЫГ дагана: 15px үсэгт 10.5px, дараа нь
   * санамсаргүй `scale` (0.3–1.3) үржигдэж 3–14px болно.
   */
  starSize?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const { first, second } = colors;

  useEffect(() => {
    /**
     * Хөдөлгөөн багасгах горим — интервал ч асахгүй, оч ч үүсгэхгүй.
     *
     * ⚠️ ЭНД `setSparkles([])` ДУУДАХГҮЙ: `react-hooks/set-state-in-effect`
     * нь effect-ийн биед синхроноор setState дуудахыг хориглодог (шаталсан
     * дахин рендер). Оронд нь РЕНДЕРТ шүүнэ (`reduced && …`) — төлөвийг
     * цэвэрлэх шаардлагагүй, учир нь харагдахгүй байхад л хангалттай.
     */
    if (reduced) return;

    let seq = 0;
    const generate = (): Sparkle => {
      seq += 1;
      return {
        // ⚠️ Эх хувилбар `Date.now()`-оор id хийдэг — нэг миллисекундэд
        // 10 оч төрөхөд id ДАВХАРДАЖ React-ийн key анхааруулга өгнө.
        // Дугаарлагч нэмж давхардлыг таслав.
        id: `s${seq}`,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: Math.random() > 0.5 ? first : second,
        delay: Math.random() * 2,
        scale: Math.random() * 1 + 0.3,
        lifespan: Math.random() * 10 + 5,
      };
    };

    /**
     * Амьдралын хугацаа — 100ms тутам 0.1 хасагдана (=секундэд 1). Дуусмагц
     * тэр оч ШИНЭ байранд, шинэ өнгө/хэмжээтэй дахин төрнө. Эх хувилбартай
     * ижил тул очнууд нэг байрандаа царцахгүй, бичвэрийн эргэн тойронд
     * үргэлж шинэчлэгдэнэ.
     *
     * ⚠️⚠️ ЭХНИЙ ДҮҮРГЭЛТ ч ЭНД, effect-ийн биед БИШ. Эх хувилбар нь
     * `initializeStars()`-ыг effect дотор шууд дууддаг ба тэр нь энэ
     * проектын `react-hooks/set-state-in-effect` дүрмийг ЗӨРЧИНӨ (шаталсан
     * дахин рендер). Callback дотор дуудахад дүрэм зөвшөөрнө — оч 100ms
     * хожуу гарна, тэр нь нүдэнд мэдэгдэхгүй.
     *
     * ⚠️ Мөн SSR-т ХООСОН эхэлдэг нь ЗӨВ: `Math.random()` нь рендерийн үед
     * дуудагдвал сервер/клиент зөрж hydration алдана.
     */
    const interval = setInterval(() => {
      setSparkles((current) =>
        current.length === 0
          ? Array.from({ length: sparklesCount }, generate)
          : current.map((s) =>
              s.lifespan <= 0 ? generate() : { ...s, lifespan: s.lifespan - 0.1 },
            ),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [reduced, first, second, sparklesCount]);

  return (
    /**
     * `relative inline-block` — оч нь `absolute` тул байрлалын хүрээ ЭНД.
     * Хэмжээ/жин ОГТ заагаагүй: дуудагчийн типограф хүчинтэй үлдэнэ.
     *
     * ⚠️ `overflow` ТАВИАГҮЙ — оч нь үсгийн ГАДНА талд ч гарах ёстой
     * (`left/top` нь 0-100% боловч SVG өөрөө 21px тул ирмэгээс халина).
     * Хайчилвал эффект хагасаараа алга болно.
     */
    <span className={cn("relative inline-block", className)}>
      {!reduced &&
        sparkles.map((s) => (
        <SparkleStar
          key={s.id}
          x={s.x}
          y={s.y}
          color={s.color}
          delay={s.delay}
          scale={s.scale}
          size={starSize}
        />
      ))}
      {children}
    </span>
  );
}
