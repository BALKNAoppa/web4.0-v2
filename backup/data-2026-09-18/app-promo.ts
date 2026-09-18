export type AppPromoContent = {
  id: string;
  eyebrow: string;
  titlePre: string;
  titleAccent: string;
  titlePost: string;
  description: string;
  appStoreHref: string;
  googlePlayHref: string;
  qrUrl: string;
  qrCaption: string;
  bannerImage: string;
  accent: string;
};

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
  bannerImage: "/unitel-app-phone.png",
  accent: "#45c700",
};
