"use client";

import { useActionState, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteGear, type ProviderFormState } from "@/actions/provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteGearDialog({
  gearId,
  gearName,
}: {
  gearId: string;
  gearName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(submitAction, null);

  async function submitAction(
    prev: ProviderFormState | null,
    formData: FormData
  ): Promise<ProviderFormState> {
    const result = await deleteGear(prev, formData);
    if (result.success) {
      toast.success("Gear deleted");
      setOpen(false);
    }
    return result;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        aria-label={`Delete ${gearName}`}
      >
        <Trash2 className="size-4 text-destructive" aria-hidden />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete gear?</DialogTitle>
          <DialogDescription>
            &quot;{gearName}&quot; will be permanently removed. This action cannots
            be undone.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={gearId} />
          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
