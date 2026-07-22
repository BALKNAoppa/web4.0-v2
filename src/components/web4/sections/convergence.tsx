"use client";

import { useEffect, useRef, useState } from "react";
import { companyGoals, customerGoals, type ConceptGoal } from "@/data/web4-concept";
import { SPHERE_BG, SPHERE_SHADOW } from "@/components/web4/sphere";
import { cn } from "@/lib/utils";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Илүү тод/солид bubble — SPHERE_BG highlight дээр нь тунгалаг бус ногоон бие.
const BUBBLE_BG = `${SPHERE_BG}, radial-gradient(circle at 50% 46%, #1e6344 0%, #0f3327 70%, #0a241b 100%)`;

function homePos(side: "company" | "customer", i: number) {
  const y = 30 + i * 12; // 30 … 78 (дэлгэц дээр арай доош)
  const x = side === "company" ? 21 + (i % 2) * 7 : 79 - (i % 2) * 7;
  return { x, y };
}

// Алхам бүрийн зорилтот progress: 0 = company, 1 = customers, 2 = merge.
const STEP_TARGET = [0.22, 0.52, 1];

/**
 * Web 4.0 нийлэл — presentation fragment логик:
 * сум дарах бүрд `step` нэмэгдэж, company → customers → merge гэж өрнөнө.
 * Bubble дээр дарахад тухайн зорилтын дэлгэрэнгүй жагсаалт гарч ирнэ.
 */
export function Convergence({
  active = false,
  step = 0,
}: {
  active?: boolean;
  step?: number;
}) {
  const [p, setP] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const pRef = useRef(0);

  // `p`-г алхам солигдох бүрд зорилтот утга руу зөөлөн tween хийнэ.
  useEffect(() => {
    if (!active) {
      setP(0);
      pRef.current = 0;
      setOpenId(null);
      return;
    }
    const target = STEP_TARGET[Math.min(step, STEP_TARGET.length - 1)];
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      pRef.current = target;
      setP(target);
      return;
    }
    const from = pRef.current;
    const dur = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = from + (target - from) * eased;
      pRef.current = v;
      setP(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, step]);

  // Алхам солигдоход нээлттэй дэлгэрэнгүйг хаана.
  useEffect(() => {
    setOpenId(null);
  }, [step]);

  const convergeC = clamp((p - 0.6) / 0.3);
  const coreC = clamp((p - 0.62) / 0.3);
  const phase = p < 0.26 ? "A" : p < 0.58 ? "B" : "C";

  const caption = {
    A: {
      eyebrow: "Company intent",
      title: "Бид юуг зорьдог вэ?",
      sub: "Бөмбөлөг дээр дарж дэлгэрэнгүйг үзээрэй.",
    },
    B: {
      eyebrow: "Customer intent",
      title: "Хэрэглэгч юу хүсдэг вэ?",
      sub: "Бид хэрэглэгчийн хэрэгцээг үргэлж хангахыг зорино.",
    },
    C: {
      eyebrow: "Convergence",
      title: "Хоёулаа нэг Web 4.0 болж нийлнэ",
      sub: "Компанийн зорилго + хэрэглэгчийн хэрэгцээ = нэгдсэн дижитал ecosystem.",
    },
  }[phase];

  const openGoal =
    openId != null
      ? [...companyGoals, ...customerGoals].find((g) => g.id === openId)
      : undefined;

  return (
    <section id="intent" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Opaque cosmic stage — hides the bubble background behind the merge */}
      <div className="absolute inset-0 bg-[radial-gradient(1000px_700px_at_50%_32%,#10233f_0%,transparent_60%),linear-gradient(160deg,#0a1424,#05080f)]" />

      {/* column labels */}
      <span
        className="pointer-events-none absolute top-[8%] left-[21%] -translate-x-1/2 text-sm font-extrabold tracking-[0.28em] text-white uppercase transition-opacity duration-500 md:text-2xl"
        style={{ opacity: phase !== "C" ? 1 : 0 }}
      >
        Company
      </span>
      <span
        className="pointer-events-none absolute top-[8%] right-[21%] translate-x-1/2 text-sm font-extrabold tracking-[0.28em] text-white uppercase transition-opacity duration-500 md:text-2xl"
        style={{ opacity: phase === "B" ? 1 : 0 }}
      >
        Customers
      </span>

      {/* bubbles */}
      {companyGoals.map((g, i) => (
        <Bubble
          key={g.id}
          goal={g}
          side="company"
          index={i}
          p={p}
          convergeC={convergeC}
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
          p={p}
          convergeC={convergeC}
          open={openId === g.id}
          onToggle={() => setOpenId((cur) => (cur === g.id ? null : g.id))}
        />
      ))}

      {/* Web 4.0 core — big & centered */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 z-10 grid aspect-square w-[min(58vmin,480px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-center",
          coreC > 0.5 && "web4-pulse",
        )}
        style={{
          transform: `translate(-50%,-50%) scale(${coreC})`,
          opacity: coreC,
          background: SPHERE_BG,
          boxShadow: SPHERE_SHADOW,
        }}
      >
        <div>
          <div className="text-[10px] font-bold tracking-[0.3em] text-white/75 uppercase md:text-xs">
            Unified platform
          </div>
          <div className="mt-1 bg-gradient-to-r from-[#7dfa5a] to-[#8becff] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
            Web 4.0
          </div>
        </div>
      </div>

      {/* eyebrow + title — дээд талд */}
      <div className="pointer-events-none absolute inset-x-0 top-[7%] z-20 mx-auto w-[min(92vw,820px)] px-6 text-center">
        <p className="text-xs font-bold tracking-[0.32em] text-[#7dfa5a] uppercase md:text-sm">
          {caption.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
          {caption.title}
        </h2>
      </div>

      {/* Bubble дэлгэрэнгүй — төвд */}
      {openGoal && (
        <div className="animate-in fade-in zoom-in-95 pointer-events-none absolute top-1/2 left-1/2 z-30 w-[min(92vw,620px)] -translate-x-1/2 -translate-y-1/2 px-6 text-center duration-300">
          <p className="bg-gradient-to-r from-[#7dfa5a] to-[#8becff] bg-clip-text text-xl font-extrabold text-transparent md:text-3xl">
            {openGoal.label}
          </p>
          <ul className="mt-5 flex flex-col items-center gap-2.5">
            {openGoal.items.map((it) => (
              <li
                key={it}
                className="flex items-center justify-center gap-2.5 text-base text-white/85 md:text-xl"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-[#7dfa5a]" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* sub — доод талд (дэлгэрэнгүй нээлттэй үед нуух) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[14%] z-20 mx-auto w-[min(92vw,600px)] px-6 text-center transition-opacity duration-300"
        style={{ opacity: openGoal ? 0 : 1 }}
      >
        <p className="text-sm text-balance text-white/65 md:text-lg">
          {caption.sub}
        </p>
      </div>
    </section>
  );
}

function Bubble({
  goal,
  side,
  index,
  p,
  convergeC,
  open,
  onToggle,
}: {
  goal: ConceptGoal;
  side: "company" | "customer";
  index: number;
  p: number;
  convergeC: number;
  open: boolean;
  onToggle: () => void;
}) {
  const home = homePos(side, index);

  const start = side === "company" ? 0.02 + index * 0.03 : 0.26 + index * 0.03;
  const enter = clamp((p - start) / 0.12);

  const x = lerp(home.x, 50, convergeC);
  const y = lerp(home.y, 50, convergeC);
  // Байрлал/scale-г `p`-tween (rAF) шууд удирдана — CSS transition нэмэхгүй
  // (эс тэгвээс frame бүрийн шинэчлэлтэй зөрчилдөж smear болно).
  const scale = enter * lerp(1, 0.12, convergeC);
  const opacity = enter * (1 - convergeC);
  const interactive = enter > 0.6 && convergeC < 0.08;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={goal.label}
      className="absolute z-[6] block -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "clamp(88px, 14.4vmin, 140px)",
        height: "clamp(88px, 14.4vmin, 140px)",
        transform: `translate(-50%,-50%) scale(${scale})`,
        opacity,
        pointerEvents: interactive ? "auto" : "none",
        willChange: "transform, opacity, left, top",
      }}
    >
      {/* Дарахад цойлох pop зөвхөн энэ давхаргад (p-tween-д нөлөөлөхгүй) */}
      <span
        className="grid h-full w-full place-items-center rounded-full border border-white/20 p-[13%] text-center"
        style={{
          background: BUBBLE_BG,
          boxShadow: SPHERE_SHADOW,
          transform: `scale(${open ? 1.12 : 1})`,
          transition: "transform .45s cubic-bezier(.34,1.4,.5,1)",
        }}
      >
        <span className="text-[clamp(12px,1.8vmin,15px)] leading-tight font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,.85)]">
          {goal.label}
        </span>
      </span>
    </button>
  );
}
