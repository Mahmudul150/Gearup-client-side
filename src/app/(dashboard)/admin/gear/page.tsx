import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { getAuthCookieHeader } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { GearItem } from "@/types";

export const metadata: Metadata = { title: "All Gear" };

async function getAllGear(): Promise<GearItem[]> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return [];
  try {
    return await apiData<GearItem[]>("/api/admin/gear", {
      cookie: cookieHeader,
    });
  } catch {
    return [];
  }
}

export default async function AdminGearPage() {
  const gear = await getAllGear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All gear</h1>
        <p className="text-sm text-muted-foreground">
          {gear.length} listing{gear.length === 1 ? "" : "s"} across the platform
        </p>
      </div>

      {gear.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <PackageSearch className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No gear listed</p>
              <p className="text-sm text-muted-foreground">
                Gear added by providers will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gear</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price/day</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Listed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gear.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{item.provider?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.provider?.email}
                        </p>
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
                      <TableCell className="text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
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
