"use client";

import * as React from "react";

export type ColorMode = "default" | "grayscale" | "high-contrast" | "low-saturation";
export type CursorColor = "default" | "white" | "black" | "yellow";

export type AccessibilitySettings = {
  colorMode: ColorMode;
  fontScale: number;
  wordSpacing: number;
  letterSpacing: number;
  highlightLinks: boolean;
  bigCursor: boolean;
  cursorColor: CursorColor;
  screenZoom: number;
  textBoost: boolean;
  hideImages: boolean;
  customBg: string | null;
  customHeading: string | null;
  customContent: string | null;
};

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  colorMode: "default",
  fontScale: 1,
  wordSpacing: 0,
  letterSpacing: 0,
  highlightLinks: false,
  bigCursor: false,
  cursorColor: "default",
  screenZoom: 1,
  textBoost: false,
  hideImages: false,
  customBg: null,
  customHeading: null,
  customContent: null,
};

const STORAGE_KEY = "web4-a11y-settings";
export const OPEN_EVENT = "web4-a11y-open";

type Ctx = {
  settings: AccessibilitySettings;
  update: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  reset: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const AccessibilityContext = React.createContext<Ctx | null>(null);

export function useAccessibility() {
  const ctx = React.useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used inside AccessibilityProvider");
  return ctx;
}

function applySettings(s: AccessibilitySettings) {
  const html = document.documentElement;

  html.classList.remove("a11y-grayscale", "a11y-high-contrast", "a11y-low-saturation");
  if (s.colorMode !== "default") html.classList.add(`a11y-${s.colorMode}`);

  html.classList.toggle("a11y-highlight-links", s.highlightLinks);
  html.classList.toggle("a11y-big-cursor", s.bigCursor);
  html.classList.toggle("a11y-hide-images", s.hideImages);
  html.classList.toggle("a11y-text-boost", s.textBoost);

  html.classList.remove("a11y-cursor-white", "a11y-cursor-black", "a11y-cursor-yellow");
  if (s.cursorColor !== "default") html.classList.add(`a11y-cursor-${s.cursorColor}`);

  html.style.setProperty("--a11y-font-scale", String(s.fontScale));
  html.style.setProperty("--a11y-word-spacing", `${s.wordSpacing}px`);
  html.style.setProperty("--a11y-letter-spacing", `${s.letterSpacing}px`);
  html.style.setProperty("--a11y-screen-zoom", String(s.screenZoom));

  if (s.customBg) html.style.setProperty("--a11y-bg", s.customBg);
  else html.style.removeProperty("--a11y-bg");
  if (s.customHeading) html.style.setProperty("--a11y-heading", s.customHeading);
  else html.style.removeProperty("--a11y-heading");
  if (s.customContent) html.style.setProperty("--a11y-content", s.customContent);
  else html.style.removeProperty("--a11y-content");
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // ignore corrupt storage
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    applySettings(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore quota errors
    }
  }, [settings, hydrated]);

  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  const update = React.useCallback<Ctx["update"]>((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = React.useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const value = React.useMemo<Ctx>(
    () => ({ settings, update, reset, open, setOpen }),
    [settings, update, reset, open],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
