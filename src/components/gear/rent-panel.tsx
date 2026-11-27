"use client";

import Link from "next/link";
import { useActionState, useSyncExternalStore, useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { createRental } from "@/actions/rental";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useToday(): string {
  return useSyncExternalStore(
    emptySubscribe,
    () => new Date().toISOString().split("T")[0],
    () => ""
  );
}

interface RentPanelProps {
  gearId: string;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  isLoggedIn: boolean;
  isCustomer: boolean;
}

function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function RentPanel({
  gearId,
  pricePerDay,
  stock,
  isAvailable,
  isLoggedIn,
  isCustomer,
}: RentPanelProps) {
  const [state, formAction, isPending] = useActionState(createRental, null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const today = useToday();

  const days = daysBetween(startDate, endDate);
  const total = days > 0 ? days * pricePerDay * quantity : 0;
  const canRent = isAvailable && stock > 0 && isLoggedIn && isCustomer;

  if (!isLoggedIn) {
    return (
      <div className="space-y-3 rounded-xl border p-4">
        <p className="text-sm text-muted-foreground">
          Login as a customer to rent this gear.
        </p>
        <Link
          href={`/login?from=/gear/${gearId}`}
          className={cn(buttonVariants({ className: "w-full" }))}
        >
          Login to rent
        </Link>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="rounded-xl border p-4 text-sm text-muted-foreground">
        Only customers can rent gear. Switch to a customer account to continue.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border p-4">
      <input type="hidden" name="gearId" value={gearId} />

      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold">
          ৳{pricePerDay}
          <span className="text-sm font-normal text-muted-foreground">/day</span>
        </p>
        <span className="text-xs text-muted-foreground">{stock} in stock</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">End</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={stock}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
        <span className="text-muted-foreground">
          {days > 0 ? `${days} day${days > 1 ? "s" : ""} × ৳${pricePerDay} × ${quantity}` : "Pick dates to see total"}
        </span>
        <span className="font-semibold">৳{total.toLocaleString()}</span>
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!canRent || isPending || days <= 0 || !isAvailable}
      >
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        <ShoppingCart className="size-4" aria-hidden />
        {isPending ? "Placing order..." : "Rent now"}
      </Button>

      {!isAvailable && (
        <p className="text-center text-xs text-destructive">
          This gear is currently unavailable.
        </p>
      )}
    </form>
  );
}
