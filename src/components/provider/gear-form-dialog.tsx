"use client";

import { useActionState, useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { saveGear, type ProviderFormState } from "@/actions/provider";
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
import type { Category, GearItem } from "@/types";

interface GearFormDialogProps {
  categories: Category[];
  gear?: GearItem;
}

export function GearFormDialog({ categories, gear }: GearFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(submitAction, null);

  async function submitAction(
    prev: ProviderFormState | null,
    formData: FormData
  ): Promise<ProviderFormState> {
    const result = await saveGear(prev, formData);
    if (result.success) {
      toast.success(gear ? "Gear updated" : "Gear created");
      setOpen(false);
    }
    return result;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          gear
            ? buttonVariants({ variant: "ghost", size: "icon-sm" })
            : cn(buttonVariants(), "gap-1.5")
        }
        aria-label={gear ? "Edit gear" : "Add gear"}
      >
        {gear ? (
          <Pencil className="size-4" aria-hidden />
        ) : (
          <>
            <Plus className="size-4" aria-hidden />
            Add gear
          </>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{gear ? "Edit gear" : "Add new gear"}</DialogTitle>
          <DialogDescription>
            {gear
              ? "Update the details of your listing."
              : "Fill in the details to list a new item for rent."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {gear && <input type="hidden" name="id" value={gear.id} />}

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={gear?.name} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" defaultValue={gear?.brand} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                name="condition"
                defaultValue={gear?.condition}
                placeholder="e.g. Good"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={gear?.description}
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="pricePerDay">Price/day (৳)</Label>
              <Input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                min={1}
                step="any"
                defaultValue={gear?.pricePerDay}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min={0}
                defaultValue={gear?.stock}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={gear?.categoryId ?? ""}
                required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="" disabled>
                  Select…
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={gear?.image ?? ""}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specifications">Specifications (optional)</Label>
            <Textarea
              id="specifications"
              name="specifications"
              defaultValue={gear?.specifications ?? ""}
              rows={2}
              placeholder="Weight, size, materials…"
            />
          </div>

          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {isPending ? "Saving..." : gear ? "Save changes" : "Create gear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
