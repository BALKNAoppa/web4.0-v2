"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * GlowRing — CSS + бага зэрэг JS-ээр хийсэн олон хөдөлгөөнт гэрэлт цагираг.
 * Видео/зураг ашиглахгүй. Бараан дэвсгэр дээр хамгийн гоё.
 *
 *  1) Нимгэн тод цагираг дээгүүр тод цэг (hotspot) тойрон эргэлдэнэ (харагдахуйц).
 *  2) Том зөөлөн орбууд random байрлал руу удаан хөвнө.
 *  3) Жижиг гэрэлт цэгүүд random байрлалд шилжиж анивчина.
 *
 * reduced-motion үед бүх хөдөлгөөн зогсоно.
 */

// Нимгэн цагирган зурвас (mask) — нарийхан, тод
const RING_BAND = "radial-gradient(circle, transparent 59.3%, #000 60%, #000 60.6%, transparent 61.4%)";
// Hotspot-ийн зөөлөн гэрэлтэлт (өргөн зурвас, blur-тэй)
const RING_BLOOM = "radial-gradient(circle, transparent 56%, #000 60.5%, transparent 66%)";
// Бүтэн цагирагийн бүдэг суурь гэрэл
const BASE_RING =
  "conic-gradient(from 0deg, rgba(150,190,255,0.14), rgba(190,215,255,0.28) 50%, rgba(150,190,255,0.14))";
// Тод төвлөрсөн цэг (эргэлдэхэд харагдана)
const HOTSPOT =
  "conic-gradient(from 0deg, transparent 0deg 290deg, rgba(200,225,255,0.85) 335deg, #ffffff 356deg, transparent 360deg)";

// SSR-safe эхний байрлал (hydration mismatch-аас сэргийлж deterministic)
const ORBS_INIT = [
  { x: 28, y: 32, s: 240 },
  { x: 68, y: 40, s: 190 },
  { x: 48, y: 68, s: 280 },
];
const SPARKS_INIT = [
  { x: 30, y: 55 },
  { x: 62, y: 26 },
  { x: 74, y: 62 },
  { x: 42, y: 42 },
  { x: 55, y: 78 },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function GlowRing({ className }: { className?: string }) {
  const [orbs, setOrbs] = useState(() => ORBS_INIT.map((o) => ({ ...o, op: 0.3 })));
  const [sparks, setSparks] = useState(() => SPARKS_INIT.map((s) => ({ ...s, op: 0.4 })));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Хөдөлгөөн 2 — том орбууд random байрлал руу удаан хөвнө
    const orbTimer = window.setInterval(() => {
      setOrbs((prev) => prev.map((o) => ({ ...o, x: rand(12, 88), y: rand(15, 85), op: rand(0.2, 0.5) })));
    }, 3800);

    // Хөдөлгөөн 3 — жижиг цэгүүд random байрлал + анивчилт
    const sparkTimer = window.setInterval(() => {
      setSparks((prev) => prev.map((s) => ({ ...s, x: rand(8, 92), y: rand(10, 90), op: rand(0.15, 0.9) })));
    }, 1500);

    return () => {
      window.clearInterval(orbTimer);
      window.clearInterval(sparkTimer);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* ── Цагираг (төвлөрсөн) ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Бүдэг суурь цагираг (тогтмол, нимгэн) */}
        <div
          className="absolute aspect-square w-[min(150vw,880px)] rounded-full"
          style={{
            background: BASE_RING,
            WebkitMaskImage: RING_BAND,
            maskImage: RING_BAND,
            filter: "blur(0.5px)",
          }}
        />
        {/* Тод эргэлддэг hotspot (харагдахуйц хөдөлгөөн) */}
        <div
          className="ring-spin absolute aspect-square w-[min(150vw,880px)] rounded-full"
          style={{
            background: HOTSPOT,
            WebkitMaskImage: RING_BAND,
            maskImage: RING_BAND,
            filter: "blur(1.5px)",
          }}
        />
        {/* Hotspot-ийн зөөлөн гэрэл (мөн эргэлдэнэ) */}
        <div
          className="ring-spin absolute aspect-square w-[min(150vw,880px)] rounded-full opacity-60"
          style={{
            background: HOTSPOT,
            WebkitMaskImage: RING_BLOOM,
            maskImage: RING_BLOOM,
            filter: "blur(16px)",
          }}
        />
      </div>

      {/* ── Хөдөлгөөн 2: random хөвөгч орбууд ── */}
      {orbs.map((o, i) => (
        <div
          key={`orb-${i}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: o.s,
            height: o.s,
            opacity: o.op,
            background: "radial-gradient(circle, rgba(120,170,255,0.8), transparent 70%)",
            transition: "left 3.8s ease-in-out, top 3.8s ease-in-out, opacity 3.8s ease-in-out",
          }}
        />
      ))}

      {/* ── Хөдөлгөөн 3: random анивчих гэрэлт цэгүүд ── */}
      {sparks.map((s, i) => (
        <div
          key={`spark-${i}`}
          className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.op,
            background: "#eaf2ff",
            boxShadow: "0 0 8px 2px rgba(200,225,255,0.85)",
            transition: "left 1.5s ease-in-out, top 1.5s ease-in-out, opacity 1.5s ease-in-out",
          }}
        />
      ))}
    </div>
  );
}
