import { Check } from "lucide-react";
import { Reveal } from "@/components/web4/reveal";
import { SectionHeading } from "@/components/web4/section-heading";
import { DeckSection } from "@/components/web4/section-shell";
import { option1Header, webAppSplit } from "@/data/web4-story";

export function Solution() {
  return (
    <DeckSection id="solution" corner="bl" size="42vmin">
      <SectionHeading
        eyebrow="Шийдэл"
        title={
          <>
            Нэгдсэн нэг вэбсайт ={" "}
            <span className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
              Option 1
            </span>
          </>
        }
        sub="Байгууллагын алсын хараа зорилготой уялдуулбал — brand-driven, нэг нэгдсэн вэбсайт хамгийн тохиромжтой."
      />

      {/* L1 header mock */}
      <Reveal delay={80} variant="scale">
        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-2xl shadow-black/40">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="ml-3 text-[11px] tracking-wider text-white/40 uppercase">
              L1 Header
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 px-6 py-6">
            {option1Header.map((d, i) => (
              <span
                key={d}
                className={cnHeader(i === 0)}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Web / App split */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {webAppSplit.map((r, i) => (
          <Reveal key={r.channel} delay={i * 140}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-white">{r.channel}</h3>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/70">
                  {r.purpose}
                </span>
              </div>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full">
                <span
                  className="bg-gradient-to-r from-[#45c700] to-[#7dfa5a]"
                  style={{ width: `${r.newPct}%` }}
                />
                <span
                  className="bg-gradient-to-r from-[#1c7293] to-[#2ad4ff]"
                  style={{ width: `${r.existingPct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-white/60">
                <span>Шинэ хэрэглэгч {r.newPct}%</span>
                <span>Одоогийн {r.existingPct}%</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-white/60">
          <Check className="size-4 shrink-0 text-[#7dfa5a]" />
          Web — таниулах ба сонголт хийхэд; App — E2E self-service үйлчилгээнд.
        </p>
      </Reveal>
    </DeckSection>
  );
}

function cnHeader(primary: boolean) {
  return primary
    ? "text-lg font-extrabold tracking-tight text-white md:text-xl"
    : "text-lg font-medium tracking-tight text-white/55 transition-colors hover:text-white md:text-xl";
}
