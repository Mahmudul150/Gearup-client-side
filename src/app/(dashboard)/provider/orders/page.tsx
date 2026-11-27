import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { PaymentStatusBadge, RentalStatusBadge } from "@/components/common/status-badge";
import { OrderStatusSelect } from "@/components/provider/order-status-select";
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
import { getAuthCookieHeader } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { RentalOrder } from "@/types";

export const metadata: Metadata = { title: "Orders" };

async function getOrders(): Promise<RentalOrder[]> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return [];
  try {
    return await apiData<RentalOrder[]>("/api/provider/orders", {
      cookie: cookieHeader,
    });
  } catch {
    return [];
  }
}

export default async function ProviderOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"} for your gear
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <ClipboardList className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No orders yet</p>
              <p className="text-sm text-muted-foreground">
                Rental orders for your gear will appear here.
              </p>
            </div>
            <Link href="/provider/gear" className={cn(buttonVariants({ variant: "outline" }))}>
              Manage gear
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Gear</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <p className="font-medium">{order.customer?.name ?? "Customer"}</p>
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
                      <TableCell className="text-right">
                        <OrderStatusSelect orderId={order.id} current={order.status} />
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
