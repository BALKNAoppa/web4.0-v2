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
  /**
   * Өнгөний схем.
   * ⚠️ ОДООГООР ХЭРЭГЛЭГДЭХГҮЙ — карт бүгд саарал placeholder тул
   * `promotions.tsx` нь өнгө уншихаа больсон. Жинхэнэ урамшуулал орох үед
   * өнгөт хувилбарыг сэргээхэд бэлэн байлгахын тулд талбарыг үлдээв.
   */
  tone: PromotionTone;
  /**
   * Card-ны background зураг — `public/promotions/{id}.jpg`.
   * ⚠️ ОДООГООР ХЭРЭГЛЭГДЭХГҮЙ (`tone`-той ижил шалтгаанаар).
   */
  image?: string;
};

/**
 * SECTION-ий ТОЛГОЙ.
 *
 * ⚠️ ӨМНӨ нь `eyebrow` + `titlePre`/`titleAccent`/`titlePost` гэсэн 4 хэсэгтэй
 * байв ("Онцлох урамшуулал" eyebrow, доор нь "50% хямдрал, 1000% cashback —
 * бүгд нэг дор." гэсэн маркетингийн гарчиг). Одоо screenshot-ийн загварын
 * дагуу ЭНГИЙН гарчиг + нэг мөр тайлбар болов: eyebrow нь гарчигтайгаа
 * давхардаж байсан тул ХАСАГДСАН.
 *
 * ⚠️ ХОЁР НҮҮР ХУВААЛЦАНА — Unitel (`page.tsx`) ба Univision
 * (`univision-home.tsx`) хоёул энэ section-ийг дууддаг тул энд бичсэн текст
 * ХОЁУЛАНД нь харагдана. Тиймээс брэндийн нэр агуулаагүй, ерөнхий үг сонгов.
 */
export const promotionsSection = {
  title: "Онцлох урамшуулал",
  description: "Танд зориулсан шинэ урамшуулал, онцлох саналууд.",
  ctaText: "Бүх урамшуулал үзэх",
  ctaHref: "/campaigns",
};

/**
 * КАРТУУД — БҮГД PLACEHOLDER.
 *
 * Танилцуулгад хуурамч маркетингийн тоо (үнэ, cashback %, хугацаа) нь
 * анхаарлыг агуулгаас сарниулж, "энэ бодит санал уу?" гэсэн эргэлзээ
 * төрүүлдэг тул зориуд утгагүй болгосон. `promo-banner.tsx`-ийн
 * `PromoBannerPlaceholder`-тэй ижил зарчим.
 *
 * ⚠️ `image` БҮГДЭЭС ХАСАГДСАН. Зураг өөрөө мэдээлэл дамжуулдаг (лого, багц,
 * үнийн бичээс) тул placeholder-ийн зорилгыг эвдэнэ. Зураггүй үед card нь
 * `tone` gradient-ээр буудаг — энэ нь аль хэдийн бэлэн fallback (доорх
 * `PromotionCard.image` тайлбарыг үз).
 *
 * Бичвэрийн УРТЫГ жинхэнэ контенттой ойролцоо байлгав — эс бөгөөс card-ны
 * өндөр хумигдаж, бодит агуулга орох үед layout зөрнө.
 *
 * Жинхэнэ урамшуулал гарахад: `id`, бичвэрүүд, `image`-г солино. Бүтэц,
 * `tone`, `ctaHref` хэвээр үлдэж болно.
 */
export const promotionCards: PromotionCard[] = [
  {
    id: "sample-1",
    badge: "Badge 1",
    title: "Урамшуулал 1",
    description: "Энэ картын урамшууллын тайлбар энд байрлана. Хоёр мөр орчим урттай.",
    price: "0,000₮",
    priceNote: "Үнийн тэмдэглэл",
    validity: "0000.00.00 хүртэл",
    ctaText: "Sample CTA",
    ctaHref: "/campaigns",
    tone: "amber",
  },
  {
    id: "sample-2",
    badge: "Badge 2",
    title: "Урамшуулал 2",
    description: "Энэ картын урамшууллын тайлбар энд байрлана. Хоёр мөр орчим урттай.",
    price: "0,000₮",
    priceNote: "Үнийн тэмдэглэл",
    validity: "0000.00.00 хүртэл",
    ctaText: "Sample CTA",
    ctaHref: "/campaigns",
    tone: "violet",
  },
  {
    id: "sample-3",
    badge: "Badge 3",
    title: "Урамшуулал 3",
    description: "Энэ картын урамшууллын тайлбар энд байрлана. Хоёр мөр орчим урттай.",
    price: "0,000₮",
    priceNote: "Үнийн тэмдэглэл",
    validity: "0000.00.00 хүртэл",
    ctaText: "Sample CTA",
    ctaHref: "/campaigns",
    tone: "green",
  },
];
