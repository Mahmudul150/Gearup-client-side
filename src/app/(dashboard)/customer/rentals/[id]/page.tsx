import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard } from "lucide-react";
import { PaymentStatusBadge, RentalStatusBadge } from "@/components/common/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiData } from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { RentalOrder } from "@/types";

export const metadata: Metadata = { title: "Rental details" };

type PageParams = Promise<{ id: string }>;

async function getRental(id: string): Promise<RentalOrder | null> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return null;
  try {
    return await apiData<RentalOrder>(`/api/rentals/${id}`, {
      cookie: cookieHeader,
    });
  } catch {
    return null;
  }
}

export default async function RentalDetailsPage({ params }: { params: PageParams }) {
  const { id } = await params;
  const rental = await getRental(id);
  if (!rental) notFound();

  const needsPayment = rental.status === "PLACED" && !rental.payment;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/customer/rentals"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to rentals
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {rental.gear?.name ?? "Rental order"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Order #{rental.id.slice(0, 8)}…
          </p>
        </div>
        <RentalStatusBadge status={rental.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order details</CardTitle>
          <CardDescription>Rental timeline and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Start date</dt>
              <dd className="font-medium">
                {new Date(rental.startDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">End date</dt>
              <dd className="font-medium">
                {new Date(rental.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Quantity</dt>
              <dd className="font-medium">{rental.quantity}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total price</dt>
              <dd className="font-medium">৳{rental.totalPrice.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Returned at</dt>
              <dd className="font-medium">
                {rental.returnedAt
                  ? new Date(rental.returnedAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Placed on</dt>
              <dd className="font-medium">
                {new Date(rental.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment</span>
            {rental.payment ? (
              <PaymentStatusBadge status={rental.payment.status} />
            ) : (
              <span className="text-sm text-muted-foreground">Not initiated</span>
            )}
          </div>
        </CardContent>
      </Card>

      {needsPayment && (
        <Link
          href={`/checkout?rentalId=${rental.id}`}
          className={cn(buttonVariants({ size: "lg", className: "w-full gap-2" }))}
        >
          <CreditCard className="size-4" aria-hidden />
          Complete payment
        </Link>
      )}
    </div>
  );
}
