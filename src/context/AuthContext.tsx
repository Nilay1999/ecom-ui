/**
 * AuthContext — real JWT auth backed by the auth-service.
 * Tokens live in localStorage (see tokenStore); userId/email are decoded from
 * the access token. axiosInstance handles token injection and 401 refresh.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authService';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../api/tokenStore';
import { decodeJwt } from '../utils/jwt';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthState {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

interface SessionUser {
  userId: string;
  email: string | null;
}

function userFromToken(token: string | null): SessionUser | null {
  if (!token) return null;
  const claims = decodeJwt(token);
  if (!claims?.sub) return null;
  return { userId: claims.sub, email: claims.email ?? null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => userFromToken(getAccessToken()));

  function applyTokens(res: AuthResponse) {
    setTokens(res.accessToken, res.refreshToken);
    setUser(userFromToken(res.accessToken));
  }

  async function login(request: LoginRequest) {
    applyTokens(await authApi.login(request));
  }

  async function register(request: RegisterRequest) {
    applyTokens(await authApi.register(request));
  }

  async function logout() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Best-effort server-side revocation; clear locally regardless.
      }
    }
    clearTokens();
    setUser(null);
  }

  // Keep state in sync if another tab logs in/out.
  useEffect(() => {
    function onStorage() {
      setUser(userFromToken(getAccessToken()));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      userId: user?.userId ?? null,
      email: user?.email ?? null,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
