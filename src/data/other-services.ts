export type OtherServiceIcon =
  | "data"
  | "addons"
  | "family"
  | "international"
  | "home-internet"
  | "phone"
  | "prepaid-card";

export type OtherServiceItem = {
  label: string;
  href: string;
  icon: OtherServiceIcon;
};

export const otherServicesTitle = "Бусад үйлчилгээ";

export const otherServices: OtherServiceItem[] = [
  { label: "Дата багц", href: "#", icon: "data" },
  { label: "Нэмэлт үйлчилгээ", href: "#", icon: "addons" },
  { label: "Family үйлчилгээ", href: "#", icon: "family" },
  { label: "Олон улсын үйлчилгээ", href: "#", icon: "international" },
  { label: "Гэр интернэт", href: "#", icon: "home-internet" },
  { label: "Гар утас", href: "#", icon: "phone" },
  { label: "Цэнэглэгч карт", href: "#", icon: "prepaid-card" },
];
