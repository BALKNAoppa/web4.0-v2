import { PromoBanner } from "@/components/sections/promo-banner";
import { sectionBg } from "@/lib/section-bg";
import { cn } from "@/lib/utils";

export function PromoHero() {
  return (
    <section
      aria-label="Онцлох санал"
      className={cn(
        sectionBg.page,
        "w-full pt-[clamp(1rem,3svh,2rem)] md:h-[calc((100svh-var(--header-h))*0.6)]",
      )}
    >
      <PromoBanner fill />
    </section>
  );
}
