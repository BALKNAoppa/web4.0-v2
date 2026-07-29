"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Headphones,
  Sparkles,
  SquareDashed,
} from "lucide-react";

import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { SmartLink } from "@/components/layout/smart-link";
import { mobilePlans } from "@/data/mobile-plans";
import {
  assistantQuestions,
  matchQuestion,
  type AssistantQuestion,
  type AssistantResult,
  type DiagnosticResult,
  type EscalateResult,
  type PlansResult,
  type TimelineResult,
} from "@/data/hero-assistant";
import { cn } from "@/lib/utils";

// Hero доорх quick action карт — placeholder ("Sample"). Хэрэглэгчийн хандалтаас
// хамааран бодит topic/action-оор солигдоно. Icon бүгд нэг default (SquareDashed).
// Зөвхөн асуулт асуугаагүй (idle) үед харагдана — үр дүн гармагц алга болно.
const QUICK_ACTIONS: { href: string; label: string }[] = [
  { href: "/main-packages", label: "Sample 1" },
  { href: "/unitel", label: "Sample 2" },
  { href: "/entertainment/main", label: "Sample 3" },
  { href: "/univision-go", label: "Sample 4" },
  { href: "/devices", label: "Sample 5" },
  { href: "/campaigns", label: "Sample 6" },
  { href: "/univision", label: "Sample 7" },
  { href: "/support", label: "Sample 8" },
];

/** Neon gradient (input-ийн хүрээ/гэрэлд) — брэнд ногоон → cyan → violet */
const NEON = "linear-gradient(90deg,#45c700,#2ad4ff,#a855f7,#45c700)";

/** "Боловсруулж байна" мэдрэмж өгөх завсар. Сүлжээ байхгүй тул бид хянана. */
const LOADING_MS = 700;

type Block = {
  key: number;
  /** Хэрэглэгчийн бичсэн эх текст */
  asked: string;
  matched: AssistantQuestion | null;
  status: "loading" | "ready";
};

/**
 * Google-ийн хайлтын хуудас шиг: input-ийн доороос үр дүнгийн блок ургана.
 * Асуулт бүр өөрийн гэсэн өрөлттэй (багц харьцуулалт / оношилгоо / алхмууд /
 * ажилтан руу шилжүүлэх). Блокууд овоологдож, өмнөх нь автоматаар хумигдана.
 *
 * AI байхгүй — бэлдсэн асуулт → бэлдсэн хариулт ([hero-assistant.ts]).
 * Өргөн нь input-ээс хэтрэхгүй: бүгд нэг `max-w-3xl` хүрээнд.
 *
 * Хоёр брэндийн асуултыг хоёулаа таньдаг: Univision дээр Unitel-ийн асуулт
 * асуувал хариулт гарч, CTA нь `SmartLink`-ээр Unitel-ийн домэйн руу шилжинэ —
 * header-тэй яг ижил зарчим.
 */
export function ChatHero() {
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
      // Шинэ блок нээлттэй, өмнөх бүгд хумигдана
      setExpandedKey(key);
      setInput("");

      window.setTimeout(() => {
        setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, status: "ready" } : b)));
      }, LOADING_MS);
    },
    [questions],
  );

  // Шинэ блок гарч ирэхэд зөөлөн гулсаж харагдана
  useEffect(() => {
    if (blocks.length === 0) return;
    latestRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [blocks.length]);

  // Hero ургахад SectionSnapScroller-ийн snap байрлал шилжиж гацалт үүсгэдэг.
  // Үр дүн нээлттэй байх хугацаанд snap-ийг унтраана.
  useEffect(() => {
    const root = document.documentElement;
    if (blocks.length > 0) root.dataset.assistantOpen = "1";
    else delete root.dataset.assistantOpen;
    return () => {
      delete root.dataset.assistantOpen;
    };
  }, [blocks.length]);

  return (
    <section
      aria-label="Ухаалаг туслах"
      className="bg-background animate-in fade-in relative w-full overflow-hidden duration-1000 ease-out"
    >
      {/* Background — MagicUI Interactive Grid Pattern (hover-оор нүд бүр гэрэлтэнэ).
          Төв рүү харагдаж, захаараа бүдгэрэх radial mask-тай. */}
      <InteractiveGridPattern
        width={40}
        height={40}
        squares={[42, 24]}
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur">
          <Sparkles className="text-primary size-3.5" aria-hidden="true" />
          Ухаалаг туслах
        </span>

        <h1 className="text-foreground mt-6 text-4xl font-extrabold tracking-tight text-balance md:text-6xl">
          Танд юугаар <span className="from-primary bg-clip-text text-[#45c700]">туслах вэ?</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-base text-pretty md:text-lg">
          Та асуултаа бичихэд л хангалттай — багц, интернэт, ТВ, төлбөр гээд бүгд нэг дор гэх мэт
          text байна.
        </p>

        {/* Chat input — neon gradient хүрээ + гэрэл (радиус томруулсан) */}
        <div className="relative mt-8 w-full">
          {/* Ард талын бүдэг гэрэл (glow) */}
          <div
            aria-hidden
            className="animate-neon-pan pointer-events-none absolute -inset-1 rounded-[2rem] opacity-60 blur-xl"
            style={{ background: NEON, backgroundSize: "200% 100%" }}
          />
          {/* Gradient хүрээ */}
          <div
            className="animate-neon-pan relative rounded-[1.75rem] p-[2px] shadow-lg"
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
                placeholder="Асуултаа энд буулгана уу…"
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

        {/* Quick actions — зөвхөн idle үед. Асуулт асуумагц үр дүн орно. */}
        {blocks.length === 0 && (
          <div className="animate-in fade-in mt-8 w-full duration-700 ease-out">
            <p className="text-muted-foreground mb-3 flex items-center justify-center gap-1.5 text-sm font-medium">
              Хэрэглэгчийн их ашигласан topic болон action button харагдана
            </p>
            <div className="grid grid-cols-4 gap-2.5 md:grid-cols-8">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group border-border bg-card/60 hover:border-primary/40 hover:bg-card flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border p-1.5 text-center transition-colors"
                >
                  <SquareDashed className="text-primary size-5" aria-hidden="true" />
                  <span className="text-muted-foreground group-hover:text-foreground text-[11px] leading-tight font-medium">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Үр дүн — input-ийн доороос ургана. Өргөн нь input-тэй яг ижил. */}
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
