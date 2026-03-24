/**
 * AuthContext — stub for future authentication.
 * Currently stores a userId in memory; wire up a real auth flow later.
 */
import React, { createContext, useContext, useState } from 'react';

interface AuthState {
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(
    // TODO: restore from localStorage when real auth is added
    null,
  );
  const [token, setToken] = useState<string | null>(null);

  function login(uid: string, tok: string) {
    setUserId(uid);
    setToken(tok);
  }

  function logout() {
    setUserId(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ userId, token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
