import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/web4/reveal";
import { plans, type Plan } from "@/data/plans";
import { cn } from "@/lib/utils";

/** Univision брэнд ногоон (лого-гоос) */
const UNIVISION_GREEN = "#0FAA0A";

/**
 * Багцын гол үзүүлэлт — интернэтийн хурд ба дата эрх.
 * `plans.ts`-ээс уншина, энд давхардуулж бичихгүй.
 */
function internetSpec(plan: Plan): string {
  const internet = plan.groups.find((group) => group.icon === "wifi");
  return internet?.features.map((feature) => feature.value).join(" · ") ?? "";
}

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
            <div className="ring-border/60 relative flex aspect-square w-full max-w-md flex-col justify-center gap-3 overflow-hidden rounded-3xl bg-linear-to-br from-[#0FAA0A] via-[#0d9488] to-[#2563eb] p-5 shadow-xl ring-1 sm:p-7 lg:max-w-lg">
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

              {/* Багцын мэдээлэл — нэр, хурд, дата, үнэ. Утга нь plans.ts-ээс. */}
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 backdrop-blur",
                    plan.recommended ? "bg-white/25 ring-white/40" : "bg-white/12 ring-white/20",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-white sm:text-2xl">
                        {plan.name}
                      </span>
                      {plan.recommended && (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#0d7a52]">
                          САНАЛ БОЛГОХ
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-white/80 sm:text-sm">
                      {internetSpec(plan)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-base leading-none font-extrabold text-white sm:text-lg">
                      {plan.price}
                    </div>
                    <div className="mt-1 text-[11px] text-white/70">сард</div>
                  </div>
                </div>
              ))}
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
