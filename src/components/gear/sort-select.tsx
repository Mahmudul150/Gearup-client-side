"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/gear-query";

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("sort") || "newest";
  const label =
    SORT_OPTIONS.find((option) => option.value === current)?.label ?? "Newest";

  function handleChange(value: string | null) {
    if (!value) return;
    const next = new URLSearchParams(searchParams.toString());
    if (value === "newest") next.delete("sort");
    else next.set("sort", value);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger size="sm" aria-label="Sort gear" className="w-44">
        {label}
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
