export type HeroSlide = {
  id: string;
  /** Placeholder текст — жинхэнэ зураг бэлдэх хүртэл харагдана */
  placeholderText: string;
  /** CTA-ийн зургийн дотор байх байрлал */
  ctaPosition: "left" | "right";
  ctaText: string;
  ctaHref: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    placeholderText: "Banner 1",
    ctaPosition: "left",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
  {
    id: "slide-2",
    placeholderText: "Banner 2",
    ctaPosition: "right",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
  {
    id: "slide-3",
    placeholderText: "Banner 3",
    ctaPosition: "left",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "#",
  },
];
