"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, User, Info, Smartphone, Home, ArrowUpRight, ChevronDown } from "lucide-react";

import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { audienceSegments, type AudienceSegment, type BrandCard } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Audience switcher — Хувь хэрэглэгч / Байгууллага / Бидний тухай
 *
 * Hover хийхэд тухайн сегментийн брэндүүд тус бүр өөрийн card-аар задарна:
 *   - Хувь хэрэглэгч → Unitel / Univision / LookTV
 *   - Байгууллага    → Unitel Corp / Univision Corp / U-point / Nexmind
 * "Бидний тухай" нь card-гүй, группын сайт руу шууд линк.
 *
 * Хоёр layout хувилбар (хоёулаа ижил hover контенттой):
 *   - AudienceSwitchTabs  → top bar-ын баруун талд таб маягаар
 *   - AudienceSwitchPills → лого хажууд segmented pill маягаар
 */

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

// =====================================================================
// Брэнд cards panel — hover дээр гарах контент
// =====================================================================
function BrandCardItem({ brand }: { brand: BrandCard }) {
  return (
    <a
      href={brand.href}
      className="group/card border-border hover:border-primary/40 hover:bg-muted/50 flex flex-col rounded-lg border p-3 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold">
          {brand.badge}
        </span>
        <span className="text-sm font-semibold">{brand.name}</span>
        <ArrowUpRight
          className="text-muted-foreground ml-auto size-4 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
          aria-hidden="true"
        />
      </div>
      <p className="text-muted-foreground mt-1.5 text-xs leading-snug">{brand.description}</p>
    </a>
  );
}

function BrandCardsPanel({ seg }: { seg: AudienceSegment }) {
  const cols = seg.brands?.length ?? 0;
  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <SegmentIcon icon={seg.icon} className="text-primary size-4" />
        <p className="text-sm font-semibold">{seg.label}</p>
      </div>
      {/* Багана = брэндийн тоо → бүх карт нэг эгнээнд жигд (3 эсвэл 4) */}
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

const tabClass =
  "text-muted-foreground hover:text-foreground data-[state=open]:text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:text-sm";

const pillClass =
  "text-muted-foreground hover:text-foreground data-[state=open]:bg-background data-[state=open]:text-foreground data-[state=open]:shadow-sm inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors";

/**
 * Audience switcher — нэг Popover, hover хийхэд доторх контент л солигдоно.
 * navigation mega-menu-ийн зарчмаар: панелийн өргөн бүх сегментэд ижил, тогтмол
 * (max-w-[1000px], 1200 grid-д багтсан), зөвхөн брэнд cards солигдоно.
 *   - layout="tabs"  → top bar-ын баруун талд (align="end" → баруун ирмэг grid-д)
 *   - layout="pills" → лого хажууд (align="start" → зүүн ирмэг grid-д)
 * "Бидний тухай" нь card-гүй — hover хийхэд нээлттэй panel хаагдаж, шууд линк.
 */
function AudienceSwitch({
  layout,
  align,
  hover = true,
  activeId,
  segments = audienceSegments,
}: {
  layout: "tabs" | "pills";
  align: "start" | "end";
  /** hover дээр popover нээх эсэх (false бол зөвхөн click) */
  hover?: boolean;
  /** идэвхтэй (одоо байгаа) сегмент — арын өнгөөр тодотгоно */
  activeId?: AudienceSegment["id"];
  /** Харуулах сегментүүд (default: audienceSegments) */
  segments?: AudienceSegment[];
}) {
  const [openId, setOpenId] = useState<AudienceSegment["id"] | null>(null);
  // Сегмент хооронд шилжих чиглэл — swipe анимэйшнд: "r" = баруунаас, "l" = зүүнээс
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
    // Шинэ сегмент жагсаалтад баруун талд байвал баруунаас, эс бөгөөс зүүнээс гулсана
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

  const isTabs = layout === "tabs";
  const triggerClass = isTabs ? tabClass : pillClass;
  const activeSeg = segments.find((s) => s.id === openId && s.brands?.length) ?? null;

  // Идэвхтэй сегментийн (жишээ нь "Хувь хэрэглэгч") тодотгол — бусад top bar-т
  // ашигладагтай ижил: хар текст + саарал дэвсгэр
  const activeCls = "bg-foreground/10 text-foreground!";
  // hover=false үед hover-оор нээх/хаах бүх үйлдэл no-op болно (зөвхөн click)
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
      {/* Anchor нь бүтэн nav — align-аар панел grid-ийн ирмэгт зэрэгцэнэ */}
      <PopoverAnchor asChild>
        <nav
          aria-label="Үзэгчийн сегмент"
          onMouseLeave={hoverCloseSoon}
          className={cn(
            "flex items-center",
            isTabs ? "gap-1" : "bg-muted/60 gap-0.5 rounded-full p-0.5",
          )}
        >
          {segments.map((seg) => {
            // Бидний тухай — card-гүй, группын сайт руу шууд линк
            if (!seg.brands?.length) {
              return (
                <a
                  key={seg.id}
                  href={seg.href}
                  target={seg.external ? "_blank" : undefined}
                  rel={seg.external ? "noopener noreferrer" : undefined}
                  onMouseEnter={hoverCloseNow}
                  className={cn(triggerClass, "group", seg.id === activeId && activeCls)}
                >
                  <SegmentIcon icon={seg.icon} className="size-4" />
                  <span>{seg.label}</span>
                  <ArrowUpRight className="size-3.5 opacity-60" aria-hidden="true" />
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
                className={cn(triggerClass, "group", seg.id === activeId && activeCls)}
              >
                <SegmentIcon icon={seg.icon} className="size-4" />
                <span>{seg.label}</span>
                <ChevronDown
                  className="size-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
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
        {/* key — сегмент солигдоход контент дахин mount хийгдэж swipe анимэйшн тоглоно */}
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

// Группын сегментүүд — top bar-ын зүүн талд таб маягаар.
// hover дээр гишүүн брэндийн картууд гарна. segments/activeId-аар өөр
// жагсаалт (жишээ нь Хувилбар 6-ийн Хувь хэрэглэгч/Байгууллага) дамжуулж болно.
export function AudienceSwitchTabs({
  segments,
  activeId,
  align = "start",
}: {
  segments?: AudienceSegment[];
  activeId?: AudienceSegment["id"];
  /** Hover панелын зэрэгцэл — табууд top bar-ын баруун талд бол "end" */
  align?: "start" | "end";
} = {}) {
  return <AudienceSwitch layout="tabs" align={align} segments={segments} activeId={activeId} />;
}

// ХУВИЛБАР 3 — лого хажууд segmented pill маягаар
export function AudienceSwitchPills() {
  return <AudienceSwitch layout="pills" align="start" />;
}

// =====================================================================
// MOBILE — Sheet дотор: сегмент бүр dropdown (accordion) болж задарна.
// Үндсэн "Бүтээгдэхүүн" nav-аас тусдаа, өөрийн dropdown-тойгоор.
// =====================================================================
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
            <AccordionTrigger className="text-sm font-medium">
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
                      className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline transition-colors"
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
          // Бидний тухай — brands байхгүй → шууд линк (dropdown-гүй)
          <a
            key={seg.id}
            href={seg.href}
            target={seg.external ? "_blank" : undefined}
            rel={seg.external ? "noopener noreferrer" : undefined}
            onClick={onItemClick}
            className="flex items-center gap-2 py-4 text-sm font-medium"
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
