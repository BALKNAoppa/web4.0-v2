import { BRAND, type Owner } from "@/lib/brand";
import { mobilePlans, planTierHighlights } from "./mobile-plans";
import { plans } from "./plans";
import { wifiOptions, wifiSection, type WifiOption } from "./wifi-options";
import { tvodMovies, type TvodMovie } from "./tvod-movies";
import { tvodPackages } from "./tvod-packages";
import { univisionGoApp } from "./app-promo";

export type PlansResult = {
  kind: "plans";
  planIds: string[];
  note: string;
};

export type DiagnosticResult = {
  kind: "diagnostic";
  checkTitle: string;
  checks: string[];
  solutionTitle: string;
  solutions: { label: string; hint: string }[];
};

export type TimelineResult = {
  kind: "timeline";
  steps: { title: string; hint: string }[];
  note: string;
};

export type EscalateResult = {
  kind: "escalate";
  handoffMs: number;
};

export type ContentSearchResult = {
  kind: "content-search";
  notes: string[];
  prompt: string;
  missing: { title: string; body: string; ctaLabel: string; authReason: string };
  found: {
    matchTitle: string;
    rentLabel: string;
    similarTitle: string;
    packagesTitle: string;
    includes: string[];
    packagesNote: string;
  };
  app: {
    title: string;
    body: string;
    ctaLabel: string;
    href: string;
    image?: string;
  };
};

export type TroubleshootResult = {
  kind: "troubleshoot";
  causesTitle: string;
  causes: string[];
  prompt: string;
  deviceLabel: string;
  deviceTitle: string;
  deviceCards: OfferCard[];
  deviceNote: string;
  complaintLabel: string;
  handoffMs: number;
};

export type NoticeResult = {
  kind: "notice";
  title?: string;
  items?: { name: string; hint: string; href?: string }[];
  cta?: { label: string; href: string };
};

export type AssistantResult =
  | OfferResult
  | PlansResult
  | DiagnosticResult
  | TimelineResult
  | EscalateResult
  | ClarifyResult
  | ContentSearchResult
  | TroubleshootResult
  | NoticeResult;

export type AssistantQuestion = {
  id: string;
  question: string;
  owner: Owner;
  summary: string;
  result: AssistantResult;
  cta?: { label: string; href: string };
  featured?: boolean;
  followUps?: string[];
};

export type OfferCard = {
  id: string;
  planId?: string;
  image?: string;
  imageShape?: "product" | "poster" | "background";
  headline?: string;
  longHeadline?: boolean;
  subline?: string;
  price?: string;
  priceNote?: string;
  oldPrice?: string;
  note?: string;
  badge?: string;
  highlights?: string[];
  cta: { label: string; href: string; authReason?: string };
};

export type OfferGroup = {
  title: string;
  cards: OfferCard[];
  note?: string;
};

export type OfferResult = {
  kind: "offer";
  cardsTitle: string;
  cards: OfferCard[];
  personalize?: { text: string; ctaLabel: string; reason: string };
};

export type ClarifyOption = {
  id: string;
  label: string;
  favors: string[];
  excludes?: string[];
};

export type ClarifyStep = {
  id: string;
  prompt: string;
  options: ClarifyOption[];
};

export type Solution = {
  id: string;
  title: string;
  description: string;
  highlights?: string[];
  planIds?: string[];
  steps?: { title: string; hint: string }[];
  groups?: OfferGroup[];
  cta?: { label: string; href: string };
};

export type ClarifyResult = {
  kind: "clarify";
  layout: "solution" | "plans" | "steps" | "offer";
  lead?: string;
  steps: ClarifyStep[];
  solutions: Solution[];
};

export type ClarifyOutcome = {
  best: Solution;
  reasons: string[];
  alternatives: Solution[];
  picked: string[];
  scores: Record<string, number>;
};

export function resolveClarify(
  result: ClarifyResult,
  answers: Record<string, string>,
): ClarifyOutcome {
  const scores: Record<string, number> = {};
  for (const solution of result.solutions) scores[solution.id] = 0;

  const reasonsBySolution: Record<string, string[]> = {};
  const picked: string[] = [];
  const excluded = new Set<string>();

  for (const step of result.steps) {
    const pickedId = answers[step.id];
    if (!pickedId) continue;
    const option = step.options.find((o) => o.id === pickedId);
    if (!option) continue;

    picked.push(option.label);

    for (const solutionId of option.excludes ?? []) {
      if (solutionId in scores) excluded.add(solutionId);
    }

    for (const solutionId of option.favors) {
      if (!(solutionId in scores)) continue;
      scores[solutionId] += 1;

      const reasons = (reasonsBySolution[solutionId] ??= []);
      if (!reasons.includes(option.label)) reasons.push(option.label);
    }
  }

  const allowed = result.solutions.filter((solution) => !excluded.has(solution.id));
  const pool = allowed.length > 0 ? allowed : result.solutions;

  const ranked = pool
    .map((solution, index) => ({ solution, index, score: scores[solution.id] }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.solution);

  const best = ranked[0];

  return {
    best,
    reasons: reasonsBySolution[best.id] ?? [],
    alternatives: ranked.slice(1),
    picked,
    scores,
  };
}

export const CLARIFY_OUTRO = "Нэмэлт тодруулах зүйл байвал доор бичээрэй 😊";

export function buildFollowUp(outcome: ClarifyOutcome): string | null {
  if (!outcome.alternatives.length) return null;
  const titles = outcome.alternatives.map((solution) => solution.title).join(" эсвэл ");
  return `Хүсвэл ${titles}-тай харьцуулж болно.`;
}

const complaintQuestion: AssistantQuestion = {
  id: "complaint-billing",
  question: "Төлбөр их гарсан байна. яаж шалгуулах вэ?",
  owner: "self",
  summary: "Төлбөрийн задаргааг шалгаж, шалтгааныг тодруулъя.",
  result: { kind: "escalate", handoffMs: 1200 },
};

export const THINKING_STEPS = [
  "Асуултыг тань уншиж байна",
  "Хэрэгцээг тодорхойлж байна",
  "Тодруулах зүйлээ бэлдэж байна",
];

export const RESOLVING_STEPS = [
  "Хариултууд дээр тань үндэслэж байна",
  "Боломжит шийдлүүдийг жишиж байна",
  "Хамгийн тохирохыг сонгож байна",
];

export const THINKING_STEP_MS = 420;

const dataOfferCase: AssistantQuestion = {
  id: "data-package-offer",
  owner: "unitel",
  featured: false,
  question: "Дата багц авах",
  followUps: ["data-long-term", "complaint-billing"],
  summary:
    "Дата багцаа хэрэглээндээ тохируулан сонгох боломжтой — хэмжээ нь 7GB-аас 50GB, хугацаа нь 5-аас 30 хоног хүртэл. Доор хамгийн их авдаг гурвыг нь тавилаа.",
  result: {
    kind: "offer",
    cardsTitle: "Хамгийн эрэлттэй багцууд",
    cards: [
      {
        id: "data-7",
        headline: "7GB",
        subline: "5 хоног",
        price: "7'500 төг",
        highlights: ["Богино хугацааны хэрэгцээнд"],
        cta: { label: "Авах", href: "#" },
      },
      {
        id: "data-15",
        headline: "15GB",
        subline: "10 хоног",
        price: "15'000 төг",
        highlights: ["Өдөрт ойролцоогоор 1.5GB"],
        cta: { label: "Авах", href: "#" },
      },
      {
        id: "data-50",
        headline: "50GB",
        subline: "30 хоног",
        oldPrice: "50'000 төг",
        price: "35'000 төг",
        note: "x3 хурд",
        badge: "ХЯМДРАЛТАЙ",
        highlights: ["15’000 төг хэмнэнэ"],
        cta: { label: "Авах", href: "#" },
      },
    ],
  },
};

const YOUTH_PLAN_IDS = ["plus-16", "priority-24", "premium-88"];

function youthPlanGroup(picked: string): OfferGroup {
  const sorted = [picked, ...YOUTH_PLAN_IDS.filter((id) => id !== picked)];

  return {
    title: "Санал болгох багц",
    cards: sorted.flatMap((id) => {
      const plan = mobilePlans.find((item) => item.id === id);
      if (!plan) return [];

      return [
        {
          id: `youth-${plan.id}`,
          planId: plan.id,
          headline: plan.name,
          badge: id === picked ? "ТАНД ТОХИРСОН БАГЦ" : undefined,
          highlights: planTierHighlights[plan.tier],
          cta: { label: "Багцын мэдээлэл харах", href: plan.detailHref },
        },
      ];
    }),
  };
}

function youthSolution(id: string, description: string): Solution | null {
  const plan = mobilePlans.find((item) => item.id === id);
  if (!plan) return null;

  return {
    id,
    title: `${plan.name} · ${plan.data}`,
    description,
    groups: [youthPlanGroup(id)],
  };
}

const youthSteps: ClarifyStep[] = [
  {
    id: "calls",
    prompt: "Ярианы хэрэглээ тань ямар вэ?",
    options: [
      { id: "in-network", label: "Сүлжээндээ ярьдаг", favors: [] },
      {
        id: "all-network",
        label: "Бусад сүлжээнд ч ярьдаг",
        favors: [],
        excludes: ["plus-16"],
      },
      { id: "no-calls", label: "Бараг ярьдаггүй", favors: [] },
    ],
  },
  {
    id: "data-use",
    prompt: "Датаа юунд хэрэглэдэг вэ?",
    options: [
      { id: "social", label: "Instagram, Facebook", favors: ["plus-16"] },
      { id: "video", label: "Youtube, Streaming үзэх", favors: ["priority-24"] },
      { id: "gaming-meeting", label: "Gaming, Online Meeting", favors: ["premium-88"] },
    ],
  },
  {
    id: "volume",
    prompt: "Сард ойролцоогоор хэдэн GB хэрэглэдэг вэ?",
    options: [
      { id: "low", label: "15GB хүртэл", favors: ["plus-16", "plus-16"] },
      { id: "mid", label: "15-24GB", favors: ["priority-24", "priority-24"] },
      { id: "high", label: "24GB-аас их", favors: ["premium-88", "premium-88"] },
      { id: "unknown", label: "Сайн мэдэхгүй", favors: [] },
    ],
  },
];

const youthSolutions: Solution[] = [
  youthSolution(
    "plus-16",
    "Сошиал, мессеж голлодог бол 16GB сарын турш хангалттай — илүүг төлөх шаардлагагүй.",
  ),
  youthSolution(
    "priority-24",
    "Өдөр тутам видео үздэг бол 15-24GB танд хангалттай. Гэхдээ таны хэрэглээнээс хамаарч ихэсч болохыг анхаараарай",
  ),
  youthSolution(
    "premium-88",
    "Стрим, тоглоом их бол 88GB нь дата дуусах айдасгүй хэрэглэх боломж өгнө.",
  ),
].filter((solution): solution is Solution => solution !== null);

const youthNewPlanCase: AssistantQuestion = {
  id: "youth-new-plan",
  owner: "unitel",
  featured: true,
  question: "Шинээр дугаар авъя, надад ямар багц тохирох вэ?",
  summary:
    "Та шинэ хэрэглэгч болохын тул өөрийн хэрэглээнд тохирсон сонголтуудаас багцаа " +
    "бүтээх боломжтой. Таны хэрэглээг илүү нарийвчилж мэдэхийн тулд бид танаас хэдэн " +
    "нэмэлт асуулт асуух шаардлагатай байгаа тул доорх асуултад хариулж өөрийн багцаа " +
    "хамтдаа бүтээгээрэй.",
  followUps: ["data-package-offer", "data-long-term"],
  result: {
    kind: "clarify",
    layout: "offer",
    lead: "Таны хариултуудад тулгуурлан тооцоолол хийхэд танд дараах багцууд тохирох юм байна.",
    steps: youthSteps,
    solutions: youthSolutions,
  },
};

const phoneLeasingCase: AssistantQuestion = {
  id: "phone-leasing",
  owner: "unitel",
  featured: true,
  question: "Гар утас лизингээр авах",
  summary:
    "Та гар утсыг бэлэн болон 12-36 сарын лизингийн хугацааны сонголттойгоор " +
    "«Toki лизинг» үйлчилгээгээр авах боломжтой. Доор хамгийн эрэлттэй гурван " +
    "загварыг сарын төлбөртэй нь харууллаа.",
  result: {
    kind: "offer",
    cardsTitle: "Лизингийн боломжтой загварууд",
    cards: [
      {
        id: "phone-iphone-17-pro",
        headline: "iPhone 17 Pro",
        image: "/a28de-17-pro-deep-blue.png",
        subline: "256GB",
        oldPrice: "5’888’000₮",
        price: "5’538’000₮",
        note: "230’750₮ × 24 сар",
        highlights: ["Бэлэгтэй", "350’000₮ хямдарсан"],
        cta: { label: "Дэлгэрэнгүй мэдээлэл авах", href: "#" },
      },
      {
        id: "phone-galaxy-z-flip8",
        headline: "Galaxy Z Flip8",
        image: "/096a9-galaxy-zflip8-graphite-back.png",
        badge: "ШИНЭ",
        price: "4’908’000₮",
        note: "204’500₮ × 24 сар",
        highlights: ["Бэлэгтэй"],
        cta: { label: "Дэлгэрэнгүй мэдээлэл авах", href: "#" },
      },
      {
        id: "phone-huawei-pura-80",
        headline: "Huawei Pura 80 Ultra",
        image: "/c05fd-03.png",
        oldPrice: "5’888’000₮",
        price: "4’998’000₮",
        note: "208’250₮ × 24 сар",
        highlights: ["Бэлэгтэй", "890’000₮ хямдарсан"],
        cta: { label: "Дэлгэрэнгүй мэдээлэл авах", href: "#" },
      },
    ],
    personalize: {
      text: "Та өөрийн дугаараар нэвтэрснээр лизингийн эрхээ тооцоолуулж, өөрт тохирох илүү дэлгэрэнгүй мэдээлэл авах боломжтой.",
      ctaLabel: "Нэвтрэх",
      reason: "Лизингийн эрхийг тань шалгахын тулд дугаараа баталгаажуулна уу.",
    },
  },
};

const businessNexmindCase: AssistantQuestion = {
  id: "business-nexmind",
  owner: "self",
  featured: false,
  question: "Байгууллагадаа интернэт, IT шийдэл авах",
  summary:
    "Байгууллагын дотоод сүлжээ, дата төв, IT шийдлийг Unitel Group-ийн байгууллагын " +
    "үйлчилгээ, шийдлүүдийг нэвтрүүлэгч Nexmind-ийн вэб хуудаснаас дэлгэрэнгүй " +
    "мэдээлэл авах боломжтой.",
  result: {
    kind: "notice",
    title: "Nexmind-ийн үйлчилгээний чиглэл",
    items: [
      {
        name: "Managed network",
        hint: "сүлжээний төлөвлөлт, хяналт, тасралтгүй ажиллагааны дэмжлэг",
        href: "https://nexmind.mn/managednetwork",
      },
      {
        name: "Дата төв",
        hint: "сервер байршуулалт, өгөгдлийн хадгалалт, нөөцлөлт",
        href: "https://nexmind.mn/",
      },
      {
        name: "Business шийдэл",
        hint: "уул уурхай, зочлох үйлчилгээ, тээвэр, логистик",
        href: "https://nexmind.mn/",
      },
    ],
    cta: { label: "Веб хуудас руу шилжих", href: "https://nexmind.mn/" },
  },
};

function univisionPlanCard(name: string, badge?: string): OfferCard | null {
  const plan = plans.find((item) => item.name === name);
  if (!plan) return null;

  const internet = plan.groups.find((group) => group.title === "Интернэт");

  return {
    id: `univision-plan-${plan.id}`,
    headline: plan.name,
    subline: internet?.features.map((feature) => feature.value).join(" · "),
    price: `${plan.price}/сар`,
    priceNote: "НӨАТ-тай",
    badge,
    highlights: plan.groups
      .filter((group) => group.title !== "Интернэт" && group.title !== "Суурин утас")
      .flatMap((group) => group.features.map((feature) => `${feature.label} — ${feature.value}`)),
    cta: { label: "Дэлгэрэнгүй", href: plan.detailHref },
  };
}

const univisionPlanCards = [
  univisionPlanCard("L+", "ЭРЭЛТТЭЙ"),
  univisionPlanCard("M+"),
  univisionPlanCard("XL+"),
].filter((card): card is OfferCard => card !== null);

const homeGatewayCard: OfferCard = {
  id: "device-hg1",
  headline: "HG1 HomeGateway",
  image: "/homegateway.png",
  subline:
    "IPTV төхөөрөмжийг интернэтэд холбож, гэр дотор утасгүй сүлжээ үүсгэнэ. Wi-Fi 6, 2.4 ба 5GHz, 4 LAN оролт.",
  price: "8’000₮ / сард",
  note: "288’000₮ үндсэн үнэ",
  cta: { label: "Дэлгэрэнгүй", href: "#" },
};

const stbCard: OfferCard = {
  id: "device-x5-stb",
  headline: "X5 STB",
  image: "/androidbox.png",
  subline:
    "Юнивишний телевиз, контентын үйлчилгээ, нэмэлт аппликейшнүүдийг ашиглах IPTV төхөөрөмж. AndroidTV 14, 4K дүрс.",
  price: "11’000₮ / сард",
  note: "396’000₮ үндсэн үнэ",
  cta: { label: "Дэлгэрэнгүй", href: "#" },
};

function meshCard(option: WifiOption): OfferCard {
  const amount = option.hasOverflow ? "давхар тус бүрд нэг" : `${option.meshCount} ширхэг`;

  return {
    id: "device-mesh",
    headline: "HomeGateway Mesh",
    image: "/hgwmesh.png",
    subline: `Wi-Fi хамрах хүрээг тэлэх нэмэлт төхөөрөмж — Aginet апп, эцэг эхийн хяналттай. Танайд ${amount} тохиромжтой.`,
    price: "7’000₮ / сард",
    note: "252’000₮ үндсэн үнэ",
    cta: { label: "Дэлгэрэнгүй", href: "#" },
  };
}

const homeSizeStep: ClarifyStep = {
  id: "home-size",
  prompt: "Танай гэр ойролцоогоор ямар хэмжээтэй вэ?",
  options: wifiOptions.map((option) => ({
    id: option.id,
    label:
      option.illustration === "house"
        ? `${option.name}, ${option.description}`
        : option.description,
    favors: [option.id],
  })),
};

const univisionHomeSolutions: Solution[] = wifiOptions.map((option) => ({
  id: option.id,
  title: `${option.name} — ${option.devices}`,
  description: option.previewText,
  groups: [
    {
      title: "Санал болгох багц",
      cards: univisionPlanCards,
      note: "L+ нь хамгийн эрэлттэй — хурд, кино эрх, HBO Max-ын гэх зэрэг нь өдөр тутмын хэрэглээнд хүрэлцэнэ.",
    },
    {
      title: "Танд шаардлагатай төхөөрөмжүүд",
      cards:
        option.meshCount > 0
          ? [homeGatewayCard, stbCard, meshCard(option)]
          : [homeGatewayCard, stbCard],
      note: `Танай хэмжээнд: ${option.devices}. Дээрх үнэ нь төхөөрөмж тус бүрийн 36 сарын лизингийн сарын төлбөр.`,
    },
  ],
}));

const univisionNewCase: AssistantQuestion = {
  id: "univision-new-customer",
  owner: "univision",
  featured: true,
  question: "Гэртээ интернэт, телевиз шинээр холбуулах",
  summary:
    "Та Univision үйлчилгээний шинэ хэрэглэгч болохын тулд өөрийн хэрэглээнд " +
    "тохирсон багц болон төхөөрөмжүүдээс сонголтоо хийн захиалга өгнө үү. Түгээмэл " +
    "сонгогддог багц болон төхөөрөмжийг танд санал болгож байна. Та өөрийн " +
    "хэрэглээг тодорхой оруулаад илүү нарийвчилсан мэдээлэл авах боломжтой.",
  result: {
    kind: "clarify",
    layout: "offer",
    steps: [homeSizeStep],
    solutions: univisionHomeSolutions,
  },
};

function firstSentence(text: string): string {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

function tvodPackageCard(id: string): OfferCard | null {
  const pkg = tvodPackages.find((item) => item.id === id);
  if (!pkg) return null;

  return {
    id: `tvod-pkg-${pkg.id}`,
    image: pkg.cover,
    imageShape: "background",
    headline: pkg.name,
    longHeadline: true,
    subline: firstSentence(pkg.description),
    cta: {
      label: "Идэвхжүүлэх",
      href: pkg.detailHref,
      authReason: `${pkg.name}-ийг идэвхжүүлэхийн тулд нэвтэрнэ үү.`,
    },
  };
}

export const tvodPackageCards: OfferCard[] = ["mongol", "hit-series", "asia"]
  .map((id) => tvodPackageCard(id))
  .filter((card): card is OfferCard => card !== null);

const GENRE_SYNONYMS: Record<string, string> = {
  экшн: "Action",
  тулаан: "Action",
  "адал явдал": "Adventure",
  анимэ: "Animation",
  хүүхэлдэй: "Animation",
  инээдэм: "Comedy",
  хошин: "Comedy",
  "гэмт хэрэг": "Crime",
  детектив: "Crime",
  драм: "Drama",
  аймшиг: "Horror",
  аймшгийн: "Horror",
  романтик: "Romance",
  хайр: "Romance",
  "шинжлэх ухаан": "Sci-Fi",
  фантастик: "Sci-Fi",
  триллер: "Thriller",
};

export function findTvodMovies(query: string, limit = 1): TvodMovie[] {
  const q = normalizeQuestion(query);
  if (q.length < 2) return [];

  const genreTerms: string[] = [];
  for (const [mn, en] of Object.entries(GENRE_SYNONYMS)) {
    if (q.includes(mn)) genreTerms.push(normalizeQuestion(en));
  }

  const genresOf = (movie: TvodMovie) => normalizeQuestion(movie.genres.join(" "));
  const haystack = (movie: TvodMovie) =>
    normalizeQuestion(
      [movie.title, ...movie.genres, ...(movie.keywords ?? []), ...(movie.themes ?? [])].join(" "),
    );

  return tvodMovies
    .filter((movie) => {
      if (genreTerms.some((term) => genresOf(movie).includes(term))) return true;
      return haystack(movie).includes(q);
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function similarTvodMovies(movie: TvodMovie, limit: number): TvodMovie[] {
  return tvodMovies
    .filter((item) => item.id !== movie.id && item.genres.some((g) => movie.genres.includes(g)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function tvodMovieCard(movie: TvodMovie, ctaLabel: string): OfferCard {
  return {
    id: `tvod-movie-${movie.id}`,
    image: movie.poster,
    imageShape: "poster",
    headline: movie.title,
    longHeadline: true,
    subline: `${movie.year} · ${movie.genres.slice(0, 2).join(", ")}`,
    note: `★ ${movie.rating}`,
    cta: {
      label: ctaLabel,
      href: `/entertainment/movie/${movie.id}`,
      authReason: `«${movie.title}»-г түрээслэхийн тулд нэвтэрнэ үү.`,
    },
  };
}

const tvodContentCase: AssistantQuestion = {
  id: "tvod-content-search",
  owner: "univision",
  featured: true,
  question: "Танайд шинэ кино нэмэгддэг юм уу ер нь",
  summary:
    "Бид хэрэглэгчид хүргэж буй бүтээгдэхүүн, үйлчилгээнийхээ чанарыг тасралтгүй " +
    "сайжруулан шинэчилж ажилладаг. ТУХАЙН кино контент байгаа эсэх нь эрх " +
    "эзэмшигчийн гэрээнээс шалтгаалдаг. Та өөрийн хайж байгаа кино контентын " +
    "талаарх мэдээллийг бичвэл би танд манай кино санд байгаа эсэхийг шалгаад " +
    "өгч болно. Шалгуулах уу?",
  result: {
    kind: "content-search",
    notes: [
      "Кино, цуврал бүр эрхийн ГЭРЭЭТЭЙ ирдэг — гэрээ нь хугацаатай.",
      "Гэрээний хугацаа дуусвал тухайн контент сангаас ХАСАГДАНА.",
      "Шинээр гэрээ байгуулагдвал контент НЭМЭГДЭНЭ.",
    ],
    prompt: "Киноны нэр, төрөл эсвэл сэдвээ доор бичээрэй 😊",
    missing: {
      title: "Энэ контент одоогоор манайд байхгүй байна",
      body:
        "Бид үйлчилгээнийхээ чанарыг сайжруулахын тулд кино контентоо тасралтгүй " +
        "шинэчилж ажилладаг. Тухайн контент нэмэгдсэн үед бид танд мэдээлэл хүргэх болно.",
      ctaLabel: "Нэмэгдэхэд мэдэгдэх",
      authReason:
        "Контент нэмэгдэхэд мэдэгдэхийн тулд нэвтэрч, холбоо барих хаягаа баталгаажуулна уу.",
    },
    found: {
      matchTitle: "Таны хайсан контент",
      rentLabel: "Түрээслэх",
      similarTitle: "Төстэй контент",
      packagesTitle: "Харгалзах багцууд",
      includes: [
        "Идэвхжүүлснээр тухайн багцын контентыг үзэх эрх нээгдэнэ.",
        "Univision GO аппаас утас, таблет, ТВ-нээс ч үзнэ.",
      ],
      packagesNote:
        "Тухайн кино аль багцад дагалдахыг багцын дэлгэрэнгүй хуудаснаас шалгана уу — багцын бүрэлдэхүүн шинэчлэгддэг.",
    },
    app: {
      title: "Хаанаас ч үзэх боломжтой",
      body: univisionGoApp.description,
      ctaLabel: "Апп татах",
      href: "/#",
      image: univisionGoApp.bannerImage,
    },
  },
};

const meshSizeCards: OfferCard[] = wifiOptions.map((option) => ({
  id: `slow-${option.id}`,
  headline: option.name,
  longHeadline: true,
  subline: option.description,
  note: option.devices,
  highlights: [option.previewText],
  cta: { label: "Дэлгэрэнгүй", href: wifiSection.ctaHref },
}));

const internetSlowCase: AssistantQuestion = {
  id: "internet-slow",
  owner: "univision",
  featured: false,
  question: "Интернэтийн хурд удаан байна",
  summary:
    "Хурд удаашрах шалтгаан хэд хэдэн байж болно. Доор хэрэглэгчдэд тулгардаг " +
    "түгээмэл тавыг нь харуулж байна.",
  result: {
    kind: "troubleshoot",
    causesTitle: "Хурд удаашрах түгээмэл шалтгаан",
    causes: [
      "Төхөөрөмжөөс хол, хана болон тавилга дамжсан",
      "Олон төхөөрөмж зэрэг холбогдсон",
      "2.4GHz давтамж хөршийн сүлжээтэй давхцсан",
      "Багцын хурдны хязгаартаа хүрсэн",
      "Интернэтийн төхөөрөмж хуучирсан (Wi-Fi 6 биш)",
    ],
    prompt: "Цааш юу хийх вэ?",
    deviceLabel: "Нэмэлт төхөөрөмж сонирхож байна",
    deviceTitle: "Байрны хэмжээгээр",
    deviceCards: meshSizeCards,
    deviceNote:
      "Mesh нэг ширхэг — 7’000₮ / сард, 36 сарын лизинг (үндсэн үнэ 252’000₮). Танай хэмжээнд аль нь тохирохыг дээрээс үзнэ үү.",
    complaintLabel: "Гомдол мэдүүлье",
    handoffMs: 1200,
  },
};

const familyCase: AssistantQuestion = {
  id: "family-home-internet",
  owner: "univision",
  summary:
    "Гэрийн интернэтийг байрны хэмжээ, зэрэг холбогддог төхөөрөмжийн тооноос хамааруулж сонгоно. Дохио зарим өрөөнд хүрэхгүй бол Mesh, бүх өрөөнд тогтвортой өндөр хурд хэрэгтэй бол FTTR, олон төхөөрөмж зэрэг ачаалалтай бол Wi-Fi 6 роутер тохиромжтой. Доор гурвыг нь харьцууллаа.",
  featured: false,
  question: "Гэр бүлдээ тохирох интернэт сонгох",
  followUps: ["mesh-count", "office-connection"],
  result: {
    kind: "offer",
    cardsTitle: "Түгээмэл гурван шийдэл",
    cards: [
      {
        id: "mesh",
        headline: "Mesh цэг",
        subline: "нэмэлт цэг тутамд",
        badge: "ХАМГИЙН ТҮГЭЭМЭЛ",
        highlights: ["Дохио сул өрөөнд хүрнэ", "Багц солих шаардлагагүй"],
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
      {
        id: "fttr",
        headline: "FTTR",
        subline: "шилэн кабель өрөө хүртэл",
        highlights: ["Өрөө бүрт ижил хурд", "Олон урсгал зэрэг"],
        cta: { label: "Холболтын багц", href: "/#" },
      },
      {
        id: "wifi6",
        headline: "Wi-Fi 6",
        subline: "роутер солих",
        highlights: ["Олон төхөөрөмж тэсвэрлэнэ", "Хоцролт багасна"],
        cta: { label: "Роутер сонгох", href: "/#" },
      },
    ],
    personalize: {
      text: "Та өөрийн дугаараар нэвтэрвэл одоогийн холболт, хамрах хүрээг тань шалгаад яг тохирох шийдлийг санал болгоно.",
      ctaLabel: "Дугаараар нэвтрэх",
      reason:
        "Гэрийн холболтод тань тохирсон шийдэл санал болгохын тулд дугаараа баталгаажуулна уу.",
    },
  },
};

const youthCase: AssistantQuestion = {
  id: "youth-mobile-plan",
  owner: "unitel",
  summary:
    "Мобайл багцаа сарын дата хэрэглээ, ярианы хэрэгцээндээ тохируулж сонгоно. Голдуу мессеж, сошиал бол бага, өдөр тутам видео үздэг бол дунд, стрим тоглоом их бол өндөр багц тохиромжтой. Доор хамгийн их авдаг гурвыг нь тавилаа.",
  featured: false,
  question: "Надад ямар мобайл багц тохирох вэ?",
  followUps: ["plan-difference", "data-package-offer"],
  result: {
    kind: "offer",
    cardsTitle: "Хамгийн эрэлттэй багцууд",
    cards: [
      {
        id: "plan-plus",
        planId: "plus-16",
        highlights: ["Сошиал, мессежид хангалттай"],
        cta: { label: "Худалдаж авах", href: "#" },
      },
      {
        id: "plan-priority",
        planId: "priority-24",
        badge: "ХАМГИЙН ЭРЭЛТТЭЙ",
        highlights: ["Өдөр тутмын видеонд"],
        cta: { label: "Худалдаж авах", href: "#" },
      },
      {
        id: "plan-premium",
        planId: "premium-88",
        highlights: ["Стрим, тоглоомд"],
        cta: { label: "Худалдаж авах", href: "#" },
      },
    ],
    personalize: {
      text: "Та өөрийн дугаараар нэвтэрвэл сүүлийн саруудын хэрэглээг тань хараад яг таарах багцыг санал болгоно.",
      ctaLabel: "Дугаараар нэвтрэх",
      reason: "Хэрэглээнд тань тохирсон багц санал болгохын тулд дугаараа баталгаажуулна уу.",
    },
  },
};

const officeCase: AssistantQuestion = {
  id: "office-connection",
  owner: "univision",
  summary:
    "Байгууллагын холболтыг ажилтны тоо, ачаалал, тасралтгүй ажиллагааны шаардлагаас хамааруулж сонгоно. Жижиг багт энгийн холболт хангалттай бол ачаалал ихтэй оффист тусгайлсан шугам, сүлжээгээ өөрсдөө удирдах нөөцгүй бол бүрэн үйлчилгээ тохиромжтой. Доор гурван хувилбарыг тавилаа.",
  question: "Оффистоо интернэт холболт авмаар байна",
  followUps: ["mesh-count", "family-home-internet"],
  result: {
    kind: "offer",
    cardsTitle: "Оффисын гурван хувилбар",
    cards: [
      {
        id: "quick",
        headline: "Хурдан холболт",
        subline: "1-5 ажилтан",
        badge: "ХАМГИЙН ТҮГЭЭМЭЛ",
        highlights: ["Энгийн бүрдүүлэлт", "Богино хугацаанд холбогдоно"],
        cta: { label: "Захиалга эхлүүлэх", href: "/#" },
      },
      {
        id: "dedicated",
        headline: "Тусгайлсан шугам",
        subline: "6-20 ажилтан",
        highlights: ["Хуваалцахгүй зурвас", "Ачаалалд тогтвортой"],
        cta: { label: "Үйлчилгээ харах", href: "/#" },
      },
      {
        id: "managed",
        headline: "Бүрэн удирдлагатай",
        subline: "20-иос олон ажилтан",
        highlights: ["Сүлжээ, төхөөрөмж хамт", "Тасралтгүй дэмжлэг"],
        cta: { label: "Үйлчилгээ харах", href: "/#" },
      },
    ],
    personalize: {
      text: "Байгууллагын дугаараараа нэвтэрвэл одоогийн үйлчилгээ, ачааллыг тань хараад тохирох хувилбарыг тооцоолж өгнө.",
      ctaLabel: "Байгууллагаар нэвтрэх",
      reason:
        "Оффисын холболтод тань тохирох хувилбарыг тооцоолохын тулд дугаараа баталгаажуулна уу.",
    },
  },
};

const dataLongTermCase: AssistantQuestion = {
  id: "data-long-term",
  owner: "unitel",
  question: "Урт хугацаатай дата багц харах",
  summary:
    "Урт хугацааны багц нь 30-аас 120 хоног хүчинтэй бөгөөд GB тутмын үнэ нь богино хугацааныхаас мэдэгдэхүйц хямд. Доор дөрвөн сонголтыг үнийн ашгаар нь эрэмбэлж тавилаа.",
  followUps: ["data-package-offer"],
  result: {
    kind: "offer",
    cardsTitle: "Урт хугацааны багцууд",
    cards: [
      {
        id: "lt-60",
        headline: "60GB",
        subline: "30 хоног",
        price: "30’000 төг",
        highlights: ["1GB нь 500 төг"],
        cta: { label: "Авах", href: "#" },
      },
      {
        id: "lt-100",
        headline: "100GB",
        subline: "30 хоног",
        price: "40’000 төг",
        highlights: ["1GB нь 400 төг"],
        cta: { label: "Авах", href: "#" },
      },
      {
        id: "lt-200",
        headline: "200GB",
        subline: "60 хоног",
        price: "70’000 төг",
        highlights: ["1GB нь 350 төг"],
        cta: { label: "Авах", href: "#" },
      },
      {
        id: "lt-400",
        headline: "400GB",
        subline: "120 хоног",
        price: "120’000 төг",
        badge: "1GB НЬ ХАМГИЙН ХЯМД",
        highlights: ["1GB нь 300 төг"],
        cta: { label: "Авах", href: "#" },
      },
    ],
    personalize: {
      text: "Та өөрийн дугаараар нэвтэрвэл сарын дундаж хэрэглээг тань хараад аль хугацаа хамгийн ашигтайг тооцож өгнө.",
      ctaLabel: "Дугаараар нэвтрэх",
      reason: "Хэрэглээнд тань тохирох хугацааг тооцохын тулд дугаараа баталгаажуулна уу.",
    },
  },
};

const planDifferenceCase: AssistantQuestion = {
  id: "plan-difference",
  owner: "unitel",
  question: "Багцуудын ялгааг харуулах",
  summary:
    "Гурван багцын үндсэн ялгаа нь дата хэмжээ, сүлжээний хурдны давуу эрх, роуминг гурав. Доор багц бүрд юу нэмэгддэгийг жагсаалаа.",
  followUps: ["youth-mobile-plan"],
  result: {
    kind: "offer",
    cardsTitle: "Багц бүрд юу нэмэгдэх вэ",
    cards: [
      {
        id: "diff-plus",
        planId: "plus-16",
        highlights: ["Сүлжээндээ хязгааргүй ярих"],
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
      {
        id: "diff-priority",
        planId: "priority-24",
        badge: "ХАМГИЙН ЭРЭЛТТЭЙ",
        highlights: ["Priority хурд", "Priority үйлчилгээ", "Бүх сүлжээнд хязгааргүй"],
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
      {
        id: "diff-premium",
        planId: "premium-88",
        highlights: ["Premium үйлчилгээ", "Роуминг 2GB", "Бүх сүлжээнд хязгааргүй"],
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
    ],
    personalize: {
      text: "Та өөрийн дугаараар нэвтэрвэл одоогийн багцтай тань харьцуулж, юу нэмэгдэхийг шууд харуулна.",
      ctaLabel: "Дугаараар нэвтрэх",
      reason: "Одоогийн багцтай тань харьцуулахын тулд дугаараа баталгаажуулна уу.",
    },
  },
};

const meshCountCase: AssistantQuestion = {
  id: "mesh-count",
  owner: "univision",
  question: "Хэдэн Mesh цэг хэрэгтэй вэ?",
  summary:
    "Хэрэгтэй төхөөрөмжийн тоо нь орон сууцны хэмжээ, өрөөний тоо, давхрын байдлаас хамаарна. Доор дөрвөн тохиолдлыг тавилаа.",
  followUps: ["family-home-internet"],
  result: {
    kind: "offer",
    cardsTitle: "Байрны хэмжээгээр",
    cards: [
      {
        id: "mesh-small",
        headline: "1 × HGW",
        subline: "1-2 өрөө, <60m²",
        highlights: ["Mesh цэг шаардлагагүй"],
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
      {
        id: "mesh-medium",
        headline: "HGW + 1 Mesh",
        subline: "3-4 өрөө, <100m²",
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
      {
        id: "mesh-large",
        headline: "HGW + 2 Mesh",
        subline: "5+ өрөө, >130m²",
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
      {
        id: "mesh-house",
        headline: "Давхар бүрд Mesh",
        subline: "Хувийн орон сууц, 2-3 давхар",
        cta: { label: "Дэлгэрэнгүй", href: "/#" },
      },
    ],
    personalize: {
      text: "Та өөрийн дугаараар нэвтэрвэл одоогийн холболт, байрны мэдээлэлд тань тулгуурлаж яг хэдэн цэг хэрэгтэйг тооцож өгнө.",
      ctaLabel: "Дугаараар нэвтрэх",
      reason: "Байрны тань хэмжээнд тохирох тоог тооцохын тулд дугаараа баталгаажуулна уу.",
    },
  },
};

export const assistantQuestions: AssistantQuestion[] = [
  youthNewPlanCase,
  dataOfferCase,
  phoneLeasingCase,
  businessNexmindCase,
  univisionNewCase,
  tvodContentCase,
  internetSlowCase,
  familyCase,
  youthCase,
  officeCase,
  dataLongTermCase,
  planDifferenceCase,
  meshCountCase,
  complaintQuestion,
];

const PERSONA_IDS = [
  "phone-leasing",
  "youth-new-plan",
  "univision-new-customer",
  "tvod-content-search",
];

function isVisibleInThisBuild(owner: Owner) {
  return owner === "self" || owner === BRAND;
}

export const personaShortcuts: { id: string; question: string }[] = PERSONA_IDS.flatMap((id) => {
  const item = assistantQuestions.find((question) => question.id === id);
  return item && isVisibleInThisBuild(item.owner) ? [{ id, question: item.question }] : [];
});

export const featuredQuestions: AssistantQuestion[] = assistantQuestions.filter(
  (q) => q.featured && isVisibleInThisBuild(q.owner),
);

export const TRENDING_TOPIC_PLACEHOLDER = "Их хайгдсан сэдэв {n}";

export function trendingTopicLabel(rank: number): string {
  return TRENDING_TOPIC_PLACEHOLDER.replace("{n}", String(rank));
}

export const TRENDING_TOPIC_COUNT = 5;

export function normalizeQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'`«»„“”\-—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchQuestion(input: string, list: AssistantQuestion[]): AssistantQuestion | null {
  const query = normalizeQuestion(input);
  if (!query) return null;

  const exact = list.find((item) => normalizeQuestion(item.question) === query);
  if (exact) return exact;

  if (query.length < 12) return null;

  return (
    list.find((item) => {
      const target = normalizeQuestion(item.question);
      return target.includes(query) || query.includes(target);
    }) ?? null
  );
}
