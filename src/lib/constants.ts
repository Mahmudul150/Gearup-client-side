import type { Role } from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Browse Gear" },
  { href: "/categories", label: "Categories" },
] as const;

export function dashboardPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "PROVIDER":
      return "/provider";
    default:
      return "/customer";
  }
}
