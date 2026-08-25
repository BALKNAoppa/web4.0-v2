import { Promotions } from "@/components/sections/promotions";
import { ChatHero } from "@/components/sections/chat-hero";
import { HeaderHeightVar } from "@/components/layout/header-height-var";
import { RecommendedPlans } from "@/components/sections/recommended-plans";
import { unitelRecommendedPlans } from "@/data/recommended-plans";
import { RecommendedServices } from "@/components/sections/recommended-services";
import { PromoHero } from "@/components/home/promo-hero";
import { UnitelHome } from "@/components/home/unitel-home";
import { UnivisionHome } from "@/components/home/univision-home";
import { Footer } from "@/components/layout/footer";
import { BRAND } from "@/lib/brand";

/**
 * НҮҮР ХУУДАС — хоёр брэнд ӨӨР ӨӨР бүтэцтэй.
 *
 * UNITEL:
 *   1. `PromoHero`    — promo carousel (дэлгэцийн ~60%) — ХОЁР БРЭНДЭД ИЖИЛ
 *   2. `ChatHero`     — AI assistant, promo-гийн ШУУД доор
 *   3. `RecommendedPlans` — "Санал болгох багц", БҮРЭН хэмжээний section
 *   4. `Promotions`  — "Онцлох урамшуулал", 3 карт (v1-ээс)
 *   5. `RecommendedServices` — "Санал болгох үйлчилгээ", дүрст товчны мөр
 *   ~~6. `UnitelHome` — entry tile-ууд, апп~~ ТҮР ИДЭВХГҮЙ (доор comment)
 *
 *   ⚠️ Багцын хэсэг өмнө нь hero-гийн доод 40%-д байсныг AI туслахын ДООШ,
 *   тусдаа section болгож зөөв — тэгснээр карт нь дэлгэцийн 40%-д
 *   шахагдахаа болив.
 *
 * UNIVISION:
 *   PromoHero → ChatHero → UnivisionHome (доторх дараалал univision-home.tsx)
 *   ⚠️ Univision-ы нүүрийг ТУСДАА, өөр бүтцээр хийхээр төлөвлөсөн —
 *   Unitel-ийнхийг энд хуулж БОЛОХГҮЙ.
 *
 * ⚠️ Section-ууд `#main-content`-ийн ШУУД хүүхэд байх ёстой —
 * `SectionSnapScroller` тэгж хайдаг.
 */
// Идэвхгүй болгосон section-ийг TypeScript "unused" гэж бүү зэмлэ
// (`promo-banner.tsx`-тэй ижил арга). Import нь хэвээр байх тул буцаахад
// ганц мөрийн comment авахад л хангалттай.
void UnitelHome;

export default function Home() {
  const isUnivision = BRAND === "univision";

  return (
    <main id="main-content" className="min-h-screen">
      {/* Header-ийн бодит өндрийг `--header-h` болгож бичнэ — `PromoHero`
          "дэлгэц хасах header" гэсэн өндрийг үүгээр тооцно.
          ⚠️ Өмнө нь `!isUnivision &&` байсан: Univision hero-г хуваалцаж
          эхэлсэн тул ХОЁУЛАНД шаардлагатай. Үүнгүй бол globals.css-ийн
          fallback (49/78px) л ажиллаж, header-ийн бодит өндрөөс зөрнө. */}
      <HeaderHeightVar />

      {isUnivision ? (
        <>
          <PromoHero />
          <ChatHero heroRest />
          <UnivisionHome />
        </>
      ) : (
        <>
          <PromoHero />
          {/* `heroRest` — эхний дэлгэцийн ҮЛДСЭН 40%. Ингэснээр
              header + promo (60%) + туслах (40%) = ЯГ нэг дэлгэц.
              Prop-гүй бол 46svh (331px) болж 1280×720 дээр 74px халдаг. */}
          <ChatHero heroRest />
          <RecommendedPlans content={unitelRecommendedPlans} />

          {/* "Онцлох урамшуулал" — `web4-sample` (v1)-ээс ирсэн section.
              Компонент нь энэ repo-д аль хэдийн байсан ч зөвхөн Univision
              нүүрэнд дуудагдаж байв; одоо ХОЁУЛАА хуваалцана.
              ⚠️ Картын агуулга нь бүхэлдээ PLACEHOLDER ([promotions.ts]). */}
          <Promotions />

          <RecommendedServices />

          {/* ⚠️ ТҮР ИДЭВХГҮЙ — `UnitelHome` (MobilePlans · ProductEntryGrid ·
              AppPromo). Нүүр одоогоор "Санал болгох үйлчилгээ"-гээр төгсөнө.
              Буцаах бол дараах мөрийн `//`-г л авна. Компонент өөрөө
              хөндөгдөөгүй тул устгасан зүйл АЛГА. */}
          {/* <UnitelHome /> */}
        </>
      )}

      <Footer />
    </main>
  );
}
