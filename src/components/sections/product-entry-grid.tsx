import Link from "next/link";
import { ArrowRight, Gift, MonitorPlay, Package, Wifi, type LucideIcon } from "lucide-react";

import { entryTiles, type EntryTileIcon } from "@/data/home";
import { Reveal } from "@/components/web4/reveal";
import { cn } from "@/lib/utils";

/** Tile тус бүрийн product дүрс */
const ICONS: Record<EntryTileIcon, LucideIcon> = {
  wifi: Wifi,
  "monitor-play": MonitorPlay,
  package: Package,
  gift: Gift,
};

/** Дүрсний өнгөт дэвсгэр visual-ийн gradient — tint-ийн өнгөний гэр бүлтэй нийцүүлэв */
const VISUAL_GRADIENT: Record<EntryTileIcon, string> = {
  wifi: "from-sky-400 via-sky-500 to-blue-600",
  "monitor-play": "from-indigo-400 via-violet-500 to-purple-600",
  package: "from-amber-400 via-orange-500 to-orange-600",
  gift: "from-rose-400 via-red-500 to-red-600",
};

/**
 * Unitel, Univision-ий үндсэн үйлчилгээнүүдийн entry point-ууд —
 * Apple-ийн нүүрний шиг том tile: төвд гарчиг + тайлбар + CTA,
 * доор нь брэнд өнгөт дизайн visual (gradient + product дүрс). Хос багана —
 * баруун багана харанхуй, зүүн нь цайвар өнгөөр ээлжилнэ.
 */
export function ProductEntryGrid() {
  return (
    <section aria-label="Үндсэн үйлчилгээнүүд" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {entryTiles.map((tile, i) => {
            // Баруун багананд харанхуй tile — Apple-ийн нүүрний хэв маяг
            const dark = i % 2 === 1;
            const Icon = ICONS[tile.icon];
            return (
              <Reveal key={tile.title} delay={i * 90} className="h-full">
                <Link
                  href={tile.href}
                  className={cn(
                    "group flex h-full min-h-[26rem] flex-col items-center overflow-hidden rounded-3xl p-8 pt-12 text-center md:min-h-[32rem]",
                    dark ? "bg-foreground text-background" : "bg-muted/60 text-foreground",
                  )}
                >
                  <h3 className="text-3xl font-bold tracking-tight md:text-4xl">{tile.title}</h3>
                  <p
                    className={cn(
                      "mt-2 max-w-md text-sm md:text-base",
                      dark ? "text-background/70" : "text-muted-foreground",
                    )}
                  >
                    {tile.description}
                  </p>

                  <span
                    className={cn(
                      "mt-6 inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-6 text-sm font-semibold",
                      "transition-opacity duration-700 ease-out group-hover:opacity-85",
                      dark ? "bg-background text-foreground" : "bg-primary text-primary-foreground",
                    )}
                  >
                    {tile.ctaLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>

                  {/* Брэнд өнгөт дизайн visual — gradient панель + product дүрс */}
                  <div
                    className={cn(
                      "relative mt-8 flex w-full flex-1 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br",
                      VISUAL_GRADIENT[tile.icon],
                    )}
                  >
                    {/* Гэрлийн зөөлөн толбо */}
                    <div
                      aria-hidden
                      className="absolute -top-8 -left-8 size-32 rounded-full bg-white/25 blur-2xl"
                    />
                    <div
                      aria-hidden
                      className="absolute -right-6 -bottom-10 size-36 rounded-full bg-black/15 blur-2xl"
                    />
                    {/* Төвлөрсөн цагиргууд */}
                    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                      <div className="size-52 rounded-full border border-white/15" />
                    </div>
                    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                      <div className="size-36 rounded-full border border-white/20" />
                    </div>
                    {/* Glass icon disc — hover үед зөөлөн томроно */}
                    <div className="relative flex size-20 items-center justify-center rounded-3xl bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                      <Icon className="size-10 text-white" strokeWidth={1.6} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
