import type { Metadata } from "next";
import { PackageOpen } from "lucide-react";
import { Pagination } from "@/components/common/pagination";
import { GearCard } from "@/components/gear/gear-card";
import { GearFilters } from "@/components/gear/gear-filters";
import { GearSearch } from "@/components/gear/gear-search";
import { SortSelect } from "@/components/gear/sort-select";
import { Card, CardContent } from "@/components/ui/card";
import { apiData } from "@/lib/api";
import {
  parseGearSearchParams,
  toApiQuery,
} from "@/lib/gear-query";
import type { Category, GearListResponse } from "@/types";

export const metadata: Metadata = { title: "Browse Gear" };

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

async function getCategories(): Promise<Category[]> {
  try {
    return await apiData<Category[]>("/api/category");
  } catch {
    return [];
  }
}

async function getGear(query: string): Promise<{
  items: GearListResponse["data"];
  totalPage: number;
  total: number;
}> {
  try {
    const res = await apiData<GearListResponse>(`/api/gear?${query}`);
    return {
      items: res.data,
      totalPage: res.meta?.totalPage ?? 1,
      total: res.meta?.total ?? res.data.length,
    };
  } catch {
    return { items: [], totalPage: 1, total: 0 };
  }
}

export default async function GearPage({ searchParams }: { searchParams: PageSearchParams }) {
  const params = parseGearSearchParams(await searchParams);

  const [gear, categories] = await Promise.all([
    getGear(toApiQuery(params)),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse gear</h1>
        <p className="text-sm text-muted-foreground">
          {gear.total} item{gear.total === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <GearSearch params={params} />
        <SortSelect />
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <GearFilters params={params} categories={categories} />

        <div className="space-y-6">
          {gear.items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
                <PackageOpen className="size-10 text-muted-foreground" aria-hidden />
                <div>
                  <p className="font-medium">No gear matches your filters</p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search or clear the filters.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {gear.items.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          )}

          <Pagination params={params} page={params.page} totalPage={gear.totalPage} />
        </div>
      </div>
    </div>
  );
}
