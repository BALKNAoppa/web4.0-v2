import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  Layers,
  Wifi,
  Smartphone,
  Gift,
  Play,
  Router,
  Tv,
  Headset,
  type LucideIcon,
} from "lucide-react";

import { quickActions, type QuickAction } from "@/data/quick-actions";
import { cn } from "@/lib/utils";

// Icon нэрийг lucide компонент руу хувиргах map
const iconMap: Record<QuickAction["icon"], LucideIcon> = {
  layers: Layers,
  wifi: Wifi,
  smartphone: Smartphone,
  gift: Gift,
  play: Play,
  router: Router,
  tv: Tv,
  headset: Headset,
};

// =====================================================================
// AWARENESS subset-ууд — хувилбар бүр өөр зорилготой.
//   V1 — Top awareness entry points (хамгийн эхэнд анхаарал татах 3 зүйл)
//   V2-A — Гол 3 product (Гурвалсан / Дан интернэт / Төхөөрөмж)
//   V2-B — Бүх 7 үйлчилгээ (Bento marketing view)
// =====================================================================
const COMPACT_IDS = ["triple", "promotions", "univision-go"] as const;
const CORE_IDS = ["triple", "single-internet", "devices"] as const;

const compactActions = quickActions.filter((a) =>
  (COMPACT_IDS as readonly string[]).includes(a.id),
);
const coreActions = quickActions.filter((a) => (CORE_IDS as readonly string[]).includes(a.id));

// =====================================================================
// V1 — Compact strip (одоогийн хувилбар)
// =====================================================================

export function QuickActions() {
  return (
    <section
      aria-label="Univision үйлчилгээний онцлох цэгүүд"
      className="py-8 lg:py-10"
    >
      <div className="container mx-auto px-4">
        <div className="bg-card divide-border flex flex-col divide-y rounded-2xl border shadow-sm sm:flex-row sm:divide-x sm:divide-y-0">
          {compactActions.map((action, index) => (
            <ActionItem key={action.id} action={action} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionItem({ action }: { action: QuickAction; index: number }) {
  const Icon = iconMap[action.icon];

  return (
    <Link
      href={action.href}
      className="group hover:bg-primary/5 focus-visible:ring-ring relative flex flex-1 flex-col items-center gap-3 px-4 py-6 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset lg:py-8"
      aria-label={`${action.label} — ${action.description}`}
    >
      <Icon
        className="text-primary size-10 transition-transform group-hover:scale-110 lg:size-12"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <div className="flex items-center gap-1">
        <span className="text-foreground text-sm font-medium lg:text-base">{action.label}</span>
        <ChevronRight
          className="text-muted-foreground group-hover:text-primary size-4 transition-all group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

// =====================================================================
// V2-A — Detailed Cards (Description-той)
// Том card-ууд: icon badge + label + description + arrow.
// Hover дээр subtle lift.
// =====================================================================

export function QuickActionsDetailed() {
  return (
    <section aria-label="Univision-н үндсэн үйлчилгээ" className="py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground mb-8 text-center text-sm md:text-base lg:mb-10">
          Univision-ийн гол үйлчилгээнүүдтэй танилцаарай
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreActions.map((action) => (
            <DetailedCard key={action.id} action={action} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailedCard({ action }: { action: QuickAction }) {
  const Icon = iconMap[action.icon];
  return (
    <Link
      href={action.href}
      className="group bg-card border-border hover:border-primary/40 focus-visible:ring-ring relative flex flex-col gap-4 rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:p-7"
      aria-label={`${action.label} — ${action.description}`}
    >
      {/* Icon badge */}
      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground inline-flex size-12 items-center justify-center rounded-xl transition-colors lg:size-14">
        <Icon className="size-6 lg:size-7" strokeWidth={1.75} aria-hidden="true" />
      </div>

      {/* Label + description */}
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="text-foreground text-lg font-bold tracking-tight lg:text-xl">
          {action.label}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{action.description}</p>
      </div>

      {/* Arrow — баруун доод */}
      <div className="text-primary inline-flex items-center gap-1 text-sm font-semibold">
        <span>Үргэлжлүүлэх</span>
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

// =====================================================================
// V2-B — Bento Grid (Singtel-styled)
// Pastel өнгөт card-ууд янз бүрийн tone-тэй. Эхний card нь хоёр мөр эзэлж
// том featured хэлбэрээр харагдана. Title зүүн талд, том icon баруун талд.
// =====================================================================

/** Tone бүрд тохирох background + текстийн өнгө (light/dark mode-той). */
const bentoToneStyles: Record<NonNullable<QuickAction["tone"]>, string> = {
  primary: "bg-primary/15 text-foreground dark:bg-primary/25",
  blue: "bg-sky-100 text-sky-950 dark:bg-sky-950/50 dark:text-sky-100",
  dark: "bg-zinc-800 text-zinc-50 dark:bg-zinc-900 dark:text-zinc-50",
  yellow: "bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100",
  purple: "bg-violet-100 text-violet-950 dark:bg-violet-950/50 dark:text-violet-100",
  coral: "bg-rose-200 text-rose-950 dark:bg-rose-950/50 dark:text-rose-100",
  pink: "bg-pink-100 text-pink-950 dark:bg-pink-950/50 dark:text-pink-100",
  emerald: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100",
};

export function QuickActionsBento() {
  return (
    <section aria-label="Шуурхай үйлчилгээ" className="py-2.5 lg:py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
          {quickActions.map((action, i) => (
            <BentoCard key={action.id} action={action} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ action, featured }: { action: QuickAction; featured?: boolean }) {
  const Icon = iconMap[action.icon];
  const toneClass = bentoToneStyles[action.tone ?? "primary"];

  return (
    <Link
      href={action.href}
      className={cn(
        "group focus-visible:ring-ring relative flex items-start justify-between gap-3 overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:p-6",
        toneClass,
        featured && "row-span-2",
      )}
      aria-label={`${action.label} — ${action.description}`}
    >
      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <h3
          className={cn(
            "leading-tight font-bold tracking-tight",
            featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-base lg:text-xl",
          )}
        >
          {action.label}
        </h3>

        {/* Featured card дээр description дэлгэгдэнэ */}
        {featured && (
          <p className="text-sm leading-relaxed opacity-80 lg:text-base">{action.description}</p>
        )}
      </div>

      {/* Decorative icon — баруун доод буланд */}
      <Icon
        className={cn(
          "shrink-0 transition-transform group-hover:scale-110",
          featured
            ? "absolute right-3 bottom-3 size-16 opacity-30 sm:size-20 lg:right-4 lg:bottom-4 lg:size-32"
            : "size-10 opacity-70 lg:size-14",
        )}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  );
}
