import { Promotions } from "@/components/sections/promotions";
import { PopularServices } from "@/components/sections/popular-services";
import { ChatHero } from "@/components/sections/chat-hero";
import { HeaderHeightVar } from "@/components/layout/header-height-var";
import { RecommendedPlans } from "@/components/sections/recommended-plans";
import { unitelRecommendedPlans } from "@/data/recommended-plans";
import { OtherServices } from "@/components/sections/other-services";
import { AppPromo } from "@/components/sections/app-promo";
import { unitelApp } from "@/data/app-promo";
import { PromoHero } from "@/components/home/promo-hero";
import { UnitelHome } from "@/components/home/unitel-home";
import { UnivisionHome } from "@/components/home/univision-home";
import { Footer } from "@/components/layout/footer";
import { BRAND } from "@/lib/brand";

void UnitelHome;

export default function Home() {
  const isUnivision = BRAND === "univision";

  return (
    <main id="main-content" className="min-h-screen">
      {
}
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
          {
}
          <ChatHero heroRest />
          <RecommendedPlans content={unitelRecommendedPlans} />

          {
}
          <PopularServices />

          {
}
          <Promotions />

          <OtherServices />

          {
}
          <AppPromo content={unitelApp} />

          {
}
          {}
        </>
      )}

      <Footer />
    </main>
  );
}
