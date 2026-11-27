import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { getSession } from "@/lib/auth";
import { NAV_LINKS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
        >
          <Dumbbell className="size-5" aria-hidden />
          GearUp
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {session ? (
            <UserMenu name={session.name} email={session.email} role={session.role} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ variant: "default" })}
              >
                Register
              </Link>
            </div>
          )}

          <MobileMenu session={session} />
        </div>
      </div>
    </header>
  );
}
