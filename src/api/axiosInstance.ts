import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bare client (no interceptors) for the refresh call, to avoid recursion.
const refreshClient = axios.create({ baseURL: BASE_URL });

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];
function isAuthPath(url?: string): boolean {
  return !!url && AUTH_PATHS.some((p) => url.includes(p));
}

// ── Request: attach the access token ────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && !isAuthPath(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: refresh once on 401, then retry; otherwise force logout ────────
type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

function runRefresh(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    refreshPromise = (async () => {
      if (!refreshToken) throw new Error('No refresh token');
      const { data } = await refreshClient.post('/auth/refresh', { refreshToken });
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken as string;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function forceLogout(): void {
  clearTokens();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (RetriableConfig & InternalAxiosRequestConfig) | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthPath(original.url) &&
      getRefreshToken()
    ) {
      original._retry = true;
      try {
        const newToken = await runRefresh();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401 && !isAuthPath(original?.url)) {
      forceLogout();
    }
    return Promise.reject(error);
  },
);
