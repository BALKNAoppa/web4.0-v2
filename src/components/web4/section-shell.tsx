import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Corner = "tl" | "tr" | "bl" | "br";

/**
 * Стандарт хэсэг — full-width, доторх контент нь max-w-6xl төвлөрсөн.
 * Bubble-ууд одоо хэсэг бүрд биш, нэг `<BubbleField/>` background-д амьдардаг тул
 * энд сфер зурахгүй. `corner`/`size` нь хуучин API-тай нийцүүлж үлдээв (ашиглагдахгүй).
 */
export function DeckSection({
  id,
  className,
  children,
}: {
  id: string;
  corner?: Corner;
  size?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative w-full pt-[7vh] pb-20 md:pb-24">
      <div className={cn("mx-auto max-w-[1400px] px-6", className)}>{children}</div>
    </section>
  );
}
