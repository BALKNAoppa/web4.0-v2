import { RecommendedPlans } from "@/components/sections/recommended-plans";
import { FeaturedServices } from "@/components/sections/featured-services";
import { FeaturedMarquee } from "@/components/sections/featured-marquee";
import { Promotions } from "@/components/sections/promotions";
import { TrustBuild } from "@/components/sections/trust-build";
import { AppPromo } from "@/components/sections/app-promo";
import { TrustOrbit } from "@/components/sections/trust-orbit";
import { unitelApp } from "@/data/app-promo";
import { univisionRecommendedPlans } from "@/data/recommended-plans";

void TrustOrbit;
void TrustBuild;

export function UnivisionHome() {
  return (
    <>
      {}
      <RecommendedPlans content={univisionRecommendedPlans} />

      {
}
      <FeaturedServices />

      {}
      <Promotions />

      {

}
      <FeaturedMarquee />

      {

}
      {}

      {
}
      <AppPromo content={unitelApp} />
    </>
  );
}
