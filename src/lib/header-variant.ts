"use client";

import { useSyncExternalStore } from "react";

/**
 * Header (болон нүүр хуудас) хоёрын хуваалцах header-хувилбарын store.
 *   1 = ангиллын мөр (mobile L1) · 2 = доод navigation · 3 = burger drawer
 * localStorage-д хадгална; toggle сонголтод бүх subscriber шинэчлэгдэнэ.
 *
 * ⚠️ "3" нь ӨМНӨ БАЙСАН, ХАСАГДАЖ, ОДОО ӨӨР УТГААР ЭРГЭЖ ИРСЭН. Хуучин 3 нь
 * доод tab bar байсан (тэр нь одоо Хувилбар 2-ын хэсэг), шинэ 3 нь Swisscom
 * маягийн burger drawer. Хэрэглэгчийн localStorage-д хуучин "3" үлдсэн байвал
 * шинэ 3 рүү унана — цагаан дэлгэц гарахгүй, зөвхөн өөр хувилбар нээгдэнэ.
 * Мөн "4" (хуучин chat нүүр) нь 1 рүү унана.
 */
export type HeaderVariant = 1 | 2 | 3;

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
  // "2" ба "3" нь өөрсдөө — бусад БҮХ утга (устсан "4", хог, null) 1 рүү унана.
  const raw = window.localStorage.getItem(VARIANT_KEY);
  if (raw === "2") return 2;
  if (raw === "3") return 3;
  return 1;
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
