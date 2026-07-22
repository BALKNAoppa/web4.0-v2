import { Reveal } from "@/components/web4/reveal";
import { CountUp } from "@/components/web4/count-up";
import { SectionHeading } from "@/components/web4/section-heading";
import { DeckSection } from "@/components/web4/section-shell";
import { researchStats, researchImplication } from "@/data/web4-story";

export function Research() {
  return (
    <DeckSection id="research" corner="tr" size="34vmin">
      <SectionHeading
        eyebrow="Дэлхийн судалгаа"
        title={
          <>
            Дэлхийд{" "}
            <span className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
              яаж байна вэ?
            </span>
          </>
        }
        sub="Эдгээр асуудлыг шийдэхийн тулд томоохон компаниудын чиг хандлагыг судаллаа."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {researchStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 140} variant="scale">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-4 text-sm text-white/70 md:text-base">{s.label}</p>
              <p className="mt-4 text-xs font-semibold tracking-wider text-white/35 uppercase">
                {s.source}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-6 rounded-2xl border border-[#45c700]/25 bg-[#45c700]/[0.06] p-7 md:p-8">
          <p className="text-xs font-bold tracking-[0.28em] text-[#7dfa5a] uppercase">
            Дүгнэлт
          </p>
          <p className="mt-3 text-lg text-white/85 text-balance md:text-2xl">
            {researchImplication}
          </p>
        </div>
      </Reveal>
    </DeckSection>
  );
}
