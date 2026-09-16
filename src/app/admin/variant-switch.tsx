"use client";

import { useState } from "react";

import { setHeaderVariant, useHeaderVariant, type HeaderVariant } from "@/lib/header-variant";
import { cn } from "@/lib/utils";

const VARIANTS: { id: HeaderVariant; label: string; note: string }[] = [
  { id: 1, label: "Хувилбар 1", note: "Шилэн капсул + Burger Menu" },
  { id: 2, label: "Хувилбар 2", note: "Хавтгай 2 давхарга + доод dock" },
];

export function VariantSwitch() {
  const variant = useHeaderVariant();
  const [busy, setBusy] = useState<HeaderVariant | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function choose(v: HeaderVariant) {
    setBusy(v);
    setError(null);
    try {
      await setHeaderVariant(v);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {VARIANTS.map((v) => {
        const active = variant === v.id;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => void choose(v.id)}
            disabled={busy !== null}
            aria-pressed={active}
            className={cn(
              "flex flex-col gap-0.5 rounded-xl border p-4 text-left transition-colors disabled:opacity-60",
              active
                ? "bg-foreground text-background border-transparent"
                : "border-border hover:bg-muted",
            )}
          >
            <span className="flex items-center gap-2 font-semibold">
              {v.label}
              {active && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    "bg-background/20",
                  )}
                >
                  {busy === v.id ? "хадгалж байна…" : "идэвхтэй"}
                </span>
              )}
            </span>
            <span
              className={cn("text-sm", active ? "text-background/70" : "text-muted-foreground")}
            >
              {v.note}
            </span>
          </button>
        );
      })}

      {error && (
        <p role="alert" className="text-destructive text-sm">
          Хадгалагдсангүй: {error}
        </p>
      )}
    </div>
  );
}
