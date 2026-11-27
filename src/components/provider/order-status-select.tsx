"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { RentalStatus } from "@/types";

const STATUS_OPTIONS: { value: RentalStatus; label: string }[] = [
  { value: "CONFIRMED", label: "Confirm" },
  { value: "PICKED_UP", label: "Mark picked up" },
  { value: "RETURNED", label: "Mark returned" },
  { value: "CANCELLED", label: "Cancel" },
];

export function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: RentalStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value || value === current) return;
    const status = value as RentalStatus;
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.error) toast.error(result.error);
      else toast.success(`Order marked ${status.replace(/_/g, " ").toLowerCase()}`);
    });
  }

  return (
    <Select value={current} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger size="sm" className="w-44" aria-label="Update order status">
        {current.replace(/_/g, " ")}
      </SelectTrigger>
      <SelectContent align="end">
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
