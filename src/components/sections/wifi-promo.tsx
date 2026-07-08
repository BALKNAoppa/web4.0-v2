"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { wifiOptions, wifiSection, type WifiOption } from "@/data/wifi-options";

export function WifiPromo() {
  const [selectedId, setSelectedId] = useState(wifiOptions[0].id);
  const selected = wifiOptions.find((o) => o.id === selectedId) ?? wifiOptions[0];

  return (
    <section aria-labelledby="wifi-title" className="bg-background py-6 lg:py-11">
      <div className="container mx-auto px-4">
        {/* Section гарчиг */}
        <div className="mb-10 text-center">
          <span className="text-foreground text-sm font-semibold tracking-wider uppercase">
            {wifiSection.eyebrow}
          </span>
          <h2 id="wifi-title" className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {wifiSection.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base md:text-lg">
            {wifiSection.descriptionPrefix}
            <span className="text-foreground font-semibold">
              {wifiSection.descriptionHighlight}
            </span>
            {wifiSection.descriptionSuffix}
          </p>
        </div>

        {/* ============ STEP 1: Apartment сонгох (4 card) ============ */}
        <div
          role="radiogroup"
          aria-label="Сууцны хэмжээгээ сонгоно уу"
          className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {wifiOptions.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={option.id === selectedId}
              onSelect={() => setSelectedId(option.id)}
            />
          ))}
        </div>

        {/* ============ STEP 2: Dynamic preview ============ */}
        <div className="bg-card grid overflow-hidden rounded-2xl border shadow-sm lg:min-h-[460px] lg:grid-cols-3">
          {/* Зүүн (2/3) — Building illustration */}
          <div className="relative aspect-4/3 bg-[#0A1E5C] lg:col-span-2 lg:aspect-auto">
            <BuildingIllustration variant={selected.illustration} />
          </div>

          {/* Баруун (1/3) — Apartment-ийн дэлгэрэнгүй (төв тэгшилсэн) */}
          <div className="flex flex-col items-center justify-between gap-6 p-8 text-center lg:p-10">
            {/* Title */}
            <h3 className="text-2xl font-bold tracking-tight">{selected.name}</h3>

            {/* Device visualization */}
            <DeviceVisualization
              meshCount={selected.meshCount}
              hasOverflow={selected.hasOverflow}
            />

            {/* Description */}
            <p className="text-foreground max-w-xs text-sm leading-relaxed">
              {selected.previewText}
            </p>

            {/* CTA — outlined */}
            <Link
              href={wifiSection.ctaHref}
              className="border-primary text-primary hover:bg-primary/5 inline-flex h-11 items-center justify-center gap-2 rounded-md border-2 px-6 text-sm font-semibold transition-colors"
            >
              {wifiSection.ctaText}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// OPTION CARD — Radio with pulse animation
// =====================================================================
function OptionCard({
  option,
  isSelected,
  onSelect,
}: {
  option: WifiOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`group focus-visible:ring-ring relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      }`}
    >
      {/* Radio circle with pulse */}
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        {/* Outer ring */}
        <span
          className={`absolute inset-0 rounded-full border-2 transition-colors ${
            isSelected ? "border-primary" : "border-muted-foreground/40"
          }`}
        />
        {/* Inner dot — pulse animation хийнэ */}
        {isSelected && (
          <>
            {/* Pulse ring (ping effect) */}
            <span className="bg-primary absolute inline-flex size-3 animate-ping rounded-full opacity-60" />
            {/* Solid dot */}
            <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
          </>
        )}
      </span>

      {/* Label + description */}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold">{option.name}</h4>
        <p className="text-muted-foreground mt-0.5 text-xs">{option.description}</p>
      </div>
    </button>
  );
}

// =====================================================================
// DEVICE VISUALIZATION — баруун талын төв хэсэг (HGW + Mesh)
// =====================================================================
function DeviceVisualization({
  meshCount,
  hasOverflow,
}: {
  meshCount: number;
  hasOverflow?: boolean;
}) {
  return (
    <div className="flex items-end justify-center gap-3">
      {/* HGW — Гол төхөөрөмж */}
      <HgwDevice />

      {meshCount > 0 && (
        <>
          <span
            className="text-muted-foreground self-center text-2xl font-light"
            aria-hidden="true"
          >
            +
          </span>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              {Array.from({ length: meshCount }).map((_, i) => (
                <MeshPuck key={i} />
              ))}
            </div>
            <span className="text-muted-foreground text-[10px] font-medium tracking-wide">
              Mesh
            </span>
          </div>

          {hasOverflow && (
            <div
              className="bg-muted text-muted-foreground flex h-[44px] w-9 items-center justify-center self-center rounded-full text-base font-bold"
              aria-hidden="true"
            >
              …
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** HGW — Гол төхөөрөмж (өндөр, нарийхан, антенна-маягийн LED цэгтэй) */
function HgwDevice() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative w-8 rounded-full bg-white shadow-md ring-1 ring-black/10"
        style={{ height: 88 }}
        aria-hidden="true"
      >
        {/* LED статус цэг — оройд */}
        <span className="bg-primary absolute top-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full" />
        {/* Доод эх үүсвэрийн порт — жижиг саарал зураас */}
        <span className="bg-foreground/15 absolute bottom-3 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full" />
      </div>
      <span className="text-foreground text-[10px] font-semibold tracking-wide">Home Gateaway</span>
    </div>
  );
}

/** Mesh — Нэмэлт WLAN-Box (өргөн, бахарам жижиг puck) */
function MeshPuck() {
  return (
    <div
      className="relative h-7 w-10 rounded-2xl bg-white shadow-sm ring-1 ring-black/10"
      aria-hidden="true"
    >
      {/* Жижиг WiFi indicator — slot хэлбэртэй */}
      <span className="absolute top-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-sky-400/70" />
      <span className="bg-foreground/15 absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full" />
    </div>
  );
}

// =====================================================================
// BUILDING ILLUSTRATION — SVG (apartment бүрд өөр, Swisscom-style sketch)
// Clean cross-section + 3D-маягийн цагаан pill device + radial glow +
// animated цэнхэр ripple-ууд (SMIL animation).
// =====================================================================
function BuildingIllustration({ variant }: { variant: WifiOption["illustration"] }) {
  return (
    <svg
      viewBox="0 0 600 400"
      className="absolute inset-0 size-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Глобал defs — radial glow gradient (бүх device хуваалцаж ашиглана) */}
      <defs>
        <radialGradient id="wifi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#3B82F6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {variant === "studio" && <StudioBuilding />}
      {variant === "small" && <SmallBuilding />}
      {variant === "medium" && <MediumBuilding />}
      {variant === "house" && <HouseBuilding />}
    </svg>
  );
}

// =====================================================================
// WIFI DEVICE — Swisscom-style цагаан pill + glow + ripples
// `clipId` өгөгдсөн бол radial glow/ripple-ууд тухайн орон сууцны
// хэрээнд clip-дэгдэж "айлын дотор" хязгаарлагдсан байдалтай харагдана.
// =====================================================================
function WifiDevice({
  x,
  y,
  glowRadius = 80,
  clipId,
  kind = "hgw",
}: {
  x: number;
  y: number;
  glowRadius?: number;
  clipId?: string;
  kind?: "hgw" | "mesh";
}) {
  const center = { cx: x, cy: y - (kind === "hgw" ? 13 : 3) };
  const rippleStart = 6;
  const rippleEnd = glowRadius;
  const clipAttr = clipId ? `url(#${clipId})` : undefined;

  return (
    <g>
      {/* Glow + ripples — clip-path-аар орон сууцны хэрээнд хязгаарлагдсан */}
      <g clipPath={clipAttr}>
        {/* Static soft glow */}
        <circle cx={center.cx} cy={center.cy} r={glowRadius} fill="url(#wifi-glow)" />

        {/* Animated ripples — 3 шат, тус бүр 1.4с-н зайтай эхэлнэ */}
        {[0, 1.4, 2.8].map((delay, i) => (
          <circle
            key={i}
            cx={center.cx}
            cy={center.cy}
            r={rippleStart}
            fill="none"
            stroke="#93C5FD"
            strokeWidth="1.4"
            opacity="0"
          >
            <animate
              attributeName="r"
              from={rippleStart}
              to={rippleEnd}
              dur="4.2s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.85;0"
              dur="4.2s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* === Device body === */}
      {kind === "hgw" ? (
        // HGW — Гол төхөөрөмж — өндөр, нарийхан pill, ноогоон LED цэгтэй
        <g>
          {/* Pill body */}
          <rect
            x={x - 4}
            y={y - 26}
            width="8"
            height="26"
            rx="4"
            ry="4"
            fill="#FFFFFF"
            stroke="#0A1E5C"
            strokeWidth="0.4"
          />
          {/* Ноогоон LED цэг (right panel-той ижил primary color) */}
          <circle cx={x} cy={y - 22} r="1.3" fill="#22C55E" />
          {/* Доод порт зураас */}
          <rect
            x={x - 2}
            y={y - 4.5}
            width="4"
            height="0.8"
            rx="0.3"
            fill="rgba(10,30,92,0.3)"
          />
          {/* Зогсох суурь shadow */}
          <ellipse cx={x} cy={y + 1.5} rx="6" ry="1.5" fill="rgba(255,255,255,0.5)" />
        </g>
      ) : (
        // MESH — өргөн жижиг puck
        <g>
          {/* Puck body */}
          <rect
            x={x - 6}
            y={y - 8}
            width="12"
            height="9"
            rx="3"
            ry="3"
            fill="#FFFFFF"
            stroke="#0A1E5C"
            strokeWidth="0.4"
          />
          {/* Цэнхэр WiFi slot */}
          <rect
            x={x - 3}
            y={y - 6}
            width="6"
            height="0.9"
            rx="0.4"
            fill="#0EA5E9"
            opacity="0.75"
          />
          {/* Доод цэг */}
          <circle cx={x} cy={y - 2.5} r="0.7" fill="rgba(10,30,92,0.3)" />
          {/* Зогсох суурь shadow */}
          <ellipse cx={x} cy={y + 1.5} rx="7" ry="1.3" fill="rgba(255,255,255,0.5)" />
        </g>
      )}
    </g>
  );
}

// =====================================================================
// APARTMENT GRID — Тал бүхэн ижил background building (3 floor × N col),
// зөвхөн highlight-сан apartment-ыг тод stroke + цэнхэр fill-ээр зурна.
// Бусад өрөөнүүд faint outline-тай "хөршүүд" болж харагдана.
// =====================================================================
type ApartmentRect = {
  /** Apartment-ыг бүрдүүлэх олон cell (row,col зэрэг) */
  cells: { row: number; col: number }[];
};

function ApartmentBuilding({
  columns,
  apartment,
  devices,
  clipId,
}: {
  columns: number;
  apartment: ApartmentRect;
  /** Орон сууцны дотор байрлах device-уудын байршил (apartment-ын дотор normalized 0..1) */
  devices: { ax: number; ay: number; glowRadius?: number }[];
  clipId: string;
}) {
  const ROWS = 3;
  const stroke = "rgba(255,255,255,0.32)";
  const strokeBright = "rgba(255,255,255,0.95)";

  // Building bbox (viewBox 600x400)
  const BX = 90;
  const BY = 70;
  const BW = 420;
  const BH = 280;
  const roomW = BW / columns;
  const roomH = BH / ROWS;

  // Apartment hull — cells -> bounding box
  const minRow = Math.min(...apartment.cells.map((c) => c.row));
  const maxRow = Math.max(...apartment.cells.map((c) => c.row));
  const minCol = Math.min(...apartment.cells.map((c) => c.col));
  const maxCol = Math.max(...apartment.cells.map((c) => c.col));
  const aX = BX + minCol * roomW;
  const aY = BY + minRow * roomH;
  const aW = (maxCol - minCol + 1) * roomW;
  const aH = (maxRow - minRow + 1) * roomH;

  const isInApt = (row: number, col: number) =>
    apartment.cells.some((c) => c.row === row && c.col === col);

  return (
    <g>
      {/* clipPath — apartment-ын дотор сигнал багтаах */}
      <defs>
        <clipPath id={clipId}>
          <rect x={aX} y={aY} width={aW} height={aH} />
        </clipPath>
      </defs>

      {/* Roof overhang */}
      <line x1={BX - 12} y1={BY} x2={BX + BW + 12} y2={BY} stroke={stroke} strokeWidth="1.3" />

      {/* Building shell */}
      <rect x={BX} y={BY} width={BW} height={BH} fill="none" stroke={stroke} strokeWidth="1" />

      {/* === Faint background — apartment-ын ГАДУУР л өрөөнүүд === */}
      {Array.from({ length: ROWS }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          if (isInApt(row, col)) return null; // apartment-ын дотор faint cell зурахгүй
          const rx = BX + col * roomW;
          const ry = BY + row * roomH;
          return (
            <g key={`r-${row}-${col}`}>
              <rect
                x={rx}
                y={ry}
                width={roomW}
                height={roomH}
                fill="none"
                stroke={stroke}
                strokeWidth="1"
              />
              {/* Цонх — жижиг хос frame-тэй (sash-style) */}
              <rect
                x={rx + roomW * 0.2}
                y={ry + roomH * 0.2}
                width={roomW * 0.6}
                height={roomH * 0.6}
                fill="none"
                stroke={stroke}
                strokeWidth="0.9"
              />
              <line
                x1={rx + roomW * 0.5}
                y1={ry + roomH * 0.2}
                x2={rx + roomW * 0.5}
                y2={ry + roomH * 0.8}
                stroke={stroke}
                strokeWidth="0.7"
              />
            </g>
          );
        }),
      )}

      {/* Floor base */}
      <line
        x1={BX - 10}
        y1={BY + BH}
        x2={BX + BW + 10}
        y2={BY + BH}
        stroke={stroke}
        strokeWidth="1.3"
      />

      {/* ============================================================ */}
      {/*  HIGHLIGHTED APARTMENT — нэг айлын гэр                       */}
      {/* ============================================================ */}

      {/* Soft blue fill — нэг айлын дотоод */}
      <rect x={aX} y={aY} width={aW} height={aH} fill="#1E40AF" fillOpacity="0.38" />

      {/* Apartment perimeter — тод stroke */}
      <rect
        x={aX}
        y={aY}
        width={aW}
        height={aH}
        fill="none"
        stroke={strokeBright}
        strokeWidth="1.7"
      />

      {/* Interior wall(s) with door gap — apartment-ыг өрөөнүүд болгож хуваана */}
      {apartment.cells.length > 1 &&
        Array.from({ length: maxCol - minCol }).map((_, i) => {
          const wx = aX + (i + 1) * roomW;
          const wallTop = aY + 2;
          const wallBottom = aY + aH - 2;
          // Үүдний завсар — apartment-ын доод 38%-ийг хоосон үлдээх
          const doorTop = aY + aH * 0.45;
          const doorJamb = aY + aH - 8;
          return (
            <g key={`iw-${i}`}>
              {/* Хананы дээд хэсэг (door header) */}
              <line
                x1={wx}
                y1={wallTop}
                x2={wx}
                y2={doorTop}
                stroke={strokeBright}
                strokeOpacity="0.85"
                strokeWidth="1.1"
              />
              {/* Доод jamb — үүдний босгоны хэсэг */}
              <line
                x1={wx}
                y1={doorJamb}
                x2={wx}
                y2={wallBottom}
                stroke={strokeBright}
                strokeOpacity="0.85"
                strokeWidth="1.1"
              />
              {/* Үүдний хүрээний жижиг арми */}
              <line
                x1={wx - 8}
                y1={doorTop}
                x2={wx}
                y2={doorTop}
                stroke={strokeBright}
                strokeOpacity="0.7"
                strokeWidth="1"
              />
              <line
                x1={wx}
                y1={doorTop}
                x2={wx + 8}
                y2={doorTop}
                stroke={strokeBright}
                strokeOpacity="0.7"
                strokeWidth="1"
              />
            </g>
          );
        })}

      {/* Apartment-ын цонхнууд — тод stroke, өрөө бүрд */}
      {apartment.cells.map(({ row, col }) => {
        const rx = BX + col * roomW;
        const ry = BY + row * roomH;
        return (
          <g key={`hw-${row}-${col}`}>
            <rect
              x={rx + roomW * 0.2}
              y={ry + roomH * 0.2}
              width={roomW * 0.6}
              height={roomH * 0.6}
              fill="none"
              stroke={strokeBright}
              strokeOpacity="0.95"
              strokeWidth="1.2"
            />
            {/* Цонхны төв vertical sash */}
            <line
              x1={rx + roomW * 0.5}
              y1={ry + roomH * 0.2}
              x2={rx + roomW * 0.5}
              y2={ry + roomH * 0.8}
              stroke={strokeBright}
              strokeOpacity="0.85"
              strokeWidth="0.9"
            />
          </g>
        );
      })}

      {/* === Devices — эхнийх HGW, бусад Mesh === */}
      {devices.map((d, i) => {
        const dx = aX + d.ax * aW;
        const dy = aY + d.ay * aH;
        return (
          <WifiDevice
            key={i}
            x={dx}
            y={dy}
            glowRadius={d.glowRadius ?? Math.min(aW, aH) * 0.7}
            clipId={clipId}
            kind={i === 0 ? "hgw" : "mesh"}
          />
        );
      })}
    </g>
  );
}

// =====================================================================
// 1. STUDIO (Жижиг сууц, 1-3 өрөө, <90m²)
// Multi-unit building. Зөвхөн дунд давхрын дунд cell highlight, 1 device төвд.
// =====================================================================
function StudioBuilding() {
  return (
    <ApartmentBuilding
      columns={3}
      apartment={{ cells: [{ row: 1, col: 1 }] }}
      devices={[{ ax: 0.5, ay: 0.55 }]}
      clipId="studio-clip"
    />
  );
}

// =====================================================================
// 2. SMALL — `wifi-options.ts`-д "Том сууц" руу зурагдсан variant.
// Дунд давхрад 3 cell-ийг өргөтгөсөн том apartment, 1 HGW + 2 Mesh.
// =====================================================================
function SmallBuilding() {
  return (
    <ApartmentBuilding
      columns={3}
      apartment={{
        cells: [
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ],
      }}
      devices={[
        // HGW — төв өрөөнд (гол living room)
        { ax: 3 / 6, ay: 0.55 },
        // Mesh — зүүн өрөөнд
        { ax: 1 / 6, ay: 0.55 },
        // Mesh — баруун өрөөнд
        { ax: 5 / 6, ay: 0.55 },
      ]}
      clipId="small-clip"
    />
  );
}

// =====================================================================
// 3. MEDIUM (Дунд сууц, 4 өрөө) — 3 cell apartment, 2 device
// HGW төв өрөөнд (гол living room), Mesh баруун талын өрөөнд.
// Зүүн талын өрөө device-гүй — Mesh дутагдсан тохиолдлыг харуулна.
// =====================================================================
function MediumBuilding() {
  return (
    <ApartmentBuilding
      columns={3}
      apartment={{
        cells: [
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ],
      }}
      devices={[
        // HGW — төв өрөөнд (col 1 = 3/6 ax)
        { ax: 3 / 6, ay: 0.55 },
        // Mesh — баруун өрөөнд (col 2 = 5/6 ax)
        { ax: 5 / 6, ay: 0.55 },
      ]}
      clipId="medium-clip"
    />
  );
}

// =====================================================================
// 4. HOUSE (2-3 давхар, хувийн сууц) — sloped-roof house, 3 device
// =====================================================================
function HouseBuilding() {
  const stroke = "rgba(255,255,255,0.55)";
  const strokeBright = "rgba(255,255,255,0.95)";
  return (
    <g>
      {/* House outline-аар clipPath үүсгэе — ripple бүхэлдээ гэр дотор */}
      <defs>
        <clipPath id="house-clip">
          {/* Pitched roof triangle + main body */}
          <polygon points="90,200 300,80 510,200 510,360 90,360" />
        </clipPath>
      </defs>

      <g stroke={stroke} strokeWidth="1.1" fill="none" strokeLinejoin="round">
        {/* Гэрийн бүхэл fill — цэнхэр highlight */}
        <polygon points="90,200 300,80 510,200 510,360 90,360" fill="#1E40AF" fillOpacity="0.28" />

        {/* Pitched roof */}
        <polyline points="90,200 300,80 510,200" stroke={strokeBright} strokeWidth="1.6" />
        {/* Roof overhang */}
        <line x1="90" y1="200" x2="75" y2="208" stroke={strokeBright} strokeWidth="1.4" />
        <line x1="510" y1="200" x2="525" y2="208" stroke={strokeBright} strokeWidth="1.4" />

        {/* House body */}
        <rect x="115" y="200" width="370" height="160" stroke={strokeBright} strokeWidth="1.6" />

        {/* Floor divider */}
        <line x1="115" y1="280" x2="485" y2="280" stroke={strokeBright} strokeOpacity="0.6" />

        {/* Interior walls */}
        <line x1="207" y1="200" x2="207" y2="360" stroke={strokeBright} strokeOpacity="0.55" />
        <line x1="300" y1="200" x2="300" y2="360" stroke={strokeBright} strokeOpacity="0.55" />
        <line x1="393" y1="200" x2="393" y2="360" stroke={strokeBright} strokeOpacity="0.55" />

        {/* Attic windows */}
        <rect x="250" y="155" width="40" height="30" stroke={strokeBright} strokeOpacity="0.8" />
        <rect x="310" y="155" width="40" height="30" stroke={strokeBright} strokeOpacity="0.8" />

        {/* Top floor windows */}
        <rect x="135" y="220" width="55" height="45" stroke={strokeBright} strokeOpacity="0.8" />
        <rect x="225" y="220" width="60" height="45" stroke={strokeBright} strokeOpacity="0.8" />
        <rect x="318" y="220" width="60" height="45" stroke={strokeBright} strokeOpacity="0.8" />
        <rect x="411" y="220" width="55" height="45" stroke={strokeBright} strokeOpacity="0.8" />

        {/* Ground floor — door + windows */}
        <rect x="135" y="300" width="55" height="45" stroke={strokeBright} strokeOpacity="0.8" />
        <rect x="240" y="300" width="30" height="60" stroke={strokeBright} strokeOpacity="0.8" />
        <rect x="318" y="300" width="60" height="45" stroke={strokeBright} strokeOpacity="0.8" />
        <rect x="411" y="300" width="55" height="45" stroke={strokeBright} strokeOpacity="0.8" />

        {/* Ground line */}
        <line x1="105" y1="360" x2="495" y2="360" stroke={strokeBright} strokeWidth="1.4" />
      </g>

      {/* Devices — HGW (гал зуух/гол өрөө) + 2 Mesh (давхар тус бүр) */}
      <WifiDevice x={300} y={345} glowRadius={75} clipId="house-clip" kind="hgw" />
      <WifiDevice x={163} y={265} glowRadius={70} clipId="house-clip" kind="mesh" />
      <WifiDevice x={438} y={265} glowRadius={70} clipId="house-clip" kind="mesh" />
    </g>
  );
}
