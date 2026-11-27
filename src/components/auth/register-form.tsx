"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { register } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type RoleChoice = "CUSTOMER" | "PROVIDER";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, null);
  const [role, setRole] = useState<RoleChoice>("CUSTOMER");

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="role" value={role} />

      <div className="grid grid-cols-2 gap-2">
        {(
          [
            { value: "CUSTOMER", label: "Customer", hint: "Rent gear" },
            { value: "PROVIDER", label: "Provider", hint: "List gear" },
          ] as const
        ).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setRole(option.value)}
            aria-pressed={role === option.value}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex h-auto flex-col items-start gap-0.5 px-3 py-2 text-left",
              role === option.value && "border-primary bg-primary/5 text-foreground"
            )}
          >
            <span className="text-sm font-semibold">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.hint}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your name" autoComplete="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="01xxxxxxxxx" autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address (optional)</Label>
          <Input id="address" name="address" placeholder="City" autoComplete="street-address" />
        </div>
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already you have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
