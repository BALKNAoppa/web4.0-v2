"use client";

import { useSyncExternalStore } from "react";

/**
 * Header (болон нүүр хуудас) хоёрын хуваалцах header-хувилбарын store.
 *   1 = Only L1 · 2 = L1 & L2
 * localStorage-д хадгална; toggle сонголтод бүх subscriber шинэчлэгдэнэ.
 *
 * ⚠️ Өмнө нь 3 (доод tab bar) ба 4 (chat нүүр) байсныг ХАССАН. Тэдгээрийн
 * код бүрэн устсан тул localStorage-д "3"/"4" үлдсэн хэрэглэгч 1 рүү унана
 * (доорх `getSnapshot`) — цагаан дэлгэц гарахгүй.
 */
export type HeaderVariant = 1 | 2;

const VARIANT_KEY = "uv-header-variant-new";
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
  // ЗӨВХӨН "2" нь 2 — бусад БҮХ утга (устгасан "3"/"4", хог, null) 1 рүү унана.
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
