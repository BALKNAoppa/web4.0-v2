import { MobilePlans } from "@/components/sections/mobile-plans";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { WideImageBanner } from "@/components/sections/wide-image-banner";
import { unitelEntryTiles } from "@/data/home";

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

      {/* Unitel апп санал болгох бүтэн өргөнтэй зурвас.
          Эх файл `Group 38072.png` (Figma export) -ын дээд/доод ирмэг дээр
          1px тод ногоон зураас (#4ffc13 — frame-ийн stroke) шигдсэн байсан.
          Тиймээс ирмэгийг нь тайруулсан `unitel-app-banner.png` (1920×477)
          -г ашиглана. Эх файлыг хэвээр үлдээв.
          alt — зураг дотор утга агуулсан текст байгаа тул заавал (WCAG 1.1.1). */}
      <WideImageBanner
        src="/unitel-app-banner.png"
        alt="Бүх үйлчилгээг Unitel аппаас: Юнител, Юнивишний төлбөр төлөх, нэгж, дата авах болон бусад үйлчилгээ. Апп нь App Store болон Google Play дээр байна."
        width={1920}
        height={477}
      />

      {/* Тусламжийн блок ("Танд тусламж хэрэгтэй юу?") нүүрнээс ХАСАГДСАН.
          `Faq` компонент болон /support хуудас хэвээр байгаа тул хэрэгтэй
          үед энд буцааж нэмж болно. */}
    </>
  );
}
