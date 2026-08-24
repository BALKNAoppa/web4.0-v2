/**
 * Hero доторх ухаалаг туслах — БЭЛДСЭН асуулт → БЭЛДСЭН хариулт.
 *
 * AI байхгүй. Хэрэглэгч (танилцуулагч) notes-оос асуултаа хуулж тавихад
 * тухайн асуултын хариулт гарна. Сүлжээ, API key, хүлээлт байхгүй тул
 * танилцуулга дээр гацах эрсдэлгүй.
 *
 * Асуулт бүр ӨӨР хэлбэрийн үр дүн үзүүлнэ (`result.kind`):
 *   plans       — багцын харьцуулалт (mobile-plans.ts-ээс бодит утга уншина)
 *   diagnostic  — хоёр багана: эхлээд шалгах зүйлс | шийдлүүд
 *   timeline    — дугаарласан хэвтээ алхмууд
 *   escalate    — карт байхгүй, chat widget руу шилжинэ
 *
 * ХОЁР БРЭНДИЙН асуулт НЭГ жагсаалтад байна — header шиг. Univision дээр
 * Unitel-ийн асуулт асуувал хариулт гарч, CTA нь `SmartLink`-ээр нөгөө домэйн
 * руу шилжинэ (`owner`). Дотоод/гадаад линк харагдацаараа ялгарахгүй — энэ нь
 * нэгдсэн эко-системийн концепцийн цөм ([smart-link.tsx]).
 *
 * Асуулт солих = зөвхөн энэ файлыг засах.
 */
import type { Owner } from "@/lib/brand";

// =====================================================================
// TYPES
// =====================================================================

/** Багцын харьцуулалт — үнэ, дата давхардуулж бичихгүй, id-гаар лавлана */
export type PlansResult = {
  kind: "plans";
  /** `mobilePlans`-ийн id-ууд */
  planIds: string[];
  /** Картуудын доор гарах нэг мөр тэмдэглэл */
  note: string;
};

/** Оношилгоо — зүүн талд шалгах жагсаалт, баруун талд шийдлүүд */
export type DiagnosticResult = {
  kind: "diagnostic";
  checkTitle: string;
  checks: string[];
  solutionTitle: string;
  solutions: { label: string; hint: string }[];
};

/** Дугаарласан алхмууд */
export type TimelineResult = {
  kind: "timeline";
  steps: { title: string; hint: string }[];
  note: string;
};

/** Гомдол — хариулт биш, ажилтан руу шилжүүлнэ */
export type EscalateResult = {
  kind: "escalate";
  /** Progress дуусаад chat widget нээгдэх хүртэлх хугацаа (ms) */
  handoffMs: number;
};

export type AssistantResult = PlansResult | DiagnosticResult | TimelineResult | EscalateResult;

export type AssistantQuestion = {
  id: string;
  /** Notes-оос хуулж тавих ЯГ ТЭР өгүүлбэр */
  question: string;
  /**
   * Аль брэндийн үйлчилгээ вэ. CTA-г `SmartLink`-д дамжуулахад энэ сайтынх бол
   * дотоод шилжилт, нөгөө брэндийнх бол тэр домэйн руу шинэ tab-аар.
   * "self" = хоёр сайт хоёулаа өөрийн хувилбартай (гомдол гэх мэт).
   */
  owner: Owner;
  /** ✦ тэмдгийн дор гарах тойм */
  summary: string;
  result: AssistantResult;
  /** `escalate` дээр байхгүй */
  cta?: { label: string; href: string };
};

// =====================================================================
// ГОМДОЛ — хоёр брэнд дээр ижил, өөрийн сайтын chat widget нээнэ
// =====================================================================
const complaintQuestion: AssistantQuestion = {
  id: "complaint-billing",
  question: "Төлбөр их гарсан байна. яаж шалгуулах вэ?",
  owner: "self",
  summary: "Төлбөрийн задаргааг шалгаж, шалтгааныг тодруулъя.",
  result: { kind: "escalate", handoffMs: 1200 },
};

// =====================================================================
// UNITEL
// =====================================================================
const unitelQuestions: AssistantQuestion[] = [
  {
    id: "unitel-new-number",
    owner: "unitel",
    question: "Шинэ дугаар авмаар байна. танай ямар багцууд байдаг вэ?",
    summary:
      "Дараа төлбөрт шинэ дугаар авахад иргэний үнэмлэх л хангалттай. Сарын хэрэглээндээ тохирсон багцаа сонгоод дугаараа тэр дор нь идэвхжүүлээрэй.",
    result: {
      kind: "plans",
      planIds: ["plus-16", "priority-24", "premium-88"],
      note: "Бүрдүүлэх зүйл: иргэний үнэмлэх",
    },
    cta: { label: "Багц бүгдийг харах", href: "#" },
  },
];

// =====================================================================
// UNIVISION
// =====================================================================
const univisionQuestions: AssistantQuestion[] = [
  {
    id: "univision-slow-internet",
    owner: "univision",
    question: "Интернэтийн хурд удаан байгаа асуудлыг хэрхэн шийдэх вэ?",
    summary: "Ихэнх тохиолдолд багцын хурд биш, Wi-Fi-ийн хамрах хүрээний асуудал байдаг.",
    result: {
      kind: "diagnostic",
      checkTitle: "Эхлээд шалгах",
      checks: ["Роутерын байрлал", "Холбогдсон төхөөрөмжийн тоо", "Хурдны тест"],
      solutionTitle: "Шийдэл",
      solutions: [
        { label: "Mesh цэг нэмэх", hint: "Интернэт хүртээмж нэмэгдэнэ" },
        { label: "FTTR шилэн холболт", hint: "Өндөр хурдны интернэтийг гэртээ" },
        { label: "Wi-Fi 6 роутер солих", hint: "Олон төхөөрөмж ашиглах боломжтой" },
      ],
    },
    cta: { label: "Mesh шийдэл харах", href: "/mesh" },
  },
  {
    id: "univision-new-order",
    owner: "univision",
    question: "Шинэ хэрэглэгчийн захиалга хэрхэн өгөх вэ?",
    summary: "Гурван алхмаар холбоно.",
    result: {
      kind: "timeline",
      steps: [
        { title: "Хаяг шалгах", hint: "Танай байрны холболт бэлэн эсэх" },
        { title: "Багц сонгох", hint: "Хэрэглээндээ тохируулж" },
        { title: "Цаг товлох", hint: "Тохирох өдөр, цагаа сонгох" },
      ],
      note: "Захиалга баталгаажсанаас хойш ажлын 3 хоногт холбоно.",
    },
    cta: { label: "Захиалга эхлүүлэх", href: "/main-packages" },
  },
];

/**
 * НЭГ жагсаалт — хоёр сайт хоёулаа бүх асуултыг таньдаг. Unitel дээр Univision-ы
 * асуулт асуувал хариулт гарч, CTA нь Univision-ы домэйн руу шилжинэ. Header-ийн
 * логиктой яг ижил (`resolveHref` / `SmartLink`).
 */
export const assistantQuestions: AssistantQuestion[] = [
  ...unitelQuestions,
  ...univisionQuestions,
  complaintQuestion,
];

// =====================================================================
// ТААРУУЛАХ
// =====================================================================

/** Жижиг үсэг, цэг таслалгүй, нэг зайтай хэлбэрт оруулна */
export function normalizeQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'`«»„“”\-—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Хуулж тавихад цэг эсвэл сүүлийн үг зөрөх магадлалтай тул хоёр шатлалтай:
 *   1. Яг таарах
 *   2. Аль нэг нь нөгөөгөө агуулах — гэхдээ зөвхөн 12+ тэмдэгттэй үед
 *      ("шинэ" гэх мэт богино үг санамсаргүй таарахаас сэргийлнэ)
 */
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
