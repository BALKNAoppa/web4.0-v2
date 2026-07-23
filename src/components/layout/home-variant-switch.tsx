"use client";

import { type ReactNode } from "react";

import { useHeaderVariant } from "@/lib/header-variant";

/**
 * Нүүрний layout-г header toggle-ийн хувилбараар сонгоно.
 *   Хувилбар 4 → chat-hero нүүр, бусад → энгийн нүүр.
 * SSR-д server snapshot = 1 тул энгийн нүүр гарч, client дээр localStorage-оос
 * Хувилбар 4 бол chat-hero руу зөөлөн солигдоно (useSyncExternalStore).
 */
export function HomeVariantSwitch({
  defaultHome,
  chatHome,
}: {
  defaultHome: ReactNode;
  chatHome: ReactNode;
}) {
  const variant = useHeaderVariant();
  return <>{variant === 4 ? chatHome : defaultHome}</>;
}
