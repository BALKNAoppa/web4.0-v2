"use client";

import Link from "next/link";
import { ArrowUp, Headphones, Smartphone, Sparkles, Tv, Wifi, type LucideIcon } from "lucide-react";

/** Hero доорх шаардлагатай quick action товчнууд */
const QUICK_ACTIONS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/main-packages", label: "Гэр интернэт", icon: Wifi },
  { href: "/unitel", label: "Дараа төлбөрт", icon: Smartphone },
  { href: "/entertainment/main", label: "Кино & ТВ", icon: Tv },
  { href: "/support", label: "Тусламж", icon: Headphones },
];

/**
 * Хувилбар 4 — Google маягийн chat-hero (visual mockup).
 * Төвлөрсөн том input + доор нь quick action товчнууд. Одоогоор зөвхөн
 * харагдац — submit үйлдэлгүй (бодит AI хойшлуулсан).
 */
export function ChatHero() {
  return (
    <section
      aria-label="Ухаалаг туслах"
      className="animate-in fade-in bg-muted/40 w-full duration-1000 ease-out"
    >
      <div className="mx-auto flex min-h-[68vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <span className="border-border bg-background text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
          <Sparkles className="text-primary size-3.5" aria-hidden="true" />
          Ухаалаг туслах
        </span>

        <h1 className="text-foreground mt-6 text-4xl font-extrabold tracking-tight text-balance md:text-6xl">
          Юугаар{" "}
          <span className="from-primary bg-linear-to-r to-[#2ad4ff] bg-clip-text text-transparent">
            туслах вэ?
          </span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-base text-pretty md:text-lg">
          Асуултаа бичихэд л болно — багц, интернэт, ТВ, төлбөр бүх зүйл нэг дороос.
        </p>

        {/* Chat input — visual mockup (submit үйлдэлгүй) */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="border-border bg-background focus-within:border-primary focus-within:ring-primary/20 mt-8 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm transition-all focus-within:ring-4"
        >
          <Sparkles className="text-primary size-5 shrink-0" aria-hidden="true" />
          <label htmlFor="chat-hero-input" className="sr-only">
            Асуултаа бичнэ үү
          </label>
          <input
            id="chat-hero-input"
            type="text"
            placeholder="Жишээ: гэрийн интернэт + ТВ хамгийн хямд багц"
            className="text-foreground placeholder:text-muted-foreground h-8 flex-1 bg-transparent text-sm outline-none md:text-base"
          />
          <button
            type="submit"
            aria-label="Илгээх"
            className="bg-primary text-primary-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-105"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </button>
        </form>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="border-border bg-background hover:border-primary/40 hover:bg-muted text-foreground/80 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              >
                <Icon className="text-primary size-4" aria-hidden="true" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
