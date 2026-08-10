import { UnivisionPlansBanner } from "@/components/sections/univision-plans-banner";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { TrustOrbit } from "@/components/sections/trust-orbit";
import { Promotions } from "@/components/sections/promotions";
import { AppPromo } from "@/components/sections/app-promo";
import { univisionEntryTiles } from "@/data/home";
import { univisionGoApp } from "@/data/app-promo";

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

      {/* Univision GO app — QR + store badge (entry tile-тай зориуд давхардуулсан).
          `AppPromo` нь Unitel-ийн апп section-тэй НЭГ компонент — зөвхөн data өөр. */}
      <AppPromo content={univisionGoApp} />

      {/* Тусламжийн блок ("Танд тусламж хэрэгтэй юу?") нүүрнээс ХАСАГДСАН.
          `Faq` компонент болон /support хуудас хэвээр байгаа тул хэрэгтэй
          үед энд буцааж нэмж болно. */}
    </>
  );
}
