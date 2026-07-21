"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { companyGoals, customerGoals, type ConceptGoal } from "@/data/web4-concept";
import { brandHouses, brandTypes, type BrandType } from "@/data/brand-architecture";
import { cn } from "@/lib/utils";

/**
 * Web 4.0 танилцуулга (/web4) — хоёр бүлэг:
 *
 *  A) Brand architecture (нээлт) — брэндийн бүтцийн 2 философи, 4 төрөл.
 *     Төрөл бүрд эхлээд гадны (Google) жишээ, дараа нь өөрсдийн жишээ
 *     smooth fade-in-аар гарна.
 *  B) Bubble концепц — байгууллагын зорилт + хэрэглэгчийн хэрэгцээ нэг
 *     Web 4.0 бөмбөлөг болж нийлнэ.
 *
 * Нийт scene = 5 (brand) + 5 (bubble) = 10.
 */

type SceneId = "intro" | "company" | "customers" | "merge" | "closing";
type BubbleScene = {
  id: SceneId;
  eyebrow: string;
  eyebrowTone: "green" | "cyan" | "muted";
  title: string;
  sub: string;
};

// Brand architecture = 2 slide: (0) гадны жишээ, (1) swipe → манай жишээ
const BRAND_COUNT = 2;

const BUBBLE_SCENES: BubbleScene[] = [
  {
    id: "intro",
    eyebrow: "Unitel · Univision",
    eyebrowTone: "muted",
    title: "How do we build Web 4.0?",
    sub: "Company goals and customer needs — when both merge into one bubble, Web 4.0 comes to life.",
  },
  {
    id: "company",
    eyebrow: "Company",
    eyebrowTone: "green",
    title: "What do we aim for?",
    sub: "The company's strategic goals. Tap a bubble to see the details.",
  },
  {
    id: "customers",
    eyebrow: "Customers",
    eyebrowTone: "cyan",
    title: "What do customers want?",
    sub: "Customers' core needs. Both sides now appear side by side.",
  },
  {
    id: "merge",
    eyebrow: "Convergence",
    eyebrowTone: "muted",
    title: "Together, they become Web 4.0",
    sub: "Company goals and customer needs converge into one unified digital ecosystem.",
  },
  {
    id: "closing",
    eyebrow: "Our responsibility",
    eyebrowTone: "muted",
    title: "Web 4.0 is our responsibility",
    sub: "We keep working to minimize the effort our customers have to make.",
  },
];

const TOTAL = BRAND_COUNT + BUBBLE_SCENES.length;

// Bubble-ийн home байрлал — company зүүн, customer баруун талд босоо тархана.
function homePos(side: "company" | "customer", i: number) {
  const y = 25 + i * 13; // 25,38,51,64,77
  const x = side === "company" ? 22 + (i % 2) * 8 : 78 - (i % 2) * 8;
  return { x, y };
}

export function Web4Deck() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const mode: "brand" | "bubble" = sceneIdx < BRAND_COUNT ? "brand" : "bubble";
  const bubbleScene = mode === "bubble" ? BUBBLE_SCENES[sceneIdx - BRAND_COUNT] : null;
  const isLast = sceneIdx === TOTAL - 1;

  const go = useCallback((i: number) => {
    setOpenId(null);
    setSceneIdx(((i % TOTAL) + TOTAL) % TOTAL);
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

  const openGoal =
    openId != null
      ? [...companyGoals, ...customerGoals].find((g) => g.id === openId)
      : undefined;

  const coreOn = bubbleScene?.id === "merge" || bubbleScene?.id === "closing";
  const companyLabelOn = bubbleScene?.id === "company" || bubbleScene?.id === "customers";
  const customerLabelOn = bubbleScene?.id === "customers";

  return (
    <div
      className="relative h-[100dvh] min-h-[620px] w-full overflow-hidden bg-[radial-gradient(1200px_800px_at_70%_-10%,#10233f_0%,transparent_55%),radial-gradient(1000px_700px_at_15%_110%,#0c2a24_0%,transparent_55%),linear-gradient(160deg,#0a1424,#05080f)]"
      onClick={next}
      role="group"
      aria-label="Web 4.0 presentation"
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

      {/* ══════════ A. BRAND ARCHITECTURE ══════════ */}
      {mode === "brand" && (
        <div
          key={sceneIdx}
          className="animate-in fade-in absolute inset-0 z-20 flex items-center justify-center overflow-y-auto px-6 py-16 duration-700 ease-out"
        >
          {sceneIdx === 0 ? <PhilosophyIntro /> : <BrandBoard />}
        </div>
      )}

      {/* ══════════ B. BUBBLE КОНЦЕПЦ ══════════ */}
      {mode === "bubble" && bubbleScene && (
        <div className="animate-in fade-in absolute inset-0 duration-700 ease-out">
          {/* COMPANY / CUSTOMERS багана толгойнууд */}
          <span
            className={cn(
              "pointer-events-none absolute top-[5%] left-[22%] -translate-x-1/2 text-xl font-extrabold tracking-[0.28em] text-white uppercase transition-opacity duration-700 md:text-3xl",
              companyLabelOn ? "opacity-100" : "opacity-0",
            )}
          >
            Company
          </span>
          <span
            className={cn(
              "pointer-events-none absolute top-[5%] right-[22%] translate-x-1/2 text-xl font-extrabold tracking-[0.28em] text-white uppercase transition-opacity duration-700 md:text-3xl",
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
                scene={bubbleScene.id}
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
                scene={bubbleScene.id}
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
                Unified platform
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
              bubbleScene.id === "intro"
                ? "top-1/2 -translate-y-1/2"
                : coreOn
                  ? "top-[8%]"
                  : "top-[17%]",
            )}
          >
            <p
              className={cn(
                "text-xs font-bold tracking-[0.32em] uppercase md:text-sm",
                bubbleScene.eyebrowTone === "green" && "text-[#7dfa5a]",
                bubbleScene.eyebrowTone === "cyan" && "text-[#8becff]",
                bubbleScene.eyebrowTone === "muted" && "text-white/55",
              )}
            >
              {bubbleScene.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-white md:text-6xl">
              {bubbleScene.title}
            </h1>
            {!openGoal && (
              <p className="mx-auto mt-4 max-w-2xl text-base text-balance text-white/70 md:text-lg">
                {bubbleScene.sub}
              </p>
            )}
          </div>

          {/* Идэвхтэй зорилтын bullet items — дэлгэцийн голд */}
          {openGoal && (
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 text-center">
              <p
                className="text-lg font-bold tracking-tight md:text-2xl"
                style={{ color: openGoal.color }}
              >
                {openGoal.label}
              </p>
              <ul className="mt-4 flex flex-col items-center gap-2.5">
                {openGoal.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center justify-center gap-2.5 text-base text-white/85 md:text-xl"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: openGoal.color }}
                    />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Hint — эхний slide дээр */}
      <p
        className={cn(
          "pointer-events-none absolute bottom-[5.5rem] left-1/2 z-20 -translate-x-1/2 text-xs tracking-wide text-white/40 transition-opacity duration-500",
          sceneIdx === 0 ? "opacity-100" : "opacity-0",
        )}
      >
        → Click a button or anywhere on the screen to continue
      </p>

      {/* HUD */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 p-5 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === sceneIdx ? "w-6 bg-[#7dfa5a]" : "w-2 bg-white/25 hover:bg-white/40",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-2 text-xs text-white/50 tabular-nums">
            {sceneIdx + 1} / {TOTAL}
          </span>
          <button
            type="button"
            onClick={prev}
            disabled={sceneIdx === 0}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/12 disabled:opacity-35"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex h-10 items-center gap-1 rounded-full bg-[#45c700] px-4 text-sm font-semibold text-[#06210a] transition-colors hover:bg-[#7dfa5a]"
          >
            {isLast ? "Restart ↺" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Толгой лого — хоёр давхацсан ногоон дугуй
function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative inline-flex h-6 w-9 items-center" aria-hidden="true">
        <span className="absolute left-0 size-6 rounded-full bg-[#45c700]" />
        <span className="absolute left-3 size-6 rounded-full bg-[#166534]" />
      </span>
      <span className="text-xs font-bold tracking-[0.3em] text-white/70 uppercase md:text-sm">
        Brand architecture
      </span>
    </div>
  );
}

// =====================================================================
// BRAND — Slide 1: хоёр туйлын философи (rounded box-д)
// =====================================================================
function PhilosophyIntro() {
  return (
    <div className="w-full max-w-3xl text-center">
      <div className="flex justify-center">
        <BrandLogo />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
        Two philosophies
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-balance text-white/60 md:text-base">
        Depending on how sub-brands relate to the parent, each one sits at one of two poles.
      </p>

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        {brandHouses.map((house, i) => (
          <div
            key={house.id}
            className="animate-in fade-in slide-in-from-bottom-3 rounded-2xl border border-white/15 bg-white/[0.05] p-7 text-left duration-700"
            style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "both" }}
          >
            <p className="text-lg font-bold text-white md:text-xl">{house.label}</p>
            <p className="mt-2 text-sm text-white/60 md:text-base">{house.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// BRAND — Slide 2: 4 арга байрандаа нисэж очно, жишээ дээр дарж focus (blur)
// =====================================================================
const FLY_DELAY: Record<string, number> = {
  "product-brand": 0,
  "umbrella-brand": 0.12,
  "endorsing-brand": 0.24,
  "source-brand": 0.36,
};

function BrandBoard() {
  const [focusId, setFocusId] = useState<string | null>(null);
  const focus = focusId ? brandTypes.find((t) => t.id === focusId) : null;

  return (
    <div className="w-full max-w-6xl">
      {/* Толгой */}
      <div className="flex flex-col items-center text-center">
        <BrandLogo />
        <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/70">
          Others · Google
        </span>
      </div>

      {/* Хоёр философи — тус бүр 2 арга; картууд байрандаа нисэж очно */}
      <div className="mt-7 grid gap-x-8 gap-y-6 lg:grid-cols-2">
        {brandHouses.map((house, hi) => (
          <div key={house.id}>
            <p className="text-center text-base font-bold text-white md:text-lg">{house.label}</p>
            <p className="mx-auto mt-1 flex min-h-[2.75rem] max-w-xs items-start justify-center text-center text-xs text-balance text-white/50 md:text-sm">
              {house.desc}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {brandTypes
                .filter((t) => t.house === house.label)
                .map((t) => (
                  <MethodCard
                    key={t.id}
                    type={t}
                    // House of brands (эхний баганa) → зүүн, Branded house → баруун
                    side={hi === 0 ? "left" : "right"}
                    onOpen={() => setFocusId(t.id)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Focus — жишээг томоор, ард нь blur */}
      {focus && (
        <div
          className="animate-in fade-in fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-6 backdrop-blur-md duration-300"
          onClick={(e) => {
            e.stopPropagation();
            setFocusId(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={focus.name}
        >
          <div
            className="animate-in zoom-in-95 w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0b1424]/95 p-6 duration-300 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white/60 uppercase">
                  {focus.house}
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
                  {focus.name}
                </h2>
              </div>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                style={{ backgroundColor: `${focus.color}22`, color: focus.color }}
              >
                {focus.link}
              </span>
            </div>

            <div className="mt-4">
              <LiveWeb src={focus.image} label={focus.externalProduct} big />
            </div>

            <p className="mt-4 text-sm text-white/60 md:text-base">{focus.note}</p>

            {focus.ours.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: focus.color }}
                >
                  Our group
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {focus.ours.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border px-2.5 py-1 text-xs font-semibold text-white"
                      style={{ borderColor: `${focus.color}55`, backgroundColor: `${focus.color}1a` }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {focus.url && (
                <a
                  href={focus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-[#0b1424] transition-opacity hover:opacity-85"
                >
                  Open live site
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setFocusId(null)}
                className="inline-flex h-10 items-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MethodCard({
  type,
  side,
  onOpen,
}: {
  type: BrandType;
  side: "left" | "right";
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className={cn(
        "group animate-in fade-in flex flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-left duration-700 hover:border-white/25",
        side === "left" ? "slide-in-from-right-6" : "slide-in-from-left-6",
      )}
      style={{ animationDelay: `${FLY_DELAY[type.id] ?? 0}s`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-white md:text-base">{type.name}</p>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
          style={{ backgroundColor: `${type.color}22`, color: type.color }}
        >
          {type.link}
        </span>
      </div>

      <div className="mt-3">
        <LiveWeb src={type.image} label={type.externalProduct} />
      </div>

      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/45 transition-colors group-hover:text-white/80">
        View example →
      </span>
    </button>
  );
}

// Жишээ компанийн live web — browser frame + зураг (эсвэл placeholder)
function LiveWeb({ src, label, big }: { src?: string; label: string; big?: boolean }) {
  const [ok, setOk] = useState(Boolean(src));

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-2.5 py-1.5">
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="ml-2 truncate text-[10px] text-white/40">{label}</span>
      </div>
      <div className={cn("relative w-full", big ? "aspect-[16/9]" : "aspect-[16/10]")}>
        {ok && src ? (
          <Image
            src={src}
            alt={label}
            fill
            sizes={big ? "(min-width:768px) 700px, 90vw" : "(min-width:1024px) 22vw, 45vw"}
            className="object-cover object-top"
            onError={() => setOk(false)}
          />
        ) : (
          <div className="grid h-full place-items-center">
            <span className="text-sm font-semibold text-white/45">Live web</span>
          </div>
        )}
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
