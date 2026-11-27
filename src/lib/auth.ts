import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { apiData } from "@/lib/api";
import type { Role, Session, User } from "@/types";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

/** Cookie header value to forward to the backend from Server Components / Actions. */
export async function getAuthCookieHeader(): Promise<string | null> {
  const token = await getAccessToken();
  return token ? `${ACCESS_TOKEN_COOKIE}=${token}` : null;
}

/**
 * Decodes the access token without verifying the signature
 * (the backend verifies it). Returns null when absent/expired/invalid.
 */
export async function getSession(): Promise<Session | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const decoded = jwt.decode(token) as Session | null;
  if (!decoded?.id || !decoded?.role) return null;
  if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;

  return decoded;
}

/** Fetches the full user profile from GET /api/auth/me (server-side). */
export async function getCurrentUser(): Promise<User | null> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return null;

  try {
    return await apiData<User>("/api/auth/me", { cookie: cookieHeader });
  } catch {
    return null;
  }
}

export function hasRole(session: Session | null, ...roles: Role[]): boolean {
  return !!session && roles.includes(session.role);
}
