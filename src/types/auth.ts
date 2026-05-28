/** Mirrors RegisterRequestDto (auth-service) */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

/** Mirrors LoginRequestDto */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Mirrors RefreshTokenRequestDto */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** Mirrors AuthResponseDto — returned raw (not wrapped in ApiResponse) by /auth/* */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

/** Claims carried in the access token (subject = userId) */
export interface JwtClaims {
  sub: string;
  email?: string;
  role?: string;
  exp?: number;
}
