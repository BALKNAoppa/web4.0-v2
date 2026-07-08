import { Hero } from "@/components/sections/hero";
// import { HeroSplit as Hero } from "@/components/sections/hero";
// import { QuickActions } from "@/components/sections/quick-actions";
// import { QuickActionsDetailed as QuickActions } from "@/components/sections/quick-actions";
import { QuickActionsBento as QuickActions } from "@/components/sections/quick-actions";
import { Plans } from "@/components/sections/plans";
import { FeaturedMarquee } from "@/components/sections/featured-marquee";
import { TrustOrbit } from "@/components/sections/trust-orbit";
import { Promotions } from "@/components/sections/promotions";
import { UnivisionGoApp } from "@/components/sections/univision-go-app";
// import { WifiPromo } from "@/components/sections/wifi-promo";
// import { News } from "@/components/sections/news";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/layout/footer";
import { SectionSnapScroller } from "@/components/layout/section-snap-scroller";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <Hero />
      <QuickActions />
      <Plans />
      <TrustOrbit />
      <Promotions />
      <FeaturedMarquee />
      <UnivisionGoApp />
      {/* <WifiPromo /> */}
      {/* <News /> */}
      <Faq />
      <Footer />
      {/* Section snap — зөвхөн нүүр хуудсанд идэвхтэй */}
      <SectionSnapScroller />
    </main>
  );
}
