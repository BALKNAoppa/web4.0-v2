import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

import { entryTiles } from "@/data/home";
import { cn } from "@/lib/utils";

/**
 * Unitel, Univision-ий үндсэн үйлчилгээнүүдийн entry point-ууд —
 * Apple-ийн нүүрний шиг том tile: төвд гарчиг + тайлбар + CTA,
 * доор нь зургийн placeholder ("Photo N"). Хос багана — баруун багана
 * харанхуй, зүүн нь цайвар өнгөөр ээлжилнэ.
 */
export function ProductEntryGrid() {
  return (
    <section aria-label="Үндсэн үйлчилгээнүүд" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {entryTiles.map((tile, i) => {
            // Баруун багананд харанхуй tile — Apple-ийн нүүрний хэв маяг
            const dark = i % 2 === 1;
            return (
              <Link
                key={tile.title}
                href={tile.href}
                className={cn(
                  "group flex min-h-[26rem] flex-col items-center overflow-hidden rounded-3xl p-8 pt-12 text-center md:min-h-[32rem]",
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

                {/* Зургийн placeholder — бодит зураг гартал */}
                <div
                  className={cn(
                    "mt-8 flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-2xl border",
                    dark ? "border-background/15 bg-background/10" : "border-border/60 bg-background/60",
                  )}
                >
                  <ImageIcon
                    className={cn(
                      "size-8",
                      dark ? "text-background/40" : "text-muted-foreground/40",
                    )}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      dark ? "text-background/50" : "text-muted-foreground/60",
                    )}
                  >
                    Photo {i + 1}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
