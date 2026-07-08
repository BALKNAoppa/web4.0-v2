"use client";

import { useEffect } from "react";

/** Sticky header (h-14 / lg:h-16) + амьсгалын зай */
const HEADER_OFFSET = 72;
/** Snap байрлалаас энэ радиус (px) дотор зогссон үед л татна */
const SNAP_RADIUS = 200;
/** Scroll зогссон гэж үзэх хүлээлт (ms) */
const SETTLE_DELAY = 160;
/** Анимаци дууссаны дараах хориг — trailing event-үүд дахин snap үүсгэхгүй */
const COOLDOWN_MS = 250;

/** easeOutQuart — эхэндээ шуурхай, төгсгөлдөө маш зөөлөн буудаг */
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

/** Зайнаас хамаарсан хугацаа: ойр бол богино, хол бол удаан */
const durationFor = (dist: number): number =>
  Math.min(1300, Math.max(700, dist * 2.8));

/**
 * Section snap — JS хувилбар (цоо шинэ animation engine).
 *
 * ЧУХАЛ: globals.css дээр `html { scroll-behavior: smooth }` байдаг тул
 * rAF доторх scrollTo() бүр өөрөө "smooth" болж давхар анимаци үүсгэдэг
 * байсан. Энэ нь том гацалт үүсгэдэг — тиймээс анимацийн үеэр
 * scroll-behavior-ийг түр "auto" болгож, フрэйм бүрд шууд байрлал онооно.
 *
 *  - Намхан section (viewport-д багтдаг) → дэлгэцийн төвд
 *  - Өндөр section → эхлэл нь header-ийн доор
 *  - Радиусаас хол зогссон бол оролцохгүй
 *  - Хэрэглэгчийн wheel/touch/keyboard анимацийг шууд таслана
 */
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
      root.style.scrollBehavior = ""; // CSS-ийн smooth-ийг сэргээнэ
    };

    /** Section бүрийн snap байрлал: намхан бол төвлүүлж, өндөр бол start */
    const targetFor = (section: HTMLElement, scrollY: number): number => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const avail = window.innerHeight - HEADER_OFFSET;

      const target =
        rect.height < avail
          ? sectionTop - HEADER_OFFSET - (avail - rect.height) / 2
          : sectionTop - HEADER_OFFSET;

      return Math.max(0, target);
    };

    const animateTo = (target: number) => {
      const startY = window.scrollY;
      const delta = target - startY;
      if (Math.abs(delta) < 2) return;

      const duration = durationFor(Math.abs(delta));
      const t0 = performance.now();

      animating = true;
      // rAF доторх scrollTo() давхар smooth болохоос сэргийлнэ
      root.style.scrollBehavior = "auto";

      const frame = (now: number) => {
        if (!animating) return; // хэрэглэгч таслав — stopAnimation аль хэдийн дуудагдсан

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

      const sections = document.querySelectorAll<HTMLElement>(
        "#main-content > section",
      );
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
      if (animating) return; // өөрийн анимацийн event-ийг тоохгүй
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
