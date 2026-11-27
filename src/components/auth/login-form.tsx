"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      {from && <input type="hidden" name="from" value={from} />}

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
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {isPending ? "Signing in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
