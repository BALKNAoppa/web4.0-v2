import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Corner = "tl" | "tr" | "bl" | "br";

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
