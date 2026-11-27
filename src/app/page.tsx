import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  RotateCcw,
  Search,
  ShieldCheck,
  Star,
  Tent,
} from "lucide-react";
import { GearCard } from "@/components/gear/gear-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiData } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Category, GearListResponse } from "@/types";

async function getFeaturedGear(): Promise<GearListResponse["data"]> {
  try {
    const res = await apiData<GearListResponse>(
      "/api/gear?limit=8&page=1&sortBy=createdAt&sortOrder=desc"
    );
    return res.data;
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    return await apiData<Category[]>("/api/category");
  } catch {
    return [];
  }
}

const steps = [
  {
    icon: Search,
    title: "Browse & book",
    description: "Search gear by category, brand and availability, then pick your dates.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    description: "Complete your rental with Stripe — fast and protected.",
  },
  {
    icon: RotateCcw,
    title: "Return & review",
    description: "Drop the gear back and leave a review to help others.",
  },
];

export default async function Home() {
  const [gear, categories] = await Promise.all([getFeaturedGear(), getCategories()]);

  return (
    <div className="space-y-16 py-10 sm:py-14">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center">
          <Badge variant="secondary" className="gap-1.5">
            <Tent className="size-3.5" aria-hidden />
            Rent sports & outdoor gear instantly
          </Badge>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Gear up for your next adventure without buying a thing
          </h1>
          <p className="max-w-2xl text-muted-foreground sm:text-lg">
            From tents to trekking kits — rent quality equipment from trusted
            providers, pay securely, and return when you are done.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/gear" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              Browse gear
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Become a provider
            </Link>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-6 text-center">
            {[
              { icon: Tent, label: "Outdoor & sports" },
              { icon: ShieldCheck, label: "Secure payments" },
              { icon: CalendarCheck, label: "Flexible rental" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <item.icon className="size-5 text-primary" aria-hidden />
                <dd className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Featured gear */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured gear</h2>
            <p className="text-sm text-muted-foreground">
              The latest items added to the marketplace
            </p>
          </div>
          <Link
            href="/gear"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {gear.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No gear available yet — check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gear.map((item) => (
              <GearCard key={item.id} gear={item} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Browse by category</h2>
            <p className="text-sm text-muted-foreground">
              Find exactly what you need, faster
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/gear?category=${category.id}`}>
                <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-muted">
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <p className="text-sm text-muted-foreground">
            Three simple steps from browsing to returning
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-base">
                  {index + 1}. {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="items-center text-center">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Star className="size-5 fill-current" aria-hidden />
              Ready to rent?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Create a free account and get your first rental going today.
            </CardDescription>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "mt-2"
              )}
            >
              Get started
            </Link>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
