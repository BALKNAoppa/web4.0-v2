import { MobilePlans } from "@/components/sections/mobile-plans";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { AppPromo } from "@/components/sections/app-promo";
import { unitelEntryTiles } from "@/data/home";
import { unitelApp } from "@/data/app-promo";

/**
 * Unitel нүүрний hero доорх хэсэг — зөвхөн Unitel-ийн бүтээгдэхүүн,
 * үйлчилгээ. Univision-ы контент энд ОРОХГҮЙ (тухайн брэнд өөрийн сайттай).
 *
 * `Promotions` (cashback) нь Univision-д харьяалагдах тул энд ОРООГҮЙ.
 * Unitel-ийн өөрийн урамшууллын контент гарахаар энд нэмнэ.
 *
 * ЧУХАЛ: Fragment буцаана — `<div>` ороолгож БОЛОХГҮЙ. SectionSnapScroller
 * нь `#main-content > section` гэж шууд хүүхдийг хайдаг.
 */
export function UnitelHome() {
  return (
    <>
      {/* Үндсэн бүтээгдэхүүн — Мобайл · Дараа төлбөрт */}
      <MobilePlans />

      {/* Гэр интернэт, олон улсын үйлчилгээ, урьдчилсан төлбөрт, TourSim */}
      <ProductEntryGrid tiles={unitelEntryTiles} />

      {/* Unitel апп — QR + store badge. Univision GO-гийн section-тэй НЭГ
          компонент (`AppPromo`), зөвхөн data өөр.
          Өмнө нь энд текст шигтгэсэн нэг зураг (`Group 38072.png`) байсныг
          сольсон: гарчиг, тайлбар, badge бүгд HTML болсон тул орчуулагдана,
          screen reader уншина, жижиг дэлгэцэнд текст нь бүдгэрэхгүй. */}
      <AppPromo content={unitelApp} />

      {/* Тусламжийн блок ("Танд тусламж хэрэгтэй юу?") нүүрнээс ХАСАГДСАН.
          `Faq` компонент болон /support хуудас хэвээр байгаа тул хэрэгтэй
          үед энд буцааж нэмж болно. */}
    </>
  );
}
