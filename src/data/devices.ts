export type DeviceCategory = {
  id: string;
  label: string;
};

export type DeviceProduct = {
  id: string;
  category: string;
  name: string;
  spec: string;
  placeholderText: string;
  badge?: string;
  detailHref: string;
};

export const devicesHero = {
  title: "Дэлгүүр",
  description:
    "Гар утаснаас эхлээд гэрийн интернэт, ТВ-ний төхөөрөмж хүртэл — үйлчилгээндээ тохирох төхөөрөмжөө нэг дороос сонгоорой.",
};

export const deviceCategories: DeviceCategory[] = [
  { id: "all", label: "Бүгд" },
  { id: "phones", label: "Гар утас" },
  { id: "accessories", label: "Дагалдах хэрэгсэл" },
  { id: "wifi", label: "Интернэтийн төхөөрөмж" },
  { id: "stb", label: "ТВ-н төхөөрөмж" },
  { id: "fttr", label: "Нэмэлт төхөөрөмж" },
];

export const deviceCategoryLabel: Record<string, string> = Object.fromEntries(
  deviceCategories.filter((c) => c.id !== "all").map((c) => [c.id, c.label]),
);

export const deviceProducts: DeviceProduct[] = [
  {
    id: "phone-smart",
    category: "phones",
    name: "Ухаалаг утас",
    spec: "Загвар, багтаамж, өнгөний сонголттой",
    placeholderText: "Device 1",
    badge: "Онцлох",
    detailHref: "/devices?type=phone",
  },
  {
    id: "phone-basic",
    category: "phones",
    name: "Энгийн утас",
    spec: "Урт цэнэгтэй, энгийн хэрэглээнд",
    placeholderText: "Device 2",
    detailHref: "/devices?type=phone",
  },
  {
    id: "phone-sim",
    category: "phones",
    name: "SIM | eSIM",
    spec: "Шинэ дугаар, дугаар шилжүүлэлт",
    placeholderText: "Device 3",
    detailHref: "/devices?type=sim",
  },

  {
    id: "acc-audio",
    category: "accessories",
    name: "Чихэвч",
    spec: "Утасгүй болон утастай сонголт",
    placeholderText: "Device 4",
    detailHref: "/devices?type=accessory",
  },
  {
    id: "acc-power",
    category: "accessories",
    name: "Цэнэглэгч, кабель",
    spec: "Хурдан цэнэглэлт, төрөл бүрийн холбогч",
    placeholderText: "Device 5",
    detailHref: "/devices?type=accessory",
  },
  {
    id: "acc-wearable",
    category: "accessories",
    name: "Ухаалаг цаг",
    spec: "Эрүүл мэнд, мэдэгдэл, дуудлага",
    placeholderText: "Device 6",
    badge: "Шинэ",
    detailHref: "/devices?type=accessory",
  },

  {
    id: "net-hgw",
    category: "wifi",
    name: "Wi-Fi 6 рутер (HGW)",
    spec: "Гэрийн үндсэн интернэтийн төхөөрөмж",
    placeholderText: "Device 7",
    badge: "Онцлох",
    detailHref: "/devices?type=hgw",
  },
  {
    id: "net-ont",
    category: "wifi",
    name: "ONT — шилэн кабелийн төгсгөл",
    spec: "FTTH холболтын суурь төхөөрөмж",
    placeholderText: "Device 8",
    detailHref: "/devices?type=hgw",
  },
  {
    id: "net-cpe",
    category: "wifi",
    name: "Гэр интернэтийн төхөөрөмж",
    spec: "Кабельгүй, сүлжээгээр холбогдох сонголт",
    placeholderText: "Device 9",
    detailHref: "/devices?type=cpe",
  },

  {
    id: "tv-stb",
    category: "stb",
    name: "TV Box (STB)",
    spec: "Сувгийн үзэлт, буцаан үзэх боломж",
    placeholderText: "Device 10",
    detailHref: "/devices?type=stb",
  },
  {
    id: "tv-dongle",
    category: "stb",
    name: "Dongle",
    spec: "Smart TV-д шууд залгаж ашиглах",
    placeholderText: "Device 11",
    detailHref: "/devices?type=stb",
  },
  {
    id: "tv-remote",
    category: "stb",
    name: "Алсын удирдлага",
    spec: "Орлуулах болон нэмэлт удирдлага",
    placeholderText: "Device 12",
    detailHref: "/devices?type=stb",
  },

  {
    id: "extra-mesh",
    category: "fttr",
    name: "Mesh цэг",
    spec: "Хамрах хүрээг өрөө бүрд тэлнэ",
    placeholderText: "Device 13",
    badge: "Онцлох",
    detailHref: "/devices?type=fttr",
  },
  {
    id: "extra-fttr",
    category: "fttr",
    name: "FTTR цэг",
    spec: "Өрөө бүрд шилэн кабелиар — хамгийн тогтвортой",
    placeholderText: "Device 14",
    detailHref: "/devices?type=fttr",
  },
  {
    id: "extra-network",
    category: "fttr",
    name: "Сүлжээний хэрэгсэл",
    spec: "Кабель, шилжүүлэгч, бэхэлгээ",
    placeholderText: "Device 15",
    detailHref: "/devices?type=fttr",
  },
];
