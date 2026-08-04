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
  /** Файлгүй ажиллах суурь хувилбар — брэндийн өнгөт gradient */
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
    cta: { label: "Багц харах", href: "/unitel#postpaid", owner: "unitel" },
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
