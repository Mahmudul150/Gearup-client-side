"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function PaymentToast({ success }: { success: boolean }) {
  useEffect(() => {
    if (success) {
      toast.success("Payment successful", {
        description: "Your rental is being confirmed.",
      });
    } else {
      toast.error("Payment cancelled", {
        description: "You can try again anytime.",
      });
    }
  }, [success]);

  return null;
}
