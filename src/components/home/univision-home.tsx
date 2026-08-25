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
 *   7. `TrustBuild`          — Итгэл төрүүлэх, 3 блок (Jio загвар)
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

      {/* 7 — Trust build. Jio-гийн нүүрний загвараар гурван блок, текст ↔
          медиа эргэлдэж байрлана. Медиа нь ВИДЕОны байр (одоогоор
          "Video N" шошготой), гарчиг/тайлбар/CTA бүгд placeholder.
          `TrustOrbit` (wifi pulse) -ийг ЗОРИУД хэрэглээгүй, арай өөр үед. */}
      <TrustBuild />

      {/* 8 — Апп татах.
          ⚠️ `unitelApp` (Univision GO БИШ) — Unitel апп нь Юнивишний төлбөр
          төлөх, нэгж/дата авах үйлчилгээг ч агуулдаг тул Univision нүүрэнд
          түүнийг санал болгож байна. Univision GO рүү буцаах бол
          `univisionGoApp` -г import хийж энд солино. */}
      <AppPromo content={unitelApp} />
    </>
  );
}
