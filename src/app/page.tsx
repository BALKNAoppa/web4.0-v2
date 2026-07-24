// Нүүр — бүх header хувилбарт (1/2/3/4) ижил: chat-hero (Хувилбар 4 шиг) +
// бүтээгдэхүүн/энтертайнмент section-ууд. Header зөвхөн toggle-оор ялгаатай.
import { ChatHero } from "@/components/sections/chat-hero";
import { MobilePlans } from "@/components/sections/mobile-plans";
import { UnivisionPlansBanner } from "@/components/sections/univision-plans-banner";
import { FeaturedMarquee } from "@/components/sections/featured-marquee";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/layout/footer";
import { SectionSnapScroller } from "@/components/layout/section-snap-scroller";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <ChatHero />
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
