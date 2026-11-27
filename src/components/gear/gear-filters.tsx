import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { gearHref, type GearSearchParams } from "@/lib/gear-query";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface GearFiltersProps {
  params: GearSearchParams;
  categories: Category[];
}

const availabilityOptions = [
  { value: "", label: "All" },
  { value: "true", label: "Available" },
  { value: "false", label: "Unavailable" },
];

export function GearFilters({ params, categories }: GearFiltersProps) {
  const hasFilters = params.q || params.category || params.brand || params.available;

  return (
    <aside className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasFilters && (
          <Link
            href="/gear"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Link>
        )}
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Category</h3>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          <Link
            href={gearHref(params, { category: null, page: null })}
            className={cn(
              "rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
              !params.category && "bg-muted font-medium"
            )}
          >
            All categorie
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={gearHref(params, {
                category: params.category === category.id ? null : category.id,
                page: null,
              })}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                params.category === category.id && "bg-muted font-medium"
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map((option) => (
            <Link
              key={option.value || "all"}
              href={gearHref(params, { available: option.value || null, page: null })}
            >
              <Badge
                variant={params.available === option.value ? "default" : "outline"}
                className="cursor-pointer"
              >
                {option.label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <form action="/gear" method="get" className="space-y-2">
        <input type="hidden" name="q" value={params.q} />
        <input type="hidden" name="category" value={params.category} />
        <input type="hidden" name="available" value={params.available} />
        <input type="hidden" name="sort" value={params.sort} />
        <label htmlFor="brand" className="text-sm font-medium">
          Brand
        </label>
        <div className="flex gap-2">
          <Input
            id="brand"
            name="brand"
            defaultValue={params.brand}
            placeholder="e.g. Nike"
          />
          <Button type="submit" variant="secondary">
            Apply
          </Button>
        </div>
      </form>
    </aside>
  );
}
