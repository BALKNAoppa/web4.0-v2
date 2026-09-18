"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const RGB = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.%]+))?\s*\)$/i;

function toHex(parts: RegExpExecArray) {
  return `#${[parts[1], parts[2], parts[3]]
    .map((channel) => Math.round(Number(channel)).toString(16).padStart(2, "0"))
    .join("")}`;
}

function readSurfaceColor() {
  const override = document.querySelector<HTMLElement>("[data-theme-color]");

  for (const el of [override, document.documentElement, document.body]) {
    if (!el) continue;
    const parts = RGB.exec(getComputedStyle(el).backgroundColor);
    if (!parts) continue;
    const raw = parts[4];
    const alpha = raw === undefined ? 1 : raw.endsWith("%") ? Number(raw.slice(0, -1)) / 100 : Number(raw);
    if (!(alpha >= 1)) continue;
    return toHex(parts);
  }
  return null;
}

export function syncThemeColor() {
  const color = readSurfaceColor();
  if (!color) return;

  const all = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'));
  let target = all.find((meta) => !meta.media) ?? null;

  for (const meta of all) {
    if (meta !== target) meta.remove();
  }

  if (!target) {
    target = document.createElement("meta");
    target.name = "theme-color";
    document.head.appendChild(target);
  }

  if (target.content !== color) target.content = color;
}

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;

    const schedule = () => {
      syncThemeColor();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(syncThemeColor);
      });
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    window.addEventListener("pageshow", schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pageshow", schedule);
    };
  }, [resolvedTheme, pathname]);

  return null;
}
