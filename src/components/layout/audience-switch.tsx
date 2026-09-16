"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, User, Info, Smartphone, Home, ArrowUpRight } from "lucide-react";

import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { audienceSegments, type AudienceSegment, type BrandCard } from "@/data/navigation";
import { navType } from "@/lib/nav-type";
import { cn } from "@/lib/utils";

function SegmentIcon({ icon, className }: { icon: AudienceSegment["icon"]; className?: string }) {
  const Icon =
    icon === "building"
      ? Building2
      : icon === "smartphone"
        ? Smartphone
        : icon === "home"
          ? Home
          : icon === "info"
            ? Info
            : User;
  return <Icon className={className} aria-hidden="true" />;
}

function BrandCardItem({ brand }: { brand: BrandCard }) {
  return (
    <a
      href={brand.href}
      className="group/card border-border hover:border-primary/40 hover:bg-muted/50 flex flex-col rounded-lg border p-3 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            navType.badge,
            "bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-md",
          )}
        >
          {brand.badge}
        </span>
        <span className={navType.secondaryLink}>{brand.name}</span>
        <ArrowUpRight
          className="text-muted-foreground ml-auto size-4 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
          aria-hidden="true"
        />
      </div>
      <p className={cn(navType.body, "text-muted-foreground mt-1.5 leading-snug")}>
        {brand.description}
      </p>
    </a>
  );
}

function BrandCardsPanel({ seg }: { seg: AudienceSegment }) {
  const cols = seg.brands?.length ?? 0;
  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <SegmentIcon icon={seg.icon} className="text-primary size-4" />
        <p className={navType.secondaryLink}>{seg.label}</p>
      </div>
      {}
      <div
        className={cn(
          "grid gap-3",
          cols >= 4 ? "grid-cols-4" : cols === 3 ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {seg.brands?.map((brand) => (
          <BrandCardItem key={brand.name} brand={brand} />
        ))}
      </div>
    </>
  );
}

const SEG_AFFIX = "size-[0.9em] shrink-0 opacity-60";

const tabClass = cn(
  navType.bar,
  "text-muted-foreground hover:text-foreground data-[state=open]:text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors",
);

function AudienceSwitch({
  align,
  hover = true,
  activeId,
  segments = audienceSegments,
  triggerClassName,
}: {
  align: "start" | "end";
  hover?: boolean;
  activeId?: AudienceSegment["id"];
  segments?: AudienceSegment[];
  triggerClassName?: string;
}) {
  const [openId, setOpenId] = useState<AudienceSegment["id"] | null>(null);
  const [dir, setDir] = useState<"l" | "r">("r");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const clearTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const openSeg = (id: AudienceSegment["id"]) => {
    clearTimer();
    const prevIdx = segments.findIndex((s) => s.id === openId);
    const nextIdx = segments.findIndex((s) => s.id === id);
    if (prevIdx !== -1 && nextIdx !== -1) setDir(nextIdx >= prevIdx ? "r" : "l");
    setOpenId(id);
  };
  const closeNow = () => {
    clearTimer();
    setOpenId(null);
  };
  const closeSoon = () => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpenId(null), 140);
  };

  const activeSeg = segments.find((s) => s.id === openId && s.brands?.length) ?? null;

  const activeCls = "text-foreground! font-semibold";
  const hoverOpen = (id: AudienceSegment["id"]) => {
    if (hover) openSeg(id);
  };
  const hoverCloseNow = () => {
    if (hover) closeNow();
  };
  const hoverCloseSoon = () => {
    if (hover) closeSoon();
  };
  const hoverClear = () => {
    if (hover) clearTimer();
  };

  return (
    <Popover open={!!activeSeg} onOpenChange={(o) => !o && closeNow()}>
      {}
      <PopoverAnchor asChild>
        <nav
          aria-label="Үзэгчийн сегмент"
          onMouseLeave={hoverCloseSoon}
          className="flex items-center gap-1"
        >
          {segments.map((seg) => {
            if (!seg.brands?.length) {
              return (
                <a
                  key={seg.id}
                  href={seg.href}
                  target={seg.external ? "_blank" : undefined}
                  rel={seg.external ? "noopener noreferrer" : undefined}
                  onMouseEnter={hoverCloseNow}
                  className={cn(
                    tabClass,
                    "group",
                    triggerClassName,
                    seg.id === activeId && activeCls,
                  )}
                >
                  {
}
                  <span>{seg.label}</span>
                  <ArrowUpRight className={SEG_AFFIX} aria-hidden="true" />
                </a>
              );
            }

            const isOpen = openId === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                data-state={isOpen ? "open" : "closed"}
                aria-expanded={isOpen}
                onMouseEnter={() => hoverOpen(seg.id)}
                onClick={() => (isOpen ? closeNow() : openSeg(seg.id))}
                className={cn(
                  tabClass,
                  "group",
                  triggerClassName,
                  seg.id === activeId && activeCls,
                )}
              >
                {
}
                <span>{seg.label}</span>
              </button>
            );
          })}
        </nav>
      </PopoverAnchor>

      <PopoverContent
        align={align}
        sideOffset={12}
        collisionPadding={16}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseEnter={hoverClear}
        onMouseLeave={closeSoon}
        className="w-[min(92vw,540px)] overflow-hidden p-5"
      >
        {}
        {activeSeg && (
          <div
            key={activeSeg.id}
            className={cn(
              "animate-in fade-in-0 duration-300 ease-out",
              dir === "r" ? "slide-in-from-right-8" : "slide-in-from-left-8",
            )}
          >
            <BrandCardsPanel seg={activeSeg} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function AudienceSwitchTabs({
  segments,
  activeId,
  align = "start",
  hover = true,
  triggerClassName,
}: {
  segments?: AudienceSegment[];
  activeId?: AudienceSegment["id"];
  align?: "start" | "end";
  hover?: boolean;
  triggerClassName?: string;
} = {}) {
  return (
    <AudienceSwitch
      align={align}
      segments={segments}
      activeId={activeId}
      hover={hover}
      triggerClassName={triggerClassName}
    />
  );
}

export function AudienceSwitchMobile({
  onItemClick,
  segments = audienceSegments,
}: {
  onItemClick?: () => void;
  segments?: AudienceSegment[];
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {segments.map((seg) =>
        seg.brands?.length ? (
          <AccordionItem key={seg.id} value={seg.id}>
            <AccordionTrigger className={navType.mobileLink}>
              <span className="flex items-center gap-2">
                <SegmentIcon icon={seg.icon} className="text-muted-foreground size-4" />
                {seg.label}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-0.5 pl-6">
                {seg.brands.map((brand) => (
                  <li key={brand.name}>
                    <a
                      href={brand.href}
                      onClick={onItemClick}
                      className={cn(
                        navType.mobileLink,
                        "text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2 no-underline transition-colors",
                      )}
                    >
                      <span className="font-medium">{brand.name}</span>
                      <ArrowUpRight
                        className="ml-auto size-3.5 shrink-0 opacity-60"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ) : (
          <a
            key={seg.id}
            href={seg.href}
            target={seg.external ? "_blank" : undefined}
            rel={seg.external ? "noopener noreferrer" : undefined}
            onClick={onItemClick}
            className={cn(navType.mobileLink, "flex items-center gap-2 py-4")}
          >
            <SegmentIcon icon={seg.icon} className="text-muted-foreground size-4" />
            <span>{seg.label}</span>
            <ArrowUpRight className="text-muted-foreground ml-auto size-4" aria-hidden="true" />
          </a>
        ),
      )}
    </Accordion>
  );
}
