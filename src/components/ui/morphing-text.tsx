"use client";

import { useCallback, useEffect, useId, useRef, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/**
 * MagicUI — Morphing Text (https://magicui.design/docs/components/morphing-text)
 *
 * Хоёр бичвэрийг ДАРААЛАН уусгаж сольдог. Механизм нь `framer-motion`-гүй,
 * ердөө хоёр давхарга + `blur()` + SVG-ийн `feColorMatrix` босго (threshold):
 *   гарах бичвэр  → blur нэмэгдэж, opacity буурна
 *   орох бичвэр   → blur багасаж, opacity өснө
 *   threshold шүүлтүүр → хагас тунгалаг пикселийг ХАТУУ болгож, хоёр
 *                        давхарга нь "шингэн" мэт нийлж, хуваагдана
 *
 * ⚠️ ХОЁР ЗҮЙЛЭЭР ЭХ ХУВИЛБАРААС ЗӨРНӨ, хоёул ХЭРЭГЦЭЭНЭЭС:
 *
 *   1. ХЭМЖЭЭ ТОГТООГЧ (`sizer`) НЭМЭГДСЭН. MagicUI-ийн хувилбар нь
 *      `h-16 md:h-24` + `w-full max-w-screen-md` гэсэн ТОГТМОЛ том блок
 *      бөгөөд уусах хоёр давхарга нь `absolute` тул контейнер нь агуулгаас
 *      өргөнөө АВДАГГҮЙ. Header-ийн цэсэнд тэр нь 0 өргөнтэй болж унана.
 *      Тиймээс хамгийн урт бичвэрийг `invisible`-ээр рендерлэж, контейнер
 *      түүнээс өргөн/өндрөө авдаг болгов — API хөндөгдөөгүй, зөвхөн ИНЛАЙН
 *      хэрэглэх боломж нэмэгдсэн.
 *
 *   2. `<div>` → `<span>` (`inline-grid`). Компонентыг `<a>`/`<button>`
 *      дотор тавих шаардлагатай (цэсний линк) — блок элемент тэнд хүчингүй.
 *
 * ⚠️ SR-Т ЗӨВХӨН НЭГ БИЧВЭР. Уусах хоёр давхарга `aria-hidden` — эс бөгөөс
 * дэлгэц уншигч нь уусалтын дундах ХОЁР бичвэрийг хоёуланг уншиж, линкийн
 * хүртээмжит нэр "LookTV Илүүг Үз" болно. Каноник нэр нь `texts[0]`.
 *
 * ⚠️ ШҮҮЛТҮҮРИЙН `id` НЬ ЖИШЭЭНД ТОГТМОЛ ("threshold") байдаг. Энэ проектод
 * компонент нь desktop ба mobile хоёуланд рендерлэгддэг (нэг нь CSS-ээр
 * нуугдсан ч ХОЁУЛАА DOM-д байна) тул тогтмол id давхардаж, хүчингүй HTML
 * үүсгэнэ. `useId`-аар instance тус бүрд өөр id өгөв (тэмдэгтийг цэвэрлэсэн —
 * React-ийн `useId` нь `:` агуулдаг).
 *
 * ⚠️ REDUCED MOTION. Хэрэглэгч хөдөлгөөнийг багасгахыг сонгосон бол
 * `requestAnimationFrame` мөчлөг ОГТ АСАХГҮЙ, зөвхөн `texts[0]` тод
 * харагдана. Өмнөх glitch эффект ч ижил хамгаалалттай байсан (`globals.css`)
 * — түүнийг алдах нь регресс болно.
 */
type MorphingTextProps = {
  /** Дараалан уусах бичвэрүүд. Хоёроос дээш байвал мөчлөг үргэлжилнэ. */
  texts: string[];
  /** Нэг уусалт хэдэн секунд. MagicUI-ийн анхдагч 1.5. */
  morphTime?: number;
  /** Уусалт хоорондын тайван хугацаа. MagicUI-ийн анхдагч 0.5. */
  cooldownTime?: number;
  className?: string;
};

function useMorphingText({
  texts,
  morphTime,
  cooldownTime,
  enabled,
}: {
  texts: string[];
  morphTime: number;
  cooldownTime: number;
  enabled: boolean;
}) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(cooldownTime);
  /**
   * ⚠️ 0-ЭЭР ИНИЦИАЛЧИЛСАН, `Date.now()`-ООР БИШ. `useRef(Date.now())` нь
   * рендерийн үед ЦЭВЭР БИШ функц дуудах бөгөөс `react-hooks/purity` түүнийг
   * хориглодог (рендер дахин орвол утга тогтворгүй болно). Бодит цагийг
   * доорх effect нь мөчлөг асахдаа тавина.
   */
  const timeRef = useRef(0);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  /**
   * `fraction` 0→1: 1-р давхарга бүдгэрч алга болох, 2-р нь тодрох.
   * `8 / fraction - 8` нь fraction→0 үед хязгааргүй тэмүүлэх тул 100px-ээр
   * хязгаарлана (эх хувилбартай ижил) — эс бөгөөс blur нь хөтчийг гацаана.
   */
  const setStyles = useCallback(
    (fraction: number) => {
      const el1 = text1Ref.current;
      const el2 = text2Ref.current;
      if (!el1 || !el2) return;

      el2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      el2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inverted = 1 - fraction;
      el1.style.filter = `blur(${Math.min(8 / inverted - 8, 100)}px)`;
      el1.style.opacity = `${Math.pow(inverted, 0.4) * 100}%`;

      el1.textContent = texts[textIndexRef.current % texts.length];
      el2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  useEffect(() => {
    const el1 = text1Ref.current;
    const el2 = text2Ref.current;
    if (!el1 || !el2) return;

    // ХӨДӨЛГӨӨНГҮЙ ТӨЛӨВ — зөвхөн эхний бичвэр, шүүлтүүргүй.
    if (!enabled) {
      el1.style.filter = "none";
      el1.style.opacity = "100%";
      el1.textContent = texts[0] ?? "";
      el2.style.opacity = "0%";
      el2.textContent = "";
      return;
    }

    let frame = 0;
    // Мөчлөг АСАХ мөчийн цаг — рендерийн үед биш ЭНД (purity).
    timeRef.current = Date.now();
    const tick = () => {
      frame = requestAnimationFrame(tick);

      const now = Date.now();
      const dt = (now - timeRef.current) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;

      if (cooldownRef.current > 0) {
        // ТАЙВАН — 1-р давхарга тод, 2-р нь алга.
        setStyles(0);
        return;
      }

      morphRef.current += dt;
      let fraction = morphRef.current / morphTime;

      if (fraction >= 1) {
        // Уусалт дуусав: индексээ ахиулж, дараагийн тайван мөчлөг.
        morphRef.current = 0;
        cooldownRef.current = cooldownTime;
        textIndexRef.current += 1;
        fraction = 1;
      }

      setStyles(fraction);
    };

    tick();
    return () => cancelAnimationFrame(frame);
  }, [enabled, texts, morphTime, cooldownTime, setStyles]);

  return { text1Ref, text2Ref };
}

/**
 * Хэрэглэгч хөдөлгөөн багасгахыг сонгосон эсэх.
 *
 * ⚠️ `useSyncExternalStore` — ГАДААД эх сурвалжийг (media query) унших
 * ЗӨВ хэрэгсэл. Хоёр буруу арга туршиж үзсэн:
 *   `useRef` + рендерийн үед `matchMedia`  → `react-hooks/purity` ба
 *     `react-hooks/refs` хоёулаа хориглоно (рендер цэвэр байх ёстой)
 *   `useState` + effect дотор `setState`   → `react-hooks/set-state-in-effect`
 *     (шаталсан дахин рендер үүсгэдэг)
 * `useSyncExternalStore` нь SSR-д `getServerSnapshot`-ыг (=`false`) авч,
 * клиентэд шууд бодит утгыг уншина — НЭГ фрэйм ч хөдөлгөөн гарахгүй.
 *
 * `subscribe` — хэрэглэгч системийн тохиргоог ЯВЦ ДУНД сольвол дагана.
 * Өмнөх CSS хувилбар (`@media prefers-reduced-motion`) ийм байсан тул тэр
 * шинжийг алдахгүй.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function MorphingText({
  texts,
  morphTime = 1.5,
  cooldownTime = 0.5,
  className,
}: MorphingTextProps) {
  const rawId = useId();
  // `useId` нь `:r0:` хэлбэртэй — `url(#…)`-д тэмдэгт нь эрсдэлтэй тул цэвэрлэв.
  const filterId = `morph-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const reduced = usePrefersReducedMotion();
  const { text1Ref, text2Ref } = useMorphingText({
    texts,
    morphTime,
    cooldownTime,
    enabled: !reduced,
  });

  // Контейнерын өргөн/өндрийг тогтоох хамгийн урт бичвэр.
  const longest = texts.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      className={cn(
        "relative inline-grid place-items-center leading-none",
        // Threshold шүүлтүүр — хоёр давхаргыг "шингэн" мэт нийлүүлнэ.
        // Хөдөлгөөнгүй төлөвт ХЭРЭГЛЭХГҮЙ: уусалт байхгүй тул зөвхөн
        // үсгийн ирмэгийг хатууруулж, бичвэрийг бүдүүн харагдуулна.
        !reduced && `[filter:url(#${filterId})_blur(0.35px)]`,
        className,
      )}
    >
      {/* Дэлгэц уншигчид — каноник нэр. `sr-only` нь layout эзлэхгүй. */}
      <span className="sr-only">{texts[0]}</span>

      {/* ХЭМЖЭЭ ТОГТООГЧ. `invisible` (`display:none` БИШ) тул хэмжээ
          тооцогдоно; `visibility:hidden` нь a11y-ийн модноос ч гаргана. */}
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {longest}
      </span>

      {/* УУСАХ ХОЁР ДАВХАРГА — агуулгыг JS бичнэ (`textContent`). */}
      <span
        ref={text1Ref}
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center whitespace-nowrap"
      />
      <span
        ref={text2Ref}
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center whitespace-nowrap"
      />

      {/* `hidden` — зөвхөн шүүлтүүрийн тодорхойлолт, зурагдахгүй. */}
      <svg aria-hidden="true" className="hidden" width="0" height="0">
        <defs>
          <filter id={filterId}>
            {/* alpha × 255 − 140 ⇒ ~55%-аас дээш тунгалаг пиксель ХАТУУ болно */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </span>
  );
}
