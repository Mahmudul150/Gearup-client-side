import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Dumbbell className="size-4" aria-hidden />
          GearUp
        </div>
        <nav className="flex flex-wrap justify-center gap-4" aria-label="Footer">
          <Link href="/gear" className="transition-colors hover:text-foreground">
            Browse Gear
          </Link>
          <Link href="/categories" className="transition-colors hover:text-foreground">
            Categories
          </Link>
          <Link href="/login" className="transition-colors hover:text-foreground">
            Login
          </Link>
          <Link href="/register" className="transition-colors hover:text-foreground">
            Register
          </Link>
        </nav>
        <p>© {new Date().getFullYear()} GearUp</p>
      </div>
    </footer>
  );
}
