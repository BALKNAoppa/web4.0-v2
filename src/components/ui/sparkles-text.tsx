"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Sparkle = {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
};

function SparkleStar({
  x,
  y,
  color,
  delay,
  scale,
  size,
}: Omit<Sparkle, "id" | "lifespan"> & { size: string }) {
  return (
    <svg
      data-sparkle
      aria-hidden="true"
      className="pointer-events-none absolute z-20"
      viewBox="0 0 21 21"
      style={
        {
          left: x,
          top: y,
          marginLeft: `calc(${size} / -2)`,
          marginTop: `calc(${size} / -2)`,
          width: size,
          height: size,
          "--sparkle-scale": scale,
          animation: "sparkle-pop 0.8s linear infinite",
          animationDelay: `${delay}s`,
        } as CSSProperties
      }
    >
      <path
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
        fill={color}
      />
    </svg>
  );
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

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = { first: "#9E7AFF", second: "#FE8BBB" },
  starSize = "0.7em",
}: {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
  starSize?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const { first, second } = colors;

  useEffect(() => {
    if (reduced) return;

    let seq = 0;
    const generate = (): Sparkle => {
      seq += 1;
      return {
        id: `s${seq}`,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        color: Math.random() > 0.5 ? first : second,
        delay: Math.random() * 2,
        scale: Math.random() * 1 + 0.3,
        lifespan: Math.random() * 10 + 5,
      };
    };

    const interval = setInterval(() => {
      setSparkles((current) =>
        current.length === 0
          ? Array.from({ length: sparklesCount }, generate)
          : current.map((s) =>
              s.lifespan <= 0 ? generate() : { ...s, lifespan: s.lifespan - 0.1 },
            ),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [reduced, first, second, sparklesCount]);

  return (
    <span className={cn("relative inline-block", className)}>
      {!reduced &&
        sparkles.map((s) => (
        <SparkleStar
          key={s.id}
          x={s.x}
          y={s.y}
          color={s.color}
          delay={s.delay}
          scale={s.scale}
          size={starSize}
        />
      ))}
      {children}
    </span>
  );
}
