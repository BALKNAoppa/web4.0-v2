"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

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

/**
 * Уусалтын дээд бүдгэрэлт (px) ба босоо ЯВЦ (em).
 *
 * ⚠️ 1.2px нь MagicUI-ийн 100px-ээс ЭРС бага. 15px үсгийг 3px-ээс дээш
 * бүдгэрүүлэхэд уншигдац шууд алдагдана — bluer нь энд ЗӨӨЛРҮҮЛЭГЧ л, эффект
 * өөрөө БИШ.
 *
 * ⚠️⚠️ `SHIFT_EM` 0.3 → 0.75 (2026-09-10, захиалагчийн дэлгэцийн бичлэгээс).
 * ЯАГААД ЭНЭ ТОО ШИЙДВЭРЛЭХ ВЭ: хоёр үг ("LookTV" ба "Илүүг Үз") нь ӨӨР
 * УРТТАЙ бөгөөд ЯГ НЭГ байрлалд зурагддаг. Уусалтын дунд хоёул ~50%
 * тунгалаг болоход тэдгээр нь давхцаж УНШИГДАХГҮЙ саарал толбо үүсгэдэг —
 * бичлэгийн 1.9–2.05 секундэд яг тэр харагдана. Blur-ыг багасгаснаар толбо
 * СУЛАРСАН ч давхцал өөрөө үлдсэн тул арилаагүй.
 *
 * 0.75em (15px үсэгт ≈11px) нь солигдох мөчид хоёр үгийг БОСООГООР
 * САЛГАНА: гарах үг дээд зурвасаа, орох үг доод зурвасаа эзэлнэ ⇒ давхцал
 * биш ЭРГЭЛТ (roll) мэт уншигдана. Тиймээс дунд нь ХООСОН мөч ч гарахгүй,
 * толбо ч үүсэхгүй.
 *
 * ⚠️ Давхаргууд `absolute` тул энэ шилжилт мөрийн өндрийг ӨӨРЧЛӨХГҮЙ —
 * зэргэлдээ цэсний зүйлс хөдлөхгүй.
 */
const MAX_BLUR_PX = 1.2;
const SHIFT_EM = 0.75;

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

      /**
       * ⚠️⚠️ ЭХ ХУВИЛБАРЫН МУРУЙ СОЛИГДСОН (2026-09-10, захиалагч: "morph
       * effect-ийг илүү smooth, мэдэгдэхүйц болго").
       *
       * MAGICUI-ИЙНХ: `blur(8/f − 8)` (100px хүртэл!) + `opacity = f^0.4`.
       * Тэр хосыг ТОМ дэлгэцийн бичвэрт (`text-6xl`) зориулж, дээр нь
       * threshold шүүлтүүрээр "шингэн" болгодог. Энэ проектод бичвэр нь
       * 15px ЦЭСНИЙ шошго тул хоёулаа буруу ажиллаж байв:
       *   · `f^0.4` нь f=0.1 дээр аль хэдийн 40% — хоёр үг МАШ ЭРТ зэрэг
       *     тод болж, уусалт биш ДАВХЦАЛ мэт харагдана
       *   · 100px хүртэл blur нь 15px үсгийг бүрэн уусгаж, дунд нь "хоосон"
       *     мөч үүсгэнэ
       *
       * ОДОО: smoothstep (`3f² − 2f³`) — эхлэл/төгсгөлд зөөлөн, дунд нь
       * шийдэмгий. Хоёр давхарга f=0.5 дээр 50/50 тул давхцал ТЭГШ, богино.
       */
      const e = fraction * fraction * (3 - 2 * fraction);

      /**
       * ⚠️ БАЙРЛАЛД `e` (smoothstep), ТУНГАЛАГТ ТУСДАА, ИЛҮҮ ХУРЦ муруй.
       *
       * Тунгалагт мөн `e`-г шууд хэрэглэвэл дунд нь хоёул ЯГ 50% болно.
       * `^1.6` нь гарахыг ТҮРГЭН унагааж, орохыг ХОЖУУ өргөх тул дунд нь
       * хоёул ~33% — босоо салалттай хамт давхцал бараг мэдэгдэхгүй.
       * Хоёулаа ижил илтгэгчтэй тул шилжилт ТЭГШ хэвээр.
       */
      const outA = Math.pow(1 - e, 1.6);
      const inA = Math.pow(e, 1.6);

      // Орох үг ДООРООС дээшилж ирнэ
      el2.style.opacity = `${inA * 100}%`;
      el2.style.filter = `blur(${(1 - e) * MAX_BLUR_PX}px)`;
      el2.style.transform = `translateY(${(1 - e) * SHIFT_EM}em)`;

      // Гарах үг ДЭЭШ гарч алга болно
      el1.style.opacity = `${outA * 100}%`;
      el1.style.filter = `blur(${e * MAX_BLUR_PX}px)`;
      el1.style.transform = `translateY(${-e * SHIFT_EM}em)`;

      el1.textContent = texts[textIndexRef.current % texts.length];
      el2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  useEffect(() => {
    const el1 = text1Ref.current;
    const el2 = text2Ref.current;
    if (!el1 || !el2) return;

    // ХӨДӨЛГӨӨНГҮЙ ТӨЛӨВ — зөвхөн эхний бичвэр, шүүлтүүр ба шилжилтгүй.
    if (!enabled) {
      el1.style.transform = "none";
      el2.style.transform = "none";
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
      const fraction = morphRef.current / morphTime;

      if (fraction >= 1) {
        /**
         * ⚠️⚠️ ЭРЭМБЭ ЧУХАЛ — ЭНД MAGICUI-ИЙН ЭХ ХУВИЛБАРТ АЛДАА БАЙНА
         * (2026-09-10-нд илрүүлж зассан. Захиалагч: "давхцаж солигдоод
         * байна").
         *
         * ӨМНӨ НЬ: `textIndexRef.current += 1` -ийг хийчихээд ДАРАА нь
         * `setStyles(1)` дуудаж байв. `setStyles` нь индексээс ХАМААРЧ
         * хоёр давхаргын бичвэрийг ДАХИН БИЧДЭГ:
         *     el1 = texts[i]      opacity 0%
         *     el2 = texts[i + 1]  opacity 100%
         * Индекс аль хэдийн ахисан тул БҮРЭН ТОД давхарга нь уусаж дууссан
         * үгээ БИШ, ДАРААГИЙНХ нь үгийг зурдаг байлаа. Хоёр бичвэртэй үед
         * `texts[(i+1) % 2]` нь яг ЭХЛЭЭД байсан үг ⇒ уусалт бүрийн ТӨГСГӨЛД
         * "LookTV" рүү НЭГ ФРЭЙМ буцаж анивчаад, дараагийн фрэйм дээр
         * "Илүүг Үз" болдог. Тэр анивчилт нь хуучин glitch эффект
         * дуусаагүй мэт харагдуулж байсан.
         *
         * ОДОО: эхлээд ОДООГИЙН индексээр уусалтыг 100%-д ДУУСГАЖ зурна,
         * дараа нь л индексээ ахиулна. Дараагийн (тайван) фрэйм нь
         * `setStyles(0)`-оор ижил үгийг el1 дээр тод үлдээх тул шилжилт
         * ҮЛ МЭДЭГДЭНЭ.
         */
        setStyles(1);
        morphRef.current = 0;
        cooldownRef.current = cooldownTime;
        textIndexRef.current += 1;
        return;
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
    <span className={cn("relative inline-grid place-items-center leading-none", className)}>
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

      {/**
       * ⚠️⚠️ THRESHOLD SVG ШҮҮЛТҮҮР БҮРЭН УСТСАН (2026-09-10). БҮҮ СЭРГЭЭ —
       * шалтгааныг файлын толгойгоос үз. Товчхондоо: `feColorMatrix`
       * (`0 0 0 255 -140`) нь ~55%-аас доош тунгалаг пикселийг ТАЙРДАГ.
       * MagicUI-ийн жишээ `text-6xl` бүдүүн үсэгт тэр нь "шингэн" мэдрэмж
       * өгдөг ч 15px цэсний шошгонд үсгийн НИМГЭН зураас ба anti-alias
       * бүхэлдээ алга болж, үг нь тарсан цэг болж УНШИГДАХАА БОЛЬДОГ
       * (2026-09-10-нд хөтөч дээр A/B хийж баталсан: шүүлтүүр OFF үед
       * "LookTV" тод, ON үед бутарсан).
       *
       * Уусалтын "мэдэгдэхүйц" байдлыг одоо `setStyles` дэх smoothstep +
       * жижиг босоо шилжилт хариуцна — уншигдац алдагдахгүй.
       */}
    </span>
  );
}
