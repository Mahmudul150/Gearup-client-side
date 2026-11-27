import type { Metadata } from "next";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { PaymentStatusBadge } from "@/components/common/status-badge";
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
import type { Payment } from "@/types";

export const metadata: Metadata = { title: "Payments" };

async function getPayments(): Promise<Payment[]> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return [];
  try {
    return await apiData<Payment[]>("/api/payments", { cookie: cookieHeader });
  } catch {
    return [];
  }
}

export default async function CustomerPaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          {payments.length} transaction{payments.length === 1 ? "" : "s"} total
        </p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Wallet className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No payments yet</p>
              <p className="text-sm text-muted-foreground">
                Your payment history will show up here.
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
                    <TableHead>Transaction</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="max-w-40 truncate font-mono text-xs">
                        {payment.transactionId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        #{payment.rentalOrderId.slice(0, 8)}…
                      </TableCell>
                      <TableCell className="font-medium">
                        ৳{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{payment.provider}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(
                          payment.paidAt ?? payment.createdAt
                        ).toLocaleDateString()}
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
