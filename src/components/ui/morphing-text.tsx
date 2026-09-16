"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

type MorphingTextProps = {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
};

const MAX_BLUR_PX = 1.2;
const SHIFT_EM = 0.75;

function useMorphingText({
  texts,
  morphTime,
  cooldownTime,
  enabled,
}: {
  texts: string[];
  morphTime: number;
  cooldownTime: number;
  enabled: boolean;
}) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(cooldownTime);
  const timeRef = useRef(0);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const el1 = text1Ref.current;
      const el2 = text2Ref.current;
      if (!el1 || !el2) return;

      const e = fraction * fraction * (3 - 2 * fraction);

      const outA = Math.pow(1 - e, 1.6);
      const inA = Math.pow(e, 1.6);

      el2.style.opacity = `${inA * 100}%`;
      el2.style.filter = `blur(${(1 - e) * MAX_BLUR_PX}px)`;
      el2.style.transform = `translateY(${(1 - e) * SHIFT_EM}em)`;

      el1.style.opacity = `${outA * 100}%`;
      el1.style.filter = `blur(${e * MAX_BLUR_PX}px)`;
      el1.style.transform = `translateY(${-e * SHIFT_EM}em)`;

      el1.textContent = texts[textIndexRef.current % texts.length];
      el2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  useEffect(() => {
    const el1 = text1Ref.current;
    const el2 = text2Ref.current;
    if (!el1 || !el2) return;

    if (!enabled) {
      el1.style.transform = "none";
      el2.style.transform = "none";
      el1.style.filter = "none";
      el1.style.opacity = "100%";
      el1.textContent = texts[0] ?? "";
      el2.style.opacity = "0%";
      el2.textContent = "";
      return;
    }

    let frame = 0;
    timeRef.current = Date.now();
    const tick = () => {
      frame = requestAnimationFrame(tick);

      const now = Date.now();
      const dt = (now - timeRef.current) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;

      if (cooldownRef.current > 0) {
        setStyles(0);
        return;
      }

      morphRef.current += dt;
      const fraction = morphRef.current / morphTime;

      if (fraction >= 1) {
        setStyles(1);
        morphRef.current = 0;
        cooldownRef.current = cooldownTime;
        textIndexRef.current += 1;
        return;
      }

      setStyles(fraction);
    };

    tick();
    return () => cancelAnimationFrame(frame);
  }, [enabled, texts, morphTime, cooldownTime, setStyles]);

  return { text1Ref, text2Ref };
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function MorphingText({
  texts,
  morphTime = 1.5,
  cooldownTime = 0.5,
  className,
}: MorphingTextProps) {
  const reduced = usePrefersReducedMotion();
  const { text1Ref, text2Ref } = useMorphingText({
    texts,
    morphTime,
    cooldownTime,
    enabled: !reduced,
  });

  const longest = texts.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className={cn("relative inline-grid place-items-center leading-none", className)}>
      {}
      <span className="sr-only">{texts[0]}</span>

      {
}
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {longest}
      </span>

      {}
      <span
        ref={text1Ref}
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center whitespace-nowrap"
      />
      <span
        ref={text2Ref}
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center whitespace-nowrap"
      />

      {
}
    </span>
  );
}
