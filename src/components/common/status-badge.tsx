import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus, RentalStatus } from "@/types";

const rentalVariant: Record<RentalStatus, string> = {
  PLACED: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  CONFIRMED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PAID: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  PICKED_UP: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  RETURNED: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  CANCELLED: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const paymentVariant: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  FAILED: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return (
    <Badge variant="outline" className={cn("border-transparent", rentalVariant[status])}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={cn("border-transparent", paymentVariant[status])}>
      {status}
    </Badge>
  );
}
