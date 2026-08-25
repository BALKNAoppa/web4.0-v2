import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

import {
  featuredServices,
  featuredServicesSection,
  type FeaturedService,
} from "@/data/featured-services";

/**
 * ЭРЭЛТТЭЙ БАЙГАА ҮЙЛЧИЛГЭЭ — Univision нүүрний section.
 *
 * Карт бүр: зургийн слот + доор нь гарчиг · тайлбар · текст CTA.
 *
 * ⚠️ ЗУРГИЙН СЛОТ нь ТАШУУ СУДАЛГҮЙ, `brand-showcase.tsx`-тэй ИЖИЛ хэлбэр:
 * `bg-muted/50` дэвсгэр + дүрс + "Photo N". Судалт хувилбарыг ХАСАВ —
 * хуудсан дээрх бусад бүх placeholder (banner, урамшууллын карт, багцын
 * карт) энгийн саарал талбай хэрэглэдэг тул судал нь ганцаараа ялгарч,
 * "энэ өөр зүйл юм уу?" гэсэн асуулт төрүүлж байв.
 */
export function FeaturedServices() {
  return (
    <section aria-labelledby="featured-services-title" className="bg-background w-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
        <h2
          id="featured-services-title"
          className="text-foreground text-center text-2xl font-extrabold tracking-tight text-balance md:text-3xl lg:text-4xl"
        >
          {featuredServicesSection.title}
        </h2>

        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-10">
          {featuredServices.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: FeaturedService }) {
  return (
    <Link
      href={service.href}
      aria-label={`${service.title} — ${service.ctaLabel}`}
      className="group border-border bg-card focus-visible:ring-ring focus-visible:ring-offset-background flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow duration-500 ease-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {/* Зургийн слот — `brand-showcase.tsx`-ийн "Photo N" талбайтай ижил */}
      <div className="border-border/60 bg-muted/50 relative flex aspect-[16/7] flex-col items-center justify-center gap-2 border-b">
        <ImageIcon
          className="text-muted-foreground/40 size-7"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span className="text-muted-foreground/60 text-sm font-medium">{service.photoLabel}</span>

        <span className="bg-background/80 text-foreground absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur">
          {service.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-foreground text-base font-bold tracking-tight">{service.title}</h3>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          {service.description}
        </p>

        {/* `mt-auto` — тайлбар нэг мөр эсвэл гурван мөр байсан ч CTA нь картын
            ЁРООЛД зэрэгцэнэ. Эс бөгөөс хоёр картын CTA өөр өндөрт суудаг. */}
        <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold">
          {service.ctaLabel}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
