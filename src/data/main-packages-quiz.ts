/**
 * Univision Web 4.0 — Main packages quiz
 *
 * Static санал болгох систем. LLM API огт хэрэггүй.
 *
 * ## Логик
 * 1. Хариулт бүр НЭГ багцад +1 оноо өгнө (асуулт бүр адил жинтэй).
 * 2. HBO Max-ын хатуу шүүлт: "Заримдаа" эсвэл "Тийм" гэвэл M+ багц
 *    candidate-аас хасагдана (M+-д HBO Max байхгүй).
 * 3. Хамгийн их оноотой багцыг сонгоно. Тэнцсэн оноо бол L+ default.
 */

export type PlanId = "m-plus" | "l-plus" | "xl-plus";

export type QuizOption = {
  label: string;
  /** Тухайн хариулт сонгогдсон үед багц бүрд өгөх оноо (нийт = 1) */
  weights: Record<PlanId, number>;
};

export type QuizQuestion = {
  id: string;
  question: string;
  hint?: string;
  options: QuizOption[];
};

// =====================================================================
// CONFIG
// =====================================================================

/**
 * Багц бүх option-уудад жагсаагдсан дараалал.
 * `xl-plus` нь хамгийн өндөр tier, `m-plus` нь хамгийн доод.
 */
const ALL_PLANS: PlanId[] = ["m-plus", "l-plus", "xl-plus"];

/**
 * Tie-breaker дараалал: тэнцсэн үед эхэнд таарсныг сонгоно.
 * L+ нь "САНАЛ БОЛГОХ" багц учир анхдагч.
 */
const TIE_PREFERENCE: PlanId[] = ["l-plus", "xl-plus", "m-plus"];

/** HBO Max-тай багцууд — M+ нь HBO Max-гүй учир хасагдана. */
const HBO_REQUIRED_EXCLUDES: PlanId[] = ["m-plus"];

// =====================================================================
// QUESTIONS — Хариулт бүр зөвхөн НЭГ багцад +1 (адил жин)
// =====================================================================

export const quizQuestions: QuizQuestion[] = [
  {
    id: "household-size",
    question: "Таний гэр бүл хэдэн гишүүнтэй вэ?",
    hint: "Олон хүн ашиглах тусам интернэтийн хурд илүү шаардлагатай.",
    options: [
      {
        label: "1-2 хүн",
        weights: { "m-plus": 1, "l-plus": 0, "xl-plus": 0 },
      },
      {
        label: "3-4 хүн",
        weights: { "m-plus": 0, "l-plus": 1, "xl-plus": 0 },
      },
      {
        label: "5 хүн ба түүнээс олон",
        weights: { "m-plus": 0, "l-plus": 0, "xl-plus": 1 },
      },
    ],
  },
  {
    id: "usage-type",
    question: "Голчлон юунд их интернэт хэрэглэдэг вэ?",
    hint: "Streaming болон gaming-д өндөр хурд илүү шаардлагатай.",
    options: [
      {
        label: "Сошиал суваг, browsing",
        weights: { "m-plus": 1, "l-plus": 0, "xl-plus": 0 },
      },
      {
        label: "Кино, цуврал үзэх (HD streaming)",
        weights: { "m-plus": 0, "l-plus": 1, "xl-plus": 0 },
      },
      {
        label: "Gaming, 4K streaming, олон төхөөрөмж",
        weights: { "m-plus": 0, "l-plus": 0, "xl-plus": 1 },
      },
    ],
  },
  {
    id: "hbo-max",
    question: "HBO Max контент танд чухал уу?",
    hint: "Game of Thrones, House of the Dragon, шинэ премиерүүд HBO Max-ээр гардаг.",
    options: [
      {
        label: "Үгүй, надад хэрэггүй",
        weights: { "m-plus": 1, "l-plus": 0, "xl-plus": 0 },
      },
      {
        label: "Заримдаа л үздэг",
        weights: { "m-plus": 0, "l-plus": 1, "xl-plus": 0 },
      },
      {
        label: "Тийм, тогтмол үзэх хэрэгтэй",
        weights: { "m-plus": 0, "l-plus": 0, "xl-plus": 1 },
      },
    ],
  },
  {
    id: "budget",
    question: "Сар бүр төсөвлөж буй мөнгөн дүн?",
    hint: "Төсвийг гүйцэхүйц багцыг олох болно.",
    options: [
      {
        label: "60,000₮-аас бага",
        weights: { "m-plus": 1, "l-plus": 0, "xl-plus": 0 },
      },
      {
        label: "60,000 — 90,000₮",
        weights: { "m-plus": 0, "l-plus": 1, "xl-plus": 0 },
      },
      {
        label: "90,000₮-аас илүү",
        weights: { "m-plus": 0, "l-plus": 0, "xl-plus": 1 },
      },
    ],
  },
];

// =====================================================================
// RECOMMENDATION LOGIC
// =====================================================================

/**
 * Хариултын дагуу хамгийн тохирох багцыг сонгож буцаана.
 *
 * Алхамууд:
 *   1. Хариулсан сонголтуудын weight-уудыг багц тус бүрд нэмж нэгтгэнэ.
 *      4 асуулт × 1 оноо = багц тус бүр 0-4 оноо авч болно.
 *   2. HBO Max хатуу шүүлт — "Заримдаа" эсвэл "Тийм" сонгосон бол M+-ийг
 *      candidate жагсаалтаас хасна (M+ багцад HBO Max байхгүй).
 *   3. Хамгийн их оноотой багцыг сонгоно. Хэрэв тэнцсэн оноотой багцууд
 *      байвал TIE_PREFERENCE дарааллаар (L+ → XL+ → M+) сонгоно.
 *
 * Бүх асуулт адил жинтэй учир compromise нь автоматаар бий болно:
 * жишээ нь needs нь XL+ боловч budget M+-г санал болговол L+ дунд цэг
 * рүү татагдаж болзошгүй.
 */
export function computeRecommendation(answers: number[]): PlanId {
  // 1. Хариултуудаас оноо нэгтгэх
  const scores: Record<PlanId, number> = { "m-plus": 0, "l-plus": 0, "xl-plus": 0 };
  answers.forEach((optionIdx, qIdx) => {
    const q = quizQuestions[qIdx];
    if (!q) return;
    const option = q.options[optionIdx];
    if (!option) return;
    for (const plan of ALL_PLANS) {
      scores[plan] += option.weights[plan];
    }
  });

  // 2. HBO Max хатуу шүүлт
  let candidates: PlanId[] = [...ALL_PLANS];
  const hboIdx = quizQuestions.findIndex((q) => q.id === "hbo-max");
  if (hboIdx >= 0) {
    const hboAnswer = answers[hboIdx];
    // option 0 = "Үгүй" (M+ зөвшөөрөгдөнө)
    // option 1 = "Заримдаа", 2 = "Тийм" — M+ хасагдана
    if (hboAnswer === 1 || hboAnswer === 2) {
      candidates = candidates.filter((p) => !HBO_REQUIRED_EXCLUDES.includes(p));
    }
  }

  // Хэрэв ямар нэг шалтгаанаар candidate хоосон үлдвэл L+ fallback
  if (candidates.length === 0) return "l-plus";

  // 3. Хамгийн их оноотойг сонгох + tie-breaker
  const maxScore = Math.max(...candidates.map((p) => scores[p]));
  const winners = candidates.filter((p) => scores[p] === maxScore);

  // Хэрэв нэг л багц давамгайлж байгаа бол шууд өгнө.
  if (winners.length === 1) return winners[0]!;

  // Хэрэв 2+ багц тэнцсэн оноотой бол — L+ "Recommended" default
  // (хэдийгээр L+ оноо нь доогуур ч).
  if (candidates.includes("l-plus")) return "l-plus";

  // L+ candidate биш үе (онолын хувьд тохиолдохгүй) — preference дарааллаар
  return TIE_PREFERENCE.find((p) => winners.includes(p)) ?? winners[0]!;
}
