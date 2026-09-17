"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;

    const bg = getComputedStyle(document.body).backgroundColor;
    if (bg) meta.content = bg;
  }, [resolvedTheme]);

  return null;
}
