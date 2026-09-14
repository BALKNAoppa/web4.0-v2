import Image from "next/image";
import Link from "next/link";

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
 *   │  Дуудлага хадгалах (Идэвхжүүлэх)│ ← товч ГАРЧГИЙН мөрөнд
 *   │  Тайлбар — картын БҮТЭН өргөн │
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
 * ⚠️ КАРТ БҮХЭЛДЭЭ ЛИНК БИШ — ганц дарах цэг нь ИДЭВХЖҮҮЛЭХ товч
 * (`RecommendedPlans`-ийн багцын картын зарчимтай ижил: гарчиг, тайлбар нь
 * УНШИХ зүйл тул тэднийг дарагдах талбай болговол "юуг дарж болох вэ" гэсэн
 * асуулт төрүүлнэ).
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
        {/* ── ГАРЧИГ + CTA — НЭГ МӨРӨНД ──
            ⚠️ ТОВЧ нь ГАРЧГИЙН мөрөнд, баруун талдаа суудаг (2026-09-14,
            захиалагчийн зурсан байрлал). Өмнө нь тайлбарын доор байсан бөгөөд
            "буруу газар" гэж буцаагдсан.

            `items-center` — товчны төв гарчгийн төвтэй таарна. Гарчиг нь нэг
            мөр (`text-lg`), товч 40px тул `items-end` бол товч гарчгаас доош
            унжина.

            `min-w-0` гарчиг дээр: урт нэр ирвэл ТОВЧИЙГ шахахгүй, өөрөө
            мөр тасарна (товч `shrink-0`). */}
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-foreground min-w-0 text-lg font-bold tracking-tight md:text-xl">
            {service.title}
          </h3>
          {/* ⚠️ КЛАСС нь `RecommendedPlans > PlanPhotoCard`-ын "Дэлгэрэнгүй"
              товчтой ҮСЭГ ҮСГЭЭРЭЭ ИЖИЛ (2026-09-14, захиалагч: "багцын
              дэлгэрэнгүй гэсэн button-тэй ижил байдлаар хий"). Тэр товчийг
              өөрчлөх өдөр ЭНЭ ч зэрэг өөрчлөгдөнө — хоёулаа нүүрэн дээр
              зэрэгцэж харагддаг.

              `aria-label` — "Идэвхжүүлэх" гэдэг ганцаараа ЯМАР үйлчилгээг
              гэдгийг хэлэхгүй. Дэлгэц уншигч дээр товчнуудын жагсаалт
              гаргахад хоёулаа ижил нэртэй болж ялгагдахгүй болно. */}
          <Link
            href={service.href}
            aria-label={`${service.title} — ${service.ctaLabel}`}
            className="bg-foreground text-background inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-opacity duration-300 hover:opacity-85"
          >
            {service.ctaLabel}
          </Link>
        </div>

        {/* ⚠️ ТАЙЛБАР нь картын БҮТЭН ӨРГӨНИЙГ эзэлж, ГАРЧИГТАЙ НЭГ зүүн
            ирмэгээс эхэлнэ (2026-09-14, захиалагч: "short description-г
            уртаар нь байлгаад title-тай align болго"). Товчийг бичвэрийн
            ХАЖУУД тавихгүй — тэгвэл багана ~190px болж хумигдана. */}
        <p className="text-muted-foreground mt-2 text-sm leading-snug text-pretty">
          {service.description}
        </p>

        {/* ИДЭВХЖҮҮЛЭХ ЗААВАР — заавал биш, байгаа картад л гарна.
            ⚠️ `text-foreground` (тайлбарын `muted` БИШ) + `font-medium`:
            энэ мөр нь ҮЙЛДЭЛ заадаг бөгөөд дугаар агуулдаг тул тайлбартай
            ижил бүдэг өнгөтэй байвал урсгал бичвэрт дарагдана. */}
        {service.activation && (
          <p className="text-foreground mt-2 text-sm leading-snug font-medium text-pretty">
            {service.activation}
          </p>
        )}

      </div>
    </article>
  );
}
