"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type TypingAnimationProps = {
  /** Бичигдэх текст */
  children: string;
  className?: string;
  /** Үсэг хоорондын хугацаа (ms) */
  duration?: number;
  /** Эхлэхээс өмнөх хүлээлт (ms) */
  delay?: number;
  /** Бичиж дуусахад дуудагдана */
  onComplete?: () => void;
};

/**
 * MagicUI-ийн typing-animation-тай ижил санааны, dependency-гүй хувилбар:
 * текстийг үсэг үсгээр нь бичиж буй мэт харуулна. Бичиж байх үед
 * зөөлөн анивчдаг cursor харагдаж, дуусахад алга болно.
 * prefers-reduced-motion үед шууд бүтэн текст харуулна.
 */
export function TypingAnimation({
  children,
  className,
  duration = 35,
  delay = 250,
  onComplete,
}: TypingAnimationProps) {
  const [count, setCount] = useState(0);
  const done = count >= children.length;
  // onComplete-ийг render бүрд биш, зөвхөн дуусах мөчид нэг удаа дуудна
  const completedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(children.length);
      return;
    }

    let interval: number | null = null;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((prev) => {
          if (prev >= children.length) {
            if (interval) window.clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, duration);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [children, duration, delay]);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [done, onComplete]);

  return (
    <span className={cn(className)}>
      {children.slice(0, count)}
      {!done && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block w-[2px] animate-pulse self-stretch bg-current align-middle"
          style={{ height: "1em" }}
        />
      )}
    </span>
  );
}
