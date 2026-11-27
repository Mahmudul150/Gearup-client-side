import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  size?: "sm" | "md";
}

export function Stars({ rating, size = "sm" }: StarsProps) {
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            size === "sm" ? "size-3.5" : "size-5",
            value <= rating ? "fill-primary text-primary" : "text-muted-foreground"
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}
