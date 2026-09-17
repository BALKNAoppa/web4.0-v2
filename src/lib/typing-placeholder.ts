"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED = 55;
const ERASE_SPEED = 22;
const HOLD_AFTER_TYPED = 2400;
const GAP_BEFORE_NEXT = 450;
const START_DELAY = 3000;

export function useTypingPlaceholder(texts: string[], enabled: boolean): string {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!enabled) {
      setText("");
      return;
    }
    if (texts.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(texts[0]);
      return;
    }

    let index = 0;
    let pos = 0;
    let erasing = false;
    let timer: number;

    const tick = () => {
      const current = texts[index];

      if (!erasing) {
        pos += 1;
        setText(current.slice(0, pos));
        if (pos >= current.length) {
          erasing = true;
          timer = window.setTimeout(tick, HOLD_AFTER_TYPED);
        } else {
          timer = window.setTimeout(tick, TYPE_SPEED);
        }
      } else {
        pos -= 1;
        setText(current.slice(0, pos));
        if (pos <= 0) {
          erasing = false;
          index = (index + 1) % texts.length;
          timer = window.setTimeout(tick, GAP_BEFORE_NEXT);
        } else {
          timer = window.setTimeout(tick, ERASE_SPEED);
        }
      }
    };

    timer = window.setTimeout(tick, START_DELAY);
    return () => window.clearTimeout(timer);
  }, [texts, enabled]);

  return text;
}
