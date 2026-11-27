import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { RentalStatusBadge } from "@/components/common/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import type { RentalOrder } from "@/types";

export const metadata: Metadata = { title: "My Rentals" };

async function getRentals(): Promise<RentalOrder[]> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return [];
  try {
    return await apiData<RentalOrder[]>("/api/rentals", { cookie: cookieHeader });
  } catch {
    return [];
  }
}

export default async function CustomerRentalsPage() {
  const rentals = await getRentals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My rentals</h1>
        <p className="text-sm text-muted-foreground">
          {rentals.length} order{rentals.length === 1 ? "" : "s"} total
        </p>
      </div>

      {rentals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <CalendarDays className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No rentals yet</p>
              <p className="text-sm text-muted-foreground">
                Rent some gear to see your orders here.
              </p>
            </div>
            <Link href="/gear" className={cn(buttonVariants())}>
              Browse gear
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
                    <TableHead>Gear</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">
                        {rental.gear?.name ?? "Gear"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(rental.startDate).toLocaleDateString()} –{" "}
                        {new Date(rental.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">{rental.quantity}</TableCell>
                      <TableCell>৳{rental.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <RentalStatusBadge status={rental.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/customer/rentals/${rental.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" })
                          )}
                        >
                          View
                        </Link>
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
