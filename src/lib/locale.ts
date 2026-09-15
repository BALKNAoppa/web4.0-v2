"use client";

import { useSyncExternalStore } from "react";

/**
 * ХЭЛНИЙ STORE — танилцуулгын 5 хэл.
 *
 * ⚠️⚠️ ЭНЭ НЬ ЖИШЭЭ ОРЧУУЛГА, ЖИНХЭНЭ i18n БИШ (2026-09-15, захиалагч:
 * "sample болохоор үүнээс цаашаа хөгжүүлэгдэхгүй байх … жишээ орчуулга
 * гэдгээрээ танилцуулъя"). Тиймээс ЗОРИУД дараах шийдвэрүүд авагдсан:
 *   · `[locale]` ROUTING ХИЙГЭЭГҮЙ — бүх хуудсыг `app/[locale]/…` рүү зөөвөл
 *     179 placeholder линк, `resolveHref`, брэнд хоорондын бүтэн хаягууд
 *     бүгд хэл мэддэг болох ёстой. Sample-д тэр эрсдэл шаардлагагүй.
 *   · Тиймээс хэл бүрд ТУСДАА URL БАЙХГҮЙ, SEO/hreflang ч байхгүй.
 *   · Төлөв нь браузерт (`localStorage`) — сервер мэдэхгүй.
 * ⇒ Жинхэнэ production i18n хийх болбол ЭНЭ ФАЙЛ БҮХЭЛДЭЭ ХАЯГДАНА;
 *   `next-intl` + `[locale]` segment дээр дахин баригдана.
 *
 * ⚠️ Хувилбарын store (`header-variant.ts`) -оос ЯЛГААТАЙ нь: тэр нь СЕРВЕР
 * дээр (бүх зочинд нэг), энэ нь ЗӨВХӨН тухайн браузерт. Учир нь хэл сонголт
 * нь ХЭРЭГЛЭГЧИЙНХ — танилцуулга үзэж буй хүн бүр өөрийнхөө хэлийг сонгоно.
 */
export const LOCALES = ["mn", "en", "ko", "zh", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

/** Түүхий эх хэл. Дата, компонент дахь бичвэр БҮГД монголоор бичигдсэн. */
export const SOURCE_LOCALE: Locale = "mn";

/**
 * Цэсэнд харагдах нэр — ТУХАЙН ХЭЛЭЭРЭЭ (endonym). "Japanese" гэж англиар
 * бичвэл япон хэрэглэгч өөрийнхөө мөрийг олоход удаан; "日本語" нь шууд
 * танигдана. `short` нь товчлуур дээрх 2 үсэг.
 */
export const LOCALE_LABEL: Record<Locale, { short: string; name: string }> = {
  mn: { short: "MN", name: "Монгол" },
  en: { short: "EN", name: "English" },
  ko: { short: "KO", name: "한국어" },
  zh: { short: "ZH", name: "中文" },
  ja: { short: "JA", name: "日本語" },
};

/** `<html lang>`-д тавих BCP-47 таг. Хайлт, дэлгэц уншигчид үүнийг уншина. */
export const LOCALE_TAG: Record<Locale, string> = {
  mn: "mn",
  en: "en",
  ko: "ko",
  zh: "zh-Hans",
  ja: "ja",
};

const KEY = "uv-locale-2026-09-15";
const EVENT = "uv-locale-change";

let current: Locale = SOURCE_LOCALE;
let hydrated = false;
const listeners = new Set<() => void>();

function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

/**
 * `<html>` дээрх хэлний тэмдэглэгээ. Хоёр зүйлийг зэрэг хариуцна:
 *   `lang`      — дэлгэц уншигч зөв дуудлагаар унших, хөтөч зөв таслах
 *   фонт сонголт — `globals.css` нь `html[lang^="ja"]` гэх мэтээр CJK фонт өгнө
 * (Manrope-д хятад/япон/солонгос үсэг БАЙХГҮЙ — тэр фонтоор орхивол хөтөч
 * системийн дурын фонтоор орлуулж, загвар бүрэн эвдэрнэ.)
 */
function syncHtmlLang(locale: Locale) {
  document.documentElement.lang = LOCALE_TAG[locale];
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    try {
      const saved = window.localStorage.getItem(KEY);
      if (isLocale(saved) && saved !== current) current = saved;
    } catch {
      // localStorage хориотой орчин — эх хэл дээрээ үлдэнэ
    }
    syncHtmlLang(current);
  }
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Locale {
  return current;
}

/** SSR-д ҮРГЭЛЖ монгол — HTML нь эх хэлээрээ гарч, client дээр солигдоно. */
function getServerSnapshot(): Locale {
  return SOURCE_LOCALE;
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setLocale(next: Locale) {
  if (next === current) return;
  current = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // хадгалагдахгүй ч тухайн session-д ажиллана
  }
  syncHtmlLang(next);
  window.dispatchEvent(new Event(EVENT));
}
