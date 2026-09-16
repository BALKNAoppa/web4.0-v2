"use client";

import { useEffect } from "react";

const HEADER_OFFSET = 72;
const SNAP_RADIUS = 200;
const SETTLE_DELAY = 160;
const COOLDOWN_MS = 250;

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

const durationFor = (dist: number): number => Math.min(1300, Math.max(700, dist * 2.8));

export function SectionSnapScroller() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;

    let settleTimer: number | null = null;
    let rafId = 0;
    let animating = false;
    let cooldownUntil = 0;

    const stopAnimation = () => {
      animating = false;
      cancelAnimationFrame(rafId);
      root.style.scrollBehavior = "";
    };

    const targetFor = (section: HTMLElement, scrollY: number): number => {
      const sectionTop = section.getBoundingClientRect().top + scrollY;
      return Math.max(0, sectionTop - HEADER_OFFSET);
    };

    const animateTo = (target: number) => {
      const startY = window.scrollY;
      const delta = target - startY;
      if (Math.abs(delta) < 2) return;

      const duration = durationFor(Math.abs(delta));
      const t0 = performance.now();

      animating = true;
      root.style.scrollBehavior = "auto";

      const frame = (now: number) => {
        if (!animating) return;

        const progress = Math.min(1, (now - t0) / duration);
        window.scrollTo(0, startY + delta * easeOutQuart(progress));

        if (progress < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          stopAnimation();
          cooldownUntil = performance.now() + COOLDOWN_MS;
        }
      };
      rafId = requestAnimationFrame(frame);
    };

    const onSettle = () => {
      if (animating || performance.now() < cooldownUntil) return;
      if (root.dataset.assistantOpen === "1") return;

      const sections = document.querySelectorAll<HTMLElement>("#main-content > section");
      if (sections.length === 0) return;

      const y = window.scrollY;
      let bestTarget: number | null = null;
      let bestDist = Infinity;

      sections.forEach((section) => {
        const target = targetFor(section, y);
        const dist = Math.abs(y - target);
        if (dist < bestDist) {
          bestDist = dist;
          bestTarget = target;
        }
      });

      if (bestTarget === null || bestDist > SNAP_RADIUS || bestDist < 2) return;
      animateTo(bestTarget);
    };

    const onScroll = () => {
      if (animating) return;
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(onSettle, SETTLE_DELAY);
    };

    const onUserInput = () => {
      if (animating) stopAnimation();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onUserInput, { passive: true });
    window.addEventListener("touchstart", onUserInput, { passive: true });
    window.addEventListener("keydown", onUserInput, { passive: true });

    return () => {
      if (settleTimer) window.clearTimeout(settleTimer);
      stopAnimation();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onUserInput);
      window.removeEventListener("touchstart", onUserInput);
      window.removeEventListener("keydown", onUserInput);
    };
  }, []);

  return null;
}
