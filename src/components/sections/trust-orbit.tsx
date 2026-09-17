"use client";

import {
  Activity,
  Headphones,
  Lock,
  Wrench,
  Gauge,
  ShieldCheck,
  Home,
  type LucideIcon,
} from "lucide-react";

import { trustItems, trustSection, type TrustItem } from "@/data/trust-orbit";

const iconMap: Record<TrustItem["icon"], LucideIcon> = {
  activity: Activity,
  headphones: Headphones,
  lock: Lock,
  wrench: Wrench,
  gauge: Gauge,
  "shield-check": ShieldCheck,
};

export function TrustOrbit() {
  return (
    <section
      aria-labelledby="trust-title"
      className="relative overflow-hidden bg-[#92b4af] py-7 lg:py-14"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-sm"
        style={{ backgroundImage: "url('/trust-orbit-bg.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      <div
        className="absolute -top-32 -right-32 size-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 size-96 rounded-full bg-black/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative z-20 text-white">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              {trustSection.eyebrow}
            </span>
            <h2 id="trust-title" className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {trustSection.title}
            </h2>
            <p className="mt-4 text-base text-white/80 md:text-lg">{trustSection.description}</p>
          </div>

          <div>
            <div className="hidden lg:block">
              <OrbitLayout />
            </div>

            <div className="grid grid-cols-2 gap-4 lg:hidden">
              {trustItems.map((item) => (
                <TrustGridCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ORBIT_DURATION = "40s";

function OrbitLayout() {
  const total = trustItems.length;
  const radius = 180;

  return (
    <div
      className="relative mx-auto"
      style={{ width: `${(radius + 60) * 2}px`, height: `${(radius + 60) * 2}px` }}
      role="group"
      aria-label="Найдвартай байдлын элементүүд"
    >
      <div
        className="absolute inset-0 m-auto rounded-full border border-dashed border-white/20"
        style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
        aria-hidden="true"
      />

      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative size-32">
          <div
            className="border-primary absolute inset-0 rounded-full border-2"
            style={{ animation: "hub-pulse 9s ease-out infinite" }}
            aria-hidden="true"
          />
          <div
            className="border-primary absolute inset-0 rounded-full border-2"
            style={{ animation: "hub-pulse 9s ease-out infinite", animationDelay: "2.25s" }}
            aria-hidden="true"
          />
          <div
            className="border-primary absolute inset-0 rounded-full border-2"
            style={{ animation: "hub-pulse 9s ease-out infinite", animationDelay: "4.5s" }}
            aria-hidden="true"
          />
          <div
            className="border-primary absolute inset-0 rounded-full border-2"
            style={{ animation: "hub-pulse 9s ease-out infinite", animationDelay: "6.75s" }}
            aria-hidden="true"
          />

          <div className="bg-primary text-primary-foreground relative flex size-32 flex-col items-center justify-center rounded-full shadow-2xl">
            <Home className="size-8" aria-hidden="true" />
            <span className="mt-2 text-xs font-semibold">{trustSection.hubLabel}</span>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 z-20"
        style={{ animation: `orbit-spin ${ORBIT_DURATION} linear infinite` }}
        aria-hidden="false"
      >
        {trustItems.map((item, index) => {
          const angle = (360 / total) * index - 90;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <OrbitItem
              key={item.id}
              item={item}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function OrbitItem({ item, style }: { item: TrustItem; style: React.CSSProperties }) {
  const Icon = iconMap[item.icon];

  return (
    <div className="group absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      <div style={{ animation: `orbit-spin ${ORBIT_DURATION} linear infinite reverse` }}>
        <div className="bg-card text-foreground flex size-20 cursor-pointer flex-col items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110">
          <Icon className="size-7" aria-hidden="true" />
        </div>

        <span className="absolute top-full left-1/2 mt-2 w-32 -translate-x-1/2 text-center text-xs font-medium text-white">
          {item.label}
        </span>
      </div>
    </div>
  );
}

function TrustGridCard({ item }: { item: TrustItem }) {
  const Icon = iconMap[item.icon];

  return (
    <div className="bg-card/95 flex flex-col gap-2 rounded-xl p-4 shadow-sm backdrop-blur">
      <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold">{item.label}</h3>
      <p className="text-muted-foreground text-xs">{item.description}</p>
    </div>
  );
}
