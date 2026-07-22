/**
 * Web 4.0 SCROLL танилцуулгын өгүүлэмжийн дата (/web4).
 *
 * Эх сурвалж: "Web 4.0 Jul22.pptx" (18 слайд) + хэрэглэгчийн өгсөн agenda.
 * Дараалал: Асуудал → Дэлхийн судалгаа → Benchmark (Google/Apple) →
 * Brand architecture → Company×Customer intent → Шийдэл (Option 1) → SWOT → Sample web.
 */

/* ── 1. Шийдэх ёстой асуудлууд (Agenda / whiteboard) ── */
export type Question = { n: string; title: string; detail: string };

export const questions: Question[] = [
  {
    n: "01",
    title: "Брэнд таних байдал",
    detail:
      "Танил ба шинэ/танил бус домайнуудыг (Nexmind, Ddish, Toki, U-point…) хэрэглэгчид хэрхэн таниулж, ойлгуулах вэ?",
  },
  {
    n: "02",
    title: "Домайн нэмэх / хасах",
    detail:
      "Аль брэндийг нэмэх, хасах вэ? 30+ компанийн ямар стандартаар шийдэх вэ?",
  },
  {
    n: "03",
    title: "Приорити ба зорилго",
    detail: "Юуг нэн тэргүүнд тавих вэ? Website-ийн үндсэн зорилго юу вэ?",
  },
  {
    n: "04",
    title: "Хэн түрүүлэх вэ?",
    detail: "Customer-centric уу, эсвэл business-centric хандлага уу?",
  },
  {
    n: "05",
    title: "Бидний алсын хараа",
    detail: "Ecosystem нэгдэл үү, эсвэл брэнд тус бүрийн бие даасан өсөлт үү?",
  },
];

/* ── 2. Дэлхийн судалгаа (Gartner, McKinsey) ── */
export type Stat = {
  value: number;
  suffix?: string;
  label: string;
  source: string;
};

export const researchStats: Stat[] = [
  {
    value: 61,
    suffix: "%",
    label:
      "B2B худалдан авагчид sales хүнтэй шууд харьцахаас өмнө digital channel-аар өөрөө судлахыг илүүд үздэг.",
    source: "Gartner 2025",
  },
  {
    value: 69,
    suffix: "%",
    label:
      "Website ба sales-ийн мэдээлэл зөрөх нь B2B buyer-ийн итгэлийг бууруулдаг.",
    source: "Gartner 2025",
  },
  {
    value: 10,
    suffix: "+",
    label:
      "B2B buying journey-д хэрэглэгч дунджаар ~10 interaction channel ашигладаг.",
    source: "McKinsey 2024",
  },
];

export const researchImplication =
  "Website нь компанийн identity-г тодорхой харуулж, олон брэндийг нэгтгэн, B2B итгэлцэл үүсгэж, хэрэглэгчийг self-service channel руу чиглүүлэх идэвхтэй платформ байх ёстой.";

/* ── 3. Benchmark байгууллагууд ── */
export type Benchmark = {
  id: string;
  name: string;
  tag: string;
  note: string;
  image?: string;
  url?: string;
  accent: string;
  featured?: boolean;
};

export const benchmarks: Benchmark[] = [
  {
    id: "apple",
    name: "Apple",
    tag: "Branded house",
    note: "Нэг apple.com дор бүх бүтээгдэхүүн нэг брэнд, нэг identity-гээр нэгддэг. Хамгийн цэвэр нэгдсэн загвар.",
    image: "/apple.png",
    url: "https://www.apple.com/",
    accent: "#e5e7eb",
    featured: true,
  },
  {
    id: "google",
    name: "Google",
    tag: "House of brands → mixed",
    note: "Waymo, YouTube, Workspace, Pixel — холбоосын хүч өөр өөр олон бүтээгдэхүүн. Brand architecture-ийн бүх төрлийг харуулна.",
    image: "/google workspace.png",
    url: "https://about.google/",
    accent: "#4285F4",
    featured: true,
  },
  {
    id: "jio",
    name: "Reliance Jio",
    tag: "Consumer-driven",
    note: "Хэрэглэгчийн хэрэгцээгээр (Mobile / Home / Business) ангилж чиглүүлдэг.",
    image: "/jio.png",
    url: "https://www.jio.com/business",
    accent: "#0b1f8f",
  },
  {
    id: "jlr",
    name: "JLR / Tata",
    tag: "Group overview",
    note: "Группын бүтэц, компаниудаа нэг ecosystem болгон харуулдаг group web.",
    image: "/jlr.png",
    url: "https://www.jaguarlandrover.com/",
    accent: "#c0a062",
  },
  {
    id: "gap",
    name: "GAP",
    tag: "Parent-led",
    note: "Толгой брэнд дороо салбар брэндүүдээ (Old Navy, Banana Republic…) цэгцтэй байрлуулна.",
    image: "/gap.png",
    url: "https://www.gap.com/",
    accent: "#ff4438",
  },
];

/* ── 6. Шийдэл: Option 1 — нэгдсэн нэг вэбсайт ── */
export const option1Header = [
  "Unitel.mn",
  "Univision.mn",
  "Toki app.mn",
  "Look.tv",
  "U-point.mn",
];

export type WebAppRole = {
  channel: string;
  purpose: string;
  newPct: number;
  existingPct: number;
};

export const webAppSplit: WebAppRole[] = [
  { channel: "Web", purpose: "Awareness / Consideration", newPct: 80, existingPct: 20 },
  { channel: "App", purpose: "E2E Self-Service", newPct: 20, existingPct: 80 },
];

/* ── 7. Option 1 SWOT ── */
export const option1Swot = {
  strengths: [
    "Өргөн бүтэцтэй, уян хатан",
    "Ирээдүйн ecosystem-д бэлтгэсэн",
    "Хэрэглэгчид брэндүүдийг аль хэдийн бие даан таньдаг",
    "App–Web хосолсон холбоо",
  ],
  weaknesses: [
    "Брэндүүдийн тайлбар байхгүй",
    "Жижиг/шинэ брэндүүдийг бүтцээс хасдаг",
    "Өөр төрлийн бизнесүүдийг ижилтгэдэг",
    "UI тогтворгүй мэдрэгдэж болзошгүй",
  ],
  opportunities: [
    "Бүх нэр аль хэдийн танил бол сайн ажиллана",
    "Брэнд танилтыг бие даан өсгөх стратегид тохирно",
  ],
  threats: ["Олон нийтийн дүр төрхийн эрсдэл"],
} as const;
