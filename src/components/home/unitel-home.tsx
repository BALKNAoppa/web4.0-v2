import { MobilePlans } from "@/components/sections/mobile-plans";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { Faq } from "@/components/sections/faq";
import { unitelEntryTiles } from "@/data/home";
import { unitelFaqCategories } from "@/data/faq";

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

      <Faq categories={unitelFaqCategories} />
    </>
  );
}
