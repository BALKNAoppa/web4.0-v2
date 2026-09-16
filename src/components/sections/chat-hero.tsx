"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Headphones,
  Loader2,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  User,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { SmartLink } from "@/components/layout/smart-link";
import { useAuth } from "@/components/auth/auth-provider";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { mobilePlans } from "@/data/mobile-plans";
import {
  assistantQuestions,
  buildFollowUp,
  CLARIFY_OUTRO,
  featuredQuestions,
  findTvodMovies,
  matchQuestion,
  resolveClarify,
  RESOLVING_STEPS,
  THINKING_STEP_MS,
  similarTvodMovies,
  THINKING_STEPS,
  personaShortcuts,
  tvodMovieCard,
  tvodPackageCards,
  type AssistantQuestion,
  type AssistantResult,
  type ClarifyOutcome,
  type ClarifyResult,
  type ContentSearchResult,
  type NoticeResult,
  type TroubleshootResult,
  type DiagnosticResult,
  type OfferCard,
  type OfferResult,
  type Solution,
  type EscalateResult,
  type PlansResult,
  type TimelineResult,
} from "@/data/hero-assistant";
import type { Owner } from "@/lib/brand";
import { ASSISTANT_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { sectionBg } from "@/lib/section-bg";
const NEON =
  "conic-gradient(from var(--neon-angle),#8be06a,#c6efb6 14%,#ffffff 30%,#f3b6ea 54%,#accbf7 76%,#8be06a)";

const NEON_STYLE = {
  "--neon-angle": "0deg",
  backgroundImage: NEON,
} as React.CSSProperties;
const LOADING_MS = THINKING_STEPS.length * THINKING_STEP_MS;

function bottomGap(viewportHeight: number): number {
  return Math.min(Math.max(viewportHeight * 0.12, 56), 120);
}

type Block = {
  key: number;
  asked: string;
  matched: AssistantQuestion | null;
  status: "loading" | "ready";
  answers: Record<string, string>;
  carried?: boolean;
};
export function ChatHero({
  heroRest = false,
  mode = "hero",
  initialQuestions = [],
}: {
  heroRest?: boolean;
  mode?: "hero" | "page";
  initialQuestions?: string[];
} = {}) {
  const questions = assistantQuestions;
  const router = useRouter();
  const isPage = mode === "page";

  const [input, setInput] = useState("");
  const [blocks, setBlocks] = useState<Block[]>(() =>
    initialQuestions.map((asked, index) => {
      const isLast = index === initialQuestions.length - 1;
      return {
        key: index,
        asked,
        matched: matchQuestion(asked, assistantQuestions),
        status: isLast ? ("loading" as const) : ("ready" as const),
        carried: !isLast,
        answers: {},
      };
    }),
  );
  const nextKey = useRef(initialQuestions.length);
  const latestRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setAnswers = useCallback((key: number, next: Record<string, string>) => {
    setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, answers: next } : b)));
  }, []);

  const ask = useCallback(
    (text: string) => {
      const asked = text.trim();
      if (!asked) return;

      const last = blocks[blocks.length - 1];
      if (
        last?.status === "ready" &&
        last.matched?.result.kind === "content-search" &&
        !last.answers.query
      ) {
        setAnswers(last.key, { query: asked });
        setInput("");
        return;
      }

      if (!isPage && blocks.length > 0) {
        const thread = [...blocks.map((b) => b.asked), asked];
        const query = thread.map((q) => `q=${encodeURIComponent(q)}`).join("&");
        setInput("");
        router.push(`${ASSISTANT_PATH}?${query}`);
        return;
      }

      const key = nextKey.current++;
      setBlocks((prev) => [
        ...prev,
        { key, asked, matched: matchQuestion(asked, questions), status: "loading", answers: {} },
      ]);
      setInput("");

      window.setTimeout(() => {
        setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, status: "ready" } : b)));
      }, LOADING_MS);
    },
    [questions, isPage, blocks, router, setAnswers],
  );

  useEffect(() => {
    if (initialQuestions.length === 0) return;
    const key = initialQuestions.length - 1;

    const timer = window.setTimeout(() => {
      setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, status: "ready" } : b)));
    }, LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [initialQuestions.length]);

  const startOver = useCallback(() => {
    setBlocks([]);
    setInput("");
    if (isPage) router.replace(ASSISTANT_PATH);
  }, [isPage, router]);

  const fillInput = useCallback((text: string) => {
    setInput(text);
    inputRef.current?.focus();
  }, []);

  const suggestions = (blocks[blocks.length - 1]?.matched?.followUps ?? []).flatMap((id) => {
    const next = questions.find((item) => item.id === id);
    return next ? [next] : [];
  });

  const followUpForm = (embedded: boolean) => (
    <NeonFrame
      rounded="rounded-2xl"
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-4 mx-auto w-full duration-700 ease-out",
        embedded ? "max-w-2xl" : "max-w-xl",
      )}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="bg-background rounded-2xl px-4 py-3 text-left"
      >
        <label htmlFor="chat-hero-input" className="sr-only">
          Дараагийн асуултаа бичнэ үү
        </label>

        {
}
        <div className="flex items-start gap-2">
          <Sparkles className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <input
            id="chat-hero-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Дараагийн асуултаа бичнэ үү"
            className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-5 flex items-center gap-2 sm:mt-8">
          {
}
          <button
            type="button"
            onClick={startOver}
            aria-label="Дахин эхлэх"
            className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1.5 text-xs transition-colors"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Дахин эхлэх</span>
          </button>

          <SuggestionChips items={suggestions} onPick={ask} />

          <button
            type="submit"
            aria-label="Илгээх"
            disabled={!input.trim()}
            className="bg-primary text-primary-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-xl transition-opacity duration-300 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </NeonFrame>
  );

  const lastStatus = blocks[blocks.length - 1]?.status;

  useEffect(() => {
    const el = latestRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const place = () => {
      const field = document.getElementById("chat-hero-input");
      const target = field?.closest("form") ?? el;
      const rect = target.getBoundingClientRect();

      const viewportH = window.visualViewport?.height ?? window.innerHeight;
      const delta = rect.bottom - (viewportH - bottomGap(viewportH));

      if (Math.abs(delta) < 2) return;

      window.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
    };

    place();

    let settle = 0;
    const schedule = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(place, 150);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(el);

    const stop = () => {
      observer.disconnect();
      window.clearTimeout(settle);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) stop();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    const giveUp = window.setTimeout(stop, 5000);

    return () => {
      stop();
      window.clearTimeout(giveUp);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", stop);
    };
  }, [blocks.length, lastStatus]);

  return (
    <section
      aria-label="Ухаалаг сонголт"
      data-glass={isPage ? "true" : undefined}
      className={cn(
        sectionBg.page,
        "animate-in fade-in relative w-full overflow-hidden duration-1000 ease-out",
      )}
    >
      {
}
      {
}
      {isPage && <div className="glass-glow" aria-hidden="true" />}

      {isPage && (
        <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute size-0">
          <defs>
            <filter
              id="glass-warp"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              {
}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.014"
                numOctaves="2"
                seed="7"
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="soft"
                scale="14"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {

}
      {isPage && (
        <InteractiveGridPattern
          width={40}
          height={40}
          squares={[42, 24]}
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] opacity-50"
        />
      )}
      {
}
      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 pt-10 pb-5 text-center transition-[max-width] duration-700 ease-out sm:py-8 md:py-10 [@media_(min-width:768px)_and_(max-height:1024px)]:py-1",
          blocks.length > 0 && "max-w-5xl",
          isPage
            ? "min-h-0 justify-start py-6 sm:py-8 md:py-8"
            : heroRest
              ? "min-h-[calc((100svh-var(--header-h))*0.28)] md:min-h-[calc((100svh-var(--header-h))*0.4)]"
              : "min-h-[34svh] sm:min-h-[44svh] md:min-h-[46svh]",
        )}
      >
        {
}
        {!isPage && (
          <>
            {

}

            <h1
              className={cn(
                "text-foreground text-2xl font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl",
                blocks.length > 0 && "mb-5 sm:mb-6",
              )}
            >
              Ухаалаг <span className="from-primary bg-clip-text text-[#45c700]">туслах</span>
            </h1>

            {blocks.length === 0 && (
              <p className="text-foreground mt-3 max-w-xl text-sm text-pretty sm:mt-4 sm:text-base md:text-lg [@media_(min-width:768px)_and_(max-height:1024px)]:mt-1.5">
                Unitel Group-ийн хэмжээнд бүтээгдэхүүн, үйлчилгээний талаар лавлаад{" "}
                <strong className="font-bold">ХАМТДАА</strong> шийдвэрээ гаргаарай.
              </p>
            )}
          </>
        )}
        {
}
        {blocks.length > 0 && (
          <div className={cn("w-full", isPage ? "space-y-10 sm:space-y-12" : "space-y-3")}>
            {blocks.map((block, i) => (
              <ResultBlock
                key={block.key}
                ref={i === blocks.length - 1 ? latestRef : undefined}
                block={block}
                onPick={ask}
                onAnswers={(next) => setAnswers(block.key, next)}
                latest={i === blocks.length - 1}
                footer={i === blocks.length - 1 ? followUpForm(true) : undefined}
                chat={isPage}
              />
            ))}
          </div>
        )}

        {
}
        {blocks.length === 0 &&
          (isPage ? (
            followUpForm(false)
          ) : (
            <NeonFrame
              rounded="rounded-[1.75rem]"
              glow
              className="mt-5 w-full sm:mt-8 [@media_(min-width:768px)_and_(max-height:1024px)]:mt-3"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="bg-card flex w-full items-center gap-3 rounded-[calc(1.75rem-1px)] px-4 py-2.5"
              >
                <Sparkles className="text-primary size-5 shrink-0" aria-hidden="true" />
                <label htmlFor="chat-hero-input" className="sr-only">
                  Асуултаа бичнэ үү
                </label>
                <input
                  ref={inputRef}
                  id="chat-hero-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Асуултаа бичнэ үү"
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
            </NeonFrame>
          ))}

        {
}
        {!isPage && blocks.length === 0 && <PersonaShortcuts onFill={fillInput} />}
      </div>
    </section>
  );
}

function PersonaShortcuts({ onFill }: { onFill: (text: string) => void }) {
  return (
    <div className="mt-2.5 flex w-full flex-wrap items-stretch justify-center gap-2 sm:mt-3 sm:max-w-lg [@media_(min-width:768px)_and_(max-height:1024px)]:mt-1.5">
      {personaShortcuts.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onFill(item.question)}
          className="border-border bg-card/70 text-muted-foreground hover:border-primary hover:text-foreground max-w-full rounded-2xl border px-3 py-2 text-center text-xs leading-snug text-balance backdrop-blur transition-colors"
        >
          {item.question}
        </button>
      ))}
    </div>
  );
}

function ResultBlock({
  ref,
  block,
  onPick,
  onAnswers,
  latest = false,
  footer,
  chat = false,
}: {
  ref?: React.Ref<HTMLElement>;
  block: Block;
  onPick: (question: string) => void;
  onAnswers: (next: Record<string, string>) => void;
  latest?: boolean;
  footer?: React.ReactNode;
  chat?: boolean;
}) {
  const [introDone, setIntroDone] = useState(block.carried ?? false);

  const [inputReady, setInputReady] = useState(false);

  useEffect(() => {
    if (!introDone) return;
    const timer = window.setTimeout(() => setInputReady(true), 260);
    return () => window.clearTimeout(timer);
  }, [introDone]);

  const body =
    block.status === "loading" ? (
      <ThinkingTrace steps={THINKING_STEPS} />
    ) : (
      <Answer
        block={block}
        onPick={onPick}
        onAnswers={onAnswers}
        latest={latest}
        introDone={introDone}
        onIntroDone={() => setIntroDone(true)}
      />
    );

  const footerReady = footer && block.status === "ready" && (inputReady || !block.matched);

  if (chat) {
    return (
      <article ref={ref} className="animate-in fade-in w-full text-left duration-700 ease-out">
        {
}
        <div className="flex justify-end">
          <div className="border-border bg-card text-foreground max-w-[88%] rounded-2xl rounded-br-md border px-4 py-2.5 text-sm font-semibold backdrop-blur sm:max-w-[75%]">
            {block.asked}
          </div>
        </div>

        {
}
        <div className="mt-4 flex gap-2.5 sm:mt-5 sm:gap-3">
          <Sparkles className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">{body}</div>
        </div>

        {
}
        {footerReady && <div className="mt-6 sm:mt-8">{footer}</div>}
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className="border-border bg-card/70 animate-in fade-in slide-in-from-top-2 w-full overflow-hidden rounded-3xl border text-left backdrop-blur duration-700 ease-out"
    >
      {

}
      <div className="flex items-start gap-3 px-5 pt-4 pb-1">
        <Sparkles className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p className="text-muted-foreground flex-1 text-sm">
          Таны хайсан сэдэв{" "}
          {
}
          <span className="text-foreground text-[1.2em] font-semibold">«{block.asked}»</span>
        </p>
      </div>

      <div className="px-5 pt-2 pb-5">{body}</div>

      {
}
      {footerReady && <div className="px-4 pb-4">{footer}</div>}
    </article>
  );
}

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

        {}
        {kind === "clarify" && (
          <div>
            <div className="bg-muted h-4 w-1/2 rounded" />
            <div className="mt-3 flex gap-2">
              <div className="bg-muted h-8 w-28 rounded-full" />
              <div className="bg-muted h-8 w-24 rounded-full" />
              <div className="bg-muted h-8 w-20 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Answer({
  block,
  onPick,
  onAnswers,
  latest,
  introDone,
  onIntroDone,
}: {
  block: Block;
  onPick: (question: string) => void;
  onAnswers: (next: Record<string, string>) => void;
  latest: boolean;
  introDone: boolean;
  onIntroDone: () => void;
}) {
  const matched = block.matched;

  if (!matched) {
    return (
      <div className="animate-in fade-in duration-700 ease-out">
        <p className="text-foreground text-sm leading-relaxed">
          Уучлаарай, энэ асуултыг таньсангүй. Доорхоос сонгоно уу.
        </p>
        {

}
        <div className="mt-3 flex flex-col gap-2">
          {featuredQuestions.map((q) => (
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
      {
}
      <p className="text-foreground text-sm leading-relaxed">
        {
}
        {block.carried ? (
          matched.summary
        ) : (
          <TypingAnimation duration={12} delay={0} onComplete={onIntroDone}>
            {matched.summary}
          </TypingAnimation>
        )}
      </p>

      <div className="mt-5">
        {introDone && matched.result.kind === "offer" && (
          <OfferView result={matched.result} owner={matched.owner} />
        )}
        {introDone && matched.result.kind === "plans" && <PlansView result={matched.result} />}
        {introDone && matched.result.kind === "diagnostic" && (
          <DiagnosticView result={matched.result} />
        )}
        {introDone && matched.result.kind === "timeline" && (
          <TimelineView result={matched.result} />
        )}
        {introDone && matched.result.kind === "escalate" && (
          <EscalateView result={matched.result} asked={block.asked} />
        )}
        {introDone && matched.result.kind === "notice" && (
          <NoticeView result={matched.result} owner={matched.owner} />
        )}
        {introDone && matched.result.kind === "troubleshoot" && (
          <TroubleshootView
            result={matched.result}
            answers={block.answers}
            onAnswers={onAnswers}
            owner={matched.owner}
            asked={block.asked}
          />
        )}
        {introDone && matched.result.kind === "content-search" && (
          <ContentSearchView
            result={matched.result}
            answers={block.answers}
            onAnswers={onAnswers}
            owner={matched.owner}
          />
        )}
        {introDone && matched.result.kind === "clarify" && (
          <ClarifyView
            result={matched.result}
            answers={block.answers}
            onAnswers={onAnswers}
            owner={matched.owner}
          />
        )}
      </div>

      {
}
      {introDone && latest && <AnswerFeedback questionId={matched.id} />}

      {introDone && matched.cta && (
        <div className="mt-6 flex justify-center">
          {
}
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

function TimelineView({ result }: { result: TimelineResult }) {
  return (
    <>
      <div className="relative">
        {}
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

function ClarifyView({
  result,
  answers,
  onAnswers,
  owner,
}: {
  result: ClarifyResult;
  answers: Record<string, string>;
  onAnswers: (next: Record<string, string>) => void;
  owner: Owner;
}) {
  const currentIndex = result.steps.findIndex((step) => !answers[step.id]);
  const done = currentIndex === -1;
  const outcome = done ? resolveClarify(result, answers) : null;

  const answerKey = result.steps.map((step) => answers[step.id] ?? "").join("|");

  const [resolving, setResolving] = useState(false);

  const pick = (stepId: string, optionId: string) => {
    const next = { ...answers, [stepId]: optionId };
    onAnswers(next);
    if (result.steps.every((step) => next[step.id])) {
      setResolving(true);
      window.setTimeout(() => setResolving(false), RESOLVING_STEPS.length * THINKING_STEP_MS);
    }
  };

  const prevStep = currentIndex > 0 ? result.steps[currentIndex - 1] : null;
  const prevPick = prevStep?.options.find((option) => option.id === answers[prevStep.id]);

  const editFrom = (index: number) => {
    const next: Record<string, string> = {};
    for (const step of result.steps.slice(0, index)) {
      const picked = answers[step.id];
      if (picked) next[step.id] = picked;
    }
    onAnswers(next);
  };

  return (
    <div className="animate-in fade-in duration-500 ease-out">
      {}
      {result.steps.map((step, i) => {
        const picked = step.options.find((option) => option.id === answers[step.id]);
        if (!picked) return null;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => editFrom(i)}
            className="border-border hover:border-primary/50 hover:bg-muted/40 mb-2 flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors"
          >
            <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
              {step.prompt}
            </span>
            <span className="text-foreground shrink-0 text-sm font-semibold">{picked.label}</span>
            <Pencil className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
          </button>
        );
      })}

      {}
      {!done && (
        <div className="animate-in fade-in slide-in-from-bottom-1 mt-3 duration-500 ease-out">
          <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Тодруулах асуулт {currentIndex + 1}/{result.steps.length}
          </div>

          {
}
          {prevPick && (
            <p className="text-muted-foreground mt-1.5 text-xs">
              «{prevPick.label}» — тэмдэглэж авлаа.
            </p>
          )}
          <p className="text-foreground mt-1.5 text-sm font-semibold">
            {result.steps[currentIndex].prompt}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.steps[currentIndex].options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => pick(result.steps[currentIndex].id, option.id)}
                className="border-border hover:border-primary hover:bg-primary/10 text-foreground rounded-full border px-3.5 py-1.5 text-sm transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {}
      {}
      {resolving && (
        <div className="animate-in fade-in mt-4 duration-300">
          <ThinkingTrace steps={RESOLVING_STEPS} />
        </div>
      )}

      {outcome && !resolving && (
        <SolutionPanel
          key={answerKey}
          result={result}
          outcome={outcome}
          owner={owner}
          onReset={() => onAnswers({})}
        />
      )}
    </div>
  );
}

function SolutionPanel({
  result,
  outcome,
  owner,
  onReset,
}: {
  result: ClarifyResult;
  outcome: ClarifyOutcome;
  owner: Owner;
  onReset: () => void;
}) {
  const [narrativeDone, setNarrativeDone] = useState(false);
  const handleNarrativeDone = useCallback(() => setNarrativeDone(true), []);

  const narrativeAtEnd = result.layout === "offer";

  const narrative = (
    <TypingAnimation
      duration={12}
      delay={narrativeAtEnd ? 320 : 0}
      onComplete={handleNarrativeDone}
    >
      {CLARIFY_OUTRO}
    </TypingAnimation>
  );

  const cta = outcome.best.cta ? (
    <SmartLink
      href={outcome.best.cta.href}
      owner={owner}
      className="bg-primary text-primary-foreground mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-semibold transition-opacity duration-300 hover:opacity-85"
    >
      {outcome.best.cta.label}
      <ArrowRight className="size-4" aria-hidden="true" />
    </SmartLink>
  ) : null;

  const body = (
    <>
      {
}
      {result.lead && <p className="text-foreground mt-4 text-sm leading-relaxed">{result.lead}</p>}
      <div className="text-foreground mt-4 text-base font-bold">{outcome.best.title}</div>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        {outcome.best.description}
      </p>
      <SolutionBody solution={outcome.best} layout={result.layout} owner={owner} />
    </>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mt-4 duration-700 ease-out">
      {
}
      <div
        className={cn(!narrativeAtEnd && "border-primary/60 bg-primary/5 rounded-2xl border p-4")}
      >
        <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Танд тохирох шийдэл
        </div>

        {narrativeAtEnd ? (
          body
        ) : (
          <>
            {
}
            <p className="text-foreground mt-2 text-sm leading-relaxed">{narrative}</p>

            {narrativeDone && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
                {body}
                {cta}
              </div>
            )}
          </>
        )}
      </div>

      {}
      {narrativeAtEnd && (
        <>
          {
}
          <p className="text-foreground mt-4 text-sm leading-relaxed">{narrative}</p>
          {narrativeDone && cta && (
            <div className="animate-in fade-in duration-500 ease-out">{cta}</div>
          )}
        </>
      )}

      {

}
      {!narrativeAtEnd && narrativeDone && (
        <div className="animate-in fade-in duration-500 ease-out">
          {
}
          {buildFollowUp(outcome) && (
            <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
              <span aria-hidden="true">👉 </span>
              {buildFollowUp(outcome)}
            </p>
          )}

          {

}
          {outcome.alternatives.length > 0 && (
            <details className="border-border mt-2 rounded-xl border px-3 py-2">
              <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-xs font-semibold">
                Бусад боломж ({outcome.alternatives.length})
              </summary>
              <ul className="mt-2 space-y-2">
                {outcome.alternatives.map((solution) => (
                  <li key={solution.id}>
                    <div className="text-foreground text-sm font-semibold">{solution.title}</div>
                    <div className="text-muted-foreground text-xs">{solution.description}</div>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <button
            type="button"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Дахин эхлэх
          </button>
        </div>
      )}
    </div>
  );
}

function SolutionBody({
  solution,
  layout,
  owner,
}: {
  solution: Solution;
  layout: ClarifyResult["layout"];
  owner: Owner;
}) {
  if (layout === "offer" && solution.groups?.length) {
    return (
      <div className="mt-4 space-y-5">
        {solution.groups.map((group) => (
          <div key={group.title}>
            <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              {group.title}
            </div>
            <div className="mt-3">
              <OfferCardGrid cards={group.cards} owner={owner} />
            </div>
            {group.note && (
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{group.note}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (layout === "plans" && solution.planIds?.length) {
    const byId = new Map(mobilePlans.map((plan) => [plan.id, plan]));
    const picked = solution.planIds.flatMap((id) => {
      const plan = byId.get(id);
      return plan ? [plan] : [];
    });

    return (
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {picked.map((plan) => (
          <div key={plan.id} className="border-border bg-background/60 rounded-xl border p-3">
            <div className="text-foreground text-sm font-bold">{plan.name}</div>
            <div className="text-muted-foreground mt-0.5 text-xs">{plan.data}</div>
            <div className="text-foreground mt-2 text-base leading-none font-extrabold">
              {plan.price}
            </div>
            <div className="text-muted-foreground mt-1 text-[11px]">сард</div>
          </div>
        ))}
      </div>
    );
  }

  if (layout === "steps" && solution.steps?.length) {
    return (
      <ol className="mt-3 grid gap-3 sm:grid-cols-3">
        {solution.steps.map((step, i) => (
          <li key={step.title} className="flex items-start gap-2">
            <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="text-foreground block text-sm font-semibold">{step.title}</span>
              <span className="text-muted-foreground block text-xs">{step.hint}</span>
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (solution.highlights?.length) {
    return (
      <ul className="mt-3 space-y-1.5">
        {solution.highlights.map((highlight) => (
          <li key={highlight} className="text-foreground flex items-start gap-2 text-sm">
            <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {highlight}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

function ThinkingTrace({ steps }: { steps: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) window.clearInterval(id);
        return Math.min(next, steps.length);
      });
    }, THINKING_STEP_MS);
    return () => window.clearInterval(id);
  }, [steps.length]);

  return (
    <ul className="space-y-2" aria-live="polite">
      {steps.map((step, i) => {
        if (i > index) return null;
        const done = i < index;
        return (
          <li
            key={step}
            className="animate-in fade-in slide-in-from-bottom-1 flex items-center gap-2 text-sm duration-300 ease-out"
          >
            {done ? (
              <Check className="text-primary size-4 shrink-0" aria-hidden="true" />
            ) : (
              <Loader2 className="text-primary size-4 shrink-0 animate-spin" aria-hidden="true" />
            )}
            <span className={done ? "text-muted-foreground" : "text-foreground"}>
              {step}
              {done ? "" : "…"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

void AnswerSkeleton;

function OfferView({ result, owner }: { result: OfferResult; owner: Owner }) {
  const { openLogin, isAuthenticated } = useAuth();

  const personalize = result.personalize;

  const cards = [...result.cards].sort(
    (a, b) => Number(Boolean(b.oldPrice)) - Number(Boolean(a.oldPrice)),
  );

  return (
    <div>
      {
}
      <ul className="mb-4 space-y-1.5">
        {cards.map((card) => {
          const { headline, subline, price } = resolveOfferCard(card);
          const detail = [subline, price].filter(Boolean).join(", ");
          return (
            <li key={card.id} className="text-foreground flex gap-2 text-sm leading-relaxed">
              <span className="text-muted-foreground select-none" aria-hidden="true">
                •
              </span>
              <span>
                <span className="font-bold">{headline}</span>
                {detail && <span className="text-muted-foreground"> — {detail}</span>}
                {card.highlights?.[0] && <span>. {card.highlights[0]}</span>}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        {result.cardsTitle}
      </div>

      <div className="mt-3">
        <OfferCardGrid cards={result.cards} owner={owner} />
      </div>

      {}
      {personalize && !isAuthenticated && (
        <div className="border-border mt-4 flex flex-col items-start gap-3 rounded-2xl border border-dashed p-4">
          <p className="text-muted-foreground text-sm leading-relaxed">{personalize.text}</p>
          <button
            type="button"
            onClick={() => openLogin(personalize.reason)}
            className="border-primary text-primary hover:bg-primary/10 inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors"
          >
            <User className="size-4" aria-hidden="true" />
            {personalize.ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function OfferCardGrid({ cards, owner }: { cards: OfferCard[]; owner: Owner }) {
  const ordered = [...cards].sort((a, b) => {
    const byBadge = Number(Boolean(b.badge)) - Number(Boolean(a.badge));
    if (byBadge !== 0) return byBadge;

    return Number(Boolean(b.oldPrice)) - Number(Boolean(a.oldPrice));
  });

  const posterBox =
    ordered.length === 1
      ? { width: "w-28 sm:w-36", sizes: "(min-width: 640px) 144px, 112px" }
      : { width: "w-20 sm:w-24", sizes: "(min-width: 640px) 96px, 80px" };

  return (
    <div
      className={cn(
        "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pt-2 pb-1 sm:grid sm:gap-4 sm:overflow-visible sm:pt-0 sm:pb-0",
        ordered.length === 1
          ? "sm:grid-cols-1"
          : ordered.length === 2 || ordered.length === 4
            ? "sm:grid-cols-2"
            : "sm:grid-cols-3",
      )}
    >
      {ordered.map((card) => {
        const { headline, subline, price, priceNote } = resolveOfferCard(card);

        const shape = card.image ? (card.imageShape ?? "product") : undefined;
        const poster = shape === "poster" ? card.image : undefined;
        const background = shape === "background" ? card.image : undefined;
        const productImage = shape === "product" ? card.image : undefined;

        const details = (
          <>
            {
}
            <div
              className={cn(
                "text-foreground font-extrabold",
                card.longHeadline ? "text-base leading-snug" : "text-2xl leading-none",
              )}
            >
              {headline}
            </div>
            {subline && <div className="text-muted-foreground mt-1.5 text-xs">{subline}</div>}

            {
}
            {price && (
              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                {card.oldPrice && (
                  <span className="text-muted-foreground text-sm line-through">
                    {card.oldPrice}
                  </span>
                )}
                <span className="text-foreground text-lg leading-none font-extrabold">{price}</span>
                {
}
                {priceNote && <span className="text-muted-foreground text-xs">({priceNote})</span>}
              </div>
            )}

            {}
            {card.note && (
              <div className="text-primary mt-2 text-xs font-semibold">{card.note}</div>
            )}

            {card.highlights && card.highlights.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {card.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="text-muted-foreground flex items-start gap-1.5 text-xs"
                  >
                    <Check className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </>
        );

        return (
          <div
            key={card.id}
            className={cn(
              "border-border relative flex shrink-0 snap-start flex-col rounded-2xl border p-4 sm:w-auto sm:shrink",
              "glass-surface",
              ordered.length === 1 ? "w-full" : "w-[78%]",
              card.badge && "border-primary/60 bg-primary/5",
              background && "isolate pt-32",
            )}
          >
            {card.badge && (
              <span className="bg-primary text-primary-foreground absolute -top-2 left-4 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider">
                {card.badge}
              </span>
            )}

            {
}
            {background && (
              <div
                className="absolute inset-0 -z-10 overflow-hidden rounded-2xl"
                aria-hidden="true"
              >
                <Image
                  src={background}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 320px, 78vw"
                  className="object-cover"
                />
                {
}
                <div className="from-card via-card/95 to-card/20 absolute inset-0 bg-gradient-to-t" />
              </div>
            )}

            {poster ? (
              <div className="flex gap-3 sm:gap-4">
                <div
                  className={cn(
                    "bg-muted relative aspect-[2/3] shrink-0 overflow-hidden rounded-xl",
                    posterBox.width,
                  )}
                >
                  <Image
                    src={poster}
                    alt=""
                    fill
                    sizes={posterBox.sizes}
                    className="object-cover"
                  />
                </div>
                {}
                <div className="min-w-0 flex-1">{details}</div>
              </div>
            ) : (
              <>
                {
}
                {productImage && (
                  <div className="bg-muted relative mb-4 h-32 w-full overflow-hidden rounded-xl">
                    <Image
                      src={productImage}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 240px, 70vw"
                      className="object-contain p-2"
                    />
                  </div>
                )}
                {details}
              </>
            )}

            {
}
            <div className="mt-auto h-4 shrink-0" aria-hidden="true" />
            <OfferCardCta cta={card.cta} owner={owner} />
          </div>
        );
      })}
    </div>
  );
}

function NoticeView({ result, owner }: { result: NoticeResult; owner: Owner }) {
  return (
    <div className="animate-in fade-in duration-500 ease-out">
      {result.title && (
        <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          {result.title}
        </div>
      )}

      {result.items && result.items.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {result.items.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
            >
              {
}
              {item.href ? (
                <SmartLink
                  href={item.href}
                  owner={owner}
                  className="text-foreground hover:text-primary shrink-0 text-sm font-semibold underline decoration-dotted underline-offset-4 transition-colors sm:w-44"
                >
                  {item.name}
                </SmartLink>
              ) : (
                <span className="text-foreground shrink-0 text-sm font-semibold sm:w-44">
                  {item.name}
                </span>
              )}
              <span className="text-muted-foreground text-sm leading-relaxed">{item.hint}</span>
            </li>
          ))}
        </ul>
      )}

      {result.cta && (
        <SmartLink
          href={result.cta.href}
          owner={owner}
          className="border-primary text-primary hover:bg-primary/10 mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors"
        >
          {result.cta.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </SmartLink>
      )}
    </div>
  );
}

function TroubleshootView({
  result,
  answers,
  onAnswers,
  owner,
  asked,
}: {
  result: TroubleshootResult;
  answers: Record<string, string>;
  onAnswers: (next: Record<string, string>) => void;
  owner: Owner;
  asked: string;
}) {
  const path = answers.path ?? "";
  const label =
    path === "device" ? result.deviceLabel : path === "complaint" ? result.complaintLabel : "";

  return (
    <div className="animate-in fade-in duration-500 ease-out">
      {
}
      <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        {result.causesTitle}
      </div>
      <ul className="mt-3 space-y-1.5">
        {result.causes.map((cause) => (
          <li key={cause} className="text-foreground flex gap-2 text-sm leading-relaxed">
            <span className="text-muted-foreground select-none" aria-hidden="true">
              •
            </span>
            <span>{cause}</span>
          </li>
        ))}
      </ul>

      {!path && (
        <div className="animate-in fade-in slide-in-from-bottom-1 mt-4 duration-500 ease-out">
          <p className="text-foreground text-sm font-semibold">{result.prompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onAnswers({ path: "device" })}
              className="border-border hover:border-primary hover:bg-primary/10 text-foreground rounded-full border px-3.5 py-1.5 text-sm transition-colors"
            >
              {result.deviceLabel}
            </button>
            <button
              type="button"
              onClick={() => onAnswers({ path: "complaint" })}
              className="border-border hover:border-primary hover:bg-primary/10 text-foreground rounded-full border px-3.5 py-1.5 text-sm transition-colors"
            >
              {result.complaintLabel}
            </button>
          </div>
        </div>
      )}

      {path && (
        <div className="mt-4">
          {
}
          <button
            type="button"
            onClick={() => onAnswers({})}
            className="border-border hover:border-primary/50 hover:bg-muted/40 mb-4 flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors"
          >
            <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
              {result.prompt}
            </span>
            <span className="text-foreground shrink-0 text-sm font-semibold">{label}</span>
            <Pencil className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
          </button>

          {path === "device" ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
              <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                {result.deviceTitle}
              </div>
              <div className="mt-3">
                <OfferCardGrid cards={result.deviceCards} owner={owner} />
              </div>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                {result.deviceNote}
              </p>
            </div>
          ) : (
            <EscalateView
              result={{ kind: "escalate", handoffMs: result.handoffMs }}
              asked={asked}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ContentSearchView({
  result,
  answers,
  onAnswers,
  owner,
}: {
  result: ContentSearchResult;
  answers: Record<string, string>;
  onAnswers: (next: Record<string, string>) => void;
  owner: Owner;
}) {
  const { openLogin } = useAuth();

  const query = answers.query ?? "";
  const match = query ? findTvodMovies(query)[0] : undefined;
  const similar = match ? similarTvodMovies(match, 3) : [];
  const missing = result.missing;

  return (
    <div className="animate-in fade-in duration-500 ease-out">
      {
}
      <ul className="space-y-1.5">
        {result.notes.map((note) => (
          <li key={note} className="text-foreground flex gap-2 text-sm leading-relaxed">
            <span className="text-muted-foreground select-none" aria-hidden="true">
              •
            </span>
            <span>{note}</span>
          </li>
        ))}
      </ul>

      {
}
      {!query && (
        <p className="text-foreground animate-in fade-in mt-4 text-sm font-semibold duration-500">
          {result.prompt}
        </p>
      )}

      {query && (
        <div className="mt-4">
          {
}
          <button
            type="button"
            onClick={() => onAnswers({})}
            className="border-border hover:border-primary/50 hover:bg-muted/40 mb-4 flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors"
          >
            <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
              Таны хайсан
            </span>
            <span className="text-foreground shrink-0 text-sm font-semibold">«{query}»</span>
            <Pencil className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
          </button>

          {match ? (
            <div className="space-y-5">
              <ContentBlock title={result.found.matchTitle}>
                <OfferCardGrid
                  cards={[tvodMovieCard(match, result.found.rentLabel)]}
                  owner={owner}
                />
              </ContentBlock>

              {similar.length > 0 && (
                <ContentBlock title={result.found.similarTitle}>
                  <OfferCardGrid
                    cards={similar.map((movie) => tvodMovieCard(movie, result.found.rentLabel))}
                    owner={owner}
                  />
                </ContentBlock>
              )}

              <ContentBlock title={result.found.packagesTitle} note={result.found.packagesNote}>
                <OfferCardGrid cards={tvodPackageCards} owner={owner} />
                <ul className="mt-3 space-y-1">
                  {result.found.includes.map((item) => (
                    <li
                      key={item}
                      className="text-muted-foreground flex items-start gap-1.5 text-xs"
                    >
                      <Check className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </ContentBlock>

              {
}
              {
}
              <div className="border-border grid gap-4 rounded-2xl border border-dashed p-4 sm:grid-cols-2 sm:items-center">
                <div className="min-w-0">
                  {
}
                  <div className="text-foreground text-base font-bold sm:text-lg">
                    {result.app.title}
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {result.app.body}
                  </p>
                  <SmartLink
                    href={result.app.href}
                    owner={owner}
                    className="border-primary text-primary hover:bg-primary/10 mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors"
                  >
                    {result.app.ctaLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </SmartLink>
                </div>

                {
}
                {result.app.image && (
                  <div className="ring-border relative aspect-[5/3] w-full overflow-hidden rounded-xl ring-1">
                    <Image
                      src={result.app.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 380px, 90vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border-border rounded-2xl border border-dashed p-4">
              <div className="text-foreground text-sm font-bold">{missing.title}</div>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{missing.body}</p>
              <button
                type="button"
                onClick={() => openLogin(missing.authReason)}
                className="border-primary text-primary hover:bg-primary/10 mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors"
              >
                <User className="size-4" aria-hidden="true" />
                {missing.ctaLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ContentBlock({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        {title}
      </div>
      <div className="mt-3">{children}</div>
      {note && <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{note}</p>}
    </div>
  );
}

function OfferCardCta({ cta, owner }: { cta: OfferCard["cta"]; owner: Owner }) {
  const { openLogin } = useAuth();
  const reason = cta.authReason;
  const className =
    "bg-primary text-primary-foreground inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 pt-0 text-xs font-semibold transition-opacity duration-300 hover:opacity-85 sm:h-10 sm:px-4 sm:text-sm";

  if (reason) {
    return (
      <button type="button" onClick={() => openLogin(reason)} className={className}>
        {cta.label}
        <ArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <SmartLink href={cta.href} owner={owner} className={className}>
      {cta.label}
      <ArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
    </SmartLink>
  );
}

function resolveOfferCard(card: OfferCard) {
  const plan = card.planId ? mobilePlans.find((item) => item.id === card.planId) : undefined;
  const headlineFromPlan = card.headline === undefined;
  return {
    headline: card.headline ?? plan?.data ?? "",
    subline: card.subline ?? (headlineFromPlan ? plan?.name : undefined),
    price: card.price ?? (plan ? `${plan.price}/сар` : undefined),
    priceNote: card.priceNote ?? (plan ? "НӨАТ-гүй" : undefined),
  };
}

function AnswerFeedback({ questionId }: { questionId: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const cast = (next: "up" | "down") => {
    setVote(next);
    try {
      localStorage.setItem(`univision-assistant-feedback-${questionId}`, next);
    } catch {
    }
  };

  if (vote) {
    return (
      <p className="text-muted-foreground animate-in fade-in mt-4 text-xs duration-300">
        Баярлалаа — санал тань бүртгэгдлээ.
      </p>
    );
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <span className="text-muted-foreground text-xs">Бид таньд тус болж чадсан уу?</span>
      <button
        type="button"
        onClick={() => cast("up")}
        aria-label="Тустай байсан"
        className="text-muted-foreground hover:text-primary hover:bg-muted flex size-7 items-center justify-center rounded-full transition-colors"
      >
        <ThumbsUp className="size-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => cast("down")}
        aria-label="Тустай байсангүй"
        className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-7 items-center justify-center rounded-full transition-colors"
      >
        <ThumbsDown className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

function SuggestionChips({
  items,
  onPick,
}: {
  items: AssistantQuestion[];
  onPick: (question: string) => void;
}) {
  return (
    <div className="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onPick(item.question)}
          className="bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors"
        >
          {item.question}
        </button>
      ))}
    </div>
  );
}

function NeonFrame({
  children,
  rounded,
  glow = false,
  className,
}: {
  children: React.ReactNode;
  rounded: string;
  glow?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {glow && (
        <div
          aria-hidden
          className={cn(
            "animate-neon-spin pointer-events-none absolute -inset-1 opacity-45 blur-lg",
            rounded,
          )}
          style={NEON_STYLE}
        />
      )}
      <div
        className={cn("animate-neon-spin relative p-0.5", rounded)}
        style={NEON_STYLE}
      >
        {children}
      </div>
    </div>
  );
}
