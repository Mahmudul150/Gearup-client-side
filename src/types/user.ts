export type Role = "ADMIN" | "CUSTOMER" | "PROVIDER";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string | null;
  address?: string | null;
  profileImage?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: Extract<Role, "CUSTOMER" | "PROVIDER">;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  accessToken?: string;
}

/** Decoded JWT payload stored in the httpOnly `accessToken` cookie. */
export interface Session {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  profileImage?: string | null;
  role: Role;
  iat?: number;
  exp?: number;
}
