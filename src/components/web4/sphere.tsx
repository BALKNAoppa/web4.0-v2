import { cn } from "@/lib/utils";

/**
 * Web 4.0 sphere — нэг ижил ногоон→cyan шилэн бөмбөлөг.
 * Дэк даяар (bubble, core, фон) энэ нэг gradient-ийг ашиглаж өнгийг цөөлнө.
 */
export const SPHERE_BG =
  "radial-gradient(circle at 32% 27%, rgba(255,255,255,.95), rgba(255,255,255,.22) 17%, transparent 44%), radial-gradient(circle at 72% 76%, rgba(69,199,10,.58), transparent 60%), radial-gradient(circle at 36% 60%, rgba(42,212,255,.5), transparent 60%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.05), rgba(4,10,18,.30) 92%)";

export const SPHERE_SHADOW =
  "inset 0 0 30px rgba(255,255,255,.16), 0 18px 44px rgba(0,0,0,.45), 0 0 46px rgba(45,190,140,.35)";

/** Тод сфер (foreground). */
export function Sphere({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn("block rounded-full", className)}
      style={{ background: SPHERE_BG, boxShadow: SPHERE_SHADOW, ...style }}
    />
  );
}

