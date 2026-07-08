/**
 * Univision Web 4.0 — TVOD hero featured films
 *
 * /entertainment/main page-ийн дээд талын IMAX-маягийн hero banner-д
 * харагдах онцлох кинонуудын data. Carousel-аар автоматаар эргэлдэнэ.
 *
 * Landscape backdrop: public/tvod/backdrops/{id}.jpg-аас уншина.
 * Файл байхгүй үед dark cinema gradient placeholder харагдана.
 */
export type TvodHeroFeature = {
  id: string;
  badge?: string;
  title: string;
  year: number;
  tagline?: string;
  /** 16:9 landscape backdrop image */
  backdrop?: string;
  detailHref: string;
};

export const tvodHeroFeatures: TvodHeroFeature[] = [
  {
    id: "dune-part-two",
    badge: "Шинээр нэмэгдсэн",
    title: "Dune: Part Two",
    year: 2024,
    tagline: "Арракисын төгсгөл эхэллээ. Эпик sci-fi түүхийн дараагийн бүлэг.",
    backdrop: "/tvod/backdrops/dune-part-two.jpeg",
    detailHref: "#",
  },
  {
    id: "oppenheimer",
    badge: "Топ үнэлгээтэй",
    title: "Oppenheimer",
    year: 2023,
    tagline: "Прометейг чөлөөлсөн хүн — дэлхийг сүйрүүлсэн өдөр.",
    backdrop: "/tvod/backdrops/oppenheimer.jpeg",
    detailHref: "#",
  },
  {
    id: "the-batman",
    badge: "Алдартай",
    title: "The Batman",
    year: 2022,
    tagline: "Готам хотын үнэн илрэх цаг ирлээ.",
    backdrop: "/tvod/backdrops/the-batman.jpeg",
    detailHref: "#",
  },
  {
    id: "avatar-2",
    badge: "Адал явдалт",
    title: "Avatar: The Way of Water",
    year: 2022,
    tagline: "Пандорагийн далайн гүн нууцаа өгүүлэх цаг ирлээ.",
    backdrop: "/tvod/backdrops/avatar-2.jpg",
    detailHref: "#",
  },
  {
    id: "top-gun-maverick",
    badge: "Action",
    title: "Top Gun: Maverick",
    year: 2022,
    tagline: "30 жилийн дараа аугаа том нислэгийн зам нь тэнгэрт буцаж эхлэв.",
    backdrop: "/tvod/backdrops/top-gun-maverick.jpeg",
    detailHref: "#",
  },
];
