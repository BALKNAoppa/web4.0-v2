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

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  openLogin: (reason?: string) => void;
  requireAuth: (action: () => void, reason?: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "univision-auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const pendingAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
    }
  }, []);

  const login = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
    }
    setDialogOpen(false);
    setReason(undefined);

    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
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
