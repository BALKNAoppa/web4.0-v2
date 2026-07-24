import { cn } from "@/lib/utils";

/**
 * Aurora — зөвхөн CSS-ээр хийсэн хязгааргүй хөвөгч өнгөт манан background.
 * Видео/зураг ашиглахгүй тул жин бараг тэг. Эцэг элемент дотор `absolute inset-0`-оор
 * байрлана (эцэг нь `relative overflow-hidden` байх ёстой). reduced-motion үед
 * globals.css-ийн дүрмээр хөдөлгөөн зогсоно.
 *
 * Өнгө: брэнд ногоон → cyan → violet. Толбонууд булан тус бүрд байрлаж, төв
 * хэсгийг цэвэрхэн үлдээнэ (текст уншигдахуйц).
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="aurora-a absolute -top-1/4 -left-1/4 size-[60vw] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle at center, #45c700, transparent 70%)" }}
      />
      <div
        className="aurora-b absolute -right-1/4 -bottom-1/4 size-[55vw] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle at center, #2ad4ff, transparent 70%)" }}
      />
      <div
        className="aurora-c absolute -bottom-1/3 left-1/5 size-[48vw] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle at center, #a855f7, transparent 70%)" }}
      />
    </div>
  );
}
