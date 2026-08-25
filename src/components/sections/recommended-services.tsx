import { BrandRibbon } from "@/components/sections/brand-ribbon";
import { recommendedServicesRibbon } from "@/data/brand-ribbon";

/** Section-ий гарчиг — өөрчлөх бол ЗӨВХӨН энэ мөр */
const TITLE = "Санал болгох үйлчилгээ";

/**
 * "САНАЛ БОЛГОХ ҮЙЛЧИЛГЭЭ" — `RecommendedPlans`-ийн ШУУД дор.
 *
 *              Санал болгох үйлчилгээ            ← гарчиг
 *   ⬜ ⬜ ⬜ ⬜ ⬜ ⬜ ⬜                            ← өнгөт дүрст товчнууд
 *   P1 P2 P3 P4 P5 P6 P7                          ← дугаарласан placeholder
 *
 * ⚠️ АГУУЛГА БҮГД PLACEHOLDER ([brand-ribbon.ts > recommendedServicesRibbon]).
 * Зөвхөн ГАРЧИГ нь бодит — бусад нь "Product N" шошго, `#` линк.
 *
 * Товчнуудыг `BrandRibbon` рендэрлэнэ — ШИНЭ компонент БИЧЭЭГҮЙ. Тэр нь
 * устсан брэнд хуудасны template-ээс авч үлдсэн бөгөөд өдийг хүртэл хаана ч
 * дуудагдаагүй байсан; энэ section нь түүний хүлээж байсан БАЙРЛАХ ГАЗАР.
 *
 * ⚠️ ГАРЧИГ ТӨВД — `RecommendedPlans`-тай нэгдсэн. Зүүн эгнүүлэлтийг туршиж
 * үзээд БУЦААСАН: section бүр өөр өргөнтэй (туслах `max-w-3xl` 768px, багц
 * болон энэ 1200px) тул зүүн ирмэгүүд нь зөрж, хуудас замбараагүй харагдаж
 * байв. Товчны мөр нь харин хүрээгээ БҮТНЭЭР эзэлдэг (`lg:justify-between`)
 * тул төвд байгаа гарчигтай зөрчилдөхгүй.
 *
 * ⚠️ `<section>` байх ЁСТОЙ бөгөөд `#main-content`-ийн ШУУД хүүхэд —
 * `SectionSnapScroller` тэгж хайдаг.
 */
export function RecommendedServices() {
  return (
    <section
      aria-labelledby="services-title"
      className="bg-background w-full pt-6 pb-14 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24"
    >
      <div className="mx-auto max-w-300 px-4">
        <h2
          id="services-title"
          className="text-foreground text-center text-3xl font-extrabold tracking-tight text-balance md:text-4xl lg:text-5xl"
        >
          {TITLE}
        </h2>
      </div>

      {/* Ribbon өөрөө `max-w-[1200px] px-4 py-10`-тэй тул НЭМЭЛТ хүрээ
          ХЭРЭГГҮЙ — давхарлавал хажуугийн зай хоёр дахин орно. */}
      <BrandRibbon items={recommendedServicesRibbon} label={TITLE} />
    </section>
  );
}
