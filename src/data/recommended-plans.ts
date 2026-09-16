import { planTierHighlights } from "@/data/mobile-plans";
import { plans, type Plan, type PlanGroup } from "@/data/plans";
import type { PlanId } from "@/data/main-packages-quiz";

export type PlanTabId = "recommended" | "other";

export type PlanTab = {
  id: PlanTabId;
  label: string;
};

export type PlanCardContent = {
  id: string;
  photoLabel?: string;
  title: string;
  highlights?: string[];
  groups?: PlanGroup[];
  ctaLabel: string;
  href: string;
  recommended?: boolean;
  planId?: string;
  image?: string;
  imageAlt?: string;
  price?: string;
  priceNote?: string;
};

export type RecommendedPlansContent = {
  heading: { title: string; subtitle: string };
  tabs?: PlanTab[];
  cards: { recommended: PlanCardContent[]; other?: PlanCardContent[] };
  cta?: { label: string; href: string };
  loop?: boolean;
};

export const RECOMMENDED_BADGE = "Санал болгох";

export const unitelRecommendedPlans: RecommendedPlansContent = {
  heading: {
    title: "Санал болгох багц",
    subtitle: "Хэрэглээнд тань тохирох дата болон ярианы багцууд.",
  },
  tabs: [
    { id: "recommended", label: "Танд санал болгох багц" },
    { id: "other", label: "Бусад багцууд" },
  ],
  cards: {
    recommended: [
      {
        id: "rec-plus",
        planId: "plus-16",
        image: "/Unitel/Recommandation/Plus.jpg",
        photoLabel: "Card photo",
        title: "PLUS",
        highlights: planTierHighlights.plus,
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
      {
        id: "rec-priority",
        planId: "priority-48",
        image: "/Unitel/Recommandation/Priority.png",
        photoLabel: "Card photo",
        title: "PRIORITY",
        highlights: planTierHighlights.priority,
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
        recommended: true,
      },
      {
        id: "rec-premium",
        planId: "premium-88",
        image: "/Unitel/Recommandation/Premium.png",
        photoLabel: "Card photo",
        title: "PREMIUM",
        highlights: planTierHighlights.premium,
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
    ],
    other: [
      {
        id: "smart-data",
        photoLabel: "Card photo",
        title: "SMART DATA",
        highlights: ["Хэрэглээнд тохирсон дата", "Өндөр хурдны сүлжээ", "Уян хатан сонголт"],
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
      {
        id: "smart-talk",
        photoLabel: "Card photo",
        title: "SMART TALK",
        highlights: ["Бүх сүлжээнд ярих эрх", "Хязгаарлалттай дуудлага", "Нэмэлт боломжууд"],
        ctaLabel: "Дэлгэрэнгүй",
        href: "#",
      },
    ],
  },
};

function uvPlan(id: PlanId): Plan {
  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`recommended-plans: plans.ts-д "${id}" багц байхгүй`);
  return plan;
}

const UV_PRICE_NOTE = "/ сарын суурь хураамж /НӨАТ-гүй үнэ/";

function uvCard(id: PlanId): PlanCardContent {
  const plan = uvPlan(id);
  return {
    id: `uv-${plan.id}`,
    title: plan.name,
    price: plan.price,
    priceNote: UV_PRICE_NOTE,
    groups: plan.groups,
    recommended: plan.recommended,
    ctaLabel: "Дэлгэрэнгүй харах",
    href: "/#",
  };
}

export const univisionRecommendedPlans: RecommendedPlansContent = {
  heading: {
    title: "Танд санал болгох багц",
    subtitle: "Хэрэглээнд тань тохирох дата болон ярианы багцууд",
  },
  cards: {
    recommended: [uvCard("m-plus"), uvCard("l-plus"), uvCard("xl-plus")],
  },
  cta: { label: "Бусад багц харах", href: "/#" },
  loop: false,
};
