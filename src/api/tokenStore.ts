/**
 * Token persistence shared by axiosInstance and AuthContext.
 * Kept dependency-free so the axios interceptor can read/write tokens
 * without importing React context (avoids a circular dependency).
 */
const ACCESS_KEY = 'pixelcart-access-token';
const REFRESH_KEY = 'pixelcart-refresh-token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
