"use client";

import { cn } from "@/lib/utils";

/**
 * IridescentBubble — цэвэр CSS-ээр хийсэн солонгон (soap) bubble.
 * Зураг/видео ашиглахгүй тул хөнгөн, light/dark theme хоёуланд ажиллана.
 * Хэмжээг эцэг element-ийн width-ээс авна (aspect-square).
 *
 * Хөдөлгөөн:
 *  - .bubble-float (эцэг wrapper дээр) — бүхэлдээ зөөлөн дээш доош хөвнө
 *  - .bubble-spin / .bubble-spin-rev — дотоод солонгон film/rim аажим эргэнэ
 * reduced-motion үед бүх хөдөлгөөн зогсоно (globals.css-ийн global дүрэм).
 */

// Дотоод солонгон хальс (film) — зөөлөн пастел спектр
const FILM =
  "conic-gradient(from 200deg, #ff9ec4, #c9a3ff, #8ec5ff, #7ef0d6, #d8f59a, #ffd59e, #ff9ec4)";
// Ирмэгийн тод солонгон зурвас (rim) — илүү ханасан өнгө
const RIM = "conic-gradient(from 0deg, #ff5fa2, #7c5cff, #38bdf8, #34d399, #f0abfc, #ff5fa2)";
// Rim-ийг зөвхөн ирмэгт нимгэн зурвас болгон хязгаарлах mask
const RIM_MASK = "radial-gradient(circle, transparent 60%, #000 66%, #000 73%, transparent 80%)";

export function IridescentBubble({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div aria-hidden className={cn("relative aspect-square", className)} style={style}>
      {/* Гадна зөөлөн туяа — dark theme дээр bloom, light дээр бүдэг */}
      <div
        className="absolute inset-[-12%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(126,240,214,.28), rgba(140,197,255,.22) 45%, transparent 70%)",
        }}
      />

      {/* Бөмбөлөг өөрөө */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          boxShadow:
            "inset 0 0 40px rgba(255,255,255,.18), inset -18px -22px 60px rgba(40,20,70,.18), 0 30px 80px rgba(0,0,0,.18)",
        }}
      >
        {/* Солонгон хальс — аажим эргэнэ */}
        <div
          className="bubble-spin absolute inset-[-8%] rounded-full"
          style={{ background: FILM, opacity: 0.5, filter: "blur(8px)" }}
        />
        {/* Эзэлхүүн / тунгалаг суурь (төв тунгалаг, ирмэг рүү бага сүүдэр) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, rgba(255,255,255,.06) 0%, transparent 42%, rgba(120,90,160,.07) 72%, rgba(20,10,40,.10) 92%)",
          }}
        />
        {/* Ирмэгийн тод солонгон зурвас — эсрэг тийш аажим эргэнэ */}
        <div
          className="bubble-spin-rev absolute inset-0 rounded-full"
          style={{
            background: RIM,
            opacity: 0.75,
            filter: "blur(1px)",
            WebkitMaskImage: RIM_MASK,
            maskImage: RIM_MASK,
          }}
        />
        {/* Гол цайвар туяа (specular highlight) — зүүн дээд */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 26%, rgba(255,255,255,.95), rgba(255,255,255,.35) 12%, transparent 34%)",
          }}
        />
        {/* Жижиг тусгал — баруун доод */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 72% 78%, rgba(255,255,255,.5), transparent 11%)",
          }}
        />
      </div>
    </div>
  );
}
