/**
 * Univision Web 4.0 — Quick actions data
 *
 * Banner-ын доор тогтсон 4 self-service action.
 * Icon + label + route ашиглана.
 */

export type QuickAction = {
  id: string;
  /** lucide-react-ийн icon нэр (string-ээр) */
  icon:
    | "layers"
    | "wifi"
    | "smartphone"
    | "gift"
    | "play"
    | "router"
    | "tv"
    | "headset";
  /** Card дээр харагдах нэр */
  label: string;
  /** Дэд тайлбар (sub-label) */
  description: string;
  /** Дарахад очих хаяг — awareness section руу буюу холбогдох landing руу */
  href: string;
  /** Bento layout-н өнгөний tone (V2-B-д ашиглана) */
  tone?: "primary" | "blue" | "dark" | "yellow" | "purple" | "coral" | "pink" | "emerald";
};

/**
 * AWARENESS-фокусттай үйлчилгээний entry point-ууд.
 *   - "Төлбөр төлөх" / "Багц шинэчлэх" мэт after-service action-уудыг энд ОРУУЛАХГҮЙ.
 *   - Хэрэглэгч навигац буюу бусад хэсгээс энэхүү awareness блок руу орж
 *     өөрт хэрэгтэй үйлчилгээний дэлгэрэнгүй мэдээлэл рүү очдог.
 */
export const quickActions: QuickAction[] = [
  {
    id: "triple",
    icon: "layers",
    label: "Гурвалсан багц",
    description: "Интернэт + ТВ + Суурин утас нэгдмэл шийдэл",
    href: "/main-packages",
    tone: "primary",
  },
  {
    id: "single-internet",
    icon: "wifi",
    label: "Дан интернэт",
    description: "Зөвхөн интернэт хэрэгтэй хэрэглэгчдэд",
    href: "/main-packages#internet",
    tone: "blue",
  },
  {
    id: "devices",
    icon: "smartphone",
    label: "Төхөөрөмж",
    description: "Smart phone, gadget, дагалдах эд анги",
    href: "/devices",
    tone: "dark",
  },
  {
    id: "promotions",
    icon: "gift",
    label: "Урамшуулал",
    description: "Хямдрал, бэлэг — хязгаарлагдмал саналууд",
    href: "/campaigns",
    tone: "yellow",
  },
  {
    id: "univision-go",
    icon: "play",
    label: "Univision Go app",
    description: "Кино, ТВ суваг гар утсандаа",
    href: "/univision-go",
    tone: "purple",
  },
  {
    id: "wifi-solution",
    icon: "router",
    label: "Wi-Fi шийдэл",
    description: "Гэр, оффисын Wi-Fi-г Mesh / FTTR-ээр өргөтгөнө",
    href: "/#wifi-solutions",
    tone: "coral",
  },
  {
    id: "entertainment",
    icon: "tv",
    label: "Энтертайнмент",
    description: "TVOD, HBO Max, спорт суваг — нэг дороос",
    href: "/entertainment/main",
    tone: "pink",
  },
];

export const quickActionsSection = {
  eyebrow: "Univision үйлчилгээ",
  title: "Танд юу санал болгож байна вэ?",
};