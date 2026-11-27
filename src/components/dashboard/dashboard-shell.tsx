"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface DashboardShellProps {
  role: Role;
  name: string;
  email: string;
  children: ReactNode;
}

function NavList({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = navItems(role);

  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserBlock({ name, email }: { name: string; email: string }) {
  return (
    <div className="space-y-0.5 px-3 py-2">
      <p className="truncate text-sm font-semibold">{name}</p>
      <p className="truncate text-xs text-muted-foreground">{email}</p>
    </div>
  );
}

export function DashboardShell({ role, name, email, children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = navItems(role);
  const activeLabel =
    items.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    )?.label ?? "Dashboard";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-muted/30 lg:block">
        <div className="sticky top-14 py-4">
          <UserBlock name={name} email={email} />
          <Separator className="mb-3" />
          <div className="px-3">
            <NavList role={role} />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile bar */}
        <div className="sticky top-14 z-30 flex h-12 items-center justify-between gap-2 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open dashboard menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <span className="text-sm font-semibold">{activeLabel}</span>
          </div>
          <ThemeToggle />
        </div>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r bg-background p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold">GearUp</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <UserBlock name={name} email={email} />
            <Separator className="mb-3" />
            <NavList role={role} onNavigate={() => setOpen(false)} />
            <div className="mt-auto pt-4">
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "outline", className: "w-full" }))}
                onClick={() => setOpen(false)}
              >
                Back to site
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
