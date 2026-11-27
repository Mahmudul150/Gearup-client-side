import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { gearHref, type GearSearchParams } from "@/lib/gear-query";
import { cn } from "@/lib/utils";

interface PaginationProps {
  params: GearSearchParams;
  page: number;
  totalPage: number;
}

function pageWindow(page: number, totalPage: number): number[] {
  const start = Math.max(1, Math.min(page - 2, totalPage - 4));
  const end = Math.min(totalPage, start + 4);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

export function Pagination({ params, page, totalPage }: PaginationProps) {
  if (totalPage <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1 pt-6" aria-label="Pagination">
      <Link
        href={gearHref(params, { page: page - 1 })}
        aria-disabled={page <= 1}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          page <= 1 && "pointer-events-none opacity-50"
        )}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </Link>

      {pageWindow(page, totalPage).map((p) => (
        <Link
          key={p}
          href={gearHref(params, { page: p })}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            buttonVariants({ variant: p === page ? "default" : "outline", size: "icon" })
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={gearHref(params, { page: page + 1 })}
        aria-disabled={page >= totalPage}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          page >= totalPage && "pointer-events-none opacity-50"
        )}
      >
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </nav>
  );
}
