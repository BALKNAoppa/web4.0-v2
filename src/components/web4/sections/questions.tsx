import { Reveal } from "@/components/web4/reveal";
import { SectionHeading } from "@/components/web4/section-heading";
import { DeckSection } from "@/components/web4/section-shell";
import { questions } from "@/data/web4-story";

export function Questions() {
  return (
    <DeckSection id="questions" corner="bl" size="46vmin">
      <SectionHeading
        eyebrow="Асуудал"
        title={
          <>
            Бидэнд шийдэх ёстой{" "}
            <span className="bg-gradient-to-r from-[#7dfa5a] to-[#2ad4ff] bg-clip-text text-transparent">
              асуудлууд
            </span>
          </>
        }
        sub="Whiteboard дээр гарч ирсэн үндсэн асуултууд — эндээс бүх зүйл эхэлсэн."
      />

      <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((q, i) => (
          <Reveal key={q.n} delay={(i % 3) * 120}>
            <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-500 hover:border-white/25">
              <span
                className="text-4xl font-black tracking-tight text-transparent md:text-5xl"
                style={{ WebkitTextStroke: "1px rgba(125,250,90,.45)" }}
              >
                {q.n}
              </span>
              <h3 className="mt-3 text-lg font-bold text-white">{q.title}</h3>
              <p className="mt-2 text-sm text-white/55">{q.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </DeckSection>
  );
}
