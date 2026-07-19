import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  CreditCard,
  Gift,
  ImageIcon,
  Layers,
  MonitorPlay,
  Package,
  Router,
  Smartphone,
  Sparkles,
  Tv,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/layout/footer";
import {
  type BrandPage,
  type BrandRibbonIcon,
  type BrandSection,
} from "@/data/brand-pages";
import { cn } from "@/lib/utils";

/**
 * Apple-ийн iPad хуудаснаас санаа авсан брэнд хуудасны template
 * (/unitel, /univision). Бүтэц: promo зурвас → том хар гарчиг (Manrope) →
 * өнгөт ангиллын ribbon → ангилал бүрийн lineup section → footer.
 *
 * Картын зургийн оронд одоогоор "Photo 1, 2..." гэсэн placeholder талбай —
 * бодит зураг бэлэн болохоор солино.
 */

const RIBBON_ICONS: Record<BrandRibbonIcon, LucideIcon> = {
  smartphone: Smartphone,
  "credit-card": CreditCard,
  users: Users,
  layers: Layers,
  gift: Gift,
  package: Package,
  zap: Zap,
  router: Router,
  tv: Tv,
  clapperboard: Clapperboard,
  "monitor-play": MonitorPlay,
  sparkles: Sparkles,
};

export function BrandShowcase({ page }: { page: BrandPage }) {
  return (
    <main id="main-content" className="bg-background min-h-screen">
      {/* ============ PROMO STRIP — header-ийн доорх нимгэн зурвас ============ */}
      {page.promo && (
        <div className="bg-muted/60">
          <p className="mx-auto max-w-[1200px] px-4 py-3 text-center text-sm">
            {page.promo.text}{" "}
            <Link
              href={page.promo.href}
              className="text-primary inline-flex items-center gap-0.5 font-medium hover:underline"
            >
              {page.promo.ctaLabel}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </p>
        </div>
      )}

      {/* ============ HERO — том брэнд гарчиг (Manrope, үндсэн хар өнгө) ============ */}
      <section className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-[1200px] px-4 pt-14 pb-10 duration-1000 ease-out md:pt-24 md:pb-14">
        <h1 className="text-foreground text-6xl font-extrabold tracking-tight md:text-8xl">
          {page.name}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base md:text-lg">
          {page.tagline}
        </p>
      </section>

      {/* ============ RIBBON — өнгөт ангиллын товчлолууд ============ */}
      <nav aria-label={`${page.name} ангиллууд`} className="mx-auto max-w-[1200px] px-4 pb-16">
        <ul className="flex items-start gap-3 overflow-x-auto pb-2 lg:justify-center lg:gap-7">
          {page.ribbon.map((item) => {
            const Icon = RIBBON_ICONS[item.icon];
            return (
              <li key={item.label} className="shrink-0">
                <a
                  href={item.href}
                  className="group flex w-24 flex-col items-center gap-2.5 text-center"
                >
                  <span
                    className={cn(
                      "flex size-16 items-center justify-center rounded-2xl",
                      "transition-transform duration-700 ease-out group-hover:-translate-y-1",
                      item.tint,
                    )}
                  >
                    <Icon className="size-7" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="-mt-2 text-[10px] font-semibold text-red-500">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ============ LINEUP SECTIONS — ангилал бүрийн картууд ============ */}
      <div className="bg-muted/30">
        <div className="mx-auto max-w-[1200px] space-y-20 px-4 py-16 md:space-y-28 md:py-24">
          {page.sections.map((section, i) => (
            <LineupSection key={section.id} section={section} index={i} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function LineupSection({ section, index }: { section: BrandSection; index: number }) {
  // Картын тоонд тааруулж баганын тоог сонгоно — 2 карт бол том, 4+ бол нягт
  const gridClass =
    section.items.length <= 2
      ? "sm:grid-cols-2"
      : section.items.length === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    // scroll-mt — sticky header-ийн доор anchor зөв буухад
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
      <p className="text-muted-foreground/50 text-sm font-semibold tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id={`${section.id}-title`}
            className="text-foreground text-3xl font-extrabold tracking-tight md:text-5xl"
          >
            {section.title}
          </h2>
          {section.description && (
            <p className="text-muted-foreground mt-3 max-w-xl text-sm md:text-base">
              {section.description}
            </p>
          )}
        </div>
      </div>

      {section.items.length > 0 ? (
        <ul className={cn("mt-8 grid grid-cols-1 gap-x-4 gap-y-8", gridClass)}>
          {section.items.map((item, itemIndex) => (
            <li key={item.label}>
              <Link href={item.href} className="group block">
                {/* Зургийн placeholder — бодит зураг гартал "Photo N" нэртэй талбай */}
                <div className="border-border/60 bg-muted/50 relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border">
                  <ImageIcon
                    className="text-muted-foreground/40 size-8"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground/60 text-sm font-medium">
                    Photo {itemIndex + 1}
                  </span>
                  {item.badge && (
                    <span className="bg-background/80 text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-start justify-between gap-3 px-1">
                  <div>
                    <span className="text-foreground text-base font-bold md:text-lg">
                      {item.label}
                    </span>
                    {item.description && (
                      <p className="text-muted-foreground mt-0.5 text-sm">{item.description}</p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "border-border text-foreground/70 flex size-8 shrink-0 items-center justify-center rounded-full border",
                      "group-hover:bg-foreground group-hover:text-background group-hover:border-foreground",
                      "transition-colors duration-700 ease-out",
                    )}
                    aria-hidden="true"
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        // Агуулга нь хараахан ороогүй ангиллын placeholder
        <div className="border-border text-muted-foreground mt-8 flex flex-col items-center gap-3 rounded-3xl border border-dashed p-12 text-center text-sm">
          <Users className="text-muted-foreground/60 size-8" aria-hidden="true" />
          Мэдээлэл удахгүй нэмэгдэнэ.
        </div>
      )}
    </section>
  );
}
