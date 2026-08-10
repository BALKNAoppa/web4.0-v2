import Image from "next/image";

/**
 * Бүтэн өргөнтэй (full-bleed) зурган зурвас — дэлгэцийн ирмэгээс ирмэг хүртэл
 * тэлнэ, бусад section-ий `max-w-300` контейнерт ОРОХГҮЙ.
 *
 * Зургийн жинхэнэ хэмжээг `width`/`height`-ээр өгнө. Next.js түүнээс
 * aspect-ratio-г тооцоод байрыг урьдчилан барьдаг тул зураг ачаалахад
 * layout shift үүсэхгүй (CLS 0).
 *
 * ХҮРТЭЭМЖ (WCAG 1.1.1): зураг дотор УТГА агуулсан текст байвал `alt`-д
 * түүнийг бичнэ. Зөвхөн чимэглэл бол `alt=""` үлдээ — тэр үед section нь
 * screen reader-т бүхэлдээ нуугдана.
 */
export function WideImageBanner({
  src,
  alt,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const decorative = alt === "";

  return (
    <section
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative || undefined}
      className="bg-background w-full"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="100vw"
        priority={priority}
        className="block h-auto w-full"
      />
    </section>
  );
}
