/**
 * Univision Web 4.0 — Онцлох урамшуулал (Promotion entry point)
 *
 * Homepage-н TrustOrbit-ийн дараа харагдах section. Үндсэн background өнгөтэй,
 * дотроо "Swiss / Be inspired"-маягийн 3 card-аар онцлох урамшууллуудыг харуулна.
 * Card бүрийн background нь жинхэнэ урамшууллын зургаар солигдоно
 * (`public/promotions/{id}.jpg`). Зураг байхгүй үед `tone` gradient fallback-аар
 * харагдана. Card бүр /campaigns руу холбоно.
 */
export type PromotionTone = "violet" | "green" | "amber";

export type PromotionCard = {
  id: string;
  /** Card-ны дээд талын жижиг pill — ангилал */
  badge: string;
  title: string;
  description: string;
  /** Үнэ — баруун дээд булангийн bubble-д */
  price: string;
  /** Үнийн дор гарах жижиг тэмдэглэл (хямдрал / cashback г.м.) */
  priceNote: string;
  /** Урамшууллын хүчинтэй хугацаа */
  validity: string;
  ctaText: string;
  ctaHref: string;
  /** Өнгөний схем — зураг байхгүй үеийн gradient fallback */
  tone: PromotionTone;
  /**
   * Card-ны background зураг — `public/promotions/{id}.jpg`.
   * Хоосон бол `tone` gradient-ээр харагдана.
   */
  image?: string;
};

export const promotionsSection = {
  eyebrow: "Онцлох урамшуулал",
  titlePre: "50% хямдрал, ",
  titleAccent: "1000% cashback",
  titlePost: " — бүгд нэг дор.",
  description:
    "Univision-ий апп болон контентын онцлох урамшууллыг яг одоо идэвхжүүлээрэй.",
  ctaText: "Бүх урамшуулал үзэх",
  ctaHref: "/campaigns",
};

export const promotionCards: PromotionCard[] = [
  {
    id: "movie-cashback",
    badge: "1000% Cashback",
    title: "Кино багц",
    description:
      "9,900₮-өөр идэвхжүүлж, М банкны апп-аар 1000% буцаан олголтоо аваарай.",
    price: "9,900₮",
    priceNote: "1000% cashback",
    validity: "2026.06.27 хүртэл",
    ctaText: "Идэвхжүүлэх",
    ctaHref: "/campaigns",
    tone: "amber",
    image: "/cashback.jpg",
  },
  {
    id: "secret-room",
    badge: "Шинэ апп",
    title: "Нууц өрөө апп",
    description:
      "Шинэ апп-аа 50% хөнгөлөлттэйгээр идэвхжүүлэх онцгой боломж — зөвхөн хязгаарлагдмал хугацаанд.",
    price: "9,950₮",
    priceNote: "50% хямдралтай",
    validity: "2026.08.31 хүртэл",
    ctaText: "Идэвхжүүлэх",
    ctaHref: "/campaigns",
    tone: "violet",
    image: "/adult-app.png",
  },
  {
    id: "sports-apps",
    badge: "Спорт",
    title: "Спортын дэд апп-ууд",
    description:
      "Английн Премьер Лиг болон Үндэсний Дээд Лигийг тус бүр ердөө 1,500₮-өөр үзээрэй.",
    price: "1,500₮",
    priceNote: "лиг тус бүр",
    validity: "2026.12.31 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/campaigns",
    tone: "green",
    image: "/sport-app.jpg",
  },
];
