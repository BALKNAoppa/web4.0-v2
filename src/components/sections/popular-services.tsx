import Image from "next/image";

import { popularServices, popularServicesSection } from "@/data/popular-services";

/**
 * "ЭРЭЛТТЭЙ БАЙГАА ҮЙЛЧИЛГЭЭ" — нүүрний section.
 *
 *        Эрэлттэй байгаа үйлчилгээ      ← том гарчиг
 *      Энд онцлох trigger үг байрлана   ← тайлбар
 *   ┌───────────────────────────────┐
 *   │ [        ЗУРАГ  2:1          ]│  ← картын БҮТЭН өргөнөөр
 *   │  Дуудлага хадгалах            │
 *   │  Тайлбар 2 мөр…               │
 *   └───────────────────────────────┘
 *   ┌───────────────────────────────┐
 *   │ …                             │
 *   └───────────────────────────────┘
 *
 * ⚠️ ТОЛГОЙН ХЭМЖЭЭ нь `RecommendedPlans` · `Promotions`-тэй НЭГ
 * (`text-3xl md:text-4xl lg:text-5xl`, төвд). Нүүрний section-ууд нэг
 * хэмнэлтэй байх ёстой — гурвыг зэрэг өөрчил.
 *
 * ⚠️ `<section>` байх ЁСТОЙ бөгөөд `#main-content`-ийн ШУУД хүүхэд —
 * `SectionSnapScroller` тэгж хайдаг.
 */
export function PopularServices() {
  return (
    <section aria-labelledby="popular-services-title" className="bg-background w-full">
      <div className="mx-auto w-full max-w-300 px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="popular-services-title"
            className="text-foreground text-3xl font-extrabold tracking-tight text-balance md:text-4xl lg:text-5xl"
          >
            {popularServicesSection.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base text-pretty md:mt-4 md:text-lg">
            {popularServicesSection.description}
          </p>
        </div>

        {/* МОБАЙЛД БОСОО — хоёрхон карт тул carousel хэрэггүй: гүйлгэх зайг
            хэмнэхээс илүү, хоёуланг нь зэрэг харуулах нь ойлгомжтой.
            md+ дээр хоёр багана. */}
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

/**
 * ҮЙЛЧИЛГЭЭНИЙ КАРТ.
 *
 * ЗУРАГ нь картын дээд ирмэгт НААЛДАНА (хажуугийн padding-гүй) — загварт
 * тэгж байгаа. Тиймээс `overflow-hidden` нь заавал: эс бөгөөс зураг картын
 * дугуй буланг давж, дөрвөлжин булан харагдана.
 *
 * ⚠️ ЛИНКГҮЙ. Загварт CTA байхгүй, зам нь ч шийдэгдээгүй —
 * [[popular-services.ts]]-ийн тайлбарыг үз.
 */
function ServiceCard({ service }: { service: (typeof popularServices)[number] }) {
  return (
    <article className="bg-card border-border flex h-full flex-col overflow-hidden rounded-3xl border">
      {/* 2:1 СЛОТ — эх зургууд ХАРЬЦАА ӨӨРТЭЙ (2048×2048 ба 1600×2000) тул
          `object-cover` нь төвөөс тайрна. Гол дүрс төвд байх ёстой. */}
      <div className="relative aspect-[2/1] w-full shrink-0">
        <Image
          src={service.image}
          alt={service.imageAlt ?? ""}
          fill
          // Мобайлд карт нь ~343px (дэлгэцийн бараг бүтэн), md+ дээр хоёр
          // багана тул ~50vw, хамгийн ихдээ 1200/2 = 600px.
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover"
          style={{ objectPosition: service.imagePosition ?? "center" }}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-foreground text-lg font-bold tracking-tight md:text-xl">
          {service.title}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-snug text-pretty">
          {service.description}
        </p>
      </div>
    </article>
  );
}
