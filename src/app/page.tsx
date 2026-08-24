import { PromoBanner } from "@/components/sections/promo-banner";
import { ChatHero } from "@/components/sections/chat-hero";
import { HeaderHeightVar } from "@/components/layout/header-height-var";
import { RecommendedPlans } from "@/components/sections/recommended-plans";
import { UnitelHero } from "@/components/home/unitel-hero";
import { UnitelHome } from "@/components/home/unitel-home";
import { UnivisionHome } from "@/components/home/univision-home";
import { Footer } from "@/components/layout/footer";
import { BRAND } from "@/lib/brand";

/**
 * НҮҮР ХУУДАС — хоёр брэнд ӨӨР ӨӨР бүтэцтэй.
 *
 * UNITEL:
 *   1. `UnitelHero`   — promo carousel (дэлгэцийн ~60%)
 *   2. `ChatHero`     — AI assistant, promo-гийн ШУУД доор
 *   3. `RecommendedPlans` — "Санал болгох багц", БҮРЭН хэмжээний section
 *   4. `UnitelHome`   — entry tile-ууд, апп
 *
 *   ⚠️ Багцын хэсэг өмнө нь hero-гийн доод 40%-д байсныг AI туслахын ДООШ,
 *   тусдаа section болгож зөөв — тэгснээр карт нь дэлгэцийн 40%-д
 *   шахагдахаа болив.
 *
 * UNIVISION (хуучин хэвээр):
 *   promo banner → ChatHero → UnivisionHome
 *   ⚠️ Univision-ы нүүрийг ТУСДАА, өөр бүтцээр хийхээр төлөвлөсөн —
 *   Unitel-ийнхийг энд хуулж БОЛОХГҮЙ.
 *
 * ⚠️ Section-ууд `#main-content`-ийн ШУУД хүүхэд байх ёстой —
 * `SectionSnapScroller` тэгж хайдаг.
 */
export default function Home() {
  const isUnivision = BRAND === "univision";

  return (
    <main id="main-content" className="min-h-screen">
      {/* Header-ийн бодит өндрийг `--header-h` болгож бичнэ — `UnitelHero`
          "дэлгэц хасах header" гэсэн өндрийг үүгээр тооцно. */}
      {!isUnivision && <HeaderHeightVar />}

      {isUnivision ? (
        <>
          <PromoBanner />
          <ChatHero />
          <UnivisionHome />
        </>
      ) : (
        <>
          <UnitelHero />
          {/* `heroRest` — эхний дэлгэцийн ҮЛДСЭН 40%. Ингэснээр
              header + promo (60%) + туслах (40%) = ЯГ нэг дэлгэц.
              Prop-гүй бол 46svh (331px) болж 1280×720 дээр 74px халдаг. */}
          <ChatHero heroRest />
          <RecommendedPlans />
          <UnitelHome />
        </>
      )}

      <Footer />
    </main>
  );
}
