import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import { verifyPaymentSession } from "@/actions/payment";
import { PaymentToast } from "@/components/payment/payment-toast";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { apiData } from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/auth";
import type { Payment } from "@/types";

export const metadata: Metadata = { title: "Payment" };

type QueryValue = string | string[] | undefined;
type PageSearchParams = Promise<{
  success?: QueryValue;
  session_id?: QueryValue;
  rentalId?: QueryValue;
}>;

const firstValue = (value: QueryValue) =>
  Array.isArray(value) ? value[0] : value;

async function loadPaymentByRentalId(
  rentalId: string
): Promise<{ payment: Payment | null; error: string | null }> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) {
    return { payment: null, error: "Please login to continue." };
  }

  try {
    const payment = await apiData<Payment>(
      `/api/payments/rental/${rentalId}`,
      { cookie: cookieHeader }
    );
    return { payment, error: null };
  } catch {
    return { payment: null, error: "Unable to load payment details." };
  }
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const params = await searchParams;
  const sessionId = firstValue(params.session_id);
  const rentalId = firstValue(params.rentalId);

  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) {
    const from = rentalId ? `/payment?rentalId=${rentalId}` : "/payment";
    redirect(`/login?from=${encodeURIComponent(from)}`);
  }

  let payment: Payment | null = null;
  let error: string | null = null;

  if (sessionId) {
    // Never trust success=true — verify the session with Stripe on the server.
    const result = await verifyPaymentSession(sessionId);
    payment = result.payment;
    error = result.error;
  } else if (rentalId) {
    // Legacy/cancel redirects without a session ID: read the stored status only.
    const result = await loadPaymentByRentalId(rentalId);
    payment = result.payment;
    error = result.error;
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16">
        <Card className="w-full text-center">
          <CardHeader className="items-center">
            <CircleX className="size-12 text-destructive" aria-hidden />
            <CardTitle className="text-xl">Payment could not be verified</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link
              href={rentalId ? `/checkout?rentalId=${rentalId}` : "/customer/rentals"}
              className={cn(buttonVariants({ className: "w-full" }))}
            >
              Try again
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost", className: "w-full" }))}
            >
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = payment?.status === "COMPLETED";
  const isPending = payment?.status === "PENDING";
  const amount = payment?.amount ?? 0;
  const rental = payment?.rentalOrder;
  const retryHref = rentalId
    ? `/checkout?rentalId=${rentalId}`
    : "/customer/rentals";
  const refreshHref = sessionId
    ? `/payment?session_id=${sessionId}`
    : `/payment?rentalId=${rentalId ?? ""}`;

  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16">
      {sessionId && !isPending && <PaymentToast success={isSuccess} />}

      <Card className="w-full text-center">
        <CardHeader className="items-center">
          {isSuccess ? (
            <CircleCheck className="size-12 text-primary" aria-hidden />
          ) : isPending ? (
            <Clock className="size-12 text-muted-foreground" aria-hidden />
          ) : (
            <CircleX className="size-12 text-destructive" aria-hidden />
          )}
          <CardTitle className="text-xl">
            {isSuccess
              ? "Payment successful"
              : isPending
                ? "Payment pending"
                : "Payment cancelled"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "Your payment has been verified and your rental is confirmed."
              : isPending
                ? "Your payment is still being confirmed. Please check again shortly."
                : "Your payment was not completed. No money was charged."}
          </CardDescription>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent className="flex flex-col gap-3">
          {payment && (
            <dl className="w-full space-y-2 text-left">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="text-sm font-medium">
                  <Badge
                    variant={
                      isSuccess ? "default" : isPending ? "secondary" : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Amount</dt>
                <dd className="text-sm font-medium">৳{amount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Transaction</dt>
                <dd className="max-w-xs truncate text-sm">{payment.transactionId}</dd>
              </div>
              {rental && (
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Rental</dt>
                  <dd className="max-w-xs truncate text-sm">
                    #{rental.id.slice(0, 8)}…
                  </dd>
                </div>
              )}
            </dl>
          )}
        </CardContent>
        <CardContent className="flex flex-col gap-2">
          {isSuccess ? (
            <>
              <Link
                href="/customer/rentals"
                className={cn(buttonVariants({ className: "w-full" }))}
              >
                View my rentals
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", className: "w-full" }))}
              >
                Back to home
              </Link>
            </>
          ) : isPending ? (
            <>
              <Link href={refreshHref} className={cn(buttonVariants({ className: "w-full" }))}>
                Check again
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", className: "w-full" }))}
              >
                Back to home
              </Link>
            </>
          ) : (
            <>
              <Link href={retryHref} className={cn(buttonVariants({ className: "w-full" }))}>
                Try again
              </Link>
              <Link
                href="/gear"
                className={cn(buttonVariants({ variant: "ghost", className: "w-full" }))}
              >
                Browse gear
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
