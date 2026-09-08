/**
 * APP PROMO — "апп-аа тат" гэсэн section-ий контент.
 *
 * Хоёр брэнд НЭГ компонент (`AppPromo`) ашиглана — зөвхөн доорх data л өөр.
 * Ингэснээр хоёр section хожим зөрөх боломжгүй.
 *
 * Гарчгийг гурав хуваасан шалтгаан: дунд хэсэг нь брэндийн ногооноор
 * онцлогддог (`Univision GO App`, `Unitel аппаас`). Ганц мөр текст байвал
 * дотор нь HTML тэг бичих шаардлага гарна.
 */
export type AppPromoContent = {
  /** `id` + `-title` нь h2-ийн id болно — нэг хуудсанд хоёр section байвал давхцахгүй */
  id: string;
  /**
   * Гарчгийн ДЭЭР суух жижиг ногоон шошго.
   *
   * ⚠️ ОДООГООР РЕНДЕРЛЭГДЭХГҮЙ (2026-09-07) — захиалагчийн загварт байхгүй
   * бөгөөд цайвар дэвсгэр дээр ногоон 12px бичвэр нь ~1.8:1 болж WCAG
   * 1.4.3-ыг зөрчинө. Талбарыг үлдээв: буцаахад `app-promo.tsx`-ийн
   * блокийг сэргээхэд л хангалттай.
   */
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  description: string;
  appStoreHref: string;
  googlePlayHref: string;
  qrUrl: string;
  qrCaption: string;
  /** Утасны mockup зураг — 3:2 харьцаатай, ТЕКСТГҮЙ байх ёстой */
  bannerImage: string;
  /** Брэндийн онцлох ногоон — eyebrow, гарчгийн онцлол, focus ring */
  accent: string;
};

/*
 * ⚠️ `background` ТАЛБАР ХАСАГДСАН (2026-09-07). Өмнө нь section нь
 * `#0a1a14` гэсэн БАРААН hex-ээр буудаг байв (`--app-bg` custom property
 * болж badge-ийн focus ring-ийн офсет, QR-ийн өнгөнд ч дамждаг байсан).
 *
 * Захиалагчийн явуулсан загвар нь ЦАЙВАР тул section одоо хуудасны
 * theme token-ийг (`bg-background` · `text-foreground`) хэрэглэнэ —
 * ингэснээр light ба dark хоёуланд зөв буух бөгөөд хөрш section-уудтай
 * (`Promotions`, `OtherServices`) нэг гадаргатай болно. Hex дэвсгэр нь
 * dark theme-д ч ХАТУУ бараан хэвээр байж, хуудсын дундаас цухуйдаг байв.
 */

export const univisionGoApp: AppPromoContent = {
  id: "univision-go",
  eyebrow: "UNIVISION GO",
  titlePre: "Univision ",
  titleAccent: "GO",
  titlePost: " App",
  description:
    "Ухаалаг утас болон таблеттаа Univision GO app суулгаад хаана ч дуртай кино, контент, ТВ сувгаа үзээрэй.",
  appStoreHref: "#",
  googlePlayHref: "#",
  qrUrl: "https://univision.mn/univision-go",
  qrCaption: "QR кодыг уншуулаад апп-аа татаж ашиглаарай",
  bannerImage: "/univision-go-cropped.png",
  accent: "#0FAA0A",
};

export const unitelApp: AppPromoContent = {
  id: "unitel-app",
  eyebrow: "UNITEL АПП",
  titlePre: "Бүх үйлчилгээг ",
  titleAccent: "Unitel",
  titlePost: " аппаас",
  description:
    "Юнител, Юнивишний төлбөр төлөх, нэгж болон дата авах, бусад үйлчилгээг гар утаснаасаа нэг дороос.",
  appStoreHref: "#",
  googlePlayHref: "#",
  qrUrl: "https://unitel.mn/app",
  qrCaption: "QR кодыг уншуулаад апп-аа татаж ашиглаарай",
  // `Group 38072.png` -ээс зөвхөн утасны хэсгийг тайрсан (715×477 = 3:2).
  // Эх зурган дээрх гарчиг, bullet, badge, QR нь одоо HTML болсон тул
  // зурган дотор давхардахгүй.
  bannerImage: "/unitel-app-phone.png",
  accent: "#45c700",
};
