import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GearSearchParams } from "@/lib/gear-query";

interface GearSearchProps {
  params: GearSearchParams;
}

export function GearSearch({ params }: GearSearchProps) {
  return (
    <form action="/gear" method="get" className="flex flex-1 gap-2">
      <input type="hidden" name="category" value={params.category} />
      <input type="hidden" name="brand" value={params.brand} />
      <input type="hidden" name="available" value={params.available} />
      <input type="hidden" name="sort" value={params.sort} />
      <div className="relative flex-1">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          name="q"
          defaultValue={params.q}
          placeholder="Search gear, brands..."
          className="pl-9"
          aria-label="Search gear"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
