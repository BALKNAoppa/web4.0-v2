import Link from "next/link";
import { ArrowRight, Tv } from "lucide-react";

import { Reveal } from "@/components/web4/reveal";

/** Univision брэнд ногоон (лого-гоос) */
const UNIVISION_GREEN = "#0FAA0A";

export function UnivisionPlansBanner() {
  return (
    <section
      aria-labelledby="univision-plans-title"
      className="bg-muted relative w-full overflow-hidden"
    >
      {/* Бусад section-уудтай ижил 1200px контентын хүрээнд тэгшилнэ */}
      <Reveal>
        <div className="relative mx-auto grid w-full max-w-300 items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
          {/* ============ LEFT — Univision брэнд өнгөт дизайн visual ============ */}
          <div className="flex justify-center lg:justify-start">
            <div className="ring-border/60 relative flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-[#0FAA0A] via-[#0d9488] to-[#2563eb] shadow-xl ring-1 lg:max-w-lg">
              {/* Гэрлийн зөөлөн толбо */}
              <div
                aria-hidden
                className="absolute -top-12 -left-12 size-52 rounded-full bg-white/20 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -right-10 -bottom-16 size-56 rounded-full bg-black/15 blur-3xl"
              />
              {/* Төвлөрсөн цагиргууд */}
              <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                <div className="size-88 rounded-full border border-white/12" />
              </div>
              <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                <div className="size-64 rounded-full border border-white/20" />
              </div>

              {/* Төвийн glass icon disc — зөөлөн хөвөнө */}
              <div className="animate-float-card relative flex size-28 items-center justify-center rounded-4xl bg-white/15 ring-1 ring-white/30 backdrop-blur-md">
                <Tv className="size-14 text-white" strokeWidth={1.5} aria-hidden="true" />
              </div>

              {/* Багцын нэрсийн хөвөгч chip-үүд */}
              <span className="absolute top-10 left-8 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur">
                M+
              </span>
              <span className="absolute top-16 right-10 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur">
                L+
              </span>
              <span className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur">
                XL+
              </span>
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
                href="/univision"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0FAA0A] px-7 text-sm font-semibold text-white transition-opacity duration-700 ease-out hover:opacity-85"
              >
                Дэлгэрэнгүй үзэх
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
