"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Menu } from "lucide-react";
import { logout } from "@/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_LINKS, dashboardPath } from "@/lib/constants";
import type { Role } from "@/types";

interface MobileMenuProps {
  session: { name: string; email?: string | null; role: Role } | null;
}

/** Client routes that exist in the app and are safe to expose in the user menu. */
const PROFILE_ROUTE = "/profile";
const AVAILABLE_DASHBOARD_ROUTES = ["/admin", "/provider", "/customer"];

function isAvailableRoute(href: string): boolean {
  return AVAILABLE_DASHBOARD_ROUTES.includes(href) || href === PROFILE_ROUTE;
}

export function MobileMenu({ session }: MobileMenuProps) {
  const router = useRouter();
  const dashboardHref = session ? dashboardPath(session.role) : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open menu"
        className={`${buttonVariants({ variant: "ghost", size: "icon" })} sm:hidden`}
      >
        <Menu className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {NAV_LINKS.map((link) => (
          <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
            {link.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {session ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate text-muted-foreground">
                {session.name}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {session.email && (
              <>
                <DropdownMenuItem className="text-muted-foreground">
                  <Mail className="mr-2" /> {session.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {isAvailableRoute(PROFILE_ROUTE) && (
              <DropdownMenuItem
                onClick={() => {
                  router.push(PROFILE_ROUTE);
                }}
              >
                Profile
              </DropdownMenuItem>
            )}
            {isAvailableRoute(dashboardHref) && (
              <DropdownMenuItem
                onClick={() => {
                  router.push(dashboardHref);
                }}
              >
                Dashboard
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem render={<Link href="/login" />}>Login</DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/register" />}>
              Register
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
