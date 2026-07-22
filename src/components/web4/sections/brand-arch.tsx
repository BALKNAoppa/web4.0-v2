import { Reveal } from "@/components/web4/reveal";
import { SectionHeading } from "@/components/web4/section-heading";
import { BrowserFrame } from "@/components/web4/browser-frame";
import { DeckSection } from "@/components/web4/section-shell";
import { brandHouses, brandTypes } from "@/data/brand-architecture";

// Нэг гэр бүлийн ногоон → cyan shade — олон өнгө ашиглахгүй.
const SCALE = ["#7dfa5a", "#45c700", "#2ea9a0", "#8becff"];

export function BrandArchitecture() {
  return (
    <DeckSection id="brand" corner="tr" size="40vmin">
      <SectionHeading
        eyebrow="Brand architecture"
        title={
          <>
            Брэндүүд эцэг брэндтэйгээ{" "}
            <span className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
              хэрхэн холбогдох вэ?
            </span>
          </>
        }
        sub="Холбоосын хүчээр (No → Weak → Shared → Value) 4 төрөлд хуваагдана. Google-ийн жишээгээр."
      />

      {/* Two philosophies */}
      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {brandHouses.map((h, i) => (
          <Reveal key={h.id} delay={i * 120}>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 text-center">
              <p className="text-lg font-bold text-white">{h.label}</p>
              <p className="mt-2 text-sm text-white/55">{h.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 4 types */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {brandTypes.map((t, i) => {
          const accent = SCALE[i % SCALE.length];
          return (
            <Reveal key={t.id} delay={(i % 4) * 110}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{t.name}</h3>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                    style={{ backgroundColor: `${accent}22`, color: accent }}
                  >
                    {t.link}
                  </span>
                </div>
                <div className="mt-3">
                  <BrowserFrame
                    src={t.image}
                    label={t.externalProduct}
                    url={t.url}
                    imgClassName="aspect-[16/10]"
                  />
                </div>
                <p className="mt-3 text-xs text-white/50">{t.note}</p>
                {t.ours.length > 0 && (
                  <div className="mt-auto pt-3">
                    <p
                      className="text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: accent }}
                    >
                      Манай группт
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {t.ours.map((b) => (
                        <span
                          key={b}
                          className="rounded-full border px-2 py-0.5 text-[11px] font-semibold text-white"
                          style={{
                            borderColor: `${accent}55`,
                            backgroundColor: `${accent}1a`,
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </DeckSection>
  );
}
