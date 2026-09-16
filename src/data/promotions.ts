import type { BrandId } from "@/lib/brand";

export type PromotionTone = "violet" | "green" | "amber";

export type PromotionCard = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  price?: string;
  priceNote?: string;
  validity?: string;
  ctaText: string;
  ctaHref: string;
  tone: PromotionTone;
  image?: string;
  imageAlt?: string;
};

export const promotionsSection = {
  title: "Онцлох урамшуулал",
  description: "Танд зориулсан шинэ урамшуулал, онцлох саналууд.",
  ctaText: "Бүх урамшуулал үзэх",
  ctaHref: "/#",
};

const unitelPromotionCards: PromotionCard[] = [
  {
    id: "build-your-plan",
    title: "Багцаа бүтээ",
    description: "Та хэрэглээндээ тохируулан өөрөө багцаа бүтээх боломжтой боллоо.",
    validity: "2026.10.01 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/#",
    tone: "amber",
    image: "/Unitel/Campaigns/Priority.jpg",
  },
  {
    id: "plus-package",
    title: "Plus багц",
    description: "Дараа төлбөрт хэрэглэгч болоод суурь хураамжийн хөнгөлөлт, нэмэлт дата аваарай.",
    validity: "2026.11.01 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/#",
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
    ctaHref: "/#",
    tone: "green",
    image: "/Unitel/Campaigns/Santa.jpg",
  },
];

const UNIVISION_CAMPAIGNS = "/Univision/Campaigns";

const univisionPromotionCards: PromotionCard[] = [
  {
    id: "flash-deals",
    title: "Flash Deals",
    description: "Кино түрээслэх, багц идэвхжүүлэх бүрдээ оноо цуглуулж хүссэн бэлгээ аваарай.",
    validity: "1-р үе: 09.04–09.14",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/#",
    tone: "green",
    image: "/Univision/Hero banner/flash deals.jpg",
  },
  {
    id: "sport-app-80",
    badge: "80% OFF",
    title: "Спорт Апп",
    description:
      "Ирэх улиралыг Юнивишнийн Спорт апп-аар илүү тод, илүү ойроос, 4K-р хүлээн аваарай.",
    validity: "2026.10.01 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/#",
    tone: "amber",
    image: `${UNIVISION_CAMPAIGNS}/attachment.jpeg`,
  },
  {
    id: "new-movies-20",
    badge: "20% OFF",
    title: "Онцлох кинонууд",
    description:
      "Юнител Группийн 20 жилийн ойг тохиолдуулан хамгийн их үзэлттэй, шилдэг Box кинонууд 20% хөнгөлөгдлөө.",
    validity: "2026.07.31 хүртэл",
    ctaText: "Дэлгэрэнгүй",
    ctaHref: "/#",
    tone: "violet",
    image: `${UNIVISION_CAMPAIGNS}/729579168_1325132313163872_6844509349643937064_n.jpg`,
  },
];

export const promotionCards: Record<BrandId, PromotionCard[]> = {
  unitel: unitelPromotionCards,
  univision: univisionPromotionCards,
};
