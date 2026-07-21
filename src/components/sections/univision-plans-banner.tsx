import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

/**
 * Univision · Үндсэн багц — Мобайл banner-тай ижил хэв маягийн full-width
 * banner (багцын дэлгэрэнгүй M+/L+/XL+ картуудыг харуулахгүй, CTA-гаар
 * /main-packages руу хөтөлнө). Зэрэгцээ харагдахад ялгаатай байлгахаар
 * зураг нь ЗҮҮН талд, текст нь баруун талд (толин байрлал).
 * Бодит зураг гартал "Photo 1" placeholder.
 */

/** Univision брэнд ногоон (лого-гоос) */
const UNIVISION_GREEN = "#0FAA0A";

export function UnivisionPlansBanner() {
  return (
    <section
      aria-labelledby="univision-plans-title"
      className="bg-muted relative w-full overflow-hidden"
    >
      {/* Бусад section-уудтай ижил 1200px контентын хүрээнд тэгшилнэ */}
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        {/* ============ LEFT — багцын зурагны placeholder (float animation) ============ */}
        <div className="flex justify-center lg:justify-start">
          <div className="ring-border/60 bg-muted/50 flex aspect-square w-full max-w-md flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl shadow-xl ring-1 lg:max-w-lg">
            <ImageIcon
              className="text-muted-foreground/40 size-8"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-muted-foreground/60 text-sm font-medium">Photo 1</span>
          </div>
        </div>

        {/* ============ RIGHT — text + CTA ============ */}
        <div>
          <div
            className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase"
            style={{ color: UNIVISION_GREEN }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: UNIVISION_GREEN }}
              aria-hidden="true"
            />
            Үндсэн бүтээгдэхүүн · Univision
          </div>

          <h2
            id="univision-plans-title"
            className="text-foreground mt-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
          >
            <span>Үндсэн</span> багцууд
          </h2>

          <p className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed md:text-lg">
            Интернэт, IPTV, суурин утас — нэг багцад багтаасан M+, L+, XL+.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/main-packages"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0FAA0A] px-7 text-sm font-semibold text-white transition-opacity duration-700 ease-out hover:opacity-85"
            >
              Дэлгэрэнгүй үзэх
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
