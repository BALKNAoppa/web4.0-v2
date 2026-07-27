"use client";

import Link from "next/link";
import { ArrowUp, Sparkles, SquareDashed } from "lucide-react";

import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

// Hero доорх quick action карт — placeholder ("Sample"). Хэрэглэгчийн хандалтаас
// хамааран бодит topic/action-оор солигдоно. Icon бүгд нэг default (SquareDashed).
const QUICK_ACTIONS: { href: string; label: string }[] = [
  { href: "/main-packages", label: "Sample 1" },
  { href: "/unitel", label: "Sample 2" },
  { href: "/entertainment/main", label: "Sample 3" },
  { href: "/univision-go", label: "Sample 4" },
  { href: "/devices", label: "Sample 5" },
  { href: "/campaigns", label: "Sample 6" },
  { href: "/univision", label: "Sample 7" },
  { href: "/support", label: "Sample 8" },
];

/** Neon gradient (input-ийн хүрээ/гэрэлд) — брэнд ногоон → cyan → violet */
const NEON = "linear-gradient(90deg,#45c700,#2ad4ff,#a855f7,#45c700)";

/**
 * Хувилбар 4 — Google маягийн chat-hero (visual mockup).
 * Theme-aware дэвсгэр (light/dark, project token-оор) + MagicUI Interactive Grid
 * Pattern (hover-т нүд бүр гэрэлтэнэ) + neon input. Submit үйлдэлгүй (бодит AI хойшлуулсан).
 */
export function ChatHero() {
  return (
    <section
      aria-label="Ухаалаг туслах"
      className="bg-background animate-in fade-in relative w-full overflow-hidden duration-1000 ease-out"
    >
      {/* Background — MagicUI Interactive Grid Pattern (hover-оор нүд бүр гэрэлтэнэ).
          Төв рүү харагдаж, захаараа бүдгэрэх radial mask-тай. */}
      <InteractiveGridPattern
        width={40}
        height={40}
        squares={[42, 24]}
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur">
          <Sparkles className="text-primary size-3.5" aria-hidden="true" />
          Ухаалаг туслах
        </span>

        <h1 className="text-foreground mt-6 text-4xl font-extrabold tracking-tight text-balance md:text-6xl">
          Танд юугаар <span className="from-primary bg-clip-text text-[#45c700]">туслах вэ?</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-base text-pretty md:text-lg">
          Та асуултаа бичихэд л хангалттай — багц, интернэт, ТВ, төлбөр гээд бүгд нэг дор гэх мэт
          text байна.
        </p>

        {/* Chat input — neon gradient хүрээ + гэрэл (радиус томруулсан) */}
        <div className="relative mt-8 w-full">
          {/* Ард талын бүдэг гэрэл (glow) */}
          <div
            aria-hidden
            className="animate-neon-pan pointer-events-none absolute -inset-1 rounded-[2rem] opacity-60 blur-xl"
            style={{ background: NEON, backgroundSize: "200% 100%" }}
          />
          {/* Gradient хүрээ */}
          <div
            className="animate-neon-pan relative rounded-[1.75rem] p-[2px] shadow-lg"
            style={{ background: NEON, backgroundSize: "200% 100%" }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-card/85 flex w-full items-center gap-3 rounded-[calc(1.75rem-2px)] px-4 py-3 backdrop-blur"
            >
              <Sparkles className="text-primary size-5 shrink-0" aria-hidden="true" />
              <label htmlFor="chat-hero-input" className="sr-only">
                Асуултаа бичнэ үү
              </label>
              <input
                id="chat-hero-input"
                type="text"
                placeholder="Жишээ: гэр интернэт + ТВ хамгийн хямд багц"
                className="text-foreground placeholder:text-muted-foreground h-8 flex-1 bg-transparent text-sm outline-none md:text-base"
              />
              <button
                type="submit"
                aria-label="Илгээх"
                className="bg-primary text-primary-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-105"
              >
                <ArrowUp className="size-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick actions — жижиг дөрвөлжин карт (хандалтаас хамааран солигдоно) */}
        <div className="mt-8 w-full">
          <p className="text-muted-foreground mb-3 flex items-center justify-center gap-1.5 text-sm font-medium">
            Хэрэглэгчийн их ашигласан topic болон action button харагдана
          </p>
          <div className="grid grid-cols-4 gap-2.5 md:grid-cols-8">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group border-border bg-card/60 hover:border-primary/40 hover:bg-card flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border p-1.5 text-center transition-colors"
              >
                <SquareDashed className="text-primary size-5" aria-hidden="true" />
                <span className="text-muted-foreground group-hover:text-foreground text-[11px] leading-tight font-medium">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
