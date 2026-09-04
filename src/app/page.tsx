import { Promotions } from "@/components/sections/promotions";
import { PopularServices } from "@/components/sections/popular-services";
import { ChatHero } from "@/components/sections/chat-hero";
import { HeaderHeightVar } from "@/components/layout/header-height-var";
import { RecommendedPlans } from "@/components/sections/recommended-plans";
import { unitelRecommendedPlans } from "@/data/recommended-plans";
import { RecommendedServices } from "@/components/sections/recommended-services";
import { AppPromo } from "@/components/sections/app-promo";
import { unitelApp } from "@/data/app-promo";
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

          {/* "Эрэлттэй байгаа үйлчилгээ" — зурагтай 2 карт.
              ⚠️ Доорх `Promotions` ("Онцлох урамшуулал") нь БҮХЭЛДЭЭ
              placeholder хэвээр. Хоёр section хоёулаа "зурагтай карт"-ын
              хэлбэртэй тул нэг нь нөгөөгөө орлох ёстой эсэхийг захиалагчаас
              лавлана. Орлох бол доорх мөрийг л устгана. */}
          <PopularServices />

          {/* "Онцлох урамшуулал" — `web4-sample` (v1)-ээс ирсэн section.
              Компонент нь энэ repo-д аль хэдийн байсан ч зөвхөн Univision
              нүүрэнд дуудагдаж байв; одоо ХОЁУЛАА хуваалцана.
              ⚠️ Картын агуулга нь бүхэлдээ PLACEHOLDER ([promotions.ts]). */}
          <Promotions />

          <RecommendedServices />

          {/* Unitel апп — том гарчиг + store badge + QR.
              ⚠️ Энэ section нь `UnitelHome`-ийн ДОТОР байсан тул түүнийг
              идэвхгүй болгоход хамт алга болсон. Үр дүнд Unitel дээр апп
              татах CTA НЭГ Ч ГАЗАР үлдээгүй байв: footer-ийн "Апп татах"
              блокийг `SHOW_APP_DOWNLOAD = BRAND !== "unitel"`
              ([footer-shared.tsx]) зориуд нуудаг — яг энэ section нүүрэнд
              байгаа гэсэн үндэслэлээр. Тиймээс `UnitelHome`-ийг бүхэлд нь
              сэргээхгүйгээр зөвхөн үүнийг тусад нь гаргав. */}
          <AppPromo content={unitelApp} />

          {/* ⚠️ ТҮР ИДЭВХГҮЙ — `UnitelHome`-ийн ҮЛДСЭН хоёр section
              (MobilePlans · ProductEntryGrid). Компонент өөрөө хөндөгдөөгүй
              тул устгасан зүйл АЛГА.
              Буцаах бол дараах мөрийн `//`-г авна — ГЭХДЭЭ `UnitelHome`
              дотроо `AppPromo`-г БАС дууддаг тул дээрх `<AppPromo />` мөрийг
              ЗААВАЛ устгана. Эс бөгөөс апп section хоёр удаа гарч,
              `id="unitel-app"` давхардана. */}
          {/* <UnitelHome /> */}
        </>
      )}

      <Footer />
    </main>
  );
}
