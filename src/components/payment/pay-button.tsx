"use client";

import { useActionState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { initiatePayment } from "@/actions/payment";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function PayButton({ rentalId, amount }: { rentalId: string; amount: number }) {
  const [state, formAction, isPending] = useActionState(initiatePayment, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="rentalId" value={rentalId} />
      <Button type="submit" size="lg" className="w-full gap-2" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <CreditCard className="size-4" aria-hidden />
        )}
        {isPending
          ? "Redirecting to Stripe..."
          : `Pay ৳${amount.toLocaleString()} with Stripe`}
      </Button>
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
