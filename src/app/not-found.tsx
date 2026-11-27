import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="size-12 text-muted-foreground" aria-hidden />
      <div>
        <h1 className="text-2xl font-bold">404 — Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants(), "gap-1.5")}>
        Back to home
      </Link>
    </div>
  );
}
