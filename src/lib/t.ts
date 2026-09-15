"use client";

import { SOURCE_LOCALE, useLocale } from "@/lib/locale";
import { MESSAGES } from "@/messages";

/**
 * КОМПОНЕНТ ДОТОРХ бичвэрийг орчуулах hook.
 *
 * ⚠️ Ихэнх бичвэрт ЭНЭ ХЭРЭГГҮЙ — `components/i18n/sample-translator.tsx` нь
 * DOM дээрх бэлэн бичвэрийг өөрөө олж сольдог. Энэ hook нь ЗӨВХӨН
 * ДИНАМИКААР УГСРАГДСАН мөрөнд хэрэгтэй, тухайлбал:
 *     aria-label={`Хэл — одоо ${locale}`}
 * Ийм мөр нь толины түлхүүртэй ХЭЗЭЭ Ч яг таарахгүй (сүүлийн хэсэг нь
 * хувьсдаг) тул орчуулагч алгасна. Хэсгүүдийг ТУСАД НЬ орчуулаад эндээс
 * угсарна.
 *
 * ⚠️ Толинд байхгүй мөрийг монголоор нь буцаана — хоосон талбай гарахгүй.
 */
export function useT(): (text: string) => string {
  const locale = useLocale();
  const dict = locale === SOURCE_LOCALE ? null : MESSAGES[locale];
  return (text: string) => dict?.[text] ?? text;
}
