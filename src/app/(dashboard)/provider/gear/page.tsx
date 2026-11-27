import type { Metadata } from "next";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { GearFormDialog } from "@/components/provider/gear-form-dialog";
import { DeleteGearDialog } from "@/components/provider/delete-gear-dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiData } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Category, GearItem, GearListResponse } from "@/types";

export const metadata: Metadata = { title: "My Gear" };

async function getMyGear(providerId: string): Promise<GearItem[]> {
  try {
    const res = await apiData<GearListResponse>(
      "/api/gear?limit=100&page=1&sortBy=createdAt&sortOrder=desc"
    );
    return res.data.filter((gear) => gear.providerId === providerId);
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    return await apiData<Category[]>("/api/category");
  } catch {
    return [];
  }
}

export default async function ProviderGearPage() {
  const session = await getSession();
  const [gear, categories] = await Promise.all([
    session ? getMyGear(session.id) : Promise.resolve([]),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My gear</h1>
          <p className="text-sm text-muted-foreground">
            {gear.length} listing{gear.length === 1 ? "" : "s"}
          </p>
        </div>
        <GearFormDialog categories={categories} />
      </div>

      {gear.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <PackageOpen className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No gear listed yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first item to start receiving rental orders.
              </p>
            </div>
            <Link href="/provider/orders" className={cn(buttonVariants({ variant: "outline" }))}>
              View orders
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price/day</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gear.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.category?.name ?? "—"}
                      </TableCell>
                      <TableCell>৳{item.pricePerDay}</TableCell>
                      <TableCell className="text-center">{item.stock}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-transparent",
                            item.isAvailable
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                          )}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <GearFormDialog categories={categories} gear={item} />
                          <DeleteGearDialog gearId={item.id} gearName={item.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
