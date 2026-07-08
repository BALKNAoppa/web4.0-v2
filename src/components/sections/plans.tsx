"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, Wifi, Tv, Play, Phone, type LucideIcon } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { plans, type Plan, type PlanGroup } from "@/data/plans";

// Icon нэрийг lucide компонент руу хувиргах map
const iconMap: Record<PlanGroup["icon"], LucideIcon> = {
  wifi: Wifi,
  tv: Tv,
  play: Play,
  phone: Phone,
};

/**
 * L+ recommended багц байгаа index — mobile carousel-ийг үүн дээр анх төвлөрүүлнэ.
 */
const RECOMMENDED_INDEX = plans.findIndex((p) => p.recommended);

export function Plans() {
  const [api, setApi] = useState<CarouselApi>();

  // Mobile carousel анх ачаалагдсаны дараа L+ (recommended) дээр үсэргэх
  useEffect(() => {
    if (!api || RECOMMENDED_INDEX < 0) return;
    api.scrollTo(RECOMMENDED_INDEX, true); // jump = true (анимэйшнгүй)
  }, [api]);

  return (
    <section aria-labelledby="plans-title" className="bg-muted/30 py-7 lg:py-8">
      <div className="container mx-auto px-4">
        {/* Section гарчиг */}
        <div className="mb-12 text-center">
          <h2 id="plans-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            Санал болгох багц or something trigger үг
          </h2>
          <p className="text-muted-foreground mt-3 text-base md:text-lg">
            Энд бас something trigger үг байж болно, жишээ нь{" "}
            <span className="text-foreground font-semibold">Хамгийн алдартай</span> багц гэх мэт
          </p>
        </div>

        {/* Desktop — 3 card зэрэг харагдана */}
        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Mobile — Carousel-аар нэгээр нь (L+ дээр анх төвлөрөл) */}
        <div className="md:hidden">
          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: false, startIndex: RECOMMENDED_INDEX }}
            className="w-full"
          >
            <CarouselContent>
              {plans.map((plan) => (
                <CarouselItem key={plan.id} className="basis-[85%]">
                  <PlanCard plan={plan} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* AI Rainbow CTA — багцын мэдээллийн доор */}
        <div className="mt-12 flex justify-center">
          <RainbowButton asChild className="bg-background h-12 rounded-4xl px-8 text-base">
            <Link
              href="/main-packages"
              className="inline-flex items-center gap-2 text-white dark:text-black"
            >
              <Sparkles className="size-5" aria-hidden="true" />
              <span className="font-medium">AI-c зөвлөгөө авах</span>
              <ChevronRight className="size-5" aria-hidden="true" />
            </Link>
          </RainbowButton>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// PLAN CARD
// =====================================================================
function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`bg-card text-semibold relative flex h-full flex-col rounded-2xl border-2 p-6 shadow-sm transition-shadow hover:shadow-md ${
        plan.recommended ? "border-primary" : "border-border"
      }`}
      aria-label={`${plan.name} багц`}
    >
      {/* Header: Name + Recommended badge */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <h3 className="text-3xl font-bold tracking-tight">{plan.name}</h3>
        {plan.recommended && (
          <Badge className="bg-primary text-primary-foreground hover:bg-primary rounded-full px-3 py-1 text-xs font-semibold">
            САНАЛ БОЛГОХ
          </Badge>
        )}
      </div>

      {/* Groups */}
      <div className="flex-1 space-y-6">
        {plan.groups.map((group) => (
          <PlanGroupBlock key={group.title} group={group} recommended={plan.recommended} />
        ))}
      </div>

      {/* CTA: Дэлгэрэнгүй (Идэвхжүүлэх товчийг home хуудаснаас хассан) */}
      <div className="mt-6 space-y-3 border-t pt-6">
        <div className="text-center">
          <Link
            href={plan.detailHref}
            className="text-foreground hover:text-primary text-sm font-medium underline underline-offset-4 transition-colors"
          >
            Дэлгэрэнгүй
          </Link>
        </div>
      </div>

      {/* Footer: Price */}
      <div className="bg-muted/40 -mx-6 mt-6 -mb-6 rounded-b-2xl px-6 py-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground text-xs">
            Сарын суурь хураамж <span className="text-[10px]">/НӨАТ-тай/</span>
          </span>
          <span className="text-lg font-bold">{plan.price}</span>
        </div>
      </div>
    </article>
  );
}

// =====================================================================
// PLAN GROUP BLOCK — Нэг group (Интернэт, IPTV, гэх мэт)
// =====================================================================
function PlanGroupBlock({ group, recommended }: { group: PlanGroup; recommended?: boolean }) {
  const Icon = iconMap[group.icon];

  return (
    <div>
      {/* Group title with icon */}
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`size-5 ${recommended ? "text-primary" : "text-muted-foreground"}`} />
        <h4 className="text-sm font-semibold">{group.title}</h4>
      </div>

      {/* Features (label ↔ value) */}
      <dl className="space-y-1.5 pl-7">
        {group.features.map((feature) => (
          <div key={feature.label} className="flex items-baseline justify-between gap-2 text-sm">
            <dt className="text-muted-foreground">{feature.label}</dt>
            <dd className="text-right font-medium">{feature.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
