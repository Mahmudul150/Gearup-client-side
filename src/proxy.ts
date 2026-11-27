import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import type { Role, Session } from "@/types";

const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  PROVIDER: "/provider",
  CUSTOMER: "/customer",
};

interface RouteRule {
  prefix: string;
  roles: Role[];
}

const PROTECTED_ROUTES: RouteRule[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/provider", roles: ["PROVIDER"] },
  { prefix: "/customer", roles: ["CUSTOMER"] },
  { prefix: "/checkout", roles: ["CUSTOMER"] },
  { prefix: "/payment", roles: ["CUSTOMER"] },
  { prefix: "/profile", roles: ["CUSTOMER", "PROVIDER", "ADMIN"] },
];

const GUEST_ONLY_ROUTES = ["/login", "/register"];

function getSessionFromCookie(token: string): Session | null {
  const decoded = jwt.decode(token) as Session | null;
  if (!decoded?.id || !decoded?.role) return null;
  if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
  return decoded;
}

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const session = token ? getSessionFromCookie(token) : null;

  // Logged-in users should not see auth pages again
  if (GUEST_ONLY_ROUTES.some((route) => matches(pathname, route))) {
    if (session) {
      return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
    }
    return NextResponse.next();
  }

  const rule = PROTECTED_ROUTES.find((r) => matches(pathname, r.prefix));
  if (rule) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!rule.roles.includes(session.role)) {
      return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/provider/:path*",
    "/customer/:path*",
    "/checkout/:path*",
    "/payment/:path*",
    "/profile",
    "/login",
    "/register",
  ],
};
