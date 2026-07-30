// Нүүр — hero (chat-hero) хоёр брэнд дээр ижил, түүнээс доош бүх section
// брэндээсээ хамаарна. Аль брэндийн build болохыг NEXT_PUBLIC_BRAND шийднэ.
import { PromoBanner } from "@/components/sections/promo-banner";
import { ChatHero } from "@/components/sections/chat-hero";
import { UnitelHome } from "@/components/home/unitel-home";
import { UnivisionHome } from "@/components/home/univision-home";
import { Footer } from "@/components/layout/footer";
import { SectionSnapScroller } from "@/components/layout/section-snap-scroller";
import { BRAND } from "@/lib/brand";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Promo banner — chat-hero-гийн ДЭЭР. Медиа (видео/зураг/gradient) нь
          promo-banner.ts-ээс сонгогдоно. */}
      <PromoBanner />
      <ChatHero />
      {BRAND === "univision" ? <UnivisionHome /> : <UnitelHome />}
      <Footer />
      {/* Section snap — зөвхөн нүүр хуудсанд идэвхтэй */}
      <SectionSnapScroller />
    </main>
  );
}
