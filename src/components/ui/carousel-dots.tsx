"use client";

import { cn } from "@/lib/utils";

/**
 * ЦЭГЭН ЗААГЧ — carousel-ийн байрлалыг заах, дарж шилжих мөр.
 *
 * ЗАГВАРЫН ХЭМЖЭЭ (390px frame дээр хэмжсэн):
 *   идэвхтэй 32 + цэг 8 + цэг 8 + зай 16 × 2 = **80 × 8**
 *
 * Мөрийн өндөр нь ЯГ 8px байх нь чухал: доорх агуулга хүртэлх зайг эндээс
 * хэмждэг тул мөрөнд нуугдмал өндөр (жишээ нь 44px хүрэх талбай) байвал
 * бодит зай загвараас зөрнө. Тиймээс хүрэх талбайг `::before`-оор өгнө —
 * тэр нь layout-д ОРОХГҮЙ.
 *
 * ⚠️ ХОЁР ГАЗАР ХЭРЭГЛЭГДЭНЭ: нүүрний promo banner ба "Санал болгох багц".
 * Хоёрын хэлбэр зөрвөл нэг хуудсан дээр хоёр өөр заагч харагдана.
 */
export function CarouselDots({
  total,
  index,
  onSelect,
  label,
  className,
}: {
  total: number;
  /** 0-ээс эхэлсэн идэвхтэй индекс */
  index: number;
  onSelect: (i: number) => void;
  /**
   * Товч бүрийн `aria-label`-ийн үндэс — "1-р {label}" гэж угсарна.
   * Нэг хуудсан дээр хоёр заагч байгаа тул ялгаатай байх ЁСТОЙ.
   */
  label: string;
  className?: string;
}) {
  if (total < 2) return null;

  return (
    <div className={cn("flex h-2 shrink-0 items-center justify-center gap-4", className)}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${i + 1}-р ${label}`}
          aria-current={i === index ? "true" : undefined}
          className={cn(
            "relative h-2 rounded-full transition-all duration-300 ease-out",
            // ⚠️ ХҮРЭХ ТАЛБАЙ нь `::before`-оор — 8px цэг нь хуруунд хэтэрхий
            // жижиг (WCAG 2.5.8 нь 24×24 шаарддаг). Псевдо элемент нь
            // LAYOUT-д ОРОХГҮЙ тул мөрийн 8px өндөр, блокийн 80px өргөн
            // хэвээр үлдэнэ. Хөрш товчнуудын талбай ЯГ хүрэлцэнэ, давхцахгүй:
            // цэгийн төвүүд 24px зайтай (8/2 + 16 + 8/2).
            "before:absolute before:-inset-2 before:content-['']",
            // ⚠️ `ring-offset-2` — 8px цэг дээр offset-гүй цагираг нь цэгийг
            // бүрхэж, өөрөө цэг мэт харагдана.
            "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            i === index ? "bg-foreground w-8" : "bg-foreground/25 hover:bg-foreground/45 w-2",
          )}
        />
      ))}
    </div>
  );
}
