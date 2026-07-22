"use client";

import { useEffect, useState } from "react";

/** Thin gradient bar (green→cyan) tracking scroll progress of the deck. */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setP(max > 0 ? doc.scrollTop / max : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${p})`,
          background: "linear-gradient(90deg,#7dfa5a,#45c700,#2ad4ff)",
        }}
      />
    </div>
  );
}
