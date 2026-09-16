"use client";

import { useSyncExternalStore } from "react";

export type HeaderVariant = 1 | 2;

export const HEADER_VARIANT_API = "/api/header-variant";

const CACHE_KEY = "uv-header-variant-cache-2026-09-15";

const POLL_MS = 2000;

let current: HeaderVariant = 1;
let poll: ReturnType<typeof setInterval> | null = null;
let muteUntil = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function apply(next: HeaderVariant) {
  try {
    window.localStorage.setItem(CACHE_KEY, String(next));
  } catch {
  }
  if (next === current) return;
  current = next;
  emit();
}

async function pull() {
  try {
    const res = await fetch(HEADER_VARIANT_API, { cache: "no-store" });
    if (!res.ok) return;
    const data: unknown = await res.json();
    const value = (data as { variant?: unknown })?.variant;
    if (value !== 1 && value !== 2) return;
    if (Date.now() < muteUntil) return;
    apply(value);
  } catch {
  }
}

function onVisible() {
  if (document.visibilityState === "visible") void pull();
}

function start() {
  try {
    if (window.localStorage.getItem(CACHE_KEY) === "2") {
      current = 2;
      emit();
    }
  } catch {
  }
  void pull();
  poll = setInterval(() => {
    if (document.visibilityState === "visible") void pull();
  }, POLL_MS);
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onVisible);
}

function stop() {
  if (poll) clearInterval(poll);
  poll = null;
  document.removeEventListener("visibilitychange", onVisible);
  window.removeEventListener("focus", onVisible);
}

function subscribe(cb: () => void) {
  if (listeners.size === 0) start();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) stop();
  };
}

function getSnapshot(): HeaderVariant {
  return current;
}

function getServerSnapshot(): HeaderVariant {
  return 1;
}

export function useHeaderVariant(): HeaderVariant {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export async function setHeaderVariant(v: HeaderVariant): Promise<void> {
  const res = await fetch(HEADER_VARIANT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variant: v }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Хадгалж чадсангүй (${res.status})`);
  muteUntil = Date.now() + 2500;
  apply(v);
}
