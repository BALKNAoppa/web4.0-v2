"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAccessibility } from "./accessibility-provider";

/**
 * ⚠️⚠️ ТҮР УНТРААСАН (2026-09-10, захиалагч: "одоо tab дарах үед гарч ирж
 * байгаа accessibility-г түр хугацаанд унтраа, Unitel Univision аль алин
 * дээр нь"). Энэ файл `layout.tsx`-д mount хийгдсэн хэвээр — зөвхөн энэ
 * ганц тогтмолыг `true` болгоход БҮРЭН сэргэнэ, өөр юу ч хөндөгдөөгүй.
 *
 * ⚠️ ЮУ АЛДАГДАЖ БАЙГАА НЬ: эхний Tab дээр "Үндсэн агуулга руу очих"
 * гэсэн skip link гардаг байсан нь WCAG 2.4.1 (Bypass Blocks) -ийн
 * шаардлага. Түүнгүйгээр гарын хэрэглэгч header-ийн бүх линкийг дамжиж
 * байж үндсэн агуулгад хүрнэ. Танилцуулга дууссаны дараа `true` болгоно.
 *
 * `#main-content` id ба `AccessibilityPanel` хоёр ХЭВЭЭР — панелийг
 * хөвөгч товчоороо нээх боломж алдагдаагүй.
 */
const SKIP_LINKS_ENABLED = false;

export function AccessibilitySkipLinks() {
  const { setOpen } = useAccessibility();
  const [visible, setVisible] = React.useState(false);
  const hasInterceptedRef = React.useRef(false);
  const firstRef = React.useRef<HTMLAnchorElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Унтраасан үед Tab-ыг ОГТ СОНСОХГҮЙ — `preventDefault` хийхгүй тул
    // фокус хэвийн, дараагийн элемент рүү шууд шилжинэ.
    if (!SKIP_LINKS_ENABLED) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || e.shiftKey) return;
      if (hasInterceptedRef.current) return;

      const active = document.activeElement as HTMLElement | null;
      const insideGroup = !!(active && containerRef.current?.contains(active));
      if (insideGroup) return;

      const isFormElement =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.isContentEditable);
      if (isFormElement) return;

      e.preventDefault();
      hasInterceptedRef.current = true;
      setVisible(true);
      requestAnimationFrame(() => firstRef.current?.focus());
    };

    const onMouse = () => {
      hasInterceptedRef.current = false;
      setVisible(false);
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
        hasInterceptedRef.current = false;
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keydown", onEsc);
    window.addEventListener("mousedown", onMouse);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("mousedown", onMouse);
    };
  }, []);

  const linkClass =
    "inline-flex items-center gap-2 rounded-b-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg ring-1 ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  // ⚠️ DOM-д ОГТ РЕНДЕРЛЭХГҮЙ (зөвхөн нуухгүй): нуугдсан ч tab-order-т үлдэж,
  // Tab дарахад "хаа нэгтээ" фокус алга болсон мэт мэдрэгдэнэ.
  if (!SKIP_LINKS_ENABLED) return null;

  return (
    <div
      ref={containerRef}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setVisible(false);
        }
      }}
      className={cn(
        "fixed top-0 left-40 z-60 flex gap-2 transition-transform duration-200 ease-out",
        visible ? "translate-y-0" : "pointer-events-none -translate-y-full",
      )}
    >
      <a ref={firstRef} href="#main-content" className={linkClass}>
        Үндсэн агуулга руу очих
      </a>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          hasInterceptedRef.current = false;
          setOpen(true);
        }}
        className={linkClass}
      >
        <Image
          src="/accessibility.svg"
          alt=""
          width={18}
          height={18}
          className="size-4.5 shrink-0"
        />
        Тусгай хэрэгцээний тохиргоо
      </button>
    </div>
  );
}
