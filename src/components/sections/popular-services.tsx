import Image from "next/image";

import { popularServices, popularServicesSection } from "@/data/popular-services";
import { sectionType } from "@/lib/section-type";
import { sectionBg } from "@/lib/section-bg";
import { cn } from "@/lib/utils";

/**
 * "ЭРЭЛТТЭЙ БАЙГАА ҮЙЛЧИЛГЭЭ" — нүүрний section.
 *
 *        Эрэлттэй байгаа үйлчилгээ      ← том гарчиг
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
    <section aria-labelledby="popular-services-title" className={cn(sectionBg.page, "w-full")}>
      <div className="mx-auto w-full max-w-300 px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="popular-services-title" className={sectionType.title}>
            {popularServicesSection.title}
          </h2>
          {/* ⚠️ ТАЙЛБАР МӨР ХАСАГДСАН (2026-09-07, захиалагчийн шийдвэр).
              Өмнө нь `popularServicesSection.description` = "Энд онцлох
              trigger үг байрлана" гэсэн placeholder гардаг байв. Дата талбар
              нь бүрмөсөн устсан тул буцаах бол хоёуланг нь сэргээнэ. */}
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
          `object-cover` нь ХАСНА. Тайралтын байрлалыг карт бүр өөрөө
          `imagePosition`-оор шийднэ — хоёулаа `center top`, учир нь онцлох
          гарчгийн блок нь зургийн ДЭЭД талд байдаг (дата файлын тооцоог үз). */}
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

        {/* ИДЭВХЖҮҮЛЭХ ЗААВАР — заавал биш, байгаа картад л гарна.
            ⚠️ `text-foreground` (тайлбарын `muted` БИШ) + `font-medium`:
            энэ мөр нь ҮЙЛДЭЛ заадаг бөгөөд дугаар агуулдаг тул тайлбартай
            ижил бүдэг өнгөтэй байвал урсгал бичвэрт дарагдана.
            `mt-auto` — карт нь `flex-1` тул заавар ҮРГЭЛЖ картын ЁРОНД
            наалдаж, хөрш картын тайлбар хэдэн мөр байснаас үл хамааран
            хоёулаа нэг шугамд эгнэнэ. */}
        {service.activation && (
          <p className="text-foreground mt-auto pt-3 text-sm leading-snug font-medium text-pretty">
            {service.activation}
          </p>
        )}
      </div>
    </article>
  );
}
