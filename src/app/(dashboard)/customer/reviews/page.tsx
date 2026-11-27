import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import { Stars } from "@/components/review/stars";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiData } from "@/lib/api";
import { getAuthCookieHeader, getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

export const metadata: Metadata = { title: "My Reviews" };

async function getMyReviews(customerId: string): Promise<Review[]> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return [];
  try {
    const all = await apiData<Review[]>("/api/reviews", { cookie: cookieHeader });
    return all.filter((review) => review.customerId === customerId);
  } catch {
    return [];
  }
}

export default async function CustomerReviewsPage() {
  const session = await getSession();
  const reviews = session ? await getMyReviews(session.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My reviews</h1>
        <p className="text-sm text-muted-foreground">
          {reviews.length} review{reviews.length === 1 ? "" : "s"} written
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <MessageSquareQuote className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                You can review gear after it has been returned.
              </p>
            </div>
            <Link href="/gear" className={cn(buttonVariants())}>
              Browse gear
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex-row items-start gap-3 space-y-0">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  {review.gear?.image ? (
                    <Image
                      src={review.gear.image}
                      alt={review.gear.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <MessageSquareQuote className="size-5" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/gear/${review.gearId}`}
                    className="truncate font-semibold hover:underline"
                  >
                    {review.gear?.name ?? "Gear"}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {review.gear?.brand} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Stars rating={review.rating} />
              </CardHeader>
              {review.comment && (
                <CardContent className="text-sm text-muted-foreground">
                  {review.comment}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
