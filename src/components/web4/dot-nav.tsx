"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type NavSection = { id: string; label: string };

/** Fixed vertical dot nav; highlights the section currently in view. */
export function DotNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    // Scroll-spy: the section crossing the viewport's centre line is active.
    // Robust for very tall (sticky/300vh) as well as short sections.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { threshold: 0, rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Хэсгийн навигаци"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3.5 md:flex"
    >
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={on ? "true" : undefined}
            className="group relative flex items-center"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-500",
                on
                  ? "h-3 w-3 bg-gradient-to-br from-[#7dfa5a] to-[#2ad4ff]"
                  : "h-2 w-2 bg-white/25 group-hover:bg-white/50",
              )}
            />
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-md border border-white/10 bg-[#0b1424]/90 px-2 py-1 text-xs text-white/80 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
