import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  Gift,
  Globe,
  MonitorPlay,
  Package,
  Plane,
  Router,
  Smartphone,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { type EntryTile, type EntryTileIcon } from "@/data/home";
import { Reveal } from "@/components/web4/reveal";
import { cn } from "@/lib/utils";

/** Tile тус бүрийн product дүрс */
const ICONS: Record<EntryTileIcon, LucideIcon> = {
  wifi: Wifi,
  "monitor-play": MonitorPlay,
  package: Package,
  gift: Gift,
  globe: Globe,
  smartphone: Smartphone,
  plane: Plane,
  clapperboard: Clapperboard,
  router: Router,
};

/** Дүрсний өнгөт дэвсгэр visual-ийн gradient — tint-ийн өнгөний гэр бүлтэй нийцүүлэв */
const VISUAL_GRADIENT: Record<EntryTileIcon, string> = {
  wifi: "from-sky-400 via-sky-500 to-blue-600",
  "monitor-play": "from-indigo-400 via-violet-500 to-purple-600",
  package: "from-amber-400 via-orange-500 to-orange-600",
  gift: "from-rose-400 via-red-500 to-red-600",
  globe: "from-indigo-400 via-indigo-500 to-blue-700",
  smartphone: "from-amber-400 via-amber-500 to-orange-600",
  plane: "from-rose-400 via-rose-500 to-red-600",
  clapperboard: "from-violet-400 via-purple-500 to-fuchsia-600",
  router: "from-emerald-400 via-emerald-500 to-teal-600",
};

/**
 * Брэндийн үндсэн үйлчилгээнүүдийн entry point-ууд — Apple-ийн нүүрний шиг том
 * tile: төвд гарчиг + тайлбар + CTA, доор нь брэнд өнгөт дизайн visual
 * (gradient + product дүрс). Бүх карт ИЖИЛ цайвар дэвсгэртэй — өмнөх
 * харанхуй/цайвар ээлжлэлийг болиулсан.
 *
 * `tiles` нь брэндээс хамаарна: `unitelEntryTiles` / `univisionEntryTiles`.
 */
export function ProductEntryGrid({ tiles }: { tiles: EntryTile[] }) {
  return (
    <section aria-label="Үндсэн үйлчилгээнүүд" className="bg-background py-16 md:py-18">
      <div className="mx-auto max-w-300 px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tiles.map((tile, i) => {
            const Icon = ICONS[tile.icon];
            return (
              <Reveal key={tile.title} delay={i * 90} className="h-full">
                <Link
                  href={tile.href}
                  className="group bg-muted/60 text-foreground flex h-full min-h-104 flex-col items-center overflow-hidden rounded-3xl p-8 pt-12 text-center md:min-h-128"
                >
                  <h3 className="text-3xl font-bold tracking-tight md:text-4xl">{tile.title}</h3>
                  <p className="text-muted-foreground mt-2 max-w-md text-sm md:text-base">
                    {tile.description}
                  </p>

                  <span className="bg-primary text-primary-foreground mt-6 inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-6 text-sm font-semibold transition-opacity duration-700 ease-out group-hover:opacity-85">
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
