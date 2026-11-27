"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Mail, User } from "lucide-react";
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
import { dashboardPath } from "@/lib/constants";
import type { Role } from "@/types";

interface UserMenuProps {
  name: string;
  email?: string | null;
  role: Role;
}

/** Client routes that exist in the app and are safe to expose in the user menu. */
const PROFILE_ROUTE = "/profile";
const AVAILABLE_DASHBOARD_ROUTES = ["/admin", "/provider", "/customer"];

function isAvailableRoute(href: string): boolean {
  return AVAILABLE_DASHBOARD_ROUTES.includes(href) || href === PROFILE_ROUTE;
}

export function UserMenu({ name, email, role }: UserMenuProps) {
  const router = useRouter();
  const dashboardHref = dashboardPath(role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="User menu"
        className={`${buttonVariants({ variant: "ghost" })} max-w-40 gap-1.5 px-2`}
      >
        <span className="truncate">{name}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate text-muted-foreground">
            {name} · {role}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {email && (
          <>
            <DropdownMenuItem className="text-muted-foreground">
              <Mail className="mr-2" /> {email}
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
            <User /> Profile
          </DropdownMenuItem>
        )}
        {isAvailableRoute(dashboardHref) && (
          <DropdownMenuItem
            onClick={() => {
              router.push(dashboardHref);
            }}
          >
            <LayoutDashboard /> Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
