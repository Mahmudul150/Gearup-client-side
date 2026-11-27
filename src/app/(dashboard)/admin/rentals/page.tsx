import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { PaymentStatusBadge, RentalStatusBadge } from "@/components/common/status-badge";
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
import type { RentalOrder } from "@/types";

export const metadata: Metadata = { title: "All Rentals" };

async function getAllRentals(): Promise<RentalOrder[]> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return [];
  try {
    return await apiData<RentalOrder[]>("/api/admin/rentals", {
      cookie: cookieHeader,
    });
  } catch {
    return [];
  }
}

export default async function AdminRentalsPage() {
  const rentals = await getAllRentals();

  const revenue = rentals
    .filter((r) => r.payment?.status === "COMPLETED")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All rentals</h1>
        <p className="text-sm text-muted-foreground">
          {rentals.length} rental{rentals.length === 1 ? "" : "s"} · ৳
          {revenue.toLocaleString()} completed revenue
        </p>
      </div>

      {rentals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <ScrollText className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No rentals yet</p>
              <p className="text-sm text-muted-foreground">
                Rental orders across the platform will appear here.
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Gear</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <p className="font-medium">
                          {order.customer?.name ?? "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer?.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p>{order.gear?.name ?? "Gear"}</p>
                        <p className="text-xs text-muted-foreground">
                          × {order.quantity}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.gear?.provider?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.startDate).toLocaleDateString()} –{" "}
                        {new Date(order.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ৳{order.totalPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {order.payment ? (
                          <PaymentStatusBadge status={order.payment.status} />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <RentalStatusBadge status={order.status} />
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
