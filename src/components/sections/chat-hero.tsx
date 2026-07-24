"use client";

import Link from "next/link";
import { ArrowUp, Sparkles, SquareDashed } from "lucide-react";

import { GlowRing } from "@/components/ui/glow-ring";

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
 * Бараан дэвсгэр + эргэлддэг гэрэлт цагираг (GlowRing) + neon input. Submit
 * үйлдэлгүй (бодит AI хойшлуулсан).
 */
export function ChatHero() {
  return (
    <section
      aria-label="Ухаалаг туслах"
      className="animate-in fade-in relative w-full overflow-hidden bg-[#05070d] duration-1000 ease-out"
    >
      {/* Эргэлддэг гэрэлт цагираг (eclipse) */}
      <GlowRing />

      <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 backdrop-blur">
          <Sparkles className="size-3.5 text-[#7dfa5a]" aria-hidden="true" />
          Ухаалаг туслах
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance text-white md:text-6xl">
          Юугаар{" "}
          <span className="from-primary bg-linear-to-r to-[#2ad4ff] bg-clip-text text-transparent">
            туслах вэ?
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-pretty text-white/60 md:text-lg">
          Та асуултаа бичихэд л хангалттай — багц, интернэт, ТВ, төлбөр гээд бүгд нэг дор гэх мэт
          text байна.
        </p>

        {/* Chat input — neon gradient хүрээ + гэрэл */}
        <div className="relative mt-8 w-full">
          {/* Ард талын бүдэг гэрэл (glow) */}
          <div
            aria-hidden
            className="animate-neon-pan pointer-events-none absolute -inset-1 rounded-[1.4rem] opacity-60 blur-xl"
            style={{ background: NEON, backgroundSize: "200% 100%" }}
          />
          {/* Gradient хүрээ */}
          <div
            className="animate-neon-pan relative rounded-2xl p-[2px] shadow-lg"
            style={{ background: NEON, backgroundSize: "200% 100%" }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full items-center gap-3 rounded-[calc(1rem-2px)] bg-[#0b0e16]/85 px-4 py-3 backdrop-blur"
            >
              <Sparkles className="size-5 shrink-0 text-[#7dfa5a]" aria-hidden="true" />
              <label htmlFor="chat-hero-input" className="sr-only">
                Асуултаа бичнэ үү
              </label>
              <input
                id="chat-hero-input"
                type="text"
                placeholder="Жишээ: гэрийн интернэт + ТВ хамгийн хямд багц"
                className="h-8 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40 md:text-base"
              />
              <button
                type="submit"
                aria-label="Илгээх"
                className="bg-primary text-primary-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-105"
              >
                <ArrowUp className="size-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick actions — жижиг дөрвөлжин dark-glass карт (хандалтаас хамааран солигдоно) */}
        <div className="mt-8 w-full">
          <p className="mb-3 flex items-center justify-center gap-1.5 text-sm font-medium text-white/45">
            Хэрэглэгчийн их ашигласан topic болон action button харагдана
          </p>
          <div className="grid grid-cols-4 gap-2.5 md:grid-cols-8">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-1.5 text-center transition-colors hover:border-white/25 hover:bg-white/10"
              >
                <SquareDashed className="size-5 text-[#7dfa5a]" aria-hidden="true" />
                <span className="text-[11px] leading-tight font-medium text-white/70 group-hover:text-white">
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
