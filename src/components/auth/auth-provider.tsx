"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import type { AuthUser } from "@/components/auth/accounts";

export type { AuthUser };

/**
 * Энгийн client-side (mock) authentication. Жинхэнэ backend байхгүй тул
 * хэрэглэгчийн төлвийг localStorage-д хадгална. Дараа нь жинхэнэ API
 * холбогдоход зөвхөн `login`/`logout` дотор сольж тавина.
 */

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Нэвтрэх (mock) — хэрэглэгчийн мэдээллээр */
  login: (user: AuthUser) => void;
  /** Гарах */
  logout: () => void;
  /** Login dialog-ийг шууд нээх (header дээрх account дарах гэх мэт) */
  openLogin: (reason?: string) => void;
  /**
   * Нэвтэрсэн тохиолдолд `action`-ийг шууд гүйцэтгэнэ. Эс бөгөөс login dialog
   * нээж, амжилттай нэвтэрсний дараа `action`-ийг гүйцэтгэнэ (жишээ нь багц
   * идэвхжүүлэх).
   */
  requireAuth: (action: () => void, reason?: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "univision-auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const pendingAction = useRef<(() => void) | null>(null);

  // localStorage-аас сэргээх (зөвхөн client дээр)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // SSR-safe hydration — эхэнд logged-out, mount-ийн дараа сэргээнэ
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      // зөрчилтэй өгөгдөл — алгасна
    }
  }, []);

  const login = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      // localStorage боломжгүй — алгасна
    }
    setDialogOpen(false);
    setReason(undefined);

    // Хүлээгдэж буй үйлдэл (жишээ нь багц идэвхжүүлэх) байвал гүйцэтгэнэ
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // алгасна
    }
  }, []);

  const openLogin = useCallback((r?: string) => {
    pendingAction.current = null;
    setReason(r);
    setDialogOpen(true);
  }, []);

  const requireAuth = useCallback(
    (action: () => void, r?: string) => {
      if (user) {
        action();
        return;
      }
      pendingAction.current = action;
      setReason(r);
      setDialogOpen(true);
    },
    [user],
  );

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setReason(undefined);
    pendingAction.current = null;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), login, logout, openLogin, requireAuth }}
    >
      {children}
      {dialogOpen && <AuthDialog reason={reason} onClose={closeDialog} onLogin={login} />}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth-ийг AuthProvider дотор ашиглана уу");
  }
  return ctx;
}
