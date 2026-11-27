"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import { dashboardPath } from "@/lib/constants";
import type { AuthTokens, Role } from "@/types";

export interface AuthFormState {
  error?: string;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  redirect("/");
}

async function persistTokens(tokens: AuthTokens): Promise<void> {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const common = { httpOnly: true, sameSite: "lax" as const, secure, path: "/" };

  store.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...common,
    maxAge: 60 * 60 * 24,
  });
  store.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...common,
    maxAge: 60 * 60 * 24 * 7,
  });
}

function roleFromToken(token: string): Role {
  const decoded = jwt.decode(token) as { role?: Role } | null;
  return decoded?.role ?? "CUSTOMER";
}

function safeRedirectPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/login") || raw.startsWith("/register")) {
    return null;
  }
  return raw;
}

export async function login(
  _prev: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let tokens: AuthTokens;
  try {
    const res = await apiFetch<AuthTokens>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokens = res.data;
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  await persistTokens(tokens);
  redirect(safeRedirectPath(formData.get("from")) ?? dashboardPath(roleFromToken(tokens.accessToken)));
}

export async function register(
  _prev: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const role = formData.get("role") === "PROVIDER" ? "PROVIDER" : "CUSTOMER";

  if (!name || !email || !password) {
    return { error: "Name, email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  let tokens: AuthTokens;
  try {
    await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        phone: phone || undefined,
        address: address || undefined,
        role,
      }),
    });
    const res = await apiFetch<AuthTokens>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokens = res.data;
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  await persistTokens(tokens);
  redirect(dashboardPath(role));
}
