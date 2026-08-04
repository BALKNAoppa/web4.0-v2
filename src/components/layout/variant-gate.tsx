"use client";

import { type ReactNode } from "react";

import { useHeaderVariant, type HeaderVariant } from "@/lib/header-variant";

/**
 * Тухайн хувилбар(ууд) дээр хүүхдээ РЕНДЭРЛЭХГҮЙ жижиг хамгаалагч.
 *
 * Header-ийн toggle-ийн store-ыг хуваалцана (header/footer-той хамт солигдоно).
 * SSR-д store үргэлж 1 буцаадаг тул server дээр контент рендэрлэгдээд, client
 * дээр localStorage-оос уншаад нуугдана.
 *
 * ЧУХАЛ: Fragment буцаана — нэмэлт DOM зангилаа үүсгэхгүй. `SectionSnapScroller`
 * нь `#main-content > section` гэж ШУУД хүүхдийг хайдаг тул `<div>`-ээр
 * ороовол snap ажиллахаа болино.
 */
export function HideOnVariant({
  variants,
  children,
}: {
  variants: HeaderVariant[];
  children: ReactNode;
}) {
  const current = useHeaderVariant();
  if (variants.includes(current)) return null;
  return <>{children}</>;
}
