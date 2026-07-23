import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/web4/reveal";
import { SectionHeading } from "@/components/web4/section-heading";
import { DeckSection } from "@/components/web4/section-shell";
import Link from "next/link";

export function SampleWeb() {
  return (
    <DeckSection id="sample" corner="bl" size="44vmin">
      <SectionHeading
        eyebrow="Sample"
        title={
          <>
            Эцэст нь —{" "}
            <span className="bg-linear-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
              бодит жишээ вэб
            </span>
          </>
        }
        sub="Дээрх зарчмаар угсарсан Univision Web 4.0 загвар"
      />

      <Reveal delay={100} variant="scale">
        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-white/12 bg-black/40 shadow-2xl shadow-black/60">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/3 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="mx-auto rounded-md bg-white/5 px-4 py-0.5 text-xs text-white/45">
              univision.mn
            </span>
          </div>
          <div className="relative h-[62vh] w-full bg-white">
            <iframe
              src="/"
              title="Univision Web 4.0 sample"
              loading="lazy"
              className="pointer-events-none h-full w-full"
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#45c700] px-7 py-3.5 font-semibold text-[#06210a] transition-transform duration-300 hover:scale-[1.04]"
          >
            Бодит вэбийг нээх
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Reveal>
    </DeckSection>
  );
}
