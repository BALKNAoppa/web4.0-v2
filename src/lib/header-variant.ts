"use client";

import { useSyncExternalStore } from "react";

/**
 * Header (болон нүүр хуудас) хоёрын хуваалцах header-хувилбарын store.
 *   1 = ШИЛЭН КАПСУЛ (хуучин загвар, ЖИШИГ) · 2 = ХАВТГАЙ 2 давхарга + dock
 *
 * ⚠️ ЗӨВХӨН МОБАЙЛЫГ ЛЭ ЯЛГАНА. Desktop дээр хоёр хувилбар нь ЯГ ИЖИЛ
 * (`header.tsx > LogoLeftHeader`) — 2026-09-14-нд захиалагч desktop-ийн
 * батлагдсан хувилбарыг сонгож, бусдыг нь хассан.
 *
 * ⚠️⚠️ ДУГААРЛАЛТ 2026-09-14-НД ХОЁР УДАА ӨӨРЧЛӨГДСӨН:
 *   ① Хуучин мобайл хувилбар 1 (header дээрх ангиллын мөр + таб dropdown)
 *      БҮРМӨСӨН ХАСАГДАЖ, үлдсэн хоёр нь урагшаа шилжив:
 *          хуучин 2 (доод dock) → 1 · хуучин 3 (burger drawer) → 2
 *   ② Тэр өдрийн орой захиалагч ХОЁУЛАНГ НЬ СОЛИВ ("хувилбар 1-ийн хувилбар
 *      2 болгоод хувилбар 2-г хувилбар 1 болго"):
 *          ①-ийн 1 (хавтгай · Layer 2 · dock) → ЭЦСИЙН 2
 *          ①-ийн 2 (шилэн капсул)             → ЭЦСИЙН 1
 * ⇒ ЭЦСИЙН 1 нь ХУУЧИН загвар (хөндөхгүй жишиг), ЭЦСИЙН 2 нь ШИНЭ загвар
 *   (09-14-ны бүх засвар түүн дээр).
 *
 * ⚠️ ТИЙМЭЭС `VARIANT_KEY` СОЛИЛТ БҮРТ ШИНЭ НЭРТЭЙ. Хуучин түлхүүрийг
 * үлдээвэл танилцуулга үзсэн хүний localStorage-д сууж байгаа "2" нь ӨӨР
 * хувилбарыг заана — тэр хүн нэгийг хүлээж байтал нөгөө нь нээгдэнэ. Шинэ
 * түлхүүр нь бүгдийг ХУВИЛБАР 1-ЭЭС эхлүүлнэ.
 */
export type HeaderVariant = 1 | 2;

const VARIANT_KEY = "uv-header-variant-2026-09-14b";
const VARIANT_EVENT = "uv-header-variant-new-change";

function subscribe(cb: () => void) {
  window.addEventListener(VARIANT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(VARIANT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): HeaderVariant {
  // "2" нь өөрөө — бусад БҮХ утга (хог, null) 1 рүү унана.
  return window.localStorage.getItem(VARIANT_KEY) === "2" ? 2 : 1;
}

/** SSR-д үргэлж 1 — client дээр localStorage-оос уншина. */
function getServerSnapshot(): HeaderVariant {
  return 1;
}

export function useHeaderVariant(): HeaderVariant {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setHeaderVariant(v: HeaderVariant) {
  window.localStorage.setItem(VARIANT_KEY, String(v));
  window.dispatchEvent(new Event(VARIANT_EVENT));
}
