import type { Locale } from "@/lib/locale";

import { en } from "./en";
import { ja } from "./ja";
import { ko } from "./ko";
import { zh } from "./zh";

export const MESSAGES: Partial<Record<Locale, Record<string, string>>> = {
  en,
  ko,
  zh,
  ja,
};

export function missingFor(locale: Locale, seen: string[]): string[] {
  const dict = MESSAGES[locale];
  if (!dict) return [];
  return seen.filter((s) => !dict[s]);
}
