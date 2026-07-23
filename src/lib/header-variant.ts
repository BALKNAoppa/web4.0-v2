"use client";

import { useSyncExternalStore } from "react";

/**
 * Header (болон нүүр хуудас) хоёрын хуваалцах header-хувилбарын store.
 *   1 = Apple · 2 = Business line · 3 = Hybrid · 4 = Chat (chat-hero нүүр)
 * localStorage-д хадгална; toggle сонголтод бүх subscriber шинэчлэгдэнэ.
 */
export type HeaderVariant = 1 | 2 | 3 | 4;

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
  const v = window.localStorage.getItem(VARIANT_KEY);
  return v === "2" ? 2 : v === "3" ? 3 : v === "4" ? 4 : 1;
}

/** SSR-д үргэлж 1 (Apple + энгийн нүүр) — client дээр localStorage-оос уншина. */
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
