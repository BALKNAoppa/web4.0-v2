"use client";

import { useSyncExternalStore } from "react";

export const LOCALES = ["mn", "en", "ko", "zh", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

export const SOURCE_LOCALE: Locale = "mn";

export const LOCALE_LABEL: Record<Locale, { short: string; name: string }> = {
  mn: { short: "MN", name: "Монгол" },
  en: { short: "EN", name: "English" },
  ko: { short: "KO", name: "한국어" },
  zh: { short: "ZH", name: "中文" },
  ja: { short: "JA", name: "日本語" },
};

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
  }
  syncHtmlLang(next);
  window.dispatchEvent(new Event(EVENT));
}
