import type { JwtClaims } from '../types/auth';

/** Decode a JWT payload without verifying its signature (client-side display only). */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

/** True when the token is absent or past its `exp` (with a small clock-skew margin). */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const claims = decodeJwt(token);
  if (!claims?.exp) return true;
  return claims.exp * 1000 <= Date.now() + 5000;
}
