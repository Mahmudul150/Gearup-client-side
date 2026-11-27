"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import type { UserStatus } from "@/types";

export function UserStatusToggle({
  userId,
  current,
}: {
  userId: string;
  current: UserStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const next: UserStatus = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

  function handleClick() {
    startTransition(async () => {
      const result = await updateUserStatus(userId, next);
      if (result.error) toast.error(result.error);
      else
        toast.success(
          next === "SUSPENDED" ? "User suspended" : "User activated"
        );
    });
  }

  return (
    <Button
      variant={next === "SUSPENDED" ? "destructive" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
      {next === "SUSPENDED" ? "Suspend" : "Activate"}
    </Button>
  );
}
