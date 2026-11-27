import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Calendar,
  Package,
  Star,
} from "lucide-react";
import { ReviewForm } from "@/components/gear/review-form";
import { RentPanel } from "@/components/gear/rent-panel";
import { Stars } from "@/components/review/stars";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiData } from "@/lib/api";
import { getSession } from "@/lib/auth";
import type { GearItem, Review } from "@/types";

type PageParams = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { id } = await params;
  const gear = await apiData<GearItem>(`/api/gear/${id}`).catch(() => null);
  return { title: gear ? gear.name : "Gear details" };
}

async function getGearReviews(gearId: string): Promise<Review[]> {
  try {
    const all = await apiData<Review[]>("/api/reviews");
    return all.filter((review) => review.gearId === gearId);
  } catch {
    return [];
  }
}

export default async function GearDetailsPage({ params }: { params: PageParams }) {
  const { id } = await params;

  const gear = await apiData<GearItem>(`/api/gear/${id}`).catch(() => null);
  if (!gear) notFound();

  const [reviews, session] = await Promise.all([
    getGearReviews(gear.id),
    getSession(),
  ]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <Link
        href="/gear"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to gear
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main info */}
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
            {gear.image ? (
              <Image
                src={gear.image}
                alt={gear.name}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Package className="size-12" aria-hidden />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={gear.isAvailable ? "default" : "secondary"}>
                {gear.isAvailable ? "Available" : "Unavailable"}
              </Badge>
              <Badge variant="outline">{gear.condition}</Badge>
              <Badge variant="outline">{gear.stock} in stock</Badge>
              {avgRating !== null && (
                <span className="flex items-center gap-1 text-sm font-medium">
                  <Star className="size-4 fill-primary text-primary" aria-hidden />
                  {avgRating.toFixed(1)}
                  <span className="text-muted-foreground">({reviews.length})</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{gear.name}</h1>
            <p className="text-muted-foreground">
              {gear.brand} · {gear.category?.name ?? "Uncategorized"}
            </p>
            <p className="whitespace-pre-line leading-relaxed text-balance">
              {gear.description}
            </p>
          </div>

          {gear.specifications && (
            <>
              <Separator />
              <div>
                <h2 className="mb-2 font-semibold">Specifications</h2>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {gear.specifications}
                </p>
              </div>
            </>
          )}

          {gear.provider && (
            <>
              <Separator />
              <div className="flex items-center gap-3 text-sm">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <Building2 className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="font-medium">Provided by {gear.provider.name}</p>
                  <p className="text-muted-foreground">{gear.provider.email}</p>
                </div>
                <BadgeCheck className="ml-auto size-4 text-primary" aria-hidden />
              </div>
            </>
          )}
        </div>

        {/* Rent sidebar */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <RentPanel
            gearId={gear.id}
            pricePerDay={gear.pricePerDay}
            stock={gear.stock}
            isAvailable={gear.isAvailable}
            isLoggedIn={!!session}
            isCustomer={session?.role === "CUSTOMER"}
          />
        </div>
      </div>

      {/* Reviews */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
          {reviews.length > 0 && (
            <Badge variant="secondary">{reviews.length}</Badge>
          )}
        </div>

        {session?.role === "CUSTOMER" && <ReviewForm gearId={gear.id} />}

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No reviews yet — be the first to review after your rental.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm">
                      {review.customer?.name ?? "Customer"}
                    </CardTitle>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" aria-hidden />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardDescription>
                    <Stars rating={review.rating} />
                  </CardDescription>
                </CardHeader>
                {review.comment && (
                  <CardContent className="text-sm">{review.comment}</CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
