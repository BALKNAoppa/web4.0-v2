import { UnivisionPlansBanner } from "@/components/sections/univision-plans-banner";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { TrustOrbit } from "@/components/sections/trust-orbit";
import { Promotions } from "@/components/sections/promotions";
import { UnivisionGoApp } from "@/components/sections/univision-go-app";
import { Faq } from "@/components/sections/faq";
import { HideOnVariant } from "@/components/layout/variant-gate";
import { univisionEntryTiles } from "@/data/home";
import { univisionFaqCategories } from "@/data/faq";

/**
 * Univision нүүрний hero доорх хэсэг — үндсэн багц, контент болон гэрийн
 * шийдэл. Unitel-ийн мобайл контент энд ОРОХГҮЙ.
 *
 * ЧУХАЛ: Fragment буцаана — `<div>` ороолгож БОЛОХГҮЙ. SectionSnapScroller
 * нь `#main-content > section` гэж шууд хүүхдийг хайдаг.
 */
export function UnivisionHome() {
  return (
    <>
      {/* Үндсэн бүтээгдэхүүн — M+, L+, XL+ */}
      <UnivisionPlansBanner />

      {/* Single internet, Univision Go, HBO Max, Mesh */}
      <ProductEntryGrid tiles={univisionEntryTiles} />

      {/* Найдвартай байдлын орбит */}
      <TrustOrbit />

      {/* Онцлох урамшуулал — Univision-ий апп, контентын cashback (3 карт) */}
      <Promotions />

      {/* Univision GO app — QR + store badge (entry tile-тай зориуд давхардуулсан) */}
      <UnivisionGoApp />

      {/* Тусламжийн блок — Хувилбар 2-т ХАРАГДАХГҮЙ: тэр хувилбарын footer
          өөрөө бүтэн "Тусламж" багана + 1200 блоктой тул давхардана. */}
      <HideOnVariant variants={[2]}>
        <Faq categories={univisionFaqCategories} />
      </HideOnVariant>
    </>
  );
}
