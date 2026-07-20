"use client";

import { useCallback, useEffect, useState } from "react";

import { companyGoals, customerGoals, type ConceptGoal } from "@/data/web4-concept";
import { cn } from "@/lib/utils";

/**
 * Web 4.0 концепцийн bubble deck (/web4).
 *
 * Байгууллагын зорилтууд (зүүн) + хэрэглэгчийн хэрэгцээ (баруун) нь гэрэлт
 * бөмбөлөг болж хөвнө → бүгд төв рүү нийлж нэг Web 4.0 бөмбөлөг болно →
 * төгсгөлд "бидний үүрэг + хэрэглэгчийн хүчин чармайлтыг багасгах" мессеж.
 *
 * Bubble дээр hover/tap хийхэд тухайн зорилтын дэлгэрэнгүй items доор гарна.
 */

type SceneId = "intro" | "company" | "customers" | "merge" | "closing";

type Scene = {
  id: SceneId;
  eyebrow: string;
  eyebrowTone: "green" | "cyan" | "muted";
  title: string;
  sub: string;
};

const SCENES: Scene[] = [
  {
    id: "intro",
    eyebrow: "Юнител · Юнивишн",
    eyebrowTone: "muted",
    title: "Web 4.0-ийг хэрхэн бүтээх вэ?",
    sub: "Байгууллагын зорилго, хэрэглэгчийн хэрэгцээ — хоёул нэг бөмбөлөг болж нийлэхэд Web 4.0 бүтнэ.",
  },
  {
    id: "company",
    eyebrow: "Company",
    eyebrowTone: "green",
    title: "Бид юуг зорьдог вэ?",
    sub: "Байгууллагын стратегийн зорилтууд. Бөмбөлөг дээр дарж дэлгэрэнгүйг үзнэ үү.",
  },
  {
    id: "customers",
    eyebrow: "Customers",
    eyebrowTone: "cyan",
    title: "Хэрэглэгч юу хүсдэг вэ?",
    sub: "Хэрэглэгчийн үндсэн хэрэгцээ. Хоёр тал одоо зэрэгцэн харагдана.",
  },
  {
    id: "merge",
    eyebrow: "Нэгдэл",
    eyebrowTone: "muted",
    title: "Бүгд нийлээд Web 4.0",
    sub: "Байгууллагын зорилго ба хэрэглэгчийн хэрэгцээ нэг цэгт нийлж, нэгдсэн дижитал экосистем болно.",
  },
  {
    id: "closing",
    eyebrow: "Бидний үүрэг",
    eyebrowTone: "muted",
    title: "Web 4.0 бол бидний үүрэг",
    sub: "Цаашид хэрэглэгчийн хүчин чармайлтыг багасгах дээр тасралтгүй ажиллана.",
  },
];

// Bubble-ийн home байрлал — company зүүн, customer баруун талд босоо тархана
function homePos(side: "company" | "customer", i: number) {
  const y = 15 + i * 17; // 15,32,49,66,83
  const x =
    side === "company" ? 22 + (i % 2) * 8 : 78 - (i % 2) * 8; // 22/30 · 78/70
  return { x, y };
}

export function Web4Deck() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const scene = SCENES[sceneIdx];
  const isLast = sceneIdx === SCENES.length - 1;

  const go = useCallback((i: number) => {
    setOpenId(null);
    const n = SCENES.length;
    setSceneIdx(((i % n) + n) % n);
  }, []);
  const next = useCallback(() => go(isLast ? 0 : sceneIdx + 1), [go, isLast, sceneIdx]);
  const prev = useCallback(() => {
    if (sceneIdx > 0) go(sceneIdx - 1);
  }, [go, sceneIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Идэвхтэй зорилтын items (hover/tap) — байвал sub-ийн оронд харагдана
  const openGoal =
    openId != null
      ? [...companyGoals, ...customerGoals].find((g) => g.id === openId)
      : undefined;

  const coreOn = scene.id === "merge" || scene.id === "closing";
  const companyLabelOn = scene.id === "company" || scene.id === "customers";
  const customerLabelOn = scene.id === "customers";

  return (
    <div
      className="relative h-[calc(100vh-3rem)] min-h-[600px] w-full overflow-hidden bg-[radial-gradient(1200px_800px_at_70%_-10%,#10233f_0%,transparent_55%),radial-gradient(1000px_700px_at_15%_110%,#0c2a24_0%,transparent_55%),linear-gradient(160deg,#0a1424,#05080f)]"
      onClick={next}
      role="group"
      aria-label="Web 4.0 концепцийн танилцуулга"
    >
      {/* Starfield */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.5), transparent), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,.35), transparent), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,.4), transparent), radial-gradient(1.5px 1.5px at 90% 60%, rgba(255,255,255,.4), transparent), radial-gradient(1px 1px at 10% 75%, rgba(255,255,255,.3), transparent)",
        }}
      />

      {/* COMPANY / CUSTOMERS багана толгойнууд */}
      <span
        className={cn(
          "pointer-events-none absolute top-[6%] left-[22%] -translate-x-1/2 text-sm font-bold tracking-[0.28em] text-white/70 uppercase transition-opacity duration-700 md:text-base",
          companyLabelOn ? "opacity-100" : "opacity-0",
        )}
      >
        Company
      </span>
      <span
        className={cn(
          "pointer-events-none absolute top-[6%] right-[22%] translate-x-1/2 text-sm font-bold tracking-[0.28em] text-white/70 uppercase transition-opacity duration-700 md:text-base",
          customerLabelOn ? "opacity-100" : "opacity-0",
        )}
      >
        Customers
      </span>

      {/* Bubbles */}
      <div className="absolute inset-0">
        {companyGoals.map((g, i) => (
          <Bubble
            key={g.id}
            goal={g}
            side="company"
            index={i}
            scene={scene.id}
            open={openId === g.id}
            onToggle={() => setOpenId((cur) => (cur === g.id ? null : g.id))}
          />
        ))}
        {customerGoals.map((g, i) => (
          <Bubble
            key={g.id}
            goal={g}
            side="customer"
            index={i}
            scene={scene.id}
            open={openId === g.id}
            onToggle={() => setOpenId((cur) => (cur === g.id ? null : g.id))}
          />
        ))}
      </div>

      {/* Core — нэгдсэн Web 4.0 бөмбөлөг */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 z-10 grid aspect-square w-[min(46vmin,360px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-center transition-all duration-1000 ease-out",
          coreOn ? "scale-100 opacity-100" : "scale-0 opacity-0",
          coreOn && "web4-pulse",
        )}
        style={{
          background:
            "radial-gradient(circle at 32% 24%, rgba(255,255,255,.9), rgba(255,255,255,.14) 20%, transparent 40%), radial-gradient(circle at 72% 78%, rgba(42,212,255,.5), transparent 60%), radial-gradient(circle at 40% 62%, rgba(69,199,10,.55), transparent 62%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.06), rgba(4,10,18,.4) 92%)",
        }}
      >
        <div>
          <div className="text-[10px] font-bold tracking-[0.3em] text-white/75 uppercase md:text-xs">
            Нэгдсэн платформ
          </div>
          <div className="mt-1 bg-gradient-to-r from-[#7dfa5a] to-[#8becff] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
            Web 4.0
          </div>
        </div>
      </div>

      {/* Caption */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 z-20 w-[min(92vw,900px)] -translate-x-1/2 text-center",
          scene.id === "intro" || coreOn ? "top-1/2 -translate-y-1/2" : "top-[12%]",
        )}
      >
        <p
          className={cn(
            "text-xs font-bold tracking-[0.32em] uppercase md:text-sm",
            scene.eyebrowTone === "green" && "text-[#7dfa5a]",
            scene.eyebrowTone === "cyan" && "text-[#8becff]",
            scene.eyebrowTone === "muted" && "text-white/55",
          )}
        >
          {scene.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-white md:text-6xl">
          {scene.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-balance text-white/70 md:text-lg">
          {openGoal ? (
            <>
              <span className="font-semibold text-white">{openGoal.label}:</span>{" "}
              {openGoal.items.join(" · ")}
            </>
          ) : (
            scene.sub
          )}
        </p>
      </div>

      {/* Hint */}
      <p
        className={cn(
          "pointer-events-none absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 text-xs tracking-wide text-white/40 transition-opacity duration-500",
          sceneIdx === 0 ? "opacity-100" : "opacity-0",
        )}
      >
        → товч эсвэл дэлгэц дээр дарж үргэлжлүүлнэ үү
      </p>

      {/* HUD */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 p-5 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2.5">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Слайд ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === sceneIdx ? "w-7 bg-[#7dfa5a]" : "w-2.5 bg-white/25 hover:bg-white/40",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-2 text-xs text-white/50 tabular-nums">
            {sceneIdx + 1} / {SCENES.length}
          </span>
          <button
            type="button"
            onClick={prev}
            disabled={sceneIdx === 0}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/12 disabled:opacity-35"
          >
            ← Өмнөх
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex h-10 items-center gap-1 rounded-full bg-[#45c700] px-4 text-sm font-semibold text-[#06210a] transition-colors hover:bg-[#7dfa5a]"
          >
            {isLast ? "Дахин ↺" : "Дараах →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Bubble — нэг зорилтын гэрэлт бөмбөлөг
// =====================================================================
function Bubble({
  goal,
  side,
  index,
  scene,
  open,
  onToggle,
}: {
  goal: ConceptGoal;
  side: "company" | "customer";
  index: number;
  scene: SceneId;
  open: boolean;
  onToggle: () => void;
}) {
  const pos = homePos(side, index);

  // Харагдах эсэх
  let visible = false;
  const merged = scene === "merge";
  if (scene === "company") visible = side === "company";
  else if (scene === "customers") visible = true;

  const dur = 6 + (index % 4) * 1.3 + (side === "customer" ? 1.5 : 0);
  const delay = index * 0.4 + (side === "customer" ? 0.6 : 0);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={goal.label}
      className="absolute z-[6] block -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none"
      style={{
        left: merged ? "50%" : `${pos.x}%`,
        top: merged ? "50%" : `${pos.y}%`,
        width: "clamp(96px, 15vmin, 150px)",
        height: "clamp(96px, 15vmin, 150px)",
        transform: merged
          ? "translate(-50%, -50%) scale(0.1)"
          : visible
            ? `translate(-50%, -50%) scale(${open ? 1.12 : 1})`
            : "translate(-50%, -50%) scale(0)",
        opacity: merged ? 0 : visible ? 1 : 0,
        transition:
          "left .9s cubic-bezier(.65,0,.35,1), top .9s cubic-bezier(.65,0,.35,1), transform .8s cubic-bezier(.34,1.4,.5,1), opacity .7s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <span
        className="web4-drift relative grid h-full w-full place-items-center rounded-full border border-white/15 p-[12%] text-center"
        style={{
          animationName: "web4-drift",
          animationDuration: `${dur.toFixed(1)}s`,
          animationDelay: `-${delay.toFixed(1)}s`,
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,.85), rgba(255,255,255,.12) 22%, transparent 42%), radial-gradient(circle at 68% 74%, ${goal.color}88, transparent 62%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.06), rgba(4,10,18,.35) 90%)`,
          boxShadow: `inset 0 0 34px rgba(255,255,255,.18), inset -8px -12px 26px rgba(0,0,0,.4), 0 22px 50px rgba(0,0,0,.5), 0 0 46px ${goal.color}66`,
        }}
      >
        {/* Гялгар highlight */}
        <span
          aria-hidden="true"
          className="absolute top-[12%] left-[20%] h-[24%] w-[34%] rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgba(255,255,255,.75), transparent)",
            filter: "blur(1px)",
            transform: "rotate(-18deg)",
          }}
        />
        <span className="relative z-[1] text-[clamp(12px,1.7vmin,15px)] leading-tight font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,.45)]">
          {goal.label}
        </span>
      </span>
    </button>
  );
}
