"use client";

import { cn } from "@/lib/utils";

/**
 * GlowRing — минимал, theme-aware гэрэлт цагираг (chat-hero-ийн ард).
 * Зөвхөн нэг нимгэн цагираг + зөөлөн эргэлддэг hotspot. Random нааш цааш
 * хөвөгч орб/анивчих цэг байхгүй (minimal, "ялаа" эффект хассан).
 * Өнгө нь light/dark theme-ээс хамаарч globals.css доторх --hero-ring-*
 * хувьсагчаар автоматаар солигдоно. reduced-motion үед эргэлт зогсоно
 * (globals.css-ийн global дүрэм).
 */

// Нимгэн цагирган зурвас (mask) — нарийхан, тод
const RING_BAND =
  "radial-gradient(circle, transparent 59.3%, #000 60%, #000 60.6%, transparent 61.4%)";
// Hotspot-ийн зөөлөн гэрэлтэлт (өргөн зурвас, blur-тэй)
const RING_BLOOM = "radial-gradient(circle, transparent 56%, #000 60.5%, transparent 66%)";

export function GlowRing({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* ── Цагираг (төвлөрсөн, минимал) ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Бүдэг суурь цагираг (тогтмол, нимгэн) */}
        <div
          className="absolute aspect-square w-[min(150vw,880px)] rounded-full"
          style={{
            background: "var(--hero-ring-base)",
            WebkitMaskImage: RING_BAND,
            maskImage: RING_BAND,
            filter: "blur(0.5px)",
          }}
        />
        {/* Зөөлөн эргэлддэг hotspot (харагдахуйц, гэхдээ гентле) */}
        <div
          className="ring-spin absolute aspect-square w-[min(150vw,880px)] rounded-full"
          style={{
            background: "var(--hero-ring-hotspot)",
            WebkitMaskImage: RING_BAND,
            maskImage: RING_BAND,
            filter: "blur(1.5px)",
          }}
        />
        {/* Hotspot-ийн зөөлөн гэрэл (мөн эргэлдэнэ) */}
        <div
          className="ring-spin absolute aspect-square w-[min(150vw,880px)] rounded-full opacity-60"
          style={{
            background: "var(--hero-ring-hotspot)",
            WebkitMaskImage: RING_BLOOM,
            maskImage: RING_BLOOM,
            filter: "blur(16px)",
          }}
        />
      </div>
    </div>
  );
}
