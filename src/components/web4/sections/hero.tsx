"use client";

import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/web4/reveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-sm text-white/70 backdrop-blur">
          <span className="size-2 rounded-full bg-[#45c700]" />
          Unitel · Univision
        </span>
      </Reveal>

      <Reveal delay={120}>
        <h1
          className="mt-8 text-6xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl"
          style={{ lineHeight: 1.02 }}
        >
          Web{" "}
          <span className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
            4.0
          </span>
        </h1>
      </Reveal>

      <Reveal delay={260}>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/65 md:text-xl">
          Асуудлаас судалгаа, судалгаанаас нэгдсэн шийдэл хүртэл — бидний
          вэбсайтын стратегийн аялал.
        </p>
      </Reveal>

      <Reveal delay={420}>
        <button
          type="button"
          data-deck-next
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#45c700] px-6 py-3 font-semibold text-[#06210a] transition-transform duration-300 hover:scale-[1.04]"
        >
          Аялалаа эхлүүлэх
        </button>
      </Reveal>

      <button
        type="button"
        data-deck-next
        aria-label="Дараах слайд"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </button>
    </section>
  );
}
