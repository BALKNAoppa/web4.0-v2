"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";
import { Hero } from "@/components/web4/sections/hero";
import { Questions } from "@/components/web4/sections/questions";
import { Research } from "@/components/web4/sections/research";
import { Benchmark } from "@/components/web4/sections/benchmark";
import { BrandArchitecture } from "@/components/web4/sections/brand-arch";
import { Convergence } from "@/components/web4/sections/convergence";
import { Solution } from "@/components/web4/sections/solution";
import { Swot } from "@/components/web4/sections/swot";
import { SampleWeb } from "@/components/web4/sections/sample-web";

type Corner = "tl" | "tr" | "bl" | "br";
type SlideBubbleCfg = { corner: Corner; size: string; opacity?: number };

type Slide = {
  id: string;
  label: string;
  Comp: ComponentType<{ active?: boolean; step?: number }>;
  bubbles: SlideBubbleCfg[];
  steps?: number;
};

const SLIDES: Slide[] = [
  {
    id: "hero",
    label: "Эхлэл",
    Comp: Hero,
    bubbles: [
      { corner: "tr", size: "60vmin" },
      { corner: "tl", size: "50vmin", opacity: 0.72 },
    ],
  },
  {
    id: "questions",
    label: "Асуудал",
    Comp: Questions,
    bubbles: [
      { corner: "bl", size: "46vmin" },
      { corner: "tr", size: "38vmin", opacity: 0.7 },
    ],
  },
  {
    id: "research",
    label: "Судалгаа",
    Comp: Research,
    bubbles: [{ corner: "br", size: "40vmin" }],
  },
  {
    id: "benchmark",
    label: "Benchmark",
    Comp: Benchmark,
    bubbles: [{ corner: "bl", size: "34vmin", opacity: 0.6 }],
  },
  {
    id: "brand",
    label: "Brand architecture",
    Comp: BrandArchitecture,
    bubbles: [{ corner: "tr", size: "40vmin" }],
  },
  {
    id: "intent",
    label: "Intent → Web 4.0",
    Comp: Convergence,
    bubbles: [],
    steps: 3,
  },
  { id: "solution", label: "Шийдэл", Comp: Solution, bubbles: [{ corner: "br", size: "44vmin" }] },
  { id: "swot", label: "SWOT", Comp: Swot, bubbles: [{ corner: "tr", size: "36vmin" }] },
  {
    id: "sample",
    label: "Sample web",
    Comp: SampleWeb,
    bubbles: [{ corner: "bl", size: "46vmin" }],
  },
];

const LAST = SLIDES.length - 1;

/** Web 4.0 — keyboard-driven horizontal swipe deck. */
export function Web4Scroll() {
  const [pos, setPos] = useState({ i: 0, s: 0 });
  const index = pos.i;
  const step = pos.s;

  const goto = useCallback(
    (i: number) => setPos({ i: Math.min(Math.max(i, 0), LAST), s: 0 }),
    [],
  );
  const next = useCallback(
    () =>
      setPos(({ i, s }) => {
        const maxStep = (SLIDES[i].steps ?? 1) - 1;
        if (s < maxStep) return { i, s: s + 1 };
        if (i < LAST) return { i: i + 1, s: 0 };
        return { i, s };
      }),
    [],
  );
  const prev = useCallback(
    () =>
      setPos(({ i, s }) => {
        if (s > 0) return { i, s: s - 1 };
        if (i > 0) return { i: i - 1, s: 0 };
        return { i, s };
      }),
    [],
  );

  // Keyboard navigation (arrows / space / page)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goto(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goto(LAST);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goto]);

  // Lock page scroll while the deck is mounted (only on /web4)
  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  // Click delegation: data-deck-next / data-deck-prev / data-deck-goto
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-deck-next],[data-deck-prev],[data-deck-goto]",
      );
      if (!el) return;
      if (el.dataset.deckGoto != null) goto(Number(el.dataset.deckGoto));
      else if (el.dataset.deckPrev != null) prev();
      else next();
    },
    [next, prev, goto],
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#05080f] text-white" onClick={onClick}>
      {/* Fixed cosmic background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(1200px_800px_at_70%_-10%,#10233f_0%,transparent_55%),radial-gradient(1000px_700px_at_15%_110%,#0c2a24_0%,transparent_55%),linear-gradient(160deg,#0a1424,#05080f)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.5), transparent), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,.35), transparent), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,.4), transparent), radial-gradient(1.5px 1.5px at 90% 60%, rgba(255,255,255,.4), transparent), radial-gradient(1px 1px at 10% 75%, rgba(255,255,255,.3), transparent)",
        }}
      />

      {/* Bubble background track — clipped only at the screen edges (swipe-continuous) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700"
          style={{
            width: `${SLIDES.length * 100}vw`,
            transform: `translateX(-${index * 100}vw)`,
            transitionTimingFunction: "cubic-bezier(0.7, 0, 0.2, 1)",
          }}
        >
          {SLIDES.map((s) => (
            <div key={s.id} className="relative h-full w-screen shrink-0">
              {s.bubbles.map((b, j) => (
                <SlideBubble key={j} {...b} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal content track */}
      <div
        className="relative z-10 flex h-full transition-transform duration-700"
        style={{
          width: `${SLIDES.length * 100}vw`,
          transform: `translateX(-${index * 100}vw)`,
          transitionTimingFunction: "cubic-bezier(0.7, 0, 0.2, 1)",
        }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className="relative h-full w-screen shrink-0 overflow-hidden"
            aria-hidden={i !== index}
          >
            {/* content — scrolls vertically if taller than the screen */}
            <div className="no-scrollbar relative z-10 h-full overflow-y-auto">
              <div className="min-h-full">
                <s.Comp active={i === index} step={i === index ? step : 0} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top progress bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 h-[3px]">
        <div
          className="h-full origin-left transition-transform duration-700"
          style={{
            transform: `scaleX(${index / LAST})`,
            background: "linear-gradient(90deg,#7dfa5a,#45c700,#2ad4ff)",
          }}
        />
      </div>

      {/* Dot navigation */}
      <nav
        aria-label="Слайд навигаци"
        className="absolute bottom-6 left-1/2 z-40 hidden -translate-x-1/2 flex-row items-center gap-3.5 md:flex"
      >
        {SLIDES.map((s, i) => {
          const on = i === index;
          return (
            <button
              key={s.id}
              type="button"
              data-deck-goto={i}
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
              <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-md border border-white/10 bg-[#0b1424]/90 px-2 py-1 text-xs whitespace-nowrap text-white/80 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                {s.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Controls — bottom-right (эхний загвар шиг) */}
      <div className="absolute right-6 bottom-6 z-40 flex items-center gap-2">
        <span className="mr-1 hidden text-xs text-white/50 tabular-nums sm:inline">
          {index + 1} / {SLIDES.length}
        </span>
        <button
          type="button"
          data-deck-prev
          disabled={index === 0}
          className="inline-flex h-10 items-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/12 disabled:opacity-35"
        >
          ← Back
        </button>
        {index === LAST ? (
          <button
            type="button"
            data-deck-goto={0}
            className="inline-flex h-10 items-center rounded-full bg-[#45c700] px-4 text-sm font-semibold text-[#06210a] transition-colors hover:bg-[#7dfa5a]"
          >
            Дахин ↺
          </button>
        ) : (
          <button
            type="button"
            data-deck-next
            className="inline-flex h-10 items-center rounded-full bg-[#45c700] px-4 text-sm font-semibold text-[#06210a] transition-colors hover:bg-[#7dfa5a]"
          >
            Дараах →
          </button>
        )}
      </div>
    </div>
  );
}

function SlideBubble({ corner, size, opacity = 0.8 }: SlideBubbleCfg) {
  const off = `calc(${size} * -0.28)`;
  const pos =
    corner === "tr"
      ? { top: off, right: off }
      : corner === "tl"
        ? { top: off, left: off }
        : corner === "br"
          ? { bottom: off, right: off }
          : { bottom: off, left: off };
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-0 rounded-full bg-contain bg-center bg-no-repeat"
      style={{
        width: size,
        height: size,
        opacity,
        backgroundImage: "url('/bubble.png')",
        ...pos,
      }}
    />
  );
}
