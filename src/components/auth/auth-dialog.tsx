"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { LogIn, User, X } from "lucide-react";

import { DEMO_ACCOUNTS, type AuthUser } from "@/components/auth/accounts";

/**
 * Нэвтрэх dialog (mock). Аль ч талбарыг бөглөөд "Нэвтрэх" дарвал нэвтэрсэнд
 * тооцно. Жинхэнэ backend холбогдоход `onLogin`-ийг API хариугаар солино.
 */
export function AuthDialog({
  onClose,
  onLogin,
}: {
  /** Яагаад нэвтрэх шаардлагатайг тайлбарлах мессеж (одоогоор UI-д харуулахгүй) */
  reason?: string;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const headingId = useId();

  // Escape, focus trap, scroll lock, focus restore (dialog нь нээгдэх үедээ
  // шинээр mount хийгддэг тул state автоматаар цэвэрхэн эхэлнэ)
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
          'button, input, [href], [tabindex]:not([tabindex="-1"])',
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
    firstFieldRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = identifier.trim();
    if (!id || !password.trim()) {
      setError("Утас/имэйл болон нууц үгээ оруулна уу.");
      return;
    }
    const name = id.includes("@") ? id.split("@")[0] : id;
    onLogin({ name, goAppActivated: false });
    setIdentifier("");
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Хаах"
        onClick={onClose}
        className="animate-in fade-in-0 absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm duration-300 ease-out"
      />

      {/* Контент */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="bg-card text-card-foreground animate-in fade-in-0 zoom-in-95 relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl duration-300 ease-out sm:p-8"
      >
        {/* Хаах товч */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Хаах"
          className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {/* Толгой */}
        <div className="flex flex-col items-center text-center">
          <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <User className="size-6" aria-hidden="true" />
          </span>
          <h2 id={headingId} className="text-foreground mt-4 text-3xl font-bold tracking-tight">
            Нэвтрэх
          </h2>
          {/* <p className="text-muted-foreground mt-1.5 text-sm">
            {reason ?? "Univision бүртгэлээрээ нэвтэрнэ үү."}
          </p> */}
        </div>

        {/* Форм */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="auth-identifier" className="text-foreground text-sm font-medium">
              Гэрээний дугаар / Админ дугаар
            </label>
            <input
              ref={firstFieldRef}
              id="auth-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError(null);
              }}
              placeholder="35xxxxxx эсвэл 88xxxxxx"
              className="border-input bg-background focus-visible:ring-ring mt-1.5 h-11 w-full rounded-lg border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="text-foreground text-sm font-medium">
              Нууц үг
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Нууц үгээ оруулна уу"
              className="border-input bg-background focus-visible:ring-ring mt-1.5 h-11 w-full rounded-lg border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Нэвтрэх
          </button>
        </form>

        {/* Demo хэрэглэгчээр түргэн нэвтрэх — 2 төрлийн account */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="bg-border h-px flex-1" aria-hidden="true" />
            <span className="text-muted-foreground text-xs">Демо хэрэглэгчээр</span>
            <span className="bg-border h-px flex-1" aria-hidden="true" />
          </div>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => onLogin(DEMO_ACCOUNTS.activated)}
              className="border-border hover:bg-muted focus-visible:ring-ring flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="font-medium">{DEMO_ACCOUNTS.activated.name}</span>
              <span className="text-primary text-xs font-semibold">GO идэвхтэй</span>
            </button>
            <button
              type="button"
              onClick={() => onLogin(DEMO_ACCOUNTS.notActivated)}
              className="border-border hover:bg-muted focus-visible:ring-ring flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="font-medium">{DEMO_ACCOUNTS.notActivated.name}</span>
              <span className="text-muted-foreground text-xs font-semibold">GO идэвхгүй</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
