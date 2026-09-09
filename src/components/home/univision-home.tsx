import { RecommendedPlans } from "@/components/sections/recommended-plans";
import { FeaturedServices } from "@/components/sections/featured-services";
import { FeaturedMarquee } from "@/components/sections/featured-marquee";
import { Promotions } from "@/components/sections/promotions";
import { TrustBuild } from "@/components/sections/trust-build";
import { AppPromo } from "@/components/sections/app-promo";
import { TrustOrbit } from "@/components/sections/trust-orbit";
import { unitelApp } from "@/data/app-promo";
import { univisionRecommendedPlans } from "@/data/recommended-plans";

/**
 * Univision нүүрний AI туслахаас доош бүх хэсэг.
 *
 * ДАРААЛАЛ (батлагдсан):
 *   1. `PromoBanner`  ─┐ энэ хоёр нь `page.tsx`-д, эхний дэлгэцийн төлөө
 *   2. `ChatHero`     ─┘
 *   3. `RecommendedPlans`     — Санал болгох багц (Univision-ы M+ · L+ · XL+)
 *   4. `FeaturedServices`     — Онцлох / эрэлттэй үйлчилгээ  ← ШИНЭ
 *   5. `Promotions`           — Урамшуулал
 *   6. `FeaturedMarquee`     — Энтертайнмэнт (v1-ээс, зураггүй)
 *   ~~7. `TrustBuild` — Итгэл төрүүлэх, 3 блок~~ ХАСАГДСАН (доор үз)
 *   8. `AppPromo`             — Апп татах
 *
 * ⚠️ `TrustOrbit` (wifi pulse) ТҮР ИДЭВХГҮЙ. Устгаагүй — компонент бүрэн
 * хэвээр, доорх `void` нь TypeScript-ийн "unused" анхааруулгыг дардаг
 * (`promo-banner.tsx`, `page.tsx`-тэй ижил арга). Буцаах бол 7-р байрны
 * `<TrustBuild />`-ийг `<TrustOrbit />`-ээр солино.
 *
 * ЧУХАЛ: Fragment буцаана — `<div>` ороолгож БОЛОХГҮЙ. Section-ууд
 * `#main-content`-ийн ШУУД хүүхэд байх ёстой.
 */
void TrustOrbit;
/**
 * ⚠️ `TrustBuild` ч мөн ТҮР ИДЭВХГҮЙ болов (2026-09-09) — доорх рендерийн
 * тайлбарыг үз. Import хэвээр байгаа нь ЗӨРИУД: буцаахад ганц мөрийн
 * comment авахад л хангалттай.
 */
void TrustBuild;

export function UnivisionHome() {
  return (
    <>
      {/* 3 — Санал болгох багц */}
      <RecommendedPlans content={univisionRecommendedPlans} />

      {/* 4 — Онцлох / эрэлттэй үйлчилгээ. Хэрэглэгчид хамгийн их авдаг зүйл
          БОЛОН байгууллагын түлхэхийг хүсэж буй үйлчилгээ. Жагсаалт нь
          `data/featured-services.ts`-д гараар эрэмбэлэгдэнэ. */}
      <FeaturedServices />

      {/* 5 — Урамшуулал (агуулга нь одоогоор placeholder) */}
      <Promotions />

      {/* 6 — Энтертайнмэнт. `web4-sample` (v1)-ийн `FeaturedMarquee`:
          хоёр center-peek carousel (том = апп, жижиг = кино), 5 сек тутам
          автоматаар шилжинэ, pause/play удирдлагатай.

          ⚠️ ЗУРАГГҮЙ. `marquee-items.ts`-ийн `image` талбарууд ЗОРИУД
          хоосон — компонент нь зураг байхгүй үед `shade` дэвсгэр + нэрийн
          том бүдэг бичээсээр placeholder буулгадаг. Жинхэнэ зураг бэлэн
          болмогц зөвхөн data-д `image` нэмнэ, компонент хөндөгдөхгүй. */}
      <FeaturedMarquee />

      {/* ⚠️ 7 — `TrustBuild` ХАСАГДСАН (2026-09-09, захиалагчийн заавар:
          "мөн entertainment-ны доор байгаа screenshot-оор оруулсныг хас").
          Screenshot дээр ЯГ ЭНЭ section байсан: "Title / Description /
          CTA button" + "Video 1" · "Video 2" гэсэн хар талбайнууд.

          ЯАГААД: гурван блокийн бичвэр (гарчиг · тайлбар · CTA) БҮГД
          placeholder, медиа нь видеоны хоосон байр. Нүүрний бусад хэсэг
          бодит агуулгатай болсон тул энэ нь ганцаараа "дуусаагүй" мэт
          харагдаж байв.

          Компонент ӨӨРӨӨ УСТААГҮЙ (`sections/trust-build.tsx` +
          `data/trust-build.ts` хэвээр). Бодит бичвэр, видео бэлэн болоход
          доорх мөрийн `//`-г авахад л буцна. `TrustOrbit` (wifi pulse) ч
          мөн адил нөөцөд байна — доорх `void`-ийг үз. */}
      {/* <TrustBuild /> */}

      {/* 8 — Апп татах.
          ⚠️ `unitelApp` (Univision GO БИШ) — Unitel апп нь Юнивишний төлбөр
          төлөх, нэгж/дата авах үйлчилгээг ч агуулдаг тул Univision нүүрэнд
          түүнийг санал болгож байна. Univision GO рүү буцаах бол
          `univisionGoApp` -г import хийж энд солино. */}
      <AppPromo content={unitelApp} />
    </>
  );
}
