"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Contrast,
  Droplets,
  EyeOff,
  Link2,
  MousePointer2,
  MousePointerClick,
  RotateCcw,
  ScanEye,
  Type,
  Keyboard,
  X,
} from "lucide-react";
import {
  useAccessibility,
  type AccessibilitySettings,
  type ColorMode,
  type CursorColor,
} from "./accessibility-provider";

type FontTab = "size" | "word" | "letter";

const COLOR_MODES: { id: ColorMode; label: string; icon: React.ReactNode }[] = [
  { id: "grayscale", label: "Хар цагаан", icon: <Contrast className="size-5" /> },
  { id: "high-contrast", label: "Өнгөний ялгарал", icon: <Contrast className="size-5" /> },
  { id: "low-saturation", label: "Өнгө багасгах", icon: <Droplets className="size-5" /> },
];

const WEB_COLORS = [
  { key: "customBg" as const, label: "Арын дэвсгэр" },
  { key: "customHeading" as const, label: "Гарчиг" },
  { key: "customContent" as const, label: "Агуулга" },
];

const PALETTE = ["#000000", "#ffffff", "#1e3a8a", "#dc2626", "#16a34a", "#facc15", "#7c3aed"];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      {children}
    </h3>
  );
}

function OptionCard({
  active,
  onClick,
  icon,
  label,
  className,
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border bg-background p-3 text-left text-sm transition-colors",
        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "border-primary ring-2 ring-primary/30 bg-primary/5",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-lg bg-muted text-foreground",
          active && "bg-primary/15 text-primary",
        )}
      >
        {icon}
      </span>
      <span className="font-medium leading-tight">{label}</span>
    </button>
  );
}

function FontSlider({
  value,
  min,
  max,
  step,
  onChange,
  formatLabel,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatLabel: (v: number) => string;
}) {
  return (
    <div className="mt-3">
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatLabel(min)}</span>
        <span className="font-medium text-foreground">{formatLabel(value)}</span>
        <span>{formatLabel(max)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </div>
  );
}

export function AccessibilityPanel() {
  const { settings, update, reset, open, setOpen } = useAccessibility();
  const [fontTab, setFontTab] = React.useState<FontTab>("size");
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const colorActive = (id: ColorMode) => settings.colorMode === id;

  return (
    <div
      role="dialog"
      aria-label="Хүртээмжийн тохиргоо"
      aria-hidden={!open}
      className={cn(
        "fixed top-0 left-0 z-40 flex h-dvh w-full max-w-[360px] flex-col gap-0 overflow-y-auto border-r bg-popover p-5 text-popover-foreground shadow-2xl transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/accessibility.svg"
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0"
          />
          <div>
            <h2 className="text-lg font-semibold leading-tight">Хүртээмжийн тохиргоо</h2>
            <p className="text-xs text-muted-foreground">Сонголтыг хийхэд шууд харагдана</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Хаах"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      </div>

      <SectionTitle>Өнгө</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {COLOR_MODES.map((m) => (
          <OptionCard
            key={m.id}
            active={colorActive(m.id)}
            icon={m.icon}
            label={m.label}
            onClick={() => update("colorMode", colorActive(m.id) ? "default" : m.id)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-medium">Вэбийн өнгө солих</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            update("customBg", null);
            update("customHeading", null);
            update("customContent", null);
          }}
        >
          <RotateCcw className="size-3.5" />
          Сэргээх
        </Button>
      </div>
      <div className="mt-3 space-y-3">
        {WEB_COLORS.map((c) => {
          const current = settings[c.key];
          return (
            <div key={c.key} className="rounded-xl border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{c.label}</span>
                {current && (
                  <button
                    type="button"
                    onClick={() => update(c.key, null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Цэвэрлэх
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {PALETTE.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update(c.key, p)}
                    aria-label={`${c.label} — ${p}`}
                    aria-pressed={current === p}
                    style={{ background: p }}
                    className={cn(
                      "size-7 rounded-full border-2 transition-transform",
                      current === p ? "scale-110 border-primary" : "border-border hover:scale-105",
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <SectionTitle>Контентийн тохиргоо</SectionTitle>
      <div className="rounded-xl border bg-background p-3">
        <div className="text-sm font-medium">Фонт</div>
        <div className="mt-3 flex gap-2">
          {([
            { id: "size" as FontTab, label: "Хэмжээ" },
            { id: "word" as FontTab, label: "Үгийн зай" },
            { id: "letter" as FontTab, label: "Үсгийн зай" },
          ]).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFontTab(t.id)}
              aria-pressed={fontTab === t.id}
              className={cn(
                "flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                fontTab === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {fontTab === "size" && (
          <FontSlider
            value={settings.fontScale}
            min={0.8}
            max={1.6}
            step={0.05}
            onChange={(v) => update("fontScale", v)}
            formatLabel={(v) => `${Math.round(v * 100)}%`}
          />
        )}
        {fontTab === "word" && (
          <FontSlider
            value={settings.wordSpacing}
            min={0}
            max={20}
            step={1}
            onChange={(v) => update("wordSpacing", v)}
            formatLabel={(v) => `${v}px`}
          />
        )}
        {fontTab === "letter" && (
          <FontSlider
            value={settings.letterSpacing}
            min={0}
            max={6}
            step={0.5}
            onChange={(v) => update("letterSpacing", v)}
            formatLabel={(v) => `${v}px`}
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <OptionCard
          active={settings.highlightLinks}
          icon={<Link2 className="size-5" />}
          label="Холбоос тодруулах"
          onClick={() => update("highlightLinks", !settings.highlightLinks)}
        />
        <OptionCard
          active={settings.bigCursor}
          icon={<MousePointerClick className="size-5" />}
          label="Курсор томруулах"
          onClick={() => update("bigCursor", !settings.bigCursor)}
        />
        <OptionCard
          active={settings.cursorColor !== "default"}
          icon={<MousePointer2 className="size-5" />}
          label="Курсорын өнгө"
          onClick={() => {
            const next: CursorColor =
              settings.cursorColor === "default"
                ? "white"
                : settings.cursorColor === "white"
                ? "yellow"
                : "default";
            update("cursorColor", next);
          }}
        />
        <OptionCard
          active={settings.screenZoom > 1}
          icon={<ScanEye className="size-5" />}
          label="Дэлгэц томруулах"
          onClick={() => update("screenZoom", settings.screenZoom > 1 ? 1 : 1.15)}
        />
        <OptionCard
          active={settings.textBoost}
          icon={<Type className="size-5" />}
          label="Текст томруулах"
          onClick={() => update("textBoost", !settings.textBoost)}
        />
        <OptionCard
          active={settings.hideImages}
          icon={<EyeOff className="size-5" />}
          label="Зураг нуух"
          onClick={() => update("hideImages", !settings.hideImages)}
        />
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setKeyboardOpen((v) => !v)}
          aria-expanded={keyboardOpen}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left text-sm transition-colors hover:bg-muted",
            keyboardOpen && "border-primary",
          )}
        >
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-muted">
            <Keyboard className="size-5" />
          </span>
          <span className="font-medium">Keyboard заавар</span>
        </button>
        {keyboardOpen && (
          <div className="mt-2 rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed">
            <ul className="space-y-1.5">
              <li><kbd className="rounded border bg-background px-1.5 py-0.5">Tab</kbd> — дараагийн элемент</li>
              <li><kbd className="rounded border bg-background px-1.5 py-0.5">Shift + Tab</kbd> — өмнөх элемент</li>
              <li><kbd className="rounded border bg-background px-1.5 py-0.5">Enter</kbd> / <kbd className="rounded border bg-background px-1.5 py-0.5">Space</kbd> — идэвхжүүлэх</li>
              <li><kbd className="rounded border bg-background px-1.5 py-0.5">Esc</kbd> — энэ цонхыг хаах</li>
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 mb-2">
        <Button type="button" variant="default" className="w-full" onClick={reset}>
          <RotateCcw className="size-4" />
          Бүх тохиргоог сэргээх
        </Button>
      </div>
    </div>
  );
}

export type { AccessibilitySettings };
