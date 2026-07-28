"use client";

import { ArrowRight, Check } from "lucide-react";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { SmartLink } from "@/components/layout/smart-link";
import { siblingServices, type ServiceEntry } from "@/data/service-index";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

/**
 * Үйлчилгээний SAMPLE дэлгэрэнгүй хуудас — цэсний зүйл бүр очих газартай
 * болгох зорилготой түр загвар. Агуулга нь placeholder, бүтэц нь бодит:
 * гарчиг · үнэ · багтах зүйлс · CTA · ижил баганы бусад үйлчилгээ.
 *
 * Контентоо service-index-ээс (цэсний дата) уншина — тусдаа дата үүсгээгүй тул
 * цэс дээр зүйл нэмэхэд хуудас нь өөрөө бэлэн болно.
 */

const SAMPLE_FEATURES = [
  "Энэ үйлчилгээнд багтах зүйлсийн жагсаалт энд орно",
  "Хурд, эрхийн хэмжээ гэх мэт үзүүлэлт энд орно",
  "Нэмэлт нөхцөл, хязгаарлалт энд орно",
];

export function ServiceSample({ service }: { service: ServiceEntry }) {
  const siblings = siblingServices(service);

  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb
        items={[
          { label: service.category },
          ...(service.column ? [{ label: service.column }] : []),
          { label: service.label },
        ]}
      />

      <section className="py-10 lg:py-16">
        <div className="container mx-auto max-w-5xl">
          <span
            className={cn(
              navType.badge,
              "border-border text-muted-foreground inline-flex rounded-full border px-2 py-0.5",
            )}
          >
            SAMPLE
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{service.label}</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base">
            {service.category}
            {service.column ? ` · ${service.column}` : ""} — энэ үйлчилгээний танилцуулга, үнэ,
            нөхцөлийн бодит агуулга энд байрлана.
          </p>

          <div className="border-border bg-card mt-8 rounded-2xl border p-6">
            <p className="text-muted-foreground text-sm">Сарын суурь хураамж</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">
              00,000₮
              <span className="text-muted-foreground ml-2 text-base font-normal">/ сар</span>
            </p>

            <ul className="mt-6 space-y-3">
              {SAMPLE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-7 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Захиалах
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </button>
          </div>

          {siblings.length > 0 && (
            <div className="mt-12">
              <h2 className={cn(navType.groupLabel, "mb-4")}>
                {service.column ?? service.category} доторх бусад
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {siblings.map((s) => (
                  <SmartLink
                    key={s.href}
                    href={s.href}
                    owner={s.owner}
                    className="border-border bg-card hover:border-primary/40 group flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors"
                  >
                    <span className="text-sm font-semibold">{s.label}</span>
                    <ArrowRight
                      className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors"
                      aria-hidden="true"
                    />
                  </SmartLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
