import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { PayButton } from "@/components/payment/pay-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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

export const metadata: Metadata = { title: "Checkout" };

type PageSearchParams = Promise<{ rentalId?: string }>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { rentalId } = await searchParams;
  if (!rentalId) redirect("/gear");

  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) redirect(`/login?from=/checkout?rentalId=${rentalId}`);

  const rental = await apiData<RentalOrder>(`/api/rentals/${rentalId}`, {
    cookie: cookieHeader,
  }).catch(() => null);
  if (!rental) notFound();

  if (rental.payment) {
    redirect(`/payment?success=true&rentalId=${rental.id}`);
  }

  const days = Math.ceil(
    (new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Review your rental order before paying
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
          <CardDescription>Rental #{rental.id.slice(0, 8)}…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{rental.gear?.name ?? "Gear"}</p>
              <p className="text-sm text-muted-foreground">
                {rental.gear?.brand} · {rental.gear?.category?.name}
              </p>
            </div>
            <Badge variant="outline">{rental.status}</Badge>
          </div>

          <Separator />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Start date</dt>
              <dd className="font-medium">
                {new Date(rental.startDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">End date</dt>
              <dd className="font-medium">
                {new Date(rental.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="font-medium">
                {days} day{days > 1 ? "s" : ""}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Quantity</dt>
              <dd className="font-medium">{rental.quantity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rate</dt>
              <dd className="font-medium">৳{rental.gear?.pricePerDay}/day</dd>
            </div>
          </dl>

          <Separator />

          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>৳{rental.totalPrice.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <PayButton rentalId={rental.id} amount={rental.totalPrice} />
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden />
          Secured by Stripe — you will be redirected to their checkout page
        </p>
      </div>

      <Alert>
        <ShieldCheck className="size-4" aria-hidden />
        <AlertDescription>
          Your rental status stays <strong>PLACED</strong> until Stripe confirms
          the payment, then it becomes <strong>PAID</strong>.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <Link
          href={`/gear/${rental.gearId}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
