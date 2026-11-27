"use client";

import { useActionState, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { createReview, type ReviewFormState } from "@/actions/review";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ReviewForm({ gearId }: { gearId: string }) {
  const [state, formAction, isPending] = useActionState(submitAction, null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  async function submitAction(
    prev: ReviewFormState | null,
    formData: FormData
  ): Promise<ReviewFormState> {
    const result = await createReview(prev, formData);
    if (result.success) {
      toast.success("Review submitted", {
        description: "Thanks for sharing your experience!",
      });
      setRating(0);
    }
    return result;
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border p-4">
      <input type="hidden" name="gearId" value={gearId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="space-y-1.5">
        <Label>Your rating</Label>
        <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "size-6",
                  (hovered || rating) >= value
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="comment">Comment (optional)</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="How was the gear?"
          rows={3}
        />
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending || rating === 0}>
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {isPending ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
