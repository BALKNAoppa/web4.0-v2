export type PlanId = "m-plus" | "l-plus" | "xl-plus";

export type QuizOption = {
  label: string;
  weights: Record<PlanId, number>;
};

export type QuizQuestion = {
  id: string;
  question: string;
  hint?: string;
  options: QuizOption[];
};

const ALL_PLANS: PlanId[] = ["m-plus", "l-plus", "xl-plus"];

const TIE_PREFERENCE: PlanId[] = ["l-plus", "xl-plus", "m-plus"];

const HBO_REQUIRED_EXCLUDES: PlanId[] = ["m-plus"];

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

export function computeRecommendation(answers: number[]): PlanId {
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

  let candidates: PlanId[] = [...ALL_PLANS];
  const hboIdx = quizQuestions.findIndex((q) => q.id === "hbo-max");
  if (hboIdx >= 0) {
    const hboAnswer = answers[hboIdx];
    if (hboAnswer === 1 || hboAnswer === 2) {
      candidates = candidates.filter((p) => !HBO_REQUIRED_EXCLUDES.includes(p));
    }
  }

  if (candidates.length === 0) return "l-plus";

  const maxScore = Math.max(...candidates.map((p) => scores[p]));
  const winners = candidates.filter((p) => scores[p] === maxScore);

  if (winners.length === 1) return winners[0]!;

  if (candidates.includes("l-plus")) return "l-plus";

  return TIE_PREFERENCE.find((p) => winners.includes(p)) ?? winners[0]!;
}
