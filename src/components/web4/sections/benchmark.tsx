import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/web4/reveal";
import { SectionHeading } from "@/components/web4/section-heading";
import { BrowserFrame } from "@/components/web4/browser-frame";
import { DeckSection } from "@/components/web4/section-shell";
import { benchmarks } from "@/data/web4-story";

export function Benchmark() {
  const featured = benchmarks.filter((b) => b.featured);

  return (
    <DeckSection id="benchmark" corner="bl" size="50vmin">
      <SectionHeading
        eyebrow="Benchmark"
        title={
          <>
            Google, Apple{" "}
            <span className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
              болон бусад
            </span>
          </>
        }
        sub="Дэлхийн тэргүүлэгч группүүд вэбээ хэрхэн бүтэцлэдэг вэ — судалгааны үр дүн."
      />

      {/* Featured: Apple + Google */}
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {featured.map((b, i) => (
          <Reveal key={b.id} delay={i * 140} variant="scale">
            <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="size-3 rounded-full bg-gradient-to-br from-[#7dfa5a] to-[#2ad4ff]" />
                  <h3 className="text-xl font-bold text-white">{b.name}</h3>
                </div>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-bold tracking-wider text-white/65 uppercase">
                  {b.tag}
                </span>
              </div>
              <div className="mt-4">
                <BrowserFrame src={b.image} label={b.name} url={b.url} />
              </div>
              <p className="mt-4 text-sm text-white/60 md:text-base">{b.note}</p>
              {b.url && (
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-white/70 transition-colors hover:text-white"
                >
                  Live site нээх <ArrowUpRight className="size-4" />
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </DeckSection>
  );
}
