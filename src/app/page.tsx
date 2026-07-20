// Шинэ нүүр — Apple-ийн нүүрнээс санаа авсан бүтэц:
// урамшууллын hero banner → main product (Мобайл дараа төлбөрт) →
// Univision үндсэн багц → үндсэн үйлчилгээний entry tile-ууд →
// Endless entertainment (апп, кино).
import { HomeHeroBanner } from "@/components/sections/home-hero-banner";
import { MobilePlans } from "@/components/sections/mobile-plans";
import { UnivisionPlansBanner } from "@/components/sections/univision-plans-banner";
// import { Plans } from "@/components/sections/plans"; // M+/L+/XL+ дэлгэрэнгүй картууд — banner-аар сольсон
import { FeaturedMarquee } from "@/components/sections/featured-marquee";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
// Хуучин нүүрний section-ууд — шаардлагатай бол буцааж нээнэ:
// import { Hero } from "@/components/sections/hero";
// import { QuickActionsBento as QuickActions } from "@/components/sections/quick-actions";
// import { TrustOrbit } from "@/components/sections/trust-orbit";
// import { Promotions } from "@/components/sections/promotions";
// import { UnivisionGoApp } from "@/components/sections/univision-go-app";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/layout/footer";
import { SectionSnapScroller } from "@/components/layout/section-snap-scroller";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <HomeHeroBanner />
      <MobilePlans />
      <UnivisionPlansBanner />
      <ProductEntryGrid />
      <FeaturedMarquee />
      <Faq />
      <Footer />
      {/* Section snap — зөвхөн нүүр хуудсанд идэвхтэй */}
      <SectionSnapScroller />
    </main>
  );
}
