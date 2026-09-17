import Image from "next/image";
import Link from "next/link";

import { popularServices, popularServicesSection } from "@/data/popular-services";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";
import { cn } from "@/lib/utils";

export function PopularServices() {
  return (
    <section aria-labelledby="popular-services-title" className={cn(sectionBg.page, "w-full")}>
      <div className="mx-auto w-full max-w-300 px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="popular-services-title" className={sectionType.title}>
            {popularServicesSection.title}
          </h2>
        </div>

        <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-5 md:mt-10 md:max-w-none md:grid-cols-2 md:gap-6">
          {popularServices.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: (typeof popularServices)[number] }) {
  return (
    <article className="bg-card border-border flex h-full flex-col overflow-hidden rounded-3xl border">
      <div className="relative aspect-[2/1] w-full shrink-0">
        <Image
          src={service.image}
          alt={service.imageAlt ?? ""}
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover"
          style={{ objectPosition: service.imagePosition ?? "center" }}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">

        <div className="flex items-center justify-between gap-4">
          <h3 className="text-foreground min-w-0 text-lg font-bold tracking-tight md:text-xl">
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

        <p className="text-muted-foreground mt-2 text-sm leading-snug text-pretty">
          {service.description}
        </p>

        {service.activation && (
          <p className="text-foreground mt-2 text-sm leading-snug font-medium text-pretty">
            {service.activation}
          </p>
        )}

      </div>
    </article>
  );
}
