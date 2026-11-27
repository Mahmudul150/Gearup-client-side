"use client";

import { useActionState, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { createCategory, type AdminFormState } from "@/actions/admin";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function CategoryFormDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(submitAction, null);

  async function submitAction(
    prev: AdminFormState | null,
    formData: FormData
  ): Promise<AdminFormState> {
    const result = await createCategory(prev, formData);
    if (result.success) {
      toast.success("Category created");
      setOpen(false);
    }
    return result;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants(), "gap-1.5")}>
        <Plus className="size-4" aria-hidden />
        Add category
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>
            Categories help customers filter gear easily.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              name="name"
              placeholder="e.g. Camping"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description (optional)</Label>
            <Textarea
              id="category-description"
              name="description"
              rows={3}
              placeholder="Short description…"
            />
          </div>

          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
