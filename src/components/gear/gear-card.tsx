import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { GearItem } from "@/types";

function averageRating(gear: GearItem): number | null {
  const reviews = gear.reviews ?? [];
  if (!reviews.length) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export function GearCard({ gear }: { gear: GearItem }) {
  const rating = averageRating(gear);

  return (
    <Link href={`/gear/${gear.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all group-hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {gear.image ? (
            <Image
              src={gear.image}
              alt={gear.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Dumbbell className="size-10" aria-hidden />
            </div>
          )}
          <Badge
            className="absolute top-2 left-2"
            variant={gear.isAvailable ? "default" : "secondary"}
          >
            {gear.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        <CardContent className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs text-muted-foreground">
              {gear.category?.name ?? "Gear"} · {gear.brand}
            </p>
            {rating !== null && (
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                <Star className="size-3.5 fill-primary text-primary" aria-hidden />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <h3 className="line-clamp-1 font-semibold">{gear.name}</h3>

          <div className="flex items-center justify-between">
            <p className="font-bold">
              ৳{gear.pricePerDay}
              <span className="text-xs font-normal text-muted-foreground">/day</span>
            </p>
            <span className="text-xs text-muted-foreground">{gear.stock} in stock</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
