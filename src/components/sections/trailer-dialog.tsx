"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Play, X } from "lucide-react";

/**
 * Трейллер харах товч + dialog. Дарвал YouTube руу шилжихгүй, харин дотроос нь
 * modal нээж трейллерийг үзүүлнэ.
 *
 * ⚠️ Эхний ээлжинд placeholder: жинхэнэ player-ийн оронд "энд тоглогдоно" гэсэн
 * хэсэг харагдана. Видео API холбогдсоны дараа `trailerUrl`-ийг ашиглан энд
 * <iframe>/<video> player суулгана (одоогоор data-attribute-д хадгалав).
 */
export function TrailerDialog({
  title,
  trailerUrl,
  triggerClassName,
}: {
  title: string;
  trailerUrl?: string;
  /** Trigger товчийг байрлуулах/загварчлах class (page-ээс дамжина) */
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Escape, focus trap, body scroll lock, focus restore
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    // Cleanup-д focus буцаах товчийг одоо барьж авна (ref дараа нь өөрчлөгдөж болзошгүй)
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        <Play className="size-4 fill-current" aria-hidden="true" />
        Трейллер үзэх
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop — дарвал хаагдана */}
          <button
            type="button"
            aria-label="Хаах"
            onClick={close}
            className="animate-in fade-in-0 absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm duration-300 ease-out"
          />

          {/* Dialog контент */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="animate-in fade-in-0 zoom-in-95 relative z-10 w-full max-w-4xl duration-300 ease-out"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id={headingId} className="truncate text-lg font-bold text-white">
                {title} — Трейллер
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Хаах"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* 16:9 placeholder — API холбогдсоны дараа жинхэнэ player орно */}
            <div
              data-trailer-url={trailerUrl}
              className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-neutral-900 text-center ring-1 ring-white/10"
            >
              {/* Бүдэг цэгэн тор */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <span className="relative flex size-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                <Play className="size-7 translate-x-0.5 fill-white text-white" aria-hidden="true" />
              </span>
              <div className="relative px-6">
                <p className="text-base font-semibold text-white">Трейллер энд тоглогдоно</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-white/60">
                  Видео API холбогдсоны дараа “{title}”-н жинхэнэ трейллер энд тоглоно.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
