"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Headphones,
  CornerDownRight,
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
  AI_DISCLOSURE,
  buildFollowUp,
  buildNarrative,
  CLARIFY_INTRO,
  matchQuestion,
  resolveClarify,
  RESOLVING_STEPS,
  THINKING_STEP_MS,
  THINKING_STEPS,
  TRENDING_TOPIC_COUNT,
  trendingTopicLabel,
  type AssistantQuestion,
  type AssistantResult,
  type ClarifyResult,
  type DiagnosticResult,
  type OfferCard,
  type OfferResult,
  type Solution,
  type EscalateResult,
  type PlansResult,
  type TimelineResult,
} from "@/data/hero-assistant";
import type { Owner } from "@/lib/brand";
import { cn } from "@/lib/utils";
const NEON = "linear-gradient(90deg,#45c700,#2ad4ff,#a855f7,#45c700)";
/**
 * Хариулт гарах хүртэлх хугацаа. ТОГТМОЛ тоо БИШ — бодох трэйсийн алхмууд
 * дуустал хүлээнэ. Алхам нэмэх/хасахад хугацаа өөрөө дагана.
 */
const LOADING_MS = THINKING_STEPS.length * THINKING_STEP_MS;

type Block = {
  key: number;
  asked: string;
  matched: AssistantQuestion | null;
  status: "loading" | "ready";
  /**
   * `clarify` урсгалын хариултууд — `{ [step.id]: option.id }`.
   * Блокт хадгалагдана (компонентод БИШ) тул хумиад дэлгэхэд алдагдахгүй,
   * мөн олон блок зэрэг задарсан ч хоорондоо хольцолдохгүй.
   */
  answers: Record<string, string>;
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
        { key, asked, matched: matchQuestion(asked, questions), status: "loading", answers: {} },
      ]);
      setExpandedKey(key);
      setInput("");

      window.setTimeout(() => {
        setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, status: "ready" } : b)));
      }, LOADING_MS);
    },
    [questions],
  );

  /**
   * `clarify` урсгалын хариултуудыг солино. Сонгох, засах, эхнээс эхлэх —
   * гурвуулаа ЭНД ирнэ: `ClarifyView` дараагийн бүтэн map-аа өөрөө бодож
   * илгээдэг тул энд ганц л оноолт үлдэнэ.
   */
  const setAnswers = useCallback((key: number, next: Record<string, string>) => {
    setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, answers: next } : b)));
  }, []);

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
      {/* ⚠️ БОСОО ЗАЙГ ХУМИХ нөхцөл нь `min-width: 768px`-ТЭЙ ХОСЛОНО.
          Өмнө нь зөвхөн `max-height: 1024px` байсан — тэр нь НАМХАН ЗӨӨВРИЙН
          дэлгэцэд (1280×720) зориулагдсан ч, МОБАЙЛ утас (жишээ нь 375×812)
          ч мөн 1024px-ээс намхан тул утсан дээр БАС идэвхжиж, аль хэдийн
          нарийхан дэлгэц дээр `py-5`-ыг `py-1` (4px) болгож хумьдаг байв.
          Үр дүнд AI туслах promo banner-т наалдаж, хооронд нь ердөө 4px
          зай үлдэнэ. Өргөний хамгаалалт нэмснээр мобайл `py-5`-аа хэвээр
          авч, намхан desktop дээрх хумилт өөрчлөгдөөгүй хэвээр ажиллана. */}
      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-5 text-center transition-[max-width] duration-700 ease-out sm:py-8 md:py-10 [@media_(min-width:768px)_and_(max-height:1024px)]:py-1",
          // Хариулт гармагц туслахын хэсэг ӨРГӨСӨНӨ — зөвлөмжийн карт,
          // багцын харьцуулалт зэрэг нь 3xl дотор шахагдахгүй.
          blocks.length > 0 && "max-w-5xl",
          heroRest
            ? "min-h-[calc((100svh-var(--header-h))*0.28)] md:min-h-[calc((100svh-var(--header-h))*0.4)]"
            : "min-h-[34svh] sm:min-h-[44svh] md:min-h-[46svh]",
        )}
      >
        <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur">
          <Sparkles className="text-primary size-3.5" aria-hidden="true" />
          Highlight keyword байна
        </span>

        <h1 className="text-foreground mt-4 text-2xl font-extrabold tracking-tight text-balance sm:mt-6 sm:text-3xl md:text-4xl [@media_(min-width:768px)_and_(max-height:1024px)]:mt-2">
          AI <span className="from-primary bg-clip-text text-[#45c700]">assistant</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm text-pretty sm:mt-4 sm:text-base md:text-lg [@media_(min-width:768px)_and_(max-height:1024px)]:mt-1.5">
          Ai assistant-н Capability-г сайн госон text энд байрлана.
        </p>
        <div className="relative mt-5 w-full sm:mt-8 [@media_(min-width:768px)_and_(max-height:1024px)]:mt-3">
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
                onAnswers={(next) => setAnswers(block.key, next)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// =====================================================================
// TRENDING TOPICS — input-ийн доорх "их хайгдсан сэдэв"-ийн чипүүд
// =====================================================================
/**
 * Чип бүр ӨӨРИЙН БИЧВЭРИЙН ӨРГӨНӨӨР тавигдаж, мөрөнд багтсанаараа
 * 2-3-уулаа зэрэгцэнэ (`flex-wrap`, голлуулсан).
 *
 * ⚠️ ӨМНӨ НЬ `grid` байсан: `grid-cols-2/4/6` дээр чип бүр `col-span-2`.
 * Grid-ийн нүд нь чипийг БҮТЭН өргөндөө СУНГАДАГ тул мобайл дээр чип бүр
 * дэлгэцийн бүтэн өргөнтэй, хоорондоо яг ижил хэмжээтэй болж "хиймэл"
 * харагддаг байв. Бодит хайлтын сэдэв урт богино янз бүр байдаг тул
 * агуулгынх нь өргөнөөр тавих нь зөв.
 *
 * "`flex-wrap` бол мобайл дээр 5 чип 5 мөр болно" гэсэн өмнөх эргэлзээ нь
 * шошго ХЭТ УРТ (32 тэмдэгт) байснаас үүдэлтэй байв. Шошгыг богиносгосон
 * (`TRENDING_TOPIC_PLACEHOLDER`) тул одоо мөр бүрд 2-3 чип багтаж, нийт
 * 2 мөр хэвээр үлдэнэ:
 *   мобайл (<640px) — мөрөнд 2, харагдах чип 4 (5 дахь нь нуугдана)
 *   sm+            — мөрөнд 3, бүх 5 чип → 3 + 2
 *
 * ⚠️ `sm:max-w-lg` — чипний бөөгнөрөл нь ДЭЭРХ input-ээс НАРИЙХАН байна.
 * Үүнгүй бол 5 чип 736px өргөн мөрөнд БҮГД багтаж, input-ийн бүтэн өргөнийг
 * ирмэгээс ирмэг хүртэл дүүргэсэн нэг зурвас болж, дахиад "сунгасан" мэдрэмж
 * төрүүлдэг. Бодит дата (урт богино янз бүр) ирэхэд ч энэ хязгаар нь мөрийг
 * 2-3 чипээр хуваасаар байна.
 *
 * ⚠️ Дарагдахгүй (`<li>`, товч БИШ) — шошго нь placeholder тул `ask()` дуудвал
 * "таньсангүй" fallback гарна. Бодит сэдэв ирэхэд товч болно.
 */
function TrendingTopics() {
  return (
    // `aria-hidden` — ижил placeholder-ийг 5 удаа уншуулах нь SR-д утгагүй.
    <ul
      aria-hidden="true"
      className="mt-2.5 flex w-full flex-wrap items-center justify-center gap-2 sm:mt-3 sm:max-w-lg [@media_(min-width:768px)_and_(max-height:1024px)]:mt-1.5"
    >
      {Array.from({ length: TRENDING_TOPIC_COUNT }, (_, i) => (
        <li
          key={i}
          className={cn(
            // `px-2.5 sm:px-3` — хамгийн нарийн утсанд (320px) хоёр чип нэг мөрд
            // багтаах зайг гаргана; `px-3` дээр 290 > 288 болж 1 мөрд 1 чип үлддэг.
            "border-border bg-card/70 text-muted-foreground flex items-center rounded-full border px-2.5 py-1 text-xs whitespace-nowrap backdrop-blur sm:px-3",
            // Мобайл дээр 2 мөрд барих нуулт: 2 + 2 = 4 чип. sm+ дээр бүгд.
            i >= 4 && "hidden sm:flex",
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
  onAnswers,
}: {
  ref?: React.Ref<HTMLElement>;
  block: Block;
  expanded: boolean;
  onToggle: () => void;
  questions: AssistantQuestion[];
  onPick: (question: string) => void;
  onAnswers: (next: Record<string, string>) => void;
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
            <ThinkingTrace steps={THINKING_STEPS} />
          ) : (
            <Answer block={block} questions={questions} onPick={onPick} onAnswers={onAnswers} />
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

        {/* clarify — тодруулах асуулт + сонголтын чипүүд */}
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

// =====================================================================
// ANSWER — тойм + үр дүн + CTA
// =====================================================================
function Answer({
  block,
  questions,
  onPick,
  onAnswers,
}: {
  block: Block;
  questions: AssistantQuestion[];
  onPick: (question: string) => void;
  onAnswers: (next: Record<string, string>) => void;
}) {
  const matched = block.matched;

  /**
   * Тойм бичигдэж ДУУСТАЛ доорх бие гарахгүй — аажим задрах (progressive
   * disclosure). Бүгд нэг дор дүрсхийвэл "урьдчилан бэлдсэн" мэт харагдана.
   *
   * `TypingAnimation` нь reduced-motion үед шууд дуусдаг тул тэр тохиолдолд
   * бие ч мөн шууд гарна — хүлээлт үүсэхгүй.
   */
  const [introDone, setIntroDone] = useState(false);

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
      {/* AI мэдэгдэл — агуулга урьдчилан бэлдсэн ч түүнийг НУУХГҮЙ. */}
      <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs">
        <Sparkles className="text-primary size-3.5" aria-hidden="true" />
        {AI_DISCLOSURE}
      </p>

      {/* Тойм нь ҮСЭГ ҮСГЭЭР бичигдэнэ — бэлэн текст дүрсхийж гарахаас
          илүү "хариулж байгаа" мэдрэмж өгнө. `TypingAnimation` нь
          reduced-motion үед шууд бүтнээр нь харуулдаг. */}
      <p className="text-muted-foreground text-sm leading-relaxed">
        {/* duration/delay — НИЙТ хүлээлтийг барихаар сонгосон: бодох трэйс
            ~1.26с + тойм ~0.7с ≈ 2с. Үүнээс урт бол "удаан", богино бол
            "бодоогүй" мэт санагдана. */}
        <TypingAnimation duration={12} delay={0} onComplete={() => setIntroDone(true)}>
          {matched.summary}
        </TypingAnimation>
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
        {introDone && matched.result.kind === "clarify" && (
          <ClarifyView
            result={matched.result}
            answers={block.answers}
            onAnswers={onAnswers}
            owner={matched.owner}
          />
        )}
      </div>

      {/* ↳ ДАРААГИЙН САНАЛУУД — хариултыг хаалттай төгсгөл болгохгүй.
          Байхгүй id-г ШҮҮЖ хаяна: хуурамч affordance гаргахгүй. */}
      {introDone && matched.followUps && matched.followUps.length > 0 && (
        <ul className="border-border/60 mt-5 border-t">
          {matched.followUps.map((id) => {
            const next = questions.find((item) => item.id === id);
            if (!next) return null;
            return (
              <li key={id} className="border-border/60 border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() => onPick(next.question)}
                  className="text-foreground hover:text-primary flex w-full items-start gap-2.5 py-2.5 text-left text-sm transition-colors"
                >
                  <CornerDownRight
                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {next.question}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {introDone && <AnswerFeedback questionId={matched.id} />}

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

// =====================================================================
// ⑤ CLARIFY — хэрэгцээг тодруулаад ТОХИРОХ шийдлийг санал болгоно
// =====================================================================
/**
 * Нэг компонент, хоёр төлөв:
 *   1. Бөглөж дуусаагүй — дараагийн тодруулах асуулт + сонголтын товчнууд
 *   2. Дууссан         — ЯГ НЭГ зөвлөмж + "яагаад" + бусад боломж
 *
 * Хариултууд нь ЭНД биш, `ChatHero`-ийн `Block.answers`-т хадгалагдана.
 * Тиймээс блокийг хумиад дахин дэлгэхэд сонголт нь алдагдахгүй, мөн нэг
 * дэлгэц дээр хэд хэдэн асуулт зэрэг задарсан ч бие биедээ нөлөөлөхгүй.
 *
 * ⚠️ Төлөв өөрчлөх БҮХ үйлдэл НЭГ callback-аар (`onAnswers`) явна — сонгох,
 * өмнөх хариултаа засах, эхнээс нь эхлэх гурвуулаа зүгээр л ШИНЭ map
 * илгээдэг. Ингэснээр `ChatHero` тал нь ганц мөр логиктой үлдэнэ.
 */
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
  // Бөглөгдөөгүй ЭХНИЙ алхам = одоо асуух асуулт. -1 бол бүгд бөглөгдсөн.
  const currentIndex = result.steps.findIndex((step) => !answers[step.id]);
  const done = currentIndex === -1;
  const outcome = done ? resolveClarify(result, answers) : null;

  /**
   * Сүүлийн хариултын дараа зөвлөмжийг ШУУД бус, богино "бодох" үе
   * дамжуулж гаргана — тэгэхгүй бол хариулт нь урьдчилан бэлдсэн мэт
   * санагдана.
   *
   * ⚠️ Төлвийг `useEffect`-ээс биш, ДАРСАН МӨЧИД нь асаана — эс бөгөөс
   * `react-hooks/set-state-in-effect` зөрчигдөнө.
   */
  const [resolving, setResolving] = useState(false);

  const pick = (stepId: string, optionId: string) => {
    const next = { ...answers, [stepId]: optionId };
    onAnswers(next);
    if (result.steps.every((step) => next[step.id])) {
      setResolving(true);
      window.setTimeout(() => setResolving(false), RESOLVING_STEPS.length * THINKING_STEP_MS);
    }
  };

  // Өмнөх алхмын хариулт — дараагийн асуултыг түүнд ИШ ТАТАЖ асууна
  const prevStep = currentIndex > 0 ? result.steps[currentIndex - 1] : null;
  const prevPick = prevStep?.options.find((option) => option.id === answers[prevStep.id]);

  /**
   * Тухайн алхмаас ХОЙШХИ бүх хариултыг цэвэрлэнэ. Зөвхөн тэр нэгийг нь
   * устгавал дараагийн хариултууд нь хуучин контекст дээр тулгуурласан хэвээр
   * үлдэж, зөвлөмж нь буруу үндэслэлтэй болно.
   */
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
      {/* ── Хариулсан алхмууд — дарвал ТЭНДЭЭС нь дахин эхэлнэ ── */}
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

      {/* ── Идэвхтэй тодруулах асуулт ── */}
      {!done && (
        <div className="animate-in fade-in slide-in-from-bottom-1 mt-3 duration-500 ease-out">
          <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Тодруулах асуулт {currentIndex + 1}/{result.steps.length}
          </div>

          {/* Эхний асуултад — ЯАГААД асууж байгааг тайлбарлана.
              Дараагийнхад — өмнөх хариултыг ИШ ТАТНА. Хоёулаа "намайг
              сонсож байна" гэсэн мэдрэмж өгнө. */}
          <p className="text-muted-foreground mt-1.5 text-xs">
            {prevPick ? `«${prevPick.label}» — тэмдэглэж авлаа.` : CLARIFY_INTRO}
          </p>
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

      {/* ── Зөвлөмж ── */}
      {/* Бодож байгаа үе — зөвлөмжийн ОРОНД трэйс харагдана */}
      {resolving && (
        <div className="animate-in fade-in mt-4 duration-300">
          <ThinkingTrace steps={RESOLVING_STEPS} />
        </div>
      )}

      {outcome && !resolving && (
        <div className="animate-in fade-in slide-in-from-bottom-2 mt-4 duration-700 ease-out">
          <div className="border-primary/60 bg-primary/5 rounded-2xl border p-4">
            <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Танд тохирох шийдэл
            </div>

            {/* ЯРИАНЫ ХАРИУЛТ — бүтэцтэй дэлгэрэнгүйн ӨМНӨ. Хэрэглэгчийн
                хэлсэнг иш татаж, яагаад ийм дүгнэлтэд хүрснийг нэг
                өгүүлбэрээр хэлнэ. Үсэглэн бичигдэнэ. */}
            <p className="text-foreground mt-2 text-sm leading-relaxed">
              <TypingAnimation duration={12} delay={0}>
                {buildNarrative(result, outcome)}
              </TypingAnimation>
            </p>

            <div className="text-foreground mt-4 text-base font-bold">{outcome.best.title}</div>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {outcome.best.description}
            </p>

            <SolutionBody solution={outcome.best} layout={result.layout} />

            {/* ⚠️ Өмнөх "Яагаад: …" мөрийг ХАСАВ — ярианы хариулт дотор
                хэрэглэгчийн хариултууд аль хэдийн иш татагдсан тул давхардна. */}

            {outcome.best.cta && (
              <SmartLink
                href={outcome.best.cta.href}
                owner={owner}
                className="bg-primary text-primary-foreground mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-semibold transition-opacity duration-300 hover:opacity-85"
              >
                {outcome.best.cta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </SmartLink>
            )}
          </div>

          {/* Бусад боломж — зөвлөмжийг "хар хайрцаг" болгохгүйн тулд. Хаалттай
              эхэлнэ: сонирхсон хүн л дэлгэнэ. `<details>` нь JS-гүй, гар,
              screen reader-т ажиллана. */}
          {/* Дараагийн алхмын санал — яриаг хаалттай төгсгөл болгохгүй */}
          {buildFollowUp(outcome) && (
            <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
              <span aria-hidden="true">👉 </span>
              {buildFollowUp(outcome)}
            </p>
          )}

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
            onClick={() => onAnswers({})}
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

// =====================================================================
// SOLUTION BODY — зөвлөмж кейс бүрт ӨӨР хэлбэрээр задарна
// =====================================================================
/**
 * Persona бүр ижилхэн харагдвал "динамик" мэдрэмж алдагдана. Тиймээс
 * зөвлөмжийн ГАРЧИГ, ТАЙЛБАР, CTA нь бүгдэд ижил ч ДУНД нь орох бие нь
 * `layout`-аар солигдоно:
 *
 *   plans    — багцын харьцуулалт. Үнэ, датаг `mobilePlans`-аас уншина
 *              (`Solution.planIds`), энд давхардуулж бичихгүй.
 *   steps    — дугаарласан алхмууд (`Solution.steps`)
 *   solution — энгийн онцлохын жагсаалт (`Solution.highlights`) — DEFAULT
 *
 * Тухайн layout-д хэрэгтэй дата дутуу бол чимээгүй `highlights` руу унана —
 * агуулгын алдаа бүхэл урсгалыг унагаах ёсгүй.
 */
function SolutionBody({
  solution,
  layout,
}: {
  solution: Solution;
  layout: ClarifyResult["layout"];
}) {
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

// =====================================================================
// THINKING TRACE — "туслах бодож байна" гэдгийг харагдуулна
// =====================================================================
/**
 * Алхмууд нэг нэгээр гарч ирээд, дуусмагц ✓ болно. Хамгийн сүүлийнх нь
 * эргэлдэж байгаа spinner-тэй — өөрөөр хэлбэл "одоо ЭНЭ дээр ажиллаж байна".
 *
 * Яагаад spinner ганцаараа биш: spinner нь "хүлээ" гэдгийг л хэлдэг. Харин
 * нэрлэсэн алхмууд нь ЮУ хийж байгааг хэлж, хариулт гармагц тэр нь
 * үндэслэлтэй санагдана.
 *
 * ⚠️ `setState` нь effect-ийн БИЕД биш, `setInterval`-ийн callback дотор —
 * `react-hooks/set-state-in-effect` дүрэм зөвшөөрдөг хэлбэр.
 *
 * ⚠️ Дууссаны дараа interval-аа өөрөө зогсооно (`steps.length`-д хүрмэгц)
 * — блок задарсан хэвээр удаан үлдвэл хоосон tick тоолсоор байх ёсгүй.
 */
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

// `AnswerSkeleton` нь ТҮР хэрэглэгдэхгүй — loading төлөв нь `ThinkingTrace`
// рүү шилжсэн. Компонентыг устгаагүй (clarify БУС кейст хэрэг болно) тул
// TypeScript-ийн "unused" зэмлэлийг `void`-оор дардаг — repo-гийн жишиг
// (`page.tsx`-ийн `void UnitelHome`, `univision-home.tsx`-ийн `void TrustOrbit`).
void AnswerSkeleton;

// =====================================================================
// ⑥ OFFER — шууд санал + худалдан авах CTA + нэвтрэх урилга
// =====================================================================
/**
 * Гурван давхарга (дараалал нь ЗОРИУД):
 *   1. Картууд    — хэрэглэгч НЭВТРЭХГҮЙГЭЭР ч шууд авч чадна. Үнэ цэнийг
 *                   эхлээд өгөх нь ямар нэг зүйл шаардахаас илүү үр дүнтэй.
 *   2. Нэвтрэх    — "хэрэглээг чинь харвал ЯГ тохирохыг олно" гэсэн санал.
 *                   Заавал биш, харин илүү сайн үр дүнгийн урилга.
 *
 * ⚠️ Нэвтрэх товч нь БОДИТООР ажиллана — `useAuth().openLogin(reason)` нь
 * `AuthProvider`-ийн login dialog-ийг нээнэ. Хуурамч affordance биш.
 */
function OfferView({ result, owner }: { result: OfferResult; owner: Owner }) {
  const { openLogin, isAuthenticated } = useAuth();

  return (
    <div>
      {/* BULLET ЖАГСААЛТ — гол хариулт нь ТЕКСТ. Нэр тод, гол тоо хажууд нь.
          Картууд доор нь давтагдана: жагсаалт нь ХУРДАН УНШИХАД, карт нь
          ҮЙЛДЭХЭД зориулагдсан (Verizon-ы жишээ ч ингэж давхардуулдаг). */}
      <ul className="mb-4 space-y-1.5">
        {result.cards.map((card) => {
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

      {/* Мобайл — ХЭВТЭЭ ГҮЙЛТ (Verizon-ы жишээ шиг): 3 карт нарийн дэлгэц
          рүү шахагдахын оронд хажуу тийш гүйнэ, дараагийнх нь ирмэгээс
          цухуйж гүйх боломжтойг илэрхийлнэ. sm+ дээр энгийн грид. */}
      <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {result.cards.map((card) => {
          // `planId` өгсөн бол үнэ, датаг `mobile-plans.ts`-ээс уншина —
          // тэдгээрийг кейсийн дата дотор давхардуулж бичихгүй.
          const { headline, subline, price } = resolveOfferCard(card);

          return (
            <div
              key={card.id}
              className={cn(
                "border-border relative flex w-[78%] shrink-0 snap-start flex-col rounded-2xl border p-4 sm:w-auto sm:shrink",
                card.badge && "border-primary/60 bg-primary/5",
              )}
            >
              {card.badge && (
                <span className="bg-primary text-primary-foreground absolute -top-2 left-4 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider">
                  {card.badge}
                </span>
              )}

              {/* Гол үзүүлэлт — нэг харцаар уншигдана */}
              <div className="text-foreground text-2xl leading-none font-extrabold">{headline}</div>
              {subline && <div className="text-muted-foreground mt-1 text-xs">{subline}</div>}

              {/* Үнэ — тогтмол үнэгүй шийдэлд байхгүй байж болно.
                  `oldPrice` байвал зураастай хуучин үнэ ЭХЭНД нь орно. */}
              {price && (
                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  {card.oldPrice && (
                    <span className="text-muted-foreground text-sm line-through">
                      {card.oldPrice}
                    </span>
                  )}
                  <span className="text-foreground text-lg leading-none font-extrabold">
                    {price}
                  </span>
                </div>
              )}

              {/* Нэмэлт тэмдэглэл ("x3 хурд") — брэндийн өнгөөр онцолно */}
              {card.note && (
                <div className="text-primary mt-1.5 text-xs font-semibold">{card.note}</div>
              )}

              {card.highlights && card.highlights.length > 0 && (
                <ul className="mt-3 space-y-1">
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

              {/* `mt-auto` — картуудын өндөр зөрсөн ч товчнууд нэг шугамд суумаар */}
              <SmartLink
                href={card.cta.href}
                owner={owner}
                className="bg-primary text-primary-foreground mt-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 pt-0 text-sm font-semibold transition-opacity duration-300 hover:opacity-85"
              >
                {card.cta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </SmartLink>
            </div>
          );
        })}
      </div>

      {/* ── Хувийн санал — нэвтэрсэн хүнд харуулах шаардлагагүй ── */}
      {!isAuthenticated && (
        <div className="border-border mt-4 flex flex-col gap-3 rounded-2xl border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm leading-relaxed">{result.personalize.text}</p>
          <button
            type="button"
            onClick={() => openLogin(result.personalize.reason)}
            className="border-primary text-primary hover:bg-primary/10 inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors"
          >
            <User className="size-4" aria-hidden="true" />
            {result.personalize.ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * `planId` өгсөн карт нь утгаа `mobile-plans.ts`-ээс авна. Bullet жагсаалт ба
 * карт ХОЁУЛАА үүнийг дуудна — нэг эх сурвалж, зөрөх боломжгүй.
 */
function resolveOfferCard(card: OfferCard) {
  const plan = card.planId ? mobilePlans.find((item) => item.id === card.planId) : undefined;
  return {
    headline: card.headline ?? plan?.data ?? "",
    subline: card.subline ?? plan?.name,
    price: card.price ?? plan?.price,
  };
}

// =====================================================================
// ANSWER FEEDBACK — "Тус болов уу?" 👍 👎
// =====================================================================
/**
 * ⚠️ Backend АЛГА. Санал нь зөвхөн `localStorage`-д үлдэнэ — өөрөөр хэлбэл
 * бидэнд ХҮРЭХГҮЙ. Гэсэн ч дарсан хүнд хариу үйлдэл өгөх нь чухал тул
 * төлвийг хадгалж, дахин асуухгүй.
 *
 * Бодит хэмжилт хэрэгтэй болбол энэ функцийн дотроос analytics руу илгээнэ —
 * UI хөндөгдөхгүй.
 */
function AnswerFeedback({ questionId }: { questionId: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const cast = (next: "up" | "down") => {
    setVote(next);
    try {
      localStorage.setItem(`univision-assistant-feedback-${questionId}`, next);
    } catch {
      // localStorage хориотой орчинд (private mode) зүгээр алгасна
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
