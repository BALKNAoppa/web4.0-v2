import type { Locale } from "@/lib/locale";

import { en } from "./en";
import { ja } from "./ja";
import { ko } from "./ko";
import { zh } from "./zh";

/**
 * ЖИШЭЭ ОРЧУУЛГЫН ТОЛЬ — түлхүүр нь МОНГОЛ ЭХ БИЧВЭР.
 *
 * ⚠️ ЯАГААД түлхүүр нь `"nav.home"` мэт БИШ, монгол өгүүлбэр өөрөө вэ:
 * `components/i18n/sample-translator.tsx` нь DOM дээрх бичвэрийг ОЛЖ сольдог
 * тул толь нь дэлгэц дээр ЯГ ЮУ харагдаж байгаагаар түлхүүрлэгдэх ёстой.
 * Ингэснээр 127 файлын нэгийг ч засахгүйгээр бүх дата орчуулагдана.
 *
 * ⚠️ ТИЙМЭЭС МОНГОЛ ЭХ БИЧВЭР ӨӨРЧЛӨГДВӨЛ ТОЛЬ ЧИМЭЭГҮЙ УНТАРНА. Дата дээр
 * "Санал болгох багц" гэдгийг "Санал болгох багцууд" болговол тэр мөр бүх
 * хэл дээр монголоороо үлдэнэ — алдаа заахгүй. Доорх `missing()` туслах нь
 * танилцуулгын өмнө шалгахад зориулагдсан.
 *
 * ⚠️ Монгол нь эх хэл тул толь БАЙХГҮЙ (орчуулга хэрэггүй).
 */
export const MESSAGES: Partial<Record<Locale, Record<string, string>>> = {
  en,
  ko,
  zh,
  ja,
};

/**
 * Толинд ДУТУУ мөрүүд — зөвхөн хөгжүүлэлтэд. Хөтчийн console дээр
 * `__i18nMissing()` гэж дуудвал дэлгэц дээрх орчуулагдаагүй монгол мөрийг
 * жагсаана (`layout.tsx` -д холбогдоно).
 */
export function missingFor(locale: Locale, seen: string[]): string[] {
  const dict = MESSAGES[locale];
  if (!dict) return [];
  return seen.filter((s) => !dict[s]);
}
