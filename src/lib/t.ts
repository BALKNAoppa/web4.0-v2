"use client";

import { SOURCE_LOCALE, useLocale } from "@/lib/locale";
import { MESSAGES } from "@/messages";

export function useT(): (text: string) => string {
  const locale = useLocale();
  const dict = locale === SOURCE_LOCALE ? null : MESSAGES[locale];
  return (text: string) => dict?.[text] ?? text;
}
