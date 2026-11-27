import { Loader2 } from "lucide-react";

export default function PaymentLoading() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16">
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
      <p className="mt-4 text-sm text-muted-foreground">Verifying payment...</p>
    </div>
  );
}
