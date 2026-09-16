import type { BrandId, Owner } from "@/lib/brand";

export type PromoVideoSource = {
  src: string;
  type: string;
  media?: string;
};

export type PromoMedia =
  | {
      kind: "video";
      sources: PromoVideoSource[];
      poster: string;
    }
  | { kind: "image"; src: string; alt: string }
  | { kind: "gradient" };

export type PromoBannerContent = {
  media: PromoMedia;
  decorative: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string; owner?: Owner };
  secondaryCta?: { label: string; href: string; owner?: Owner };
};

export const promoBanners: Record<BrandId, PromoBannerContent> = {
  unitel: {
    media: { kind: "gradient" },
    decorative: true,
    eyebrow: "Цаг үеийн урамшуулал",
    title: "Шинэ дугаар — эхний сарын төлбөр үнэгүй",
    subtitle: "Дараа төлбөрт дугаар авах амархан.",
    cta: { label: "Багц харах", href: "#", owner: "unitel" },
    secondaryCta: { label: "Бүх урамшуулал", href: "/#" },
  },
  univision: {
    media: { kind: "gradient" },
    decorative: true,
    eyebrow: "Цаг үеийн урамшуулал",
    title: "Интернэт + ТВ — сард 39,900₮",
    subtitle: "Шинэ хэрэглэгчдэд үнэгүй суурилуулалттай, 1 жилийн багц.",
    cta: { label: "Багц харах", href: "/#", owner: "univision" },
    secondaryCta: { label: "Бүх урамшуулал", href: "/#" },
  },
};

export type PromoCard = {
  id: string;
  placeholderText: string;
  ctaLabel: string;
  href: string;
  image?: string;
  imageDesktop?: string;
  imageDesktopPosition?: string;
  imageAlt?: string;
};

export const samplePromoCards: Record<BrandId, PromoCard[]> = {
  unitel: [
    {
      id: "promo-1",
      placeholderText: "Sample banner 1",
      ctaLabel: "Дэлгэрэнгүй",
      href: "#",
      image: "/Unitel/Hero banner/Image 1.jpg",
      imageDesktop: "/Unitel/Hero banner/Bagtsaa butee Desktop.png",
      imageDesktopPosition: "left center",
    },
    {
      id: "promo-2",
      placeholderText: "Sample banner 2",
      ctaLabel: "Дэлгэрэнгүй",
      href: "#",
      image: "/Unitel/Hero banner/Image 2.jpg",
      imageDesktop: "/Unitel/Hero banner/Immersive experience Desktop.png",
    },
    {
      id: "promo-3",
      placeholderText: "Sample banner 3",
      ctaLabel: "Дэлгэрэнгүй",
      href: "#",
      image: "/Unitel/Hero banner/Image 3.jpg",
      imageDesktop: "/Unitel/Hero banner/Unitel Desktop.png",
    },
  ],
  univision: [
    {
      id: "promo-1",
      placeholderText: "HBO Max",
      ctaLabel: "Дэлгэрэнгүй",
      href: "/#",
      image: "/Univision/Hero banner/663188328_1418753500294305_8290439988204494409_n.jpg",
      imageDesktop: "/Univision/Hero banner/HBO max DEsktop.jpg",
    },
    {
      id: "promo-2",
      placeholderText: "Univision GO",
      ctaLabel: "Дэлгэрэнгүй",
      href: "/#",
      image: "/Univision/Hero banner/728828243_1013884858044719_4355270358319999956_n.jpg",
      imageDesktop: "/Univision/Hero banner/Univision Go Desktop.jpg",
    },
    {
      id: "promo-3",
      placeholderText: "Хэрэглээ",
      ctaLabel: "Дэлгэрэнгүй",
      href: "/#",
      image: "/Univision/Hero banner/784181930_1958676971757199_2722433891345112408_n.jpg",
      imageDesktop: "/Univision/Hero banner/Hereglee Desktop.jpg",
      imageDesktopPosition: "center bottom",
    },
  ],
};
