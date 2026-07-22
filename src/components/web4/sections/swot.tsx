"use client";

import { useState } from "react";
import { Plus, Minus, Sparkles, Shield, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/web4/reveal";
import { SectionHeading } from "@/components/web4/section-heading";
import { DeckSection } from "@/components/web4/section-shell";
import { option1Swot } from "@/data/web4-story";
import { cn } from "@/lib/utils";

type Quad = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  items: readonly string[];
};

const QUADS: Quad[] = [
  { id: "s", title: "Давуу тал", icon: Plus, color: "#45c700", items: option1Swot.strengths },
  { id: "w", title: "Сул тал", icon: Minus, color: "#9aa4b2", items: option1Swot.weaknesses },
  { id: "o", title: "Боломж", icon: Sparkles, color: "#2ad4ff", items: option1Swot.opportunities },
  { id: "t", title: "Аюул", icon: Shield, color: "#9aa4b2", items: option1Swot.threats },
];

export function Swot() {
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <DeckSection id="swot" corner="tr" size="34vmin">
      <SectionHeading
        eyebrow="SWOT"
        title={
          <>
            Option 1 —{" "}
            <span className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
              давуу ба сул тал
            </span>
          </>
        }
        sub="Квадрант дээр дарж онцлон харна уу."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {QUADS.map((q, i) => {
          const dimmed = focus !== null && focus !== q.id;
          const active = focus === q.id;
          return (
            <Reveal key={q.id} delay={(i % 2) * 120}>
              <button
                type="button"
                onClick={() => setFocus((f) => (f === q.id ? null : q.id))}
                className={cn(
                  "group h-full w-full rounded-2xl border bg-white/[0.03] p-6 text-left transition-all duration-500",
                  active ? "scale-[1.02]" : "hover:-translate-y-1",
                  dimmed ? "opacity-45" : "opacity-100",
                )}
                style={{
                  borderColor: active ? q.color : "rgba(255,255,255,0.1)",
                  boxShadow: active ? `0 0 44px ${q.color}33` : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 place-items-center rounded-xl"
                    style={{ backgroundColor: `${q.color}22`, color: q.color }}
                  >
                    <q.icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">{q.title}</h3>
                  <span className="ml-auto text-sm font-semibold text-white/35">
                    {q.items.length}
                  </span>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {q.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-white/75">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: q.color }}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              </button>
            </Reveal>
          );
        })}
      </div>
    </DeckSection>
  );
}
