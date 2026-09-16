import { MobilePlans } from "@/components/sections/mobile-plans";
import { ProductEntryGrid } from "@/components/sections/product-entry-grid";
import { AppPromo } from "@/components/sections/app-promo";
import { unitelEntryTiles } from "@/data/home";
import { unitelApp } from "@/data/app-promo";

export function UnitelHome() {
  return (
    <>
      {}
      <MobilePlans />

      {}
      <ProductEntryGrid tiles={unitelEntryTiles} />

      {
}
      <AppPromo content={unitelApp} />

      {
}
    </>
  );
}
