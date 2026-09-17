"use client";

import { useEffect } from "react";

export function HeaderHeightVar() {
  useEffect(() => {
    const root = document.documentElement;

    let maxH = 0;

    const apply = (el: Element) => {
      const h = el.getBoundingClientRect().height;
      if (h <= maxH) return;
      maxH = h;
      root.style.setProperty("--header-h", `${Math.round(h)}px`);
    };

    let ro: ResizeObserver | null = null;
    let watched: Element | null = null;

    const attach = () => {
      const el = document.querySelector("header[role='banner']");
      if (!el || el === watched) return;
      ro?.disconnect();
      watched = el;
      ro = new ResizeObserver(() => apply(el));
      ro.observe(el);
      apply(el);
    };

    attach();

    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: false });

    const onResize = () => {
      const el = document.querySelector("header[role='banner']");
      if (!el) return;
      maxH = 0;
      apply(el);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      mo.disconnect();
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      root.style.removeProperty("--header-h");
    };
  }, []);

  return null;
}
