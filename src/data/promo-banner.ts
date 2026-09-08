/**
 * Нүүрний PROMO BANNER — hero-гийн дээр суух зурвас.
 *
 * Медиаг discriminated union-аар удирдана: видео / зураг / gradient. Шинэ төрөл
 * нэмэх = `PromoMedia`-д нэг гишүүн + promo-banner.tsx-д нэг case.
 *
 * GIF-ийг ЗОРИУДААР дэмжээгүй — ижил чанарын MP4-ээс 10–20 дахин том, hardware
 * decode байхгүй, зогсоох боломжгүй тул WCAG 2.2.2-ыг зөрчинө. GIF байвал
 * доорх командаар видео болгож хөрвүүлнэ.
 *
 * ─── Видео бэлдэх (ffmpeg) ────────────────────────────────────────────
 * Аудиог ХАСНА (-an): autoplay блоклогдохгүй, WCAG 1.4.2 үүрэг үүсэхгүй.
 *
 *   # Desktop MP4 (H.264, бүх browser-ийн баталгаа)
 *   ffmpeg -i master.mov -an -vf scale=1920:-2 -c:v libx264 -profile:v high \
 *          -pix_fmt yuv420p -crf 23 -movflags +faststart promo-1920.mp4
 *
 *   # Desktop WebM (VP9, 30–50% жижиг — эхэнд тавина)
 *   ffmpeg -i master.mov -an -vf scale=1920:-2 -c:v libvpx-vp9 -crf 33 -b:v 0 promo-1920.webm
 *
 *   # Mobile (1280w)
 *   ffmpeg -i master.mov -an -vf scale=1280:-2 -c:v libx264 -profile:v high \
 *          -pix_fmt yuv420p -crf 26 -movflags +faststart promo-1280.mp4
 *
 *   # Poster — 1-р frame, LCP-г яг үүгээр хэмждэг тул ≤100KB
 *   ffmpeg -i master.mov -vframes 1 -vf scale=1920:-2 -q:v 80 promo-poster.webp
 *
 * Дээд хэмжээ: desktop ≤3MB, mobile ≤1.2MB, урт 6–12 сек, seamless loop.
 * Видеонд ТЕКСТ шигтгэхгүй — гарчиг, CTA бүгд доорх `title`/`cta`-д HTML болж
 * гарна (a11y, орчуулга, LCP-ийн төлөө).
 * ──────────────────────────────────────────────────────────────────────
 */
import type { BrandId, Owner } from "@/lib/brand";

// =====================================================================
// TYPES
// =====================================================================

export type PromoVideoSource = {
  src: string;
  /** 'video/webm' эсвэл 'video/mp4' */
  type: string;
  /** Media query — дэлгэцийн хэмжээгээр өөр rendition сонгоно */
  media?: string;
};

export type PromoMedia =
  | {
      kind: "video";
      /** WebM-ийг ЭХЭНД тавина — browser эхний дэмждэгээ авна */
      sources: PromoVideoSource[];
      /** Видео дуудагдтал ба reduced-motion үед харагдана */
      poster: string;
    }
  | { kind: "image"; src: string; alt: string }
  /**
   * Файлгүй ажиллах суурь хувилбар — цулгуй НЭГ өнгө (өмнө нь gradient байсан,
   * өнгө нь promo-banner.tsx дотор). Нэрийг нь `gradient` хэвээр үлдээв —
   * хоёр брэндийн data хоёулаа үүнийг заадаг.
   */
  | { kind: "gradient" };

export type PromoBannerContent = {
  media: PromoMedia;
  /**
   * Медиа ЗӨВХӨН чимэглэл эсэх.
   *   true  → `aria-hidden`, бүх мэдээлэл доорх текстэд байна (WCAG 1.1.1 хангана)
   *   false → медиад харагдах мэдээллийг текстээр ДАВХАРДУУЛАХ ёстой; дуутай
   *           бол хадмал (1.2.2) ба аудио тайлбар (1.2.5) шаардлагатай болно
   */
  decorative: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string; owner?: Owner };
  secondaryCta?: { label: string; href: string; owner?: Owner };
};

// =====================================================================
// CONTENT — брэнд тус бүрээр
//
// Видео бэлэн болоход `media`-г ингэж солино:
//   media: {
//     kind: "video",
//     poster: "/promo/promo-poster.webp",
//     sources: [
//       { src: "/promo/promo-1280.mp4",  type: "video/mp4",  media: "(max-width: 640px)" },
//       { src: "/promo/promo-1920.webm", type: "video/webm" },
//       { src: "/promo/promo-1920.mp4",  type: "video/mp4" },
//     ],
//   },
// =====================================================================

export const promoBanners: Record<BrandId, PromoBannerContent> = {
  unitel: {
    media: { kind: "gradient" },
    decorative: true,
    eyebrow: "Цаг үеийн урамшуулал",
    title: "Шинэ дугаар — эхний сарын төлбөр үнэгүй",
    subtitle: "Дараа төлбөрт дугаар авах амархан.",
    cta: { label: "Багц харах", href: "#", owner: "unitel" },
    secondaryCta: { label: "Бүх урамшуулал", href: "/campaigns" },
  },
  univision: {
    media: { kind: "gradient" },
    decorative: true,
    eyebrow: "Цаг үеийн урамшуулал",
    title: "Интернэт + ТВ — сард 39,900₮",
    subtitle: "Шинэ хэрэглэгчдэд үнэгүй суурилуулалттай, 1 жилийн багц.",
    cta: { label: "Багц харах", href: "/main-packages", owner: "univision" },
    secondaryCta: { label: "Бүх урамшуулал", href: "/campaigns" },
  },
};

// =====================================================================
// SAMPLE PROMO КАРТУУД — нүүрний hero-гийн ДЭЭД хэсэгт 3 ширхэг зэрэгцэнэ.
//
// ЯАГААД 1-ИЙН ОРОНД 3: нэг бүтэн өргөний banner нь өндрөө барихын тулд
// дэлгэцийн ~60%-ыг иддэг байв. Site-ийн ерөнхий өргөнд (1200px) багтсан
// 3 карт нь ижил мэдээллийг ~28%-д багтаана — доорх багцын хэсэгт зай
// чөлөөлнө.
//
// ⚠️ АГУУЛГА нь PLACEHOLDER: `campaigns.ts`-ийн `placeholderText` хэвээр
// зургийн слотыг шошгоор нэрлэв. Жинхэнэ урамшуулал гарахад энэ жагсаалтыг
// солино — компонент хөндөгдөхгүй.
// =====================================================================

export type PromoCard = {
  id: string;
  /** Жинхэнэ зураг бэлэн болтол картан дотор харагдах шошго */
  placeholderText: string;
  ctaLabel: string;
  href: string;
  /**
   * Картын ДЭВСГЭР ЗУРАГ — `public/`-ээс эхлэх зам (ж: `/promo/immersive.jpg`).
   *
   * Байвал: зураг `object-cover`-оор картыг бүтнээр дүүргэж, дээр нь бараан
   * scrim тавигдана, бичвэр ЦАГААН болно. Байхгүй бол шошготой саарал
   * placeholder хэвээр — өөрөөр хэлбэл файл нэмэх нь ЗӨВХӨН энэ мөрийг
   * бичих ажил, компонент хөндөгдөхгүй.
   *
   * ХЭМЖЭЭ: карт нь **3:4** харьцаатай (загварын 342×456). 3× нягтад
   * **1026 × 1368**, эсвэл дугуй тоогоор **1080 × 1440**. Харьцаа нь яг
   * тул `object-cover` бараг тайрахгүй — гэвч дэлгэцийн өргөн өөр байхад
   * бага зэрэг зөрөх тул гол дүрсийг ТӨВД байлга.
   *
   * ⚠️ ГАРЧИГ, ЛОГО, ТАЙЛБАР нь ЗУРГАН ДЭЭР ӨӨР ДЭЭР НЬ байна — картад
   * зөвхөн CTA товч л амьд элемент болж үлдсэн. Тиймээс бичвэрийг зурагтаа
   * шигтгэхдээ доод БАРУУН булангийн ~110×48px талбайг ЧӨЛӨӨТЭЙ үлдээ
   * (CTA нь тэнд суудаг).
   */
  image?: string;
  /**
   * DESKTOP-ЫН ТУСДАА ЗУРАГ (md+). Өгвөл `PromoSlide` (desktop) үүнийг,
   * `PromoFadeSlide` (мобайл) нь `image`-ыг хэрэглэнэ. Өгөөгүй бол
   * desktop ч `image`-ыг авна.
   *
   * ⚠️ ЯАГААД ХОЁР ФАЙЛ: мобайлын карт нь 3:4 БОСОО, desktop-ийн панел нь
   * ХЭВТЭЭ. Нэг файлыг хоёуланд тавибал аль нэг нь 45-56% тайрагдана
   * (`object-cover`). Загвар зурагч тал өргөнөөр нь ТУСАД НЬ экспорт
   * хийсэн — код нь зөвхөн зөв файлыг зөв өргөнд өгнө.
   *
   * `<picture>`/`srcset` ХЭРЭГГҮЙ: мобайл ба desktop слайд нь ТУСДАА
   * компонент бөгөөд эцэг нь CSS-ээр (`md:hidden` / `hidden md:flex`)
   * сольдог тул тус тусын `<Image>` аль хэдийн бий.
   *
   * ХЭМЖЭЭ: 1920 × 541 (харьцаа 3.549). Гол бичвэр нь ЗҮҮН талд эсвэл
   * ТӨВД — хоёр ирмэг тайрагдвал юу ч алдагдахгүй байхаар бүтээ.
   */
  imageDesktop?: string;
  /**
   * DESKTOP-ЫН ЗУРАГ ХААНААС ТАЙРАГДАХ ВЭ — CSS `object-position`.
   * Өгөөгүй бол `"center"` (`promo-banner.tsx > PromoSlide`).
   *
   * ⚠️ ЯАГААД БАННЕР ТУС БҮРД ТУСДАА: desktop-ийн панел нь баннераас
   * ХАМААГҮЙ НАРИЙН (1.90 vs 3.55) тул өргөний ~46% тайрагдана. Аль хэсэг
   * үлдэхийг тухайн зургийн БҮТЭЭЦ шийднэ — нэг тогтмол утга гурвуулангийн
   * аль нэгийг зайлшгүй эвдэнэ:
   *   Bagtsaa butee — бичвэр ЗҮҮН талд (3.5%–49%). `center` бол "ДА", "ӨӨ",
   *                   "50% OFF" тасарна → `left`.
   *   Unitel        — UNITEL лого ТӨВД (27.6%–71.4%). `left` бол логог
   *                   ЯГ ХАГАСААР зүсэх тул `center` ЗААВАЛ.
   *   Immersive exp — харьцаа 1.667 нь панелаас НАРИЙН тул ӨНДРӨӨР
   *                   тайрагдана; хэвтээ утга нөлөөлөхгүй, `center` хэвээр.
   *
   * `popular-services.ts > imagePosition`-той ижил зарчим.
   */
  imageDesktopPosition?: string;
  /**
   * Зургийн alt. Зураг нь ЧИМЭГЛЭЛ бол бүү бич — доорх гарчиг, тайлбар
   * бүх мэдээллийг аль хэдийн дамжуулж байгаа тул давхардуулбал дэлгэц
   * уншигч нэг зүйлийг хоёр удаа уншина (WCAG 1.1.1).
   */
  imageAlt?: string;
};

/**
 * ⚠️ БРЭНД ТУС БҮРЭЭР. Өмнө нь ганц жагсаалт байсныг `Record<BrandId, …>`
 * болгов — `PromoHero`-г ХОЁР брэнд хуваалцдаг тул нэг жагсаалтад Unitel-ийн
 * зураг тавибал Univision-ы нүүрэнд ӨӨР БРЭНДИЙН баннер гарна.
 * `promoBanners`-тэй ижил бүтэц, `promo-banner.tsx` нь `[BRAND]`-аар авна.
 *
 * UNITEL — `public/Unitel/Hero banner/`-аас МОБАЙЛД 3, DESKTOP-Д 3 зураг
 * холбогдсон. `placeholderText` нь ҮЛДСЭН: зураг ачаалагдаагүй/олдоогүй
 * үед картыг хоосон биш байлгана. `imageAlt` бичээгүй — баннер бүрийн
 * мэдээлэл зурган дотроо бий, картад зөвхөн CTA л амьд элемент тул
 * чимэглэл гэж үзнэ (WCAG 1.1.1).
 *
 * ХОСЛОЛЫГ ЗУРГИЙН АГУУЛГААР тааруулсан (таамаглаагүй):
 *   Image 1.jpg (1080×1350) "ДАРАА ТӨЛБӨРТ БАГЦАА ӨӨРӨӨ БҮТЭЭ · 50% OFF"
 *     ↔ Bagtsaa butee Desktop.png (3840×1082) — ижил модель, ижил бичвэр
 *   Image 2.jpg (2048×2048) "IMMERSIVE EXPERIENCE · ӨВӨГ МОНГОЛЧУУДЫН"
 *     ↔ Immersive experience Desktop.png (1000×600)
 *   Image 3.jpg → Unitel Desktop.png (1920×541) "UNITEL · ТҮРҮҮЛЖ АЛХАНА"
 *     (үлдсэн хос — дээрх хоёр нь агуулгаараа баталгаажсан тул хасалтаар)
 *
 * ⚠️ МОБАЙЛЫН СЛОТ 3:4 (0.75). `Image 1.jpg` нь 4:5 (0.80) — хажуу тал ~6%
 * тайрна. `Image 2/3.jpg` нь 1:1 — хажуу тал ~25% ТАЙРАГДАНА.
 *
 * ⚠️⚠️ DESKTOP-ЫН ЗУРАГНУУД ХАРЬЦААГААРАА ЗӨРНӨ:
 *   Bagtsaa butee    3840×1082 = 3.549
 *   Unitel           1920×541  = 3.549   ← хоёулаа ЯГ ижил (1920×541 канвас)
 *   Immersive exp.   1000×600  = 1.667   ← ЗӨРСӨН
 * "Immersive experience" нь 1920×541-ээр ДАХИН экспорт хийгдэх шаардлагатай,
 * эс бөгөөс тэр слайд бусдаасаа өөр хэмжээгээр тайрагдана.
 *
 * UNIVISION — PLACEHOLDER хэвээр. `public/Univision/Hero banner/`-д 3 зураг
 * бэлэн байгаа ч захиалагч "Unitel дээр" гэж тусгайлан хэлсэн тул хөндөөгүй.
 */
export const samplePromoCards: Record<BrandId, PromoCard[]> = {
  unitel: [
    {
      id: "promo-1",
      placeholderText: "Sample banner 1",
      ctaLabel: "Дэлгэрэнгүй",
      href: "#",
      image: "/Unitel/Hero banner/Image 1.jpg",
      imageDesktop: "/Unitel/Hero banner/Bagtsaa butee Desktop.png",
      /**
       * ЗҮҮН ирмэгээр зэрэгцүүлнэ — зургийг баруун тийш "шахсантай" ижил
       * үр дүн: харагдах цонх зургийн ЗҮҮН хэсгийг эзэлнэ.
       *
       * Хэмжсэн бичвэрийн хүрээ (зургийн өргөний %-иар):
       *   "3 сарын турш суурь хураамж"        3.8% → 23.3%
       *   "50% OFF"                            3.5% → 19.5%
       *   "ДАРАА ТӨЛБӨРТ БАГЦАА"              12.3% → 45.0%
       *   "ӨӨРӨӨ БҮТЭЭ"                        8.0% → 49.0%
       * Бүх бичвэр 3.5%–49%-д багтана. Харагдах цонх 53.7% (1440×900) тул
       * `left` үед [0%, 53.7%] → бичвэр БҮРЭН, баруун талд 4.7% нөөц.
       * `2%` гэх мэт шилжилт нэмбэл модель жаахан илүү харагдах ч бичвэрийн
       * зүүн нөөц алга болно — тогтвортой байдлыг сонгов.
       */
      imageDesktopPosition: "left center",
    },
    {
      id: "promo-2",
      placeholderText: "Sample banner 2",
      ctaLabel: "Дэлгэрэнгүй",
      href: "#",
      image: "/Unitel/Hero banner/Image 2.jpg",
      imageDesktop: "/Unitel/Hero banner/Immersive experience Desktop.png",
    },
    {
      id: "promo-3",
      placeholderText: "Sample banner 3",
      ctaLabel: "Дэлгэрэнгүй",
      href: "#",
      image: "/Unitel/Hero banner/Image 3.jpg",
      imageDesktop: "/Unitel/Hero banner/Unitel Desktop.png",
    },
  ],
  univision: [
    { id: "promo-1", placeholderText: "Sample banner 1", ctaLabel: "Sample", href: "#" },
    { id: "promo-2", placeholderText: "Sample banner 2", ctaLabel: "Sample", href: "#" },
    { id: "promo-3", placeholderText: "Sample banner 3", ctaLabel: "Sample", href: "#" },
  ],
};
