"use client";

import { cn } from "@/lib/utils";

export function CarouselDots({
  total,
  index,
  onSelect,
  label,
  className,
}: {
  total: number;
  index: number;
  onSelect: (i: number) => void;
  label: string;
  className?: string;
}) {
  if (total < 2) return null;

  return (
    <div className={cn("flex h-2 shrink-0 items-center justify-center gap-4", className)}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${i + 1}-р ${label}`}
          aria-current={i === index ? "true" : undefined}
          className={cn(
            "relative h-2 rounded-full transition-all duration-300 ease-out",
            "before:absolute before:-inset-2 before:content-['']",
            "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            i === index ? "bg-foreground w-8" : "bg-foreground/25 hover:bg-foreground/45 w-2",
          )}
        />
      ))}
    </div>
  );
}
