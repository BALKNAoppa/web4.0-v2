export type TrustItem = {
  id: string;
  icon: "activity" | "headphones" | "lock" | "wrench" | "gauge" | "shield-check";
  label: string;
  description: string;
};

export const trustItems: TrustItem[] = [
  {
    id: "uptime",
    icon: "activity",
    label: "Хамгийн өргөн сүлжээ",
    description: "Жилийн турш найдвартай ажиллагаа",
  },
  {
    id: "support",
    icon: "headphones",
    label: "24/7 тусламж",
    description: "Ямар ч үед холбогдох боломжтой",
  },
  {
    id: "encryption",
    icon: "lock",
    label: "Шифрлэгдсэн холболт",
    description: "End-to-end хамгаалалт",
  },
  {
    id: "fast-repair",
    icon: "wrench",
    label: "Шуурхай засвар",
    description: "Шуурхай гэмтэл засварын үйлчилгээ",
  },
  {
    id: "speed",
    icon: "gauge",
    label: "Тогтвортой хурд",
    description: "Оройн цагаар ч тогтвортой хурд",
  },
  {
    id: "content-safety",
    icon: "shield-check",
    label: "Контентын аюулгүй байдал",
    description: "Эцэг эхийн хяналттай контент",
  },
];

export const trustSection = {
  eyebrow: "Тогтвортой байдал",
  title: "Brand name + найдвартай үйлчилгээний талаар байх",
  description: "Таний гэрт хамгаалагдсан, тогтвортой үйлчилгээ.",
  hubLabel: "Танай гэр",
};
