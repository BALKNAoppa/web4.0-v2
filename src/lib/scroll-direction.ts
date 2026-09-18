"use client";

import { useEffect, useState } from "react";

const DESKTOP = "(min-width: 1024px)";
const SHOW_NEAR_TOP = 48;
const FLIP_DISTANCE = 28;

export function useHideOnScrollDown(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);

    let lastY = window.scrollY;
    let moved = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const step = y - lastY;
      lastY = y;

      if (y <= SHOW_NEAR_TOP) {
        moved = 0;
        setHidden(false);
        return;
      }
      if (step === 0) return;

      if ((moved > 0 && step < 0) || (moved < 0 && step > 0)) moved = 0;
      moved += step;

      if (moved > FLIP_DISTANCE) {
        moved = 0;
        setHidden(true);
      } else if (moved < -FLIP_DISTANCE) {
        moved = 0;
        setHidden(false);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const sync = () => {
      stop();
      if (!mq.matches) return;
      lastY = window.scrollY;
      moved = 0;
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return hidden;
}
