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
/**
 * Оролтын градиент хүрээ ба туяа.
 *
 * ⚠️ ХАТУУ НЕОНООС БҮДЭГ ПАСТЕЛЬ РУУ (`#45c700,#2ad4ff,#a855f7` байсан).
 * Хуучин гурван өнгө нь бүрэн ханасан тул 1px хүрээ ч гэсэн оролтын
 * АГУУЛГААС илүү анхаарал татдаг байв. Одоо голдоо цагаан орж, өнгө нь
 * зөвхөн ирмэгийн хоёр талд бүдэг үлдэнэ — "гэрэл тусаж байгаа" мэт.
 *
 * ⚠️ ЗОГСООЛЫГ ХУВИАР БЭХЛЭВ. Жигд тархсан үед 2px хүрээнд өнгө бүр
 * өөрийгөө таниулах зай аваагүй тул бүгд нэг нэгэндээ УУСДАГ байв.
 *
 * ⚠️ CONIC (LINEAR БИШ) — өнгө нь хүрээг ТОЙРЧ эргэлдэнэ. `linear` үед
 * зүүнээс баруун тийш гулсдаг байв. Эргэлт нь `--neon-angle`-ээр
 * (`globals.css`-ийн `@property` + `.animate-neon-spin`) хийгдэнэ.
 *
 * Эхний ба сүүлийн өнгө ИЖИЛ байх ЁСТОЙ — conic нь 360°-т эргэж
 * хаагддаг тул зөрвөл тэр цэг дээр өнгө ҮСРЭНЭ.
 */
const NEON =
  "conic-gradient(from var(--neon-angle),#8be06a,#c6efb6 14%,#ffffff 30%,#f3b6ea 54%,#accbf7 76%,#8be06a)";

/**
 * ⚠️ `--neon-angle`-ийг ЭНД БАС тавьж байгаа нь ЗААВАЛ.
 *
 * `globals.css`-ийн `@property` нь өнцгийг ХӨДӨЛГӨХ боломж олгодог ч,
 * тэр дүрэм ямар нэг шалтгаанаар хүрч ирээгүй бол (хуучин хөтөч,
 * dev server-ийн хуучирсан CSS хэсэг) `var(--neon-angle)` нь юу ч
 * буцаахгүй → `conic-gradient(...)` бүхэлдээ ХҮЧИНГҮЙ болж
 * `background-image: none` гарна. Өөрөөр хэлбэл ХҮРЭЭ БҮРЭН АЛГА БОЛНО.
 *
 * Inline утга нь fallback: хамгийн муудаа хүрээ нь ХӨДӨЛГӨӨНГҮЙ
 * харагдана, харин хэзээ ч алга болохгүй. `@property` ажиллаж байвал
 * анимаци энэ утгыг дарж бичнэ (keyframe нь inline style-аас илүү
 * жинтэй).
 */
const NEON_STYLE = {
  "--neon-angle": "0deg",
  backgroundImage: NEON,
} as React.CSSProperties;
/**
 * Хариулт гарах хүртэлх хугацаа. ТОГТМОЛ тоо БИШ — бодох трэйсийн алхмууд
 * дуустал хүлээнэ. Алхам нэмэх/хасахад хугацаа өөрөө дагана.
 */
const LOADING_MS = THINKING_STEPS.length * THINKING_STEP_MS;

/**
 * Оролтыг дэлгэцийн доод ирмэгээс ХЭР ЗАЙД зогсоох вэ.
 *
 * ⚠️ ТОГТМОЛ ТОО БОЛОХГҮЙ. Мобайл хөтчүүд доод талд ХӨВӨГЧ элемент
 * (хаягийн мөр, товчны зурвас) харуулдаг бөгөөд эдгээр нь `visualViewport`
 * -ын өндрийг ҮРГЭЛЖ хумьдаггүй — зарим нь зүгээр л агуулгын ДЭЭГҮҮР хөвнө.
 * Тиймээс 32px зай хангалтгүй байж, оролт тэдгээрийн доор ордог байв.
 *
 * Дэлгэцийн өндрийн 12% нь төхөөрөмж бүрд харьцангуй тогтвортой цэвэр зай
 * өгнө. Доод хязгаар 56px (жижиг дэлгэц), дээд хязгаар 120px (том дэлгэц
 * дээр хэт их хоосон зай үлдээхгүй):
 *   375×667  → 80px
 *   390×844  → 101px
 *   1440×900 → 108px
 */
function bottomGap(viewportHeight: number): number {
  return Math.min(Math.max(viewportHeight * 0.12, 56), 120);
}

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
  /**
   * НҮҮРНЭЭС уламжлан ирсэн блок — хэрэглэгч АЛЬ ХЭДИЙН уншсан хариулт.
   *
   * Тойм нь үсэг үсгээр ДАХИН бичигдэхгүй, бодох трэйс ч гарахгүй: шууд
   * бүтнээрээ, картуудтайгаа хамт харагдана. Эс бөгөөс нүүрэн дээр дуусч
   * уншигдсан хариулт `/assistant` дээр эхнээсээ дахин "боддог" тул
   * хэрэглэгчид АЛДАА мэт харагдана.
   */
  carried?: boolean;
};
export function ChatHero({
  heroRest = false,
  mode = "hero",
  initialQuestions = [],
}: {
  heroRest?: boolean;
  /**
   * `hero` — нүүрэн дээр. ГАНЦ хариулт харуулна, хоёр дахь асуултад
   *          `/assistant` руу шилжинэ.
   * `page` — `/assistant` дээр. Бүтэн яриа, оролт доод талдаа.
   */
  mode?: "hero" | "page";
  /** `page` горимд URL-ээс ирсэн яриа */
  initialQuestions?: string[];
} = {}) {
  const questions = assistantQuestions;
  const router = useRouter();
  const isPage = mode === "page";

  const [input, setInput] = useState("");
  // URL-ээс ирсэн яриаг ЭХНИЙ render дээр шууд босгоно (effect-гүй) —
  // ингэснээр server ба client ижил зүйл render хийж, hydration зөрөхгүй.
  /**
   * URL-ийн ЯРИА → блокууд. ЭЦСИЙН асуулт нь ШИНЭ (нүүрэн дээр хэрэглэгч
   * зүгээр бичээд шилжсэн, хариулт нь хараахан гараагүй) тул тэр нь
   * "бодож байна" төлвөөс эхэлж, тоймоо бичнэ. Түүнээс өмнөх бүх блок нь
   * нүүрэн дээр аль хэдийн уншигдсан — `carried`, шууд бүтнээрээ гарна.
   */
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
  /** Persona товч дарахад оролтыг бөглөөд ФОКУС өгнө — Enter дарахад бэлэн. */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * `clarify` урсгалын хариултуудыг солино. Сонгох, засах, эхнээс эхлэх —
   * гурвуулаа ЭНД ирнэ: `ClarifyView` дараагийн бүтэн map-аа өөрөө бодож
   * илгээдэг тул энд ганц л оноолт үлдэнэ.
   */
  const setAnswers = useCallback((key: number, next: Record<string, string>) => {
    setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, answers: next } : b)));
  }, []);

  const ask = useCallback(
    (text: string) => {
      const asked = text.trim();
      if (!asked) return;

      /**
       * ⚠️ КОНТЕНТ ХАЙЛТ ХҮЛЭЭЖ БАЙВАЛ — бичсэнийг ШИНЭ асуулт БИШ, тэр блокийн
       * ХАЙЛТ болгоно. Эс бөгөөс киноны нэр нь ямар ч кейстэй таарахгүй тул
       * "таньсангүй" гэсэн хариулт гарч, урсгал тасарна.
       */
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

      // HERO дээр яриа ОВООЛОХГҮЙ. Эхний асуулт энд хариулагдана; хоёр дахиас
      // эхлээд бүтэн яриаг URL-д хийж `/assistant` руу шилжүүлнэ.
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

  /**
   * URL-ЭЭС ИРСЭН ШИНЭ АСУУЛТ — бодох трэйсийг ЖИНХЭНЭ хугацаагаар дуусгаад
   * хариулт руу гаргана. Блокийг `status: "loading"`-ээр босгосон нь server ба
   * client ижил зүйл render хийхийн тулд (hydration зөрөхгүй); төлвийг
   * зөвхөн ХӨТӨЧ дээр солино.
   *
   * ⚠️ ХАМГААЛАЛТЫГ REF-ЭЭР ТАВИЖ БОЛОХГҮЙ. Өмнө нь `pendingInitialKey`
   * ref-ийг effect-ийн БИЕД null болгож байсан: React StrictMode (dev) нь
   * effect-ийг mount дээр ХОЁР УДАА ажиллуулдаг бөгөөд ref нь хоёр
   * ажиллалтын хооронд ХАДГАЛАГДДАГ. Тиймээс 1-р ажиллалт ref-ээ хааж
   * timer тавьдаг → цэвэрлэгээ тэр timer-ийг цуцалдаг → 2-р ажиллалт нь
   * ref нь null болсныг хараад ЮУ Ч ХИЙХГҮЙ гардаг. Үр дүнд блок
   * `loading` дээр ҮҮРД гацаж, бодох трэйс нь дуусаад юу ч болдоггүй.
   *
   * Одоо хамгаалалт нь ТӨЛӨВ дээр: mount-ийн үеийн эцсийн key-г хааж авч,
   * дахин ажиллавал ижил блокийг ижил төлөв рүү л оноодог (idempotent).
   */
  useEffect(() => {
    if (initialQuestions.length === 0) return;
    const key = initialQuestions.length - 1;

    const timer = window.setTimeout(() => {
      setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, status: "ready" } : b)));
    }, LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [initialQuestions.length]);

  /**
   * Эхнээс эхлэх — хариултуудыг цэвэрлэж, том оролт руу буцна.
   * `/assistant` дээр бол URL-ийн яриаг ч цэвэрлэнэ (эс бөгөөс дахин
   * ачаалахад хуучин яриа буцаж ирнэ).
   */
  const startOver = useCallback(() => {
    setBlocks([]);
    setInput("");
    if (isPage) router.replace(ASSISTANT_PATH);
  }, [isPage, router]);

  /**
   * Persona товчны үйлдэл: оролтыг БӨГЛӨНӨ, ИЛГЭЭХГҮЙ. Хэрэглэгч өөрөө уншиж,
   * хүсвэл засаад Enter дарна.
   */
  const fillInput = useCallback((text: string) => {
    setInput(text);
    inputRef.current?.focus();
  }, []);

  /**
   * САНАЛ БОЛГОХ АСУУЛТУУД — ЗӨВХӨН СҮҮЛИЙН хариултынх. Оролт нь яриа дотор
   * нэг л удаа, сүүлийн блокийн дор гардаг тул чипүүд ч тэндхийн контекстээс
   * гарна. Байхгүй id-г ШҮҮЖ хаяна: хуурамч affordance гаргахгүй.
   */
  const suggestions = (blocks[blocks.length - 1]?.matched?.followUps ?? []).flatMap((id) => {
    const next = questions.find((item) => item.id === id);
    return next ? [next] : [];
  });

  /**
   * Дараагийн асуултын оролт. ХОЁР байрлалд ижил агуулгатай гарна:
   *   embedded — хариултын картын ДОТОР, доод хэсэгт нь наалдаж НЭГ хайрцаг
   *              болно (карт + оролт хоёр тусдаа хайрцаг байх нь тасархай
   *              харагддаг байв)
   *   standalone — хариулт байхгүй үед (`/assistant` дээр цэвэрлэсний дараа)
   *
   * Ялгаа нь ЗӨВХӨН гадна хүрээ — дотоод бүтэц ижил тул хоёр хувилбар
   * хоорондоо зөрөх боломжгүй.
   *
   * БҮТЭЦ: дээр нь бичих талбай, доор нь ХЯНАЛТЫН МӨР (дахин эхлэх · санал
   * болгох чипүүд · илгээх). Хоёрын хооронд зай авснаар хайрцаг өндөр болж,
   * "бичих орон зай" нь ил харагдана.
   *
   * ⚠️ Санал болгох чипүүд нь ОРОЛТЫН ДОТОР. Өмнө нь хайрцгийн ГАДНА, дээр
   * талд, "Санал болгох асуултууд" гэсэн гарчигтай байв — тэр нь хариултын
   * нэг хэсэг мэт харагдаж, оролттой холбоо нь тасардаг байсан. Дотор
   * оруулснаар "эдгээрээс дар, эсвэл өөрөө бич" гэдэг нь гарчиггүйгээр
   * ойлгогдоно.
   */
  const followUpForm = (embedded: boolean) => (
    <NeonFrame
      rounded="rounded-2xl"
      className={cn(
        // `fade-in-0` — 0-ээс эхэлнэ. `duration-700` + `slide-in-from-bottom-4`
        // нь 500ms/2px байсныг тодруулсан.
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

        {/* ⚠️ `<input>` хэвээр, `<textarea>` БИШ: Enter нь формыг ИЛГЭЭХ ёстой,
            textarea дээр Enter нь шинэ мөр болно. Өндрийг доод мөрийн зайгаар
            авсан тул placeholder нь ДЭЭД зүүн буланд сууна. */}
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
          {/* Мобайл дээр шошгыг нууна — чипүүдэд орон зай хэрэгтэй. Дүрс нь
              өөрөө ойлгомжтой, `aria-label` нь SR-д бүтэн уншина. */}
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

  /** Сүүлийн блокийн төлөв — хариулт бэлэн болмогц дахин байрлуулахад */
  const lastStatus = blocks[blocks.length - 1]?.status;

  /**
   * Хамгийн сүүлийн хариултыг хэрэглэгчид ӨӨРӨӨ ХАРУУЛНА — гараар гүйлгэх
   * шаардлагагүй.
   *
   * ⚠️ ЯАГААД ГАНЦ УДААГИЙН `scrollIntoView` ХҮРЭЛЦЭХГҮЙ: хариулт нь ҮЕ
   * ШАТТАЙГААР ургадаг —
   *     skeleton → тойм үсэглэн бичигдэнэ → бие (bullet, карт) гарна
   *     → ↳ санал, 👍👎 нэмэгдэнэ
   * Эхний байрлуулалт нь ЗӨВХӨН skeleton-ий өндрөөр тооцогдох тул агуулга
   * ургамагц хариулт дэлгэцээс доошоо гарч, хэрэглэгч гараар гүйлгэхэд
   * хүрдэг байв. Тиймээс `ResizeObserver`-оор өндрийг нь ажиглаж, өссөн
   * бүрд дахин байрлуулна.
   *
   * ⚠️ ХЭРЭГЛЭГЧИЙГ ЧИРЭХГҮЙ: өөрөө гүйлгэж эхэлмэгц дагахаа болино.
   * Уншиж байгаа хүнийг байрлалаас нь татах нь хамгийн эвгүй зан. Мөн 5
   * секундын дараа ямар ч тохиолдолд салдаг — хэзээ ч мөнхөд дагахгүй.
   */
  useEffect(() => {
    const el = latestRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const place = () => {
      /**
       * Зорилт нь хариултын карт БИШ, ОРОЛТ. Хэрэглэгчийн дараагийн үйлдэл
       * тэнд болох тул түүнийг харагдуулах хүртэл гүйлгэнэ.
       *
       * `block: "end"` — оролтын доод ирмэгийг дэлгэцийн доод ирмэгт
       * зэрэгцүүлнэ. Ингэснээр хариулт нь дээшээ, оролт нь доод хэсэгт
       * бэлэн зогсоно.
       *
       * ⚠️ Хариултын карт руу гүйлгэдэг байсныг СОЛИВ: карт нь голдоо
       * тавигдахад оролт нь дэлгэцээс доош гарч, хэрэглэгч дахин гараар
       * гүйлгэхэд хүрдэг байв.
       */
      // ⚠️ `<input>` БИШ, БҮТЭН ФОРМ. Оролтын ДООР "↻ Дахин эхлэх / ↑" мөр
      // байдаг тул зөвхөн input-ийг зэрэгцүүлбэл тэр мөр доош гарна.
      const field = document.getElementById("chat-hero-input");
      const target = field?.closest("form") ?? el;
      const rect = target.getBoundingClientRect();

      /**
       * ⚠️ `scrollIntoView({ block: "end" })` ХЭРЭГЛЭХГҮЙ — тэр нь элементийн
       * доод ирмэгийг дэлгэцийн доод ирмэгт ЯГ нааж, мобайл хөтчийн доод
       * мөр (хаягийн талбар, товчнууд) оролтыг халхалдаг байв.
       *
       * `visualViewport.height` нь ЖИНХЭНЭ харагдах өндрийг өгнө
       * (`innerHeight` нь хөтчийн мөрийг оруулж тоолдог). Түүн дээр
       * `bottomGap()` зай нэмж, оролтыг ирмэгээс тодорхой дээгүүр зогсооно.
       */
      const viewportH = window.visualViewport?.height ?? window.innerHeight;
      const delta = rect.bottom - (viewportH - bottomGap(viewportH));

      // Аль хэдийн байрандаа байвал хөдөлгөхгүй — ResizeObserver давтан
      // дуудахад дэлгэц чичрэхээс сэргийлнэ.
      if (Math.abs(delta) < 2) return;

      window.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
    };

    place();

    // Өндөр өөрчлөгдөх бүрд БИШ, тогтсоны нь дараа байрлуулна. Үсэг бүрд
    // гүйлгэвэл дэлгэц чичирнэ.
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

    /**
     * Хэрэглэгчийн өөрийн гүйлгэлт — дагахаа болино.
     *
     * ⚠️ ЖИЖИГ ЧИЧРЭЛТЭЭР таслахгүй: trackpad дээр санамсаргүй нэг хүрэлт ч
     * `wheel` үүсгэдэг тул урьд нь дагалт эрт тасарч, оролт хагас
     * харагддаг байв. Мэдэгдэхүйц (>30px) гүйлгэлт л зогсооно.
     * (Программын `scrollIntoView` нь `wheel`/`touchmove` үүсгэдэггүй тул
     * өөрийгөө зогсоохгүй.)
     */
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
      // `data-glass` — LIQUID GLASS туршилтын хамрах хүрээ. `globals.css`-ийн
      // `[data-glass] .glass-surface` дүрэм зөвхөн энэ дотор ажиллана тул
      // нүүр хуудас хөндөгдөхгүй.
      data-glass={isPage ? "true" : undefined}
      className="bg-background animate-in fade-in relative w-full overflow-hidden duration-1000 ease-out"
    >
      {/* ШИЛНИЙ ГАЖУУДАЛ — `backdrop-filter: url(#glass-warp)`-аар дэвсгэрийг
          долгиолуулна (`globals.css`, `@supports` дотор). Chromium дээр
          ажиллана; бусад хөтөч дээр зөвхөн blur үлдэнэ.
          ⚠️ Зөвхөн `/assistant` дээр рендерлэнэ — нүүрэн дээр хэрэглэгддэггүй
          филтерийг DOM-д тавих шаардлагагүй. */}
      {/* ГЭРЭЛТҮҮЛЭГ — шилэн карт доорхыгоо шүүж харуулдаг тул хавтгай
          бараан дэвсгэр дээр эффект үл мэдэгдэнэ. Торны ДООР (түүнээс өмнө
          рендерлэгдэж байгаа тул) суух нь зөв: тор нь гэрэл дээр хэвтэнэ. */}
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
              {/* Бага давтамжтай шуугиан = том, зөөлөн долгион. Өндөр
                  давтамж нь шил биш, хяруу шиг харагдана. */}
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

      {/* ДЭВСГЭР — НҮҮРЭН ДЭЭР ДАВХАРГА ОГТ БАЙХГҮЙ.

          ⚠️ Өмнө нь энд `.assistant-wash` (дээрээс бууж ууссан саарал +
          доод талын ногоон туяа) байсныг ХАСАВ. Хуудасны бүх section нэг
          `bg-background` дээр суудаг тул тэр угаалт нь ЗӨВХӨН энэ section-ыг
          өнгөөр ялгаж, дээд ба доод ирмэг дээр нь ХАРАГДАХ ЗУУРАС үүсгэж
          байв — promo-гийн цэгэн заагчийн доор нэг, чипүүдийн доор нэг.
          Загварт бүх хуудас НЭГДСЭН НЭГ дэвсгэртэй.

          ⚠️ `/assistant` дээр тор ХЭВЭЭР: тэнд шилэн карт (`.glass-surface`)
          доорхыгоо шүүж харуулдаг тул хавтгай дэвсгэр дээр эффект нь үл
          мэдэгдэнэ — торыг авбал шилний ажил үрэгдэнэ. */}
      {isPage && (
        <InteractiveGridPattern
          width={40}
          height={40}
          squares={[42, 24]}
          // Хариулт нь хайрцаггүй тул бичвэр шууд торон дээр суудаг —
          // тор хэт тод бол шуугиан болно.
          className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] opacity-50"
        />
      )}
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
          // ⚠️ МОБАЙЛЫН ДЭЭД ЗАЙ = 40px (`pt-10`). Загварын хэмжээ 72px байсныг
          // бодит хуудсан дээр хэрэглэгч ХЭТ ИХ гэж үзсэн тул багасгав
          // (загварт гарчиг нь ганц богино мөр байсан бол энд гарчиг + тайлбар
          // хоёулаа байдаг тул блокийн жин илүү).
          // Картаас заагч хүртэлх 24px-тэй хамт: 24 → заагч → 40 → гарчиг.
          // Доод зай нь 20px хэвээр (`pb-5`) — тэр нь оролт руу шилжих зай.
          "relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 pt-10 pb-5 text-center transition-[max-width] duration-700 ease-out sm:py-8 md:py-10 [@media_(min-width:768px)_and_(max-height:1024px)]:py-1",
          // Хариулт гармагц туслахын хэсэг ӨРГӨСӨНӨ — зөвлөмжийн карт,
          // багцын харьцуулалт зэрэг нь 3xl дотор шахагдахгүй.
          blocks.length > 0 && "max-w-5xl",
          // ⚠️ `/assistant` дээр БОСОО ТӨВЛӨРҮҮЛЭЛТ ба доод хязгаар ХЭРЭГГҮЙ.
          // Нүүрэн дээр эдгээр нь оролтыг дэлгэцийн голд суулгах үүрэгтэй.
          // Хуудсан дээр яриа нь ДЭЭДЭЭСЭЭ уншигдах ёстой — эс бөгөөс эхний
          // асуултын дээр 300px хоосон зай гарч, breadcrumb-аас тасарна.
          isPage
            ? "min-h-0 justify-start py-6 sm:py-8 md:py-8"
            : heroRest
              ? "min-h-[calc((100svh-var(--header-h))*0.28)] md:min-h-[calc((100svh-var(--header-h))*0.4)]"
              : "min-h-[34svh] sm:min-h-[44svh] md:min-h-[46svh]",
        )}
      >
        {/* Нүүрний гарчиг — `/assistant` хуудсанд ХЭРЭГГҮЙ (тэнд хуудас өөрөө
            гарчигтай, оролт нь доод талдаа байна). */}
        {!isPage && (
          <>
            {/* ⚠️ «Highlight Keyword» BADGE ХАСАГДСАН (хэрэглэгчийн шийдвэр).
                Гарчгийн дээр суудаг PLACEHOLDER шошго байв — жинхэнэ онцлох
                үг (кампанит ажил, улирлын санал г.м.) хэзээ ч шийдэгдээгүй
                бөгөөд хүрээ нь доорх оролтын градиент хүрээтэй өрсөлдөж
                байлаа. Буцааж хэрэгтэй бол `blocks.length === 0` нөхцөлтэйгөөр
                гарчгийн ДЭЭР тавина — асуулт орсны дараа ХАРИУЛТ гол дүр
                болох тул тэр үед харагдах ёсгүй.

                ЧАДВАРЫН ТАЙЛБАР (доорх `<p>`) нь мөн ЗӨВХӨН асуухаас ӨМНӨ
                гарна. Текстийг нь хоослох БИШ, ЭЛЕМЕНТИЙГ нь бүхэлд нь хасна
                — эс бөгөөс margin нь үлдэж, хоосон зай гацна. */}

            <h1
              className={cn(
                "text-foreground text-2xl font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl",
                // ⚠️ ДЭЭД MARGIN ХАСАГДСАН. Өмнө нь `mt-4 sm:mt-6` байсан —
                // тэр нь гарчгийг ДЭЭД талын badge-ээс зааглах үүрэгтэй байв.
                // Badge устсаны дараа гарчиг нь энэ блокийн ЭХНИЙ элемент
                // болсон тул дээд зайг нь эцгийн `py-5/sm:py-8/md:py-10`
                // аль хэдийн өгдөг. Хоёулаа байхад promo-гийн цэгэн заагчаас
                // 36px (20 + 16) салж, хэт унжсан харагдаж байлаа.
                //
                // ДООД зай нь зөвхөн хариулт гарсан үед: тэгэхгүй бол гарчиг
                // хариултад шууд наалдана.
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
        {/* ХАРИУЛТ — оролтын ДЭЭР.
            ⚠️ DOM-ийн дараалал ҮРГЭЛЖ ижил (хариулт → оролт). Өмнө нь
            `order`-оор солидог байсан нь оролтыг нэг агшинд өөр байрлал руу
            ҮСРҮҮЛЖ, хатуу мэдрэгддэг байв. Одоо оролт хэзээ ч байрлалаа
            солихгүй — хариулт дээр нь гарч ирээд доошоо ТҮЛХЭНЭ. */}
        {blocks.length > 0 && (
          // Ярианы хэлбэрт блокууд хайрцаггүй тул зааг нь ЗАЙ — `space-y-3`
          // (12px) хүрэлцэхгүй, хариулт ба дараагийн асуулт нийлж харагдана.
          <div className={cn("w-full", isPage ? "space-y-10 sm:space-y-12" : "space-y-3")}>
            {blocks.map((block, i) => (
              <ResultBlock
                key={block.key}
                ref={i === blocks.length - 1 ? latestRef : undefined}
                block={block}
                questions={questions}
                onPick={ask}
                onAnswers={(next) => setAnswers(block.key, next)}
                latest={i === blocks.length - 1}
                footer={i === blocks.length - 1 ? followUpForm(true) : undefined}
                chat={isPage}
              />
            ))}
          </div>
        )}

        {/* ОРОЛТ — хоёр хувилбар:
              эхлэл  — ТОМ, неон хүрээтэй. Анхаарал татах нь гол үүрэг.
              дараа  — ЖИЖИГ follow-up хайрцаг. Хариулт гарсны дараа гол дүр нь
                       ХАРИУЛТ болох тул оролт өөрийгөө татаж, нарийн болно.
            Хувилбар солигдоход шинээр mount хийгддэг тул `animate-in`-ээр
            зөөлөн гарч ирнэ — гэнэт солигдсон мэт харагдахгүй. */}
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

        {/* Их хайгдсан сэдвүүд — зөвхөн хоосон төлөвт. Асуулт асуумагц үр дүн
            нь гол болох тул мөр замаас гарч, өндрөө буцааж өгнө. */}
        {!isPage && blocks.length === 0 && <PersonaShortcuts onFill={fillInput} />}
      </div>
    </section>
  );
}

/**
 * PERSONA ТОВЧНУУД — оролтын доор, дугаарын дарааллаар.
 *
 * ⚠️ Товч нь асуултыг ИЛГЭЭХГҮЙ, зөвхөн оролтыг БӨГЛӨНӨ (`onFill`). Хэрэглэгч
 * өөрөө уншиж, хүсвэл засаад Enter дарна. Автоматаар илгээвэл юу асуусан нь
 * харагдалгүй өнгөрч, "туслах өөрөө шийдчихлээ" гэсэн мэдрэмж төрүүлнэ.
 *
 * ⚠️ Тусдаа бүрэлдэхүүн: `onFill` нь ref (`inputRef`) хөнддөг тул `.map`
 * дотроос шууд closure болгож болохгүй — `react-hooks/refs`.
 *
 * ⚠️ ЭНЭ нь "Их хайгдсан сэдэв" placeholder-ийг ОРЛОВ. Тэр датаг
 * (`TRENDING_TOPIC_*`) устгаагүй — жинхэнэ хайлтын лог холбогдоход буцааж
 * тавина.
 */
function PersonaShortcuts({ onFill }: { onFill: (text: string) => void }) {
  return (
    <div className="mt-2.5 flex w-full flex-wrap items-center justify-center gap-2 sm:mt-3 sm:max-w-lg [@media_(min-width:768px)_and_(max-height:1024px)]:mt-1.5">
      {personaShortcuts.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onFill(item.question)}
          // Шошго нь БОГИНО тул нарийн утсанд ч мөрөнд 3 багтана. Асуултын
          // бүтэн текстийг тавибал 6 товч 6 мөр болно.
          title={item.question}
          className="border-border bg-card/70 text-muted-foreground hover:border-primary hover:text-foreground flex items-center rounded-full border px-2.5 py-1 text-xs whitespace-nowrap backdrop-blur transition-colors sm:px-3"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// =====================================================================
// RESULT BLOCK — асуулт + доор нь хариулт. ХОЁР ХЭЛБЭР.
// =====================================================================
/**
 * `chat` (`/assistant`) — ЯРИАНЫ хэлбэр: асуулт нь баруун талд бөмбөлөг,
 * хариулт нь зүүн талд ХАЙРЦАГГҮЙ урсгал.
 *
 * Яагаад: нүүрэн дээр хариулт ГАНЦ л байдаг тул хайрцаг нь түүнийг хуудсаас
 * тусгаарлах үүрэгтэй. `/assistant` дээр харин 3-4 блок дараалахад ижилхэн
 * хайрцаг, ижилхэн "Таны хайсан сэдэв" мөр, ижилхэн 👍👎 давхарлан гарч,
 * аль нь хаана дуусахыг харахад хүндрэлтэй болно. Ярианы хэлбэрт асуулт
 * бүр нь өөрөө зааг болно — нэмэлт хүрээ хэрэггүй.
 *
 * Хайрцаггүй хэлбэр (`panel` = false) нь нүүрэн дээр ХЭВЭЭР: тэнд ганц
 * хариулт grid pattern дэвсгэр дээр тодрох хэрэгтэй.
 */
function ResultBlock({
  ref,
  block,
  questions,
  onPick,
  onAnswers,
  latest = false,
  footer,
  chat = false,
}: {
  ref?: React.Ref<HTMLElement>;
  block: Block;
  questions: AssistantQuestion[];
  onPick: (question: string) => void;
  onAnswers: (next: Record<string, string>) => void;
  /**
   * Ярианы СҮҮЛИЙН блок мөн үү. Зөвхөн 👍👎 мөрийг хаана гаргахыг шийднэ —
   * `AnswerFeedback`-ийн тайлбарыг үз.
   */
  latest?: boolean;
  /**
   * Картын ДООД хэсэгт наалдах агуулга — дараагийн асуултын оролт.
   * Хумих/дэлгэхээс ХАМААРАХГҮЙ: блок хумигдсан ч оролт нь харагдсаар байх
   * ёстой, эс бөгөөс хэрэглэгч бичих газраа алдана.
   */
  footer?: React.ReactNode;
  /** Ярианы хэлбэр — `/assistant` хуудсанд. Дээрх тайлбарыг үз. */
  chat?: boolean;
}) {
  /**
   * Тойм бичигдэж дуусах хүртэл хариултын бие БОЛОН доорх оролт хоёулаа
   * хүлээнэ. Өмнө нь оролт нь блоктой ЗЭРЭГ mount хийгддэг байсан — өөрөөр
   * хэлбэл туслах бодож байх үед аль хэдийн харагдаж, гарч ирэх fade нь
   * мэдэгдэхгүй байв.
   */
  // ⚠️ `carried` блокт ТӨЛӨВ НЬ АЛЬ ХЭДИЙН ДУУССАН: тойм нь бичигдэхгүй тул
  // `onComplete` хэзээ ч дуудагдахгүй, `false`-ээр эхэлбэл картууд хэзээ ч
  // гарахгүй болно.
  const [introDone, setIntroDone] = useState(block.carried ?? false);

  /**
   * Оролтыг тоймын дараа ШУУД биш, богино завсрын дараа гаргана.
   *
   * ⚠️ Яагаад завсар хэрэгтэй: хариулт бүрэн болох агшинд автомат гүйлгэлт
   * ажилладаг. Оролт яг тэр мөчид гарвал fade нь гүйлгэлтийн хөдөлгөөнд
   * дарагдаж, огт мэдэгдэхгүй өнгөрдөг. 260ms завсар нь гүйлгэлт тогтсоны
   * дараа оролтыг ӨӨРИЙН мөчид гаргана.
   *
   * `setState` нь effect-ийн биед БИШ, `setTimeout`-ийн callback дотор.
   */
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
        questions={questions}
        onPick={onPick}
        onAnswers={onAnswers}
        latest={latest}
        introDone={introDone}
        onIntroDone={() => setIntroDone(true)}
      />
    );

  /** Оролт — хариулт бүрэн гарсны дараа. Хоёр хэлбэрт ИЖИЛ нөхцөл. */
  const footerReady = footer && block.status === "ready" && (inputReady || !block.matched);

  if (chat) {
    return (
      <article ref={ref} className="animate-in fade-in w-full text-left duration-700 ease-out">
        {/* АСУУСАН — баруун талд бөмбөлөг. Хайрцаггүй хариултаас ЯЛГАРАХ
            цорын ганц дэвсгэртэй элемент тул яриа хаанаас шинээр эхэлснийг
            нэг харцаар заана.
            ⚠️ Хуучин "Таны хайсан сэдэв «…»" мөр ХАСАГДСАН — бөмбөлөг нь
            өөрөө асуулт гэдгээ хэлж байгаа тул тэр нь давхардал болно.
            `rounded-br-md` — бөмбөлгийн хэн хэлснийг заах чиглэл. */}
        <div className="flex justify-end">
          <div className="border-border bg-card text-foreground max-w-[88%] rounded-2xl rounded-br-md border px-4 py-2.5 text-sm font-semibold backdrop-blur sm:max-w-[75%]">
            {block.asked}
          </div>
        </div>

        {/* ХАРИУЛТ — зүүн талд, хүрээ ба дэвсгэргүй. ✦ дүрс нь эхний мөрийн
            хажууд суух тул хариултын эх хэн болохыг заана. */}
        <div className="mt-4 flex gap-2.5 sm:mt-5 sm:gap-3">
          <Sparkles className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">{body}</div>
        </div>

        {/* Оролт нь ✦-ийн МӨРНӨӨС гадуур, бүтэн өргөнөөр — хариултаас
            салангид, "одоо таны хэлэх дараалал" гэдгийг илэрхийлнэ. */}
        {footerReady && <div className="mt-6 sm:mt-8">{footer}</div>}
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className="border-border bg-card/70 animate-in fade-in slide-in-from-top-2 w-full overflow-hidden rounded-3xl border text-left backdrop-blur duration-700 ease-out"
    >
      {/* ⚠️ ХУМИХ/ДЭЛГЭХ БОЛИВ. Өмнө нь гарчиг нь товч байж, хариултыг
          нээж хаадаг байсан — хэрэглэгч хариултаа уншихын тулд нэмэлт
          үйлдэл хийх шаардлагагүй, мөн хаагдсан блок нь хоосон мөр болж
          яриаг тасалдуулдаг байв. Одоо хариулт үргэлж нээлттэй.

          Тусгаарлагч зураас (`border-t`) ч мөн хасагдсан — гарчиг ба
          хариулт хоёр нэг урсгал болно. */}
      <div className="flex items-start gap-3 px-5 pt-4 pb-1">
        <Sparkles className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p className="text-muted-foreground flex-1 text-sm">
          Таны хайсан сэдэв{" "}
          {/* `1.2em` — эцгийн `text-sm` (14px)-ээс ЯГ 20% том (16.8px).
              `em` учир нь эцэг өөрчлөгдвөл харьцаа хэвээр үлдэнэ. */}
          <span className="text-foreground text-[1.2em] font-semibold">«{block.asked}»</span>
        </p>
      </div>

      <div className="px-5 pt-2 pb-5">{body}</div>

      {/* Оролт нь хариулт ГАРСНЫ ДАРАА fade-ээр орж ирнэ.
          `!block.matched` — таниагүй асуултад тойм бичигдэхгүй тул
          `introDone` хэзээ ч үнэн болохгүй; тэр тохиолдолд шууд харуулна. */}
      {footerReady && <div className="px-4 pb-4">{footer}</div>}
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
  latest,
  introDone,
  onIntroDone,
}: {
  block: Block;
  questions: AssistantQuestion[];
  onPick: (question: string) => void;
  onAnswers: (next: Record<string, string>) => void;
  /** Ярианы СҮҮЛИЙН блок мөн үү — 👍👎 мөр зөвхөн тэнд гарна */
  latest: boolean;
  /** Тойм бичигдэж дууссан уу — үүнээс хойш хариултын бие гарна */
  introDone: boolean;
  onIntroDone: () => void;
}) {
  const matched = block.matched;

  // Тоймын бичилт дууссан эсэх — ЭНД биш, `ResultBlock`-д хадгалагдана:
  // оролтын хайрцаг ч мөн энэ мөчийг хүлээдэг тул хоёулаа НЭГ эх сурвалжаас
  // уншина ([ResultBlock]-ийн `footer`).

  if (!matched) {
    return (
      <div className="animate-in fade-in duration-700 ease-out">
        <p className="text-foreground text-sm leading-relaxed">
          Уучлаарай, энэ асуултыг таньсангүй. Доорхоос сонгоно уу.
        </p>
        {/* ЗӨВХӨН үндсэн сэдвүүд. Бүгдийг жагсвал сонголт хэт олон болж,
            хэрэглэгч юунаас эхлэхээ мэдэхгүй болно. */}
        <div className="mt-3 flex flex-col gap-2">
          {questions
            .filter((q) => q.featured)
            .map((q) => (
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
      {/* Тойм нь ҮСЭГ ҮСГЭЭР бичигдэнэ — бэлэн текст дүрсхийж гарахаас
          илүү "хариулж байгаа" мэдрэмж өгнө. `TypingAnimation` нь
          reduced-motion үед шууд бүтнээр нь харуулдаг. */}
      <p className="text-foreground text-sm leading-relaxed">
        {/* ⚠️ `carried` — нүүрнээс уламжилсан хариулт БҮТНЭЭРЭЭ гарна.
            Дахин бичих нь (а) хэрэглэгч уншсан зүйлээ хүлээх, (б) хариулт
            эхнээсээ боловсорч байгаа мэт харагдах хоёр алдаа болно.
            duration/delay — НИЙТ хүлээлтийг барихаар сонгосон: бодох трэйс
            ~1.26с + тойм ~0.7с ≈ 2с. Үүнээс урт бол "удаан", богино бол
            "бодоогүй" мэт санагдана. */}
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

      {/* ⚠️ ЗӨВХӨН СҮҮЛИЙН хариулт дээр. Блок бүрд тавибал 3 асуулт асуусан
          хүн "Бид таньд тус болж чадсан уу?" гэснийг 3 УДАА хардаг —
          гуйлт мэт мэдрэгдэж, хариултын агуулгаас анхаарлыг сарниулна.
          Санал нь `localStorage`-д кейсийн id-гаар хадгалагддаг тул
          өмнөх блокийн мөр алга болсон ч өгсөн санал алдагдахгүй. */}
      {introDone && latest && <AnswerFeedback questionId={matched.id} />}

      {introDone && matched.cta && (
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
   * Хариултуудын "хурууны хээ". Энэ солигдоход `SolutionPanel` ДАХИН
   * холбогдож, бичилт эхнээсээ дахин эхэлнэ — өмнөх зөвлөмжийн төлөв шинэ
   * хариулт руу дамжихгүй.
   */
  const answerKey = result.steps.map((step) => answers[step.id] ?? "").join("|");

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

          {/* ⚠️ ЗӨВХӨН 2-Р АСУУЛТААС — өмнөх хариултыг ИШ ТАТНА ("намайг
              сонсож байна" гэсэн мэдрэмж). ЭХНИЙ асуулт дээр энд юу ч
              гарахгүй: яагаад асууж байгааг кейсийн `summary` дөнгөж сая
              дээр нь хэлсэн байдаг тул тогтмол оршил нэмбэл нэг зүйл хоёр
              удаа хэлэгдэнэ ([[hero-assistant.ts]]-ийн CLARIFY_INTRO-г үз). */}
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

      {/* ── Зөвлөмж ── */}
      {/* Бодож байгаа үе — зөвлөмжийн ОРОНД трэйс харагдана */}
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

// =====================================================================
// SOLUTION PANEL — зөвлөмжийг ДЭЭРЭЭС ДООШ дараалан ил гаргана
// =====================================================================
/**
 * Хэсэг бүр өмнөхөө дуусмагц гарна — уншигч НЭГ мөрийг л дагана. Урьд нь бүх
 * агуулга бичилтийн ЯГ ЭХЭНД аль хэдийн байрлачихсан байсан тул "бодож бичиж
 * байна" гэсэн мэдрэмж алдагдаж, доод хэсэг нь хөшиж тогтсон харагддаг байв.
 *
 * ⚠️ Төлвөө ӨӨРӨӨ эзэмшинэ. Тиймээс хариулт солигдоход эцэг нь үүнийг `key`-
 * ээр ДАХИН холбох ёстой (`ClarifyView > answerKey`) — эс бөгөөс `narrativeDone`
 * хуучин утгаараа үлдэж, шинэ зөвлөмж бичигдэхээсээ ӨМНӨ бүтнээрээ дүрсхийнэ.
 */
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
  // `TypingAnimation`-ы `onComplete` нь түүний effect-ийн dependency — render
  // бүрд ШИНЭ функц өгвөл бичилт нь дахин эхэлнэ.
  const handleNarrativeDone = useCallback(() => setNarrativeDone(true), []);

  /**
   * ЯРИАНЫ ХАРИУЛТ ХААНА БИЧИГДЭХ ВЭ — `layout` шийднэ.
   *
   *   offer  — ХААЛТ болж ХАМГИЙН ДООР, ногоон хайрцгийн ГАДНА. Хэрэглэгч
   *            багц, төхөөрөмжөө аль хэдийн харчихсан байх тул "яагаад ингэж
   *            санал болгов" нь удиртгал БИШ, ДҮГНЭЛТ болж уншигдана. Үйлдлийн
   *            товч нь түүнтэй ХАМТ — хоёулаа хариултын төгсгөл. Энэ горимд
   *            `buildFollowUp`-ийн "харьцуулж болно" мөр ГАРАХГҮЙ (ярианы
   *            хариулт яг ТҮҮНИЙ ОРОНД орсон), "Бусад боломж" ч мөн адил.
   *   бусад  — ӨМНӨ нь, хайрцаг дотроо. Тэдгээр кейст бүтэц бага тул ярианы
   *            мөр нь удиртгал болж илүү зохимжтой.
   *
   * ⚠️ Хоёуланд нь ил гарах ДАРААЛАЛ ДЭЭРЭЭС ДООШ: бичилт дуустал түүний
   * ДАРААХ хэсэг харагдахгүй.
   */
  const narrativeAtEnd = result.layout === "offer";

  // Доод горимд бичилт нь картын блок буучихсаны ДАРАА эхэлнэ — эс бөгөөс хоёр
  // хөдөлгөөн давхцаж, аль аль нь мэдэгдэхгүй өнгөрнө.
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

  // Зөвлөмжийн БҮТЭЦ — гарчиг, тайлбар, картууд.
  const body = (
    <>
      {/* Зөвлөмжийн УДИРТГАЛ — гарчгийн ӨМНӨ. Хэрэглэгчийн хариултуудтай
          холбож, доорх картууд руу чиглүүлнэ. Кейс бүрд байх шаардлагагүй. */}
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
      {/* ⚠️ `offer` горимд ХҮРЭЭ, ДЭВСГЭР АЛГА. Тэнд хариулт нь яриаг
          үргэлжлүүлж байгаа мэт унших ёстой — хайрцаглавал "тэмдэглэл" болж,
          ярианы урсгалаас тасарна. Бусад layout дээр хайрцаг ХЭВЭЭР: тэдгээрт
          зөвлөмж нь бүтэц багатай тул орчноосоо ялгарах шаардлагатай. */}
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
            {/* ЯРИАНЫ ХАРИУЛТ — бүтэцтэй дэлгэрэнгүйн ӨМНӨ. Хэрэглэгчийн хэлсэнг
                иш татаж, яагаад ийм дүгнэлтэд хүрснийг нэг өгүүлбэрээр хэлнэ. */}
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

      {/* ── ХААЛТ (зөвхөн `offer`) — ярианы дүгнэлт, дараа нь үйлдлийн товч ── */}
      {narrativeAtEnd && (
        <>
          {/* Үндсэн чатны хариулттай ЯГ ИЖИЛ хэв (`text-muted-foreground text-sm`)
              — энэ нь тусдаа тэмдэглэл БИШ, ярианы ҮРГЭЛЖЛЭЛ. */}
          <p className="text-foreground mt-4 text-sm leading-relaxed">{narrative}</p>
          {narrativeDone && cta && (
            <div className="animate-in fade-in duration-500 ease-out">{cta}</div>
          )}
        </>
      )}

      {/* Бичилт дуустал доод хэсэг ч хүлээнэ — эс бөгөөс "дараагийн алхам" нь
          өөрийнх нь зөвлөмжөөс ӨМНӨ харагдана.

          ⚠️ `offer` горимд ЭНЭ БҮХЭН ГАРАХГҮЙ. Тэнд хариулт нь ярианы
          дүгнэлтээр төгсдөг: 👉 мөрийг ярианы хариулт орлосон, "Бусад
          боломж" нь сонголтыг сарниулна, "Дахин эхлэх" нь оролтын мөрөнд
          аль хэдийн байдаг тул давхардана. */}
      {!narrativeAtEnd && narrativeDone && (
        <div className="animate-in fade-in duration-500 ease-out">
          {/* Дараагийн алхмын санал — яриаг хаалттай төгсгөл болгохгүй. `offer`
              горимд ярианы хариулт нь ЯГ энэ мөрийн оронд орсон тул давхардуулахгүй. */}
          {buildFollowUp(outcome) && (
            <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
              <span aria-hidden="true">👉 </span>
              {buildFollowUp(outcome)}
            </p>
          )}

          {/* Бусад боломж — зөвлөмжийг "хар хайрцаг" болгохгүйн тулд. Хаалттай
              эхэлнэ: сонирхсон хүн л дэлгэнэ. `<details>` нь JS-гүй, гар,
              screen reader-т ажиллана.

              ⚠️ `offer` горимд ГАРАХГҮЙ: тэнд хариулт нь багц, төхөөрөмжийн
              БҮРЭН бүрдэл тул доор нь "бусад хувилбар" нэмбэл сонголтыг
              сарниулна. Хэмжээгээ буруу сонгосон бол дээрх хариултын мөр
              дээр дарж засна. */}
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

// =====================================================================
// SOLUTION BODY — зөвлөмж кейс бүрт ӨӨР хэлбэрээр задарна
// =====================================================================
/**
 * Persona бүр ижилхэн харагдвал "динамик" мэдрэмж алдагдана. Тиймээс
 * зөвлөмжийн ГАРЧИГ, ТАЙЛБАР, CTA нь бүгдэд ижил ч ДУНД нь орох бие нь
 * `layout`-аар солигдоно:
 *
 *   offer    — гарчигтай карт бүлгүүд (`Solution.groups`) — багц + төхөөрөмж
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
  owner,
}: {
  solution: Solution;
  layout: ClarifyResult["layout"];
  owner: Owner;
}) {
  // Гарчигтай карт бүлгүүд — багц, төхөөрөмж гэх мэт хэд хэдэн зурвас.
  // Карт нь `offer` хариулттай ЯГ нэг renderer-ээр гарна.
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

  /**
   * ХЯМДРАЛТАЙ КАРТ ЭХЭНД. Хэрэглэгчийн хамгийн түрүүнд харах ёстой зүйл нь
   * хямдрал — тэр нь жагсаалтын сүүлд байвал (ялангуяа мобайл дээр хэвтээ
   * гүйдэг тул) огт харагдахгүй өнгөрч болзошгүй.
   *
   * Дата дотор гараар эрэмбэлэхийн оронд ЛОГИКООР шийдэв: `oldPrice` талбар
   * бүхий карт автоматаар түрүүлнэ. Ингэснээр аль ч кейст, шинэ хямдрал
   * нэмэхэд ч дараалал өөрөө зөв болно.
   *
   * `sort` нь ES2019-ээс ТОГТВОРТОЙ тул хямдралгүй картуудын анхны дараалал
   * хэвээр хадгалагдана.
   */
  // `result.personalize` шууд ашиглавал closure (onClick) дотор TypeScript
  // нарийсгаж чадахгүй — хувьсагчид гаргаж авна.
  const personalize = result.personalize;

  const cards = [...result.cards].sort(
    (a, b) => Number(Boolean(b.oldPrice)) - Number(Boolean(a.oldPrice)),
  );

  return (
    <div>
      {/* BULLET ЖАГСААЛТ — гол хариулт нь ТЕКСТ. Нэр тод, гол тоо хажууд нь.
          Картууд доор нь давтагдана: жагсаалт нь ХУРДАН УНШИХАД, карт нь
          ҮЙЛДЭХЭД зориулагдсан (Verizon-ы жишээ ч ингэж давхардуулдаг). */}
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

      {/* ── Хувийн санал — нэвтэрсэн хүнд, мөн урилгагүй кейст харуулахгүй ── */}
      {personalize && !isAuthenticated && (
        // ⚠️ Багана хэвээр (`sm:flex-row` ХАСАВ): товч нь өгүүлбэрийн ХАЖУУД биш,
        // АРААС нь орох ёстой — эхлээд яагаад нэвтрэхээ уншаад дараа нь дардаг.
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

/**
 * КАРТ ЗУРВАС — `offer` хариулт БА `clarify > layout: "offer"` ХОЁУЛАА үүнийг
 * дуудна. Нэг газарт бичсэн тул badge, хямдрал, CTA-ийн хэв хоёр урсгалд
 * ЗӨРӨХ БОЛОМЖГҮЙ.
 *
 * ХЯМДРАЛТАЙ КАРТ ЭХЭНД: `oldPrice` талбартай карт автоматаар түрүүлнэ.
 * Мобайл дээр хэвтээ гүйдэг тул сүүлд байсан хямдрал огт харагдахгүй өнгөрч
 * болзошгүй. `sort` нь ES2019-ээс ТОГТВОРТОЙ тул үлдсэн картуудын анхны
 * дараалал хэвээр хадгалагдана.
 *
 * Мобайл — ХЭВТЭЭ ГҮЙЛТ (Verizon-ы жишээ шиг): картууд нарийн дэлгэц рүү
 * шахагдахын оронд хажуу тийш гүйнэ, дараагийнх нь ирмэгээс цухуйж гүйх
 * боломжтойг илэрхийлнэ. sm+ дээр энгийн грид.
 *
 * ⚠️ `pt-2` ЗААВАЛ: `overflow-x-auto` тавихад CSS нь нөгөө тэнхлэгийг ч
 * `visible` байлгахаа больж ТАЙРДАГ. Картын `badge` нь картаас 8px ДЭЭШ
 * гардаг (`-top-2`) тул дээд талаасаа тайрагдаж, хагас харагддаг байв. sm+
 * дээр грид болж `overflow-visible` болдог тул тэнд нэмэлт зай хэрэггүй.
 */
function OfferCardGrid({ cards, owner }: { cards: OfferCard[]; owner: Owner }) {
  const ordered = [...cards].sort((a, b) => {
    // ① ТЭМДЭГТЭЙ карт ЭХЭНД. Тэмдэг нь агуулга бичигчийн ИЛ онцлол
    //    ("ШИНЭ", "ТАНД ТОХИРСОН БАГЦ") тул хямдралаас ч хүчтэй дохио.
    const byBadge = Number(Boolean(b.badge)) - Number(Boolean(a.badge));
    if (byBadge !== 0) return byBadge;

    // ② Дараа нь ХЯМДРАЛТАЙ. Мобайл дээр карт хэвтээ гүйдэг тул сүүлд
    //    байсан хямдрал огт харагдалгүй өнгөрч болзошгүй.
    return Number(Boolean(b.oldPrice)) - Number(Boolean(a.oldPrice));
  });

  /**
   * ПОСТЕРЫН ӨРГӨН — картын ТООНООС. Ганц карттай бүлэг нь бүтэн өргөн
   * (хайлтын яг таарсан контент) тул тэнд 96px постер картан дээр төөрнө;
   * харин 3 карттай грид дээр 144px нь бичвэрт зай үлдээхгүй.
   */
  const posterBox =
    ordered.length === 1
      ? { width: "w-28 sm:w-36", sizes: "(min-width: 640px) 144px, 112px" }
      : { width: "w-20 sm:w-24", sizes: "(min-width: 640px) 96px, 80px" };

  return (
    <div
      className={cn(
        // `sm:gap-4` — 3 карт зэрэгцэхэд 12px нь шахсан харагддаг байв. Мобайл
        // дээр `gap-3` хэвээр: тэнд карт хажуу тийш гүйдэг тул дараагийнх нь
        // ирмэгээс цухуйх зай нь өөрөө зааг болдог.
        "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pt-2 pb-1 sm:grid sm:gap-4 sm:overflow-visible sm:pt-0 sm:pb-0",
        // Багана нь картын ТООГООР: 1 → бүтэн өргөн (хайлтын яг таарсан
        // контент), 2 ба 4 → хоёр багана (4 нь 3 баганад 3+1 болж унждаг
        // тул 2×2 нь цэвэр), бусад → гурав.
        ordered.length === 1
          ? "sm:grid-cols-1"
          : ordered.length === 2 || ordered.length === 4
            ? "sm:grid-cols-2"
            : "sm:grid-cols-3",
      )}
    >
      {ordered.map((card) => {
        // `planId` өгсөн бол үнэ, датаг `mobile-plans.ts`-ээс уншина —
        // тэдгээрийг кейсийн дата дотор давхардуулж бичихгүй.
        const { headline, subline, price, priceNote } = resolveOfferCard(card);

        // Гурван хэлбэр нь ӨӨР байрлалд гардаг тул ЭНД хуваана — ингэснээр
        // доор `card.image!` гэж баталгаажуулах шаардлагагүй.
        const shape = card.image ? (card.imageShape ?? "product") : undefined;
        const poster = shape === "poster" ? card.image : undefined;
        const background = shape === "background" ? card.image : undefined;
        const productImage = shape === "product" ? card.image : undefined;

        /* Картын БИЧВЭР — постертой үед постерын ХАЖУУД, эс бөгөөс зургийн
           ДООР гарна. Хоёр байрлалд ижил бичвэр тул нэг л газарт бичив. */
        const details = (
          <>
            {/* Гол үзүүлэлт — нэг харцаар уншигдана. НЭР (кино, багц) нь урт
                тул жижиг хэвээр — `longHeadline`. */}
            <div
              className={cn(
                "text-foreground font-extrabold",
                card.longHeadline ? "text-base leading-snug" : "text-2xl leading-none",
              )}
            >
              {headline}
            </div>
            {subline && <div className="text-muted-foreground mt-1.5 text-xs">{subline}</div>}

            {/* Үнэ — тогтмол үнэгүй шийдэлд байхгүй байж болно.
                `oldPrice` байвал зураастай хуучин үнэ ЭХЭНД нь орно. */}
            {price && (
              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                {card.oldPrice && (
                  <span className="text-muted-foreground text-sm line-through">
                    {card.oldPrice}
                  </span>
                )}
                <span className="text-foreground text-lg leading-none font-extrabold">{price}</span>
                {/* НӨАТ-ийн тодотгол — үнэтэйгээ ЗЭРЭГЦЭЖ, жижиг саарлаар.
                    Эцэг нь `items-baseline` тул суурь шугам нь тэнцэнэ. */}
                {priceNote && <span className="text-muted-foreground text-xs">({priceNote})</span>}
              </div>
            )}

            {/* Нэмэлт тэмдэглэл ("x3 хурд") — брэндийн өнгөөр онцолно */}
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
              // LIQUID GLASS — зөвхөн `[data-glass]` (`/assistant`) дотор
              // хүчинтэй. Нүүрэн дээр класс нь байгаа ч дүрэм таарахгүй тул
              // карт хуучнаараа тунгалаг хэвээр.
              "glass-surface",
              // Мобайл: хажуугийнх нь цухуйж, гүйх боломжтойг илэрхийлнэ.
              // ГАНЦ карттай бүлэгт гүйх юм байхгүй тул бүтэн өргөн.
              ordered.length === 1 ? "w-full" : "w-[78%]",
              card.badge && "border-primary/60 bg-primary/5",
              // ДЭВСГЭР ЗУРАГТАЙ КАРТ. `isolate` нь картыг stacking context
              // болгож доорх `-z-10` зургийг картын ДОТОР хорино — эс бөгөөс
              // хамгийн ойрын context руу гарч, панелийн дэвсгэрийн ард орох
              // магадлалтай. `pt-32` нь зургийн дээд 128px-ийг бичвэрээс
              // чөлөөлнө (`p-4`-ийн дээд зайг twMerge дарж бичнэ).
              background && "isolate pt-32",
            )}
          >
            {card.badge && (
              <span className="bg-primary text-primary-foreground absolute -top-2 left-4 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider">
                {card.badge}
              </span>
            )}

            {/* ДЭВСГЭР ЗУРАГ — багцын постер коллаж, картыг бүтнээр дүүргэнэ.
                ⚠️ `-z-10` тул бичвэр, товч, badge БҮГД дээр нь үлдэнэ: тэдэнд
                `relative z-10` тавих, DOM-ыг хөндөх шаардлагагүй — товч нь flex
                item хэвээрээ бүтэн өргөнөө хадгална.
                ⚠️ Тайралт нь ЗУРГИЙН wrapper дээр, картын биен дээр БИШ:
                картад `overflow-hidden` тавибал `-top-2` badge тайрагдана. */}
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
                {/* СКРИМ — доороо картын өнгө хүртэл гүнзгийрч, бичвэрийг
                    уншигдахуйц болгоно. Хар/цагаан БИШ, `card` token-оор —
                    ингэснээр light ба dark хоёуланд ажиллана. */}
                <div className="from-card via-card/95 to-card/20 absolute inset-0 bg-gradient-to-t" />
              </div>
            )}

            {poster ? (
              /* ПОСТЕР — гарчгийн ХАЖУУД, нарийн 2:3 багана.
                 ⚠️ `object-cover` нь энд юу ч ТАЙРАХГҮЙ: каталогийн постер
                 БҮГД 2:3 (510×755) тул хавтангийн харьцаатай яг таарна.
                 ⚠️ `alt=""`: киноны нэр ЯГ хажууд нь байгаа тул дүрс нь
                 чимэглэл — нэрийг ХОЁР УДАА уншуулах нь шуугиан. */
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
                {/* `min-w-0` — урт киноны нэр flex элементийг цухуйлгахгүй */}
                <div className="min-w-0 flex-1">{details}</div>
              </div>
            ) : (
              <>
                {/* БҮТЭЭГДЭХҮҮНИЙ ЗУРАГ — гарчгийн ДЭЭР, тогтмол өндөртэй хавтан.
                    ⚠️ `object-contain`: зурагнууд нь тунгалаг дэвсгэртэй бүтээгдэхүүний
                    зураг, харьцаа нь янз бүр (утас 1:2, роутер ~1:1.3). `cover`
                    тавибал утасны дээд доод хэсэг тайрагдана.
                    ⚠️ `alt=""`: гарчиг нь ЯГ доор нь байгаа тул дүрс нь чимэглэл —
                    screen reader-т нэрийг ХОЁР УДАА уншуулах нь шуугиан. */}
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

            {/* Товчны ДЭЭД зай. `mt-auto` нь үлдсэн зайг шингээж товчнуудыг
                нэг шугамд суулгана, `h-4` нь хамгийн ӨНДӨР картад ч 16px зай
                баталгаажуулна — эс бөгөөс бичвэрт наалдана.
                ⚠️ Зайг товчны `mt-auto`-гоор өгч БОЛОХГҮЙ: `mt-auto` ба `mt-4`
                хоёр нэг шинжийг тавьдаг тул зөрчилдөнө. */}
            <div className="mt-auto h-4 shrink-0" aria-hidden="true" />
            <OfferCardCta cta={card.cta} owner={owner} />
          </div>
        );
      })}
    </div>
  );
}

// =====================================================================
// NOTICE — үйлчилгээний хүрээг нэрлээд эзэн сайт руу чиглүүлнэ
// =====================================================================
/**
 * Карт БИШ, нэр + тайлбарын мөрүүд. `OfferCardGrid`-ээс ЯЛГААТАЙ нь: үнэ,
 * badge, товч байхгүй — энэ нь ХУДАЛДАХ биш ЧИГЛҮҮЛЭХ хэлбэр.
 *
 * Линк нь жижиг, ХҮРЭЭТЭЙ (дүүрэн товч БИШ) бөгөөд жагсаалтын ДООР,
 * зүүн ирмэгт. Дүүрэн товч нь үйлдлийн гол зам гэдгийг илэрхийлдэг —
 * энд гол зам нь уншиж ойлгох, дараа нь хүсвэл цааш үзэх.
 */
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
              // Мобайл дээр босоо (нэр → тайлбар), sm+ дээр хоёр багана.
              // `sm:w-44` — нэрсийн ирмэг тэгшилж, тайлбарууд нэг шугамаас
              // эхэлнэ. Хамгийн урт нэр 15 тэмдэгт тул 176px хүрэлцээтэй.
              className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
            >
              {/* `href` өгсөн бол НЭР нь линк. Товч БИШ: мөр бүр нь мэдээлэл,
                  цаашид үзэх нь ЗААВАЛ биш. `SmartLink` нь гадаад хаягийг
                  шинэ tab-аар нээнэ. */}
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

// =====================================================================
// TROUBLESHOOT — шалтгаан → сонголт → Mesh ЭСВЭЛ чат руу шилжих
// =====================================================================
/**
 * ⚠️ Сонгосон зам нь блокийн `answers.path`-д хадгалагдана — clarify болон
 * content-search-тай ИЖИЛ сав. Шинэ state сав хэрэггүй, "буцах" нь
 * `onAnswers({})` л болно.
 *
 * ⚠️ Гомдлын зам нь `EscalateView`-г ДАХИН ашиглана — `complaint-billing`
 * кейстэй ЯГ ИЖИЛ механизм (`univision:chat-ask` эвент). Хоёр газар өөр
 * хэлбэрээр шилжвэл хэрэглэгчид өөр өөр туршлага болно.
 */
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
      {/* ШАЛТГААНУУД — сонголтоос ӨМНӨ. Хэрэглэгч юуг сонгохоо мэдэхийн тулд
          эхлээд ЮУ болж байгааг ойлгох ёстой. */}
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
          {/* Сонгосноо эргүүлж иш татна — дарвал буцаж сонгоно. Clarify болон
              content-search-ийн "хариулсан алхам" мөртэй ИЖИЛ хэв. */}
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
            /* Гомдол — `complaint-billing`-тэй ижил handoff. Энд ӨӨР юм
               харуулахгүй: хэрэглэгч ажилтантай ярихаар шийдсэн тул нэмэлт
               санал нь замд нь саад болно. */
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

// =====================================================================
// CONTENT SEARCH — киноны хайлт: ОЛДСОН / ОЛДООГҮЙ хоёр гарц
// =====================================================================
/**
 * ⚠️ Хайлтын query нь блокийн `answers`-д (`answers.query`) хадгалагдана —
 * clarify-ийн хариултуудтай ИЖИЛ сав. Ингэснээр шинэ state сав хэрэггүй,
 * "дахин хайх" нь `onAnswers({})` л болно, `/assistant` дээр ч ижил ажиллана.
 *
 * Хоёр гарц ЗОРИУД өөр урттай: олдоогүй нь НЭГ мэдэгдэл (уншаад дуусна),
 * олдсон нь дөрвөн блок (контент → төстэй → багц → апп).
 */
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
      {/* ГЭРЭЭНИЙ ЛОГИК — "нэмэгддэг үү?" гэдгийн ШУУД хариулт. Хайлтаас ӨМНӨ
          гарна: хэрэглэгч бичихээсээ ч өмнө ЯАГААД гэдгийг мэдэх ёстой. */}
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

      {/* ⚠️ ДОТООД ОРОЛТ АЛГА. Хэрэглэгч ҮНДСЭН чат оролтод бичнэ — `ask()` нь
          хайлт хүлээж буй блокийг таниад бичсэнийг query болгоно. Хоёр оролт
          зэрэг харагдвал аль нь идэвхтэйг нь хэрэглэгч мэдэхгүй болно. */}
      {!query && (
        <p className="text-foreground animate-in fade-in mt-4 text-sm font-semibold duration-500">
          {result.prompt}
        </p>
      )}

      {query && (
        <div className="mt-4">
          {/* Хайсныг эргүүлж иш татна — дарвал эхнээс дахин хайна. Clarify-ийн
              "хариулсан алхам" мөртэй ижил хэв: хэрэглэгч юу гэж хэлснээ
              хармагц засах боломжтой байх нь ижил зарчим. */}
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

              {/* UNIVISION GO — идэвхжүүлсний дараа ХААНААС Ч үзэх боломж.
                  Тасархай хүрээтэй: карт БИШ, НЭМЭЛТ боломжийн мэдэгдэл. */}
              {/* ХОЁР ТЭНЦҮҮ ХАГАС — зүүнд бичвэр ба товч, баруунд зураг.
                  ⚠️ Өмнө нь зураг 160px нарийн миниатюр байсан бөгөөд гурван
                  утасны АГУУЛГА (кино, аппын дэлгэц) огт уншигдахгүй байв.
                  Хагас өргөн (~350px) дээр дэлгэц бүр ~100px болж танигдана.
                  ⚠️ Мобайл дээр НЭГ БАГАНА болж зураг бүтэн өргөнөө авна —
                  тэнд хажуу тийш хуваавал хоёулаа жижгэрнэ. */}
              <div className="border-border grid gap-4 rounded-2xl border border-dashed p-4 sm:grid-cols-2 sm:items-center">
                <div className="min-w-0">
                  {/* Гарчиг нь блокийн ХЭМЖЭЭНД тохирсон томтой (`text-lg`):
                      зураг нь одоо хагас өргөнөө авдаг тул `text-sm` гарчиг
                      түүний хажууд дэндүү нарийхан харагдаж байв. */}
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

                {/* АППЫН MOCKUP — багананхаа БҮТЭН өргөнөөр.
                    ⚠️ `aspect-[5/3]` нь зургийн БОДИТ харьцаа (1995×1184) тул
                    `object-cover` юу ч тайрахгүй, хүрээнд хоосон зай ч гарахгүй.
                    ⚠️ `ring-1 ring-border` — mockup-ын дэвсгэр нь БАРААН
                    ногоон тул dark theme-д картын өнгөтэй нийлж, ирмэг нь
                    үл мэдэгдэх болно. Нимгэн хүрээ нь зургийн хил заана
                    (картын хүрээтэй ИЖИЛ token).
                    ⚠️ `alt=""` — `app-promo.tsx`-тэй ижил: зураг нь аппын
                    дэлгэцийн чимэглэл, доор нь татах товч аль хэдийн бий. */}
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
            /* ОЛДООГҮЙ — НЭГ мэдэгдэл. Багц, төстэй кино ХАРУУЛАХГҮЙ: хайсан
               зүйл байхгүй байхад өөр юм түлхэх нь хариултыг зар болгоно.
               Зөвхөн "нэмэгдэхэд мэдэгдье" гэсэн урилга. */
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

/** Гарчигтай блок — хайлтын дөрвөн хэсэг ижил хэвтэй байхын тулд. */
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

/**
 * Картын товч. `authReason` өгсөн карт нь ЛИНК БИШ — НЭВТРЭХ ДИАЛОГ нээнэ
 * (идэвхжүүлэх, түрээслэх нь данстай холбоотой үйлдэл; хуурамч линк рүү
 * явуулахаас нэвтрүүлэх нь зөв).
 *
 * ⚠️ Тусдаа бүрэлдэхүүн болгосон шалтгаан: `useAuth().openLogin`-ийг
 * `OfferCardGrid`-ийн `.map` дотроос шууд closure болгон хийвэл
 * `react-hooks/refs` дүрэм зөрчигдөж болзошгүй. Мөн товчны хэв НЭГ л газарт
 * үлдэнэ — линк ба товч хувилбар хоорондоо зөрөх боломжгүй.
 */
function OfferCardCta({ cta, owner }: { cta: OfferCard["cta"]; owner: Owner }) {
  const { openLogin } = useAuth();
  const reason = cta.authReason;
  // Мобайл дээр карт нарийхан тул товч нь картаа дүүргэж хэт бүдүүн
  // харагддаг байв — sm+ дээр л бүтэн хэмжээндээ ордог.
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

/**
 * `planId` өгсөн карт нь утгаа `mobile-plans.ts`-ээс авна. Bullet жагсаалт ба
 * карт ХОЁУЛАА үүнийг дуудна — нэг эх сурвалж, зөрөх боломжгүй.
 */
function resolveOfferCard(card: OfferCard) {
  const plan = card.planId ? mobilePlans.find((item) => item.id === card.planId) : undefined;
  /**
   * ⚠️ Гарчгийг дата ӨӨРӨӨ өгсөн бол багцын нэрийг subline-д АВТОМАТААР
   * нэмэхгүй. Эс бөгөөс гарчиг нь нэр байхад subline нь ч мөн нэр болж
   * ДАВХАРДАНА. Гарчиг өгөөгүй үед хуучнаараа (дата эрх / багцын нэр) хос.
   */
  const headlineFromPlan = card.headline === undefined;
  return {
    headline: card.headline ?? plan?.data ?? "",
    subline: card.subline ?? (headlineFromPlan ? plan?.name : undefined),
    // ⚠️ `mobile-plans.ts`-ийн `price` нь САРЫН суурь хураамж. Багцын карт нь
    // төхөөрөмжийн нэг удаагийн үнэтэй зэрэгцэж гарах тохиолдол байдаг тул
    // "/сар"-гүй бол хоёрыг ялгахад хэцүү. Эх датаг хөндөхгүйгээр ЭНД
    // тодотгов — үнийн тоо нь нэг л газарт үлдэнэ.
    price: card.price ?? (plan ? `${plan.price}/сар` : undefined),
    // `mobile-plans.ts`-ийн үнэ нь НӨАТ-ГҮЙ (тэр файлын тайлбарт заасан) тул
    // `planId` картад автоматаар тавина. Дата өөрөө өгвөл түүнийг дагана.
    priceNote: card.priceNote ?? (plan ? "НӨАТ-гүй" : undefined),
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

// =====================================================================
// SUGGESTION CHIPS — оролтын хяналтын мөрөнд гарах дараагийн асуултууд
// =====================================================================
/**
 * НЭГ ЭГНЭЭ — багтахгүй бол хажуу тийш гүйнэ. Мөр хугарахгүй тул оролтын
 * өндөр чипний тооноос үл хамааран ТОГТМОЛ хэвээр.
 *
 * ⚠️ Тусдаа бүрэлдэхүүн болгосон шалтгаан: `ask` нь `useRef` уншдаг
 * `useCallback`. Түүнийг `followUpForm`-ийн БИЕД, render-ийн үед
 * ажилладаг `.map` дотроос шууд closure болгон хийвэл `react-hooks/refs`
 * дүрэм зөрчигдөнө (compiler нь ref-ийг render-д уншиж магадгүй гэж
 * дүгнэдэг). Prop-оор дамжуулбал хил тодорхой болно.
 *
 * Хүрээгүй: оролт нь өөрөө хүрээтэй тул чипүүд ч хүрээтэй байвал хоёр
 * хүрээ дараалж, хэсэг нь хүнд харагдана. Зөөлөн дэвсгэр нь дарагдах
 * боломжийг хангалттай илэрхийлнэ.
 */
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

// =====================================================================
// NEON FRAME — оролтын градиент хүрээ
// =====================================================================
/**
 * ⚠️ Өмнө нь ЗӨВХӨН нүүрний том оролт градиенттай, follow-up оролт нь энгийн
 * саарал хүрээтэй байв — хоёр нь өөр өөр бүтээгдэхүүн мэт харагддаг. Одоо
 * ХОЁУЛАА энэ нэг хүрээг хэрэглэнэ.
 *
 * ⚠️ ЭФФЕКТИЙГ БАГАСГАВ:
 *     хүрээ      2px  → 1px   (`p-0.5` → `p-px`)
 *     гэрэлтэлт  60%  → 25%   (`opacity-60` → `opacity-25`)
 *     бүдгэрэлт  xl   → lg
 * Өмнөх хүч нь оролтын АГУУЛГААС илүү анхаарал татдаг байв.
 *
 * `glow` — гаднах бүдэг туяа. Зөвхөн нүүрний ЭХНИЙ том оролтод; follow-up
 * оролт нь хариултын дотор сууддаг тул тэнд туяа илүүдэл болно.
 */
function NeonFrame({
  children,
  rounded,
  glow = false,
  className,
}: {
  children: React.ReactNode;
  /** Хүрээ ба доторх агуулгын дугуйрал — хоёулаа ижил байх ёстой */
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
            // ТУЯА нь ЗӨӨЛӨН байх ёстой: `-inset-1` + `blur-lg` нь оролтын
            // дагуу тодорхой боловч бүдэг хүрээ үлдээнэ. Тархалт нь үүнээс
            // өргөн (`blur-2xl`) бол өнгө ирмэгээ алдаж уусна, нарийн
            // (`blur-md`) бол хатуу зураас болно. Хүч нь 45% — өнгө нь
            // танигдах ч оролтын агуулгаас илүү анхаарал татахгүй.
            "animate-neon-spin pointer-events-none absolute -inset-1 opacity-45 blur-lg",
            rounded,
          )}
          style={NEON_STYLE}
        />
      )}
      <div
        // ⚠️ 1px → 2px. 1px дээр градиент нь өнгө таних зайгүй тул зүгээр л
        // саарал зураас мэт харагдаж, бүх өнгө нэг нэгэндээ УУСДАГ.
        className={cn("animate-neon-spin relative p-0.5", rounded)}
        style={NEON_STYLE}
      >
        {children}
      </div>
    </div>
  );
}
