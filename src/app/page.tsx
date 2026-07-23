// Нүүр — header toggle-ийн хувилбараар layout солигдоно:
//   Хувилбар 1/2/3 → энгийн нүүр (hero banner → бүтээгдэхүүн → entertainment)
//   Хувилбар 4     → chat-hero нүүр (Google маягийн туслах)
import { HomeHeroBanner } from "@/components/sections/home-hero-banner";
import { ChatHero } from "@/components/sections/chat-hero";
import { MobilePlans } from "@/components/sections/mobile-plans";
import { UnivisionPlansBanner } from "@/components/sections/univision-plans-banner";
import { FeaturedMarquee } from "@/components/sections/featured-marquee";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/layout/footer";
import { SectionSnapScroller } from "@/components/layout/section-snap-scroller";
import { HomeVariantSwitch } from "@/components/layout/home-variant-switch";

export default function Home() {
  // Хувилбар 1/2/3 — энгийн нүүр
  const defaultHome = (
    <>
      <HomeHeroBanner />
      <MobilePlans />
      <UnivisionPlansBanner />
      <ProductEntryGrid />
      <FeaturedMarquee />
      <Faq />
      <Footer />
    </>
  );

  // Хувилбар 4 — chat-hero нүүр (hero нь chat interface, доор нь ижил section-ууд)
  const chatHome = (
    <>
      <ChatHero />
      <MobilePlans />
      <UnivisionPlansBanner />
      <FeaturedMarquee />
      <Faq />
      <Footer />
    </>
  );

  return (
    <main id="main-content" className="min-h-screen">
      <HomeVariantSwitch defaultHome={defaultHome} chatHome={chatHome} />
      {/* Section snap — зөвхөн нүүр хуудсанд идэвхтэй */}
      <SectionSnapScroller />
    </main>
  );
}
