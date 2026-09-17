import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

import {
  featuredServices,
  featuredServicesSection,
  type FeaturedService,
} from "@/data/featured-services";
import { sectionType } from "@/lib/section-type";
import { cn } from "@/lib/utils";
import { sectionBg } from "@/lib/section-bg";

export function FeaturedServices() {
  return (
    <section aria-labelledby="featured-services-title" className={cn(sectionBg.page, "w-full")}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
        <h2 id="featured-services-title" className={cn("text-center", sectionType.title)}>
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
    <article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow duration-500 ease-out hover:shadow-lg">
      <div className="border-border/60 bg-muted/50 relative flex aspect-[16/7] flex-col items-center justify-center gap-2 border-b">
        {service.image ? (
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(min-width: 768px) 600px, 100vw"
            className="object-cover"
            style={{ objectPosition: service.imagePosition ?? "center" }}
          />
        ) : (
          <>
            <ImageIcon
              className="text-muted-foreground/40 size-7"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-muted-foreground/60 text-sm font-medium">
              {service.photoLabel}
            </span>
          </>
        )}

        {service.badge && (
          <span className="bg-background/80 text-foreground absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur">
            {service.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">

        <div className="flex items-center justify-between gap-4">
          <h3 className="text-foreground min-w-0 text-base font-bold tracking-tight">
            {service.title}
          </h3>
          <Link
            href={service.href}
            aria-label={`${service.title} — ${service.ctaLabel}`}
            className="bg-foreground text-background inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-opacity duration-300 hover:opacity-85"
          >
            {service.ctaLabel}
          </Link>
        </div>

        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
    </article>
  );
}
