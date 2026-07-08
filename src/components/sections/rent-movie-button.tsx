"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, Download, Film, QrCode, Smartphone, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { useAuth } from "@/components/auth/auth-provider";

/** Жишээ түрээсийн нөхцөл (backend холбогдоход эндээс солино) */
const RENTAL_PRICE = "7,900₮";
const RENTAL_PERIOD = "72 цаг";

type RentStep = "confirm" | "qr" | "guide" | null;

/**
 * "Кино түрээслэх" товч — brand ногоон. Урсгал:
 *  1) нэвтрээгүй бол login dialog,
 *  2) дараа нь түрээсийг баталгаажуулах dialog,
 *  3) баталгаажуулсны дараа:
 *     • Univision GO апп идэвхтэй хэрэглэгч → QR (аппаараа уншуулна),
 *     • идэвхгүй хэрэглэгч → аппаа идэвхжүүлэх заавар.
 */
export function RentMovieButton({ title }: { title: string }) {
  const { user, requireAuth } = useAuth();
  const [step, setStep] = useState<RentStep>(null);
  const [rented, setRented] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const handleConfirm = () => {
    setRented(true);
    if (user?.goAppActivated) {
      // Random QR утга (демо) — event handler дотор үүсгэнэ (render-ийн гадна)
      setQrValue(`https://go.univision.mn/watch?token=${Math.random().toString(36).slice(2, 12)}`);
      setStep("qr");
    } else {
      setStep("guide");
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={rented}
        onClick={() =>
          requireAuth(() => setStep("confirm"), `“${title}” кино түрээслэхийн тулд нэвтэрнэ үү.`)
        }
        className={`focus-visible:ring-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
          rented
            ? "bg-primary/90 text-primary-foreground cursor-default"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {rented ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            Түрээслэсэн
          </>
        ) : (
          <>
            <Film className="size-4" aria-hidden="true" />
            Кино түрээслэх
          </>
        )}
      </button>

      {step === "confirm" && (
        <RentConfirmDialog title={title} onClose={() => setStep(null)} onConfirm={handleConfirm} />
      )}

      {(step === "qr" || step === "guide") && (
        <RentResultDialog
          variant={step}
          title={title}
          qrValue={qrValue}
          onClose={() => setStep(null)}
        />
      )}
    </>
  );
}

// =====================================================================
// Modal a11y туслах hook — escape, focus trap, scroll lock, focus restore.
// confirm/result dialog-ууд хуваалцана.
// =====================================================================
function useDialogA11y(onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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
    dialogRef.current
      ?.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
      ?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return dialogRef;
}

// =====================================================================
// RENT CONFIRM DIALOG — түрээсийг баталгаажуулах
// =====================================================================
function RentConfirmDialog({
  title,
  onClose,
  onConfirm,
}: {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useDialogA11y(onClose);
  const headingId = useId();

  return (
    <DialogChrome dialogRef={dialogRef} headingId={headingId} onClose={onClose}>
      <div className="flex items-start gap-3">
        <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
          <Film className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id={headingId} className="text-foreground text-lg font-bold tracking-tight">
            Түрээсийг баталгаажуулах
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            <span className="text-foreground font-medium">“{title}”</span> киног түрээслэх гэж
            байна.
          </p>
        </div>
      </div>

      <dl className="bg-muted/50 mt-5 space-y-2 rounded-xl p-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Түрээсийн төлбөр</dt>
          <dd className="text-foreground font-semibold">{RENTAL_PRICE}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Үзэх хугацаа</dt>
          <dd className="text-foreground font-medium">{RENTAL_PERIOD}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="border-border text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Болих
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Check className="size-4" aria-hidden="true" />
          Баталгаажуулах
        </button>
      </div>
    </DialogChrome>
  );
}

// =====================================================================
// RENT RESULT DIALOG — QR (GO идэвхтэй) эсвэл заавар (GO идэвхгүй)
// =====================================================================
function RentResultDialog({
  variant,
  title,
  qrValue,
  onClose,
}: {
  variant: "qr" | "guide";
  title: string;
  qrValue: string;
  onClose: () => void;
}) {
  const dialogRef = useDialogA11y(onClose);
  const headingId = useId();

  if (variant === "qr") {
    return (
      <DialogChrome dialogRef={dialogRef} headingId={headingId} onClose={onClose}>
        <div className="flex flex-col items-center text-center">
          <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <QrCode className="size-6" aria-hidden="true" />
          </span>
          <h2 id={headingId} className="text-foreground mt-4 text-lg font-bold tracking-tight">
            Киногоо үзэх
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            <span className="text-foreground font-medium">“{title}”</span> киног түрээслэлээ.
            Univision GO аппаа нээж, доорх QR кодыг уншуулна уу.
          </p>

          <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <QRCodeSVG value={qrValue} size={168} bgColor="#ffffff" fgColor="#0a1a14" level="M" />
          </div>

          <p className="text-muted-foreground mt-4 text-xs">
            QR-г уншуулсны дараа кино таны GO апп дээр тоглоно.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Ойлголоо
          </button>
        </div>
      </DialogChrome>
    );
  }

  // variant === "guide"
  return (
    <DialogChrome dialogRef={dialogRef} headingId={headingId} onClose={onClose}>
      <div className="flex items-start gap-3">
        <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
          <Smartphone className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id={headingId} className="text-foreground text-lg font-bold tracking-tight">
            Univision GO аппаа идэвхжүүлнэ үү
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            <span className="text-foreground font-medium">“{title}”</span> киног түрээслэлээ.
            Үзэхийн тулд эхлээд Univision GO аппаа идэвхжүүлэх шаардлагатай.
          </p>
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        {[
          "Univision GO аппыг App Store / Google Play-ээс татаж суулгана.",
          "Гэрээний дугаараараа аппдаа нэвтэрнэ.",
          "Идэвхжүүлэлтээ баталгаажуулснаар түрээсэлсэн кино тань харагдана.",
        ].map((stepText, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {i + 1}
            </span>
            <span className="text-foreground leading-relaxed">{stepText}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="border-border text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Дараа болъё
        </button>
        <Link
          href="/univision-go"
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Download className="size-4" aria-hidden="true" />
          Апп идэвхжүүлье
        </Link>
      </div>
    </DialogChrome>
  );
}

// =====================================================================
// DIALOG CHROME — backdrop + card + хаах товч (бүх rent dialog-ийн бүрхүүл)
// =====================================================================
function DialogChrome({
  dialogRef,
  headingId,
  onClose,
  children,
}: {
  dialogRef: React.RefObject<HTMLDivElement | null>;
  headingId: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Хаах"
        onClick={onClose}
        className="animate-in fade-in-0 absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm duration-300 ease-out"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="bg-card text-card-foreground animate-in fade-in-0 zoom-in-95 relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl duration-300 ease-out sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Хаах"
          className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
