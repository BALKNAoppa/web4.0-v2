import { TvodHero } from "@/components/sections/tvod-hero";
import { TvodCatalog } from "@/components/sections/tvod-catalog";
import { Footer } from "@/components/layout/footer";

export default function EntertainmentMainPage() {
  return (
    <main id="main-content" className="min-h-dvh">

      <section id="tvod" aria-labelledby="tvod-heading" className="scroll-mt-24 lg:scroll-mt-40">
        <h2 id="tvod-heading" className="sr-only">
          TVOD — Түрээслэх кино
        </h2>
        <TvodHero />
        <TvodCatalog />
      </section>

      <Footer />
    </main>
  );
}
