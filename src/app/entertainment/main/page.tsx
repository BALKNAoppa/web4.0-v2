import { TvodHero } from "@/components/sections/tvod-hero";
import { TvodCatalog } from "@/components/sections/tvod-catalog";
import { Footer } from "@/components/layout/footer";
// import { Breadcrumb } from "@/components/layout/breadcrumb";

export default function EntertainmentMainPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* <Breadcrumb
        items={[
          { label: "Энтертайнмент" },
          { label: "TVOD" },
        ]}
      /> */}

      <section id="tvod" aria-labelledby="tvod-heading" className="scroll-mt-24">
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
