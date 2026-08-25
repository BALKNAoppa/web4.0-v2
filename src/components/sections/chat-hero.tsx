"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp, Check, ChevronDown, Headphones, Sparkles } from "lucide-react";

import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { SmartLink } from "@/components/layout/smart-link";
import { mobilePlans } from "@/data/mobile-plans";
import {
  assistantQuestions,
  matchQuestion,
  TRENDING_TOPIC_COUNT,
  trendingTopicLabel,
  type AssistantQuestion,
  type AssistantResult,
  type DiagnosticResult,
  type EscalateResult,
  type PlansResult,
  type TimelineResult,
} from "@/data/hero-assistant";
import { cn } from "@/lib/utils";
const NEON = "linear-gradient(90deg,#45c700,#2ad4ff,#a855f7,#45c700)";
const LOADING_MS = 700;

type Block = {
  key: number;
  asked: string;
  matched: AssistantQuestion | null;
  status: "loading" | "ready";
};
export function ChatHero({ heroRest = false }: { heroRest?: boolean } = {}) {
  const questions = assistantQuestions;

  const [input, setInput] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const nextKey = useRef(0);
  const latestRef = useRef<HTMLElement | null>(null);

  const ask = useCallback(
    (text: string) => {
      const asked = text.trim();
      if (!asked) return;

      const key = nextKey.current++;
      setBlocks((prev) => [
        ...prev,
        { key, asked, matched: matchQuestion(asked, questions), status: "loading" },
      ]);
      setExpandedKey(key);
      setInput("");

      window.setTimeout(() => {
        setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, status: "ready" } : b)));
      }, LOADING_MS);
    },
    [questions],
  );

  useEffect(() => {
    if (blocks.length === 0) return;
    latestRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [blocks.length]);

  return (
    <section
      aria-label="Ухаалаг сонголт"
      className="bg-background animate-in fade-in relative w-full overflow-hidden duration-1000 ease-out"
    >
      <InteractiveGridPattern
        width={40}
        height={40}
        squares={[42, 24]}
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
      />
      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-5 text-center sm:py-8 md:py-10 [@media(max-height:1024px)]:py-1",
          heroRest
            ? "min-h-[calc((100svh-var(--header-h))*0.28)] md:min-h-[calc((100svh-var(--header-h))*0.4)]"
            : "min-h-[34svh] sm:min-h-[44svh] md:min-h-[46svh]",
        )}
      >
        <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur">
          <Sparkles className="text-primary size-3.5" aria-hidden="true" />
          Highlight keyword байна
        </span>

        <h1 className="text-foreground mt-4 text-2xl font-extrabold tracking-tight text-balance sm:mt-6 sm:text-3xl md:text-4xl [@media(max-height:1024px)]:mt-2">
          AI <span className="from-primary bg-clip-text text-[#45c700]">assistant</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm text-pretty sm:mt-4 sm:text-base md:text-lg [@media(max-height:1024px)]:mt-1.5">
          Ai assistant-н Capability-г сайн госон text энд байрлана.
        </p>
        <div className="relative mt-5 w-full sm:mt-8 [@media(max-height:1024px)]:mt-3">
          <div
            aria-hidden
            className="animate-neon-pan pointer-events-none absolute -inset-1 rounded-4xl opacity-60 blur-xl"
            style={{ background: NEON, backgroundSize: "200% 100%" }}
          />
          <div
            className="animate-neon-pan relative rounded-[1.75rem] p-0.5 shadow-lg"
            style={{ background: NEON, backgroundSize: "200% 100%" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="bg-card/85 flex w-full items-center gap-3 rounded-[calc(1.75rem-2px)] px-4 py-2.5 backdrop-blur"
            >
              <Sparkles className="text-primary size-5 shrink-0" aria-hidden="true" />
              <label htmlFor="chat-hero-input" className="sr-only">
                Асуултаа бичнэ үү
              </label>
              <input
                id="chat-hero-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="CTA чиглүүлсэн placeholder той байна"
                className="text-foreground placeholder:text-muted-foreground h-8 flex-1 bg-transparent text-sm outline-none md:text-base"
              />
              <button
                type="submit"
                aria-label="Илгээх"
                className="bg-primary text-primary-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-105"
              >
                <ArrowUp className="size-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* Их хайгдсан сэдвүүд — зөвхөн хоосон төлөвт. Асуулт асуумагц үр дүн
            нь гол болох тул мөр замаас гарч, өндрөө буцааж өгнө. */}
        {blocks.length === 0 && <TrendingTopics />}

        {/*Хэрэглэгчийн хайж байгаа topic-д тулгуурлаад хариалтууд dynamic байдлаар suggest хийнэ*/}
        {blocks.length > 0 && (
          <div className="mt-4 w-full space-y-3">
            {blocks.map((block, i) => (
              <ResultBlock
                key={block.key}
                ref={i === blocks.length - 1 ? latestRef : undefined}
                block={block}
                expanded={expandedKey === block.key}
                onToggle={() => setExpandedKey(expandedKey === block.key ? null : block.key)}
                questions={questions}
                onPick={ask}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// =====================================================================
// TRENDING TOPICS — input-ийн доорх "их хайгдсан сэдэв"-ийн ХОЁР МӨР
// =====================================================================
/**
 * ЯГ 2 МӨР, хэвтээ гүйлгээгүй. `grid` (`flex-wrap` БИШ) — wrap нь өргөнөөс
 * хамаарч мөрөө үсэргэдэг, мобайл дээр 5 чип нь 5 мөр болно. Grid нь баганыг
 * хатуу тогтоодог тул мөр ямагт 2, зөвхөн харагдах чипний тоо өөрчлөгдөнө:
 * мобайл эхний 2 · sm эхний 4 · md+ бүх 5. Багана 2/4/6, чип бүр 2 багана
 * эзэлнэ — ингэснээр md-ийн 2 дахь мөрийн 2 чипийг хагас баганаар голлуулж
 * болно (`md:col-start-2`).
 *
 * ⚠️ 2 мөр = 60px, 1 мөрөөс ~34px илүү. Үүнийг багтаахын тулд босоо зай
 * хумих `max-height` босгыг 720 → 1024px болгосон. 3 дахь мөрийн зай АЛГА.
 *
 * ⚠️ Дарагдахгүй (`<li>`, товч БИШ) — шошго нь placeholder тул `ask()` дуудвал
 * "таньсангүй" fallback гарна. Бодит сэдэв ирэхэд товч болно.
 */
function TrendingTopics() {
  return (
    // `aria-hidden` — ижил placeholder-ийг 5 удаа уншуулах нь SR-д утгагүй.
    <ul
      aria-hidden="true"
      className="mt-2.5 grid w-full grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-4 md:grid-cols-6 [@media(max-height:1024px)]:mt-1.5"
    >
      {Array.from({ length: TRENDING_TOPIC_COUNT }, (_, i) => (
        <li
          key={i}
          className={cn(
            "border-border bg-card/70 text-muted-foreground col-span-2 flex items-center justify-center rounded-full border px-3 py-1 text-xs whitespace-nowrap backdrop-blur",
            // 2 мөрийг барих нуулт — нэг мөрд: мобайл 1, sm 2, md 3 чип.
            i >= 2 && i < 4 && "hidden sm:flex",
            i >= 4 && "hidden md:flex",
            // md дээр 2 дахь мөр ердөө 2 чиптэй (5 нь 3-т жигд хуваагдахгүй) тул
            // 4 дэх чипийг ХАГАС баганаар түлхэж мөрийг ГОЛЛУУЛНА.
            i === 3 && "md:col-start-2",
          )}
        >
          {trendingTopicLabel(i + 1)}
        </li>
      ))}
    </ul>
  );
}

// =====================================================================
// RESULT BLOCK — асуултын мөр (хумигддаг) + доор нь хариулт
// =====================================================================
function ResultBlock({
  ref,
  block,
  expanded,
  onToggle,
  questions,
  onPick,
}: {
  ref?: React.Ref<HTMLElement>;
  block: Block;
  expanded: boolean;
  onToggle: () => void;
  questions: AssistantQuestion[];
  onPick: (question: string) => void;
}) {
  return (
    <article
      ref={ref}
      className="border-border bg-card/70 animate-in fade-in slide-in-from-top-2 w-full overflow-hidden rounded-3xl border text-left backdrop-blur duration-700 ease-out"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="hover:bg-muted/40 flex w-full items-start gap-3 px-5 py-4 text-left transition-colors"
      >
        <Sparkles className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span className="text-foreground flex-1 text-sm font-semibold">{block.asked}</span>
        <ChevronDown
          className={cn(
            "text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-500 ease-out",
            expanded && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="border-border/60 border-t px-5 pt-4 pb-5">
          {block.status === "loading" ? (
            <AnswerSkeleton kind={block.matched?.result.kind} />
          ) : (
            <Answer block={block} questions={questions} onPick={onPick} />
          )}
        </div>
      )}
    </article>
  );
}

// =====================================================================
// SKELETON — эцсийн хэлбэрээ дуурайна (хариулт суухад үсрэлт гарахгүй)
// =====================================================================
function AnswerSkeleton({ kind }: { kind?: AssistantResult["kind"] }) {
  return (
    <div className="animate-pulse">
      <div className="bg-muted h-3 w-full rounded" />
      <div className="bg-muted mt-2 h-3 w-4/5 rounded" />

      <div className="mt-5">
        {kind === "plans" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-muted h-24 rounded-2xl" />
            ))}
          </div>
        )}

        {kind === "diagnostic" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-muted h-4 rounded" />
              ))}
            </div>
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-muted h-11 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {kind === "timeline" && (
          <div className="grid gap-5 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="bg-muted size-8 rounded-full" />
                <div className="bg-muted h-3 w-20 rounded" />
              </div>
            ))}
          </div>
        )}

        {kind === "escalate" && <div className="bg-muted h-1.5 w-full rounded-full" />}
      </div>
    </div>
  );
}

// =====================================================================
// ANSWER — тойм + үр дүн + CTA
// =====================================================================
function Answer({
  block,
  questions,
  onPick,
}: {
  block: Block;
  questions: AssistantQuestion[];
  onPick: (question: string) => void;
}) {
  const matched = block.matched;

  if (!matched) {
    return (
      <div className="animate-in fade-in duration-700 ease-out">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Уучлаарай, энэ асуултыг таньсангүй. Доорхоос сонгоно уу.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {questions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onPick(q.question)}
              className="border-border hover:border-primary/50 hover:bg-muted/40 text-foreground rounded-xl border px-3 py-2 text-left text-sm transition-colors"
            >
              {q.question}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 ease-out">
      <p className="text-muted-foreground text-sm leading-relaxed">{matched.summary}</p>

      <div className="mt-5">
        {matched.result.kind === "plans" && <PlansView result={matched.result} />}
        {matched.result.kind === "diagnostic" && <DiagnosticView result={matched.result} />}
        {matched.result.kind === "timeline" && <TimelineView result={matched.result} />}
        {matched.result.kind === "escalate" && (
          <EscalateView result={matched.result} asked={block.asked} />
        )}
      </div>

      {matched.cta && (
        <div className="mt-6 flex justify-center">
          {/* SmartLink — эзэн нь нөгөө брэнд бол тэр домэйн руу шинэ tab-аар.
              Харагдацаараа дотоод линкээс ялгарахгүй (эко-системийн зарчим). */}
          <SmartLink
            href={matched.cta.href}
            owner={matched.owner}
            className="bg-primary text-primary-foreground inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-6 text-sm font-semibold transition-opacity duration-700 ease-out hover:opacity-85"
          >
            {matched.cta.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </SmartLink>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// ① PLANS — багцын харьцуулалт (mobile-plans.ts-ийн бодит утга)
// =====================================================================
function PlansView({ result }: { result: PlansResult }) {
  const byId = new Map(mobilePlans.map((p) => [p.id, p]));
  const picked = result.planIds.flatMap((id) => {
    const plan = byId.get(id);
    return plan ? [plan] : [];
  });

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {picked.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "border-border relative rounded-2xl border p-4",
              plan.recommended && "border-primary/60 bg-primary/5",
            )}
          >
            {plan.recommended && (
              <span className="bg-primary text-primary-foreground absolute -top-2 left-4 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider">
                САНАЛ
              </span>
            )}
            <div className="text-foreground text-sm font-bold">{plan.name}</div>
            <div className="text-muted-foreground mt-0.5 text-xs">{plan.data}</div>
            <div className="text-foreground mt-3 text-lg leading-none font-extrabold">
              {plan.price}
            </div>
            <div className="text-muted-foreground mt-1 text-[11px]">сард</div>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-4 text-xs">{result.note}</p>
    </>
  );
}

// =====================================================================
// ② DIAGNOSTIC — зүүн: шалгах жагсаалт | баруун: шийдлүүд
// =====================================================================
function DiagnosticView({ result }: { result: DiagnosticResult }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          {result.checkTitle}
        </h4>
        <ul className="mt-3 space-y-2">
          {result.checks.map((check) => (
            <li key={check} className="text-foreground flex items-start gap-2 text-sm">
              <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {check}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          {result.solutionTitle}
        </h4>
        <ul className="mt-3 space-y-2">
          {result.solutions.map((solution) => (
            <li key={solution.label} className="border-border rounded-xl border px-3 py-2">
              <div className="text-foreground text-sm font-semibold">{solution.label}</div>
              <div className="text-muted-foreground text-xs">{solution.hint}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// =====================================================================
// ③ TIMELINE — дугаарласан хэвтээ алхмууд
// =====================================================================
function TimelineView({ result }: { result: TimelineResult }) {
  return (
    <>
      <div className="relative">
        {/* Холбогч зураас — дугаарын дундуур, зөвхөн sm+ дээр */}
        <span
          aria-hidden="true"
          className="bg-border absolute top-4 hidden h-px sm:block"
          style={{ left: "16.6%", right: "16.6%" }}
        />
        <ol className="relative grid gap-5 sm:grid-cols-3">
          {result.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-foreground mt-2 text-sm font-semibold">{step.title}</span>
              <span className="text-muted-foreground mt-0.5 text-xs">{step.hint}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="text-muted-foreground mt-4 text-center text-xs">{result.note}</p>
    </>
  );
}

// =====================================================================
// ④ ESCALATE — гомдол. Progress дүүрэхэд chat widget нээгдэж, хэрэглэгчийн
// бичсэн текст эхний мессеж болж орно (`univision:chat-ask` аль хэдийн бий).
// =====================================================================
function EscalateView({ result, asked }: { result: EscalateResult; asked: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setProgress(100));
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("univision:chat-ask", { detail: { question: asked } }));
    }, result.handoffMs);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [asked, result.handoffMs]);

  return (
    <div>
      <div className="text-foreground flex items-center gap-2.5 text-sm">
        <Headphones className="text-primary size-4 shrink-0" aria-hidden="true" />
        Ажилтантай холбож байна…
      </div>
      <div className="bg-muted mt-3 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-[width] ease-out"
          style={{ width: `${progress}%`, transitionDuration: `${result.handoffMs}ms` }}
        />
      </div>
    </div>
  );
}
