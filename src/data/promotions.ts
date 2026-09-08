/**
 * Univision Web 4.0 — Онцлох урамшуулал (Promotion entry point)
 *
 * Homepage-н TrustOrbit-ийн дараа харагдах section. Үндсэн background өнгөтэй,
 * дотроо "Swiss / Be inspired"-маягийн 3 card-аар онцлох урамшууллуудыг харуулна.
 * Card бүрийн background нь жинхэнэ урамшууллын зургаар солигдоно
 * (Unitel — `public/Unitel/Campaigns/`). Зураг байхгүй үед саарал `bg-card`
 * placeholder-аар харагдана. Card бүр /campaigns руу холбоно.
 */
import type { BrandId } from "@/lib/brand";

export type PromotionTone = "violet" | "green" | "amber";

export type PromotionCard = {
  id: string;
  /**
   * Card-ны дээд ЗҮҮН булангийн жижиг pill — ангилал эсвэл гол тоо.
   *
   * ⚠️ ЗААВАЛ БИШ. Захиалагчийн 2026-09-07-ны бичвэрт 3 урамшууллын 2 нь
   * "Badge: байхгүй байна" гэсэн тул хоосон нь ХҮЛЭЭГДСЭН байдал болов —
   * "Badge 1" гэх мэт орлуулагч тавихгүй.
   */
  badge?: string;
  title: string;
  description: string;
  /**
   * Үнэ — баруун ДЭЭД булангийн bubble-д.
   *
   * ⚠️ ЗААВАЛ БИШ бөгөөд Unitel-ийн бодит 3 урамшуулалд АЛГА: захиалагч
   * үнийн талбар өгөөгүй, "Санта бол"-ын 12'900₮-ыг ч ҮНЭ биш BADGE гэж
   * заасан. Тиймээс bubble нь зөвхөн `price` ирсэн үед л гарна.
   */
  price?: string;
  /** Үнийн дор гарах жижиг тэмдэглэл (хямдрал / cashback г.м.) */
  priceNote?: string;
  /** Урамшууллын хүчинтэй хугацаа */
  validity: string;
  ctaText: string;
  ctaHref: string;
  /**
   * Өнгөний схем.
   * ⚠️ ОДООГООР ХЭРЭГЛЭГДЭХГҮЙ — карт нь зурагтай эсвэл саарал тул
   * `promotions.tsx` нь өнгө уншдаггүй. Өнгөт gradient хувилбар хэрэгтэй
   * болоход бэлэн байлгахын тулд талбарыг үлдээв.
   */
  tone: PromotionTone;
  /**
   * Card-ны ДЭВСГЭР зураг — `public/`-ээс эхлэх зам.
   *
   * Байвал: зураг картыг бүтнээр дүүргэж, дээр нь бараан scrim орж, бүх
   * бичвэр ЦАГААН болно. Байхгүй бол саарал `bg-card` placeholder хэвээр —
   * хоёр төлөвийг `promotions.tsx > PromotionTile` шийднэ.
   *
   * ⚠️ Карт нь `min-h-[300px]`, багана нь lg дээр 1/3 (≈370px) тул слот нь
   * ойролцоогоор 1.2:1. Зурагнууд 1:1 ба 4:5 тул `object-cover` бага зэрэг
   * тайрна — бичвэр нь зургийн ДЭЭР давхарладаг тул гол дүрсийг ТӨВД байлга.
   */
  image?: string;
  /**
   * Зургийн alt. Зураг нь ЧИМЭГЛЭЛ бол бүү бич — badge, гарчиг, тайлбар нь
   * зургийн дээр БОДИТ бичвэр болж гардаг (WCAG 1.1.1).
   */
  imageAlt?: string;
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
 * UNITEL — ЗАХИАЛАГЧИЙН БОДИТ БИЧВЭР (2026-09-07). Placeholder БИШ.
 *
 * Гарчиг, тайлбар, badge, хугацаа дөрвийг өгсөн ЯГ ТЭР ХЭВЭЭР нь буулгав
 * (цэг, `12'900₮`-ийн тэмдэгт хүртэл).
 *
 * ⚠️ ӨГӨГДӨӨГҮЙ ХОЁР ТАЛБАР:
 *   `price`/`priceNote` — жагсаалтад үнийн талбар ОГТ байсангүй бөгөөд
 *     "Санта бол"-ын 12'900₮ нь BADGE гэж заагдсан тул баруун дээд булангийн
 *     үнийн bubble энэ гурван картад ГАРАХГҮЙ.
 *   `ctaText` — "Дэлгэрэнгүй" гэж тавив. Энэ нь ЗОХИОСОН маркетингийн үг
 *     БИШ, `recommended-plans.ts`-д аль хэдийн хэрэглэгддэг саармаг үйлдэл.
 *     Жинхэнэ товчны бичвэр ирвэл энэ гурван мөрийг л солино.
 *
 * ⚠️ ЗУРГИЙН ХАРГАЛЗАА: "Plus багц" → `Plus.jpg`, "Санта бол" → `Santa.jpg`
 * нь нэрээрээ ТОДОРХОЙ. Харин "Багцаа бүтээ" → `Priority.jpg` нь ҮЛДСЭНЭЭР
 * нь тааруулсан ТААМАГ — хавтсанд гурав дахь зураг өөр байхгүй. Тайлбар нь
 * PLUS багцын эрхийг (`recommended-plans.ts > rec-plus`) дурддаг тул
 * агуулгаараа Priority-тай таарахгүй байж мэдэх — захиалагчаас лавлана.
 */
const unitelPromotionCards: PromotionCard[] = [
  {
    id: "build-your-plan",
    title: "Багцаа бүтээ",
    description: "Та хэрэглээндээ тохируулан өөрөө багцаа бүтээх боломжтой боллоо.",
    validity: "2026.10.01 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/campaigns",
    tone: "amber",
    image: "/Unitel/Campaigns/Priority.jpg",
  },
  {
    id: "plus-package",
    title: "Plus багц",
    description: "Дараа төлбөрт хэрэглэгч болоод суурь хураамжийн хөнгөлөлт, нэмэлт дата аваарай.",
    validity: "2026.11.01 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/campaigns",
    tone: "violet",
    image: "/Unitel/Campaigns/Plus.jpg",
  },
  {
    id: "santa-bol",
    badge: "12'900₮",
    title: "Санта бол",
    description: "12'900₮-р дансаа цэнэглээд хүрд эргүүлээд олон олон super бэлгийн эзэн болоорой",
    validity: "2026.12.31 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/campaigns",
    tone: "green",
    image: "/Unitel/Campaigns/Santa.jpg",
  },
];

/**
 * UNIVISION — БҮГД PLACEHOLDER хэвээр.
 *
 * Танилцуулгад хуурамч маркетингийн тоо (үнэ, cashback %, хугацаа) нь
 * анхаарлыг агуулгаас сарниулж, "энэ бодит санал уу?" гэсэн эргэлзээ
 * төрүүлдэг тул зориуд утгагүй болгосон. `promo-banner.tsx`-ийн
 * `PromoBannerPlaceholder`-тэй ижил зарчим.
 *
 * Бичвэрийн УРТЫГ жинхэнэ контенттой ойролцоо байлгав — эс бөгөөс card-ны
 * өндөр хумигдаж, бодит агуулга орох үед layout зөрнө.
 *
 * Жинхэнэ урамшуулал гарахад: `id`, бичвэрүүд, `image`-г солино. Бүтэц,
 * `tone`, `ctaHref` хэвээр үлдэж болно.
 */
const placeholderPromotionCards: PromotionCard[] = [
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

/**
 * ⚠️ БРЭНД ТУС БҮРЭЭР. `Promotions` section-ийг ХОЁР нүүр (`page.tsx` ба
 * `univision-home.tsx`) хуваалцдаг тул нэг жагсаалт байвал Unitel-ийн бодит
 * урамшуулал Univision-ы нүүрэнд гарна.
 *
 * UNIVISION нь PLACEHOLDER хэвээр — `public/Univision/Campaigns/`-д зураг
 * бэлэн байгаа ч захиалагч "Unitel дээр" гэж тусгайлан хэлсэн тул хөндөөгүй.
 */
export const promotionCards: Record<BrandId, PromotionCard[]> = {
  unitel: unitelPromotionCards,
  univision: placeholderPromotionCards,
};
