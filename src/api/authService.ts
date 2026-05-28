/**
 * authService — maps 1:1 to AuthController (/api/auth)
 * These endpoints return AuthResponseDto directly (not wrapped in ApiResponse)
 * and are public (no Authorization header required).
 */
import { api } from './axiosInstance';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

/** POST /api/auth/register */
export async function register(request: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', request);
  return res.data;
}

/** POST /api/auth/login */
export async function login(request: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', request);
  return res.data;
}

/** POST /api/auth/refresh */
export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
  return res.data;
}

/** POST /api/auth/logout */
export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken });
}
