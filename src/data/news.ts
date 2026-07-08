/**
 * Univision Web 4.0 — News & updates
 *
 * Homepage-н "Мэдээ ба зарлал" хэсэгт харагдах card-уудын data.
 * Зургийг бодит файл руу шилжүүлэх бол `image`-ыг local path болгож солих.
 */
export type NewsItem = {
  id: string;
  /** Жижиг uppercase label — card-ны дээд талд */
  category: string;
  title: string;
  description: string;
  /** 4:3 эсвэл түүн ойролцоо landscape зураг */
  image?: string;
  href: string;
};

export const newsSection = {
  title: "Мэдээ мэдээлэл",
  ctaLabel: "Бүх мэдээг үзэх",
  ctaHref: "#",
};

function picsumNews(seed: string): string {
  return `https://picsum.photos/seed/news-${seed}/800/600`;
}

export const newsItems: NewsItem[] = [
  {
    id: "wifi-6-rollout",
    category: "Шинэ үйлчилгээ",
    title: "Wi-Fi 6 технологи бүх Univision сүлжээнд",
    description:
      "Шинэ Wi-Fi 6 router-уудыг үнэгүй сольж байна. Дунджаар 3 дахин хурдан холболт, илүү бага сааталтай.",
    image: picsumNews("wifi6"),
    href: "#",
  },
  {
    id: "hbo-max-launch",
    category: "Энтертайнмент",
    title: "HBO Max Univision-д албан ёсоор ирлээ",
    description:
      "Game of Thrones, House of the Dragon, Succession зэрэг бүх HBO контент таны IPTV-д.",
    image: picsumNews("hbo"),
    href: "#",
  },
  {
    id: "summer-campaign",
    category: "Урамшуулал",
    title: "Зуны 50% хямдрал — XL+ багц",
    description:
      "Шинэ хэрэглэгчдэд эхний 6 сар 50% хямдрал. Зөвхөн 6-р сарын 30 хүртэл.",
    image: picsumNews("summer"),
    href: "#",
  },
  {
    id: "ftth-expansion",
    category: "Дэд бүтэц",
    title: "FTTH сүлжээ Дархан, Эрдэнэт хүртэл өргөжсөн",
    description:
      "Хотын хорооллуудаас гадна томоохон аймгуудад шилэн кабель татаж эхэллээ.",
    image: picsumNews("ftth"),
    href: "#",
  },
];
